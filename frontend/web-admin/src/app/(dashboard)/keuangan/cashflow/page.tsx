"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Download,
  AlertTriangle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  dummyCashflow,
  formatRupiah,
  getBulanName,
} from "@/lib/keuangan-data";

export default function CashflowPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("6bulan");

  // Calculate totals
  const totalPemasukan = dummyCashflow.reduce((sum, item) => sum + item.pemasukan, 0);
  const totalPengeluaran = dummyCashflow.reduce((sum, item) => sum + item.pengeluaran, 0);
  const rataRataSaldo = dummyCashflow.reduce((sum, item) => sum + item.saldo, 0) / dummyCashflow.length;
  const bulanTerakhir = dummyCashflow[dummyCashflow.length - 1];

  // Format data for charts
  const chartData = dummyCashflow.map((item) => ({
    ...item,
    bulanLabel: getBulanName(item.bulan).split(" ")[0], // Just month name
  }));

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <ArrowUpDown className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Cashflow
              </h1>
              <p className="text-sm text-slate-600">
                Analisis arus kas & proyeksi keuangan
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="clean-glass">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="clean-glass">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">
                  Total Pemasukan
                </span>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formatRupiah(totalPemasukan)}
              </p>
              <p className="text-xs text-slate-500 mt-1">6 bulan terakhir</p>
            </div>
          </Card>

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
              <p className="text-xs text-slate-500 mt-1">6 bulan terakhir</p>
            </div>
          </Card>

          <Card className="clean-glass">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">
                  Saldo Bulan Ini
                </span>
                <ArrowUpDown className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formatRupiah(bulanTerakhir.saldo)}
              </p>
              <p className="text-xs text-green-600 mt-1">
                +{((bulanTerakhir.saldo / bulanTerakhir.pemasukan) * 100).toFixed(1)}%
              </p>
            </div>
          </Card>

          <Card className="clean-glass">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">
                  Rata-rata Saldo
                </span>
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formatRupiah(rataRataSaldo)}
              </p>
              <p className="text-xs text-slate-500 mt-1">Per bulan</p>
            </div>
          </Card>
        </div>

        {/* Alert if cashflow negative */}
        {bulanTerakhir.saldo < 0 && (
          <Card className="clean-glass border-red-200 bg-red-50/50">
            <div className="p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">
                  Peringatan Cashflow Negatif
                </h3>
                <p className="text-sm text-red-700">
                  Saldo bulan ini negatif {formatRupiah(Math.abs(bulanTerakhir.saldo))}.
                  Segera tindak lanjuti penagihan atau tunda pengeluaran
                  non-prioritas.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Area Chart - Cashflow Trend */}
        <Card className="clean-glass">
          <div className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">
              Tren Cashflow 6 Bulan Terakhir
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPemasukan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorPengeluaran"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="bulanLabel"
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(value) =>
                      `${(value / 1000000).toFixed(0)}jt`
                    }
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg p-3 shadow-lg">
                            <p className="font-semibold text-slate-900 mb-2">
                              {getBulanName(payload[0].payload.bulan)}
                            </p>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-green-700">Pemasukan:</span>
                                <span className="font-semibold text-green-700">
                                  {formatRupiah(payload[0].value as number)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-red-700">Pengeluaran:</span>
                                <span className="font-semibold text-red-700">
                                  {formatRupiah(payload[1].value as number)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-200">
                                <span className="text-blue-700">Saldo:</span>
                                <span className="font-semibold text-blue-700">
                                  {formatRupiah(
                                    (payload[0].value as number) -
                                      (payload[1].value as number)
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="pemasukan"
                    name="Pemasukan"
                    stroke="#22c55e"
                    strokeWidth={2}
                    fill="url(#colorPemasukan)"
                  />
                  <Area
                    type="monotone"
                    dataKey="pengeluaran"
                    name="Pengeluaran"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fill="url(#colorPengeluaran)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Bar Chart - Net Cashflow */}
        <Card className="clean-glass">
          <div className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">
              Saldo Bersih Per Bulan
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="bulanLabel"
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(value) =>
                      `${(value / 1000000).toFixed(0)}jt`
                    }
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg p-3 shadow-lg">
                            <p className="font-semibold text-slate-900 mb-1">
                              {getBulanName(payload[0].payload.bulan)}
                            </p>
                            <p className="text-sm text-blue-700 font-semibold">
                              Saldo: {formatRupiah(payload[0].value as number)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="saldo"
                    name="Saldo"
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Detail Table */}
        <Card className="clean-glass">
          <div className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">
              Detail Cashflow
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Bulan
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                      Pemasukan
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                      Pengeluaran
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                      Saldo
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                      Margin
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {dummyCashflow.map((item) => {
                    const margin = ((item.saldo / item.pemasukan) * 100).toFixed(1);
                    return (
                      <tr
                        key={item.bulan}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm font-medium text-slate-900">
                          {getBulanName(item.bulan)}
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-green-700 font-semibold">
                          {formatRupiah(item.pemasukan)}
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-red-700 font-semibold">
                          {formatRupiah(item.pengeluaran)}
                        </td>
                        <td className="py-3 px-4 text-sm text-right font-semibold text-blue-700">
                          {formatRupiah(item.saldo)}
                        </td>
                        <td className="py-3 px-4 text-sm text-right">
                          <span
                            className={`inline-flex items-center gap-1 ${
                              parseFloat(margin) >= 30
                                ? "text-green-700"
                                : parseFloat(margin) >= 15
                                ? "text-blue-700"
                                : "text-amber-700"
                            }`}
                          >
                            {parseFloat(margin) >= 30 ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : parseFloat(margin) < 15 ? (
                              <TrendingDown className="w-3 h-3" />
                            ) : null}
                            {margin}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="border-t-2 border-slate-300 bg-slate-50/50">
                  <tr>
                    <td className="py-3 px-4 text-sm font-bold text-slate-900">
                      Total
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-bold text-green-700">
                      {formatRupiah(totalPemasukan)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-bold text-red-700">
                      {formatRupiah(totalPengeluaran)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-bold text-blue-700">
                      {formatRupiah(totalPemasukan - totalPengeluaran)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-bold text-slate-700">
                      {(
                        ((totalPemasukan - totalPengeluaran) / totalPemasukan) *
                        100
                      ).toFixed(1)}
                      %
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
