"use client";

import { useState, useMemo } from "react";
import AppShell from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Plus,
  Phone,
  Mail,
  Filter,
  X,
  Eye,
} from "lucide-react";
import {
  dummyLeads,
  leadStatusLabel,
  leadStatusColor,
  sourceLabel,
  formatTanggal,
  type Lead,
  type LeadStatus,
  type LeadSource,
} from "@/lib/crm-data";

const allStatuses: LeadStatus[] = [
  "baru",
  "follow-up",
  "survey",
  "negosiasi",
  "booking",
  "spk",
];
const allSources: LeadSource[] = [
  "website",
  "instagram",
  "facebook",
  "referral",
  "walk-in",
  "pameran",
];

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const filtered = useMemo(() => {
    return dummyLeads.filter((lead) => {
      const matchSearch =
        !search ||
        lead.nama.toLowerCase().includes(search.toLowerCase()) ||
        lead.telepon.includes(search);
      const matchStatus =
        filterStatus === "all" || lead.status === filterStatus;
      const matchSource =
        filterSource === "all" || lead.sumber === filterSource;
      return matchSearch && matchStatus && matchSource;
    });
  }, [search, filterStatus, filterSource]);

  const hasFilters =
    search !== "" || filterStatus !== "all" || filterSource !== "all";

  const clearFilters = () => {
    setSearch("");
    setFilterStatus("all");
    setFilterSource("all");
  };

  // Summary counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    dummyLeads.forEach((l) => {
      counts[l.status] = (counts[l.status] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <AppShell title="CRM — Leads">
      {/* Summary Badges */}
      <div className="mb-6 flex flex-wrap gap-2">
        {allStatuses.map((s) => (
          <button
            key={s}
            onClick={() =>
              setFilterStatus(filterStatus === s ? "all" : s)
            }
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border transition-all duration-200 ${
              filterStatus === s
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-white/80 text-slate-600 border-slate-200/50 hover:border-blue-300/50"
            }`}
          >
            {leadStatusLabel[s]}
            <span className="ml-0.5 rounded-md bg-white/60 px-1.5 py-0.5 text-[10px] font-semibold">
              {statusCounts[s] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Filters & Search Bar */}
      <Card className="mb-6 bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-sm rounded-xl">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari nama atau nomor HP..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 rounded-lg border-slate-200/80 bg-white/60 text-sm focus:border-blue-400 focus:ring-blue-400/20"
              />
            </div>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40 h-10 rounded-lg border-slate-200/80 bg-white/60 text-sm">
                <Filter className="mr-2 h-3.5 w-3.5 text-slate-400" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                {allStatuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {leadStatusLabel[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Source Filter */}
            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger className="w-full sm:w-40 h-10 rounded-lg border-slate-200/80 bg-white/60 text-sm">
                <SelectValue placeholder="Sumber" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Sumber</SelectItem>
                {allSources.map((s) => (
                  <SelectItem key={s} value={s}>
                    {sourceLabel[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-10 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-white/90"
              >
                <X className="mr-1 h-3.5 w-3.5" />
                Reset
              </Button>
            )}

            {/* Add Lead */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="h-10 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20 transition-all duration-200">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Lead
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white/95 backdrop-blur-md border-slate-200/50 rounded-xl max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-[family-name:var(--font-heading)] text-lg font-semibold text-slate-900">
                    Tambah Lead Baru
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-700">Nama Lengkap</Label>
                      <Input className="h-10 rounded-lg border-slate-200/80 bg-white/60" placeholder="Nama calon pembeli" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-700">No. Telepon</Label>
                      <Input className="h-10 rounded-lg border-slate-200/80 bg-white/60" placeholder="081234567890" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-slate-700">Email</Label>
                    <Input className="h-10 rounded-lg border-slate-200/80 bg-white/60" placeholder="email@example.com" type="email" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-700">Sumber</Label>
                      <Select>
                        <SelectTrigger className="h-10 rounded-lg border-slate-200/80 bg-white/60">
                          <SelectValue placeholder="Pilih sumber" />
                        </SelectTrigger>
                        <SelectContent>
                          {allSources.map((s) => (
                            <SelectItem key={s} value={s}>{sourceLabel[s]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-700">Minat Unit</Label>
                      <Input className="h-10 rounded-lg border-slate-200/80 bg-white/60" placeholder="Tipe 45/72" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-slate-700">Catatan</Label>
                    <Textarea className="rounded-lg border-slate-200/80 bg-white/60 resize-none" rows={3} placeholder="Catatan tambahan..." />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={() => setShowAddDialog(false)} className="rounded-lg border-slate-200/80">
                      Batal
                    </Button>
                    <Button onClick={() => setShowAddDialog(false)} className="rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20">
                      Simpan
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200/50 hover:bg-transparent">
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kontak</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sumber</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Minat</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sales</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-sm text-slate-400">
                    Tidak ada leads ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((lead) => (
                  <TableRow
                    key={lead.id}
                    className="border-slate-200/30 hover:bg-white/60 transition-colors duration-150 cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{lead.nama}</p>
                        <p className="text-xs text-slate-400">{lead.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                          <Phone className="h-3 w-3" />
                          {lead.telepon}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                          <Mail className="h-3 w-3" />
                          {lead.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-slate-600">{sourceLabel[lead.sumber]}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs font-medium rounded-md ${leadStatusColor[lead.status]} border-0`}>
                        {leadStatusLabel[lead.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-700">{lead.minatUnit}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600">{lead.salesPIC}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-slate-500">{formatTanggal(lead.tanggalMasuk)}</span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg hover:bg-blue-50 transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLead(lead);
                        }}
                      >
                        <Eye className="h-4 w-4 text-slate-400" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Table Footer */}
        <div className="border-t border-slate-200/30 px-6 py-3 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Menampilkan {filtered.length} dari {dummyLeads.length} leads
          </p>
        </div>
      </Card>

      {/* Lead Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="bg-white/95 backdrop-blur-md border-slate-200/50 rounded-xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-[family-name:var(--font-heading)] text-lg font-semibold text-slate-900">
              Detail Lead
            </DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4 mt-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{selectedLead.nama}</h3>
                  <p className="text-xs text-slate-400">{selectedLead.id}</p>
                </div>
                <Badge className={`text-xs font-medium rounded-md ${leadStatusColor[selectedLead.status]} border-0`}>
                  {leadStatusLabel[selectedLead.status]}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50/80 border border-slate-200/40 p-4">
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Telepon</p>
                  <p className="text-sm font-medium text-slate-700">{selectedLead.telepon}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Email</p>
                  <p className="text-sm font-medium text-slate-700">{selectedLead.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Sumber</p>
                  <p className="text-sm font-medium text-slate-700">{sourceLabel[selectedLead.sumber]}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Minat Unit</p>
                  <p className="text-sm font-medium text-slate-700">{selectedLead.minatUnit}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Sales PIC</p>
                  <p className="text-sm font-medium text-slate-700">{selectedLead.salesPIC}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Tanggal Masuk</p>
                  <p className="text-sm font-medium text-slate-700">{formatTanggal(selectedLead.tanggalMasuk)}</p>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50/80 border border-slate-200/40 p-4">
                <p className="text-xs text-slate-400 mb-1">Catatan Terakhir</p>
                <p className="text-sm text-slate-700">{selectedLead.catatanTerakhir}</p>
              </div>

              {/* Status Update */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-slate-500">Pindah ke:</span>
                {allStatuses
                  .filter((s) => s !== selectedLead.status)
                  .map((s) => (
                    <button
                      key={s}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium border transition-all duration-200 hover:shadow-sm ${leadStatusColor[s]}`}
                    >
                      {leadStatusLabel[s]}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
