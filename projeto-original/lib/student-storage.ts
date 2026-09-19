import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system/legacy";

import type { Student } from "@/shared/student";

const WEB_STORAGE_KEY = "consulta-alunos.alunos.v1";
const DATA_FILE = `${FileSystem.documentDirectory ?? ""}consulta-alunos-base-v1.json`;

export async function loadStudents(): Promise<Student[]> {
  if (Platform.OS === "web") {
    const raw = await AsyncStorage.getItem(WEB_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Student[]) : [];
  }

  const info = await FileSystem.getInfoAsync(DATA_FILE);
  if (!info.exists) {
    return [];
  }

  const raw = await FileSystem.readAsStringAsync(DATA_FILE, {
    encoding: FileSystem.EncodingType.UTF8,
  });
  return JSON.parse(raw) as Student[];
}

export async function saveStudents(students: Student[]): Promise<void> {
  const raw = JSON.stringify(students);
  if (Platform.OS === "web") {
    await AsyncStorage.setItem(WEB_STORAGE_KEY, raw);
    return;
  }

  await FileSystem.writeAsStringAsync(DATA_FILE, raw, {
    encoding: FileSystem.EncodingType.UTF8,
  });
}

export async function clearStudents(): Promise<void> {
  if (Platform.OS === "web") {
    await AsyncStorage.removeItem(WEB_STORAGE_KEY);
    return;
  }

  const info = await FileSystem.getInfoAsync(DATA_FILE);
  if (info.exists) {
    await FileSystem.deleteAsync(DATA_FILE, { idempotent: true });
  }
}
