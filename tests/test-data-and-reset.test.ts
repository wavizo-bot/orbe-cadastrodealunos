import { describe, expect, it } from "vitest";

import { isResetConfirmationValid } from "@/lib/reset-confirmation";
import { SAMPLE_STUDENTS } from "@/lib/sample-students";

describe("versão de testes", () => {
  it("fornece 300 perfis explicitamente fictícios", () => {
    expect(SAMPLE_STUDENTS).toHaveLength(300);
    expect(SAMPLE_STUDENTS.every((student) => student.nomeCompleto.includes("TESTE"))).toBe(true);
    expect(SAMPLE_STUDENTS.every((student) => Boolean(student.telefoneResponsavel))).toBe(true);
    expect(SAMPLE_STUDENTS.filter((student) => student.condicaoEspecifica === "🩺 Austimo")).toHaveLength(15);
    expect(SAMPLE_STUDENTS.filter((student) => student.retiradaAutorizada === "🚐 Aguardar van")).toHaveLength(60);
  });

  it("aceita a exclusão somente com a confirmação textual exata", () => {
    expect(isResetConfirmationValid("CONFIRMO")).toBe(true);
    expect(isResetConfirmationValid("confirmo")).toBe(false);
    expect(isResetConfirmationValid("CONFIRMO ")).toBe(false);
    expect(isResetConfirmationValid("")).toBe(false);
  });
});
