"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { CaretRight, House } from "@phosphor-icons/react";

const pathLabels: Record<string, string> = {
  dashboard: "Dashboard",
  admin: "Admin",
  inventory: "Inventory",
  sales: "Sales & Marketing",
  finance: "Finance & Accounting",
  legal: "Legal & Perizinan",
  supervisor: "Pengawas Lapangan",
  crm: "CRM",
  leads: "Leads",
  pipeline: "Pipeline",
  unit: "Unit",
  transaksi: "Transaksi",
  aktivitas: "Aktivitas",
  keuangan: "Keuangan",
  cashflow: "Cashflow",
  tagihan: "Tagihan",
  pengeluaran: "Pengeluaran",
  rab: "RAB & Realisasi",
  proyek: "Proyek",
  kendala: "Kendala",
  milestone: "Milestone",
  tim: "Tim",
};

const pageTitles: Record<string, string> = {
  "/dashboard/admin": "Dashboard Admin",
  "/dashboard/inventory": "Dashboard Inventory",
  "/dashboard/sales": "Dashboard Sales",
  "/dashboard/finance": "Dashboard Finance",
  "/dashboard/legal": "Dashboard Legal",
  "/dashboard/supervisor": "Dashboard Pengawas",
  "/inventory": "Admin Inventory",
  "/sales": "Sales & Marketing",
  "/finance": "Finance & Accounting",
  "/supervisor": "Pengawas Lapangan",
  "/legal": "Legal & Perizinan",
  "/crm": "CRM & Sales",
  "/crm/leads": "Daftar Leads",
  "/crm/pipeline": "Pipeline Penjualan",
  "/crm/unit": "Manajemen Unit",
  "/crm/transaksi": "Transaksi",
  "/crm/aktivitas": "Aktivitas Sales",
  "/keuangan": "Keuangan",
  "/keuangan/cashflow": "Arus Kas",
  "/keuangan/tagihan": "Tagihan",
  "/keuangan/pengeluaran": "Pengeluaran",
  "/keuangan/rab": "RAB & Realisasi",
  "/proyek": "Monitoring Proyek",
};

export function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];

  // For dynamic routes like /proyek/[id]/kendala
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0) {
    const last = segments[segments.length - 1];
    return pathLabels[last] || last.charAt(0).toUpperCase() + last.slice(1);
  }
  return "Dashboard";
}

export default function Breadcrumb() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    const isLast = index === segments.length - 1;

    return { href, label, isLast };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      <Link
        href="/"
        className="flex items-center gap-1 text-zinc-400 hover:text-zinc-600 transition-colors"
      >
        <House weight="duotone" size={14} />
      </Link>
      {breadcrumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          <CaretRight weight="duotone" size={12} className="text-zinc-300" />
          {crumb.isLast ? (
            <span className="font-medium text-zinc-700 truncate max-w-[200px]">
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="text-zinc-400 hover:text-zinc-600 transition-colors truncate max-w-[150px]"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
