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

export const dummyTagihan: Tagihan[] = [
  {
    id: "TGH-001",
    nomorTagihan: "INV/2024/01/001",
    customerNama: "Budi Santoso",
    unit: "A-12",
    tipeTagihan: "angsuran",
    nominal: 15000000,
    jatuhTempo: "2024-02-05",
    tanggalBayar: "2024-02-03",
    status: "lunas",
    cicilan: { ke: 3, dari: 12 },
  },
  {
    id: "TGH-002",
    nomorTagihan: "INV/2024/01/002",
    customerNama: "Siti Nurhaliza",
    unit: "B-08",
    tipeTagihan: "dp",
    nominal: 50000000,
    jatuhTempo: "2024-02-10",
    status: "belum_bayar",
  },
  {
    id: "TGH-003",
    nomorTagihan: "INV/2024/01/003",
    customerNama: "Ahmad Dahlan",
    unit: "A-05",
    tipeTagihan: "angsuran",
    nominal: 12000000,
    jatuhTempo: "2024-01-28",
    status: "terlambat",
    cicilan: { ke: 8, dari: 24 },
  },
  {
    id: "TGH-004",
    nomorTagihan: "INV/2024/01/004",
    customerNama: "Rina Wijaya",
    unit: "C-15",
    tipeTagihan: "angsuran",
    nominal: 15000000,
    jatuhTempo: "2024-02-15",
    tanggalBayar: "2024-02-12",
    status: "lunas",
    cicilan: { ke: 5, dari: 12 },
  },
  {
    id: "TGH-005",
    nomorTagihan: "INV/2024/01/005",
    customerNama: "Dedi Kurniawan",
    unit: "B-22",
    tipeTagihan: "pelunasan",
    nominal: 180000000,
    jatuhTempo: "2024-02-20",
    status: "belum_bayar",
  },
  {
    id: "TGH-006",
    nomorTagihan: "INV/2024/01/006",
    customerNama: "Lisa Permata",
    unit: "A-18",
    tipeTagihan: "ipl",
    nominal: 500000,
    jatuhTempo: "2024-02-01",
    tanggalBayar: "2024-02-01",
    status: "lunas",
  },
  {
    id: "TGH-007",
    nomorTagihan: "INV/2024/01/007",
    customerNama: "Hendra Gunawan",
    unit: "C-09",
    tipeTagihan: "angsuran",
    nominal: 18000000,
    jatuhTempo: "2024-02-08",
    status: "belum_bayar",
    cicilan: { ke: 2, dari: 18 },
  },
  {
    id: "TGH-008",
    nomorTagihan: "INV/2024/01/008",
    customerNama: "Fitri Handayani",
    unit: "B-14",
    tipeTagihan: "dp",
    nominal: 75000000,
    jatuhTempo: "2024-01-25",
    tanggalBayar: "2024-01-24",
    status: "lunas",
  },
];

export const dummyPengeluaran: Pengeluaran[] = [
  {
    id: "PGL-001",
    nomorBukti: "KKL/2024/01/001",
    tanggal: "2024-02-01",
    kategori: "material",
    keterangan: "Pembelian besi beton 50 ton",
    nominal: 85000000,
    vendor: "UD Baja Sejahtera",
    bukti: "/uploads/bukti-001.jpg",
    disetujuiOleh: "Direktur",
  },
  {
    id: "PGL-002",
    nomorBukti: "KKL/2024/01/002",
    tanggal: "2024-02-03",
    kategori: "kontraktor",
    keterangan: "Termin 2 - Pondasi Blok A",
    nominal: 120000000,
    vendor: "CV Karya Konstruksi",
    bukti: "/uploads/bukti-002.jpg",
    disetujuiOleh: "Manajer Proyek",
  },
  {
    id: "PGL-003",
    nomorBukti: "KKL/2024/01/003",
    tanggal: "2024-02-05",
    kategori: "marketing",
    keterangan: "Iklan Facebook & Instagram (Februari)",
    nominal: 5000000,
    vendor: "PT Digital Marketing Plus",
    disetujuiOleh: "Manajer Sales",
  },
  {
    id: "PGL-004",
    nomorBukti: "KKL/2024/01/004",
    tanggal: "2024-02-07",
    kategori: "perizinan",
    keterangan: "Pengurusan IMB 20 unit",
    nominal: 12000000,
    vendor: "Notaris Suharto & Partners",
    bukti: "/uploads/bukti-004.jpg",
    disetujuiOleh: "Admin Legal",
  },
  {
    id: "PGL-005",
    nomorBukti: "KKL/2024/01/005",
    tanggal: "2024-02-10",
    kategori: "operasional",
    keterangan: "Gaji karyawan bulan Januari",
    nominal: 45000000,
    disetujuiOleh: "Direktur",
  },
  {
    id: "PGL-006",
    nomorBukti: "KKL/2024/01/006",
    tanggal: "2024-02-12",
    kategori: "material",
    keterangan: "Semen Portland 200 sak",
    nominal: 8500000,
    vendor: "Toko Bangunan Jaya",
    bukti: "/uploads/bukti-006.jpg",
  },
  {
    id: "PGL-007",
    nomorBukti: "KKL/2024/01/007",
    tanggal: "2024-02-14",
    kategori: "lainnya",
    keterangan: "Perbaikan kantor marketing",
    nominal: 3500000,
    vendor: "UD Mebel Indah",
  },
];

export const dummyCashflow: CashflowItem[] = [
  { bulan: "2023-09", pemasukan: 385000000, pengeluaran: 198000000, saldo: 187000000 },
  { bulan: "2023-10", pemasukan: 420000000, pengeluaran: 215000000, saldo: 205000000 },
  { bulan: "2023-11", pemasukan: 510000000, pengeluaran: 280000000, saldo: 230000000 },
  { bulan: "2023-12", pemasukan: 625000000, pengeluaran: 340000000, saldo: 285000000 },
  { bulan: "2024-01", pemasukan: 580000000, pengeluaran: 385000000, saldo: 195000000 },
  { bulan: "2024-02", pemasukan: 465000000, pengeluaran: 279500000, saldo: 185500000 },
];

export const dummyRAB: RABItem[] = [
  {
    id: "RAB-001",
    pos: "Struktur & Pondasi",
    kategori: "kontraktor",
    anggaran: 2500000000,
    realisasi: 1850000000,
    persentase: 74,
  },
  {
    id: "RAB-002",
    pos: "Material Bangunan",
    kategori: "material",
    anggaran: 1800000000,
    realisasi: 1240000000,
    persentase: 69,
  },
  {
    id: "RAB-003",
    pos: "Perizinan & Legal",
    kategori: "perizinan",
    anggaran: 150000000,
    realisasi: 128000000,
    persentase: 85,
  },
  {
    id: "RAB-004",
    pos: "Marketing & Promosi",
    kategori: "marketing",
    anggaran: 250000000,
    realisasi: 142000000,
    persentase: 57,
  },
  {
    id: "RAB-005",
    pos: "Operasional & Gaji",
    kategori: "operasional",
    anggaran: 600000000,
    realisasi: 315000000,
    persentase: 53,
  },
  {
    id: "RAB-006",
    pos: "Finishing & Interior",
    kategori: "kontraktor",
    anggaran: 900000000,
    realisasi: 215000000,
    persentase: 24,
  },
];

export const laporanBulanan: LaporanKeuangan = {
  periode: "Januari 2024",
  totalPemasukan: 580000000,
  totalPengeluaran: 385000000,
  labaKotor: 195000000,
  proyekAktif: 3,
};

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
