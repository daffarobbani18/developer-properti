"use client";

import { Pulse } from "@phosphor-icons/react";

export default function AktivitasSalesPage() {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-6">
        <div>
          <h2 className="mb-2 text-3xl font-[family-name:var(--font-heading)] text-zinc-900 flex items-center gap-3">
            <Pulse className="text-amber-500" weight="duotone" />
            Aktivitas Sales
          </h2>
          <p className="text-sm text-zinc-500">Log aktivitas harian, jadwal panggilan, dan pertemuan dengan prospek.</p>
        </div>
      </div>

      {/* PENDING FEATURE PLACEHOLDER */}
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-8 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-500 shadow-inner">
          <Pulse weight="duotone" className="h-8 w-8" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-zinc-800">Fitur Sedang Dikembangkan</h3>
        <p className="max-w-md text-sm text-zinc-500">
          Modul aktivitas untuk melacak riwayat telepon, *meeting*, dan jadwal *follow-up* prospek sedang dalam tahap penyelesaian (Fase Berikutnya).
        </p>
      </div>
    </div>
  );
}
