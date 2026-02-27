"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Download,
  FileText,
} from "lucide-react";
import {
  dummyRAB,
  formatRupiah,
  kategoriPengeluaranLabels,
  kategoriPengeluaranColors,
  type RABItem,
} from "@/lib/keuangan-data";

export default function RABPage() {
  const [selectedTab, setSelectedTab] = useState<"all" | "warning" | "safe">(
    "all"
  );

  // Calculate totals
  const totalAnggaran = dummyRAB.reduce((sum, item) => sum + item.anggaran, 0);
  const totalRealisasi = dummyRAB.reduce((sum, item) => sum + item.realisasi, 0);
  const persentaseGlobal = (totalRealisasi / totalAnggaran) * 100;
  const sisaAnggaran = totalAnggaran - totalRealisasi;

  // Filter by status
  const filteredRAB = dummyRAB.filter((item) => {
    if (selectedTab === "warning") return item.persentase >= 80;
    if (selectedTab === "safe") return item.persentase < 80;
    return true;
  });

  const warningCount = dummyRAB.filter((item) => item.persentase >= 80).length;

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-700 bg-red-50 border-red-200";
    if (percentage >= 80) return "text-amber-700 bg-amber-50 border-amber-200";
    if (percentage >= 60) return "text-blue-700 bg-blue-50 border-blue-200";
    return "text-green-700 bg-green-50 border-green-200";
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 80)
      return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    return <CheckCircle2 className="w-4 h-4 text-green-600" />;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-600";
    if (percentage >= 80) return "bg-amber-600";
    if (percentage >= 60) return "bg-blue-600";
    return "bg-green-600";
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                RAB & Realisasi
              </h1>
              <p className="text-sm text-slate-600">
                Pantau anggaran vs realisasi biaya per pos
              </p>
            </div>
          </div>

          <Button variant="outline" size="sm" className="clean-glass">
            <Download className="w-4 h-4 mr-2" />
            Export Laporan
          </Button>
        </div>

        {/* Global Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="clean-glass">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">
                  Total Anggaran (RAB)
                </span>
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formatRupiah(totalAnggaran)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {dummyRAB.length} pos anggaran
              </p>
            </div>
          </Card>

          <Card className="clean-glass">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">
                  Total Realisasi
                </span>
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formatRupiah(totalRealisasi)}
              </p>
              <p className="text-xs text-purple-600 mt-1">
                {persentaseGlobal.toFixed(1)}% dari RAB
              </p>
            </div>
          </Card>

          <Card className="clean-glass">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">
                  Sisa Anggaran
                </span>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formatRupiah(sisaAnggaran)}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {(100 - persentaseGlobal).toFixed(1)}% tersedia
              </p>
            </div>
          </Card>

          <Card className="clean-glass">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">
                  Pos Peringatan
                </span>
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{warningCount}</p>
              <p className="text-xs text-amber-600 mt-1">
                Realisasi ≥ 80% dari RAB
              </p>
            </div>
          </Card>
        </div>

        {/* Global Progress */}
        <Card className="clean-glass">
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-900">
                Progress Realisasi Global
              </h3>
              <span className="text-2xl font-bold text-purple-600">
                {persentaseGlobal.toFixed(1)}%
              </span>
            </div>
            <div className="relative">
              <Progress
                value={persentaseGlobal}
                className="h-6"
                style={
                  {
                    "--progress-color": getProgressColor(persentaseGlobal),
                  } as React.CSSProperties
                }
              />
            </div>
            <div className="flex justify-between text-sm text-slate-600 mt-2">
              <span>Realisasi: {formatRupiah(totalRealisasi)}</span>
              <span>RAB: {formatRupiah(totalAnggaran)}</span>
            </div>
          </div>
        </Card>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedTab === "all" ? "default" : "outline"}
            onClick={() => setSelectedTab("all")}
            className={
              selectedTab === "all" ? "bg-blue-600 hover:bg-blue-700" : ""
            }
          >
            Semua ({dummyRAB.length})
          </Button>
          <Button
            variant={selectedTab === "warning" ? "default" : "outline"}
            onClick={() => setSelectedTab("warning")}
            className={
              selectedTab === "warning"
                ? "bg-amber-600 hover:bg-amber-700"
                : ""
            }
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Peringatan ({warningCount})
          </Button>
          <Button
            variant={selectedTab === "safe" ? "default" : "outline"}
            onClick={() => setSelectedTab("safe")}
            className={
              selectedTab === "safe" ? "bg-green-600 hover:bg-green-700" : ""
            }
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Aman ({dummyRAB.length - warningCount})
          </Button>
        </div>

        {/* RAB Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRAB.map((item) => (
            <Card
              key={item.id}
              className={`clean-glass ${
                item.persentase >= 90
                  ? "border-red-300"
                  : item.persentase >= 80
                  ? "border-amber-300"
                  : ""
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-slate-900">
                        {item.pos}
                      </h3>
                      {getStatusIcon(item.persentase)}
                    </div>
                    <Badge
                      variant="outline"
                      className={kategoriPengeluaranColors[item.kategori]}
                    >
                      {kategoriPengeluaranLabels[item.kategori]}
                    </Badge>
                  </div>
                  <Badge
                    variant="outline"
                    className={getStatusColor(item.persentase)}
                  >
                    {item.persentase}%
                  </Badge>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getProgressColor(
                        item.persentase
                      )} transition-all duration-500`}
                      style={{ width: `${item.persentase}%` }}
                    />
                  </div>
                </div>

                {/* Numbers */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600 mb-1">RAB</p>
                    <p className="font-semibold text-slate-900">
                      {formatRupiah(item.anggaran)}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600 mb-1">Realisasi</p>
                    <p className="font-semibold text-purple-700">
                      {formatRupiah(item.realisasi)}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600 mb-1">Sisa</p>
                    <p className="font-semibold text-green-700">
                      {formatRupiah(item.anggaran - item.realisasi)}
                    </p>
                  </div>
                </div>

                {/* Warning */}
                {item.persentase >= 90 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700">
                      Anggaran hampir habis! Perlu persetujuan untuk pengeluaran
                      tambahan di pos ini.
                    </p>
                  </div>
                )}

                {item.persentase >= 80 && item.persentase < 90 && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                      Mendekati batas anggaran. Pantau pengeluaran di pos ini.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Detail Table */}
        <Card className="clean-glass overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">
              Detail RAB vs Realisasi
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                    Pos
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                    Kategori
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                    Anggaran (RAB)
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                    Realisasi
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                    Sisa
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">
                    Progress
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {dummyRAB.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm font-medium text-slate-900">
                      {item.pos}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={kategoriPengeluaranColors[item.kategori]}
                      >
                        {kategoriPengeluaranLabels[item.kategori]}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-slate-900">
                      {formatRupiah(item.anggaran)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-purple-700">
                      {formatRupiah(item.realisasi)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-green-700">
                      {formatRupiah(item.anggaran - item.realisasi)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getProgressColor(
                              item.persentase
                            )}`}
                            style={{ width: `${item.persentase}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-slate-700 w-12 text-right">
                          {item.persentase}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {item.persentase >= 80 ? (
                        <AlertTriangle className="w-5 h-5 text-amber-600 mx-auto" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-slate-300 bg-slate-50/50">
                <tr>
                  <td
                    colSpan={2}
                    className="py-3 px-4 text-sm font-bold text-slate-900"
                  >
                    Total
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-bold text-slate-900">
                    {formatRupiah(totalAnggaran)}
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-bold text-purple-700">
                    {formatRupiah(totalRealisasi)}
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-bold text-green-700">
                    {formatRupiah(sisaAnggaran)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-sm font-bold text-slate-900">
                      {persentaseGlobal.toFixed(1)}%
                    </span>
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
