import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { useState } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";

import { ActionButton } from "@/components/action-button";
import { ScreenContainer } from "@/components/screen-container";
import { useAppData } from "@/lib/app-provider";
import { savePassword } from "@/lib/app-storage";
import { parseImportPackage } from "@/lib/importer";
import { isResetConfirmationValid } from "@/lib/reset-confirmation";
import { generatePassword } from "@/lib/security";

export default function DatabaseScreen() {
  const { students, importPackage, resetApp } = useAppData();
  const [busy, setBusy] = useState<"import" | "password" | "reset" | null>(null);
  const [resetVisible, setResetVisible] = useState(false);
  const [resetConfirmation, setResetConfirmation] = useState("");

  const importData = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/json", "text/json", "text/plain", "*/*"],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (result.canceled) {
        return;
      }
      setBusy("import");
      const asset = result.assets[0];
      const raw = await FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.UTF8 });
      const packageData = parseImportPackage(raw);
      const summary = await importPackage(packageData);
      Alert.alert("Importação concluída", `${summary.adicionados} novo(s), ${summary.atualizados} atualizado(s). Total: ${summary.total} aluno(s).`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível ler o arquivo selecionado.";
      Alert.alert("Importação não concluída", message);
    } finally {
      setBusy(null);
    }
  };

  const createPassword = async () => {
    try {
      setBusy("password");
      const password = await generatePassword();
      await savePassword(password);
      Alert.alert("Nova senha", `Anote a senha antes de fechar esta mensagem:\n\n${password}`, [{ text: "OK" }]);
    } finally {
      setBusy(null);
    }
  };

  const openResetConfirmation = () => {
    setResetConfirmation("");
    setResetVisible(true);
  };

  const performReset = async () => {
    try {
      setBusy("reset");
      await resetApp();
      setResetVisible(false);
      router.replace("/");
    } finally {
      setBusy(null);
    }
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-[#F5F7FA]">
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <Pressable accessibilityRole="button" accessibilityLabel="Voltar" onPress={() => router.back()} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <MaterialIcons name="arrow-back" color="#12365A" size={24} />
          </Pressable>
          <Text style={styles.title}>Banco de Dados</Text>
          <View style={styles.topSpacer} />
        </View>

        <View style={styles.summaryCard}>
          <MaterialIcons name="storage" size={30} color="#0E7490" />
          <View style={styles.summaryTextArea}>
            <Text style={styles.summaryTitle}>Base local</Text>
            <Text style={styles.summaryText}>{students.length} aluno(s) armazenado(s) neste aparelho.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ATUALIZAÇÃO</Text>
          <Text style={styles.sectionDescription}>Selecione o arquivo de dados produzido na versão administrativa do Windows. Registros com o mesmo nome e data de nascimento serão substituídos.</Text>
          <ActionButton label={busy === "import" ? "IMPORTANDO…" : "IMPORTAR"} onPress={() => void importData()} disabled={busy !== null} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACESSO</Text>
          <Text style={styles.sectionDescription}>Crie uma senha de quatro caracteres sem repetição para o acesso deste aparelho. Ela é mostrada uma única vez.</Text>
          <ActionButton label={busy === "password" ? "GERANDO…" : "GERAR SENHA"} onPress={() => void createPassword()} disabled={busy !== null} variant="secondary" />
        </View>

        <View style={styles.dangerSection}>
          <Text style={styles.dangerTitle}>REINICIALIZAÇÃO</Text>
          <Text style={styles.dangerDescription}>Apaga os alunos importados e retorna a senha inicial NGP1. Faça isso apenas quando quiser configurar o aparelho novamente.</Text>
          <ActionButton label={busy === "reset" ? "REINICIANDO…" : "REINICIAR"} onPress={openResetConfirmation} disabled={busy !== null} variant="danger" />
        </View>
        {busy ? <ActivityIndicator color="#12365A" style={styles.activity} /> : null}
      </ScrollView>

      <Modal animationType="fade" transparent visible={resetVisible} onRequestClose={() => setResetVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Confirmar exclusão da base</Text>
            <Text style={styles.modalDescription}>Esta ação apaga todos os alunos deste aparelho e restaura a senha inicial NGP1. Para continuar, digite exatamente CONFIRMO.</Text>
            <TextInput
              accessibilityLabel="Confirmação para excluir a base"
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={8}
              onChangeText={setResetConfirmation}
              placeholder="CONFIRMO"
              placeholderTextColor="#8A98A5"
              style={styles.confirmationInput}
              value={resetConfirmation}
            />
            <View style={styles.modalActions}>
              <ActionButton label="CANCELAR" onPress={() => setResetVisible(false)} variant="secondary" style={styles.modalAction} />
              <ActionButton label="APAGAR BASE" onPress={() => void performReset()} disabled={!isResetConfirmationValid(resetConfirmation) || busy !== null} variant="danger" style={styles.modalAction} />
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: 18, paddingBottom: 34, gap: 16 },
  topBar: { minHeight: 42, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#E5EEF6", justifyContent: "center", alignItems: "center" },
  title: { color: "#1A2C3D", fontWeight: "800", fontSize: 18 },
  topSpacer: { width: 42 },
  summaryCard: { flexDirection: "row", gap: 13, alignItems: "center", padding: 16, backgroundColor: "#EAF4F8", borderColor: "#CBE1EB", borderWidth: 1, borderRadius: 16 },
  summaryTextArea: { flex: 1, gap: 3 },
  summaryTitle: { color: "#174764", fontSize: 16, fontWeight: "800" },
  summaryText: { color: "#42627A", fontSize: 14, lineHeight: 20 },
  section: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 18, borderWidth: 1, borderColor: "#DCE7EF", gap: 12 },
  sectionTitle: { color: "#12365A", fontSize: 12, fontWeight: "900", letterSpacing: 1 },
  sectionDescription: { color: "#4D6070", fontSize: 14, lineHeight: 20 },
  dangerSection: { backgroundColor: "#FFF4F4", borderRadius: 16, padding: 18, borderWidth: 1, borderColor: "#F1CFCF", gap: 12 },
  dangerTitle: { color: "#953030", fontSize: 12, fontWeight: "900", letterSpacing: 1 },
  dangerDescription: { color: "#774747", fontSize: 14, lineHeight: 20 },
  activity: { marginTop: 4 },
  pressed: { opacity: 0.76 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(18, 35, 49, 0.48)", justifyContent: "center", padding: 22 },
  modalCard: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 21, gap: 14 },
  modalTitle: { color: "#7C2828", fontSize: 20, fontWeight: "900" },
  modalDescription: { color: "#4E5E6D", fontSize: 14, lineHeight: 21 },
  confirmationInput: { minHeight: 48, borderRadius: 10, borderColor: "#CFDAE4", borderWidth: 1, paddingHorizontal: 13, color: "#152A3C", fontSize: 16, fontWeight: "800", letterSpacing: 0.9 },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 2 },
  modalAction: { flex: 1 },
});
