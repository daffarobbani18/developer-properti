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

export const dummyDokumenInduk: DokumenInduk[] = [
  {
    id: "DOC-001",
    namaDokumen: "Sertifikat Hak Guna Bangunan (Induk)",
    instansi: "BPN Kabupaten",
    nomorSurat: "SHGB/012/2025",
    tanggalTerbit: "2025-01-15",
    tanggalExpired: "2045-01-15",
    status: "aktif",
  },
  {
    id: "DOC-002",
    namaDokumen: "Izin Mendirikan Bangunan (IMB) Kawasan",
    instansi: "Dinas Perizinan Terpadu",
    nomorSurat: "IMB/554.2/2025",
    tanggalTerbit: "2025-03-10",
    tanggalExpired: "2026-03-10",
    status: "aktif",
  },
  {
    id: "DOC-003",
    namaDokumen: "Izin Lingkungan (Amdal/UKL-UPL)",
    instansi: "Dinas Lingkungan Hidup",
    nomorSurat: "DLH/772/2024",
    tanggalTerbit: "2024-05-20",
    tanggalExpired: "2026-05-20",
    status: "aktif",
  },
  {
    id: "DOC-004",
    namaDokumen: "Izin Peil Banjir",
    instansi: "Dinas PUPR",
    nomorSurat: "PUPR/PB/11/2023",
    tanggalTerbit: "2023-11-05",
    tanggalExpired: "2026-11-05", // Simulasi expired segera
    status: "segera_expired",
    catatan: "Perlu perpanjangan sebelum musim hujan",
  },
  {
    id: "DOC-005",
    namaDokumen: "Pengesahan Site Plan",
    instansi: "Dinas Tata Ruang",
    nomorSurat: "DTR/SP/04/2025",
    tanggalTerbit: "2025-04-01",
    tanggalExpired: null,
    status: "proses_revisi",
    catatan: "Revisi luasan fasum (Fasilitas Umum)",
  },
];

export const dummyLegalitasUnit: LegalitasUnit[] = [
  {
    id: "LEG-001",
    unitId: "U001",
    nomorUnit: "A-01",
    namaPembeli: "Hendra Wijaya",
    statusPPJB: "selesai",
    statusPecahSertifikat: "selesai",
    statusAJB: "proses",
    statusBBN: "belum_mulai",
    tanggalUpdateTerakhir: "2026-05-01",
  },
  {
    id: "LEG-002",
    unitId: "U003",
    nomorUnit: "A-03",
    namaPembeli: "Dewi Lestari",
    statusPPJB: "selesai",
    statusPecahSertifikat: "proses",
    statusAJB: "belum_mulai",
    statusBBN: "belum_mulai",
    tanggalUpdateTerakhir: "2026-04-20",
  },
  {
    id: "LEG-003",
    unitId: "U007",
    nomorUnit: "B-02",
    namaPembeli: "Ahmad Fauzi",
    statusPPJB: "selesai",
    statusPecahSertifikat: "selesai",
    statusAJB: "selesai",
    statusBBN: "proses",
    tanggalUpdateTerakhir: "2026-05-05",
  },
  {
    id: "LEG-004",
    unitId: "U012",
    nomorUnit: "C-02",
    namaPembeli: "Siti Nurhaliza",
    statusPPJB: "proses",
    statusPecahSertifikat: "belum_mulai",
    statusAJB: "belum_mulai",
    statusBBN: "belum_mulai",
    tanggalUpdateTerakhir: "2026-05-06",
  },
];

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
