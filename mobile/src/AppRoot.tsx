import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider, useAuth } from "./hooks/useAuth";
import { AppNavigator } from "./navigation/AppNavigator";
import { bootstrapPushNotifications, MobilePushRouteName } from "./services/notifications";

function AppSessionBootstrap(): React.JSX.Element {
  const { auth } = useAuth();
  const [banner, setBanner] = useState<string | null>(null);
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
        (title, body) => {
          if (!mounted) {
            return;
          }

          setBanner(`${title}: ${body}`);
        },
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

      if (!mounted) {
        return;
      }

      if (result.registration.enabled && result.registration.token) {
        const shortToken = result.registration.token.slice(0, 14);
        setBanner(`Push siap digunakan. Token: ${shortToken}...`);
        return;
      }

      if (result.registration.message) {
        setBanner(result.registration.message);
      }
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

  useEffect(() => {
    if (!banner) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setBanner(null);
    }, 3500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [banner]);

  return (
    <AppNavigator
      globalBanner={banner}
      pendingRouteName={pendingRouteName}
      onPendingRouteHandled={() => setPendingRouteName(null)}
    />
  );
}

export function AppRoot(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="dark" />
          <AppSessionBootstrap />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
