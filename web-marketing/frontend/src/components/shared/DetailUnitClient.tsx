'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';
import GalleryThumbnail from '@/components/shared/GalleryThumbnail';
import UnitCard from '@/components/shared/UnitCard';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { StatusBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { H1, H3, Paragraph } from '@/components/ui/Typography';
import { formatRupiah, formatLuas } from '@/lib/formatters';
import { buildWaUrl } from '@/lib/constants';
import type { Unit } from '@/types';

/**
 * DetailUnitClient — halaman detail unit dengan interactivity.
 * - Breadcrumb
 * - 2-col layout (gallery + info)
 * - Tabs spesifikasi (Teknis, Material, Denah, Fasilitas)
 * - Sticky CTA mobile
 * - Related units
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §3.2
 */

interface DetailUnitClientProps {
  unit: Unit;
  relatedUnits: Unit[];
}

type TabType = 'specs' | 'material' | 'denah' | 'fasilitas';

export default function DetailUnitClient({
  unit,
  relatedUnits,
}: DetailUnitClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('specs');

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-[#F8FAFB] border-b border-[#EEF1F4]">
        <div className="container-site py-4">
          <Breadcrumb
            items={[
              { label: 'Beranda', href: '/' },
              { label: 'Tipe Rumah', href: '/tipe-rumah' },
              { label: unit.name },
            ]}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container-site py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Kiri: Gallery (full width di mobile, 2 col di desktop) */}
          <div className="lg:col-span-2">
            <GalleryThumbnail images={unit.images} className="mb-8" />

            {/* Info Ringkas */}
            <div className="bg-white border border-[#EEF1F4] rounded-lg p-6 mb-8">
              <H1 className="mb-3">{unit.name}</H1>

              {/* Status & Harga */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 pb-6 border-b border-[#EEF1F4]">
                <StatusBadge status={unit.status} />
                <div>
                  <p className="text-xs text-[#64748B] mb-1">Harga Mulai</p>
                  <p className="text-2xl md:text-3xl font-bold text-[#1E3A5F]">
                    {formatRupiah(unit.price)}
                  </p>
                </div>
              </div>

              {/* Spesifikasi Ringkas */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  {
                    label: 'Luas Tanah',
                    value: `${unit.landArea} m²`,
                  },
                  {
                    label: 'Luas Bangunan',
                    value: `${unit.buildingArea} m²`,
                  },
                  {
                    label: 'Kamar Tidur',
                    value: unit.bedrooms,
                  },
                  {
                    label: 'Kamar Mandi',
                    value: unit.bathrooms,
                  },
                  {
                    label: 'Carport',
                    value: unit.carport,
                  },
                  {
                    label: 'Lantai',
                    value: unit.floors,
                  },
                ].map((item) => (
                  <div key={item.label} className="bg-[#F8FAFB] rounded-lg p-4">
                    <p className="text-xs text-[#64748B] mb-1">{item.label}</p>
                    <p className="text-base md:text-lg font-semibold text-[#111827]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Deskripsi */}
            <div className="mb-8">
              <H3 className="mb-4">Deskripsi</H3>
              <Paragraph>{unit.description}</Paragraph>
            </div>

            {/* Tabs Spesifikasi */}
            <div className="mb-8">
              {/* Tab buttons */}
              <div className="flex gap-2 mb-6 border-b border-[#EEF1F4] overflow-x-auto">
                {[
                  { id: 'specs' as TabType, label: 'Spesifikasi Teknis' },
                  { id: 'material' as TabType, label: 'Material' },
                  { id: 'denah' as TabType, label: 'Denah' },
                  { id: 'fasilitas' as TabType, label: 'Fasilitas' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap',
                      activeTab === tab.id
                        ? 'text-[#1E3A5F] border-[#1E3A5F]'
                        : 'text-[#64748B] border-transparent hover:text-[#111827]',
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="bg-white border border-[#EEF1F4] rounded-lg p-6">
                {activeTab === 'specs' && (
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-[#EEF1F4] last:border-0">
                      <span className="text-[#64748B]">Luas Tanah</span>
                      <span className="font-semibold text-[#111827]">{unit.landArea} m²</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#EEF1F4] last:border-0">
                      <span className="text-[#64748B]">Luas Bangunan</span>
                      <span className="font-semibold text-[#111827]">{unit.buildingArea} m²</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#EEF1F4] last:border-0">
                      <span className="text-[#64748B]">Jumlah Lantai</span>
                      <span className="font-semibold text-[#111827]">{unit.floors}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#EEF1F4] last:border-0">
                      <span className="text-[#64748B]">Kamar Tidur</span>
                      <span className="font-semibold text-[#111827]">{unit.bedrooms}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#EEF1F4] last:border-0">
                      <span className="text-[#64748B]">Kamar Mandi</span>
                      <span className="font-semibold text-[#111827]">{unit.bathrooms}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#EEF1F4] last:border-0">
                      <span className="text-[#64748B]">Carport</span>
                      <span className="font-semibold text-[#111827]">{unit.carport}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#EEF1F4] last:border-0">
                      <span className="text-[#64748B]">Listrik</span>
                      <span className="font-semibold text-[#111827]">{unit.electricity}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-[#64748B]">Air</span>
                      <span className="font-semibold text-[#111827]">{unit.water}</span>
                    </div>
                  </div>
                )}

                {activeTab === 'material' && (
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-[#EEF1F4] last:border-0">
                      <span className="text-[#64748B]">Pondasi</span>
                      <span className="font-semibold text-[#111827]">{unit.materials.foundation}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#EEF1F4] last:border-0">
                      <span className="text-[#64748B]">Dinding</span>
                      <span className="font-semibold text-[#111827]">{unit.materials.walls}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#EEF1F4] last:border-0">
                      <span className="text-[#64748B]">Atap</span>
                      <span className="font-semibold text-[#111827]">{unit.materials.roof}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#EEF1F4] last:border-0">
                      <span className="text-[#64748B]">Lantai</span>
                      <span className="font-semibold text-[#111827]">{unit.materials.floor}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#EEF1F4] last:border-0">
                      <span className="text-[#64748B]">Rangka</span>
                      <span className="font-semibold text-[#111827]">{unit.materials.frame}</span>
                    </div>
                    {unit.materials.sanitasi && (
                      <div className="flex justify-between py-2">
                        <span className="text-[#64748B]">Sanitasi</span>
                        <span className="font-semibold text-[#111827]">{unit.materials.sanitasi}</span>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'denah' && (
                  <div className="text-center py-8">
                    <p className="text-[#94A3B8] mb-4">Denah Rumah</p>
                    <div className="w-full bg-[#EEF1F4] rounded-lg aspect-[3/4] flex items-center justify-center text-[#94A3B8]">
                      <div className="text-center">
                        <p className="text-sm">Lihat denah lengkap</p>
                        <p className="text-xs mt-1">(Real denah akan ditampilkan di sini)</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'fasilitas' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {unit.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#D4A843] rounded-full mt-2 flex-shrink-0" />
                        <p className="text-[#111827]">{feature}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Kolom Kanan: CTA Section (sticky desktop) */}
          <div className="lg:col-span-1">
            <div className="sticky top-[80px] bg-white border border-[#EEF1F4] rounded-lg p-6 space-y-4">
              <div className="bg-[#1E3A5F]/5 border-l-4 border-[#1E3A5F] px-4 py-3 rounded text-sm text-[#1E3A5F] font-semibold">
                Berminat dengan unit ini?
              </div>

              <a
                href={buildWaUrl(`Halo, saya tertarik dengan ${unit.name}. Bisa kasih informasi lebih lanjut?`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  iconLeft={<MessageCircle size={18} />}
                >
                  Chat via WhatsApp
                </Button>
              </a>

              <Link
                href={`/simulasi-kpr?harga=${unit.price}`}
                className="block"
                tabIndex={-1}
              >
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  iconLeft={<Calculator size={18} />}
                  className="pointer-events-none"
                >
                  Simulasi KPR
                </Button>
              </Link>

              <p className="text-xs text-[#64748B] text-center">
                Tim kami siap membantu Anda 24/7
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA Mobile (bottom) */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-[#EEF1F4] p-4 space-y-3">
        <a
          href={buildWaUrl(`Halo, saya tertarik dengan ${unit.name}`)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="primary"
            size="md"
            fullWidth
            iconLeft={<MessageCircle size={16} />}
          >
            Chat via WhatsApp
          </Button>
        </a>
      </div>

      {/* Spacer agar content tidak tertutup sticky CTA */}
      <div className="h-24 lg:h-0" />

      {/* Related Units */}
      {relatedUnits.length > 0 && (
        <div className="bg-[#F8FAFB] border-t border-[#EEF1F4] py-12 md:py-16">
          <div className="container-site">
            <H3 className="mb-8 text-center">Tipe Rumah Lainnya</H3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {relatedUnits.map((u) => (
                <UnitCard key={u.slug} unit={u} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
