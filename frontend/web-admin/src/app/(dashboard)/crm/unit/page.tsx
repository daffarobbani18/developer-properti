"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { LayoutGrid, List, Search, Home, Maximize2 } from "lucide-react";
import {
  dummyUnits,
  unitStatusLabel,
  unitStatusColor,
  formatRupiah,
  type Unit,
  type UnitStatus,
} from "@/lib/crm-data";

const allBloks = ["A", "B", "C"];
const allStatuses: UnitStatus[] = ["tersedia", "booked", "terjual", "indent"];

const statusSitePlanColor: Record<UnitStatus, string> = {
  tersedia: "bg-emerald-100 border-emerald-300 text-emerald-800 hover:bg-emerald-200",
  booked: "bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200",
  terjual: "bg-slate-200 border-slate-300 text-slate-500",
  indent: "bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200",
};

export default function UnitPage() {
  const [view, setView] = useState<"grid" | "table">("grid");
  const [filterBlok, setFilterBlok] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const filtered = useMemo(() => {
    return dummyUnits.filter((u) => {
      const matchBlok = filterBlok === "all" || u.blok === filterBlok;
      const matchStatus = filterStatus === "all" || u.status === filterStatus;
      const matchSearch =
        !search || u.nomorUnit.toLowerCase().includes(search.toLowerCase());
      return matchBlok && matchStatus && matchSearch;
    });
  }, [filterBlok, filterStatus, search]);

  // Summary
  const summary = useMemo(() => {
    const total = dummyUnits.length;
    const tersedia = dummyUnits.filter((u) => u.status === "tersedia").length;
    const booked = dummyUnits.filter((u) => u.status === "booked").length;
    const terjual = dummyUnits.filter((u) => u.status === "terjual").length;
    return { total, tersedia, booked, terjual };
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">CRM — Manajemen Unit</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Unit", value: summary.total, color: "text-slate-900" },
          { label: "Tersedia", value: summary.tersedia, color: "text-emerald-600" },
          { label: "Booked", value: summary.booked, color: "text-amber-600" },
          { label: "Terjual", value: summary.terjual, color: "text-slate-500" },
        ].map((s) => (
          <Card
            key={s.label}
            className="bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-sm rounded-xl"
          >
            <CardContent className="p-4">
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className={`text-2xl font-bold font-[family-name:var(--font-heading)] ${s.color}`}>
                {s.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="mb-6 bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-sm rounded-xl">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari nomor unit..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 rounded-lg border-slate-200/80 bg-white/60 text-sm"
              />
            </div>

            <Select value={filterBlok} onValueChange={setFilterBlok}>
              <SelectTrigger className="w-full sm:w-36 h-10 rounded-lg border-slate-200/80 bg-white/60 text-sm">
                <SelectValue placeholder="Blok" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Blok</SelectItem>
                {allBloks.map((b) => (
                  <SelectItem key={b} value={b}>
                    Blok {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40 h-10 rounded-lg border-slate-200/80 bg-white/60 text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                {allStatuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {unitStatusLabel[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-slate-100/80 rounded-lg p-0.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView("grid")}
                className={`h-9 rounded-md px-3 transition-all duration-200 ${
                  view === "grid"
                    ? "bg-white shadow-sm text-slate-900"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView("table")}
                className={`h-9 rounded-md px-3 transition-all duration-200 ${
                  view === "table"
                    ? "bg-white shadow-sm text-slate-900"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Site Plan Legend */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="text-xs font-medium text-slate-500">Keterangan:</span>
        {allStatuses.map((s) => (
          <div key={s} className="flex items-center gap-1.5">
            <div className={`h-3 w-3 rounded-sm border ${statusSitePlanColor[s]}`} />
            <span className="text-xs text-slate-600">
              {unitStatusLabel[s]}
            </span>
          </div>
        ))}
      </div>

      {/* Content */}
      {view === "grid" ? (
        /* ===== Site Plan / Grid View ===== */
        <div className="space-y-6">
          {allBloks
            .filter((b) => filterBlok === "all" || b === filterBlok)
            .map((blok) => {
              const blokUnits = filtered.filter((u) => u.blok === blok);
              if (blokUnits.length === 0) return null;
              return (
                <Card
                  key={blok}
                  className="bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-sm rounded-xl"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="font-[family-name:var(--font-heading)] text-base font-semibold text-slate-900 flex items-center gap-2">
                      <Home className="h-4 w-4 text-blue-600" />
                      Blok {blok}
                      <Badge className="text-xs bg-slate-100 text-slate-600 font-medium rounded-md border-0 ml-1">
                        {blokUnits.length} unit
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                      {blokUnits.map((unit) => (
                        <button
                          key={unit.id}
                          onClick={() => setSelectedUnit(unit)}
                          className={`relative flex flex-col items-center justify-center rounded-xl border-2 p-3 min-h-[90px] transition-all duration-200 ${statusSitePlanColor[unit.status]} ${
                            unit.status !== "terjual"
                              ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5"
                              : "cursor-pointer"
                          }`}
                        >
                          <span className="text-sm font-bold">
                            {unit.nomorUnit}
                          </span>
                          <span className="text-[10px] mt-0.5 opacity-70">
                            {unit.tipe}
                          </span>
                          <span className="text-[10px] mt-0.5 font-medium">
                            {unitStatusLabel[unit.status]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      ) : (
        /* ===== Table View ===== */
        <Card className="bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-sm rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200/50 hover:bg-transparent">
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">No. Unit</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Blok</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipe</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Luas Tanah</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Luas Bangunan</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Harga</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pembeli</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((unit) => (
                  <TableRow
                    key={unit.id}
                    className="border-slate-200/30 hover:bg-white/60 cursor-pointer transition-colors duration-150"
                    onClick={() => setSelectedUnit(unit)}
                  >
                    <TableCell className="text-sm font-medium text-slate-900">{unit.nomorUnit}</TableCell>
                    <TableCell className="text-sm text-slate-600">Blok {unit.blok}</TableCell>
                    <TableCell className="text-sm text-slate-700">{unit.tipe}</TableCell>
                    <TableCell className="text-sm text-slate-600">{unit.luasTanah} m²</TableCell>
                    <TableCell className="text-sm text-slate-600">{unit.luasBangunan} m²</TableCell>
                    <TableCell className="text-sm font-medium text-slate-900">{formatRupiah(unit.harga)}</TableCell>
                    <TableCell>
                      <Badge className={`text-xs font-medium rounded-md ${unitStatusColor[unit.status]} border-0`}>
                        {unitStatusLabel[unit.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {unit.pembeli || <span className="text-slate-400">—</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="border-t border-slate-200/30 px-6 py-3">
            <p className="text-xs text-slate-400">
              Menampilkan {filtered.length} dari {dummyUnits.length} unit
            </p>
          </div>
        </Card>
      )}

      {/* Unit Detail Dialog */}
      <Dialog open={!!selectedUnit} onOpenChange={() => setSelectedUnit(null)}>
        <DialogContent className="bg-white/95 backdrop-blur-md border-slate-200/50 rounded-xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-[family-name:var(--font-heading)] text-lg font-semibold text-slate-900">
              Detail Unit
            </DialogTitle>
          </DialogHeader>
          {selectedUnit && (
            <div className="space-y-4 mt-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] text-slate-900">
                    {selectedUnit.nomorUnit}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Blok {selectedUnit.blok} — Tipe {selectedUnit.tipe}
                  </p>
                </div>
                <Badge className={`text-xs font-medium rounded-md ${unitStatusColor[selectedUnit.status]} border-0`}>
                  {unitStatusLabel[selectedUnit.status]}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50/80 border border-slate-200/40 p-4">
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Luas Tanah</p>
                  <p className="text-sm font-medium text-slate-700">{selectedUnit.luasTanah} m²</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Luas Bangunan</p>
                  <p className="text-sm font-medium text-slate-700">{selectedUnit.luasBangunan} m²</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Harga</p>
                  <p className="text-base font-bold text-slate-900">{formatRupiah(selectedUnit.harga)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Pembeli</p>
                  <p className="text-sm font-medium text-slate-700">
                    {selectedUnit.pembeli || "—"}
                  </p>
                </div>
              </div>

              {selectedUnit.status === "tersedia" && (
                <div className="flex gap-3 pt-1">
                  <Button className="flex-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20 transition-all duration-200">
                    Booking Unit Ini
                  </Button>
                  <Button variant="outline" className="rounded-lg border-slate-200/80">
                    <Maximize2 className="mr-2 h-4 w-4" />
                    Edit Harga
                  </Button>
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
