"use client";

import { useState } from "react";

interface DocumentModalProps {
  bookingId: string;
  bookingName: string;
  unitName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DocumentModal({ bookingId, bookingName, unitName, onClose, onSuccess }: DocumentModalProps) {
  const [documentType, setDocumentType] = useState<string>("SP3K");
  const [status, setStatus] = useState<string>("Diproses");
  const [notes, setNotes] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setIsSubmitting(true);
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
        let token = "";
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          token = authData.token;
        }

      const formData = new FormData();
      formData.append("bookingId", bookingId);
      formData.append("documentType", documentType);
      formData.append("status", status);
      if (notes) formData.append("notes", notes);
      if (file) formData.append("file", file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/legal/documents`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menyimpan dokumen.");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
          <div>
            <h3 className="text-xl font-bold text-zinc-900">Kelola Dokumen</h3>
            <p className="text-sm text-zinc-500 mt-1">{bookingName} - {unitName}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 bg-zinc-100 hover:bg-zinc-200 p-2 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">Jenis Dokumen</label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-1 outline-none"
            >
              <option value="SP3K">SP3K / Akad KPR</option>
              <option value="PPJB">PPJB</option>
              <option value="AJB">AJB</option>
              <option value="SHM">SHM</option>
              <option value="IMB">IMB</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">Status Dokumen</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-1 outline-none"
            >
              <option value="Diproses">Sedang Diproses</option>
              <option value="Selesai">Selesai (Sudah Terbit)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">Upload Scan File (Opsional)</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="w-full px-4 py-2 rounded-xl border border-zinc-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200 cursor-pointer"
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">Catatan Tambahan</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-1 outline-none resize-none"
              rows={3}
              placeholder="Contoh: Menunggu tanda tangan notaris..."
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium">
              {error}
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 px-4 py-3 rounded-xl font-medium text-white transition-all ${
                isSubmitting
                  ? "bg-zinc-400 cursor-not-allowed"
                  : "bg-zinc-900 hover:bg-zinc-800 shadow-md active:scale-[0.98]"
              }`}
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Dokumen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
