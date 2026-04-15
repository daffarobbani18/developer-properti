import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Home, Car, CalendarDays, MapPinned, Shield, Sparkles } from "lucide-react";
import { PUBLIC_UNITS, getUnitBySlug } from "@/lib/public-unit-data";
import { PublicTopNav } from "@/components/public/public-top-nav";
import { PublicFooter } from "@/components/public/public-footer";

type Params = {
  slug: string;
};

export function generateStaticParams() {
  return PUBLIC_UNITS.map((unit) => ({ slug: unit.slug }));
}

export default function UnitDetailPage({ params }: { params: Params }) {
  const unit = getUnitBySlug(params.slug);

  if (!unit) {
    notFound();
  }

  const relatedUnits = PUBLIC_UNITS.filter((item) => item.slug !== unit.slug);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <PublicTopNav theme="dark" />

      <main>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 md:py-16">
          <Link
            href="/unit"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-400 hover:text-amber-500 transition-colors"
          >
            <ArrowLeft size={14} /> Kembali ke Katalog
          </Link>

          <div className="mt-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.22em] text-amber-500 mb-4">{unit.badge}</p>
              <h1 className="text-4xl md:text-6xl font-serif mb-5 leading-tight">{unit.name}</h1>
              <p className="text-zinc-300 text-lg font-light leading-relaxed">{unit.description}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-sm text-sm">
                <Home size={16} className="text-amber-500" /> {unit.bedroom}
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-sm text-sm">
                <Car size={16} className="text-amber-500" /> {unit.garage}
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-sm text-sm">
                Status: {unit.status}
              </span>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 xl:grid-cols-[1.4fr_0.9fr] gap-10 xl:gap-14 items-start">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
                <div className="md:col-span-8 h-[360px] sm:h-[460px] rounded-sm overflow-hidden border border-zinc-800">
                  <img src={unit.images[0]} alt={unit.name} className="w-full h-full object-cover" />
                </div>
                <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-4">
                  {unit.images.slice(1).map((image, idx) => (
                    <div
                      key={image}
                      className="h-40 sm:h-44 md:h-full rounded-sm overflow-hidden border border-zinc-800"
                    >
                      <img src={image} alt={`${unit.name} ${idx + 2}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <article className="p-5 bg-zinc-900/55 border border-zinc-800 rounded-sm">
                  <CalendarDays size={18} className="text-amber-500 mb-3" />
                  <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 mb-2">Status Proyek</p>
                  <p className="text-zinc-100 font-medium leading-relaxed">{unit.delivery}</p>
                </article>
                <article className="p-5 bg-zinc-900/55 border border-zinc-800 rounded-sm">
                  <MapPinned size={18} className="text-amber-500 mb-3" />
                  <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 mb-2">Luas Area</p>
                  <p className="text-zinc-100 font-medium leading-relaxed">
                    Bangunan {unit.buildingArea} • Tanah {unit.landArea}
                  </p>
                </article>
                <article className="p-5 bg-zinc-900/55 border border-zinc-800 rounded-sm">
                  <Shield size={18} className="text-amber-500 mb-3" />
                  <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 mb-2">Highlight</p>
                  <p className="text-zinc-100 font-medium leading-relaxed">{unit.highlight}</p>
                </article>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="p-6 sm:p-7 border border-zinc-800 rounded-sm bg-zinc-900/50">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 mb-4">Spesifikasi Utama</p>
                  <div className="grid grid-cols-2 gap-4">
                    {unit.specs.map((spec) => (
                      <div key={spec.label} className="p-4 border border-zinc-800 bg-zinc-950/60 rounded-sm">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 mb-2">
                          {spec.label}
                        </p>
                        <p className="text-zinc-100 font-medium">{spec.value}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="p-6 sm:p-7 border border-zinc-800 rounded-sm bg-zinc-900/50">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 mb-4">Fasilitas Unit</p>
                  <div className="space-y-3">
                    {unit.facilities.map((facility) => (
                      <div key={facility} className="flex items-center gap-3 text-zinc-300 text-sm">
                        <Check size={14} className="text-amber-500 shrink-0" />
                        <span>{facility}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <section className="p-6 sm:p-8 border border-zinc-800 rounded-sm bg-zinc-900/50">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 mb-4">Kenapa Unit Ini Menarik</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {unit.points.map((point) => (
                    <div key={point} className="p-4 border border-zinc-800 bg-zinc-950/50 rounded-sm">
                      <div className="flex items-start gap-3">
                        <Sparkles size={16} className="text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-zinc-300 text-sm leading-relaxed">{point}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="lg:sticky lg:top-24 space-y-5">
              <div className="p-6 border border-zinc-800 rounded-sm bg-gradient-to-br from-amber-500/10 to-zinc-900 shadow-2xl shadow-black/20">
                <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 mb-2">Harga Preview</p>
                <p className="text-3xl font-serif text-amber-400 mb-2">{unit.price}</p>
                <p className="text-sm text-zinc-400 font-light leading-relaxed mb-5">{unit.shortPriceNote}</p>
                <ul className="space-y-3 text-sm text-zinc-300">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-amber-500" /> Luas Bangunan {unit.buildingArea}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-amber-500" /> Luas Tanah {unit.landArea}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-amber-500" /> Harga dapat berubah sesuai tahap pembangunan
                  </li>
                </ul>

                <a
                  href="https://wa.me/6281100009999?text=Halo%20saya%20ingin%20konsultasi%20detail%20unit."
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex w-full items-center justify-center px-5 py-3 bg-amber-600 text-white text-xs uppercase tracking-[0.2em] rounded-sm hover:bg-amber-500 transition-colors"
                >
                  Konsultasi Sekarang
                </a>

                <Link
                  href="/kontak"
                  className="mt-3 inline-flex w-full items-center justify-center px-5 py-3 border border-zinc-700 text-zinc-200 text-xs uppercase tracking-[0.2em] rounded-sm hover:border-zinc-500 hover:text-white transition-colors"
                >
                  Minta Callback
                </Link>
              </div>

              <div className="p-6 border border-zinc-800 rounded-sm bg-zinc-900/55">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 mb-4">Perbandingan Cepat</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-zinc-400">Status</span>
                    <span className="text-zinc-100 font-medium">{unit.status}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-zinc-400">Kamar Tidur</span>
                    <span className="text-zinc-100 font-medium">{unit.bedroom}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-zinc-400">Parkir</span>
                    <span className="text-zinc-100 font-medium">{unit.garage}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {relatedUnits.length > 0 && (
          <section className="border-t border-zinc-800 bg-zinc-950/70 py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-amber-500 mb-3">Unit Lainnya</p>
                  <h2 className="text-3xl md:text-4xl font-serif">Pilihan Tipe Lain yang Tersedia</h2>
                </div>
                <Link
                  href="/unit"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-400 hover:text-amber-500 transition-colors"
                >
                  Lihat Semua Unit <ArrowLeft size={14} className="rotate-180" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {relatedUnits.map((related) => (
                  <Link
                    href={`/unit/${related.slug}`}
                    key={related.slug}
                    className="group border border-zinc-800 rounded-sm overflow-hidden bg-zinc-900/50 hover:border-amber-500/60 transition-colors"
                  >
                    <div className="h-56 sm:h-64 overflow-hidden">
                      <img
                        src={related.images[0]}
                        alt={related.name}
                        className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-amber-500 mb-3">
                        {related.badge}
                      </p>
                      <h3 className="text-2xl font-serif mb-3">{related.name}</h3>
                      <p className="text-zinc-400 text-sm font-light leading-relaxed mb-5">
                        {related.description}
                      </p>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-zinc-200 text-sm">
                          {related.buildingArea} • {related.landArea}
                        </span>
                        <span className="text-amber-400 font-serif text-xl">{related.price}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
