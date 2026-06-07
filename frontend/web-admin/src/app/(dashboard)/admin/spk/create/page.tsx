"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, WarningCircle, HardHat, Building, X, Package } from "@phosphor-icons/react";

const formatRupiah = (number: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);

export default function CreateSpkPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const [form, setForm] = useState({
    spkNo: "",
    date: new Date().toISOString().slice(0, 10),
    contractorName: "",
    totalPrice: "",
  });

  const [availableUnits, setAvailableUnits] = useState<any[]>([]);
  const [selectedUnitIds, setSelectedUnitIds] = useState<Set<string>>(new Set());
  const [loadingUnits, setLoadingUnits] = useState(true);

  const totalEstimasiRAB = availableUnits
    .filter(u => selectedUnitIds.has(u.id))
    .reduce((sum, u) => sum + (Number(u.propertyType?.estimasiRab) || 0), 0);

  useEffect(() => {
    fetchAvailableUnits();
  }, []);

  const fetchAvailableUnits = async () => {
    try {
      setLoadingUnits(true);
      const loginRes = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "superadmin@erp.com", password: "password123" })
      });
      const { token } = await loginRes.json();

      const res = await fetch("http://localhost:4000/api/inventory/units", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      const allUnits = data.data || data;
      
      // Filter unit: (Pesan Bangun ATAU Booked) dan belum di-SPK-kan
      const filtered = allUnits.filter((u: any) => 
        (u.statusPembangunan === "Pesan Bangun" || u.statusPenjualan === "Booked" || u.status === "Booked") && 
        u.spkId === null
      ).sort((a: any, b: any) => {
        if (a.blok !== b.blok) return a.blok.localeCompare(b.blok);
        return a.nomor.localeCompare(b.nomor, undefined, { numeric: true, sensitivity: 'base' });
      });
      setAvailableUnits(filtered);
    } catch (err) {
      console.error("Failed to fetch units", err);
    } finally {
      setLoadingUnits(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleUnit = (id: string) => {
    const newSet = new Set(selectedUnitIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedUnitIds(newSet);
  };

  const selectAll = () => {
    setSelectedUnitIds(new Set(availableUnits.map(u => u.id)));
  };

  const deselectAll = () => {
    setSelectedUnitIds(new Set());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUnitIds.size === 0) {
      showToast("Pilih minimal 1 unit untuk di-SPK-kan", "error");
      return;
    }

    try {
      setSubmitting(true);
      const loginRes = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "superadmin@erp.com", password: "password123" })
      });
      const { token } = await loginRes.json();

      const payload = {
        spkNo: form.spkNo,
        date: form.date,
        contractorName: form.contractorName,
        totalPrice: Number(form.totalPrice.replace(/\./g, "")),
        unitIds: Array.from(selectedUnitIds),
      };

      const res = await fetch("http://localhost:4000/api/construction/spk", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.error || errData.message || "Gagal membuat SPK", "error");
        return;
      }

      showToast("Berhasil menerbitkan SPK", "success");
      setTimeout(() => {
        router.push("/admin/spk");
      }, 1500);
      
    } catch (err) {
      console.error(err);
      showToast("Terjadi kesalahan sistem", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="rounded-xl border border-zinc-200 bg-white p-2 text-zinc-500 hover:bg-zinc-50"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-[family-name:var(--font-heading)] text-zinc-900 font-bold">Buat SPK Baru</h2>
          <p className="text-sm text-zinc-500">Buat kontrak pembangunan untuk beberapa unit kavling sekaligus.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Kolom Kiri: Info SPK */}
        <div className="md:col-span-4 space-y-6">
          <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-4">
              <HardHat weight="duotone" className="text-amber-500" /> Info Kontrak
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-600">No SPK / Kontrak</label>
                <input
                  required
                  type="text"
                  value={form.spkNo}
                  onChange={e => setForm({...form, spkNo: e.target.value})}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  placeholder="Contoh: SPK/2026/08/01"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Tanggal Kontrak</label>
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={e => setForm({...form, date: e.target.value})}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Nama Kontraktor</label>
                <input
                  required
                  type="text"
                  value={form.contractorName}
                  onChange={e => setForm({...form, contractorName: e.target.value})}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  placeholder="PT. Bangun Jaya Persada"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Total Harga Kesepakatan</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-zinc-400">Rp</span>
                  <input
                    required
                    type="text"
                    value={form.totalPrice}
                    onChange={e => {
                      const rawValue = e.target.value.replace(/\D/g, "");
                      const formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                      setForm({...form, totalPrice: formatted});
                    }}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-12 pr-4 text-sm font-bold text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    placeholder="0"
                  />
                </div>
                {selectedUnitIds.size > 0 && (
                  <p className="mt-1.5 text-[11px] font-medium text-zinc-500 flex items-center gap-1">
                    💡 Estimasi RAB ({selectedUnitIds.size} unit): <span className="font-bold text-emerald-600">{formatRupiah(totalEstimasiRAB)}</span>
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-zinc-100">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-zinc-900/20 transition-all hover:bg-zinc-800 disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan SPK"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Pilihan Unit */}
        <div className="md:col-span-8">
          <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm h-full flex flex-col">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
              <h3 className="flex items-center gap-2 text-lg font-bold text-zinc-900">
                <Building weight="duotone" className="text-amber-500" /> Pilih Unit Kavling
              </h3>
              
              <div className="flex items-center gap-2">
                <button 
                  type="button" 
                  onClick={selectAll}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg"
                >
                  Pilih Semua
                </button>
                <button 
                  type="button" 
                  onClick={deselectAll}
                  className="text-xs font-bold text-zinc-500 hover:text-zinc-700 bg-zinc-100 px-3 py-1.5 rounded-lg"
                >
                  Batal Semua
                </button>
              </div>
            </div>

            <div className="mb-4 rounded-xl bg-blue-50 border border-blue-100 p-4 flex gap-3">
              <Package weight="duotone" className="text-blue-500 shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-medium text-blue-900">Daftar ini hanya menampilkan unit yang berstatus "Pesan Bangun" atau "Booked" dan belum memiliki SPK.</p>
                <p className="text-xs mt-1 text-blue-700 font-bold">{selectedUnitIds.size} unit dipilih</p>
              </div>
            </div>

            {loadingUnits ? (
              <div className="flex-1 flex justify-center items-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-amber-500"></div>
              </div>
            ) : availableUnits.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                <Building className="mb-4 text-zinc-300" weight="duotone" size={48} />
                <p className="text-lg font-bold text-zinc-900">Tidak ada unit tersedia</p>
                <p className="text-sm text-zinc-500">Semua unit sudah memiliki SPK atau tidak memenuhi syarat (harus Pesan Bangun / Booked).</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[500px]">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {availableUnits.map(unit => {
                    const isSelected = selectedUnitIds.has(unit.id);
                    return (
                      <div 
                        key={unit.id}
                        onClick={() => toggleUnit(unit.id)}
                        className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                          isSelected 
                            ? "border-amber-500 bg-amber-50 shadow-md shadow-amber-500/10" 
                            : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className={`inline-flex items-center justify-center rounded-lg px-2.5 py-1 text-xs font-black ${
                            isSelected ? "bg-amber-500 text-white" : "bg-zinc-100 text-zinc-600"
                          }`}>
                            {unit.blok} - {unit.nomor}
                          </span>
                          <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected ? "border-amber-500 bg-amber-500" : "border-zinc-300 bg-white"
                          }`}>
                            {isSelected && <CheckCircle weight="fill" className="text-white" size={12} />}
                          </div>
                        </div>
                        <p className="text-xs font-semibold text-zinc-500">{unit.project?.name || "Proyek"}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-zinc-400">{unit.propertyType?.name || "Tipe Standar"}</p>
                          {(unit.statusPenjualan === "Booked" || unit.status === "Booked") && (
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">Booked</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
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
        </div>
      )}
    </div>
  );
}
