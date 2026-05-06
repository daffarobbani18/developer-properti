"use client";

import { Hammer, Clock, AlertTriangle, FileText, TrendingUp, Users, CheckCircle2, Upload, Plus, ArrowUpRight } from "lucide-react";

const constructionStats = [
  { label: "Progress Rata-rata", value: "62%", note: "Fase 4 – Konstruksi", icon: TrendingUp, bg: "bg-blue-50", color: "text-blue-500" },
  { label: "Unit Selesai", value: "15 / 24", note: "Fase 4A sudah selesai", icon: CheckCircle2, bg: "bg-emerald-50", color: "text-emerald-500" },
  { label: "Kendala Aktif", value: "3", note: "Perlu tindakan segera", icon: AlertTriangle, bg: "bg-rose-50", color: "text-rose-500" },
  { label: "SPK Kontraktor", value: "8", note: "Diterbitkan bulan ini", icon: FileText, bg: "bg-amber-50", color: "text-amber-500" },
];

const milestones = [
  { phase: "Pondasi & Struktur", progress: 100, status: "Selesai", dueDate: "Maret 2026" },
  { phase: "Dinding & Atap", progress: 85, status: "Sedang Berjalan", dueDate: "April 2026" },
  { phase: "Finishing & Interior", progress: 40, status: "Akan Dimulai", dueDate: "Juni 2026" },
];

const actionCards = [
  { title: "Report Kendala", desc: "Laporkan hambatan atau masalah konstruksi", icon: AlertTriangle, bg: "bg-rose-50", color: "text-rose-500" },
  { title: "Upload Progress", desc: "Foto & dokumen performa mingguan", icon: Upload, bg: "bg-blue-50", color: "text-blue-500" },
  { title: "Kelola SPK", desc: "Daftar & tracking surat perintah kerja", icon: FileText, bg: "bg-amber-50", color: "text-amber-500" },
  { title: "Tim Lapangan", desc: "Data pekerja & pengawas lapangan", icon: Users, bg: "bg-emerald-50", color: "text-emerald-500" },
];

const milestoneStatusStyle: Record<string, { badge: string; bar: string }> = {
  Selesai: { badge: "bg-emerald-100 text-emerald-700", bar: "from-emerald-400 to-emerald-500" },
  "Sedang Berjalan": { badge: "bg-blue-100 text-blue-700", bar: "from-blue-400 to-blue-500" },
  "Akan Dimulai": { badge: "bg-zinc-100 text-zinc-600", bar: "from-zinc-300 to-zinc-400" },
};

export default function FieldSupervisorPage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.06),transparent_40%)]" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-amber-700">
              <Hammer size={11} className="text-amber-500" /> Pengawas Lapangan
            </div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">Monitoring Konstruksi & Progress Lapangan</h1>
            <p className="max-w-2xl text-sm text-zinc-500 leading-relaxed">Track progress konstruksi, kelola SPK kontraktor, upload foto lapangan, dan laporkan kendala/status mingguan.</p>
          </div>
          <button className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-5 py-2.5 text-sm font-semibold text-amber-600 shadow-sm transition-all hover:bg-amber-100 hover:shadow-md">
            <Upload size={16} /> Upload Laporan
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {constructionStats.map((stat) => (
          <div key={stat.label} className="group rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <div className="mb-4"><div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}><stat.icon className={`h-6 w-6 ${stat.color}`} /></div></div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-zinc-900">{stat.value}</p>
            <p className="mt-1 text-xs text-zinc-500">{stat.note}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actionCards.map((action) => (
          <div key={action.title} className="group cursor-pointer rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_8px_25px_rgba(245,158,11,0.12)]">
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${action.bg} transition-transform duration-300 group-hover:scale-105`}><action.icon className={`h-6 w-6 ${action.color}`} /></div>
            <h3 className="text-sm font-bold text-zinc-900 transition-colors group-hover:text-amber-600">{action.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">{action.desc}</p>
            <div className="mt-4 flex items-center gap-1 text-[11px] font-medium text-amber-500 opacity-0 transition-opacity group-hover:opacity-100"><ArrowUpRight size={13} /> Buka Modul</div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="mb-4 text-lg font-bold text-zinc-900">Milestone Konstruksi</h3>
        <div className="space-y-4">
          {milestones.map((milestone) => {
            const style = milestoneStatusStyle[milestone.status] ?? { badge: "bg-zinc-100 text-zinc-600", bar: "from-zinc-300 to-zinc-400" };
            return (
              <div key={milestone.phase} className="overflow-hidden rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-colors hover:border-zinc-200">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-zinc-900">{milestone.phase}</h4>
                    <p className="mt-0.5 text-xs text-zinc-400">Target selesai: {milestone.dueDate}</p>
                  </div>
                  <span className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-medium ${style.badge}`}>{milestone.status}</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                    <div className={`h-full rounded-full bg-gradient-to-r ${style.bar} transition-all duration-500`} style={{ width: `${milestone.progress}%` }} />
                  </div>
                  <p className="text-xs font-medium text-zinc-400">{milestone.progress}% selesai</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
