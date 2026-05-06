"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Bath,
  Bell,
  Box,
  BedDouble,
  CalendarDays,
  ChevronRight,
  Edit,
  Home,
  LayoutDashboard,
  Map,
  MapPin,
  Maximize,
  MoreVertical,
  Menu,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UploadCloud,
  UserRound,
  X,
} from "lucide-react";

type PropertyType = {
  id: number;
  name: string;
  lt: number;
  lb: number;
  bed: number;
  bath: number;
  price: number;
};

type UnitItem = {
  id: string;
  type: string;
  price: number;
  status: "Tersedia" | "Booked" | "Terjual";
};

const propertyTypesSeed: PropertyType[] = [
  { id: 1, name: "The Astoria", lt: 200, lb: 150, bed: 4, bath: 3, price: 2800000000 },
  { id: 2, name: "The Bvlgari", lt: 250, lb: 210, bed: 5, bath: 4, price: 4500000000 },
  { id: 3, name: "Magnolia", lt: 72, lb: 36, bed: 2, bath: 1, price: 450000000 },
];

const unitsSeed: UnitItem[] = [
  { id: "BLK-A1", type: "The Astoria", price: 2800000000, status: "Tersedia" },
  { id: "BLK-A2", type: "The Astoria", price: 2850000000, status: "Booked" },
  { id: "BLK-C5", type: "The Bvlgari", price: 4500000000, status: "Terjual" },
  { id: "BLK-D1", type: "Magnolia", price: 450000000, status: "Tersedia" },
  { id: "BLK-D2", type: "Magnolia", price: 450000000, status: "Tersedia" },
];

const formatRupiah = (number: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);

export default function InventoryAdminPage() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [propertyTypes] = useState<PropertyType[]>(propertyTypesSeed);
  const [units] = useState<UnitItem[]>(unitsSeed);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => window.clearInterval(timer);
  }, []);

  const topBarDate = useMemo(
    () =>
      new Intl.DateTimeFormat("id-ID", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(now),
    [now]
  );

  const topBarTime = useMemo(
    () =>
      new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(now),
    [now]
  );

  const renderDashboard = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="mb-2 text-3xl font-serif text-zinc-900">Dasbor Inventaris</h2>
        <p className="text-sm text-zinc-500">Ringkasan ketersediaan aset properti saat ini.</p>
      </div>

      <div className="mb-8 flex items-center gap-4 rounded-xl border border-rose-100 bg-rose-50 p-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-rose-100">
          <AlertCircle className="text-rose-600" size={20} />
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
          { label: "Total Unit Kavling", value: "150", icon: Box, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Unit Tersedia", value: "45", icon: Home, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Sedang Booked", value: "12", icon: MapPin, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Sudah Terjual", value: "93", icon: ShieldCheck, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat, idx) => (
          <div key={idx} className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex items-start justify-between">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </div>
            <p className="mb-1 text-sm text-zinc-500">{stat.label}</p>
            <h3 className="text-3xl font-bold text-zinc-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
        <h3 className="mb-6 text-lg font-bold text-zinc-900">Distribusi Stok per Tipe</h3>
        <div className="flex h-64 items-end justify-around gap-4 rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 px-4">
          <div className="flex flex-1 flex-col items-center gap-2">
            <div className="h-[80%] w-full max-w-[80px] rounded-t-lg bg-amber-500 transition-colors hover:bg-amber-400"></div>
            <span className="text-xs text-zinc-500">The Astoria</span>
          </div>
          <div className="flex flex-1 flex-col items-center gap-2">
            <div className="h-[40%] w-full max-w-[80px] rounded-t-lg bg-emerald-500 transition-colors hover:bg-emerald-400"></div>
            <span className="text-xs text-zinc-500">The Bvlgari</span>
          </div>
          <div className="flex flex-1 flex-col items-center gap-2">
            <div className="h-[20%] w-full max-w-[80px] rounded-t-lg bg-blue-500 transition-colors hover:bg-blue-400"></div>
            <span className="text-xs text-zinc-500">Magnolia</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTypes = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="mb-2 text-3xl font-serif text-zinc-900">Master Tipe Rumah</h2>
          <p className="text-sm text-zinc-500">Kelola spesifikasi dan harga dasar cetak biru properti.</p>
        </div>
        <button
          onClick={() => setIsTypeModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-600/20 transition-all hover:bg-amber-700"
        >
          <Plus size={18} /> Tambah Tipe
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {propertyTypes.map((type) => (
          <div key={type.id} className="group overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-all hover:shadow-md">
            <div className="relative h-48 overflow-hidden bg-zinc-100">
              <div className="absolute inset-0 flex items-center justify-center text-zinc-300 transition-transform duration-500 group-hover:scale-105">
                <Home size={64} strokeWidth={1} />
              </div>
              <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-zinc-700 shadow-sm backdrop-blur-sm">
                Tipe {type.lt}/{type.lb}
              </div>
            </div>
            <div className="p-6">
              <h4 className="mb-4 text-xl font-serif text-zinc-900">{type.name}</h4>
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <Maximize size={16} className="text-amber-600" /> LT {type.lt} m²
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <Box size={16} className="text-amber-600" /> LB {type.lb} m²
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <BedDouble size={16} className="text-amber-600" /> {type.bed} Kamar
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <Bath size={16} className="text-amber-600" /> {type.bath} Mandi
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
                <p className="text-lg font-bold text-zinc-900">{formatRupiah(type.price)}</p>
                <button className="text-zinc-400 transition-colors hover:text-amber-600">
                  <Edit size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUnits = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="mb-2 text-3xl font-serif text-zinc-900">Data Kavling & Unit</h2>
          <p className="text-sm text-zinc-500">Database unit fisik berdasarkan blok dan nomor.</p>
        </div>
        <div className="flex w-full items-center gap-3 sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input
              type="text"
              placeholder="Cari ID Blok..."
              className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
          <button
            onClick={() => setIsUnitModalOpen(true)}
            className="flex whitespace-nowrap items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-600/20 transition-all hover:bg-amber-700"
          >
            <Plus size={18} /> Tambah Unit
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full border-collapse text-left">
            <thead>
              <tr className="bg-zinc-50/50">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">ID Unit / Blok</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Tipe Rumah</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Harga Spesifik</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {units.map((unit) => (
                <tr key={unit.id} className="group transition-colors hover:bg-zinc-50">
                  <td className="px-6 py-4 font-mono text-sm font-bold text-zinc-900">{unit.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-zinc-600">{unit.type}</td>
                  <td className="px-6 py-4 text-sm font-medium text-zinc-900">{formatRupiah(unit.price)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                        unit.status === "Tersedia" ? "bg-emerald-100 text-emerald-700" : ""
                      } ${unit.status === "Booked" ? "bg-amber-100 text-amber-700" : ""} ${unit.status === "Terjual" ? "bg-rose-100 text-rose-700" : ""}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          unit.status === "Tersedia" ? "bg-emerald-500" : ""
                        } ${unit.status === "Booked" ? "bg-amber-500" : ""} ${unit.status === "Terjual" ? "bg-rose-500" : ""}`}
                      ></span>
                      {unit.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button className="rounded-md border border-zinc-200 bg-white p-2 text-zinc-400 hover:text-blue-600">
                        <Edit size={16} />
                      </button>
                      <button className="rounded-md border border-zinc-200 bg-white p-2 text-zinc-400 hover:text-rose-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSitePlan = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="mb-2 text-3xl font-serif text-zinc-900">Master Site Plan</h2>
        <p className="text-sm text-zinc-500">Unggah dan kelola peta digital untuk Web Marketing.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/30 p-12 text-center transition-colors hover:bg-amber-50">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-amber-100 bg-white shadow-sm">
              <UploadCloud size={28} className="text-amber-500" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-zinc-900">Unggah Denah Baru</h3>
            <p className="mb-6 max-w-sm text-sm text-zinc-500">
              Tarik & Lepas file SVG/PNG denah interaktif di sini, atau klik untuk mencari file di komputer Anda.
            </p>
            <button className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800">
              Pilih File
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-zinc-900">Denah Aktif</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-xl border border-zinc-100 bg-zinc-50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-400">
                <Map size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-zinc-900">Master Plan Tahap 1</h4>
                <p className="text-xs text-zinc-500">Diperbarui 2 hari lalu</p>
              </div>
              <MoreVertical size={16} className="cursor-pointer text-zinc-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 font-sans text-zinc-900 selection:bg-amber-200 selection:text-amber-900">
      {isMobileSidebarOpen ? (
        <div className="fixed inset-0 z-40 bg-zinc-950/50 backdrop-blur-sm md:hidden" onClick={() => setIsMobileSidebarOpen(false)} />
      ) : null}

      <aside className="relative z-20 hidden w-72 flex-col bg-zinc-950 transition-all duration-300 md:flex">
        <div className="flex h-24 items-center border-b border-white/5 px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 rotate-45 items-center justify-center rounded-lg border border-amber-500/50 bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <span className="font-serif text-lg font-bold text-transparent bg-clip-text bg-gradient-to-br from-amber-200 to-amber-500 -rotate-45">G</span>
            </div>
            <span className="font-serif text-sm tracking-widest text-white uppercase">
              Griya<span className="font-light">Persada</span>
            </span>
          </div>
        </div>

        {/* profile section removed per request */}

        <nav className="flex-1 space-y-1 px-4 py-6">
          <p className="mb-4 px-4 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Modul Aset Lahan</p>
          {[
            { id: "dashboard", icon: LayoutDashboard, label: "Dasbor Overview" },
            { id: "types", icon: Home, label: "Master Tipe Rumah" },
            { id: "units", icon: Box, label: "Data Kavling & Unit" },
            { id: "siteplan", icon: Map, label: "Site Plan Master" },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                  isActive ? "bg-amber-500/10 text-amber-500" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} className={isActive ? "text-amber-500" : "text-zinc-500 group-hover:text-zinc-300"} />
                <span className={`text-sm font-medium ${isActive ? "text-amber-500" : ""}`}>{item.label}</span>
                {isActive && <div className="ml-auto h-5 w-1 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>}
              </button>
            );
          })}
        </nav>
      </aside>

        <aside
          className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-zinc-950 transition-transform duration-300 md:hidden ${
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-24 items-center justify-between border-b border-white/5 px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 rotate-45 items-center justify-center rounded-lg border border-amber-500/50 bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <span className="font-serif text-lg font-bold text-transparent bg-clip-text bg-gradient-to-br from-amber-200 to-amber-500 -rotate-45">G</span>
              </div>
              <span className="font-serif text-sm tracking-widest text-white uppercase">
                Griya<span className="font-light">Persada</span>
              </span>
            </div>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="rounded-full border border-white/10 p-2 text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* profile section removed per request */}

          <nav className="flex-1 space-y-1 px-4 py-6">
            <p className="mb-4 px-4 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Modul Aset Lahan</p>
            {[
              { id: "dashboard", icon: LayoutDashboard, label: "Dasbor Overview" },
              { id: "types", icon: Home, label: "Master Tipe Rumah" },
              { id: "units", icon: Box, label: "Data Kavling & Unit" },
              { id: "siteplan", icon: Map, label: "Site Plan Master" },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                    isActive ? "bg-amber-500/10 text-amber-500" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-amber-500" : "text-zinc-500 group-hover:text-zinc-300"} />
                  <span className={`text-sm font-medium ${isActive ? "text-amber-500" : ""}`}>{item.label}</span>
                  {isActive && <div className="ml-auto h-5 w-1 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>}
                </button>
              );
            })}
          </nav>
        </aside>

      <main className="relative flex flex-1 flex-col overflow-hidden">
          <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur-xl">
            <div className="flex h-20 items-center justify-between gap-4 px-4 py-2 md:px-8">
              <div className="flex min-w-0 items-center gap-3 md:gap-4">
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 md:hidden"
                  aria-label="Buka menu navigasi"
                >
                  <Menu size={18} />
                </button>

                <div className="min-w-0" />
              </div>

              <div className="hidden min-w-0 flex-1 justify-start px-0 md:flex">
                <div className="relative w-full max-w-xl">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input
                    type="text"
                    placeholder="Pencarian cepat ID Unit, Tipe..."
                    className="w-full rounded-full border border-zinc-200 bg-white py-2.5 pl-11 pr-16 text-sm text-zinc-700 shadow-[0_2px_10px_rgba(0,0,0,0.04)] outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] font-semibold text-zinc-500">
                    ⌘K
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-4">
                <div className="hidden items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-right shadow-sm md:flex">
                  <CalendarDays size={16} className="text-zinc-400" />
                  <div className="leading-tight">
                    <p className="text-[11px] font-medium text-zinc-500">{topBarDate}</p>
                    <p className="text-sm font-semibold text-zinc-900">{topBarTime}</p>
                  </div>
                </div>

                <button className="relative flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:bg-zinc-50">
                  <Bell size={18} />
                  <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500"></span>
                </button>

                <div className="flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-2 py-1.5 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-zinc-950">
                    AD
                  </div>
                  <div className="hidden min-w-0 sm:block">
                    <p className="truncate text-sm font-semibold leading-tight text-zinc-900">Admin Inventory</p>
                    <p className="truncate text-[11px] uppercase tracking-wide text-zinc-500">Div. Perencanaan</p>
                  </div>
                  <div className="hidden h-6 w-px bg-zinc-200 sm:block" />
                  <UserRound size={16} className="hidden text-zinc-400 sm:block" />
                </div>
              </div>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          {activeMenu === "dashboard" && renderDashboard()}
          {activeMenu === "types" && renderTypes()}
          {activeMenu === "units" && renderUnits()}
          {activeMenu === "siteplan" && renderSitePlan()}
        </div>
      </main>

      {isTypeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl animate-in zoom-in-95 rounded-2xl bg-white shadow-2xl duration-200">
            <div className="flex items-center justify-between rounded-t-2xl border-b border-zinc-100 bg-zinc-50/50 px-6 py-4">
              <h3 className="text-lg font-bold text-zinc-900">Input Master Tipe Baru</h3>
              <button onClick={() => setIsTypeModalOpen(false)} className="p-1 text-zinc-400 transition-colors hover:text-rose-500">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Nama Tipe Rumah</label>
                <input
                  type="text"
                  placeholder="Contoh: The Astoria Signature"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Luas Tanah (m²)</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Luas Bangunan (m²)</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Kamar Tidur</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Kamar Mandi</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Harga Dasar (Base Price)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-zinc-500">Rp</span>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 rounded-b-2xl border-t border-zinc-100 bg-zinc-50/50 px-6 py-4">
              <button
                onClick={() => setIsTypeModalOpen(false)}
                className="rounded-lg px-5 py-2.5 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-200"
              >
                Batal
              </button>
              <button className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-600/20 transition-all hover:bg-amber-700">
                Simpan Tipe Baru
              </button>
            </div>
          </div>
        </div>
      )}

      {isUnitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg animate-in zoom-in-95 rounded-2xl bg-white shadow-2xl duration-200">
            <div className="flex items-center justify-between rounded-t-2xl border-b border-zinc-100 bg-zinc-50/50 px-6 py-4">
              <h3 className="text-lg font-bold text-zinc-900">Registrasi Unit Kavling</h3>
              <button onClick={() => setIsUnitModalOpen(false)} className="p-1 text-zinc-400 transition-colors hover:text-rose-500">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">ID Blok & Nomor</label>
                <input
                  type="text"
                  placeholder="Contoh: BLK-A12"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-mono transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Pilih Tipe Rumah</label>
                <select className="w-full cursor-pointer appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30">
                  <option value="" disabled selected>
                    Pilih Tipe Master...
                  </option>
                  {propertyTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name} - {formatRupiah(type.price)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Penyesuaian Harga (Markup Hook/Taman)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-zinc-500">+ Rp</span>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-12 pr-4 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
                <p className="mt-2 text-[10px] text-zinc-400">Kosongkan jika harga sama dengan Base Price tipe master.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 rounded-b-2xl border-t border-zinc-100 bg-zinc-50/50 px-6 py-4">
              <button
                onClick={() => setIsUnitModalOpen(false)}
                className="rounded-lg px-5 py-2.5 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-200"
              >
                Batal
              </button>
              <button className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-600/20 transition-all hover:bg-amber-700">
                Simpan Unit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
