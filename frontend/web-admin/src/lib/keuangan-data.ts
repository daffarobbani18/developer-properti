// ============================================
// KEUANGAN MODULE — DUMMY DATA
// ============================================

// ============================================
// TYPES & ENUMS
// ============================================

export type StatusTagihan = "belum_bayar" | "lunas" | "terlambat" | "cicilan";

export type KategoriPengeluaran =
  | "material"
  | "kontraktor"
  | "marketing"
  | "perizinan"
  | "operasional"
  | "lainnya";

export interface Tagihan {
  id: string;
  nomorTagihan: string;
  customerNama: string;
  unit: string;
  tipeTagihan: "dp" | "angsuran" | "pelunasan" | "ipl";
  nominal: number;
  jatuhTempo: string;
  tanggalBayar?: string;
  status: StatusTagihan;
  cicilan?: {
    ke: number;
    dari: number;
  };
  buktiPembayaran?: string;
}

export interface Pengeluaran {
  id: string;
  nomorBukti: string;
  tanggal: string;
  kategori: KategoriPengeluaran;
  keterangan: string;
  nominal: number;
  vendor?: string;
  bukti?: string;
  disetujuiOleh?: string;
}

export interface CashflowItem {
  bulan: string; // "2024-01"
  pemasukan: number;
  pengeluaran: number;
  saldo: number;
}

export interface RABItem {
  id: string;
  pos: string;
  kategori: KategoriPengeluaran;
  anggaran: number;
  realisasi: number;
  persentase: number; // realisasi / anggaran * 100
}

export interface LaporanKeuangan {
  periode: string;
  totalPemasukan: number;
  totalPengeluaran: number;
  labaKotor: number;
  proyekAktif: number;
}

// ============================================
// DUMMY DATA
// ============================================

export const dummyTagihan: Tagihan[] = [];

export const dummyPengeluaran: Pengeluaran[] = [];

export const dummyCashflow: CashflowItem[] = [];

export const dummyRAB: RABItem[] = [];

export const laporanBulanan: LaporanKeuangan = { periode: "Current", totalPemasukan: 0, totalPengeluaran: 0, labaKotor: 0, proyekAktif: 0 };

// ============================================
// HELPER FUNCTIONS
// ============================================

export const kategoriPengeluaranLabels: Record<KategoriPengeluaran, string> = {
  material: "Material",
  kontraktor: "Kontraktor",
  marketing: "Marketing",
  perizinan: "Perizinan",
  operasional: "Operasional",
  lainnya: "Lainnya",
};

export const kategoriPengeluaranColors: Record<KategoriPengeluaran, string> = {
  material: "bg-amber-100 text-amber-700 border-amber-200",
  kontraktor: "bg-blue-100 text-blue-700 border-blue-200",
  marketing: "bg-purple-100 text-purple-700 border-purple-200",
  perizinan: "bg-green-100 text-green-700 border-green-200",
  operasional: "bg-slate-100 text-slate-700 border-slate-200",
  lainnya: "bg-gray-100 text-gray-700 border-gray-200",
};

export const statusTagihanLabels: Record<StatusTagihan, string> = {
  belum_bayar: "Belum Bayar",
  lunas: "Lunas",
  terlambat: "Terlambat",
  cicilan: "Cicilan",
};

export const statusTagihanColors: Record<StatusTagihan, string> = {
  belum_bayar: "bg-amber-100 text-amber-700 border-amber-200",
  lunas: "bg-green-100 text-green-700 border-green-200",
  terlambat: "bg-red-100 text-red-700 border-red-200",
  cicilan: "bg-blue-100 text-blue-700 border-blue-200",
};

export const tipeTagihanLabels: Record<
  "dp" | "angsuran" | "pelunasan" | "ipl",
  string
> = {
  dp: "DP",
  angsuran: "Angsuran",
  pelunasan: "Pelunasan",
  ipl: "IPL",
};

// Format currency with Rupiah symbol
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date to Indonesian format
export function formatTanggal(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

// Format date to short format
export function formatTanggalShort(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

// Get month name from YYYY-MM format
export function getBulanName(bulanString: string): string {
  const [year, month] = bulanString.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(date);
}

// Check if tagihan is overdue
export function isOverdue(jatuhTempo: string, status: StatusTagihan): boolean {
  if (status === "lunas") return false;
  const today = new Date();
  const dueDate = new Date(jatuhTempo);
  return dueDate < today;
}

// Calculate total tagihan by status
export function getTotalByStatus(
  tagihan: Tagihan[],
  status: StatusTagihan
): number {
  return tagihan
    .filter((t) => t.status === status)
    .reduce((sum, t) => sum + t.nominal, 0);
}

// Calculate total pengeluaran by kategori
export function getTotalByKategori(
  pengeluaran: Pengeluaran[],
  kategori: KategoriPengeluaran
): number {
  return pengeluaran
    .filter((p) => p.kategori === kategori)
    .reduce((sum, p) => sum + p.nominal, 0);
}
