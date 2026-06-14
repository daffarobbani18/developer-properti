"use client";

import { useEffect, useState } from "react";
import { Receipt, CircleNotch, MagnifyingGlass, Funnel } from "@phosphor-icons/react";

const formatRupiah = (number: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);

export default function TransaksiSalesPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  useEffect(() => {
    setMounted(true);
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
        let token = "";
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          token = authData.token;
        }

      if (token) {
        const res = await fetch("http://localhost:4000/api/sales/bookings", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const json = await res.json();
        const data = json.data || json;
        if (Array.isArray(data)) {
          setBookings(data);
        }
      }
    } catch (err) {
      console.error("Gagal mengambil data transaksi", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Menunggu Verifikasi":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Diverifikasi":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Dibatalkan":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  const filteredBookings = bookings.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = 
      item.unit?.blok?.toLowerCase().includes(searchLower) ||
      item.unit?.nomor?.toLowerCase().includes(searchLower) ||
      item.lead?.name?.toLowerCase().includes(searchLower) ||
      item.lead?.phone?.includes(searchLower);
    
    const matchStatus = statusFilter === "Semua" || item.status === statusFilter;
    
    return matchSearch && matchStatus;
  });

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-6">
        <div>
          <h2 className="mb-2 text-3xl font-[family-name:var(--font-heading)] text-zinc-900 flex items-center gap-3">
            <Receipt className="text-amber-500" weight="duotone" />
            Riwayat Transaksi
          </h2>
          <p className="text-sm text-zinc-500">Daftar pemesanan kavling (Booking) yang telah dibuat oleh divisi Sales.</p>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-zinc-50 p-4 rounded-2xl border border-zinc-200/60 shadow-sm">
        <div className="relative w-full sm:w-96">
          <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
          <input
            type="text"
            placeholder="Cari nama pelanggan, no. HP, atau blok unit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-11 pr-4 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-zinc-200 shadow-sm">
            <Funnel size={18} className="text-zinc-400" weight="bold" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-sm font-bold text-zinc-700 outline-none transition-all cursor-pointer min-w-[140px]"
            >
              <option value="Semua">Semua Status</option>
              <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
              <option value="Diverifikasi">Diverifikasi</option>
              <option value="Dibatalkan">Dibatalkan</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE DATA */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-6 py-4 font-bold">Tanggal</th>
                <th className="px-6 py-4 font-bold">Unit Kavling</th>
                <th className="px-6 py-4 font-bold">Pelanggan</th>
                <th className="px-6 py-4 font-bold">Booking Fee</th>
                <th className="px-6 py-4 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <CircleNotch weight="bold" className="mx-auto h-8 w-8 animate-spin text-amber-500" />
                    <p className="mt-4 text-sm font-medium text-zinc-500">Memuat data transaksi...</p>
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 mb-4">
                      <MagnifyingGlass className="h-8 w-8 text-zinc-400" />
                    </div>
                    <p className="text-sm font-medium text-zinc-500">Tidak ada transaksi yang cocok dengan pencarian/filter.</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-zinc-50/80">
                    <td className="px-6 py-4 font-medium text-zinc-900 whitespace-nowrap">
                      {(() => {
                        const d = new Date(item.createdAt);
                        return `${d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}, ${d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(/\./g, ':')}`;
                      })()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-zinc-900 whitespace-nowrap">
                        Blok {item.unit?.blok}-{item.unit?.nomor}
                      </div>
                      <div className="text-xs text-zinc-500 truncate max-w-[150px]">{item.unit?.kawasan}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-900">{item.lead?.name || "Tidak ada data"}</div>
                      <div className="text-xs text-zinc-500">{item.lead?.phone || "-"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-emerald-600 whitespace-nowrap">
                        {formatRupiah(item.bookingFee)}
                      </div>
                      <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                        {item.paymentMethod}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
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
