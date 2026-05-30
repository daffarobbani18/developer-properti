"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Money, Plus, FileText, CheckCircle, ClockCounterClockwise, XCircle,
  MagnifyingGlass, CaretRight, Spinner, Bank
} from "@phosphor-icons/react";

export default function PengeluaranFinancePage() {
  const [mounted, setMounted] = useState(false);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Menunggu Transfer"); // Menunggu Transfer, Riwayat
  const [search, setSearch] = useState("");
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const loginRes = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "finance@erp.com", password: "password123" })
      });
      const { token } = await loginRes.json();

      const res = await fetch("http://localhost:4000/api/finance/expenses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setExpenses(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string) => {
    if (!confirm("Apakah Anda yakin sudah mentransfer dana ini?")) return;
    
    setSubmittingId(id);
    try {
      const loginRes = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "finance@erp.com", password: "password123" })
      });
      const { token } = await loginRes.json();

      const res = await fetch(`http://localhost:4000/api/finance/expenses/${id}/status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: "Sudah Ditransfer" })
      });
      
      if (res.ok) {
        fetchExpenses();
      } else {
        const err = await res.json();
        alert(err.message || "Gagal mengupdate status");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem");
    } finally {
      setSubmittingId(null);
    }
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter(ex => {
      // Filter by tab
      if (activeTab === "Menunggu Transfer" && ex.status !== "Menunggu Transfer") return false;
      if (activeTab === "Riwayat" && ex.status === "Menunggu Transfer") return false;
      
      // Filter by search
      if (search) {
        const s = search.toLowerCase();
        return ex.category.toLowerCase().includes(s) || 
               ex.description.toLowerCase().includes(s) ||
               ex.booking?.lead?.name?.toLowerCase().includes(s);
      }
      return true;
    });
  }, [expenses, activeTab, search]);

  const totalMenunggu = expenses.filter(ex => ex.status === "Menunggu Transfer").reduce((acc, curr) => acc + curr.amount, 0);
  const countMenunggu = expenses.filter(ex => ex.status === "Menunggu Transfer").length;

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="mb-2 text-3xl font-[family-name:var(--font-heading)] text-zinc-900 flex items-center gap-3 tracking-tight">
            <Money className="text-rose-500" weight="duotone" size={32} />
            Pengeluaran & Refund
          </h2>
          <p className="text-sm text-zinc-500">
            Catat dan pantau seluruh biaya operasional dan refund klien.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex h-[42px] items-center gap-2 rounded-xl bg-rose-600 px-4 text-sm font-bold text-white shadow-lg shadow-rose-600/20 transition-all hover:bg-rose-700 hover:-translate-y-0.5">
            <Plus weight="bold" size={16} /> Catat Pengeluaran
          </button>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-4 rounded-2xl border border-rose-100 bg-rose-50/80 p-4 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 shadow-inner">
            <ClockCounterClockwise weight="duotone" size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Tugas Refund (Pending)</p>
            <p className="text-2xl font-black text-rose-700 mt-0.5">{countMenunggu}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-500 to-red-600 p-4 shadow-sm shadow-rose-500/20 text-white">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20 text-white shadow-inner">
            <Money weight="duotone" size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">Total Tagihan (Pending)</p>
            <p className="text-2xl font-black mt-0.5">Rp {totalMenunggu.toLocaleString("id-ID")}</p>
          </div>
        </div>
      </div>

      {/* TABS & SEARCH */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab("Menunggu Transfer")}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeTab === "Menunggu Transfer" 
                ? "bg-rose-100 text-rose-700 ring-1 ring-rose-500/50 shadow-sm" 
                : "text-zinc-500 hover:bg-zinc-100"
            }`}
          >
            Menunggu Transfer
            {countMenunggu > 0 && (
              <span className="ml-2 bg-rose-500 text-white text-[10px] py-0.5 px-2 rounded-full">{countMenunggu}</span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab("Riwayat")}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeTab === "Riwayat" 
                ? "bg-zinc-800 text-white shadow-sm" 
                : "text-zinc-500 hover:bg-zinc-100"
            }`}
          >
            Riwayat
          </button>
        </div>

        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari deskripsi / nama klien..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="bg-zinc-50/80 text-xs uppercase text-zinc-500 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 font-bold">Tanggal</th>
                <th className="px-6 py-4 font-bold">Kategori</th>
                <th className="px-6 py-4 font-bold">Keterangan</th>
                <th className="px-6 py-4 font-bold">Nominal</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    <Spinner className="mx-auto h-8 w-8 animate-spin text-zinc-300" />
                    <p className="mt-2 text-sm">Memuat data pengeluaran...</p>
                  </td>
                </tr>
              ) : filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-50 mb-3">
                      <FileText className="text-zinc-400" size={32} />
                    </div>
                    <p className="text-zinc-500 font-medium">Tidak ada data pengeluaran ditemukan</p>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((ex) => (
                  <tr key={ex.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(ex.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4">
                      {ex.category === "Refund Pembatalan KPR" ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200">
                          <Bank size={12} weight="fill" />
                          REFUND KPR
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 text-xs font-bold border border-zinc-200">
                          {ex.category}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="font-medium text-zinc-900 truncate">{ex.description}</p>
                      {ex.booking && (
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          Klien: {ex.booking.lead?.name || "N/A"} • Unit: {ex.booking.unit?.kawasan} {ex.booking.unit?.blok}/{ex.booking.unit?.nomor}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-zinc-900">Rp {ex.amount.toLocaleString("id-ID")}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ex.status === "Menunggu Transfer" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold ring-1 ring-inset ring-amber-600/20">
                          <ClockCounterClockwise weight="bold" /> Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold ring-1 ring-inset ring-emerald-600/20">
                          <CheckCircle weight="bold" /> Selesai
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {ex.status === "Menunggu Transfer" ? (
                        <button 
                          onClick={() => handleUpdateStatus(ex.id)}
                          disabled={submittingId === ex.id}
                          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-zinc-800 disabled:opacity-50"
                        >
                          {submittingId === ex.id ? <Spinner className="animate-spin" /> : <CheckCircle weight="bold" />}
                          Tandai Ditransfer
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-zinc-400">Tuntas</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
