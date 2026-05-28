"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  MagnifyingGlass,
  Funnel,
  CheckCircle,
  XCircle,
  Clock,
  DownloadSimple,
  Upload,
  Eye,
  CircleNotch
} from "@phosphor-icons/react";
import {
  formatRupiah,
  formatTanggalShort,
  statusTagihanLabels,
  statusTagihanColors,
  tipeTagihanLabels,
  type StatusTagihan,
} from "@/lib/keuangan-data";

type Tagihan = {
  id: string;
  nomorTagihan: string;
  customerNama: string;
  unit: string;
  tipeTagihan: string;
  nominal: number;
  jatuhTempo: string;
  tanggalBayar?: string;
  status: StatusTagihan;
  cicilan?: {
    ke: number;
    dari: number;
  };
};

export default function TagihanPage() {
  const [tagihanList, setTagihanList] = useState<Tagihan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterTipe, setFilterTipe] = useState<string>("all");
  const [selectedTagihan, setSelectedTagihan] = useState<Tagihan | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        // Login to get token first
        const loginRes = await fetch("http://localhost:4000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "superadmin@erp.com", password: "password123" })
        });
        const loginData = await loginRes.json();
        
        if (loginData.token) {
          const res = await fetch("http://localhost:4000/api/billing/invoices", {
            headers: { "Authorization": `Bearer ${loginData.token}` }
          });
          const result = await res.json();
          
          if (result.data) {
            const mappedInvoices = result.data.map((inv: any) => {
              const customerNama = inv.booking?.lead?.name || "Unknown";
              const unitStr = inv.booking?.unit ? `${inv.booking.unit.kawasan} ${inv.booking.unit.blok}/${inv.booking.unit.nomor}` : "-";
              
              let mappedStatus: StatusTagihan = "belum_bayar";
              if (inv.status === "Paid") {
                mappedStatus = "lunas";
              } else if (new Date(inv.dueDate) < new Date()) {
                mappedStatus = "terlambat";
              }

              let mappedTipe = "angsuran";
              const rawTipe = (inv.invoiceType || "").toLowerCase();
              if (rawTipe.includes("dp")) mappedTipe = "dp";
              else if (rawTipe.includes("kpr") || rawTipe.includes("cicilan")) mappedTipe = "angsuran";
              else if (rawTipe.includes("ipl")) mappedTipe = "ipl";
              else if (rawTipe.includes("pelunasan")) mappedTipe = "pelunasan";

              let cicilanObj = undefined;
              if (inv.invoiceNumber && inv.invoiceNumber.includes("-T")) {
                const termStr = inv.invoiceNumber.split("-T")[1];
                if (termStr) {
                  cicilanObj = { ke: parseInt(termStr), dari: 12 }; // default 12 for dummy, we don't know total tenor
                }
              }

              return {
                id: inv.id,
                nomorTagihan: inv.invoiceNumber,
                customerNama,
                unit: unitStr,
                tipeTagihan: mappedTipe,
                nominal: inv.amountDue,
                jatuhTempo: inv.dueDate,
                status: mappedStatus,
                cicilan: cicilanObj
              };
            });
            setTagihanList(mappedInvoices);
          }
        }
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  // Funnel tagihan
  const filteredTagihan = tagihanList.filter((t) => {
    const matchSearch =
      t.customerNama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nomorTagihan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.unit.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    const matchTipe = filterTipe === "all" || t.tipeTagihan === filterTipe;

    return matchSearch && matchStatus && matchTipe;
  });

  const getTotalByStatusLocal = (list: Tagihan[], st: StatusTagihan) => {
    return list.filter(t => t.status === st).reduce((sum, t) => sum + t.nominal, 0);
  };

  // Calculate summary
  const totalBelumBayar = getTotalByStatusLocal(tagihanList, "belum_bayar");
  const totalTerlambat = getTotalByStatusLocal(tagihanList, "terlambat");
  const totalLunas = getTotalByStatusLocal(tagihanList, "lunas");
  const jumlahTerlambat = tagihanList.filter(
    (t) => t.status === "terlambat"
  ).length;

  const openDetail = (tagihan: Tagihan) => {
    setSelectedTagihan(tagihan);
    setDetailDialogOpen(true);
  };

  const handleKonfirmasiPembayaran = () => {
    if (!selectedTagihan) return;
    
    const today = new Date().toISOString().split('T')[0];
    const updatedList = tagihanList.map(t => 
      t.id === selectedTagihan.id ? { ...t, status: "lunas" as StatusTagihan, tanggalBayar: today } : t
    );
    
    setTagihanList(updatedList);
    setSelectedTagihan({ ...selectedTagihan, status: "lunas", tanggalBayar: today });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <CircleNotch className="w-10 h-10 text-green-600 animate-spin" />
        <span className="ml-3 text-zinc-500 text-sm font-medium animate-pulse">Menyinkronkan data tagihan...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <FileText weight="duotone" className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold text-zinc-900">
                  Tagihan & Piutang
                </h1>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 animate-pulse border border-green-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" /> LIVE SYNC
                </span>
              </div>
              <p className="text-sm text-zinc-600">
                Kelola tagihan pembeli & konfirmasi pembayaran
              </p>
            </div>
          </div>

          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <DownloadSimple weight="duotone" className="w-4 h-4 mr-2" />
            Export Laporan
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="clean-glass">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-zinc-600">
                  Belum Bayar
                </span>
                <Clock weight="duotone" className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-zinc-900">
                {formatRupiah(totalBelumBayar)}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                {tagihanList.filter((t) => t.status === "belum_bayar").length}{" "}
                tagihan aktif
              </p>
            </div>
          </Card>

          <Card className="clean-glass">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-zinc-600">
                  Terlambat
                </span>
                <XCircle weight="duotone" className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-700">
                {formatRupiah(totalTerlambat)}
              </p>
              <p className="text-xs text-red-600 mt-1">
                {jumlahTerlambat} tagihan lewat jatuh tempo
              </p>
            </div>
          </Card>

          <Card className="clean-glass">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-zinc-600">
                  Lunas
                </span>
                <CheckCircle weight="duotone" className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-zinc-900">
                {formatRupiah(totalLunas)}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {tagihanList.filter((t) => t.status === "lunas").length} pembayaran
              </p>
            </div>
          </Card>

          <Card className="clean-glass">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-zinc-600">
                  Total Piutang
                </span>
                <FileText weight="duotone" className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-zinc-900">
                {formatRupiah(totalBelumBayar + totalTerlambat)}
              </p>
              <p className="text-xs text-zinc-500 mt-1">Semua tagihan aktif & terlambat</p>
            </div>
          </Card>
        </div>

        {/* Filters & MagnifyingGlass */}
        <Card className="clean-glass">
          <div className="p-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <MagnifyingGlass weight="duotone" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  placeholder="Cari nama customer, nomor tagihan, atau unit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 clean-glass"
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48 clean-glass">
                  <Funnel weight="duotone" className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="belum_bayar">Belum Bayar</SelectItem>
                  <SelectItem value="lunas">Lunas</SelectItem>
                  <SelectItem value="terlambat">Terlambat</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterTipe} onValueChange={setFilterTipe}>
                <SelectTrigger className="w-full md:w-48 clean-glass">
                  <FileText weight="duotone" className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="dp">DP</SelectItem>
                  <SelectItem value="angsuran">Angsuran</SelectItem>
                  <SelectItem value="pelunasan">Pelunasan</SelectItem>
                  <SelectItem value="ipl">IPL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <p className="text-sm text-zinc-600">
              Menampilkan {filteredTagihan.length} dari {tagihanList.length}{" "}
              tagihan
            </p>
          </div>
        </Card>

        {/* Tagihan Table */}
        <Card className="clean-glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50/50 border-b border-zinc-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700">
                    Nomor Tagihan
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700">
                    Unit
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700">
                    Tipe
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-700">
                    Nominal
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700">
                    Jatuh Tempo
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700">
                    Status
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-zinc-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filteredTagihan.map((tagihan) => (
                  <tr
                    key={tagihan.id}
                    className="hover:bg-zinc-50/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="text-sm font-medium text-zinc-900">
                        {tagihan.nomorTagihan}
                      </div>
                      {tagihan.cicilan && (
                        <div className="text-xs text-zinc-500">
                          Cicilan {tagihan.cicilan.ke}/{tagihan.cicilan.dari}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-zinc-900">
                      {tagihan.customerNama}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="font-mono">
                        {tagihan.unit}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">
                        {tipeTagihanLabels[tagihan.tipeTagihan as keyof typeof tipeTagihanLabels] || tagihan.tipeTagihan}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-zinc-900">
                      {formatRupiah(tagihan.nominal)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-zinc-900">
                        {formatTanggalShort(tagihan.jatuhTempo)}
                      </div>
                      {tagihan.tanggalBayar && (
                        <div className="text-xs text-green-600">
                          Dibayar: {formatTanggalShort(tagihan.tanggalBayar)}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={statusTagihanColors[tagihan.status]}
                      >
                        {statusTagihanLabels[tagihan.status]}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDetail(tagihan)}
                      >
                        <Eye weight="duotone" className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTagihan.length === 0 && (
            <div className="p-12 text-center">
              <FileText weight="duotone" className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-zinc-600">Tidak ada tagihan ditemukan</p>
            </div>
          )}
        </Card>

        {/* Detail Dialog */}
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="max-w-2xl clean-glass">
            <DialogHeader>
              <DialogTitle>Detail Tagihan</DialogTitle>
              <DialogDescription>
                Informasi lengkap tagihan & konfirmasi pembayaran
              </DialogDescription>
            </DialogHeader>

            {selectedTagihan && (
              <div className="space-y-6">
                {/* Tagihan Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-zinc-600">
                      Nomor Tagihan
                    </label>
                    <p className="font-semibold text-zinc-900">
                      {selectedTagihan.nomorTagihan}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-zinc-600">Status</label>
                    <div className="mt-1">
                      <Badge
                        variant="outline"
                        className={statusTagihanColors[selectedTagihan.status]}
                      >
                        {statusTagihanLabels[selectedTagihan.status]}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-zinc-600">Customer</label>
                    <p className="font-semibold text-zinc-900">
                      {selectedTagihan.customerNama}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-zinc-600">Unit</label>
                    <p className="font-semibold text-zinc-900">
                      {selectedTagihan.unit}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-zinc-600">Tipe Tagihan</label>
                    <p className="font-semibold text-zinc-900">
                      {tipeTagihanLabels[selectedTagihan.tipeTagihan as keyof typeof tipeTagihanLabels] || selectedTagihan.tipeTagihan}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-zinc-600">Nominal</label>
                    <p className="text-xl font-bold text-blue-600">
                      {formatRupiah(selectedTagihan.nominal)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-zinc-600">Jatuh Tempo</label>
                    <p className="font-semibold text-zinc-900">
                      {formatTanggalShort(selectedTagihan.jatuhTempo)}
                    </p>
                  </div>
                  {selectedTagihan.tanggalBayar && (
                    <div>
                      <label className="text-sm text-zinc-600">
                        Tanggal Bayar
                      </label>
                      <p className="font-semibold text-green-700">
                        {formatTanggalShort(selectedTagihan.tanggalBayar)}
                      </p>
                    </div>
                  )}
                  {selectedTagihan.cicilan && (
                    <div className="col-span-2">
                      <label className="text-sm text-zinc-600">
                        Progress Cicilan
                      </label>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>
                            Cicilan ke-{selectedTagihan.cicilan.ke} dari{" "}
                            {selectedTagihan.cicilan.dari}
                          </span>
                          <span className="font-semibold">
                            {(
                              (selectedTagihan.cicilan.ke /
                                selectedTagihan.cicilan.dari) *
                              100
                            ).toFixed(0)}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-zinc-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${
                                (selectedTagihan.cicilan.ke /
                                  selectedTagihan.cicilan.dari) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {selectedTagihan.status === "belum_bayar" ||
                selectedTagihan.status === "terlambat" ? (
                  <div className="space-y-3 pt-4 border-t border-zinc-200">
                    <label className="text-sm font-medium text-zinc-700">
                      Upload Bukti Pembayaran
                    </label>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1 clean-glass">
                        <Upload weight="duotone" className="w-4 h-4 mr-2" />
                        Upload Bukti
                      </Button>
                      <Button
                        onClick={handleKonfirmasiPembayaran}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle weight="duotone" className="w-4 h-4 mr-2" />
                        Konfirmasi Lunas
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle weight="duotone" className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-900">
                          Tagihan Sudah Lunas
                        </p>
                        <p className="text-sm text-green-700">
                          Dibayar pada{" "}
                          {selectedTagihan.tanggalBayar &&
                            formatTanggalShort(selectedTagihan.tanggalBayar)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
