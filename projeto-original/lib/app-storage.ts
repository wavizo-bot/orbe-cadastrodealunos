import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

import type { AppMetadata, ConferenceState } from "@/shared/student";

const METADATA_KEY = "consulta-alunos.metadados.v1";
const PASSWORD_KEY = "consulta-alunos.senha.v1";
const WEB_PASSWORD_KEY = "consulta-alunos.senha.web.v1";
const SAMPLE_DATA_INSTALLED_KEY = "consulta-alunos.amostra-instalada.v1";
const CONFERENCE_STATE_KEY = "consulta-alunos.conferencia.v1";
export const INITIAL_PASSWORD = "NGP1";

async function readPassword(): Promise<string | null> {
  if (Platform.OS === "web") {
    return AsyncStorage.getItem(WEB_PASSWORD_KEY);
  }
  return SecureStore.getItemAsync(PASSWORD_KEY);
}

async function writePassword(password: string): Promise<void> {
  if (Platform.OS === "web") {
    await AsyncStorage.setItem(WEB_PASSWORD_KEY, password);
    return;
  }
  await SecureStore.setItemAsync(PASSWORD_KEY, password);
}

async function deletePassword(): Promise<void> {
  if (Platform.OS === "web") {
    await AsyncStorage.removeItem(WEB_PASSWORD_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(PASSWORD_KEY);
}

export async function getMetadata(): Promise<AppMetadata> {
  const raw = await AsyncStorage.getItem(METADATA_KEY);
  if (raw) {
    const parsed = JSON.parse(raw) as Partial<AppMetadata>;
    return {
      instaladoEm: parsed.instaladoEm ?? new Date().toISOString(),
      identificadorInstalacao: parsed.identificadorInstalacao ?? Crypto.randomUUID(),
      aberturasNaTelaDeAcesso: parsed.aberturasNaTelaDeAcesso ?? 0,
      imagemInstitucionalBase64: parsed.imagemInstitucionalBase64,
      logos: parsed.logos,
      bancoCriadoEm: parsed.bancoCriadoEm,
      bancoOrigem: parsed.bancoOrigem,
      falhasDeSenha: parsed.falhasDeSenha ?? 0,
      exigeAtivacao: parsed.exigeAtivacao ?? false,
      licencaExpiraEm: parsed.licencaExpiraEm,
    };
  }

  const metadata: AppMetadata = {
    instaladoEm: new Date().toISOString(),
    identificadorInstalacao: Crypto.randomUUID(),
    aberturasNaTelaDeAcesso: 0,
    falhasDeSenha: 0,
    exigeAtivacao: false,
  };
  await AsyncStorage.setItem(METADATA_KEY, JSON.stringify(metadata));
  return metadata;
}

export async function saveMetadata(metadata: AppMetadata): Promise<void> {
  await AsyncStorage.setItem(METADATA_KEY, JSON.stringify(metadata));
}

export async function getPassword(): Promise<string> {
  const stored = await readPassword();
  if (stored) {
    return stored;
  }
  await writePassword(INITIAL_PASSWORD);
  return INITIAL_PASSWORD;
}

export async function savePassword(password: string): Promise<void> {
  await writePassword(password);
}

export async function resetConfiguration(): Promise<void> {
  await deletePassword();
  await AsyncStorage.multiRemove([METADATA_KEY, CONFERENCE_STATE_KEY]);
}

export async function hasInstalledSampleData(): Promise<boolean> {
  return (await AsyncStorage.getItem(SAMPLE_DATA_INSTALLED_KEY)) === "true";
}

export async function markSampleDataAsInstalled(): Promise<void> {
  await AsyncStorage.setItem(SAMPLE_DATA_INSTALLED_KEY, "true");
}

export async function getConferenceState(): Promise<ConferenceState | null> {
  const raw = await AsyncStorage.getItem(CONFERENCE_STATE_KEY);
  return raw ? (JSON.parse(raw) as ConferenceState) : null;
}

export async function saveConferenceState(state: ConferenceState): Promise<void> {
  await AsyncStorage.setItem(CONFERENCE_STATE_KEY, JSON.stringify(state));
}

export async function clearConferenceState(): Promise<void> {
  await AsyncStorage.removeItem(CONFERENCE_STATE_KEY);
}

export function shouldSuggestPasswordChange(metadata: AppMetadata, now = new Date()): boolean {
  const installedAt = new Date(metadata.instaladoEm).getTime();
  const withinTwoDays = now.getTime() - installedAt < 2 * 24 * 60 * 60 * 1000;
  return withinTwoDays && metadata.aberturasNaTelaDeAcesso > 0 && metadata.aberturasNaTelaDeAcesso % 3 === 0;
}
