import { Metadata } from 'next';
import MapEmbed from '@/components/shared/MapEmbed';
import LocationCard from '@/components/shared/LocationCard';
import { getAllLocations } from '@/data/locations';

export const metadata: Metadata = {
  title: 'Lokasi - SIMDP Perumahan',
  description:
    'Lokasi perumahan strategis dekat pusat kota, sekolah, rumah sakit, dan akses tol.',
  openGraph: {
    title: 'Lokasi - SIMDP Perumahan',
    description:
      'Lokasi perumahan strategis dengan akses mudah ke berbagai fasilitas publik',
    images: [
      {
        url: '/images/og-lokasi.jpg',
        width: 1200,
        height: 630,
        alt: 'Lokasi Perumahan',
      },
    ],
  },
};

export default function LokasiPage() {
  const locations = getAllLocations();

  // Google Maps embed URL (contoh: centered di perumahan)
  // Ganti dengan koordinat actual perumahan Anda
  const mapsEmbedUrl =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.7891234567890!2d110.5678!3d-7.1234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69000000000000%3A0x1234567890abc!2sPerumahan%20SIMDP!5e0!3m2!1sid!2sid!4v1600000000000';

  return (
    <main>
      {/* Header Section */}
      <section className="bg-gradient-to-b from-[#1E3A5F] to-[#2D5F8B] text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Lokasi Strategis</h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Berada di lokasi yang mudah diakses dan dekat dengan berbagai fasilitas publik
          </p>
        </div>
      </section>

      {/* Maps & Locations Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Map Section */}
          <div className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-[#111827] mb-6 text-center">
              Peta Lokasi
            </h2>
            <MapEmbed embedUrl={mapsEmbedUrl} height="400px" />
          </div>

          {/* Locations Grid */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#111827] mb-6 text-center">
              Jarak ke Tempat Penting
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {locations.map((location) => (
                <LocationCard key={location.id} location={location} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
