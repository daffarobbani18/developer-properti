"use client";

import Link from "next/link";
import { ArrowUpRight, FileCheck2, ShieldCheck, Clock3, AlertTriangle, BadgeCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const legalStats = [
  {
    label: "Izin Aktif",
    value: "12",
    note: "dari 14 dokumen",
    icon: FileCheck2,
    tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    label: "Segera Expired",
    value: "2",
    note: "perlu follow-up",
    icon: Clock3,
    tone: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    label: "Risiko",
    value: "1",
    note: "butuh revisi lampiran",
    icon: AlertTriangle,
    tone: "bg-rose-50 text-rose-700 border-rose-200",
  },
];

const legalTasks = [
  {
    title: "Perpanjangan IMB",
    desc: "Dokumen administrasi perlu diperbarui untuk blok B dan C.",
    status: "Menunggu tanda tangan",
  },
  {
    title: "Review Akta Kerja Sama",
    desc: "Pastikan perubahan klausul pemasaran sudah sesuai versi terbaru.",
    status: "Dalam tinjauan",
  },
  {
    title: "Validasi Sertifikat",
    desc: "Cek kelengkapan salinan sertifikat lahan tahap kedua.",
    status: "Siap dicek",
  },
];

export default function LegalPage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-2xl md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.06),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.03),transparent_25%)]" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-[11px] uppercase tracking-[0.24em] text-amber-600">Legal & Perizinan</p>
            <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-5xl font-semibold tracking-tight text-slate-900 leading-tight">
              Monitoring Dokumen dan Perizinan Proyek
            </h1>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              Kelola dokumen hukum (KTP/NPWP pelanggan), proses dokumen PPJB (Perjanjian Pengikatan Jual Beli), AJB, dan urusan balik nama sertifikat unit.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs uppercase tracking-[0.2em] text-amber-600 transition-colors hover:bg-amber-100"
          >
            <ShieldCheck size={14} className="text-amber-600" /> Ringkasan Proyek
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {legalStats.map((item) => (
          <Card key={item.label} className="rounded-2xl border border-slate-200 bg-white backdrop-blur-2xl shadow-[0_5px_15px_rgba(0,0,0,0.05)]">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-600">{item.label}</p>
                  <p className="mt-2 text-3xl font-[family-name:var(--font-heading)] font-semibold text-slate-900">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">{item.note}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${item.tone}`}>
                  <item.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid grid-cols-1 gap-4">
          {legalTasks.map((task) => (
          <Card key={task.title} className="rounded-2xl border border-slate-200 bg-white backdrop-blur-2xl shadow-[0_5px_15px_rgba(0,0,0,0.05)]">
            <CardContent className="flex items-center justify-between gap-5 p-5 sm:p-6">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">{task.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{task.desc}</p>
                </div>
                <Badge className="shrink-0 rounded-md border border-slate-200 bg-slate-100 text-slate-700">
                  {task.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="rounded-2xl border border-slate-200 bg-white backdrop-blur-2xl shadow-[0_5px_15px_rgba(0,0,0,0.05)]">
          <CardContent className="p-6 sm:p-7">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-600">Checklist</p>
                <h3 className="text-lg font-semibold text-slate-900">Langkah Validasi</h3>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-slate-600 leading-relaxed">
              <li className="flex items-start gap-3">
                <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                Simpan status dokumen per proyek agar mudah dipantau lintas tim.
              </li>
              <li className="flex items-start gap-3">
                <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                Tandai izin yang perlu revisi sebelum memasuki fase penjualan.
              </li>
              <li className="flex items-start gap-3">
                <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                Gunakan tampilan ini sebagai ringkasan awal sebelum integrasi backend.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
