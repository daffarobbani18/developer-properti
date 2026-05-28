"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  PencilSimple, Trash, MagnifyingGlass, Plus, X
} from "@phosphor-icons/react";

const formatRupiah = (number: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);

export default function KavlingUnitPage() {
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [units, setUnits] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [unitForm, setUnitForm] = useState({
    projectId: "",
    propertyTypeId: "",
    kawasan: "Cluster Utama",
    blok: "",
    nomor: "",
    priceMarkup: 0,
    statusPembangunan: "Pesan Bangun",
    statusPenjualan: "Tersedia",
    luasTanahAktual: "",
  });

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        setLoading(true);
        const loginRes = await fetch("http://localhost:4000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "superadmin@erp.com", password: "password123" })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;

        if (token) {
          const headers = { "Authorization": `Bearer ${token}` };

          // Fetch Projects
          const prjRes = await fetch("http://localhost:4000/api/projects", { headers });
          const fetchedProjects = await prjRes.json();
          if (fetchedProjects && fetchedProjects.length > 0) {
            setProjects(fetchedProjects);
          }

          // Fetch Property Types
          const ptRes = await fetch("http://localhost:4000/api/inventory/types", { headers });
          const fetchedTypesJson = await ptRes.json();
          const fetchedTypes = fetchedTypesJson.data || fetchedTypesJson;
          if (fetchedTypes && fetchedTypes.length > 0) {
            setPropertyTypes(fetchedTypes);
          }

          // Fetch Units
          const unRes = await fetch("http://localhost:4000/api/inventory/units", { headers });
          const unsJson = await unRes.json();
          const uns = unsJson.data || unsJson;
          if (uns && uns.length > 0) {
            setUnits(uns.map((u: any) => ({
              id: `${u.kawasan}-${u.blok}-${u.nomor}`,
              projectName: u.project?.name || "Unknown",
              type: u.propertyType?.name || "Unknown",
              basePrice: u.propertyType?.basePrice || 0,
              price: u.totalPrice || u.price || 0,
              status: u.statusPenjualan || u.status || "Tersedia",
              kawasan: u.kawasan,
            })));
          }
        }
      } catch (err) {
        console.error("Failed to fetch backend data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUnitSubmit = async () => {
    try {
      const loginRes = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "superadmin@erp.com", password: "password123" })
      });
      const { token } = await loginRes.json();
      
      const payload = {
        projectId: unitForm.projectId,
        propertyTypeId: unitForm.propertyTypeId,
        kawasan: unitForm.kawasan,
        blok: unitForm.blok,
        nomor: unitForm.nomor,
        statusPembangunan: unitForm.statusPembangunan,
        statusPenjualan: unitForm.statusPenjualan,
        priceMarkup: Number(unitForm.priceMarkup) || 0,
        luasTanahAktual: unitForm.luasTanahAktual ? Number(unitForm.luasTanahAktual) : undefined,
      };
      
      const res = await fetch("http://localhost:4000/api/inventory/units", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(`Gagal: ${err.message || res.statusText || "Internal Server Error"}`);
        return;
      }
      
      setIsUnitModalOpen(false);
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredTypes = propertyTypes.filter(t => !unitForm.projectId || t.projectId === unitForm.projectId);

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="mb-2 text-3xl font-[family-name:var(--font-heading)] text-zinc-900">Data Kavling & Unit</h2>
          <p className="text-sm text-zinc-500">Pemecahan kavling dan penetapan spesifikasi per unit berdasar Proyek & Tipe.</p>
        </div>
        <div className="flex w-full items-center gap-3 sm:w-auto">
          <div className="relative w-full sm:w-64">
            <MagnifyingGlass weight="duotone" className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input
              type="text"
              placeholder="Cari ID Blok/Unit..."
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
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Kawasan</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">ID Unit / Blok</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Proyek</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Tipe Rumah</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Total Harga</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {units.map((unit) => (
                <tr key={unit.id} className="group transition-colors hover:bg-zinc-50">
                  <td className="px-6 py-4 text-sm font-medium text-zinc-600">{unit.kawasan}</td>
                  <td className="px-6 py-4 font-mono text-sm font-bold text-zinc-900">{unit.id}</td>
                  <td className="px-6 py-4 text-sm text-zinc-600">{unit.projectName}</td>
                  <td className="px-6 py-4 text-sm font-medium text-zinc-600">{unit.type}</td>
                  <td className="px-6 py-4 text-sm font-medium text-zinc-900">{formatRupiah(unit.price)}</td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
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

      {/* Modal Tambah Unit */}
      {isUnitModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg flex flex-col max-h-[90vh] animate-in zoom-in-95 rounded-2xl bg-white shadow-2xl duration-200">
            <div className="flex items-center justify-between rounded-t-2xl border-b border-zinc-100 bg-zinc-50/50 px-6 py-4">
              <h3 className="text-lg font-bold text-zinc-900">Registrasi Unit Kavling Baru</h3>
              <button onClick={() => setIsUnitModalOpen(false)} className="p-1 text-zinc-400 transition-colors hover:text-rose-500">
                <X weight="duotone" size={20} />
              </button>
            </div>
            <div className="space-y-5 p-6 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Pilih Proyek Induk</label>
                <select 
                  value={unitForm.projectId} 
                  onChange={(e) => setUnitForm({ ...unitForm, projectId: e.target.value, propertyTypeId: "" })}
                  className="w-full cursor-pointer appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                >
                  <option value="" disabled>-- Pilih Proyek --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Pilih Tipe Rumah (Katalog)</label>
                <select 
                  value={unitForm.propertyTypeId} 
                  onChange={(e) => setUnitForm({ ...unitForm, propertyTypeId: e.target.value })}
                  disabled={!unitForm.projectId}
                  className="w-full cursor-pointer appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 disabled:opacity-50"
                >
                  <option value="" disabled>-- Pilih Tipe (Sesuai Proyek) --</option>
                  {filteredTypes.map((type) => (
                    <option key={type.id} value={String(type.id)}>
                      {type.name} - {formatRupiah(type.price || type.basePrice)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Kawasan/Cluster</label>
                  <input
                    type="text"
                    value={unitForm.kawasan}
                    onChange={(e) => setUnitForm({ ...unitForm, kawasan: e.target.value })}
                    placeholder="Cluster Anggrek"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Blok</label>
                  <input
                    type="text"
                    value={unitForm.blok}
                    onChange={(e) => setUnitForm({ ...unitForm, blok: e.target.value })}
                    placeholder="A"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Nomor Kavling</label>
                  <input
                    type="text"
                    value={unitForm.nomor}
                    onChange={(e) => setUnitForm({ ...unitForm, nomor: e.target.value })}
                    placeholder="01"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-mono transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Luas Tanah Aktual (m2)</label>
                  <input
                    type="number"
                    value={unitForm.luasTanahAktual}
                    onChange={(e) => setUnitForm({ ...unitForm, luasTanahAktual: e.target.value })}
                    placeholder="opsional"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Status Pembangunan</label>
                <select 
                  value={unitForm.statusPembangunan} 
                  onChange={(e) => setUnitForm({ ...unitForm, statusPembangunan: e.target.value })}
                  className="w-full cursor-pointer appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                >
                  <option value="Pesan Bangun">Pesan Bangun (Indent)</option>
                  <option value="Sedang Dibangun">Sedang Dibangun (WIP)</option>
                  <option value="Siap Huni">Siap Huni (Ready Stock)</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Penyesuaian Harga (Markup Hook/Strategis)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-zinc-500">+ Rp</span>
                  <input
                    type="number"
                    value={unitForm.priceMarkup || ""}
                    onChange={(e) => setUnitForm({ ...unitForm, priceMarkup: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-12 pr-4 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
                <p className="mt-2 text-[10px] text-zinc-400">Total Harga = Base Price Tipe + Markup ini.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 rounded-b-2xl border-t border-zinc-100 bg-zinc-50/50 px-6 py-4">
              <button
                onClick={() => setIsUnitModalOpen(false)}
                className="rounded-lg px-5 py-2.5 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-200"
              >
                Batal
              </button>
              <button 
                onClick={handleUnitSubmit} 
                disabled={!unitForm.projectId || !unitForm.propertyTypeId}
                className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-600/20 transition-all hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Simpan Unit
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

