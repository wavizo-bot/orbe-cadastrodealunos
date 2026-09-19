import Constants from "expo-constants";
import { StyleSheet, Text, View } from "react-native";

import { useAppData } from "@/lib/app-provider";

function formatDatabaseDate(value?: string): string {
  if (!value) return "dados de teste";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "dados importados";
  return `dados de ${date.toLocaleDateString("pt-BR")}`;
}

export function AppFooter() {
  const { metadata, students } = useAppData();
  const version = Constants.expoConfig?.version ?? "1.0.0";
  const databaseLabel = students.length === 0 ? "sem banco importado" : formatDatabaseDate(metadata?.bancoCriadoEm);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Este programa é uma gentileza do agente comunitário de saúde Maico. Contato 11 978831938 — versão {version} com {databaseLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  text: { color: "#7B8994", fontSize: 10, lineHeight: 14, textAlign: "center" },
});
