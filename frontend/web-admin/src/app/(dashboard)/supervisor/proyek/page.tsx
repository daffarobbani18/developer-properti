"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import {
  UsersThree, Warning, TrendUp, MapPin, Plus, Buildings, ArrowRight, Calendar, X, CircleNotch
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
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [projectForm, setProjectForm] = useState({
    name: "",
    location: "",
    totalUnits: "",
    targetSelesai: "",
    status: "perencanaan",
    jumlahKontraktor: "",
    nilaiKontrak: "",
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Login to get token
        const loginRes = await fetch("http://localhost:4000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "superadmin@erp.com", password: "password123" })
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
              jumlahKontraktor: p.jumlahKontraktor || 0,
              tanggalMulai: p.createdAt,
              targetSelesai: p.targetSelesai || p.createdAt,
              nilaiKontrak: p.nilaiKontrak || 0
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

  const handleProjectSubmit = async () => {
    try {
      setSubmitting(true);
      const loginRes = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "superadmin@erp.com", password: "password123" })
      });
      const loginData = await loginRes.json();
      const token = loginData.token;

      if (!token) return;

      const payload = {
        name: projectForm.name,
        location: projectForm.location,
        totalUnits: Number(projectForm.totalUnits) || 0,
        targetSelesai: projectForm.targetSelesai ? new Date(projectForm.targetSelesai).toISOString() : undefined,
        status: projectForm.status,
        jumlahKontraktor: Number(projectForm.jumlahKontraktor) || 0,
        nilaiKontrak: Number(projectForm.nilaiKontrak) || 0,
      };

      await fetch("http://localhost:4000/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      setIsProjectModalOpen(false);
      setProjectForm({ name: "", location: "", totalUnits: "", targetSelesai: "", status: "perencanaan", jumlahKontraktor: "", nilaiKontrak: "" });
      window.location.reload();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

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
          <button 
            onClick={() => setIsProjectModalOpen(true)}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-5 py-2.5 text-sm font-semibold text-amber-600 shadow-sm transition-all hover:bg-amber-100 hover:shadow-md"
          >
            <Plus weight="duotone" size={16} /> Tambah Proyek
          </button>
        </div>
      </section>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map((stat) => (
          <div key={stat.label} className="stat-card group flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-600 truncate">{stat.label}</p>
              <h3 className="mt-1 text-3xl font-bold text-zinc-900 tracking-tight">{stat.value}</h3>
              {"progress" in stat && stat.progress !== undefined ? (
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
              ) : (
                <p className="mt-1 text-xs text-zinc-500 truncate">{stat.note}</p>
              )}
            </div>
            <div className={`icon-wrapper h-14 w-14 shrink-0 ${stat.bg === 'bg-blue-50' ? 'icon-blue' : stat.bg === 'bg-emerald-50' ? 'icon-emerald' : stat.bg === 'bg-amber-50' ? 'icon-amber' : stat.bg === 'bg-rose-50' ? 'icon-rose' : 'icon-violet'}`}>
              <stat.icon weight="duotone" size={28} />
            </div>
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

      {/* Modal Tambah Proyek */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg animate-in zoom-in-95 rounded-2xl bg-white shadow-2xl duration-200">
            <div className="flex items-center justify-between rounded-t-2xl border-b border-zinc-100 bg-zinc-50/50 px-6 py-4">
              <h3 className="text-lg font-bold text-zinc-900">Registrasi Proyek Baru</h3>
              <button onClick={() => setIsProjectModalOpen(false)} className="p-1 text-zinc-400 transition-colors hover:text-rose-500">
                <X weight="duotone" size={20} />
              </button>
            </div>
            <div className="space-y-5 p-6 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Nama Proyek</label>
                <input
                  type="text"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  placeholder="Contoh: Pesona Indah 2"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Lokasi / Alamat</label>
                <input
                  type="text"
                  value={projectForm.location}
                  onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                  placeholder="Contoh: Jl. Sudirman, Jakarta Selatan"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Target Total Unit</label>
                  <input
                    type="number"
                    value={projectForm.totalUnits}
                    onChange={(e) => setProjectForm({ ...projectForm, totalUnits: e.target.value })}
                    placeholder="0"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Target Selesai</label>
                  <input
                    type="date"
                    value={projectForm.targetSelesai}
                    onChange={(e) => setProjectForm({ ...projectForm, targetSelesai: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Jumlah Kontraktor</label>
                  <input
                    type="number"
                    value={projectForm.jumlahKontraktor}
                    onChange={(e) => setProjectForm({ ...projectForm, jumlahKontraktor: e.target.value })}
                    placeholder="0"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Nilai Kontrak</label>
                  <input
                    type="number"
                    value={projectForm.nilaiKontrak}
                    onChange={(e) => setProjectForm({ ...projectForm, nilaiKontrak: e.target.value })}
                    placeholder="0"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Status Awal</label>
                <select
                  value={projectForm.status}
                  onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                  className="w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                >
                  <option value="perencanaan">Perencanaan</option>
                  <option value="konstruksi">Konstruksi</option>
                  <option value="finishing">Finishing</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 rounded-b-2xl border-t border-zinc-100 bg-zinc-50/50 px-6 py-4">
              <button
                onClick={() => setIsProjectModalOpen(false)}
                disabled={submitting}
                className="rounded-lg px-5 py-2.5 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-200 disabled:opacity-50"
              >
                Batal
              </button>
              <button 
                onClick={handleProjectSubmit} 
                disabled={submitting || !projectForm.name || !projectForm.location}
                className="flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-600/20 transition-all hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? <CircleNotch weight="bold" className="animate-spin" /> : "Simpan Proyek"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProyekCard({ proyek }: { proyek: Proyek }) {
  const isDelayed = proyek.persentaseSelesai < 50 && proyek.statusProyek === "konstruksi";
  const rawColor = statusProyekColor[proyek.statusProyek] ?? "";
  const badgeStyle = statusBadgeStyle[rawColor] ?? "bg-zinc-100 text-zinc-600";
  const barGradient = progressBarColor[rawColor] ?? "from-zinc-300 to-zinc-400";

  return (
    <Link href={`/supervisor/proyek/${proyek.id}/unit`} className="block">
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


