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
      { label: "Masuk CRM", href: "/crm", desc: "Kelola pipeline dan follow-up" },
      { label: "Masuk Keuangan", href: "/finance", desc: "Verifikasi pembayaran" },
      { label: "Masuk Proyek", href: "/proyek", desc: "Pantau progress lapangan" },
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
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-2xl md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.07),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.04),transparent_25%)]" />
        <div className="relative space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-slate-600">
            <Sparkles size={12} className={dashboard.tone} /> Role Dashboard
          </div>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-5xl font-semibold tracking-tight text-slate-900 leading-tight">
            {dashboard.title}
          </h1>
          <p className="max-w-2xl text-sm md:text-base text-slate-600 leading-relaxed">{dashboard.subtitle}</p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {dashboard.stats.map((stat) => (
          <Card key={stat.label} className="rounded-2xl border border-slate-200 bg-white shadow-[0_5px_15px_rgba(0,0,0,0.05)]">
            <CardContent className="p-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
              <p className="mt-2 text-3xl font-[family-name:var(--font-heading)] font-semibold text-slate-900">{stat.value}</p>
              <p className="mt-1 text-xs text-slate-600">{stat.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="mb-4 font-[family-name:var(--font-heading)] text-lg font-semibold tracking-tight text-slate-900">Aksi Cepat</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {dashboard.quickLinks.map((item) => (
            <Link key={item.href + item.label} href={item.href}>
              <Card className="group h-full rounded-2xl border border-slate-200 bg-white shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)]">
                <CardContent className="p-5">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                    <ArrowUpRight className="h-4 w-4 text-slate-600 group-hover:text-amber-600" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-amber-600">{item.label}</p>
                  <p className="mt-1 text-xs text-slate-600">{item.desc}</p>
                  <Badge className="mt-3 rounded-md border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-100">
                    <BadgeCheck className="mr-1 h-3.5 w-3.5" /> Buka Modul
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
