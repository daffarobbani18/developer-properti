"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Banknote,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Receipt,
  Sparkles,
  Plus,
} from "lucide-react";

const financeStats = [
  {
    label: "Total Terkumpul",
    value: "Rp 4,8 M",
    change: "+12% bulan lalu",
    icon: Banknote,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Pending Verifikasi",
    value: "8 transaksi",
    change: "Rp 850 juta",
    icon: Clock,
    color: "bg-amber-50 text-amber-600",
  },
  {
    label: "Tagihan Jatuh Tempo",
    value: "5 pembeli",
    change: "Rp 420 juta",
    icon: AlertTriangle,
    color: "bg-rose-50 text-rose-600",
  },
  {
    label: "Kesehatan Kas",
    value: "Baik",
    change: "Likuiditas aman",
    icon: TrendingUp,
    color: "bg-blue-50 text-blue-600",
  },
];

const paymentVerifications = [
  {
    buyer: "Budi Santoso",
    unit: "Astoria Type B",
    amount: "Rp 500 jt",
    type: "DP Pembayaran",
    status: "Menunggu Verifikasi",
    date: "Hari ini",
  },
  {
    buyer: "Siti Aminah",
    unit: "Bvlgari Type A",
    amount: "Rp 250 jt",
    type: "Cicilan KPR",
    status: "Proses Konfirmasi",
    date: "Kemarin",
  },
];

export default function FinanceAdminPage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-2xl md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.06),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.03),transparent_25%)]" />
        <div className="relative space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-slate-600">
                <Sparkles size={12} className="text-emerald-600" /> Finance & Accounting
              </div>
              <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-5xl font-semibold tracking-tight text-slate-900 leading-tight">
                Verifikasi Pembayaran & Kelola Kas
              </h1>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl">
                Verifikasi bukti transfer, confirm pelunasan, cetak kuitansi, dan pantau arus kas proyek secara real-time.
              </p>
            </div>
            <button className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs uppercase tracking-[0.2em] text-emerald-600 transition-colors hover:bg-emerald-100">
              <Plus size={14} /> Verifikasi Pembayaran
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {financeStats.map((stat) => (
          <Card
            key={stat.label}
            className="group cursor-pointer border border-slate-200 bg-white shadow-[0_5px_15px_rgba(0,0,0,0.05)] rounded-2xl transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)]"
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Verifikasi Pembayaran",
            desc: "Cek & konfirm bukti transfer pelanggan",
            icon: CreditCard,
            color: "bg-emerald-50 text-emerald-600",
          },
          {
            title: "Cetak Kuitansi",
            desc: "Generate kuitansi otomatis for DP/Cicilan",
            icon: Receipt,
            color: "bg-blue-50 text-blue-600",
          },
          {
            title: "Cek Cashflow",
            desc: "Laporan arus kas masuk & keluar bulanan",
            icon: TrendingUp,
            color: "bg-amber-50 text-amber-600",
          },
          {
            title: "Tagihan Jatuh Tempo",
            desc: "Pantau pembeli yang belum bayar kewajiban",
            icon: AlertTriangle,
            color: "bg-rose-50 text-rose-600",
          },
        ].map((action) => (
          <Card
            key={action.title}
            className="group cursor-pointer border border-slate-200 bg-white shadow-[0_5px_15px_rgba(0,0,0,0.05)] rounded-2xl transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)]"
          >
            <CardContent className="p-5 sm:p-6">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${action.color} mb-4 shadow-sm transition-all duration-200 group-hover:scale-105`}>
                <action.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                {action.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{action.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Verifications */}
      <div>
        <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold tracking-tight text-slate-900 mb-4">
          Status Verifikasi Pembayaran
        </h3>
        <div className="space-y-3">
          {paymentVerifications.map((pv) => (
            <Card key={pv.buyer + pv.unit} className="border border-slate-200 bg-white rounded-2xl">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 text-sm">{pv.buyer}</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                        {pv.unit}
                      </span>
                      <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                        {pv.type}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-emerald-600">{pv.amount}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <Badge className={`${
                      pv.status === "Menunggu Verifikasi"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    } border text-[10px] font-medium`}>
                      {pv.status}
                    </Badge>
                    <p className="mt-2 text-xs text-slate-500">{pv.date}</p>
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
