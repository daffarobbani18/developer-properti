import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, BadgeCheck, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dummyAktivitas, dummyLeads, dummyTransaksi, dummyUnits } from "@/lib/crm-data";
import { dummyCashflow, dummyPengeluaran, dummyTagihan } from "@/lib/keuangan-data";
import { dummyKendala, dummyProyek, dummyUnit } from "@/lib/proyek-data";

type Role = "admin" | "inventory" | "sales" | "finance" | "legal" | "supervisor";

const formatCurrencyCompact = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

const totalLeads = dummyLeads.length;
const newLeads = dummyLeads.filter((lead) => lead.status === "baru").length;
const leadsFollowUp = dummyLeads.filter((lead) => lead.status === "follow-up").length;
const leadsSurvey = dummyLeads.filter((lead) => lead.status === "survey").length;

const totalTransaksi = dummyTransaksi.length;
const totalNilaiTransaksi = dummyTransaksi.reduce((sum, trx) => sum + trx.nilaiTransaksi, 0);

const totalUnits = dummyUnits.length;
const bookedUnits = dummyUnits.filter((unit) => unit.status === "booked").length;
const soldUnits = dummyUnits.filter((unit) => unit.status === "terjual").length;

const latestCashflow = dummyCashflow[dummyCashflow.length - 1];
const pendingTagihan = dummyTagihan.filter((item) => item.status === "belum_bayar" || item.status === "terlambat").length;
const overdueTagihan = dummyTagihan.filter((item) => item.status === "terlambat").length;
const totalPengeluaran = dummyPengeluaran.reduce((sum, item) => sum + item.nominal, 0);

const totalProyek = dummyProyek.length;
const avgProgressProyek = Math.round(
  dummyProyek.reduce((sum, proyek) => sum + proyek.persentaseSelesai, 0) / Math.max(dummyProyek.length, 1)
);
const totalKendalaAktif = dummyKendala.filter((item) => item.status !== "selesai").length;
const totalUnitProyek = dummyUnit.length;

const currencyShort = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

const roleSnapshots = {
  admin: [
    {
      title: "Leads Perlu Follow-up",
      items: dummyLeads.slice(0, 3).map((lead) => ({
        label: lead.nama,
        meta: `${lead.status} • ${lead.minatUnit}`,
      })),
    },
    {
      title: "Transaksi Terkini",
      items: dummyTransaksi.slice(0, 3).map((trx) => ({
        label: trx.namaPembeli,
        meta: `${trx.nomorUnit} • ${currencyShort(trx.nilaiTransaksi)}`,
      })),
    },
  ],
  inventory: [
    {
      title: "Unit Terbaru",
      items: dummyUnits.slice(0, 4).map((unit) => ({
        label: unit.nomorUnit,
        meta: `${unit.blok} • ${unit.tipe} • ${unit.status}`,
      })),
    },
    {
      title: "Proyek Aktif",
      items: dummyProyek.map((proyek) => ({
        label: proyek.nama,
        meta: `${proyek.persentaseSelesai}% selesai • ${proyek.lokasi}`,
      })),
    },
  ],
  sales: [
    {
      title: "Hot Leads",
      items: dummyLeads.filter((lead) => lead.status !== "baru").slice(0, 4).map((lead) => ({
        label: lead.nama,
        meta: `${lead.status} • PIC ${lead.salesPIC}`,
      })),
    },
    {
      title: "Aktivitas Terbaru",
      items: dummyAktivitas.slice(0, 4).map((activity) => ({
        label: activity.namaLead,
        meta: `${activity.tipe} • ${activity.tanggal}`,
      })),
    },
  ],
  finance: [
    {
      title: "Tagihan Prioritas",
      items: dummyTagihan.slice(0, 4).map((tagihan) => ({
        label: `${tagihan.customerNama} • ${tagihan.unit}`,
        meta: `${tagihan.status} • ${currencyShort(tagihan.nominal)}`,
      })),
    },
    {
      title: "Pengeluaran Terbaru",
      items: dummyPengeluaran.slice(0, 4).map((item) => ({
        label: item.keterangan,
        meta: `${item.kategori} • ${currencyShort(item.nominal)}`,
      })),
    },
  ],
  legal: [
    {
      title: "Transaksi Perlu Dokumen",
      items: dummyTransaksi.slice(0, 4).map((trx) => ({
        label: trx.namaPembeli,
        meta: `${trx.nomorUnit} • status ${trx.statusKPR}`,
      })),
    },
    {
      title: "Kendala Legal Terkini",
      items: dummyKendala.slice(0, 4).map((item) => ({
        label: item.judul,
        meta: `${item.status} • ${item.prioritas} • ${item.kategori}`,
      })),
    },
  ],
  supervisor: [
    {
      title: "Kendala Lapangan",
      items: dummyKendala.slice(0, 4).map((item) => ({
        label: item.judul,
        meta: `${item.status} • ${item.prioritas}`,
      })),
    },
    {
      title: "Unit Progres Terendah",
      items: dummyUnit.slice(0, 4).map((unit) => ({
        label: unit.nomorUnit,
        meta: `${unit.persentaseSelesai}% selesai • ${unit.status}`,
      })),
    },
  ],
} as const;

const ROLE_DASHBOARD: Record<
  Role,
  {
    title: string;
    subtitle: string;
    tone: string;
    stats: Array<{ label: string; value: string; note: string }>;
    quickLinks: Array<{ label: string; href: string; desc: string }>;
  }
> = {
  admin: {
    title: "Dashboard Admin / Direktur",
    subtitle: "Ringkasan operasional lintas divisi untuk keputusan cepat.",
    tone: "text-amber-600",
    stats: [
      { label: "Leads Aktif", value: String(totalLeads), note: `${newLeads} leads status baru` },
      { label: "Cashflow Terakhir", value: formatCurrencyCompact(latestCashflow.saldo), note: `${latestCashflow.bulan} saldo bersih` },
      { label: "Unit Terjual", value: String(soldUnits), note: `dari ${totalUnits} total unit` },
    ],
    quickLinks: [
      { label: "Ringkasan Internal", href: "#snapshot-data", desc: "Lihat snapshot lintas divisi" },
      { label: "Statistik Utama", href: "#dashboard-stats", desc: "Pantau metrik ringkas" },
      { label: "Aksi Cepat Admin", href: "#aksi-cepat", desc: "Akses panel admin yang tersedia" },
    ],
  },
  inventory: {
    title: "Dashboard Admin Inventory",
    subtitle: "Kontrol data lahan, unit kavling, dan site plan.",
    tone: "text-blue-600",
    stats: [
      { label: "Proyek Aktif", value: String(totalProyek), note: "terdaftar di modul proyek" },
      { label: "Unit Terdaftar", value: String(totalUnits), note: `${bookedUnits} unit status booked` },
      { label: "Progress Proyek", value: `${avgProgressProyek}%`, note: "rata-rata penyelesaian proyek" },
    ],
    quickLinks: [
      { label: "Kelola Inventory", href: "/inventory", desc: "Update unit dan harga" },
      { label: "Monitoring Proyek", href: "/proyek", desc: "Sinkronisasi data unit" },
      { label: "Unit Proyek", href: "/proyek/PRJ001/unit", desc: "Lihat detail progres unit" },
    ],
  },
  sales: {
    title: "Dashboard Sales & Marketing",
    subtitle: "Fokus ke leads, booking unit, dan jadwal site visit.",
    tone: "text-emerald-600",
    stats: [
      { label: "Leads Baru", value: String(newLeads), note: `dari total ${totalLeads} leads` },
      { label: "Follow Up", value: String(leadsFollowUp), note: `${leadsSurvey} leads siap survey` },
      { label: "Booking", value: String(bookedUnits), note: `${totalTransaksi} transaksi aktif` },
    ],
    quickLinks: [
      { label: "Buka CRM", href: "/crm", desc: "Kelola semua calon pembeli" },
      { label: "Daftar Leads", href: "/crm/leads", desc: "Input & segmentasi leads" },
      { label: "Pipeline", href: "/crm/pipeline", desc: "Pantau tahap penjualan" },
    ],
  },
  finance: {
    title: "Dashboard Finance & Accounting",
    subtitle: "Verifikasi transaksi dan kontrol arus kas proyek.",
    tone: "text-cyan-600",
    stats: [
      { label: "Pending Verifikasi", value: String(pendingTagihan), note: "tagihan belum lunas/terlambat" },
      { label: "Tagihan Terlambat", value: String(overdueTagihan), note: "perlu follow-up segera" },
      { label: "Kas Bersih", value: formatCurrencyCompact(latestCashflow.saldo), note: `${latestCashflow.bulan} bulan berjalan` },
    ],
    quickLinks: [
      { label: "Buka Finance", href: "/finance", desc: "Verifikasi & kuitansi" },
      { label: "Cashflow", href: "/keuangan/cashflow", desc: "Laporan arus kas" },
      { label: "Tagihan", href: "/keuangan/tagihan", desc: "Pantau cicilan pembeli" },
    ],
  },
  legal: {
    title: "Dashboard Tim Legal",
    subtitle: "Monitoring legalitas dokumen pelanggan dan proyek.",
    tone: "text-violet-600",
    stats: [
      { label: "Transaksi Proses", value: String(totalTransaksi), note: "berpotensi masuk proses legal" },
      { label: "Unit Terjual", value: String(soldUnits), note: "butuh dokumen lanjutan" },
      { label: "Kendala Legal", value: String(totalKendalaAktif), note: "issue proyek belum selesai" },
    ],
    quickLinks: [
      { label: "Buka Legal", href: "/legal", desc: "Kelola dokumen legal" },
      { label: "Monitoring Proyek", href: "/proyek", desc: "Sinkronisasi status unit" },
      { label: "Unit Proyek", href: "/proyek/PRJ001/unit", desc: "Lihat unit yang butuh follow-up legal" },
    ],
  },
  supervisor: {
    title: "Dashboard Pengawas Lapangan",
    subtitle: "Pantau progres pembangunan fisik dan kendala lapangan.",
    tone: "text-rose-600",
    stats: [
      { label: "Progress Rata-rata", value: `${avgProgressProyek}%`, note: "fase konstruksi aktif" },
      { label: "Kendala Aktif", value: String(totalKendalaAktif), note: "butuh tindakan lapangan" },
      { label: "Unit Dipantau", value: String(totalUnitProyek), note: `${totalProyek} proyek berjalan` },
    ],
    quickLinks: [
      { label: "Buka Supervisor", href: "/supervisor", desc: "Kelola laporan lapangan" },
      { label: "Monitoring Proyek", href: "/proyek", desc: "Cek milestone proyek" },
      { label: "Unit Proyek", href: "/proyek/PRJ001/unit", desc: "Lihat status unit" },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(ROLE_DASHBOARD).map((role) => ({ role }));
}

export default async function RoleDashboardPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;

  if (!(role in ROLE_DASHBOARD)) {
    notFound();
  }

  const dashboard = ROLE_DASHBOARD[role as Role];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.06),transparent_40%)]" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-amber-700">
              <Sparkles size={11} className="text-amber-500" /> Portal Manajemen
            </div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
              {dashboard.title}
            </h1>
            <p className="max-w-2xl text-sm text-zinc-500 leading-relaxed">{dashboard.subtitle}</p>
          </div>
          <div className="shrink-0">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 shadow-sm">
              <Sparkles size={28} className="text-amber-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Stat Cards */}
      <div id="dashboard-stats" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {dashboard.stats.map((stat, idx) => (
          <div key={stat.label} className="group rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <div className="mb-4 flex items-start justify-between">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                idx === 0 ? "bg-amber-50" : idx === 1 ? "bg-blue-50" : "bg-emerald-50"
              }`}>
                <Sparkles size={20} className={
                  idx === 0 ? "text-amber-500" : idx === 1 ? "text-blue-500" : "text-emerald-500"
                } />
              </div>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-zinc-900">{stat.value}</p>
            <p className="mt-1 text-xs text-zinc-500">{stat.note}</p>
          </div>
        ))}
      </div>

      {/* Aksi Cepat */}
      <div id="aksi-cepat">
        <h2 className="mb-4 text-lg font-bold text-zinc-900">Aksi Cepat</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {dashboard.quickLinks.map((item) => (
            <Link key={item.href + item.label} href={item.href}>
              <div className="group flex h-full flex-col rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_8px_25px_rgba(245,158,11,0.12)]">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-100 bg-zinc-50 transition-colors group-hover:border-amber-200 group-hover:bg-amber-50">
                  <ArrowUpRight className="h-5 w-5 text-zinc-400 transition-colors group-hover:text-amber-500" />
                </div>
                <p className="text-sm font-semibold text-zinc-900 transition-colors group-hover:text-amber-600">{item.label}</p>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-zinc-500">{item.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-amber-200/60 bg-amber-50/60 px-3 py-1.5 text-[11px] font-medium text-amber-600 transition-colors group-hover:bg-amber-100">
                  <BadgeCheck className="h-3.5 w-3.5" /> Buka Modul
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Snapshot Data */}
      <div id="snapshot-data">
        <h2 className="mb-4 text-lg font-bold text-zinc-900">Snapshot Data</h2>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {roleSnapshots[role as Role].map((section) => (
            <div key={section.title} className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
              <div className="border-b border-zinc-100 px-6 py-4">
                <h3 className="text-sm font-bold text-zinc-900">{section.title}</h3>
              </div>
              <div className="divide-y divide-zinc-50 p-4">
                {section.items.map((item) => (
                  <div key={item.label} className="group flex items-start justify-between gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-zinc-50">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-900">{item.label}</p>
                      <p className="mt-0.5 truncate text-xs text-zinc-400">{item.meta}</p>
                    </div>
                    <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-zinc-300 transition-colors group-hover:text-amber-500" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
