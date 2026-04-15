"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Hammer,
  Clock,
  AlertTriangle,
  FileText,
  TrendingUp,
  Users,
  CheckCircle2,
  Upload,
  Sparkles,
  Plus,
} from "lucide-react";

const constructionStats = [
  {
    label: "Progress Rata-rata",
    value: "62%",
    change: "Fase 4 - Konstruksi",
    icon: TrendingUp,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Unit Selesai",
    value: "15 / 24",
    change: "Fase 4A selesai",
    icon: CheckCircle2,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Kendala Aktif",
    value: "3",
    change: "Perlu tindakan",
    icon: AlertTriangle,
    color: "bg-rose-50 text-rose-600",
  },
  {
    label: "SPK Kontraktor",
    value: "8",
    change: "Bulan ini",
    icon: FileText,
    color: "bg-amber-50 text-amber-600",
  },
];

const milestones = [
  {
    phase: "Pondasi & Struktur",
    progress: 100,
    status: "Selesai",
    dueDate: "Maret 2026",
  },
  {
    phase: "Dinding & Atap",
    progress: 85,
    status: "Sedang Berjalan",
    dueDate: "April 2026",
  },
  {
    phase: "Finishing & Interior",
    progress: 40,
    status: "Akan Dimulai",
    dueDate: "Juni 2026",
  },
];

export default function FieldSupervisorPage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-2xl md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.06),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.03),transparent_25%)]" />
        <div className="relative space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-slate-600">
                <Sparkles size={12} className="text-purple-600" /> Pengawas Lapangan
              </div>
              <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-5xl font-semibold tracking-tight text-slate-900 leading-tight">
                Monitoring Konstruksi & Progress Lapangan
              </h1>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl">
                Track progress konstruksi, kelola SPK kontraktor, upload foto lapangan, dan laporkan kendala/status mingguan.
              </p>
            </div>
            <button className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-xs uppercase tracking-[0.2em] text-purple-600 transition-colors hover:bg-purple-100">
              <Upload size={14} /> Upload Laporan
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {constructionStats.map((stat) => (
          <Card
            key={stat.label}
            className="group cursor-pointer border border-slate-200 bg-white shadow-[0_5px_15px_rgba(0,0,0,0.05)] rounded-2xl transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-purple-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)]"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.label}
              </CardTitle>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color} shadow-sm`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight text-slate-900">
                  {stat.value}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-slate-500">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Report Kendala",
            desc: "Laporkan hambatan/masalah konstruksi",
            icon: AlertTriangle,
            color: "bg-rose-50 text-rose-600",
          },
          {
            title: "Upload Progress",
            desc: "Foto & dokumen performa mingguan",
            icon: Upload,
            color: "bg-blue-50 text-blue-600",
          },
          {
            title: "Kelola SPK",
            desc: "Daftar & tracking surat perintah kerja",
            icon: FileText,
            color: "bg-amber-50 text-amber-600",
          },
          {
            title: "Tim Lapangan",
            desc: "Data pekerja & pengawas lapangan",
            icon: Users,
            color: "bg-emerald-50 text-emerald-600",
          },
        ].map((action) => (
          <Card
            key={action.title}
            className="group cursor-pointer border border-slate-200 bg-white shadow-[0_5px_15px_rgba(0,0,0,0.05)] rounded-2xl transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-purple-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)]"
          >
            <CardContent className="p-5 sm:p-6">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${action.color} mb-4 shadow-sm transition-all duration-200 group-hover:scale-105`}>
                <action.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">
                {action.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{action.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Milestones */}
      <div>
        <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold tracking-tight text-slate-900 mb-4">
          Milestone Konstruksi
        </h3>
        <div className="space-y-4">
          {milestones.map((milestone) => (
            <Card key={milestone.phase} className="border border-slate-200 bg-white rounded-2xl">
              <CardContent className="p-5 sm:p-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900">{milestone.phase}</h4>
                      <p className="mt-1 text-xs text-slate-600">Target: {milestone.dueDate}</p>
                    </div>
                    <Badge className={`${
                      milestone.status === "Selesai"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : milestone.status === "Sedang Berjalan"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    } border text-[10px] font-medium`}>
                      {milestone.status}
                    </Badge>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                      style={{ width: `${milestone.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{milestone.progress}% selesai</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
