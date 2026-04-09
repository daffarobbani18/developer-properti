"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Label } from "@/components/ui/label";
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  TrendingDown,
  FileText,
} from "lucide-react";
import {
  dummyPengeluaran,
  formatRupiah,
  formatTanggalShort,
  kategoriPengeluaranLabels,
  kategoriPengeluaranColors,
  getTotalByKategori,
  type Pengeluaran,
  type KategoriPengeluaran,
} from "@/lib/keuangan-data";

export default function PengeluaranPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterKategori, setFilterKategori] = useState<string>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Filter pengeluaran
  const filteredPengeluaran = dummyPengeluaran.filter((p) => {
    const matchSearch =
      p.keterangan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nomorBukti.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.vendor?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchKategori =
      filterKategori === "all" || p.kategori === filterKategori;

    return matchSearch && matchKategori;
  });

  // Calculate summary
  const totalPengeluaran = dummyPengeluaran.reduce(
    (sum, p) => sum + p.nominal,
    0
  );
  const totalMaterial = getTotalByKategori(dummyPengeluaran, "material");
  const totalKontraktor = getTotalByKategori(dummyPengeluaran, "kontraktor");
  const totalOperasional = getTotalByKategori(dummyPengeluaran, "operasional");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Pengeluaran berhasil ditambahkan! (Demo)");
    setAddDialogOpen(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <Receipt className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Pengeluaran
              </h1>
              <p className="text-sm text-slate-600">
                Catat & kelola semua pengeluaran operasional
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="clean-glass">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={() => setAddDialogOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="clean-glass">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">
                  Total Pengeluaran
                </span>
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formatRupiah(totalPengeluaran)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {dummyPengeluaran.length} transaksi bulan ini
              </p>
            </div>
          </Card>

          <Card className="clean-glass">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">
                  Material
                </span>
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-amber-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formatRupiah(totalMaterial)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {((totalMaterial / totalPengeluaran) * 100).toFixed(1)}% dari total
              </p>
            </div>
          </Card>

          <Card className="clean-glass">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">
                  Kontraktor
                </span>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formatRupiah(totalKontraktor)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {((totalKontraktor / totalPengeluaran) * 100).toFixed(1)}% dari total
              </p>
            </div>
          </Card>

          <Card className="clean-glass">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">
                  Operasional
                </span>
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-slate-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formatRupiah(totalOperasional)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {((totalOperasional / totalPengeluaran) * 100).toFixed(1)}% dari total
              </p>
            </div>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card className="clean-glass">
          <div className="p-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Cari keterangan, vendor, atau nomor bukti..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 clean-glass"
                />
              </div>

              <Select
                value={filterKategori}
                onValueChange={setFilterKategori}
              >
                <SelectTrigger className="w-full md:w-56 clean-glass">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  <SelectItem value="material">Material</SelectItem>
                  <SelectItem value="kontraktor">Kontraktor</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="perizinan">Perizinan</SelectItem>
                  <SelectItem value="operasional">Operasional</SelectItem>
                  <SelectItem value="lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <p className="text-sm text-slate-600">
              Menampilkan {filteredPengeluaran.length} dari{" "}
              {dummyPengeluaran.length} pengeluaran
            </p>
          </div>
        </Card>

        {/* Pengeluaran Table */}
        <Card className="clean-glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                    Tanggal
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                    Nomor Bukti
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                    Kategori
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                    Keterangan
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                    Vendor
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                    Nominal
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                    Disetujui
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredPengeluaran.map((pengeluaran) => (
                  <tr
                    key={pengeluaran.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-slate-900">
                      {formatTanggalShort(pengeluaran.tanggal)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-medium text-slate-900">
                        {pengeluaran.nomorBukti}
                      </div>
                      {pengeluaran.bukti && (
                        <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                          <FileText className="w-3 h-3" />
                          Ada bukti
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={
                          kategoriPengeluaranColors[pengeluaran.kategori]
                        }
                      >
                        {kategoriPengeluaranLabels[pengeluaran.kategori]}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-900 max-w-xs truncate">
                      {pengeluaran.keterangan}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {pengeluaran.vendor || "-"}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-red-700">
                      {formatRupiah(pengeluaran.nominal)}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {pengeluaran.disetujuiOleh || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-slate-300 bg-slate-50/50">
                <tr>
                  <td
                    colSpan={5}
                    className="py-3 px-4 text-sm font-bold text-slate-900"
                  >
                    Total
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-bold text-red-700">
                    {formatRupiah(
                      filteredPengeluaran.reduce((sum, p) => sum + p.nominal, 0)
                    )}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {filteredPengeluaran.length === 0 && (
            <div className="p-12 text-center">
              <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">Tidak ada pengeluaran ditemukan</p>
            </div>
          )}
        </Card>

        {/* Add Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="max-w-2xl clean-glass">
            <DialogHeader>
              <DialogTitle>Tambah Pengeluaran</DialogTitle>
              <DialogDescription>
                Catat pengeluaran baru dengan lengkap
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tanggal">Tanggal</Label>
                  <Input
                    id="tanggal"
                    type="date"
                    required
                    className="clean-glass"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nomorBukti">Nomor Bukti</Label>
                  <Input
                    id="nomorBukti"
                    placeholder="KKL/2024/01/008"
                    required
                    className="clean-glass"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kategori">Kategori</Label>
                  <Select required>
                    <SelectTrigger id="kategori" className="clean-glass">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="material">Material</SelectItem>
                      <SelectItem value="kontraktor">Kontraktor</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="perizinan">Perizinan</SelectItem>
                      <SelectItem value="operasional">Operasional</SelectItem>
                      <SelectItem value="lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nominal">Nominal</Label>
                  <Input
                    id="nominal"
                    type="number"
                    placeholder="100000000"
                    required
                    className="clean-glass"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="vendor">Vendor / Penerima (Opsional)</Label>
                  <Input
                    id="vendor"
                    placeholder="Nama vendor atau penerima"
                    className="clean-glass"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="keterangan">Keterangan</Label>
                  <Textarea
                    id="keterangan"
                    placeholder="Deskripsi lengkap pengeluaran..."
                    rows={3}
                    required
                    className="clean-glass"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="bukti">Upload Bukti (Opsional)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="bukti"
                      type="file"
                      accept="image/*,.pdf"
                      className="clean-glass flex-1"
                    />
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500">
                    Format: JPG, PNG, PDF (Max 5MB)
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddDialogOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Simpan Pengeluaran
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
