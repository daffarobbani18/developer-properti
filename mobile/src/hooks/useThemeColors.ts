// [UI-FIX-V2] Remediation based on design-spec + audit — SIMDP Mobile v1.1
import { useColorScheme } from "react-native";

export const lightColors = {
  primary: "#1a6d78",
  background: "#ffffff",
  surface: "#f9fafb",
  secondary: "#6b7280",
  text: "#1f2937",
  textSecondary: "#4b5563",
  border: "#e5e7eb",
};

export const darkColors = {
  primary: "#2abcc9",
  background: "#111827",
  surface: "#1f2937",
  secondary: "#9ca3af",
  text: "#f9fafb",
  textSecondary: "#d1d5db",
  border: "#374151",
};

export function useThemeColors(): typeof lightColors {
  const scheme = useColorScheme();
  return scheme === "dark" ? darkColors : lightColors;
}