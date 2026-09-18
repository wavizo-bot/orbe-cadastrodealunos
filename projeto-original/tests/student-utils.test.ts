import { describe, expect, it } from "vitest";

import { buildWhatsAppUrl, calculateAge, formatPhone, paginateStudents, searchStudents, studentKey } from "@/lib/student-utils";
import type { Student } from "@/shared/student";

const students: Student[] = [
  { id: "1", nomeCompleto: "Ana Beatriz da Silva", nomeResponsavel: "Mariana", dataNascimento: "2016-08-21", anoSerie: "4º ano", sala: "12", turno: "Manhã" },
  { id: "2", nomeCompleto: "José Antônio", nomeResponsavel: "Paulo", dataNascimento: "2015-02-03", anoSerie: "5º ano", sala: "8", turno: "Tarde" },
  { id: "3", nomeCompleto: "Carla Souza", nomeResponsavel: "Rita", dataNascimento: "2017-04-15", anoSerie: "3º ano", sala: "4", turno: "Manhã" },
];

describe("utilitários de aluno", () => {
  it("pesquisa nomes sem diferenciar acentos ou caixa", () => {
    expect(searchStudents(students, "jose")).toEqual([students[1]]);
    expect(searchStudents(students, "ANA BEATRIZ")).toEqual([students[0]]);
  });

  it("calcula idade considerando se o aniversário já ocorreu", () => {
    expect(calculateAge("2016-08-21", new Date("2026-08-22T12:00:00"))).toBe(10);
    expect(calculateAge("2016-08-23", new Date("2026-08-22T12:00:00"))).toBe(9);
  });

  it("gera chave estável de atualização com nome normalizado e data", () => {
    expect(studentKey(students[1])).toBe("JOSE ANTONIO|2015-02-03");
  });

  it("limita a página de resultados ao intervalo solicitado", () => {
    expect(paginateStudents(students, 1, 2)).toEqual([students[0], students[1]]);
    expect(paginateStudents(students, 2, 2)).toEqual([students[2]]);
  });

  it("formata o telefone e cria o único link externo permitido, para WhatsApp", () => {
    expect(formatPhone("11912345678")).toBe("(11) 91234-5678");
    expect(buildWhatsAppUrl("(11) 91234-5678")).toBe("https://wa.me/5511912345678");
    expect(buildWhatsAppUrl(" ")).toBeNull();
  });
});
