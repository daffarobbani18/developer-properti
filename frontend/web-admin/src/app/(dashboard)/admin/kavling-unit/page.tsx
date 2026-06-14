"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Plus, X, Trash, CheckCircle, WarningCircle, Buildings, HouseLine, CircleNotch, House, Package, MapPin, ShieldCheck
} from "@phosphor-icons/react";

const formatRupiah = (number: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);

export default function KavlingUnitPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [projects, setProjects] = useState<any[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("Semua");
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"add" | "edit">("add");
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const defaultForm = {
    id: "",
    projectId: "",
    propertyTypeId: "",
    kawasan: "Cluster Utama",
    blok: "",
    nomor: "",
    priceMarkup: 0,
    statusPembangunan: "Pesan Bangun",
    statusPenjualan: "Tersedia",
    luasTanahAktual: "",
    svgPathId: "",
  };

  const [unitForm, setUnitForm] = useState(defaultForm);

  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkSubmitting, setBulkSubmitting] = useState(false);
  const [bulkForm, setBulkForm] = useState({
    projectId: "",
    propertyTypeId: "",
    kawasan: "Cluster Utama",
    blok: "",
    startNumber: 1,
    endNumber: 50,
    skipNumbers: "",
    statusPembangunan: "Pesan Bangun",
    statusPenjualan: "Tersedia",
    priceMarkup: 0,
  });

  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
        let token = "";
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          token = authData.token;
        }

      if (token) {
        const headers = { "Authorization": `Bearer ${token}` };

        // Fetch Projects
        const prjRes = await fetch("http://localhost:4000/api/projects", { headers });
        const fetchedProjects = await prjRes.json();
        const prjs = fetchedProjects.data || fetchedProjects;
        if (prjs && prjs.length > 0) {
          setProjects(prjs);
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
            id: u.id,
            projectId: u.projectId,
            projectName: u.project?.name || "Unknown",
            propertyTypeId: u.propertyTypeId,
            type: u.propertyType?.name || "Unknown",
            basePrice: u.propertyType?.basePrice || 0,
            priceMarkup: u.priceMarkup || 0,
            price: u.totalPrice || u.price || 0,
            statusPenjualan: u.statusPenjualan || u.status || "Tersedia",
            statusPembangunan: u.statusPembangunan || "Pesan Bangun",
            kawasan: u.kawasan,
            blok: u.blok,
            nomor: u.nomor,
            luasTanahAktual: u.luasTanahAktual || "",
            svgPathId: u.svgPathId || "",
          })));
        }
      }
    } catch (err) {
      console.error("Failed to fetch backend data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const selectedProjectData = projects.find(p => p.id === selectedProject);
  const plannedTotalUnits = selectedProjectData?.totalUnits || 0;

  const projectUnits = units.filter(u => u.projectId === selectedProject);
  const filteredUnits = projectUnits.filter(u => statusFilter === "Semua" ? true : u.statusPenjualan === statusFilter);
  const blocks = Array.from(new Set(filteredUnits.map(u => u.blok))).sort();

  const projectPropertyTypes = propertyTypes.filter(t => t.projectId === selectedProject);
  const totalTypesInProject = projectPropertyTypes.length;

  const availableCount = projectUnits.filter(u => u.statusPenjualan === "Tersedia").length;
  const soldCount = projectUnits.filter(u => u.statusPenjualan === "Terjual").length;

  const handleUnitSubmit = async () => {
    try {
      setSubmitting(true);
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
      let token = "";
      if (authDataStr) {
        const authData = JSON.parse(authDataStr);
        token = authData.token;
      }
      
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
        svgPathId: unitForm.svgPathId || undefined,
      };
      
      const endpoint = drawerMode === "edit" && unitForm.id 
        ? `http://localhost:4000/api/inventory/units/${unitForm.id}`
        : "http://localhost:4000/api/inventory/units";

      const res = await fetch(endpoint, {
        method: drawerMode === "edit" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast(`Gagal: ${err.message || err.error || res.statusText}`, 'error');
        return;
      }
      
      setDrawerOpen(false);
      await fetchData();
      showToast(`Berhasil ${drawerMode === 'edit' ? 'mengedit' : 'menambah'} kavling`, 'success');
    } catch (e) {
      console.error(e);
      showToast('Gagal memproses data kavling', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkSubmit = async () => {
    try {
      setBulkSubmitting(true);
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
      let token = "";
      if (authDataStr) {
        const authData = JSON.parse(authDataStr);
        token = authData.token;
      }
      
      const payload = {
        ...bulkForm,
        startNumber: Number(bulkForm.startNumber),
        endNumber: Number(bulkForm.endNumber),
        priceMarkup: Number(bulkForm.priceMarkup) || 0,
      };
      
      const res = await fetch("http://localhost:4000/api/inventory/units/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast(`Gagal: ${err.message || err.error || res.statusText}`, 'error');
        return;
      }
      
      setBulkModalOpen(false);
      await fetchData();
      showToast('Berhasil men-generate kavling secara massal', 'success');
    } catch (e) {
      console.error(e);
      showToast('Gagal memproses bulk generate', 'error');
    } finally {
      setBulkSubmitting(false);
    }
  };

  const executeDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      setSubmitting(true);
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
      let token = "";
      if (authDataStr) {
        const authData = JSON.parse(authDataStr);
        token = authData.token;
      }
      
      const res = await fetch(`http://localhost:4000/api/inventory/units/${deleteConfirmId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast(`Gagal menghapus: ${err.error || res.statusText}`, 'error');
        return;
      }
      
      setDeleteConfirmId(null);
      setDrawerOpen(false);
      await fetchData();
      showToast(`Berhasil menghapus kavling`, 'success');
    } catch (e) {
      console.error(e);
      showToast('Gagal memproses penghapusan kavling', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const openDrawerForEdit = (unit: any) => {
    setUnitForm({
      id: unit.id,
      projectId: unit.projectId,
      propertyTypeId: unit.propertyTypeId,
      kawasan: unit.kawasan,
      blok: unit.blok,
      nomor: unit.nomor,
      priceMarkup: unit.priceMarkup,
      statusPembangunan: unit.statusPembangunan,
      statusPenjualan: unit.statusPenjualan,
      luasTanahAktual: unit.luasTanahAktual,
      svgPathId: unit.svgPathId || "",
    });
    setDrawerMode("edit");
    setDrawerOpen(true);
  };

  const openDrawerForAdd = () => {
    setUnitForm({ ...defaultForm, projectId: selectedProject });
    setDrawerMode("add");
    setDrawerOpen(true);
  };

  const filteredTypes = propertyTypes.filter(t => !unitForm.projectId || t.projectId === unitForm.projectId);

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Tersedia": return "bg-emerald-50 text-emerald-600 border-emerald-200 ring-emerald-500 hover:bg-emerald-100 hover:border-emerald-300";
      case "Booked": return "bg-amber-50 text-amber-600 border-amber-200 ring-amber-500 hover:bg-amber-100 hover:border-amber-300";
      case "Terjual": return "bg-rose-50 text-rose-600 border-rose-200 ring-rose-500 hover:bg-rose-100 hover:border-rose-300";
      default: return "bg-zinc-50 text-zinc-600 border-zinc-200 ring-zinc-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* ZONA ATAS: Global Controls */}
      <div className="mb-8 flex flex-col gap-6">
        <div>
          <h2 className="mb-2 text-3xl font-[family-name:var(--font-heading)] text-zinc-900 flex items-center gap-3 tracking-tight">
            <MapPin className="text-amber-600" weight="duotone" size={32} />
            Visual Grid Kavling
          </h2>
          <p className="text-sm text-zinc-500">Denah interaktif pemetaan status kavling dan unit properti.</p>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="w-full md:w-1/3">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Pilih Proyek (Wajib)</label>
            <select 
              value={selectedProject}
              onChange={(e) => {
                setSelectedProject(e.target.value);
                setStatusFilter("Semua");
              }}
              className="w-full appearance-none rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 font-semibold text-zinc-800 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 cursor-pointer shadow-sm"
            >
              <option value="" disabled>-- Pilih Proyek --</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {selectedProject && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              {["Semua", "Tersedia", "Booked", "Terjual"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                    statusFilter === status 
                    ? "bg-zinc-900 text-white shadow-md" 
                    : "bg-white text-zinc-500 border border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  {status}
                </button>
              ))}
              
              <div className="h-8 w-px bg-zinc-200 mx-2"></div>
              
              <button
                onClick={() => {
                  setBulkForm({ ...bulkForm, projectId: selectedProject, propertyTypeId: "" });
                  setBulkModalOpen(true);
                }}
                className="flex whitespace-nowrap items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-zinc-900/20 transition-all hover:bg-zinc-800"
              >
                <Package weight="duotone" size={18} /> Generate Massal
              </button>
              
              <button
                onClick={openDrawerForAdd}
                className="flex whitespace-nowrap items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-600/20 transition-all hover:bg-amber-700"
              >
                <Plus weight="duotone" size={18} /> Tambah Unit
              </button>
            </div>
          )}
        </div>
      </div>

      {!selectedProject ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-32 text-center">
          <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
            <Buildings weight="duotone" className="text-zinc-400" size={48} />
          </div>
          <h3 className="mb-2 text-xl font-bold text-zinc-900">Pilih Proyek Terlebih Dahulu</h3>
          <p className="max-w-md text-sm text-zinc-500">
            Anda harus memilih proyek pada dropdown di atas untuk melihat visual grid dan detail kavling.
          </p>
        </div>
      ) : (
        <>
          {/* ZONA TENGAH: Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group flex items-center justify-between gap-4 p-5 rounded-2xl border border-zinc-100 bg-white shadow-sm">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider truncate">Target Kavling Proyek</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-zinc-900 tracking-tight">{plannedTotalUnits}</h3>
                  <p className="text-xs font-medium text-zinc-400">({projectUnits.length} di-generate)</p>
                </div>
              </div>
              <div className="icon-wrapper h-14 w-14 shrink-0 icon-blue">
                <Package weight="duotone" size={28} />
              </div>
            </div>

            <div className="group flex items-center justify-between gap-4 p-5 rounded-2xl border border-zinc-100 bg-white shadow-sm">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider truncate">Total Tipe Rumah</p>
                <h3 className="mt-1 text-3xl font-bold text-blue-600 tracking-tight">{totalTypesInProject}</h3>
              </div>
              <div className="icon-wrapper h-14 w-14 shrink-0 icon-violet">
                <House weight="duotone" size={28} />
              </div>
            </div>

            <div className="group flex items-center justify-between gap-4 p-5 rounded-2xl border border-emerald-100 bg-emerald-50/50 shadow-sm">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider truncate">Kavling Tersedia</p>
                <h3 className="mt-1 text-3xl font-bold text-emerald-700 tracking-tight">{availableCount}</h3>
              </div>
              <div className="icon-wrapper h-14 w-14 shrink-0 icon-emerald">
                <HouseLine weight="duotone" size={28} />
              </div>
            </div>

            <div className="group flex items-center justify-between gap-4 p-5 rounded-2xl border border-rose-100 bg-rose-50/50 shadow-sm">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider truncate">Kavling Terjual</p>
                <h3 className="mt-1 text-3xl font-bold text-rose-700 tracking-tight">{soldCount}</h3>
              </div>
              <div className="icon-wrapper h-14 w-14 shrink-0 icon-rose">
                <ShieldCheck weight="duotone" size={28} />
              </div>
            </div>
          </div>

          {/* ZONA BAWAH: Visual Grid */}
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50/50 p-6 shadow-inner">
            {blocks.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-zinc-500">Tidak ada kavling yang sesuai dengan filter.</p>
              </div>
            ) : (
              <div className="space-y-10">
                {blocks.map((blok) => {
                  const blockUnits = filteredUnits.filter(u => u.blok === blok).sort((a, b) => {
                     // Sort numeric logic for numbers like "01", "02"
                     const numA = parseInt(a.nomor) || 0;
                     const numB = parseInt(b.nomor) || 0;
                     return numA - numB;
                  });

                  return (
                    <div key={blok} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-zinc-200"></div>
                        <h3 className="rounded-full bg-zinc-200 px-4 py-1 text-sm font-bold text-zinc-700 uppercase tracking-widest">
                          Blok {blok}
                        </h3>
                        <div className="h-px flex-1 bg-zinc-200"></div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10">
                        {blockUnits.map((unit) => (
                          <button
                            key={unit.id}
                            onClick={() => openDrawerForEdit(unit)}
                            className={`group relative flex aspect-square w-full flex-col items-center justify-center rounded-xl border-2 transition-all duration-200 hover:scale-[1.05] hover:shadow-lg focus:outline-none focus:ring-4 ${getStatusColor(unit.statusPenjualan)}`}
                          >
                            <span className="text-[10px] font-semibold opacity-70 uppercase tracking-widest">Blok {unit.blok}</span>
                            <span className="text-xl font-black mt-1 leading-none">{unit.nomor}</span>
                            <span className="text-[10px] font-bold mt-1 opacity-80 truncate w-[90%] text-center leading-none">{unit.type}</span>
                            
                            {/* Tooltip Overlay */}
                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                               <span className="text-xs text-white font-semibold">Detail</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* MODAL: Centered Pop-up */}
      {drawerOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm transition-all duration-300">
          
          {/* Modal Panel */}
          <div className="w-full max-w-xl max-h-[90vh] flex flex-col animate-in zoom-in-95 rounded-2xl bg-white shadow-2xl duration-200 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
              <div>
                <h3 className="text-lg font-bold text-zinc-900">{drawerMode === "add" ? "Tambah Unit Kavling" : `Edit Unit Blok ${unitForm.blok}-${unitForm.nomor}`}</h3>
                {drawerMode === "edit" && <p className="text-xs text-zinc-500">ID: {unitForm.id.substring(0, 8)}...</p>}
              </div>
              <button onClick={() => setDrawerOpen(false)} className="rounded-full p-2 text-zinc-400 hover:bg-rose-100 hover:text-rose-600 transition-colors">
                <X weight="bold" size={20} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              <div className="rounded-xl bg-blue-50 p-4 border border-blue-100">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-blue-700">Tipe Rumah</label>
                <select 
                  value={unitForm.propertyTypeId} 
                  onChange={(e) => setUnitForm({ ...unitForm, propertyTypeId: e.target.value })}
                  className="w-full cursor-pointer appearance-none rounded-lg border-none bg-white px-4 py-3 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>-- Pilih Tipe --</option>
                  {filteredTypes.map((type) => (
                    <option key={type.id} value={String(type.id)}>
                      {type.name} - {formatRupiah(type.price || type.basePrice)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Blok</label>
                  <input
                    type="text"
                    value={unitForm.blok}
                    onChange={(e) => setUnitForm({ ...unitForm, blok: e.target.value })}
                    placeholder="A"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Nomor</label>
                  <input
                    type="text"
                    value={unitForm.nomor}
                    onChange={(e) => setUnitForm({ ...unitForm, nomor: e.target.value })}
                    placeholder="01"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Kawasan / Cluster</span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">Opsional</span>
                </label>
                <input
                  type="text"
                  value={unitForm.kawasan}
                  onChange={(e) => setUnitForm({ ...unitForm, kawasan: e.target.value })}
                  placeholder="Contoh: Cluster Arcadia"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Luas Tanah Aktual (m²)</label>
                <input
                  type="number"
                  value={unitForm.luasTanahAktual}
                  onChange={(e) => setUnitForm({ ...unitForm, luasTanahAktual: e.target.value })}
                  placeholder="Isi jika berbeda dari standar tipe"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="h-px bg-zinc-100"></div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Status Penjualan</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Tersedia", "Booked", "Terjual"].map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setUnitForm({ ...unitForm, statusPenjualan: status })}
                      className={`rounded-lg py-2 text-xs font-bold border-2 transition-all ${
                        unitForm.statusPenjualan === status 
                          ? status === "Tersedia" ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : status === "Booked" ? "border-amber-500 bg-amber-50 text-amber-700"
                            : "border-rose-500 bg-rose-50 text-rose-700"
                          : "border-transparent bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Status Pembangunan</label>
                <select 
                  value={unitForm.statusPembangunan} 
                  onChange={(e) => setUnitForm({ ...unitForm, statusPembangunan: e.target.value })}
                  className="w-full cursor-pointer appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Pesan Bangun">Pesan Bangun (Indent)</option>
                  <option value="Sedang Dibangun" disabled>Sedang Dibangun (WIP)</option>
                  <option value="Siap Huni">Siap Huni (Ready Stock)</option>
                </select>
              </div>

              <div>
                <label className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Markup Harga (Hook/Posisi Strategis)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">Rp</span>
                  <input
                    type="number"
                    value={unitForm.priceMarkup || ""}
                    onChange={(e) => setUnitForm({ ...unitForm, priceMarkup: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-12 pr-4 text-sm font-semibold transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600">SVG Path ID (Opsional)</span>
                </label>
                <input
                  type="text"
                  value={unitForm.svgPathId || ""}
                  onChange={(e) => setUnitForm({ ...unitForm, svgPathId: e.target.value })}
                  placeholder="Contoh: A-01"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row-reverse sm:justify-start gap-3 px-6 py-4 border-t border-zinc-100 bg-zinc-50/50">
              <button 
                onClick={handleUnitSubmit} 
                disabled={!unitForm.propertyTypeId || submitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-amber-600/30 transition-all hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? <CircleNotch weight="bold" className="animate-spin h-5 w-5" /> : "Simpan Perubahan"}
              </button>
              
              {drawerMode === "edit" && (
                <button
                  onClick={() => setDeleteConfirmId(unitForm.id)}
                  className="w-full sm:w-auto rounded-xl bg-white border border-rose-200 px-6 py-3 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-50"
                >
                  Hapus Kavling
                </button>
              )}
              
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-full sm:w-auto rounded-xl bg-white border border-zinc-200 px-6 py-3 text-sm font-bold text-zinc-600 transition-colors hover:bg-zinc-100 sm:mr-auto"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      , document.body)}

      {/* Modal Konfirmasi Hapus */}
      {deleteConfirmId && mounted && createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm animate-in zoom-in-95 flex flex-col items-center rounded-3xl bg-white p-6 shadow-2xl duration-200 text-center border-2 border-rose-100">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <WarningCircle weight="duotone" size={32} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-zinc-900">Hapus Kavling?</h3>
            <p className="mb-8 text-sm text-zinc-500">
              Data tidak bisa dikembalikan setelah dihapus.
            </p>
            <div className="flex w-full gap-3">
              <button 
                onClick={() => setDeleteConfirmId(null)} 
                className="flex-1 rounded-xl bg-zinc-100 py-3 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-200"
              >
                Batal
              </button>
              <button 
                onClick={executeDelete} 
                disabled={submitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 py-3 text-sm font-bold text-white shadow-md shadow-rose-600/20 transition-all hover:bg-rose-700 disabled:opacity-50"
              >
                {submitting ? <CircleNotch weight="bold" className="animate-spin h-4 w-4" /> : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Toast Notification */}
      {toast && mounted && createPortal(
        <div className="fixed top-6 left-6 right-6 sm:left-auto sm:right-6 sm:max-w-sm z-[300] animate-in slide-in-from-top-5 fade-in duration-300">
          <div className={`flex items-center gap-3 rounded-2xl px-5 py-4 shadow-xl ${
            toast.type === 'success' 
              ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
              : 'bg-rose-500 text-white shadow-rose-500/20'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle weight="fill" className="h-6 w-6" />
            ) : (
              <WarningCircle weight="fill" className="h-6 w-6" />
            )}
            <p className="text-sm font-semibold">{toast.message}</p>
            <button 
              onClick={() => setToast(null)}
              className="ml-auto rounded-full p-1 hover:bg-white/20 transition-colors"
            >
              <X weight="bold" className="h-4 w-4" />
            </button>
          </div>
        </div>,
        document.body
      )}
      {/* BULK GENERATE MODAL */}
      {mounted && bulkModalOpen && createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-900">Generate Unit Massal</h3>
                <p className="text-sm text-zinc-500">Buat banyak unit sekaligus dengan urutan nomor</p>
              </div>
              <button 
                onClick={() => setBulkModalOpen(false)}
                className="rounded-full bg-zinc-100 p-2 text-zinc-500 transition-colors hover:bg-zinc-200"
              >
                <X weight="bold" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-6 py-6 hide-scrollbar space-y-5">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Pilih Tipe Rumah (Wajib)</label>
                <select 
                  value={bulkForm.propertyTypeId} 
                  onChange={(e) => setBulkForm({ ...bulkForm, propertyTypeId: e.target.value })}
                  className="w-full cursor-pointer appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="" disabled>-- Pilih Tipe --</option>
                  {filteredTypes.map((type) => (
                    <option key={type.id} value={String(type.id)}>
                      {type.name} - {formatRupiah(type.price || type.basePrice)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Kawasan</span>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">Opsional</span>
                  </label>
                  <input
                    type="text"
                    value={bulkForm.kawasan}
                    onChange={(e) => setBulkForm({ ...bulkForm, kawasan: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Blok</label>
                  <input
                    type="text"
                    value={bulkForm.blok}
                    onChange={(e) => setBulkForm({ ...bulkForm, blok: e.target.value })}
                    placeholder="Contoh: A"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Mulai dari Nomor</label>
                  <input
                    type="number"
                    value={bulkForm.startNumber}
                    onChange={(e) => setBulkForm({ ...bulkForm, startNumber: Number(e.target.value) })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Sampai Nomor</label>
                  <input
                    type="number"
                    value={bulkForm.endNumber}
                    onChange={(e) => setBulkForm({ ...bulkForm, endNumber: Number(e.target.value) })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Lewati Nomor (Pengecualian)</span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">Opsional</span>
                </label>
                <input
                  type="text"
                  value={bulkForm.skipNumbers}
                  onChange={(e) => setBulkForm({ ...bulkForm, skipNumbers: e.target.value })}
                  placeholder="Contoh: 4, 13, 14"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <p className="mt-1.5 text-xs text-zinc-500">Pisahkan dengan koma. Nomor ini tidak akan dibuat.</p>
              </div>

              <div className="h-px bg-zinc-100"></div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Status Penjualan</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Tersedia", "Booked", "Terjual"].map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setBulkForm({ ...bulkForm, statusPenjualan: status })}
                      className={`rounded-lg py-2 text-xs font-bold border-2 transition-all ${
                        bulkForm.statusPenjualan === status 
                          ? status === "Tersedia" ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : status === "Booked" ? "border-amber-500 bg-amber-50 text-amber-700"
                            : "border-rose-500 bg-rose-50 text-rose-700"
                          : "border-transparent bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Status Pembangunan</label>
                <select 
                  value={bulkForm.statusPembangunan} 
                  onChange={(e) => setBulkForm({ ...bulkForm, statusPembangunan: e.target.value })}
                  className="w-full cursor-pointer appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Pesan Bangun">Pesan Bangun (Indent)</option>
                  <option value="Sedang Dibangun" disabled>Sedang Dibangun (WIP)</option>
                  <option value="Siap Huni">Siap Huni (Ready Stock)</option>
                </select>
              </div>

              <div>
                <label className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Markup Harga per Unit</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">Rp</span>
                  <input
                    type="number"
                    value={bulkForm.priceMarkup || ""}
                    onChange={(e) => setBulkForm({ ...bulkForm, priceMarkup: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-12 pr-4 text-sm font-semibold transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

            </div>

            <div className="flex flex-col sm:flex-row-reverse sm:justify-start gap-3 px-6 py-4 border-t border-zinc-100 bg-zinc-50/50">
              <button 
                onClick={handleBulkSubmit} 
                disabled={!bulkForm.propertyTypeId || !bulkForm.blok || bulkSubmitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-zinc-900/30 transition-all hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bulkSubmitting ? <CircleNotch weight="bold" className="animate-spin h-5 w-5" /> : "Mulai Generate"}
              </button>
              
              <button
                onClick={() => setBulkModalOpen(false)}
                className="w-full sm:w-auto rounded-xl bg-white border border-zinc-200 px-6 py-3 text-sm font-bold text-zinc-600 transition-colors hover:bg-zinc-100 sm:mr-auto"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      , document.body)}

    </div>
  );
}
