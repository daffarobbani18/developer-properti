import {
  AuthState,
  BillingSummary,
  CustomerOverview,
  DocumentItem,
  FaqItem,
  InvoiceItem,
  IssueItem,
  Milestone,
  NotificationItem,
  PaymentItem,
  PendingQueueItem,
  ProjectSummary,
  Role,
  TicketItem,
  Unit,
} from "../types";

type MockUserSeed = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  password: string;
};

const mockUsers: MockUserSeed[] = [
  {
    id: "u-engineer-1",
    fullName: "Rizky Wahyudi",
    email: "engineer@simdp.local",
    role: "SITE_ENGINEER",
    password: "Password123!",
  },
  {
    id: "u-pm-1",
    fullName: "Dimas Satria",
    email: "pm@simdp.local",
    role: "PROJECT_MANAGER",
    password: "Password123!",
  },
  {
    id: "u-customer-1",
    fullName: "Alya Puspita",
    email: "customer@simdp.local",
    role: "CUSTOMER",
    password: "Password123!",
  },
];

export const demoCredentials = mockUsers.map((item) => ({
  role: item.role,
  email: item.email,
  password: item.password,
}));

const projects: Array<{ id: string; name: string }> = [
  { id: "project-1", name: "Cluster Magnolia" },
  { id: "project-2", name: "Cluster Azalea" },
];

const units: Unit[] = [
  {
    id: "unit-1",
    projectId: "project-1",
    code: "MG-A12",
    typeName: "Tipe 45/90",
    status: "IN_PROGRESS",
    progress: 65,
  },
  {
    id: "unit-2",
    projectId: "project-1",
    code: "MG-B03",
    typeName: "Tipe 54/120",
    status: "IN_PROGRESS",
    progress: 42,
  },
  {
    id: "unit-3",
    projectId: "project-2",
    code: "AZ-C07",
    typeName: "Tipe 60/150",
    status: "DONE",
    progress: 100,
  },
  {
    id: "unit-4",
    projectId: "project-2",
    code: "AZ-A01",
    typeName: "Tipe 45/90",
    status: "NOT_STARTED",
    progress: 0,
  },
];

const milestones: Milestone[] = [
  {
    id: "mil-1",
    unitId: "unit-1",
    name: "Pondasi",
    orderNo: 1,
    targetDate: "2026-03-10",
    actualDate: "2026-03-09",
    status: "COMPLETED",
    note: "Selesai sesuai gambar kerja",
    photos: [
      {
        id: "photo-1",
        url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5",
        caption: "Pondasi sisi depan",
        createdAt: "2026-03-09T08:00:00.000Z",
      },
    ],
  },
  {
    id: "mil-2",
    unitId: "unit-1",
    name: "Struktur",
    orderNo: 2,
    targetDate: "2026-03-28",
    actualDate: "2026-03-30",
    status: "IN_PROGRESS",
    note: "Pengecoran lantai 1 berjalan",
    photos: [
      {
        id: "photo-2",
        url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd",
        caption: "Balok dan kolom",
        createdAt: "2026-03-27T08:00:00.000Z",
      },
    ],
  },
  {
    id: "mil-3",
    unitId: "unit-1",
    name: "Dinding",
    orderNo: 3,
    targetDate: "2026-04-16",
    status: "NOT_STARTED",
    photos: [],
  },
  {
    id: "mil-4",
    unitId: "unit-1",
    name: "Finishing",
    orderNo: 4,
    targetDate: "2026-05-10",
    status: "NOT_STARTED",
    photos: [],
  },
  {
    id: "mil-5",
    unitId: "unit-2",
    name: "Pondasi",
    orderNo: 1,
    targetDate: "2026-03-15",
    status: "COMPLETED",
    photos: [],
  },
  {
    id: "mil-6",
    unitId: "unit-2",
    name: "Struktur",
    orderNo: 2,
    targetDate: "2026-04-05",
    status: "IN_PROGRESS",
    photos: [],
  },
  {
    id: "mil-7",
    unitId: "unit-3",
    name: "Serah Terima",
    orderNo: 1,
    targetDate: "2026-02-01",
    actualDate: "2026-01-28",
    status: "COMPLETED",
    photos: [],
  },
  {
    id: "mil-8",
    unitId: "unit-4",
    name: "Persiapan Lahan",
    orderNo: 1,
    targetDate: "2026-04-20",
    status: "NOT_STARTED",
    photos: [],
  },
];

const issues: IssueItem[] = [
  {
    id: "issue-1",
    projectId: "project-1",
    unitId: "unit-1",
    title: "Retak rambut area dapur",
    description: "Ditemukan retak rambut pada dinding belakang dapur.",
    category: "Kualitas Pekerjaan",
    urgency: "SEDANG",
    status: "SEDANG_DITANGANI",
    reporterName: "Rizky Wahyudi",
    recommendation: "Tambah curing dan cek campuran plester",
    createdAt: "2026-04-08T08:00:00.000Z",
  },
  {
    id: "issue-2",
    projectId: "project-1",
    unitId: "unit-2",
    title: "Material besi terlambat",
    description: "Pengiriman material besi terlambat 2 hari.",
    category: "Jadwal Molor",
    urgency: "TINGGI",
    status: "BARU",
    reporterName: "Rizky Wahyudi",
    createdAt: "2026-04-09T03:00:00.000Z",
  },
  {
    id: "issue-3",
    projectId: "project-2",
    title: "Akses truk terganggu hujan",
    description: "Akses proyek sempat tertutup karena genangan.",
    category: "Cuaca",
    urgency: "SEDANG",
    status: "SELESAI",
    reporterName: "Dimas Satria",
    recommendation: "Penambahan basecourse pada akses masuk",
    createdAt: "2026-04-06T10:00:00.000Z",
  },
];

const notifications: NotificationItem[] = [
  {
    id: "notif-1",
    role: "SITE_ENGINEER",
    title: "Deadline Struktur Unit MG-A12",
    body: "Target struktur Unit MG-A12 melewati 2 hari dari rencana.",
    isRead: false,
    createdAt: "2026-04-09T02:00:00.000Z",
  },
  {
    id: "notif-2",
    role: "PROJECT_MANAGER",
    title: "Kendala material prioritas tinggi",
    body: "Issue material besi pada Cluster Magnolia perlu keputusan vendor.",
    isRead: false,
    createdAt: "2026-04-09T04:00:00.000Z",
  },
  {
    id: "notif-3",
    role: "CUSTOMER",
    title: "Foto progres terbaru tersedia",
    body: "Ada pembaruan foto progres untuk Unit MG-A12.",
    isRead: false,
    createdAt: "2026-04-09T07:00:00.000Z",
  },
  {
    id: "notif-4",
    role: "CUSTOMER",
    title: "Tagihan Termin 3 jatuh tempo",
    body: "Tagihan Termin 3 jatuh tempo dalam 5 hari.",
    isRead: true,
    createdAt: "2026-04-07T01:00:00.000Z",
  },
];

const billingSummary: BillingSummary = {
  totalPrice: 825_000_000,
  paid: 500_000_000,
  outstanding: 325_000_000,
  paymentScheme: "KPR Bertahap 24 Bulan",
  monthlyInstallment: 13_500_000,
};

const invoices: InvoiceItem[] = [
  {
    id: "inv-1",
    name: "Termin 1",
    amount: 250_000_000,
    dueDate: "2026-01-10",
    status: "LUNAS",
  },
  {
    id: "inv-2",
    name: "Termin 2",
    amount: 250_000_000,
    dueDate: "2026-03-10",
    status: "LUNAS",
  },
  {
    id: "inv-3",
    name: "Termin 3",
    amount: 150_000_000,
    dueDate: "2026-04-15",
    status: "JATUH_TEMPO",
  },
  {
    id: "inv-4",
    name: "Termin 4",
    amount: 175_000_000,
    dueDate: "2026-06-15",
    status: "BELUM_BAYAR",
  },
];

const payments: PaymentItem[] = [
  {
    id: "pay-1",
    invoiceId: "inv-1",
    amount: 250_000_000,
    method: "TRANSFER",
    status: "DIKONFIRMASI",
    paidAt: "2026-01-08T09:00:00.000Z",
  },
  {
    id: "pay-2",
    invoiceId: "inv-2",
    amount: 250_000_000,
    method: "VA",
    status: "DIKONFIRMASI",
    paidAt: "2026-03-09T14:20:00.000Z",
  },
];

const documents: DocumentItem[] = [
  {
    id: "doc-1",
    title: "SPK Unit MG-A12",
    category: "Pra-pembelian",
    status: "TERSEDIA",
    url: "https://example.com/docs/spk-mg-a12.pdf",
  },
  {
    id: "doc-2",
    title: "Kwitansi Termin 1",
    category: "Transaksi",
    status: "TERSEDIA",
    url: "https://example.com/docs/kwitansi-termin-1.pdf",
  },
  {
    id: "doc-3",
    title: "AJB",
    category: "Kepemilikan",
    status: "SEDANG_DIPROSES",
  },
  {
    id: "doc-4",
    title: "BAST",
    category: "Serah Terima",
    status: "BELUM_TERSEDIA",
  },
];

const tickets: TicketItem[] = [
  {
    id: "ticket-1",
    category: "Progres",
    subject: "Konfirmasi jadwal pengecatan",
    description: "Mohon info estimasi jadwal pengecatan interior.",
    status: "SEDANG_DITANGANI",
    createdAt: "2026-04-02T08:30:00.000Z",
  },
  {
    id: "ticket-2",
    category: "Tagihan",
    subject: "Kebutuhan invoice termin 3",
    description: "Mohon kirimkan invoice resmi termin 3 beserta nomor VA.",
    status: "SELESAI",
    createdAt: "2026-03-20T10:00:00.000Z",
  },
];

const faq: FaqItem[] = [
  {
    id: "faq-1",
    question: "Kapan saya menerima update progres?",
    answer: "Update progres dikirim minimal mingguan, atau saat milestone penting tercapai.",
  },
  {
    id: "faq-2",
    question: "Bagaimana cara mengunggah bukti pembayaran?",
    answer: "Masuk ke menu Tagihan, pilih invoice, isi URL bukti transfer, lalu kirim untuk verifikasi.",
  },
  {
    id: "faq-3",
    question: "Dokumen legal kapan bisa diunduh?",
    answer: "Dokumen legal dapat diunduh setelah status dokumen berubah menjadi Tersedia di menu Dokumen.",
  },
];

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
      role: seed.role,
    },
  };
}

export function authenticateMock(email: string, password: string): AuthState | null {
  const found = mockUsers.find(
    (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password
  );

  if (!found) {
    return null;
  }

  return toAuthState(found);
}

export function getProjects(): Array<{ id: string; name: string }> {
  return clone(projects);
}

export function getProjectSummaries(): ProjectSummary[] {
  const now = new Date();
  return projects.map((project) => {
    const projectUnits = units.filter((unit) => unit.projectId === project.id);
    const totalUnits = projectUnits.length;
    const progress =
      totalUnits === 0
        ? 0
        : Math.round(projectUnits.reduce((acc, item) => acc + item.progress, 0) / totalUnits);

    const deadlineAlerts = milestones.filter((milestone) => {
      if (milestone.status === "COMPLETED") {
        return false;
      }
      const belongsToProject = projectUnits.some((unit) => unit.id === milestone.unitId);
      return belongsToProject && new Date(milestone.targetDate).getTime() < now.getTime();
    }).length;

    return {
      id: project.id,
      name: project.name,
      totalUnits,
      progress,
      milestoneDeadlineAlerts: deadlineAlerts,
    };
  });
}

export function getUnits(projectId?: string, search?: string): Unit[] {
  let filtered = units;
  if (projectId) {
    filtered = filtered.filter((item) => item.projectId === projectId);
  }
  if (search?.trim()) {
    const keyword = search.trim().toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.code.toLowerCase().includes(keyword) || item.typeName.toLowerCase().includes(keyword)
    );
  }
  return clone(filtered);
}

export function getMilestones(unitId: string): Milestone[] {
  return clone(
    milestones
      .filter((item) => item.unitId === unitId)
      .sort((a, b) => a.orderNo - b.orderNo)
  );
}

export function updateMilestone(params: {
  milestoneId: string;
  status: Milestone["status"];
  note?: string;
  photoUrl?: string;
}): Milestone {
  const target = milestones.find((item) => item.id === params.milestoneId);

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
      createdAt: new Date().toISOString(),
    });
  }

  const unitMilestones = milestones.filter((item) => item.unitId === target.unitId);
  const completedCount = unitMilestones.filter((item) => item.status === "COMPLETED").length;
  const unitProgress = Math.round((completedCount / Math.max(unitMilestones.length, 1)) * 100);
  const relatedUnit = units.find((item) => item.id === target.unitId);

  if (relatedUnit) {
    relatedUnit.progress = unitProgress;
    relatedUnit.status =
      unitProgress === 100 ? "DONE" : unitProgress === 0 ? "NOT_STARTED" : "IN_PROGRESS";
  }

  return clone(target);
}

export function getIssues(): IssueItem[] {
  return clone(
    issues.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  );
}

export function addIssue(payload: {
  projectId: string;
  unitId?: string;
  title: string;
  description: string;
  category: IssueItem["category"];
  urgency: IssueItem["urgency"];
  reporterName: string;
  recommendation?: string;
}): IssueItem {
  const newIssue: IssueItem = {
    id: `issue-${Date.now()}`,
    projectId: payload.projectId,
    unitId: payload.unitId,
    title: payload.title,
    description: payload.description,
    category: payload.category,
    urgency: payload.urgency,
    status: "BARU",
    reporterName: payload.reporterName,
    recommendation: payload.recommendation,
    createdAt: new Date().toISOString(),
  };

  issues.unshift(newIssue);
  return clone(newIssue);
}

export function updateIssueStatus(issueId: string, status: IssueItem["status"]): IssueItem {
  const found = issues.find((item) => item.id === issueId);
  if (!found) {
    throw new Error("Issue tidak ditemukan");
  }
  found.status = status;
  return clone(found);
}

export function getNotifications(role: Role): NotificationItem[] {
  return clone(
    notifications
      .filter((item) => item.role === role)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  );
}

export function markNotificationsRead(role: Role): NotificationItem[] {
  notifications.forEach((item) => {
    if (item.role === role) {
      item.isRead = true;
    }
  });
  return getNotifications(role);
}

export function getCustomerOverview(): CustomerOverview {
  const customerUnit = units.find((item) => item.id === "unit-1") ?? units[0];
  const nextInvoice = invoices.find((item) => item.status !== "LUNAS");
  const unreadNotifications = notifications.filter(
    (item) => item.role === "CUSTOMER" && !item.isRead
  ).length;

  return clone({
    unit: customerUnit,
    nextInvoice,
    unreadNotifications,
  });
}

export function getCustomerProgress(): Milestone[] {
  const customerUnit = units.find((item) => item.id === "unit-1") ?? units[0];
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
    payments,
  });
}

export function uploadPaymentProof(payload: {
  invoiceId: string;
  amount: number;
  proofUrl: string;
}): PaymentItem {
  const invoice = invoices.find((item) => item.id === payload.invoiceId);
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
    paidAt: new Date().toISOString(),
  };

  payments.unshift(newPayment);

  notifications.unshift({
    id: `notif-${Date.now()}`,
    role: "CUSTOMER",
    title: "Bukti pembayaran diterima",
    body: "Bukti pembayaran Anda sedang menunggu verifikasi tim finance.",
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  return clone(newPayment);
}

export function getDocuments(): DocumentItem[] {
  return clone(documents);
}

export function getSupportData(): { tickets: TicketItem[]; faq: FaqItem[] } {
  return clone({
    tickets: tickets.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    faq,
  });
}

export function createTicket(payload: {
  category: TicketItem["category"];
  subject: string;
  description: string;
}): TicketItem {
  const ticket: TicketItem = {
    id: `ticket-${Date.now()}`,
    category: payload.category,
    subject: payload.subject,
    description: payload.description,
    status: "BARU",
    createdAt: new Date().toISOString(),
  };

  tickets.unshift(ticket);

  notifications.unshift({
    id: `notif-${Date.now()}`,
    role: "CUSTOMER",
    title: "Tiket bantuan dibuat",
    body: `Tiket "${payload.subject}" berhasil dibuat dan menunggu respon tim.`,
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  return clone(ticket);
}

export function queueItemTemplate(payload: PendingQueueItem["payload"]): PendingQueueItem {
  return {
    id: `queue-${Date.now()}`,
    type: "MILESTONE_UPDATE",
    payload,
    createdAt: new Date().toISOString(),
  };
}
