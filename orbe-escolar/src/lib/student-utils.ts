import type { Student } from '../types/student';

/**
 * Normaliza texto removendo acentos e padronizando para maiúsculas
 */
export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

/**
 * Normaliza digits removendo caracteres não numéricos
 */
export function normalizeDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Calcula distância de Levenshtein entre duas strings
 */
function levenshtein(left: string, right: string): number {
  const row = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    let previous = row[0];
    row[0] = leftIndex;
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const current = row[rightIndex];
      row[rightIndex] = Math.min(
        row[rightIndex] + 1,
        row[rightIndex - 1] + 1,
        previous + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1)
      );
      previous = current;
    }
  }
  return row[right.length];
}

/**
 * Busca aproximada (fuzzy match) que tolera letras faltando/sobrando
 */
function fuzzyMatch(value: string, query: string): boolean {
  const source = normalizeText(value);
  const target = normalizeText(query);
  if (!target) return false;
  if (source.includes(target)) return true;
  
  // Divide em palavras e verifica cada uma
  const words = source.split(" ");
  return target.split(" ").every((targetWord) => 
    words.some((word) => {
      // Para palavras curtas (< 3 chars), usa prefixo
      if (targetWord.length < 3) return word.startsWith(targetWord);
      
      // Usa Levenshtein para tolerar erros de digitação
      // Tolerância maior para palavras mais longas
      const tolerance = targetWord.length <= 5 ? 1 : 2;
      return levenshtein(word, targetWord) <= tolerance || 
             word.startsWith(targetWord.slice(0, Math.max(3, targetWord.length - 1)));
    })
  );
}

/**
 * Verifica se termo de busca corresponde a data de nascimento
 */
function birthMatches(student: Student, term: string): boolean {
  const digits = normalizeDigits(term);
  const [year, month, day] = student.dataNascimento.split("-");
  return digits.length === 8 
    ? `${day}${month}${year}` === digits 
    : digits.length === 6 && `${day}${month}${year.slice(-2)}` === digits;
}

/**
 * Verifica se aniversário é hoje
 */
function birthdayToday(student: Student, now: Date): boolean {
  const [, month, day] = student.dataNascimento.split("-").map(Number);
  return month === now.getMonth() + 1 && day === now.getDate();
}

/**
 * Verifica se a busca está pronta para ser executada
 */
export function isSearchReady(rawQuery: string): boolean {
  const query = rawQuery.trim();
  const normalized = normalizeText(query);
  if (!query) return false;
  if (normalized === "ANIVERSARIO") return true;
  if (/^\d{4,}$/.test(normalizeDigits(query))) return true;
  if (/^\d{2}\/\d{2}\/(\d{2}|\d{4})$/.test(query)) return true;
  const command = /^(MAE|RESP|SALA|PROF|AUX|TURNO|ANO|SERIE|NOTA)\s+(.+)$/i.exec(normalized);
  if (command) return command[2].trim().length >= 2;
  return normalized.replace(/\s/g, "").length >= 3;
}

/**
 * Realiza busca aproximada em alunos
 * Suporta busca por nome, responsável, anotações, sala, etc.
 */
export function searchStudents(students: Student[], rawQuery: string, now = new Date()): Student[] {
  const query = rawQuery.trim();
  const normalized = normalizeText(query);
  if (!isSearchReady(query)) return [];
  
  // Busca por aniversário do dia
  if (normalized === "ANIVERSARIO") return students.filter((student) => birthdayToday(student, now));
  
  // Busca por data específica
  if (/^\d{2}\/\d{2}\/(\d{2}|\d{4})$/.test(query)) 
    return students.filter((student) => birthMatches(student, query));
  
  // Busca com comando específico
  const command = /^(MAE|RESP|SALA|PROF|AUX|TURNO|ANO|SERIE|NOTA)\s+(.+)$/i.exec(normalized);
  if (command) {
    const [, prefix, value] = command;
    if (prefix === "MAE" || prefix === "RESP") 
      return students.filter((student) => fuzzyMatch(student.nomeResponsavel, value));
    if (prefix === "SALA") 
      return students.filter((student) => fuzzyMatch(student.sala, value));
    if (prefix === "PROF") 
      return students.filter((student) => fuzzyMatch(student.professora ?? "", value));
    if (prefix === "AUX") 
      return students.filter((student) => fuzzyMatch(student.auxiliar ?? "", value));
    if (prefix === "TURNO") 
      return students.filter((student) => fuzzyMatch(student.turno, value));
    if (prefix === "ANO" || prefix === "SERIE") 
      return students.filter((student) => fuzzyMatch(student.anoSerie, value));
    // Busca em anotações (condicaoEspecifica e retiradaAutorizada)
    return students.filter((student) => 
      fuzzyMatch(`${student.condicaoEspecifica ?? ""} ${student.retiradaAutorizada ?? ""}`, value)
    );
  }
  
  // Busca por números (telefone ou registro acadêmico)
  const digits = normalizeDigits(query);
  if (digits.length >= 4 && /^\d+$/.test(digits)) 
    return students.filter((student) => 
      normalizeDigits(student.telefoneResponsavel ?? "").includes(digits) || 
      normalizeDigits(student.registroAcademico ?? "").includes(digits)
    );
  
  // Busca aproximada por nome completo
  return students.filter((student) => fuzzyMatch(student.nomeCompleto, query));
}

/**
 * Retorna emoji de atenção se houver condição específica
 */
export function attentionEmoji(student: Student): string {
  const match = (student.condicaoEspecifica ?? "").match(/^[\p{Extended_Pictographic}\uFE0F\u200D]+/u);
  return match?.[0] ?? "";
}

/**
 * Paginação de resultados
 */
export function paginateStudents(students: Student[], page: number, perPage = 10): Student[] {
  return students.slice((page - 1) * perPage, page * perPage);
}

/**
 * Gera código único aleatório de 3 caracteres alfanuméricos
 */
export function generateUniqueCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 3; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Formata data ISO para DD/MM/AAAA
 */
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return year && month && day ? `${day}/${month}/${year}` : isoDate;
}

/**
 * Formata telefone brasileiro
 */
export function formatPhone(value: string): string {
  const digits = normalizeDigits(value).replace(/^55(?=\d{10,11}$)/, "");
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return value;
}
