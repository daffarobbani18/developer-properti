"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Plus, MagnifyingGlass, X, User, Phone, EnvelopeSimple, MapPin, Trash, PencilSimple, Users, CircleNotch, CaretDown, IdentificationBadge } from "@phosphor-icons/react";

// Hook untuk debounce pencarian
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function SalesLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400); // 400ms delay
  const [statusFilter, setStatusFilter] = useState("Semua");
  
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id: "",
    nik: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    source: "Walk-in",
    statusCrm: "New",
    notes: ""
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (statusFilter !== "Semua") queryParams.append("statusCrm", statusFilter);
      if (debouncedSearch) queryParams.append("search", debouncedSearch);

      const res = await fetch(`http://localhost:4000/api/sales/leads?${queryParams.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setLeads(data.data || data);
      }
    } catch (e) {
      console.error(e);
      showToast('Gagal memuat data pelanggan', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch setiap filter atau pencarian (yang sudah di-debounce) berubah
  useEffect(() => {
    fetchLeads();
  }, [statusFilter, debouncedSearch]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-6 right-6 z-[200] flex animate-in slide-in-from-right-8 fade-in duration-300 items-center gap-3 rounded-xl px-6 py-4 text-sm font-bold text-white shadow-2xl transition-all ${
      type === 'success' ? 'bg-emerald-600 shadow-emerald-600/30' : 'bg-rose-600 shadow-rose-600/30'
    }`;
    toast.innerHTML = `<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-md">
      ${type === 'success' ? '<svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.51A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z"></path></svg>'
      : '<svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z"></path></svg>'}
    </div>
    <span class="tracking-wide">${message}</span>`;
    
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('animate-out', 'slide-out-to-right-8', 'fade-out');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 4000);
  };

  const getStatusBadge = (status: string) => {
    switch(status?.toLowerCase()) {
      case "hot":
        return <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 border border-rose-200 shadow-sm"><span className="text-[10px]">🔥</span> Hot</span>;
      case "warm":
        return <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200 shadow-sm"><span className="text-[10px]">🌤️</span> Warm</span>;
      case "cold":
        return <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 border border-slate-200 shadow-sm"><span className="text-[10px]">❄️</span> Cold</span>;
      default:
        return <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200 shadow-sm"><span className="text-[10px]">✨</span> New</span>;
    }
  };

  const openNewModal = () => {
    setFormData({ id: "", nik: "", name: "", phone: "", email: "", address: "", source: "Walk-in", statusCrm: "New", notes: "" });
    setModalMode("add");
    setIsModalOpen(true);
  };

  const openEditModal = (lead: any) => {
    setFormData({
      id: lead.id,
      nik: lead.nik || "",
      name: lead.name,
      phone: lead.phone,
      email: lead.email || "",
      address: lead.address || "",
      source: lead.source || "Walk-in",
      statusCrm: lead.statusCrm || "New",
      notes: lead.notes || ""
    });
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone) {
      showToast("Nama dan WhatsApp wajib diisi", "error");
      return;
    }

    try {
      setSubmitting(true);
      // Dummy login buat ambil token (seperti di modul lain)
      const loginRes = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "sales@erp.com", password: "password123" }) // Gunakan role sales
      });
      const { token } = await loginRes.json();
      
      const endpoint = modalMode === "edit" ? `http://localhost:4000/api/sales/leads/${formData.id}` : "http://localhost:4000/api/sales/leads";
      const method = modalMode === "edit" ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast(`Gagal: ${err.message || err.error || res.statusText}`, 'error');
        return;
      }

      setIsModalOpen(false);
      await fetchLeads();
      showToast(`Berhasil ${modalMode === 'edit' ? 'memperbarui' : 'menambah'} pelanggan`, 'success');
    } catch (e) {
      console.error(e);
      showToast("Gagal menghubungi server", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      setSubmitting(true);
      const loginRes = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "sales@erp.com", password: "password123" })
      });
      const { token } = await loginRes.json();

      const res = await fetch(`http://localhost:4000/api/sales/leads/${deleteConfirmId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast(`Gagal: ${err.message || err.error || res.statusText}`, 'error');
        return;
      }

      setDeleteConfirmId(null);
      setIsModalOpen(false);
      await fetchLeads();
      showToast("Data pelanggan berhasil dihapus", "success");
    } catch (e) {
      console.error(e);
      showToast("Gagal menghapus data", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-blue-700 mb-2 font-bold">
            <Users weight="duotone" size={12} className="text-blue-500" /> Area Sales & Marketing
          </div>
          <h2 className="text-3xl font-[family-name:var(--font-heading)] text-zinc-900 tracking-tight">Manajemen Pelanggan (Leads)</h2>
          <p className="text-sm text-zinc-500 mt-1">Kelola data prospek, pantau tingkat ketertarikan, dan riwayat pelanggan.</p>
        </div>
        <button
          onClick={openNewModal}
          className="flex whitespace-nowrap items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700"
        >
          <Plus weight="bold" size={16} /> Tambah Pelanggan Baru
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <MagnifyingGlass className="text-zinc-400" size={18} />
          </div>
          <input
            type="text"
            placeholder="Cari nama atau No. WhatsApp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-11 pr-4 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Filter Status:</span>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none rounded-xl border border-zinc-200 bg-white py-2.5 pl-4 pr-10 text-sm font-semibold text-zinc-700 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
            >
              <option value="Semua">Semua Status</option>
              <option value="New">✨ New</option>
              <option value="Hot">🔥 Hot</option>
              <option value="Warm">🌤️ Warm</option>
              <option value="Cold">❄️ Cold</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400">
              <CaretDown size={14} weight="bold" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50/80 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Nama Lengkap</th>
                <th className="px-6 py-4 font-semibold">NIK KTP</th>
                <th className="px-6 py-4 font-semibold">WhatsApp / Email</th>
                <th className="px-6 py-4 font-semibold">Domisili</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    <CircleNotch weight="bold" className="mx-auto h-6 w-6 animate-spin text-blue-600 mb-2" />
                    Memuat data...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    Tidak ada pelanggan yang sesuai dengan filter/pencarian Anda.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="transition-colors hover:bg-zinc-50/80 group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">{lead.name}</div>
                      <div className="text-xs text-zinc-400 mt-0.5">ID: {lead.id.substring(0, 8)}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-600">
                      {lead.nik || <span className="text-zinc-300 italic">Belum diisi</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-medium text-zinc-700">
                        <Phone size={14} className="text-zinc-400" /> {lead.phone}
                      </div>
                      {lead.email && (
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                          <EnvelopeSimple size={14} className="text-zinc-400" /> {lead.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {lead.address ? (
                        <div className="flex items-start gap-1.5 text-zinc-600 max-w-[200px] truncate" title={lead.address}>
                          <MapPin size={14} className="text-zinc-400 shrink-0 mt-0.5" /> {lead.address}
                        </div>
                      ) : (
                        <span className="text-zinc-300 italic">Belum diisi</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(lead.statusCrm)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEditModal(lead)}
                        className="inline-flex items-center justify-center rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-700 transition-colors hover:bg-blue-100 hover:text-blue-700"
                      >
                        Detail Profil
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Tambah/Edit Data */}
      {isModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm transition-all duration-300">
          
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 rounded-2xl bg-white shadow-2xl duration-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${modalMode === 'add' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                  {modalMode === 'add' ? <User weight="duotone" size={20} /> : <PencilSimple weight="duotone" size={20} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">{modalMode === "add" ? "Tambah Pelanggan Baru" : "Detail & Edit Profil Pelanggan"}</h3>
                  <p className="text-xs text-zinc-500">Isi data profil dan identitas dengan benar.</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 text-zinc-400 hover:bg-rose-100 hover:text-rose-600 transition-colors">
                <X weight="bold" size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                {/* Kolom Kiri */}
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-600">Nama Lengkap <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-600">Nomor Induk Kependudukan (NIK)</label>
                    <div className="relative">
                      <IdentificationBadge className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                      <input
                        type="text"
                        value={formData.nik}
                        onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                        placeholder="16 Digit NIK KTP"
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-11 pr-4 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-600">Alamat (Domisili)</label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota..."
                      rows={3}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-none"
                    />
                  </div>
                </div>

                {/* Kolom Kanan */}
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-600">No. WhatsApp <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="081234567890"
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-11 pr-4 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-600">Alamat Email</label>
                    <div className="relative">
                      <EnvelopeSimple className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="budi@email.com"
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-11 pr-4 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                    <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-zinc-600">Status Prospek (CRM)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setFormData({ ...formData, statusCrm: "New" })}
                        className={`rounded-lg border px-3 py-2 text-xs font-bold transition-all ${formData.statusCrm === "New" ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm" : "border-zinc-200 bg-zinc-50 text-zinc-500 hover:bg-zinc-100"}`}
                      >
                        ✨ New
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, statusCrm: "Hot" })}
                        className={`rounded-lg border px-3 py-2 text-xs font-bold transition-all ${formData.statusCrm === "Hot" ? "border-rose-500 bg-rose-50 text-rose-700 shadow-sm" : "border-zinc-200 bg-zinc-50 text-zinc-500 hover:bg-zinc-100"}`}
                      >
                        🔥 Hot
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, statusCrm: "Warm" })}
                        className={`rounded-lg border px-3 py-2 text-xs font-bold transition-all ${formData.statusCrm === "Warm" ? "border-amber-500 bg-amber-50 text-amber-700 shadow-sm" : "border-zinc-200 bg-zinc-50 text-zinc-500 hover:bg-zinc-100"}`}
                      >
                        🌤️ Warm
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, statusCrm: "Cold" })}
                        className={`rounded-lg border px-3 py-2 text-xs font-bold transition-all ${formData.statusCrm === "Cold" ? "border-slate-500 bg-slate-100 text-slate-700 shadow-sm" : "border-zinc-200 bg-zinc-50 text-zinc-500 hover:bg-zinc-100"}`}
                      >
                        ❄️ Cold
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-600">Catatan Internal (Opsional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Catatan dari hasil obrolan/follow up..."
                  rows={2}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-none"
                />
              </div>

            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row-reverse sm:justify-start gap-3 px-6 py-4 border-t border-zinc-100 bg-zinc-50/50">
              <button 
                onClick={handleSubmit} 
                disabled={submitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? <CircleNotch weight="bold" className="animate-spin h-5 w-5" /> : (modalMode === "add" ? "Simpan Data" : "Simpan Perubahan")}
              </button>
              
              {modalMode === "edit" && (
                <button
                  onClick={() => setDeleteConfirmId(formData.id)}
                  className="w-full sm:w-auto rounded-xl bg-white border border-rose-200 px-6 py-3 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-50"
                >
                  Hapus
                </button>
              )}
              
              <button
                onClick={() => setIsModalOpen(false)}
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
              <Trash weight="duotone" className="text-rose-600" size={24} />
            </div>
            <h3 className="mb-2 text-center text-lg font-bold text-zinc-900">Hapus Pelanggan?</h3>
            <p className="mb-6 text-center text-sm text-zinc-500">
              Data pelanggan dan riwayatnya akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 rounded-xl bg-zinc-100 py-3 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-200"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={submitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 py-3 text-sm font-bold text-white shadow-lg shadow-rose-600/20 transition-all hover:bg-rose-700 disabled:opacity-50"
              >
                {submitting ? <CircleNotch weight="bold" className="animate-spin" /> : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      , document.body)}

    </div>
  );
}
