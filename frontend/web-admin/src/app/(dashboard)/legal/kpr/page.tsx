"use client";

import { useState, useEffect } from "react";
import { 
  Bank, FileText, CheckCircle, WarningCircle, CaretRight, 
  UploadSimple, DownloadSimple, User, Building, MapPin, Spinner, X, MagnifyingGlass
} from "@phosphor-icons/react";
import { formatRupiah } from "@/lib/utils";

const KPR_STATUSES = [
  "Kumpul Berkas", 
  "BI Checking", 
  "Wawancara Bank", 
  "SP3K Terbit", 
  "Siap Akad", 
  "Selesai Akad"
];

const DOC_TYPES = [
  "KTP Suami/Istri", "Kartu Keluarga", "NPWP", "Buku Nikah", 
  "Slip Gaji 3 Bulan", "Rekening Koran 3 Bulan", "Surat Keterangan Kerja"
];

export default function PipelineKprPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("info"); // info, dokumen
  
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
      const res = await fetch("/api/legal/kpr", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("simdp_auth")}` }
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

  useEffect(() => {
    fetchKpr();
  }, []);

  const handleOpenModal = (booking: any) => {
    setSelectedBooking(booking);
    setKprForm({
      status: booking.kprApplication?.status || "Kumpul Berkas",
      bankName: booking.kprApplication?.bankName || "",
      plafondPengajuan: booking.kprApplication?.plafondPengajuan || 0,
      plafondDisetujui: booking.kprApplication?.plafondDisetujui || 0,
      notes: booking.kprApplication?.notes || ""
    });
    setActiveTab("info");
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/legal/kpr/${selectedBooking.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("simdp_auth")}`
        },
        body: JSON.stringify(kprForm)
      });
      
      if (!res.ok) throw new Error("Gagal memperbarui KPR");
      
      setToast({ message: "Status KPR berhasil diperbarui", type: "success" });
      setIsModalOpen(false);
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

      const res = await fetch(`/api/legal/kpr/${selectedBooking.id}/documents`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("simdp_auth")}`
        },
        body: formData
      });
      
      if (!res.ok) throw new Error("Gagal mengunggah dokumen");
      
      setToast({ message: "Dokumen berhasil diunggah", type: "success" });
      setUploadForm({ ...uploadForm, file: null, notes: "" });
      fetchKpr(); // Refresh to get new docs
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="p-8 pb-24 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-3">
            <Bank className="text-blue-500" weight="fill" />
            Pipeline KPR
          </h1>
          <p className="text-zinc-500 mt-1 font-medium">
            Pantau dan kelola proses pengajuan KPR klien ke pihak Bank.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner className="animate-spin text-blue-500" size={32} />
        </div>
      ) : (
        <div className="flex overflow-x-auto gap-4 pb-8 custom-scrollbar items-start">
          {KPR_STATUSES.map(status => {
            const columnBookings = bookings.filter(b => (b.kprApplication?.status || "Kumpul Berkas") === status);
            return (
              <div key={status} className="flex-shrink-0 w-80 bg-zinc-50 rounded-2xl p-4 border border-zinc-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-zinc-800">{status}</h3>
                  <span className="bg-zinc-200 text-zinc-600 text-xs font-bold px-2 py-0.5 rounded-full">
                    {columnBookings.length}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {columnBookings.length === 0 ? (
                    <div className="text-center py-6 border-2 border-dashed border-zinc-200 rounded-xl">
                      <p className="text-xs text-zinc-400 font-medium">Kosong</p>
                    </div>
                  ) : (
                    columnBookings.map(booking => (
                      <div 
                        key={booking.id} 
                        onClick={() => handleOpenModal(booking)}
                        className={`bg-white p-4 rounded-xl border cursor-pointer hover:shadow-md transition-all ${
                          booking.kprApplication?.isPlafonTurun ? "border-rose-300" : "border-zinc-200 hover:border-blue-300"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-bold text-zinc-900 text-sm truncate">{booking.lead.name}</p>
                          {booking.kprApplication?.bankName && (
                            <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase tracking-wider">
                              {booking.kprApplication.bankName}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 font-medium mb-3">
                          Blok {booking.unit.blok}-{booking.unit.nomor}
                        </p>
                        
                        {booking.kprApplication?.isPlafonTurun && (
                          <div className="mt-2 bg-rose-50 border border-rose-100 rounded-lg p-2 flex items-start gap-1.5">
                            <WarningCircle className="text-rose-600 shrink-0 mt-0.5" weight="fill" size={14} />
                            <div>
                              <p className="text-[10px] font-bold text-rose-700 leading-tight">PLAFON TURUN</p>
                              <p className="text-[10px] font-semibold text-rose-600">Kurang: {formatRupiah(booking.kprApplication.selisihPlafon)}</p>
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
      )}

      {/* Modal Kelola KPR */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Pengajuan KPR: {selectedBooking.lead.name}</h2>
                <p className="text-xs text-zinc-500 font-medium mt-0.5">Blok {selectedBooking.unit.blok}-{selectedBooking.unit.nomor} &middot; {selectedBooking.unit.project.name}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-200 rounded-full transition-colors">
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
                        <p className="text-xs text-rose-700 mt-1 font-medium">Selisih kekurangan plafon sebesar <b>{formatRupiah(selectedBooking.kprApplication.selisihPlafon)}</b>. Sistem Finance telah diberitahu untuk menagihkan kekurangan ini (Penambahan DP) kepada klien sebelum proses Akad.</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">Pilih Status Pipeline</label>
                      <select 
                        value={kprForm.status}
                        onChange={e => setKprForm({...kprForm, status: e.target.value})}
                        className="w-full border border-zinc-300 rounded-xl px-4 py-2.5 text-sm font-semibold"
                      >
                        {KPR_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">Nama Bank</label>
                      <input 
                        type="text" 
                        value={kprForm.bankName}
                        onChange={e => setKprForm({...kprForm, bankName: e.target.value})}
                        placeholder="Contoh: Bank Mandiri"
                        className="w-full border border-zinc-300 rounded-xl px-4 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">Plafond Pengajuan</label>
                      <input 
                        type="number" 
                        value={kprForm.plafondPengajuan}
                        onChange={e => setKprForm({...kprForm, plafondPengajuan: Number(e.target.value)})}
                        className="w-full border border-zinc-300 rounded-xl px-4 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                        Plafond Disetujui (SP3K) <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="number" 
                        value={kprForm.plafondDisetujui}
                        onChange={e => setKprForm({...kprForm, plafondDisetujui: Number(e.target.value)})}
                        disabled={kprForm.status === "Kumpul Berkas" || kprForm.status === "BI Checking" || kprForm.status === "Wawancara Bank"}
                        className="w-full border border-zinc-300 rounded-xl px-4 py-2.5 text-sm disabled:bg-zinc-100 disabled:text-zinc-400"
                        placeholder="Diisi saat SP3K Terbit"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">Catatan Legal</label>
                    <textarea 
                      value={kprForm.notes}
                      onChange={e => setKprForm({...kprForm, notes: e.target.value})}
                      className="w-full border border-zinc-300 rounded-xl px-4 py-2.5 text-sm h-24 resize-none"
                      placeholder="Catatan tambahan terkait proses bank..."
                    />
                  </div>
                  <div className="pt-4 border-t border-zinc-100 flex justify-end">
                    <button 
                      onClick={handleUpdateStatus}
                      disabled={submitting}
                      className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {submitting ? "Menyimpan..." : "Simpan Perubahan KPR"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Upload Form */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <h4 className="font-bold text-blue-900 text-sm mb-3">Upload Dokumen Syarat KPR</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-1">Jenis Dokumen</label>
                        <select 
                          value={uploadForm.documentType}
                          onChange={e => setUploadForm({...uploadForm, documentType: e.target.value})}
                          className="w-full border border-blue-200 rounded-lg px-3 py-2 text-xs font-semibold"
                        >
                          {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-1">File Dokumen</label>
                        <input 
                          type="file" 
                          onChange={e => setUploadForm({...uploadForm, file: e.target.files ? e.target.files[0] : null})}
                          className="w-full border border-blue-200 rounded-lg px-3 py-1.5 text-xs bg-white file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-blue-100 file:text-blue-700"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-1">Keterangan (Opsional)</label>
                        <input 
                          type="text" 
                          value={uploadForm.notes}
                          onChange={e => setUploadForm({...uploadForm, notes: e.target.value})}
                          placeholder="Misal: Kurang jelas"
                          className="w-full border border-blue-200 rounded-lg px-3 py-2 text-xs"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <button 
                          onClick={handleUploadDocument}
                          disabled={submitting || !uploadForm.file}
                          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                        >
                          <UploadSimple weight="bold" /> Upload
                        </button>
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
                              <div className="bg-zinc-100 p-2 rounded-lg text-zinc-500">
                                <FileText size={20} weight="fill" />
                              </div>
                              <div>
                                <p className="font-bold text-sm text-zinc-900 leading-tight">{doc.documentType}</p>
                                <p className="text-[10px] text-zinc-500 font-medium">{new Date(doc.createdAt).toLocaleDateString("id-ID")}</p>
                              </div>
                            </div>
                            <a 
                              href={doc.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                              title="Lihat / Unduh"
                            >
                              <DownloadSimple size={16} weight="bold" />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-[200] animate-in slide-in-from-top-5 fade-in duration-300">
          <div className={`flex items-center gap-3 rounded-2xl px-5 py-4 shadow-xl ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
            {toast.type === 'success' ? <CheckCircle weight="fill" size={24} /> : <WarningCircle weight="fill" size={24} />}
            <p className="text-sm font-semibold">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
