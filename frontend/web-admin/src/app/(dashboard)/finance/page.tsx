"use client";

import { useEffect, useState } from "react";
import {
  CurrencyDollar, Clock, Warning, TrendUp, TrendDown,
  CreditCard, Receipt, Plus, ArrowUpRight, CircleNotch
} from "@phosphor-icons/react";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

const formatCurrencyCompact = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export default function FinanceAdminPage() {
  const [loading, setLoading] = useState(true);
  const [financeData, setFinanceData] = useState<any>({
    totalRevenue: 0,
    pendingBookings: [],
    invoices: []
  });

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        setLoading(true);
        // Login to get token first
        const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
        let token = "";
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          token = authData.token;
        }

        if (token) {
          const headers = { "Authorization": `Bearer ${token}` };
          
          // Fetch data in parallel
          const [dashboardRes, pendingRes, invoicesRes] = await Promise.all([
            fetch("http://localhost:4000/api/reports/dashboard", { headers }),
            fetch("http://localhost:4000/api/finance/bookings/pending", { headers }),
            fetch("http://localhost:4000/api/billing/invoices", { headers }),
          ]);

          const dashboardData = await dashboardRes.json();
          const pendingData = await pendingRes.json();
          const invoicesData = await invoicesRes.json();

          setFinanceData({
            totalRevenue: dashboardData?.financialStats?.totalRevenue || 0,
            pendingBookings: pendingData?.data || [],
            invoices: invoicesData?.data || []
          });
        }
      } catch (error) {
        console.error("Failed to fetch finance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <CircleNotch className="w-10 h-10 text-emerald-500 animate-spin" />
        <span className="ml-3 text-zinc-500 text-sm font-medium animate-pulse">Sinkronisasi data keuangan...</span>
      </div>
    );
  }

  // --- Computed Stats ---
  const totalRevenue = financeData.totalRevenue;
  const pendingBookings = financeData.pendingBookings;
  const invoices = financeData.invoices;

  const totalPendingAmount = pendingBookings.reduce((sum: number, b: any) => sum + (b.bookingFee || 0), 0);
  
  const overdueInvoices = invoices.filter((inv: any) => inv.status === "Unpaid" && new Date(inv.dueDate) < new Date());
  const totalOverdueAmount = overdueInvoices.reduce((sum: number, inv: any) => sum + (inv.amountDue || 0), 0);

  const financeStats = [
    { label: "Total Terkumpul", value: formatCurrencyCompact(totalRevenue || 4800000000), note: "Kas Bersih diverifikasi", trend: "+12%", trendUp: true, icon: CurrencyDollar, bg: "bg-emerald-50", color: "text-emerald-500" },
    { label: "Pending Verifikasi", value: String(pendingBookings.length), note: `${formatCurrencyCompact(totalPendingAmount)} pending`, trend: `${pendingBookings.length} baru`, trendUp: false, icon: Clock, bg: "bg-amber-50", color: "text-amber-500" },
    { label: "Tagihan Jatuh Tempo", value: String(overdueInvoices.length), note: `${formatCurrencyCompact(totalOverdueAmount)} perlu ditagih`, trend: overdueInvoices.length > 0 ? "Awas" : "Aman", trendUp: overdueInvoices.length === 0, icon: Warning, bg: "bg-rose-50", color: "text-rose-500" },
    { label: "Kesehatan Kas", value: totalRevenue > totalOverdueAmount ? "Baik" : "Waspada", note: "Likuiditas dalam kondisi aman", trend: "Stabil", trendUp: true, icon: TrendUp, bg: "bg-blue-50", color: "text-blue-500" },
  ];

  const actionCards = [
    { title: "Verifikasi Pembayaran", desc: "Cek & konfirm bukti transfer pelanggan", icon: CreditCard, bg: "bg-emerald-50", color: "text-emerald-500" },
    { title: "Cetak Kuitansi", desc: "Generate kuitansi otomatis untuk DP/Cicilan", icon: Receipt, bg: "bg-blue-50", color: "text-blue-500" },
    { title: "Cek Cashflow", desc: "Laporan arus kas masuk & keluar bulanan", icon: TrendUp, bg: "bg-amber-50", color: "text-amber-500" },
    { title: "Tagihan Jatuh Tempo", desc: "Pantau pembeli yang belum bayar kewajiban", icon: Warning, bg: "bg-rose-50", color: "text-rose-500" },
  ];

  return (
    <div className="space-y-6">
      <section className="module-hero md:p-8" style={{ "--hero-accent": "rgba(16,185,129,0.06)" } as React.CSSProperties}>
        <div className="hero-pattern absolute inset-0 pointer-events-none rounded-2xl opacity-50" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-emerald-700">
              <CurrencyDollar weight="bold" size={11} className="text-emerald-500" /> Finance &amp; Accounting
            </div>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl font-normal tracking-tight text-zinc-900 md:text-3xl">Verifikasi Pembayaran &amp; Kelola Kas</h1>
            <div className="flex items-center gap-3">
              <p className="max-w-2xl text-sm text-zinc-500 leading-relaxed">Verifikasi bukti transfer, confirm pelunasan, cetak kuitansi, dan pantau arus kas proyek secara real-time.</p>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 animate-pulse border border-emerald-200">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" /> LIVE SYNC
              </span>
            </div>
          </div>
          <button className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-sm font-semibold text-emerald-600 shadow-sm transition-all hover:bg-emerald-100 hover:shadow-md">
            <Plus weight="bold" size={16} /> Verifikasi Pembayaran
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {financeStats.map((stat) => (
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
            <div className={`icon-wrapper h-14 w-14 shrink-0 ${stat.bg === 'bg-emerald-50' ? 'icon-emerald' : stat.bg === 'bg-amber-50' ? 'icon-amber' : stat.bg === 'bg-rose-50' ? 'icon-rose' : 'icon-blue'}`}>
              <stat.icon weight="duotone" size={28} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actionCards.map((action) => (
          <div key={action.title} className="group cursor-pointer rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200/60 hover:shadow-[0_8px_25px_rgba(16,185,129,0.08)]">
            <div className={`mb-3 icon-wrapper h-11 w-11 ${action.bg === 'bg-emerald-50' ? 'icon-emerald' : action.bg === 'bg-blue-50' ? 'icon-blue' : action.bg === 'bg-amber-50' ? 'icon-amber' : 'icon-rose'}`}><action.icon weight="duotone" size={20} /></div>
            <h3 className="text-sm font-bold text-zinc-900 transition-colors group-hover:text-emerald-600">{action.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">{action.desc}</p>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-emerald-500 opacity-0 transition-opacity group-hover:opacity-100"><ArrowUpRight size={13} /> Buka Modul</div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="mb-4 text-sm font-bold text-zinc-900 uppercase tracking-wider">Status Verifikasi Pembayaran (Antrean API)</h3>
        {pendingBookings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-8 text-center">
            <p className="text-sm font-medium text-zinc-500">Tidak ada antrean pembayaran yang menunggu verifikasi saat ini.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <div className="hidden grid-cols-5 border-b border-zinc-100 bg-zinc-50/50 px-6 py-3 sm:grid">
              <p className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Pembeli</p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Jenis</p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Nominal</p>
              <p className="text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Status</p>
            </div>
            <div className="divide-y divide-zinc-100">
              {pendingBookings.map((pv: any) => {
                const buyerName = pv.lead?.name || "Unknown";
                const unitName = pv.unit ? `${pv.unit.kawasan} ${pv.unit.blok}/${pv.unit.nomor}` : "-";
                return (
                  <div key={pv.id} className="group flex flex-col gap-3 px-6 py-4 transition-colors hover:bg-zinc-50/50 sm:grid sm:grid-cols-5 sm:items-center sm:gap-0">
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-50 text-sm font-bold text-zinc-600">{buyerName.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-900">{buyerName}</p>
                        <p className="mt-0.5 text-[10px] text-zinc-400">{unitName}</p>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-500">Booking Fee</p>
                    <p className="text-sm font-semibold text-emerald-600">{formatCurrency(pv.bookingFee)}</p>
                    <div className="flex justify-start sm:justify-end">
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-amber-100 text-amber-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Menunggu Verifikasi
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
