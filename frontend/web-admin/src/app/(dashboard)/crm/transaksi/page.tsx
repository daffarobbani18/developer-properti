"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  Plus,
  Eye,
  CreditCard,
  FileText,
  ArrowRight,
} from "lucide-react";
import {
  dummyTransaksi,
  skemaLabel,
  statusKPRLabel,
  statusKPRColor,
  formatRupiah,
  formatTanggal,
  type Transaksi,
  type SkemaPembayaran,
  type StatusKPR,
} from "@/lib/crm-data";

export default function TransaksiPage() {
  const [selectedTrx, setSelectedTrx] = useState<Transaksi | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

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

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">CRM — Transaksi</h1>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-slate-500">
            {dummyTransaksi.length} transaksi tercatat
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="h-10 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20 transition-all duration-200">
              <Plus className="mr-2 h-4 w-4" />
              Booking Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white/95 backdrop-blur-md border-slate-200/50 rounded-xl max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-[family-name:var(--font-heading)] text-lg font-semibold text-slate-900">
                Form Booking Unit
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-slate-700">Pilih Lead</Label>
                  <Select>
                    <SelectTrigger className="h-10 rounded-lg border-slate-200/80 bg-white/60">
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
                  <Label className="text-sm text-slate-700">Pilih Unit</Label>
                  <Select>
                    <SelectTrigger className="h-10 rounded-lg border-slate-200/80 bg-white/60">
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
                  <Label className="text-sm text-slate-700">Skema Pembayaran</Label>
                  <Select>
                    <SelectTrigger className="h-10 rounded-lg border-slate-200/80 bg-white/60">
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
                  <Label className="text-sm text-slate-700">Tanda Jadi (Rp)</Label>
                  <Input className="h-10 rounded-lg border-slate-200/80 bg-white/60" placeholder="5.000.000" type="text" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)} className="rounded-lg border-slate-200/80">
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
      <Card className="bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200/50 hover:bg-transparent">
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pembeli</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unit</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Skema</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nilai</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status KPR</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Progress</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyTransaksi.map((trx) => (
                <TableRow
                  key={trx.id}
                  className="border-slate-200/30 hover:bg-white/60 cursor-pointer transition-colors duration-150"
                  onClick={() => setSelectedTrx(trx)}
                >
                  <TableCell className="text-xs font-mono text-slate-500">{trx.id}</TableCell>
                  <TableCell>
                    <p className="text-sm font-medium text-slate-900">{trx.namaPembeli}</p>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-700">{trx.nomorUnit}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className="text-xs bg-slate-100 text-slate-700 font-medium rounded-md border-0">
                      {skemaLabel[trx.skema]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-900">
                    {formatRupiah(trx.nilaiTransaksi)}
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs font-medium rounded-md ${statusKPRColor[trx.statusKPR]} border-0`}>
                      {statusKPRLabel[trx.statusKPR]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="w-20">
                      <Progress
                        value={getKPRProgress(trx.statusKPR)}
                        className="h-1.5 bg-slate-100 [&>div]:bg-blue-500"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
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
                      <Eye className="h-4 w-4 text-slate-400" />
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
        <DialogContent className="bg-white/95 backdrop-blur-md border-slate-200/50 rounded-xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-[family-name:var(--font-heading)] text-lg font-semibold text-slate-900">
              Detail Transaksi
            </DialogTitle>
          </DialogHeader>
          {selectedTrx && (
            <div className="space-y-4 mt-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {selectedTrx.namaPembeli}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedTrx.id} · Unit {selectedTrx.nomorUnit}
                  </p>
                </div>
                <Badge className={`text-xs font-medium rounded-md ${statusKPRColor[selectedTrx.statusKPR]} border-0`}>
                  {statusKPRLabel[selectedTrx.statusKPR]}
                </Badge>
              </div>

              {/* KPR Progress Stepper */}
              <div className="rounded-lg bg-slate-50/80 border border-slate-200/40 p-4">
                <p className="text-xs text-slate-400 mb-3">Progress KPR</p>
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
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {i + 1}
                          </div>
                          <span className="text-[10px] mt-1 text-slate-500">
                            {statusKPRLabel[step]}
                          </span>
                        </div>
                        {i < kprSteps.length - 1 && (
                          <div className={`h-0.5 flex-1 -mt-4 ${isActive && i < currentIdx ? "bg-blue-400" : "bg-slate-200"}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50/80 border border-slate-200/40 p-4">
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Skema</p>
                  <p className="text-sm font-medium text-slate-700">
                    {skemaLabel[selectedTrx.skema]}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Nilai Transaksi</p>
                  <p className="text-sm font-bold text-slate-900">
                    {formatRupiah(selectedTrx.nilaiTransaksi)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Tanda Jadi</p>
                  <p className="text-sm font-medium text-slate-700">
                    {formatRupiah(selectedTrx.tandaJadi)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Tanggal Booking</p>
                  <p className="text-sm font-medium text-slate-700">
                    {formatTanggal(selectedTrx.tanggalBooking)}
                  </p>
                </div>
                {selectedTrx.tanggalSPK && (
                  <div className="col-span-2">
                    <p className="text-xs text-slate-400 mb-0.5">Tanggal SPK</p>
                    <p className="text-sm font-medium text-slate-700">
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
