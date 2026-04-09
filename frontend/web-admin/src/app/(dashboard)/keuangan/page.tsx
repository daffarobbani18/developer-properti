"use client";

import Link from "next/link";
import {
  Wallet,
  ArrowUpDown,
  FileText,
  Receipt,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { Card } from "@/components/ui/card";
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
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Tagihan",
    description: "Daftar tagihan & piutang pembeli",
    icon: FileText,
    href: "/keuangan/tagihan",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Pengeluaran",
    description: "Catat & kelola pengeluaran operasional",
    icon: Receipt,
    href: "/keuangan/pengeluaran",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    title: "RAB & Realisasi",
    description: "Pantau anggaran vs realisasi biaya",
    icon: TrendingUp,
    href: "/keuangan/rab",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

export default function KeuanganPage() {
  const totalPiutang = getTotalByStatus(dummyTagihan, "belum_bayar");
  const totalTerlambat = getTotalByStatus(dummyTagihan, "terlambat");

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Keuangan
              </h1>
              <p className="text-sm text-slate-600">
                Kelola cashflow, tagihan, dan laporan keuangan
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="clean-glass">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">
                  Pemasukan Bulan Ini
                </span>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formatRupiah(laporanBulanan.totalPemasukan)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {laporanBulanan.periode}
              </p>
            </div>
          </Card>

          <Card className="clean-glass">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">
                  Pengeluaran Bulan Ini
                </span>
                <Receipt className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formatRupiah(laporanBulanan.totalPengeluaran)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {laporanBulanan.periode}
              </p>
            </div>
          </Card>

          <Card className="clean-glass">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">
                  Laba Kotor
                </span>
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formatRupiah(laporanBulanan.labaKotor)}
              </p>
              <p className="text-xs text-green-600 mt-1">
                +{((laporanBulanan.labaKotor / laporanBulanan.totalPemasukan) * 100).toFixed(1)}% margin
              </p>
            </div>
          </Card>

          <Card className="clean-glass">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">
                  Piutang Belum Bayar
                </span>
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formatRupiah(totalPiutang)}
              </p>
              <p className="text-xs text-red-600 mt-1">
                {totalTerlambat > 0 && `+${formatRupiah(totalTerlambat)} terlambat`}
              </p>
            </div>
          </Card>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Card className="clean-glass hover:shadow-md transition-all duration-200 h-full group cursor-pointer">
                  <div className="p-6">
                    <div
                      className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                    >
                      <Icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Info */}
        <Card className="clean-glass">
          <div className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">
              Ringkasan Keuangan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-slate-600 mb-1">Status Cashflow</p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <p className="text-lg font-semibold text-green-700">
                    Positif
                  </p>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Saldo bulan ini: {formatRupiah(laporanBulanan.labaKotor)}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-600 mb-1">Proyek Aktif</p>
                <p className="text-2xl font-bold text-slate-900">
                  {laporanBulanan.proyekAktif}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Semua proyek berjalan lancar
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-600 mb-1">
                  Total Tagihan Aktif
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {dummyTagihan.filter((t) => t.status !== "lunas").length}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {dummyTagihan.filter((t) => t.status === "terlambat").length}{" "}
                  terlambat, butuh tindak lanjut
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
