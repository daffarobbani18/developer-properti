"use client";

import { useState, useEffect } from "react";
import { Receipt, Plus, ClockCounterClockwise, CheckCircle, WarningCircle, ReceiptX } from "@phosphor-icons/react";

export default function TagihanFinancePage() {
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
            <Receipt className="text-blue-500" weight="duotone" size={32} />
            Tagihan (Invoice)
          </h2>
          <p className="text-sm text-zinc-500">
            Kelola pembuatan tagihan klien, jatuh tempo cicilan KPR, dan pembayaran tunai bertahap.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex h-[42px] items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:-translate-y-0.5">
            <Plus weight="bold" size={16} /> Buat Tagihan
          </button>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
            <Receipt weight="duotone" size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Total Tagihan</p>
            <p className="text-xl font-black text-zinc-900 mt-0.5">142</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-amber-100 bg-amber-50/50 p-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <ClockCounterClockwise weight="bold" size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Belum Dibayar (Unpaid)</p>
            <p className="text-xl font-black text-amber-700 mt-0.5">38</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-rose-100 bg-rose-50/50 p-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
            <WarningCircle weight="bold" size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Jatuh Tempo (Overdue)</p>
            <p className="text-xl font-black text-rose-700 mt-0.5">5</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <CheckCircle weight="bold" size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Lunas (Paid)</p>
            <p className="text-xl font-black text-emerald-700 mt-0.5">99</p>
          </div>
        </div>
      </div>

      {/* PLACEHOLDER KONTEN */}
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-8 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-inner">
          <ReceiptX weight="duotone" className="h-8 w-8" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-zinc-800">Modul Tagihan (Invoice) Segera Hadir</h3>
        <p className="max-w-md text-sm text-zinc-500">
          Di halaman ini nantinya Anda bisa menerbitkan invoice (seperti tagihan DP, cicilan bertahap, dan booking fee), mengirimnya ke klien, serta memantau status pembayarannya.
        </p>
      </div>
    </div>
  );
}
