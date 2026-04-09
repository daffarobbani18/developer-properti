import { MapPin, ExternalLink, GraduationCap, Heart, ShoppingBag, Car, Building } from 'lucide-react';
import { cn } from '@/lib/utils';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { GOOGLE_MAPS_URL, lokasiTerdekat, KATEGORI_LABEL } from '@/data/lokasi';
import { GOOGLE_MAPS_EMBED_URL } from '@/lib/constants';
import type { LokasiTerdekat } from '@/types';
import type { LucideIcon } from 'lucide-react';

/**
 * LokasiSection — embed peta + daftar jarak ke fasilitas publik.
 * Desktop: 2 kolom (peta kiri, info kanan). Mobile: stack.
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §2.4
 */

const iconMap: Record<LokasiTerdekat['kategori'], LucideIcon> = {
  pendidikan:   GraduationCap,
  kesehatan:    Heart,
  perbelanjaan: ShoppingBag,
  transportasi: Car,
  ibadah:       Building,
};

const colorMap: Record<LokasiTerdekat['kategori'], string> = {
  pendidikan:   'bg-blue-50 text-blue-600',
  kesehatan:    'bg-red-50 text-red-500',
  perbelanjaan: 'bg-purple-50 text-purple-600',
  transportasi: 'bg-orange-50 text-orange-500',
  ibadah:       'bg-emerald-50 text-emerald-600',
};

/** Hanya tampilkan 1 item per kategori untuk homepage */
function getHighlights(list: LokasiTerdekat[]) {
  const seen = new Set<string>();
  return list.filter((l) => {
    if (seen.has(l.kategori)) return false;
    seen.add(l.kategori);
    return true;
  });
}

export default function LokasiSection() {
  const highlights = getHighlights(lokasiTerdekat);

  return (
    <SectionWrapper
      id="lokasi"
      background="light"
      spacing="lg"
      title="Lokasi Strategis"
      subtitle="Berada di titik pusat kota, dekat dengan semua fasilitas penting yang Anda butuhkan."
    >
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-stretch">

        {/* Peta — 60% lebar desktop */}
        <div className="w-full lg:flex-[3] rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.08)] min-h-[280px] md:min-h-[360px] bg-[#EEF1F4] relative">
          {GOOGLE_MAPS_EMBED_URL ? (
            <iframe
              src={GOOGLE_MAPS_EMBED_URL}
              width="100%"
              height="100%"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Perumahan Grand Harmoni"
            />
          ) : (
            /* Placeholder saat embed URL belum diisi */
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#94A3B8] gap-3">
              <MapPin size={40} strokeWidth={1.2} />
              <div className="text-center">
                <p className="text-sm font-medium">Google Maps</p>
                <p className="text-xs mt-1 opacity-70">
                  Isi NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL<br />di .env.local
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Info lokasi — 40% lebar desktop */}
        <div className="w-full lg:flex-[2] flex flex-col justify-between gap-5">
          {/* Daftar highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {highlights.map((item) => {
              const Icon = iconMap[item.kategori];
              return (
                <div
                  key={item.kategori}
                  className="flex items-center gap-4 bg-white rounded-xl px-4 py-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.05)]"
                >
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', colorMap[item.kategori])}>
                    <Icon size={18} strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#94A3B8] mb-0.5">
                      {KATEGORI_LABEL[item.kategori]}
                    </p>
                    <p className="text-sm font-semibold text-[#111827] truncate">
                      {item.nama}
                    </p>
                  </div>
                  <div className="ml-auto text-right flex-shrink-0">
                    <p className="text-sm font-bold text-[#1E3A5F]">{item.jarak}</p>
                    <p className="text-xs text-[#94A3B8]">{item.waktu}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tombol ke halaman lokasi lengkap */}
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full
              border-2 border-[#1E3A5F] text-[#1E3A5F] font-semibold text-sm
              rounded-[8px] py-3 transition-colors
              hover:bg-[#1E3A5F] hover:text-white"
          >
            <ExternalLink size={16} />
            Buka di Google Maps
          </a>
        </div>
      </div>
    </SectionWrapper>
  );
}
