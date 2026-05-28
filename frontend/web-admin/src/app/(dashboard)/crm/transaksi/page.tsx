"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Eye, Plus, CircleNotch
} from "@phosphor-icons/react";
import {
  skemaLabel,
  statusKPRLabel,
  statusKPRColor,
  formatRupiah,
  formatTanggal,
  type SkemaPembayaran,
  type StatusKPR,
} from "@/lib/crm-data";

type Transaksi = {
  id: string;
  namaPembeli: string;
  nomorUnit: string;
  skema: SkemaPembayaran;
  nilaiTransaksi: number;
  tandaJadi: number;
  statusKPR: StatusKPR;
  tanggalBooking: string;
  tanggalSPK?: string;
};

export default function TransaksiPage() {
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrx, setSelectedTrx] = useState<Transaksi | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const loginRes = await fetch("http://localhost:4000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "superadmin@erp.com", password: "password123" })
        });
        const loginData = await loginRes.json();

        if (loginData.token) {
          const res = await fetch("http://localhost:4000/api/sales/bookings", {
            headers: { "Authorization": `Bearer ${loginData.token}` }
          });
          const result = await res.json();

          if (result.data) {
            const mapped = result.data.map((b: any) => {
              let skema: SkemaPembayaran = "kpr";
              const rawPayment = (b.paymentMethod || "").toLowerCase();
              if (rawPayment.includes("tunai bertahap") || rawPayment.includes("cicil")) skema = "tunai-bertahap";
              else if (rawPayment.includes("tunai") || rawPayment.includes("cash")) skema = "tunai";
              
              let statusKpr: StatusKPR = "pengajuan";
              if (b.status === "Approved") statusKpr = "disetujui";
              else if (b.status === "Ditolak") statusKpr = "ditolak";
              else if (b.status === "Menunggu Verifikasi") statusKpr = "proses";

              return {
                id: b.id,
                namaPembeli: b.lead?.name || "Unknown",
                nomorUnit: b.unit ? `${b.unit.kawasan} ${b.unit.blok}/${b.unit.nomor}` : "-",
                skema: skema,
                nilaiTransaksi: b.unit?.totalPrice || 0,
                tandaJadi: b.bookingFee || 0,
                statusKPR: statusKpr,
                tanggalBooking: b.createdAt
              };
            });
            setTransaksiList(mapped);
          }
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleUpdateStatusKPR = (newStatus: StatusKPR) => {
    if (!selectedTrx) return;
    
    const updatedList = transaksiList.map(trx => 
      trx.id === selectedTrx.id ? { ...trx, statusKPR: newStatus } : trx
    );
    
    setTransaksiList(updatedList);
    setSelectedTrx({ ...selectedTrx, statusKPR: newStatus });
  };

  // Progress steps for KPR
  const kprSteps: StatusKPR[] = [
    "pengajuan",
    "proses",
    "disetujui",
    "akad",
  ];

  const getKPRProgress = (status: StatusKPR) => {
    const idx = kprSteps.indexOf(status);
    if (status === "ditolak") return 0;
    return idx >= 0 ? ((idx + 1) / kprSteps.length) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <CircleNotch className="w-10 h-10 text-blue-600 animate-spin" />
        <span className="ml-3 text-zinc-500 text-sm font-medium animate-pulse">Sinkronisasi data transaksi...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-zinc-900">CRM — Transaksi</h1>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 animate-pulse border border-blue-200">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5" /> LIVE SYNC
          </span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-zinc-500">
            {transaksiList.length} transaksi tercatat
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="h-10 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20 transition-all duration-200">
              <Plus weight="duotone" className="mr-2 h-4 w-4" />
              Booking Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white/95 backdrop-blur-md border-zinc-200/50 rounded-xl max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-[family-name:var(--font-heading)] text-lg font-semibold text-zinc-900">
                Form Booking Unit
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-zinc-700">Pilih Lead</Label>
                  <Select>
                    <SelectTrigger className="h-10 rounded-lg border-zinc-200/80 bg-white/60">
                      <SelectValue placeholder="Pilih calon pembeli" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L001">Budi Santoso</SelectItem>
                      <SelectItem value="L002">Siti Nurhaliza</SelectItem>
                      <SelectItem value="L003">Ahmad Fauzi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-zinc-700">Pilih Unit</Label>
                  <Select>
                    <SelectTrigger className="h-10 rounded-lg border-zinc-200/80 bg-white/60">
                      <SelectValue placeholder="Pilih unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="U002">A-02 (Tipe 36/60)</SelectItem>
                      <SelectItem value="U004">A-04 (Tipe 45/72)</SelectItem>
                      <SelectItem value="U006">B-01 (Tipe 36/60)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-zinc-700">Skema Pembayaran</Label>
                  <Select>
                    <SelectTrigger className="h-10 rounded-lg border-zinc-200/80 bg-white/60">
                      <SelectValue placeholder="Pilih skema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kpr">KPR</SelectItem>
                      <SelectItem value="tunai">Tunai</SelectItem>
                      <SelectItem value="tunai-bertahap">Tunai Bertahap</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-zinc-700">Tanda Jadi (Rp)</Label>
                  <Input className="h-10 rounded-lg border-zinc-200/80 bg-white/60" placeholder="5.000.000" type="text" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)} className="rounded-lg border-zinc-200/80">
                  Batal
                </Button>
                <Button onClick={() => setShowAddDialog(false)} className="rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20">
                  Proses Booking
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Transactions Table */}
      <Card className="bg-white/80 backdrop-blur-md border border-zinc-200/50 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-200/50 hover:bg-transparent">
                <TableHead className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">ID</TableHead>
                <TableHead className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Pembeli</TableHead>
                <TableHead className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Unit</TableHead>
                <TableHead className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Skema</TableHead>
                <TableHead className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Nilai</TableHead>
                <TableHead className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Progress</TableHead>
                <TableHead className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tanggal</TableHead>
                <TableHead className="text-xs font-semibold text-zinc-500 uppercase tracking-wider w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transaksiList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-sm text-zinc-400">
                    Tidak ada transaksi ditemukan.
                  </TableCell>
                </TableRow>
              ) : transaksiList.map((trx) => (
                <TableRow
                  key={trx.id}
                  className="border-zinc-200/30 hover:bg-white/60 cursor-pointer transition-colors duration-150"
                  onClick={() => setSelectedTrx(trx)}
                >
                  <TableCell className="text-xs font-mono text-zinc-500 truncate max-w-[100px]">{trx.id}</TableCell>
                  <TableCell>
                    <p className="text-sm font-medium text-zinc-900">{trx.namaPembeli}</p>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-zinc-700">{trx.nomorUnit}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className="text-xs bg-zinc-100 text-zinc-700 font-medium rounded-md border-0">
                      {skemaLabel[trx.skema] || trx.skema}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-zinc-900">
                    {formatRupiah(trx.nilaiTransaksi)}
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs font-medium rounded-md ${statusKPRColor[trx.statusKPR]} border-0`}>
                      {statusKPRLabel[trx.statusKPR] || trx.statusKPR}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="w-20">
                      <Progress
                        value={getKPRProgress(trx.statusKPR)}
                        className="h-1.5 bg-zinc-100 [&>div]:bg-blue-500"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-zinc-500">
                    {formatTanggal(trx.tanggalBooking)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg hover:bg-blue-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTrx(trx);
                      }}
                    >
                      <Eye weight="duotone" className="h-4 w-4 text-zinc-400" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Transaction Detail Dialog */}
      <Dialog open={!!selectedTrx} onOpenChange={() => setSelectedTrx(null)}>
        <DialogContent className="bg-white/95 backdrop-blur-md border-zinc-200/50 rounded-xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-[family-name:var(--font-heading)] text-lg font-semibold text-zinc-900">
              Detail Transaksi
            </DialogTitle>
          </DialogHeader>
          {selectedTrx && (
            <div className="space-y-4 mt-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">
                    {selectedTrx.namaPembeli}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {selectedTrx.id} · Unit {selectedTrx.nomorUnit}
                  </p>
                </div>
                <Select value={selectedTrx.statusKPR} onValueChange={(v) => handleUpdateStatusKPR(v as StatusKPR)}>
                  <SelectTrigger className={`h-8 w-[130px] border-0 focus:ring-0 shadow-none font-medium text-xs rounded-md ${statusKPRColor[selectedTrx.statusKPR]}`}>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pengajuan">Pengajuan</SelectItem>
                    <SelectItem value="proses">Proses</SelectItem>
                    <SelectItem value="disetujui">Disetujui</SelectItem>
                    <SelectItem value="akad">Akad</SelectItem>
                    <SelectItem value="ditolak">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* KPR Progress Stepper */}
              <div className="rounded-lg bg-zinc-50/80 border border-zinc-200/40 p-4">
                <p className="text-xs text-zinc-400 mb-3">Progress Status</p>
                <div className="flex items-center gap-1">
                  {kprSteps.map((step, i) => {
                    const currentIdx = kprSteps.indexOf(selectedTrx.statusKPR);
                    const isActive = i <= currentIdx;
                    const isDitolak = selectedTrx.statusKPR === "ditolak";
                    return (
                      <div key={step} className="flex items-center flex-1">
                        <div className="flex flex-col items-center flex-1">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                              isDitolak
                                ? "bg-rose-100 text-rose-500"
                                : isActive
                                ? "bg-blue-600 text-white shadow-sm"
                                : "bg-zinc-100 text-zinc-400"
                            }`}
                          >
                            {i + 1}
                          </div>
                          <span className="text-[10px] mt-1 text-zinc-500">
                            {statusKPRLabel[step]}
                          </span>
                        </div>
                        {i < kprSteps.length - 1 && (
                          <div className={`h-0.5 flex-1 -mt-4 ${isActive && i < currentIdx ? "bg-blue-400" : "bg-zinc-200"}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-lg bg-zinc-50/80 border border-zinc-200/40 p-4">
                <div>
                  <p className="text-xs text-zinc-400 mb-0.5">Skema</p>
                  <p className="text-sm font-medium text-zinc-700">
                    {skemaLabel[selectedTrx.skema] || selectedTrx.skema}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400 mb-0.5">Nilai Transaksi</p>
                  <p className="text-sm font-bold text-zinc-900">
                    {formatRupiah(selectedTrx.nilaiTransaksi)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400 mb-0.5">Tanda Jadi</p>
                  <p className="text-sm font-medium text-zinc-700">
                    {formatRupiah(selectedTrx.tandaJadi)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400 mb-0.5">Tanggal Booking</p>
                  <p className="text-sm font-medium text-zinc-700">
                    {formatTanggal(selectedTrx.tanggalBooking)}
                  </p>
                </div>
                {selectedTrx.tanggalSPK && (
                  <div className="col-span-2">
                    <p className="text-xs text-zinc-400 mb-0.5">Tanggal SPK</p>
                    <p className="text-sm font-medium text-zinc-700">
                      {formatTanggal(selectedTrx.tanggalSPK)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
