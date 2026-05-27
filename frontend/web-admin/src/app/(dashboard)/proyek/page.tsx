"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import {
  UsersThree, Warning, TrendUp, MapPin, Plus, Buildings, ArrowRight, Calendar
} from "@phosphor-icons/react";
import {
  dummyProyek,
  formatRupiah,
  formatTanggalShort,
  statusProyekLabel,
  statusProyekColor,
  type Proyek,
} from "@/lib/proyek-data";

const statusBadgeStyle: Record<string, string> = {
  "bg-blue-100 text-blue-700 border-blue-200": "bg-blue-100 text-blue-700",
  "bg-amber-100 text-amber-700 border-amber-200": "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700 border-emerald-200": "bg-emerald-100 text-emerald-700",
  "bg-zinc-100 text-zinc-600 border-zinc-200": "bg-zinc-100 text-zinc-600",
};

const progressBarColor: Record<string, string> = {
  "bg-blue-100 text-blue-700 border-blue-200": "from-blue-400 to-blue-500",
  "bg-amber-100 text-amber-700 border-amber-200": "from-amber-400 to-amber-500",
  "bg-emerald-100 text-emerald-700 border-emerald-200": "from-emerald-400 to-emerald-500",
  "bg-zinc-100 text-zinc-600 border-zinc-200": "from-zinc-300 to-zinc-400",
};

export default function ProyekPage() {
  const [projects, setProjects] = useState<Proyek[]>(dummyProyek);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Login to get token
        const loginRes = await fetch("http://localhost:4000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: "admin", password: "admin" })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;

        if (token) {
          const prjRes = await fetch("http://localhost:4000/api/projects", {
            headers: { "Authorization": `Bearer ${token}` }
          });
          const fetchedProjects = await prjRes.json();
          if (fetchedProjects && fetchedProjects.length > 0) {
            setProjects(fetchedProjects.map((p: any) => ({
              id: p.id,
              nama: p.name,
              lokasi: p.location,
              totalUnit: p.totalUnits || 0,
              unitSelesai: p._count?.units || 0, // Using count for now, adjust based on actual completed units logic
              persentaseSelesai: p.totalUnits > 0 ? Math.round(((p._count?.units || 0) / p.totalUnits) * 100) : 0,
              statusProyek: p.status,
              jumlahKontraktor: 5, // Mock for now
              tanggalMulai: p.createdAt,
              targetSelesai: p.targetSelesai || p.createdAt,
              nilaiKontrak: 10000000000 // Mock for now
            })));
          }
        }
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const proyekAktif = projects.filter(
    (p) => p.statusProyek === "konstruksi" || p.statusProyek === "finishing"
  );
  const totalUnit = projects.reduce((sum, p) => sum + p.totalUnit, 0);
  const unitSelesai = projects.reduce((sum, p) => sum + p.unitSelesai, 0);
  const persentaseGlobal = totalUnit > 0 ? Math.round((unitSelesai / totalUnit) * 100) : 0;

  const summaryStats = [
    {
      label: "Total Proyek",
      value: String(projects.length),
      note: `${proyekAktif.length} sedang berjalan`,
      icon: Buildings,
      bg: "bg-blue-50",
      color: "text-blue-500",
    },
    {
      label: "Total Unit",
      value: String(totalUnit),
      note: `${unitSelesai} unit selesai`,
      icon: TrendUp,
      bg: "bg-emerald-50",
      color: "text-emerald-500",
    },
    {
      label: "Progress Global",
      value: `${persentaseGlobal}%`,
      note: "rata-rata penyelesaian",
      icon: TrendUp,
      bg: "bg-amber-50",
      color: "text-amber-500",
      progress: persentaseGlobal,
    },
    {
      label: "Site Engineer",
      value: "12",
      note: "aktif di lapangan",
      icon: UsersThree,
      bg: "bg-rose-50",
      color: "text-rose-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="module-hero md:p-8" style={{ "--hero-accent": "rgba(59,130,246,0.06)" } as React.CSSProperties}>
        <div className="hero-pattern absolute inset-0 pointer-events-none rounded-2xl opacity-50" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-blue-700">
              <Buildings weight="duotone" size={11} className="text-blue-500" /> Monitoring Proyek
            </div>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl font-normal tracking-tight text-zinc-900 md:text-3xl">
              Progress Konstruksi & Milestone Unit
            </h1>
            <p className="max-w-2xl text-sm text-zinc-500 leading-relaxed">
              Pantau progres konstruksi, kelola milestone tiap unit, dan sinkronisasi data dengan tim lapangan.
            </p>
          </div>
          <button className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-5 py-2.5 text-sm font-semibold text-amber-600 shadow-sm transition-all hover:bg-amber-100 hover:shadow-md">
            <Plus weight="duotone" size={16} /> Tambah Proyek
          </button>
        </div>
      </section>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map((stat) => (
          <div key={stat.label} className="stat-card group">
            <div className="mb-4 flex items-start justify-between">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon weight="duotone" className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-zinc-900">{stat.value}</p>
            {"progress" in stat && stat.progress !== undefined && (
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
            )}
            <p className="mt-1 text-xs text-zinc-500">{stat.note}</p>
          </div>
        ))}
      </div>

      {/* Proyek Cards */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-zinc-900">Daftar Proyek</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {projects.map((proyek) => (
            <ProyekCard key={proyek.id} proyek={proyek} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProyekCard({ proyek }: { proyek: Proyek }) {
  const isDelayed = proyek.persentaseSelesai < 50 && proyek.statusProyek === "konstruksi";
  const rawColor = statusProyekColor[proyek.statusProyek] ?? "";
  const badgeStyle = statusBadgeStyle[rawColor] ?? "bg-zinc-100 text-zinc-600";
  const barGradient = progressBarColor[rawColor] ?? "from-zinc-300 to-zinc-400";

  return (
    <Link href={`/proyek/${proyek.id}/unit`} className="block">
      <div className="group h-full cursor-pointer overflow-hidden rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_8px_30px_rgba(245,158,11,0.12)]">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-base font-bold text-zinc-900 group-hover:text-amber-600 transition-colors">
                {proyek.nama}
              </h3>
              {isDelayed && <Warning weight="duotone" className="h-4 w-4 shrink-0 text-amber-500" />}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400">
              <MapPin weight="duotone" size={12} />
              <span>{proyek.lokasi}</span>
            </div>
          </div>
          <span className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-medium ${badgeStyle}`}>
            {statusProyekLabel[proyek.statusProyek]}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="mb-5 grid grid-cols-3 gap-3">
          {[
            { label: "Total Unit", value: proyek.totalUnit, color: "text-zinc-900" },
            { label: "Selesai", value: proyek.unitSelesai, color: "text-emerald-600" },
            { label: "Kontraktor", value: proyek.jumlahKontraktor, color: "text-blue-600" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-zinc-50 p-3 text-center">
              <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Progress Keseluruhan</span>
            <span className="text-xs font-bold text-zinc-900">{proyek.persentaseSelesai}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${barGradient} transition-all duration-500`}
              style={{ width: `${proyek.persentaseSelesai}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
              <Calendar weight="duotone" size={11} />
              <span>Mulai: {formatTanggalShort(proyek.tanggalMulai)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
              <Calendar weight="duotone" size={11} />
              <span>Target: {formatTanggalShort(proyek.targetSelesai)}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">Nilai Kontrak</p>
            <p className="text-sm font-bold text-zinc-900">{formatRupiah(proyek.nilaiKontrak)}</p>
          </div>
        </div>

        {/* View Link */}
        <div className="mt-4 flex items-center justify-end gap-1 text-xs font-medium text-amber-500 opacity-0 transition-opacity group-hover:opacity-100">
          Lihat Detail Unit <ArrowRight size={13} />
        </div>
      </div>
    </Link>
  );
}

