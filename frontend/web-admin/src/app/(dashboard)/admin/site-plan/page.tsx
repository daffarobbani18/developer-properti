"use client";

import { useEffect, useMemo, useState } from "react";
import {
  User, PencilSimple, Trash, CloudArrowUp, MagnifyingGlass, SquaresFour, Bathtub, List, CornersOut, Bed, X, Plus, ShieldCheck, MapTrifold, CalendarBlank, House, Bell, MapPin, CaretRight, Package, DotsThreeVertical, WarningCircle
} from "@phosphor-icons/react";

type PropertyType = {
  id: string | number;
  name: string;
  lt: number;
  lb: number;
  bed: number;
  bath: number;
  price: number;
  imageUrl?: string;
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
  const [activeMenu, setActiveMenu] = useState("siteplan");
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  
  // Real data state
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>(propertyTypesSeed);
  const [units, setUnits] = useState<UnitItem[]>(unitsSeed);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Step 1: Login to get token (using dummy admin/admin as planned)
        const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
        let token = "";
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          token = authData.token;
        }

        if (token) {
          // Step 2: Fetch Property Types
          const ptRes = await fetch("http://localhost:4000/api/inventory/types", {
            headers: { "Authorization": `Bearer ${token}` }
          });
          const pts = await ptRes.json();
          
          // MapTrifold backend format to frontend format if there's any data
          if (pts && pts.length > 0) {
            setPropertyTypes(pts.map((p: any) => ({
              id: p.id,
              name: p.name,
              lt: p.luasTanah,
              lb: p.luasBangunan,
              bed: p.bedrooms,
              bath: p.bathrooms,
              price: p.price,
              imageUrl: p.imageUrl || undefined
            })));
          }

          // Step 3: Fetch Units
          const unRes = await fetch("http://localhost:4000/api/inventory/units", {
            headers: { "Authorization": `Bearer ${token}` }
          });
          const uns = await unRes.json();
          
          if (uns && uns.length > 0) {
            setUnits(uns.map((u: any) => ({
              id: `BLK-${u.blok}${u.nomorUnit}`,
              type: u.propertyType?.name || "Unknown",
              price: u.price,
              status: u.status
            })));
          }
        }
      } catch (err) {
        console.error("Failed to fetch backend data, falling back to mock", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [typeForm, setTypeForm] = useState<{
    name: string;
    lt: number;
    lb: number;
    bed: number;
    bath: number;
    price: number;
    imageUrl: string;
    imageFile: File | null;
  }>({ name: "", lt: 0, lb: 0, bed: 0, bath: 0, price: 0, imageUrl: "", imageFile: null });
  const [unitForm, setUnitForm] = useState({ blok: "", nomorUnit: "", propertyTypeId: "", priceAdjustment: 0 });

  const handleTypeSubmit = async () => {
    try {
      const loginRes = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "admin", password: "admin" })
      });
      const { token } = await loginRes.json();
      
      let uploadedImageUrl = typeForm.imageUrl;

      if (typeForm.imageFile) {
        const formData = new FormData();
        formData.append("image", typeForm.imageFile);
        
        const uploadRes = await fetch("http://localhost:4000/api/upload", {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (uploadData.imageUrl) {
          uploadedImageUrl = `http://localhost:4000${uploadData.imageUrl}`;
        }
      }
      
      const payload = {
        projectId: "PRJ001", // Default project for now
        name: typeForm.name,
        luasTanah: typeForm.lt,
        luasBangunan: typeForm.lb,
        bedrooms: typeForm.bed,
        bathrooms: typeForm.bath,
        price: typeForm.price,
        imageUrl: uploadedImageUrl || null
      };
      
      await fetch("http://localhost:4000/api/inventory/types", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      setIsTypeModalOpen(false);
      window.location.reload(); // ArrowsClockwise data
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnitSubmit = async () => {
    try {
      const loginRes = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "admin", password: "admin" })
      });
      const { token } = await loginRes.json();
      
      // Extract Blok and Nomor from input, e.g. "BLK-A12" -> "A" and "12"
      // Simplification: use as is for nomorUnit
      const pt = propertyTypes.find((p) => String(p.id) === unitForm.propertyTypeId);
      const basePrice = pt ? pt.price : 0;
      
      const payload = {
        projectId: "PRJ001", // Default project
        propertyTypeId: unitForm.propertyTypeId,
        blok: unitForm.blok || "BLK",
        nomorUnit: unitForm.nomorUnit,
        price: basePrice + Number(unitForm.priceAdjustment),
        status: "Tersedia"
      };
      
      await fetch("http://localhost:4000/api/inventory/units", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      setIsUnitModalOpen(false);
      window.location.reload(); // ArrowsClockwise data
    } catch (e) {
      console.error(e);
    }
  };

  const renderDashboard = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="mb-2 text-3xl font-[family-name:var(--font-heading)] text-zinc-900">Dasbor Inventaris</h2>
        <p className="text-sm text-zinc-500">Ringkasan ketersediaan aset properti saat ini.</p>
      </div>

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
        ].map((stat, idx) => (
          <div key={idx} className="stat-card group flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-600 truncate">{stat.label}</p>
              <h3 className="mt-1 text-3xl font-bold text-zinc-900 tracking-tight">{stat.value}</h3>
            </div>
            <div className={`icon-wrapper h-14 w-14 shrink-0 ${stat.bg === 'bg-blue-50' ? 'icon-blue' : stat.bg === 'bg-emerald-50' ? 'icon-emerald' : stat.bg === 'bg-amber-50' ? 'icon-amber' : stat.bg === 'bg-rose-50' ? 'icon-rose' : 'icon-violet'}`}>
              <stat.icon weight="duotone" size={28} />
            </div>
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
          <h2 className="mb-2 text-3xl font-[family-name:var(--font-heading)] text-zinc-900">Master Tipe Rumah</h2>
          <p className="text-sm text-zinc-500">Kelola spesifikasi dan harga dasar cetak biru properti.</p>
        </div>
        <button
          onClick={() => setIsTypeModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-600/20 transition-all hover:bg-amber-700"
        >
          <Plus weight="duotone" size={18} /> Tambah Tipe
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {propertyTypes.map((type) => (
          <div key={type.id} className="group overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-all hover:shadow-md">
            <div className="relative h-48 overflow-hidden bg-zinc-100">
              {type.imageUrl ? (
                <img
                  src={type.imageUrl}
                  alt={type.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-300 transition-transform duration-500 group-hover:scale-105">
                  <House weight="duotone" size={64} strokeWidth={1} />
                </div>
              )}
              <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-zinc-700 shadow-sm backdrop-blur-sm">
                Tipe {type.lt}/{type.lb}
              </div>
            </div>
            <div className="p-6">
              <h4 className="mb-4 text-xl font-[family-name:var(--font-heading)] text-zinc-900">{type.name}</h4>
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <CornersOut weight="duotone" size={16} className="text-amber-600" /> LT {type.lt} m²
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <Package weight="duotone" size={16} className="text-amber-600" /> LB {type.lb} m²
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <Bed weight="duotone" size={16} className="text-amber-600" /> {type.bed} Kamar
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <Bathtub weight="duotone" size={16} className="text-amber-600" /> {type.bath} Mandi
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
                <p className="text-lg font-bold text-zinc-900">{formatRupiah(type.price)}</p>
                <button className="text-zinc-400 transition-colors hover:text-amber-600">
                  <PencilSimple weight="duotone" size={18} />
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
          <h2 className="mb-2 text-3xl font-[family-name:var(--font-heading)] text-zinc-900">Data Kavling & Unit</h2>
          <p className="text-sm text-zinc-500">Database unit fisik berdasarkan blok dan nomor.</p>
        </div>
        <div className="flex w-full items-center gap-3 sm:w-auto">
          <div className="relative w-full sm:w-64">
            <MagnifyingGlass weight="duotone" className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
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
            <Plus weight="duotone" size={18} /> Tambah Unit
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
                        <PencilSimple weight="duotone" size={16} />
                      </button>
                      <button className="rounded-md border border-zinc-200 bg-white p-2 text-zinc-400 hover:text-rose-600">
                        <Trash weight="duotone" size={16} />
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
        <h2 className="mb-2 text-3xl font-[family-name:var(--font-heading)] text-zinc-900 flex items-center gap-3 tracking-tight">
          <MapTrifold className="text-amber-600" weight="duotone" size={32} />
          Master Site Plan
        </h2>
        <p className="text-sm text-zinc-500">Unggah dan kelola peta digital untuk Web Marketing.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/30 p-12 text-center transition-colors hover:bg-amber-50">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-amber-100 bg-white shadow-sm">
              <CloudArrowUp weight="duotone" size={28} className="text-amber-500" />
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
                <MapTrifold weight="duotone" size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-zinc-900">Master Plan Tahap 1</h4>
                <p className="text-xs text-zinc-500">Diperbarui 2 hari lalu</p>
              </div>
              <DotsThreeVertical weight="duotone" size={16} className="cursor-pointer text-zinc-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>


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
                <X weight="duotone" size={20} />
              </button>
            </div>
            <div className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Nama Tipe Rumah</label>
                <input
                  type="text"
                  value={typeForm.name}
                  onChange={(e) => setTypeForm({ ...typeForm, name: e.target.value })}
                  placeholder="Contoh: The Astoria Signature"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Luas Tanah (m²)</label>
                  <input
                    type="number"
                    value={typeForm.lt || ""}
                    onChange={(e) => setTypeForm({ ...typeForm, lt: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Luas Bangunan (m²)</label>
                  <input
                    type="number"
                    value={typeForm.lb || ""}
                    onChange={(e) => setTypeForm({ ...typeForm, lb: Number(e.target.value) })}
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
                    value={typeForm.bed || ""}
                    onChange={(e) => setTypeForm({ ...typeForm, bed: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Kamar Mandi</label>
                  <input
                    type="number"
                    value={typeForm.bath || ""}
                    onChange={(e) => setTypeForm({ ...typeForm, bath: Number(e.target.value) })}
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
                    value={typeForm.price || ""}
                    onChange={(e) => setTypeForm({ ...typeForm, price: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Upload Gambar Properti (Lokal)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setTypeForm({ ...typeForm, imageFile: e.target.files ? e.target.files[0] : null })}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 file:mr-4 file:rounded-md file:border-0 file:bg-amber-100 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-amber-700 hover:file:bg-amber-200"
                />
                <p className="mt-1 text-[10px] text-zinc-500">Pilih file dari komputer Anda (akan di-upload ke server).</p>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Atau URL Eksternal (Opsional)</label>
                <input
                  type="text"
                  value={typeForm.imageUrl}
                  onChange={(e) => setTypeForm({ ...typeForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/... (diabaikan jika upload file)"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 rounded-b-2xl border-t border-zinc-100 bg-zinc-50/50 px-6 py-4">
              <button
                onClick={() => setIsTypeModalOpen(false)}
                className="rounded-lg px-5 py-2.5 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-200"
              >
                Batal
              </button>
              <button onClick={handleTypeSubmit} className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-600/20 transition-all hover:bg-amber-700">
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
                <X weight="duotone" size={20} />
              </button>
            </div>
            <div className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Nomor Kavling/Unit</label>
                <input
                  type="text"
                  value={unitForm.nomorUnit}
                  onChange={(e) => setUnitForm({ ...unitForm, nomorUnit: e.target.value })}
                  placeholder="Contoh: A12"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-mono transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Pilih Tipe Rumah</label>
                <select 
                  value={unitForm.propertyTypeId} 
                  onChange={(e) => setUnitForm({ ...unitForm, propertyTypeId: e.target.value })}
                  className="w-full cursor-pointer appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                >
                  <option value="" disabled>
                    Pilih Tipe Master...
                  </option>
                  {propertyTypes.map((type) => (
                    <option key={type.id} value={String(type.id)}>
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
                    value={unitForm.priceAdjustment || ""}
                    onChange={(e) => setUnitForm({ ...unitForm, priceAdjustment: Number(e.target.value) })}
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
              <button onClick={handleUnitSubmit} className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-600/20 transition-all hover:bg-amber-700">
                Simpan Unit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
