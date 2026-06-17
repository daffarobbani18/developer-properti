"use client";

import { useState, useEffect } from "react";
import { 
  ChartLineUp, 
  Wallet, 
  CalendarBlank, 
  Money, 
  Bank, 
  ChartPieSlice, 
  ArrowCircleDown, 
  ArrowCircleUp,
  Pulse
} from "@phosphor-icons/react";

export default function CashflowPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
      let token = "";
      if (authDataStr) {
        const authData = JSON.parse(authDataStr);
        token = authData.token;
      }
      
      const res = await fetch("http://localhost:4000/api/reports/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      
      if (res.ok && data.data?.financialStats) {
        setStats(data.data.financialStats);
      }
    } catch (e) {
      console.error("Failed to fetch cashflow stats", e);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  // Nilai default jika data belum ada
  const totalRevenue = stats?.totalRevenue || 0;
  const totalExpense = stats?.totalExpense || 0;
  const cashflow = stats?.cashflow || 0;
  const outstandingInvoices = stats?.outstandingInvoices || 0;
  const piutangKpr = stats?.piutangKpr || 0;

  return (
    <div className="space-y-8 pb-10">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="mb-2 text-3xl font-[family-name:var(--font-heading)] text-zinc-900 flex items-center gap-3 tracking-tight">
            <ChartLineUp className="text-emerald-500" weight="duotone" size={32} />
            Arus Kas (Cashflow)
          </h2>
          <p className="text-sm text-zinc-500">
            Pantau pergerakan uang masuk (pemasukan) dan uang keluar (pengeluaran) perusahaan.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-bold text-zinc-700 shadow-sm transition-all hover:bg-zinc-50">
            <CalendarBlank weight="bold" size={16} /> Bulan Ini
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Pulse className="animate-spin text-zinc-300" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* TOTAL PENDAPATAN */}
          <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.6)]">
              <Money weight="fill" size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Total Pendapatan</p>
              <p className="text-2xl font-black text-zinc-900 mt-1">Rp {totalRevenue.toLocaleString("id-ID")}</p>
            </div>
          </div>

          {/* TOTAL PENGELUARAN */}
          <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.6)]">
              <Bank weight="fill" size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Total Pengeluaran</p>
              <p className="text-2xl font-black text-zinc-900 mt-1">Rp {totalExpense.toLocaleString("id-ID")}</p>
            </div>
          </div>

          {/* CASHFLOW (NETTO) */}
          <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.6)]">
              <ChartPieSlice weight="fill" size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Arus Kas Bersih</p>
              <p className="text-2xl font-black text-zinc-900 mt-1">Rp {cashflow.toLocaleString("id-ID")}</p>
            </div>
          </div>

          {/* TAGIHAN BELUM DIBAYAR */}
          <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]">
              <ArrowCircleDown weight="fill" size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Tagihan Tertunda (Piutang Developer)</p>
              <p className="text-2xl font-black text-zinc-900 mt-1">Rp {outstandingInvoices.toLocaleString("id-ID")}</p>
            </div>
          </div>

          {/* PIUTANG KPR */}
          <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.6)]">
              <ArrowCircleUp weight="fill" size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Piutang KPR Belum Cair</p>
              <p className="text-2xl font-black text-zinc-900 mt-1">Rp {piutangKpr.toLocaleString("id-ID")}</p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
