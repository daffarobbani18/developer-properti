"use client";

import { useState, useEffect } from "react";

interface AddDefectModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface BookingOption {
  id: string;
  lead: { name: string };
  unit: { blok: string; nomor: string; kawasan: string };
}

export default function AddDefectModal({ onClose, onSuccess }: AddDefectModalProps) {
  const [bookings, setBookings] = useState<BookingOption[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
        let token = "";
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          token = authData.token;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/legal/bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const resData = await response.json();
        if (response.ok) {
          setBookings(resData.data);
          if (resData.data.length > 0) setSelectedBookingId(resData.data[0].id);
        }
      } catch (err) {
        console.error("Gagal mengambil data unit", err);
      }
    };
    fetchBookings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedBookingId || !description) {
      setError("Unit dan deskripsi kerusakan wajib diisi.");
      return;
    }

    try {
      setIsSubmitting(true);
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
        let token = "";
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          token = authData.token;
        }

      const formData = new FormData();
      formData.append("bookingId", selectedBookingId);
      formData.append("description", description);
      if (file) formData.append("file", file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/legal/defects`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal mencatat komplain.");

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
            <h3 className="text-xl font-bold text-zinc-900">Catat Komplain Baru</h3>
            <p className="text-sm text-zinc-500 mt-1">Laporan dari inspeksi konsumen</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 bg-zinc-100 hover:bg-zinc-200 p-2 rounded-full transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">Pilih Unit & Konsumen</label>
            <select
              value={selectedBookingId}
              onChange={(e) => setSelectedBookingId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-1 outline-none"
            >
              {bookings.map(b => (
                <option key={b.id} value={b.id}>
                  Blok {b.unit.blok} No. {b.unit.nomor} - {b.lead.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">Deskripsi Kerusakan (Defect)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-1 outline-none resize-none"
              rows={3}
              placeholder="Contoh: Cat di kamar tidur utama mengelupas..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">Upload Foto Bukti (Opsional)</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="w-full px-4 py-2 rounded-xl border border-zinc-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200 cursor-pointer"
              accept=".jpg,.jpeg,.png"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium">{error}</div>
          )}

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors">Batal</button>
            <button type="submit" disabled={isSubmitting} className={`flex-1 px-4 py-3 rounded-xl font-medium text-white transition-all ${isSubmitting ? "bg-zinc-400 cursor-not-allowed" : "bg-zinc-900 hover:bg-zinc-800 shadow-md active:scale-[0.98]"}`}>
              {isSubmitting ? "Menyimpan..." : "Simpan Komplain"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
