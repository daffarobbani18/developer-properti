import {
  TrendUp, TrendDown, CheckCircle, Warning, FileText,
  Upload, UsersThree, Hammer, ArrowUpRight,
} from "@phosphor-icons/react";
const constructionStats = [
  { label: "Progress Rata-rata", value: "62%", note: "Fase 4 – Konstruksi", trend: "+8%", trendUp: true, icon: TrendUp, bg: "bg-blue-50", color: "text-blue-500" },
  { label: "Unit Selesai", value: "15 / 24", note: "Fase 4A sudah selesai", trend: "+3", trendUp: true, icon: CheckCircle, bg: "bg-emerald-50", color: "text-emerald-500" },
  { label: "Kendala Aktif", value: "3", note: "Perlu tindakan segera", trend: "+1", trendUp: false, icon: Warning, bg: "bg-rose-50", color: "text-rose-500" },
  { label: "SPK Kontraktor", value: "8", note: "Diterbitkan bulan ini", trend: "+2", trendUp: true, icon: FileText, bg: "bg-amber-50", color: "text-amber-500" },
];

const milestones = [
  { phase: "Pondasi & Struktur", progress: 100, status: "Selesai", dueDate: "Maret 2026" },
  { phase: "Dinding & Atap", progress: 85, status: "Sedang Berjalan", dueDate: "April 2026" },
  { phase: "Finishing & Interior", progress: 40, status: "Akan Dimulai", dueDate: "Juni 2026" },
];

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

export default function FieldSupervisorPage() {
  return (
    <div className="space-y-6">
      <section className="module-hero md:p-8" style={{ "--hero-accent": "rgba(245,158,11,0.06)" } as React.CSSProperties}>
        <div className="hero-pattern absolute inset-0 pointer-events-none rounded-2xl opacity-50" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-amber-700">
              <Hammer weight="bold" size={11} className="text-amber-500" /> Pengawas Lapangan
            </div>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl font-normal tracking-tight text-zinc-900 md:text-3xl">Monitoring Konstruksi &amp; Progress Lapangan</h1>
            <p className="max-w-2xl text-sm text-zinc-500 leading-relaxed">Track progress konstruksi, kelola SPK kontraktor, upload foto lapangan, dan laporkan kendala/status mingguan.</p>
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
        <h3 className="mb-4 text-sm font-bold text-zinc-900 uppercase tracking-wider">Milestone Konstruksi</h3>
        <div className="space-y-3">
          {milestones.map((milestone) => {
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
          })}
        </div>
      </div>
    </div>
  );
}
