"use client";

import Link from "next/link";
import { UsersThree, Kanban, House, Receipt, Pulse, ArrowUpRight, TrendUp } from "@phosphor-icons/react";

const crmMenus = [
  { label: "Daftar Leads", href: "/crm/leads", icon: UsersThree, desc: "Kelola data calon pembeli, filter & search", count: "10 leads", bg: "bg-blue-50", color: "text-blue-500", countBg: "bg-blue-100 text-blue-700" },
  { label: "Pipeline", href: "/crm/pipeline", icon: Kanban, desc: "Kanban board drag & drop tahap penjualan", count: "6 tahap", bg: "bg-violet-50", color: "text-violet-500", countBg: "bg-violet-100 text-violet-700" },
  { label: "Manajemen Unit", href: "/crm/unit", icon: House, desc: "Site plan kavling, status & harga unit", count: "12 unit", bg: "bg-emerald-50", color: "text-emerald-500", countBg: "bg-emerald-100 text-emerald-700" },
  { label: "Transaksi", href: "/crm/transaksi", icon: Receipt, desc: "Booking, SPK, dan progress KPR pembeli", count: "4 transaksi", bg: "bg-amber-50", color: "text-amber-500", countBg: "bg-amber-100 text-amber-700" },
  { label: "Aktivitas Sales", href: "/crm/aktivitas", icon: Pulse, desc: "Log aktivitas, jadwal follow-up sales", count: "8 aktivitas", bg: "bg-rose-50", color: "text-rose-500", countBg: "bg-rose-100 text-rose-700" },
];

export default function CRMIndexPage() {
  return (
    <div className="space-y-6">
      <section className="module-hero md:p-8" style={{ "--hero-accent": "rgba(245,158,11,0.06)" } as React.CSSProperties}>
        <div className="hero-pattern absolute inset-0 pointer-events-none rounded-2xl opacity-50" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-amber-700">
              <TrendUp weight="duotone" size={11} className="text-amber-500" /> CRM &amp; Sales
            </div>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl font-normal tracking-tight text-zinc-900 md:text-3xl">Pusat Pengelolaan Calon Pembeli &amp; Pipeline</h1>
            <p className="max-w-2xl text-sm text-zinc-500 leading-relaxed">Dashboard awal tim sales — navigasi modul CRM dengan kartu yang mudah dibaca dan responsif di semua perangkat.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:shrink-0">
            {[{ label: "Leads Hari Ini", value: "10" }, { label: "Follow Up", value: "08" }].map((item) => (
              <div key={item.label} className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">{item.label}</p>
                <p className="mt-1.5 text-2xl font-bold text-zinc-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {crmMenus.map((menu) => (
          <Link key={menu.href} href={menu.href} className="block">
            <div className="group flex h-full flex-col rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200/60 hover:shadow-[0_8px_25px_rgba(245,158,11,0.08)]">
              <div className="mb-4 flex items-start justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${menu.bg} transition-transform duration-300 group-hover:scale-105`}><menu.icon weight="duotone" className={`h-5 w-5 ${menu.color}`} /></div>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-100 bg-zinc-50 transition-all duration-200 group-hover:border-amber-200 group-hover:bg-amber-50">
                  <ArrowUpRight weight="duotone" className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-amber-500" />
                </div>
              </div>
              <h3 className="text-sm font-bold text-zinc-900 transition-colors group-hover:text-amber-600">{menu.label}</h3>
              <p className="mt-1 flex-1 text-xs leading-relaxed text-zinc-500">{menu.desc}</p>
              <span className={`mt-4 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${menu.countBg} w-fit`}>{menu.count}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
