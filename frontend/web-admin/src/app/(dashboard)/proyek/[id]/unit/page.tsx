"use client";

import { use } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Buildings,
  House,
  CaretRight,
  WarningCircle,
  CheckCircle,
  Clock,
  ArrowLeft,
} from "@phosphor-icons/react";
import {
  getProyekById,
  getUnitByProyek,
  statusUnitColor,
  type Unit,
} from "@/lib/proyek-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function UnitProgressPage({ params }: PageProps) {
  const { id } = use(params);
  const proyek = getProyekById(id);
  const units = getUnitByProyek(id);

  if (!proyek) {
    return (
      <div className="space-y-6">
        <div className="">
          <Card className="clean-glass p-8 text-center">
            <WarningCircle weight="duotone" className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-zinc-900">
              Proyek Tidak Ditemukan
            </h2>
            <p className="text-zinc-600 mt-2">
              ID Proyek tidak valid atau sudah dihapus.
            </p>
            <Link href="/proyek">
              <Button className="mt-4">Kembali ke Daftar Proyek</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  // Group units by blok
  const unitsByBlok = units.reduce((acc, unit) => {
    if (!acc[unit.blok]) acc[unit.blok] = [];
    acc[unit.blok].push(unit);
    return acc;
  }, {} as Record<string, Unit[]>);

  const bloks = Object.keys(unitsByBlok).sort();

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-600">
          <Link
            href="/proyek"
            className="hover:text-blue-600 transition-colors"
          >
            Proyek
          </Link>
          <CaretRight weight="duotone" className="w-4 h-4" />
          <span className="text-zinc-900 font-medium">{proyek.nama}</span>
          <CaretRight weight="duotone" className="w-4 h-4" />
          <span className="text-zinc-900 font-medium">Unit</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/proyek">
              <Button variant="outline" size="icon" className="clean-glass">
                <ArrowLeft weight="duotone" className="w-4 h-4" />
              </Button>
            </Link>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Buildings weight="duotone" className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-zinc-900">
                {proyek.nama}
              </h1>
              <p className="text-sm text-zinc-600">
                Progress {proyek.unitSelesai} dari {proyek.totalUnit} unit
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="clean-glass">
            <div className="p-6 flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle weight="duotone" className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-zinc-600">Selesai (100%)</p>
                <p className="text-2xl font-bold text-zinc-900">
                  {units.filter((u) => u.persentaseSelesai === 100).length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="clean-glass">
            <div className="p-6 flex items-center gap-4">
              <div className="p-3 bg-amber-50 rounded-lg">
                <Clock weight="duotone" className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-zinc-600">Perlu Perhatian</p>
                <p className="text-2xl font-bold text-zinc-900">
                  {
                    units.filter(
                      (u) => u.status === "warning" || u.status === "terlambat"
                    ).length
                  }
                </p>
              </div>
            </div>
          </Card>

          <Card className="clean-glass">
            <div className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <House weight="duotone" className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-zinc-600">On Track</p>
                <p className="text-2xl font-bold text-zinc-900">
                  {units.filter((u) => u.status === "on_track").length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Units Grid by Blok */}
        <div className="space-y-6">
          {bloks.map((blok) => (
            <div key={blok}>
              <h2 className="text-lg font-semibold text-zinc-900 mb-3">
                Blok {blok}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {unitsByBlok[blok].map((unit) => (
                  <UnitCard key={unit.id} unit={unit} proyekId={id} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UnitCard({ unit, proyekId }: { unit: Unit; proyekId: string }) {
  const statusIcon = {
    on_track: CheckCircle,
    warning: Clock,
    terlambat: WarningCircle,
  };

  const statusText = {
    on_track: "On Track",
    warning: "Perlu Perhatian",
    terlambat: "Terlambat",
  };

  const statusIconColor = {
    on_track: "text-green-600",
    warning: "text-amber-600",
    terlambat: "text-red-600",
  };

  const Icon = statusIcon[unit.status];

  return (
    <Link href={`/proyek/${proyekId}/milestone?unit=${unit.id}`}>
      <Card
        className={`clean-glass hover:shadow-lg transition-all duration-200 cursor-pointer border-2 ${statusUnitColor[unit.status]} hover:scale-105`}
      >
        <div className="p-5 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <House weight="duotone" className="w-5 h-5 text-zinc-600" />
              <div>
                <h3 className="font-bold text-lg text-zinc-900">
                  {unit.nomorUnit}
                </h3>
                <p className="text-xs text-zinc-600">{unit.tipe}</p>
              </div>
            </div>
            <Icon weight="duotone" className={`w-5 h-5 ${statusIconColor[unit.status]}`} />
          </div>

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-zinc-600">
                Progress
              </span>
              <span className="text-sm font-bold text-zinc-900">
                {unit.persentaseSelesai}%
              </span>
            </div>
            <Progress value={unit.persentaseSelesai} className="h-2" />
          </div>

          {/* Milestone Count */}
          <div className="flex items-center justify-between text-xs text-zinc-600 pt-2 border-t border-zinc-200/60">
            <span>Milestone</span>
            <span className="font-semibold text-zinc-900">
              {unit.milestoneSelesai} / {unit.totalMilestone}
            </span>
          </div>

          {/* Status Badge */}
          <Badge
            className={`w-full justify-center text-xs font-medium ${
              unit.status === "on_track"
                ? "bg-green-100 text-green-700 border-green-200"
                : unit.status === "warning"
                ? "bg-amber-100 text-amber-700 border-amber-200"
                : "bg-red-100 text-red-700 border-red-200"
            } border`}
          >
            {statusText[unit.status]}
          </Badge>
        </div>
      </Card>
    </Link>
  );
}
