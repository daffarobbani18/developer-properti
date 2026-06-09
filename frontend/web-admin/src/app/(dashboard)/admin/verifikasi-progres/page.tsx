"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { 
  ListChecks, 
  MagnifyingGlass, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Image as ImageIcon,
  WarningCircle,
  X
} from "@phosphor-icons/react";

export default function VerifikasiProgresPage() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMilestone, setSelectedMilestone] = useState<any | null>(null);
  
  const [rejectNote, setRejectNote] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const loginRes = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "inventory@erp.com", password: "password123" })
      });
      const { token } = await loginRes.json();

      const res = await fetch("http://localhost:4000/api/construction/milestone-approvals", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.data) {
        setApprovals(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch approvals", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: string, action: "APPROVE" | "REJECT") => {
    try {
      setVerifying(true);
      const loginRes = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "inventory@erp.com", password: "password123" })
      });
      const { token } = await loginRes.json();

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
        setSelectedMilestone(null);
        setRejectNote("");
        fetchApprovals();
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

  const filteredApprovals = approvals.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (a.unit?.blok + " " + a.unit?.nomor).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="mb-2 text-3xl font-[family-name:var(--font-heading)] text-zinc-900 flex items-center gap-3 tracking-tight">
          <ListChecks className="text-amber-600" weight="duotone" size={32} />
          Verifikasi Progres Lapangan
        </h2>
        <p className="text-sm text-zinc-500">Tinjau laporan pekerjaan lapangan dan setujui untuk memperbarui total progres bangunan.</p>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-zinc-900">Kotak Masuk Verifikasi</h3>
          <div className="relative w-full md:w-72">
            <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Cari Kavling atau Pekerjaan..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-zinc-200 bg-zinc-50 py-2.5 pl-11 pr-4 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-amber-500"></div>
          </div>
        ) : filteredApprovals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle className="mb-4 text-zinc-300" weight="duotone" size={48} />
            <p className="text-lg font-bold text-zinc-900">Tidak ada laporan yang menunggu</p>
            <p className="text-sm text-zinc-500">Semua laporan progres dari pengawas telah diverifikasi.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-500">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Kavling</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Kategori & Pekerjaan</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Bobot</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Tgl Laporan</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredApprovals.map(a => (
                  <tr key={a.id} className="transition-colors hover:bg-zinc-50/50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-zinc-900">Blok {a.unit?.blok} No {a.unit?.nomor}</div>
                      <div className="text-xs text-zinc-500">{a.unit?.kawasan}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-zinc-800">{a.name}</div>
                      <div className="text-xs text-zinc-500 uppercase tracking-wider">{a.category}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-amber-600">
                      {a.bobotPersentase}%
                    </td>
                    <td className="px-6 py-4 text-zinc-600">
                      {new Date(a.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedMilestone(a)}
                        className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-200"
                      >
                        <Eye weight="bold" /> Tinjau
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedMilestone && mounted && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-zinc-100 p-6">
              <div>
                <h3 className="text-xl font-bold text-zinc-900">Detail Laporan Pekerjaan</h3>
                <p className="text-sm text-zinc-500">Unit Blok {selectedMilestone.unit?.blok} No {selectedMilestone.unit?.nomor}</p>
              </div>
              <button 
                onClick={() => { setSelectedMilestone(null); setIsRejectModalOpen(false); setRejectNote(""); }}
                className="rounded-full bg-zinc-100 p-2 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 transition-colors"
              >
                <X weight="bold" size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
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
                  <div className="font-bold text-amber-600">{selectedMilestone.bobotPersentase}%</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-2">
                  <ListChecks className="text-amber-500" size={18} weight="bold" />
                  Catatan Pengawas
                </h4>
                <div className="rounded-xl border border-zinc-200 bg-white p-4">
                  {selectedMilestone.logs?.[0]?.note ? (
                    <p className="text-sm text-zinc-700 whitespace-pre-wrap">{selectedMilestone.logs[0].note}</p>
                  ) : (
                    <p className="text-sm italic text-zinc-400">Tidak ada catatan.</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-2">
                  <ImageIcon className="text-amber-500" size={18} weight="bold" />
                  Foto Bukti Lapangan
                </h4>
                {selectedMilestone.logs?.[0]?.photoUrls?.length > 0 ? (
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {selectedMilestone.logs[0].photoUrls.map((url: string, i: number) => (
                      <div 
                        key={i} 
                        className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl border border-zinc-200 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setSelectedImage(url.startsWith('http') ? url : `http://localhost:4000${url}`)}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={url.startsWith('http') ? url : `http://localhost:4000${url}`} 
                          alt="Progress" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm italic text-zinc-400">Tidak ada foto terlampir.</p>
                )}
              </div>

              {isRejectModalOpen && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 animate-fade-in">
                  <h4 className="text-sm font-bold text-rose-800 mb-2 flex items-center gap-2">
                    <WarningCircle weight="bold" size={18} />
                    Alasan Penolakan / Revisi
                  </h4>
                  <textarea
                    value={rejectNote}
                    onChange={(e) => setRejectNote(e.target.value)}
                    placeholder="Contoh: Bongkar lagi, pasangan bata miring..."
                    className="w-full rounded-lg border border-rose-200 p-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 bg-white"
                    rows={3}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-zinc-100 p-6 bg-zinc-50 rounded-b-3xl">
              <button
                disabled={verifying}
                onClick={() => {
                  if (isRejectModalOpen) {
                    setIsRejectModalOpen(false);
                    setRejectNote("");
                  } else {
                    setIsRejectModalOpen(true);
                  }
                }}
                className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${isRejectModalOpen ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300" : "bg-rose-100 text-rose-700 hover:bg-rose-200"}`}
              >
                {isRejectModalOpen ? "Batal Tolak" : "Tolak (Revisi)"}
              </button>

              <button
                disabled={verifying}
                onClick={() => {
                  if (isRejectModalOpen) {
                    handleVerify(selectedMilestone.id, "REJECT");
                  } else {
                    if(confirm("Anda yakin menyetujui laporan ini? Total progres unit akan bertambah.")) {
                      handleVerify(selectedMilestone.id, "APPROVE");
                    }
                  }
                }}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all ${isRejectModalOpen ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"}`}
              >
                {verifying ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : isRejectModalOpen ? (
                  <XCircle weight="bold" size={18} />
                ) : (
                  <CheckCircle weight="bold" size={18} />
                )}
                {isRejectModalOpen ? "Kirim Penolakan" : "Setujui Laporan"}
              </button>
            </div>
          </div>
        </div>
      , document.body)}

      {/* Image Preview Modal */}
      {selectedImage && mounted && createPortal(
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute right-6 top-6 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
            onClick={() => setSelectedImage(null)}
          >
            <X size={24} weight="bold" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={selectedImage} 
            alt="Preview" 
            className="max-h-[90vh] max-w-full rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      , document.body)}
    </div>
  );
}
