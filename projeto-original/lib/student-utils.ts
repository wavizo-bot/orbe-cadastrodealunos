import type { Student } from "@/shared/student";

export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

export function normalizeDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function studentKey(student: Pick<Student, "nomeCompleto" | "dataNascimento">): string {
  return `${normalizeText(student.nomeCompleto)}|${student.dataNascimento}`;
}

export function calculateAge(isoDate: string, reference = new Date()): number | null {
  const birthDate = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(birthDate.getTime())) return null;
  let age = reference.getFullYear() - birthDate.getFullYear();
  if (reference.getMonth() < birthDate.getMonth() || (reference.getMonth() === birthDate.getMonth() && reference.getDate() < birthDate.getDate())) age -= 1;
  return age;
}

export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return year && month && day ? `${day}/${month}/${year}` : isoDate;
}

export function formatPhone(value: string): string {
  const digits = normalizeDigits(value).replace(/^55(?=\d{10,11}$)/, "");
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return value;
}

export function buildWhatsAppUrl(value: string): string | null {
  const digits = normalizeDigits(value);
  if (digits.length < 10) return null;
  return `https://wa.me/${digits.startsWith("55") ? digits : `55${digits}`}`;
}

function levenshtein(left: string, right: string): number {
  const row = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    let previous = row[0];
    row[0] = leftIndex;
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const current = row[rightIndex];
      row[rightIndex] = Math.min(row[rightIndex] + 1, row[rightIndex - 1] + 1, previous + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1));
      previous = current;
    }
  }
  return row[right.length];
}

function fuzzyMatch(value: string, query: string): boolean {
  const source = normalizeText(value);
  const target = normalizeText(query);
  if (!target) return false;
  if (source.includes(target)) return true;
  const words = source.split(" ");
  return target.split(" ").every((targetWord) => words.some((word) => {
    if (targetWord.length < 3) return word.startsWith(targetWord);
    return levenshtein(word, targetWord) <= (targetWord.length <= 5 ? 1 : 2) || word.startsWith(targetWord.slice(0, Math.max(3, targetWord.length - 1)));
  }));
}

function birthMatches(student: Student, term: string): boolean {
  const digits = normalizeDigits(term);
  const [year, month, day] = student.dataNascimento.split("-");
  return digits.length === 8 ? `${day}${month}${year}` === digits : digits.length === 6 && `${day}${month}${year.slice(-2)}` === digits;
}

function birthdayToday(student: Student, now: Date): boolean {
  const [, month, day] = student.dataNascimento.split("-").map(Number);
  return month === now.getMonth() + 1 && day === now.getDate();
}

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

export function searchStudents(students: Student[], rawQuery: string, now = new Date()): Student[] {
  const query = rawQuery.trim();
  const normalized = normalizeText(query);
  if (!isSearchReady(query)) return [];
  if (normalized === "ANIVERSARIO") return students.filter((student) => birthdayToday(student, now));
  if (/^\d{2}\/\d{2}\/(\d{2}|\d{4})$/.test(query)) return students.filter((student) => birthMatches(student, query));
  const command = /^(MAE|RESP|SALA|PROF|AUX|TURNO|ANO|SERIE|NOTA)\s+(.+)$/i.exec(normalized);
  if (command) {
    const [, prefix, value] = command;
    if (prefix === "MAE" || prefix === "RESP") return students.filter((student) => fuzzyMatch(student.nomeResponsavel, value));
    if (prefix === "SALA") return students.filter((student) => fuzzyMatch(student.sala, value));
    if (prefix === "PROF") return students.filter((student) => fuzzyMatch(student.professora ?? "", value));
    if (prefix === "AUX") return students.filter((student) => fuzzyMatch(student.auxiliar ?? "", value));
    if (prefix === "TURNO") return students.filter((student) => fuzzyMatch(student.turno, value));
    if (prefix === "ANO" || prefix === "SERIE") return students.filter((student) => fuzzyMatch(student.anoSerie, value));
    return students.filter((student) => fuzzyMatch(`${student.condicaoEspecifica ?? ""} ${student.retiradaAutorizada ?? ""}`, value));
  }
  const digits = normalizeDigits(query);
  if (digits.length >= 4 && /^\d+$/.test(digits)) return students.filter((student) => normalizeDigits(student.telefoneResponsavel ?? "").includes(digits) || normalizeDigits(student.registroAcademico ?? "").includes(digits));
  return students.filter((student) => fuzzyMatch(student.nomeCompleto, query));
}

export function attentionEmoji(student: Student): string {
  const match = (student.condicaoEspecifica ?? "").match(/^[\p{Extended_Pictographic}\uFE0F\u200D]+/u);
  return match?.[0] ?? "";
}

export function paginateStudents(students: Student[], page: number, perPage = 10): Student[] {
  return students.slice((page - 1) * perPage, page * perPage);
}
