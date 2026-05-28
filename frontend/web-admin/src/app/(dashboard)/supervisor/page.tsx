"use client";

import { useState, useEffect, useMemo } from "react";
import {
  TrendUp, TrendDown, CheckCircle, Warning, FileText,
  Upload, UsersThree, Hammer, ArrowUpRight, CircleNotch
} from "@phosphor-icons/react";

const actionCards = [
  { title: "Report Kendala", desc: "Laporkan hambatan atau masalah konstruksi", icon: Warning, bg: "bg-rose-50", color: "text-rose-500" },
  { title: "Upload Progress", desc: "Foto & dokumen performa mingguan", icon: Upload, bg: "bg-blue-50", color: "text-blue-500" },
  { title: "Kelola SPK", desc: "Daftar & tracking surat perintah kerja", icon: FileText, bg: "bg-amber-50", color: "text-amber-500" },
  { title: "Tim Lapangan", desc: "Data pekerja & pengawas lapangan", icon: UsersThree, bg: "bg-emerald-50", color: "text-emerald-500" },
];

const milestoneStatusStyle: Record<string, { badge: string; bar: string }> = {
  Selesai: { badge: "bg-emerald-100 text-emerald-700", bar: "from-emerald-400 to-emerald-500" },
  "Sedang Berjalan": { badge: "bg-blue-100 text-blue-700", bar: "from-blue-400 to-blue-500" },
  "Akan Dimulai": { badge: "bg-zinc-100 text-zinc-600", bar: "from-zinc-300 to-zinc-400" },
};

type Unit = {
  id: string;
  blok: string;
  nomor: string;
  kawasan: string;
  statusPembangunan: string;
};

export default function FieldSupervisorPage() {
  const [loading, setLoading] = useState(true);
  const [units, setUnits] = useState<Unit[]>([]);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoading(true);
        const loginRes = await fetch("http://localhost:4000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "superadmin@erp.com", password: "password123" })
        });
        const loginData = await loginRes.json();

        if (loginData.token) {
          const res = await fetch("http://localhost:4000/api/inventory/units", {
            headers: { "Authorization": `Bearer ${loginData.token}` }
          });
          const result = await res.json();
          if (result.data) {
            setUnits(result.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch units:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUnits();
  }, []);

  const stats = useMemo(() => {
    const total = units.length;
    const selesai = units.filter(u => u.statusPembangunan === "Siap Huni").length;
    const proses = units.filter(u => u.statusPembangunan === "Sedang Dibangun").length;
    const rataRata = total === 0 ? 0 : Math.round(((selesai * 100) + (proses * 50)) / total);

    return {
      progressRataRata: `${rataRata}%`,
      unitSelesai: `${selesai} / ${total}`,
      kendalaAktif: "0",
      spkKontraktor: "0",
    };
  }, [units]);

  const milestones = useMemo(() => {
    // We simulate milestones based on the actual units fetched from the API
    return units.map(u => {
      let progress = 0;
      let status = "Akan Dimulai";
      
      if (u.statusPembangunan === "Siap Huni") {
        progress = 100;
        status = "Selesai";
      } else if (u.statusPembangunan === "Sedang Dibangun" || u.statusPembangunan === "Proses Bangun") {
        progress = 50;
        status = "Sedang Berjalan";
      }

      return {
        phase: `Unit ${u.kawasan} ${u.blok}/${u.nomor}`,
        progress,
        status,
        dueDate: "Berdasarkan SPK",
      };
    }).slice(0, 5); // Show only top 5 for brevity
  }, [units]);

  const constructionStats = [
    { label: "Progress Rata-rata", value: stats.progressRataRata, note: "Berdasarkan status unit", trend: "+2%", trendUp: true, icon: TrendUp, bg: "bg-blue-50", color: "text-blue-500" },
    { label: "Unit Selesai", value: stats.unitSelesai, note: "Siap huni / Diserahterimakan", trend: "+1", trendUp: true, icon: CheckCircle, bg: "bg-emerald-50", color: "text-emerald-500" },
    { label: "Kendala Aktif", value: stats.kendalaAktif, note: "Laporan lapangan", trend: "0", trendUp: false, icon: Warning, bg: "bg-rose-50", color: "text-rose-500" },
    { label: "SPK Kontraktor", value: stats.spkKontraktor, note: "Dokumen kontrak aktif", trend: "+0", trendUp: true, icon: FileText, bg: "bg-amber-50", color: "text-amber-500" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <CircleNotch className="w-10 h-10 text-amber-600 animate-spin" />
        <span className="ml-3 text-zinc-500 text-sm font-medium animate-pulse">Memuat dashboard konstruksi...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="module-hero md:p-8" style={{ "--hero-accent": "rgba(245,158,11,0.06)" } as React.CSSProperties}>
        <div className="hero-pattern absolute inset-0 pointer-events-none rounded-2xl opacity-50" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-amber-700">
              <Hammer weight="bold" size={11} className="text-amber-500" /> Pengawas Lapangan
            </div>
            <div className="flex items-center gap-3">
              <h1 className="font-[family-name:var(--font-heading)] text-2xl font-normal tracking-tight text-zinc-900 md:text-3xl">Monitoring Konstruksi &amp; Progress Lapangan</h1>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 animate-pulse border border-amber-200">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" /> LIVE SYNC
              </span>
            </div>
            <p className="max-w-2xl text-sm text-zinc-500 leading-relaxed">Track progress konstruksi, kelola SPK kontraktor, upload foto lapangan, dan laporkan kendala/status mingguan secara tersinkronisasi.</p>
          </div>
          <button className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-5 py-2.5 text-sm font-semibold text-amber-600 shadow-sm transition-all hover:bg-amber-100 hover:shadow-md">
            <Upload weight="bold" size={16} /> Upload Laporan
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {constructionStats.map((stat) => (
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
            <div className={`icon-wrapper h-14 w-14 shrink-0 ${stat.bg === 'bg-blue-50' ? 'icon-blue' : stat.bg === 'bg-emerald-50' ? 'icon-emerald' : stat.bg === 'bg-rose-50' ? 'icon-rose' : 'icon-amber'}`}>
              <stat.icon weight="duotone" size={28} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actionCards.map((action) => (
          <div key={action.title} className="group cursor-pointer rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200/60 hover:shadow-[0_8px_25px_rgba(245,158,11,0.08)]">
            <div className={`mb-3 icon-wrapper h-11 w-11 ${action.bg === 'bg-rose-50' ? 'icon-rose' : action.bg === 'bg-blue-50' ? 'icon-blue' : action.bg === 'bg-amber-50' ? 'icon-amber' : 'icon-emerald'}`}><action.icon weight="duotone" size={20} /></div>
            <h3 className="text-sm font-bold text-zinc-900 transition-colors group-hover:text-amber-600">{action.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">{action.desc}</p>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-amber-500 opacity-0 transition-opacity group-hover:opacity-100"><ArrowUpRight size={13} /> Akses</div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="mb-4 text-sm font-bold text-zinc-900 uppercase tracking-wider">Milestone Pembangunan Unit</h3>
        <div className="space-y-3">
          {milestones.length === 0 ? (
             <div className="text-sm text-zinc-500 p-6 text-center border border-zinc-100 rounded-2xl bg-white shadow-sm">
                Belum ada data unit yang tercatat progres pembangunannya.
             </div>
          ) : (
            milestones.map((milestone) => {
              const style = milestoneStatusStyle[milestone.status] ?? { badge: "bg-zinc-100 text-zinc-600", bar: "from-zinc-300 to-zinc-400" };
              return (
                <div key={milestone.phase} className="overflow-hidden rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-zinc-200">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-zinc-900">{milestone.phase}</h4>
                      <p className="mt-0.5 text-xs text-zinc-400">Target selesai: {milestone.dueDate}</p>
                    </div>
                    <span className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-medium ${style.badge}`}>{milestone.status}</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-100">
                      <div className={`h-full rounded-full bg-gradient-to-r ${style.bar} transition-all duration-700 ease-out`} style={{ width: `${milestone.progress}%` }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-zinc-400">{milestone.progress}% selesai</p>
                      {milestone.progress === 100 && <CheckCircle weight="duotone" size={14} className="text-emerald-500" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
