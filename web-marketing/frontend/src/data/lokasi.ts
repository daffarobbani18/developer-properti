/**
 * Data statis lokasi terdekat — ditampilkan di LokasiSection
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §2.4
 */
import type { LokasiTerdekat } from '@/types';

export const lokasiTerdekat: LokasiTerdekat[] = [
  // Pendidikan
  { kategori: 'pendidikan', nama: 'SD Negeri 01 Harmoni',       jarak: '0,8 km',  waktu: '± 3 menit' },
  { kategori: 'pendidikan', nama: 'SMP Negeri 5 Kota',          jarak: '1,2 km',  waktu: '± 5 menit' },
  { kategori: 'pendidikan', nama: 'SMA Unggulan Nusantara',      jarak: '2,0 km',  waktu: '± 7 menit' },
  // Kesehatan
  { kategori: 'kesehatan',  nama: 'RS Umum Daerah',             jarak: '2,5 km',  waktu: '± 8 menit' },
  { kategori: 'kesehatan',  nama: 'Klinik Pratama 24 Jam',      jarak: '0,5 km',  waktu: '± 2 menit' },
  // Perbelanjaan
  { kategori: 'perbelanjaan', nama: 'Supermarket Grand Mart',   jarak: '1,0 km',  waktu: '± 4 menit' },
  { kategori: 'perbelanjaan', nama: 'Mall Harmoni City',        jarak: '3,5 km',  waktu: '± 10 menit' },
  // Transportasi
  { kategori: 'transportasi', nama: 'Pintu Tol Harmoni',        jarak: '4,0 km',  waktu: '± 12 menit' },
  { kategori: 'transportasi', nama: 'Terminal Bus Kota',         jarak: '2,8 km',  waktu: '± 9 menit' },
  // Ibadah
  { kategori: 'ibadah',     nama: 'Masjid Agung Kota',          jarak: '1,5 km',  waktu: '± 5 menit' },
  { kategori: 'ibadah',     nama: 'Gereja Kristus Damai',       jarak: '1,8 km',  waktu: '± 6 menit' },
];

/** URL Google Maps untuk tombol "Buka di Google Maps" (placeholder) */
export const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/search/perumahan+grand+harmoni';

/** Icon per kategori */
export const KATEGORI_ICON: Record<LokasiTerdekat['kategori'], string> = {
  pendidikan:    'GraduationCap',
  kesehatan:     'Heart',
  perbelanjaan:  'ShoppingBag',
  transportasi:  'Car',
  ibadah:        'Building',
};

/** Label per kategori */
export const KATEGORI_LABEL: Record<LokasiTerdekat['kategori'], string> = {
  pendidikan:    'Pendidikan',
  kesehatan:     'Kesehatan',
  perbelanjaan:  'Perbelanjaan',
  transportasi:  'Transportasi',
  ibadah:        'Ibadah',
};
