import Link from "next/link";
import { ArrowRight, Home, Car } from "lucide-react";
import { PUBLIC_UNITS } from "@/lib/public-unit-data";
import { PublicTopNav } from "@/components/public/public-top-nav";
import { PublicFooter } from "@/components/public/public-footer";

export default function UnitListPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900">
      <PublicTopNav />

      <main className="py-16 md:py-20">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="mb-14">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-600 font-semibold mb-4">
              Katalog Unit Preview
            </p>
            <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-5">Pilihan Hunian Eksklusif</h1>
            <p className="text-zinc-600 font-light max-w-2xl leading-relaxed">
              Halaman ini adalah preview frontend dengan data hardcode untuk simulasi alur marketing
              website publik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
            {PUBLIC_UNITS.map((unit) => (
              <article key={unit.slug} className="group">
                <div className="relative h-[360px] sm:h-[440px] overflow-hidden rounded-sm mb-6 border border-zinc-200">
                  <img
                    src={unit.images[0]}
                    alt={unit.name}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute top-5 left-5 px-4 py-2 bg-zinc-900 text-white text-[10px] uppercase tracking-widest rounded-sm">
                    {unit.badge}
                  </div>
                </div>

                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h2 className="text-3xl font-serif mb-2">{unit.name}</h2>
                    <p className="text-sm text-zinc-500 font-light mb-4">
                      Luas Bangunan {unit.buildingArea} • Luas Tanah {unit.landArea}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm font-medium text-zinc-800">
                      <span className="inline-flex items-center gap-2">
                        <Home size={16} className="text-amber-600" /> {unit.bedroom}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Car size={16} className="text-amber-600" /> {unit.garage}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs uppercase tracking-widest text-zinc-400 mb-1">Mulai Dari</p>
                    <p className="text-2xl font-serif text-amber-600">{unit.price}</p>
                  </div>
                </div>

                <Link
                  href={`/unit/${unit.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] border-b border-zinc-800 pb-1 hover:text-amber-600 hover:border-amber-600 transition-colors"
                >
                  Lihat Detail Unit <ArrowRight size={14} />
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
