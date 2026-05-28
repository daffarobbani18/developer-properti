// ============================================================
// Tipe Data Legal & Perizinan — Dummy untuk frontend
// ============================================================

export type StatusDokumenInduk = "aktif" | "segera_expired" | "expired" | "proses_revisi";

export interface DokumenInduk {
  id: string;
  namaDokumen: string;
  instansi: string;
  nomorSurat: string;
  tanggalTerbit: string;
  tanggalExpired: string | null; // null jika seumur hidup
  status: StatusDokumenInduk;
  catatan?: string;
}

export type StatusProgresLegal = "belum_mulai" | "proses" | "selesai" | "terkendala";

export interface LegalitasUnit {
  id: string;
  unitId: string;
  nomorUnit: string;
  namaPembeli: string;
  
  // Progress masing-masing dokumen
  statusPPJB: StatusProgresLegal;
  statusPecahSertifikat: StatusProgresLegal;
  statusAJB: StatusProgresLegal;
  statusBBN: StatusProgresLegal; // Bea Balik Nama
  
  tanggalUpdateTerakhir: string;
}

// ============================================================
// Dummy Data
// ============================================================

export const dummyDokumenInduk: DokumenInduk[] = [];

export const dummyLegalitasUnit: LegalitasUnit[] = [];

// ============================================================
// Helpers
// ============================================================

export const statusDokumenIndukLabels: Record<StatusDokumenInduk, string> = {
  aktif: "Aktif / Berlaku",
  segera_expired: "Segera Expired",
  expired: "Kadaluarsa",
  proses_revisi: "Proses Revisi",
};

export const statusDokumenIndukColors: Record<StatusDokumenInduk, string> = {
  aktif: "bg-emerald-50 text-emerald-700 border-emerald-200",
  segera_expired: "bg-amber-50 text-amber-700 border-amber-200",
  expired: "bg-rose-50 text-rose-700 border-rose-200",
  proses_revisi: "bg-blue-50 text-blue-700 border-blue-200",
};

export const statusProgresLegalLabels: Record<StatusProgresLegal, string> = {
  belum_mulai: "Belum Mulai",
  proses: "Sedang Proses",
  selesai: "Selesai",
  terkendala: "Terkendala",
};

export const statusProgresLegalColors: Record<StatusProgresLegal, string> = {
  belum_mulai: "bg-slate-100 text-slate-500",
  proses: "bg-blue-100 text-blue-700",
  selesai: "bg-emerald-100 text-emerald-700",
  terkendala: "bg-rose-100 text-rose-700",
};

export function formatTanggal(dateStr: string | null): string {
  if (!dateStr) return "Seumur Hidup";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
