'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import UnitCard from '@/components/shared/UnitCard';
import type { Unit, UnitStatus } from '@/types';

/**
 * UnitListClient — komponen client-side untuk halaman /tipe-rumah.
 * Handle: filter status, sort harga/luas, display grid UnitCard.
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §3.1
 */

interface UnitListClientProps {
  units: Unit[];
}

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'area-desc';

const STATUS_OPTIONS: { value: UnitStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Semua Status' },
  { value: 'tersedia', label: 'Tersedia' },
  { value: 'indent', label: 'Indent' },
  { value: 'terjual', label: 'Terjual' },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Urutkan Default' },
  { value: 'price-asc', label: 'Harga: Termurah' },
  { value: 'price-desc', label: 'Harga: Termahal' },
  { value: 'area-desc', label: 'Luas: Terbesar' },
];

export default function UnitListClient({ units }: UnitListClientProps) {
  const [selectedStatus, setSelectedStatus] = useState<UnitStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');

  /* Filter dan sort logic */
  const filtered = useMemo(() => {
    let result = [...units];

    /* Filter status */
    if (selectedStatus !== 'all') {
      result = result.filter((u) => u.status === selectedStatus);
    }

    /* Sort */
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'area-desc':
        result.sort((a, b) => b.buildingArea - a.buildingArea);
        break;
      default:
        break;
    }

    return result;
  }, [units, selectedStatus, sortBy]);

  return (
    <div className="w-full">
      {/* Filter Bar — sticky di mobile */}
      <div className="sticky top-[70px] md:top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-[#EEF1F4] md:bg-transparent md:border-0 md:sticky-none md:top-auto">
        <div className="container-site py-4 md:py-6">
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            {/* Filter Status */}
            <div className="flex-1">
              <label className="text-xs font-semibold text-[#111827] mb-1.5 block md:hidden">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as UnitStatus | 'all')}
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] cursor-pointer"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex-1">
              <label className="text-xs font-semibold text-[#111827] mb-1.5 block md:hidden">
                Urutkan
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Counter */}
            <div className="flex items-center justify-center bg-[#F8FAFB] border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm font-semibold text-[#374151] whitespace-nowrap">
              Menampilkan {filtered.length} dari {units.length}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Unit Cards */}
      <div className="container-site py-8 md:py-12">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filtered.map((unit) => (
              <UnitCard key={unit.slug} unit={unit} />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-[#EEF1F4] flex items-center justify-center mb-4">
              <Search size={32} className="text-[#94A3B8]" strokeWidth={1} />
            </div>
            <h3 className="text-lg font-semibold text-[#111827] mb-2">
              Tidak ada unit yang sesuai
            </h3>
            <p className="text-[#64748B] max-w-sm">
              Coba ubah filter atau lihat semua unit dengan mengganti pilihan status.
            </p>
            <button
              onClick={() => {
                setSelectedStatus('all');
                setSortBy('default');
              }}
              className="mt-6 px-4 py-2 bg-[#1E3A5F] text-white rounded-lg text-sm font-semibold hover:bg-[#2D5F8B] transition-colors"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
