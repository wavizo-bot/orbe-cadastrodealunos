import CryptoJS from "crypto-js";
import { strToU8, zipSync } from "fflate";
import { describe, expect, it } from "vitest";

import { parseCdaPackage } from "@/lib/cda-package";
import { SAMPLE_STUDENTS } from "@/lib/sample-students";
import { isSearchReady, searchStudents } from "@/lib/student-utils";

const CDA_KEY = "GerencialEscolar.CDA.Offline.v1";

function wordArrayToU8(value: CryptoJS.lib.WordArray): Uint8Array {
  const bytes = new Uint8Array(value.sigBytes);
  for (let index = 0; index < value.sigBytes; index += 1) bytes[index] = (value.words[index >>> 2] >>> (24 - (index % 4) * 8)) & 0xff;
  return bytes;
}

describe("pesquisa avançada", () => {
  it("respeita limites mínimos e entende comandos aprovados", () => {
    expect(isSearchReady("An")).toBe(false);
    expect(isSearchReady("Ana")).toBe(true);
    expect(isSearchReady("NA00")).toBe(true);
    expect(searchStudents(SAMPLE_STUDENTS, "aux Aline").length).toBeGreaterThan(0);
    expect(searchStudents(SAMPLE_STUDENTS, "resp Fictício 001").length).toBeGreaterThan(0);
    expect(searchStudents(SAMPLE_STUDENTS, "nota Austimo").length).toBe(15);
  });
});

describe("pacote CDA", () => {
  it("recupera dados e foto vinculada pelo registro acadêmico", () => {
    const student = { ...SAMPLE_STUDENTS[0], fotoBase64: undefined, fotoTeste: undefined };
    const data = JSON.stringify({ formato: "consulta-alunos-import", versao: 2, exportadoEm: "2026-08-25T12:00:00.000Z", criadoEm: "2026-08-25T12:00:00.000Z", origem: "teste", alunos: [{ ...student, fotoArquivo: `${student.registroAcademico}.jpg` }] });
    const zip = zipSync({ "dados.json": strToU8(data), [`fotos/${student.registroAcademico}.jpg`]: strToU8("data:image/jpeg;base64,TESTE") });
    const envelope = JSON.stringify({ formato: "gerencial-escolar-cda", versao: 1, payload: CryptoJS.AES.encrypt(CryptoJS.lib.WordArray.create(zip), CDA_KEY).toString() });
    const parsed = parseCdaPackage(envelope);
    expect(parsed.alunos[0].fotoBase64).toBe("data:image/jpeg;base64,TESTE");
    expect(parsed.criadoEm).toBe("2026-08-25T12:00:00.000Z");
  });
});
