import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "./components/ErrorBoundary";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { AppNavigator } from "./navigation/AppNavigator";
import { bootstrapPushNotifications, MobilePushRouteName } from "./services/notifications";

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

export function AppRoot(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="dark" />
          <ErrorBoundary>
            <AppSessionBootstrap />
          </ErrorBoundary>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
