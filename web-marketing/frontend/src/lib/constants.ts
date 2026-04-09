/**
 * Konstanta global Website Marketing
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §1.1
 */

export const SITE_NAME =
  process.env.NEXT_PUBLIC_SITE_NAME ?? 'Perumahan Grand Harmoni';

export const WA_NUMBER =
  process.env.NEXT_PUBLIC_WA_NUMBER ?? '6281234567890';

export const WA_DEFAULT_MESSAGE =
  process.env.NEXT_PUBLIC_WA_MESSAGE ??
  'Halo, saya tertarik dengan perumahan. Bisa minta informasi lebih lanjut?';

export const GOOGLE_MAPS_EMBED_URL =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ?? '';

/** Buat URL WhatsApp dengan pesan kustom */
export function buildWaUrl(message?: string): string {
  const msg = encodeURIComponent(message ?? WA_DEFAULT_MESSAGE);
  return `https://wa.me/${WA_NUMBER}?text=${msg}`;
}

/** Navigasi utama */
export const NAV_LINKS = [
  { label: 'Beranda',      href: '/' },
  { label: 'Tipe Rumah',  href: '/tipe-rumah' },
  { label: 'Galeri',      href: '/galeri' },
  { label: 'Fasilitas',   href: '/fasilitas' },
  { label: 'Lokasi',      href: '/lokasi' },
  { label: 'Simulasi KPR', href: '/simulasi-kpr' },
  { label: 'Kontak',      href: '/kontak' },
] as const;

/** Jam operasional */
export const JAM_OPERASIONAL = [
  { hari: 'Senin – Jumat', jam: '08.00 – 17.00' },
  { hari: 'Sabtu',         jam: '08.00 – 15.00' },
  { hari: 'Minggu',        jam: '09.00 – 13.00' },
];

/** Kontak kantor */
export const KONTAK = {
  alamat: 'Jl. Contoh No. 1, Kec. Harmoni, Kota Impian',
  telepon: '(021) 1234-5678',
  email: 'info@grandharmoni.co.id',
  instagram: 'https://instagram.com/grandharmoni',
  facebook: 'https://facebook.com/grandharmoni',
  youtube: '',
  tiktok: '',
};
