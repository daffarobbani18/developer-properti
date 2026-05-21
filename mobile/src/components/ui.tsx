import React, { PropsWithChildren, useEffect } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  RefreshControl,
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
import { useNetInfo } from "@react-native-community/netinfo";

type ScreenShellProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  scrollable?: boolean;
  rightAction?: React.ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
}>;

export function ScreenShell({
  title,
  subtitle,
  scrollable = true,
  rightAction,
  refreshing,
  onRefresh,
  children,
}: ScreenShellProps): React.JSX.Element {
  const netInfo = useNetInfo();
  const isOffline = netInfo.isConnected === false;

  const scrollProps: ScrollViewProps = {
    style: styles.scroll,
    contentContainerStyle: styles.scrollContent,
    keyboardShouldPersistTaps: "handled",
    showsVerticalScrollIndicator: false,
  };

  if (refreshing !== undefined && onRefresh) {
    scrollProps.refreshControl = <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>{title}</Text>
          {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
        </View>
        {rightAction ? <View>{rightAction}</View> : null}
      </View>
      {isOffline ? <OfflineBanner /> : null}
      {scrollable ? <ScrollView {...scrollProps}>{children}</ScrollView> : <View style={styles.body}>{children}</View>}
    </SafeAreaView>
  );
}

export function OfflineBanner(): React.JSX.Element {
  return (
    <View style={styles.offlineBanner}>
      <Text style={styles.offlineBannerText}>⚠ Mode Offline - Data akan disimpan ke queue lokal</Text>
    </View>
  );
}

export function Card({
   children,
   style,
 }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>): React.JSX.Element {
   return <View style={[styles.card, style]}>{children}</View>;
 }

export function FadeInView({
   children,
   delay = 0,
   duration = 300,
   style,
 }: PropsWithChildren<{
   delay?: number;
   duration?: number;
   style?: StyleProp<ViewStyle>;
 }>): React.JSX.Element {
   const opacity = React.useRef(new Animated.Value(0)).current;

   useEffect(() => {
     Animated.timing(opacity, {
       toValue: 1,
       duration,
       delay,
       useNativeDriver: true,
     }).start();
   }, [delay, duration, opacity]);

   return <Animated.View style={[{ opacity }, style]}>{children}</Animated.View>;
 }

export function SlideInView({
   children,
   delay = 0,
   duration = 300,
   direction = "up",
   style,
 }: PropsWithChildren<{
   delay?: number;
   duration?: number;
   direction?: "up" | "down" | "left" | "right";
   style?: StyleProp<ViewStyle>;
 }>): React.JSX.Element {
   const translateX = React.useRef(new Animated.Value(0)).current;
   const translateY = React.useRef(new Animated.Value(0)).current;
   const opacity = React.useRef(new Animated.Value(0)).current;

   useEffect(() => {
     const toValue = 0;
     if (direction === "up") {
       translateY.setValue(20);
     } else if (direction === "down") {
       translateY.setValue(-20);
     } else if (direction === "left") {
       translateX.setValue(20);
     } else {
       translateX.setValue(-20);
     }

     Animated.parallel([
       Animated.timing(opacity, { toValue: 1, duration, delay, useNativeDriver: true }),
       Animated.timing(translateX, { toValue, duration, delay, useNativeDriver: true }),
       Animated.timing(translateY, { toValue, duration, delay, useNativeDriver: true }),
     ]).start();
   }, [delay, duration, direction, opacity, translateX, translateY]);

   return (
     <Animated.View style={[{ opacity, transform: [{ translateX }, { translateY }] }, style]}>
       {children}
     </Animated.View>
   );
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

export function EmptyState({ message, actionLabel, onAction }: { message: string; actionLabel?: string; onAction?: () => void }): React.JSX.Element {
  return (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyText}>{message}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} style={styles.emptyAction}>
          <Text style={styles.emptyActionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Skeleton({ width, height, borderRadius = 4, style }: { width: number | string; height: number; borderRadius?: number; style?: StyleProp<ViewStyle> }): React.JSX.Element {
  const opacity = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);

  return <Animated.View style={[{ width: width as number, height, borderRadius, backgroundColor: "#e5e7e8" }, style, { opacity }]} />;
}

export function SkeletonList({ count = 3 }: { count?: number }): React.JSX.Element {
  return (
    <View style={styles.skeletonList}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} style={styles.skeletonCard}>
          <Skeleton width="100%" height={16} style={{ marginBottom: 8 }} />
          <Skeleton width="70%" height={14} style={{ marginBottom: 6 }} />
          <Skeleton width="50%" height={12} />
        </Card>
      ))}
    </View>
  );
}

export function ConfirmationDialog({
  visible,
  title,
  message,
  confirmLabel = "Ya",
  cancelLabel = "Batal",
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}): React.JSX.Element | null {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.dialogOverlay}>
      <View style={styles.dialogBox}>
        <Text style={styles.dialogTitle}>{title}</Text>
        <Text style={styles.dialogMessage}>{message}</Text>
        <View style={styles.dialogButtons}>
          <SecondaryButton label={cancelLabel} onPress={onCancel} />
          <PrimaryButton label={confirmLabel} onPress={onConfirm} />
        </View>
      </View>
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
  emptyAction: {
    marginTop: 12,
    alignSelf: "flex-start",
  },
  emptyActionText: {
    color: "#1a6d78",
    fontSize: 13,
    fontWeight: "700",
  },
  skeletonList: {
    gap: 12,
  },
  skeletonCard: {
    gap: 6,
  },
  dialogOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  dialogBox: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 340,
    gap: 12,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#102f38",
  },
  dialogMessage: {
    fontSize: 14,
    color: "#4a6a73",
    lineHeight: 20,
  },
  dialogButtons: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
  },
  offlineBanner: {
    backgroundColor: "#fff3d3",
    borderBottomWidth: 1,
    borderBottomColor: "#e7d2a0",
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  offlineBannerText: {
    color: "#805f24",
    fontSize: 12,
    fontWeight: "700",
  },
});
