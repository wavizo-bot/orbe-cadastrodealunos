import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, type Href } from "expo-router";

import { AppFooter } from "@/components/app-footer";
import { ActionButton } from "@/components/action-button";
import { ScreenContainer } from "@/components/screen-container";
import { useAppData } from "@/lib/app-provider";
import type { ConferenceFilter } from "@/shared/student";

const emptyFilter: ConferenceFilter = { salas: [], anosSeries: [], turnos: [], professoras: [] };

function unique(values: string[]): string[] { return [...new Set(values.filter(Boolean))].sort((left, right) => left.localeCompare(right, "pt-BR")); }
function FilterGroup({ title, values, selected, onToggle }: { title: string; values: string[]; selected: string[]; onToggle: (value: string) => void }) {
  return <View style={styles.filterGroup}><Text style={styles.groupTitle}>{title}</Text><View style={styles.chips}>{values.map((value) => <Pressable key={value} onPress={() => onToggle(value)} style={({ pressed }) => [styles.chip, selected.includes(value) && styles.chipSelected, pressed && styles.pressed]}><Text style={[styles.chipText, selected.includes(value) && styles.chipTextSelected]}>{value}</Text></Pressable>)}</View></View>;
}

export default function ConferenceFiltersScreen() {
  const { students, conference, saveConference, clearConference } = useAppData();
  const [filter, setFilter] = useState<ConferenceFilter>(conference?.filter ?? emptyFilter);
  useEffect(() => { if (conference?.filter) setFilter(conference.filter); }, [conference?.filter]);
  const options = useMemo(() => ({ salas: unique(students.map((student) => student.sala)), anos: unique(students.map((student) => student.anoSerie)), turnos: unique(students.map((student) => student.turno)), professoras: unique(students.map((student) => student.professora ?? "")) }), [students]);
  const toggle = (key: keyof ConferenceFilter, value: string) => setFilter((current) => ({ ...current, [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value] }));
  const confirm = async () => { await saveConference({ filter, statuses: conference?.statuses ?? {}, updatedAt: new Date().toISOString() }); router.push("/conference-list" as Href); };
  const clear = async () => { setFilter(emptyFilter); await clearConference(); };
  return <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-[#F5F7FA]"><ScrollView contentContainerStyle={styles.content}>
    <View style={styles.top}><Pressable onPress={() => router.back()} style={styles.back}><MaterialIcons name="arrow-back" size={23} color="#12365A" /></Pressable><Text style={styles.title}>Conferir grupo</Text><Pressable accessibilityLabel="Limpar filtros" onPress={() => void clear()} style={styles.iconButton}><MaterialIcons name="delete-outline" size={22} color="#B03939" /></Pressable></View>
    <Text style={styles.intro}>Escolha uma ou mais opções por critério. As opções do mesmo critério usam “ou”; critérios diferentes usam “e”.</Text>
    <FilterGroup title="Sala" values={options.salas} selected={filter.salas} onToggle={(value) => toggle("salas", value)} />
    <FilterGroup title="Ano / série" values={options.anos} selected={filter.anosSeries} onToggle={(value) => toggle("anosSeries", value)} />
    <FilterGroup title="Turno" values={options.turnos} selected={filter.turnos} onToggle={(value) => toggle("turnos", value)} />
    <FilterGroup title="Professora" values={options.professoras} selected={filter.professoras} onToggle={(value) => toggle("professoras", value)} />
    <ActionButton label="CONFIRMAR FILTROS" onPress={() => void confirm()} />
    <AppFooter />
  </ScrollView></ScreenContainer>;
}

const styles = StyleSheet.create({ content: { padding: 18, paddingBottom: 26, gap: 18 }, top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, back: { height: 42, width: 42, borderRadius: 21, backgroundColor: "#E5EEF6", alignItems: "center", justifyContent: "center" }, iconButton: { height: 42, width: 42, borderRadius: 21, backgroundColor: "#FFF0F0", alignItems: "center", justifyContent: "center" }, title: { color: "#173449", fontSize: 19, fontWeight: "900" }, intro: { color: "#566A7A", fontSize: 14, lineHeight: 20 }, filterGroup: { backgroundColor: "#FFFFFF", padding: 16, borderRadius: 15, borderWidth: 1, borderColor: "#DCE7EF", gap: 10 }, groupTitle: { color: "#173449", fontSize: 14, fontWeight: "900" }, chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 }, chip: { paddingHorizontal: 12, minHeight: 36, borderRadius: 18, backgroundColor: "#EEF3F7", alignItems: "center", justifyContent: "center" }, chipSelected: { backgroundColor: "#0E7490" }, chipText: { color: "#486071", fontSize: 13, fontWeight: "700" }, chipTextSelected: { color: "#FFFFFF" }, pressed: { opacity: 0.75 },
});
