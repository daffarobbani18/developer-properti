/**
 * Data statis testimoni pembeli
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §2.5
 */
import type { Testimonial } from '@/types';

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Bapak Ahmad Fauzan',
    unitType: 'Tipe 45/84',
    quote:
      'Proses pembeliannya sangat mudah dan transparan. Tim sales sangat responsif dan membantu kami dari awal hingga serah terima kunci. Sangat puas!',
    avatar: '/images/testimonials/avatar-1.jpg',
    rating: 5,
  },
  {
    id: '2',
    name: 'Ibu Sari Dewi',
    unitType: 'Tipe 36/72',
    quote:
      'Lokasi perumahan sangat strategis, dekat sekolah anak-anak dan pusat perbelanjaan. Kualitas bangunan juga memuaskan sesuai yang dijanjikan.',
    avatar: '/images/testimonials/avatar-2.jpg',
    rating: 5,
  },
  {
    id: '3',
    name: 'Keluarga Hendra & Rina',
    unitType: 'Tipe 60/120',
    quote:
      'Lingkungan perumahan sangat nyaman dan aman. Fasilitas lengkap, jalan dalam kompleks bagus, dan tetangga yang ramah. Pilihan tepat untuk keluarga!',
    avatar: '/images/testimonials/avatar-3.jpg',
    rating: 5,
  },
  {
    id: '4',
    name: 'Pak Doni Setiawan',
    unitType: 'Tipe 45/84',
    quote:
      'Harga kompetitif dengan kualitas yang tidak mengecewakan. Developer amanah, progres pembangunan selalu update dan sesuai jadwal.',
    avatar: '',
    rating: 4,
  },
];
