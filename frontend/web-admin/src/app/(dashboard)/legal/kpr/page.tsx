"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  Bank, FileText, CheckCircle, WarningCircle, CaretRight, 
  UploadSimple, DownloadSimple, User, Building, MapPin, Spinner, X, MagnifyingGlass, Eye, HouseSimple, Columns, ListBullets
} from "@phosphor-icons/react";

const KPR_STATUSES = [
  "Kumpul Berkas", 
  "BI Checking", 
  "Wawancara Bank", 
  "SP3K Terbit", 
  "Siap Akad", 
  "Selesai Akad",
  "Ditolak Bank / Batal"
];

const KPR_COLUMNS = [
  { id: "Kumpul Berkas", label: "📂 Kumpul Berkas", headerColor: "bg-gradient-to-r from-slate-500 to-zinc-500 text-white shadow-[0_0_10px_rgba(100,116,139,0.3)]", colBg: "bg-gradient-to-b from-slate-50/80 to-slate-50/40 border-slate-200/60", cardBorder: "border-t-slate-400" },
  { id: "BI Checking", label: "🔎 BI Checking", headerColor: "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-[0_0_10px_rgba(251,191,36,0.3)]", colBg: "bg-gradient-to-b from-amber-50/80 to-slate-50/40 border-amber-100/60", cardBorder: "border-t-amber-400" },
  { id: "Wawancara Bank", label: "🗣️ Wawancara Bank", headerColor: "bg-gradient-to-r from-orange-400 to-rose-400 text-white shadow-[0_0_10px_rgba(249,115,22,0.3)]", colBg: "bg-gradient-to-b from-orange-50/80 to-slate-50/40 border-orange-100/60", cardBorder: "border-t-orange-400" },
  { id: "SP3K Terbit", label: "📜 SP3K Terbit", headerColor: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]", colBg: "bg-gradient-to-b from-blue-50/80 to-slate-50/40 border-blue-100/60", cardBorder: "border-t-blue-400" },
  { id: "Siap Akad", label: "✍️ Siap Akad", headerColor: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)]", colBg: "bg-gradient-to-b from-indigo-50/80 to-slate-50/40 border-indigo-100/60", cardBorder: "border-t-indigo-400" },
  { id: "Selesai Akad", label: "✅ Selesai Akad", headerColor: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]", colBg: "bg-gradient-to-b from-emerald-50/80 to-slate-50/40 border-emerald-100/60", cardBorder: "border-t-emerald-400" },
  { id: "Ditolak Bank / Batal", label: "❌ Ditolak / Batal", headerColor: "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-[0_0_10px_rgba(225,29,72,0.3)]", colBg: "bg-gradient-to-b from-rose-50/80 to-slate-50/40 border-rose-100/60", cardBorder: "border-t-rose-500" }
];

const DOC_TYPES = [
  "KTP Suami/Istri", "Kartu Keluarga", "NPWP", "Buku Nikah", 
  "Slip Gaji 3 Bulan", "Rekening Koran 3 Bulan", "Surat Keterangan Kerja"
];

export default function PipelineKprPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [kprSettings, setKprSettings] = useState<any>(null);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  
  // View mode
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("info"); // info, dokumen
  const [blockerModal, setBlockerModal] = useState({ isOpen: false, message: "" });
  const [cancelModal, setCancelModal] = useState({ isOpen: false, bookingId: "", alasan: "", kebijakan: "hanguskan" as "hanguskan" | "kembalikan" });
  const [regressionModal, setRegressionModal] = useState({ isOpen: false, bookingId: "", newStatus: "", fromStatus: "", source: "" });
  
  // Drag state
  const [draggedBooking, setDraggedBooking] = useState<any>(null);
  const [dragOverStatus, setDragOverStatus] = useState<string | null>(null);
  
  // Form states
  const [kprForm, setKprForm] = useState({
    status: "",
    bankName: "",
    plafondPengajuan: 0,
    plafondDisetujui: 0,
    notes: ""
  });
  
  const [uploadForm, setUploadForm] = useState({
    documentType: DOC_TYPES[0],
    notes: "",
    file: null as File | null
  });

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);

  const fetchKpr = async () => {
    setLoading(true);
    try {
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
        let token = "";
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          token = authData.token;
        }

      const res = await fetch("http://localhost:4000/api/legal/kpr", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Gagal mengambil data KPR");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
      let token = "";
      if (authDataStr) {
        const authData = JSON.parse(authDataStr);
        token = authData.token;
      }
      const res = await fetch("http://localhost:4000/api/settings/kpr", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setKprSettings(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchKpr();
    fetchSettings();
  }, []);

  const handleOpenModal = (booking: any) => {
    setSelectedBooking(booking);
    
    // Hitung sisa tagihan dasar (Harga Unit - Booking Fee)
    // Dalam implementasi nyata, jika ada DP tambahan, harus dikurangi juga
    const unitPrice = booking.unit.totalPrice || booking.unit.price || 0;
    const sisaTagihan = unitPrice - (booking.bookingFee || 0);

    setKprForm({
      status: booking.kprApplication?.status || "Kumpul Berkas",
      bankName: booking.kprApplication?.bankName || "",
      plafondPengajuan: booking.kprApplication?.plafondPengajuan || sisaTagihan,
      plafondDisetujui: booking.kprApplication?.plafondDisetujui || kprSettings?.kprMaxPlafon || 157700000,
      notes: booking.kprApplication?.notes || ""
    });
    setActiveTab("info");
    setIsModalOpen(true);
  };

  const executeApiUpdate = async (bookingId: string, payload: any) => {
    setSubmitting(true);
    try {
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
        let token = "";
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          token = authData.token;
        }

      const res = await fetch(`http://localhost:4000/api/legal/kpr/${bookingId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Gagal memperbarui status");
      }
      
      setToast({ message: "Status KPR berhasil diperbarui", type: "success" });
      setIsModalOpen(false);
      fetchKpr();
    } catch (err: any) {
      fetchKpr(); // Revert on error
      if (err.message.includes("Selisih Plafon") || err.message.includes("Siap Akad")) {
        setBlockerModal({ isOpen: true, message: err.message });
      } else {
        setToast({ message: err.message, type: "error" });
      }
    } finally {
      setSubmitting(false);
      setDraggedBooking(null);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleUpdateStatus = async () => {
    const currentStatus = selectedBooking.kprApplication?.status || "Kumpul Berkas";
    
    if (currentStatus === "Selesai Akad" || currentStatus === "Ditolak Bank / Batal") {
      setToast({ message: "Status final tidak dapat diubah lagi.", type: "error" });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    if (kprForm.status === "Ditolak Bank / Batal") {
      setCancelModal({
        isOpen: true,
        bookingId: selectedBooking.id,
        alasan: "",
        kebijakan: "hanguskan"
      });
      setIsModalOpen(false);
      return;
    }

    const currentIndex = KPR_STATUSES.indexOf(currentStatus);
    const newIndex = KPR_STATUSES.indexOf(kprForm.status);

    if (newIndex < currentIndex) {
      setRegressionModal({
        isOpen: true,
        bookingId: selectedBooking.id,
        newStatus: kprForm.status,
        fromStatus: currentStatus,
        source: "modal"
      });
      return;
    }

    executeApiUpdate(selectedBooking.id, kprForm);
  };

  const handleConfirmRegression = () => {
    const { bookingId, newStatus, source } = regressionModal;
    setRegressionModal({ isOpen: false, bookingId: "", newStatus: "", fromStatus: "", source: "" });
    
    if (source === "modal") {
      executeApiUpdate(bookingId, kprForm);
    } else {
      const b = bookings.find(x => x.id === bookingId);
      const payload = {
        status: newStatus,
        bankName: b?.kprApplication?.bankName,
        plafondPengajuan: b?.kprApplication?.plafondPengajuan,
        plafondDisetujui: b?.kprApplication?.plafondDisetujui,
        notes: b?.kprApplication?.notes
      };
      
      // Optimistic update
      setBookings(prev => prev.map(x => 
        x.id === bookingId ? { ...x, kprApplication: { ...x.kprApplication, status: newStatus } } : x
      ));
      
      executeApiUpdate(bookingId, payload);
    }
  };

  const handleDragStart = (booking: any) => {
    setDraggedBooking(booking);
  };

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (dragOverStatus !== status) {
      setDragOverStatus(status);
    }
  };

  const handleDragLeave = () => {
    setDragOverStatus(null);
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    setDragOverStatus(null);
    
    if (!draggedBooking) return;
    const currentStatus = draggedBooking.kprApplication?.status || "Kumpul Berkas";
    
    if (currentStatus === "Selesai Akad" || currentStatus === "Ditolak Bank / Batal") {
      setToast({ message: "Kartu dengan status final tidak dapat dipindahkan.", type: "error" });
      setDraggedBooking(null);
      setTimeout(() => setToast(null), 3000);
      return;
    }

    if (currentStatus === targetStatus) {
      setDraggedBooking(null);
      return;
    }

    if (targetStatus === "Ditolak Bank / Batal") {
      setCancelModal({
        isOpen: true,
        bookingId: draggedBooking.id,
        alasan: "",
        kebijakan: "hanguskan"
      });
      setDraggedBooking(null);
      return;
    }

    const currentIndex = KPR_STATUSES.indexOf(currentStatus);
    const newIndex = KPR_STATUSES.indexOf(targetStatus);

    if (newIndex < currentIndex) {
      setRegressionModal({
        isOpen: true,
        bookingId: draggedBooking.id,
        newStatus: targetStatus,
        fromStatus: currentStatus,
        source: "drag"
      });
      return;
    }

    if (targetStatus === "SP3K Terbit") {
      setDraggedBooking(null);
      handleOpenModal(draggedBooking);
      setKprForm(prev => ({ ...prev, status: targetStatus }));
      return;
    }

    // Optimistic update
    setBookings(prev => prev.map(b => 
      b.id === draggedBooking.id ? 
      { ...b, kprApplication: { ...b.kprApplication, status: targetStatus } } 
      : b
    ));

    const payload = {
      status: targetStatus,
      bankName: draggedBooking.kprApplication?.bankName,
      plafondPengajuan: draggedBooking.kprApplication?.plafondPengajuan,
      plafondDisetujui: draggedBooking.kprApplication?.plafondDisetujui,
      notes: draggedBooking.kprApplication?.notes
    };

    executeApiUpdate(draggedBooking.id, payload);
  };

  const handleCancelKPR = async () => {
    if (!cancelModal.alasan.trim()) {
      setToast({ message: "Alasan pembatalan wajib diisi!", type: "error" });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setSubmitting(true);
    try {
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
        let token = "";
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          token = authData.token;
        }

      const payload = {
        status: "Ditolak Bank / Batal",
        alasanPembatalan: cancelModal.alasan,
        kebijakanUang: cancelModal.kebijakan
      };

      const res = await fetch(`http://localhost:4000/api/legal/kpr/${cancelModal.bookingId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Gagal membatalkan KPR");
      }
      
      setToast({ message: "Proses pembatalan KPR berhasil", type: "success" });
      setCancelModal({ isOpen: false, bookingId: "", alasan: "", kebijakan: "hanguskan" });
      fetchKpr();
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleUploadDocument = async () => {
    if (!uploadForm.file) return alert("Pilih file terlebih dahulu");
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("documentType", uploadForm.documentType);
      formData.append("notes", uploadForm.notes);
      formData.append("file", uploadForm.file);

      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
        let token = "";
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          token = authData.token;
        }

      const res = await fetch(`http://localhost:4000/api/legal/kpr/${selectedBooking.id}/documents`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });
      
      if (!res.ok) throw new Error("Gagal mengunggah dokumen");
      
      const newDoc = await res.json();
      
      setToast({ message: "Dokumen berhasil diunggah", type: "success" });
      setUploadForm({ ...uploadForm, file: null, notes: "" });
      
      // Optimistic update for the modal
      setSelectedBooking((prev: any) => {
        if (!prev) return prev;
        const currentKpr = prev.kprApplication || {};
        const currentDocs = currentKpr.documents || [];
        return {
          ...prev,
          kprApplication: {
            ...currentKpr,
            documents: [...currentDocs, newDoc]
          }
        };
      });
      
      fetchKpr(); // Refresh to get new docs in main state
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="p-4 md:p-8 flex flex-col h-[calc(100vh-4rem)] mx-auto animate-in fade-in duration-500 max-w-[1600px]">
      {/* Header */}
      <div className="flex-none flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <h2 className="flex items-center gap-2 text-3xl font-[family-name:var(--font-heading)] text-zinc-900 tracking-tight">
            <Bank weight="duotone" size={24} className="text-blue-500" /> Pipeline KPR
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Pantau dan kelola proses pengajuan KPR klien ke pihak Bank dari tahap pengumpulan berkas hingga proses Akad.
          </p>
        </div>
        <div className="flex items-center bg-zinc-100 p-1.5 rounded-xl border border-zinc-200">
          <button 
            onClick={() => setViewMode("kanban")}
            className={`px-4 py-2 text-sm font-bold rounded-lg flex items-center gap-2 transition-all ${viewMode === "kanban" ? "bg-white text-blue-600 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
          >
            <Columns size={18} weight={viewMode === "kanban" ? "bold" : "regular"} /> Papan
          </button>
          <button 
            onClick={() => setViewMode("list")}
            className={`px-4 py-2 text-sm font-bold rounded-lg flex items-center gap-2 transition-all ${viewMode === "list" ? "bg-white text-blue-600 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
          >
            <ListBullets size={18} weight={viewMode === "list" ? "bold" : "regular"} /> Daftar Tabel
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner className="animate-spin text-blue-500" size={32} />
        </div>
      ) : viewMode === "kanban" ? (
        <div className="flex-1 flex overflow-x-auto gap-6 pb-4 custom-scrollbar items-start">
          {KPR_COLUMNS.map(col => {
            const columnBookings = bookings.filter(b => (b.kprApplication?.status || "Kumpul Berkas") === col.id);
            return (
              <div 
                key={col.id} 
                className={`flex min-w-[260px] w-[280px] sm:w-[320px] shrink-0 flex-col rounded-3xl p-3.5 shadow-sm border h-full backdrop-blur-sm transition-colors ${dragOverStatus === col.id ? "opacity-70 scale-[0.98]" : ""} ${col.colBg}`}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                <div className="mb-5 flex items-center justify-between px-2 pt-1">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-7 items-center rounded-lg px-3 text-xs font-black tracking-wide ${col.headerColor}`}>
                      {col.label}
                    </span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/60 text-xs font-black text-zinc-600 shadow-sm backdrop-blur-md">
                      {columnBookings.length}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-1 flex-col gap-3 overflow-y-auto custom-scrollbar px-1 pb-2">
                  {columnBookings.length === 0 ? (
                    <div className="flex h-36 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/60 bg-white/30 backdrop-blur-sm">
                      <p className="text-xs font-bold text-zinc-400/80">Belum ada Klien</p>
                    </div>
                  ) : (
                    columnBookings.map(booking => (
                      <div 
                        key={booking.id} 
                        draggable
                        onDragStart={() => handleDragStart(booking)}
                        onClick={() => handleOpenModal(booking)}
                        className={`group cursor-grab active:cursor-grabbing flex flex-col rounded-2xl border-x border-b border-t-4 border-x-white/80 border-b-white/80 bg-white/95 p-4 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.15)] hover:-translate-y-1 hover:border-x-white hover:border-b-white ${
                          booking.kprApplication?.isPlafonTurun ? "border-t-rose-400 border-rose-300 shadow-[0_0_15px_rgba(225,29,72,0.2)]" : col.cardBorder
                        } ${draggedBooking?.id === booking.id ? "opacity-50 scale-95 border-blue-400 shadow-lg" : ""}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-500 shadow-inner ${col.cardBorder.replace('border-t-', 'text-')}`}>
                              <User weight="duotone" className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="font-bold text-zinc-900 leading-tight line-clamp-1">{booking.lead.name}</p>
                              <p className="text-[11px] font-medium text-zinc-500 mt-0.5">Blok {booking.unit.blok}-{booking.unit.nomor}</p>
                            </div>
                          </div>
                        </div>
                        
                        {booking.kprApplication?.bankName && (
                          <div className="mb-2">
                            <span className="inline-block text-[9px] font-black bg-blue-50 text-blue-700 px-2 py-1 rounded-md uppercase tracking-wider border border-blue-100">
                              {booking.kprApplication.bankName}
                            </span>
                          </div>
                        )}
                        
                        {booking.kprApplication?.isPlafonTurun && (
                          <div className="mt-2 bg-rose-50 border border-rose-100 rounded-lg p-2 flex items-start gap-1.5">
                            <WarningCircle className="text-rose-600 shrink-0 mt-0.5" weight="fill" size={14} />
                            <div>
                              <p className="text-[10px] font-bold text-rose-700 leading-tight">PLAFON TURUN</p>
                              <p className="text-[10px] font-semibold text-rose-600">Kurang: Rp {booking.kprApplication.selisihPlafon.toLocaleString("id-ID")}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 overflow-hidden flex flex-col bg-white border border-zinc-200 rounded-2xl shadow-sm">
          <div className="overflow-x-auto flex-1 custom-scrollbar">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-50/80 text-xs uppercase tracking-wider text-zinc-500 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-4 font-bold">Klien & Unit</th>
                  <th className="px-6 py-4 font-bold">Status KPR</th>
                  <th className="px-6 py-4 font-bold">Bank</th>
                  <th className="px-6 py-4 font-bold">Plafond</th>
                  <th className="px-6 py-4 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">Belum ada pengajuan KPR.</td>
                  </tr>
                ) : (
                  bookings.map(booking => (
                    <tr key={booking.id} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-bold text-zinc-900">{booking.lead.name}</p>
                        <p className="text-xs text-zinc-500 mt-1">Blok {booking.unit.blok}-{booking.unit.nomor}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                          {booking.kprApplication?.status || "Kumpul Berkas"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-zinc-600">
                        {booking.kprApplication?.bankName || "-"}
                      </td>
                      <td className="px-6 py-4">
                        {booking.kprApplication?.isPlafonTurun ? (
                          <div className="text-rose-600 font-bold flex items-center gap-1.5 text-xs">
                            <WarningCircle weight="fill" /> Turun (Selisih: Rp {booking.kprApplication.selisihPlafon.toLocaleString("id-ID")})
                          </div>
                        ) : (
                          booking.kprApplication?.plafondDisetujui ? (
                            <span className="font-bold text-emerald-600">Rp {booking.kprApplication.plafondDisetujui.toLocaleString("id-ID")}</span>
                          ) : "-"
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => handleOpenModal(booking)}
                          className="bg-zinc-100 hover:bg-blue-100 text-zinc-700 hover:text-blue-700 px-4 py-2 rounded-lg text-xs font-bold transition-colors"
                        >
                          Kelola KPR
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Kelola KPR */}
      {isModalOpen && selectedBooking && mounted && createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                  Pengajuan KPR: {selectedBooking.lead.name}
                </h2>
                <p className="text-xs text-zinc-500 font-medium mt-0.5">Blok {selectedBooking.unit.blok}-{selectedBooking.unit.nomor} &middot; {selectedBooking.unit.project.name}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-200 rounded-full transition-colors self-start">
                <X size={20} weight="bold" className="text-zinc-500" />
              </button>
            </div>
            
            <div className="flex border-b border-zinc-200">
              <button 
                onClick={() => setActiveTab("info")}
                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "info" ? "border-blue-600 text-blue-600" : "border-transparent text-zinc-500 hover:text-zinc-700"}`}
              >
                Informasi & Status
              </button>
              <button 
                onClick={() => setActiveTab("dokumen")}
                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "dokumen" ? "border-blue-600 text-blue-600" : "border-transparent text-zinc-500 hover:text-zinc-700"}`}
              >
                Laci Dokumen
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {activeTab === "info" ? (
                <div className="space-y-5">
                  {selectedBooking.kprApplication?.isPlafonTurun && (
                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex gap-3">
                      <WarningCircle className="text-rose-600 shrink-0" size={24} weight="fill" />
                      <div>
                        <h4 className="font-bold text-rose-800 text-sm">Peringatan: Plafon Turun (Lebih Kecil dari Pengajuan)</h4>
                        <p className="text-xs text-rose-700 mt-1 font-medium">Selisih kekurangan plafon sebesar <b>Rp {selectedBooking.kprApplication.selisihPlafon.toLocaleString("id-ID")}</b>. Sistem Finance telah diberitahu untuk menagihkan kekurangan ini (Penambahan DP) kepada klien sebelum proses Akad.</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-2">Pilih Status Pipeline</label>
                      <div className="relative">
                        <select 
                          value={kprForm.status}
                          onChange={e => setKprForm({...kprForm, status: e.target.value})}
                          className="w-full appearance-none border-2 border-zinc-200 bg-white rounded-xl px-4 py-3 text-sm font-bold text-zinc-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                        >
                          {KPR_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <CaretRight weight="bold" className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 rotate-90" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-2">Nama Bank</label>
                      <input 
                        type="text" 
                        value={kprForm.bankName}
                        onChange={e => setKprForm({...kprForm, bankName: e.target.value})}
                        placeholder="Contoh: Bank Mandiri"
                        className="w-full border-2 border-zinc-200 bg-white rounded-xl px-4 py-3 text-sm font-bold text-zinc-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-2 flex justify-between items-center">
                        Plafond Pengajuan
                        <button 
                          onClick={() => {
                            const unitPrice = selectedBooking.unit.totalPrice || selectedBooking.unit.price || 0;
                            setKprForm({...kprForm, plafondPengajuan: unitPrice - (selectedBooking.bookingFee || 0)});
                          }}
                          className="text-blue-600 hover:text-blue-700 text-[10px] bg-blue-50 px-2 py-0.5 rounded"
                        >
                          Isi Sisa Tagihan
                        </button>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-zinc-400">Rp</span>
                        <input 
                          type="text" 
                          value={kprForm.plafondPengajuan ? new Intl.NumberFormat('id-ID').format(kprForm.plafondPengajuan) : ""}
                          onChange={e => {
                            const rawValue = e.target.value.replace(/\D/g, "");
                            setKprForm({...kprForm, plafondPengajuan: Number(rawValue)});
                          }}
                          className="w-full border-2 border-zinc-200 bg-white rounded-xl py-3 pl-10 pr-4 text-sm font-black text-zinc-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                        />
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-2 font-medium">
                        *Estimasi Sisa Tagihan Unit: <strong className="text-blue-600">Rp {((selectedBooking.unit.totalPrice || selectedBooking.unit.price || 0) - (selectedBooking.bookingFee || 0)).toLocaleString("id-ID")}</strong>
                      </p>
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                        Plafond Disetujui (SP3K) <span className="text-rose-500 text-lg leading-none">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-zinc-400">Rp</span>
                        <input 
                          type="text" 
                          value={kprForm.plafondDisetujui ? new Intl.NumberFormat('id-ID').format(kprForm.plafondDisetujui) : ""}
                          onChange={e => {
                            const rawValue = e.target.value.replace(/\D/g, "");
                            setKprForm({...kprForm, plafondDisetujui: Number(rawValue)});
                          }}
                          disabled={kprForm.status === "Kumpul Berkas" || kprForm.status === "BI Checking" || kprForm.status === "Wawancara Bank"}
                          className="w-full border-2 border-zinc-200 bg-white rounded-xl py-3 pl-10 pr-4 text-sm font-black disabled:bg-zinc-100 disabled:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                          placeholder="Diisi saat SP3K Terbit"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-2">Catatan Legal</label>
                    <textarea 
                      value={kprForm.notes}
                      onChange={e => setKprForm({...kprForm, notes: e.target.value})}
                      className="w-full border-2 border-zinc-200 bg-white rounded-xl px-4 py-3 text-sm font-medium text-zinc-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none h-24 resize-none"
                      placeholder="Tambahkan catatan terkait proses bank, misal ada kendala BI Checking..."
                    />
                  </div>
                  <div className="pt-6 border-t border-zinc-100 flex justify-end">
                    <button 
                      onClick={handleUpdateStatus}
                      disabled={submitting}
                      className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-sm hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center gap-2"
                    >
                      {submitting ? "Menyimpan..." : <><CheckCircle weight="bold" size={18} /> Simpan Perubahan</>}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Upload Form */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                      <Bank weight="fill" size={100} />
                    </div>
                    <div className="relative z-10">
                      <h4 className="font-black text-blue-900 text-sm mb-4 flex items-center gap-2">
                        <UploadSimple weight="bold" size={18} /> Unggah Dokumen Syarat KPR
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-1">
                          <label className="block text-[10px] font-black text-blue-800 uppercase tracking-widest mb-1.5">Jenis Dokumen</label>
                          <select 
                            value={uploadForm.documentType}
                            onChange={e => setUploadForm({...uploadForm, documentType: e.target.value})}
                            className="w-full border-2 border-white/60 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2.5 text-xs font-bold text-blue-900 focus:border-blue-400 outline-none transition-all"
                          >
                            {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-[10px] font-black text-blue-800 uppercase tracking-widest mb-1.5">File Dokumen</label>
                          <input 
                            type="file" 
                            onChange={e => setUploadForm({...uploadForm, file: e.target.files ? e.target.files[0] : null})}
                            className="w-full border-2 border-white/60 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700 file:transition-colors focus:border-blue-400 outline-none transition-all cursor-pointer"
                          />
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-[10px] font-black text-blue-800 uppercase tracking-widest mb-1.5">Keterangan Tambahan</label>
                          <input 
                            type="text" 
                            value={uploadForm.notes}
                            onChange={e => setUploadForm({...uploadForm, notes: e.target.value})}
                            placeholder="Opsional..."
                            className="w-full border-2 border-white/60 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2.5 text-xs font-medium focus:border-blue-400 outline-none transition-all"
                          />
                        </div>
                        <div className="md:col-span-1">
                          <button 
                            onClick={handleUploadDocument}
                            disabled={submitting || !uploadForm.file}
                            className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl font-black text-xs hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
                          >
                            <UploadSimple weight="bold" size={16} /> Unggah File
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* List Dokumen */}
                  <div>
                    <h4 className="font-bold text-zinc-800 text-sm mb-3 border-b pb-2">Dokumen Terkumpul</h4>
                    {(!selectedBooking.kprApplication?.documents || selectedBooking.kprApplication.documents.length === 0) ? (
                      <div className="text-center py-8 text-zinc-500 text-sm font-medium">
                        Belum ada dokumen yang diunggah.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedBooking.kprApplication.documents.map((doc: any) => (
                          <div key={doc.id} className="border border-zinc-200 rounded-xl p-3 flex justify-between items-center hover:bg-zinc-50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="bg-gradient-to-br from-zinc-100 to-zinc-200 p-2.5 rounded-xl text-zinc-500 shadow-sm border border-zinc-200/50">
                                <FileText size={20} weight="duotone" />
                              </div>
                              <div>
                                <p className="font-black text-sm text-zinc-900 leading-tight mb-0.5">{doc.documentType}</p>
                                <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">{new Date(doc.createdAt).toLocaleDateString("id-ID")}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <a 
                                href={`http://localhost:4000${doc.fileUrl}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-zinc-600 p-2.5 bg-zinc-100/80 rounded-xl hover:bg-zinc-200 hover:text-zinc-900 transition-colors"
                                title="Lihat Dokumen"
                              >
                                <Eye size={18} weight="bold" />
                              </a>
                              <a 
                                href={`http://localhost:4000${doc.fileUrl}`} 
                                download
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 p-2.5 bg-blue-50 rounded-xl hover:bg-blue-100 hover:text-blue-700 transition-colors"
                                title="Unduh"
                              >
                                <DownloadSimple size={18} weight="bold" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal Blocker Siap Akad */}
      {blockerModal.isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 mb-4">
                <WarningCircle size={32} weight="fill" className="text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">Aksi Ditolak Sistem</h3>
              <p className="text-sm text-zinc-600 mb-6 font-medium leading-relaxed">
                {blockerModal.message}
              </p>
              <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-4 mb-6 text-left">
                <h4 className="font-bold text-zinc-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-2"><CheckCircle weight="fill" className="text-blue-500" size={16}/> Solusi:</h4>
                <ol className="list-decimal pl-4 text-xs text-zinc-600 space-y-1">
                  <li>Hubungi klien untuk melunasi tagihan Kekurangan Plafon.</li>
                  <li>Minta tim <b>Finance</b> untuk memverifikasi lunas tagihan tersebut di menu Kelola Piutang.</li>
                  <li>Setelah lunas, Anda baru bisa memindahkan kartu ini ke <b>Siap Akad</b>.</li>
                </ol>
              </div>
              <button 
                onClick={() => setBlockerModal({ isOpen: false, message: "" })}
                className="w-full bg-zinc-900 text-white rounded-xl py-3 font-bold text-sm hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/20"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal Peringatan Mundur (Revisi Bank) */}
      {regressionModal.isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 mb-4">
                <WarningCircle size={32} weight="fill" className="text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">Penurunan Status KPR</h3>
              <p className="text-sm text-zinc-600 mb-6 font-medium leading-relaxed">
                Anda mencoba memindahkan status KPR mundur dari <span className="font-bold text-zinc-800">{regressionModal.fromStatus}</span> ke <span className="font-bold text-zinc-800">{regressionModal.newStatus}</span>. Apakah ini karena ada revisi atau penolakan sementara dari Bank?
              </p>
              <div className="grid grid-cols-2 gap-3 mt-8">
                <button 
                  onClick={() => setRegressionModal({ isOpen: false, bookingId: "", newStatus: "", fromStatus: "", source: "" })}
                  disabled={submitting}
                  className="w-full bg-zinc-100 text-zinc-700 rounded-xl py-3 font-bold text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button 
                  onClick={handleConfirmRegression}
                  disabled={submitting}
                  className="w-full bg-amber-500 text-white rounded-xl py-3 font-bold text-sm hover:bg-amber-600 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting && <Spinner className="animate-spin" />}
                  Ya, Lanjutkan
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal Pembatalan KPR */}
      {cancelModal.isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6 border-b border-rose-100 pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
                  <WarningCircle size={28} weight="fill" className="text-rose-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 leading-tight">Batalkan KPR?</h3>
                  <p className="text-xs font-medium text-zinc-500">Tindakan ini tidak dapat dibatalkan</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5 block">Alasan Penolakan Bank <span className="text-rose-500">*</span></label>
                  <textarea 
                    rows={3}
                    placeholder="Contoh: BI Checking buruk, gaji tidak mencukupi..."
                    value={cancelModal.alasan}
                    onChange={e => setCancelModal(prev => ({ ...prev, alasan: e.target.value }))}
                    className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2 block">Kebijakan Uang Muka (Booking Fee)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`cursor-pointer rounded-xl border-2 p-3 text-center transition-all ${cancelModal.kebijakan === "hanguskan" ? "border-rose-500 bg-rose-50" : "border-zinc-200 hover:bg-zinc-50"}`}>
                      <input type="radio" className="sr-only" checked={cancelModal.kebijakan === "hanguskan"} onChange={() => setCancelModal(prev => ({ ...prev, kebijakan: "hanguskan" }))} />
                      <div className="text-sm font-bold text-zinc-900">Hanguskan</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">Jadi Pendapatan</div>
                    </label>
                    <label className={`cursor-pointer rounded-xl border-2 p-3 text-center transition-all ${cancelModal.kebijakan === "kembalikan" ? "border-amber-500 bg-amber-50" : "border-zinc-200 hover:bg-zinc-50"}`}>
                      <input type="radio" className="sr-only" checked={cancelModal.kebijakan === "kembalikan"} onChange={() => setCancelModal(prev => ({ ...prev, kebijakan: "kembalikan" }))} />
                      <div className="text-sm font-bold text-zinc-900">Kembalikan</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">Refund ke Klien</div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-8">
                <button 
                  onClick={() => setCancelModal({ isOpen: false, bookingId: "", alasan: "", kebijakan: "hanguskan" })}
                  disabled={submitting}
                  className="w-full bg-zinc-100 text-zinc-700 rounded-xl py-3 font-bold text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button 
                  onClick={handleCancelKPR}
                  disabled={submitting}
                  className="w-full bg-rose-600 text-white rounded-xl py-3 font-bold text-sm hover:bg-rose-700 shadow-lg shadow-rose-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting && <Spinner className="animate-spin" />}
                  Konfirmasi Batal
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Toast */}
      {toast && mounted && createPortal(
        <div className="fixed top-24 right-6 z-[300] animate-in slide-in-from-top-5 fade-in duration-300">
          <div className={`flex items-center gap-3 rounded-2xl px-6 py-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-white/10 ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
            {toast.type === 'success' ? <CheckCircle weight="fill" size={24} /> : <WarningCircle weight="fill" size={24} />}
            <p className="text-sm font-bold tracking-wide">{toast.message}</p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
