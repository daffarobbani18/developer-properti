/**
 * Data statis tipe rumah (placeholder sebelum API backend tersedia)
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §data-statis
 */
import type { Unit } from '@/types';

export const units: Unit[] = [
  {
    slug: 'tipe-36-72',
    name: 'Tipe 36/72',
    status: 'tersedia',
    price: 350_000_000,
    landArea: 72,
    buildingArea: 36,
    bedrooms: 2,
    bathrooms: 1,
    carport: 1,
    floors: 1,
    electricity: '1300 VA',
    water: 'PDAM',
    images: [
      {
        src: '/images/units/tipe-36-1.jpg',
        alt: 'Tampak depan Tipe 36/72',
        caption: 'Tampak Depan',
      },
      {
        src: '/images/units/tipe-36-2.jpg',
        alt: 'Ruang tamu Tipe 36/72',
        caption: 'Ruang Tamu',
      },
    ],
    floorPlan: '/images/units/denah-tipe-36.jpg',
    description:
      'Tipe 36/72 hadir sebagai pilihan hunian terjangkau dengan desain fungsional untuk keluarga muda. Dilengkapi dengan 2 kamar tidur dan taman depan.',
    features: ['Taman depan', 'Carport 1 mobil', 'Ruang tamu', 'Dapur kering'],
    materials: {
      foundation: 'Beton bertulang',
      walls: 'Bata merah plester',
      roof: 'Genteng beton',
      floor: 'Keramik 40x40',
      frame: 'Kayu kelas II',
      sanitasi: 'Septik tank',
    },
    isFeatured: true,
  },
  {
    slug: 'tipe-45-84',
    name: 'Tipe 45/84',
    status: 'tersedia',
    price: 450_000_000,
    landArea: 84,
    buildingArea: 45,
    bedrooms: 3,
    bathrooms: 2,
    carport: 1,
    floors: 1,
    electricity: '2200 VA',
    water: 'PDAM',
    images: [
      {
        src: '/images/units/tipe-45-1.jpg',
        alt: 'Tampak depan Tipe 45/84',
        caption: 'Tampak Depan',
      },
      {
        src: '/images/units/tipe-45-2.jpg',
        alt: 'Ruang keluarga Tipe 45/84',
        caption: 'Ruang Keluarga',
      },
    ],
    floorPlan: '/images/units/denah-tipe-45.jpg',
    description:
      'Tipe 45/84 adalah pilihan ideal untuk keluarga yang berkembang. Tersedia 3 kamar tidur, 2 kamar mandi, dan ruang keluarga yang luas.',
    features: [
      'Taman depan & belakang',
      'Carport 1 mobil',
      'Ruang keluarga',
      'Dapur basah & kering',
    ],
    materials: {
      foundation: 'Beton bertulang',
      walls: 'Bata merah plester',
      roof: 'Genteng beton',
      floor: 'Keramik 40x40',
      frame: 'Kayu kelas II',
      sanitasi: 'Septik tank',
    },
    isFeatured: true,
  },
  {
    slug: 'tipe-60-120',
    name: 'Tipe 60/120',
    status: 'indent',
    price: 650_000_000,
    landArea: 120,
    buildingArea: 60,
    bedrooms: 3,
    bathrooms: 2,
    carport: 2,
    floors: 2,
    electricity: '2200 VA',
    water: 'PDAM',
    images: [
      {
        src: '/images/units/tipe-60-1.jpg',
        alt: 'Tampak depan Tipe 60/120',
        caption: 'Tampak Depan',
      },
      {
        src: '/images/units/tipe-60-2.jpg',
        alt: 'Ruang keluarga dua lantai Tipe 60/120',
        caption: 'Ruang Keluarga',
      },
    ],
    floorPlan: '/images/units/denah-tipe-60.jpg',
    description:
      'Tipe 60/120 menghadirkan ruang hidup yang lebih lega dengan 2 lantai. Cocok untuk keluarga yang menginginkan privasi dan ruang ekstra.',
    features: [
      'Taman depan & belakang luas',
      'Carport 2 mobil',
      'Ruang keluarga lantai 2',
      'Balkon',
      'Dapur basah & kering',
    ],
    materials: {
      foundation: 'Beton bertulang',
      walls: 'Bata merah plester',
      roof: 'Genteng beton',
      floor: 'Granit 60x60',
      frame: 'Baja ringan',
      sanitasi: 'Septik tank modern',
    },
    isFeatured: true,
  },
];

export const getFeaturedUnits = () => units.filter((u) => u.isFeatured);
export const getUnitBySlug = (slug: string) =>
  units.find((u) => u.slug === slug);

/**
 * Dapatkan 3 unit tipe lain sebagai rekomendasi / related units.
 * Exclude unit saat ini, kemudian ambil yang lain secara random.
 */
export const getRelatedUnits = (currentSlug: string, limit = 3): Unit[] => {
  return units
    .filter((u) => u.slug !== currentSlug)
    .sort(() => Math.random() - 0.5)
    .slice(0, limit);
};
