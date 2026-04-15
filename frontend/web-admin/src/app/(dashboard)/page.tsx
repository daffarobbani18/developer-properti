"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Banknote,
  MapPin,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Activity,
  Sparkles,
  CalendarDays,
} from "lucide-react";

const stats = [
  {
    title: "Total Penjualan",
    value: "Rp 12,4 M",
    change: "+18%",
    trend: "up" as const,
    subtitle: "Dari 24 unit terjual",
    icon: Banknote,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    title: "Sisa Kavling",
    value: "36",
    change: "dari 60 total",
    trend: "neutral" as const,
    subtitle: "40% sudah terjual",
    icon: MapPin,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    title: "Tunggakan KPR",
    value: "Rp 840 jt",
    change: "+2 baru",
    trend: "down" as const,
    subtitle: "5 pembeli menunggak",
    icon: AlertTriangle,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    title: "Status Izin",
    value: "12 / 14",
    change: "2 segera expired",
    trend: "warning" as const,
    subtitle: "Izin aktif dari total",
    icon: FileCheck,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-500",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-2xl md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.06),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.03),transparent_25%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1.4fr_0.9fr] lg:items-end">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-slate-600">
              <Sparkles size={12} className="text-amber-600" /> Dashboard Overview
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-5xl font-semibold tracking-tight text-slate-900 leading-tight">
                Selamat Datang, Admin.
              </h2>
              <p className="mt-3 max-w-2xl text-sm md:text-base text-slate-600 leading-relaxed">
                Ringkasan performa proyek, penjualan, dan izin operasional hari ini ditampilkan dalam
                tampilan premium yang rapi dan responsif.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { label: "Update Hari Ini", value: "18", icon: Activity },
              { label: "Agenda", value: "07:30", icon: CalendarDays },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-600">{item.label}</p>
                    <p className="mt-2 text-2xl font-[family-name:var(--font-heading)] font-semibold text-slate-900">
                      {item.value}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-amber-600">
                    <item.icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="group cursor-pointer border border-slate-200 bg-white shadow-[0_5px_15px_rgba(0,0,0,0.05)] rounded-2xl backdrop-blur-2xl transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)]"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg} shadow-sm transition-all duration-200 group-hover:scale-105`}
              >
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight text-white">
                  {stat.value}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-2">
                {stat.trend === "up" && (
                  <Badge
                    variant="secondary"
                    className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 gap-0.5 text-xs font-medium rounded-md border border-emerald-200"
                  >
                    <TrendingUp className="h-3 w-3" />
                    {stat.change}
                  </Badge>
                )}
                {stat.trend === "down" && (
                  <Badge
                    variant="secondary"
                    className="bg-amber-50 text-amber-700 hover:bg-amber-50 gap-0.5 text-xs font-medium rounded-md border border-amber-200"
                  >
                    <TrendingDown className="h-3 w-3" />
                    {stat.change}
                  </Badge>
                )}
                {stat.trend === "warning" && (
                  <Badge
                    variant="secondary"
                    className="bg-rose-50 text-rose-700 hover:bg-rose-50 gap-0.5 text-xs font-medium rounded-md border border-rose-200"
                  >
                    <AlertTriangle className="h-3 w-3" />
                    {stat.change}
                  </Badge>
                )}
                {stat.trend === "neutral" && (
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 text-slate-700 hover:bg-slate-100 text-xs font-medium rounded-md border border-slate-200"
                  >
                    {stat.change}
                  </Badge>
                )}
              </div>

              <p className="mt-1.5 text-xs text-slate-500">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold tracking-tight text-slate-900 mb-4">
          Aksi Cepat
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            {
              label: "Tambah Leads Baru",
              href: "/crm",
              desc: "Input calon pembeli dari pameran atau walk-in",
            },
            {
              label: "Catat Pengeluaran",
              href: "/keuangan",
              desc: "Input pembayaran kontraktor atau biaya operasional",
            },
            {
              label: "Cek Izin Jatuh Tempo",
              href: "/legal",
              desc: "Lihat izin yang segera kedaluwarsa",
            },
          ].map((action) => (
            <Card
              key={action.label}
              className="group cursor-pointer border border-slate-200 bg-white shadow-[0_5px_15px_rgba(0,0,0,0.05)] rounded-2xl backdrop-blur-2xl transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] active:shadow-sm"
            >
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-slate-900 group-hover:text-amber-600 transition-colors duration-200">
                    {action.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{action.desc}</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 shadow-sm group-hover:bg-amber-50 transition-all duration-200">
                  <ArrowUpRight className="h-4 w-4 text-slate-600 group-hover:text-amber-600 transition-colors duration-200" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
