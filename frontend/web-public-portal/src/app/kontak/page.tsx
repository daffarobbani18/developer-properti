import { Mail, Phone, MessageCircle, Clock3 } from "lucide-react";
import { PublicTopNav } from "@/components/public/public-top-nav";
import { PublicFooter } from "@/components/public/public-footer";

export default function KontakPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900">
      <PublicTopNav />

      <main>
        <section className="py-16 md:py-20 border-b border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <p className="text-xs uppercase tracking-[0.24em] text-amber-600 font-semibold mb-4">
              Kontak Preview
            </p>
            <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-6">Hubungi Tim Marketing</h1>
            <p className="text-zinc-600 max-w-3xl text-lg font-light leading-relaxed">
              Form dan data pada halaman ini bersifat preview frontend. Belum terhubung ke backend,
              namun struktur sudah disiapkan agar mudah diintegrasikan.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12">
            <div className="lg:col-span-2 space-y-4">
              {[
                { icon: Phone, label: "Telepon", value: "+62 811 0000 9999" },
                { icon: Mail, label: "Email", value: "contact@griyapersada.co.id" },
                { icon: MessageCircle, label: "WhatsApp", value: "+62 811 0000 9999" },
                { icon: Clock3, label: "Jam Operasional", value: "09:00 - 18:00 WIB" },
              ].map((item) => (
                <article key={item.label} className="p-5 border border-zinc-200 bg-white rounded-sm flex items-start gap-4">
                  <item.icon className="text-amber-600 mt-0.5" size={18} />
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">{item.label}</p>
                    <p className="text-zinc-900 font-medium">{item.value}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="lg:col-span-3 border border-zinc-200 bg-white rounded-sm p-6 sm:p-8">
              <h2 className="text-2xl font-serif mb-8">Kirim Permintaan Informasi</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    className="h-12 px-4 border border-zinc-300 rounded-sm focus:outline-none focus:border-amber-600"
                  />
                  <input
                    type="tel"
                    placeholder="Nomor WhatsApp"
                    className="h-12 px-4 border border-zinc-300 rounded-sm focus:outline-none focus:border-amber-600"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  className="h-12 px-4 border border-zinc-300 rounded-sm focus:outline-none focus:border-amber-600 w-full"
                />
                <select className="h-12 px-4 border border-zinc-300 rounded-sm focus:outline-none focus:border-amber-600 w-full bg-white">
                  <option>Minat Unit Astoria</option>
                  <option>Minat Unit Bvlgari</option>
                  <option>Konsultasi Lokasi</option>
                  <option>Permintaan Site Visit</option>
                </select>
                <textarea
                  rows={5}
                  placeholder="Tulis kebutuhan Anda"
                  className="p-4 border border-zinc-300 rounded-sm focus:outline-none focus:border-amber-600 w-full"
                />
                <button className="w-full sm:w-auto px-8 py-3 bg-zinc-900 text-white text-xs uppercase tracking-[0.2em] rounded-sm hover:bg-zinc-800 transition-colors">
                  Kirim Permintaan
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
