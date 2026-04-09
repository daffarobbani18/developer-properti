import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, ChevronRight } from 'lucide-react';
import { buildWaUrl, SITE_NAME } from '@/lib/constants';
import Button from '@/components/ui/Button';

/**
 * HeroSection — bagian paling atas halaman utama.
 * Desktop: 2 kolom (teks kiri, gambar kanan).
 * Mobile: stack (visual atas, teks bawah).
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §2.1
 */

export default function HeroSection() {
  return (
    <section className="relative bg-white overflow-hidden min-h-[60vh] md:min-h-[80vh] flex items-center">
      {/* Background decoration */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#F8FAFB] rounded-bl-[80px] hidden md:block" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4A843]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1E3A5F]/5 rounded-full blur-2xl" />
      </div>

      <div className="container-site relative z-10 py-12 md:py-0">
        {/* Mobile: visual di atas */}
        <div className="md:hidden mb-8">
          <HeroVisual />
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:gap-12 lg:gap-16">
          {/* Teks kiri */}
          <div className="flex-1 md:max-w-[520px]">
            {/* Badge pill */}
            <div className="inline-flex items-center gap-2 bg-[#D4A843]/15 text-[#a07c2a] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A843] animate-pulse" />
              Mulai dari Rp 350 juta
            </div>

            {/* H1 */}
            <h1 className="text-[32px] sm:text-[40px] md:text-[48px] font-bold text-[#111827] leading-[1.15] mb-4">
              Hunian Nyaman di{' '}
              <span className="text-[#1E3A5F] relative">
                Lokasi Strategis
                {/* Underline aksen */}
                <svg
                  aria-hidden
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 200 6"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 4 Q100 0 200 4"
                    stroke="#D4A843"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Sub-tagline */}
            <p className="text-[15px] md:text-[17px] text-[#64748B] leading-relaxed mb-8 max-w-md">
              {SITE_NAME} hadir dengan desain modern, fasilitas lengkap, dan
              lingkungan asri untuk mewujudkan hunian impian keluarga Indonesia.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/tipe-rumah">
                <Button size="lg" variant="primary" iconRight={<ChevronRight size={18} />}>
                  Lihat Tipe Rumah
                </Button>
              </Link>
              <a href={buildWaUrl()} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" iconLeft={<MessageCircle size={18} />}>
                  Hubungi Sales
                </Button>
              </a>
            </div>

            {/* Social proof mini */}
            <div className="flex items-center gap-6 mt-8 pt-8 border-t border-[#EEF1F4]">
              <Stat value="200+" label="Unit Tersedia" />
              <div className="w-px h-8 bg-[#E2E8F0]" />
              <Stat value="150+" label="Keluarga Bahagia" />
              <div className="w-px h-8 bg-[#E2E8F0]" />
              <Stat value="5★" label="Rating Pembeli" />
            </div>
          </div>

          {/* Visual kanan — desktop saja */}
          <div className="hidden md:flex flex-1 justify-center items-center">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Komponen visual hero (foto / placeholder) */
function HeroVisual() {
  return (
    <div className="relative w-full max-w-[500px] mx-auto">
      {/* Frame foto utama */}
      <div className="relative w-full aspect-[4/3] rounded-[20px] overflow-hidden bg-[#EEF1F4] shadow-[0_12px_40px_rgba(30,58,95,0.15)]">
        {/* Placeholder — ganti src saat aset foto tersedia */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F]/20 via-[#2D5F8B]/10 to-[#D4A843]/10 flex flex-col items-center justify-center text-[#94A3B8]">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            aria-hidden
          >
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <p className="text-sm mt-3 font-medium">Foto Perumahan</p>
          <p className="text-xs mt-1 opacity-60">Ganti dengan foto asli</p>
        </div>
      </div>

      {/* Card floating — info harga */}
      <div className="absolute -bottom-4 -left-4 md:-left-8 bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-4 flex items-center gap-3 min-w-[160px]">
        <div className="w-10 h-10 rounded-xl bg-[#1E3A5F] flex items-center justify-center flex-shrink-0">
          <span className="text-white text-lg">🏠</span>
        </div>
        <div>
          <p className="text-xs text-[#64748B]">Harga mulai</p>
          <p className="text-sm font-bold text-[#1E3A5F]">Rp 350 juta</p>
        </div>
      </div>

      {/* Card floating — ready stock */}
      <div className="absolute -top-4 -right-4 md:-right-6 bg-[#D4A843] rounded-2xl shadow-lg p-3 text-center">
        <p className="text-xs font-semibold text-[#1E3A5F] leading-tight">
          Ready<br />Stock
        </p>
      </div>
    </div>
  );
}

/** Stat angka social proof */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-lg font-bold text-[#1E3A5F]">{value}</p>
      <p className="text-xs text-[#94A3B8]">{label}</p>
    </div>
  );
}
