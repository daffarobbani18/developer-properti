/**
 * Data statis promo aktif
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §5.4
 */
import type { Promo } from '@/types';

export const promos: Promo[] = [
  {
    id: 'dp-ringan-maret',
    title: 'DP Ringan 5% — Maret 2026',
    description:
      'Dapatkan kemudahan uang muka hanya 5% untuk semua tipe unit. Berlaku untuk 10 pembeli pertama di bulan Maret 2026.',
    image: '/images/promos/promo-dp-ringan.jpg',
    validUntil: '2026-03-31',
    ctaLabel: 'Klaim Promo via WhatsApp',
  },
  {
    id: 'free-biaya-kpr',
    title: 'Gratis Biaya Proses KPR',
    description:
      'Kami tanggung biaya provisi dan administrasi KPR hingga Rp 5 juta untuk pembeli yang proses di bulan ini.',
    image: '/images/promos/promo-kpr.jpg',
    validUntil: '2026-03-15',
    ctaLabel: 'Info Lebih Lanjut',
  },
];
