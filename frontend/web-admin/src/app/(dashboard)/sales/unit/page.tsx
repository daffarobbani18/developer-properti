"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Plus, X, Trash, CheckCircle, WarningCircle, Buildings, HouseLine, CircleNotch, House, Package, MapPin, ShieldCheck, User
} from "@phosphor-icons/react";

const formatRupiah = (number: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);

export default function KavlingUnitPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [projects, setProjects] = useState<any[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("Semua");
  
  const [leads, setLeads] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<any | null>(null);
  const [modalState, setModalState] = useState<"detail" | "form" | "booked_info">("detail");
  const [submitting, setSubmitting] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    leadId: "",
    bookingFee: 0,
    paymentMethod: "Transfer Bank"
  });

  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const loginRes = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "superadmin@erp.com", password: "password123" })
      });
      const loginData = await loginRes.json();
      const token = loginData.token;

      if (token) {
        const headers = { "Authorization": `Bearer ${token}` };

        // Fetch Projects
        const prjRes = await fetch("http://localhost:4000/api/projects", { headers });
        const fetchedProjects = await prjRes.json();
        const prjs = fetchedProjects.data || fetchedProjects;
        if (prjs && prjs.length > 0) {
          setProjects(prjs);
        }

        // Fetch Property Types
        const ptRes = await fetch("http://localhost:4000/api/inventory/types", { headers });
        const fetchedTypesJson = await ptRes.json();
        const fetchedTypes = fetchedTypesJson.data || fetchedTypesJson;
        if (fetchedTypes && fetchedTypes.length > 0) {
          setPropertyTypes(fetchedTypes);
        }

        // Fetch Units
        const unRes = await fetch("http://localhost:4000/api/inventory/units", { headers });
        const unsJson = await unRes.json();
        const uns = unsJson.data || unsJson;
        if (uns && uns.length > 0) {
          setUnits(uns.map((u: any) => ({
            id: u.id,
            projectId: u.projectId,
            projectName: u.project?.name || "Unknown",
            propertyTypeId: u.propertyTypeId,
            type: u.propertyType?.name || "Unknown",
            basePrice: u.propertyType?.basePrice || 0,
            priceMarkup: u.priceMarkup || 0,
            price: u.totalPrice || u.price || 0,
            statusPenjualan: u.statusPenjualan || u.status || "Tersedia",
            statusPembangunan: u.statusPembangunan || "Pesan Bangun",
            kawasan: u.kawasan,
            blok: u.blok,
            nomor: u.nomor,
            luasTanahAktual: u.luasTanahAktual || "",
          })));
        }
        
        // Fetch Leads
        const ldRes = await fetch("http://localhost:4000/api/sales/leads", { headers });
        const fetchedLeadsJson = await ldRes.json();
        const fetchedLeads = fetchedLeadsJson.data || fetchedLeadsJson;
        if (fetchedLeads && fetchedLeads.length > 0) {
          setLeads(fetchedLeads);
        }

        // Fetch Bookings
        const bkgRes = await fetch("http://localhost:4000/api/sales/bookings", { headers });
        const fetchedBookingsJson = await bkgRes.json();
        const fetchedBookings = fetchedBookingsJson.data || fetchedBookingsJson;
        if (fetchedBookings && fetchedBookings.length > 0) {
          setBookings(fetchedBookings);
        }
      }
    } catch (err) {
      console.error("Failed to fetch backend data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const selectedProjectData = projects.find(p => p.id === selectedProject);
  const plannedTotalUnits = selectedProjectData?.totalUnits || 0;

  const projectUnits = units.filter(u => u.projectId === selectedProject);
  const filteredUnits = projectUnits.filter(u => statusFilter === "Semua" ? true : u.statusPenjualan === statusFilter);
  const blocks = Array.from(new Set(filteredUnits.map(u => u.blok))).sort();

  const projectPropertyTypes = propertyTypes.filter(t => t.projectId === selectedProject);
  const totalTypesInProject = projectPropertyTypes.length;

  const availableCount = projectUnits.filter(u => u.statusPenjualan === "Tersedia").length;
  const soldCount = projectUnits.filter(u => u.statusPenjualan === "Terjual").length;

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Tersedia": return "bg-emerald-50 text-emerald-600 border-emerald-200 ring-emerald-500 hover:bg-emerald-100 hover:border-emerald-300";
      case "Booked": return "bg-amber-50 text-amber-600 border-amber-200 ring-amber-500 hover:bg-amber-100 hover:border-amber-300";
      case "Terjual": return "bg-rose-50 text-rose-600 border-rose-200 ring-rose-500 hover:bg-rose-100 hover:border-rose-300";
      default: return "bg-zinc-50 text-zinc-600 border-zinc-200 ring-zinc-500";
    }
  };

  const handleUnitClick = (unit: any) => {
    if (unit.statusPenjualan !== "Tersedia") {
      const booking = bookings.find(b => b.unitId === unit.id);
      if (booking) {
        setSelectedUnit({ ...unit, bookingData: booking });
        setModalState("booked_info");
      } else {
        showToast("Data pembeli belum tersedia.", "error");
      }
      return;
    }
    setSelectedUnit(unit);
    setModalState("detail");
    setBookingForm({
      leadId: "",
      bookingFee: 0,
      paymentMethod: "Transfer Bank"
    });
  };

  const handleBookingSubmit = async () => {
    if (!bookingForm.leadId || !bookingForm.bookingFee) {
      showToast("Pilih pelanggan dan masukkan booking fee", "error");
      return;
    }

    try {
      setSubmitting(true);
      const loginRes = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "sales@erp.com", password: "password123" }) // use sales for bookings
      });
      const { token } = await loginRes.json();
      
      const payload = {
        leadId: bookingForm.leadId,
        unitId: selectedUnit.id,
        bookingFee: Number(bookingForm.bookingFee),
        paymentMethod: bookingForm.paymentMethod
      };
      
      const res = await fetch("http://localhost:4000/api/sales/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast(`Gagal: ${err.message || err.error || res.statusText}`, 'error');
        return;
      }
      
      setSelectedUnit(null);
      await fetchData();
      showToast(`Pemesanan berhasil! Unit telah di-booking.`, 'success');
    } catch (e) {
      console.error(e);
      showToast('Gagal memproses pemesanan unit', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ZONA ATAS: Global Controls */}
      <div className="mb-8 flex flex-col gap-6">
        <div>
          <h2 className="mb-2 text-3xl font-[family-name:var(--font-heading)] text-zinc-900">Visual Grid Kavling</h2>
          <p className="text-sm text-zinc-500">Denah interaktif pemetaan status kavling dan unit properti.</p>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="w-full md:w-1/3">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Pilih Proyek (Wajib)</label>
            <select 
              value={selectedProject}
              onChange={(e) => {
                setSelectedProject(e.target.value);
                setStatusFilter("Semua");
              }}
              className="w-full appearance-none rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 font-semibold text-zinc-800 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 cursor-pointer shadow-sm"
            >
              <option value="" disabled>-- Pilih Proyek --</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {selectedProject && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              {["Semua", "Tersedia", "Booked", "Terjual"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                    statusFilter === status 
                    ? "bg-zinc-900 text-white shadow-md" 
                    : "bg-white text-zinc-500 border border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  {status}
                </button>
              ))}
              
            </div>
          )}
        </div>
      </div>

      {!selectedProject ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-32 text-center">
          <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
            <Buildings weight="duotone" className="text-zinc-400" size={48} />
          </div>
          <h3 className="mb-2 text-xl font-bold text-zinc-900">Pilih Proyek Terlebih Dahulu</h3>
          <p className="max-w-md text-sm text-zinc-500">
            Anda harus memilih proyek pada dropdown di atas untuk melihat visual grid dan detail kavling.
          </p>
        </div>
      ) : (
        <>
          {/* ZONA TENGAH: Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group flex items-center justify-between gap-4 p-5 rounded-2xl border border-zinc-100 bg-white shadow-sm">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider truncate">Target Kavling Proyek</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-zinc-900 tracking-tight">{plannedTotalUnits}</h3>
                  <p className="text-xs font-medium text-zinc-400">({projectUnits.length} di-generate)</p>
                </div>
              </div>
              <div className="icon-wrapper h-14 w-14 shrink-0 icon-blue">
                <Package weight="duotone" size={28} />
              </div>
            </div>

            <div className="group flex items-center justify-between gap-4 p-5 rounded-2xl border border-zinc-100 bg-white shadow-sm">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider truncate">Total Tipe Rumah</p>
                <h3 className="mt-1 text-3xl font-bold text-blue-600 tracking-tight">{totalTypesInProject}</h3>
              </div>
              <div className="icon-wrapper h-14 w-14 shrink-0 icon-violet">
                <House weight="duotone" size={28} />
              </div>
            </div>

            <div className="group flex items-center justify-between gap-4 p-5 rounded-2xl border border-emerald-100 bg-emerald-50/50 shadow-sm">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider truncate">Kavling Tersedia</p>
                <h3 className="mt-1 text-3xl font-bold text-emerald-700 tracking-tight">{availableCount}</h3>
              </div>
              <div className="icon-wrapper h-14 w-14 shrink-0 icon-emerald">
                <HouseLine weight="duotone" size={28} />
              </div>
            </div>

            <div className="group flex items-center justify-between gap-4 p-5 rounded-2xl border border-rose-100 bg-rose-50/50 shadow-sm">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider truncate">Kavling Terjual</p>
                <h3 className="mt-1 text-3xl font-bold text-rose-700 tracking-tight">{soldCount}</h3>
              </div>
              <div className="icon-wrapper h-14 w-14 shrink-0 icon-rose">
                <ShieldCheck weight="duotone" size={28} />
              </div>
            </div>
          </div>

          {/* ZONA BAWAH: Visual Grid */}
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50/50 p-6 shadow-inner">
            {blocks.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-zinc-500">Tidak ada kavling yang sesuai dengan filter.</p>
              </div>
            ) : (
              <div className="space-y-10">
                {blocks.map((blok) => {
                  const blockUnits = filteredUnits.filter(u => u.blok === blok).sort((a, b) => {
                     // Sort numeric logic for numbers like "01", "02"
                     const numA = parseInt(a.nomor) || 0;
                     const numB = parseInt(b.nomor) || 0;
                     return numA - numB;
                  });

                  return (
                    <div key={blok} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-zinc-200"></div>
                        <h3 className="rounded-full bg-zinc-200 px-4 py-1 text-sm font-bold text-zinc-700 uppercase tracking-widest">
                          Blok {blok}
                        </h3>
                        <div className="h-px flex-1 bg-zinc-200"></div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10">
                        {blockUnits.map((unit) => (
                          <button
                            key={unit.id}
                            onClick={() => handleUnitClick(unit)}
                            className={`group relative flex aspect-square w-full flex-col items-center justify-center rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 hover:scale-[1.05] hover:shadow-lg cursor-pointer ${getStatusColor(unit.statusPenjualan)}`}
                          >
                            <span className="text-[10px] font-semibold opacity-70 uppercase tracking-widest">Blok {unit.blok}</span>
                            <span className="text-xl font-black mt-1 leading-none">{unit.nomor}</span>
                            <span className="text-[10px] font-bold mt-1 opacity-80 truncate w-[90%] text-center leading-none">{unit.type}</span>
                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                               <span className="text-xs text-white font-semibold">{unit.statusPenjualan === "Tersedia" ? "Pesan Unit" : "Info Pembeli"}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Booking Modal */}
      {selectedUnit && mounted && createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg animate-in zoom-in-95 rounded-3xl bg-white shadow-2xl duration-200 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 bg-zinc-50/50">
              <div>
                <h3 className="text-xl font-bold text-zinc-900">
                  {modalState === "detail" ? "Detail Spesifikasi Unit" : "Formulir Booking Unit"}
                </h3>
                <p className="text-sm text-zinc-500 mt-1">Blok {selectedUnit.blok}-{selectedUnit.nomor} &middot; {selectedUnit.projectName}</p>
              </div>
              <button onClick={() => setSelectedUnit(null)} className="rounded-full p-2 text-zinc-400 hover:bg-rose-100 hover:text-rose-600 transition-colors">
                <X weight="bold" size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {modalState === "booked_info" ? (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5 space-y-4 shadow-sm">
                    <div className="flex items-center gap-4 border-b border-amber-200/60 pb-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shadow-inner">
                         <User weight="fill" size={24} />
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-amber-600/80 uppercase tracking-widest mb-0.5">Pemesan Kavling</p>
                         <p className="text-lg font-black text-zinc-900 leading-none">{selectedUnit.bookingData?.lead?.name || "Tidak ada data"}</p>
                         <p className="text-xs font-medium text-zinc-500 mt-1.5">{selectedUnit.bookingData?.lead?.phone || "-"}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-amber-200/60 pb-3 pt-2">
                      <span className="text-sm font-semibold text-zinc-500">Total Harga Unit</span>
                      <span className="text-sm font-bold text-zinc-900">{formatRupiah(selectedUnit.price)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-amber-200/60 pb-3">
                      <span className="text-sm font-semibold text-zinc-500">Metode Pembayaran</span>
                      <span className="text-sm font-bold text-zinc-900">{selectedUnit.bookingData?.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-sm font-bold uppercase tracking-wider text-zinc-700">Booking Fee Dibayar</span>
                      <span className="text-xl font-black text-emerald-600">{formatRupiah(selectedUnit.bookingData?.bookingFee)}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedUnit(null)}
                    className="w-full rounded-xl bg-zinc-100 py-3.5 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-200"
                  >
                    Tutup Informasi
                  </button>
                </div>
              ) : modalState === "detail" ? (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-5 space-y-4">
                    <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
                      <span className="text-sm font-semibold text-zinc-500">Tipe Rumah</span>
                      <span className="text-sm font-bold text-zinc-900">{selectedUnit.type}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
                      <span className="text-sm font-semibold text-zinc-500">Harga Dasar</span>
                      <span className="text-sm font-bold text-zinc-900">{formatRupiah(selectedUnit.basePrice)}</span>
                    </div>
                    {selectedUnit.priceMarkup > 0 && (
                      <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
                        <span className="text-sm font-semibold text-zinc-500">Markup Harga</span>
                        <span className="text-sm font-bold text-amber-600">+{formatRupiah(selectedUnit.priceMarkup)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-sm font-bold uppercase tracking-wider text-zinc-700">Total Harga</span>
                      <span className="text-xl font-black text-blue-600">{formatRupiah(selectedUnit.price)}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setModalState("form")}
                    className="w-full rounded-xl bg-amber-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/30 transition-all hover:bg-amber-600 hover:shadow-amber-500/40"
                  >
                    Buat Pesanan Sekarang
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-600">Pilih Pelanggan (Leads) <span className="text-rose-500">*</span></label>
                    <select 
                      value={bookingForm.leadId} 
                      onChange={(e) => setBookingForm({ ...bookingForm, leadId: e.target.value })}
                      className="w-full cursor-pointer appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    >
                      <option value="" disabled>-- Cari atau Pilih Pelanggan --</option>
                      {leads.map((l: any) => (
                        <option key={l.id} value={l.id}>
                          {l.name} - {l.phone}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-600">Nominal Booking Fee <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">Rp</span>
                      <input
                        type="text"
                        value={bookingForm.bookingFee ? new Intl.NumberFormat('id-ID').format(bookingForm.bookingFee) : ""}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/\D/g, "");
                          setBookingForm({ ...bookingForm, bookingFee: Number(rawValue) });
                        }}
                        placeholder="Contoh: 2.000.000"
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-12 pr-4 text-sm font-bold transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-600">Metode Pembayaran <span className="text-rose-500">*</span></label>
                    <select 
                      value={bookingForm.paymentMethod} 
                      onChange={(e) => setBookingForm({ ...bookingForm, paymentMethod: e.target.value })}
                      className="w-full cursor-pointer appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    >
                      <option value="Transfer Bank">Transfer Bank</option>
                      <option value="Tunai">Tunai</option>
                    </select>
                  </div>
                  
                  {/* Calculation Box */}
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-2 mt-4 shadow-sm">
                     <div className="flex justify-between text-xs font-medium text-zinc-500">
                        <span>Total Harga Unit</span>
                        <span>{formatRupiah(selectedUnit.price)}</span>
                     </div>
                     <div className="flex justify-between text-xs font-medium text-emerald-600">
                        <span>Pembayaran Awal (Booking)</span>
                        <span>- {formatRupiah(bookingForm.bookingFee || 0)}</span>
                     </div>
                     <div className="h-px bg-zinc-200 w-full my-1"></div>
                     <div className="flex justify-between text-sm font-bold text-zinc-900">
                        <span>Sisa Tagihan</span>
                        <span>{formatRupiah(selectedUnit.price - (bookingForm.bookingFee || 0))}</span>
                     </div>
                  </div>

                  <div className="flex gap-3 pt-2 border-t border-zinc-100 mt-6">
                    <button 
                      onClick={() => setModalState("detail")}
                      className="flex-1 rounded-xl bg-zinc-100 py-3.5 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-200"
                    >
                      Batal
                    </button>
                    <button 
                      onClick={handleBookingSubmit}
                      disabled={submitting}
                      className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/30 transition-all hover:bg-amber-600 hover:shadow-amber-500/40 disabled:opacity-50"
                    >
                      {submitting ? <CircleNotch weight="bold" className="animate-spin h-5 w-5" /> : "Simpan & Kunci Unit"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Toast Notification */}
      {toast && mounted && createPortal(
        <div className="fixed top-6 left-6 right-6 sm:left-auto sm:right-6 sm:max-w-sm z-[300] animate-in slide-in-from-top-5 fade-in duration-300">
          <div className={`flex items-center gap-3 rounded-2xl px-5 py-4 shadow-xl ${
            toast.type === 'success' 
              ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
              : 'bg-rose-500 text-white shadow-rose-500/20'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle weight="fill" className="h-6 w-6" />
            ) : (
              <WarningCircle weight="fill" className="h-6 w-6" />
            )}
            <p className="text-sm font-semibold">{toast.message}</p>
            <button 
              onClick={() => setToast(null)}
              className="ml-auto rounded-full p-1 hover:bg-white/20 transition-colors"
            >
              <X weight="bold" className="h-4 w-4" />
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
