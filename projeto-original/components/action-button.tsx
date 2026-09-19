import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function ActionButton({ label, onPress, variant = "primary", disabled = false, style }: ActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.label, variant === "secondary" && styles.secondaryLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  primary: { backgroundColor: "#12365A" },
  secondary: { backgroundColor: "#E6EEF5", borderWidth: 1, borderColor: "#C3D3E3" },
  danger: { backgroundColor: "#B93838" },
  label: { color: "#FFFFFF", fontSize: 14, fontWeight: "800", letterSpacing: 0.4 },
  secondaryLabel: { color: "#12365A" },
  disabled: { opacity: 0.55 },
  pressed: { opacity: 0.86, transform: [{ scale: 0.98 }] },
});
