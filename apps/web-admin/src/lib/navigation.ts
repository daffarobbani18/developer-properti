import type { Role } from "./types";

export type NavItem = {
  href: string;
  label: string;
  roles: Role[];
};

export const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    roles: [
      "DIRECTOR",
      "SALES_MANAGER",
      "SALES",
      "FINANCE_MANAGER",
      "FINANCE_ADMIN",
      "PROJECT_MANAGER",
      "SITE_ENGINEER",
      "LEGAL_ADMIN"
    ]
  },
  {
    href: "/crm/leads",
    label: "CRM Leads",
    roles: ["DIRECTOR", "SALES_MANAGER", "SALES"]
  },
  {
    href: "/crm/pipeline",
    label: "Pipeline",
    roles: ["DIRECTOR", "SALES_MANAGER", "SALES"]
  },
  {
    href: "/crm/units",
    label: "Unit & Kavling",
    roles: ["DIRECTOR", "SALES_MANAGER", "SALES"]
  },
  {
    href: "/keuangan/invoices",
    label: "Tagihan",
    roles: ["DIRECTOR", "FINANCE_MANAGER", "FINANCE_ADMIN"]
  },
  {
    href: "/keuangan/cashflow",
    label: "Cashflow",
    roles: ["DIRECTOR", "FINANCE_MANAGER", "FINANCE_ADMIN"]
  },
  {
    href: "/proyek/milestone",
    label: "Milestone",
    roles: ["DIRECTOR", "PROJECT_MANAGER", "SITE_ENGINEER"]
  },
  {
    href: "/vendor/tagihan",
    label: "Vendor",
    roles: ["DIRECTOR", "FINANCE_MANAGER", "PROJECT_MANAGER"]
  },
  {
    href: "/legal/dokumen",
    label: "Legal",
    roles: ["DIRECTOR", "LEGAL_ADMIN", "PROJECT_MANAGER"]
  }
];
