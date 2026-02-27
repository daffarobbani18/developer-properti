"use client";

import { useState, useMemo } from "react";
import AppShell from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Phone,
  MessageCircle,
  MapPin,
  Mail,
  Users,
  Plus,
  CalendarClock,
  User,
} from "lucide-react";
import {
  dummyAktivitas,
  tipeAktivitasLabel,
  tipeAktivitasColor,
  formatTanggal,
  type TipeAktivitas,
} from "@/lib/crm-data";

const tipeIcons: Record<TipeAktivitas, React.ElementType> = {
  telepon: Phone,
  whatsapp: MessageCircle,
  kunjungan: MapPin,
  email: Mail,
  meeting: Users,
};

const allTipes: TipeAktivitas[] = [
  "telepon",
  "whatsapp",
  "kunjungan",
  "email",
  "meeting",
];

export default function AktivitasPage() {
  const [filterTipe, setFilterTipe] = useState<string>("all");
  const [filterSales, setFilterSales] = useState<string>("all");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const filtered = useMemo(() => {
    return dummyAktivitas.filter((a) => {
      const matchTipe = filterTipe === "all" || a.tipe === filterTipe;
      const matchSales = filterSales === "all" || a.salesPIC === filterSales;
      return matchTipe && matchSales;
    });
  }, [filterTipe, filterSales]);

  // Group by date
  const grouped = useMemo(() => {
    const groups: Record<string, typeof dummyAktivitas> = {};
    filtered.forEach((a) => {
      if (!groups[a.tanggal]) groups[a.tanggal] = [];
      groups[a.tanggal].push(a);
    });
    return Object.entries(groups).sort(
      ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
    );
  }, [filtered]);

  // Upcoming follow-ups
  const upcoming = useMemo(() => {
    return dummyAktivitas
      .filter((a) => a.jadwalFollowUp)
      .sort(
        (a, b) =>
          new Date(a.jadwalFollowUp!).getTime() -
          new Date(b.jadwalFollowUp!).getTime()
      );
  }, []);

  return (
    <AppShell title="CRM — Aktivitas Sales">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main — Activity Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <Card className="bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-sm rounded-xl">
            <CardContent className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Select value={filterTipe} onValueChange={setFilterTipe}>
                  <SelectTrigger className="w-full sm:w-44 h-10 rounded-lg border-slate-200/80 bg-white/60 text-sm">
                    <SelectValue placeholder="Tipe Aktivitas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    {allTipes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {tipeAktivitasLabel[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterSales} onValueChange={setFilterSales}>
                  <SelectTrigger className="w-full sm:w-36 h-10 rounded-lg border-slate-200/80 bg-white/60 text-sm">
                    <SelectValue placeholder="Sales" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Sales</SelectItem>
                    <SelectItem value="Rina">Rina</SelectItem>
                    <SelectItem value="Andi">Andi</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex-1" />

                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button className="h-10 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20 transition-all duration-200">
                      <Plus className="mr-2 h-4 w-4" />
                      Catat Aktivitas
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white/95 backdrop-blur-md border-slate-200/50 rounded-xl max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="font-[family-name:var(--font-heading)] text-lg font-semibold text-slate-900">
                        Catat Aktivitas Baru
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm text-slate-700">Lead</Label>
                          <Select>
                            <SelectTrigger className="h-10 rounded-lg border-slate-200/80 bg-white/60">
                              <SelectValue placeholder="Pilih lead" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="L001">Budi Santoso</SelectItem>
                              <SelectItem value="L005">Roni Pratama</SelectItem>
                              <SelectItem value="L006">Maya Sari</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-slate-700">Tipe</Label>
                          <Select>
                            <SelectTrigger className="h-10 rounded-lg border-slate-200/80 bg-white/60">
                              <SelectValue placeholder="Pilih tipe" />
                            </SelectTrigger>
                            <SelectContent>
                              {allTipes.map((t) => (
                                <SelectItem key={t} value={t}>
                                  {tipeAktivitasLabel[t]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-slate-700">Catatan</Label>
                        <Textarea
                          className="rounded-lg border-slate-200/80 bg-white/60 resize-none"
                          rows={3}
                          placeholder="Isi aktivitas yang dilakukan..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-slate-700">
                          Jadwal Follow Up (opsional)
                        </Label>
                        <Input
                          type="date"
                          className="h-10 rounded-lg border-slate-200/80 bg-white/60"
                        />
                      </div>
                      <div className="flex justify-end gap-3 pt-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowAddDialog(false)}
                          className="rounded-lg border-slate-200/80"
                        >
                          Batal
                        </Button>
                        <Button
                          onClick={() => setShowAddDialog(false)}
                          className="rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20"
                        >
                          Simpan
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          {grouped.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-sm rounded-xl">
              <CardContent className="py-12 text-center text-sm text-slate-400">
                Tidak ada aktivitas ditemukan.
              </CardContent>
            </Card>
          ) : (
            grouped.map(([date, items]) => (
              <div key={date}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px flex-1 bg-slate-200/50" />
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {formatTanggal(date)}
                  </span>
                  <div className="h-px flex-1 bg-slate-200/50" />
                </div>

                <div className="space-y-3">
                  {items.map((a) => {
                    const Icon = tipeIcons[a.tipe];
                    return (
                      <Card
                        key={a.id}
                        className="bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-sm rounded-xl transition-all duration-200 hover:shadow-md hover:border-blue-300/50"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 ${tipeAktivitasColor[a.tipe]}`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-sm font-medium text-slate-900">
                                    {a.namaLead}
                                  </p>
                                  <Badge
                                    className={`mt-1 text-[10px] font-medium rounded-md ${tipeAktivitasColor[a.tipe]} border-0`}
                                  >
                                    {tipeAktivitasLabel[a.tipe]}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
                                  <User className="h-3 w-3" />
                                  {a.salesPIC}
                                </div>
                              </div>
                              <p className="mt-2 text-sm text-slate-600">
                                {a.catatan}
                              </p>
                              {a.jadwalFollowUp && (
                                <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-blue-50/80 border border-blue-200/40 px-2.5 py-1 text-xs text-blue-600">
                                  <CalendarClock className="h-3 w-3" />
                                  Follow up: {formatTanggal(a.jadwalFollowUp)}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar — Upcoming Follow-ups */}
        <div className="space-y-4">
          <Card className="bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-sm rounded-xl">
            <CardContent className="p-4">
              <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-blue-600" />
                Jadwal Follow Up
              </h3>
              {upcoming.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">
                  Tidak ada follow up terjadwal
                </p>
              ) : (
                <div className="space-y-3">
                  {upcoming.map((a) => {
                    const Icon = tipeIcons[a.tipe];
                    return (
                      <div
                        key={a.id}
                        className="flex items-start gap-3 rounded-lg bg-slate-50/80 border border-slate-200/40 p-3 transition-all duration-200 hover:bg-white/80"
                      >
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-md shrink-0 ${tipeAktivitasColor[a.tipe]}`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {a.namaLead}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {a.catatan}
                          </p>
                          <p className="mt-1 text-xs font-medium text-blue-600">
                            {formatTanggal(a.jadwalFollowUp!)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sales Summary */}
          <Card className="bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-sm rounded-xl">
            <CardContent className="p-4">
              <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold text-slate-900 mb-3">
                Ringkasan Sales
              </h3>
              <div className="space-y-3">
                {["Rina", "Andi"].map((sales) => {
                  const count = dummyAktivitas.filter(
                    (a) => a.salesPIC === sales
                  ).length;
                  return (
                    <div
                      key={sales}
                      className="flex items-center justify-between rounded-lg bg-slate-50/80 border border-slate-200/40 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-blue-50 flex items-center justify-center text-xs font-semibold text-blue-700">
                          {sales[0]}
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          {sales}
                        </span>
                      </div>
                      <Badge className="bg-slate-100 text-slate-600 font-medium text-xs rounded-md border-0">
                        {count} aktivitas
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
