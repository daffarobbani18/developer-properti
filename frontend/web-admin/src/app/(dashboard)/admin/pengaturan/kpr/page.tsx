"use client";

import { useEffect, useState } from "react";
import { CircleNotch, Wrench, CheckCircle, WarningCircle, Check, Info } from "@phosphor-icons/react";
import { createPortal } from "react-dom";

export default function PengaturanKPRPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [activeSetting, setActiveSetting] = useState<any>(null);

  const [formData, setFormData] = useState({
    kprYear: new Date().getFullYear(),
    kprMaxPlafon: 0,
    kprMinDpPercent: 5,
  });

  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
      let token = "";
      if (authDataStr) {
        const authData = JSON.parse(authDataStr);
        token = authData.token;
      }

      if (token) {
        const res = await fetch("http://localhost:4000/api/settings/kpr", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (res.ok && data.data) {
          setActiveSetting(data.data);
          setFormData({
            kprYear: data.data.kprYear,
            kprMaxPlafon: data.data.kprMaxPlafon,
            kprMinDpPercent: data.data.kprMinDpPercent,
          });
        }
      }
    } catch (err) {
      console.error("Gagal mengambil pengaturan KPR", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
      let token = "";
      if (authDataStr) {
        const authData = JSON.parse(authDataStr);
        token = authData.token;
      }

      const res = await fetch("http://localhost:4000/api/settings/kpr", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal memperbarui pengaturan");
      }

      showToast("Pengaturan KPR berhasil diperbarui!");
      fetchSettings(); // Refresh data
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const formatRupiah = (number: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);

  if (!mounted) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="mb-8">
        <h2 className="mb-2 text-3xl font-[family-name:var(--font-heading)] text-zinc-900 flex items-center gap-3 tracking-tight">
          <Wrench className="text-amber-500" weight="duotone" size={32} />
          Pengaturan KPR Subsidi
        </h2>
        <p className="text-sm text-zinc-500">Konfigurasi batas maksimal harga dan minimal DP KPR Subsidi sesuai regulasi pemerintah.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kolom Kiri: Form Input */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 md:p-8 shadow-sm">
          <h3 className="mb-6 text-xl font-bold text-zinc-900">Ubah Aturan</h3>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-600">Tahun Regulasi</label>
              <input
                type="number"
                required
                value={formData.kprYear}
                onChange={(e) => setFormData({ ...formData, kprYear: Number(e.target.value) })}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-600">Maksimal Harga KPR (Subsidi)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">Rp</span>
                <input
                  type="text"
                  required
                  value={formData.kprMaxPlafon ? new Intl.NumberFormat('id-ID').format(formData.kprMaxPlafon) : ""}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, "");
                    setFormData({ ...formData, kprMaxPlafon: Number(rawValue) });
                  }}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-12 pr-4 text-sm font-bold transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
              <p className="mt-1 text-[11px] font-medium text-zinc-400">Contoh: Rp 166.000.000</p>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-600">Minimal DP Bank (%)</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.kprMinDpPercent}
                  onChange={(e) => setFormData({ ...formData, kprMinDpPercent: Number(e.target.value) })}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-4 pr-10 text-sm font-bold transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">%</span>
              </div>
              <p className="mt-1 text-[11px] font-medium text-zinc-400">Contoh: 5 untuk 5%</p>
            </div>

            <div className="pt-4 border-t border-zinc-100">
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/30 transition-all hover:bg-amber-600 hover:shadow-amber-500/40 disabled:opacity-50"
              >
                {submitting ? <CircleNotch weight="bold" className="animate-spin h-5 w-5" /> : "Simpan Aturan"}
              </button>
            </div>
          </form>
        </div>

        {/* Kolom Kanan: Aturan Aktif */}
        <div>
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 md:p-8 shadow-sm h-full flex flex-col">
            <h3 className="mb-6 text-xl font-bold text-emerald-900 flex items-center gap-2">
              <CheckCircle weight="fill" className="text-emerald-500" />
              Aturan Saat Ini
            </h3>

            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <CircleNotch weight="bold" className="animate-spin text-emerald-500 h-8 w-8" />
              </div>
            ) : activeSetting ? (
              <div className="space-y-6 flex-1">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Tahun Regulasi</p>
                  <p className="text-3xl font-black text-emerald-900">{activeSetting.kprYear}</p>
                </div>
                
                <div className="h-px bg-emerald-200/60 w-full" />

                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Batas Harga Subsidi</p>
                  <p className="text-3xl font-black text-emerald-900 tracking-tight">{formatRupiah(activeSetting.kprMaxPlafon)}</p>
                </div>

                <div className="h-px bg-emerald-200/60 w-full" />

                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Minimal DP Bank</p>
                  <p className="text-3xl font-black text-emerald-900">{activeSetting.kprMinDpPercent}%</p>
                  <p className="text-xs font-medium text-emerald-700 mt-1">
                    Nilai DP: {formatRupiah((activeSetting.kprMaxPlafon * activeSetting.kprMinDpPercent) / 100)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <Info weight="duotone" className="h-12 w-12 text-emerald-400 mb-3" />
                <p className="text-sm font-bold text-emerald-800">Belum Ada Aturan KPR</p>
                <p className="text-xs text-emerald-600 mt-1 max-w-xs">Silakan buat aturan baru di panel sebelah kiri. Sistem akan menggunakannya untuk kalkulasi transaksi KPR Subsidi.</p>
              </div>
            )}
          </div>
        </div>
      </div>

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
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
