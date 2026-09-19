import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AppProvider } from "@/lib/app-provider";
import { ThemeProvider } from "@/lib/theme-provider";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="menu" />
          <Stack.Screen name="search" />
          <Stack.Screen name="student/[id]" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="conference-filters" />
          <Stack.Screen name="conference-list" />
          <Stack.Screen name="database" options={{ presentation: "card" }} />
        </Stack>
      </AppProvider>
    </ThemeProvider>
  );
}
