"use client";

import { useState, useEffect } from "react";
import BastModal from "./BastModal";

interface DefectData {
  status: string;
}

interface BastData {
  id: string;
  status: string;
  handoverDate: string;
}

interface InvoiceData {
  status: string;
}

interface BookingData {
  id: string;
  status: string;
  lead: { name: string };
  unit: { blok: string; nomor: string; progress: number; statusPembangunan: string };
  basts: BastData[];
  defects: DefectData[];
  invoices: InvoiceData[];
}

export default function BastPage() {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<{ id: string, name: string, unitName: string, bastId?: string, action: "schedule" | "complete" } | null>(null);

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
        headers: { Authorization: `Bearer ${token}` },
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.message || "Gagal mengambil data");

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

  if (loading) return <div className="p-8 text-center text-zinc-500 animate-pulse">Memuat data BAST...</div>;
  if (error) return <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl">{error}</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Serah Terima Kunci (BAST)</h1>
        <p className="text-zinc-500 mt-2 text-lg">Kelola jadwal serah terima unit dengan validasi ketat inspeksi bangunan.</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Unit & Konsumen</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Progres Bangunan</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Status Inspeksi / Defect</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Status BAST</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">Tidak ada data transaksi.</td>
                </tr>
              ) : (
                bookings.map((booking) => {
                  // Logic Progress
                  const is100Percent = booking.unit.progress === 100 || booking.unit.statusPembangunan === "Siap Huni";
                  
                  // Logic Defect Inspection
                  const activeDefects = booking.defects.filter(d => d.status !== "Selesai").length;
                  const hasActiveDefects = activeDefects > 0;
                  
                  // Logic BAST
                  const currentBast = booking.basts.length > 0 ? booking.basts[booking.basts.length - 1] : null;
                  const isBastScheduled = currentBast && currentBast.status === "Dijadwalkan";
                  const isBastCompleted = currentBast && currentBast.status === "Selesai";

                  // BAST Button Lock Logic (Strict Validation)
                  const isBastLocked = !is100Percent || hasActiveDefects;

                  return (
                    <tr key={booking.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-zinc-900 text-base">{booking.lead.name}</div>
                        <div className="text-zinc-500">Blok {booking.unit.blok} No. {booking.unit.nomor}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-zinc-700">{booking.unit.progress}%</span>
                          <span className="text-xs text-zinc-500 bg-zinc-100 px-2 rounded-md">{booking.unit.statusPembangunan}</span>
                        </div>
                        <div className="w-full bg-zinc-200 rounded-full h-2 overflow-hidden">
                          <div className={`h-2 rounded-full ${is100Percent ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${booking.unit.progress}%` }}></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {hasActiveDefects ? (
                          <div className="inline-flex flex-col items-start gap-1">
                            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                              Terkunci: Ada {activeDefects} Komplain Belum Selesai
                            </span>
                            <span className="text-xs text-red-500">*Selesaikan komplain sebelum BAST</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                            Aman (Tidak Ada Defect)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {!currentBast && <span className="text-zinc-500 font-medium">Belum Dijadwalkan</span>}
                        {isBastScheduled && (
                          <div className="text-amber-700 font-bold bg-amber-100 px-2 py-1 rounded-md inline-block text-xs">
                            Dijadwalkan: {new Date(currentBast.handoverDate).toLocaleDateString('id-ID')}
                          </div>
                        )}
                        {isBastCompleted && (
                          <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-1 rounded-md inline-block text-xs">
                            Selesai Diserahterimakan
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isBastCompleted ? (
                           <span className="text-zinc-400 text-sm">Selesai</span>
                        ) : isBastScheduled ? (
                           <button
                             disabled={isBastLocked}
                             onClick={() => setSelectedBooking({ id: booking.id, name: booking.lead.name, unitName: `Blok ${booking.unit.blok} No. ${booking.unit.nomor}`, bastId: currentBast.id, action: "complete" })}
                             className={`px-4 py-2 text-sm font-medium rounded-xl transition-all shadow-sm ${
                               isBastLocked ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' : 'bg-zinc-900 text-white hover:bg-zinc-800'
                             }`}
                           >
                             Selesaikan BAST
                           </button>
                        ) : (
                           <button
                             disabled={isBastLocked}
                             onClick={() => setSelectedBooking({ id: booking.id, name: booking.lead.name, unitName: `Blok ${booking.unit.blok} No. ${booking.unit.nomor}`, action: "schedule" })}
                             className={`px-4 py-2 text-sm font-medium rounded-xl transition-all shadow-sm ${
                               isBastLocked ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
                             }`}
                           >
                             Jadwalkan BAST
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

      {selectedBooking && (
        <BastModal
          bookingId={selectedBooking.id}
          bastId={selectedBooking.bastId}
          bookingName={selectedBooking.name}
          unitName={selectedBooking.unitName}
          action={selectedBooking.action}
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
