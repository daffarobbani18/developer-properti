import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { MilestonePhoto, Milestone } from "../types";

export type FieldStackParamList = {
  FieldTabs: undefined;
  UnitDetail: { unitId: string; unitCode?: string; unitName?: string };
  UpdateHistory: undefined;
  ProjectSelect: undefined;
  UnitSelect: undefined;
  MilestoneList: { unitId: string; unitCode?: string; unitName?: string };
  MilestoneUpdate: {
    milestoneId: string;
    milestoneName?: string;
    currentStatus?: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
    milestone?: Milestone;
  };
  UnitDetailField: { unitId: string; unitCode?: string; unitName?: string };
  PhotoCapture: Record<string, never> | undefined;
  IssueForm: { projectId?: string };
  UpdateHistoryField: undefined;
  IssueHistory: undefined;
  Attendance: undefined;
  AttendanceHistory: undefined;
};

export type CustomerStackParamList = {
  CustomerTabs: undefined;
  PhotoGallery: {
    photos: MilestonePhoto[];
    initialIndex?: number;
    title?: string;
    milestoneName?: string;
  };
  TicketDetail: { ticketId: string };
  FaqContact: undefined;
};

export type PengawasStackParamList = {
  ProjectManagerTabs: undefined;
  IssueHistory: undefined;
  AttendanceHistory: undefined;
  TeamAttendance: undefined;
  ProjectDashboard: undefined;
  Approval: undefined;
  TeamManagement: undefined;
  FieldNotifications: undefined;
  ProjectReports: undefined;
  FieldUnits: undefined;
  FieldUnitDetail: { unitId: string; unitName: string };
  FieldMilestones: undefined;
  MilestoneList: { unitId: string; unitName: string };
  FieldIssues: undefined;
  FieldDailyReport: undefined;
  FieldAttendance: undefined;
};

export type MilestoneUpdateScreenProps = NativeStackScreenProps<FieldStackParamList, "MilestoneUpdate">;
export type PhotoGalleryScreenProps = NativeStackScreenProps<CustomerStackParamList, "PhotoGallery">;
export type FieldUnitDetailScreenProps = NativeStackScreenProps<FieldStackParamList, "UnitDetail">;