import React, { useCallback, useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { BottomTabNavigationOptions, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../hooks/useAuth";
import type { FieldStackParamList, CustomerStackParamList, PengawasStackParamList } from "./types";
import { CustomerBillingScreen } from "../screens/customer/CustomerBillingScreen";
import { CustomerDocumentsScreen } from "../screens/customer/CustomerDocumentsScreen";
import { CustomerHomeScreen } from "../screens/customer/CustomerHomeScreen";
import { CustomerProgressScreen } from "../screens/customer/CustomerProgressScreen";
import { CustomerSupportScreen } from "../screens/customer/CustomerSupportScreen";
import { FaqContactScreen } from "../screens/customer/FaqContactScreen";
import { PhotoGalleryScreen } from "../screens/customer/PhotoGalleryScreen";
import { TicketDetailScreen } from "../screens/customer/TicketDetailScreen";
import { LoginScreen } from "../screens/shared/LoginScreen";
import { AttendanceHistoryScreen } from "../screens/pengawas/AttendanceHistoryScreen";
import { FieldAttendanceScreen } from "../screens/pengawas/FieldAttendanceScreen";
import { ProjectReportsScreen } from "../screens/pengawas/ProjectReportsScreen";
import { TeamAttendanceScreen } from "../screens/pengawas/TeamAttendanceScreen";
import { FieldHomeScreen } from "../screens/pengawas/FieldHomeScreen";
import { FieldMilestonesScreen } from "../screens/pengawas/FieldMilestonesScreen";
import { FieldNotificationsScreen } from "../screens/pengawas/FieldNotificationsScreen";
import { FieldUnitDetailScreen } from "../screens/pengawas/FieldUnitDetailScreen";
import { FieldUnitsScreen } from "../screens/pengawas/FieldUnitsScreen";
import { FieldDailyReportScreen } from "../screens/pengawas/FieldDailyReportScreen";
import { FieldIssuesScreen } from "../screens/pengawas/FieldIssuesScreen";
import { FieldUpdateHistoryScreen } from "../screens/pengawas/FieldUpdateHistoryScreen";
import { IssueHistoryScreen } from "../screens/pengawas/IssueHistoryScreen";
import { ProjectDashboardScreen } from "../screens/pengawas/ProjectDashboardScreen";
import { TeamManagementScreen } from "../screens/pengawas/TeamManagementScreen";
import { ApprovalScreen } from "../screens/pengawas/ApprovalScreen";
import { ProjectDetailScreen } from "../screens/pengawas/ProjectDetailScreen";
import { ProjectSelectScreen } from "../screens/field-app/ProjectSelectScreen";
import { UnitSelectScreen } from "../screens/field-app/UnitSelectScreen";
import { MilestoneListScreen } from "../screens/field-app/MilestoneListScreen";
import { UpdateHistoryScreen } from "../screens/field-app/UpdateHistoryScreen";
import { MilestoneUpdateScreen } from "../screens/field-app/MilestoneUpdateScreen";
import { UnitDetailScreen } from "../screens/field-app/UnitDetailScreen";
import { PhotoCaptureScreen } from "../screens/field-app/PhotoCaptureScreen";
import { IssueFormScreen } from "../screens/field-app/IssueFormScreen";
import { MobilePushRouteName } from "../services/notifications";

const FIELD_ROUTES = {
  HOME: 'FieldHome',
  MILESTONE: 'FieldMilestone',
  UNIT: 'FieldUnit',
  KENDALA: 'FieldKendala',
  NOTIFIKASI: 'FieldNotifikasi',
} as const;

type TabIconName = React.ComponentProps<typeof Ionicons>["name"];

const FieldTabs = createBottomTabNavigator();
const CustomerTabs = createBottomTabNavigator();
const ProjectManagerTabs = createBottomTabNavigator();
const FieldStack = createNativeStackNavigator<FieldStackParamList>();
const CustomerStack = createNativeStackNavigator<CustomerStackParamList>();
const ProjectManagerStack = createNativeStackNavigator<PengawasStackParamList>();

type FieldRouteName = "Beranda" | "Milestone" | "Unit" | "Kendala" | "Notifikasi" | "UnitDetail" | "UpdateHistory" | "ProjectSelect" | "UnitSelect" | "MilestoneList" | "MilestoneUpdate" | "UnitDetailField" | "PhotoCapture" | "IssueForm" | "UpdateHistoryField" | "IssueHistory" | "Attendance" | "AttendanceHistory" | "ProjectDetail";

type CustomerRouteName = "Beranda" | "Progres" | "Tagihan" | "Dokumen" | "Bantuan" | "PhotoGallery" | "TicketDetail" | "FaqContact";

type ProjectManagerRouteName = "Dashboard" | "Approval" | "Team" | "Laporan" | "Notifikasi" | "IssueHistory" | "AttendanceHistory" | "TeamAttendance" | "FieldUnits" | "FieldUnitDetail" | "FieldMilestones" | "MilestoneList" | "FieldIssues" | "FieldDailyReport" | "FieldAttendance" | "ProjectDetail";

const FIELD_ROUTE_NAMES: FieldRouteName[] = ["Beranda", "Milestone", "Unit", "Kendala", "Notifikasi", "UnitDetail", "UpdateHistory", "ProjectSelect", "UnitSelect", "MilestoneList", "MilestoneUpdate", "UnitDetailField", "PhotoCapture", "IssueForm", "UpdateHistoryField", "IssueHistory", "Attendance", "AttendanceHistory", "ProjectDetail"];

const CUSTOMER_ROUTE_NAMES: CustomerRouteName[] = ["Beranda", "Progres", "Tagihan", "Dokumen", "Bantuan", "PhotoGallery", "TicketDetail", "FaqContact"];

const PROJECT_MANAGER_ROUTE_NAMES: ProjectManagerRouteName[] = ["Dashboard", "Approval", "Team", "Laporan", "Notifikasi", "IssueHistory", "AttendanceHistory", "TeamAttendance", "FieldUnits", "FieldUnitDetail", "FieldMilestones", "MilestoneList", "FieldIssues", "FieldDailyReport", "FieldAttendance", "ProjectDetail"];

function getCommonTabOptions(): BottomTabNavigationOptions {
   return {
     headerShown: false,
     tabBarHideOnKeyboard: true,
     tabBarActiveTintColor: "#117a85",
     tabBarInactiveTintColor: "#94a3b8",
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

function isFieldRouteName(value: string | null | undefined): value is FieldRouteName {
  return Boolean(value && FIELD_ROUTE_NAMES.includes(value as FieldRouteName));
}

function isCustomerRouteName(value: string | null | undefined): value is CustomerRouteName {
  return Boolean(value && CUSTOMER_ROUTE_NAMES.includes(value as CustomerRouteName));
}

function isProjectManagerRouteName(value: string | null | undefined): value is ProjectManagerRouteName {
  return Boolean(value && PROJECT_MANAGER_ROUTE_NAMES.includes(value as ProjectManagerRouteName));
}

function FieldTabsNavigator(): React.JSX.Element {
   return (
      <FieldStack.Navigator screenOptions={{ headerShown: false }}>
        <FieldStack.Screen name="FieldTabs">
          {() => (
            <FieldTabs.Navigator
              id="field-tabs"
              screenOptions={getCommonTabOptions()}
            >
              <FieldTabs.Screen
                name="Beranda"
                options={tabOptions("home", "home-outline")}
              >
                {() => <FieldHomeScreen />}
              </FieldTabs.Screen>
              <FieldTabs.Screen
                name={FIELD_ROUTES.MILESTONE}
                component={MilestoneListScreen}
                options={tabOptions("checkbox", "checkbox-outline")}
              />
              <FieldTabs.Screen
                name={FIELD_ROUTES.UNIT}
                component={UnitSelectScreen}
                options={tabOptions("business", "business-outline")}
              />
              <FieldTabs.Screen
                name={FIELD_ROUTES.KENDALA}
                component={IssueFormScreen}
                options={tabOptions("warning", "warning-outline")}
              />
              <FieldTabs.Screen
                name={FIELD_ROUTES.NOTIFIKASI}
                component={FieldNotificationsScreen}
                options={tabOptions("notifications", "notifications-outline")}
              />
            </FieldTabs.Navigator>
          )}
        </FieldStack.Screen>
        <FieldStack.Screen
          name="UnitDetail"
          component={FieldUnitDetailScreen}
          options={{ title: "Detail Unit" }}
        />
        <FieldStack.Screen
          name="UpdateHistory"
          component={FieldUpdateHistoryScreen}
          options={{ title: "Riwayat Update" }}
        />
        <FieldStack.Screen
          name="ProjectSelect"
          component={ProjectSelectScreen}
          options={{ title: "Pilih Proyek" }}
        />
        <FieldStack.Screen
          name="UnitSelect"
          component={UnitSelectScreen}
          options={{ title: "Pilih Unit" }}
        />
        <FieldStack.Screen
          name="MilestoneList"
          component={MilestoneListScreen}
          options={{ title: "Daftar Milestone" }}
        />
        <FieldStack.Screen
          name="MilestoneUpdate"
          component={MilestoneUpdateScreen}
          options={{ title: "Update Milestone" }}
        />
        <FieldStack.Screen
          name="UnitDetailField"
          component={UnitDetailScreen}
          options={{ title: "Detail Unit" }}
        />
        <FieldStack.Screen
          name="PhotoCapture"
          component={PhotoCaptureScreen}
          options={{ title: "Ambil Foto" }}
        />
        <FieldStack.Screen
          name="IssueForm"
          component={IssueFormScreen}
          options={{ title: "Laporan Kendala" }}
        />
        <FieldStack.Screen
          name="UpdateHistoryField"
          component={UpdateHistoryScreen}
          options={{ title: "Riwayat Update" }}
        />
        <FieldStack.Screen
          name="IssueHistory"
          component={IssueHistoryScreen}
          options={{ title: "Riwayat Kendala" }}
        />
        <FieldStack.Screen
          name="Attendance"
          component={FieldAttendanceScreen}
          options={{ title: "Absensi" }}
        />
        <FieldStack.Screen
          name="AttendanceHistory"
          component={AttendanceHistoryScreen}
          options={{ title: "Riwayat Absensi" }}
        />
        <FieldStack.Screen
          name="ProjectDetail"
          component={ProjectDetailScreen}
          options={{ title: "Detail Proyek", headerShown: true, headerBackTitle: "Kembali" }}
        />
      </FieldStack.Navigator>
    );
  }

 function CustomerTabsNavigator(): React.JSX.Element {
    return (
       <CustomerStack.Navigator screenOptions={{ headerShown: false }}>
         <CustomerStack.Screen name="CustomerTabs">
           {() => (
             <CustomerTabs.Navigator
               id="customer-tabs"
               screenOptions={getCommonTabOptions()}
             >
               <CustomerTabs.Screen name="Beranda" options={tabOptions("home", "home-outline")}>
                 {() => <CustomerHomeScreen />}
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
           )}
         </CustomerStack.Screen>
         <CustomerStack.Screen
           name="PhotoGallery"
           component={PhotoGalleryScreen}
           options={{ title: "Galeri Foto" }}
         />
         <CustomerStack.Screen
           name="TicketDetail"
           component={TicketDetailScreen}
           options={{ title: "Detail Tiket" }}
         />
         <CustomerStack.Screen
           name="FaqContact"
           component={FaqContactScreen}
           options={{ title: "FAQ & Kontak" }}
         />
       </CustomerStack.Navigator>
     );
   }

 function ProjectManagerTabsNavigator(): React.JSX.Element {
    return (
       <ProjectManagerStack.Navigator screenOptions={{ headerShown: false }}>
         <ProjectManagerStack.Screen name="ProjectManagerTabs">
           {() => (
             <ProjectManagerTabs.Navigator
               id="project-manager-tabs"
               screenOptions={getCommonTabOptions()}
             >
               <ProjectManagerTabs.Screen name="Dashboard" options={tabOptions("grid", "grid-outline")}>
                 {() => <ProjectDashboardScreen />}
               </ProjectManagerTabs.Screen>
              <ProjectManagerTabs.Screen
                name="Approval"
                component={ApprovalScreen}
                options={tabOptions("checkbox", "checkbox-outline")}
              />
              <ProjectManagerTabs.Screen
                name="Team"
                component={TeamManagementScreen}
                options={tabOptions("people", "people-outline")}
              />
<ProjectManagerTabs.Screen
                  name="Laporan"
                  component={ProjectReportsScreen}
                  options={tabOptions("document", "document-outline")}
                />
              <ProjectManagerTabs.Screen
                name="Notifikasi"
                component={FieldNotificationsScreen}
                options={tabOptions("notifications", "notifications-outline")}
              />
            </ProjectManagerTabs.Navigator>
          )}
        </ProjectManagerStack.Screen>
        <ProjectManagerStack.Screen
          name="IssueHistory"
          component={IssueHistoryScreen}
          options={{ title: "Riwayat Kendala" }}
        />
        <ProjectManagerStack.Screen
          name="AttendanceHistory"
          component={AttendanceHistoryScreen}
          options={{ title: "Riwayat Absensi" }}
        />
<ProjectManagerStack.Screen
           name="TeamAttendance"
           component={TeamAttendanceScreen}
           options={{ title: "Absensi Tim" }}
         />
         <ProjectManagerStack.Screen name="FieldUnits" component={FieldUnitsScreen} />
         <ProjectManagerStack.Screen name="FieldUnitDetail" component={FieldUnitDetailScreen} options={{ title: "Detail Unit" }} />
         <ProjectManagerStack.Screen name="FieldMilestones" component={FieldMilestonesScreen} />
         <ProjectManagerStack.Screen name="MilestoneList" component={MilestoneListScreen} options={{ title: "Daftar Milestone" }} />
         <ProjectManagerStack.Screen name="FieldIssues" component={FieldIssuesScreen} options={{ title: "Kendala Lapangan" }} />
         <ProjectManagerStack.Screen name="FieldDailyReport" component={FieldDailyReportScreen} />
         <ProjectManagerStack.Screen name="FieldAttendance" component={FieldAttendanceScreen} />
         <ProjectManagerStack.Screen
           name="ProjectDetail"
           component={ProjectDetailScreen}
           options={{ title: "Detail Proyek", headerShown: true, headerBackTitle: "Kembali" }}
         />
       </ProjectManagerStack.Navigator>
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

     if (isProjectManagerRouteName(pendingRouteName)) {
       navigationRef.navigate(pendingRouteName as never);
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
         <CustomerTabsNavigator />
       ) : auth.user.role === "PROJECT_MANAGER" ? (
         <ProjectManagerTabsNavigator />
       ) : (
         <FieldTabsNavigator />
       )}
     </NavigationContainer>
   );
 }

 const styles = StyleSheet.create({
    bootWrap: {
       flex: 1,
       alignItems: "center",
       justifyContent: "center",
       backgroundColor: "#f8fafc",
       gap: 12,
     },
     bootText: {
       color: "#475569",
       fontSize: 14,
     },
 tabBar: {
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 16,
        height: 60,
        minHeight: 60,
        borderRadius: 16,
        borderTopWidth: 0,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        backgroundColor: "#ffffff",
        paddingTop: 6,
        paddingBottom: 6,
        shadowColor: "#0f172a",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 8,
      },
     tabLabel: {
       fontSize: 11,
       fontWeight: "600",
       marginBottom: 4,
     },
     tabItem: {
       borderRadius: 10,
       marginHorizontal: 2,
       minHeight: 56,
       minWidth: 56,
     },
    iconWrap: {
      width: 30,
      height: 24,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
    },
    iconWrapActive: {
      backgroundColor: "#e0f2fe",
    },
  });