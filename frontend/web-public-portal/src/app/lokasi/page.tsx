import { MapPin, Car, Building2 } from "lucide-react";
import { PublicTopNav } from "@/components/public/public-top-nav";
import { PublicFooter } from "@/components/public/public-footer";

export default function LokasiPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900">
      <PublicTopNav />

      <main>
        <section className="py-16 md:py-20 border-b border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <p className="text-xs uppercase tracking-[0.24em] text-amber-600 font-semibold mb-4">
              Lokasi Proyek Preview
            </p>
            <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-6">
              Lokasi Strategis dengan Akses Premium
            </h1>
            <p className="text-zinc-600 max-w-3xl text-lg font-light leading-relaxed">
              Halaman lokasi ini masih frontend hardcode untuk kebutuhan preview. Tujuannya memberi
              gambaran pengalaman pengguna saat mencari akses ke kawasan perumahan.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div className="relative h-[340px] sm:h-[460px] rounded-sm overflow-hidden border border-zinc-200 shadow-xl shadow-zinc-900/10">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80"
                alt="Peta lokasi kawasan"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-zinc-950/10" />
              <div className="absolute left-4 right-4 bottom-4 sm:left-6 sm:right-6 sm:bottom-6 p-4 bg-white/90 border border-zinc-200 rounded-sm">
                <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 mb-1">Alamat Dummy</p>
                <p className="text-zinc-900 font-medium">Jl. Bypass Baru, Padang Timur</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 border border-zinc-200 bg-white rounded-sm">
                <h2 className="text-2xl font-serif mb-4">Akses Utama</h2>
                <ul className="space-y-4 text-zinc-700 font-light">
                  <li className="flex items-start gap-3">
                    <Car className="text-amber-600 mt-0.5" size={18} />
                    <span>8 menit ke akses tol terdekat</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Building2 className="text-amber-600 mt-0.5" size={18} />
                    <span>10 menit ke pusat bisnis dan fasilitas kota</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="text-amber-600 mt-0.5" size={18} />
                    <span>12 menit dari pusat kota Padang</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 border border-zinc-200 bg-white rounded-sm">
                <h3 className="text-xl font-serif mb-4">Landmark Terdekat</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "RS Premier Padang",
                    "Sekolah Unggulan Sumbar",
                    "Mall Kota Padang",
                    "Gerbang Tol Timur",
                  ].map((landmark) => (
                    <div key={landmark} className="border border-zinc-100 bg-zinc-50 rounded-sm p-4 text-sm text-zinc-700">
                      {landmark}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
