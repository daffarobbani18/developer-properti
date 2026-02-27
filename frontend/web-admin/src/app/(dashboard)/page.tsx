"use client";

import AppShell from "@/components/layout/app-shell";
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
    <AppShell title="Dashboard">
      {/* Greeting */}
      <div className="mb-8">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight text-slate-900">
          Selamat Datang 👋
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Berikut ringkasan proyek perumahan Anda hari ini.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="group cursor-pointer bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-sm rounded-xl transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md hover:border-blue-300/50 hover:bg-white/90"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {stat.title}
              </CardTitle>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconBg} shadow-sm transition-all duration-200 group-hover:scale-105`}
              >
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight text-slate-900">
                  {stat.value}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-2">
                {stat.trend === "up" && (
                  <Badge
                    variant="secondary"
                    className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 gap-0.5 text-xs font-medium rounded-md"
                  >
                    <TrendingUp className="h-3 w-3" />
                    {stat.change}
                  </Badge>
                )}
                {stat.trend === "down" && (
                  <Badge
                    variant="secondary"
                    className="bg-amber-50 text-amber-700 hover:bg-amber-50 gap-0.5 text-xs font-medium rounded-md"
                  >
                    <TrendingDown className="h-3 w-3" />
                    {stat.change}
                  </Badge>
                )}
                {stat.trend === "warning" && (
                  <Badge
                    variant="secondary"
                    className="bg-rose-50 text-rose-600 hover:bg-rose-50 gap-0.5 text-xs font-medium rounded-md"
                  >
                    <AlertTriangle className="h-3 w-3" />
                    {stat.change}
                  </Badge>
                )}
                {stat.trend === "neutral" && (
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 text-slate-600 hover:bg-slate-100 text-xs font-medium rounded-md"
                  >
                    {stat.change}
                  </Badge>
                )}
              </div>

              <p className="mt-1.5 text-xs text-slate-400">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold tracking-tight text-slate-900 mb-4">
          Aksi Cepat
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              className="group cursor-pointer bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-sm rounded-xl transition-all duration-200 ease-in-out hover:bg-white/90 hover:shadow-md hover:border-blue-300/50 active:shadow-sm"
            >
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
                    {action.label}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{action.desc}</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 border border-slate-200/50 shadow-sm group-hover:bg-blue-50 transition-all duration-200">
                  <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors duration-200" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
