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
  status: "NOT_STARTED" | "IN_PROGRESS" | "DONE";
  progress: number;
};

export type MilestonePhoto = {
  id: string;
  url: string;
  caption: string;
  createdAt: string;
};

export type Milestone = {
  id: string;
  unitId: string;
  name: string;
  orderNo: number;
  targetDate: string;
  actualDate?: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  note?: string;
  photos: MilestonePhoto[];
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
  createdAt: string;
};

export type NotificationItem = {
  id: string;
  role: Role;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
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
  createdAt: string;
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
  };
  createdAt: string;
};
