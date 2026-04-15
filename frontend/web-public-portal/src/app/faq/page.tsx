"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PublicTopNav } from "@/components/public/public-top-nav";
import { PublicFooter } from "@/components/public/public-footer";

const faqGroups = [
  {
    title: "Informasi Unit",
    items: [
      {
        q: "Apakah data unit di website ini sudah final?",
        a: "Belum sepenuhnya. Versi saat ini masih preview frontend hardcode untuk validasi tampilan dan alur pengguna.",
      },
      {
        q: "Bagaimana cara meminta detail spesifikasi lengkap?",
        a: "Anda dapat membuka halaman Kontak atau tombol WhatsApp untuk meminta e-brochure dan penjelasan spesifikasi unit.",
      },
    ],
  },
  {
    title: "Proses Pembelian",
    items: [
      {
        q: "Apakah saya bisa melakukan booking unit langsung dari website?",
        a: "Untuk tahap saat ini belum. Fitur booking online akan diaktifkan setelah fase integrasi backend selesai.",
      },
      {
        q: "Apakah tersedia sesi site visit?",
        a: "Ya. Tim marketing dapat menjadwalkan site visit privat sesuai waktu yang Anda pilih.",
      },
    ],
  },
  {
    title: "Teknis Website",
    items: [
      {
        q: "Mengapa beberapa konten masih bertuliskan preview?",
        a: "Konten tersebut disiapkan sebagai bahan presentasi tim internal sebelum data real-time dari sistem backend dihubungkan.",
      },
      {
        q: "Kapan website akan terhubung ke CRM dan dashboard internal?",
        a: "Integrasi akan dilakukan pada fase implementasi backend setelah seluruh alur UI/UX publik dikonfirmasi final.",
      },
    ],
  },
];

export default function FaqPage() {
  const [openKeys, setOpenKeys] = useState<string[]>(["0-0"]);

  const toggle = (key: string) => {
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900">
      <PublicTopNav />

      <main>
        <section className="py-16 md:py-20 border-b border-zinc-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <p className="text-xs uppercase tracking-[0.24em] text-amber-600 font-semibold mb-4">
              FAQ Publik
            </p>
            <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-6">
              Pertanyaan yang Sering Ditanyakan
            </h1>
            <p className="text-zinc-600 max-w-3xl text-lg font-light leading-relaxed">
              Ringkasan tanya jawab ini membantu calon pembeli memahami status proyek, alur konsultasi,
              dan tahapan pengembangan platform digital kami.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 space-y-10">
            {faqGroups.map((group, groupIdx) => (
              <div key={group.title}>
                <h2 className="text-2xl md:text-3xl font-serif mb-5">{group.title}</h2>
                <div className="space-y-3">
                  {group.items.map((item, itemIdx) => {
                    const key = `${groupIdx}-${itemIdx}`;
                    const isOpen = openKeys.includes(key);

                    return (
                      <article key={item.q} className="border border-zinc-200 bg-white rounded-sm overflow-hidden">
                        <button
                          onClick={() => toggle(key)}
                          className="w-full px-5 sm:px-6 py-5 flex items-center justify-between gap-4 text-left"
                          aria-expanded={isOpen}
                        >
                          <span className="text-zinc-900 font-medium leading-relaxed">{item.q}</span>
                          <ChevronDown
                            size={18}
                            className={`text-amber-600 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                            <p className="text-zinc-600 font-light leading-relaxed">{item.a}</p>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
