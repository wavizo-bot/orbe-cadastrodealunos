import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";

import { AppFooter } from "@/components/app-footer";
import { ScreenContainer } from "@/components/screen-container";
import { useAppData } from "@/lib/app-provider";
import { buildWhatsAppUrl, calculateAge, formatDate, formatPhone } from "@/lib/student-utils";

function Detail({ icon, label, value }: { icon: "family-restroom" | "cake"; label: string; value: string }) {
  return <View style={styles.detail}><View style={styles.detailIcon}><MaterialIcons name={icon} size={20} color="#1A587E" /></View><View style={styles.detailCopy}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View></View>;
}

export default function StudentProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { students } = useAppData();
  const student = students.find((item) => item.id === id);
  if (!student) return <ScreenContainer edges={["top", "bottom", "left", "right"]} className="items-center justify-center p-6"><Text>Aluno não encontrado.</Text><Pressable onPress={() => router.back()}><Text style={styles.returnText}>Voltar</Text></Pressable></ScreenContainer>;

  const age = calculateAge(student.dataNascimento);
  const whatsapp = student.telefoneResponsavel ? buildWhatsAppUrl(student.telefoneResponsavel) : null;
  const openWhatsApp = async () => { if (!whatsapp) return; try { await Linking.openURL(whatsapp); } catch { Alert.alert("Não foi possível abrir o WhatsApp"); } };
  const photoSource = student.fotoTeste ? require("../../assets/images/fototestedealuno.jpeg") : student.fotoBase64 ? { uri: student.fotoBase64 } : null;

  return <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-[#F5F7FA]"><ScrollView contentContainerStyle={styles.content}>
    <View style={styles.top}><Pressable onPress={() => router.back()} style={styles.back}><MaterialIcons name="arrow-back" size={23} color="#12365A" /></Pressable><Text style={styles.title}>Perfil do aluno</Text><View style={styles.back} /></View>
    {student.condicaoEspecifica ? <View style={styles.warningBand}><Text style={styles.warningText}>{student.condicaoEspecifica}</Text></View> : null}
    <View style={styles.header}><View style={styles.photoFrame}>{photoSource ? <Image source={photoSource} style={styles.photo} resizeMode="cover" /> : <MaterialIcons name="person" size={74} color="#6C8598" />}</View><Text style={styles.name}>{student.nomeCompleto}</Text></View>
    {student.retiradaAutorizada ? <View style={styles.noteBand}><Text style={styles.noteText}>{student.retiradaAutorizada}</Text></View> : null}
    <View style={styles.card}>
      <Detail icon="family-restroom" label="Responsável" value={student.nomeResponsavel} />
      {student.telefoneResponsavel ? <><View style={styles.divider} /><View style={styles.phoneRow}><View style={styles.detailIcon}><MaterialIcons name="phone" size={20} color="#1A587E" /></View><View style={styles.detailCopy}><Text style={styles.label}>Telefone</Text><Text style={styles.value}>{formatPhone(student.telefoneResponsavel)}</Text></View>{whatsapp ? <Pressable onPress={() => void openWhatsApp()} accessibilityLabel="Abrir conversa no WhatsApp" style={({ pressed }) => [styles.whatsapp, pressed && styles.pressed]}><MaterialIcons name="chat" color="#FFFFFF" size={20} /></Pressable> : null}</View></> : null}
      <View style={styles.divider} /><Detail icon="cake" label="Nascimento" value={`${formatDate(student.dataNascimento)}${age === null ? "" : ` (${age} anos)`}`} />
      <View style={styles.divider} /><View style={styles.pairRow}><View style={styles.pairSide}><Text style={styles.label}>Ano / série</Text><Text style={styles.value}>{student.anoSerie}</Text></View><View style={[styles.pairSide, styles.alignRight]}><Text style={styles.label}>Sala</Text><Text style={styles.value}>{student.sala}</Text></View></View>
      <View style={styles.divider} /><View style={styles.pairRow}><View style={styles.pairSide}><Text style={styles.label}>Turno</Text><Text style={styles.value}>{student.turno}</Text></View><View style={[styles.pairSide, styles.alignRight]}><Text style={styles.label}>Professora / Auxiliar</Text><Text numberOfLines={2} style={styles.value}>{[student.professora, student.auxiliar].filter(Boolean).join(" / ") || "—"}</Text></View></View>
    </View>
    <AppFooter />
  </ScrollView></ScreenContainer>;
}

const styles = StyleSheet.create({
  content: { padding: 18, paddingBottom: 28, gap: 13 }, top: { minHeight: 42, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, back: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#E5EEF6", alignItems: "center", justifyContent: "center" }, title: { color: "#1A2C3D", fontSize: 18, fontWeight: "900" }, warningBand: { padding: 14, borderRadius: 14, backgroundColor: "#FFF0C9", borderWidth: 1, borderColor: "#EAC777" }, warningText: { color: "#734A08", fontSize: 14, fontWeight: "700", lineHeight: 20 }, header: { alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 18, borderColor: "#DCE7EF", borderWidth: 1, padding: 21, gap: 13 }, photoFrame: { width: 144, height: 144, borderRadius: 72, overflow: "hidden", backgroundColor: "#E8EFF4", borderWidth: 3, borderColor: "#D6E1EA", alignItems: "center", justifyContent: "center" }, photo: { width: "100%", height: "100%" }, name: { color: "#152A3C", fontSize: 23, lineHeight: 29, fontWeight: "900", textAlign: "center" }, noteBand: { padding: 14, borderRadius: 14, backgroundColor: "#EAF0F5", borderColor: "#D3DFE8", borderWidth: 1 }, noteText: { color: "#3D5364", fontSize: 14, fontWeight: "700", lineHeight: 20 }, card: { backgroundColor: "#FFFFFF", borderRadius: 18, borderColor: "#DCE7EF", borderWidth: 1, paddingHorizontal: 17 }, detail: { paddingVertical: 14, flexDirection: "row", gap: 11, alignItems: "center" }, phoneRow: { paddingVertical: 14, flexDirection: "row", gap: 11, alignItems: "center" }, detailIcon: { width: 35, height: 35, borderRadius: 18, backgroundColor: "#E8F1F8", alignItems: "center", justifyContent: "center" }, detailCopy: { flex: 1, gap: 3 }, label: { color: "#667989", fontSize: 11, fontWeight: "700" }, value: { color: "#253847", fontSize: 15, lineHeight: 20, fontWeight: "800" }, divider: { height: 1, backgroundColor: "#E7EDF2" }, whatsapp: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#208B4E", alignItems: "center", justifyContent: "center" }, pairRow: { minHeight: 64, paddingVertical: 13, flexDirection: "row", gap: 12 }, pairSide: { flex: 1, gap: 3 }, alignRight: { alignItems: "flex-end", textAlign: "right" }, pressed: { opacity: 0.75 }, returnText: { color: "#12365A", marginTop: 15, fontWeight: "800" },
});
