import type { Metadata } from 'next';
import { promos } from '@/data/promos';
import SectionWrapper from '@/components/ui/SectionWrapper';

export const metadata: Metadata = {
  title: 'Promo',
  description: 'Dapatkan penawaran terbaik dan promo menarik untuk pembelian unit perumahan.',
};

/**
 * Halaman promo (/promo)
 * TODO Fase 5: Grid kartu promo dengan batas waktu, CTA WA
 */
export default function PromoPage() {
  return (
    <SectionWrapper
      title="Promo Terbaik"
      subtitle="Dapatkan penawaran eksklusif yang tidak akan Anda temukan di tempat lain"
      background="light"
    >
      <p className="text-center text-[#64748B] text-sm">
        {promos.length} promo aktif — implementasi UI pada Fase 5
      </p>
    </SectionWrapper>
  );
}
