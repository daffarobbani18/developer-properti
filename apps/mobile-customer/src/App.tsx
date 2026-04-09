import { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";

import { BillingScreen } from "./screens/BillingScreen";
import { DocumentsScreen } from "./screens/DocumentsScreen";
import { FaqScreen } from "./screens/FaqScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { ProgressScreen } from "./screens/ProgressScreen";
import { TicketsScreen } from "./screens/TicketsScreen";
import { clearAuth, getAuth, setAuth } from "./lib/storage";
import type { AuthState } from "./types";

const Tab = createBottomTabNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [auth, setAuthState] = useState<AuthState | null>(null);

  useEffect(() => {
    getAuth()
      .then(setAuthState)
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#0d766f" />
        <Text style={styles.loadingText}>Menyiapkan portal customer...</Text>
      </SafeAreaView>
    );
  }

  if (!auth) {
    return (
      <SafeAreaView style={styles.centered}>
        <LoginScreen
          onLogin={async (nextAuth) => {
            await setAuth(nextAuth);
            setAuthState(nextAuth);
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator>
        <Tab.Screen name="Home">
          {() => (
            <HomeScreen
              auth={auth}
              onLogout={async () => {
                await clearAuth();
                setAuthState(null);
              }}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Progres">{() => <ProgressScreen auth={auth} />}</Tab.Screen>
        <Tab.Screen name="Tagihan">{() => <BillingScreen auth={auth} />}</Tab.Screen>
        <Tab.Screen name="Dokumen">{() => <DocumentsScreen auth={auth} />}</Tab.Screen>
        <Tab.Screen name="Tiket">{() => <TicketsScreen auth={auth} />}</Tab.Screen>
        <Tab.Screen name="FAQ">{() => <FaqScreen auth={auth} />}</Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f7fcfa"
  },
  loadingText: {
    marginTop: 10,
    color: "#4c6865"
  }
});
