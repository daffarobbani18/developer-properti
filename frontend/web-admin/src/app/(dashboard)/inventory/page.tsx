"use client";

import { FormEvent, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  FileText,
  Home,
  MapPin,
  Plus,
  Save,
  Sparkles,
  TrendingUp,
  Upload,
} from "lucide-react";

type LandStatus = "draft" | "active" | "hold";
type UnitStatus = "tersedia" | "booked" | "terjual" | "nonaktif";
type CertificateStatus = "belum" | "proses" | "selesai";
type MarketingSyncStatus = "ready" | "review" | "blocked";

type LandRecord = {
  id: string;
  siteName: string;
  location: string;
  areaM2: number;
  phase: string;
  status: LandStatus;
  pic: string;
  note?: string;
};

type UnitRecord = {
  id: string;
  landId: string;
  block: string;
  unitCode: string;
  typeName: string;
  landArea: number;
  buildingArea: number;
  price: number;
  status: UnitStatus;
  marketingSync: MarketingSyncStatus;
};

type CertificateRecord = {
  id: string;
  landId: string;
  docType: "Sertifikat Induk" | "Pecah Sertifikat" | "Balik Nama";
  status: CertificateStatus;
  dueDate: string;
  notary: string;
  note?: string;
};

type SitePlanRecord = {
  id: string;
  landId: string;
  version: string;
  effectiveDate: string;
  status: "aktif" | "arsip";
  note?: string;
};

type PricePromoRecord = {
  id: string;
  landId: string;
  typeName: string;
  price: number;
  promoName: string;
  promoValue: string;
  validUntil: string;
};

type DocMonitoringRecord = {
  id: string;
  landId: string;
  item: string;
  owner: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "open" | "progress" | "done";
};

const rupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const landStatusLabel: Record<LandStatus, string> = {
  draft: "Draft",
  active: "Aktif",
  hold: "Hold",
};

const unitStatusLabel: Record<UnitStatus, string> = {
  tersedia: "Tersedia",
  booked: "Booked",
  terjual: "Terjual",
  nonaktif: "Nonaktif",
};

const badgeByPriority: Record<DocMonitoringRecord["priority"], string> = {
  low: "bg-slate-100 text-slate-700 border border-slate-200",
  medium: "bg-amber-50 text-amber-700 border border-amber-200",
  high: "bg-rose-50 text-rose-700 border border-rose-200",
};

const badgeByDocStatus: Record<DocMonitoringRecord["status"], string> = {
  open: "bg-slate-100 text-slate-700 border border-slate-200",
  progress: "bg-blue-50 text-blue-700 border border-blue-200",
  done: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

export default function InventoryAdminPage() {
  const [lands, setLands] = useState<LandRecord[]>([
    {
      id: "land-1",
      siteName: "Site Astoria",
      location: "Sipoholon, Tapanuli Utara",
      areaM2: 7000,
      phase: "Fase 1",
      status: "active",
      pic: "Rizal Simanjuntak",
      note: "Sudah final untuk publikasi marketing.",
    },
    {
      id: "land-2",
      siteName: "Site Bvlgari",
      location: "Tarutung, Tapanuli Utara",
      areaM2: 5000,
      phase: "Fase 2",
      status: "active",
      pic: "Putri Siahaan",
      note: "Perlu update denah utilitas.",
    },
  ]);

  const [units, setUnits] = useState<UnitRecord[]>([
    {
      id: "unit-1",
      landId: "land-1",
      block: "A",
      unitCode: "A-01",
      typeName: "Astoria 150/200",
      landArea: 200,
      buildingArea: 150,
      price: 2800000000,
      status: "tersedia",
      marketingSync: "ready",
    },
    {
      id: "unit-2",
      landId: "land-1",
      block: "A",
      unitCode: "A-02",
      typeName: "Astoria 150/200",
      landArea: 200,
      buildingArea: 150,
      price: 2800000000,
      status: "booked",
      marketingSync: "review",
    },
    {
      id: "unit-3",
      landId: "land-2",
      block: "B",
      unitCode: "B-01",
      typeName: "Bvlgari 210/250",
      landArea: 250,
      buildingArea: 210,
      price: 3400000000,
      status: "tersedia",
      marketingSync: "ready",
    },
  ]);

  const [certificates, setCertificates] = useState<CertificateRecord[]>([
    {
      id: "cert-1",
      landId: "land-1",
      docType: "Sertifikat Induk",
      status: "selesai",
      dueDate: "2026-06-01",
      notary: "Notaris Tiur Simamora",
      note: "Sudah valid untuk release marketing.",
    },
    {
      id: "cert-2",
      landId: "land-2",
      docType: "Pecah Sertifikat",
      status: "proses",
      dueDate: "2026-06-20",
      notary: "Notaris R. Manurung",
      note: "Menunggu berkas tambahan dari BPN.",
    },
  ]);

  const [sitePlans, setSitePlans] = useState<SitePlanRecord[]>([
    {
      id: "sp-1",
      landId: "land-1",
      version: "v1.2",
      effectiveDate: "2026-04-28",
      status: "aktif",
      note: "Versi publik website sudah sinkron.",
    },
    {
      id: "sp-2",
      landId: "land-2",
      version: "v0.9",
      effectiveDate: "2026-04-20",
      status: "arsip",
      note: "Perlu upload revisi utilitas internal.",
    },
  ]);

  const [promos, setPromos] = useState<PricePromoRecord[]>([
    {
      id: "promo-1",
      landId: "land-1",
      typeName: "Astoria 150/200",
      price: 2800000000,
      promoName: "Early Bird Fase 1",
      promoValue: "Disc 75 Juta",
      validUntil: "2026-05-31",
    },
  ]);

  const [docMonitors, setDocMonitors] = useState<DocMonitoringRecord[]>([
    {
      id: "doc-1",
      landId: "land-2",
      item: "Pecah Sertifikat Bvlgari Blok B",
      owner: "Legal Team",
      dueDate: "2026-05-15",
      priority: "high",
      status: "progress",
    },
    {
      id: "doc-2",
      landId: "land-1",
      item: "Review Site Plan v1.3 untuk upload marketing",
      owner: "Inventory Team",
      dueDate: "2026-05-12",
      priority: "medium",
      status: "open",
    },
  ]);

  const [activeTab, setActiveTab] = useState("overview");
  const [flashMessage, setFlashMessage] = useState<string>("");

  const [landForm, setLandForm] = useState({
    siteName: "",
    location: "",
    areaM2: "",
    phase: "",
    status: "draft" as LandStatus,
    pic: "",
    note: "",
  });

  const [unitForm, setUnitForm] = useState({
    landId: "",
    block: "",
    unitCode: "",
    typeName: "",
    landArea: "",
    buildingArea: "",
    price: "",
    status: "tersedia" as UnitStatus,
    marketingSync: "review" as MarketingSyncStatus,
  });

  const [certificateForm, setCertificateForm] = useState({
    landId: "",
    docType: "Sertifikat Induk" as CertificateRecord["docType"],
    status: "belum" as CertificateStatus,
    dueDate: "",
    notary: "",
    note: "",
  });

  const [sitePlanForm, setSitePlanForm] = useState({
    landId: "",
    version: "",
    effectiveDate: "",
    status: "aktif" as SitePlanRecord["status"],
    note: "",
  });

  const [promoForm, setPromoForm] = useState({
    landId: "",
    typeName: "",
    price: "",
    promoName: "",
    promoValue: "",
    validUntil: "",
  });

  const [docMonitorForm, setDocMonitorForm] = useState({
    landId: "",
    item: "",
    owner: "",
    dueDate: "",
    priority: "medium" as DocMonitoringRecord["priority"],
    status: "open" as DocMonitoringRecord["status"],
  });

  const stats = useMemo(() => {
    const totalLands = lands.length;
    const totalArea = lands.reduce((sum, item) => sum + item.areaM2, 0);
    const totalUnits = units.length;
    const marketingReady = units.filter((item) => item.marketingSync === "ready").length;
    const certDone = certificates.filter((item) => item.status === "selesai").length;
    const certTotal = certificates.length;
    const sitePlanActive = sitePlans.filter((item) => item.status === "aktif").length;
    const openMonitor = docMonitors.filter((item) => item.status !== "done").length;

    return {
      totalLands,
      totalArea,
      totalUnits,
      marketingReady,
      certDone,
      certTotal,
      sitePlanActive,
      openMonitor,
    };
  }, [lands, units, certificates, sitePlans, docMonitors]);

  const getLandName = (landId: string) => {
    return lands.find((item) => item.id === landId)?.siteName ?? "-";
  };

  const showMessage = (message: string) => {
    setFlashMessage(message);
    window.setTimeout(() => {
      setFlashMessage("");
    }, 2400);
  };

  const handleSubmitLand = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!landForm.siteName || !landForm.location || !landForm.areaM2 || !landForm.phase || !landForm.pic) {
      showMessage("Lengkapi dulu data wajib untuk Lahan Baru.");
      return;
    }

    const next: LandRecord = {
      id: `land-${Date.now()}`,
      siteName: landForm.siteName,
      location: landForm.location,
      areaM2: Number(landForm.areaM2),
      phase: landForm.phase,
      status: landForm.status,
      pic: landForm.pic,
      note: landForm.note,
    };

    setLands((prev) => [next, ...prev]);
    setLandForm({
      siteName: "",
      location: "",
      areaM2: "",
      phase: "",
      status: "draft",
      pic: "",
      note: "",
    });
    showMessage("Data lahan baru berhasil ditambahkan (frontend state).");
  };

  const handleSubmitUnit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !unitForm.landId ||
      !unitForm.block ||
      !unitForm.unitCode ||
      !unitForm.typeName ||
      !unitForm.landArea ||
      !unitForm.buildingArea ||
      !unitForm.price
    ) {
      showMessage("Lengkapi dulu data wajib untuk Kavling/Unit.");
      return;
    }

    const next: UnitRecord = {
      id: `unit-${Date.now()}`,
      landId: unitForm.landId,
      block: unitForm.block,
      unitCode: unitForm.unitCode,
      typeName: unitForm.typeName,
      landArea: Number(unitForm.landArea),
      buildingArea: Number(unitForm.buildingArea),
      price: Number(unitForm.price),
      status: unitForm.status,
      marketingSync: unitForm.marketingSync,
    };

    setUnits((prev) => [next, ...prev]);
    setUnitForm({
      landId: "",
      block: "",
      unitCode: "",
      typeName: "",
      landArea: "",
      buildingArea: "",
      price: "",
      status: "tersedia",
      marketingSync: "review",
    });
    showMessage("Data unit/kavling berhasil ditambahkan (frontend state).");
  };

  const handleSubmitCertificate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!certificateForm.landId || !certificateForm.dueDate || !certificateForm.notary) {
      showMessage("Lengkapi data legalitas wajib.");
      return;
    }

    const next: CertificateRecord = {
      id: `cert-${Date.now()}`,
      landId: certificateForm.landId,
      docType: certificateForm.docType,
      status: certificateForm.status,
      dueDate: certificateForm.dueDate,
      notary: certificateForm.notary,
      note: certificateForm.note,
    };

    setCertificates((prev) => [next, ...prev]);
    setCertificateForm({
      landId: "",
      docType: "Sertifikat Induk",
      status: "belum",
      dueDate: "",
      notary: "",
      note: "",
    });
    showMessage("Data legalitas berhasil ditambahkan.");
  };

  const handleSubmitSitePlan = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!sitePlanForm.landId || !sitePlanForm.version || !sitePlanForm.effectiveDate) {
      showMessage("Lengkapi data Site Plan wajib.");
      return;
    }

    const next: SitePlanRecord = {
      id: `sp-${Date.now()}`,
      landId: sitePlanForm.landId,
      version: sitePlanForm.version,
      effectiveDate: sitePlanForm.effectiveDate,
      status: sitePlanForm.status,
      note: sitePlanForm.note,
    };

    setSitePlans((prev) => [next, ...prev]);
    setSitePlanForm({
      landId: "",
      version: "",
      effectiveDate: "",
      status: "aktif",
      note: "",
    });
    showMessage("Data Site Plan berhasil ditambahkan.");
  };

  const handleSubmitPromo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!promoForm.landId || !promoForm.typeName || !promoForm.price || !promoForm.promoName || !promoForm.validUntil) {
      showMessage("Lengkapi data Harga & Promo wajib.");
      return;
    }

    const next: PricePromoRecord = {
      id: `promo-${Date.now()}`,
      landId: promoForm.landId,
      typeName: promoForm.typeName,
      price: Number(promoForm.price),
      promoName: promoForm.promoName,
      promoValue: promoForm.promoValue || "-",
      validUntil: promoForm.validUntil,
    };

    setPromos((prev) => [next, ...prev]);
    setPromoForm({
      landId: "",
      typeName: "",
      price: "",
      promoName: "",
      promoValue: "",
      validUntil: "",
    });
    showMessage("Harga & Promo berhasil ditambahkan.");
  };

  const handleSubmitDocMonitor = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!docMonitorForm.landId || !docMonitorForm.item || !docMonitorForm.owner || !docMonitorForm.dueDate) {
      showMessage("Lengkapi data Monitoring Dokumen wajib.");
      return;
    }

    const next: DocMonitoringRecord = {
      id: `doc-${Date.now()}`,
      landId: docMonitorForm.landId,
      item: docMonitorForm.item,
      owner: docMonitorForm.owner,
      dueDate: docMonitorForm.dueDate,
      priority: docMonitorForm.priority,
      status: docMonitorForm.status,
    };

    setDocMonitors((prev) => [next, ...prev]);
    setDocMonitorForm({
      landId: "",
      item: "",
      owner: "",
      dueDate: "",
      priority: "medium",
      status: "open",
    });
    showMessage("Monitoring dokumen berhasil ditambahkan.");
  };

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-2xl md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.06),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.03),transparent_25%)]" />
        <div className="relative space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3 flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-slate-600">
                <Sparkles size={12} className="text-blue-600" /> Inventory Fase 1 (Frontend Only)
              </div>
              <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-5xl font-semibold tracking-tight text-slate-900 leading-tight">
                Panel Admin Inventory Lengkap
              </h1>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-3xl">
                Fase pertama difokuskan ke frontend penuh: master lahan, master kavling, legalitas, site plan,
                harga/promo, dan monitoring dokumen sudah tersedia dengan form input aktif berbasis state lokal.
              </p>
            </div>
            <Button
              onClick={() => setActiveTab("input-lahan")}
              className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs uppercase tracking-[0.2em] text-blue-600 transition-colors hover:bg-blue-100"
              variant="ghost"
            >
              <Plus size={14} /> Input Lahan
            </Button>
          </div>

          {flashMessage ? (
            <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              <CheckCircle2 size={14} /> {flashMessage}
            </div>
          ) : null}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Lahan",
            value: `${stats.totalLands} lokasi`,
            change: `${stats.totalArea.toLocaleString("id-ID")} m²`,
            icon: MapPin,
            color: "bg-blue-50 text-blue-600",
          },
          {
            label: "Unit Kavling",
            value: stats.totalUnits.toString(),
            change: `${stats.marketingReady} siap sync marketing`,
            icon: Home,
            color: "bg-emerald-50 text-emerald-600",
          },
          {
            label: "Sertifikat",
            value: `${stats.certDone} / ${stats.certTotal}`,
            change: "status legalitas terverifikasi",
            icon: FileText,
            color: "bg-amber-50 text-amber-600",
          },
          {
            label: "Monitoring Open",
            value: stats.openMonitor.toString(),
            change: `${stats.sitePlanActive} site plan aktif`,
            icon: AlertTriangle,
            color: "bg-rose-50 text-rose-600",
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="group border border-slate-200 bg-white shadow-[0_5px_15px_rgba(0,0,0,0.05)] rounded-2xl transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)]"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{stat.label}</CardTitle>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color} shadow-sm`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight text-slate-900">
                  {stat.value}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-slate-500">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-2 h-auto bg-transparent p-0">
          {[
            ["overview", "Overview"],
            ["input-lahan", "Input Lahan"],
            ["input-kavling", "Input Kavling"],
            ["legalitas", "Legalitas"],
            ["site-plan", "Site Plan"],
            ["harga-promo", "Harga & Promo"],
            ["monitoring", "Monitoring"],
          ].map(([value, label]) => (
            <TabsTrigger
              key={value}
              value={value}
              className="rounded-xl border border-slate-200 bg-white data-[state=active]:border-blue-300 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-slate-900 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" /> Ringkasan Operasional Inventory
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-500 mb-1">Kesiapan Publikasi Marketing</p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {stats.marketingReady} unit sudah status <strong>ready</strong>, sisanya masih review/blocked.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-500 mb-1">Legalitas Aktif</p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {stats.certDone} dokumen sudah selesai dan siap dipakai sebagai dasar rilis inventory.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-500 mb-1">Status Site Plan</p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {stats.sitePlanActive} site plan aktif. Pastikan versi yang dipakai marketing sesuai revisi terbaru.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-slate-900">
                Daftar Master Lahan
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Site</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Luas</TableHead>
                    <TableHead>Fase</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>PIC</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lands.map((land) => (
                    <TableRow key={land.id}>
                      <TableCell className="font-medium text-slate-900">{land.siteName}</TableCell>
                      <TableCell>{land.location}</TableCell>
                      <TableCell>{land.areaM2.toLocaleString("id-ID")} m²</TableCell>
                      <TableCell>{land.phase}</TableCell>
                      <TableCell>
                        <Badge className="bg-slate-100 text-slate-700 border border-slate-200">
                          {landStatusLabel[land.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>{land.pic}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="input-lahan">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-slate-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" /> Form Input Lahan Baru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitLand} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nama Site *</Label>
                  <Input
                    value={landForm.siteName}
                    onChange={(e) => setLandForm((prev) => ({ ...prev, siteName: e.target.value }))}
                    placeholder="Contoh: Site Emerald Valley"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Lokasi *</Label>
                  <Input
                    value={landForm.location}
                    onChange={(e) => setLandForm((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="Kecamatan, Kabupaten"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Luas Lahan (m²) *</Label>
                  <Input
                    type="number"
                    min={1}
                    value={landForm.areaM2}
                    onChange={(e) => setLandForm((prev) => ({ ...prev, areaM2: e.target.value }))}
                    placeholder="5000"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Fase *</Label>
                  <Input
                    value={landForm.phase}
                    onChange={(e) => setLandForm((prev) => ({ ...prev, phase: e.target.value }))}
                    placeholder="Fase 1"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Status Lahan *</Label>
                  <Select
                    value={landForm.status}
                    onValueChange={(value: LandStatus) => setLandForm((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="hold">Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>PIC Inventory *</Label>
                  <Input
                    value={landForm.pic}
                    onChange={(e) => setLandForm((prev) => ({ ...prev, pic: e.target.value }))}
                    placeholder="Nama PIC"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Catatan Internal</Label>
                  <Textarea
                    value={landForm.note}
                    onChange={(e) => setLandForm((prev) => ({ ...prev, note: e.target.value }))}
                    placeholder="Catatan legal, utilitas, atau kesiapan upload marketing"
                    rows={4}
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-3 pt-1">
                  <Button type="submit" className="inline-flex items-center gap-2">
                    <Save className="h-4 w-4" /> Simpan Data Lahan
                  </Button>
                  <Badge className="bg-blue-50 text-blue-700 border border-blue-200">
                    Frontend state only (fase 1)
                  </Badge>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="input-kavling" className="space-y-6">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-slate-900 flex items-center gap-2">
                <Home className="h-5 w-5 text-emerald-600" /> Form Input Unit Kavling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitUnit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Site/Lahan *</Label>
                  <Select
                    value={unitForm.landId}
                    onValueChange={(value) => setUnitForm((prev) => ({ ...prev, landId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih site" />
                    </SelectTrigger>
                    <SelectContent>
                      {lands.map((land) => (
                        <SelectItem key={land.id} value={land.id}>
                          {land.siteName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Blok *</Label>
                  <Input
                    value={unitForm.block}
                    onChange={(e) => setUnitForm((prev) => ({ ...prev, block: e.target.value }))}
                    placeholder="A"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Kode Unit *</Label>
                  <Input
                    value={unitForm.unitCode}
                    onChange={(e) => setUnitForm((prev) => ({ ...prev, unitCode: e.target.value }))}
                    placeholder="A-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tipe Unit *</Label>
                  <Input
                    value={unitForm.typeName}
                    onChange={(e) => setUnitForm((prev) => ({ ...prev, typeName: e.target.value }))}
                    placeholder="Astoria 150/200"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Luas Tanah (m²) *</Label>
                  <Input
                    type="number"
                    min={1}
                    value={unitForm.landArea}
                    onChange={(e) => setUnitForm((prev) => ({ ...prev, landArea: e.target.value }))}
                    placeholder="200"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Luas Bangunan (m²) *</Label>
                  <Input
                    type="number"
                    min={1}
                    value={unitForm.buildingArea}
                    onChange={(e) => setUnitForm((prev) => ({ ...prev, buildingArea: e.target.value }))}
                    placeholder="150"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Harga Unit (IDR) *</Label>
                  <Input
                    type="number"
                    min={1}
                    value={unitForm.price}
                    onChange={(e) => setUnitForm((prev) => ({ ...prev, price: e.target.value }))}
                    placeholder="2800000000"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Status Unit *</Label>
                  <Select
                    value={unitForm.status}
                    onValueChange={(value: UnitStatus) => setUnitForm((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tersedia">Tersedia</SelectItem>
                      <SelectItem value="booked">Booked</SelectItem>
                      <SelectItem value="terjual">Terjual</SelectItem>
                      <SelectItem value="nonaktif">Nonaktif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Status Sinkron ke Marketing</Label>
                  <Select
                    value={unitForm.marketingSync}
                    onValueChange={(value: MarketingSyncStatus) => setUnitForm((prev) => ({ ...prev, marketingSync: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status sinkron" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ready">Ready Publish</SelectItem>
                      <SelectItem value="review">Perlu Review</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 flex items-center gap-3 pt-1">
                  <Button type="submit" className="inline-flex items-center gap-2">
                    <Save className="h-4 w-4" /> Simpan Unit Kavling
                  </Button>
                  <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Frontend state only (fase 1)
                  </Badge>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-slate-900">Daftar Unit/Kavling</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Site</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Luas</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sync Marketing</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {units.map((unit) => (
                    <TableRow key={unit.id}>
                      <TableCell>{getLandName(unit.landId)}</TableCell>
                      <TableCell className="font-medium text-slate-900">
                        Blok {unit.block} - {unit.unitCode}
                      </TableCell>
                      <TableCell>{unit.typeName}</TableCell>
                      <TableCell>
                        LT {unit.landArea} / LB {unit.buildingArea}
                      </TableCell>
                      <TableCell>{rupiah(unit.price)}</TableCell>
                      <TableCell>
                        <Badge className="bg-slate-100 text-slate-700 border border-slate-200">
                          {unitStatusLabel[unit.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            unit.marketingSync === "ready"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : unit.marketingSync === "review"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                          }
                        >
                          {unit.marketingSync === "ready"
                            ? "Ready"
                            : unit.marketingSync === "review"
                              ? "Review"
                              : "Blocked"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legalitas" className="space-y-6">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-slate-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-amber-600" /> Form Legalitas & Sertifikat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitCertificate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Site/Lahan *</Label>
                  <Select
                    value={certificateForm.landId}
                    onValueChange={(value) => setCertificateForm((prev) => ({ ...prev, landId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih site" />
                    </SelectTrigger>
                    <SelectContent>
                      {lands.map((land) => (
                        <SelectItem key={land.id} value={land.id}>
                          {land.siteName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Jenis Dokumen *</Label>
                  <Select
                    value={certificateForm.docType}
                    onValueChange={(value: CertificateRecord["docType"]) =>
                      setCertificateForm((prev) => ({ ...prev, docType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih dokumen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sertifikat Induk">Sertifikat Induk</SelectItem>
                      <SelectItem value="Pecah Sertifikat">Pecah Sertifikat</SelectItem>
                      <SelectItem value="Balik Nama">Balik Nama</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status *</Label>
                  <Select
                    value={certificateForm.status}
                    onValueChange={(value: CertificateStatus) => setCertificateForm((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="belum">Belum</SelectItem>
                      <SelectItem value="proses">Proses</SelectItem>
                      <SelectItem value="selesai">Selesai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Target Selesai *</Label>
                  <Input
                    type="date"
                    value={certificateForm.dueDate}
                    onChange={(e) => setCertificateForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Notaris / PPAT *</Label>
                  <Input
                    value={certificateForm.notary}
                    onChange={(e) => setCertificateForm((prev) => ({ ...prev, notary: e.target.value }))}
                    placeholder="Nama notaris"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Catatan</Label>
                  <Textarea
                    rows={3}
                    value={certificateForm.note}
                    onChange={(e) => setCertificateForm((prev) => ({ ...prev, note: e.target.value }))}
                    placeholder="Catatan proses legalitas"
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-3 pt-1">
                  <Button type="submit" className="inline-flex items-center gap-2">
                    <Save className="h-4 w-4" /> Simpan Legalitas
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-slate-900">Tracking Legalitas</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Site</TableHead>
                    <TableHead>Dokumen</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Notaris</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certificates.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{getLandName(row.landId)}</TableCell>
                      <TableCell className="font-medium text-slate-900">{row.docType}</TableCell>
                      <TableCell>
                        <Badge className="bg-slate-100 text-slate-700 border border-slate-200">
                          {row.status === "belum" ? "Belum" : row.status === "proses" ? "Proses" : "Selesai"}
                        </Badge>
                      </TableCell>
                      <TableCell>{row.dueDate}</TableCell>
                      <TableCell>{row.notary}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="site-plan" className="space-y-6">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-slate-900 flex items-center gap-2">
                <Upload className="h-5 w-5 text-rose-600" /> Form Site Plan & Denah
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitSitePlan} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Site/Lahan *</Label>
                  <Select
                    value={sitePlanForm.landId}
                    onValueChange={(value) => setSitePlanForm((prev) => ({ ...prev, landId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih site" />
                    </SelectTrigger>
                    <SelectContent>
                      {lands.map((land) => (
                        <SelectItem key={land.id} value={land.id}>
                          {land.siteName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Versi Site Plan *</Label>
                  <Input
                    value={sitePlanForm.version}
                    onChange={(e) => setSitePlanForm((prev) => ({ ...prev, version: e.target.value }))}
                    placeholder="v1.0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tanggal Berlaku *</Label>
                  <Input
                    type="date"
                    value={sitePlanForm.effectiveDate}
                    onChange={(e) => setSitePlanForm((prev) => ({ ...prev, effectiveDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Status *</Label>
                  <Select
                    value={sitePlanForm.status}
                    onValueChange={(value: SitePlanRecord["status"]) => setSitePlanForm((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aktif">Aktif</SelectItem>
                      <SelectItem value="arsip">Arsip</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Catatan Revisi</Label>
                  <Textarea
                    rows={3}
                    value={sitePlanForm.note}
                    onChange={(e) => setSitePlanForm((prev) => ({ ...prev, note: e.target.value }))}
                    placeholder="Perubahan versi / keterangan file denah"
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-3 pt-1">
                  <Button type="submit" className="inline-flex items-center gap-2">
                    <Save className="h-4 w-4" /> Simpan Site Plan
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-slate-900">Riwayat Site Plan</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Site</TableHead>
                    <TableHead>Versi</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Catatan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sitePlans.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{getLandName(row.landId)}</TableCell>
                      <TableCell className="font-medium text-slate-900">{row.version}</TableCell>
                      <TableCell>{row.effectiveDate}</TableCell>
                      <TableCell>
                        <Badge className="bg-slate-100 text-slate-700 border border-slate-200">{row.status}</Badge>
                      </TableCell>
                      <TableCell>{row.note || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="harga-promo" className="space-y-6">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-slate-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" /> Form Harga & Promo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitPromo} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Site/Lahan *</Label>
                  <Select
                    value={promoForm.landId}
                    onValueChange={(value) => setPromoForm((prev) => ({ ...prev, landId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih site" />
                    </SelectTrigger>
                    <SelectContent>
                      {lands.map((land) => (
                        <SelectItem key={land.id} value={land.id}>
                          {land.siteName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tipe Unit *</Label>
                  <Input
                    value={promoForm.typeName}
                    onChange={(e) => setPromoForm((prev) => ({ ...prev, typeName: e.target.value }))}
                    placeholder="Astoria 150/200"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Harga Dasar (IDR) *</Label>
                  <Input
                    type="number"
                    min={1}
                    value={promoForm.price}
                    onChange={(e) => setPromoForm((prev) => ({ ...prev, price: e.target.value }))}
                    placeholder="2800000000"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Nama Promo *</Label>
                  <Input
                    value={promoForm.promoName}
                    onChange={(e) => setPromoForm((prev) => ({ ...prev, promoName: e.target.value }))}
                    placeholder="Early Bird"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Nilai Promo</Label>
                  <Input
                    value={promoForm.promoValue}
                    onChange={(e) => setPromoForm((prev) => ({ ...prev, promoValue: e.target.value }))}
                    placeholder="Disc 75 Juta"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Berlaku Sampai *</Label>
                  <Input
                    type="date"
                    value={promoForm.validUntil}
                    onChange={(e) => setPromoForm((prev) => ({ ...prev, validUntil: e.target.value }))}
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-3 pt-1">
                  <Button type="submit" className="inline-flex items-center gap-2">
                    <Save className="h-4 w-4" /> Simpan Harga & Promo
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-slate-900">Daftar Harga & Promo</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Site</TableHead>
                    <TableHead>Tipe Unit</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Promo</TableHead>
                    <TableHead>Nilai</TableHead>
                    <TableHead>Valid Until</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promos.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{getLandName(row.landId)}</TableCell>
                      <TableCell className="font-medium text-slate-900">{row.typeName}</TableCell>
                      <TableCell>{rupiah(row.price)}</TableCell>
                      <TableCell>{row.promoName}</TableCell>
                      <TableCell>{row.promoValue}</TableCell>
                      <TableCell>{row.validUntil}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-slate-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-indigo-600" /> Form Monitoring Dokumen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitDocMonitor} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Site/Lahan *</Label>
                  <Select
                    value={docMonitorForm.landId}
                    onValueChange={(value) => setDocMonitorForm((prev) => ({ ...prev, landId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih site" />
                    </SelectTrigger>
                    <SelectContent>
                      {lands.map((land) => (
                        <SelectItem key={land.id} value={land.id}>
                          {land.siteName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Nama Item Dokumen *</Label>
                  <Input
                    value={docMonitorForm.item}
                    onChange={(e) => setDocMonitorForm((prev) => ({ ...prev, item: e.target.value }))}
                    placeholder="Contoh: Pecah Sertifikat Blok B"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Owner *</Label>
                  <Input
                    value={docMonitorForm.owner}
                    onChange={(e) => setDocMonitorForm((prev) => ({ ...prev, owner: e.target.value }))}
                    placeholder="Legal Team"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Target Tanggal *</Label>
                  <Input
                    type="date"
                    value={docMonitorForm.dueDate}
                    onChange={(e) => setDocMonitorForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={docMonitorForm.priority}
                    onValueChange={(value: DocMonitoringRecord["priority"]) =>
                      setDocMonitorForm((prev) => ({ ...prev, priority: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={docMonitorForm.status}
                    onValueChange={(value: DocMonitoringRecord["status"]) =>
                      setDocMonitorForm((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 flex items-center gap-3 pt-1">
                  <Button type="submit" className="inline-flex items-center gap-2">
                    <Save className="h-4 w-4" /> Simpan Monitoring
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-slate-900">Daftar Monitoring Dokumen</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Site</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {docMonitors.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{getLandName(row.landId)}</TableCell>
                      <TableCell className="font-medium text-slate-900">{row.item}</TableCell>
                      <TableCell>{row.owner}</TableCell>
                      <TableCell>{row.dueDate}</TableCell>
                      <TableCell>
                        <Badge className={badgeByPriority[row.priority]}>{row.priority.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={badgeByDocStatus[row.status]}>{row.status.toUpperCase()}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}