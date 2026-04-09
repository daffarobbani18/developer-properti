import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';
import HeroSection from '@/components/sections/HeroSection';
import KeunggulanSection from '@/components/sections/KeunggulanSection';
import PreviewTipeSection from '@/components/sections/PreviewTipeSection';
import LokasiSection from '@/components/sections/LokasiSection';
import TestimoniSection from '@/components/sections/TestimoniSection';
import CTABanner from '@/components/sections/CTABanner';

export const metadata: Metadata = {
  title: `${SITE_NAME} — Hunian Nyaman di Lokasi Strategis`,
  description:
    `${SITE_NAME} hadir dengan desain modern, fasilitas lengkap, dan lokasi strategis. ` +
    'Temukan tipe rumah impian Anda dan mulai perjalanan memiliki hunian terbaik.',
};

/**
 * Halaman utama (/)
 * Fase 2: Landing Page — Hero, Keunggulan, Preview Tipe, Lokasi, Testimoni, CTA
 */
export default function Home() {
  return (
    <>
      <HeroSection />
      <KeunggulanSection />
      <PreviewTipeSection />
      <LokasiSection />
      <TestimoniSection />
      <CTABanner />
    </>
  );
}
