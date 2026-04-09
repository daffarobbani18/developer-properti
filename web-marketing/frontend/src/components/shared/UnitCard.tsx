import Link from 'next/link';
import Image from 'next/image';
import { BedDouble, Bath, Car, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRupiahRingkas } from '@/lib/formatters';
import { StatusBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { Unit } from '@/types';

/**
 * UnitCard — kartu tipe rumah reusable.
 * Dipakai di PreviewTipeSection (homepage) dan halaman /tipe-rumah.
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §2.3
 */

interface UnitCardProps {
  unit: Unit;
  className?: string;
}

export default function UnitCard({ unit, className }: UnitCardProps) {
  const soldOut = unit.status === 'terjual';

  return (
    <article
      className={cn(
        'bg-white rounded-[12px] overflow-hidden flex flex-col',
        'shadow-[0_1px_2px_rgba(0,0,0,0.06)]',
        'transition-all duration-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.10)] hover:-translate-y-1',
        soldOut && 'opacity-75',
        className,
      )}
    >
      {/* Foto utama — aspect ratio 4:3 */}
      <div className="relative w-full aspect-[4/3] bg-[#EEF1F4] overflow-hidden">
        {unit.images.length > 0 ? (
          <Image
            src={unit.images[0].src}
            alt={unit.images[0].alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          /* Placeholder saat foto belum tersedia */
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#94A3B8]">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
            <span className="text-xs mt-2">{unit.name}</span>
          </div>
        )}

        {/* Badge status — top-left */}
        <div className="absolute top-3 left-3">
          <StatusBadge status={unit.status} />
        </div>
      </div>

      {/* Konten kartu */}
      <div className="flex flex-col flex-1 p-4 md:p-5 gap-3">
        {/* Nama tipe */}
        <h4 className="text-[17px] md:text-[18px] font-semibold text-[#111827] leading-snug">
          {unit.name}
        </h4>

        {/* Spesifikasi mini */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
          <SpecItem icon={<Maximize2 size={13} />} label={`LT ${unit.landArea} m²`} />
          <SpecItem icon={<Maximize2 size={13} className="rotate-90" />} label={`LB ${unit.buildingArea} m²`} />
          <SpecItem icon={<BedDouble size={13} />} label={`${unit.bedrooms} Kamar Tidur`} />
          <SpecItem icon={<Bath size={13} />} label={`${unit.bathrooms} Kamar Mandi`} />
          {unit.carport > 0 && (
            <SpecItem icon={<Car size={13} />} label={`${unit.carport} Carport`} />
          )}
        </div>

        {/* Harga */}
        <div className="mt-auto pt-3 border-t border-[#EEF1F4]">
          <p className="text-xs text-[#64748B] mb-0.5">Mulai dari</p>
          <p className="text-[18px] md:text-[20px] font-bold text-[#1E3A5F]">
            {formatRupiahRingkas(unit.price)}
          </p>
        </div>

        {/* CTA */}
        <Link href={`/tipe-rumah/${unit.slug}`} className="block" tabIndex={-1}>
          <Button
            variant={soldOut ? 'ghost' : 'primary'}
            size="sm"
            fullWidth
            disabled={soldOut}
            className="pointer-events-none"
          >
            {soldOut ? 'Unit Habis Terjual' : 'Lihat Detail'}
          </Button>
        </Link>
      </div>
    </article>
  );
}

/** Sub-komponen spesifikasi kecil */
function SpecItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[#64748B]">
      <span className="text-[#94A3B8]">{icon}</span>
      <span className="text-xs">{label}</span>
    </div>
  );
}
