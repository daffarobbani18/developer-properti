"use client";

import Link from "next/link";
import { Bath, BedDouble, ChevronRight, Home, MapPin, Maximize, ShieldCheck } from "lucide-react";
import { PublicUnit } from "@/lib/public-unit-data";
import { KPRCalculator } from "@/components/kpr-calculator";

type DetailContentProps = {
  unit: PublicUnit;
  propertyPriceNumeric: number;
};

const formatRupiah = (number: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

function getSpecValue(unit: PublicUnit, label: string, fallback: string) {
  return unit.specs.find((item) => item.label.toLowerCase() === label.toLowerCase())?.value ?? fallback;
}

export function DetailContent({ unit, propertyPriceNumeric }: DetailContentProps) {
  const kamarMandi = getSpecValue(unit, "Kamar Mandi", "3");
  const galleryThumbs = unit.images.slice(1, 4);
  const extraGallery = Math.max(0, unit.images.length - 4);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-zinc-900 selection:bg-amber-200 selection:text-amber-900">
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-zinc-100 py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center border-2 border-amber-600 rounded-sm transform rotate-45">
              <span className="font-serif font-bold text-sm transform -rotate-45 text-zinc-900">G</span>
            </div>
            <span className="font-serif tracking-widest uppercase text-zinc-900 font-medium">
              Griya<span className="font-light">Persada</span>
            </span>
          </Link>
          <Link
            href="/unit"
            className="text-xs font-semibold uppercase tracking-widest text-zinc-500 hover:text-amber-600 transition-colors flex items-center gap-2"
          >
            Kembali ke Katalog <ChevronRight size={14} />
          </Link>
        </div>
      </nav>

      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 uppercase tracking-wider mb-6">
            <Link href="/" className="hover:text-zinc-900">
              Beranda
            </Link>
            <span>/</span>
            <Link href="/unit" className="hover:text-zinc-900">
              Koleksi Premium
            </Link>
            <span>/</span>
            <span className="text-amber-600">{unit.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
              <div className="relative h-[400px] md:h-[500px] rounded-sm overflow-hidden mb-4 group cursor-pointer">
                <img
                  src={unit.images[0]}
                  alt={unit.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                />
                <div className="absolute top-6 left-6 flex gap-2 z-10">
                  <span className="bg-zinc-900/80 backdrop-blur-sm text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-sm">
                    {unit.badge}
                  </span>
                  <span className="bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-sm">
                    {unit.status === "Tersedia" ? "Tersedia Unit" : "Ketersediaan Terbatas"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-10">
                {galleryThumbs.map((image, idx) => (
                  <div key={image} className="h-24 rounded-sm overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                    <img src={image} alt={`${unit.name} Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
                {galleryThumbs.length < 3 &&
                  Array.from({ length: 3 - galleryThumbs.length }).map((_, idx) => (
                    <div
                      key={`placeholder-${idx}`}
                      className="h-24 rounded-sm overflow-hidden bg-zinc-100 border border-zinc-200"
                    />
                  ))}
                <div className="h-24 rounded-sm overflow-hidden cursor-pointer bg-zinc-900 flex items-center justify-center flex-col text-white hover:bg-amber-600 transition-colors">
                  <span className="text-lg font-light">+{extraGallery > 0 ? extraGallery : 8}</span>
                  <span className="text-[10px] uppercase tracking-widest mt-1">Foto Lainnya</span>
                </div>
              </div>

              <div className="mb-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-serif text-zinc-900 mb-4">{unit.name}</h1>
                    <div className="flex items-center gap-2 text-zinc-500 font-light text-sm">
                      <MapPin size={16} className="text-amber-600" />
                      Cluster Premium Griya Persada, Padang
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">Harga Mulai</p>
                    <p className="text-3xl font-serif text-amber-600">{formatRupiah(propertyPriceNumeric)}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-8 py-6 border-y border-zinc-200 mb-8">
                  <div className="flex items-center gap-3">
                    <BedDouble size={24} className="text-zinc-400" strokeWidth={1.5} />
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-widest font-medium">Kamar Tidur</p>
                      <p className="text-lg font-serif text-zinc-900">{unit.bedroom}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bath size={24} className="text-zinc-400" strokeWidth={1.5} />
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-widest font-medium">Kamar Mandi</p>
                      <p className="text-lg font-serif text-zinc-900">{kamarMandi}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Maximize size={24} className="text-zinc-400" strokeWidth={1.5} />
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-widest font-medium">Luas Bangunan</p>
                      <p className="text-lg font-serif text-zinc-900">{unit.buildingArea}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 mb-4">Deskripsi Properti</h3>
                  <p className="text-zinc-600 font-light leading-relaxed mb-4">{unit.description}</p>
                  <p className="text-zinc-600 font-light leading-relaxed">{unit.highlight}</p>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {unit.facilities.slice(0, 4).map((facility) => (
                    <div key={facility} className="flex items-center gap-2 text-sm text-zinc-600">
                      <ShieldCheck size={15} className="text-amber-600" />
                      <span>{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="sticky top-32">
                <KPRCalculator propertyPrice={propertyPriceNumeric} unitName={unit.name} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
