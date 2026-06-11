"use client";

import { useState, useEffect } from "react";
import DisburseModal from "./DisburseModal";
import { formatCurrency } from "@/lib/utils/currency"; // Asumsi ada utilitas formatCurrency, jika tidak kita pakai toLocaleString inline

interface UnitData {
  id: string;
  blok: string;
  nomor: string;
  progress: number;
}

interface SpkData {
  id: string;
  spkNo: string;
  date: string;
  contractorName: string;
  totalPrice: number;
  totalDisbursed: number;
  remainingBalance: number;
  avgProgress: number;
  units: UnitData[];
}

export default function SpkFinancePage() {
  const [spkList, setSpkList] = useState<SpkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpk, setSelectedSpk] = useState<SpkData | null>(null);

  const fetchSpks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/finance/spk`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || "Gagal mengambil data SPK");
      }

      setSpkList(resData.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpks();
  }, []);

  const handleOpenModal = (spk: SpkData) => {
    setSelectedSpk(spk);
    setIsModalOpen(true);
  };

  const handleDisbursementSuccess = () => {
    setIsModalOpen(false);
    fetchSpks(); // Refresh data setelah berhasil cair
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-500 animate-pulse">Memuat data SPK...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl">{error}</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Monitoring SPK & Pencairan Kasbon</h1>
        <p className="text-zinc-500 mt-2 text-lg">Kelola pembayaran termin kepada mandor dan kontraktor berdasarkan progres aktual lapangan.</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">No. SPK & Mandor</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Kavling Tercakup</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Rata-Rata Progres</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Nilai Kontrak</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Total Cair & Sisa Dana</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {spkList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">Tidak ada data SPK aktif.</td>
                </tr>
              ) : (
                spkList.map((spk) => (
                  <tr key={spk.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-zinc-900">{spk.spkNo}</div>
                      <div className="text-zinc-500">{spk.contractorName}</div>
                      <div className="text-xs text-zinc-400 mt-1">{new Date(spk.date).toLocaleDateString("id-ID")}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {spk.units.map(u => (
                          <span key={u.id} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {u.blok} {u.nomor}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-zinc-200 rounded-full h-2.5 max-w-[100px]">
                          <div className={`h-2.5 rounded-full ${spk.avgProgress === 100 ? 'bg-emerald-500' : spk.avgProgress > 50 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${spk.avgProgress}%` }}></div>
                        </div>
                        <span className="font-semibold text-zinc-700">{spk.avgProgress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-900">
                      Rp {spk.totalPrice.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-emerald-600 font-medium flex justify-between">
                        <span>Cair:</span>
                        <span>Rp {spk.totalDisbursed.toLocaleString("id-ID")}</span>
                      </div>
                      <div className="text-amber-600 font-semibold flex justify-between mt-1 border-t border-zinc-100 pt-1">
                        <span>Sisa:</span>
                        <span>Rp {spk.remainingBalance.toLocaleString("id-ID")}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenModal(spk)}
                        disabled={spk.remainingBalance <= 0}
                        className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                          spk.remainingBalance <= 0
                            ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                            : "bg-zinc-900 text-white hover:bg-zinc-800 active:scale-95 shadow-sm"
                        }`}
                      >
                        {spk.remainingBalance <= 0 ? "Lunas" : "Pencairan"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedSpk && (
        <DisburseModal
          spk={selectedSpk}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleDisbursementSuccess}
        />
      )}
    </div>
  );
}
