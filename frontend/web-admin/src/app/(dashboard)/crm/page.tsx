"use client";

import AppShell from "@/components/layout/app-shell";
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
    <AppShell title="CRM & Sales">
      <div className="mb-6">
        <p className="text-sm text-slate-500">
          Pusat pengelolaan calon pembeli, pipeline penjualan, dan transaksi unit perumahan.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {crmMenus.map((menu) => (
          <Link key={menu.href} href={menu.href}>
            <Card className="group h-full cursor-pointer bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-sm rounded-xl transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md hover:border-blue-300/50 hover:bg-white/90">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${menu.color} shadow-sm transition-all duration-200 group-hover:scale-105`}
                  >
                    <menu.icon className="h-5 w-5" />
                  </div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 border border-slate-200/50 group-hover:bg-blue-50 transition-all duration-200">
                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 transition-colors duration-200" />
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
                  {menu.label}
                </h3>
                <p className="mt-1 text-xs text-slate-400">{menu.desc}</p>
                <Badge className="mt-3 text-[10px] bg-slate-100 text-slate-500 font-medium rounded-md border-0">
                  {menu.count}
                </Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
