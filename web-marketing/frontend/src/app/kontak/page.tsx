import type { Metadata } from 'next';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { KONTAK } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Kontak',
  description:
    'Hubungi tim pemasaran kami untuk informasi lebih lanjut mengenai unit, harga, atau jadwalkan kunjungan.',
};

/**
 * Halaman kontak (/kontak)
 * TODO Fase 5: Form kontak (FormLeads), info kantor, peta embed
 */
export default function KontakPage() {
  return (
    <SectionWrapper
      title="Hubungi Kami"
      subtitle="Tim kami siap membantu Anda menemukan hunian impian"
      background="light"
    >
      <div className="text-center text-[#64748B] text-sm space-y-1">
        <p>📍 {KONTAK.alamat}</p>
        <p>📞 {KONTAK.telepon}</p>
        <p>✉️ {KONTAK.email}</p>
        <p className="mt-4 text-xs">Form kontak lengkap akan diimplementasi pada Fase 5</p>
      </div>
    </SectionWrapper>
  );
}
