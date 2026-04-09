/**
 * Gallery Data
 * Koleksi foto perumahan dengan kategori (Eksterior, Interior, Fasilitas, Progres)
 */

export type GalleryCategory = 'Eksterior' | 'Interior' | 'Fasilitas' | 'Progres';

export interface GalleryPhoto {
  id: string;
  title: string;
  category: GalleryCategory;
  image: string;
  caption?: string;
}

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  'Eksterior',
  'Interior',
  'Fasilitas',
  'Progres',
];

/**
 * Daftar foto galeri perumahan
 * Format: /images/gallery/[nama-file].jpg
 */
export const galleryPhotos: GalleryPhoto[] = [
  // ===== EKSTERIOR (Fasad, jalan, akses) =====
  {
    id: 'eksterior-001',
    title: 'Gerbang Utama Perumahan',
    category: 'Eksterior',
    image: '/images/gallery/eksterior-gerbang-utama.jpg',
    caption: 'Gerbang utama dengan desain modern dan keamanan 24 jam',
  },
  {
    id: 'eksterior-002',
    title: 'Jalan Utama Paving',
    category: 'Eksterior',
    image: '/images/gallery/eksterior-jalan-utama.jpg',
    caption: 'Jalan utama dengan paving berkualitas dan drainase baik',
  },
  {
    id: 'eksterior-003',
    title: 'Cluster Hunian',
    category: 'Eksterior',
    image: '/images/gallery/eksterior-cluster-hunian.jpg',
    caption: 'Cluster hunian dengan tata letak yang rapi dan teratur',
  },
  {
    id: 'eksterior-004',
    title: 'Area Hijau & Taman',
    category: 'Eksterior',
    image: '/images/gallery/eksterior-area-hijau.jpg',
    caption: 'Ruang terbuka hijau untuk rekreasi keluarga',
  },
  {
    id: 'eksterior-005',
    title: 'Jalan Samping dengan Pohon',
    category: 'Eksterior',
    image: '/images/gallery/eksterior-jalan-samping.jpg',
    caption: 'Jalan samping dengan penanaman pohon rindang',
  },
  {
    id: 'eksterior-006',
    title: 'Pos Keamanan',
    category: 'Eksterior',
    image: '/images/gallery/eksterior-pos-keamanan.jpg',
    caption: 'Pos keamanan modern dengan teknologi CCTV terpadu',
  },

  // ===== INTERIOR (Dalam rumah, kamar, ruang tamu) =====
  {
    id: 'interior-001',
    title: 'Ruang Tamu Tipe 36',
    category: 'Interior',
    image: '/images/gallery/interior-ruang-tamu-tipe36.jpg',
    caption: 'Ruang tamu luas dengan pencahayaan alami maksimal',
  },
  {
    id: 'interior-002',
    title: 'Dapur Modern',
    category: 'Interior',
    image: '/images/gallery/interior-dapur-modern.jpg',
    caption: 'Dapur dengan layout fungsional dan counter marmer',
  },
  {
    id: 'interior-003',
    title: 'Kamar Tidur Utama',
    category: 'Interior',
    image: '/images/gallery/interior-kamar-tidur-utama.jpg',
    caption: 'Kamar tidur utama dengan jendela besar dan ventilasi baik',
  },
  {
    id: 'interior-004',
    title: 'Kamar Tidur 2',
    category: 'Interior',
    image: '/images/gallery/interior-kamar-tidur-2.jpg',
    caption: 'Kamar tidur kedua dengan ukuran medium, cocok untuk anak',
  },
  {
    id: 'interior-005',
    title: 'Kamar Mandi Utama',
    category: 'Interior',
    image: '/images/gallery/interior-kamar-mandi-utama.jpg',
    caption: 'Kamar mandi dengan keramik premium dan tata letak efisien',
  },
  {
    id: 'interior-006',
    title: 'Tangga Interior',
    category: 'Interior',
    image: '/images/gallery/interior-tangga.jpg',
    caption: 'Tangga dengan desain modern dan safety railing',
  },
  {
    id: 'interior-007',
    title: 'Ruang Keluarga Tipe 45',
    category: 'Interior',
    image: '/images/gallery/interior-ruang-keluarga-tipe45.jpg',
    caption: 'Ruang keluarga luas dengan double bedroom',
  },
  {
    id: 'interior-008',
    title: 'Teras Depan',
    category: 'Interior',
    image: '/images/gallery/interior-teras-depan.jpg',
    caption: 'Teras depan dengan ruang untuk indoor garden',
  },

  // ===== FASILITAS (Komunal, playground, tempat ibadah) =====
  {
    id: 'fasilitas-001',
    title: 'Taman Bermain Anak',
    category: 'Fasilitas',
    image: '/images/gallery/fasilitas-taman-bermain.jpg',
    caption: 'Taman bermain anak-anak dengan permainan lengkap & aman',
  },
  {
    id: 'fasilitas-002',
    title: 'Mushola & Area Ibadah',
    category: 'Fasilitas',
    image: '/images/gallery/fasilitas-mushola.jpg',
    caption: 'Mushola modern dengan ablution area yang bersih',
  },
  {
    id: 'fasilitas-003',
    title: 'Lapangan Olahraga',
    category: 'Fasilitas',
    image: '/images/gallery/fasilitas-lapangan-olahraga.jpg',
    caption: 'Lapangan olahraga multifungsi untuk badminton & basket',
  },
  {
    id: 'fasilitas-004',
    title: 'Area Gym Outdoor',
    category: 'Fasilitas',
    image: '/images/gallery/fasilitas-gym-outdoor.jpg',
    caption: 'Area gym outdoor dengan peralatan fitness modern',
  },
  {
    id: 'fasilitas-005',
    title: 'Kolam Renang',
    category: 'Fasilitas',
    image: '/images/gallery/fasilitas-kolam-renang.jpg',
    caption: 'Kolam renang dengan kedalaman bervariasi untuk seluruh anggota keluarga',
  },
  {
    id: 'fasilitas-006',
    title: 'Area Bersantai & Gazebo',
    category: 'Fasilitas',
    image: '/images/gallery/fasilitas-gazebo.jpg',
    caption: 'Gazebo cantik untuk area bersantai keluarga',
  },
  {
    id: 'fasilitas-007',
    title: 'Taman Komunal',
    category: 'Fasilitas',
    image: '/images/gallery/fasilitas-taman-komunal.jpg',
    caption: 'Taman komunal luas dengan walking path yang nyaman',
  },

  // ===== PROGRES PEMBANGUNAN (Progress konstruksi) =====
  {
    id: 'progres-001',
    title: 'Persiapan Lahan Fase 1',
    category: 'Progres',
    image: '/images/gallery/progres-persiapan-lahan.jpg',
    caption: 'Tahap persiapan dan pengukuran lahan - Bulan 1',
  },
  {
    id: 'progres-002',
    title: 'Pondasi Cluster A',
    category: 'Progres',
    image: '/images/gallery/progres-pondasi-cluster-a.jpg',
    caption: 'Pekerjaan pondasi monolit dengan standar struktur tinggi - Bulan 2-3',
  },
  {
    id: 'progres-003',
    title: 'Dinding & Atap Cluster B',
    category: 'Progres',
    image: '/images/gallery/progres-dinding-atap-cluster-b.jpg',
    caption: 'Ereksi struktur dan penutupan atap - Bulan 4-5',
  },
  {
    id: 'progres-004',
    title: 'Finishing Interior Fase 1',
    category: 'Progres',
    image: '/images/gallery/progres-finishing-interior.jpg',
    caption: 'Tahap finishing interior dengan material berkualitas - Bulan 6-7',
  },
  {
    id: 'progres-005',
    title: 'Infrastruktur Jalan',
    category: 'Progres',
    image: '/images/gallery/progres-infrastruktur-jalan.jpg',
    caption: 'Pekerjaan paving dan infrastruktur jalan komunal - Bulan 6',
  },
  {
    id: 'progres-006',
    title: 'Landscaping Area Hijau',
    category: 'Progres',
    image: '/images/gallery/progres-landscaping-hijau.jpg',
    caption: 'Penanaman pohon dan penghijauan area komunal - Bulan 7-8',
  },
  {
    id: 'progres-007',
    title: 'Handed Over Unit',
    category: 'Progres',
    image: '/images/gallery/progres-handed-over-unit.jpg',
    caption: 'Unit siap serah terima dengan sertifikat lengkap - Bulan 9+',
  },
];

/**
 * Get all gallery photos (dengan filter operasional)
 */
export function getAllGalleryPhotos(): GalleryPhoto[] {
  return galleryPhotos;
}

/**
 * Get gallery photos by category
 */
export function getGalleryByCategory(category: GalleryCategory): GalleryPhoto[] {
  return galleryPhotos.filter((photo) => photo.category === category);
}

/**
 * Get featured gallery photos (random selection, limit 6)
 */
export function getFeaturedGallery(limit = 6): GalleryPhoto[] {
  const shuffled = [...galleryPhotos].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}
