"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  ChevronRight,
  AlertTriangle,
  ArrowLeft,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Calendar,
  Plus,
} from "lucide-react";
import {
  getProyekById,
  getKendalaByProyek,
  formatTanggalShort,
  statusKendalaLabel,
  statusKendalaColor,
  kategoriKendalaLabel,
  prioritasColor,
  type StatusKendala,
  type KategoriKendala,
} from "@/lib/proyek-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function KendalaPage({ params }: PageProps) {
  const { id } = use(params);
  const proyek = getProyekById(id);
  const allKendala = getKendalaByProyek(id);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterKategori, setFilterKategori] = useState<string>("all");

  if (!proyek) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="clean-glass p-8 text-center">
            <h2 className="text-xl font-semibold text-slate-900">
              Proyek Tidak Ditemukan
            </h2>
            <Link href="/proyek">
              <Button className="mt-4">Kembali</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  // Filter
  const filteredKendala = allKendala.filter((k) => {
    const matchSearch =
      k.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "all" || k.status === filterStatus;
    const matchKategori = filterKategori === "all" || k.kategori === filterKategori;
    return matchSearch && matchStatus && matchKategori;
  });

  // Summary
  const totalBaru = allKendala.filter((k) => k.status === "baru").length;
  const totalDitindak = allKendala.filter((k) => k.status === "ditindaklanjuti").length;
  const totalSelesai = allKendala.filter((k) => k.status === "selesai").length;
  const totalTinggi = allKendala.filter((k) => k.prioritas === "tinggi").length;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Link href="/proyek" className="hover:text-blue-600 transition-colors">
            Proyek
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            href={`/proyek/${id}/unit`}
            className="hover:text-blue-600 transition-colors"
          >
            {proyek.nama}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium">Laporan Kendala</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href={`/proyek/${id}/unit`}>
              <Button variant="outline" size="icon" className="clean-glass">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Laporan Kendala
              </h1>
              <p className="text-sm text-slate-600">{proyek.nama}</p>
            </div>
          </div>

          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" />
            Lapor Kendala
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="clean-glass">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">Baru</span>
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{totalBaru}</p>
            </div>
          </Card>

          <Card className="clean-glass">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">
                  Ditindaklanjuti
                </span>
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{totalDitindak}</p>
            </div>
          </Card>

          <Card className="clean-glass">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">Selesai</span>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{totalSelesai}</p>
            </div>
          </Card>

          <Card className="clean-glass">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">
                  Prioritas Tinggi
                </span>
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{totalTinggi}</p>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="clean-glass">
          <div className="p-4 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Cari kendala..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 clean-glass"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48 clean-glass">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="baru">Baru</SelectItem>
                <SelectItem value="ditindaklanjuti">Ditindaklanjuti</SelectItem>
                <SelectItem value="selesai">Selesai</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterKategori} onValueChange={setFilterKategori}>
              <SelectTrigger className="w-full sm:w-48 clean-glass">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="spek">Tidak Sesuai Spek</SelectItem>
                <SelectItem value="jadwal">Jadwal Molor</SelectItem>
                <SelectItem value="cuaca">Kendala Cuaca</SelectItem>
                <SelectItem value="material">Masalah Material</SelectItem>
                <SelectItem value="lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Kendala List */}
        <div className="space-y-4">
          {filteredKendala.length > 0 ? (
            filteredKendala.map((kendala) => (
              <Card
                key={kendala.id}
                className={`clean-glass transition-all duration-200 ${
                  kendala.status === "baru"
                    ? "border-l-4 border-l-red-500"
                    : kendala.status === "ditindaklanjuti"
                    ? "border-l-4 border-l-amber-500"
                    : "border-l-4 border-l-green-500"
                }`}
              >
                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg text-slate-900">
                          {kendala.judul}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {kendala.deskripsi}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Badge
                        className={`${
                          statusKendalaColor[kendala.status]
                        } border text-xs font-medium rounded-md`}
                      >
                        {statusKendalaLabel[kendala.status]}
                      </Badge>
                      <Badge
                        className={`${
                          prioritasColor[kendala.prioritas]
                        } text-xs font-medium rounded-md capitalize`}
                      >
                        {kendala.prioritas}
                      </Badge>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <div>
                        <p className="text-xs text-slate-500">Tanggal Lapor</p>
                        <p className="font-medium text-slate-900">
                          {formatTanggalShort(kendala.tanggalLapor)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <User className="w-4 h-4" />
                      <div>
                        <p className="text-xs text-slate-500">Dilaporkan Oleh</p>
                        <p className="font-medium text-slate-900">
                          {kendala.dilaporkanOleh}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <Filter className="w-4 h-4" />
                      <div>
                        <p className="text-xs text-slate-500">Kategori</p>
                        <p className="font-medium text-slate-900">
                          {kategoriKendalaLabel[kendala.kategori]}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tindak Lanjut Info */}
                  {kendala.ditindaklanjutiOleh && (
                    <div className="pt-3 border-t border-slate-200/60">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-amber-600" />
                        <span className="text-slate-600">
                          Ditindaklanjuti oleh:{" "}
                          <span className="font-medium text-slate-900">
                            {kendala.ditindaklanjutiOleh}
                          </span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Solusi */}
                  {kendala.solusi && (
                    <div className="pt-3 border-t border-slate-200/60">
                      <p className="text-xs text-slate-500 mb-1">Solusi:</p>
                      <p className="text-sm text-slate-700">{kendala.solusi}</p>
                      {kendala.tanggalSelesai && (
                        <p className="text-xs text-slate-500 mt-2">
                          Selesai: {formatTanggalShort(kendala.tanggalSelesai)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <Card className="clean-glass p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">Tidak ada kendala ditemukan.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
