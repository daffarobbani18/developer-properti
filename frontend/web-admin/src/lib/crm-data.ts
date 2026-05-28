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

export const dummyLeads: Lead[] = [];

export const dummyUnits: Unit[] = [];

export const dummyTransaksi: Transaksi[] = [];

export const dummyAktivitas: Aktivitas[] = [];

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
