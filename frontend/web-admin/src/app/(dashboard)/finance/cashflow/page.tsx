"use client";

import { useState, useEffect } from "react";
import { ChartLineUp, ArrowUpRight, ArrowDownRight, Wallet, CalendarBlank, ArrowsLeftRight } from "@phosphor-icons/react";

export default function CashflowPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-8">
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

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Wallet weight="duotone" size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Saldo Kas Saat Ini</p>
            <p className="text-2xl font-black text-zinc-900 mt-1">Rp 1.450.000.000</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <ArrowDownRight weight="bold" size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Uang Masuk (In)</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">Rp 350.000.000</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-rose-100 bg-rose-50/50 p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
            <ArrowUpRight weight="bold" size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-rose-700">Uang Keluar (Out)</p>
            <p className="text-2xl font-black text-rose-700 mt-1">Rp 120.000.000</p>
          </div>
        </div>
      </div>

      {/* PLACEHOLDER KONTEN */}
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-8 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-inner">
          <ArrowsLeftRight weight="duotone" className="h-8 w-8" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-zinc-800">Modul Cashflow Segera Hadir</h3>
        <p className="max-w-md text-sm text-zinc-500">
          Halaman ini nantinya akan menampilkan grafik arus kas, pencatatan biaya operasional, tagihan kontraktor, serta pemasukan dari pembayaran unit. Saat ini UI sedang dipersiapkan.
        </p>
      </div>
    </div>
  );
}
