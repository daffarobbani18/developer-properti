import { Building2, ShieldCheck, Sparkles, Users } from "lucide-react";
import { PublicTopNav } from "@/components/public/public-top-nav";
import { PublicFooter } from "@/components/public/public-footer";

const values = [
  {
    icon: ShieldCheck,
    title: "Komitmen Kualitas",
    desc: "Setiap tahap pengembangan hunian dijalankan dengan standar konstruksi terukur dan transparan.",
  },
  {
    icon: Users,
    title: "Layanan Human-Centric",
    desc: "Kami merancang pengalaman pembeli yang sederhana, cepat, dan personal dari konsultasi sampai serah terima.",
  },
  {
    icon: Sparkles,
    title: "Desain Bernilai Jangka Panjang",
    desc: "Konsep arsitektur, lanskap, dan utilitas dipilih untuk menjaga nilai properti tetap kuat di masa depan.",
  },
];

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900">
      <PublicTopNav />

      <main>
        <section className="py-16 md:py-20 border-b border-zinc-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-amber-600 font-semibold mb-4">
                Tentang Griya Persada
              </p>
              <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-6">
                Pengembang Hunian Modern dengan Pendekatan Terintegrasi
              </h1>
              <p className="text-zinc-600 text-lg font-light leading-relaxed max-w-2xl">
                Kami membangun kawasan hunian yang menyeimbangkan kualitas hidup, akses strategis,
                dan pengelolaan properti berbasis sistem digital untuk pengalaman yang lebih nyaman.
              </p>
            </div>

            <div className="relative h-[300px] sm:h-[380px] lg:h-[460px] rounded-sm overflow-hidden border border-zinc-200 shadow-xl shadow-zinc-900/10">
              <img
                src="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1800&q=80"
                alt="Tim pengembang properti"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 to-zinc-950/10" />
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-serif mb-4">Nilai Utama Kami</h2>
              <p className="text-zinc-600 font-light max-w-3xl leading-relaxed">
                Fondasi ini menjadi pedoman dalam pengembangan produk, pelayanan konsumen, dan
                keberlanjutan operasional proyek.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
              {values.map((item) => (
                <article key={item.title} className="h-full border border-zinc-200 bg-white rounded-sm p-6">
                  <item.icon className="text-amber-600 mb-4" size={20} />
                  <h3 className="text-xl font-serif mb-3">{item.title}</h3>
                  <p className="text-zinc-600 font-light leading-relaxed">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 border-y border-zinc-200 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <article className="p-6 border border-zinc-800 bg-zinc-900/70 rounded-sm">
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 mb-3">Portofolio</p>
              <p className="text-3xl font-serif text-white mb-3">50+ Unit</p>
              <p className="text-zinc-400 font-light leading-relaxed">
                Koleksi hunian premium dengan tipe variatif untuk kebutuhan keluarga dan investasi.
              </p>
            </article>
            <article className="p-6 border border-zinc-800 bg-zinc-900/70 rounded-sm">
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 mb-3">Pendekatan</p>
              <p className="text-3xl font-serif text-white mb-3">End-to-End</p>
              <p className="text-zinc-400 font-light leading-relaxed">
                Dari perencanaan lahan hingga layanan purna jual, semua proses dirancang terukur.
              </p>
            </article>
            <article className="p-6 border border-zinc-800 bg-zinc-900/70 rounded-sm">
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 mb-3">Arah 2026</p>
              <p className="text-3xl font-serif text-white mb-3">Digital-First</p>
              <p className="text-zinc-400 font-light leading-relaxed">
                Integrasi data proyek dan layanan customer untuk pengalaman properti yang lebih adaptif.
              </p>
            </article>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="border border-zinc-200 rounded-sm p-7 sm:p-10 lg:p-12 bg-[#FCFCFC] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-amber-600 font-semibold mb-3">
                  Konsultasi Proyek
                </p>
                <h3 className="text-3xl md:text-4xl font-serif leading-tight mb-3">
                  Ingin mengenal proyek lebih dalam?
                </h3>
                <p className="text-zinc-600 font-light max-w-2xl">
                  Tim kami siap membantu Anda memahami pilihan unit, timeline pembangunan, dan simulasi kunjungan lokasi.
                </p>
              </div>
              <a
                href="https://wa.me/6281100009999?text=Halo%20tim%20Griya%20Persada%2C%20saya%20ingin%20konsultasi%20proyek."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-7 py-3 bg-zinc-900 text-white text-xs uppercase tracking-[0.2em] rounded-sm hover:bg-zinc-800 transition-colors"
              >
                Hubungi Konsultan
              </a>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
