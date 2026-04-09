export type UnitType = {
  slug: string;
  name: string;
  landArea: number;
  buildingArea: number;
  bedrooms: number;
  bathrooms: number;
  carport: number;
  priceFrom: number;
  status: "Tersedia" | "Indent" | "Terjual";
  heroImage: string;
  gallery: string[];
  description: string;
};

export const unitTypes: UnitType[] = [
  {
    slug: "tipe-45-90",
    name: "Tipe 45/90",
    landArea: 90,
    buildingArea: 45,
    bedrooms: 2,
    bathrooms: 1,
    carport: 1,
    priceFrom: 550000000,
    status: "Tersedia",
    heroImage:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Rumah kompak modern untuk keluarga muda, pencahayaan alami optimal, dan tata ruang efisien."
  },
  {
    slug: "tipe-60-120",
    name: "Tipe 60/120",
    landArea: 120,
    buildingArea: 60,
    bedrooms: 3,
    bathrooms: 2,
    carport: 2,
    priceFrom: 720000000,
    status: "Indent",
    heroImage:
      "https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Hunian lega dengan ruang keluarga lapang, cocok untuk kebutuhan keluarga yang berkembang."
  },
  {
    slug: "tipe-72-135",
    name: "Tipe 72/135",
    landArea: 135,
    buildingArea: 72,
    bedrooms: 3,
    bathrooms: 2,
    carport: 2,
    priceFrom: 895000000,
    status: "Terjual",
    heroImage:
      "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Tipe premium dengan facade elegan dan zonasi ruang yang nyaman untuk work-from-home."
  }
];

export const facilities = [
  {
    title: "Gerbang Smart Access",
    detail: "Akses cluster dengan CCTV 24 jam dan kontrol visitor digital."
  },
  {
    title: "Community Lawn",
    detail: "Ruang hijau terbuka untuk aktivitas keluarga dan event warga."
  },
  {
    title: "Masjid Kawasan",
    detail: "Masjid representatif di pusat kawasan, jarak jalan kaki dari semua blok."
  },
  {
    title: "One Gate System",
    detail: "Sistem keamanan terpusat dengan patroli rutin."
  }
];

export const locationHighlights = [
  "9 menit ke Gerbang Tol Cibatu",
  "12 menit ke stasiun commuter",
  "7 menit ke RS swasta regional",
  "5 menit ke sekolah dan pusat belanja"
];

export const testimonials = [
  {
    name: "Budi Santoso",
    quote: "Progress rumah bisa dipantau jelas. Komunikasi tim developer juga cepat dan rapi."
  },
  {
    name: "Rina Putri",
    quote: "Simulasi KPR dan proses booking sangat membantu saya mengambil keputusan lebih cepat."
  },
  {
    name: "Andi Pratama",
    quote: "Lokasinya strategis dan desain rumahnya modern. Pengalaman survei sangat meyakinkan."
  }
];

export const galleryImages = unitTypes.flatMap((unit) => unit.gallery);
