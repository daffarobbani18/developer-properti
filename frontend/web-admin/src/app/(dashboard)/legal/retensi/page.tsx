"use client";

import { useState, useEffect } from "react";
import AddDefectModal from "./AddDefectModal";

interface DefectData {
  id: string;
  description: string;
  status: string;
  photoUrl?: string;
  reportedAt: string;
  resolvedAt?: string;
  booking: {
    lead: { name: string };
    unit: { blok: string; nomor: string; kawasan: string };
  };
}

export default function RetensiPage() {
  const [defects, setDefects] = useState<DefectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchDefects = async () => {
    try {
      setLoading(true);
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
        let token = "";
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          token = authData.token;
        }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/legal/defects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || "Gagal mengambil data komplain");
      }

      setDefects(resData.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDefects();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
        let token = "";
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          token = authData.token;
        }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/legal/defects/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal memperbarui status");
      }

      fetchDefects();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Dilaporkan": return "bg-red-100 text-red-700";
      case "Sedang Diperbaiki": return "bg-amber-100 text-amber-700";
      case "Selesai": return "bg-emerald-100 text-emerald-700";
      default: return "bg-zinc-100 text-zinc-700";
    }
  };

  if (loading) return <div className="p-8 text-center text-zinc-500 animate-pulse">Memuat data komplain...</div>;
  if (error) return <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl">{error}</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Masa Retensi & Komplain</h1>
          <p className="text-zinc-500 mt-2 text-lg">Catat dan pantau perbaikan cacat bangunan (*defect*) sebelum dan sesudah BAST.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors shadow-sm"
        >
          + Catat Komplain
        </button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Unit & Konsumen</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Deskripsi Kerusakan</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Tanggal Lapor</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {defects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">Belum ada komplain tercatat.</td>
                </tr>
              ) : (
                defects.map((defect) => (
                  <tr key={defect.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-zinc-900 text-base">{defect.booking.lead.name}</div>
                      <div className="text-zinc-500">Blok {defect.booking.unit.blok} No. {defect.booking.unit.nomor}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-zinc-800 max-w-xs">{defect.description}</div>
                      {defect.photoUrl && (
                        <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}${defect.photoUrl}`} target="_blank" className="text-blue-600 text-xs hover:underline mt-1 inline-block">Lihat Foto</a>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${getStatusBadge(defect.status)}`}>
                        {defect.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500">
                      {new Date(defect.reportedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {defect.status === "Dilaporkan" && (
                        <button onClick={() => updateStatus(defect.id, "Sedang Diperbaiki")} className="px-3 py-1.5 text-xs font-medium bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors">
                          Tindaklanjuti
                        </button>
                      )}
                      {defect.status === "Sedang Diperbaiki" && (
                        <button onClick={() => updateStatus(defect.id, "Selesai")} className="px-3 py-1.5 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 transition-colors">
                          Tandai Selesai
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <AddDefectModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            fetchDefects();
          }}
        />
      )}
    </div>
  );
}
