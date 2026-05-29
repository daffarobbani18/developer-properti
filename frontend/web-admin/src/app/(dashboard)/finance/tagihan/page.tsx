"use client";

import { useState, useEffect } from "react";
import { Receipt, Plus, ClockCounterClockwise, CheckCircle, WarningCircle, ReceiptX, FilePdf, Check, X, Building, UserCircle, Note, Pulse, XCircle } from "@phosphor-icons/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Lead {
  name: string;
  phone: string;
  email: string | null;
}

interface Unit {
  blok: string;
  nomor: string;
  kawasan: string;
  totalPrice: number;
}

interface Booking {
  id: string;
  leadId: string;
  unitId: string;
  bookingFee: number;
  paymentMethod: string;
  status: string;
  verifiedAt: string | null;
  receiptUrl: string | null;
  financeNotes: string | null;
  createdAt: string;
  lead: Lead;
  unit: Unit;
}

export default function TagihanFinancePage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  // UI State
  const [activeTab, setActiveTab] = useState<"pending" | "riwayat">("pending");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form State
  const [financeNotes, setFinanceNotes] = useState("");

  useEffect(() => {
    setMounted(true);
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Login dummy (Finance)
      const loginRes = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "finance@erp.com", password: "password123" }) // Asumsi finance@erp.com ada
      });
      const { token } = await loginRes.json();

      const res = await fetch("http://localhost:4000/api/finance/bookings", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok) {
        setBookings(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-6 right-6 z-[200] flex animate-in slide-in-from-right-8 fade-in duration-300 items-center gap-3 rounded-xl px-6 py-4 text-sm font-bold text-white shadow-2xl transition-all ${
      type === 'success' ? 'bg-emerald-600 shadow-[0_4px_20px_rgba(5,150,105,0.4)]' : 'bg-rose-600 shadow-[0_4px_20px_rgba(225,29,72,0.4)]'
    }`;
    toast.innerHTML = `<span class="tracking-wide">${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('animate-out', 'slide-out-to-right-8', 'fade-out');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 4000);
  };

  const openVerifyModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setFinanceNotes("");
    setIsModalOpen(true);
  };

  const handleVerify = async (action: "Approve" | "Reject") => {
    if (!selectedBooking) return;
    
    try {
      setSubmitting(true);
      const loginRes = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "finance@erp.com", password: "password123" })
      });
      const { token } = await loginRes.json();

      const res = await fetch(`http://localhost:4000/api/finance/bookings/${selectedBooking.id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ action, financeNotes })
      });

      if (res.ok) {
        showToast(`Pembayaran berhasil ${action === "Approve" ? "Disetujui" : "Ditolak"}`, "success");
        setIsModalOpen(false);
        fetchBookings();
      } else {
        const err = await res.json();
        showToast(`Gagal: ${err.error}`, "error");
      }
    } catch (error) {
      showToast("Gagal memproses verifikasi", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  // Filter Data
  const pendingBookings = bookings.filter(b => b.status === "Menunggu Verifikasi");
  const historyBookings = bookings.filter(b => b.status !== "Menunggu Verifikasi");
  
  const displayedBookings = activeTab === "pending" ? pendingBookings : historyBookings;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="mb-2 text-3xl font-[family-name:var(--font-heading)] text-zinc-900 flex items-center gap-3 tracking-tight">
            <Receipt className="text-blue-500" weight="duotone" size={32} />
            Tagihan & Verifikasi Pembayaran
          </h2>
          <p className="text-sm text-zinc-500">
            Kelola pembuatan tagihan klien dan verifikasi bukti transfer pembayaran Booking Fee.
          </p>
        </div>
      </div>

      {/* QUICK STATS - Dengan Efek Glow Ikon Sesuai Request */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]">
            <Receipt weight="fill" size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Total Tagihan</p>
            <p className="text-2xl font-black text-zinc-900 mt-1">{bookings.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.6)]">
            <ClockCounterClockwise weight="fill" size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Menunggu Verifikasi</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{pendingBookings.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.6)]">
            <CheckCircle weight="fill" size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Lunas (Approved)</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {bookings.filter(b => b.status === "Approved").length}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.6)]">
            <WarningCircle weight="fill" size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Ditolak / Batal</p>
            <p className="text-2xl font-black text-rose-600 mt-1">
              {bookings.filter(b => b.status === "Ditolak").length}
            </p>
          </div>
        </div>
      </div>

      {/* TABS & LIST */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        {/* TABS */}
        <div className="flex items-center gap-2 border-b border-zinc-200 px-2 pt-2 bg-zinc-50/50">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex items-center gap-2 border-b-2 px-5 py-3.5 text-sm font-bold transition-all ${
              activeTab === "pending" ? "border-amber-500 text-amber-600 bg-white rounded-t-xl shadow-[0_-2px_10px_rgba(0,0,0,0.02)]" : "border-transparent text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-t-xl"
            }`}
          >
            <ClockCounterClockwise weight={activeTab === "pending" ? "bold" : "regular"} size={18} />
            Menunggu Verifikasi
            <span className="ml-1 rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-xs font-bold">{pendingBookings.length}</span>
          </button>
          <button
            onClick={() => setActiveTab("riwayat")}
            className={`flex items-center gap-2 border-b-2 px-5 py-3.5 text-sm font-bold transition-all ${
              activeTab === "riwayat" ? "border-blue-500 text-blue-600 bg-white rounded-t-xl shadow-[0_-2px_10px_rgba(0,0,0,0.02)]" : "border-transparent text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-t-xl"
            }`}
          >
            <Receipt weight={activeTab === "riwayat" ? "bold" : "regular"} size={18} />
            Riwayat Tagihan
          </button>
        </div>

        {/* LIST KONTEN */}
        <div className="p-0">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Pulse className="animate-spin text-zinc-300" size={32} />
            </div>
          ) : displayedBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ReceiptX size={64} weight="duotone" className="mb-4 text-zinc-200" />
              <h3 className="mb-1 text-lg font-bold text-zinc-700">Tidak ada tagihan</h3>
              <p className="text-sm text-zinc-500">Belum ada data tagihan untuk kategori ini.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-600">
                <thead className="border-b border-zinc-200 bg-zinc-50/50 text-xs uppercase tracking-wider text-zinc-500">
                  <tr>
                    <th className="px-6 py-4 font-bold">ID / Tanggal</th>
                    <th className="px-6 py-4 font-bold">Klien / Lead</th>
                    <th className="px-6 py-4 font-bold">Unit / Kavling</th>
                    <th className="px-6 py-4 font-bold">Nominal (Rp)</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {displayedBookings.map((b) => (
                    <tr key={b.id} className="transition-colors hover:bg-zinc-50/50">
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs font-bold text-zinc-900 mb-1">{b.id.substring(0, 8).toUpperCase()}</div>
                        <div className="text-xs text-zinc-500">{new Date(b.createdAt).toLocaleDateString("id-ID")}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-zinc-900">{b.lead.name}</div>
                        <div className="text-xs text-zinc-500">{b.lead.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">
                          <Building size={14} /> Blok {b.unit.blok} - {b.unit.nomor}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-black text-zinc-900">
                          Rp {b.bookingFee.toLocaleString("id-ID")}
                        </div>
                        <div className="text-xs font-medium text-zinc-500">{b.paymentMethod}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                          b.status === "Menunggu Verifikasi" ? "bg-amber-100 text-amber-700" :
                          b.status === "Approved" ? "bg-emerald-100 text-emerald-700" :
                          "bg-rose-100 text-rose-700"
                        }`}>
                          {b.status === "Menunggu Verifikasi" && <ClockCounterClockwise weight="bold" size={14} />}
                          {b.status === "Approved" && <CheckCircle weight="bold" size={14} />}
                          {b.status === "Ditolak" && <XCircle weight="bold" size={14} />}
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {b.status === "Menunggu Verifikasi" ? (
                          <button
                            onClick={() => openVerifyModal(b)}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-blue-700 shadow-sm"
                          >
                            Verifikasi
                          </button>
                        ) : b.receiptUrl ? (
                          <a
                            href={`http://localhost:4000${b.receiptUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-700 transition-all hover:bg-zinc-50 hover:text-emerald-600 shadow-sm"
                          >
                            <FilePdf weight="fill" size={16} className="text-rose-500" /> Lihat Kuitansi
                          </a>
                        ) : (
                          <span className="text-xs text-zinc-400 italic">Tidak ada aksi</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* MODAL VERIFIKASI PEMBAYARAN */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <CheckCircle className="text-blue-500" weight="fill" /> Verifikasi Pembayaran
            </DialogTitle>
            <DialogDescription>
              Pastikan Anda telah mengecek mutasi rekening bank perusahaan sebelum menyetujui transaksi ini.
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="grid gap-5 py-2">
              
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-4">
                <div className="flex justify-between border-b border-zinc-200 pb-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">ID Transaksi</p>
                    <p className="font-mono font-bold text-zinc-900 mt-0.5">{selectedBooking.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Metode Bayar</p>
                    <p className="font-bold text-zinc-900 mt-0.5">{selectedBooking.paymentMethod}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-400 shadow-sm">
                    <UserCircle weight="duotone" size={28} />
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900">{selectedBooking.lead.name}</p>
                    <p className="text-sm text-zinc-500">{selectedBooking.lead.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white border border-zinc-200 rounded-xl p-3 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Building weight="duotone" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Kavling yang Dipesan</p>
                    <p className="font-bold text-blue-900 mt-0.5">Blok {selectedBooking.unit.blok} - {selectedBooking.unit.nomor}</p>
                  </div>
                  <div className="text-right pr-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Nominal Booking</p>
                    <p className="text-lg font-black text-emerald-600 mt-0.5">Rp {selectedBooking.bookingFee.toLocaleString("id-ID")}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-600">
                  <span className="flex items-center gap-1.5"><Note size={14} /> Catatan Finance (Opsional)</span>
                </label>
                <textarea
                  value={financeNotes}
                  onChange={e => setFinanceNotes(e.target.value)}
                  placeholder="Misal: Diterima di rekening BCA, atau alasan penolakan..."
                  rows={2}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-none"
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-3 sm:justify-between mt-2 border-t border-zinc-100 pt-5">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleVerify("Reject")}
              disabled={submitting}
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
            >
              <X weight="bold" className="mr-2" /> Tolak & Batalkan
            </Button>
            
            <Button 
              onClick={() => handleVerify("Approve")}
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
            >
              {submitting ? "Memproses..." : (
                <><Check weight="bold" className="mr-2" /> Setujui & Terbitkan Kuitansi</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
