import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMemo, useState } from "react";
import { FlatList, Image, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router, type Href } from "expo-router";

import { AppFooter } from "@/components/app-footer";
import { ActionButton } from "@/components/action-button";
import { ScreenContainer } from "@/components/screen-container";
import { useAppData } from "@/lib/app-provider";
import { attentionEmoji, isSearchReady, paginateStudents, searchStudents } from "@/lib/student-utils";
import type { Student } from "@/shared/student";

const PAGE_SIZE = 10;
const RULES = [
  "Nome: use 3 ou mais caracteres. A pesquisa entende acentos, espaços e pequenas variações de escrita.",
  "mãe, mae ou resp: procura responsável. sala, prof, aux, turno, ano ou série procuram os campos correspondentes.",
  "nota: procura palavras nos avisos acima e abaixo da foto. aniversário mostra os nascidos no dia e mês de hoje.",
  "Quatro ou mais números procuram trecho de telefone ou registro acadêmico. Datas usam DD/MM/AAAA ou DD/MM/AA.",
];

export default function SearchScreen() {
  const { students, metadata, loading } = useAppData();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rulesVisible, setRulesVisible] = useState(false);
  const filteredStudents = useMemo(() => searchStudents(students, query), [query, students]);
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleStudents = useMemo(() => paginateStudents(filteredStudents, currentPage, PAGE_SIZE), [currentPage, filteredStudents]);
  const ready = isSearchReady(query);
  const updateQuery = (value: string) => { setQuery(value); setPage(1); };

  const renderStudent = ({ item }: { item: Student }) => (
    <Pressable onPress={() => router.push(`/student/${item.id}` as Href)} style={({ pressed }) => [styles.student, pressed && styles.pressed]}>
      <View style={styles.avatar}><MaterialIcons name="person" color="#0D5E77" size={24} /></View>
      <View style={styles.studentCopy}>
        <Text numberOfLines={1} style={styles.studentName}>{attentionEmoji(item) ? `${attentionEmoji(item)} ${item.nomeCompleto}` : item.nomeCompleto}</Text>
        <Text numberOfLines={1} style={styles.studentMeta}>{item.anoSerie} · Sala {item.sala} · {item.turno}</Text>
      </View>
      <MaterialIcons name="chevron-right" color="#7E8C99" size={28} />
    </Pressable>
  );

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-[#F5F7FA]">
      <FlatList
        data={ready ? visibleStudents : []}
        keyExtractor={(item) => item.id}
        renderItem={renderStudent}
        contentContainerStyle={styles.content}
        ListHeaderComponent={<View style={styles.header}>
          <View style={styles.top}><Pressable onPress={() => router.back()} style={styles.back}><MaterialIcons name="arrow-back" color="#12365A" size={23} /></Pressable><Text style={styles.title}>Buscar aluno</Text><View style={styles.back} /></View>
          <View style={styles.institutional}>{metadata?.logos?.central || metadata?.imagemInstitucionalBase64 ? <Image source={{ uri: metadata.logos?.central ?? metadata.imagemInstitucionalBase64 }} style={styles.centralLogo} resizeMode="contain" /> : metadata?.logos?.esquerda || metadata?.logos?.direita ? <View style={styles.sideLogos}>{metadata?.logos?.esquerda ? <Image source={{ uri: metadata.logos.esquerda }} style={styles.sideLogo} resizeMode="contain" /> : <View style={styles.sideLogo} />}{metadata?.logos?.direita ? <Image source={{ uri: metadata.logos.direita }} style={styles.sideLogo} resizeMode="contain" /> : <View style={styles.sideLogo} />}</View> : <Text style={styles.placeholder}>ESPAÇO INSTITUCIONAL</Text>}</View>
          <View style={styles.searchBox}><MaterialIcons name="search" size={22} color="#537087" /><TextInput value={query} onChangeText={updateQuery} placeholder="Pesquise nome, sala, responsável..." placeholderTextColor="#718091" autoCapitalize="none" style={styles.input} /><Pressable accessibilityLabel="Limpar pesquisa" onPress={() => updateQuery("")} style={styles.clear}>{query ? <MaterialIcons name="close" size={20} color="#537087" /> : null}</Pressable></View>
          <View style={styles.resultLine}><Text style={styles.resultTitle}>{ready ? "Resultados" : "Digite para pesquisar"}</Text><Text style={styles.resultCount}>{ready ? filteredStudents.length : ""}</Text></View>
        </View>}
        ListEmptyComponent={<View style={styles.empty}><MaterialIcons name={loading ? "hourglass-empty" : "search"} color="#7890A4" size={38} /><Text style={styles.emptyTitle}>{loading ? "Carregando dados…" : ready ? "Nenhum aluno encontrado" : "A pesquisa começa automaticamente"}</Text><Text style={styles.emptyText}>{ready ? "Tente outra regra ou outro trecho." : "Nomes exigem 3 caracteres; telefone e registro exigem 4 números."}</Text></View>}
        ListFooterComponent={<View>{filteredStudents.length > PAGE_SIZE && ready ? <View style={styles.pagination}><ActionButton label="ANTERIOR" onPress={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1} variant="secondary" style={styles.pageButton} /><Text style={styles.pageText}>{currentPage}/{totalPages}</Text><ActionButton label="PRÓXIMA" onPress={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={currentPage === totalPages} variant="secondary" style={styles.pageButton} /></View> : null}<Pressable onPress={() => setRulesVisible(true)} style={styles.rulesButton}><Text style={styles.rulesText}>REGRAS</Text></Pressable><AppFooter /></View>}
      />
      <Modal transparent visible={rulesVisible} animationType="fade" onRequestClose={() => setRulesVisible(false)}><View style={styles.modalOverlay}><View style={styles.modalCard}><Pressable onPress={() => setRulesVisible(false)} style={styles.closeRules}><Text style={styles.closeRulesText}>FECHAR</Text></Pressable><Text style={styles.modalTitle}>Regras de pesquisa</Text>{RULES.map((rule) => <Text key={rule} style={styles.rule}>• {rule}</Text>)}</View></View></Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 14, gap: 8, flexGrow: 1 }, header: { gap: 15, marginBottom: 10 }, top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, back: { height: 40, width: 40, alignItems: "center", justifyContent: "center", borderRadius: 20, backgroundColor: "#E5EEF6" }, title: { color: "#173449", fontSize: 19, fontWeight: "900" }, institutional: { minHeight: 96, backgroundColor: "#E7EDF3", borderRadius: 15, alignItems: "center", justifyContent: "center", overflow: "hidden" }, centralLogo: { width: "100%", height: 96 }, sideLogos: { width: "100%", height: 96, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, sideLogo: { width: "46%", height: 92 }, placeholder: { color: "#71869A", fontSize: 11, fontWeight: "800", letterSpacing: 1 }, searchBox: { flexDirection: "row", alignItems: "center", minHeight: 52, backgroundColor: "#FFFFFF", borderRadius: 13, borderColor: "#CFDAE4", borderWidth: 1, paddingLeft: 14, gap: 8 }, input: { flex: 1, paddingVertical: 11, color: "#16212C", fontSize: 15 }, clear: { width: 42, alignItems: "center", justifyContent: "center" }, resultLine: { flexDirection: "row", justifyContent: "space-between" }, resultTitle: { color: "#536779", fontWeight: "700" }, resultCount: { color: "#0D5E77", fontWeight: "900" }, student: { minHeight: 70, backgroundColor: "#FFFFFF", borderRadius: 13, borderColor: "#DEE7EF", borderWidth: 1, padding: 12, flexDirection: "row", alignItems: "center", gap: 11 }, avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#E2F4F7", alignItems: "center", justifyContent: "center" }, studentCopy: { flex: 1, gap: 3 }, studentName: { color: "#1A2C3D", fontSize: 15, fontWeight: "800" }, studentMeta: { color: "#5B6D7D", fontSize: 12 }, empty: { marginTop: 12, padding: 28, backgroundColor: "#FFFFFF", borderRadius: 16, alignItems: "center", gap: 8, borderColor: "#DEE7EF", borderWidth: 1 }, emptyTitle: { color: "#314454", fontSize: 16, fontWeight: "900", textAlign: "center" }, emptyText: { color: "#637484", fontSize: 13, lineHeight: 19, textAlign: "center" }, pagination: { flexDirection: "row", gap: 8, alignItems: "center", marginTop: 16 }, pageButton: { flex: 1 }, pageText: { color: "#526679", fontWeight: "800" }, rulesButton: { alignSelf: "flex-end", paddingVertical: 12, paddingHorizontal: 15, marginTop: 8 }, rulesText: { color: "#0D5E77", fontWeight: "900", fontSize: 12 }, modalOverlay: { flex: 1, backgroundColor: "rgba(12,31,45,0.45)", justifyContent: "center", padding: 22 }, modalCard: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 20, gap: 12 }, closeRules: { alignSelf: "center", paddingVertical: 8, paddingHorizontal: 16 }, closeRulesText: { color: "#0D5E77", fontWeight: "900", fontSize: 12 }, modalTitle: { color: "#173449", fontSize: 20, fontWeight: "900" }, rule: { color: "#465B6D", fontSize: 14, lineHeight: 20 }, pressed: { opacity: 0.78 },
});
