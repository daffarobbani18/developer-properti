"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Phone,
  MapPin,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Sparkles,
} from "lucide-react";

const salesStats = [
  {
    label: "Leads Bulan Ini",
    value: "24",
    change: "+8 hari ini",
    icon: Users,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Follow-up Hari Ini",
    value: "12",
    change: "6 selesai",
    icon: Phone,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Unit Booking",
    value: "8",
    change: "dari 60 total",
    icon: MapPin,
    color: "bg-amber-50 text-amber-600",
  },
  {
    label: "Target Penjualan",
    value: "Rp 2,4 M",
    change: "40% terkumpul",
    icon: DollarSign,
    color: "bg-rose-50 text-rose-600",
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

export default function SalesAdminPage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-2xl md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.06),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.03),transparent_25%)]" />
        <div className="relative space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-slate-600">
                <Sparkles size={12} className="text-blue-600" /> Sales & Marketing
              </div>
              <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-5xl font-semibold tracking-tight text-slate-900 leading-tight">
                Pipeline Penjualan & Manajemen Leads
              </h1>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl">
                Kelola leads dari Website Marketing, booking unit, tracking site visit, dan progress menuju transaksi.
              </p>
            </div>
            <button className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs uppercase tracking-[0.2em] text-blue-600 transition-colors hover:bg-blue-100">
              <Plus size={14} /> Input Lead
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {salesStats.map((stat) => (
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

      {/* Action Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            title: "Input Lead Baru",
            desc: "Dari Website, WhatsApp, atau Walk-in",
            icon: Users,
            color: "bg-blue-50 text-blue-600",
          },
          {
            title: "Manage Site Visit",
            desc: "Jadwalkan kunjungan lokasi pelanggan",
            icon: MapPin,
            color: "bg-emerald-50 text-emerald-600",
          },
          {
            title: "Booking & SPK",
            desc: "Kunci unit dan buat surat perintah kerja",
            icon: CheckCircle2,
            color: "bg-amber-50 text-amber-600",
          },
        ].map((action) => (
          <Card
            key={action.title}
            className="group cursor-pointer border border-slate-200 bg-white shadow-[0_5px_15px_rgba(0,0,0,0.05)] rounded-2xl transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)]"
          >
            <CardContent className="p-5 sm:p-6">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${action.color} mb-4 shadow-sm transition-all duration-200 group-hover:scale-105`}>
                <action.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                {action.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{action.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Hot Leads */}
      <div>
        <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold tracking-tight text-slate-900 mb-4">
          Leads Panas & Follow-up
        </h3>
        <div className="space-y-3">
          {leadsData.map((lead) => (
            <Card key={lead.name} className="border border-slate-200 bg-white rounded-2xl">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 text-sm">{lead.name}</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                        {lead.source}
                      </span>
                      <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                        {lead.unit}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">Kontak terakhir: {lead.lastConn}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <Badge className={`${
                      lead.status === "Hot Lead"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : lead.status === "Warm Lead"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    } border hover:bg-opacity-80 text-[10px] font-medium`}>
                      {lead.status}
                    </Badge>
                    <p className="mt-2 text-xs font-medium text-blue-600">{lead.nextAction}</p>
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
