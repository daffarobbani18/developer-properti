import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
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
  TextStyle,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNetInfo } from "@react-native-community/netinfo";
import { Ionicons } from "@expo/vector-icons";
import { c } from "../theme/colors";

type ScreenShellProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  scrollable?: boolean;
  noScroll?: boolean;
  rightAction?: React.ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  onBack?: () => void;
}>;

export function ScreenShell({
  title,
  subtitle,
  scrollable = true,
  noScroll = false,
  rightAction,
  refreshing,
  onRefresh,
  onBack,
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

  const content = (
    <>
      {isOffline ? <OfflineBanner /> : null}
      {children}
    </>
  );

  if (noScroll) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeftContainer}>
            {onBack ? (
              <IconButton icon="arrow-back" onPress={onBack} size={22} />
            ) : null}
            <View style={styles.headerTextWrap}>
              <Text style={styles.headerTitle}>{title}</Text>
              {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
            </View>
          </View>
          {rightAction ? <View>{rightAction}</View> : null}
        </View>
        <View style={{ flex: 1 }}>{content}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeftContainer}>
          {onBack ? (
            <IconButton icon="arrow-back" onPress={onBack} size={22} />
          ) : null}
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>{title}</Text>
            {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
          </View>
        </View>
        {rightAction ? <View>{rightAction}</View> : null}
      </View>
      {scrollable ? <ScrollView {...scrollProps}>{content}</ScrollView> : <View style={styles.body}>{content}</View>}
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

export function Badge({ label, tone = "neutral" }: { label: string; tone?: "neutral" | "success" | "warning" | "danger" | "info" }): React.JSX.Element {
  const toneStyle =
    tone === "success"
      ? styles.badgeSuccess
      : tone === "warning"
        ? styles.badgeWarning
        : tone === "danger"
          ? styles.badgeDanger
          : tone === "info"
            ? styles.badgeInfo
            : styles.badgeNeutral;

  const toneLabelStyle =
    tone === "success"
      ? styles.badgeLabelSuccess
      : tone === "warning"
        ? styles.badgeLabelWarning
        : tone === "danger"
          ? styles.badgeLabelDanger
          : tone === "info"
            ? styles.badgeLabelInfo
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
   const scaleAnim = React.useRef(new Animated.Value(1)).current;

   const handlePressIn = () => {
     Animated.spring(scaleAnim, {
       toValue: 0.97,
       useNativeDriver: true,
       speed: 50,
       bounciness: 0,
     }).start();
   };

   const handlePressOut = () => {
     Animated.spring(scaleAnim, {
       toValue: 1,
       useNativeDriver: true,
       speed: 30,
       bounciness: 4,
     }).start();
   };

   return (
     <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
       <Pressable
         onPressIn={handlePressIn}
         onPressOut={handlePressOut}
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
     </Animated.View>
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

export function TextButton({
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
        styles.textButton,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}
    >
      <Text style={styles.textButtonText}>{label}</Text>
    </Pressable>
  );
}

type TabIconName = React.ComponentProps<typeof Ionicons>["name"];

export function IconButton({
  icon,
  onPress,
  disabled,
  size = 24,
}: {
  icon: TabIconName;
  onPress: () => void;
  disabled?: boolean;
  size?: number;
}): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.iconButton,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}
    >
      <Ionicons name={icon} size={size} color="#117a85" />
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

  return <Animated.View style={[{ width: width as number, height, borderRadius, backgroundColor: c.neutral200 }, style, { opacity }]} />;
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

interface AnimatedProgressBarProps {
   progress: number;
   height?: number;
   color?: string;
   backgroundColor?: string;
   duration?: number;
   style?: ViewStyle;
 }

export function AnimatedProgressBar({
   progress,
   height = 6,
   color = c.primary,
   backgroundColor = c.neutral200,
   duration = 800,
   style,
  }: AnimatedProgressBarProps): React.JSX.Element {
   const widthAnim = React.useRef(new Animated.Value(0)).current;

   useEffect(() => {
     Animated.timing(widthAnim, {
       toValue: progress,
       duration,
       delay: 200,
       useNativeDriver: false,
     }).start();
   }, [progress, duration, widthAnim]);

   return (
     <View
       style={[
         { height, backgroundColor, borderRadius: height / 2, overflow: "hidden" },
         style,
       ]}
     >
       <Animated.View
         style={{
           height,
           borderRadius: height / 2,
           backgroundColor: color,
           width: widthAnim.interpolate({
             inputRange: [0, 100],
             outputRange: ["0%", "100%"],
           }),
         }}
       />
     </View>
   );
  }

interface CountUpNumberProps {
   value: number;
   duration?: number;
   suffix?: string;
   prefix?: string;
   style?: StyleProp<TextStyle>;
   decimals?: number;
  }

export function CountUpNumber({
    value,
    duration = 1000,
    suffix = "",
    prefix = "",
    style,
    decimals = 0,
  }: CountUpNumberProps): React.JSX.Element {
    const [displayValue, setDisplayValue] = useState(0);
    const startTime = useRef<number | null>(null);
    const frameRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);
    const startValue = useRef(0);

    useEffect(() => {
      startValue.current = 0;
      startTime.current = null;

      const animate = (timestamp: number) => {
        if (startTime.current === null) startTime.current = timestamp;
        const elapsed = timestamp - startTime.current;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = startValue.current + (value - startValue.current) * eased;
        setDisplayValue(
          Math.round(current * Math.pow(10, decimals)) / Math.pow(10, decimals)
        );
        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        }
      };

      frameRef.current = requestAnimationFrame(animate);

      return () => {
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
      };
    }, [value, duration, decimals]);

    return (
      <Text style={style}>
        {prefix}{displayValue.toFixed(decimals)}{suffix}
      </Text>
    );
  }

  const styles = StyleSheet.create({
   safeArea: {
     flex: 1,
     backgroundColor: c.neutral50,
   },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: c.neutral200,
    backgroundColor: "#ffffff",
  },
  headerLeftContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: c.neutral200,
    gap: 8,
    shadowColor: "#0f2f38",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
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
    backgroundColor: c.neutral100,
  },
  badgeSuccess: {
    backgroundColor: c.success.bg,
  },
  badgeWarning: {
    backgroundColor: c.warning.bg,
  },
badgeDanger: {
     backgroundColor: c.danger.bg,
   },
   badgeInfo: {
     backgroundColor: c.info.bg,
   },
   badgeLabelNeutral: {
     color: c.neutral600,
   },
   badgeLabelSuccess: {
     color: c.success.text,
   },
   badgeLabelWarning: {
     color: c.warning.text,
   },
   badgeLabelDanger: {
     color: c.danger.text,
   },
   badgeLabelInfo: {
     color: c.info.text,
   },
   statusBanner: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  statusBannerInfo: {
    borderColor: c.info.border,
    backgroundColor: c.info.bg,
  },
  statusBannerSuccess: {
    borderColor: c.success.border,
    backgroundColor: c.success.bg,
  },
  statusBannerWarning: {
    borderColor: c.warning.border,
    backgroundColor: c.warning.bg,
  },
  statusBannerDanger: {
    borderColor: c.danger.border,
    backgroundColor: c.danger.bg,
  },
  statusBannerText: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  statusBannerTextInfo: {
    color: c.info.text,
  },
  statusBannerTextSuccess: {
    color: c.success.text,
  },
  statusBannerTextWarning: {
    color: c.warning.text,
  },
  statusBannerTextDanger: {
    color: c.danger.text,
  },
  primaryButton: {
    borderRadius: 8,
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: c.primary600,
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  secondaryButton: {
    borderRadius: 8,
    minHeight: 40,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: c.neutral300,
    backgroundColor: c.neutral50,
    paddingHorizontal: 20,
  },
  secondaryButtonText: {
    color: c.primary600,
    fontWeight: "700",
    fontSize: 14,
  },
  textButton: {
    minHeight: 44,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  textButtonText: {
    color: c.primary600,
    fontWeight: "600",
    fontSize: 14,
  },
  iconButton: {
    minHeight: 44,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
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
    color: c.neutral700,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  input: {
    borderWidth: 1,
    borderColor: c.neutral300,
    borderRadius: 6,
    backgroundColor: "#ffffff",
    color: c.neutral800,
    minHeight: 40,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  inputFocused: {
    borderColor: c.primary600,
    backgroundColor: "#ffffff",
  },
  inputHint: {
    color: c.neutral500,
    fontSize: 12,
  },
  emptyWrap: {
    borderWidth: 1,
    borderColor: c.neutral200,
    borderStyle: "dashed",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 14,
    backgroundColor: c.neutral50,
  },
  emptyText: {
    color: c.neutral500,
    fontSize: 13,
  },
  emptyAction: {
    marginTop: 12,
    alignSelf: "flex-start",
  },
  emptyActionText: {
    color: c.primary600,
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
    borderRadius: 8,
    padding: 20,
    width: "100%",
    maxWidth: 340,
    gap: 12,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: c.neutral800,
  },
  dialogMessage: {
    fontSize: 14,
    color: c.neutral500,
    lineHeight: 20,
  },
  dialogButtons: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
  },
  offlineBanner: {
    backgroundColor: c.warning.bg,
    borderBottomWidth: 1,
    borderBottomColor: c.warning.border,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  offlineBannerText: {
    color: c.warning.text,
    fontSize: 12,
    fontWeight: "700",
  },
});
