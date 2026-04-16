import React, { useCallback, useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { BottomTabNavigationOptions, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

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
import { MobilePushRouteName } from "../services/notifications";

const FieldTabs = createBottomTabNavigator();
const CustomerTabs = createBottomTabNavigator();

type TabIconName = React.ComponentProps<typeof Ionicons>["name"];

function getCommonTabOptions(): BottomTabNavigationOptions {
  return {
    headerShown: false,
    tabBarHideOnKeyboard: true,
    tabBarActiveTintColor: "#1a6d78",
    tabBarInactiveTintColor: "#6d8790",
    tabBarLabelStyle: styles.tabLabel,
    tabBarItemStyle: styles.tabItem,
    tabBarStyle: styles.tabBar,
  };
}

function tabOptions(activeIcon: TabIconName, inactiveIcon: TabIconName): BottomTabNavigationOptions {
  return {
    tabBarIcon: ({ focused, color, size }) => (
      <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
        <Ionicons name={focused ? activeIcon : inactiveIcon} color={color} size={focused ? size + 1 : size} />
      </View>
    ),
  };
}

function BootSplash(): React.JSX.Element {
  return (
    <View style={styles.bootWrap}>
      <ActivityIndicator size="large" color="#1e6f78" />
      <Text style={styles.bootText}>Memuat sesi aplikasi...</Text>
    </View>
  );
}

function FieldTabsNavigator({
  globalBanner,
}: {
  globalBanner?: string | null;
}): React.JSX.Element {
  return (
    <FieldTabs.Navigator
      id="field-tabs"
      screenOptions={getCommonTabOptions()}
    >
      <FieldTabs.Screen name="Beranda" options={tabOptions("home", "home-outline")}>
        {() => <FieldHomeScreen globalBanner={globalBanner} />}
      </FieldTabs.Screen>
      <FieldTabs.Screen
        name="Milestone"
        component={FieldMilestonesScreen}
        options={tabOptions("flag", "flag-outline")}
      />
      <FieldTabs.Screen name="Unit" component={FieldUnitsScreen} options={tabOptions("grid", "grid-outline")} />
      <FieldTabs.Screen
        name="Kendala"
        component={FieldIssuesScreen}
        options={tabOptions("warning", "warning-outline")}
      />
      <FieldTabs.Screen name="Notifikasi" options={tabOptions("notifications", "notifications-outline")}>
        {() => <FieldNotificationsScreen globalBanner={globalBanner} />}
      </FieldTabs.Screen>
    </FieldTabs.Navigator>
  );
}

function CustomerTabsNavigator({ globalBanner }: { globalBanner?: string | null }): React.JSX.Element {
  return (
    <CustomerTabs.Navigator
      id="customer-tabs"
      screenOptions={getCommonTabOptions()}
    >
      <CustomerTabs.Screen name="Beranda" options={tabOptions("home", "home-outline")}>
        {() => <CustomerHomeScreen globalBanner={globalBanner} />}
      </CustomerTabs.Screen>
      <CustomerTabs.Screen
        name="Progres"
        component={CustomerProgressScreen}
        options={tabOptions("stats-chart", "stats-chart-outline")}
      />
      <CustomerTabs.Screen
        name="Tagihan"
        component={CustomerBillingScreen}
        options={tabOptions("wallet", "wallet-outline")}
      />
      <CustomerTabs.Screen
        name="Dokumen"
        component={CustomerDocumentsScreen}
        options={tabOptions("document-text", "document-text-outline")}
      />
      <CustomerTabs.Screen
        name="Bantuan"
        component={CustomerSupportScreen}
        options={tabOptions("help-circle", "help-circle-outline")}
      />
    </CustomerTabs.Navigator>
  );
}

type FieldRouteName = "Beranda" | "Milestone" | "Unit" | "Kendala" | "Notifikasi";
type CustomerRouteName = "Beranda" | "Progres" | "Tagihan" | "Dokumen" | "Bantuan";

const FIELD_ROUTES: FieldRouteName[] = ["Beranda", "Milestone", "Unit", "Kendala", "Notifikasi"];
const CUSTOMER_ROUTES: CustomerRouteName[] = ["Beranda", "Progres", "Tagihan", "Dokumen", "Bantuan"];

function isFieldRouteName(value: string | null | undefined): value is FieldRouteName {
  return Boolean(value && FIELD_ROUTES.includes(value as FieldRouteName));
}

function isCustomerRouteName(value: string | null | undefined): value is CustomerRouteName {
  return Boolean(value && CUSTOMER_ROUTES.includes(value as CustomerRouteName));
}

export function AppNavigator({
  globalBanner,
  pendingRouteName,
  onPendingRouteHandled,
}: {
  globalBanner?: string | null;
  pendingRouteName?: MobilePushRouteName | null;
  onPendingRouteHandled?: () => void;
}): React.JSX.Element {
  const { auth, isBootstrapping } = useAuth();
  const navigationRef = useNavigationContainerRef();

  const navigateToPendingRoute = useCallback(() => {
    if (!auth || !pendingRouteName) {
      return;
    }

    if (!navigationRef.isReady()) {
      return;
    }

    if (auth.user.role === "CUSTOMER") {
      if (isCustomerRouteName(pendingRouteName)) {
        navigationRef.navigate(pendingRouteName as never);
      }
      onPendingRouteHandled?.();
      return;
    }

    if (isFieldRouteName(pendingRouteName)) {
      navigationRef.navigate(pendingRouteName as never);
    }

    onPendingRouteHandled?.();
  }, [auth, navigationRef, onPendingRouteHandled, pendingRouteName]);

  useEffect(() => {
    navigateToPendingRoute();
  }, [navigateToPendingRoute]);

  if (isBootstrapping) {
    return <BootSplash />;
  }

  if (!auth) {
    return <LoginScreen />;
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        navigateToPendingRoute();
      }}
    >
      {auth.user.role === "CUSTOMER" ? (
        <CustomerTabsNavigator globalBanner={globalBanner} />
      ) : (
        <FieldTabsNavigator globalBanner={globalBanner} />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  bootWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2f7f8",
    gap: 12,
  },
  bootText: {
    color: "#365a63",
    fontSize: 14,
  },
  tabBar: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 12,
    height: 70,
    borderRadius: 18,
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: "#d6e3e7",
    backgroundColor: "#ffffff",
    paddingTop: 7,
    shadowColor: "#0f2f38",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 4,
  },
  tabItem: {
    borderRadius: 13,
    marginHorizontal: 2,
  },
  iconWrap: {
    width: 30,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  iconWrapActive: {
    backgroundColor: "#e9f7f8",
  },
});
