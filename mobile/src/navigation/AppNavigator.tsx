import React, { useCallback, useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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
import { InspectionUnitsScreen } from "../screens/pengawas/InspectionUnitsScreen";
import { InspectionDetailScreen } from "../screens/pengawas/InspectionDetailScreen";
import { AddDefectScreen } from "../screens/pengawas/AddDefectScreen";
import { MobilePushRouteName } from "../services/notifications";

const FIELD_ROUTES = {
  HOME: 'FieldHome',
  MILESTONE: 'FieldMilestone',
  UNIT: 'FieldUnit',
  KENDALA: 'FieldKendala',
  NOTIFIKASI: 'FieldNotifikasi',
} as const;

const FieldStack = createNativeStackNavigator<FieldStackParamList>();
const CustomerStack = createNativeStackNavigator<CustomerStackParamList>();
const ProjectManagerStack = createNativeStackNavigator<PengawasStackParamList>();

type FieldRouteName = "Beranda" | "FieldMilestone" | "FieldUnit" | "FieldKendala" | "FieldNotifikasi" | "UnitDetail" | "UpdateHistory" | "ProjectSelect" | "UnitSelect" | "MilestoneList" | "MilestoneUpdate" | "UnitDetailField" | "PhotoCapture" | "IssueForm" | "UpdateHistoryField" | "IssueHistory" | "Attendance" | "AttendanceHistory" | "ProjectDetail" | "FieldUnits" | "FieldMilestones" | "InspectionUnits" | "InspectionDetail" | "AddDefect";

type CustomerRouteName = "Beranda" | "Progres" | "Tagihan" | "Dokumen" | "Bantuan" | "PhotoGallery" | "TicketDetail" | "FaqContact";

type ProjectManagerRouteName = "Dashboard" | "Approval" | "Team" | "Laporan" | "Notifikasi" | "IssueHistory" | "AttendanceHistory" | "TeamAttendance" | "FieldUnits" | "FieldUnitDetail" | "FieldMilestones" | "MilestoneList" | "FieldIssues" | "FieldDailyReport" | "FieldAttendance" | "ProjectDetail" | "InspectionUnits" | "InspectionDetail" | "AddDefect";

const FIELD_ROUTE_NAMES: FieldRouteName[] = ["Beranda", "FieldMilestone", "FieldUnit", "FieldKendala", "FieldNotifikasi", "UnitDetail", "UpdateHistory", "ProjectSelect", "UnitSelect", "MilestoneList", "MilestoneUpdate", "UnitDetailField", "PhotoCapture", "IssueForm", "UpdateHistoryField", "IssueHistory", "Attendance", "AttendanceHistory", "ProjectDetail", "FieldUnits", "FieldMilestones", "InspectionUnits", "InspectionDetail", "AddDefect"];

const CUSTOMER_ROUTE_NAMES: CustomerRouteName[] = ["Beranda", "Progres", "Tagihan", "Dokumen", "Bantuan", "PhotoGallery", "TicketDetail", "FaqContact"];

const PROJECT_MANAGER_ROUTE_NAMES: ProjectManagerRouteName[] = ["Dashboard", "Approval", "Team", "Laporan", "Notifikasi", "IssueHistory", "AttendanceHistory", "TeamAttendance", "FieldUnits", "FieldUnitDetail", "FieldMilestones", "MilestoneList", "FieldIssues", "FieldDailyReport", "FieldAttendance", "ProjectDetail", "InspectionUnits", "InspectionDetail", "AddDefect"];

function BootSplash(): React.JSX.Element {
  return (
    <View style={styles.bootWrap}>
      <ActivityIndicator size="large" color="#f59e0b" />
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

function FieldNavigator(): React.JSX.Element {
   return (
      <FieldStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Beranda">
        <FieldStack.Screen name="Beranda" component={FieldHomeScreen} />
        <FieldStack.Screen name="FieldMilestone" component={MilestoneListScreen} />
        <FieldStack.Screen name="FieldUnit" component={UnitSelectScreen} />
        <FieldStack.Screen name="FieldKendala" component={IssueFormScreen} />
        <FieldStack.Screen name="FieldNotifikasi" component={FieldNotificationsScreen} />
        <FieldStack.Screen name="UnitDetail" component={FieldUnitDetailScreen} options={{ title: "Detail Unit" }} />
        <FieldStack.Screen name="UpdateHistory" component={FieldUpdateHistoryScreen} options={{ title: "Riwayat Update" }} />
        <FieldStack.Screen name="ProjectSelect" component={ProjectSelectScreen} options={{ title: "Pilih Proyek" }} />
        <FieldStack.Screen name="UnitSelect" component={UnitSelectScreen} options={{ title: "Pilih Unit" }} />
        <FieldStack.Screen name="MilestoneList" component={MilestoneListScreen} options={{ title: "Daftar Milestone" }} />
        <FieldStack.Screen name="MilestoneUpdate" component={MilestoneUpdateScreen} options={{ title: "Update Milestone" }} />
        <FieldStack.Screen name="UnitDetailField" component={UnitDetailScreen} options={{ title: "Detail Unit" }} />
        <FieldStack.Screen name="PhotoCapture" component={PhotoCaptureScreen} options={{ title: "Ambil Foto" }} />
        <FieldStack.Screen name="IssueForm" component={IssueFormScreen} options={{ title: "Laporan Kendala" }} />
        <FieldStack.Screen name="UpdateHistoryField" component={UpdateHistoryScreen} options={{ title: "Riwayat Update" }} />
        <FieldStack.Screen name="IssueHistory" component={IssueHistoryScreen} options={{ title: "Riwayat Kendala" }} />
        <FieldStack.Screen name="Attendance" component={FieldAttendanceScreen} options={{ title: "Absensi" }} />
        <FieldStack.Screen name="AttendanceHistory" component={AttendanceHistoryScreen} options={{ title: "Riwayat Absensi" }} />
        <FieldStack.Screen name="ProjectDetail" component={ProjectDetailScreen} options={{ title: "Detail Proyek", headerShown: true, headerBackTitle: "Kembali" }} />
        <FieldStack.Screen name="FieldUnits" component={FieldUnitsScreen} options={{ title: "Daftar Unit" }} />
        <FieldStack.Screen name="FieldMilestones" component={FieldMilestonesScreen} options={{ title: "Update Milestone" }} />
        <FieldStack.Screen name="InspectionUnits" component={InspectionUnitsScreen} options={{ title: "Daftar Unit Inspeksi" }} />
        <FieldStack.Screen name="InspectionDetail" component={InspectionDetailScreen} options={{ title: "Detail Inspeksi" }} />
        <FieldStack.Screen name="AddDefect" component={AddDefectScreen} options={{ title: "Lapor Komplain" }} />
      </FieldStack.Navigator>
    );
}

function CustomerNavigator(): React.JSX.Element {
  return (
    <CustomerStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Beranda">
      <CustomerStack.Screen name="Beranda" component={CustomerHomeScreen} />
      <CustomerStack.Screen name="Progres" component={CustomerProgressScreen} />
      <CustomerStack.Screen name="Tagihan" component={CustomerBillingScreen} />
      <CustomerStack.Screen name="Dokumen" component={CustomerDocumentsScreen} />
      <CustomerStack.Screen name="Bantuan" component={CustomerSupportScreen} />
      <CustomerStack.Screen name="PhotoGallery" component={PhotoGalleryScreen} options={{ title: "Galeri Foto" }} />
      <CustomerStack.Screen name="TicketDetail" component={TicketDetailScreen} options={{ title: "Detail Tiket" }} />
      <CustomerStack.Screen name="FaqContact" component={FaqContactScreen} options={{ title: "FAQ & Kontak" }} />
    </CustomerStack.Navigator>
  );
}

function ProjectManagerNavigator(): React.JSX.Element {
  return (
    <ProjectManagerStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Dashboard">
      <ProjectManagerStack.Screen name="Dashboard" component={ProjectDashboardScreen} />
      <ProjectManagerStack.Screen name="Approval" component={ApprovalScreen} />
      <ProjectManagerStack.Screen name="Team" component={TeamManagementScreen} />
      <ProjectManagerStack.Screen name="Laporan" component={ProjectReportsScreen} />
      <ProjectManagerStack.Screen name="Notifikasi" component={FieldNotificationsScreen} />
      <ProjectManagerStack.Screen name="IssueHistory" component={IssueHistoryScreen} options={{ title: "Riwayat Kendala" }} />
      <ProjectManagerStack.Screen name="AttendanceHistory" component={AttendanceHistoryScreen} options={{ title: "Riwayat Absensi" }} />
      <ProjectManagerStack.Screen name="TeamAttendance" component={TeamAttendanceScreen} options={{ title: "Absensi Tim" }} />
      <ProjectManagerStack.Screen name="FieldUnits" component={FieldUnitsScreen} />
      <ProjectManagerStack.Screen name="FieldUnitDetail" component={FieldUnitDetailScreen} options={{ title: "Detail Unit" }} />
      <ProjectManagerStack.Screen name="FieldMilestones" component={FieldMilestonesScreen} />
      <ProjectManagerStack.Screen name="MilestoneList" component={MilestoneListScreen} options={{ title: "Daftar Milestone" }} />
      <ProjectManagerStack.Screen name="FieldIssues" component={FieldIssuesScreen} options={{ title: "Kendala Lapangan" }} />
      <ProjectManagerStack.Screen name="FieldDailyReport" component={FieldDailyReportScreen} />
      <ProjectManagerStack.Screen name="FieldAttendance" component={FieldAttendanceScreen} />
      <ProjectManagerStack.Screen name="ProjectDetail" component={ProjectDetailScreen} options={{ title: "Detail Proyek", headerShown: true, headerBackTitle: "Kembali" }} />
      <ProjectManagerStack.Screen name="InspectionUnits" component={InspectionUnitsScreen} options={{ title: "Daftar Unit Inspeksi" }} />
      <ProjectManagerStack.Screen name="InspectionDetail" component={InspectionDetailScreen} options={{ title: "Detail Inspeksi" }} />
      <ProjectManagerStack.Screen name="AddDefect" component={AddDefectScreen} options={{ title: "Lapor Komplain" }} />
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
         <CustomerNavigator />
       ) : auth.user.role === "PROJECT_MANAGER" ? (
         <ProjectManagerNavigator />
       ) : (
         <FieldNavigator />
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
 });