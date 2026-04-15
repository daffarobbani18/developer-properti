export type PublicUnit = {
  slug: string;
  name: string;
  badge: string;
  status: "Tersedia" | "Terbatas";
  price: string;
  shortPriceNote: string;
  buildingArea: string;
  landArea: string;
  bedroom: string;
  garage: string;
  highlight: string;
  description: string;
  images: string[];
  specs: Array<{ label: string; value: string }>;
  facilities: string[];
  points: string[];
  delivery: string;
};

export const PUBLIC_UNITS: PublicUnit[] = [
  {
    slug: "astoria",
    name: "The Astoria",
    badge: "Tipe Signature",
    status: "Tersedia",
    price: "Rp 2.8 M",
    shortPriceNote: "Harga awal untuk preview marketing.",
    buildingArea: "150m2",
    landArea: "200m2",
    bedroom: "4 Bedroom",
    garage: "2 Garasi",
    highlight: "Ruang keluarga luas dengan bukaan cahaya alami maksimal.",
    description:
      "The Astoria dirancang untuk keluarga modern yang membutuhkan keseimbangan antara privasi, estetika, dan fungsi ruang sehari-hari.",
    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=80",
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80",
    ],
    specs: [
      { label: "Kamar Tidur", value: "4" },
      { label: "Kamar Mandi", value: "3" },
      { label: "Listrik", value: "3500 VA" },
      { label: "Smart Home", value: "Basic Pack" },
    ],
    facilities: ["One gate system", "Clubhouse akses privat", "Taman keluarga", "Ruang kerja fleksibel"],
    points: [
      "Tata ruang terbuka dengan pencahayaan alami.",
      "Cocok untuk keluarga muda yang butuh ruang tumbuh.",
      "Efisien untuk aktivitas harian dan menerima tamu.",
    ],
    delivery: "Tahap 2 pengembangan, estimasi serah terima Q4 2026.",
  },
  {
    slug: "bvlgari",
    name: "The Bvlgari",
    badge: "Paling Diminati",
    status: "Terbatas",
    price: "Rp 4.5 M",
    shortPriceNote: "Unit premium dengan ketersediaan terbatas.",
    buildingArea: "210m2",
    landArea: "250m2",
    bedroom: "5 Bedroom",
    garage: "3 Garasi + Pool",
    highlight: "Konsep resort living dengan private pool dan inner-courtyard.",
    description:
      "The Bvlgari adalah unit premium dengan pengalaman tinggal yang lebih eksklusif, cocok untuk keluarga besar dan gaya hidup representatif.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb3?auto=format&fit=crop&w=1200&q=80",
    ],
    specs: [
      { label: "Kamar Tidur", value: "5" },
      { label: "Kamar Mandi", value: "4" },
      { label: "Listrik", value: "4400 VA" },
      { label: "Smart Home", value: "Premium Pack" },
    ],
    facilities: ["Private pool", "Courtyard eksklusif", "Ruang keluarga ganda", "Parkir tamu lebih luas"],
    points: [
      "Dirancang untuk pengalaman tinggal yang lebih representatif.",
      "Cocok untuk keluarga besar atau kebutuhan entertaining.",
      "Memberi privasi lebih tinggi dibanding tipe standar.",
    ],
    delivery: "Tersedia terbatas pada cluster premium fase awal.",
  },
];

export function getUnitBySlug(slug: string) {
  return PUBLIC_UNITS.find((unit) => unit.slug === slug);
}
