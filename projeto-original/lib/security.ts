import * as Crypto from "expo-crypto";

const PASSWORD_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
const ACTIVATION_SALT = "CDA-ATIVACAO-2026";
const TEMPORARY_PASSWORD_CUTOFF = new Date(2026, 8, 20, 0, 0, 0, 0);

function positionInAlphabet(character: string): number | null { if (/^[A-Z]$/.test(character)) return character.charCodeAt(0) - 65; if (/^[1-9]$/.test(character)) return Number(character) - 1; return null; }
function hasSequentialPair(value: string): boolean { for (let index = 1; index < value.length; index += 1) { const previous = value[index - 1]; const current = value[index]; const a = positionInAlphabet(previous); const b = positionInAlphabet(current); const sameClass = (/[A-Z]/.test(previous) && /[A-Z]/.test(current)) || (/[1-9]/.test(previous) && /[1-9]/.test(current)); if (sameClass && a !== null && b !== null && Math.abs(a - b) === 1) return true; } return false; }
function passwordFromNumbers(numbers: number[]): string { const available = PASSWORD_ALPHABET.split(""); const chosen: string[] = []; let offset = 0; while (chosen.length < 4 && offset < numbers.length * 4) { const candidate = available.splice(numbers[offset % numbers.length] % available.length, 1)[0]; if (!hasSequentialPair(`${chosen.join("")}${candidate}`)) chosen.push(candidate); offset += 1; } return chosen.join(""); }
async function digest(text: string): Promise<string> { return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, text); }

export async function generatePassword(): Promise<string> { for (;;) { const password = passwordFromNumbers(Array.from(await Crypto.getRandomBytesAsync(32))); if (password.length === 4 && new Set(password).size === 4 && !hasSequentialPair(password)) return password; } }
export async function generateChoiceBoard(password: string, position: number): Promise<{ choices: string[]; correctIndex: number }> { const target = password[position]; const bytes = await Crypto.getRandomBytesAsync(64); const decoys = PASSWORD_ALPHABET.split("").filter((character) => !password.includes(character)); const selected = [target]; let cursor = 0; while (selected.length < 12) { selected.push(decoys.splice(bytes[cursor % bytes.length] % decoys.length, 1)[0]); cursor += 1; } for (let index = selected.length - 1; index > 0; index -= 1) { const swap = bytes[cursor % bytes.length] % (index + 1); [selected[index], selected[swap]] = [selected[swap], selected[index]]; cursor += 1; } return { choices: [0, 1, 2, 3].map((group) => selected.slice(group * 3, group * 3 + 3).join("")), correctIndex: Math.floor(selected.indexOf(target) / 3) }; }
export async function generateRecoveryChoiceBoard(passwords: string[], position: number): Promise<string[]> { const bytes = await Crypto.getRandomBytesAsync(64); const required = [...new Set(passwords.map((password) => password[position]).filter(Boolean))]; const available = PASSWORD_ALPHABET.split("").filter((character) => !required.includes(character)); const selected = [...required]; let cursor = 0; while (selected.length < 12) { selected.push(available.splice(bytes[cursor % bytes.length] % available.length, 1)[0]); cursor += 1; } for (let index = selected.length - 1; index > 0; index -= 1) { const swap = bytes[cursor % bytes.length] % (index + 1); [selected[index], selected[swap]] = [selected[swap], selected[index]]; cursor += 1; } return [0, 1, 2, 3].map((group) => selected.slice(group * 3, group * 3 + 3).join("")); }

export function validateCpf(value: string): boolean {
  const cpf = value.replace(/\D/g, "");
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;
  const digit = (length: number): number => { const sum = cpf.slice(0, length).split("").reduce((total, character, index) => total + Number(character) * (length + 1 - index), 0); const result = (sum * 10) % 11; return result === 10 ? 0 : result; };
  return digit(9) === Number(cpf[9]) && digit(10) === Number(cpf[10]);
}

export function temporaryPasswordAvailable(installedAt: string, now = new Date()): boolean { const expiry = new Date(new Date(installedAt).getTime() + 10 * 24 * 60 * 60 * 1000); return now < TEMPORARY_PASSWORD_CUTOFF && now < expiry; }
export function isLicenseValid(expiry?: string, now = new Date()): boolean { return Boolean(expiry && new Date(expiry).getTime() > now.getTime()); }
export async function getRecoveryActivationCode(cpf: string, installationId: string, now = new Date()): Promise<string> { const date = now.toISOString().slice(0, 10); const source = await digest(`CDA-RECOVERY|${cpf.replace(/\D/g, "")}|${installationId}|${date}`); const alphabet = PASSWORD_ALPHABET; return Array.from({ length: 8 }, (_, index) => alphabet[Number.parseInt(source.slice(index * 2, index * 2 + 2), 16) % alphabet.length]).join(""); }
export async function passwordForRecovery(cpf: string, activationCode: string, months: number): Promise<string> { const source = await digest(`${ACTIVATION_SALT}|${cpf.replace(/\D/g, "")}|${activationCode.trim().toUpperCase()}|${months}`); return passwordFromNumbers(Array.from(source.matchAll(/[0-9A-F]{2}/g)).map((match) => Number.parseInt(match[0], 16))); }
export function expiryForMonths(months: number, now = new Date()): string { const expiry = new Date(now); expiry.setMonth(expiry.getMonth() + months); return expiry.toISOString(); }

export function activationPeriod(date = new Date()): string | null { const month = date.getMonth() + 1; return date.getDate() === 1 && [1, 4, 7, 11].includes(month) ? `${date.getFullYear()}${String(month).padStart(2, "0")}` : null; }
export async function getActivationCode(installationId: string, date = new Date()): Promise<string | null> { const period = activationPeriod(date); if (!period) return null; const source = await digest(`CDA-CODIGO|${installationId}|${period}`); return `ATV-${period}-${source.slice(0, 6).toUpperCase()}`; }
export async function passwordForActivationCode(activationCode: string): Promise<string> { const source = await digest(`${ACTIVATION_SALT}|${activationCode.trim().toUpperCase()}`); return passwordFromNumbers(Array.from(source.matchAll(/[0-9A-F]{2}/g)).map((match) => Number.parseInt(match[0], 16))); }
