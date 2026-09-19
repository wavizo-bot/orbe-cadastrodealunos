import CryptoJS from "crypto-js";
import { strFromU8, unzipSync } from "fflate";

import { parseImportPackage } from "@/lib/importer";
import type { ImportPackage, Student } from "@/shared/student";

const CDA_KEY = "GerencialEscolar.CDA.Offline.v1";

function wordArrayToU8(value: CryptoJS.lib.WordArray): Uint8Array {
  const bytes = new Uint8Array(value.sigBytes);
  for (let index = 0; index < value.sigBytes; index += 1) bytes[index] = (value.words[index >>> 2] >>> (24 - (index % 4) * 8)) & 0xff;
  return bytes;
}

export function parseCdaPackage(raw: string): ImportPackage {
  const envelope = JSON.parse(raw) as { formato?: string; versao?: number; payload?: string };
  if (envelope.formato !== "gerencial-escolar-cda" || envelope.versao !== 1 || typeof envelope.payload !== "string") throw new Error("O arquivo CDA é inválido ou não pertence a este aplicativo.");
  const decrypted = CryptoJS.AES.decrypt(envelope.payload, CDA_KEY);
  if (!decrypted.sigBytes) throw new Error("Não foi possível abrir o CDA. O arquivo pode estar danificado.");
  const files = unzipSync(wordArrayToU8(decrypted));
  if (!files["dados.json"]) throw new Error("O CDA não contém a base de dados esperada.");
  const data = parseImportPackage(strFromU8(files["dados.json"]));
  const students = data.alunos.map((student) => {
    const record = student as Student & { fotoArquivo?: string };
    const photo = record.fotoArquivo ? files[`fotos/${record.fotoArquivo}`] : undefined;
    return { ...student, fotoBase64: photo ? strFromU8(photo) : student.fotoBase64 };
  });
  return { ...data, alunos: students };
}

export function parseUpdatePackage(raw: string): ImportPackage {
  const possibleEnvelope = JSON.parse(raw) as { formato?: string };
  return possibleEnvelope.formato === "gerencial-escolar-cda" ? parseCdaPackage(raw) : parseImportPackage(raw);
}
