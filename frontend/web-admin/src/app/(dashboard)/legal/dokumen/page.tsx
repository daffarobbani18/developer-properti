"use client";

import { useState, useEffect } from "react";
import DocumentModal from "./DocumentModal";

interface LegalDocument {
  id: string;
  documentType: string;
  status: string;
  fileUrl?: string;
}

interface BookingData {
  id: string;
  status: string;
  paymentMethod: string;
  lead: { name: string };
  unit: { blok: string; nomor: string; kawasan: string };
  legalDocuments: LegalDocument[];
}

export default function LegalDokumenPage() {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
        let token = "";
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          token = authData.token;
        }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/legal/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || "Gagal mengambil data");
      }

      setBookings(resData.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getDocStatus = (docs: LegalDocument[], type: string) => {
    const doc = docs.find(d => d.documentType === type);
    if (!doc) return { status: "Belum Ada", color: "bg-zinc-100 text-zinc-500", url: null };
    if (doc.status === "Selesai") return { status: "Selesai", color: "bg-emerald-100 text-emerald-700", url: doc.fileUrl };
    return { status: "Diproses", color: "bg-amber-100 text-amber-700", url: doc.fileUrl };
  };

  if (loading) return <div className="p-8 text-center text-zinc-500 animate-pulse">Memuat data dokumen legal...</div>;
  if (error) return <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl">{error}</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Dokumen Legal & Sertifikasi</h1>
        <p className="text-zinc-500 mt-2 text-lg">Pantau dan kelola progres dokumen kepemilikan konsumen (SP3K, PPJB, AJB, SHM).</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Konsumen & Unit</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-center">SP3K / KPR</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-center">PPJB</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-center">AJB</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-center">SHM</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">Tidak ada data transaksi.</td>
                </tr>
              ) : (
                bookings.map((booking) => {
                  const sp3k = getDocStatus(booking.legalDocuments, "SP3K");
                  const ppjb = getDocStatus(booking.legalDocuments, "PPJB");
                  const ajb = getDocStatus(booking.legalDocuments, "AJB");
                  const shm = getDocStatus(booking.legalDocuments, "SHM");

                  return (
                    <tr key={booking.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-zinc-900 text-base">{booking.lead.name}</div>
                        <div className="text-zinc-500">Blok {booking.unit.blok} No. {booking.unit.nomor}</div>
                        <div className="text-xs font-medium text-indigo-600 mt-1 bg-indigo-50 inline-block px-2 py-0.5 rounded-md border border-indigo-100">{booking.paymentMethod}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${sp3k.color}`}>
                          {sp3k.status}
                        </span>
                        {sp3k.url && <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}${sp3k.url}`} target="_blank" className="block mt-1 text-xs text-blue-600 hover:underline">Lihat File</a>}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${ppjb.color}`}>
                          {ppjb.status}
                        </span>
                        {ppjb.url && <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}${ppjb.url}`} target="_blank" className="block mt-1 text-xs text-blue-600 hover:underline">Lihat File</a>}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${ajb.color}`}>
                          {ajb.status}
                        </span>
                        {ajb.url && <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}${ajb.url}`} target="_blank" className="block mt-1 text-xs text-blue-600 hover:underline">Lihat File</a>}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${shm.color}`}>
                          {shm.status}
                        </span>
                        {shm.url && <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}${shm.url}`} target="_blank" className="block mt-1 text-xs text-blue-600 hover:underline">Lihat File</a>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="px-4 py-2 text-sm font-medium rounded-xl transition-all bg-zinc-900 text-white hover:bg-zinc-800 active:scale-95 shadow-sm"
                        >
                          Kelola Dokumen
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBooking && (
        <DocumentModal
          bookingId={selectedBooking.id}
          bookingName={selectedBooking.lead.name}
          unitName={`Blok ${selectedBooking.unit.blok} No. ${selectedBooking.unit.nomor}`}
          onClose={() => setSelectedBooking(null)}
          onSuccess={() => {
            setSelectedBooking(null);
            fetchBookings();
          }}
        />
      )}
    </div>
  );
}
