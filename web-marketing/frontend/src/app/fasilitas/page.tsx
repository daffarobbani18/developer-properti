import { Metadata } from 'next';
import FacilityCard from '@/components/shared/FacilityCard';
import { facilities } from '@/data/facilities';

export const metadata: Metadata = {
  title: 'Fasilitas - SIMDP Perumahan',
  description:
    'Fasilitas lengkap tersedia di perumahan kami untuk kenyamanan seluruh keluarga.',
  openGraph: {
    title: 'Fasilitas - SIMDP Perumahan',
    description:
      'Fasilitas lengkap tersedia di perumahan kami untuk kenyamanan seluruh keluarga.',
    images: [
      {
        url: '/images/og-fasilitas.jpg',
        width: 1200,
        height: 630,
        alt: 'Fasilitas Perumahan',
      },
    ],
  },
};

export default function FasilitasPage() {
  return (
    <main>
      {/* Header Section */}
      <section className="bg-gradient-to-b from-[#1E3A5F] to-[#2D5F8B] text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Fasilitas Perumahan</h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Berbagai fasilitas lengkap disiapkan untuk kenyamanan seluruh penghuni
          </p>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
            {facilities.map((facility) => (
              <FacilityCard key={facility.id} facility={facility} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
