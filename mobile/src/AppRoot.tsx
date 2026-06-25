import React, { useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
  Text,
  Pressable,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { ErrorBoundary } from "./components/ErrorBoundary";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { AppNavigator } from "./navigation/AppNavigator";
import { bootstrapPushNotifications, MobilePushRouteName } from "./services/notifications";
import { getOnboardingCompleted, setOnboardingCompleted } from "./services/storage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Splash Screen ────────────────────────────────────────
function AppSplash(): React.JSX.Element {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={["#020617", "#0a0f23", "#0F172A"]}
      locations={[0, 0.5, 1]}
      style={splashStyles.container}
    >
      <View style={splashStyles.glow} />

      <Animated.View
        style={[
          splashStyles.markWrap,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={splashStyles.outerSquare} />
        <View style={splashStyles.innerSquare} />
        <View style={splashStyles.centerDot} />
        <View style={[splashStyles.corner, { top: -3, left: -3 }]} />
        <View style={[splashStyles.corner, { top: -3, right: -3 }]} />
        <View style={[splashStyles.corner, { bottom: -3, left: -3 }]} />
        <View style={[splashStyles.corner, { bottom: -3, right: -3 }]} />
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
        <Text style={splashStyles.wordmark}>SIMDP</Text>
        <View style={splashStyles.underline} />
        <Text style={splashStyles.tagline}>Sistem Informasi Manajemen</Text>
        <Text style={splashStyles.tagline}>Developer Properti</Text>

        <View style={splashStyles.ruleWrap}>
          <View style={splashStyles.ruleLine} />
          <View style={splashStyles.ruleDot} />
          <View style={splashStyles.ruleLine} />
        </View>
        <Text style={splashStyles.caption}>Mobile</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const MARK = 96;
const INNER = 16;

const splashStyles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  glow: {
    position: "absolute",
    width: 440,
    height: 440,
    borderRadius: 220,
    backgroundColor: "#2563EB",
    opacity: 0.07,
    alignSelf: "center",
    top: "40%",
    marginTop: -220,
  },
  markWrap: { width: MARK, height: MARK, marginBottom: 48 },
  outerSquare: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    borderWidth: 5,
    borderColor: "#ffffff",
  },
  innerSquare: {
    position: "absolute",
    top: INNER, left: INNER, right: INNER, bottom: INNER,
    backgroundColor: "#2563EB",
  },
  centerDot: {
    position: "absolute",
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: "#ffffff",
    top: MARK / 2 - 6,
    left: MARK / 2 - 6,
  },
  corner: {
    position: "absolute",
    width: 14, height: 14,
    backgroundColor: "#3B82F6",
  },
  wordmark: { fontSize: 64, fontWeight: "900", color: "#ffffff", letterSpacing: 4 },
  underline: { width: 160, height: 4, backgroundColor: "#2563EB", marginTop: 10, marginBottom: 28 },
  tagline: { fontSize: 16, fontWeight: "500", color: "#94A3B8", letterSpacing: 0.3, marginBottom: 4 },
  ruleWrap: { flexDirection: "row", alignItems: "center", marginTop: 40, marginBottom: 12, gap: 12 },
  ruleLine: { width: 72, height: 1, backgroundColor: "#475569", opacity: 0.7 },
  ruleDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#2563EB" },
  caption: { fontSize: 13, fontWeight: "500", color: "#475569", letterSpacing: 1 },
});

// ─── Onboarding Screen ────────────────────────────────────
const ONBOARDING_SLIDES = [
  {
    icon: "home-outline" as const,
    title: "Selamat Datang di SIMDP",
    subtitle: "Sistem Informasi Manajemen\nDeveloper Properti",
    description:
      "Pantau progres pembangunan rumah, tagihan, dokumen legal, dan banyak lagi — semua dalam satu aplikasi.",
    gradient: ["#0F172A", "#1E293B"] as [string, string],
    accent: "#3B82F6",
  },
  {
    icon: "construct-outline" as const,
    title: "Progres Real-Time",
    subtitle: "Konstruksi & Milestone",
    description:
      "Lihat perkembangan pembangunan rumah Anda secara real-time, lengkap dengan foto dan persentase kemajuan.",
    gradient: ["#0C1B2A", "#162D4A"] as [string, string],
    accent: "#2563EB",
  },
  {
    icon: "document-text-outline" as const,
    title: "Tagihan & Dokumen",
    subtitle: "Keuangan & Legal",
    description:
      "Akses riwayat pembayaran, jadwal cicilan, serta dokumen legal (PPJB, AJB, SHM) kapan saja.",
    gradient: ["#0B1A14", "#122E1F"] as [string, string],
    accent: "#10B981",
  },
];

function OnboardingScreen({
  onComplete,
}: {
  onComplete: () => void;
}): React.JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const slide = ONBOARDING_SLIDES[currentIndex];
  const isLast = currentIndex === ONBOARDING_SLIDES.length - 1;

  const animateTransition = (nextIndex: number) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -30, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setCurrentIndex(nextIndex);
      slideAnim.setValue(30);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      animateTransition(currentIndex + 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <LinearGradient
      colors={slide.gradient}
      style={onboardingStyles.container}
    >
      {/* Skip button */}
      {!isLast && (
        <Pressable
          style={onboardingStyles.skipButton}
          onPress={handleSkip}
        >
          <Text style={onboardingStyles.skipText}>Lewati</Text>
        </Pressable>
      )}

      <Animated.View
        style={[
          onboardingStyles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Icon */}
        <View style={[onboardingStyles.iconCircle, { backgroundColor: slide.accent + "20" }]}>
          <Ionicons name={slide.icon} size={64} color={slide.accent} />
        </View>

        {/* Text */}
        <Text style={onboardingStyles.title}>{slide.title}</Text>
        <Text style={[onboardingStyles.subtitle, { color: slide.accent }]}>
          {slide.subtitle}
        </Text>
        <Text style={onboardingStyles.description}>{slide.description}</Text>
      </Animated.View>

      {/* Bottom area */}
      <View style={onboardingStyles.bottomArea}>
        {/* Dots */}
        <View style={onboardingStyles.dotsRow}>
          {ONBOARDING_SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                onboardingStyles.dot,
                i === currentIndex
                  ? { backgroundColor: slide.accent, width: 28 }
                  : { backgroundColor: "#475569", width: 8 },
              ]}
            />
          ))}
        </View>

        {/* Next / Get Started button */}
        <Pressable
          style={[onboardingStyles.nextButton, { backgroundColor: slide.accent }]}
          onPress={handleNext}
        >
          <Text style={onboardingStyles.nextButtonText}>
            {isLast ? "Mulai Sekarang" : "Lanjut"}
          </Text>
          <Ionicons
            name={isLast ? "checkmark-circle" : "arrow-forward"}
            size={20}
            color="#ffffff"
          />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const onboardingStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 50,
    paddingHorizontal: 28,
  },
  skipButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  skipText: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  description: {
    color: "#94A3B8",
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: 12,
  },
  bottomArea: {
    alignItems: "center",
    gap: 28,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
  },
  nextButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
});

// ─── App Session Bootstrap ────────────────────────────────
function AppSessionBootstrap(): React.JSX.Element {
  const { auth } = useAuth();
  const [pendingRouteName, setPendingRouteName] = useState<MobilePushRouteName | null>(null);

  useEffect(() => {
    let mounted = true;
    let cleanup = () => {};

    (async () => {
      if (!auth) {
        return;
      }

      const result = await bootstrapPushNotifications(
        auth,
        () => {},
        (payload) => {
          if (!mounted) {
            return;
          }

          if (payload.routeName) {
            setPendingRouteName(payload.routeName);
          }
        }
      );

      cleanup = result.cleanup;
    })();

    return () => {
      mounted = false;
      cleanup();
    };
  }, [auth]);

  useEffect(() => {
    if (!auth && pendingRouteName) {
      setPendingRouteName(null);
    }
  }, [auth, pendingRouteName]);

  return (
    <AppNavigator
      pendingRouteName={pendingRouteName}
      onPendingRouteHandled={() => setPendingRouteName(null)}
    />
  );
}

// ─── Main App Flow (Splash → Onboarding → Login/App) ─────
const SPLASH_DURATION_MS = 2500;

function AppWithSplash(): React.JSX.Element {
  const { isBootstrapping } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  // Check onboarding status on mount
  useEffect(() => {
    (async () => {
      const completed = await getOnboardingCompleted();
      setShowOnboarding(!completed);
      setCheckingOnboarding(false);
    })();
  }, []);

  // Ensure splash shows for a minimum duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, []);

  // Show splash while bootstrapping OR minimum duration hasn't elapsed OR checking onboarding
  if (isBootstrapping || showSplash || checkingOnboarding) {
    return <AppSplash />;
  }

  // Show onboarding if first time
  if (showOnboarding) {
    return (
      <OnboardingScreen
        onComplete={async () => {
          await setOnboardingCompleted();
          setShowOnboarding(false);
        }}
      />
    );
  }

  return (
    <ErrorBoundary>
      <AppSessionBootstrap />
    </ErrorBoundary>
  );
}

export function AppRoot(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="light" />
          <AppWithSplash />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
