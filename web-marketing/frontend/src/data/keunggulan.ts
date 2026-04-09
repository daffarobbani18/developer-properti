/**
 * Data statis keunggulan perumahan — ditampilkan di KeunggulanSection
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §2.2
 */

export interface Keunggulan {
  id: string;
  icon: string; // nama icon lucide-react
  title: string;
  description: string;
}

export const keunggulan: Keunggulan[] = [
  {
    id: 'lokasi-strategis',
    icon: 'MapPin',
    title: 'Lokasi Strategis',
    description:
      'Berada di pusat kota dengan akses mudah ke jalan tol, sekolah unggulan, rumah sakit, dan pusat perbelanjaan.',
  },
  {
    id: 'desain-modern',
    icon: 'Home',
    title: 'Desain Modern',
    description:
      'Arsitektur kontemporer dengan tata ruang optimal, pencahayaan alami, dan ventilasi udara yang baik.',
  },
  {
    id: 'harga-terjangkau',
    icon: 'BadgeDollarSign',
    title: 'Harga Terjangkau',
    description:
      'Tersedia skema KPR fleksibel dengan DP ringan mulai 5%, cicilan ringan, dan tenor hingga 25 tahun.',
  },
  {
    id: 'fasilitas-lengkap',
    icon: 'Building2',
    title: 'Fasilitas Lengkap',
    description:
      'Taman bermain, masjid, area olahraga, CCTV 24 jam, one gate system, dan jalan paving block yang rapi.',
  },
  {
    id: 'keamanan-24-jam',
    icon: 'ShieldCheck',
    title: 'Keamanan 24 Jam',
    description:
      'Sistem keamanan terpadu dengan petugas satpam, CCTV di setiap sudut, dan sistem satu pintu masuk.',
  },
  {
    id: 'developer-terpercaya',
    icon: 'Award',
    title: 'Developer Terpercaya',
    description:
      'Didukung tim profesional berpengalaman dengan rekam jejak proyek tepat waktu dan kualitas terverifikasi.',
  },
];
