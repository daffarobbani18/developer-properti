"use client";

import { useEffect, useState } from "react";
import { Kanban, CircleNotch, DotsThreeOutlineVertical, UserCircle, ArrowsLeftRight } from "@phosphor-icons/react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Lead {
  id: string;
  name: string;
  phone: string;
  statusCrm: string;
  source: string;
  notes: string | null;
  createdAt: string;
}

const COLUMNS = [
  { id: "New", label: "🆕 New Lead", color: "border-blue-200 bg-blue-50/80 text-blue-700 font-bold", headerColor: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]", colBg: "bg-gradient-to-b from-blue-50/80 to-slate-50/40 border-blue-100/60", cardBorder: "border-t-blue-400" },
  { id: "Cold", label: "❄️ Cold", color: "border-slate-200 bg-slate-50/80 text-slate-700 font-bold", headerColor: "bg-gradient-to-r from-slate-500 to-zinc-500 text-white shadow-[0_0_10px_rgba(100,116,139,0.3)]", colBg: "bg-gradient-to-b from-slate-50/80 to-slate-50/40 border-slate-200/60", cardBorder: "border-t-slate-400" },
  { id: "Warm", label: "☀️ Warm", color: "border-amber-200 bg-amber-50/80 text-amber-700 font-bold", headerColor: "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-[0_0_10px_rgba(251,191,36,0.3)]", colBg: "bg-gradient-to-b from-amber-50/80 to-slate-50/40 border-amber-100/60", cardBorder: "border-t-amber-400" },
  { id: "Hot", label: "🔥 Hot", color: "border-rose-200 bg-rose-50/80 text-rose-700 font-bold", headerColor: "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.3)]", colBg: "bg-gradient-to-b from-rose-50/80 to-slate-50/40 border-rose-100/60", cardBorder: "border-t-rose-400" },
];

export default function PipelineSalesPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  
  // State untuk modal pindah manual (Mobile fallback)
  const [mobileMoveLead, setMobileMoveLead] = useState<Lead | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const loginRes = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "sales@erp.com", password: "password123" })
      });
      const loginData = await loginRes.json();
      
      if (loginData.token) {
        const res = await fetch("http://localhost:4000/api/sales/leads", {
          headers: { "Authorization": `Bearer ${loginData.token}` }
        });
        const json = await res.json();
        const data = json.data || json;
        if (Array.isArray(data)) {
          setLeads(data);
        }
      }
    } catch (err) {
      console.error("Gagal mengambil data", err);
      showToast("Gagal memuat data prospek", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    // Optimistic UI Update
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, statusCrm: newStatus } : l));
    setMobileMoveLead(null);
    
    try {
      const loginRes = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "sales@erp.com", password: "password123" })
      });
      const { token } = await loginRes.json();

      if (token) {
        const res = await fetch(`http://localhost:4000/api/sales/leads/${leadId}`, {
          method: "PUT",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ statusCrm: newStatus })
        });
        
        if (!res.ok) throw new Error("Gagal update status");
        showToast(`Status berhasil diubah menjadi ${newStatus}`);
      }
    } catch (err) {
      console.error("Update error", err);
      // Revert if failed
      showToast("Gagal mengubah status, mengembalikan data", "error");
      fetchData();
    }
  };

  // Drag and Drop Handlers (HTML5 Native)
  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead);
    // Setting effect allowed
    e.dataTransfer.effectAllowed = "move";
    // This is needed for Firefox to allow dragging
    e.dataTransfer.setData("text/plain", lead.id);
    
    // Add a slight transparency to the dragged item
    setTimeout(() => {
      const target = e.target as HTMLElement;
      target.style.opacity = "0.4";
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedLead(null);
    setDragOverColumn(null);
    const target = e.target as HTMLElement;
    target.style.opacity = "1";
  };

  const handleDragOver = (e: React.DragEvent, statusId: string) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = "move";
    if (dragOverColumn !== statusId) {
      setDragOverColumn(statusId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, statusId: string) => {
    // If the mouse leaves the container, clear it. 
    // This can be triggered by child elements, so we let handleDragEnd or handleDrop clear it fully.
  };

  const handleDrop = (e: React.DragEvent, statusId: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    if (draggedLead && draggedLead.statusCrm !== statusId) {
      updateLeadStatus(draggedLead.id, statusId);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex h-[calc(100vh-80px)] flex-col space-y-6 overflow-hidden">
      {/* HEADER */}
      <div className="shrink-0 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="mb-2 text-3xl font-[family-name:var(--font-heading)] text-zinc-900 flex items-center gap-3">
            <Kanban className="text-amber-500" weight="duotone" />
            Sales Pipeline
          </h2>
          <p className="text-sm text-zinc-500">Visualisasi status prospek pelanggan secara interaktif.</p>
        </div>
      </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm border border-zinc-100">
            <span className="inline-flex shrink-0 aspect-square h-9 w-9 items-center justify-center rounded-full bg-blue-100 leading-none">🆕</span>
            <div>
              <p className="font-bold text-blue-700 mb-0.5"><strong className="font-black">New:</strong> Belum difollow‑up</p>
              <p className="text-xs text-zinc-500">Prospek baru masuk, belum ada interaksi atau follow‑up.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm border border-zinc-100">
            <span className="inline-flex shrink-0 aspect-square h-9 w-9 items-center justify-center rounded-full bg-slate-200 leading-none">❄️</span>
            <div>
              <p className="font-bold text-slate-700 mb-0.5"><strong className="font-black">Cold:</strong> Menolak / Batal</p>
              <p className="text-xs text-zinc-500">Menolak, tidak merespon, nomor salah, atau batal beli.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm border border-zinc-100">
            <span className="inline-flex shrink-0 aspect-square h-9 w-9 items-center justify-center rounded-full bg-amber-100 leading-none">☀️</span>
            <div>
              <p className="font-bold text-amber-700 mb-0.5"><strong className="font-black">Warm:</strong> Masih pikir‑pikir</p>
              <p className="text-xs text-zinc-500">Menunjukkan minat, namun masih ragu atau butuh waktu berpikir.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm border border-zinc-100">
            <span className="inline-flex shrink-0 aspect-square h-9 w-9 items-center justify-center rounded-full bg-rose-100 leading-none">🔥</span>
            <div>
              <p className="font-bold text-rose-700 mb-0.5"><strong className="font-black">Hot:</strong> Siap survei / Beli</p>
              <p className="text-xs text-zinc-500">Sangat tertarik, punya budget, siap survei atau bayar (Prioritas utama).</p>
            </div>
          </div>
        </div>

      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 rounded-xl px-4 py-3 shadow-lg transition-all ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-500 text-white'}`}>
          <p className="text-sm font-bold">{toast.message}</p>
        </div>
      )}

      {/* KANBAN BOARD */}
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <CircleNotch weight="bold" className="h-10 w-10 animate-spin text-amber-500" />
        </div>
      ) : (
        <div className="flex flex-1 gap-6 overflow-x-auto pb-4 custom-scrollbar">
          {COLUMNS.map(col => {
            const colLeads = leads.filter(l => l.statusCrm === col.id);
            
            return (
              <div 
                key={col.id} 
                className={`flex min-w-[260px] flex-1 shrink-0 flex-col rounded-3xl p-3.5 shadow-sm border h-full backdrop-blur-sm transition-colors ${col.colBg}`}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={(e) => handleDragLeave(e, col.id)}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                <div className="mb-5 flex items-center justify-between px-2 pt-1">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-7 items-center rounded-lg px-3 text-xs font-black tracking-wide ${col.headerColor}`}>
                      {col.label}
                    </span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/60 text-xs font-black text-zinc-600 shadow-sm backdrop-blur-md">{colLeads.length}</span>
                  </div>
                </div>

                {/* Column Cards */}
                <div className="flex flex-1 flex-col gap-3 overflow-y-auto custom-scrollbar px-1 pb-2">
                  {colLeads.map(lead => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead)}
                      onDragEnd={handleDragEnd}
                      className={`group relative cursor-grab active:cursor-grabbing flex flex-col rounded-2xl border-x border-b border-t-4 border-x-white/80 border-b-white/80 bg-white/95 p-4 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.15)] hover:-translate-y-1 hover:border-x-white hover:border-b-white ${col.cardBorder}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                           <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-500 shadow-inner ${col.cardBorder.replace('border-t-', 'text-')}`}>
                             <UserCircle weight="duotone" className="h-6 w-6" />
                           </div>
                           <div>
                             <h4 className="font-bold text-zinc-900 leading-tight">{lead.name}</h4>
                             <p className="text-[11px] font-medium text-zinc-500 mt-0.5">{lead.phone}</p>
                           </div>
                        </div>
                        
                        {/* Mobile Move Button (Visible on small screens, or on hover on desktop) */}
                        <button 
                          onClick={() => setMobileMoveLead(lead)}
                          className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                          title="Pindahkan Status"
                        >
                          <ArrowsLeftRight weight="bold" />
                        </button>
                      </div>
                      
                      {lead.notes && (
                        <div className="mt-3 rounded-lg bg-zinc-50 p-2 border border-zinc-100">
                          <p className="text-[10px] text-zinc-500 line-clamp-2 italic">"{lead.notes}"</p>
                        </div>
                      )}
                      
                      <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                          {lead.source}
                        </span>
                        <span className={`rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${col.color}`}>
                          {col.id}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {colLeads.length === 0 && (!draggedLead || dragOverColumn !== col.id) && (
                    <div className="flex h-36 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/60 bg-white/30 backdrop-blur-sm">
                      <p className="text-xs font-bold text-zinc-400/80">Tarik kartu ke sini</p>
                    </div>
                  )}
                  
                  {/* GHOST PLACEHOLDER */}
                  {draggedLead && dragOverColumn === col.id && draggedLead.statusCrm !== col.id && (
                    <div className={`flex flex-col rounded-2xl border-2 border-dashed border-current p-4 opacity-50 blur-[0.5px] animate-pulse transition-all duration-300 ${col.color.replace('bg-', 'bg-opacity-50 ')}`}>
                       <div className="flex items-center gap-3">
                           <div className={`flex h-10 w-10 shrink-0 rounded-xl bg-white/50`}></div>
                           <div className="flex flex-col gap-1.5 w-full">
                               <div className="h-3.5 w-3/4 rounded-full bg-black/10"></div>
                               <div className="h-2.5 w-1/2 rounded-full bg-black/5"></div>
                           </div>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MOBILE MOVE MODAL */}
      <Dialog open={!!mobileMoveLead} onOpenChange={(open) => !open && setMobileMoveLead(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Pindahkan Prospek</DialogTitle>
            <DialogDescription>
              Pilih status baru untuk prospek <strong>{mobileMoveLead?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-4">
            {COLUMNS.map(col => (
              <button
                key={col.id}
                onClick={() => {
                  if (mobileMoveLead) updateLeadStatus(mobileMoveLead.id, col.id);
                }}
                disabled={mobileMoveLead?.statusCrm === col.id}
                className={`flex flex-col items-center justify-center rounded-xl border-2 p-4 transition-all ${
                  mobileMoveLead?.statusCrm === col.id 
                    ? 'border-zinc-200 bg-zinc-100 opacity-50 cursor-not-allowed' 
                    : 'border-zinc-200 bg-white hover:border-amber-400 hover:bg-amber-50'
                }`}
              >
                <span className={`mb-2 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${col.headerColor}`}>
                  {col.label}
                </span>
                <span className="text-xs font-medium text-zinc-600">
                  {mobileMoveLead?.statusCrm === col.id ? 'Status Saat Ini' : 'Pindah ke sini'}
                </span>
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" className="w-full" onClick={() => setMobileMoveLead(null)}>
              Batal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
