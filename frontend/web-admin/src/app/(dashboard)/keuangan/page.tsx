"use client";

import Link from "next/link";
import {
  Wallet,
  ArrowUpDown,
  FileText,
  Receipt,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
} from "lucide-react";
import {
  formatRupiah,
  laporanBulanan,
  dummyTagihan,
  getTotalByStatus,
} from "@/lib/keuangan-data";

const menuItems = [
  {
    title: "Cashflow",
    description: "Analisis arus kas pemasukan & pengeluaran",
    icon: ArrowUpDown,
    href: "/keuangan/cashflow",
    bg: "bg-blue-50",
    color: "text-blue-500",
  },
  {
    title: "Tagihan",
    description: "Daftar tagihan & piutang pembeli",
    icon: FileText,
    href: "/keuangan/tagihan",
    bg: "bg-emerald-50",
    color: "text-emerald-500",
  },
  {
    title: "Pengeluaran",
    description: "Catat & kelola pengeluaran operasional",
    icon: Receipt,
    href: "/keuangan/pengeluaran",
    bg: "bg-rose-50",
    color: "text-rose-500",
  },
  {
    title: "RAB & Realisasi",
    description: "Pantau anggaran vs realisasi biaya",
    icon: TrendingUp,
    href: "/keuangan/rab",
    bg: "bg-violet-50",
    color: "text-violet-500",
  },
];

export default function KeuanganPage() {
  const totalPiutang = getTotalByStatus(dummyTagihan, "belum_bayar");
  const totalTerlambat = getTotalByStatus(dummyTagihan, "terlambat");
  const marginPct = (
    (laporanBulanan.labaKotor / laporanBulanan.totalPemasukan) *
    100
  ).toFixed(1);
  const tagihanAktif = dummyTagihan.filter((t) => t.status !== "lunas").length;
  const tagihanTerlambat = dummyTagihan.filter(
    (t) => t.status === "terlambat"
  ).length;

  const summaryStats = [
    {
      label: "Pemasukan Bulan Ini",
      value: formatRupiah(laporanBulanan.totalPemasukan),
      note: laporanBulanan.periode,
      noteColor: "text-zinc-500",
      icon: TrendingUp,
      bg: "bg-emerald-50",
      color: "text-emerald-500",
    },
    {
      label: "Pengeluaran Bulan Ini",
      value: formatRupiah(laporanBulanan.totalPengeluaran),
      note: laporanBulanan.periode,
      noteColor: "text-zinc-500",
      icon: Receipt,
      bg: "bg-rose-50",
      color: "text-rose-500",
    },
    {
      label: "Laba Kotor",
      value: formatRupiah(laporanBulanan.labaKotor),
      note: `+${marginPct}% margin`,
      noteColor: "text-emerald-600",
      icon: DollarSign,
      bg: "bg-blue-50",
      color: "text-blue-500",
    },
    {
      label: "Piutang Belum Bayar",
      value: formatRupiah(totalPiutang),
      note:
        totalTerlambat > 0
          ? `+${formatRupiah(totalTerlambat)} terlambat`
          : "Semua lancar",
      noteColor: totalTerlambat > 0 ? "text-rose-600" : "text-emerald-600",
      icon: FileText,
      bg: "bg-amber-50",
      color: "text-amber-500",
    },
  ];

  const ringkasanItems = [
    {
      label: "Status Cashflow",
      value: "Positif",
      sub: `Saldo bulan ini: ${formatRupiah(laporanBulanan.labaKotor)}`,
      valueColor: "text-emerald-600",
      dot: "bg-emerald-500",
    },
    {
      label: "Proyek Aktif",
      value: String(laporanBulanan.proyekAktif),
      sub: "Semua proyek berjalan lancar",
      valueColor: "text-zinc-900",
      dot: null as string | null,
    },
    {
      label: "Total Tagihan Aktif",
      value: String(tagihanAktif),
      sub: `${tagihanTerlambat} terlambat, butuh tindak lanjut`,
      valueColor: tagihanTerlambat > 0 ? "text-rose-600" : "text-zinc-900",
      dot: null as string | null,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.06),transparent_40%)]" />
        <div className="relative space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-amber-700">
            <Wallet size={11} className="text-amber-500" /> Manajemen Keuangan
          </div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
            Keuangan & Laporan Keuangan
          </h1>
          <p className="max-w-2xl text-sm text-zinc-500 leading-relaxed">
            Kelola cashflow, tagihan, pengeluaran, dan pantau laporan keuangan
            proyek secara terpusat.
          </p>
        </div>
      </section>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map((stat) => (
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
            <p className="mt-2 text-xl font-bold text-zinc-900 leading-tight">
              {stat.value}
            </p>
            <p className={`mt-1 text-xs ${stat.noteColor}`}>{stat.note}</p>
          </div>
        ))}
      </div>

      {/* Module Menu */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-zinc-900">
          Modul Keuangan
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className="block">
              <div className="group flex h-full flex-col rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_8px_25px_rgba(245,158,11,0.12)]">
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${item.bg} transition-transform duration-300 group-hover:scale-105`}
                >
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <h3 className="text-sm font-bold text-zinc-900 transition-colors group-hover:text-amber-600">
                  {item.title}
                </h3>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-zinc-500">
                  {item.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-[11px] font-medium text-amber-500 opacity-0 transition-opacity group-hover:opacity-100">
                  <ArrowUpRight size={13} /> Buka Modul
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Ringkasan Panel */}
      <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-6 py-4">
          <h3 className="text-sm font-bold text-zinc-900">
            Ringkasan Keuangan
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-px bg-zinc-100 md:grid-cols-3">
          {ringkasanItems.map((item) => (
            <div key={item.label} className="bg-white p-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {item.label}
              </p>
              <div className="flex items-center gap-2">
                {item.dot && (
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${item.dot}`}
                  />
                )}
                <p className={`text-2xl font-bold ${item.valueColor}`}>
                  {item.value}
                </p>
              </div>
              <p className="mt-1 text-xs text-zinc-400">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
