"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  CheckCircle2,
  Circle,
  ArrowLeft,
  Camera,
  User,
  Calendar,
  Clock,
  AlertTriangle,
} from "lucide-react";
import {
  getProyekById,
  getUnitByProyek,
  getMilestoneByUnit,
  getUnitById,
  formatTanggalShort,
  statusMilestoneLabel,
  statusMilestoneColor,
  type Unit,
} from "@/lib/proyek-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MilestonePage({ params }: PageProps) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const unitIdFromQuery = searchParams.get("unit");

  const proyek = getProyekById(id);
  const units = getUnitByProyek(id);
  
  const [selectedUnitId, setSelectedUnitId] = useState<string>(
    unitIdFromQuery || units[0]?.id || ""
  );

  const selectedUnit = getUnitById(selectedUnitId);
  const milestones = getMilestoneByUnit(selectedUnitId);

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

  const milestoneSelesai = milestones.filter((m) => m.status === "selesai").length;
  const milestoneProgress = milestones.filter((m) => m.status === "progress").length;
  const milestoneBelum = milestones.filter((m) => m.status === "belum_mulai").length;

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
          <span className="text-slate-900 font-medium">Milestone</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href={`/proyek/${id}/unit`}>
              <Button variant="outline" size="icon" className="clean-glass">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Milestone Unit
              </h1>
              <p className="text-sm text-slate-600">{proyek.nama}</p>
            </div>
          </div>
        </div>

        {/* Unit Selector & Summary */}
        <Card className="clean-glass">
          <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Pilih Unit
                </label>
                <Select value={selectedUnitId} onValueChange={setSelectedUnitId}>
                  <SelectTrigger className="clean-glass">
                    <SelectValue placeholder="Pilih unit..." />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.nomorUnit} — {unit.tipe} ({unit.persentaseSelesai}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedUnit && (
                <div className="flex items-center gap-6 pt-6 sm:pt-0">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {milestoneSelesai}
                    </p>
                    <p className="text-xs text-slate-600">Selesai</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {milestoneProgress}
                    </p>
                    <p className="text-xs text-slate-600">Dikerjakan</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-400">
                      {milestoneBelum}
                    </p>
                    <p className="text-xs text-slate-600">Belum</p>
                  </div>
                </div>
              )}
            </div>

            {selectedUnit && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">
                    Progress Unit
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {selectedUnit.persentaseSelesai}%
                  </span>
                </div>
                <Progress value={selectedUnit.persentaseSelesai} className="h-2" />
              </div>
            )}
          </div>
        </Card>

        {/* Milestone Timeline */}
        {milestones.length > 0 ? (
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                isLast={index === milestones.length - 1}
              />
            ))}
          </div>
        ) : (
          <Card className="clean-glass p-8 text-center">
            <Circle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600">
              Belum ada data milestone untuk unit ini.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

interface MilestoneCardProps {
  milestone: {
    id: string;
    nama: string;
    status: "belum_mulai" | "progress" | "selesai";
    tanggalTarget: string;
    tanggalAktual?: string;
    persentase: number;
    fotoCount: number;
    engineerPIC?: string;
    catatan?: string;
  };
  isLast: boolean;
}

function MilestoneCard({ milestone, isLast }: MilestoneCardProps) {
  const isLate =
    milestone.status !== "selesai" &&
    new Date(milestone.tanggalTarget) < new Date();

  const completedLate =
    milestone.status === "selesai" &&
    milestone.tanggalAktual &&
    new Date(milestone.tanggalAktual) > new Date(milestone.tanggalTarget);

  return (
    <Card
      className={`clean-glass transition-all duration-200 ${
        milestone.status === "selesai"
          ? "border-green-200 bg-green-50/30"
          : milestone.status === "progress"
          ? "border-blue-200 bg-blue-50/30"
          : "border-slate-200"
      }`}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Icon & Connector */}
          <div className="flex flex-col items-center">
            {milestone.status === "selesai" ? (
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            ) : milestone.status === "progress" ? (
              <div className="p-2 bg-blue-100 rounded-full animate-pulse">
                <Circle className="w-5 h-5 text-blue-600 fill-blue-600" />
              </div>
            ) : (
              <div className="p-2 bg-slate-100 rounded-full">
                <Circle className="w-5 h-5 text-slate-400" />
              </div>
            )}
            {!isLast && (
              <div className="w-0.5 h-16 bg-slate-200 mt-2"></div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg text-slate-900">
                  {milestone.nama}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    className={`${
                      statusMilestoneColor[milestone.status]
                    } border text-xs font-medium rounded-md`}
                  >
                    {statusMilestoneLabel[milestone.status]}
                  </Badge>
                  {isLate && (
                    <Badge className="bg-red-100 text-red-700 border-red-200 border text-xs font-medium rounded-md">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Terlambat
                    </Badge>
                  )}
                  {completedLate && (
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200 border text-xs font-medium rounded-md">
                      <Clock className="w-3 h-3 mr-1" />
                      Selesai Terlambat
                    </Badge>
                  )}
                </div>
              </div>

              {milestone.status === "progress" && (
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    {milestone.persentase}%
                  </p>
                  <Progress
                    value={milestone.persentase}
                    className="w-24 h-2 mt-1"
                  />
                </div>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4" />
                <div>
                  <p className="text-xs text-slate-500">Target</p>
                  <p className="font-medium text-slate-900">
                    {formatTanggalShort(milestone.tanggalTarget)}
                  </p>
                </div>
              </div>

              {milestone.tanggalAktual && (
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <div>
                    <p className="text-xs text-slate-500">Selesai</p>
                    <p className="font-medium text-slate-900">
                      {formatTanggalShort(milestone.tanggalAktual)}
                    </p>
                  </div>
                </div>
              )}

              {milestone.engineerPIC && (
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="w-4 h-4" />
                  <div>
                    <p className="text-xs text-slate-500">PIC</p>
                    <p className="font-medium text-slate-900">
                      {milestone.engineerPIC}
                    </p>
                  </div>
                </div>
              )}

              {milestone.fotoCount > 0 && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Camera className="w-4 h-4" />
                  <div>
                    <p className="text-xs text-slate-500">Foto</p>
                    <p className="font-medium text-blue-600">
                      {milestone.fotoCount} foto
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Catatan */}
            {milestone.catatan && (
              <div className="pt-3 border-t border-slate-200/60">
                <p className="text-xs text-slate-500 mb-1">Catatan:</p>
                <p className="text-sm text-slate-700">{milestone.catatan}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
