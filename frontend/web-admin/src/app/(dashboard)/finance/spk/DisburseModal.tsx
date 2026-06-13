"use client";

import { useState } from "react";

interface SpkData {
  id: string;
  spkNo: string;
  contractorName: string;
  remainingBalance: number;
}

interface DisburseModalProps {
  spk: SpkData;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DisburseModal({ spk, onClose, onSuccess }: DisburseModalProps) {
  const [nominal, setNominal] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Format currency saat user mengetik
  const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Hapus semua karakter non-digit
    const val = e.target.value.replace(/\D/g, "");
    setNominal(val);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amount = Number(nominal);

    // VALIDASI FRONTEND (Sesuai instruksi User)
    if (!amount || amount <= 0) {
      setError("Nominal pencairan harus lebih dari 0.");
      return;
    }
    
    if (amount > spk.remainingBalance) {
      setError(`Nominal melebihi sisa dana. Maksimal pencairan adalah Rp ${spk.remainingBalance.toLocaleString("id-ID")}.`);
      return;
    }

    try {
      setIsSubmitting(true);
      const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "finance@erp.com", password: "password123" })
      });
      const { token } = await loginRes.json();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/finance/spk/${spk.id}/disburse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nominal: amount, notes }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal memproses pencairan.");
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
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
          <div>
            <h3 className="text-xl font-bold text-zinc-900">Pencairan SPK</h3>
            <p className="text-sm text-zinc-500 mt-1">{spk.spkNo} - {spk.contractorName}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 bg-zinc-100 hover:bg-zinc-200 p-2 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex justify-between items-center">
            <span className="text-amber-800 font-medium text-sm">Sisa Dana Tersedia</span>
            <span className="text-amber-700 font-bold text-lg">Rp {spk.remainingBalance.toLocaleString("id-ID")}</span>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">
                Nominal Pencairan (Rp)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">Rp</span>
                <input
                  type="text"
                  required
                  value={nominal ? Number(nominal).toLocaleString("id-ID") : ""}
                  onChange={handleNominalChange}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border ${error ? 'border-red-300 ring-1 ring-red-300' : 'border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900'} outline-none transition-all text-lg font-medium`}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">
                Keterangan / Catatan
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-all resize-none"
                rows={3}
                placeholder="Contoh: Kasbon beli semen, Pembayaran Termin 1..."
                required
              />
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-start gap-2">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !!error}
              className={`flex-1 px-4 py-3 rounded-xl font-medium text-white transition-all ${
                isSubmitting || !!error
                  ? "bg-zinc-400 cursor-not-allowed"
                  : "bg-zinc-900 hover:bg-zinc-800 shadow-md active:scale-[0.98]"
              }`}
            >
              {isSubmitting ? "Memproses..." : "Cairkan Dana"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
