"use client";

import { useEffect, useState, useRef } from "react";
import { Pulse, Plus, CalendarBlank, CheckCircle, Clock, X, UserCircle, Phone, MagnifyingGlass, Funnel, Trash } from "@phosphor-icons/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Lead {
  id: string;
  name: string;
  phone: string;
  statusCrm: string;
}

interface Activity {
  id: string;
  leadId: string;
  salesId: string;
  title: string;
  type: string;
  date: string;
  status: string;
  notes: string | null;
  lead: {
    name: string;
    phone: string;
    statusCrm: string;
  };
}

const ACTIVITY_TYPES = [
  "Telepon",
  "WhatsApp",
  "Email",
  "Survei Lokasi",
  "Meeting",
  "Lainnya"
];

export default function AktivitasSalesPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  
  // UI State
  const [activeTab, setActiveTab] = useState<"pending" | "selesai">("pending");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    leadId: "",
    title: "",
    type: "Telepon",
    date: new Date().toISOString().split("T")[0],
    time: "09:00",
    notes: ""
  });

  // Searchable Select State
  const [leadSearchQuery, setLeadSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    fetchData();
    
    // Click outside to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Dummy login buat ambil token (seperti di modul lain)
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
        let token = "";
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          token = authData.token;
        }

      // Fetch Activities
      const actRes = await fetch("http://localhost:4000/api/sales/activities", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const actData = await actRes.json();
      
      // Fetch Leads untuk Dropdown
      const leadRes = await fetch("http://localhost:4000/api/sales/leads", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const leadData = await leadRes.json();

      if (actRes.ok) setActivities(actData.data || []);
      if (leadRes.ok) setLeads(leadData.data || []);
      
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-6 right-6 z-[200] flex animate-in slide-in-from-right-8 fade-in duration-300 items-center gap-3 rounded-xl px-6 py-4 text-sm font-bold text-white shadow-2xl transition-all ${
      type === 'success' ? 'bg-emerald-600 shadow-emerald-600/30' : 'bg-rose-600 shadow-rose-600/30'
    }`;
    toast.innerHTML = `<span class="tracking-wide">${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('animate-out', 'slide-out-to-right-8', 'fade-out');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 4000);
  };

  const openNewModal = () => {
    setFormData({
      leadId: "",
      title: "",
      type: "Telepon",
      date: new Date().toISOString().split("T")[0],
      time: "09:00",
      notes: ""
    });
    setSelectedLead(null);
    setLeadSearchQuery("");
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!selectedLead || !formData.title || !formData.date || !formData.time) {
      showToast("Harap isi semua field wajib", "error");
      return;
    }

    try {
      setSubmitting(true);
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
        let token = "";
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          token = authData.token;
        }
      
      // Combine date and time
      const dateTimeString = `${formData.date}T${formData.time}:00`;

      const res = await fetch("http://localhost:4000/api/sales/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          leadId: selectedLead.id,
          title: formData.title,
          type: formData.type,
          date: dateTimeString,
          notes: formData.notes
        })
      });

      if (res.ok) {
        showToast("Aktivitas berhasil ditambahkan", "success");
        setIsModalOpen(false);
        fetchData();
      } else {
        const err = await res.json();
        showToast(`Gagal: ${err.error}`, "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Gagal menghubungi server", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
        let token = "";
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          token = authData.token;
        }

      const res = await fetch(`http://localhost:4000/api/sales/activities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        showToast("Status aktivitas diperbarui", "success");
        fetchData();
      }
    } catch (error) {
      showToast("Gagal memperbarui status", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      setSubmitting(true);
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
        let token = "";
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          token = authData.token;
        }

      const res = await fetch(`http://localhost:4000/api/sales/activities/${deleteConfirmId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        showToast("Aktivitas dihapus", "success");
        setDeleteConfirmId(null);
        fetchData();
      }
    } catch (error) {
      showToast("Gagal menghapus", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter activities
  const displayedActivities = activities.filter(a => a.status.toLowerCase() === activeTab);
  
  // Stats
  const today = new Date().toISOString().split("T")[0];
  const todayActivities = activities.filter(a => a.date.startsWith(today));
  const completedToday = todayActivities.filter(a => a.status === "Selesai").length;

  // Searchable Select Filtering
  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(leadSearchQuery.toLowerCase()) || 
    l.phone.includes(leadSearchQuery)
  );

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* HEADER & STATS */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between mb-2">
        <div>
          <h2 className="mb-2 text-3xl font-[family-name:var(--font-heading)] text-zinc-900 flex items-center gap-3 tracking-tight">
            <Pulse className="text-blue-500" weight="duotone" size={32} />
            Aktivitas Sales
          </h2>
          <p className="text-sm text-zinc-500">Manajemen jadwal follow-up, survei lokasi, dan riwayat interaksi.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/50 px-5 py-2.5 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shadow-inner">
              <CheckCircle weight="fill" size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600/80">Selesai Hari Ini</p>
              <p className="text-xl font-black text-blue-700 leading-none mt-0.5">{completedToday} <span className="text-sm font-medium text-blue-600/60">/ {todayActivities.length}</span></p>
            </div>
          </div>
          
          <button
            onClick={openNewModal}
            className="flex h-[52px] items-center gap-2 rounded-xl bg-amber-600 px-5 font-bold text-white shadow-lg shadow-amber-600/20 transition-all hover:bg-amber-700 hover:-translate-y-0.5"
          >
            <Plus weight="bold" size={18} /> Tambah Aktivitas
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 border-b border-zinc-200">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${
            activeTab === "pending" ? "border-blue-600 text-blue-600" : "border-transparent text-zinc-500 hover:text-zinc-700"
          }`}
        >
          <Clock weight={activeTab === "pending" ? "bold" : "regular"} size={18} />
          To-Do List (Pending)
          <span className="ml-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">{activities.filter(a => a.status === "Pending").length}</span>
        </button>
        <button
          onClick={() => setActiveTab("selesai")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${
            activeTab === "selesai" ? "border-emerald-600 text-emerald-600" : "border-transparent text-zinc-500 hover:text-zinc-700"
          }`}
        >
          <CheckCircle weight={activeTab === "selesai" ? "bold" : "regular"} size={18} />
          Riwayat Selesai
          <span className="ml-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">{activities.filter(a => a.status === "Selesai").length}</span>
        </button>
      </div>

      {/* ACTIVITY LIST */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-3xl border border-zinc-100 bg-white">
          <Pulse className="animate-spin text-zinc-300" size={32} />
        </div>
      ) : displayedActivities.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-zinc-50/50 py-16 text-center">
          <CalendarBlank size={48} weight="duotone" className="mb-4 text-zinc-300" />
          <h3 className="mb-1 text-lg font-bold text-zinc-700">Tidak ada aktivitas</h3>
          <p className="text-sm text-zinc-500">Anda sudah menyelesaikan semua tugas di kategori ini.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayedActivities.map((act) => {
            const dateObj = new Date(act.date);
            const isToday = dateObj.toISOString().split("T")[0] === today;
            const isPast = dateObj < new Date() && act.status === "Pending";
            
            return (
              <div key={act.id} className="group flex flex-col rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-blue-200">
                {/* Card Header */}
                <div className="flex items-start justify-between border-b border-zinc-100 p-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        act.type === 'Telepon' ? 'bg-blue-50 text-blue-700' :
                        act.type === 'WhatsApp' ? 'bg-emerald-50 text-emerald-700' :
                        act.type === 'Survei Lokasi' ? 'bg-amber-50 text-amber-700' :
                        'bg-zinc-100 text-zinc-700'
                      }`}>
                        {act.type}
                      </span>
                      {isToday && act.status === 'Pending' && (
                        <span className="inline-flex rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-700 animate-pulse">
                          Hari Ini
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-zinc-900 leading-tight">{act.title}</h4>
                  </div>
                  
                  <button 
                    onClick={() => setDeleteConfirmId(act.id)}
                    className="opacity-0 group-hover:opacity-100 rounded-lg p-1.5 text-zinc-400 hover:bg-rose-50 hover:text-rose-600 transition-all"
                  >
                    <Trash weight="bold" />
                  </button>
                </div>
                
                {/* Lead Info */}
                <div className="flex items-center gap-3 p-4 bg-zinc-50/50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-400">
                    <UserCircle weight="duotone" size={24} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="truncate font-bold text-sm text-zinc-900">{act.lead.name}</p>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-0.5">
                      <Phone size={12} /> {act.lead.phone}
                    </div>
                  </div>
                </div>

                {act.notes && (
                  <div className="px-4 pb-0 pt-2">
                    <p className="text-xs text-zinc-600 italic border-l-2 border-zinc-200 pl-2">"{act.notes}"</p>
                  </div>
                )}
                
                {/* Footer / Actions */}
                <div className="mt-auto flex items-center justify-between p-4 pt-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <Clock size={14} className={isPast ? "text-rose-500" : "text-zinc-400"} />
                    <span className={isPast ? "text-rose-600" : "text-zinc-600"}>
                      {dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "short" })} • {dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  
                  {act.status === "Pending" ? (
                    <button
                      onClick={() => updateStatus(act.id, "Selesai")}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition-all hover:bg-emerald-600 hover:text-white shadow-sm"
                    >
                      <CheckCircle weight="bold" size={14} /> Tandai Selesai
                    </button>
                  ) : (
                    <button
                      onClick={() => updateStatus(act.id, "Pending")}
                      className="flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-600 transition-colors hover:bg-zinc-200"
                    >
                      Batalkan Selesai
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL TAMBAH AKTIVITAS */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Tambah Aktivitas Baru</DialogTitle>
            <DialogDescription>Jadwalkan interaksi atau tugas baru terkait prospek (Lead) Anda.</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-5 py-4">
            
            {/* Searchable Select Lead */}
            <div className="relative" ref={dropdownRef}>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-600">Pilih Prospek (Lead) <span className="text-rose-500">*</span></label>
              
              {selectedLead ? (
                <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <UserCircle size={20} className="text-emerald-600" />
                    <div>
                      <p className="font-bold text-emerald-900 text-sm">{selectedLead.name}</p>
                      <p className="text-xs text-emerald-700">{selectedLead.phone}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setSelectedLead(null); setLeadSearchQuery(""); }}
                    className="rounded-full p-1 text-emerald-600 hover:bg-emerald-200 transition-colors"
                  >
                    <X size={16} weight="bold" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input
                    type="text"
                    placeholder="Cari nama atau nomor WA..."
                    value={leadSearchQuery}
                    onChange={(e) => {
                      setLeadSearchQuery(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    className="w-full rounded-xl border border-zinc-300 bg-white py-3 pl-11 pr-4 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                  />
                  
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-60 overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-xl">
                      {filteredLeads.length > 0 ? (
                        <div className="p-1">
                          {filteredLeads.map(lead => (
                            <button
                              key={lead.id}
                              onClick={() => {
                                setSelectedLead(lead);
                                setIsDropdownOpen(false);
                              }}
                              className="flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-left hover:bg-zinc-50 transition-colors"
                            >
                              <div>
                                <p className="font-bold text-zinc-900 text-sm">{lead.name}</p>
                                <p className="text-xs text-zinc-500">{lead.phone}</p>
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-100 px-2 py-1 rounded-md">{lead.statusCrm}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-zinc-500">Tidak ada prospek ditemukan.</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-600">Judul Aktivitas <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="Misal: Follow up DP"
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
              
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-600">Tipe <span className="text-rose-500">*</span></label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                >
                  {ACTIVITY_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-600">Tanggal <span className="text-rose-500">*</span></label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-600">Waktu <span className="text-rose-500">*</span></label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-600">Catatan</label>
              <textarea
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                placeholder="Catatan persiapan atau hasil..."
                rows={3}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-none"
              />
            </div>

          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={submitting || !selectedLead || !formData.title}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {submitting ? "Menyimpan..." : "Simpan Aktivitas"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL KONFIRMASI HAPUS */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent className="sm:max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
            <Trash weight="duotone" className="text-rose-600" size={24} />
          </div>
          <DialogTitle className="text-center text-lg">Hapus Aktivitas?</DialogTitle>
          <DialogDescription className="text-center">
            Aktivitas ini akan dihapus secara permanen. Anda yakin?
          </DialogDescription>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirmId(null)}>
              Batal
            </Button>
            <Button variant="destructive" className="flex-1" onClick={handleDelete} disabled={submitting}>
              {submitting ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
