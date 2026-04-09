import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';
import { units } from '@/data/units';
import UnitListClient from '@/components/shared/UnitListClient';
import { H1, Paragraph } from '@/components/ui/Typography';

export const metadata: Metadata = {
  title: `Tipe Rumah — ${SITE_NAME}`,
  description:
    'Pilihan tipe rumah di perumahan kami. Mulai dari tipe 36/72, 45/84, hingga 60/120 dengan spesifikasi lengkap dan harga kompetitif.',
  openGraph: {
    title: 'Tipe Rumah',
    description: 'Lihat semua pilihan tipe rumah kami',
  },
};

/**
 * Halaman Daftar Tipe Rumah (/tipe-rumah)
 * Menampilkan katalog lengkap dengan filter status & sort harga
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §3.1
 */
export default function TipeRumahPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-[#F8FAFB] border-b border-[#EEF1F4]">
        <div className="container-site py-8 md:py-12">
          <div className="max-w-2xl">
            <H1 className="mb-3">Pilihan Tipe Rumah</H1>
            <Paragraph className="text-[#64748B] text-base md:text-lg">
              Temukan tipe rumah yang sesuai dengan kebutuhan dan budget Anda. Kami menawarkan berbagai pilihan dengan lokasi strategis dan desain modern.
            </Paragraph>
          </div>
        </div>
      </div>

      {/* Unit List dengan Filter */}
      <UnitListClient units={units} />
    </main>
  );
}
