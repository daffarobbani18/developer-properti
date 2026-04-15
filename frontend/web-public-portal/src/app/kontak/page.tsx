"use client";

import { FormEvent, useState } from "react";
import { Mail, Phone, MessageCircle, Clock3, CheckCircle2, AlertCircle } from "lucide-react";
import { PublicTopNav } from "@/components/public/public-top-nav";
import { PublicFooter } from "@/components/public/public-footer";

type ContactStatus = "idle" | "success" | "error";

type ContactFormState = {
  name: string;
  phone: string;
  email: string;
  interest: string;
  message: string;
};

const initialState: ContactFormState = {
  name: "",
  phone: "",
  email: "",
  interest: "Minat Unit Astoria",
  message: "",
};

export default function KontakPage() {
  const [form, setForm] = useState<ContactFormState>(initialState);
  const [status, setStatus] = useState<ContactStatus>("idle");
  const [feedback, setFeedback] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = form.name.trim();
    const trimmedPhone = form.phone.trim();
    const trimmedEmail = form.email.trim();
    const trimmedMessage = form.message.trim();

    if (!trimmedName || trimmedName.length < 3) {
      setStatus("error");
      setFeedback("Nama minimal 3 karakter.");
      return;
    }

    if (!trimmedPhone || trimmedPhone.length < 8) {
      setStatus("error");
      setFeedback("Nomor WhatsApp belum valid.");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      setStatus("error");
      setFeedback("Email belum valid.");
      return;
    }

    if (!trimmedMessage || trimmedMessage.length < 10) {
      setStatus("error");
      setFeedback("Pesan minimal 10 karakter.");
      return;
    }

    setStatus("success");
    setFeedback("Permintaan berhasil disiapkan. Tim marketing akan menindaklanjuti segera.");
    setForm(initialState);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900">
      <PublicTopNav />

      <main>
        <section className="py-16 md:py-20 border-b border-zinc-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <p className="text-xs uppercase tracking-[0.24em] text-amber-600 font-semibold mb-4">
              Kontak Preview
            </p>
            <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-6">Hubungi Tim Marketing</h1>
            <p className="text-zinc-600 max-w-3xl text-lg font-light leading-relaxed">
              Form dan data pada halaman ini bersifat preview frontend. Sudah interaktif secara visual
              untuk simulasi alur konsultasi, namun belum tersambung ke backend.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-2 space-y-4">
              <div className="border border-zinc-200 bg-white rounded-sm p-5 sm:p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-600 font-semibold mb-4">
                  Kontak Langsung
                </p>
                <div className="space-y-4 text-sm">
                  {[
                    { icon: Phone, label: "Telepon", value: "+62 811 0000 9999" },
                    { icon: Mail, label: "Email", value: "contact@griyapersada.co.id" },
                    { icon: MessageCircle, label: "WhatsApp", value: "+62 811 0000 9999" },
                    { icon: Clock3, label: "Jam Operasional", value: "09:00 - 18:00 WIB" },
                  ].map((item) => (
                    <article key={item.label} className="flex items-start gap-4 rounded-sm">
                      <item.icon className="text-amber-600 mt-0.5 shrink-0" size={18} />
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 mb-2">
                          {item.label}
                        </p>
                        <p className="text-zinc-900 font-medium leading-relaxed">{item.value}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <a
                href="https://wa.me/6281100009999?text=Halo%20tim%20Griya%20Persada%2C%20saya%20ingin%20info%20unit%20yang%20tersedia."
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-4 bg-emerald-500 text-white text-xs uppercase tracking-[0.2em] rounded-sm hover:bg-emerald-400 transition-colors"
              >
                <MessageCircle size={16} /> Chat WhatsApp
              </a>
            </div>

            <div className="lg:col-span-3 border border-zinc-200 bg-white rounded-sm p-6 sm:p-8 shadow-sm shadow-zinc-900/5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-serif mb-2">Kirim Permintaan Informasi</h2>
                  <p className="text-zinc-600 font-light leading-relaxed max-w-2xl">
                    Isi detail singkat di bawah ini agar tim kami dapat menghubungi Anda dengan lebih tepat.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-zinc-500 border border-zinc-200 rounded-full px-4 py-2 shrink-0">
                  Preview Interaktif
                </div>
              </div>

              {status !== "idle" && (
                <div
                  className={`mb-6 flex items-start gap-3 rounded-sm border px-4 py-3 text-sm ${
                    status === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-amber-200 bg-amber-50 text-amber-800"
                  }`}
                  aria-live="polite"
                >
                  {status === "success" ? (
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                  ) : (
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  )}
                  <p>{feedback}</p>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Nama Lengkap"
                      className="h-12 w-full px-4 border border-zinc-300 rounded-sm focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100 transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Nomor WhatsApp"
                      className="h-12 w-full px-4 border border-zinc-300 rounded-sm focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100 transition-all"
                    />
                  </div>
                </div>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="h-12 px-4 border border-zinc-300 rounded-sm focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100 transition-all w-full"
                />

                <select
                  name="interest"
                  value={form.interest}
                  onChange={handleChange}
                  className="h-12 px-4 border border-zinc-300 rounded-sm focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100 transition-all w-full bg-white"
                >
                  <option>Minat Unit Astoria</option>
                  <option>Minat Unit Bvlgari</option>
                  <option>Konsultasi Lokasi</option>
                  <option>Permintaan Site Visit</option>
                </select>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tulis kebutuhan Anda"
                  className="p-4 border border-zinc-300 rounded-sm focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100 transition-all w-full resize-none"
                />

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 bg-zinc-900 text-white text-xs uppercase tracking-[0.2em] rounded-sm hover:bg-zinc-800 transition-colors"
                  >
                    Kirim Permintaan
                  </button>
                  <p className="text-xs text-zinc-500 font-light leading-relaxed max-w-md">
                    Form ini masih preview dan belum mengirim data ke backend. Strukturnya sudah siap untuk integrasi berikutnya.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
