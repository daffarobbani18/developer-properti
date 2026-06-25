import { NotificationProvider } from '../contexts/NotificationContext';
import React, { useCallback, useEffect } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import { c } from "../theme/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "../hooks/useAuth";
import type { FieldStackParamList, CustomerStackParamList } from "./types";
import { CustomerBillingScreen } from "../screens/customer/CustomerBillingScreen";
import { CustomerDocumentsScreen } from "../screens/customer/CustomerDocumentsScreen";
import { CustomerHomeScreen } from "../screens/customer/CustomerHomeScreen";
import { CustomerProgressScreen } from "../screens/customer/CustomerProgressScreen";
import { CustomerSupportScreen } from "../screens/customer/CustomerSupportScreen";
import { FaqContactScreen } from "../screens/customer/FaqContactScreen";
import { PhotoGalleryScreen } from "../screens/customer/PhotoGalleryScreen";
import { TicketDetailScreen } from "../screens/customer/TicketDetailScreen";
import { LoginScreen } from "../screens/shared/LoginScreen";


import { FieldHomeScreen } from "../screens/pengawas/FieldHomeScreen";
import { FieldMilestonesScreen } from "../screens/pengawas/FieldMilestonesScreen";
import { FieldNotificationsScreen } from "../screens/pengawas/FieldNotificationsScreen";
import { CustomerNotificationsScreen } from "../screens/customer/CustomerNotificationsScreen";
import { FieldUnitDetailScreen } from "../screens/pengawas/FieldUnitDetailScreen";
import { FieldUnitsScreen } from "../screens/pengawas/FieldUnitsScreen";
import { FieldDailyReportScreen } from "../screens/pengawas/FieldDailyReportScreen";
import { FieldUpdateHistoryScreen } from "../screens/pengawas/FieldUpdateHistoryScreen";



import { ProjectDetailScreen } from "../screens/pengawas/ProjectDetailScreen";
import { InspectionUnitsScreen } from "../screens/pengawas/InspectionUnitsScreen";
import { InspectionDetailScreen } from "../screens/pengawas/InspectionDetailScreen";
import { AddDefectScreen } from "../screens/pengawas/AddDefectScreen";
import { MobilePushRouteName } from "../services/notifications";

const FIELD_ROUTES = {
  HOME: 'FieldHome',
  MILESTONE: 'FieldMilestone',
  UNIT: 'FieldUnit',

  NOTIFIKASI: 'FieldNotifikasi',
} as const;

const FieldStack = createNativeStackNavigator<FieldStackParamList>();

const CustomerStack = createNativeStackNavigator<CustomerStackParamList>();
type FieldRouteName = "Beranda" | "FieldNotifikasi" | "UnitDetail" | "UpdateHistory" | "ProjectDetail" | "FieldUnits" | "FieldMilestones" | "FieldDailyReport" | "InspectionUnits" | "InspectionDetail" | "AddDefect";

type CustomerRouteName = "Beranda" | "Progres" | "Tagihan" | "Dokumen" | "Bantuan" | "PhotoGallery" | "TicketDetail" | "FaqContact";



const FIELD_ROUTE_NAMES: FieldRouteName[] = ["Beranda", "FieldNotifikasi", "UnitDetail", "UpdateHistory", "ProjectDetail", "FieldUnits", "FieldMilestones", "FieldDailyReport", "InspectionUnits", "InspectionDetail", "AddDefect"];

const CUSTOMER_ROUTE_NAMES: CustomerRouteName[] = ["Beranda", "Progres", "Tagihan", "Dokumen", "Bantuan", "PhotoGallery", "TicketDetail", "FaqContact"];



function isFieldRouteName(value: string | null | undefined): value is FieldRouteName {
  return Boolean(value && FIELD_ROUTE_NAMES.includes(value as FieldRouteName));
}

function isCustomerRouteName(value: string | null | undefined): value is CustomerRouteName {
  return Boolean(value && CUSTOMER_ROUTE_NAMES.includes(value as CustomerRouteName));
}


const FieldTab = createBottomTabNavigator<FieldStackParamList>();

function FieldTabNavigator(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom;
  return (
    <FieldTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "home";
          if (route.name === "Beranda") iconName = focused ? "grid" : "grid-outline";
          // bar-chart lebih representatif untuk tab yang berisi progress/milestone/timeline
          // hammer merepresentasikan konstruksi fisik, bukan monitoring progress
          else if (route.name === "FieldMilestones") iconName = focused ? "bar-chart" : "bar-chart-outline";
          else if (route.name === "FieldDailyReport") iconName = focused ? "journal" : "journal-outline";
          else if (route.name === "InspectionUnits") iconName = focused ? "shield-checkmark" : "shield-checkmark-outline";
          return <Ionicons name={iconName as any} size={24} color={color} />;
        },
        tabBarActiveTintColor: c.primary600,
        tabBarInactiveTintColor: c.neutral500,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: c.neutral200,
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingTop: 8,
          paddingBottom: insets.bottom || 8,
          elevation: 8,
          shadowColor: c.neutral900,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
        },
        tabBarItemStyle: {
          paddingVertical: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: 0,
          marginBottom: 0,
          letterSpacing: 0.1,
        },
      })}
    >
      <FieldTab.Screen name="Beranda" component={FieldHomeScreen} options={{ tabBarLabel: "Home" }} />
      <FieldTab.Screen name="FieldMilestones" component={FieldMilestonesScreen} options={{ tabBarLabel: "Progres" }} />
      <FieldTab.Screen name="FieldDailyReport" component={FieldDailyReportScreen} options={{ tabBarLabel: "Laporan" }} />
      <FieldTab.Screen name="InspectionUnits" component={InspectionUnitsScreen} options={{ tabBarLabel: "Inspeksi" }} />
    </FieldTab.Navigator>
  );
}

function FieldNavigator(): React.JSX.Element {
   return (
      <NotificationProvider>
        <FieldStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Beranda">
        <FieldStack.Screen name="Beranda" component={FieldTabNavigator} />
        <FieldStack.Screen name="FieldNotifikasi" component={FieldNotificationsScreen} />
        <FieldStack.Screen name="UnitDetail" component={FieldUnitDetailScreen} options={{ title: "Detail Unit" }} />
        <FieldStack.Screen name="UpdateHistory" component={FieldUpdateHistoryScreen} options={{ title: "Riwayat Update" }} />
        <FieldStack.Screen name="ProjectDetail" component={ProjectDetailScreen} options={{ title: "Detail Proyek", headerShown: true, headerBackTitle: "Kembali" }} />
        <FieldStack.Screen name="FieldUnits" component={FieldUnitsScreen} options={{ title: "Daftar Unit" }} />
        
        {/* Detail screens for tabs */}
        <FieldStack.Screen name="InspectionDetail" component={InspectionDetailScreen} options={{ title: "Detail Inspeksi" }} />
        <FieldStack.Screen name="AddDefect" component={AddDefectScreen} options={{ title: "Lapor Komplain" }} />
      </FieldStack.Navigator>
      </NotificationProvider>
    );
}


const CustomerTab = createBottomTabNavigator<CustomerStackParamList>();

function CustomerTabNavigator(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom;
  return (
    <CustomerTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "home";
          if (route.name === "Beranda") iconName = focused ? "home" : "home-outline";
          else if (route.name === "Progres") iconName = focused ? "stats-chart" : "stats-chart-outline";
          else if (route.name === "Tagihan") iconName = focused ? "receipt" : "receipt-outline";
          else if (route.name === "Dokumen") iconName = focused ? "document-text" : "document-text-outline";
          else if (route.name === "Bantuan") iconName = focused ? "headset" : "headset-outline";
          return <Ionicons name={iconName as any} size={24} color={color} />;
        },
        tabBarActiveTintColor: c.primary600,
        tabBarInactiveTintColor: c.neutral500,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: c.neutral200,
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingTop: 8,
          paddingBottom: insets.bottom || 8,
          elevation: 8,
          shadowColor: c.neutral900,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
        },
        tabBarItemStyle: {
          paddingVertical: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: 0,
          marginBottom: 0,
          letterSpacing: 0.1,
        },
      })}
    >
      <CustomerTab.Screen name="Beranda" component={CustomerHomeScreen} options={{ tabBarLabel: "Home" }} />
      <CustomerTab.Screen name="Progres" component={CustomerProgressScreen} options={{ tabBarLabel: "Progres" }} />
      <CustomerTab.Screen name="Tagihan" component={CustomerBillingScreen} options={{ tabBarLabel: "Tagihan" }} />
      <CustomerTab.Screen name="Dokumen" component={CustomerDocumentsScreen} options={{ tabBarLabel: "Dokumen" }} />
      <CustomerTab.Screen name="Bantuan" component={CustomerSupportScreen} options={{ tabBarLabel: "Bantuan" }} />
    </CustomerTab.Navigator>
  );
}

function CustomerNavigator(): React.JSX.Element {
  return (
    <NotificationProvider>
      <CustomerStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Beranda">
      <CustomerStack.Screen name="Beranda" component={CustomerTabNavigator} />
      <CustomerStack.Screen name="CustomerNotifikasi" component={CustomerNotificationsScreen} />
      <CustomerStack.Screen name="PhotoGallery" component={PhotoGalleryScreen} options={{ title: "Galeri Foto" }} />
      <CustomerStack.Screen name="TicketDetail" component={TicketDetailScreen} options={{ title: "Detail Tiket" }} />
      <CustomerStack.Screen name="FaqContact" component={FaqContactScreen} options={{ title: "FAQ & Kontak" }} />
    </CustomerStack.Navigator>
    </NotificationProvider>
  );
}

export function AppNavigator({
   pendingRouteName,
   onPendingRouteHandled,
 }: {
   pendingRouteName?: MobilePushRouteName | null;
   onPendingRouteHandled?: () => void;
 }): React.JSX.Element {
   const { auth, isBootstrapping } = useAuth();
   const navigationRef = useNavigationContainerRef();

   // Hide native splash screen once bootstrap completes.
   // preventAutoHideAsync() is called at module scope in App.tsx.
   useEffect(() => {
     if (!isBootstrapping) {
       void SplashScreen.hideAsync();
     }
   }, [isBootstrapping]);

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
          <CustomerNavigator />
        ) : (
          <FieldNavigator />
        )}
     </NavigationContainer>
   );
 }

 const styles = StyleSheet.create({
 });