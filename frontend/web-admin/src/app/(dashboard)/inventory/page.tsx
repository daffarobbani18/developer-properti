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
  const [propertyTypes] = useState<PropertyType[]>(propertyTypesSeed);
  const [units] = useState<UnitItem[]>(unitsSeed);

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
    <>
      {/* Internal Tabs Navigation */}
      <div className="mb-6 overflow-x-auto border-b border-zinc-200">
        <nav className="-mb-px flex space-x-6 sm:space-x-8">
          {[
            { id: "dashboard", icon: LayoutDashboard, label: "Overview" },
            { id: "types", icon: Home, label: "Tipe Rumah" },
            { id: "units", icon: Box, label: "Kavling & Unit" },
            { id: "siteplan", icon: Map, label: "Site Plan" },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`group inline-flex whitespace-nowrap items-center gap-2 border-b-2 py-3 px-1 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-amber-500 text-amber-600"
                    : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
                }`}
              >
                <Icon size={18} className={isActive ? "text-amber-500" : "text-zinc-400 group-hover:text-zinc-500"} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="animate-in fade-in duration-500">
        {activeMenu === "dashboard" && renderDashboard()}
        {activeMenu === "types" && renderTypes()}
        {activeMenu === "units" && renderUnits()}
        {activeMenu === "siteplan" && renderSitePlan()}
      </div>

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
    </>
  );
}
