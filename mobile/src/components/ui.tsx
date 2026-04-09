import React, { PropsWithChildren } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenShellProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  scrollable?: boolean;
  rightAction?: React.ReactNode;
}>;

export function ScreenShell({
  title,
  subtitle,
  scrollable = true,
  rightAction,
  children,
}: ScreenShellProps): React.JSX.Element {
  const Content = (
    <View style={styles.body}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>{title}</Text>
          {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
        </View>
        {rightAction ? <View>{rightAction}</View> : null}
      </View>
      {scrollable ? <ScrollView style={styles.scroll}>{Content}</ScrollView> : Content}
    </SafeAreaView>
  );
}

export function Card({
  children,
  style,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>): React.JSX.Element {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionTitle({ title, caption }: { title: string; caption?: string }): React.JSX.Element {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {caption ? <Text style={styles.sectionCaption}>{caption}</Text> : null}
    </View>
  );
}

export function Badge({ label, tone = "neutral" }: { label: string; tone?: "neutral" | "success" | "warning" | "danger" }): React.JSX.Element {
  const toneStyle =
    tone === "success"
      ? styles.badgeSuccess
      : tone === "warning"
        ? styles.badgeWarning
        : tone === "danger"
          ? styles.badgeDanger
          : styles.badgeNeutral;

  return (
    <View style={[styles.badge, toneStyle]}>
      <Text style={styles.badgeLabel}>{label}</Text>
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.primaryButton,
        (disabled || loading) && styles.buttonDisabled,
        pressed && !disabled && !loading && styles.buttonPressed,
      ]}
    >
      {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.primaryButtonText}>{label}</Text>}
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.secondaryButton,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}
    >
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  );
}

export function LabeledInput({
  label,
  hint,
  ...inputProps
}: TextInputProps & { label: string; hint?: string }): React.JSX.Element {
  return (
    <View style={styles.inputWrap}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        placeholderTextColor="#70848a"
        {...inputProps}
        style={[styles.input, inputProps.style]}
      />
      {hint ? <Text style={styles.inputHint}>{hint}</Text> : null}
    </View>
  );
}

export function EmptyState({ message }: { message: string }): React.JSX.Element {
  return (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f8f8",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#d9e5e3",
    backgroundColor: "#eef5f4",
  },
  headerTextWrap: {
    flex: 1,
    paddingRight: 10,
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#0f2f3a",
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#30515c",
  },
  scroll: {
    flex: 1,
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  card: {
    borderRadius: 14,
    padding: 14,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d5e3e0",
    gap: 8,
  },
  sectionHeader: {
    gap: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#113542",
  },
  sectionCaption: {
    fontSize: 12,
    color: "#4d6971",
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  badgeNeutral: {
    backgroundColor: "#e7f0f3",
  },
  badgeSuccess: {
    backgroundColor: "#dcf6e4",
  },
  badgeWarning: {
    backgroundColor: "#fff3d3",
  },
  badgeDanger: {
    backgroundColor: "#ffe2dd",
  },
  primaryButton: {
    borderRadius: 12,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1e6f78",
    paddingHorizontal: 14,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  secondaryButton: {
    borderRadius: 12,
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#83a9af",
    backgroundColor: "#f6fcfd",
    paddingHorizontal: 14,
  },
  secondaryButtonText: {
    color: "#1c5660",
    fontWeight: "700",
    fontSize: 14,
  },
  buttonPressed: {
    opacity: 0.82,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  inputWrap: {
    gap: 6,
  },
  inputLabel: {
    color: "#1b4a55",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#b9ced1",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    color: "#132e37",
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  inputHint: {
    color: "#547078",
    fontSize: 12,
  },
  emptyWrap: {
    borderWidth: 1,
    borderColor: "#cadee2",
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
    backgroundColor: "#f8fbfc",
  },
  emptyText: {
    color: "#55707a",
    fontSize: 13,
  },
});
