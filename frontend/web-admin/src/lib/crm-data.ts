// ============================================================
// Tipe Data CRM — Dummy untuk frontend, nanti dari API NestJS
// ============================================================

export type LeadStatus =
  | "baru"
  | "follow-up"
  | "survey"
  | "negosiasi"
  | "booking"
  | "spk";

export type LeadSource =
  | "website"
  | "instagram"
  | "facebook"
  | "referral"
  | "walk-in"
  | "pameran";

export interface Lead {
  id: string;
  nama: string;
  telepon: string;
  email: string;
  sumber: LeadSource;
  status: LeadStatus;
  minatUnit: string;
  salesPIC: string;
  tanggalMasuk: string;
  catatanTerakhir: string;
}

export type UnitStatus = "tersedia" | "booked" | "terjual" | "indent";

export interface Unit {
  id: string;
  nomorUnit: string;
  blok: string;
  tipe: string;
  luasTanah: number;
  luasBangunan: number;
  harga: number;
  status: UnitStatus;
  pembeli?: string;
}

export type SkemaPembayaran = "kpr" | "tunai" | "tunai-bertahap";
export type StatusKPR =
  | "pengajuan"
  | "proses"
  | "disetujui"
  | "akad"
  | "ditolak";

export interface Transaksi {
  id: string;
  leadId: string;
  unitId: string;
  namaPembeli: string;
  nomorUnit: string;
  skema: SkemaPembayaran;
  nilaiTransaksi: number;
  tandaJadi: number;
  statusKPR: StatusKPR;
  tanggalBooking: string;
  tanggalSPK?: string;
}

export type TipeAktivitas =
  | "telepon"
  | "whatsapp"
  | "kunjungan"
  | "email"
  | "meeting";

export interface Aktivitas {
  id: string;
  leadId: string;
  namaLead: string;
  tipe: TipeAktivitas;
  catatan: string;
  salesPIC: string;
  tanggal: string;
  jadwalFollowUp?: string;
}

// ============================================================
// Dummy Data
// ============================================================

export const dummyLeads: Lead[] = [
  {
    id: "L001",
    nama: "Budi Santoso",
    telepon: "081234567890",
    email: "budi@email.com",
    sumber: "website",
    status: "follow-up",
    minatUnit: "Tipe 45/72",
    salesPIC: "Rina",
    tanggalMasuk: "2026-02-20",
    catatanTerakhir: "Sudah kirim brosur, tunggu konfirmasi survey",
  },
  {
    id: "L002",
    nama: "Siti Nurhaliza",
    telepon: "082345678901",
    email: "siti@email.com",
    sumber: "instagram",
    status: "survey",
    minatUnit: "Tipe 60/90",
    salesPIC: "Andi",
    tanggalMasuk: "2026-02-18",
    catatanTerakhir: "Jadwal survey Sabtu depan",
  },
  {
    id: "L003",
    nama: "Ahmad Fauzi",
    telepon: "085678901234",
    email: "ahmad@email.com",
    sumber: "pameran",
    status: "negosiasi",
    minatUnit: "Tipe 36/60",
    salesPIC: "Rina",
    tanggalMasuk: "2026-02-15",
    catatanTerakhir: "Nego harga, minta diskon 5%",
  },
  {
    id: "L004",
    nama: "Dewi Lestari",
    telepon: "087890123456",
    email: "dewi@email.com",
    sumber: "referral",
    status: "booking",
    minatUnit: "Tipe 45/72",
    salesPIC: "Andi",
    tanggalMasuk: "2026-02-10",
    catatanTerakhir: "DP sudah masuk, proses SPK",
  },
  {
    id: "L005",
    nama: "Roni Pratama",
    telepon: "081122334455",
    email: "roni@email.com",
    sumber: "walk-in",
    status: "baru",
    minatUnit: "Tipe 60/90",
    salesPIC: "Rina",
    tanggalMasuk: "2026-02-25",
    catatanTerakhir: "Walk-in hari ini, tertarik cluster A",
  },
  {
    id: "L006",
    nama: "Maya Sari",
    telepon: "089012345678",
    email: "maya@email.com",
    sumber: "facebook",
    status: "follow-up",
    minatUnit: "Tipe 36/60",
    salesPIC: "Andi",
    tanggalMasuk: "2026-02-22",
    catatanTerakhir: "Follow up via WA, belum dibaca",
  },
  {
    id: "L007",
    nama: "Hendra Wijaya",
    telepon: "081987654321",
    email: "hendra@email.com",
    sumber: "website",
    status: "spk",
    minatUnit: "Tipe 45/72",
    salesPIC: "Rina",
    tanggalMasuk: "2026-01-28",
    catatanTerakhir: "SPK sudah ditandatangani, proses KPR",
  },
  {
    id: "L008",
    nama: "Lia Permata",
    telepon: "082233445566",
    email: "lia@email.com",
    sumber: "instagram",
    status: "baru",
    minatUnit: "Tipe 60/90",
    salesPIC: "Andi",
    tanggalMasuk: "2026-02-26",
    catatanTerakhir: "DM Instagram, minta info harga",
  },
  {
    id: "L009",
    nama: "Joko Widodo",
    telepon: "085544332211",
    email: "joko@email.com",
    sumber: "pameran",
    status: "negosiasi",
    minatUnit: "Tipe 36/60",
    salesPIC: "Rina",
    tanggalMasuk: "2026-02-12",
    catatanTerakhir: "Minta simulasi KPR Bank Mandiri",
  },
  {
    id: "L010",
    nama: "Fitri Handayani",
    telepon: "087766554433",
    email: "fitri@email.com",
    sumber: "referral",
    status: "survey",
    minatUnit: "Tipe 45/72",
    salesPIC: "Andi",
    tanggalMasuk: "2026-02-19",
    catatanTerakhir: "Direferensikan oleh Dewi, jadwalkan survey",
  },
];

export const dummyUnits: Unit[] = [
  { id: "U001", nomorUnit: "A-01", blok: "A", tipe: "36/60", luasTanah: 60, luasBangunan: 36, harga: 350000000, status: "terjual", pembeli: "Hendra Wijaya" },
  { id: "U002", nomorUnit: "A-02", blok: "A", tipe: "36/60", luasTanah: 60, luasBangunan: 36, harga: 350000000, status: "tersedia" },
  { id: "U003", nomorUnit: "A-03", blok: "A", tipe: "45/72", luasTanah: 72, luasBangunan: 45, harga: 475000000, status: "booked", pembeli: "Dewi Lestari" },
  { id: "U004", nomorUnit: "A-04", blok: "A", tipe: "45/72", luasTanah: 72, luasBangunan: 45, harga: 475000000, status: "tersedia" },
  { id: "U005", nomorUnit: "A-05", blok: "A", tipe: "60/90", luasTanah: 90, luasBangunan: 60, harga: 650000000, status: "indent" },
  { id: "U006", nomorUnit: "B-01", blok: "B", tipe: "36/60", luasTanah: 60, luasBangunan: 36, harga: 360000000, status: "tersedia" },
  { id: "U007", nomorUnit: "B-02", blok: "B", tipe: "36/60", luasTanah: 60, luasBangunan: 36, harga: 360000000, status: "terjual", pembeli: "Ahmad Fauzi" },
  { id: "U008", nomorUnit: "B-03", blok: "B", tipe: "45/72", luasTanah: 72, luasBangunan: 45, harga: 480000000, status: "tersedia" },
  { id: "U009", nomorUnit: "B-04", blok: "B", tipe: "45/72", luasTanah: 72, luasBangunan: 45, harga: 480000000, status: "booked", pembeli: "Budi Santoso" },
  { id: "U010", nomorUnit: "B-05", blok: "B", tipe: "60/90", luasTanah: 90, luasBangunan: 60, harga: 660000000, status: "tersedia" },
  { id: "U011", nomorUnit: "C-01", blok: "C", tipe: "60/90", luasTanah: 90, luasBangunan: 60, harga: 670000000, status: "tersedia" },
  { id: "U012", nomorUnit: "C-02", blok: "C", tipe: "60/90", luasTanah: 90, luasBangunan: 60, harga: 670000000, status: "terjual", pembeli: "Siti Nurhaliza" },
];

export const dummyTransaksi: Transaksi[] = [
  {
    id: "T001",
    leadId: "L007",
    unitId: "U001",
    namaPembeli: "Hendra Wijaya",
    nomorUnit: "A-01",
    skema: "kpr",
    nilaiTransaksi: 350000000,
    tandaJadi: 5000000,
    statusKPR: "proses",
    tanggalBooking: "2026-02-01",
    tanggalSPK: "2026-02-05",
  },
  {
    id: "T002",
    leadId: "L004",
    unitId: "U003",
    namaPembeli: "Dewi Lestari",
    nomorUnit: "A-03",
    skema: "tunai-bertahap",
    nilaiTransaksi: 475000000,
    tandaJadi: 10000000,
    statusKPR: "pengajuan",
    tanggalBooking: "2026-02-12",
  },
  {
    id: "T003",
    leadId: "L003",
    unitId: "U007",
    namaPembeli: "Ahmad Fauzi",
    nomorUnit: "B-02",
    skema: "tunai",
    nilaiTransaksi: 360000000,
    tandaJadi: 15000000,
    statusKPR: "akad",
    tanggalBooking: "2026-01-20",
    tanggalSPK: "2026-01-25",
  },
  {
    id: "T004",
    leadId: "L002",
    unitId: "U012",
    namaPembeli: "Siti Nurhaliza",
    nomorUnit: "C-02",
    skema: "kpr",
    nilaiTransaksi: 670000000,
    tandaJadi: 10000000,
    statusKPR: "disetujui",
    tanggalBooking: "2026-02-08",
    tanggalSPK: "2026-02-15",
  },
];

export const dummyAktivitas: Aktivitas[] = [
  {
    id: "AK001",
    leadId: "L001",
    namaLead: "Budi Santoso",
    tipe: "whatsapp",
    catatan: "Kirim brosur tipe 45/72 dan pricelist",
    salesPIC: "Rina",
    tanggal: "2026-02-26",
    jadwalFollowUp: "2026-02-28",
  },
  {
    id: "AK002",
    leadId: "L002",
    namaLead: "Siti Nurhaliza",
    tipe: "kunjungan",
    catatan: "Survey lokasi ke perumahan, tertarik blok C",
    salesPIC: "Andi",
    tanggal: "2026-02-25",
  },
  {
    id: "AK003",
    leadId: "L003",
    namaLead: "Ahmad Fauzi",
    tipe: "telepon",
    catatan: "Diskusi harga final, deal di 345jt",
    salesPIC: "Rina",
    tanggal: "2026-02-24",
  },
  {
    id: "AK004",
    leadId: "L005",
    namaLead: "Roni Pratama",
    tipe: "meeting",
    catatan: "Walk-in ke kantor, perkenalan produk cluster A",
    salesPIC: "Rina",
    tanggal: "2026-02-25",
    jadwalFollowUp: "2026-02-27",
  },
  {
    id: "AK005",
    leadId: "L006",
    namaLead: "Maya Sari",
    tipe: "whatsapp",
    catatan: "Follow up WA, belum dibaca",
    salesPIC: "Andi",
    tanggal: "2026-02-23",
    jadwalFollowUp: "2026-02-26",
  },
  {
    id: "AK006",
    leadId: "L008",
    namaLead: "Lia Permata",
    tipe: "email",
    catatan: "Kirim email info tipe 60/90 + simulasi KPR",
    salesPIC: "Andi",
    tanggal: "2026-02-26",
    jadwalFollowUp: "2026-03-01",
  },
  {
    id: "AK007",
    leadId: "L009",
    namaLead: "Joko Widodo",
    tipe: "telepon",
    catatan: "Diskusi simulasi KPR Bank Mandiri tenor 20 tahun",
    salesPIC: "Rina",
    tanggal: "2026-02-22",
  },
  {
    id: "AK008",
    leadId: "L010",
    namaLead: "Fitri Handayani",
    tipe: "whatsapp",
    catatan: "Konfirmasi jadwal survey minggu depan",
    salesPIC: "Andi",
    tanggal: "2026-02-26",
    jadwalFollowUp: "2026-03-01",
  },
];

// ============================================================
// Helpers
// ============================================================

export const leadStatusLabel: Record<LeadStatus, string> = {
  baru: "Baru",
  "follow-up": "Follow Up",
  survey: "Survey",
  negosiasi: "Negosiasi",
  booking: "Booking",
  spk: "SPK",
};

export const leadStatusColor: Record<LeadStatus, string> = {
  baru: "bg-slate-100 text-slate-700",
  "follow-up": "bg-blue-50 text-blue-700",
  survey: "bg-violet-50 text-violet-700",
  negosiasi: "bg-amber-50 text-amber-700",
  booking: "bg-emerald-50 text-emerald-700",
  spk: "bg-green-100 text-green-800",
};

export const unitStatusLabel: Record<UnitStatus, string> = {
  tersedia: "Tersedia",
  booked: "Booked",
  terjual: "Terjual",
  indent: "Indent",
};

export const unitStatusColor: Record<UnitStatus, string> = {
  tersedia: "bg-emerald-50 text-emerald-700",
  booked: "bg-amber-50 text-amber-700",
  terjual: "bg-slate-100 text-slate-600",
  indent: "bg-blue-50 text-blue-700",
};

export const sourceLabel: Record<LeadSource, string> = {
  website: "Website",
  instagram: "Instagram",
  facebook: "Facebook",
  referral: "Referral",
  "walk-in": "Walk-in",
  pameran: "Pameran",
};

export const skemaLabel: Record<SkemaPembayaran, string> = {
  kpr: "KPR",
  tunai: "Tunai",
  "tunai-bertahap": "Tunai Bertahap",
};

export const statusKPRLabel: Record<StatusKPR, string> = {
  pengajuan: "Pengajuan",
  proses: "Proses",
  disetujui: "Disetujui",
  akad: "Akad",
  ditolak: "Ditolak",
};

export const statusKPRColor: Record<StatusKPR, string> = {
  pengajuan: "bg-slate-100 text-slate-700",
  proses: "bg-blue-50 text-blue-700",
  disetujui: "bg-emerald-50 text-emerald-700",
  akad: "bg-green-100 text-green-800",
  ditolak: "bg-rose-50 text-rose-700",
};

export const tipeAktivitasLabel: Record<TipeAktivitas, string> = {
  telepon: "Telepon",
  whatsapp: "WhatsApp",
  kunjungan: "Kunjungan",
  email: "Email",
  meeting: "Meeting",
};

export const tipeAktivitasColor: Record<TipeAktivitas, string> = {
  telepon: "bg-blue-50 text-blue-700",
  whatsapp: "bg-emerald-50 text-emerald-700",
  kunjungan: "bg-violet-50 text-violet-700",
  email: "bg-amber-50 text-amber-700",
  meeting: "bg-rose-50 text-rose-700",
};

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatTanggal(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
