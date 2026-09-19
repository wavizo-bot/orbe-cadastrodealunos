import { beforeEach, describe, expect, it, vi } from "vitest";

const cryptoMock = vi.hoisted(() => ({
  getRandomBytesAsync: vi.fn(),
  digestStringAsync: vi.fn(),
  CryptoDigestAlgorithm: { SHA256: "SHA-256" },
}));

vi.mock("expo-crypto", () => cryptoMock);

import { activationPeriod, generateChoiceBoard, generatePassword, getActivationCode, passwordForActivationCode } from "@/lib/security";

describe("segurança de acesso", () => {
  beforeEach(() => {
    cryptoMock.getRandomBytesAsync.mockResolvedValue(new Uint8Array(Array.from({ length: 64 }, (_, index) => (index * 17 + 11) % 256)));
    cryptoMock.digestStringAsync.mockResolvedValue("A1B2C3D4E5F60718293A4B5C6D7E8F90A1B2C3D4E5F60718293A4B5C6D7E8F90");
  });

  it("gera senha de quatro caracteres sem repetição", async () => {
    const password = await generatePassword();
    expect(password).toMatch(/^[A-Z1-9]{4}$/);
    expect(new Set(password).size).toBe(4);
  });

  it("posiciona um único caractere correto no painel de quatro escolhas", async () => {
    const password = "A7QM";
    const board = await generateChoiceBoard(password, 1);
    expect(board.choices).toHaveLength(4);
    expect(board.choices.flatMap((choice) => choice.split("")).filter((character) => character === "7")).toHaveLength(1);
    expect(board.choices[board.correctIndex]).toContain("7");
    expect(new Set(board.choices.join("")).size).toBe(12);
  });

  it("identifica somente as datas trimestrais de ativação", () => {
    expect(activationPeriod(new Date("2026-01-01T12:00:00"))).toBe("202601");
    expect(activationPeriod(new Date("2026-07-01T12:00:00"))).toBe("202607");
    expect(activationPeriod(new Date("2026-08-01T12:00:00"))).toBeNull();
  });

  it("produz código de ativação e senha compatível", async () => {
    const code = await getActivationCode("instalacao-1", new Date("2026-11-01T12:00:00"));
    expect(code).toMatch(/^ATV-202611-[A-F0-9]{6}$/);
    await expect(passwordForActivationCode(code ?? "")).resolves.toMatch(/^[A-Z1-9]{4}$/);
  });
});
