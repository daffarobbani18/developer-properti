import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { ErrorBoundary } from "./components/ErrorBoundary";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { AppNavigator } from "./navigation/AppNavigator";
import { bootstrapPushNotifications, MobilePushRouteName } from "./services/notifications";

// Shown during auth bootstrap in Expo Go / expo start.
// On native builds this is covered by the native splash from expo-splash-screen.
function AppSplash(): React.JSX.Element {
  return (
    <LinearGradient
      colors={["#020617", "#0a0f23", "#0F172A"]}
      locations={[0, 0.5, 1]}
      style={splashStyles.container}
    >
      <View style={splashStyles.glow} />

      {/* Geometric mark */}
      <View style={splashStyles.markWrap}>
        <View style={splashStyles.outerSquare} />
        <View style={splashStyles.innerSquare} />
        <View style={splashStyles.centerDot} />
        <View style={[splashStyles.corner, { top: -3, left: -3 }]} />
        <View style={[splashStyles.corner, { top: -3, right: -3 }]} />
        <View style={[splashStyles.corner, { bottom: -3, left: -3 }]} />
        <View style={[splashStyles.corner, { bottom: -3, right: -3 }]} />
      </View>

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

function AppWithSplash(): React.JSX.Element {
  const { isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <AppSplash />;
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
