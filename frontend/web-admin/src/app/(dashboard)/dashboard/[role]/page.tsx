"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useEffect, useState } from "react";
import {
  ArrowUpRight,
  SealCheck,
  TrendUp,
  TrendDown,
  UsersThree,
  CurrencyDollar,
  Buildings,
  HardHat,
  Scales,
  Pulse,
  Clock,
  Phone,
  MapPin,
  Warning,
  CircleNotch
} from "@phosphor-icons/react";
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

const formatCurrencyCompact = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

const currencyShort = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", notation: "compact", maximumFractionDigits: 1 }).format(value);

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

export default function RoleDashboardPage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = use(params);
  
  if (!["admin", "inventory", "sales", "finance", "legal", "supervisor"].includes(role)) {
    notFound();
  }

  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Login to get token first (as per dummy flow)
        const loginRes = await fetch("http://localhost:4000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "superadmin@erp.com", password: "password123" })
        });
        const loginData = await loginRes.json();
        
        if (loginData.token) {
          const res = await fetch("http://localhost:4000/api/reports/dashboard", {
            headers: { "Authorization": `Bearer ${loginData.token}` }
          });
          const data = await res.json();
          setReportData(data);
        }
      } catch (error) {
        console.error("Failed to fetch report data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <CircleNotch className="w-10 h-10 text-amber-500 animate-spin" />
        <span className="ml-3 text-zinc-500 text-sm font-medium animate-pulse">Mengambil data live dari server...</span>
      </div>
    );
  }

  // --- Map Real Data to Computed Variables ---
  const inventoryStats = reportData?.inventoryStats || {};
  const totalUnits = (inventoryStats.Tersedia || 0) + (inventoryStats.Booked || 0) + (inventoryStats.Terjual || 0) + (inventoryStats.Diserahterimakan || 0);
  const soldUnits = (inventoryStats.Terjual || 0) + (inventoryStats.Diserahterimakan || 0);
  const bookedUnits = inventoryStats.Booked || 0;
  
  const totalRevenue = reportData?.financialStats?.totalRevenue || 0;
  
  // Real sales performance vs dummy fallback
  const salesPerformance = reportData?.salesPerformance || [];
  let leadsChartData = [
    { name: "Sep", Leads: 14, Konversi: 3 },
    { name: "Okt", Leads: 18, Konversi: 5 },
    { name: "Nov", Leads: 22, Konversi: 4 },
    { name: "Des", Leads: 16, Konversi: 6 },
    { name: "Jan", Leads: 20, Konversi: 7 },
    { name: "Feb", Leads: dummyLeads.length, Konversi: soldUnits },
  ];
  
  if (salesPerformance.length > 0) {
    leadsChartData = salesPerformance.slice(-6).map((sp: any) => {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
      const [year, month] = sp.month.split('-');
      return {
        name: monthNames[parseInt(month) - 1] || sp.month,
        Leads: Math.max(10, sp.totalApproved * 3), // Mock leads calculation
        Konversi: sp.totalApproved
      };
    });
  }

  // Fallback for others
  const totalLeads = dummyLeads.length;
  const newLeads = dummyLeads.filter((lead) => lead.status === "baru").length;
  const leadsFollowUp = dummyLeads.filter((lead) => lead.status === "follow-up").length;
  const leadsSurvey = dummyLeads.filter((lead) => lead.status === "survey").length;
  const totalTransaksi = dummyTransaksi.length;
  const latestCashflow = dummyCashflow[dummyCashflow.length - 1] || { saldo: 0 };
  const pendingTagihan = dummyTagihan.filter((item) => item.status === "belum_bayar" || item.status === "terlambat").length;
  const overdueTagihan = dummyTagihan.filter((item) => item.status === "terlambat").length;
  const totalPengeluaran = dummyPengeluaran.reduce((sum, item) => sum + item.nominal, 0);
  const totalProyek = dummyProyek.length;
  const avgProgressProyek = Math.round(dummyProyek.reduce((sum, proyek) => sum + proyek.persentaseSelesai, 0) / Math.max(dummyProyek.length, 1));
  const totalKendalaAktif = dummyKendala.filter((item) => item.status !== "selesai").length;
  const totalUnitProyek = dummyUnit.length;

  const cashflowChartData = dummyCashflow.map((item) => ({
    name: item.bulan.split("-")[1] === "09" ? "Sep" : item.bulan.split("-")[1] === "10" ? "Okt" : item.bulan.split("-")[1] === "11" ? "Nov" : item.bulan.split("-")[1] === "12" ? "Des" : item.bulan.split("-")[1] === "01" ? "Jan" : item.bulan.split("-")[1] === "02" ? "Feb" : item.bulan,
    Pemasukan: item.pemasukan / 1_000_000,
    Pengeluaran: item.pengeluaran / 1_000_000,
    Saldo: item.saldo / 1_000_000,
  }));
  if (cashflowChartData.length > 0) {
    cashflowChartData[cashflowChartData.length - 1].Pemasukan = (totalRevenue / 1_000_000) || cashflowChartData[cashflowChartData.length - 1].Pemasukan;
    cashflowChartData[cashflowChartData.length - 1].Saldo = cashflowChartData[cashflowChartData.length - 1].Pemasukan - cashflowChartData[cashflowChartData.length - 1].Pengeluaran;
  }

  const proyekChartData = [
    { name: "Sep", Progress: 25 },
    { name: "Okt", Progress: 32 },
    { name: "Nov", Progress: 40 },
    { name: "Des", Progress: 48 },
    { name: "Jan", Progress: 55 },
    { name: "Feb", Progress: avgProgressProyek },
  ];

  const recentActivities = [
    { icon: UsersThree, label: "Lead baru: Lia Permata", time: "2 menit lalu", color: "text-blue-500", bg: "bg-blue-50" },
    { icon: CurrencyDollar, label: "Verifikasi DP: Siti Nurhaliza — Rp 50jt", time: "15 menit lalu", color: "text-emerald-500", bg: "bg-emerald-50" },
    { icon: MapPin, label: "Site visit: Ahmad Fauzi — Blok B", time: "1 jam lalu", color: "text-violet-500", bg: "bg-violet-50" },
    { icon: Warning, label: "Kendala: Material terlambat Blok A", time: "2 jam lalu", color: "text-rose-500", bg: "bg-rose-50" },
    { icon: Phone, label: "Follow-up: Budi Santoso — call kembali", time: "3 jam lalu", color: "text-amber-500", bg: "bg-amber-50" },
  ];

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
      { title: "Aktivitas Terbaru", items: dummyAktivitas.slice(0, 4).map((Pulse) => ({ label: Pulse.namaLead, meta: `${Pulse.tipe} • ${Pulse.tanggal}` })) },
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

  const ROLE_DASHBOARD: Record<Role, any> = {
    admin: {
      title: "Dashboard Admin", subtitle: "Ringkasan operasional lintas divisi.",
      heroGradient: "from-amber-500/8 via-transparent to-transparent", chartType: "cashflow",
      stats: [
        { label: "Leads Aktif", value: String(totalLeads), note: `${newLeads} leads baru`, trend: "+18%", trendUp: true, icon: UsersThree, iconBg: "bg-blue-50", iconColor: "text-blue-500" },
        { label: "Total Pendapatan", value: totalRevenue > 0 ? formatCurrencyCompact(totalRevenue) : formatCurrencyCompact(latestCashflow.saldo), note: "Verified Payments", trend: "+5%", trendUp: true, icon: CurrencyDollar, iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
        { label: "Unit Terjual", value: String(soldUnits), note: `dari ${totalUnits || dummyUnits.length} total`, trend: "+12%", trendUp: true, icon: Buildings, iconBg: "bg-amber-50", iconColor: "text-amber-500" },
      ],
      quickLinks: [
        { label: "Ringkasan Internal", href: "#snapshot-data", desc: "Lihat snapshot lintas divisi" },
        { label: "Statistik Utama", href: "#dashboard-stats", desc: "Pantau metrik ringkas" },
        { label: "Aksi Cepat Admin", href: "#aksi-cepat", desc: "Akses panel admin" },
      ],
    },
    inventory: {
      title: "Dashboard Inventory", subtitle: "Kontrol data lahan dan unit kavling.",
      heroGradient: "from-blue-500/8 via-transparent to-transparent", chartType: "proyek",
      stats: [
        { label: "Proyek Aktif", value: String(totalProyek), note: "terdaftar", trend: "+2", trendUp: true, icon: Buildings, iconBg: "bg-blue-50", iconColor: "text-blue-500" },
        { label: "Unit Terdaftar", value: String(totalUnits || dummyUnits.length), note: `${bookedUnits} booked`, trend: "+5", trendUp: true, icon: MapPin, iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
        { label: "Progress", value: `${avgProgressProyek}%`, note: "rata-rata proyek", trend: "+8%", trendUp: true, icon: Pulse, iconBg: "bg-amber-50", iconColor: "text-amber-500" },
      ],
      quickLinks: [
        { label: "Kelola Inventory", href: "/inventory", desc: "Update unit dan harga" },
        { label: "Monitoring Proyek", href: "/proyek", desc: "Sinkronisasi data unit" },
        { label: "Unit Proyek", href: "/proyek/PRJ001/unit", desc: "Detail progres unit" },
      ],
    },
    sales: {
      title: "Dashboard Sales", subtitle: "Fokus ke leads, booking unit.",
      heroGradient: "from-emerald-500/8 via-transparent to-transparent", chartType: "leads",
      stats: [
        { label: "Leads Baru", value: String(newLeads), note: `dari ${totalLeads} total`, trend: "+24%", trendUp: true, icon: UsersThree, iconBg: "bg-blue-50", iconColor: "text-blue-500" },
        { label: "Follow Up", value: String(leadsFollowUp), note: `${leadsSurvey} siap survey`, trend: "+3", trendUp: true, icon: Phone, iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
        { label: "Booking", value: String(bookedUnits), note: `${totalTransaksi} transaksi`, trend: "+2", trendUp: true, icon: MapPin, iconBg: "bg-amber-50", iconColor: "text-amber-500" },
      ],
      quickLinks: [
        { label: "Buka CRM", href: "/crm", desc: "Kelola calon pembeli" },
        { label: "Daftar Leads", href: "/crm/leads", desc: "Input & segmentasi" },
        { label: "Pipeline", href: "/crm/pipeline", desc: "Tahap penjualan" },
      ],
    },
    finance: {
      title: "Dashboard Finance", subtitle: "Verifikasi transaksi dan arus kas.",
      heroGradient: "from-cyan-500/8 via-transparent to-transparent", chartType: "cashflow",
      stats: [
        { label: "Pending", value: String(pendingTagihan), note: "belum lunas", trend: "-2", trendUp: true, icon: Clock, iconBg: "bg-amber-50", iconColor: "text-amber-500" },
        { label: "Terlambat", value: String(overdueTagihan), note: "follow-up segera", trend: "+1", trendUp: false, icon: Warning, iconBg: "bg-rose-50", iconColor: "text-rose-500" },
        { label: "Kas Bersih", value: totalRevenue > 0 ? formatCurrencyCompact(totalRevenue) : formatCurrencyCompact(latestCashflow.saldo), note: `bulan berjalan`, trend: "-5%", trendUp: false, icon: CurrencyDollar, iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
      ],
      quickLinks: [
        { label: "Buka Finance", href: "/finance", desc: "Verifikasi & kuitansi" },
        { label: "Cashflow", href: "/keuangan/cashflow", desc: "Arus kas" },
        { label: "Tagihan", href: "/keuangan/tagihan", desc: "Cicilan pembeli" },
      ],
    },
    legal: {
      title: "Dashboard Legal", subtitle: "Monitoring legalitas dokumen pelanggan.",
      heroGradient: "from-violet-500/8 via-transparent to-transparent", chartType: "proyek",
      stats: [
        { label: "Transaksi Proses", value: String(totalTransaksi), note: "proses legal", trend: "+2", trendUp: true, icon: Scales, iconBg: "bg-violet-50", iconColor: "text-violet-500" },
        { label: "Unit Terjual", value: String(soldUnits), note: "dokumen lanjutan", trend: "+1", trendUp: true, icon: Buildings, iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
        { label: "Kendala", value: String(totalKendalaAktif), note: "belum selesai", trend: "-1", trendUp: true, icon: Warning, iconBg: "bg-amber-50", iconColor: "text-amber-500" },
      ],
      quickLinks: [
        { label: "Buka Legal", href: "/legal", desc: "Dokumen legal" },
        { label: "Proyek", href: "/proyek", desc: "Status unit" },
        { label: "Unit Proyek", href: "/proyek/PRJ001/unit", desc: "Follow-up legal" },
      ],
    },
    supervisor: {
      title: "Dashboard Pengawas", subtitle: "Pantau progres pembangunan fisik.",
      heroGradient: "from-rose-500/8 via-transparent to-transparent", chartType: "proyek",
      stats: [
        { label: "Progress", value: `${avgProgressProyek}%`, note: "konstruksi aktif", trend: "+8%", trendUp: true, icon: HardHat, iconBg: "bg-amber-50", iconColor: "text-amber-500" },
        { label: "Kendala", value: String(totalKendalaAktif), note: "tindakan lapangan", trend: "+1", trendUp: false, icon: Warning, iconBg: "bg-rose-50", iconColor: "text-rose-500" },
        { label: "Unit", value: String(totalUnitProyek), note: `${totalProyek} proyek`, trend: "+3", trendUp: true, icon: Buildings, iconBg: "bg-blue-50", iconColor: "text-blue-500" },
      ],
      quickLinks: [
        { label: "Supervisor", href: "/supervisor", desc: "Laporan lapangan" },
        { label: "Proyek", href: "/proyek", desc: "Milestone proyek" },
        { label: "Unit", href: "/proyek/PRJ001/unit", desc: "Status unit" },
      ],
    },
  };

  const dashboard = ROLE_DASHBOARD[role as Role];
  const chartData = dashboard.chartType === "cashflow" ? cashflowChartData : dashboard.chartType === "leads" ? leadsChartData : proyekChartData;

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
            <div className="flex items-center gap-3">
              <p className="text-sm text-zinc-500 leading-relaxed">{dashboard.subtitle}</p>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 animate-pulse border border-emerald-200">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-ping absolute opacity-75" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 relative" />
                LIVE SYNC
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stat Cards */}
      <div id="dashboard-stats" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {dashboard.stats.map((stat: any) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="stat-card group flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-600 truncate">{stat.label}</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-zinc-900 tracking-tight">{stat.value}</h3>
                  {stat.trend && (
                    <div className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${stat.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {stat.trendUp ? <TrendUp weight="bold" /> : <TrendDown weight="bold" />}
                      {stat.trend}
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-zinc-500 truncate">{stat.note}</p>
              </div>
              <div className={`icon-wrapper h-14 w-14 shrink-0 ${stat.iconBg === 'bg-blue-50' ? 'icon-blue' : stat.iconBg === 'bg-emerald-50' ? 'icon-emerald' : stat.iconBg === 'bg-amber-50' ? 'icon-amber' : stat.iconBg === 'bg-rose-50' ? 'icon-rose' : stat.iconBg === 'bg-violet-50' ? 'icon-violet' : 'icon-amber'}`}>
                <Icon weight="duotone" size={28} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart + Pulse Feed */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">
                {dashboard.chartType === "cashflow" ? "Tren Arus Kas" :
                 dashboard.chartType === "leads" ? "Tren Leads & Konversi" : "Tren Progress Proyek"}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">Berdasarkan data operasional terbaru</p>
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
                  <div className={`mt-0.5 icon-wrapper h-8 w-8 shrink-0 ${act.bg === 'bg-blue-50' ? 'icon-blue' : act.bg === 'bg-emerald-50' ? 'icon-emerald' : act.bg === 'bg-violet-50' ? 'icon-violet' : act.bg === 'bg-rose-50' ? 'icon-rose' : 'icon-amber'}`}>
                    <ActIcon weight="duotone" size={15} />
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
          {dashboard.quickLinks.map((item: any) => (
            <Link key={item.href + item.label} href={item.href}>
              <div className="group flex h-full flex-col rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200/60 hover:shadow-[0_8px_25px_rgba(245,158,11,0.08)]">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-100 bg-zinc-50 transition-colors group-hover:border-amber-200 group-hover:bg-amber-50">
                  <ArrowUpRight className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-amber-500" />
                </div>
                <p className="text-sm font-semibold text-zinc-900 transition-colors group-hover:text-amber-600">{item.label}</p>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-zinc-500">{item.desc}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-amber-200/60 bg-amber-50/60 px-2.5 py-1 text-[10px] font-medium text-amber-600 transition-colors group-hover:bg-amber-100 w-fit">
                  <SealCheck weight="duotone" className="h-3.5 w-3.5" /> Buka Modul
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
