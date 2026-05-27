"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowUpRight, FileCheck2, ShieldCheck, Clock3, AlertTriangle, 
  BadgeCheck, FileText, Scale, Search, Filter, Eye
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  dummyDokumenInduk, dummyLegalitasUnit, statusDokumenIndukLabels, statusDokumenIndukColors,
  statusProgresLegalLabels, statusProgresLegalColors, formatTanggal
} from "@/lib/legal-data";

const legalStats = [
  { label: "Izin Aktif", value: "12", note: "dari 14 dokumen terdaftar", icon: FileCheck2, bg: "bg-emerald-50", color: "text-emerald-500" },
  { label: "Segera Expired", value: "2", note: "perlu follow-up segera", icon: Clock3, bg: "bg-amber-50", color: "text-amber-500" },
  { label: "Dokumen Risiko", value: "1", note: "butuh revisi lampiran", icon: AlertTriangle, bg: "bg-rose-50", color: "text-rose-500" },
];

const legalTasks = [
  { title: "Perpanjangan IMB", desc: "Dokumen administrasi perlu diperbarui untuk blok B dan C.", status: "Menunggu tanda tangan", statusColor: "bg-amber-100 text-amber-700", dotColor: "bg-amber-500" },
  { title: "Review Akta Kerja Sama", desc: "Pastikan perubahan klausul pemasaran sudah sesuai versi terbaru.", status: "Dalam tinjauan", statusColor: "bg-blue-100 text-blue-700", dotColor: "bg-blue-500" },
  { title: "Validasi Sertifikat", desc: "Cek kelengkapan salinan sertifikat lahan tahap kedua.", status: "Siap dicek", statusColor: "bg-emerald-100 text-emerald-700", dotColor: "bg-emerald-500" },
];

const checklistItems = [
  "Simpan status dokumen per proyek agar mudah dipantau lintas tim.",
  "Tandai izin yang perlu revisi sebelum memasuki fase penjualan.",
  "Gunakan tampilan ini sebagai ringkasan awal sebelum integrasi backend.",
];

export default function LegalPage() {
  const [searchDoc, setSearchDoc] = useState("");
  const [searchUnit, setSearchUnit] = useState("");

  const filteredDocs = dummyDokumenInduk.filter(d => 
    d.namaDokumen.toLowerCase().includes(searchDoc.toLowerCase()) || 
    d.instansi.toLowerCase().includes(searchDoc.toLowerCase())
  );

  const filteredUnits = dummyLegalitasUnit.filter(u => 
    u.namaPembeli.toLowerCase().includes(searchUnit.toLowerCase()) || 
    u.nomorUnit.toLowerCase().includes(searchUnit.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <section className="module-hero md:p-8" style={{ "--hero-accent": "rgba(139,92,246,0.06)" } as React.CSSProperties}>
        <div className="hero-pattern absolute inset-0 pointer-events-none rounded-2xl opacity-50" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-violet-700">
              <Scale size={11} className="text-violet-500" /> Legal &amp; Perizinan
            </div>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl font-normal tracking-tight text-zinc-900 md:text-3xl">Monitoring Dokumen &amp; Perizinan</h1>
            <p className="max-w-2xl text-sm text-zinc-500 leading-relaxed">Kelola dokumen hukum (KTP/NPWP pelanggan), proses PPJB, AJB, dan balik nama sertifikat unit.</p>
          </div>
          <Link href="/" className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-5 py-2.5 text-sm font-semibold text-violet-600 shadow-sm transition-all hover:bg-violet-100 hover:shadow-md">
            <ShieldCheck size={16} /> Ringkasan Proyek
          </Link>
        </div>
      </section>

      {/* TABS SECTION */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6 bg-zinc-100/50 p-1 border border-zinc-200/50 rounded-xl">
          <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
          <TabsTrigger value="dokumen-induk" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Dokumen Induk (Proyek)</TabsTrigger>
          <TabsTrigger value="legalitas-unit" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Legalitas Unit (Pembeli)</TabsTrigger>
        </TabsList>

        {/* TAB 1: OVERVIEW */}
        <TabsContent value="overview" className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {legalStats.map((stat) => (
              <div key={stat.label} className="stat-card group">
                <div className="mb-4"><div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.bg}`}><stat.icon className={`h-5 w-5 ${stat.color}`} /></div></div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{stat.label}</p>
                <p className="mt-1.5 text-2xl font-bold text-zinc-900">{stat.value}</p>
                <p className="mt-1 text-xs text-zinc-500">{stat.note}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_0.6fr]">
            <div className="table-wrapper">
              <div className="border-b border-zinc-100 px-6 py-4"><h3 className="text-sm font-bold text-zinc-900">Tugas Legal Aktif</h3></div>
              <div className="divide-y divide-zinc-50">
                {legalTasks.map((task) => (
                  <div key={task.title} className="group flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-zinc-50/50">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100"><FileText size={14} className="text-zinc-400" /></div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-900">{task.title}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">{task.desc}</p>
                      </div>
                    </div>
                    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${task.statusColor}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${task.dotColor}`} />{task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
              <div className="border-b border-zinc-100 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50"><BadgeCheck size={16} className="text-emerald-500" /></div>
                  <div><p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Panduan</p><h3 className="text-sm font-bold text-zinc-900">Langkah Validasi</h3></div>
                </div>
              </div>
              <ul className="space-y-3 p-6">
                {checklistItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-zinc-500 leading-relaxed">
                    <ArrowUpRight className={`mt-0.5 h-4 w-4 shrink-0 ${idx === 0 ? "text-violet-500" : "text-violet-400"}`} />{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: DOKUMEN INDUK */}
        <TabsContent value="dokumen-induk" className="space-y-4 animate-fade-in">
          <Card className="p-4 border-zinc-200/60 shadow-sm rounded-xl bg-white">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  placeholder="Cari nama dokumen atau instansi..."
                  value={searchDoc}
                  onChange={(e) => setSearchDoc(e.target.value)}
                  className="pl-10 rounded-lg border-zinc-200/80 bg-white"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-48 rounded-lg border-zinc-200/80 bg-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="aktif">Aktif / Berlaku</SelectItem>
                  <SelectItem value="segera_expired">Segera Expired</SelectItem>
                  <SelectItem value="expired">Kadaluarsa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 bg-zinc-50/50">
                    <th className="p-4 rounded-tl-lg">Nama Dokumen</th>
                    <th className="p-4">Nomor &amp; Instansi</th>
                    <th className="p-4">Tgl. Terbit</th>
                    <th className="p-4">Tgl. Expired</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 rounded-tr-lg">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-sm">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="p-4">
                        <p className="font-medium text-zinc-900">{doc.namaDokumen}</p>
                        {doc.catatan && <p className="text-xs text-amber-600 mt-1">{doc.catatan}</p>}
                      </td>
                      <td className="p-4">
                        <p className="text-zinc-900">{doc.nomorSurat}</p>
                        <p className="text-xs text-zinc-500">{doc.instansi}</p>
                      </td>
                      <td className="p-4 text-zinc-700">{formatTanggal(doc.tanggalTerbit)}</td>
                      <td className="p-4 text-zinc-700">{formatTanggal(doc.tanggalExpired)}</td>
                      <td className="p-4">
                        <Badge variant="outline" className={`border ${statusDokumenIndukColors[doc.status]}`}>
                          {statusDokumenIndukLabels[doc.status]}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm" className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <Eye className="w-4 h-4 mr-1" /> Detail
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* TAB 3: LEGALITAS UNIT */}
        <TabsContent value="legalitas-unit" className="space-y-4 animate-fade-in">
          <Card className="p-4 border-zinc-200/60 shadow-sm rounded-xl bg-white">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  placeholder="Cari nama pembeli atau unit..."
                  value={searchUnit}
                  onChange={(e) => setSearchUnit(e.target.value)}
                  className="pl-10 rounded-lg border-zinc-200/80 bg-white"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 bg-zinc-50/50">
                    <th className="p-4 rounded-tl-lg">Pembeli &amp; Unit</th>
                    <th className="p-4 text-center">PPJB</th>
                    <th className="p-4 text-center">Pecah Sertifikat</th>
                    <th className="p-4 text-center">AJB</th>
                    <th className="p-4 text-center">BBN (SHM)</th>
                    <th className="p-4 text-right rounded-tr-lg">Update Terakhir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-sm">
                  {filteredUnits.map((unit) => (
                    <tr key={unit.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="p-4">
                        <p className="font-semibold text-zinc-900">{unit.namaPembeli}</p>
                        <p className="text-xs text-zinc-500 font-mono mt-0.5">Unit: {unit.nomorUnit}</p>
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant="secondary" className={`text-xs ${statusProgresLegalColors[unit.statusPPJB]}`}>
                          {statusProgresLegalLabels[unit.statusPPJB]}
                        </Badge>
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant="secondary" className={`text-xs ${statusProgresLegalColors[unit.statusPecahSertifikat]}`}>
                          {statusProgresLegalLabels[unit.statusPecahSertifikat]}
                        </Badge>
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant="secondary" className={`text-xs ${statusProgresLegalColors[unit.statusAJB]}`}>
                          {statusProgresLegalLabels[unit.statusAJB]}
                        </Badge>
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant="secondary" className={`text-xs ${statusProgresLegalColors[unit.statusBBN]}`}>
                          {statusProgresLegalLabels[unit.statusBBN]}
                        </Badge>
                      </td>
                      <td className="p-4 text-right text-zinc-500 text-xs">
                        {formatTanggal(unit.tanggalUpdateTerakhir)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
