// [UI-FIX-V2] Remediation based on design-spec + audit — SIMDP Mobile v1.1
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { c } from "../theme/colors";

type UrgencyLevel = "RENDAH" | "SEDANG" | "TINGGI" | "KRITIS";

type TabIconName = React.ComponentProps<typeof Ionicons>["name"];

export function UrgencyBadge({ level }: { level: UrgencyLevel }): React.JSX.Element {
  const getConfig = (): {
    bg: string;
    text: string;
    border: string;
    borderWidth: number;
    icon: TabIconName;
  } => {
    switch (level) {
      case "KRITIS":
        return {
          bg: c.semanticColors.critical.bg,
          text: c.semanticColors.critical.text,
          border: c.semanticColors.critical.border,
          borderWidth: 1.5,
          icon: "alert-circle",
        };
      case "TINGGI":
        return {
          bg: c.semanticColors.high.bg,
          text: c.semanticColors.high.text,
          border: c.semanticColors.high.border,
          borderWidth: 1,
          icon: "alert",
        };
      case "SEDANG":
        return {
          bg: c.semanticColors.medium.bg,
          text: c.semanticColors.medium.text,
          border: c.semanticColors.medium.border,
          borderWidth: 1,
          icon: "information",
        };
      case "RENDAH":
        return {
          bg: c.semanticColors.low.bg,
          text: c.semanticColors.low.text,
          border: c.semanticColors.low.border,
          borderWidth: 1,
          icon: "checkmark-circle",
        };
    }
  };

  const { bg, text, border, borderWidth, icon } = getConfig();

  return (
    <View style={[styles.badge, { backgroundColor: bg, borderColor: border, borderWidth }]}>
      <Ionicons name={icon} size={12} color={text} style={styles.icon} />
      <Text style={[styles.label, { color: text }]}>{level}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  icon: {
    marginRight: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
});