import React, { PropsWithChildren } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollViewProps,
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
  const scrollProps: ScrollViewProps = {
    style: styles.scroll,
    contentContainerStyle: styles.scrollContent,
    keyboardShouldPersistTaps: "handled",
    showsVerticalScrollIndicator: false,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>{title}</Text>
          {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
        </View>
        {rightAction ? <View>{rightAction}</View> : null}
      </View>
      {scrollable ? <ScrollView {...scrollProps}>{children}</ScrollView> : <View style={styles.body}>{children}</View>}
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

  const toneLabelStyle =
    tone === "success"
      ? styles.badgeLabelSuccess
      : tone === "warning"
        ? styles.badgeLabelWarning
        : tone === "danger"
          ? styles.badgeLabelDanger
          : styles.badgeLabelNeutral;

  return (
    <View style={[styles.badge, toneStyle]}>
      <Text style={[styles.badgeLabel, toneLabelStyle]}>{label}</Text>
    </View>
  );
}

export function StatusBanner({
  message,
  tone = "info",
}: {
  message: string;
  tone?: "info" | "success" | "warning" | "danger";
}): React.JSX.Element {
  const toneStyle =
    tone === "success"
      ? styles.statusBannerSuccess
      : tone === "warning"
        ? styles.statusBannerWarning
        : tone === "danger"
          ? styles.statusBannerDanger
          : styles.statusBannerInfo;

  const toneTextStyle =
    tone === "success"
      ? styles.statusBannerTextSuccess
      : tone === "warning"
        ? styles.statusBannerTextWarning
        : tone === "danger"
          ? styles.statusBannerTextDanger
          : styles.statusBannerTextInfo;

  return (
    <View style={[styles.statusBanner, toneStyle]}>
      <Text style={[styles.statusBannerText, toneTextStyle]}>{message}</Text>
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
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <View style={styles.inputWrap}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        placeholderTextColor="#70848a"
        {...inputProps}
        onFocus={(event) => {
          setIsFocused(true);
          inputProps.onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          inputProps.onBlur?.(event);
        }}
        style={[styles.input, isFocused && styles.inputFocused, inputProps.style]}
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
    backgroundColor: "#f2f7f8",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#d5e3e5",
    backgroundColor: "#edf5f6",
  },
  headerTextWrap: {
    flex: 1,
    paddingRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#102f38",
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#4a6a73",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    paddingBottom: 108,
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    paddingBottom: 98,
  },
  card: {
    borderRadius: 16,
    padding: 15,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d7e5e8",
    gap: 8,
    shadowColor: "#0f2f38",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
    paddingVertical: 4,
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
  badgeLabelNeutral: {
    color: "#35546b",
  },
  badgeLabelSuccess: {
    color: "#2f6a44",
  },
  badgeLabelWarning: {
    color: "#805f24",
  },
  badgeLabelDanger: {
    color: "#8e3128",
  },
  statusBanner: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  statusBannerInfo: {
    borderColor: "#b9d6dc",
    backgroundColor: "#eef8fa",
  },
  statusBannerSuccess: {
    borderColor: "#b7ddc2",
    backgroundColor: "#edf9f1",
  },
  statusBannerWarning: {
    borderColor: "#e7d2a0",
    backgroundColor: "#fff7e5",
  },
  statusBannerDanger: {
    borderColor: "#e2b8b3",
    backgroundColor: "#fff0ee",
  },
  statusBannerText: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  statusBannerTextInfo: {
    color: "#1f5661",
  },
  statusBannerTextSuccess: {
    color: "#296747",
  },
  statusBannerTextWarning: {
    color: "#795a1f",
  },
  statusBannerTextDanger: {
    color: "#8c3128",
  },
  primaryButton: {
    borderRadius: 12,
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a6d78",
    paddingHorizontal: 14,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  secondaryButton: {
    borderRadius: 12,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#a3c0c6",
    backgroundColor: "#eff8fa",
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
    borderColor: "#bfd4d8",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    color: "#132e37",
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  inputFocused: {
    borderColor: "#4f98a2",
    backgroundColor: "#f7fcfd",
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
