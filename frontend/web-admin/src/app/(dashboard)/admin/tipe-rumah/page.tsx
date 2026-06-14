"use client";

import { useEffect, useState, useMemo } from "react";
import CreatableSelect from 'react-select/creatable';
import { createPortal } from "react-dom";
import {
  PencilSimple, CornersOut, Bed, Bathtub, Package, House, Plus, X, Trash, UploadSimple, Eye, WarningCircle, List, CaretDown, CaretRight, CheckCircle, Stack, Hammer
} from "@phosphor-icons/react";

const formatRupiah = (number: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);

export default function TipeRumahPage() {
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>("ALL");

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [viewerImage, setViewerImage] = useState<string | null>(null);
  const [detailType, setDetailType] = useState<any | null>(null);

  const [typeForm, setTypeForm] = useState({
    projectId: "",
    name: "",
    lt: 0,
    lb: 0,
    bed: 0,
    bath: 0,
    price: 0,
    estimasiRab: 0,
    facilities: "",
    imageUrl: "",
    milestoneGroups: [] as { category: string; isCollapsed: boolean; items: { name: string; bobotPersentase: number }[] }[],
    id: undefined as string | undefined,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formStep, setFormStep] = useState<1 | 2>(1);
  const [detailStep, setDetailStep] = useState<1 | 2>(1);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

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
          // Fetch Projects
          const prjRes = await fetch("http://localhost:4000/api/projects", {
            headers: { "Authorization": `Bearer ${token}` }
          });
          const fetchedProjects = await prjRes.json();
          if (fetchedProjects && fetchedProjects.length > 0) {
            setProjects(fetchedProjects);
          }

          // Fetch Property Types
          const ptRes = await fetch("http://localhost:4000/api/inventory/types", {
            headers: { "Authorization": `Bearer ${token}` }
          });
          const ptsJson = await ptRes.json();
          const pts = ptsJson.data || ptsJson;
          
          if (pts && pts.length > 0) {
            setPropertyTypes(pts.map((p: any) => ({
              id: p.id,
              projectId: p.projectId || p.project?.id,
              name: p.name,
              projectName: p.project?.name || "Unknown",
              lt: p.luasTanah,
              lb: p.luasBangunan,
              bed: p.kamarTidur || p.bedrooms || 0,
              bath: p.kamarMandi || p.bathrooms || 0,
              price: p.basePrice || p.price || 0,
              estimasiRab: p.estimasiRab,
              imageUrl: p.imageUrl || "",
              facilities: p.facilities || "",
              milestoneTemplates: p.milestoneTemplates?.map((m: any) => ({ category: m.category || "", name: m.name, bobotPersentase: m.bobotPersentase || 0 })) || []
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

  const handleTypeSubmit = async () => {
    try {
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
      let token = "";
      if (authDataStr) {
        const authData = JSON.parse(authDataStr);
        token = authData.token;
      }
      
      let finalImageUrl = typeForm.imageUrl;

      // Handle Image Upload First
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);
        
        const uploadRes = await fetch("http://localhost:4000/api/upload", {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: formData
        });
        
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          finalImageUrl = `http://localhost:4000${uploadData.imageUrl}`;
        }
      }

      const payload = {
        projectId: typeForm.projectId,
        name: typeForm.name,
        luasTanah: typeForm.lt,
        luasBangunan: typeForm.lb,
        kamarTidur: typeForm.bed,
        kamarMandi: Number(typeForm.bath),
        basePrice: Number(typeForm.price),
        estimasiRab: Number(typeForm.estimasiRab),
        facilities: typeForm.facilities,
        milestoneTemplates: typeForm.milestoneGroups.flatMap(g => 
          g.items.map(i => ({ category: g.category, name: i.name, bobotPersentase: i.bobotPersentase }))
        ).filter(t => t.name.trim() !== ""),
        imageUrl: finalImageUrl || typeForm.imageUrl
      };
      
      const endpoint = typeForm.id 
        ? `http://localhost:4000/api/inventory/types/${typeForm.id}`
        : "http://localhost:4000/api/inventory/types";
      
      const res = await fetch(endpoint, {
        method: typeForm.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(`Gagal: ${err.message || res.statusText || "Internal Server Error"}`);
        return;
      }
      
      setIsTypeModalOpen(false);
      await fetchData();
      showToast(`Berhasil ${typeForm.id ? 'mengedit' : 'menambah'} tipe rumah ${payload.name}`, 'success');
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditClick = (type: any) => {
    setTypeForm({
      id: type.id,
      projectId: projects.find(p => p.name === type.projectName)?.id || "",
      name: type.name,
      lt: type.lt,
      lb: type.lb,
      bed: type.bed,
      bath: type.bath,
      price: type.price,
      estimasiRab: type.estimasiRab || 0,
      facilities: type.facilities || "",
      imageUrl: type.imageUrl || "",
      milestoneGroups: (() => {
        const groupsMap = new Map<string, any[]>();
        type.milestoneTemplates?.forEach((m: any) => {
          const cat = m.category || "Tanpa Kategori";
          if (!groupsMap.has(cat)) groupsMap.set(cat, []);
          groupsMap.get(cat)!.push({ name: m.name, bobotPersentase: m.bobotPersentase });
        });
        return Array.from(groupsMap.entries()).map(([cat, items]) => ({ category: cat, isCollapsed: false, items }));
      })(),
    });
    setSelectedFile(null);
    setIsTypeModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const executeDelete = async () => {
    if (!deleteConfirmId) return;
    const id = deleteConfirmId;
    
    try {
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
      let token = "";
      if (authDataStr) {
        const authData = JSON.parse(authDataStr);
        token = authData.token;
      }
      
      const res = await fetch(`http://localhost:4000/api/inventory/types/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(`Gagal menghapus: ${err.error || res.statusText}`);
        return;
      }
      
      setDeleteConfirmId(null);
      await fetchData();
      showToast(`Berhasil menghapus tipe rumah`, 'success');
    } catch (e) {
      console.error(e);
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const openNewModal = () => {
    setTypeForm({ projectId: "", name: "", lt: 0, lb: 0, bed: 0, bath: 0, price: 0, estimasiRab: 0, facilities: "", imageUrl: "", milestoneGroups: [{ category: "I. PEKERJAAN PONDASI", isCollapsed: false, items: [] }], id: undefined });
    setSelectedFile(null);
    setFormStep(1);
    setIsTypeModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="mb-2 text-3xl font-[family-name:var(--font-heading)] text-zinc-900 flex items-center gap-3 tracking-tight">
            <House className="text-amber-600" weight="duotone" size={32} />
            Master Tipe Rumah
          </h2>
          <p className="text-sm text-zinc-500">Kelola spesifikasi dan harga dasar tipe properti yang tersedia di seluruh proyek.</p>
        </div>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-600/20 transition-all hover:bg-amber-700"
        >
          <Plus weight="duotone" size={18} /> Tambah Tipe
        </button>
      </div>

      {/* Filter Dropdown */}
      {projects.length > 0 && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <List weight="duotone" size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Filter Tipe Rumah</h3>
              <p className="text-xs text-zinc-500">Pilih proyek untuk melihat tipe rumah secara spesifik</p>
            </div>
          </div>
          <div className="relative min-w-[280px]">
            <select
              value={selectedProjectFilter}
              onChange={(e) => setSelectedProjectFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-4 pr-12 text-sm font-semibold text-zinc-700 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 cursor-pointer"
            >
              <option value="ALL">Semua Proyek ({propertyTypes.length} Tipe)</option>
              {projects.map((proj) => {
                const count = propertyTypes.filter(t => t.projectId === proj.id).length;
                return (
                  <option key={proj.id} value={proj.id}>
                    {proj.name} ({count} Tipe)
                  </option>
                );
              })}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">
              <CaretDown weight="bold" size={16} />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(selectedProjectFilter === "ALL" 
          ? propertyTypes 
          : propertyTypes.filter(t => t.projectId === selectedProjectFilter)
        ).map((type) => (
          <div key={type.id} className="group overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-all hover:shadow-md">
            <div className="relative h-48 overflow-hidden bg-zinc-100">
              {type.imageUrl ? (
                <img
                  src={type.imageUrl}
                  alt={type.name}
                  onClick={() => setViewerImage(type.imageUrl)}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
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
              <div className="mb-2 inline-block rounded border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                {type.projectName}
              </div>
              <h4 className="mb-4 text-xl font-[family-name:var(--font-heading)] text-zinc-900">{type.name}</h4>
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <CornersOut weight="duotone" size={16} className="text-amber-600" /> LT {type.lt} m2
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <Package weight="duotone" size={16} className="text-amber-600" /> LB {type.lb} m2
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
                <div className="flex gap-2">
                  <button onClick={() => { setDetailType(type); setDetailStep(1); }} className="rounded p-2 text-zinc-400 transition-colors hover:bg-blue-50 hover:text-blue-600" title="Lihat Detail">
                    <Eye weight="duotone" size={18} />
                  </button>
                  <button onClick={() => { handleEditClick(type); setFormStep(1); }} className="rounded p-2 text-zinc-400 transition-colors hover:bg-amber-50 hover:text-amber-600" title="Edit">
                    <PencilSimple weight="duotone" size={18} />
                  </button>
                  <button onClick={() => handleDeleteClick(type.id)} className="rounded p-2 text-zinc-400 transition-colors hover:bg-rose-50 hover:text-rose-600" title="Hapus">
                    <Trash weight="duotone" size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {propertyTypes.length > 0 && selectedProjectFilter !== "ALL" && propertyTypes.filter(t => t.projectId === selectedProjectFilter).length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-zinc-200 rounded-2xl">
            <h3 className="text-lg font-bold text-zinc-700">Tidak ada Tipe Rumah</h3>
            <p className="text-sm text-zinc-500">Proyek ini belum memiliki tipe rumah yang terdaftar.</p>
          </div>
        )}
      </div>

      {/* Modal Input Tipe Baru */}
      {isTypeModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm">
          <div className={`w-full flex flex-col max-h-[90vh] animate-in zoom-in-95 rounded-2xl bg-white shadow-2xl duration-200 transition-all ${formStep === 1 ? 'max-w-2xl' : 'max-w-[95vw] lg:max-w-6xl'}`}>
            <div className="flex items-center justify-between rounded-t-2xl border-b border-zinc-100 bg-zinc-50/50 px-6 py-4">
              <h3 className="text-lg font-bold text-zinc-900">
                {formStep === 1 ? (typeForm.id ? "Edit Tipe Rumah" : "Input Master Tipe Baru") : "Langkah 2: Template Milestone BQ"}
              </h3>
              <button onClick={() => setIsTypeModalOpen(false)} className="p-1 text-zinc-400 transition-colors hover:text-rose-500">
                <X weight="duotone" size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col">
              {formStep === 1 && (
                <div className="space-y-5 p-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Pilih Proyek (Tahap 1)</label>
                <select
                  value={typeForm.projectId}
                  onChange={(e) => setTypeForm({ ...typeForm, projectId: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                >
                  <option value="" disabled>Pilih Proyek Master...</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
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
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Luas Tanah (m2)</label>
                  <input
                    type="number"
                    value={typeForm.lt || ""}
                    onChange={(e) => setTypeForm({ ...typeForm, lt: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Luas Bangunan (m2)</label>
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
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Harga Dasar (Base Price)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-zinc-500">Rp</span>
                    <input
                      type="text"
                      value={typeForm.price ? typeForm.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\./g, "");
                        if (!isNaN(Number(rawValue))) {
                          setTypeForm({ ...typeForm, price: Number(rawValue) });
                        }
                      }}
                      placeholder="0"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Estimasi RAB Pembangunan</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-zinc-500">Rp</span>
                    <input
                      type="text"
                      value={typeForm.estimasiRab ? typeForm.estimasiRab.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\./g, "");
                        if (!isNaN(Number(rawValue))) {
                          setTypeForm({ ...typeForm, estimasiRab: Number(rawValue) });
                        }
                      }}
                      placeholder="0"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Fasilitas & Keunggulan (Opsional) <span className="text-amber-500 normal-case tracking-normal">*Tampil di web publik</span></label>
                <textarea
                  value={typeForm.facilities}
                  onChange={(e) => setTypeForm({ ...typeForm, facilities: e.target.value })}
                  placeholder="Contoh: Smart Home System, Listrik Bawah Tanah"
                  rows={3}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Foto / Denah Tipe Rumah</label>
                <div className="flex items-center gap-4">
                  {typeForm.imageUrl && !selectedFile && (
                    <img src={typeForm.imageUrl} alt="Preview" className="h-16 w-16 rounded-lg object-cover border border-zinc-200" />
                  )}
                  {selectedFile && (
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-xs text-amber-700 text-center p-1 overflow-hidden">
                      {selectedFile?.name}
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 transition-all hover:border-amber-500 hover:bg-amber-50 hover:text-amber-700">
                      <UploadSimple weight="duotone" size={20} />
                      {selectedFile ? "Ganti File Gambar" : "Upload File Gambar"}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setSelectedFile(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
                </div>
                </div>
              )}

              {formStep === 2 && (
                <div className="flex flex-col bg-zinc-50/50 flex-1 overflow-hidden">
                <div className="flex-none flex items-center justify-between border-b border-zinc-200 bg-white p-5">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-zinc-800">Template Milestone (Wajib)</label>
                    <p className="text-xs text-zinc-500 mt-1">Daftar Bill of Quantities (BQ) yang harus dikerjakan di lapangan.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setTypeForm({ ...typeForm, milestoneGroups: [...typeForm.milestoneGroups, { category: "Kategori Baru", isCollapsed: false, items: [] }] })}
                    className="text-sm font-bold text-white bg-amber-600 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-amber-700 transition-colors shadow-sm"
                  >
                    <Plus weight="bold" /> Tambah Kategori
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {typeForm.milestoneGroups.length > 0 && (
                    <div className="flex items-center gap-2 px-1 pb-2 border-b border-zinc-200 text-xs font-bold text-zinc-500 uppercase">
                      <div className="flex-[3]">Uraian Pekerjaan</div>
                      <div className="w-28 shrink-0 text-center">Bobot (%)</div>
                      <div className="w-10 shrink-0 text-center">Aksi</div>
                    </div>
                  )}

                  {typeForm.milestoneGroups.map((group, groupIdx) => (
                    <div key={groupIdx} className="mb-4">
                      <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-lg p-3 hover:bg-zinc-100 transition-colors mb-2">
                        <button 
                          onClick={() => {
                            const newGroups = [...typeForm.milestoneGroups];
                            newGroups[groupIdx].isCollapsed = !newGroups[groupIdx].isCollapsed;
                            setTypeForm({ ...typeForm, milestoneGroups: newGroups });
                          }}
                          className="text-zinc-400 hover:text-zinc-600 p-1"
                        >
                          {group.isCollapsed ? <CaretRight weight="bold" size={16} /> : <CaretDown weight="bold" size={16} />}
                        </button>
                        <Stack weight="duotone" size={24} className="text-amber-500" />
                        <input 
                          type="text" 
                          value={group.category}
                          onChange={(e) => {
                            const newGroups = [...typeForm.milestoneGroups];
                            newGroups[groupIdx].category = e.target.value;
                            setTypeForm({ ...typeForm, milestoneGroups: newGroups });
                          }}
                          className="flex-1 bg-transparent font-bold text-zinc-800 text-sm focus:outline-none focus:border-b border-amber-500 px-1"
                          placeholder="Nama Kategori (Misal: I. PEKERJAAN PONDASI)"
                        />
                        <button 
                          onClick={() => {
                            const newGroups = [...typeForm.milestoneGroups];
                            newGroups[groupIdx].items.push({ name: "", bobotPersentase: 0 });
                            if(newGroups[groupIdx].isCollapsed) newGroups[groupIdx].isCollapsed = false;
                            setTypeForm({ ...typeForm, milestoneGroups: newGroups });
                          }}
                          className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-md transition-colors"
                        >
                          <Plus weight="bold" /> Sub-Pekerjaan
                        </button>
                        <button 
                          onClick={() => {
                            const newGroups = [...typeForm.milestoneGroups];
                            newGroups.splice(groupIdx, 1);
                            setTypeForm({ ...typeForm, milestoneGroups: newGroups });
                          }}
                          className="text-zinc-400 hover:text-rose-500 p-1.5 rounded-md hover:bg-rose-50 transition-colors"
                        >
                          <Trash weight="duotone" size={18} />
                        </button>
                      </div>

                      {!group.isCollapsed && (
                        <div className="pl-9 space-y-2 relative before:absolute before:left-6 before:top-0 before:bottom-4 before:w-[2px] before:bg-zinc-200">
                          {group.items.map((item, itemIdx) => (
                            <div key={itemIdx} className="flex items-center gap-3 relative before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-[2px] before:bg-zinc-200">
                              <Hammer weight="duotone" size={20} className="text-zinc-400 shrink-0" />
                              <input 
                                type="text"
                                value={item.name}
                                onChange={(e) => {
                                  const newGroups = [...typeForm.milestoneGroups];
                                  newGroups[groupIdx].items[itemIdx].name = e.target.value;
                                  setTypeForm({ ...typeForm, milestoneGroups: newGroups });
                                }}
                                className="flex-[3] bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                placeholder="Nama Aktivitas"
                              />
                              <div className="relative w-28 shrink-0">
                                <input 
                                  type="number"
                                  step="0.01"
                                  value={item.bobotPersentase || ""}
                                  onChange={(e) => {
                                    const newGroups = [...typeForm.milestoneGroups];
                                    newGroups[groupIdx].items[itemIdx].bobotPersentase = Number(e.target.value);
                                    setTypeForm({ ...typeForm, milestoneGroups: newGroups });
                                  }}
                                  className="w-full bg-white border border-zinc-200 rounded-lg pl-3 pr-7 py-2 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                  placeholder="0.00"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">%</span>
                              </div>
                              <button 
                                onClick={() => {
                                  const newGroups = [...typeForm.milestoneGroups];
                                  newGroups[groupIdx].items.splice(itemIdx, 1);
                                  setTypeForm({ ...typeForm, milestoneGroups: newGroups });
                                }}
                                className="text-zinc-400 hover:text-rose-500 w-10 text-center shrink-0"
                              >
                                <Trash weight="duotone" size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {typeForm.milestoneGroups.length === 0 && (
                    <div className="rounded-xl border border-dashed border-zinc-300 py-8 flex flex-col items-center justify-center text-center text-sm text-zinc-500">
                      <List weight="duotone" size={32} className="text-zinc-300 mb-2" />
                      Belum ada Kategori Pekerjaan
                    </div>
                  )}
                </div>
                <div className="flex-none border-t border-zinc-200 bg-white p-4">
                  {(() => {
                    const totalPersen = typeForm.milestoneGroups.reduce((sum, g) => sum + g.items.reduce((s, i) => s + (Number(i.bobotPersentase) || 0), 0), 0);
                    const isTotalValid = Math.abs(totalPersen - 100) < 0.001;
                    return (
                      <div className={`rounded-xl p-3 text-sm font-semibold text-center border flex flex-col items-center justify-center ${isTotalValid ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                        <span>Total Persentase: {Number(totalPersen.toFixed(2))} / 100</span>
                        {!isTotalValid && <span className="block text-xs mt-1 font-medium">Total bobot harus persis 100%</span>}
                      </div>
                    );
                  })()}
                </div>
              </div>
              )}
            </div>
            <div className="flex justify-end gap-3 rounded-b-2xl border-t border-zinc-100 bg-white px-6 py-4">
              {formStep === 1 && (
                <>
                  <button
                    onClick={() => setIsTypeModalOpen(false)}
                    className="rounded-lg px-5 py-2.5 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-200"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={() => setFormStep(2)} 
                    disabled={!typeForm.projectId || !typeForm.name}
                    className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-600/20 transition-all hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Lanjut: Atur Milestone ➔
                  </button>
                </>
              )}
              {formStep === 2 && (
                <>
                  <button
                    onClick={() => setFormStep(1)}
                    className="rounded-lg px-5 py-2.5 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-200"
                  >
                    ⬅ Kembali
                  </button>
                  <button 
                    onClick={handleTypeSubmit} 
                    disabled={!typeForm.projectId || !typeForm.name || typeForm.milestoneGroups.reduce((s,g) => s + g.items.length, 0) === 0 || Math.abs(typeForm.milestoneGroups.reduce((sum, g) => sum + g.items.reduce((s, i) => s + (Number(i.bobotPersentase) || 0), 0), 0) - 100) > 0.001}
                    className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-600/20 transition-all hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {typeForm.id ? "Simpan Perubahan" : "Simpan Tipe Baru"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Lightbox Image Viewer */}
      {viewerImage && mounted && createPortal(
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-zinc-950/90 p-4 backdrop-blur-sm transition-opacity"
          onClick={() => setViewerImage(null)}
        >
          <button 
            onClick={() => setViewerImage(null)}
            className="absolute right-6 top-6 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
          >
            <X weight="bold" size={24} />
          </button>
          <img 
            src={viewerImage || undefined} 
            alt="Full screen preview" 
            className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
          />
        </div>,
        document.body
      )}

      {/* Modal Detail Tipe Rumah */}
      {detailType && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 rounded-2xl bg-white shadow-2xl duration-200 overflow-hidden">
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-zinc-50/50">
              {detailStep === 1 && (
                <>
                  {detailType.imageUrl ? (
                    <div className="h-64 w-full bg-zinc-100 shrink-0">
                      <img 
                        src={detailType.imageUrl} 
                        alt={detailType.name} 
                        onClick={() => setViewerImage(detailType.imageUrl)}
                        className="h-full w-full object-cover cursor-pointer hover:opacity-90 transition-opacity" 
                      />
                    </div>
                  ) : (
                    <div className="flex h-48 w-full items-center justify-center bg-zinc-100 text-zinc-300 shrink-0">
                      <House weight="duotone" size={64} />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="mb-2 inline-block rounded border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                      {detailType.projectName}
                    </div>
                    <h3 className="mb-6 text-2xl font-bold text-zinc-900">{detailType.name}</h3>
                    
                    <div className="space-y-4 rounded-xl bg-white p-5 border border-zinc-200 shadow-sm">
                      <div className="flex justify-between border-b border-zinc-100 pb-3">
                        <span className="text-sm text-zinc-500 font-medium">Harga Dasar</span>
                        <span className="font-bold text-zinc-900">{formatRupiah(detailType.price)}</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-100 pb-3">
                        <span className="text-sm text-zinc-500 font-medium">Luas Tanah / Bangunan</span>
                        <span className="font-semibold text-zinc-800">{detailType.lt} m² / {detailType.lb} m²</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-100 pb-3">
                        <span className="text-sm text-zinc-500 font-medium">Kamar Tidur</span>
                        <span className="font-semibold text-zinc-800">{detailType.bed} Ruangan</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-zinc-500 font-medium">Kamar Mandi</span>
                        <span className="font-semibold text-zinc-800">{detailType.bath} Ruangan</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {detailStep === 2 && (
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-zinc-900">Milestone BQ (Bill of Quantities)</h3>
                    <p className="text-sm text-zinc-500 mt-1">Daftar tahapan konstruksi untuk {detailType.name}.</p>
                  </div>
                  
                  {detailType.milestoneTemplates && detailType.milestoneTemplates.length > 0 ? (
                    <div className="space-y-4">
                      {Array.from(new Set(detailType.milestoneTemplates.map((m: any) => m.category || "Tanpa Kategori"))).map((cat: any, idx) => {
                        const items = detailType.milestoneTemplates.filter((m: any) => (m.category || "Tanpa Kategori") === cat);
                        return (
                          <div key={idx} className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                            <div className="bg-zinc-50 px-4 py-2.5 font-bold text-zinc-700 text-sm border-b border-zinc-200 flex items-center gap-2">
                              <Stack weight="duotone" size={20} className="text-amber-500" />
                              <span>{cat}</span>
                            </div>
                            <div className="p-3 pl-8 space-y-2 relative before:absolute before:left-6 before:top-0 before:bottom-4 before:w-[2px] before:bg-zinc-200">
                              {items.map((item: any, i: number) => (
                                <div key={i} className="flex items-center justify-between gap-3 relative before:absolute before:-left-2 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-[2px] before:bg-zinc-200">
                                  <div className="flex items-center gap-2">
                                    <Hammer weight="duotone" size={16} className="text-zinc-400" />
                                    <span className="text-sm font-medium text-zinc-700">{item.name}</span>
                                  </div>
                                  <div className="px-2 py-1 bg-zinc-100 rounded text-xs font-bold text-zinc-600">
                                    {item.bobotPersentase}%
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-zinc-300 py-10 flex flex-col items-center justify-center text-center text-sm text-zinc-500 bg-white">
                      <List weight="duotone" size={32} className="text-zinc-300 mb-2" />
                      Belum ada BQ yang diatur.
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex-none p-4 border-t border-zinc-100 bg-white flex justify-end gap-3">
              {detailStep === 1 ? (
                <>
                  <button 
                    onClick={() => { setDetailType(null); setDetailStep(1); }} 
                    className="rounded-lg px-5 py-2.5 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-200"
                  >
                    Tutup
                  </button>
                  <button 
                    onClick={() => setDetailStep(2)} 
                    className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-600/20 transition-all hover:bg-amber-700"
                  >
                    Lanjut: Lihat Milestone ➔
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setDetailStep(1)} 
                    className="rounded-lg px-5 py-2.5 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-200"
                  >
                    ⬅ Kembali
                  </button>
                  <button 
                    onClick={() => { setDetailType(null); setDetailStep(1); }} 
                    className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
                  >
                    Tutup Detail
                  </button>
                </>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteConfirmId && mounted && createPortal(
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md animate-in zoom-in-95 flex flex-col items-center rounded-2xl bg-white p-6 shadow-2xl duration-200 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <WarningCircle weight="duotone" size={32} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-zinc-900">Konfirmasi Hapus</h3>
            <p className="mb-8 text-sm text-zinc-500">
              Apakah Anda yakin ingin menghapus tipe rumah ini? Data yang sudah dihapus tidak dapat dikembalikan.
            </p>
            <div className="flex w-full gap-3">
              <button 
                onClick={() => setDeleteConfirmId(null)} 
                className="flex-1 rounded-xl bg-zinc-100 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-200"
              >
                Batal
              </button>
              <button 
                onClick={executeDelete} 
                className="flex-1 rounded-xl bg-rose-600 py-3 text-sm font-semibold text-white shadow-md shadow-rose-600/20 transition-all hover:bg-rose-700"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Toast Notification */}
      {toast && mounted && createPortal(
        <div className="fixed top-6 left-6 right-6 sm:left-auto sm:right-6 sm:max-w-sm z-[200] animate-in slide-in-from-top-5 fade-in duration-300">
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
              className="ml-2 rounded-full p-1 hover:bg-white/20 transition-colors"
            >
              <X weight="bold" className="h-4 w-4" />
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
