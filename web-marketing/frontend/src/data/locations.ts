/**
 * Locations Data
 * Daftar tempat penting di sekitar perumahan dengan kategori & jarak
 */

export type LocationCategory = 'Pendidikan' | 'Kesehatan' | 'Perbelanjaan' | 'Transportasi' | 'Ibadah';

export interface Location {
  id: string;
  name: string;
  category: LocationCategory;
  distance: number; // dalam km
  duration: string; // waktu tempuh, misal "5 menit"
  icon: string; // emoji atau unicode
  lat?: number;
  lng?: number;
  googleMapsUrl: string;
  directionsUrl: string;
  description?: string;
}

export const LOCATION_CATEGORIES: LocationCategory[] = [
  'Pendidikan',
  'Kesehatan',
  'Perbelanjaan',
  'Transportasi',
  'Ibadah',
];

/**
 * Data lokasi penting di sekitar perumahan
 * URLs menggunakan template yang dapat diisi dengan koordinat pusat perumahan
 */
export const locations: Location[] = [
  // ===== PENDIDIKAN =====
  {
    id: 'pendidikan-001',
    name: 'SD Negeri 01 Perumahan',
    category: 'Pendidikan',
    distance: 0.3,
    duration: '5 menit',
    icon: '🎓',
    lat: -7.1234,
    lng: 110.5678,
    googleMapsUrl: 'https://maps.google.com/?q=SD+Negeri+01',
    directionsUrl: 'https://maps.google.com/?q=SD+Negeri+01&dir',
    description: 'Sekolah dasar dengan fasilitas modern di dalam perumahan',
  },
  {
    id: 'pendidikan-002',
    name: 'SMP Negeri 15',
    category: 'Pendidikan',
    distance: 0.8,
    duration: '10 menit',
    icon: '📚',
    lat: -7.1290,
    lng: 110.5720,
    googleMapsUrl: 'https://maps.google.com/?q=SMP+Negeri+15',
    directionsUrl: 'https://maps.google.com/?q=SMP+Negeri+15&dir',
    description: 'Sekolah menengah pertama berkualitas di dekat perumahan',
  },
  {
    id: 'pendidikan-003',
    name: 'SMA Negeri 8',
    category: 'Pendidikan',
    distance: 2.0,
    duration: '15 menit',
    icon: '🏫',
    lat: -7.1450,
    lng: 110.5850,
    googleMapsUrl: 'https://maps.google.com/?q=SMA+Negeri+8',
    directionsUrl: 'https://maps.google.com/?q=SMA+Negeri+8&dir',
    description: 'Sekolah menengah atas dengan program unggulan',
  },
  {
    id: 'pendidikan-004',
    name: 'TK Terpadu Ceria',
    category: 'Pendidikan',
    distance: 0.5,
    duration: '7 menit',
    icon: '👶',
    lat: -7.1250,
    lng: 110.5700,
    googleMapsUrl: 'https://maps.google.com/?q=TK+Terpadu+Ceria',
    directionsUrl: 'https://maps.google.com/?q=TK+Terpadu+Ceria&dir',
    description: 'Taman kanak-kanak dengan kurikulum internasional',
  },

  // ===== KESEHATAN =====
  {
    id: 'kesehatan-001',
    name: 'Klinik Kesehatan 24 Jam',
    category: 'Kesehatan',
    distance: 0.4,
    duration: '6 menit',
    icon: '⚕️',
    lat: -7.1210,
    lng: 110.5690,
    googleMapsUrl: 'https://maps.google.com/?q=Klinik+Kesehatan+24+Jam',
    directionsUrl: 'https://maps.google.com/?q=Klinik+Kesehatan+24+Jam&dir',
    description: 'Klinik medis dengan dokter umum & spesialis',
  },
  {
    id: 'kesehatan-002',
    name: 'Rumah Sakit Umum Regional',
    category: 'Kesehatan',
    distance: 3.5,
    duration: '20 menit',
    icon: '🏥',
    lat: -7.1600,
    lng: 110.5900,
    googleMapsUrl: 'https://maps.google.com/?q=Rumah+Sakit+Umum+Regional',
    directionsUrl: 'https://maps.google.com/?q=Rumah+Sakit+Umum+Regional&dir',
    description: 'Rumah sakit dengan fasilitas lengkap & ICU',
  },
  {
    id: 'kesehatan-003',
    name: 'Apotek Modern',
    category: 'Kesehatan',
    distance: 0.2,
    duration: '3 menit',
    icon: '💊',
    lat: -7.1220,
    lng: 110.5680,
    googleMapsUrl: 'https://maps.google.com/?q=Apotek+Modern',
    directionsUrl: 'https://maps.google.com/?q=Apotek+Modern&dir',
    description: 'Apotek lengkap dengan resep digital',
  },
  {
    id: 'kesehatan-004',
    name: 'Detox & Spa Wellness',
    category: 'Kesehatan',
    distance: 1.2,
    duration: '12 menit',
    icon: '🧘',
    lat: -7.1350,
    lng: 110.5770,
    googleMapsUrl: 'https://maps.google.com/?q=Detox+Spa+Wellness',
    directionsUrl: 'https://maps.google.com/?q=Detox+Spa+Wellness&dir',
    description: 'Fasilitas spa & wellness center untuk relaksasi',
  },

  // ===== PERBELANJAAN =====
  {
    id: 'perbelanjaan-001',
    name: 'Minimarket Lengkap',
    category: 'Perbelanjaan',
    distance: 0.3,
    duration: '5 menit',
    icon: '🛒',
    lat: -7.1230,
    lng: 110.5685,
    googleMapsUrl: 'https://maps.google.com/?q=Minimarket+Lengkap',
    directionsUrl: 'https://maps.google.com/?q=Minimarket+Lengkap&dir',
    description: 'Mini market harian dengan produk lengkap',
  },
  {
    id: 'perbelanjaan-002',
    name: 'Pusat Perbelanjaan Modern Mall',
    category: 'Perbelanjaan',
    distance: 2.1,
    duration: '15 menit',
    icon: '🏬',
    lat: -7.1450,
    lng: 110.5820,
    googleMapsUrl: 'https://maps.google.com/?q=Modern+Mall',
    directionsUrl: 'https://maps.google.com/?q=Modern+Mall&dir',
    description: 'Mall dengan berbagai brand & restoran',
  },
  {
    id: 'perbelanjaan-003',
    name: 'Pasar Tradisional Segar',
    category: 'Perbelanjaan',
    distance: 1.0,
    duration: '10 menit',
    icon: '🥕',
    lat: -7.1300,
    lng: 110.5750,
    googleMapsUrl: 'https://maps.google.com/?q=Pasar+Tradisional+Segar',
    directionsUrl: 'https://maps.google.com/?q=Pasar+Tradisional+Segar&dir',
    description: 'Pasar tradisional dengan sayur & buah segar',
  },
  {
    id: 'perbelanjaan-004',
    name: 'Restoran & Food Court',
    category: 'Perbelanjaan',
    distance: 0.6,
    duration: '8 menit',
    icon: '🍽️',
    lat: -7.1260,
    lng: 110.5710,
    googleMapsUrl: 'https://maps.google.com/?q=Food+Court',
    directionsUrl: 'https://maps.google.com/?q=Food+Court&dir',
    description: 'Food court dengan berbagai pilihan makanan',
  },

  // ===== TRANSPORTASI =====
  {
    id: 'transportasi-001',
    name: 'Stasiun Kereta Api',
    category: 'Transportasi',
    distance: 2.5,
    duration: '20 menit',
    icon: '🚆',
    lat: -7.1500,
    lng: 110.5900,
    googleMapsUrl: 'https://maps.google.com/?q=Stasiun+Kereta+Api',
    directionsUrl: 'https://maps.google.com/?q=Stasiun+Kereta+Api&dir',
    description: 'Stasiun darat dengan akses ke berbagai tujuan',
  },
  {
    id: 'transportasi-002',
    name: 'Terminal Bus',
    category: 'Transportasi',
    distance: 1.8,
    duration: '15 menit',
    icon: '🚌',
    lat: -7.1400,
    lng: 110.5800,
    googleMapsUrl: 'https://maps.google.com/?q=Terminal+Bus',
    directionsUrl: 'https://maps.google.com/?q=Terminal+Bus&dir',
    description: 'Terminal bus dengan rute ke seluruh kota',
  },
  {
    id: 'transportasi-003',
    name: 'Halte TransJakarta',
    category: 'Transportasi',
    distance: 0.7,
    duration: '10 menit',
    icon: '🚌',
    lat: -7.1280,
    lng: 110.5730,
    googleMapsUrl: 'https://maps.google.com/?q=Halte+TransJakarta',
    directionsUrl: 'https://maps.google.com/?q=Halte+TransJakarta&dir',
    description: 'Halte transportasi umum dengan jadwal teratur',
  },
  {
    id: 'transportasi-004',
    name: 'Stasiun Gojek & Grab',
    category: 'Transportasi',
    distance: 0.1,
    duration: '1 menit',
    icon: '🚗',
    lat: -7.1235,
    lng: 110.5680,
    googleMapsUrl: 'https://maps.google.com/?q=Gojek+Grab',
    directionsUrl: 'https://maps.google.com/?q=Gojek+Grab&dir',
    description: 'Layanan transportasi online 24/7',
  },

  // ===== IBADAH =====
  {
    id: 'ibadah-001',
    name: 'Masjid Persatuan Ummat',
    category: 'Ibadah',
    distance: 0.2,
    duration: '3 menit',
    icon: '🕌',
    lat: -7.1215,
    lng: 110.5675,
    googleMapsUrl: 'https://maps.google.com/?q=Masjid+Persatuan',
    directionsUrl: 'https://maps.google.com/?q=Masjid+Persatuan&dir',
    description: 'Masjid utama dalam perumahan dengan fasilitas lengkap',
  },
  {
    id: 'ibadah-002',
    name: 'Gereja Kristen Injili',
    category: 'Ibadah',
    distance: 1.5,
    duration: '12 menit',
    icon: '⛪',
    lat: -7.1350,
    lng: 110.5780,
    googleMapsUrl: 'https://maps.google.com/?q=Gereja+Kristen',
    directionsUrl: 'https://maps.google.com/?q=Gereja+Kristen&dir',
    description: 'Gereja dengan worship center yang ikhlas',
  },
  {
    id: 'ibadah-003',
    name: 'Vihara Dharma Budhi',
    category: 'Ibadah',
    distance: 2.2,
    duration: '18 menit',
    icon: '🏯',
    lat: -7.1480,
    lng: 110.5850,
    googleMapsUrl: 'https://maps.google.com/?q=Vihara+Dharma+Budhi',
    directionsUrl: 'https://maps.google.com/?q=Vihara+Dharma+Budhi&dir',
    description: 'Vihara untuk umat Buddha dengan parkiran luas',
  },
];

/**
 * Get all locations
 */
export function getAllLocations(): Location[] {
  return locations;
}

/**
 * Get locations by category
 */
export function getLocationsByCategory(category: LocationCategory): Location[] {
  return locations.filter((loc) => loc.category === category);
}

/**
 * Get featured locations (random, limit 6)
 */
export function getFeaturedLocations(limit = 6): Location[] {
  const shuffled = [...locations].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}
