import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { router, type Href } from "expo-router";

import { AppFooter } from "@/components/app-footer";
import { ScreenContainer } from "@/components/screen-container";
import { useAppData } from "@/lib/app-provider";
import { attentionEmoji } from "@/lib/student-utils";
import type { ConferenceStatus, Student } from "@/shared/student";

function statusAfter(status: ConferenceStatus): ConferenceStatus { return status === "neutral" ? "checked" : status === "checked" ? "pending" : "neutral"; }
function matches(student: Student, filter: { salas: string[]; anosSeries: string[]; turnos: string[]; professoras: string[] }): boolean { return (!filter.salas.length || filter.salas.includes(student.sala)) && (!filter.anosSeries.length || filter.anosSeries.includes(student.anoSerie)) && (!filter.turnos.length || filter.turnos.includes(student.turno)) && (!filter.professoras.length || filter.professoras.includes(student.professora ?? "")); }

export default function ConferenceListScreen() {
  const { students, conference, saveConference, clearConference } = useAppData();
  const filtered = useMemo(() => conference ? students.filter((student) => matches(student, conference.filter)) : [], [conference, students]);
  const cycle = async (student: Student) => { if (!conference) return; const current = conference.statuses[student.id] ?? "neutral"; await saveConference({ ...conference, statuses: { ...conference.statuses, [student.id]: statusAfter(current) }, updatedAt: new Date().toISOString() }); };
  const resetColors = async () => { if (conference) await saveConference({ ...conference, statuses: {}, updatedAt: new Date().toISOString() }); };
  const discardGroup = async () => { await clearConference(); router.replace("/conference-filters" as Href); };
  return <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-[#F5F7FA]"><FlatList data={filtered} keyExtractor={(student) => student.id} contentContainerStyle={styles.content} ListHeaderComponent={<View style={styles.header}><View style={styles.top}><Pressable onPress={() => router.back()} style={styles.back}><MaterialIcons name="arrow-back" color="#12365A" size={23} /></Pressable><Text style={styles.title}>Lista de conferência</Text><View style={styles.actions}><Pressable accessibilityLabel="Limpar grupo" onPress={() => void discardGroup()} style={styles.action}><MaterialIcons name="delete-outline" color="#B03939" size={22} /></Pressable><Pressable accessibilityLabel="Neutralizar cores" onPress={() => void resetColors()} style={styles.action}><MaterialIcons name="restart-alt" color="#0D5E77" size={22} /></Pressable></View></View><Text style={styles.summary}>{filtered.length} aluno(s). Toque: neutro → verde → amarelo → neutro.</Text></View>} renderItem={({ item }) => { const status = conference?.statuses[item.id] ?? "neutral"; return <Pressable onPress={() => void cycle(item)} style={({ pressed }) => [styles.item, status === "checked" && styles.checked, status === "pending" && styles.pending, pressed && styles.pressed]}><Text style={styles.name}>{attentionEmoji(item) ? `${attentionEmoji(item)} ${item.nomeCompleto}` : item.nomeCompleto}</Text><Text style={styles.meta}>{item.anoSerie} · Sala {item.sala} · {item.turno}</Text></Pressable>; }} ListEmptyComponent={<View style={styles.empty}><Text>Nenhum filtro confirmado. Volte e escolha o grupo.</Text></View>} ListFooterComponent={<AppFooter />} /></ScreenContainer>;
}

const styles = StyleSheet.create({ content: { padding: 18, paddingBottom: 18, gap: 8, flexGrow: 1 }, header: { gap: 10, marginBottom: 7 }, top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, back: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#E5EEF6", alignItems: "center", justifyContent: "center" }, title: { color: "#173449", fontSize: 18, fontWeight: "900" }, actions: { flexDirection: "row", gap: 7 }, action: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#DCE7EF", alignItems: "center", justifyContent: "center" }, summary: { color: "#5E7283", fontSize: 13 }, item: { backgroundColor: "#FFFFFF", borderColor: "#DCE7EF", borderWidth: 1, borderRadius: 13, minHeight: 65, padding: 13, gap: 4 }, checked: { backgroundColor: "#DDF5E6", borderColor: "#93CBA7" }, pending: { backgroundColor: "#FFF2C9", borderColor: "#E7C96C" }, name: { color: "#203341", fontSize: 15, fontWeight: "900" }, meta: { color: "#5B6D7D", fontSize: 12 }, empty: { padding: 24, backgroundColor: "#FFFFFF", borderRadius: 15, alignItems: "center" }, pressed: { opacity: 0.75 },
});
