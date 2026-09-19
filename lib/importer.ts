import { studentKey } from "@/lib/student-utils";
import type { ImportPackage, ImportResult, Student } from "@/shared/student";

const requiredFields: Array<keyof Student> = ["id", "nomeCompleto", "nomeResponsavel", "dataNascimento", "anoSerie", "sala", "turno"];
function isValidStudent(value: unknown): value is Student { if (!value || typeof value !== "object") return false; const student = value as Record<string, unknown>; return requiredFields.every((field) => typeof student[field] === "string" && student[field].trim().length > 0); }

export function parseImportPackage(raw: string): ImportPackage {
  const parsed = JSON.parse(raw) as Partial<ImportPackage>;
  if (parsed.formato !== "consulta-alunos-import" || (parsed.versao !== 1 && parsed.versao !== 2) || !Array.isArray(parsed.alunos) || !parsed.alunos.every(isValidStudent)) throw new Error("O arquivo não segue o formato de importação compatível.");
  return { formato: "consulta-alunos-import", versao: parsed.versao, exportadoEm: typeof parsed.exportadoEm === "string" ? parsed.exportadoEm : new Date().toISOString(), criadoEm: typeof parsed.criadoEm === "string" ? parsed.criadoEm : undefined, origem: typeof parsed.origem === "string" ? parsed.origem : "Origem não identificada", imagemInstitucionalBase64: typeof parsed.imagemInstitucionalBase64 === "string" ? parsed.imagemInstitucionalBase64 : undefined, logos: parsed.logos, alunos: parsed.alunos };
}

export function countDuplicates(existing: Student[], incoming: Student[]): number { const keys = new Set(existing.map(studentKey)); return incoming.filter((student) => keys.has(studentKey(student))).length; }

export function mergeStudents(existing: Student[], incoming: Student[]): { students: Student[]; result: ImportResult } {
  const indexByKey = new Map(existing.map((student, index) => [studentKey(student), index]));
  const merged = [...existing]; let adicionados = 0; let atualizados = 0;
  incoming.forEach((student) => { const key = studentKey(student); const currentIndex = indexByKey.get(key); if (currentIndex === undefined) { indexByKey.set(key, merged.length); merged.push(student); adicionados += 1; } else { merged[currentIndex] = student; atualizados += 1; } });
  return { students: merged.sort((left, right) => left.nomeCompleto.localeCompare(right.nomeCompleto, "pt-BR")), result: { adicionados, atualizados, total: merged.length } };
}
