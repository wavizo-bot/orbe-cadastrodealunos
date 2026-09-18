import { describe, expect, it } from "vitest";

import { mergeStudents, parseImportPackage } from "@/lib/importer";
import type { Student } from "@/shared/student";

const existing: Student = {
  id: "old-id",
  nomeCompleto: "Ana Beatriz da Silva",
  nomeResponsavel: "Responsável antigo",
  dataNascimento: "2016-08-21",
  anoSerie: "3º ano",
  sala: "1",
  turno: "Manhã",
};

const replacement: Student = {
  ...existing,
  id: "new-id",
  nomeCompleto: "ANA BEATRIZ DA SILVA",
  nomeResponsavel: "Responsável atualizado",
  anoSerie: "4º ano",
};

const newStudent: Student = {
  id: "other-id",
  nomeCompleto: "Bruno Costa",
  nomeResponsavel: "Célia Costa",
  dataNascimento: "2015-01-10",
  anoSerie: "5º ano",
  sala: "8",
  turno: "Tarde",
};

describe("importação da base", () => {
  it("substitui apenas o aluno com a mesma combinação de nome e nascimento", () => {
    const { students, result } = mergeStudents([existing], [replacement, newStudent]);
    expect(result).toEqual({ adicionados: 1, atualizados: 1, total: 2 });
    expect(students.find((student) => student.dataNascimento === "2016-08-21")?.nomeResponsavel).toBe("Responsável atualizado");
  });

  it("aceita o pacote compatível da versão administrativa", () => {
    const parsed = parseImportPackage(JSON.stringify({
      formato: "consulta-alunos-import",
      versao: 1,
      exportadoEm: "2026-08-22T12:00:00.000Z",
      origem: "Administrativo",
      alunos: [existing],
    }));
    expect(parsed.alunos).toHaveLength(1);
    expect(parsed.alunos[0].nomeCompleto).toBe(existing.nomeCompleto);
  });

  it("rejeita um arquivo que não segue o contrato", () => {
    expect(() => parseImportPackage(JSON.stringify({ formato: "outro", versao: 1, alunos: [] }))).toThrow("formato de importação");
  });
});
