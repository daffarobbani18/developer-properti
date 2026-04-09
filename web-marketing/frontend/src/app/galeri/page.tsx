import { Metadata } from 'next';
import GalleryClientWrapper from '@/components/shared/GalleryClientWrapper';

export const metadata: Metadata = {
  title: 'Galeri - SIMDP Perumahan',
  description:
    'Lihat koleksi foto perumahan kami: eksterior, interior, fasilitas, dan progres pembangunan.',
  openGraph: {
    title: 'Galeri - SIMDP Perumahan',
    description:
      'Lihat koleksi foto perumahan kami: eksterior, interior, fasilitas, dan progres pembangunan.',
    images: [
      {
        url: '/images/og-galeri.jpg',
        width: 1200,
        height: 630,
        alt: 'Galeri Perumahan',
      },
    ],
  },
};

export default function GaleriPage() {
  return (
    <main>
      {/* Header Section */}
      <section className="bg-gradient-to-b from-[#1E3A5F] to-[#2D5F8B] text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Galeri Perumahan</h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Jelajahi koleksi foto eksterior, interior, fasilitas, dan progres pembangunan proyek kami
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <GalleryClientWrapper />
        </div>
      </section>
    </main>
  );
}
