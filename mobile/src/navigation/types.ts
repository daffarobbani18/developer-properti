import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { MilestonePhoto, Milestone } from "../types";

export type FieldStackParamList = {
  Beranda: { screen: string; params?: any } | undefined;
  FieldNotifikasi: undefined;
  UpdateHistory: { milestoneId: string; milestoneName: string };
  UnitDetail: { unitId: string; unitName: string };
  FieldDailyReport: undefined;
  ProjectDetail: { projectId: string; projectName: string };
  FieldUnits: { projectId?: string } | undefined;
  FieldMilestones: { projectId?: string; unitId?: string } | undefined;
  InspectionUnits: undefined;
  InspectionDetail: { bookingId: string; unitName: string };
  AddDefect: { bookingId: string };
};

export type CustomerStackParamList = {
  Beranda: { screen: string; params?: any } | undefined;
  Progres: undefined;
  Tagihan: undefined;
  Dokumen: undefined;
  Bantuan: undefined;
  CustomerNotifikasi: undefined;
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
  Dashboard: undefined;
  Approval: undefined;
  Team: undefined;
  Laporan: undefined;
  Notifikasi: undefined;

  ProjectDashboard: undefined;
  TeamManagement: undefined;
  FieldNotifications: undefined;
  ProjectReports: undefined;
  FieldUnits: { projectId?: string } | undefined;
  FieldMilestones: { projectId?: string; unitId?: string } | undefined;
  FieldDailyReport: undefined;
  ProjectDetail: { projectId: string; projectName: string };
  InspectionUnits: undefined;
  InspectionDetail: { bookingId: string; unitName: string };
  AddDefect: { bookingId: string };
};