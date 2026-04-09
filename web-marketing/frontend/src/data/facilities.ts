/**
 * Data statis fasilitas perumahan
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §4.2
 */
import type { Facility } from '@/types';

export const facilities: Facility[] = [
  {
    id: 'taman-bermain',
    name: 'Taman Bermain Anak',
    description:
      'Area bermain anak yang aman dan nyaman dengan berbagai fasilitas permainan edukatif.',
    icon: 'trees',
    image: '/images/facilities/taman-bermain.jpg',
  },
  {
    id: 'masjid',
    name: 'Masjid Perumahan',
    description:
      'Masjid perumahan yang dapat menampung hingga 200 jamaah, tersedia untuk seluruh warga.',
    icon: 'building',
    image: '/images/facilities/masjid.jpg',
  },
  {
    id: 'cctv',
    name: 'CCTV 24 Jam',
    description:
      'Sistem pengawasan CCTV di seluruh area strategis perumahan yang aktif 24 jam penuh.',
    icon: 'camera',
    image: '/images/facilities/cctv.jpg',
  },
  {
    id: 'one-gate',
    name: 'One Gate System',
    description:
      'Sistem keamanan satu pintu masuk dengan petugas keamanan berjaga sepanjang waktu.',
    icon: 'shield-check',
    image: '/images/facilities/one-gate.jpg',
  },
  {
    id: 'jalan-paving',
    name: 'Jalan Paving Block',
    description:
      'Seluruh jalan dalam perumahan menggunakan paving block berkualitas tinggi yang rapi.',
    icon: 'map',
    image: '/images/facilities/jalan.jpg',
  },
  {
    id: 'area-hijau',
    name: 'Area Hijau & RTH',
    description:
      'Ruang Terbuka Hijau yang asri sebagai paru-paru perumahan dan tempat bersantai warga.',
    icon: 'leaf',
    image: '/images/facilities/rth.jpg',
  },
  {
    id: 'drainase',
    name: 'Drainase Terintegrasi',
    description:
      'Sistem drainase yang didesain untuk mencegah genangan air saat musim hujan.',
    icon: 'droplets',
    image: '/images/facilities/drainase.jpg',
  },
];
