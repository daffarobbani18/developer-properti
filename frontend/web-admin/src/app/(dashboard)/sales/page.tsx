"use client";

import {
  Users,
  Phone,
  MapPin,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Plus,
  ArrowUpRight,
} from "lucide-react";

const salesStats = [
  {
    label: "Leads Bulan Ini",
    value: "24",
    note: "+8 leads hari ini",
    icon: Users,
    bg: "bg-blue-50",
    color: "text-blue-500",
  },
  {
    label: "Follow-up Hari Ini",
    value: "12",
    note: "6 sudah selesai",
    icon: Phone,
    bg: "bg-emerald-50",
    color: "text-emerald-500",
  },
  {
    label: "Unit Booking",
    value: "8",
    note: "dari 60 total unit",
    icon: MapPin,
    bg: "bg-amber-50",
    color: "text-amber-500",
  },
  {
    label: "Target Penjualan",
    value: "Rp 2,4 M",
    note: "40% sudah terkumpul",
    icon: DollarSign,
    bg: "bg-rose-50",
    color: "text-rose-500",
  },
];

const leadsData = [
  {
    name: "Budi Santoso",
    source: "Website",
    unit: "Astoria Type B",
    status: "Hot Lead",
    lastConn: "Hari ini",
    nextAction: "Site visit",
  },
  {
    name: "Siti Aminah",
    source: "WhatsApp",
    unit: "Bvlgari Type A",
    status: "Warm Lead",
    lastConn: "Kemarin",
    nextAction: "Call follow-up",
  },
  {
    name: "Ahmad Rifqi",
    source: "Walk-in",
    unit: "Astoria Type C",
    status: "Negotiation",
    lastConn: "2 hari lalu",
    nextAction: "Booking call",
  },
];

const actionCards = [
  {
    title: "Input Lead Baru",
    desc: "Dari Website, WhatsApp, atau Walk-in",
    icon: Users,
    bg: "bg-blue-50",
    color: "text-blue-500",
  },
  {
    title: "Manage Site Visit",
    desc: "Jadwalkan kunjungan lokasi pelanggan",
    icon: MapPin,
    bg: "bg-emerald-50",
    color: "text-emerald-500",
  },
  {
    title: "Booking & SPK",
    desc: "Kunci unit dan buat surat perintah kerja",
    icon: CheckCircle2,
    bg: "bg-amber-50",
    color: "text-amber-500",
  },
];

const statusStyle: Record<string, string> = {
  "Hot Lead": "bg-rose-100 text-rose-700",
  "Warm Lead": "bg-amber-100 text-amber-700",
  Negotiation: "bg-blue-100 text-blue-700",
};

export default function SalesAdminPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.06),transparent_40%)]" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-blue-700">
              <TrendingUp size={11} className="text-blue-500" /> Sales &amp;
              Marketing
            </div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
              Pipeline Penjualan &amp; Manajemen Leads
            </h1>
            <p className="max-w-2xl text-sm text-zinc-500 leading-relaxed">
              Kelola leads dari Website Marketing, booking unit, tracking site
              visit, dan progress menuju transaksi.
            </p>
          </div>
          <button className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-2.5 text-sm font-semibold text-blue-600 shadow-sm transition-all hover:bg-blue-100 hover:shadow-md">
            <Plus size={16} /> Input Lead
          </button>
        </div>
      </section>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {salesStats.map((stat) => (
          <div
            key={stat.label}
            className="group rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="mb-4 flex items-start justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}
              >
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-bold text-zinc-900">{stat.value}</p>
            <p className="mt-1 text-xs text-zinc-500">{stat.note}</p>
          </div>
        ))}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {actionCards.map((action) => (
          <div
            key={action.title}
            className="group cursor-pointer rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_8px_25px_rgba(245,158,11,0.12)]"
          >
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${action.bg} transition-transform duration-300 group-hover:scale-105`}
            >
              <action.icon className={`h-6 w-6 ${action.color}`} />
            </div>
            <h3 className="text-sm font-bold text-zinc-900 transition-colors group-hover:text-amber-600">
              {action.title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
              {action.desc}
            </p>
            <div className="mt-4 flex items-center gap-1 text-[11px] font-medium text-amber-500 opacity-0 transition-opacity group-hover:opacity-100">
              <ArrowUpRight size={13} /> Buka Modul
            </div>
          </div>
        ))}
      </div>

      {/* Hot Leads */}
      <div>
        <h3 className="mb-4 text-lg font-bold text-zinc-900">
          Leads Panas &amp; Follow-up
        </h3>
        <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
          <div className="hidden grid-cols-5 border-b border-zinc-100 bg-zinc-50/50 px-6 py-3 sm:grid">
            <p className="col-span-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Prospek
            </p>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Status
            </p>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Kontak Terakhir
            </p>
            <p className="text-right text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Aksi Selanjutnya
            </p>
          </div>
          <div className="divide-y divide-zinc-100">
            {leadsData.map((lead) => (
              <div
                key={lead.name}
                className="group flex flex-col gap-3 px-6 py-4 transition-colors hover:bg-zinc-50 sm:grid sm:grid-cols-5 sm:items-center sm:gap-0"
              >
                <div className="col-span-2 flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-600">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">
                      {lead.name}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
                        {lead.source}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {lead.unit}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle[lead.status] ?? "bg-zinc-100 text-zinc-600"}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        lead.status === "Hot Lead"
                          ? "bg-rose-500"
                          : lead.status === "Warm Lead"
                            ? "bg-amber-500"
                            : "bg-blue-500"
                      }`}
                    />
                    {lead.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-500">{lead.lastConn}</p>
                <p className="text-right text-xs font-medium text-blue-600">
                  {lead.nextAction}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
