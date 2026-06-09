export type Role = "CUSTOMER" | "SITE_ENGINEER" | "PROJECT_MANAGER";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
};

export type AuthState = {
  token: string;
  user: AuthUser;
};

export type ProjectSummary = {
  id: string;
  name: string;
  totalUnits: number;
  progress: number;
  milestoneDeadlineAlerts: number;
};

export type Unit = {
  id: string;
  projectId: string;
  code: string;
  typeName: string;
  status: string;
  progress: number;
};

export type MilestonePhoto = {
  id: string;
  url: string;
  caption: string;
  createdAt: string;
};

export type MilestoneChecklistItem = {
  id: string;
  milestoneId: string;
  name: string;
  description?: string;
  orderNo: number;
  isCompleted: boolean;
  completedAt?: string;
};

export type MilestoneLogItem = {
  id: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  note?: string;
  photoUrls: string[];
  createdAt: string;
};

export type Milestone = {
  id: string;
  unitId: string;
  name: string;
  category?: string;
  bobotPersentase?: number;
  orderNo: number;
  targetDate: string;
  actualDate?: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  note?: string;
  photos: MilestonePhoto[];
  checklist: MilestoneChecklistItem[];
  checklistCompleted: number;
  checklistTotal: number;
  logs?: MilestoneLogItem[];
};

export type IssueItem = {
  id: string;
  projectId: string;
  unitId?: string;
  title: string;
  description: string;
  category: "Kualitas Pekerjaan" | "Jadwal Molor" | "Cuaca" | "Akses Lokasi" | "Lainnya";
  urgency: "RENDAH" | "SEDANG" | "TINGGI" | "KRITIS";
  status: "BARU" | "SEDANG_DITANGANI" | "SELESAI";
  reporterName: string;
  recommendation?: string;
  photoUrls?: string[];
  createdAt: string;
};

export type NotificationItem = {
   id: string;
   role: Role;
   title: string;
   body: string;
   isRead: boolean;
   createdAt: string;
   type?: "issue_update" | "milestone_update" | "deadline_alert" | "payment_confirmed" | "document_ready";
   data?: {
     route?: string;
     unitId?: string;
     projectId?: string;
   };
};

export type InvoiceItem = {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: "BELUM_BAYAR" | "JATUH_TEMPO" | "TERLAMBAT" | "MENUNGGU_VERIFIKASI" | "LUNAS";
};

export type PaymentItem = {
  id: string;
  invoiceId: string;
  amount: number;
  method: "TRANSFER" | "VA" | "QRIS";
  status: "DIKONFIRMASI" | "MENUNGGU_VERIFIKASI";
  proofUrl?: string;
  paidAt: string;
};

export type BillingSummary = {
  totalPrice: number;
  paid: number;
  outstanding: number;
  paymentScheme: string;
  monthlyInstallment: number;
};

export type DocumentItem = {
  id: string;
  title: string;
  category: "Pra-pembelian" | "Transaksi" | "Kepemilikan" | "Serah Terima";
  status: "TERSEDIA" | "SEDANG_DIPROSES" | "BELUM_TERSEDIA";
  url?: string;
};

export type TicketItem = {
  id: string;
  category: "Progres" | "Kualitas Bangunan" | "Dokumen" | "Tagihan" | "Lainnya";
  subject: string;
  description: string;
  status: "BARU" | "SEDANG_DITANGANI" | "SELESAI" | "DITUTUP";
  photoUrls?: string[];
  createdAt: string;
  replies?: TicketReply[];
};

export type TicketReply = {
  id: string;
  ticketId: string;
  sender: string;
  senderRole: "CUSTOMER" | "CS_AGENT" | "ADMIN";
  message: string;
  createdAt: string;
  photoUrl?: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type CustomerOverview = {
  unit: Unit;
  nextInvoice?: InvoiceItem;
  unreadNotifications: number;
};

export type PendingQueueItem = {
  id: string;
  type: "MILESTONE_UPDATE";
  payload: {
    milestoneId: string;
    status: Milestone["status"];
    note?: string;
    photoUrl?: string;
    photoUrls?: string[];
  };
  createdAt: string;
};

export type AttendanceStatus = "HADIR" | "TERLAMBAT" | "IZIN" | "SAKIT" | "ALPHA";

export type AttendanceItem = {
  id: string;
  userId: string;
  userName: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: AttendanceStatus;
  notes?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  createdAt: string;
};

export type DailyReport = {
  id: string;
  userId: string;
  userName: string;
  date: string;
  projectId?: string;
  unitId?: string;
  summary: string;
  activities: string[];
  issues: string[];
  weather: "CERAH" | "MENDUNG" | "HUJAN" | "BADAI";
  temperature?: number;
  photoUrls: string[];
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AttendanceSummary = {
  totalDays: number;
  presentDays: number;
  lateDays: number;
  permissionDays: number;
  sickDays: number;
  alphaDays: number;
  attendanceRate: number;
};

export interface HandoverChecklistItem {
  id: string;
  label: string;
  description: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface HandoverInfo {
  unitId: string;
  plannedDate: string;
  actualDate?: string;
  status: 'SCHEDULED' | 'READY' | 'COMPLETED' | 'DELAYED';
  checklist: HandoverChecklistItem[];
};
