/**
 * TypeScript types — Website Marketing SIMDP
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §data-statis
 */

/* ===================== Unit / Tipe Rumah ===================== */

export type UnitStatus = 'tersedia' | 'indent' | 'terjual';

export interface UnitMaterial {
  foundation: string;
  walls: string;
  roof: string;
  floor: string;
  frame: string;
  sanitasi?: string;
}

export interface UnitImage {
  src: string;            // path foto relatif ke /public
  alt: string;            // alt text untuk aksesibilitas
  caption?: string;       // caption opsional untuk lightbox
}

export interface Unit {
  slug: string;
  name: string;
  status: UnitStatus;
  price: number;
  landArea: number;       // luas tanah (m²)
  buildingArea: number;   // luas bangunan (m²)
  bedrooms: number;
  bathrooms: number;
  carport: number;
  floors: number;
  electricity: string;    // mis. "1300 VA"
  water: string;          // mis. "PDAM"
  images: UnitImage[];    // array foto dengan metadata
  floorPlan: string;      // path denah
  description: string;
  features: string[];
  materials: UnitMaterial;
  isFeatured?: boolean;   // ditampilkan di section preview halaman utama
}

/* ===================== Fasilitas ===================== */

export interface Facility {
  id: string;
  name: string;
  description: string;
  icon: string;   // nama ikon Lucide atau path SVG
  image: string;  // path foto
}

/* ===================== Galeri ===================== */

export type GalleryCategory =
  | 'semua'
  | 'eksterior'
  | 'interior'
  | 'fasilitas'
  | 'progres';

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: Exclude<GalleryCategory, 'semua'>;
  title?: string;
}

/* ===================== Testimoni ===================== */

export interface Testimonial {
  id: string;
  name: string;
  unitType: string;  // mis. "Tipe 36/72"
  quote: string;
  avatar: string;    // path foto atau '' untuk placeholder
  rating: number;    // 1–5
}

/* ===================== Promo ===================== */

export interface Promo {
  id: string;
  title: string;
  description: string;
  image: string;
  validUntil: string;  // ISO date string mis. "2026-03-31"
  ctaLabel: string;
  ctaHref?: string;   // jika ada link spesifik, selain WA
}

/* ===================== Form Leads ===================== */

export interface LeadFormData {
  nama: string;
  noHp: string;
  email?: string;
  tipeUnit: string;
  pesan?: string;
  honeypot?: string; // hidden anti-spam field
}

/* ===================== KPR Simulasi ===================== */

export interface KPRInput {
  harga: number;      // harga properti (Rp)
  dpPersen: number;   // uang muka (%)
  tenor: number;      // tenor (tahun)
  bungaPersen: number; // suku bunga per tahun (%)
}

export interface KPRResult {
  jumlahDp: number;
  pokokPinjaman: number;
  cicilanPerBulan: number;
  totalBayar: number;
  totalBunga: number;
}

/* ===================== Lokasi ===================== */

export type LokasiKategori =
  | 'pendidikan'
  | 'kesehatan'
  | 'perbelanjaan'
  | 'transportasi'
  | 'ibadah';

export interface LokasiTerdekat {
  kategori: LokasiKategori;
  nama: string;
  jarak: string;   // mis. "2,5 km"
  waktu: string;   // mis. "± 5 menit"
}
