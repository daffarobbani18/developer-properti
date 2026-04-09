import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { useAuth } from "../hooks/useAuth";
import { CustomerBillingScreen } from "../screens/customer/CustomerBillingScreen";
import { CustomerDocumentsScreen } from "../screens/customer/CustomerDocumentsScreen";
import { CustomerHomeScreen } from "../screens/customer/CustomerHomeScreen";
import { CustomerProgressScreen } from "../screens/customer/CustomerProgressScreen";
import { CustomerSupportScreen } from "../screens/customer/CustomerSupportScreen";
import { LoginScreen } from "../screens/shared/LoginScreen";
import { FieldHomeScreen } from "../screens/pengawas/FieldHomeScreen";
import { FieldIssuesScreen } from "../screens/pengawas/FieldIssuesScreen";
import { FieldMilestonesScreen } from "../screens/pengawas/FieldMilestonesScreen";
import { FieldNotificationsScreen } from "../screens/pengawas/FieldNotificationsScreen";
import { FieldUnitsScreen } from "../screens/pengawas/FieldUnitsScreen";

const FieldTabs = createBottomTabNavigator();
const CustomerTabs = createBottomTabNavigator();

function BootSplash(): React.JSX.Element {
  return (
    <View style={styles.bootWrap}>
      <ActivityIndicator size="large" color="#1e6f78" />
      <Text style={styles.bootText}>Memuat sesi aplikasi...</Text>
    </View>
  );
}

function FieldTabsNavigator(): React.JSX.Element {
  return (
    <FieldTabs.Navigator
      id="field-tabs"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1e6f78",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
      }}
    >
      <FieldTabs.Screen name="Beranda" component={FieldHomeScreen} />
      <FieldTabs.Screen name="Milestone" component={FieldMilestonesScreen} />
      <FieldTabs.Screen name="Unit" component={FieldUnitsScreen} />
      <FieldTabs.Screen name="Kendala" component={FieldIssuesScreen} />
      <FieldTabs.Screen name="Notifikasi" component={FieldNotificationsScreen} />
    </FieldTabs.Navigator>
  );
}

function CustomerTabsNavigator(): React.JSX.Element {
  return (
    <CustomerTabs.Navigator
      id="customer-tabs"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1e6f78",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
      }}
    >
      <CustomerTabs.Screen name="Beranda" component={CustomerHomeScreen} />
      <CustomerTabs.Screen name="Progres" component={CustomerProgressScreen} />
      <CustomerTabs.Screen name="Tagihan" component={CustomerBillingScreen} />
      <CustomerTabs.Screen name="Dokumen" component={CustomerDocumentsScreen} />
      <CustomerTabs.Screen name="Bantuan" component={CustomerSupportScreen} />
    </CustomerTabs.Navigator>
  );
}

export function AppNavigator(): React.JSX.Element {
  const { auth, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <BootSplash />;
  }

  if (!auth) {
    return <LoginScreen />;
  }

  return (
    <NavigationContainer>
      {auth.user.role === "CUSTOMER" ? <CustomerTabsNavigator /> : <FieldTabsNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  bootWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4f8f8",
    gap: 12,
  },
  bootText: {
    color: "#275560",
    fontSize: 14,
  },
});
