"use client";

import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { 
  ListChecks, 
  MagnifyingGlass, 
  CheckCircle, 
  XCircle, 
  Image as ImageIcon,
  WarningCircle,
  X,
  Buildings,
  House,
  CaretRight,
  CaretDown,
  Hammer,
  Clock,
  Checks
} from "@phosphor-icons/react";

export default function VerifikasiProgresPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  
  const [units, setUnits] = useState<any[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<any | null>(null);
  
  const [milestones, setMilestones] = useState<any[]>([]);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [selectedMilestone, setSelectedMilestone] = useState<any | null>(null);
  
  // To identify which units have pending approvals
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [rejectNote, setRejectNote] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      // Fetch projects
      const projRes = await fetch("http://localhost:4000/api/projects", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const projData = await projRes.json();
      if (Array.isArray(projData)) {
        setProjects(projData);
      } else if (projData.data) {
        setProjects(projData.data);
      }

      // Fetch all pending approvals to know which units need attention
      const appRes = await fetch("http://localhost:4000/api/construction/milestone-approvals", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const appData = await appRes.json();
      if (appData.data) {
        setPendingApprovals(appData.data);
      }
    } catch (err) {
      console.error("Failed to fetch initial data", err);
    } finally {
      setLoading(false);
    }
  };

  const getToken = async () => {
    const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
        let token = "";
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          token = authData.token;
        }
    return token;
  };

  const handleSelectProject = async (project: any) => {
    setSelectedProject(project);
    setStep(2);
    setSearchTerm("");
    try {
      setLoading(true);
      const token = await getToken();
      const res = await fetch(`http://localhost:4000/api/inventory/units?projectId=${project.id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.data) {
        // Filter units that have SPK and are under construction (not yet Siap Huni)
        const filteredUnits = data.data.filter((u: any) => u.spkId != null && u.statusPembangunan !== "Siap Huni");
        
        // Sort units by blok and nomor
        filteredUnits.sort((a: any, b: any) => {
          if (a.blok === b.blok) {
            // Use localeCompare with numeric option to correctly sort a1, a2, a10, etc.
            return String(a.nomor).localeCompare(String(b.nomor), undefined, { numeric: true });
          }
          return String(a.blok).localeCompare(String(b.blok));
        });
        
        setUnits(filteredUnits);
      }
    } catch (err) {
      console.error("Failed to fetch units", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUnit = async (unit: any) => {
    setSelectedUnit(unit);
    setStep(3);
    fetchUnitMilestones(unit.id);
  };

  const fetchUnitMilestones = async (unitId: string) => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await fetch(`http://localhost:4000/mobile/field/units/${unitId}/milestones`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data && Array.isArray(data.data)) {
        setMilestones(data.data);
      } else if (data && Array.isArray(data)) {
        setMilestones(data);
      } else {
        setMilestones([]);
      }
    } catch (err) {
      console.error("Failed to fetch milestones", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: string, action: "APPROVE" | "REJECT") => {
    try {
      setVerifying(true);
      const token = await getToken();

      const payload: any = { action };
      if (action === "REJECT") {
        if (!rejectNote.trim()) {
          alert("Catatan revisi wajib diisi!");
          setVerifying(false);
          return;
        }
        payload.note = rejectNote;
      }

      const res = await fetch(`http://localhost:4000/api/construction/milestone-approvals/${id}/verify`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setIsRejectModalOpen(false);
        setIsApproveModalOpen(false);
        setSelectedMilestone(null);
        setRejectNote("");
        
        // Refresh unit milestones and pending approvals
        fetchUnitMilestones(selectedUnit.id);
        
        const appRes = await fetch("http://localhost:4000/api/construction/milestone-approvals", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const appData = await appRes.json();
        if (appData.data) {
          setPendingApprovals(appData.data);
        }
      } else {
        const err = await res.json();
        alert(`Gagal: ${err.error || err.message}`);
      }
    } catch (err) {
      console.error("Verification failed", err);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setVerifying(false);
    }
  };

  // Group milestones for Tree View
  const groupedMilestones = useMemo(() => {
    const groups: Record<string, { category: string; items: any[] }> = {};
    for (const m of milestones) {
      const cat = m.category || "Umum";
      if (!groups[cat]) {
        groups[cat] = { category: cat, items: [] };
      }
      groups[cat].items.push(m);
    }
    return Object.values(groups);
  }, [milestones]);

  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  // Derived filtered data
  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredUnits = units.filter(u => 
    (u.blok + " " + u.nomor).toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.statusPembangunan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Breadcrumbs */}
      <div>
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 mb-4">
          <button onClick={() => { setStep(1); setSearchTerm(""); }} className={`transition-colors hover:text-amber-600 ${step === 1 ? 'text-amber-600 font-bold' : ''}`}>
            Semua Proyek
          </button>
          {step >= 2 && selectedProject && (
            <>
              <CaretRight weight="bold" />
              <button onClick={() => { setStep(2); setSearchTerm(""); }} className={`transition-colors hover:text-amber-600 ${step === 2 ? 'text-amber-600 font-bold' : ''}`}>
                {selectedProject.name}
              </button>
            </>
          )}
          {step >= 3 && selectedUnit && (
            <>
              <CaretRight weight="bold" />
              <span className="text-zinc-900 font-bold">
                Blok {selectedUnit.blok} No {selectedUnit.nomor}
              </span>
            </>
          )}
        </div>

        <h2 className="mb-2 text-3xl font-[family-name:var(--font-heading)] text-zinc-900 flex items-center gap-3 tracking-tight">
          <ListChecks className="text-amber-600" weight="duotone" size={32} />
          {step === 1 ? "Pilih Proyek" : step === 2 ? "Pilih Kavling" : "Verifikasi Progres Unit"}
        </h2>
        <p className="text-sm text-zinc-500">
          {step === 1 ? "Pilih proyek untuk melihat daftar kavling/unit di dalamnya." : 
           step === 2 ? "Pilih kavling yang sedang dibangun untuk meninjau progres pekerjaannya." :
           "Tinjau laporan pekerjaan lapangan dan setujui untuk memperbarui total progres."}
        </p>
      </div>

      <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm min-h-[500px]">
        
        {/* Search Bar for Step 1 and 2 */}
        {(step === 1 || step === 2) && (
          <div className="mb-6 flex justify-end">
            <div className="relative w-full md:w-72">
              <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                type="text" 
                placeholder={step === 1 ? "Cari Proyek..." : "Cari Blok/Nomor..."} 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full rounded-full border border-zinc-200 bg-zinc-50 py-2.5 pl-11 pr-4 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-amber-500"></div>
          </div>
        ) : (
          <>
            {/* STEP 1: PROJECT LIST */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProjects.map(proj => {
                  // Hitung apakah proyek ini punya unit yang butuh approval
                  const hasPending = pendingApprovals.some(a => a.unit?.projectId === proj.id);
                  return (
                    <div 
                      key={proj.id} 
                      onClick={() => handleSelectProject(proj)}
                      className="group cursor-pointer rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/10 relative"
                    >
                      {hasPending && (
                        <div className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        </div>
                      )}
                      <div className="mb-4 inline-flex rounded-xl bg-zinc-50 p-3 text-zinc-600 transition-colors group-hover:bg-amber-50 group-hover:text-amber-600">
                        <Buildings size={28} weight="duotone" />
                      </div>
                      <h3 className="text-lg font-bold text-zinc-900 mb-1">{proj.name}</h3>
                      <p className="text-sm text-zinc-500">{proj.address || "Tidak ada detail alamat"}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* STEP 2: UNIT LIST */}
            {step === 2 && (
              filteredUnits.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <House className="mb-4 text-zinc-300" weight="duotone" size={48} />
                  <p className="text-lg font-bold text-zinc-900">Belum ada unit</p>
                  <p className="text-sm text-zinc-500">Proyek ini belum memiliki data unit.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredUnits.map(unit => {
                    const unitPendings = pendingApprovals.filter(a => a.unit?.id === unit.id);
                    const hasPending = unitPendings.length > 0;
                    
                    return (
                      <div 
                        key={unit.id} 
                        onClick={() => handleSelectUnit(unit)}
                        className={`group cursor-pointer rounded-2xl border bg-white p-4 transition-all hover:shadow-md relative
                          ${hasPending ? 'border-amber-300 bg-amber-50/30' : 'border-zinc-200 hover:border-amber-500'}`}
                      >
                        {hasPending && (
                          <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white shadow-sm">
                            {unitPendings.length}
                          </div>
                        )}
                        <h4 className="text-lg font-bold text-zinc-900">Blok {unit.blok} / {unit.nomor}</h4>
                        <div className="mt-2 text-xs font-medium text-zinc-500 flex items-center gap-1">
                          <div className={`h-2 w-2 rounded-full ${unit.statusPembangunan === 'Siap Huni' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                          {unit.statusPembangunan || 'Belum Dibangun'}
                        </div>
                        <div className="mt-1 text-xs text-zinc-400">Progres: {unit.progress || 0}%</div>
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* STEP 3: MILESTONES TREE */}
            {step === 3 && (
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-amber-100 p-3 text-amber-600">
                      <House weight="duotone" size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900">Blok {selectedUnit?.blok} No {selectedUnit?.nomor}</h3>
                      <p className="text-sm font-medium text-zinc-500">Progres Keseluruhan: {selectedUnit?.progress || 0}%</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {groupedMilestones.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-zinc-500">Tidak ada milestone untuk unit ini.</p>
                    </div>
                  ) : (
                    groupedMilestones.map((group, gIdx) => {
                      const isCollapsed = collapsedCategories[group.category];
                      const completedCount = group.items.filter(i => i.status === "COMPLETED").length;
                      
                      return (
                        <div key={gIdx} className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
                          {/* Group Header */}
                          <button 
                            onClick={() => toggleCategory(group.category)}
                            className="w-full flex items-center justify-between p-4 bg-zinc-50 hover:bg-zinc-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {isCollapsed ? <CaretRight size={18} className="text-zinc-400" /> : <CaretDown size={18} className="text-zinc-400" />}
                              <span className="font-bold text-zinc-800">{group.category}</span>
                            </div>
                            <span className="text-sm font-semibold text-zinc-500 bg-white px-3 py-1 rounded-full border border-zinc-200">
                              {completedCount}/{group.items.length} Selesai
                            </span>
                          </button>

                          {/* Group Items */}
                          {!isCollapsed && (
                            <div className="divide-y divide-zinc-100">
                              {group.items.map((item) => {
                                const isWaiting = item.status === "WAITING_APPROVAL";
                                const isCompleted = item.status === "COMPLETED";
                                const isRejected = item.status === "REJECTED";
                                const isProgress = item.status === "IN_PROGRESS";

                                return (
                                  <div 
                                    key={item.id} 
                                    className={`flex items-center justify-between p-4 pl-12 transition-colors ${isWaiting ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-zinc-50'}`}
                                  >
                                    <div className="flex items-center gap-4">
                                      {/* Icon Indicator */}
                                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                        isCompleted ? 'bg-emerald-100 text-emerald-600' :
                                        isWaiting ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30' :
                                        isRejected ? 'bg-rose-100 text-rose-600' :
                                        isProgress ? 'bg-amber-100 text-amber-600' :
                                        'bg-zinc-100 text-zinc-400'
                                      }`}>
                                        {isWaiting ? <Clock weight="bold" /> :
                                         isCompleted ? <Checks weight="bold" /> :
                                         isRejected ? <WarningCircle weight="bold" /> :
                                         <Hammer weight="fill" />}
                                      </div>
                                      
                                      <div>
                                        <h4 className="font-semibold text-zinc-900">{item.name}</h4>
                                        <div className="text-xs font-medium text-zinc-500">Bobot: {item.bobotPersentase}%</div>
                                      </div>
                                    </div>

                                    <div>
                                      {isWaiting ? (
                                        <button 
                                          onClick={() => setSelectedMilestone(item)}
                                          className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-colors hover:bg-blue-700"
                                        >
                                          Verifikasi
                                        </button>
                                      ) : (
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                          isCompleted ? 'bg-emerald-100 text-emerald-700' :
                                          isRejected ? 'bg-rose-100 text-rose-700' :
                                          isProgress ? 'bg-amber-100 text-amber-700' :
                                          'bg-zinc-100 text-zinc-500'
                                        }`}>
                                          {item.status === "NOT_STARTED" || item.status === "PENDING" ? "Belum Mulai" :
                                           item.status === "IN_PROGRESS" ? "Dikerjakan" :
                                           item.status === "COMPLETED" ? "Selesai" :
                                           item.status === "REJECTED" ? "Ditolak" : item.status}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedMilestone && mounted && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl relative">
            <div className="flex-none flex items-center justify-between border-b border-zinc-100 p-6">
              <div>
                <h3 className="text-xl font-bold text-zinc-900">Verifikasi Laporan Progres</h3>
                <p className="text-sm text-zinc-500">Unit Blok {selectedUnit?.blok} No {selectedUnit?.nomor}</p>
              </div>
              <button 
                onClick={() => { setSelectedMilestone(null); setIsRejectModalOpen(false); setIsApproveModalOpen(false); setRejectNote(""); }}
                className="rounded-full bg-zinc-100 p-2 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 transition-colors"
              >
                <X weight="bold" size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-zinc-50 p-4 border border-zinc-100">
                <div>
                  <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Kategori Pekerjaan</div>
                  <div className="font-medium text-zinc-900">{selectedMilestone.category}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Item Pekerjaan</div>
                  <div className="font-medium text-zinc-900">{selectedMilestone.name}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Bobot Persentase</div>
                  <div className="font-bold text-amber-600">+{selectedMilestone.bobotPersentase}%</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-2">
                  <ListChecks className="text-amber-500" size={18} weight="bold" />
                  Catatan Pengawas
                </h4>
                <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-inner">
                  {selectedMilestone.logs?.[0]?.note ? (
                    <p className="text-sm text-zinc-700 whitespace-pre-wrap">{selectedMilestone.logs[0].note}</p>
                  ) : (
                    <p className="text-sm italic text-zinc-400">Tidak ada catatan lapangan.</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-2">
                  <ImageIcon className="text-amber-500" size={18} weight="bold" />
                  Foto Bukti Lapangan
                </h4>
                {(selectedMilestone.photos?.length > 0 || selectedMilestone.photoUrls?.length > 0) ? (
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {(selectedMilestone.photos || selectedMilestone.photoUrls).map((photo: any, i: number) => {
                      const url = typeof photo === 'string' ? photo : photo.url;
                      const isFullUrl = url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:');
                      const finalUrl = isFullUrl ? url : `http://localhost:4000${url.startsWith('/') ? '' : '/'}${url}`;
                      return (
                        <div 
                          key={i} 
                          className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl border border-zinc-200 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setSelectedImage(finalUrl)}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={finalUrl} 
                            alt="Progress" 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : selectedMilestone.logs?.[0]?.photoUrls?.length > 0 ? (
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {selectedMilestone.logs[0].photoUrls.map((url: string, i: number) => {
                      const isFullUrl = url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:');
                      const finalUrl = isFullUrl ? url : `http://localhost:4000${url.startsWith('/') ? '' : '/'}${url}`;
                      return (
                        <div 
                          key={i} 
                          className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl border border-zinc-200 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setSelectedImage(finalUrl)}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={finalUrl} 
                            alt="Progress" 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-zinc-300 p-6 flex flex-col items-center justify-center bg-zinc-50">
                    <ImageIcon size={32} className="text-zinc-300 mb-2" />
                    <p className="text-sm italic text-zinc-400">Tidak ada lampiran foto.</p>
                  </div>
                )}
              </div>

              {isRejectModalOpen && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 animate-fade-in shadow-inner">
                  <h4 className="text-sm font-bold text-rose-800 mb-2 flex items-center gap-2">
                    <WarningCircle weight="bold" size={18} />
                    Catatan Revisi untuk Pengawas
                  </h4>
                  <textarea
                    value={rejectNote}
                    onChange={(e) => setRejectNote(e.target.value)}
                    placeholder="Tuliskan alasan penolakan atau instruksi perbaikan..."
                    className="w-full rounded-xl border border-rose-200 p-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 bg-white"
                    rows={3}
                    autoFocus
                  />
                </div>
              )}
            </div>

            <div className="flex-none flex items-center justify-end gap-3 border-t border-zinc-100 p-6 bg-zinc-50 rounded-b-3xl">
              <button
                disabled={verifying}
                onClick={() => {
                  if (isRejectModalOpen) {
                    setIsRejectModalOpen(false);
                    setRejectNote("");
                  } else if (isApproveModalOpen) {
                    setIsApproveModalOpen(false);
                  } else {
                    setIsRejectModalOpen(true);
                  }
                }}
                className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${(isRejectModalOpen || isApproveModalOpen) ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300" : "bg-rose-100 text-rose-700 hover:bg-rose-200"}`}
              >
                {isRejectModalOpen ? "Batal Tolak" : isApproveModalOpen ? "Batal" : "Tolak (Revisi)"}
              </button>

              <button
                disabled={verifying}
                onClick={() => {
                  if (isRejectModalOpen) {
                    handleVerify(selectedMilestone.id, "REJECT");
                  } else if (isApproveModalOpen) {
                    handleVerify(selectedMilestone.id, "APPROVE");
                  } else {
                    setIsApproveModalOpen(true);
                  }
                }}
                className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all ${isRejectModalOpen ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"}`}
              >
                {verifying ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : isRejectModalOpen ? (
                  <XCircle weight="bold" size={18} />
                ) : (
                  <CheckCircle weight="bold" size={18} />
                )}
                {isRejectModalOpen ? "Kirim Penolakan" : isApproveModalOpen ? "Ya, Setujui Sekarang" : "Setujui Laporan"}
              </button>
            </div>
            
            {/* Custom Approval Confirmation Modal Overlay inside the main modal */}
            {isApproveModalOpen && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-3xl animate-fade-in p-6 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-xl shadow-emerald-100 border border-emerald-200">
                  <CheckCircle weight="fill" size={32} />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-zinc-900">Konfirmasi Persetujuan</h3>
                <p className="mb-6 max-w-sm text-sm text-zinc-500">
                  Apakah Anda yakin ingin menyetujui laporan progres ini? Total progres unit akan otomatis bertambah sebesar <span className="font-bold text-amber-600">+{selectedMilestone.bobotPersentase}%</span>.
                </p>
                <div className="flex w-full max-w-xs flex-col gap-3">
                  <button
                    disabled={verifying}
                    onClick={() => handleVerify(selectedMilestone.id, "APPROVE")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700"
                  >
                    {verifying ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    ) : (
                      <CheckCircle weight="bold" size={18} />
                    )}
                    Ya, Setujui Laporan
                  </button>
                  <button
                    disabled={verifying}
                    onClick={() => setIsApproveModalOpen(false)}
                    className="w-full rounded-xl bg-zinc-100 py-3 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-200"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      , document.body)}

      {/* Image Preview Modal */}
      {selectedImage && mounted && createPortal(
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute right-6 top-6 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X size={24} weight="bold" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={selectedImage} 
            alt="Preview" 
            className="max-h-[90vh] max-w-full rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      , document.body)}
    </div>
  );
}
