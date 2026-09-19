import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router, type Href } from "expo-router";

import { AppFooter } from "@/components/app-footer";
import { ScreenContainer } from "@/components/screen-container";

const options: Array<{ label: string; subtitle: string; icon: "search" | "fact-check" | "settings"; route: Href }> = [
  { label: "Buscar aluno", subtitle: "Pesquisa rápida e informações do perfil", icon: "search", route: "/search" as Href },
  { label: "Conferir grupo", subtitle: "Filtros, chamada e estados de presença", icon: "fact-check", route: "/conference-filters" as Href },
  { label: "Dados e acesso", subtitle: "Importação, senha e configurações locais", icon: "settings", route: "/settings" as Href },
];

export default function MenuScreen() {
  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-[#F5F7FA]">
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.brandMark}><Text style={styles.brandText}>GE</Text></View>
          <Text style={styles.title}>Gerencial Escolar</Text>
          <Text style={styles.subtitle}>Escolha uma atividade</Text>
        </View>
        <View style={styles.optionList}>
          {options.map((option) => (
            <Pressable key={option.label} onPress={() => router.push(option.route)} style={({ pressed }) => [styles.option, pressed && styles.pressed]}>
              <View style={styles.optionIcon}><MaterialIcons name={option.icon} size={27} color="#0D5E77" /></View>
              <View style={styles.optionCopy}>
                <Text style={styles.optionLabel}>{option.label}</Text>
                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={28} color="#6C8296" />
            </Pressable>
          ))}
        </View>
        <View style={styles.spacer} />
        <AppFooter />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  hero: { alignItems: "center", gap: 6, paddingTop: 22, paddingBottom: 28 },
  brandMark: { height: 64, width: 64, borderRadius: 20, backgroundColor: "#0E7490", alignItems: "center", justifyContent: "center", marginBottom: 6 },
  brandText: { color: "#FFFFFF", fontSize: 20, fontWeight: "900", letterSpacing: 0.8 },
  title: { color: "#163047", fontSize: 27, fontWeight: "900" },
  subtitle: { color: "#617386", fontSize: 15 },
  optionList: { gap: 12 },
  option: { minHeight: 88, padding: 14, borderRadius: 16, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#D8E4ED", flexDirection: "row", alignItems: "center", gap: 13 },
  optionIcon: { height: 48, width: 48, borderRadius: 15, backgroundColor: "#E2F4F7", alignItems: "center", justifyContent: "center" },
  optionCopy: { flex: 1, gap: 4 },
  optionLabel: { color: "#173449", fontSize: 18, fontWeight: "900" },
  optionSubtitle: { color: "#617386", fontSize: 13, lineHeight: 18 },
  spacer: { flex: 1 },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
});
