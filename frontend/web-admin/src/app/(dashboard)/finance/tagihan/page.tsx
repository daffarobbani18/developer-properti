"use client";

import { useState, useEffect } from "react";
import { Receipt, Plus, ClockCounterClockwise, CheckCircle, WarningCircle, ReceiptX, FilePdf, Check, X, Building, UserCircle, Note, Pulse, XCircle, HandCoins, CaretRight, CreditCard, ChartPieSlice, ExclamationMark, Money } from "@phosphor-icons/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Lead {
  name: string;
  phone: string;
  email: string | null;
}

interface Unit {
  id: string;
  blok: string;
  nomor: string;
  kawasan: string;
  totalPrice: number;
  propertyType?: { name: string };
  project?: { name: string };
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceType: string;
  amountDue: number;
  dueDate: string;
  status: string;
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
  salesNotes: string | null;
  createdAt: string;
  lead: Lead;
  unit: Unit;
  invoices: Invoice[];
  kprApplication?: any;
}

export default function TagihanFinancePage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  // UI State
  const [activeTab, setActiveTab] = useState<"pending" | "riwayat" | "piutang">("pending");
  const [submitting, setSubmitting] = useState(false);
  
  // Modals
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isPiutangModalOpen, setIsPiutangModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Form State - Verify
  const [financeNotes, setFinanceNotes] = useState("");
  
  // Form State - Generate Invoice
  const [generateMode, setGenerateMode] = useState<"Manual" | "Auto-Split">("Auto-Split");
  const [invoiceType, setInvoiceType] = useState("Cicilan Termin");
  const [nominal, setNominal] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tenor, setTenor] = useState("12");
  const [startDate, setStartDate] = useState("");

  // Form State - Receive Payment
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Transfer Bank BCA");
  const [referenceNumber, setReferenceNumber] = useState("");

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

  const fetchInvoices = async (bookingId: string) => {
    try {
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
        let token = "";
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          token = authData.token;
        }

      const res = await fetch(`http://localhost:4000/api/finance/bookings/${bookingId}/invoices`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok && selectedBooking) {
        // Update selectedBooking with fresh invoices
        setSelectedBooking({ ...selectedBooking, invoices: data.data || [] });
        // Update main state
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, invoices: data.data || [] } : b));
      }
    } catch (error) {
      console.error("Failed to fetch invoices", error);
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

  // Actions
  const handleVerify = async (action: "Approve" | "Reject") => {
    if (!selectedBooking) return;
    try {
      setSubmitting(true);
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
        let token = "";
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          token = authData.token;
        }

      const res = await fetch(`http://localhost:4000/api/finance/bookings/${selectedBooking.id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ action, financeNotes })
      });

      if (res.ok) {
        showToast(`Pembayaran berhasil ${action === "Approve" ? "Disetujui" : "Ditolak"}`, "success");
        setIsVerifyModalOpen(false);
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

  const handleGenerateInvoice = async () => {
    if (!selectedBooking) return;
    try {
      setSubmitting(true);
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
        let token = "";
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          token = authData.token;
        }

      const res = await fetch(`http://localhost:4000/api/finance/bookings/${selectedBooking.id}/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          mode: generateMode,
          invoiceType,
          nominal: generateMode === "Manual" ? nominal : undefined,
          dueDate: generateMode === "Manual" ? dueDate : undefined,
          tenor: generateMode === "Auto-Split" ? tenor : undefined,
          startDate: generateMode === "Auto-Split" ? startDate : undefined,
        })
      });

      if (res.ok) {
        showToast("Tagihan berhasil di-generate", "success");
        setIsGenerateModalOpen(false);
        fetchInvoices(selectedBooking.id);
      } else {
        const err = await res.json();
        showToast(`Gagal: ${err.error}`, "error");
      }
    } catch (error) {
      showToast("Gagal men-generate tagihan", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReceivePayment = async () => {
    if (!selectedInvoice) return;
    try {
      setSubmitting(true);
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
        let token = "";
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          token = authData.token;
        }

      const res = await fetch(`http://localhost:4000/api/finance/invoices/${selectedInvoice.id}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          amountPaid: amountPaid.replace(/\D/g, ''),
          paymentMethod,
          referenceNumber
        })
      });

      if (res.ok) {
        showToast("Pembayaran berhasil diverifikasi", "success");
        setIsPaymentModalOpen(false);
        if (selectedBooking) fetchInvoices(selectedBooking.id);
      } else {
        const err = await res.json();
        showToast(`Gagal: ${err.error}`, "error");
      }
    } catch (error) {
      showToast("Gagal memverifikasi pembayaran", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  // Filter Data
  const pendingBookings = bookings.filter(b => b.status === "Menunggu Verifikasi");
  const historyBookings = bookings.filter(b => b.status !== "Menunggu Verifikasi");
  const approvedBookings = bookings.filter(b => b.status === "Approved");
  
  const displayedBookings = activeTab === "pending" ? pendingBookings : activeTab === "riwayat" ? historyBookings : approvedBookings;

  return (
    <div className="space-y-8 pb-10">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="mb-2 text-3xl font-[family-name:var(--font-heading)] text-zinc-900 flex items-center gap-3 tracking-tight">
            <Receipt className="text-blue-500" weight="duotone" size={32} />
            Tagihan & Verifikasi Pembayaran
          </h2>
          <p className="text-sm text-zinc-500">
            Kelola pembuatan tagihan klien dan verifikasi bukti transfer pembayaran Booking Fee maupun Piutang.
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
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Total Transaksi</p>
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
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Total Approved</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {approvedBookings.length}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.6)]">
            <HandCoins weight="fill" size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-violet-600">Invoice Aktif</p>
            <p className="text-2xl font-black text-violet-600 mt-1">
              {bookings.flatMap(b => b.invoices || []).length}
            </p>
          </div>
        </div>
      </div>

      {/* TABS & LIST */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        {/* TABS */}
        <div className="flex items-center gap-1 border-b border-zinc-200 px-2 pt-2 bg-zinc-50/50">
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
            onClick={() => setActiveTab("piutang")}
            className={`flex items-center gap-2 border-b-2 px-5 py-3.5 text-sm font-bold transition-all ${
              activeTab === "piutang" ? "border-violet-500 text-violet-600 bg-white rounded-t-xl shadow-[0_-2px_10px_rgba(0,0,0,0.02)]" : "border-transparent text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-t-xl"
            }`}
          >
            <CreditCard weight={activeTab === "piutang" ? "bold" : "regular"} size={18} />
            Kelola Piutang & Cicilan
            <span className="ml-1 rounded-full bg-violet-100 text-violet-700 px-2 py-0.5 text-xs font-bold">{approvedBookings.length}</span>
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
              <h3 className="mb-1 text-lg font-bold text-zinc-700">Tidak ada data</h3>
              <p className="text-sm text-zinc-500">Belum ada data untuk kategori ini.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-600">
                <thead className="border-b border-zinc-200 bg-zinc-50/50 text-xs uppercase tracking-wider text-zinc-500">
                  <tr>
                    <th className="px-6 py-4 font-bold">Klien / Unit</th>
                    <th className="px-6 py-4 font-bold">Metode Pembayaran</th>
                    {activeTab === "piutang" ? (
                      <>
                        <th className="px-6 py-4 font-bold">Harga Unit</th>
                        <th className="px-6 py-4 font-bold">Telah Dibayar</th>
                        <th className="px-6 py-4 font-bold">Sisa Kewajiban</th>
                      </>
                    ) : (
                      <>
                        <th className="px-6 py-4 font-bold">Nominal Booking</th>
                        <th className="px-6 py-4 font-bold">Status</th>
                      </>
                    )}
                    <th className="px-6 py-4 font-bold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {displayedBookings.map((b) => {
                    const invoices = b.invoices || [];
                    const paidInvoicesTotal = invoices.filter(i => i.status === "Paid").reduce((acc, i) => acc + i.amountDue, 0);
                    const unpaidInvoicesTotal = invoices.filter(i => i.status === "Unpaid").reduce((acc, i) => acc + i.amountDue, 0);
                    const totalPaid = b.bookingFee + paidInvoicesTotal;
                    const remainingBalance = Math.max(0, b.unit.totalPrice - totalPaid);
                    const progress = Math.min(100, Math.round((totalPaid / b.unit.totalPrice) * 100));

                    return (
                      <tr key={b.id} className="transition-colors hover:bg-zinc-50/50">
                        <td className="px-6 py-4">
                          <div className="font-bold text-zinc-900">{b.lead.name}</div>
                          <div className="flex flex-col gap-0.5 mt-1">
                            <span className="text-xs font-semibold text-zinc-700">{b.unit.project?.name || "Proyek"} - {b.unit.propertyType?.name || "Tipe"}</span>
                            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Kawasan {b.unit.kawasan} &middot; Blok {b.unit.blok}-{b.unit.nomor}</span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                            b.paymentMethod.toUpperCase().includes("KPR") 
                              ? "bg-blue-50 border-blue-200 text-blue-700" 
                              : "bg-emerald-50 border-emerald-200 text-emerald-700"
                          }`}>
                            {b.paymentMethod}
                          </span>
                        </td>
                        
                        {activeTab === "piutang" ? (
                          <>
                            <td className="px-6 py-4 font-bold text-zinc-900">
                              Rp {b.unit.totalPrice.toLocaleString("id-ID")}
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-bold text-emerald-600">Rp {totalPaid.toLocaleString("id-ID")}</div>
                              <div className="w-full bg-zinc-200 rounded-full h-1.5 mt-1.5">
                                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-black text-rose-600">Rp {remainingBalance.toLocaleString("id-ID")}</div>
                              {unpaidInvoicesTotal > 0 && (
                                <div className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-700 shadow-sm whitespace-nowrap">
                                  <WarningCircle weight="fill" size={12} /> Ada Tagihan: Rp {unpaidInvoicesTotal.toLocaleString("id-ID")}
                                </div>
                              )}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-4">
                              <div className="font-black text-zinc-900">
                                Rp {b.bookingFee.toLocaleString("id-ID")}
                              </div>
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
                          </>
                        )}
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => { setSelectedBooking(b); setIsDetailModalOpen(true); }}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-700 transition-all hover:bg-zinc-50 hover:text-blue-600 shadow-sm"
                            >
                              <UserCircle weight="fill" size={16} /> Detail
                            </button>
                            
                            {activeTab === "pending" ? (
                              <button
                                onClick={() => { setSelectedBooking(b); setFinanceNotes(""); setIsVerifyModalOpen(true); }}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-blue-700 shadow-sm"
                              >
                                Verifikasi
                              </button>
                            ) : activeTab === "piutang" ? (
                              <button
                                onClick={() => { setSelectedBooking(b); fetchInvoices(b.id); setIsPiutangModalOpen(true); }}
                                className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-violet-700 shadow-sm"
                              >
                                Kelola Piutang <CaretRight weight="bold" />
                              </button>
                            ) : b.receiptUrl ? (
                              <a
                                href={`http://localhost:4000${b.receiptUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-700 transition-all hover:bg-zinc-50 hover:text-emerald-600 shadow-sm"
                              >
                                <FilePdf weight="fill" size={16} className="text-rose-500" /> Kuitansi
                              </a>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: VERIFIKASI BOOKING FEE */}
      <Dialog open={isVerifyModalOpen} onOpenChange={setIsVerifyModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <CheckCircle className="text-blue-500" weight="fill" /> Verifikasi Pembayaran Booking
            </DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="grid gap-5 py-2">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-4">
                <div className="flex justify-between border-b border-zinc-200 pb-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Klien</p>
                    <p className="font-bold text-zinc-900 mt-0.5">{selectedBooking.lead.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Nominal Booking</p>
                    <p className="font-black text-emerald-600 mt-0.5">Rp {selectedBooking.bookingFee.toLocaleString("id-ID")}</p>
                  </div>
                </div>
                
                {selectedBooking.salesNotes && (
                  <div className="pt-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Catatan dari Sales (Tenor/Skema)</p>
                    <p className="font-medium text-amber-700 bg-amber-50 rounded-lg p-2 mt-1 border border-amber-100 italic">{selectedBooking.salesNotes}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-600">Catatan Finance (Opsional)</label>
                <textarea
                  value={financeNotes}
                  onChange={e => setFinanceNotes(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 resize-none"
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-3 sm:justify-between mt-2 pt-5">
            <Button variant="outline" onClick={() => handleVerify("Reject")} disabled={submitting} className="text-rose-600">Tolak & Batalkan</Button>
            <Button onClick={() => handleVerify("Approve")} disabled={submitting} className="bg-emerald-600 text-white">Setujui & Kuitansi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: KELOLA PIUTANG & INVOICE LIST */}
      <Dialog open={isPiutangModalOpen} onOpenChange={setIsPiutangModalOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <ChartPieSlice className="text-violet-500" weight="fill" /> Kelola Piutang & Cicilan
            </DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (() => {
            const invoices = selectedBooking.invoices || [];
            const paidInvoicesTotal = invoices.filter(i => i.status === "Paid").reduce((acc, i) => acc + i.amountDue, 0);
            const allInvoicesTotal = invoices.reduce((acc, i) => acc + i.amountDue, 0);
            
            const totalPaid = selectedBooking.bookingFee + paidInvoicesTotal;
            const remainingBalance = selectedBooking.unit.totalPrice - totalPaid;
            const unbilledBalance = selectedBooking.unit.totalPrice - selectedBooking.bookingFee - allInvoicesTotal;

            return (
              <div className="py-2 space-y-6">
                {/* Ringkasan Piutang */}
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Harga Unit</p>
                      <p className="text-xl font-black text-zinc-900">Rp {selectedBooking.unit.totalPrice.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1">Total Telah Dibayar</p>
                      <p className="text-xl font-black text-emerald-700">Rp {totalPaid.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-4 relative overflow-hidden">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-rose-700 mb-1">Sisa Kewajiban</p>
                      <p className="text-xl font-black text-rose-700 relative z-10">Rp {remainingBalance.toLocaleString("id-ID")}</p>
                    </div>
                  </div>
                  
                  {selectedBooking.salesNotes && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-1">Catatan Kesepakatan (Dari Sales)</p>
                      <p className="text-sm font-semibold text-amber-900 italic">"{selectedBooking.salesNotes}"</p>
                    </div>
                  )}

                  {selectedBooking.kprApplication?.isPlafonTurun && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 shadow-sm flex gap-3 items-start">
                      <WarningCircle className="text-rose-600 shrink-0" size={24} weight="fill" />
                      <div>
                        <h4 className="font-bold text-rose-800 text-sm">Peringatan dari Tim Legal: Plafon KPR Turun</h4>
                        <p className="text-xs text-rose-700 mt-1 font-medium">Bank telah menerbitkan SP3K namun nilai yang disetujui lebih kecil dari sisa tagihan. Terdapat selisih kekurangan sebesar <b>{selectedBooking.kprApplication.selisihPlafon.toLocaleString("id-ID")}</b>. Harap terbitkan Invoice Penambahan DP manual untuk klien ini.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tabel Invoices */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-zinc-900">Daftar Tagihan Lanjutan</h3>
                    {(() => {
                      const isKPR = selectedBooking.paymentMethod.toUpperCase().includes("KPR");
                      if (isKPR) {
                        return (
                          <button
                            onClick={() => {
                              setGenerateMode("Manual");
                              setInvoiceType("Penambahan Uang Muka (DP)");
                              setTenor("12");
                              setStartDate("");
                              setIsGenerateModalOpen(true);
                            }}
                            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-violet-700 shadow-sm"
                          >
                            <Plus weight="bold" size={14} /> Terbitkan Tagihan Tambahan
                          </button>
                        );
                      } else {
                        return unbilledBalance > 0 ? (
                          <button
                            onClick={() => {
                              setGenerateMode("Auto-Split");
                              setInvoiceType("Cicilan Termin");
                              setTenor("12");
                              setStartDate("");
                              setIsGenerateModalOpen(true);
                            }}
                            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-violet-700 shadow-sm"
                          >
                            <Plus weight="bold" size={14} /> Terbitkan Tagihan (Sisa: Rp {unbilledBalance.toLocaleString("id-ID")})
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider">
                            <CheckCircle weight="fill" size={14} /> Seluruh Piutang Telah Diterbitkan
                          </span>
                        );
                      }
                    })()}
                  </div>
                
                <div className="rounded-xl border border-zinc-200 overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-xs text-zinc-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 font-bold">No. Tagihan</th>
                        <th className="px-4 py-3 font-bold">Tipe</th>
                        <th className="px-4 py-3 font-bold">Nominal</th>
                        <th className="px-4 py-3 font-bold">Jatuh Tempo</th>
                        <th className="px-4 py-3 font-bold text-center">Status</th>
                        <th className="px-4 py-3 font-bold text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {selectedBooking.invoices?.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-zinc-500 italic">Belum ada tagihan lanjutan diterbitkan.</td>
                        </tr>
                      ) : (
                        selectedBooking.invoices?.map(inv => {
                          const isOverdue = inv.status === "Unpaid" && new Date(inv.dueDate) < new Date(new Date().setHours(0,0,0,0));
                          
                          return (
                            <tr key={inv.id} className={isOverdue ? "bg-rose-50/30" : "hover:bg-zinc-50"}>
                              <td className="px-4 py-3 font-mono text-xs font-bold text-zinc-600">{inv.invoiceNumber}</td>
                              <td className="px-4 py-3 font-medium text-zinc-900">{inv.invoiceType}</td>
                              <td className="px-4 py-3 font-black text-zinc-900">Rp {inv.amountDue.toLocaleString("id-ID")}</td>
                              <td className="px-4 py-3">
                                <div className={`flex items-center gap-1.5 ${isOverdue ? "text-rose-600 font-bold" : "text-zinc-600"}`}>
                                  {isOverdue && <ExclamationMark className="bg-rose-600 text-white rounded-full p-0.5" size={14} weight="bold" />}
                                  {new Date(inv.dueDate).toLocaleDateString("id-ID")}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider ${
                                  inv.status === "Paid" ? "bg-emerald-100 text-emerald-700" : 
                                  isOverdue ? "bg-rose-100 text-rose-700 border border-rose-200" : "bg-zinc-100 text-zinc-600"
                                }`}>
                                  {inv.status} {isOverdue && "- OVERDUE"}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                {inv.status === "Unpaid" && (
                                  <button
                                    onClick={() => {
                                      setSelectedInvoice(inv);
                                      setAmountPaid(inv.amountDue.toString());
                                      setIsPaymentModalOpen(true);
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 text-emerald-700 px-3 py-1.5 text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                  >
                                    <Money weight="bold" size={14} /> Terima Pembayaran
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* MODAL 3: GENERATE INVOICE FORM */}
      <Dialog open={isGenerateModalOpen} onOpenChange={setIsGenerateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Terbitkan Tagihan Baru</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="flex gap-2 p-1 bg-zinc-100 rounded-xl">
              {!selectedBooking?.paymentMethod?.toUpperCase().includes("KPR") && (
                <button 
                  onClick={() => setGenerateMode("Auto-Split")}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${generateMode === "Auto-Split" ? "bg-white shadow text-violet-600" : "text-zinc-500"}`}
                >Auto-Split (Bagi Rata)</button>
              )}
              <button 
                onClick={() => setGenerateMode("Manual")}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${generateMode === "Manual" ? "bg-white shadow text-blue-600" : "text-zinc-500"}`}
              >Manual (Sekali Bayar)</button>
            </div>
            
            {selectedBooking?.paymentMethod?.toUpperCase().includes("KPR") && (
              <div className="bg-amber-50 text-amber-700 p-3 rounded-xl text-xs font-medium border border-amber-200 shadow-sm flex items-start gap-2">
                 <ExclamationMark className="shrink-0 text-amber-500 mt-0.5" size={16} weight="bold" />
                 <span>Untuk pembayaran <b>KPR</b>, sisa tagihan utama akan dicairkan otomatis oleh Bank di akhir (Selesai Akad). Anda hanya diizinkan membuat tagihan manual untuk Uang Muka Tambahan, Pajak, atau Biaya Administrasi Bank.</span>
              </div>
            )}
            
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 block">Tipe Tagihan</label>
              <input type="text" value={invoiceType} onChange={e => setInvoiceType(e.target.value)} className="w-full border border-zinc-300 rounded-xl px-4 py-2 text-sm" placeholder="Contoh: DP, Cicilan" />
            </div>

            {generateMode === "Auto-Split" ? (
              <>
                <div className="bg-violet-50 text-violet-700 p-3 rounded-xl text-xs">
                  Sistem akan membagi sisa kewajiban piutang secara rata menjadi sebanyak <b>{tenor || 'N'}</b> tagihan secara otomatis dengan jatuh tempo berurutan tiap bulannya.
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 block">Tenor (Bulan)</label>
                    <input type="number" value={tenor} onChange={e => setTenor(e.target.value)} className="w-full border border-zinc-300 rounded-xl px-4 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 block">Mulai Tanggal</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border border-zinc-300 rounded-xl px-4 py-2 text-sm" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 block">Nominal (Rp)</label>
                  <input type="number" value={nominal} onChange={e => setNominal(e.target.value)} className="w-full border border-zinc-300 rounded-xl px-4 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 block">Jatuh Tempo</label>
                  <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full border border-zinc-300 rounded-xl px-4 py-2 text-sm" />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateModalOpen(false)}>Batal</Button>
            <Button onClick={handleGenerateInvoice} disabled={submitting} className="bg-violet-600 text-white">Generate Tagihan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 4: TERIMA PEMBAYARAN */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Verifikasi Pembayaran</DialogTitle>
            <DialogDescription>Catat pelunasan untuk tagihan {selectedInvoice?.invoiceType}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 block">Nominal Diterima</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-zinc-400">Rp</span>
                <input 
                  type="text" 
                  value={Number(amountPaid).toLocaleString("id-ID")} 
                  onChange={e => setAmountPaid(e.target.value)} 
                  className="w-full border border-zinc-300 rounded-xl py-2 pl-12 pr-4 text-sm font-black" 
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 block">Metode Pembayaran</label>
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full border border-zinc-300 rounded-xl px-4 py-2 text-sm">
                <option>Transfer Bank BCA</option>
                <option>Transfer Bank Mandiri</option>
                <option>Tunai / Cash</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 block">No. Referensi (Opsional)</label>
              <input type="text" value={referenceNumber} onChange={e => setReferenceNumber(e.target.value)} className="w-full border border-zinc-300 rounded-xl px-4 py-2 text-sm" placeholder="Contoh: TRF-BCA-123" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)}>Batal</Button>
            <Button onClick={handleReceivePayment} disabled={submitting} className="bg-emerald-600 text-white">Verifikasi & Lunas</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* MODAL 5: DETAIL KLIEN & UNIT */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <UserCircle className="text-blue-500" weight="fill" /> Detail Klien & Unit
            </DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="grid gap-6 py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Info Klien */}
                <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-4 border-b border-blue-200/50 pb-2">Informasi Klien</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-blue-500 mb-0.5">Nama Lengkap</p>
                      <p className="font-bold text-zinc-900">{selectedBooking.lead.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-blue-500 mb-0.5">No. Telepon / WhatsApp</p>
                      <p className="font-semibold text-zinc-700">{selectedBooking.lead.phone || "-"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-blue-500 mb-0.5">Email</p>
                      <p className="font-semibold text-zinc-700">{selectedBooking.lead.email || "-"}</p>
                    </div>
                  </div>
                </div>

                {/* Info Transaksi */}
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-4 border-b border-emerald-200/50 pb-2">Informasi Pembelian</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-emerald-500 mb-0.5">Metode Bayar Pilihan</p>
                      <p className="font-bold text-zinc-900">{selectedBooking.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-emerald-500 mb-0.5">Booking Fee</p>
                      <p className="font-black text-emerald-700">Rp {selectedBooking.bookingFee.toLocaleString("id-ID")}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-emerald-500 mb-0.5">Tanggal Pesan</p>
                      <p className="font-semibold text-zinc-700">{new Date(selectedBooking.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Unit */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4 border-b border-zinc-200 pb-2 flex items-center gap-2">
                  <Building weight="fill" className="text-zinc-400" /> Detail Unit Properti
                </p>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-zinc-400 mb-0.5">Proyek & Tipe</p>
                    <p className="font-bold text-zinc-900">{selectedBooking.unit.project?.name || "Proyek"} - {selectedBooking.unit.propertyType?.name || "Tipe"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-zinc-400 mb-0.5">Kawasan / Cluster</p>
                    <p className="font-bold text-zinc-900">{selectedBooking.unit.kawasan}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-zinc-400 mb-0.5">Blok & Nomor</p>
                    <p className="font-bold text-zinc-900">Blok {selectedBooking.unit.blok} - {selectedBooking.unit.nomor}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-zinc-400 mb-0.5">Harga Unit</p>
                    <p className="font-black text-blue-600">Rp {selectedBooking.unit.totalPrice.toLocaleString("id-ID")}</p>
                  </div>
                </div>
              </div>

              {selectedBooking.salesNotes && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-1 flex items-center gap-1.5">
                    <Note weight="fill" /> Catatan Kesepakatan (Dari Sales)
                  </p>
                  <p className="text-sm font-semibold text-amber-900 italic">"{selectedBooking.salesNotes}"</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
