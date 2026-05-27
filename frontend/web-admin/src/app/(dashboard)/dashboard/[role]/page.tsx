"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  TrendingUp,
  TrendingDown,
  Users,
  Banknote,
  Building2,
  HardHat,
  Scale,
  Activity,
  Clock,
  Phone,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { dummyAktivitas, dummyLeads, dummyTransaksi, dummyUnits } from "@/lib/crm-data";
import { dummyCashflow, dummyPengeluaran, dummyTagihan } from "@/lib/keuangan-data";
import { dummyKendala, dummyProyek, dummyUnit } from "@/lib/proyek-data";

type Role = "admin" | "inventory" | "sales" | "finance" | "legal" | "supervisor";

// ─── Computed data ───────────────────────────────────────────
const formatCurrencyCompact = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

const totalLeads = dummyLeads.length;
const newLeads = dummyLeads.filter((lead) => lead.status === "baru").length;
const leadsFollowUp = dummyLeads.filter((lead) => lead.status === "follow-up").length;
const leadsSurvey = dummyLeads.filter((lead) => lead.status === "survey").length;

const totalTransaksi = dummyTransaksi.length;
const totalNilaiTransaksi = dummyTransaksi.reduce((sum, trx) => sum + trx.nilaiTransaksi, 0);

const totalUnits = dummyUnits.length;
const bookedUnits = dummyUnits.filter((unit) => unit.status === "booked").length;
const soldUnits = dummyUnits.filter((unit) => unit.status === "terjual").length;

const latestCashflow = dummyCashflow[dummyCashflow.length - 1];
const pendingTagihan = dummyTagihan.filter((item) => item.status === "belum_bayar" || item.status === "terlambat").length;
const overdueTagihan = dummyTagihan.filter((item) => item.status === "terlambat").length;
const totalPengeluaran = dummyPengeluaran.reduce((sum, item) => sum + item.nominal, 0);

const totalProyek = dummyProyek.length;
const avgProgressProyek = Math.round(
  dummyProyek.reduce((sum, proyek) => sum + proyek.persentaseSelesai, 0) / Math.max(dummyProyek.length, 1)
);
const totalKendalaAktif = dummyKendala.filter((item) => item.status !== "selesai").length;
const totalUnitProyek = dummyUnit.length;

// ─── Chart data ──────────────────────────────────────────────
const cashflowChartData = dummyCashflow.map((item) => ({
  name: item.bulan.split("-")[1] === "09" ? "Sep" :
        item.bulan.split("-")[1] === "10" ? "Okt" :
        item.bulan.split("-")[1] === "11" ? "Nov" :
        item.bulan.split("-")[1] === "12" ? "Des" :
        item.bulan.split("-")[1] === "01" ? "Jan" :
        item.bulan.split("-")[1] === "02" ? "Feb" : item.bulan,
  Pemasukan: item.pemasukan / 1_000_000,
  Pengeluaran: item.pengeluaran / 1_000_000,
  Saldo: item.saldo / 1_000_000,
}));

const leadsChartData = [
  { name: "Sep", Leads: 14, Konversi: 3 },
  { name: "Okt", Leads: 18, Konversi: 5 },
  { name: "Nov", Leads: 22, Konversi: 4 },
  { name: "Des", Leads: 16, Konversi: 6 },
  { name: "Jan", Leads: 20, Konversi: 7 },
  { name: "Feb", Leads: totalLeads, Konversi: soldUnits },
];

const proyekChartData = [
  { name: "Sep", Progress: 25 },
  { name: "Okt", Progress: 32 },
  { name: "Nov", Progress: 40 },
  { name: "Des", Progress: 48 },
  { name: "Jan", Progress: 55 },
  { name: "Feb", Progress: avgProgressProyek },
];

// ─── Recent activity ─────────────────────────────────────────
const recentActivities = [
  { icon: Users, label: "Lead baru: Lia Permata", time: "2 menit lalu", color: "text-blue-500", bg: "bg-blue-50" },
  { icon: Banknote, label: "Verifikasi DP: Siti Nurhaliza — Rp 50jt", time: "15 menit lalu", color: "text-emerald-500", bg: "bg-emerald-50" },
  { icon: MapPin, label: "Site visit: Ahmad Fauzi — Blok B", time: "1 jam lalu", color: "text-violet-500", bg: "bg-violet-50" },
  { icon: AlertTriangle, label: "Kendala: Material terlambat Blok A", time: "2 jam lalu", color: "text-rose-500", bg: "bg-rose-50" },
  { icon: Phone, label: "Follow-up: Budi Santoso — call kembali", time: "3 jam lalu", color: "text-amber-500", bg: "bg-amber-50" },
];

// ─── Custom tooltip ──────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white px-4 py-3 shadow-lg">
      <p className="text-xs font-semibold text-zinc-500 mb-2">{label}</p>
      {payload.map((entry: any, idx: number) => (
        <div key={idx} className="flex items-center gap-2 text-sm">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-zinc-600">{entry.name}:</span>
          <span className="font-semibold text-zinc-900">
            {entry.name === "Progress" ? `${entry.value}%` : `${entry.value} ${entry.name === "Leads" || entry.name === "Konversi" ? "" : "jt"}`}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Snapshot data ───────────────────────────────────────────
const currencyShort = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", notation: "compact", maximumFractionDigits: 1 }).format(value);

const roleSnapshots: Record<Role, Array<{ title: string; items: Array<{ label: string; meta: string }> }>> = {
  admin: [
    { title: "Leads Perlu Follow-up", items: dummyLeads.slice(0, 3).map((lead) => ({ label: lead.nama, meta: `${lead.status} • ${lead.minatUnit}` })) },
    { title: "Transaksi Terkini", items: dummyTransaksi.slice(0, 3).map((trx) => ({ label: trx.namaPembeli, meta: `${trx.nomorUnit} • ${currencyShort(trx.nilaiTransaksi)}` })) },
  ],
  inventory: [
    { title: "Unit Terbaru", items: dummyUnits.slice(0, 4).map((unit) => ({ label: unit.nomorUnit, meta: `${unit.blok} • ${unit.tipe} • ${unit.status}` })) },
    { title: "Proyek Aktif", items: dummyProyek.map((proyek) => ({ label: proyek.nama, meta: `${proyek.persentaseSelesai}% selesai • ${proyek.lokasi}` })) },
  ],
  sales: [
    { title: "Hot Leads", items: dummyLeads.filter((lead) => lead.status !== "baru").slice(0, 4).map((lead) => ({ label: lead.nama, meta: `${lead.status} • PIC ${lead.salesPIC}` })) },
    { title: "Aktivitas Terbaru", items: dummyAktivitas.slice(0, 4).map((activity) => ({ label: activity.namaLead, meta: `${activity.tipe} • ${activity.tanggal}` })) },
  ],
  finance: [
    { title: "Tagihan Prioritas", items: dummyTagihan.slice(0, 4).map((tagihan) => ({ label: `${tagihan.customerNama} • ${tagihan.unit}`, meta: `${tagihan.status} • ${currencyShort(tagihan.nominal)}` })) },
    { title: "Pengeluaran Terbaru", items: dummyPengeluaran.slice(0, 4).map((item) => ({ label: item.keterangan, meta: `${item.kategori} • ${currencyShort(item.nominal)}` })) },
  ],
  legal: [
    { title: "Transaksi Perlu Dokumen", items: dummyTransaksi.slice(0, 4).map((trx) => ({ label: trx.namaPembeli, meta: `${trx.nomorUnit} • status ${trx.statusKPR}` })) },
    { title: "Kendala Legal Terkini", items: dummyKendala.slice(0, 4).map((item) => ({ label: item.judul, meta: `${item.status} • ${item.prioritas} • ${item.kategori}` })) },
  ],
  supervisor: [
    { title: "Kendala Lapangan", items: dummyKendala.slice(0, 4).map((item) => ({ label: item.judul, meta: `${item.status} • ${item.prioritas}` })) },
    { title: "Unit Progres Terendah", items: dummyUnit.slice(0, 4).map((unit) => ({ label: unit.nomorUnit, meta: `${unit.persentaseSelesai}% selesai • ${unit.status}` })) },
  ],
};

// ─── Role dashboard config ───────────────────────────────────
type StatItem = { label: string; value: string; note: string; trend?: string; trendUp?: boolean; icon: React.ElementType; iconBg: string; iconColor: string };

const ROLE_DASHBOARD: Record<Role, {
  title: string;
  subtitle: string;
  heroGradient: string;
  stats: StatItem[];
  quickLinks: Array<{ label: string; href: string; desc: string }>;
  chartType: "cashflow" | "leads" | "proyek";
}> = {
  admin: {
    title: "Dashboard Admin",
    subtitle: "Ringkasan operasional lintas divisi untuk keputusan cepat.",
    heroGradient: "from-amber-500/8 via-transparent to-transparent",
    stats: [
      { label: "Leads Aktif", value: String(totalLeads), note: `${newLeads} leads baru`, trend: "+18%", trendUp: true, icon: Users, iconBg: "bg-blue-50", iconColor: "text-blue-500" },
      { label: "Kas Bersih", value: formatCurrencyCompact(latestCashflow.saldo), note: `${latestCashflow.bulan}`, trend: "-5%", trendUp: false, icon: Banknote, iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
      { label: "Unit Terjual", value: String(soldUnits), note: `dari ${totalUnits} total`, trend: "+12%", trendUp: true, icon: Building2, iconBg: "bg-amber-50", iconColor: "text-amber-500" },
    ],
    quickLinks: [
      { label: "Ringkasan Internal", href: "#snapshot-data", desc: "Lihat snapshot lintas divisi" },
      { label: "Statistik Utama", href: "#dashboard-stats", desc: "Pantau metrik ringkas" },
      { label: "Aksi Cepat Admin", href: "#aksi-cepat", desc: "Akses panel admin" },
    ],
    chartType: "cashflow",
  },
  inventory: {
    title: "Dashboard Inventory",
    subtitle: "Kontrol data lahan, unit kavling, dan site plan.",
    heroGradient: "from-blue-500/8 via-transparent to-transparent",
    stats: [
      { label: "Proyek Aktif", value: String(totalProyek), note: "terdaftar", trend: "+2", trendUp: true, icon: Building2, iconBg: "bg-blue-50", iconColor: "text-blue-500" },
      { label: "Unit Terdaftar", value: String(totalUnits), note: `${bookedUnits} booked`, trend: "+5", trendUp: true, icon: MapPin, iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
      { label: "Progress", value: `${avgProgressProyek}%`, note: "rata-rata proyek", trend: "+8%", trendUp: true, icon: Activity, iconBg: "bg-amber-50", iconColor: "text-amber-500" },
    ],
    quickLinks: [
      { label: "Kelola Inventory", href: "/inventory", desc: "Update unit dan harga" },
      { label: "Monitoring Proyek", href: "/proyek", desc: "Sinkronisasi data unit" },
      { label: "Unit Proyek", href: "/proyek/PRJ001/unit", desc: "Detail progres unit" },
    ],
    chartType: "proyek",
  },
  sales: {
    title: "Dashboard Sales",
    subtitle: "Fokus ke leads, booking unit, dan jadwal site visit.",
    heroGradient: "from-emerald-500/8 via-transparent to-transparent",
    stats: [
      { label: "Leads Baru", value: String(newLeads), note: `dari ${totalLeads} total`, trend: "+24%", trendUp: true, icon: Users, iconBg: "bg-blue-50", iconColor: "text-blue-500" },
      { label: "Follow Up", value: String(leadsFollowUp), note: `${leadsSurvey} siap survey`, trend: "+3", trendUp: true, icon: Phone, iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
      { label: "Booking", value: String(bookedUnits), note: `${totalTransaksi} transaksi`, trend: "+2", trendUp: true, icon: MapPin, iconBg: "bg-amber-50", iconColor: "text-amber-500" },
    ],
    quickLinks: [
      { label: "Buka CRM", href: "/crm", desc: "Kelola calon pembeli" },
      { label: "Daftar Leads", href: "/crm/leads", desc: "Input & segmentasi" },
      { label: "Pipeline", href: "/crm/pipeline", desc: "Tahap penjualan" },
    ],
    chartType: "leads",
  },
  finance: {
    title: "Dashboard Finance",
    subtitle: "Verifikasi transaksi dan kontrol arus kas proyek.",
    heroGradient: "from-cyan-500/8 via-transparent to-transparent",
    stats: [
      { label: "Pending", value: String(pendingTagihan), note: "belum lunas", trend: "-2", trendUp: true, icon: Clock, iconBg: "bg-amber-50", iconColor: "text-amber-500" },
      { label: "Terlambat", value: String(overdueTagihan), note: "follow-up segera", trend: "+1", trendUp: false, icon: AlertTriangle, iconBg: "bg-rose-50", iconColor: "text-rose-500" },
      { label: "Kas Bersih", value: formatCurrencyCompact(latestCashflow.saldo), note: `bulan berjalan`, trend: "-5%", trendUp: false, icon: Banknote, iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
    ],
    quickLinks: [
      { label: "Buka Finance", href: "/finance", desc: "Verifikasi & kuitansi" },
      { label: "Cashflow", href: "/keuangan/cashflow", desc: "Arus kas" },
      { label: "Tagihan", href: "/keuangan/tagihan", desc: "Cicilan pembeli" },
    ],
    chartType: "cashflow",
  },
  legal: {
    title: "Dashboard Legal",
    subtitle: "Monitoring legalitas dokumen pelanggan dan proyek.",
    heroGradient: "from-violet-500/8 via-transparent to-transparent",
    stats: [
      { label: "Transaksi Proses", value: String(totalTransaksi), note: "proses legal", trend: "+2", trendUp: true, icon: Scale, iconBg: "bg-violet-50", iconColor: "text-violet-500" },
      { label: "Unit Terjual", value: String(soldUnits), note: "dokumen lanjutan", trend: "+1", trendUp: true, icon: Building2, iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
      { label: "Kendala", value: String(totalKendalaAktif), note: "belum selesai", trend: "-1", trendUp: true, icon: AlertTriangle, iconBg: "bg-amber-50", iconColor: "text-amber-500" },
    ],
    quickLinks: [
      { label: "Buka Legal", href: "/legal", desc: "Dokumen legal" },
      { label: "Proyek", href: "/proyek", desc: "Status unit" },
      { label: "Unit Proyek", href: "/proyek/PRJ001/unit", desc: "Follow-up legal" },
    ],
    chartType: "proyek",
  },
  supervisor: {
    title: "Dashboard Pengawas",
    subtitle: "Pantau progres pembangunan fisik dan kendala lapangan.",
    heroGradient: "from-rose-500/8 via-transparent to-transparent",
    stats: [
      { label: "Progress", value: `${avgProgressProyek}%`, note: "konstruksi aktif", trend: "+8%", trendUp: true, icon: HardHat, iconBg: "bg-amber-50", iconColor: "text-amber-500" },
      { label: "Kendala", value: String(totalKendalaAktif), note: "tindakan lapangan", trend: "+1", trendUp: false, icon: AlertTriangle, iconBg: "bg-rose-50", iconColor: "text-rose-500" },
      { label: "Unit", value: String(totalUnitProyek), note: `${totalProyek} proyek`, trend: "+3", trendUp: true, icon: Building2, iconBg: "bg-blue-50", iconColor: "text-blue-500" },
    ],
    quickLinks: [
      { label: "Supervisor", href: "/supervisor", desc: "Laporan lapangan" },
      { label: "Proyek", href: "/proyek", desc: "Milestone proyek" },
      { label: "Unit", href: "/proyek/PRJ001/unit", desc: "Status unit" },
    ],
    chartType: "proyek",
  },
};




export default function RoleDashboardPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = use(params);

  if (!(role in ROLE_DASHBOARD)) {
    notFound();
  }

  const dashboard = ROLE_DASHBOARD[role as Role];
  const chartData = dashboard.chartType === "cashflow" ? cashflowChartData :
                     dashboard.chartType === "leads" ? leadsChartData : proyekChartData;

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="module-hero md:p-8" style={{ "--hero-accent": dashboard.heroGradient.includes("amber") ? "rgba(245,158,11,0.06)" : dashboard.heroGradient.includes("emerald") ? "rgba(16,185,129,0.06)" : dashboard.heroGradient.includes("blue") ? "rgba(59,130,246,0.06)" : dashboard.heroGradient.includes("cyan") ? "rgba(6,182,212,0.06)" : dashboard.heroGradient.includes("violet") ? "rgba(139,92,246,0.06)" : "rgba(244,63,94,0.06)" } as React.CSSProperties}>
        <div className="hero-pattern absolute inset-0 pointer-events-none rounded-2xl opacity-50" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="font-[family-name:var(--font-heading)] text-2xl font-normal tracking-tight text-zinc-900 md:text-3xl">
              {dashboard.title}
            </h1>
            <p className="max-w-2xl text-sm text-zinc-500 leading-relaxed">{dashboard.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Stat Cards */}
      <div id="dashboard-stats" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {dashboard.stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="stat-card group">
              <div className="mb-4 flex items-start justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg}`}>
                  <Icon size={20} className={stat.iconColor} />
                </div>
                {stat.trend && (
                  <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${stat.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {stat.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {stat.trend}
                  </div>
                )}
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{stat.label}</p>
              <p className="mt-1.5 text-2xl font-bold text-zinc-900">{stat.value}</p>
              <p className="mt-1 text-xs text-zinc-500">{stat.note}</p>
            </div>
          );
        })}
      </div>

      {/* Chart + Activity Feed */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_1fr]">
        {/* Area Chart */}
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">
                {dashboard.chartType === "cashflow" ? "Tren Arus Kas" :
                 dashboard.chartType === "leads" ? "Tren Leads & Konversi" : "Tren Progress Proyek"}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">6 bulan terakhir</p>
            </div>
            <div className="flex items-center gap-3">
              {dashboard.chartType === "cashflow" ? (
                <>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500"><div className="h-2 w-2 rounded-full bg-amber-400" />Pemasukan</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500"><div className="h-2 w-2 rounded-full bg-blue-400" />Pengeluaran</div>
                </>
              ) : dashboard.chartType === "leads" ? (
                <>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500"><div className="h-2 w-2 rounded-full bg-blue-400" />Leads</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500"><div className="h-2 w-2 rounded-full bg-emerald-400" />Konversi</div>
                </>
              ) : (
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-500"><div className="h-2 w-2 rounded-full bg-amber-400" />Progress</div>
              )}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {dashboard.chartType === "cashflow" ? (
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradPemasukan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradPengeluaran" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#a1a1aa" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#a1a1aa" }} tickFormatter={(v) => `${v}jt`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="Pemasukan" stroke="#f59e0b" strokeWidth={2} fill="url(#gradPemasukan)" />
                  <Area type="monotone" dataKey="Pengeluaran" stroke="#3b82f6" strokeWidth={2} fill="url(#gradPengeluaran)" />
                </AreaChart>
              ) : dashboard.chartType === "leads" ? (
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradKonversi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#a1a1aa" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#a1a1aa" }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="Leads" stroke="#3b82f6" strokeWidth={2} fill="url(#gradLeads)" />
                  <Area type="monotone" dataKey="Konversi" stroke="#10b981" strokeWidth={2} fill="url(#gradKonversi)" />
                </AreaChart>
              ) : (
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradProgress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#a1a1aa" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#a1a1aa" }} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="Progress" stroke="#f59e0b" strokeWidth={2.5} fill="url(#gradProgress)" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm">
          <div className="border-b border-zinc-100 px-6 py-4">
            <h3 className="text-sm font-bold text-zinc-900">Aktivitas Terbaru</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Update real-time lintas modul</p>
          </div>
          <div className="divide-y divide-zinc-50">
            {recentActivities.map((act, idx) => {
              const ActIcon = act.icon;
              return (
                <div key={idx} className="flex items-start gap-3.5 px-6 py-3.5 transition-colors hover:bg-zinc-50/50" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${act.bg}`}>
                    <ActIcon size={14} className={act.color} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-zinc-700 leading-snug">{act.label}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{act.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Aksi Cepat */}
      <div id="aksi-cepat">
        <h2 className="mb-4 text-sm font-bold text-zinc-900 uppercase tracking-wider">Aksi Cepat</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {dashboard.quickLinks.map((item) => (
            <Link key={item.href + item.label} href={item.href}>
              <div className="group flex h-full flex-col rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200/60 hover:shadow-[0_8px_25px_rgba(245,158,11,0.08)]">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-100 bg-zinc-50 transition-colors group-hover:border-amber-200 group-hover:bg-amber-50">
                  <ArrowUpRight className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-amber-500" />
                </div>
                <p className="text-sm font-semibold text-zinc-900 transition-colors group-hover:text-amber-600">{item.label}</p>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-zinc-500">{item.desc}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-amber-200/60 bg-amber-50/60 px-2.5 py-1 text-[10px] font-medium text-amber-600 transition-colors group-hover:bg-amber-100 w-fit">
                  <BadgeCheck className="h-3 w-3" /> Buka Modul
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Snapshot Data */}
      <div id="snapshot-data">
        <h2 className="mb-4 text-sm font-bold text-zinc-900 uppercase tracking-wider">Snapshot Data</h2>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {roleSnapshots[role as Role].map((section) => (
            <div key={section.title} className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
              <div className="border-b border-zinc-100 px-6 py-3.5">
                <h3 className="text-sm font-bold text-zinc-900">{section.title}</h3>
              </div>
              <div className="divide-y divide-zinc-50 p-2">
                {section.items.map((item) => (
                  <div key={item.label} className="group flex items-start justify-between gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-zinc-50">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-800">{item.label}</p>
                      <p className="mt-0.5 truncate text-xs text-zinc-400">{item.meta}</p>
                    </div>
                    <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-zinc-300 transition-colors group-hover:text-amber-500" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
