import type { Metadata } from 'next';
import SectionWrapper from '@/components/ui/SectionWrapper';

export const metadata: Metadata = {
  title: 'Simulasi KPR',
  description:
    'Hitung estimasi cicilan KPR Anda. Masukkan harga properti, DP, tenor, dan suku bunga untuk mengetahui perkiraan cicilan per bulan.',
};

/**
 * Halaman simulasi KPR (/simulasi-kpr)
 * TODO Fase 5: KPRCalculator component — input slider, hasil real-time, tabel angsuran
 */
export default function SimulasiKPRPage() {
  return (
    <SectionWrapper
      title="Simulasi KPR"
      subtitle="Hitung estimasi cicilan KPR Anda secara mudah dan cepat"
      background="light"
    >
      <p className="text-center text-[#64748B] text-sm">
        Kalkulator KPR interaktif akan diimplementasi pada Fase 5
      </p>
    </SectionWrapper>
  );
}
