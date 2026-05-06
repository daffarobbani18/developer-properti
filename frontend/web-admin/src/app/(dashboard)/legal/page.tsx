"use client";

import Link from "next/link";
import { ArrowUpRight, FileCheck2, ShieldCheck, Clock3, AlertTriangle, BadgeCheck, FileText, Scale } from "lucide-react";

const legalStats = [
  { label: "Izin Aktif", value: "12", note: "dari 14 dokumen terdaftar", icon: FileCheck2, bg: "bg-emerald-50", color: "text-emerald-500" },
  { label: "Segera Expired", value: "2", note: "perlu follow-up segera", icon: Clock3, bg: "bg-amber-50", color: "text-amber-500" },
  { label: "Dokumen Risiko", value: "1", note: "butuh revisi lampiran", icon: AlertTriangle, bg: "bg-rose-50", color: "text-rose-500" },
];

const legalTasks = [
  { title: "Perpanjangan IMB", desc: "Dokumen administrasi perlu diperbarui untuk blok B dan C.", status: "Menunggu tanda tangan", statusColor: "bg-amber-100 text-amber-700", dotColor: "bg-amber-500" },
  { title: "Review Akta Kerja Sama", desc: "Pastikan perubahan klausul pemasaran sudah sesuai versi terbaru.", status: "Dalam tinjauan", statusColor: "bg-blue-100 text-blue-700", dotColor: "bg-blue-500" },
  { title: "Validasi Sertifikat", desc: "Cek kelengkapan salinan sertifikat lahan tahap kedua.", status: "Siap dicek", statusColor: "bg-emerald-100 text-emerald-700", dotColor: "bg-emerald-500" },
];

const checklistItems = [
  "Simpan status dokumen per proyek agar mudah dipantau lintas tim.",
  "Tandai izin yang perlu revisi sebelum memasuki fase penjualan.",
  "Gunakan tampilan ini sebagai ringkasan awal sebelum integrasi backend.",
];

export default function LegalPage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.06),transparent_40%)]" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-amber-700">
              <Scale size={11} className="text-amber-500" /> Legal & Perizinan
            </div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">Monitoring Dokumen & Perizinan Proyek</h1>
            <p className="max-w-2xl text-sm text-zinc-500 leading-relaxed">Kelola dokumen hukum (KTP/NPWP pelanggan), proses PPJB, AJB, dan balik nama sertifikat unit.</p>
          </div>
          <Link href="/" className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-5 py-2.5 text-sm font-semibold text-amber-600 shadow-sm transition-all hover:bg-amber-100 hover:shadow-md">
            <ShieldCheck size={16} /> Ringkasan Proyek
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {legalStats.map((stat) => (
          <div key={stat.label} className="group rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <div className="mb-4"><div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}><stat.icon className={`h-6 w-6 ${stat.color}`} /></div></div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-zinc-900">{stat.value}</p>
            <p className="mt-1 text-xs text-zinc-500">{stat.note}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
          <div className="border-b border-zinc-100 px-6 py-4"><h3 className="text-sm font-bold text-zinc-900">Tugas Legal Aktif</h3></div>
          <div className="divide-y divide-zinc-50">
            {legalTasks.map((task) => (
              <div key={task.title} className="group flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-zinc-50">
                <div className="flex items-start gap-4 min-w-0">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100"><FileText size={14} className="text-zinc-400" /></div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-900">{task.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">{task.desc}</p>
                  </div>
                </div>
                <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${task.statusColor}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${task.dotColor}`} />{task.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
          <div className="border-b border-zinc-100 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50"><BadgeCheck size={16} className="text-emerald-500" /></div>
              <div><p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Panduan</p><h3 className="text-sm font-bold text-zinc-900">Langkah Validasi</h3></div>
            </div>
          </div>
          <ul className="space-y-3 p-6">
            {checklistItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-zinc-500 leading-relaxed">
                <ArrowUpRight className={`mt-0.5 h-4 w-4 shrink-0 ${idx === 0 ? "text-amber-500" : "text-amber-400"}`} />{item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
