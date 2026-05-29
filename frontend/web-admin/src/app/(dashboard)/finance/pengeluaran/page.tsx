"use client";

import { useState, useEffect } from "react";
import { Money, Plus, FileText, CheckCircle, ClockCounterClockwise, XCircle } from "@phosphor-icons/react";

export default function PengeluaranFinancePage() {
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
            <Money className="text-rose-500" weight="duotone" size={32} />
            Pengeluaran (Expenses)
          </h2>
          <p className="text-sm text-zinc-500">
            Catat dan pantau seluruh biaya operasional, tagihan kontraktor, dan pengeluaran proyek lainnya.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex h-[42px] items-center gap-2 rounded-xl bg-rose-600 px-4 text-sm font-bold text-white shadow-lg shadow-rose-600/20 transition-all hover:bg-rose-700 hover:-translate-y-0.5">
            <Plus weight="bold" size={16} /> Catat Pengeluaran
          </button>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
            <Money weight="duotone" size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Total Biaya Bulan Ini</p>
            <p className="text-xl font-black text-zinc-900 mt-0.5">Rp 120 Juta</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-amber-100 bg-amber-50/50 p-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <ClockCounterClockwise weight="bold" size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Menunggu Approval</p>
            <p className="text-xl font-black text-amber-700 mt-0.5">3</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <CheckCircle weight="bold" size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Disetujui & Dibayar</p>
            <p className="text-xl font-black text-emerald-700 mt-0.5">45</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-rose-100 bg-rose-50/50 p-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
            <XCircle weight="bold" size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Ditolak / Batal</p>
            <p className="text-xl font-black text-rose-700 mt-0.5">1</p>
          </div>
        </div>
      </div>

      {/* PLACEHOLDER KONTEN */}
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-8 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shadow-inner">
          <FileText weight="duotone" className="h-8 w-8" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-zinc-800">Modul Pengeluaran (Expenses) Segera Hadir</h3>
        <p className="max-w-md text-sm text-zinc-500">
          Halaman ini nantinya akan difungsikan untuk mencatat bukti transfer pengeluaran, nota biaya material, serta proses validasi (approval) pengeluaran dari manajemen.
        </p>
      </div>
    </div>
  );
}
