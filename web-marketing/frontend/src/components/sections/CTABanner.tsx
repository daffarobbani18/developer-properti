import Link from 'next/link';
import { MessageCircle, Tag } from 'lucide-react';
import { buildWaUrl, SITE_NAME } from '@/lib/constants';
import Button from '@/components/ui/Button';

/**
 * CTABanner — ajakan kontak / kunjungan di akhir halaman utama.
 * Desktop: layout horizontal. Mobile: stack center.
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §2.6
 */

export default function CTABanner() {
  return (
    <section className="relative bg-[#1E3A5F] overflow-hidden">
      {/* Dekorasi blob */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-[#D4A843]/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-white/5 rounded-full blur-2xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="container-site relative z-10 py-14 md:py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">

          {/* Teks */}
          <div className="text-center md:text-left max-w-lg">
            <p className="text-[#D4A843] text-sm font-semibold uppercase tracking-widest mb-3">
              Wujudkan Impian Anda
            </p>
            <h2 className="text-[26px] md:text-[34px] font-bold text-white leading-snug mb-3">
              Tertarik? Jadwalkan Kunjungan Sekarang
            </h2>
            <p className="text-[#94A3B8] text-sm md:text-base leading-relaxed">
              Tim kami siap membantu Anda menemukan unit terbaik dari {SITE_NAME}.
              Kunjungi kami atau hubungi sales hari ini.
            </p>
          </div>

          {/* Tombol CTA */}
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 flex-shrink-0">
            <a href={buildWaUrl()} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="secondary" iconLeft={<MessageCircle size={18} />}>
                Hubungi via WhatsApp
              </Button>
            </a>
            <Link href="/promo">
              <Button size="lg" variant="outline" iconLeft={<Tag size={18} />}
                className="border-white/40 text-white hover:bg-white/10 hover:border-white"
              >
                Lihat Promo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
