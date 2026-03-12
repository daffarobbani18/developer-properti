"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  Plus,
  AlertTriangle,
} from "lucide-react";
import {
  dummyProyek,
  formatRupiah,
  formatTanggalShort,
  statusProyekLabel,
  statusProyekColor,
  type Proyek,
} from "@/lib/proyek-data";

export default function ProyekPage() {
  const proyekAktif = dummyProyek.filter(
    (p) => p.statusProyek === "konstruksi" || p.statusProyek === "finishing"
  );
  const totalUnit = dummyProyek.reduce((sum, p) => sum + p.totalUnit, 0);
  const unitSelesai = dummyProyek.reduce((sum, p) => sum + p.unitSelesai, 0);
  const persentaseGlobal = (unitSelesai / totalUnit) * 100;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Monitoring Proyek
              </h1>
              <p className="text-sm text-slate-600">
                Pantau progres konstruksi & milestone setiap unit
              </p>
            </div>
          </div>

          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Proyek
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="clean-glass">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">
                  Total Proyek
                </span>
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {dummyProyek.length}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {proyekAktif.length} sedang berjalan
              </p>
            </div>
          </Card>

          <Card className="clean-glass">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">
                  Total Unit
                </span>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{totalUnit}</p>
              <p className="text-xs text-slate-500 mt-1">
                {unitSelesai} unit selesai
              </p>
            </div>
          </Card>

          <Card className="clean-glass">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">
                  Progress Global
                </span>
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {persentaseGlobal.toFixed(0)}%
              </p>
              <Progress value={persentaseGlobal} className="mt-2" />
            </div>
          </Card>

          <Card className="clean-glass">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">
                  Site Engineer
                </span>
                <Users className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">12</p>
              <p className="text-xs text-slate-500 mt-1">Aktif di lapangan</p>
            </div>
          </Card>
        </div>

        {/* Proyek List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dummyProyek.map((proyek) => (
            <ProyekCard key={proyek.id} proyek={proyek} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProyekCard({ proyek }: { proyek: Proyek }) {
  const isDelayed = proyek.persentaseSelesai < 50 && proyek.statusProyek === "konstruksi";

  return (
    <Link href={`/proyek/${proyek.id}/unit`}>
      <Card className="clean-glass hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-blue-300">
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg text-slate-900">
                  {proyek.nama}
                </h3>
                {isDelayed && (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                <MapPin className="w-4 h-4" />
                <span>{proyek.lokasi}</span>
              </div>
            </div>
            <Badge
              className={`${
                statusProyekColor[proyek.statusProyek]
              } border font-medium text-xs rounded-md px-2 py-1`}
            >
              {statusProyekLabel[proyek.statusProyek]}
            </Badge>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">
                {proyek.totalUnit}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Total Unit</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {proyek.unitSelesai}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Selesai</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {proyek.jumlahKontraktor}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Kontraktor</p>
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">
                Progress Keseluruhan
              </span>
              <span className="text-sm font-bold text-slate-900">
                {proyek.persentaseSelesai}%
              </span>
            </div>
            <Progress
              value={proyek.persentaseSelesai}
              className="h-2"
            />
          </div>

          {/* Dates */}
          <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-200/60">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Mulai: {formatTanggalShort(proyek.tanggalMulai)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Target: {formatTanggalShort(proyek.targetSelesai)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-slate-200/60">
            <div className="text-xs text-slate-500">
              Nilai Kontrak:{" "}
              <span className="font-semibold text-slate-700">
                {formatRupiah(proyek.nilaiKontrak)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
