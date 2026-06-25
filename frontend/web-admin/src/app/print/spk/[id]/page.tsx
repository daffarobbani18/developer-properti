"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Printer } from "@phosphor-icons/react";

const formatRupiah = (number: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);

export default function PrintSpkPage() {
  const params = useParams();
  const [spk, setSpk] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (params.id) {
      fetchSpk(params.id as string);
    }
  }, [params.id]);

  const fetchSpk = async (id: string) => {
    try {
      setLoading(true);
      let authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
      
      if (!authDataStr) {
        const tempAuthStr = localStorage.getItem("temp_auth");
        if (tempAuthStr) {
          authDataStr = tempAuthStr;
          // Clean up so it doesn't stay permanently
          localStorage.removeItem("temp_auth");
          // Optionally save to session storage in the new tab to persist it for refreshes
          sessionStorage.setItem("simdp_auth", tempAuthStr);
        }
      }

      let token = "";
      if (authDataStr) {
        const authData = JSON.parse(authDataStr);
        token = authData.token;
      }

      const res = await fetch(`http://localhost:4000/api/construction/spk/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setSpk(data.data);
      } else {
        setErrorMsg(data.error || data.message || "Unknown API Error");
      }
    } catch (err: any) {
      console.error("Failed to fetch SPK detail", err);
      setErrorMsg(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center font-sans">Memuat dokumen SPK...</div>;
  if (errorMsg) return <div className="p-10 text-center font-sans text-red-500">Error: {errorMsg}</div>;
  if (!spk) return <div className="p-10 text-center font-sans">Dokumen SPK tidak ditemukan.</div>;

  return (
    <div className="bg-zinc-100 min-h-screen py-8 font-sans print:bg-transparent print:py-0">
      {/* Floating Action Button for printing - hidden during print */}
      <div className="fixed bottom-8 right-8 print:hidden">
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-full bg-amber-600 px-6 py-3 font-bold text-white shadow-xl hover:bg-amber-700 transition-colors"
        >
          <Printer size={24} weight="bold" /> Cetak Dokumen
        </button>
      </div>

      {/* A4 Paper Container */}
      <div className="mx-auto max-w-[210mm] min-h-[297mm] bg-white p-12 shadow-lg print:shadow-none print:p-0">
        
        {/* Header/Kop Surat */}
        <div className="border-b-4 border-zinc-900 pb-6 mb-8 text-center">
          <h1 className="text-3xl font-black uppercase tracking-widest text-zinc-900 mb-2">PT. DEVELOPER PROPERTI MAKMUR</h1>
          <p className="text-sm text-zinc-600">Jl. Pembangunan No. 123, Kawasan Bisnis, Kota Pusat 12345</p>
          <p className="text-sm text-zinc-600">Telp: (021) 555-0123 | Email: info@developerproperti.com</p>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-xl font-bold uppercase underline underline-offset-4 mb-1">Surat Perintah Kerja (SPK) Borongan</h2>
          <p className="font-semibold text-zinc-700">Nomor: {spk.spkNo}</p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-sm text-zinc-800 leading-relaxed">
          <p>
            Pada hari ini, tanggal <strong>{new Date(spk.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>, kami yang bertanda tangan di bawah ini:
          </p>

          <table className="w-full">
            <tbody>
              <tr>
                <td className="w-8 align-top py-1">I.</td>
                <td className="w-40 align-top font-semibold py-1">Nama Perusahaan</td>
                <td className="w-4 align-top py-1">:</td>
                <td className="align-top py-1">PT. Developer Properti Makmur, selanjutnya disebut sebagai <strong>PIHAK PERTAMA</strong>.</td>
              </tr>
              <tr>
                <td className="w-8 align-top py-1">II.</td>
                <td className="w-40 align-top font-semibold py-1">Nama Kontraktor</td>
                <td className="w-4 align-top py-1">:</td>
                <td className="align-top py-1"><strong>{spk.contractorName}</strong>, selanjutnya disebut sebagai <strong>PIHAK KEDUA</strong>.</td>
              </tr>
            </tbody>
          </table>

          <p>
            PIHAK PERTAMA memberikan perintah kerja kepada PIHAK KEDUA, dan PIHAK KEDUA menerima perintah kerja tersebut untuk melaksanakan pekerjaan pembangunan unit / kavling dengan rincian sebagai berikut:
          </p>

          <div className="mt-4 border border-zinc-900 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-zinc-100 border-b border-zinc-900">
                <tr>
                  <th className="px-4 py-3 border-r border-zinc-900 font-bold w-16 text-center">No</th>
                  <th className="px-4 py-3 border-r border-zinc-900 font-bold">Blok / Nomor</th>
                  <th className="px-4 py-3 font-bold">Tipe Properti</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {spk.units.map((unit: any, idx: number) => (
                  <tr key={unit.id}>
                    <td className="px-4 py-3 border-r border-zinc-900 text-center">{idx + 1}</td>
                    <td className="px-4 py-3 border-r border-zinc-900 font-semibold">Blok {unit.blok} No {unit.nomor}</td>
                    <td className="px-4 py-3">{unit.propertyType?.name || unit.type || "Tipe Standar"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center gap-4 bg-zinc-50 p-4 rounded-lg border border-zinc-200">
            <div className="w-40 font-semibold text-zinc-600">Total Nilai Kontrak</div>
            <div className="w-4 font-semibold text-zinc-600">:</div>
            <div className="font-black text-xl text-zinc-900">{formatRupiah(spk.totalPrice)}</div>
          </div>

          <p className="mt-6 text-justify">
            Demikian Surat Perintah Kerja ini dibuat untuk dapat dilaksanakan dengan penuh tanggung jawab sesuai dengan standar kualitas dan spesifikasi yang telah disepakati bersama. Surat ini sah dan memiliki kekuatan hukum mengikat bagi kedua belah pihak sejak tanggal ditandatangani.
          </p>
        </div>

        {/* Signatures */}
        <div className="mt-20 flex justify-between text-center text-sm px-10">
          <div className="w-48">
            <p className="mb-24"><strong>PIHAK PERTAMA</strong></p>
            <div className="border-b border-zinc-900"></div>
            <p className="mt-2 font-semibold">Manajemen Proyek</p>
          </div>
          <div className="w-48">
            <p className="mb-24"><strong>PIHAK KEDUA</strong></p>
            <div className="border-b border-zinc-900"></div>
            <p className="mt-2 font-semibold">{spk.contractorName}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
