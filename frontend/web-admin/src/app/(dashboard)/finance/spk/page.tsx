"use client";

import { useState, useEffect } from "react";
import DisburseModal from "./DisburseModal";

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
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
        let token = "";
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          token = authData.token;
        }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/finance/spk`, {
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

  const handlePrintBapp = async (spkId: string) => {
    try {
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
        let token = "";
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          token = authData.token;
        }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/finance/spk/${spkId}/bapp`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) throw new Error("Gagal mengambil BAPP");
      
      const html = await res.text();
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
      }
    } catch (err: any) {
      alert("Gagal mencetak BAPP: " + err.message);
    }
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
                <th className="px-6 py-4 font-semibold tracking-wider">Progres Fisik</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Nilai Kontrak</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Progres Pencairan</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
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
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-full bg-zinc-200 rounded-full h-2.5 max-w-[100px]">
                          <div className={`h-2.5 rounded-full ${spk.remainingBalance <= 0 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(100, (spk.totalDisbursed / spk.totalPrice) * 100)}%` }}></div>
                        </div>
                        <span className="font-semibold text-zinc-700">{Math.round((spk.totalDisbursed / spk.totalPrice) * 100)}%</span>
                      </div>
                      <div className="text-emerald-600 font-medium flex justify-between text-xs">
                        <span>Cair:</span>
                        <span>Rp {spk.totalDisbursed.toLocaleString("id-ID")}</span>
                      </div>
                      <div className="text-rose-600 font-semibold flex justify-between mt-1 border-t border-zinc-100 pt-1 text-xs">
                        <span>Sisa:</span>
                        <span>Rp {spk.remainingBalance.toLocaleString("id-ID")}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {spk.remainingBalance <= 0 ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          SELESAI
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                          BERJALAN
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {spk.remainingBalance <= 0 ? (
                          <button
                            onClick={() => handlePrintBapp(spk.id)}
                            className="px-4 py-2 text-sm font-medium rounded-xl transition-all bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm whitespace-nowrap"
                          >
                            Cetak BAPP
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenModal(spk)}
                            className="px-4 py-2 text-sm font-medium rounded-xl transition-all bg-zinc-900 text-white hover:bg-zinc-800 active:scale-95 shadow-sm whitespace-nowrap"
                          >
                            Pencairan
                          </button>
                        )}
                      </div>
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
