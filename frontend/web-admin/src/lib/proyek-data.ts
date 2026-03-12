// ─────────────────────────────────────────────────────────────────────────────
// Dummy Data: Monitoring Proyek & Milestone
// ─────────────────────────────────────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════════

export type StatusProyek = "perencanaan" | "konstruksi" | "finishing" | "selesai";
export type StatusMilestone = "belum_mulai" | "progress" | "selesai";
export type StatusUnit = "on_track" | "warning" | "terlambat";
export type StatusKendala = "baru" | "ditindaklanjuti" | "selesai";
export type KategoriKendala = "spek" | "jadwal" | "cuaca" | "material" | "lainnya";

export interface Proyek {
  id: string;
  nama: string;
  lokasi: string;
  totalUnit: number;
  unitSelesai: number;
  persentaseSelesai: number;
  statusProyek: StatusProyek;
  jumlahKontraktor: number;
  tanggalMulai: string;
  targetSelesai: string;
  nilaiKontrak: number;
}

export interface Unit {
  id: string;
  proyekId: string;
  nomorUnit: string;
  blok: string;
  tipe: string;
  persentaseSelesai: number;
  status: StatusUnit;
  milestoneSelesai: number;
  totalMilestone: number;
  targetSelesai: string;
}

export interface Milestone {
  id: string;
  unitId: string;
  nama: string;
  urutan: number;
  status: StatusMilestone;
  tanggalTarget: string;
  tanggalAktual?: string;
  persentase: number;
  fotoCount: number;
  engineerPIC?: string;
  catatan?: string;
}

export interface FotoMilestone {
  id: string;
  milestoneId: string;
  url: string;
  uploadDate: string;
  uploadBy: string;
  deskripsi: string;
}

export interface Kendala {
  id: string;
  proyekId: string;
  unitId: string;
  judul: string;
  deskripsi: string;
  kategori: KategoriKendala;
  status: StatusKendala;
  tanggalLapor: string;
  dilaporkanOleh: string;
  ditindaklanjutiOleh?: string;
  tanggalSelesai?: string;
  solusi?: string;
  prioritas: "rendah" | "sedang" | "tinggi";
}

export interface SiteEngineer {
  id: string;
  nama: string;
  telepon: string;
  email: string;
  proyekId: string;
  blokTugas?: string;
  jumlahUnitTugas: number;
  fotoProfile?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Dummy Data
// ═══════════════════════════════════════════════════════════════════════════════

export const dummyProyek: Proyek[] = [
  {
    id: "PRJ001",
    nama: "Grand Residence Cluster",
    lokasi: "BSD City, Tangerang",
    totalUnit: 24,
    unitSelesai: 8,
    persentaseSelesai: 33,
    statusProyek: "konstruksi",
    jumlahKontraktor: 5,
    tanggalMulai: "2024-01-15",
    targetSelesai: "2025-06-30",
    nilaiKontrak: 12_000_000_000,
  },
  {
    id: "PRJ002",
    nama: "Harmony Village",
    lokasi: "Cibubur, Jakarta Timur",
    totalUnit: 18,
    unitSelesai: 12,
    persentaseSelesai: 67,
    statusProyek: "finishing",
    jumlahKontraktor: 4,
    tanggalMulai: "2023-09-01",
    targetSelesai: "2024-12-31",
    nilaiKontrak: 9_500_000_000,
  },
  {
    id: "PRJ003",
    nama: "Green Park Estate",
    lokasi: "Sentul City, Bogor",
    totalUnit: 30,
    unitSelesai: 2,
    persentaseSelesai: 7,
    statusProyek: "konstruksi",
    jumlahKontraktor: 6,
    tanggalMulai: "2024-03-10",
    targetSelesai: "2025-12-31",
    nilaiKontrak: 18_000_000_000,
  },
];

export const dummyUnit: Unit[] = [
  // PRJ001 - Grand Residence Cluster (24 units)
  { id: "U001", proyekId: "PRJ001", nomorUnit: "A1", blok: "A", tipe: "Tipe 45", persentaseSelesai: 80, status: "on_track", milestoneSelesai: 6, totalMilestone: 8, targetSelesai: "2024-12-31" },
  { id: "U002", proyekId: "PRJ001", nomorUnit: "A2", blok: "A", tipe: "Tipe 45", persentaseSelesai: 75, status: "on_track", milestoneSelesai: 6, totalMilestone: 8, targetSelesai: "2024-12-31" },
  { id: "U003", proyekId: "PRJ001", nomorUnit: "A3", blok: "A", tipe: "Tipe 60", persentaseSelesai: 62, status: "warning", milestoneSelesai: 5, totalMilestone: 8, targetSelesai: "2024-11-30" },
  { id: "U004", proyekId: "PRJ001", nomorUnit: "A4", blok: "A", tipe: "Tipe 60", persentaseSelesai: 40, status: "terlambat", milestoneSelesai: 3, totalMilestone: 8, targetSelesai: "2024-10-15" },
  { id: "U005", proyekId: "PRJ001", nomorUnit: "B1", blok: "B", tipe: "Tipe 70", persentaseSelesai: 50, status: "on_track", milestoneSelesai: 4, totalMilestone: 8, targetSelesai: "2025-01-31" },
  { id: "U006", proyekId: "PRJ001", nomorUnit: "B2", blok: "B", tipe: "Tipe 70", persentaseSelesai: 45, status: "on_track", milestoneSelesai: 4, totalMilestone: 8, targetSelesai: "2025-01-31" },
  { id: "U007", proyekId: "PRJ001", nomorUnit: "B3", blok: "B", tipe: "Tipe 45", persentaseSelesai: 25, status: "on_track", milestoneSelesai: 2, totalMilestone: 8, targetSelesai: "2025-03-31" },
  { id: "U008", proyekId: "PRJ001", nomorUnit: "B4", blok: "B", tipe: "Tipe 45", persentaseSelesai: 12, status: "on_track", milestoneSelesai: 1, totalMilestone: 8, targetSelesai: "2025-04-30" },
];

const milestoneStandar = [
  "Pekerjaan Persiapan",
  "Pondasi",
  "Struktur & Rangka",
  "Dinding & Pasangan",
  "Atap",
  "Instalasi MEP",
  "Finishing Interior",
  "Serah Terima",
];

export const dummyMilestone: Milestone[] = [
  // Unit U001 (A1) - Progress tinggi
  { id: "M001", unitId: "U001", nama: milestoneStandar[0], urutan: 1, status: "selesai", tanggalTarget: "2024-02-01", tanggalAktual: "2024-01-28", persentase: 100, fotoCount: 3, engineerPIC: "Budi Santoso" },
  { id: "M002", unitId: "U001", nama: milestoneStandar[1], urutan: 2, status: "selesai", tanggalTarget: "2024-03-15", tanggalAktual: "2024-03-10", persentase: 100, fotoCount: 5, engineerPIC: "Budi Santoso" },
  { id: "M003", unitId: "U001", nama: milestoneStandar[2], urutan: 3, status: "selesai", tanggalTarget: "2024-05-01", tanggalAktual: "2024-04-28", persentase: 100, fotoCount: 4, engineerPIC: "Budi Santoso" },
  { id: "M004", unitId: "U001", nama: milestoneStandar[3], urutan: 4, status: "selesai", tanggalTarget: "2024-06-15", tanggalAktual: "2024-06-12", persentase: 100, fotoCount: 6, engineerPIC: "Budi Santoso" },
  { id: "M005", unitId: "U001", nama: milestoneStandar[4], urutan: 5, status: "selesai", tanggalTarget: "2024-07-30", tanggalAktual: "2024-07-25", persentase: 100, fotoCount: 4, engineerPIC: "Budi Santoso" },
  { id: "M006", unitId: "U001", nama: milestoneStandar[5], urutan: 6, status: "selesai", tanggalTarget: "2024-09-10", tanggalAktual: "2024-09-05", persentase: 100, fotoCount: 7, engineerPIC: "Budi Santoso" },
  { id: "M007", unitId: "U001", nama: milestoneStandar[6], urutan: 7, status: "progress", tanggalTarget: "2024-11-01", persentase: 60, fotoCount: 2, engineerPIC: "Budi Santoso" },
  { id: "M008", unitId: "U001", nama: milestoneStandar[7], urutan: 8, status: "belum_mulai", tanggalTarget: "2024-12-31", persentase: 0, fotoCount: 0 },
  
  // Unit U004 (A4) - Terlambat
  { id: "M032", unitId: "U004", nama: milestoneStandar[0], urutan: 1, status: "selesai", tanggalTarget: "2024-02-01", tanggalAktual: "2024-02-15", persentase: 100, fotoCount: 2, engineerPIC: "Siti Aminah", catatan: "Terlambat karena cuaca" },
  { id: "M033", unitId: "U004", nama: milestoneStandar[1], urutan: 2, status: "selesai", tanggalTarget: "2024-03-20", tanggalAktual: "2024-04-10", persentase: 100, fotoCount: 3, engineerPIC: "Siti Aminah", catatan: "Material terlambat" },
  { id: "M034", unitId: "U004", nama: milestoneStandar[2], urutan: 3, status: "selesai", tanggalTarget: "2024-05-10", tanggalAktual: "2024-06-05", persentase: 100, fotoCount: 2, engineerPIC: "Siti Aminah" },
  { id: "M035", unitId: "U004", nama: milestoneStandar[3], urutan: 4, status: "progress", tanggalTarget: "2024-07-01", persentase: 40, fotoCount: 1, engineerPIC: "Siti Aminah", catatan: "Perlu percepatan" },
  { id: "M036", unitId: "U004", nama: milestoneStandar[4], urutan: 5, status: "belum_mulai", tanggalTarget: "2024-08-15", persentase: 0, fotoCount: 0 },
  { id: "M037", unitId: "U004", nama: milestoneStandar[5], urutan: 6, status: "belum_mulai", tanggalTarget: "2024-09-20", persentase: 0, fotoCount: 0 },
  { id: "M038", unitId: "U004", nama: milestoneStandar[6], urutan: 7, status: "belum_mulai", tanggalTarget: "2024-10-10", persentase: 0, fotoCount: 0 },
  { id: "M039", unitId: "U004", nama: milestoneStandar[7], urutan: 8, status: "belum_mulai", tanggalTarget: "2024-10-15", persentase: 0, fotoCount: 0 },
];

export const dummyKendala: Kendala[] = [
  {
    id: "K001",
    proyekId: "PRJ001",
    unitId: "U004",
    judul: "Keterlambatan Material Bata Ringan",
    deskripsi: "Supplier bata ringan belum mengirim material sesuai jadwal. Estimasi keterlambatan 2 minggu.",
    kategori: "material",
    status: "ditindaklanjuti",
    tanggalLapor: "2024-05-10",
    dilaporkanOleh: "Siti Aminah",
    ditindaklanjutiOleh: "Andi Wijaya",
    prioritas: "tinggi",
  },
  {
    id: "K002",
    proyekId: "PRJ001",
    unitId: "U003",
    judul: "Pekerjaan Dinding Tidak Sesuai Spesifikasi",
    deskripsi: "Ketebalan plester dinding kurang dari standar (hanya 1,5 cm, seharusnya 2 cm). Perlu perbaikan.",
    kategori: "spek",
    status: "selesai",
    tanggalLapor: "2024-06-05",
    dilaporkanOleh: "Budi Santoso",
    ditindaklanjutiOleh: "Kontraktor PT Jaya",
    tanggalSelesai: "2024-06-12",
    solusi: "Sudah diperbaiki dan sesuai spek",
    prioritas: "sedang",
  },
  {
    id: "K003",
    proyekId: "PRJ001",
    unitId: "U005",
    judul: "Hujan Ekstrem Menghambat Pengecoran",
    deskripsi: "Cuaca hujan deras selama 3 hari berturut-turut menghambat proses pengecoran pondasi.",
    kategori: "cuaca",
    status: "baru",
    tanggalLapor: "2024-11-18",
    dilaporkanOleh: "Budi Santoso",
    prioritas: "sedang",
  },
];

export const dummySiteEngineer: SiteEngineer[] = [
  {
    id: "SE001",
    nama: "Budi Santoso",
    telepon: "081234567890",
    email: "budi.s@example.com",
    proyekId: "PRJ001",
    blokTugas: "A",
    jumlahUnitTugas: 4,
  },
  {
    id: "SE002",
    nama: "Siti Aminah",
    telepon: "081234567891",
    email: "siti.a@example.com",
    proyekId: "PRJ001",
    blokTugas: "B",
    jumlahUnitTugas: 4,
  },
  {
    id: "SE003",
    nama: "Andi Wijaya",
    telepon: "081234567892",
    email: "andi.w@example.com",
    proyekId: "PRJ002",
    jumlahUnitTugas: 18,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════════════════

export const formatRupiah = (angka: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
};

export const formatTanggal = (tanggal: string): string => {
  return new Date(tanggal).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatTanggalShort = (tanggal: string): string => {
  return new Date(tanggal).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const statusProyekLabel: Record<StatusProyek, string> = {
  perencanaan: "Perencanaan",
  konstruksi: "Konstruksi",
  finishing: "Finishing",
  selesai: "Selesai",
};

export const statusProyekColor: Record<StatusProyek, string> = {
  perencanaan: "bg-slate-100 text-slate-700 border-slate-200",
  konstruksi: "bg-blue-100 text-blue-700 border-blue-200",
  finishing: "bg-amber-100 text-amber-700 border-amber-200",
  selesai: "bg-green-100 text-green-700 border-green-200",
};

export const statusMilestoneLabel: Record<StatusMilestone, string> = {
  belum_mulai: "Belum Mulai",
  progress: "Sedang Dikerjakan",
  selesai: "Selesai",
};

export const statusMilestoneColor: Record<StatusMilestone, string> = {
  belum_mulai: "bg-slate-100 text-slate-600 border-slate-200",
  progress: "bg-blue-100 text-blue-600 border-blue-200",
  selesai: "bg-green-100 text-green-600 border-green-200",
};

export const statusUnitColor: Record<StatusUnit, string> = {
  on_track: "border-green-400 bg-green-50",
  warning: "border-amber-400 bg-amber-50",
  terlambat: "border-red-400 bg-red-50",
};

export const statusKendalaLabel: Record<StatusKendala, string> = {
  baru: "Baru",
  ditindaklanjuti: "Ditindaklanjuti",
  selesai: "Selesai",
};

export const statusKendalaColor: Record<StatusKendala, string> = {
  baru: "bg-red-100 text-red-700 border-red-200",
  ditindaklanjuti: "bg-amber-100 text-amber-700 border-amber-200",
  selesai: "bg-green-100 text-green-700 border-green-200",
};

export const kategoriKendalaLabel: Record<KategoriKendala, string> = {
  spek: "Tidak Sesuai Spek",
  jadwal: "Jadwal Molor",
  cuaca: "Kendala Cuaca",
  material: "Masalah Material",
  lainnya: "Lainnya",
};

export const prioritasColor = {
  rendah: "bg-slate-100 text-slate-600",
  sedang: "bg-amber-100 text-amber-600",
  tinggi: "bg-red-100 text-red-600",
};

export const getMilestoneByUnit = (unitId: string): Milestone[] => {
  return dummyMilestone.filter((m) => m.unitId === unitId).sort((a, b) => a.urutan - b.urutan);
};

export const getUnitByProyek = (proyekId: string): Unit[] => {
  return dummyUnit.filter((u) => u.proyekId === proyekId);
};

export const getKendalaByProyek = (proyekId: string): Kendala[] => {
  return dummyKendala.filter((k) => k.proyekId === proyekId);
};

export const getSiteEngineerByProyek = (proyekId: string): SiteEngineer[] => {
  return dummySiteEngineer.filter((se) => se.proyekId === proyekId);
};

export const getProyekById = (id: string): Proyek | undefined => {
  return dummyProyek.find((p) => p.id === id);
};

export const getUnitById = (id: string): Unit | undefined => {
  return dummyUnit.find((u) => u.id === id);
};
