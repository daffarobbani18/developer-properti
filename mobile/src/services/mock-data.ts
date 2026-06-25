import { AuthState, BillingSummary, CustomerOverview, DailyReport, DocumentItem, FaqItem, HandoverInfo, InvoiceItem, Milestone, NotificationItem, PaymentItem, PendingQueueItem, ProjectSummary, Role, TicketItem, Unit } from "../types";
type MockUserSeed = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  password: string;
};
const mockUsers: MockUserSeed[] = [{
  id: "u-engineer-1",
  fullName: "Rizky Wahyudi",
  email: "spv@erp.com",
  role: "SITE_ENGINEER",
  password: "password123"
}, {
  id: "u-pm-1",
  fullName: "Dimas Satria",
  email: "pm@erp.com",
  role: "SITE_ENGINEER",
  password: "password123"
}, {
  id: "u-customer-1",
  fullName: "Alya Puspita",
  email: "customer@erp.com",
  role: "CUSTOMER",
  password: "password123"
}];
export const demoCredentials = mockUsers.map(item => ({
  role: item.role,
  email: item.email,
  password: item.password
}));
const projects: Array<{
  id: string;
  name: string;
}> = [{
  id: "project-1",
  name: "Cluster Magnolia"
}, {
  id: "project-2",
  name: "Cluster Azalea"
}];
const units: Unit[] = [{
  id: "unit-1",
  projectId: "project-1",
  code: "MG-A12",
  typeName: "Tipe 45/90",
  status: "IN_PROGRESS",
  progress: 65
}, {
  id: "unit-2",
  projectId: "project-1",
  code: "MG-B03",
  typeName: "Tipe 54/120",
  status: "IN_PROGRESS",
  progress: 42
}, {
  id: "unit-3",
  projectId: "project-2",
  code: "AZ-C07",
  typeName: "Tipe 60/150",
  status: "DONE",
  progress: 100
}, {
  id: "unit-4",
  projectId: "project-2",
  code: "AZ-A01",
  typeName: "Tipe 45/90",
  status: "NOT_STARTED",
  progress: 0
}];
const milestones: Milestone[] = [{
  id: "mil-1",
  unitId: "unit-1",
  name: "Pondasi",
  orderNo: 1,
  targetDate: "2026-03-10",
  actualDate: "2026-03-09",
  status: "COMPLETED",
  note: "Selesai sesuai gambar kerja",
  photos: [{
    id: "photo-1",
    url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5",
    caption: "Pondasi sisi depan",
    createdAt: "2026-03-09T08:00:00.000Z"
  }],
  checklist: [{
    id: "check-1-1",
    milestoneId: "mil-1",
    name: "Pembersihan lahan",
    description: "Bersihkan area pondasi",
    orderNo: 1,
    isCompleted: true,
    completedAt: "2026-03-01T09:00:00.000Z"
  }, {
    id: "check-1-2",
    milestoneId: "mil-1",
    name: "Pemasangan formwork",
    description: "Pasang formwork pondasi",
    orderNo: 2,
    isCompleted: true,
    completedAt: "2026-03-02T10:00:00.000Z"
  }, {
    id: "check-1-3",
    milestoneId: "mil-1",
    name: "Pengecoran beton",
    description: "Lakukan pengecoran pondasi",
    orderNo: 3,
    isCompleted: true,
    completedAt: "2026-03-08T15:00:00.000Z"
  }, {
    id: "check-1-4",
    milestoneId: "mil-1",
    name: "Pelelehan dan pengecekan",
    description: "Pelelehan beton selama 7 hari",
    orderNo: 4,
    isCompleted: true,
    completedAt: "2026-03-09T08:00:00.000Z"
  }],
  checklistCompleted: 4,
  checklistTotal: 4
}, {
  id: "mil-2",
  unitId: "unit-1",
  name: "Struktur",
  orderNo: 2,
  targetDate: "2026-03-28",
  actualDate: "2026-03-30",
  status: "IN_PROGRESS",
  note: "Pengecoran lantai 1 berjalan",
  photos: [{
    id: "photo-2",
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd",
    caption: "Balok dan kolom",
    createdAt: "2026-03-27T08:00:00.000Z"
  }],
  checklist: [{
    id: "check-2-1",
    milestoneId: "mil-2",
    name: "Pemasangan kolom",
    description: "Pasang kolom utama struktur",
    orderNo: 1,
    isCompleted: true,
    completedAt: "2026-03-15T10:00:00.000Z"
  }, {
    id: "check-2-2",
    milestoneId: "mil-2",
    name: "Pemasangan balok",
    description: "Pasang balok pelat lantai",
    orderNo: 2,
    isCompleted: true,
    completedAt: "2026-03-20T14:00:00.000Z"
  }, {
    id: "check-2-3",
    milestoneId: "mil-2",
    name: "Pengecoran plat lantai 1",
    description: "Lakukan pengecoran plat lantai 1",
    orderNo: 3,
    isCompleted: true,
    completedAt: "2026-03-25T11:00:00.000Z"
  }, {
    id: "check-2-4",
    milestoneId: "mil-2",
    name: "Pelelehan struktur",
    description: "Waktu pelelehan 7 hari",
    orderNo: 4,
    isCompleted: false
  }, {
    id: "check-2-5",
    milestoneId: "mil-2",
    name: "Pemasangan plat lantai 2",
    description: "Pasang dan cor plat lantai 2",
    orderNo: 5,
    isCompleted: false
  }],
  checklistCompleted: 3,
  checklistTotal: 5
}, {
  id: "mil-3",
  unitId: "unit-1",
  name: "Dinding",
  orderNo: 3,
  targetDate: "2026-04-16",
  status: "NOT_STARTED",
  photos: [],
  checklist: [{
    id: "check-3-1",
    milestoneId: "mil-3",
    name: "Pemasangan kuda-kuda",
    description: "Pasang kuda-kuda dinding",
    orderNo: 1,
    isCompleted: false
  }, {
    id: "check-3-2",
    milestoneId: "mil-3",
    name: "Pemasangan briksan",
    description: "Pasang briksan dinding bagian dalam",
    orderNo: 2,
    isCompleted: false
  }, {
    id: "check-3-3",
    milestoneId: "mil-3",
    name: "Pasangan dinding luar",
    description: "Pasang dinding bagian luar",
    orderNo: 3,
    isCompleted: false
  }, {
    id: "check-3-4",
    milestoneId: "mil-3",
    name: "Pengecatan dinding",
    description: "Lakukan pengecatan dinding",
    orderNo: 4,
    isCompleted: false
  }],
  checklistCompleted: 0,
  checklistTotal: 4
}, {
  id: "mil-4",
  unitId: "unit-1",
  name: "Finishing",
  orderNo: 4,
  targetDate: "2026-05-10",
  status: "NOT_STARTED",
  photos: [],
  checklist: [{
    id: "check-4-1",
    milestoneId: "mil-4",
    name: "Plester dan acian",
    description: "Lakukan plester dinding",
    orderNo: 1,
    isCompleted: false
  }, {
    id: "check-4-2",
    milestoneId: "mil-4",
    name: "Pemasangan keramik",
    description: "Pasang keramik lantai dan dinding",
    orderNo: 2,
    isCompleted: false
  }, {
    id: "check-4-3",
    milestoneId: "mil-4",
    name: "Pemasangan plafon",
    description: "Pasang plafon gypsum",
    orderNo: 3,
    isCompleted: false
  }, {
    id: "check-4-4",
    milestoneId: "mil-4",
    name: "Pemasangan sanitair",
    description: "Pasang water heater, closet, wastafel",
    orderNo: 4,
    isCompleted: false
  }, {
    id: "check-4-5",
    milestoneId: "mil-4",
    name: "Pemasangan listrik",
    description: "Pasang listrik temporary dan permanen",
    orderNo: 5,
    isCompleted: false
  }, {
    id: "check-4-6",
    milestoneId: "mil-4",
    name: "Cat dan finishing akhir",
    description: "Lakukan pengecetan akhir",
    orderNo: 6,
    isCompleted: false
  }],
  checklistCompleted: 0,
  checklistTotal: 6
}, {
  id: "mil-5",
  unitId: "unit-2",
  name: "Pondasi",
  orderNo: 1,
  targetDate: "2026-03-15",
  status: "COMPLETED",
  photos: [],
  checklist: [{
    id: "check-5-1",
    milestoneId: "mil-5",
    name: "Pembersihan lahan",
    description: "Bersihkan area pondasi",
    orderNo: 1,
    isCompleted: true,
    completedAt: "2026-03-05T09:00:00.000Z"
  }, {
    id: "check-5-2",
    milestoneId: "mil-5",
    name: "Pemasangan formwork",
    description: "Pasang formwork pondasi",
    orderNo: 2,
    isCompleted: true,
    completedAt: "2026-03-08T10:00:00.000Z"
  }, {
    id: "check-5-3",
    milestoneId: "mil-5",
    name: "Pengecoran beton",
    description: "Lakukan pengecoran pondasi",
    orderNo: 3,
    isCompleted: true,
    completedAt: "2026-03-12T15:00:00.000Z"
  }, {
    id: "check-5-4",
    milestoneId: "mil-5",
    name: "Pelelehan dan pengecekan",
    description: "Pelelehan beton selama 7 hari",
    orderNo: 4,
    isCompleted: true,
    completedAt: "2026-03-15T08:00:00.000Z"
  }],
  checklistCompleted: 4,
  checklistTotal: 4
}, {
  id: "mil-6",
  unitId: "unit-2",
  name: "Struktur",
  orderNo: 2,
  targetDate: "2026-04-05",
  status: "IN_PROGRESS",
  photos: [],
  checklist: [{
    id: "check-6-1",
    milestoneId: "mil-6",
    name: "Pemasangan kolom",
    description: "Pasang kolom utama struktur",
    orderNo: 1,
    isCompleted: true,
    completedAt: "2026-03-18T10:00:00.000Z"
  }, {
    id: "check-6-2",
    milestoneId: "mil-6",
    name: "Pemasangan balok",
    description: "Pasang balok pelat lantai",
    orderNo: 2,
    isCompleted: true,
    completedAt: "2026-03-22T14:00:00.000Z"
  }, {
    id: "check-6-3",
    milestoneId: "mil-6",
    name: "Pengecoran plat lantai 1",
    description: "Lakukan pengecoran plat lantai 1",
    orderNo: 3,
    isCompleted: false
  }, {
    id: "check-6-4",
    milestoneId: "mil-6",
    name: "Pemasangan plat lantai 2",
    description: "Pasang dan cor plat lantai 2",
    orderNo: 4,
    isCompleted: false
  }],
  checklistCompleted: 2,
  checklistTotal: 4
}, {
  id: "mil-7",
  unitId: "unit-3",
  name: "Serah Terima",
  orderNo: 1,
  targetDate: "2026-02-01",
  actualDate: "2026-01-28",
  status: "COMPLETED",
  photos: [],
  checklist: [{
    id: "check-7-1",
    milestoneId: "mil-7",
    name: "Pengecekan akhir",
    description: "Pengecekan semua instalasi",
    orderNo: 1,
    isCompleted: true,
    completedAt: "2026-01-25T09:00:00.000Z"
  }, {
    id: "check-7-2",
    milestoneId: "mil-7",
    name: "Pembersihan akhir",
    description: "Pembersihan unit serta lokasi",
    orderNo: 2,
    isCompleted: true,
    completedAt: "2026-01-26T10:00:00.000Z"
  }, {
    id: "check-7-3",
    milestoneId: "mil-7",
    name: "BAST serah terima",
    description: "Tanda tangan berita acara serah terima",
    orderNo: 3,
    isCompleted: true,
    completedAt: "2026-01-28T14:00:00.000Z"
  }],
  checklistCompleted: 3,
  checklistTotal: 3
}, {
  id: "mil-8",
  unitId: "unit-4",
  name: "Persiapan Lahan",
  orderNo: 1,
  targetDate: "2026-04-20",
  status: "NOT_STARTED",
  photos: [],
  checklist: [{
    id: "check-8-1",
    milestoneId: "mil-8",
    name: "Pemetaan lahan",
    description: "Pemetaan dan stake out lahan",
    orderNo: 1,
    isCompleted: false
  }, {
    id: "check-8-2",
    milestoneId: "mil-8",
    name: "Pembersihan lahan",
    description: "Pembersihan vegetasi",
    orderNo: 2,
    isCompleted: false
  }, {
    id: "check-8-3",
    milestoneId: "mil-8",
    name: "Pemasangan pagar sementara",
    description: "Pasang pagar untuk menandai area",
    orderNo: 3,
    isCompleted: false
  }],
  checklistCompleted: 0,
  checklistTotal: 3
}];
const notifications: NotificationItem[] = [{
  id: "notif-1",
  role: "SITE_ENGINEER",
  title: "Deadline Struktur Unit MG-A12",
  body: "Target struktur Unit MG-A12 melewati 2 hari dari rencana.",
  isRead: false,
  createdAt: "2026-04-09T02:00:00.000Z"
}, {
  id: "notif-2",
  role: "SITE_ENGINEER",
  title: "Kekurangan material prioritas tinggi",
  body: "Kekurangan material besi pada Cluster Magnolia perlu keputusan vendor.",
  isRead: false,
  createdAt: "2026-04-09T04:00:00.000Z"
}, {
  id: "notif-3",
  role: "CUSTOMER",
  title: "Foto progres terbaru tersedia",
  body: "Ada pembaruan foto progres untuk Unit MG-A12.",
  isRead: false,
  createdAt: "2026-04-09T07:00:00.000Z"
}, {
  id: "notif-4",
  role: "CUSTOMER",
  title: "Tagihan Termin 3 jatuh tempo",
  body: "Tagihan Termin 3 jatuh tempo dalam 5 hari.",
  isRead: true,
  createdAt: "2026-04-07T01:00:00.000Z"
}];
const billingSummary: BillingSummary = {
  totalPrice: 825_000_000,
  paid: 500_000_000,
  outstanding: 325_000_000,
  paymentScheme: "KPR Bertahap 24 Bulan",
  monthlyInstallment: 13_500_000
};
const invoices: InvoiceItem[] = [{
  id: "inv-1",
  name: "Termin 1",
  amount: 250_000_000,
  dueDate: "2026-01-10",
  status: "LUNAS"
}, {
  id: "inv-2",
  name: "Termin 2",
  amount: 250_000_000,
  dueDate: "2026-03-10",
  status: "LUNAS"
}, {
  id: "inv-3",
  name: "Termin 3",
  amount: 150_000_000,
  dueDate: "2026-04-15",
  status: "JATUH_TEMPO"
}, {
  id: "inv-4",
  name: "Termin 4",
  amount: 175_000_000,
  dueDate: "2026-06-15",
  status: "BELUM_BAYAR"
}];
const payments: PaymentItem[] = [{
  id: "pay-1",
  invoiceId: "inv-1",
  amount: 250_000_000,
  method: "TRANSFER",
  status: "DIKONFIRMASI",
  paidAt: "2026-01-08T09:00:00.000Z"
}, {
  id: "pay-2",
  invoiceId: "inv-2",
  amount: 250_000_000,
  method: "VA",
  status: "DIKONFIRMASI",
  paidAt: "2026-03-09T14:20:00.000Z"
}];
const documents: DocumentItem[] = [{
  id: "doc-1",
  title: "SPK Unit MG-A12",
  category: "Pra-pembelian",
  status: "TERSEDIA",
  url: "https://example.com/docs/spk-mg-a12.pdf"
}, {
  id: "doc-2",
  title: "Kwitansi Termin 1",
  category: "Transaksi",
  status: "TERSEDIA",
  url: "https://example.com/docs/kwitansi-termin-1.pdf"
}, {
  id: "doc-3",
  title: "AJB",
  category: "Kepemilikan",
  status: "SEDANG_DIPROSES"
}, {
  id: "doc-4",
  title: "BAST",
  category: "Serah Terima",
  status: "BELUM_TERSEDIA"
}];
const tickets: TicketItem[] = [{
  id: "ticket-1",
  category: "Progres",
  subject: "Konfirmasi jadwal pengecatan",
  description: "Mohon info estimasi jadwal pengecatan interior.",
  status: "DIPROSES",
  hasUnreadReplies: true,
  createdAt: "2026-04-02T08:30:00.000Z"
}, {
  id: "ticket-2",
  category: "Tagihan",
  subject: "Kebutuhan invoice termin 3",
  description: "Mohon kirimkan invoice resmi termin 3 beserta nomor VA.",
  status: "SELESAI",
  createdAt: "2026-03-20T10:00:00.000Z"
}];
const faq: FaqItem[] = [{
  id: "faq-1",
  question: "Kapan saya menerima update progres?",
  answer: "Update progres dikirim minimal mingguan, atau saat milestone penting tercapai."
}, {
  id: "faq-2",
  question: "Bagaimana cara mengunggah bukti pembayaran?",
  answer: "Masuk ke menu Tagihan, pilih invoice, isi URL bukti transfer, lalu kirim untuk verifikasi."
}, {
  id: "faq-3",
  question: "Dokumen legal kapan bisa diunduh?",
  answer: "Dokumen legal dapat diunduh setelah status dokumen berubah menjadi Tersedia di menu Dokumen."
}];
function clone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}
function buildToken(seed: MockUserSeed): string {
  return `mock-token-${seed.role.toLowerCase()}-${seed.id}`;
}
function toAuthState(seed: MockUserSeed): AuthState {
  return {
    token: buildToken(seed),
    user: {
      id: seed.id,
      fullName: seed.fullName,
      email: seed.email,
      role: seed.role
    }
  };
}
export function authenticateMock(email: string, password: string): AuthState | null {
  const found = mockUsers.find(item => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password);
  if (!found) {
    return null;
  }
  return toAuthState(found);
}
export function getProjects(): Array<{
  id: string;
  name: string;
}> {
  return clone(projects);
}
export function getProjectSummaries(): ProjectSummary[] {
  const now = new Date();
  return projects.map(project => {
    const projectUnits = units.filter(unit => unit.projectId === project.id);
    const totalUnits = projectUnits.length;
    const progress = totalUnits === 0 ? 0 : Math.round(projectUnits.reduce((acc, item) => acc + item.progress, 0) / totalUnits);
    const deadlineAlerts = milestones.filter(milestone => {
      if (milestone.status === "COMPLETED") {
        return false;
      }
      const belongsToProject = projectUnits.some(unit => unit.id === milestone.unitId);
      return belongsToProject && new Date(milestone.targetDate).getTime() < now.getTime();
    }).length;
    return {
      id: project.id,
      name: project.name,
      totalUnits,
      progress,
      milestoneDeadlineAlerts: deadlineAlerts
    };
  });
}
export function getUnits(projectId?: string, search?: string): Unit[] {
  let filtered = units;
  if (projectId) {
    filtered = filtered.filter(item => item.projectId === projectId);
  }
  if (search?.trim()) {
    const keyword = search.trim().toLowerCase();
    filtered = filtered.filter(item => item.code.toLowerCase().includes(keyword) || item.typeName.toLowerCase().includes(keyword));
  }
  return clone(filtered);
}
export function getMilestones(unitId: string): Milestone[] {
  return clone(milestones.filter(item => item.unitId === unitId).sort((a, b) => a.orderNo - b.orderNo));
}
export function updateMilestone(params: {
  milestoneId: string;
  status: Milestone["status"];
  note?: string;
  photoUrl?: string;
  photoUrls?: string[];
}): Milestone {
  const target = milestones.find(item => item.id === params.milestoneId);
  if (!target) {
    throw new Error("Milestone tidak ditemukan");
  }
  target.status = params.status;
  target.note = params.note ?? target.note;
  if (params.status === "COMPLETED" && !target.actualDate) {
    target.actualDate = new Date().toISOString().slice(0, 10);
  }
  if (params.photoUrl?.trim()) {
    target.photos.push({
      id: `photo-${Date.now()}`,
      url: params.photoUrl.trim(),
      caption: "Upload dari aplikasi mobile",
      createdAt: new Date().toISOString()
    });
  }
  if (params.photoUrls?.length) {
    params.photoUrls.filter(item => item.trim().length > 0).forEach(uri => {
      target.photos.push({
        id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        url: uri,
        caption: "Upload multi-foto dari aplikasi mobile",
        createdAt: new Date().toISOString()
      });
    });
  }
  const unitMilestones = milestones.filter(item => item.unitId === target.unitId);
  const completedCount = unitMilestones.filter(item => item.status === "COMPLETED").length;
  const unitProgress = Math.round(completedCount / Math.max(unitMilestones.length, 1) * 100);
  const relatedUnit = units.find(item => item.id === target.unitId);
  if (relatedUnit) {
    relatedUnit.progress = unitProgress;
    relatedUnit.status = unitProgress === 100 ? "DONE" : unitProgress === 0 ? "NOT_STARTED" : "IN_PROGRESS";
  }
  return clone(target);
}
export function getNotifications(role: Role): NotificationItem[] {
  return clone(notifications.filter(item => item.role === role).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
}
export function markNotificationsRead(role: Role): NotificationItem[] {
  notifications.forEach(item => {
    if (item.role === role) {
      item.isRead = true;
    }
  });
  return getNotifications(role);
}
export function getCustomerOverview(): CustomerOverview {
  const customerUnit = units.find(item => item.id === "unit-1") ?? units[0];
  const nextInvoice = invoices.find(item => item.status !== "LUNAS");
  const unreadNotifications = notifications.filter(item => item.role === "CUSTOMER" && !item.isRead).length;
  const activeTickets = tickets.filter(item => item.status === "BARU" || item.status === "DIPROSES" || item.status === "MENUNGGU_TINDAKAN_CUSTOMER");
  return clone({
    unit: customerUnit,
    nextInvoice,
    unreadNotifications,
    activeTickets
  });
}
export function getCustomerProgress(): Milestone[] {
  const customerUnit = units.find(item => item.id === "unit-1") ?? units[0];
  return getMilestones(customerUnit.id);
}
export function getBillingData(): {
  summary: BillingSummary;
  invoices: InvoiceItem[];
  payments: PaymentItem[];
} {
  return clone({
    summary: billingSummary,
    invoices,
    payments
  });
}
export function uploadPaymentProof(payload: {
  invoiceId: string;
  amount: number;
  proofUrl: string;
}): PaymentItem {
  const invoice = invoices.find(item => item.id === payload.invoiceId);
  if (!invoice) {
    throw new Error("Invoice tidak ditemukan");
  }
  invoice.status = "MENUNGGU_VERIFIKASI";
  const newPayment: PaymentItem = {
    id: `pay-${Date.now()}`,
    invoiceId: payload.invoiceId,
    amount: payload.amount,
    method: "TRANSFER",
    status: "MENUNGGU_VERIFIKASI",
    proofUrl: payload.proofUrl,
    paidAt: new Date().toISOString()
  };
  payments.unshift(newPayment);
  notifications.unshift({
    id: `notif-${Date.now()}`,
    role: "CUSTOMER",
    title: "Bukti pembayaran diterima",
    body: "Bukti pembayaran Anda sedang menunggu verifikasi tim finance.",
    isRead: false,
    createdAt: new Date().toISOString()
  });
  return clone(newPayment);
}
export function getDocuments(): DocumentItem[] {
  return clone(documents);
}
export function getSupportData(): {
  tickets: TicketItem[];
  faq: FaqItem[];
} {
  return clone({
    tickets: tickets.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    faq
  });
}
export function createTicket(payload: {
  category: TicketItem["category"];
  subject: string;
  description: string;
  photoUrls?: string[];
}): TicketItem {
  const ticket: TicketItem = {
    id: `ticket-${Date.now()}`,
    category: payload.category,
    subject: payload.subject,
    description: payload.description,
    status: "BARU",
    photoUrls: payload.photoUrls,
    createdAt: new Date().toISOString(),
    replies: []
  };
  tickets.unshift(ticket);
  notifications.unshift({
    id: `notif-${Date.now()}`,
    role: "CUSTOMER",
    title: "Tiket bantuan dibuat",
    body: `Tiket "${payload.subject}" berhasil dibuat dan menunggu respon tim.`,
    isRead: false,
    createdAt: new Date().toISOString()
  });
  return clone(ticket);
}
export function replyToTicket(payload: {
  ticketId: string;
  message: string;
  photoUrls?: string[];
}): TicketItem {
  const ticket = tickets.find(t => t.id === payload.ticketId);
  if (!ticket) {
    throw new Error("Tiket tidak ditemukan");
  }
  const reply = {
    id: `reply-${Date.now()}`,
    ticketId: payload.ticketId,
    sender: "Anda",
    senderRole: "CUSTOMER" as const,
    message: payload.message,
    createdAt: new Date().toISOString(),
    photoUrl: payload.photoUrls?.[0]
  };
  if (!ticket.replies) {
    ticket.replies = [];
  }
  ticket.replies.push(reply);
  ticket.status = "DIPROSES";
  ticket.hasUnreadReplies = false;
  return clone(ticket);
}
export function markTicketAsRead(ticketId: string): void {
  const ticket = tickets.find(t => t.id === ticketId);
  if (ticket) {
    ticket.hasUnreadReplies = false;
  }
}
export function queueItemTemplate(payload: PendingQueueItem["payload"]): PendingQueueItem {
  return {
    id: `queue-${Date.now()}`,
    type: "MILESTONE_UPDATE",
    payload,
    createdAt: new Date().toISOString()
  };
}
const dailyReports: DailyReport[] = [{
  id: "dr-1",
  userId: "u-engineer-1",
  userName: "Rizky Wahyudi",
  date: "2026-05-16",
  projectId: "project-1",
  summary: "Progres struktur lantai 2 Unit MG-A12 mencapai 75%",
  activities: ["Pemeriksaan pondasi blok A", "Quality check pengecoran balok", "Koordinasi dengan mandor kontraktor"],
  issues: [],
  weather: "CERAH",
  temperature: 32,
  photoUrls: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd"],
  isDraft: false,
  createdAt: "2026-05-16T17:30:00.000Z",
  updatedAt: "2026-05-16T17:30:00.000Z"
}, {
  id: "dr-2",
  userId: "u-engineer-1",
  userName: "Rizky Wahyudi",
  date: "2026-05-15",
  projectId: "project-1",
  summary: "Pengerjaan struktur lantai 2 selesai 50%",
  activities: ["Pengawasan pengecoran kolom K-12", "Cek mutu beton", "Laporan material"],
  issues: [],
  weather: "MENDUNG",
  temperature: 28,
  photoUrls: [],
  isDraft: false,
  createdAt: "2026-05-15T17:00:00.000Z",
  updatedAt: "2026-05-15T17:00:00.000Z"
}];
export function getDailyReports(userId: string, params?: {
  month?: string;
  includeDraft?: boolean;
}): DailyReport[] {
  let filtered = clone(dailyReports).filter(item => item.userId === userId);
  if (params?.month) {
    const month = params.month;
    filtered = filtered.filter(item => item.date.startsWith(month));
  }
  if (!params?.includeDraft) {
    filtered = filtered.filter(item => !item.isDraft);
  }
  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
export function getDailyReport(reportId: string): DailyReport | null {
  const found = dailyReports.find(item => item.id === reportId);
  return found ? clone(found) : null;
}
export function saveDailyReport(payload: {
  userId: string;
  userName: string;
  date: string;
  projectId?: string;
  unitId?: string;
  summary: string;
  activities: string[];
  issues: string[];
  weather: DailyReport["weather"];
  temperature?: number;
  photoUrls: string[];
  isDraft: boolean;
}): DailyReport {
  const existingIndex = dailyReports.findIndex(item => item.userId === payload.userId && item.date === payload.date);
  const now = new Date().toISOString();
  const report: DailyReport = {
    id: existingIndex >= 0 ? dailyReports[existingIndex].id : `dr-${Date.now()}`,
    userId: payload.userId,
    userName: payload.userName,
    date: payload.date,
    projectId: payload.projectId,
    unitId: payload.unitId,
    summary: payload.summary,
    activities: payload.activities,
    issues: payload.issues,
    weather: payload.weather,
    temperature: payload.temperature,
    photoUrls: payload.photoUrls,
    isDraft: payload.isDraft,
    createdAt: existingIndex >= 0 ? dailyReports[existingIndex].createdAt : now,
    updatedAt: now
  };
  if (existingIndex >= 0) {
    dailyReports[existingIndex] = report;
  } else {
    dailyReports.unshift(report);
  }
  notifications.unshift({
    id: `notif-${Date.now()}`,
    role: "SITE_ENGINEER",
    title: payload.isDraft ? "Draft laporan disimpan" : "Laporan harian terkirim",
    body: `Laporan untuk ${payload.date} berhasil ${payload.isDraft ? "disimpan sebagai draft" : "dikirim"}`,
    isRead: false,
    createdAt: now
  });
  return clone(report);
}
export const mockHandoverInfo: HandoverInfo = {
  unitId: 'unit-001',
  plannedDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
  status: 'SCHEDULED',
  checklist: [{
    id: 'kewajiban',
    label: 'Pelunasan Kewajiban Finansial',
    description: 'Semua tagihan dan cicilan telah dilunasi',
    isCompleted: false
  }, {
    id: 'kpr',
    label: 'Kelengkapan Dokumen KPR',
    description: 'Dokumen KPR dan akad kredit telah disiapkan',
    isCompleted: true,
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }, {
    id: 'bast',
    label: 'Penandatanganan BA Serah Terima',
    description: 'Berita acara serah terima siap ditandatangani',
    isCompleted: false
  }]
};