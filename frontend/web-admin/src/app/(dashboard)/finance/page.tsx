"use client";

import {
  Banknote,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Clock,
  Receipt,
  Plus,
  ArrowUpRight,
} from "lucide-react";

const financeStats = [
  { label: "Total Terkumpul", value: "Rp 4,8 M", note: "+12% dari bulan lalu", icon: Banknote, bg: "bg-emerald-50", color: "text-emerald-500" },
  { label: "Pending Verifikasi", value: "8", note: "Rp 850 juta pending", icon: Clock, bg: "bg-amber-50", color: "text-amber-500" },
  { label: "Tagihan Jatuh Tempo", value: "5", note: "Rp 420 juta perlu ditagih", icon: AlertTriangle, bg: "bg-rose-50", color: "text-rose-500" },
  { label: "Kesehatan Kas", value: "Baik", note: "Likuiditas dalam kondisi aman", icon: TrendingUp, bg: "bg-blue-50", color: "text-blue-500" },
];

const paymentVerifications = [
  { buyer: "Budi Santoso", unit: "Astoria Type B", amount: "Rp 500 jt", type: "DP Pembayaran", status: "Menunggu Verifikasi" },
  { buyer: "Siti Aminah", unit: "Bvlgari Type A", amount: "Rp 250 jt", type: "Cicilan KPR", status: "Proses Konfirmasi" },
];

const actionCards = [
  { title: "Verifikasi Pembayaran", desc: "Cek & konfirm bukti transfer pelanggan", icon: CreditCard, bg: "bg-emerald-50", color: "text-emerald-500" },
  { title: "Cetak Kuitansi", desc: "Generate kuitansi otomatis untuk DP/Cicilan", icon: Receipt, bg: "bg-blue-50", color: "text-blue-500" },
  { title: "Cek Cashflow", desc: "Laporan arus kas masuk & keluar bulanan", icon: TrendingUp, bg: "bg-amber-50", color: "text-amber-500" },
  { title: "Tagihan Jatuh Tempo", desc: "Pantau pembeli yang belum bayar kewajiban", icon: AlertTriangle, bg: "bg-rose-50", color: "text-rose-500" },
];

const statusStyle: Record<string, { badge: string; dot: string }> = {
  "Menunggu Verifikasi": { badge: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  "Proses Konfirmasi": { badge: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
};

export default function FinanceAdminPage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.06),transparent_40%)]" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-emerald-700">
              <Banknote size={11} className="text-emerald-500" /> Finance & Accounting
            </div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">Verifikasi Pembayaran & Kelola Kas</h1>
            <p className="max-w-2xl text-sm text-zinc-500 leading-relaxed">Verifikasi bukti transfer, confirm pelunasan, cetak kuitansi, dan pantau arus kas proyek secara real-time.</p>
          </div>
          <button className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-sm font-semibold text-emerald-600 shadow-sm transition-all hover:bg-emerald-100 hover:shadow-md">
            <Plus size={16} /> Verifikasi Pembayaran
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {financeStats.map((stat) => (
          <div key={stat.label} className="group rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <div className="mb-4"><div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}><stat.icon className={`h-6 w-6 ${stat.color}`} /></div></div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-zinc-900">{stat.value}</p>
            <p className="mt-1 text-xs text-zinc-500">{stat.note}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actionCards.map((action) => (
          <div key={action.title} className="group cursor-pointer rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_8px_25px_rgba(245,158,11,0.12)]">
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${action.bg} transition-transform duration-300 group-hover:scale-105`}><action.icon className={`h-6 w-6 ${action.color}`} /></div>
            <h3 className="text-sm font-bold text-zinc-900 transition-colors group-hover:text-amber-600">{action.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">{action.desc}</p>
            <div className="mt-4 flex items-center gap-1 text-[11px] font-medium text-amber-500 opacity-0 transition-opacity group-hover:opacity-100"><ArrowUpRight size={13} /> Buka Modul</div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="mb-4 text-lg font-bold text-zinc-900">Status Verifikasi Pembayaran</h3>
        <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
          <div className="hidden grid-cols-5 border-b border-zinc-100 bg-zinc-50/50 px-6 py-3 sm:grid">
            <p className="col-span-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">Pembeli</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Jenis</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Nominal</p>
            <p className="text-right text-xs font-semibold uppercase tracking-wider text-zinc-400">Status</p>
          </div>
          <div className="divide-y divide-zinc-100">
            {paymentVerifications.map((pv) => {
              const style = statusStyle[pv.status] ?? { badge: "bg-zinc-100 text-zinc-600", dot: "bg-zinc-400" };
              return (
                <div key={pv.buyer} className="group flex flex-col gap-3 px-6 py-4 transition-colors hover:bg-zinc-50 sm:grid sm:grid-cols-5 sm:items-center sm:gap-0">
                  <div className="col-span-2 flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-600">{pv.buyer.charAt(0)}</div>
                    <div><p className="text-sm font-semibold text-zinc-900">{pv.buyer}</p><p className="mt-0.5 text-[10px] text-zinc-400">{pv.unit}</p></div>
                  </div>
                  <p className="text-xs text-zinc-500">{pv.type}</p>
                  <p className="text-sm font-semibold text-emerald-600">{pv.amount}</p>
                  <div className="flex justify-start sm:justify-end">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${style.badge}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />{pv.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
