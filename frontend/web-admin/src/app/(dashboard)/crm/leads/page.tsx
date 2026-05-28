"use client";

import { useState, useEffect, useMemo } from "react";
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
  MagnifyingGlass,
  Plus,
  Phone,
  Envelope,
  Funnel,
  X,
  Eye,
  CircleNotch
} from "@phosphor-icons/react";
import {
  leadStatusLabel,
  leadStatusColor,
  sourceLabel,
  formatTanggal,
  type LeadStatus,
  type LeadSource,
} from "@/lib/crm-data";

type Lead = {
  id: string;
  nama: string;
  telepon: string;
  email: string;
  sumber: LeadSource;
  status: LeadStatus;
  minatUnit: string;
  salesPIC: string;
  tanggalMasuk: string;
  catatanTerakhir: string;
};

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
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        // Login to get token first
        const loginRes = await fetch("http://localhost:4000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "superadmin@erp.com", password: "password123" })
        });
        const loginData = await loginRes.json();
        
        if (loginData.token) {
          const res = await fetch("http://localhost:4000/api/sales/leads", {
            headers: { "Authorization": `Bearer ${loginData.token}` }
          });
          const result = await res.json();
          if (result.data) {
            const mapped = result.data.map((l: any) => {
              let status: LeadStatus = "baru";
              const rawStat = (l.statusCrm || "New").toLowerCase();
              if (rawStat.includes("follow")) status = "follow-up";
              else if (rawStat.includes("survey")) status = "survey";
              else if (rawStat.includes("nego")) status = "negosiasi";
              else if (rawStat.includes("booking")) status = "booking";
              else if (rawStat.includes("spk")) status = "spk";
              
              let source: LeadSource = "website";
              const rawSource = (l.source || "").toLowerCase();
              if (rawSource.includes("ig") || rawSource.includes("insta")) source = "instagram";
              else if (rawSource.includes("fb") || rawSource.includes("face")) source = "facebook";
              else if (rawSource.includes("ref")) source = "referral";
              else if (rawSource.includes("walk")) source = "walk-in";
              else if (rawSource.includes("pameran")) source = "pameran";

              return {
                id: l.id,
                nama: l.name,
                telepon: l.phone,
                email: l.email || "-",
                sumber: source,
                status: status,
                minatUnit: "-",
                salesPIC: "Sistem",
                tanggalMasuk: l.createdAt,
                catatanTerakhir: l.notes || "-"
              };
            });
            setLeads(mapped);
          }
        }
      } catch (error) {
        console.error("Failed to fetch leads", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
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
  }, [leads, search, filterStatus, filterSource]);

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
    leads.forEach((l) => {
      counts[l.status] = (counts[l.status] || 0) + 1;
    });
    return counts;
  }, [leads]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <CircleNotch className="w-10 h-10 text-blue-600 animate-spin" />
        <span className="ml-3 text-zinc-500 text-sm font-medium animate-pulse">Memuat data leads...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6">

        {/* Title & Sync Badge */}
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-zinc-900">Leads CRM</h1>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 animate-pulse border border-blue-200">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5" /> LIVE SYNC
          </span>
        </div>

        {/* Summary Badges */}
        <div className="flex flex-wrap gap-2">{allStatuses.map((s) => (
          <button
            key={s}
            onClick={() =>
              setFilterStatus(filterStatus === s ? "all" : s)
            }
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border transition-all duration-200 ${
              filterStatus === s
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-white/80 text-zinc-600 border-zinc-200/50 hover:border-blue-300/50"
            }`}
          >
            {leadStatusLabel[s]}
            <span className="ml-0.5 rounded-md bg-white/60 px-1.5 py-0.5 text-[10px] font-semibold">
              {statusCounts[s] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Filters & MagnifyingGlass Bar */}
      <Card className="mb-6 bg-white border border-zinc-200/50 shadow-sm rounded-xl">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* MagnifyingGlass */}
            <div className="relative flex-1">
              <MagnifyingGlass weight="duotone" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Cari nama atau nomor HP..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 rounded-lg border-zinc-200/80 bg-white/60 text-sm focus:border-blue-400 focus:ring-blue-400/20"
              />
            </div>

            {/* Status Funnel */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40 h-10 rounded-lg border-zinc-200/80 bg-white/60 text-sm">
                <Funnel weight="duotone" className="mr-2 h-3.5 w-3.5 text-zinc-400" />
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

            {/* Source Funnel */}
            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger className="w-full sm:w-40 h-10 rounded-lg border-zinc-200/80 bg-white/60 text-sm">
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
                className="h-10 rounded-lg text-zinc-500 hover:text-zinc-700 hover:bg-white/90"
              >
                <X weight="duotone" className="mr-1 h-3.5 w-3.5" />
                Reset
              </Button>
            )}

            {/* Add Lead */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="h-10 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20 transition-all duration-200">
                  <Plus weight="duotone" className="mr-2 h-4 w-4" />
                  Tambah Lead
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white/95 backdrop-blur-md border-zinc-200/50 rounded-xl max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-[family-name:var(--font-heading)] text-lg font-semibold text-zinc-900">
                    Tambah Lead Baru
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-zinc-700">Nama Lengkap</Label>
                      <Input className="h-10 rounded-lg border-zinc-200/80 bg-white/60" placeholder="Nama calon pembeli" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-zinc-700">No. Telepon</Label>
                      <Input className="h-10 rounded-lg border-zinc-200/80 bg-white/60" placeholder="081234567890" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-zinc-700">Email</Label>
                    <Input className="h-10 rounded-lg border-zinc-200/80 bg-white/60" placeholder="email@example.com" type="email" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-zinc-700">Sumber</Label>
                      <Select>
                        <SelectTrigger className="h-10 rounded-lg border-zinc-200/80 bg-white/60">
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
                      <Label className="text-sm text-zinc-700">Minat Unit</Label>
                      <Input className="h-10 rounded-lg border-zinc-200/80 bg-white/60" placeholder="Tipe 45/72" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-zinc-700">Catatan</Label>
                    <Textarea className="rounded-lg border-zinc-200/80 bg-white/60 resize-none" rows={3} placeholder="Catatan tambahan..." />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={() => setShowAddDialog(false)} className="rounded-lg border-zinc-200/80">
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
      <Card className="bg-white border border-zinc-200/50 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-200/50 hover:bg-transparent">
                <TableHead className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Nama</TableHead>
                <TableHead className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Kontak</TableHead>
                <TableHead className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Sumber</TableHead>
                <TableHead className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Minat</TableHead>
                <TableHead className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Sales</TableHead>
                <TableHead className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tanggal</TableHead>
                <TableHead className="text-xs font-semibold text-zinc-500 uppercase tracking-wider w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-sm text-zinc-400">
                    Tidak ada leads ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((lead) => (
                  <TableRow
                    key={lead.id}
                    className="border-zinc-200/30 hover:bg-white/60 transition-colors duration-150 cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-zinc-900">{lead.nama}</p>
                        <p className="text-xs text-zinc-400 truncate max-w-[120px]">{lead.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="inline-flex items-center gap-1 text-xs text-zinc-600">
                          <Phone weight="duotone" className="h-3 w-3" />
                          {lead.telepon}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
                          <Envelope weight="duotone" className="h-3 w-3" />
                          {lead.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-zinc-600">{sourceLabel[lead.sumber]}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs font-medium rounded-md ${leadStatusColor[lead.status]} border-0`}>
                        {leadStatusLabel[lead.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-zinc-700">{lead.minatUnit}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-zinc-600">{lead.salesPIC}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-zinc-500">{formatTanggal(lead.tanggalMasuk)}</span>
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
                        <Eye weight="duotone" className="h-4 w-4 text-zinc-400" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Lead Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="bg-white/95 backdrop-blur-md border-zinc-200/50 rounded-xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-[family-name:var(--font-heading)] text-lg font-semibold text-zinc-900">
              Detail Lead
            </DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4 mt-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">{selectedLead.nama}</h3>
                  <p className="text-xs text-zinc-400">{selectedLead.id}</p>
                </div>
                <Badge className={`text-xs font-medium rounded-md ${leadStatusColor[selectedLead.status]} border-0`}>
                  {leadStatusLabel[selectedLead.status]}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-lg bg-zinc-50/80 border border-zinc-200/40 p-4">
                <div>
                  <p className="text-xs text-zinc-400 mb-0.5">Telepon</p>
                  <p className="text-sm font-medium text-zinc-700">{selectedLead.telepon}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400 mb-0.5">Email</p>
                  <p className="text-sm font-medium text-zinc-700">{selectedLead.email}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400 mb-0.5">Sumber</p>
                  <p className="text-sm font-medium text-zinc-700">{sourceLabel[selectedLead.sumber]}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400 mb-0.5">Minat Unit</p>
                  <p className="text-sm font-medium text-zinc-700">{selectedLead.minatUnit}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400 mb-0.5">Sales PIC</p>
                  <p className="text-sm font-medium text-zinc-700">{selectedLead.salesPIC}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400 mb-0.5">Tanggal Masuk</p>
                  <p className="text-sm font-medium text-zinc-700">{formatTanggal(selectedLead.tanggalMasuk)}</p>
                </div>
              </div>

              <div className="rounded-lg bg-zinc-50/80 border border-zinc-200/40 p-4">
                <p className="text-xs text-zinc-400 mb-1">Catatan Terakhir</p>
                <p className="text-sm text-zinc-700">{selectedLead.catatanTerakhir}</p>
              </div>

              {/* Status Update */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-zinc-500">Pindah ke:</span>
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
      </div>
    </div>
  );
}
