import { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";

import { HomeScreen } from "./screens/HomeScreen";
import { IssuesScreen } from "./screens/IssuesScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { MilestonesScreen } from "./screens/MilestonesScreen";
import { NotificationsScreen } from "./screens/NotificationsScreen";
import { UnitsScreen } from "./screens/UnitsScreen";
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
        <ActivityIndicator size="large" color="#0c7385" />
        <Text style={styles.loadingText}>Menyiapkan aplikasi...</Text>
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
      <Tab.Navigator screenOptions={{ headerStyle: { backgroundColor: "#f7f9fc" }, headerTitleStyle: { fontWeight: "700" } }}>
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
        <Tab.Screen name="Units">{() => <UnitsScreen auth={auth} />}</Tab.Screen>
        <Tab.Screen name="Milestone">{() => <MilestonesScreen auth={auth} />}</Tab.Screen>
        <Tab.Screen name="Kendala">{() => <IssuesScreen auth={auth} />}</Tab.Screen>
        <Tab.Screen name="Notif">{() => <NotificationsScreen auth={auth} />}</Tab.Screen>
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
    backgroundColor: "#f4f8fb"
  },
  loadingText: {
    marginTop: 10,
    color: "#4c5a67"
  }
});
