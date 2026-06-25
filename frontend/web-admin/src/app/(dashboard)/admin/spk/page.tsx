"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, HardHat, Receipt, Building, MagnifyingGlass, Printer } from "@phosphor-icons/react";

const formatRupiah = (number: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);

export default function SpkIndexPage() {
  const [spks, setSpks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSpks();
  }, []);

  const fetchSpks = async () => {
    try {
      setLoading(true);
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
      let token = "";
      if (authDataStr) {
        const authData = JSON.parse(authDataStr);
        token = authData.token;
      }

      const res = await fetch("http://localhost:4000/api/construction/spk", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.data) {
        setSpks(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch SPK", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSpks = spks.filter(s => 
    s.spkNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.contractorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="mb-2 text-3xl font-[family-name:var(--font-heading)] text-zinc-900 flex items-center gap-3 tracking-tight">
            <HardHat className="text-amber-600" weight="duotone" size={32} />
            Daftar SPK Borongan
          </h2>
          <p className="text-sm text-zinc-500">Kelola Surat Perintah Kerja untuk kontraktor dan pemborong.</p>
        </div>

        <Link 
          href="/admin/spk/create"
          className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-zinc-900/20 transition-all hover:bg-zinc-800"
        >
          <Plus weight="bold" /> Buat SPK Baru
        </Link>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-amber-50 p-3 text-amber-600">
              <Receipt weight="duotone" size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Total SPK Terbit</p>
              <h3 className="text-2xl font-bold text-zinc-900">{spks.length} <span className="text-sm font-medium text-zinc-400">Kontrak</span></h3>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-50 p-3 text-blue-600">
              <Building weight="duotone" size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Total Unit Dikerjakan</p>
              <h3 className="text-2xl font-bold text-zinc-900">{spks.reduce((acc, s) => acc + (s.units?.length || 0), 0)} <span className="text-sm font-medium text-zinc-400">Unit</span></h3>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-zinc-900">Data SPK</h3>
          <div className="relative w-full md:w-72">
            <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Cari No SPK atau Kontraktor..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-zinc-200 bg-zinc-50 py-2.5 pl-11 pr-4 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-amber-500"></div>
          </div>
        ) : filteredSpks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <HardHat className="mb-4 text-zinc-300" weight="duotone" size={48} />
            <p className="text-lg font-bold text-zinc-900">Belum ada data SPK</p>
            <p className="text-sm text-zinc-500">Buat SPK baru untuk mulai mendelegasikan pembangunan unit.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-500">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">No SPK</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Nama Kontraktor</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Jumlah Unit</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Total Harga</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredSpks.map(spk => (
                  <tr key={spk.id} className="transition-colors hover:bg-zinc-50/50">
                    <td className="px-6 py-4 font-bold text-zinc-900">{spk.spkNo}</td>
                    <td className="px-6 py-4 text-zinc-600">
                      {new Date(spk.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-800">{spk.contractorName}</td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {spk.units?.slice(0, 3).map((u: any, i: number) => (
                          <div key={u.id} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-amber-100 text-[10px] font-bold text-amber-700" title={`Blok ${u.blok} No ${u.nomor}`}>
                            {u.blok}{u.nomor}
                          </div>
                        ))}
                        {spk.units?.length > 3 && (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-zinc-100 text-[10px] font-bold text-zinc-600">
                            +{spk.units.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">
                      {formatRupiah(spk.totalPrice)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          const sessionAuth = sessionStorage.getItem("simdp_auth");
                          if (sessionAuth && !localStorage.getItem("simdp_auth")) {
                            localStorage.setItem("temp_auth", sessionAuth);
                          }
                          window.open(`/print/spk/${spk.id}`, "_blank");
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-200"
                      >
                        <Printer size={16} /> Cetak
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
