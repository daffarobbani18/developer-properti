"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Banknote,
  FolderKanban,
  HardHat,
  FileCheck,
  X,
  ChevronDown,
  KanbanSquare,
  Home,
  Receipt,
  Activity,
  Building2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: { label: string; href: string; icon: React.ElementType }[];
}

interface MenuGroup {
  group: string;
  items: MenuItem[];
}

const menuItems: MenuGroup[] = [
  {
    group: "Utama",
    items: [{ label: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  {
    group: "Operasional",
    items: [
      {
        label: "Admin Inventory",
        href: "/inventory",
        icon: Building2,
      },
      {
        label: "Sales & Marketing",
        href: "/sales",
        icon: Users,
        children: [
          { label: "Leads", href: "/crm/leads", icon: Users },
          { label: "Pipeline", href: "/crm/pipeline", icon: KanbanSquare },
          { label: "Unit", href: "/crm/unit", icon: Home },
          { label: "Transaksi", href: "/crm/transaksi", icon: Receipt },
          { label: "Aktivitas", href: "/crm/aktivitas", icon: Activity },
        ],
      },
      {
        label: "Finance & Accounting",
        href: "/finance",
        icon: Banknote,
        children: [
          { label: "Cashflow", href: "/keuangan/cashflow", icon: Activity },
          { label: "Tagihan", href: "/keuangan/tagihan", icon: Receipt },
          { label: "Pengeluaran", href: "/keuangan/pengeluaran", icon: Receipt },
          { label: "RAB & Realisasi", href: "/keuangan/rab", icon: FolderKanban },
        ],
      },
      {
        label: "Pengawas Lapangan",
        href: "/supervisor",
        icon: HardHat,
      },
      {
        label: "Legal & Perizinan",
        href: "/legal",
        icon: FileCheck,
      },
      {
        label: "Monitoring Proyek",
        href: "/proyek",
        icon: Building2,
        children: [
          { label: "Daftar Proyek", href: "/proyek", icon: Building2 },
        ],
      },
    ],
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(() => {
    // Auto-expand if on a child route
    const expanded: string[] = [];
    menuItems.forEach((group) =>
      group.items.forEach((item) => {
        if (item.children?.some((c) => pathname.startsWith(c.href))) {
          expanded.push(item.href);
        }
      })
    );
    return expanded;
  });

  const toggleExpand = (href: string) => {
    setExpandedMenus((prev) =>
      prev.includes(href)
        ? prev.filter((h) => h !== href)
        : [...prev, href]
    );
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white backdrop-blur-2xl text-slate-900 shadow-[0_0_20px_rgba(0,0,0,0.08)]">
      {/* Logo & Brand */}
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-50 text-slate-900 font-[family-name:var(--font-heading)] font-bold text-sm shadow-sm shadow-black/5">
            <span className="absolute inset-0 rounded-2xl bg-amber-500/5 blur-md" />
            <span className="relative">S</span>
          </div>
          <span className="font-[family-name:var(--font-heading)] font-bold text-lg tracking-tight text-slate-900">
            SIMDP
          </span>
        </Link>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-700" />
          </Button>
        )}
      </div>

      <Separator className="bg-slate-200" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {menuItems.map((group) => (
          <div key={group.group}>
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {group.group}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const hasChildren = !!item.children?.length;
                const isExpanded = expandedMenus.includes(item.href);
                const isActive =
                  pathname === item.href ||
                  item.children?.some((c) => pathname === c.href);
                const isExactActive = pathname === item.href;

                return (
                  <li key={item.href}>
                    {hasChildren ? (
                      <>
                        <button
                          onClick={() => toggleExpand(item.href)}
                          className={cn(
                            "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
                            isActive
                              ? "bg-amber-50 text-amber-600 border border-amber-200/50"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <item.icon
                              className={cn(
                                "h-[18px] w-[18px] shrink-0",
                                isActive ? "text-amber-600" : "text-slate-600"
                              )}
                            />
                            {item.label}
                          </span>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 text-slate-400 transition-transform duration-200",
                              isExpanded && "rotate-180"
                            )}
                          />
                        </button>
                        {isExpanded && (
                          <ul className="mt-1 ml-4 space-y-0.5 border-l border-slate-200 pl-3">
                            {item.children!.map((child) => {
                              const isChildActive = pathname === child.href;
                              return (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    onClick={onClose}
                                    className={cn(
                                      "flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-200 ease-in-out",
                                      isChildActive
                                        ? "bg-amber-50 text-amber-600 shadow-sm border border-amber-200/50"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                  >
                                    <child.icon
                                      className={cn(
                                        "h-4 w-4 shrink-0",
                                        isChildActive
                                          ? "text-amber-600"
                                          : "text-slate-600"
                                      )}
                                    />
                                    {child.label}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
                          isExactActive
                            ? "bg-amber-50 text-amber-600 shadow-sm border border-amber-200/50"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-[18px] w-[18px] shrink-0",
                            isExactActive ? "text-amber-600" : "text-slate-600"
                          )}
                        />
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 p-4">
        <p className="text-[11px] text-slate-500 text-center">
          SIMDP v1.0 &copy; 2026
        </p>
      </div>
    </aside>
  );
}
