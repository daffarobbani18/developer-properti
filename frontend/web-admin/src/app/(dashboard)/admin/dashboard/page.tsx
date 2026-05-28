import SharedDashboard from '@/components/shared-pages/dashboard';
import { WarningCircle, Package, House, MapPin, ShieldCheck } from '@phosphor-icons/react/dist/ssr';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SharedDashboard role="admin" />
      
      <div className="mt-8 border-t border-zinc-200 pt-8">
        <h2 className="mb-6 text-2xl font-[family-name:var(--font-heading)] text-zinc-900">
          Ringkasan Inventaris
        </h2>

        <div className="mb-8 flex items-center gap-4 rounded-xl border border-rose-100 bg-rose-50 p-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-rose-100">
            <WarningCircle weight="duotone" className="text-rose-600" size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-rose-900">Peringatan Stok Menipis</h4>
            <p className="mt-0.5 text-xs text-rose-700">
              Sisa 2 unit tersedia untuk Tipe Magnolia. Pertimbangkan untuk membuka blok baru.
            </p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Unit Kavling", value: "150", icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Unit Tersedia", value: "45", icon: House, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Sedang Booked", value: "12", icon: MapPin, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Sudah Terjual", value: "93", icon: ShieldCheck, color: "text-purple-600", bg: "bg-purple-50" },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="stat-card group flex items-center justify-between gap-4 p-5 rounded-2xl border border-zinc-100 bg-white shadow-sm">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-600 truncate">{stat.label}</p>
                  <h3 className="mt-1 text-3xl font-bold text-zinc-900 tracking-tight">{stat.value}</h3>
                </div>
                <div className={lex h-14 w-14 shrink-0 items-center justify-center rounded-2xl  }>
                  <Icon weight="duotone" size={28} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-zinc-900">Distribusi Stok per Tipe</h3>
          <div className="flex h-64 items-end justify-around gap-4 rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 px-4">
            <div className="flex flex-1 flex-col items-center gap-2">
              <div className="h-[80%] w-full max-w-[80px] rounded-t-lg bg-amber-500 transition-colors hover:bg-amber-400"></div>
              <span className="text-xs text-zinc-500 font-medium">The Astoria</span>
            </div>
            <div className="flex flex-1 flex-col items-center gap-2">
              <div className="h-[40%] w-full max-w-[80px] rounded-t-lg bg-emerald-500 transition-colors hover:bg-emerald-400"></div>
              <span className="text-xs text-zinc-500 font-medium">The Bvlgari</span>
            </div>
            <div className="flex flex-1 flex-col items-center gap-2">
              <div className="h-[20%] w-full max-w-[80px] rounded-t-lg bg-blue-500 transition-colors hover:bg-blue-400"></div>
              <span className="text-xs text-zinc-500 font-medium">Magnolia</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
