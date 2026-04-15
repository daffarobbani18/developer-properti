"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Users,
  KanbanSquare,
  Home,
  Receipt,
  Activity,
  ArrowUpRight,
} from "lucide-react";

const crmMenus = [
  {
    label: "Daftar Leads",
    href: "/crm/leads",
    icon: Users,
    desc: "Kelola data calon pembeli, filter & search",
    count: "10 leads",
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Pipeline",
    href: "/crm/pipeline",
    icon: KanbanSquare,
    desc: "Kanban board drag & drop tahap penjualan",
    count: "6 tahap",
    color: "bg-violet-50 text-violet-600",
  },
  {
    label: "Manajemen Unit",
    href: "/crm/unit",
    icon: Home,
    desc: "Site plan kavling, status & harga unit",
    count: "12 unit",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Transaksi",
    href: "/crm/transaksi",
    icon: Receipt,
    desc: "Booking, SPK, dan progress KPR pembeli",
    count: "4 transaksi",
    color: "bg-amber-50 text-amber-600",
  },
  {
    label: "Aktivitas Sales",
    href: "/crm/aktivitas",
    icon: Activity,
    desc: "Log aktivitas, jadwal follow-up sales",
    count: "8 aktivitas",
    color: "bg-rose-50 text-rose-600",
  },
];

export default function CRMIndexPage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-2xl md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.06),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.03),transparent_25%)]" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-[11px] uppercase tracking-[0.24em] text-amber-600">CRM & Sales</p>
            <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-5xl font-semibold tracking-tight text-slate-900 leading-tight">
              Pusat Pengelolaan Calon Pembeli dan Pipeline Penjualan
            </h1>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              Navigasi ini dirancang sebagai dashboard awal untuk tim sales, dengan kartu modul yang mudah dibaca dan responsif di perangkat kecil maupun besar.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { label: "Leads Hari Ini", value: "10" },
              { label: "Follow Up", value: "08" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 backdrop-blur-xl">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-600">{item.label}</p>
                <p className="mt-2 text-2xl font-[family-name:var(--font-heading)] font-semibold text-slate-900">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {crmMenus.map((menu) => (
          <Link key={menu.href} href={menu.href}>
            <Card className="group h-full cursor-pointer border border-slate-200 bg-white shadow-[0_5px_15px_rgba(0,0,0,0.05)] rounded-2xl backdrop-blur-2xl transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)]">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start justify-between mb-4 gap-4">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${menu.color} shadow-sm transition-all duration-200 group-hover:scale-105`}
                  >
                    <menu.icon className="h-5 w-5" />
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 transition-all duration-200 group-hover:bg-amber-50">
                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-amber-600 transition-colors duration-200" />
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-amber-600 transition-colors duration-200">
                  {menu.label}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{menu.desc}</p>
                <Badge className="mt-4 text-[10px] bg-slate-100 text-slate-700 font-medium rounded-md border border-slate-200">
                  {menu.count}
                </Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
