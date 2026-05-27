import Link from "next/link";
import { ArrowRight, Home, Car, Play } from "lucide-react";
import { PublicTopNav } from "@/components/public/public-top-nav";
import { PublicFooter } from "@/components/public/public-footer";

const formatPriceShort = (price: number) => {
  if (price >= 1000000000) {
    const formatted = (price / 1000000000).toFixed(1);
    return `Rp ${formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted} M`;
  } else if (price >= 1000000) {
    const formatted = (price / 1000000).toFixed(1);
    return `Rp ${formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted} Jt`;
  }
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(price);
};

export default async function UnitListPage() {
  let propertyTypes = [];
  try {
    const res = await fetch("http://localhost:4000/api/property-types", { cache: "no-store" });
    if (res.ok) {
      propertyTypes = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch property types:", error);
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-zinc-900 selection:bg-amber-200 selection:text-amber-900">
      <PublicTopNav />

      <main className="pt-24 pb-16 md:pt-32 md:pb-24">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-zinc-200 pb-10">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-600 font-bold mb-4">
                Koleksi Residensial
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.1] text-zinc-900">
                Eksplorasi Mahakarya <br /> Arsitektur Kami.
              </h1>
            </div>
            <div className="max-w-md">
              <p className="text-zinc-500 font-light leading-relaxed text-sm md:text-base">
                Setiap unit dirancang dengan detail yang presisi, menyeimbangkan estetika modern dan fungsionalitas ruang untuk keluarga masa kini.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            {propertyTypes.length > 0 ? (
              propertyTypes.map((unit: any, idx: number) => {
                const isEven = idx % 2 === 0;
                const badgeText = unit.bedrooms > 4 ? "Paling Diminati" : "Tipe Signature";
                const carFeatureText = unit.bathrooms > 2 ? `${unit.bathrooms} Garasi + Pool` : `${unit.bathrooms} Garasi`;

                return (
                  <article key={unit.id} className={`group block ${!isEven ? "md:mt-24" : ""}`}>
                    <Link href={`/unit/${unit.id}`} className="block relative h-[360px] sm:h-[460px] lg:h-[540px] overflow-hidden rounded-sm mb-6 border border-zinc-100 bg-zinc-100">
                      <div className="absolute inset-0 bg-zinc-900/10 group-hover:bg-transparent transition-colors duration-700 z-10" />
                      {unit.imageUrl ? (
                        <img
                          src={unit.imageUrl}
                          alt={unit.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)]"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-amber-50 flex items-center justify-center text-amber-200">
                          <Home size={120} strokeWidth={1} />
                        </div>
                      )}
                      <div className="absolute top-6 left-6 z-20 flex gap-2">
                        <span className={`text-white text-[10px] uppercase tracking-widest px-4 py-2 rounded-sm backdrop-blur-md ${badgeText === "Paling Diminati" ? "bg-amber-600/90" : "bg-zinc-900/90"}`}>
                          {badgeText}
                        </span>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/50 text-white transform scale-90 group-hover:scale-100 transition-all duration-500">
                          <Play size={20} className="fill-current ml-1" />
                        </div>
                      </div>
                    </Link>

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                      <div>
                        <Link href={`/unit/${unit.id}`} className="hover:text-amber-600 transition-colors">
                          <h2 className="text-3xl font-serif mb-2 text-zinc-900">{unit.name}</h2>
                        </Link>
                        <p className="text-sm text-zinc-500 font-light mb-4">
                          Luas Bangunan {unit.luasBangunan}m² • Luas Tanah {unit.luasTanah}m²
                        </p>
                        <div className="flex gap-5 text-sm font-medium text-zinc-800">
                          <span className="inline-flex items-center gap-2">
                            <Home size={16} className="text-amber-600" /> {unit.bedrooms} BR
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <Car size={16} className="text-amber-600" /> {carFeatureText}
                          </span>
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0 border-t border-zinc-100 sm:border-none pt-4 sm:pt-0 mt-2 sm:mt-0">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-1">Estimasi Mulai Dari</p>
                        <p className="text-2xl font-serif text-amber-600 mb-4">
                          {formatPriceShort(unit.price)}
                        </p>
                        <Link
                          href={`/unit/${unit.id}`}
                          className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-900 border-b-2 border-zinc-900 pb-1 hover:text-amber-600 hover:border-amber-600 transition-all group-hover:text-amber-600 group-hover:border-amber-600"
                        >
                          Lihat Spesifikasi <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="col-span-1 md:col-span-2 py-20 text-center">
                <div className="w-16 h-16 mx-auto border-2 border-dashed border-zinc-300 rounded-full flex items-center justify-center mb-4 text-zinc-400">
                  <Home size={24} />
                </div>
                <h3 className="text-xl font-serif text-zinc-900 mb-2">Katalog Kosong</h3>
                <p className="text-zinc-500 font-light">Belum ada koleksi tipe rumah yang tersedia di sistem kami saat ini.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
