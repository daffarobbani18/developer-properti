"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Building2,
  Home,
  MapPin,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Sparkles,
} from "lucide-react";

const inventoryStats = [
  {
    label: "Total Lahan",
    value: "3 lokasi",
    change: "15,000 m²",
    icon: MapPin,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Unit Kavling",
    value: "60",
    change: "+5 baru",
    icon: Home,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Sertifikat Induk",
    value: "2 / 3",
    change: "1 proses",
    icon: FileText,
    color: "bg-amber-50 text-amber-600",
  },
  {
    label: "Status Site Plan",
    value: "3 / 3",
    change: "100% tercatat",
    icon: CheckCircle2,
    color: "bg-rose-50 text-rose-600",
  },
];

const recentActivities = [
  {
    type: "Lahan baru",
    desc: "Site Siputur - Input lokasi & dokumen awal",
    status: "Menunggu Verifikasi",
    date: "Hari ini",
  },
  {
    type: "Unit Kavling",
    desc: "30 unit baru - Tipe A, B, C + Harga",
    status: "Input Selesai",
    date: "Kemarin",
  },
  {
    type: "Sertifikat",
    desc: "Sertifikat Induk Fase 2 - Diterima Notaris",
    status: "Proses Balik Nama",
    date: "2 hari lalu",
  },
];

export default function InventoryAdminPage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-2xl md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.06),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.03),transparent_25%)]" />
        <div className="relative space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-slate-600">
                <Sparkles size={12} className="text-blue-600" /> Inventory & Lahan
              </div>
              <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-5xl font-semibold tracking-tight text-slate-900 leading-tight">
                Data Master Lahan & Kavling
              </h1>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl">
                Kelola data lahan, unit kavling, sertifikat induk, dan site plan. Data di sini otomatis muncul di Website Marketing.
              </p>
            </div>
            <button className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs uppercase tracking-[0.2em] text-blue-600 transition-colors hover:bg-blue-100">
              <Plus size={14} /> Input Lahan
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {inventoryStats.map((stat) => (
          <Card
            key={stat.label}
            className="group cursor-pointer border border-slate-200 bg-white shadow-[0_5px_15px_rgba(0,0,0,0.05)] rounded-2xl transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)]"
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

      {/* Main Sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {[
          {
            title: "Input Lahan Baru",
            desc: "Daftarkan lokasi proyek baru dengan dokumen awal",
            icon: MapPin,
            color: "bg-blue-50 text-blue-600",
            href: "#",
          },
          {
            title: "Kelola Unit Kavling",
            desc: "Update tipe, luas, harga, dan gambar unit per lokasi",
            icon: Home,
            color: "bg-emerald-50 text-emerald-600",
            href: "#",
          },
          {
            title: "Sertifikat & Legalitas",
            desc: "Track status sertifikat induk dan balik nama unit",
            icon: FileText,
            color: "bg-amber-50 text-amber-600",
            href: "#",
          },
          {
            title: "Site Plan & Denah",
            desc: "Unggah dan kelola denah lokasi interaktif",
            icon: Building2,
            color: "bg-rose-50 text-rose-600",
            href: "#",
          },
          {
            title: "Harga & Promo",
            desc: "Atur harga satuan dan paket promosi per fase",
            icon: TrendingUp,
            color: "bg-purple-50 text-purple-600",
            href: "#",
          },
          {
            title: "Monitoring Dokumen",
            desc: "Cek kelengkapan & deadline dokumen",
            icon: AlertTriangle,
            color: "bg-indigo-50 text-indigo-600",
            href: "#",
          },
        ].map((section) => (
          <Card
            key={section.title}
            className="group cursor-pointer border border-slate-200 bg-white shadow-[0_5px_15px_rgba(0,0,0,0.05)] rounded-2xl transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)]"
          >
            <CardContent className="p-5 sm:p-6">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${section.color} mb-4 shadow-sm transition-all duration-200 group-hover:scale-105`}>
                <section.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                {section.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{section.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities */}
      <div>
        <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold tracking-tight text-slate-900 mb-4">
          Aktivitas Terbaru
        </h3>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <Card key={activity.desc} className="border border-slate-200 bg-white rounded-2xl">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{activity.type}</h4>
                    <p className="mt-0.5 text-xs text-slate-600">{activity.desc}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <Badge className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-50 text-[10px] font-medium">
                      {activity.status}
                    </Badge>
                    <p className="mt-2 text-xs text-slate-500">{activity.date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
