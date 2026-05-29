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
  kontraktorName?: string;
  estimasiAnggaran?: number;
  nomorIzin?: string;
  description?: string;
  imageUrl?: string;
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

export const dummyProyek: Proyek[] = [];

export const dummyUnit: Unit[] = [];

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

export const dummyMilestone: Milestone[] = [];

export const dummyKendala: Kendala[] = [];

export const dummySiteEngineer: SiteEngineer[] = [];

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
