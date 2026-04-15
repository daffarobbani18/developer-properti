import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Home, Car } from "lucide-react";
import { PUBLIC_UNITS, getUnitBySlug } from "@/lib/public-unit-data";

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

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 md:py-16">
        <Link
          href="/unit"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-400 hover:text-amber-500 transition-colors"
        >
          <ArrowLeft size={14} /> Kembali ke Katalog
        </Link>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-amber-500 mb-4">{unit.badge}</p>
            <h1 className="text-4xl md:text-6xl font-serif mb-6 leading-tight">{unit.name}</h1>
            <p className="text-zinc-300 text-lg font-light leading-relaxed max-w-xl mb-8">{unit.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-sm">
                <Home size={16} className="text-amber-500" /> {unit.bedroom}
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-sm">
                <Car size={16} className="text-amber-500" /> {unit.garage}
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-sm">
                Status: {unit.status}
              </span>
            </div>

            <div className="mt-10 p-6 border border-zinc-800 rounded-sm bg-zinc-900/60">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 mb-3">Highlight</p>
              <p className="text-zinc-200 leading-relaxed">{unit.highlight}</p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {unit.specs.map((spec) => (
                <div key={spec.label} className="p-4 border border-zinc-800 bg-zinc-900/40 rounded-sm">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 mb-2">{spec.label}</p>
                  <p className="text-zinc-100 font-medium">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-[360px] sm:h-[460px] rounded-sm overflow-hidden border border-zinc-800">
              <img src={unit.images[0]} alt={unit.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {unit.images.slice(1).map((image, idx) => (
                <div key={image} className="h-36 sm:h-44 rounded-sm overflow-hidden border border-zinc-800">
                  <img src={image} alt={`${unit.name} ${idx + 2}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <div className="p-6 border border-zinc-800 rounded-sm bg-gradient-to-br from-amber-500/10 to-zinc-900">
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 mb-2">Harga Preview</p>
              <p className="text-3xl font-serif text-amber-400 mb-5">{unit.price}</p>
              <ul className="space-y-3 text-sm text-zinc-300">
                <li className="flex items-center gap-2"><Check size={14} className="text-amber-500" /> Luas Bangunan {unit.buildingArea}</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-amber-500" /> Luas Tanah {unit.landArea}</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-amber-500" /> Harga dapat berubah sesuai tahap pembangunan</li>
              </ul>
              <a
                href="https://wa.me/6281100009999?text=Halo%20saya%20ingin%20konsultasi%20detail%20unit."
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center px-5 py-3 bg-amber-600 text-white text-xs uppercase tracking-[0.2em] rounded-sm hover:bg-amber-500 transition-colors"
              >
                Konsultasi Sekarang
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
