"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ROLE_HOME, USER_ROLES, readRoleFromAuthPayload, type UserRole } from "@/lib/access";

type RoleWithGuest = UserRole | "guest";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
  children?: { label: string; href: string; icon: React.ElementType; roles: UserRole[] }[];
}

interface MenuGroup {
  group: string;
  items: MenuItem[];
}

const menuItems: MenuGroup[] = [
  {
    group: "Utama",
    items: [{ label: "Dashboard", href: "/", icon: LayoutDashboard, roles: USER_ROLES }],
  },
  {
    group: "Operasional",
    items: [
      {
        label: "Admin Inventory",
        href: "/inventory",
        icon: Building2,
        roles: ["inventory"],
      },
      {
        label: "Sales & Marketing",
        href: "/sales",
        icon: Users,
        roles: ["sales"],
        children: [
          { label: "Leads", href: "/crm/leads", icon: Users, roles: ["sales"] },
          { label: "Pipeline", href: "/crm/pipeline", icon: KanbanSquare, roles: ["sales"] },
          { label: "Unit", href: "/crm/unit", icon: Home, roles: ["sales"] },
          { label: "Transaksi", href: "/crm/transaksi", icon: Receipt, roles: ["sales"] },
          { label: "Aktivitas", href: "/crm/aktivitas", icon: Activity, roles: ["sales"] },
        ],
      },
      {
        label: "Finance & Accounting",
        href: "/finance",
        icon: Banknote,
        roles: ["finance"],
        children: [
          { label: "Cashflow", href: "/keuangan/cashflow", icon: Activity, roles: ["finance"] },
          { label: "Tagihan", href: "/keuangan/tagihan", icon: Receipt, roles: ["finance"] },
          { label: "Pengeluaran", href: "/keuangan/pengeluaran", icon: Receipt, roles: ["finance"] },
          { label: "RAB & Realisasi", href: "/keuangan/rab", icon: FolderKanban, roles: ["finance"] },
        ],
      },
      {
        label: "Pengawas Lapangan",
        href: "/supervisor",
        icon: HardHat,
        roles: ["supervisor"],
      },
      {
        label: "Legal & Perizinan",
        href: "/legal",
        icon: FileCheck,
        roles: ["legal"],
      },
      {
        label: "Monitoring Proyek",
        href: "/proyek",
        icon: Building2,
        roles: ["supervisor", "inventory"],
        children: [{ label: "Daftar Proyek", href: "/proyek", icon: Building2, roles: ["supervisor", "inventory"] }],
      },
    ],
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState<RoleWithGuest>("guest");
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const readStoredRole = (): RoleWithGuest => {
      try {
        const localAuth = localStorage.getItem("simdp_auth");
        const sessionAuth = sessionStorage.getItem("simdp_auth");
        const authRaw = localAuth ?? sessionAuth;

        if (!authRaw) {
          return "guest";
        }

        const role = readRoleFromAuthPayload(authRaw);
        return role ?? "guest";
      } catch {
        return "guest";
      }
    };

    setCurrentRole(readStoredRole());
  }, []);

  const filteredMenuItems = useMemo(() => {
    if (currentRole === "guest") {
      return [] as MenuGroup[];
    }

    return menuItems
      .map((group) => {
        const items = group.items
          .filter((item) => item.roles.includes(currentRole))
          .map((item) => ({
            ...item,
            href: item.label === "Dashboard" ? ROLE_HOME[currentRole] : item.href,
            children: item.children?.filter((child) => child.roles.includes(currentRole)),
          }))
          .filter((item) => !item.children || item.children.length > 0 || item.label === "Dashboard");

        return {
          ...group,
          items,
        };
      })
      .filter((group) => group.items.length > 0);
  }, [currentRole]);

  useEffect(() => {
    const expanded: string[] = [];
    filteredMenuItems.forEach((group) =>
      group.items.forEach((item) => {
        if (item.children?.some((c) => pathname.startsWith(c.href))) {
          expanded.push(item.href);
        }
      })
    );
    setExpandedMenus(expanded);
  }, [pathname, filteredMenuItems]);

  const toggleExpand = (href: string) => {
    setExpandedMenus((prev) => (prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]));
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("simdp_auth");
      sessionStorage.removeItem("simdp_auth");
      document.cookie = "simdp_role=; path=/; max-age=0; samesite=lax";
      document.cookie = "simdp_email=; path=/; max-age=0; samesite=lax";
    } catch {
      // Ignore storage/cookie errors and continue redirect.
    }

    onClose?.();
    setShowLogoutConfirm(false);
    router.replace("/login");
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white text-slate-900 shadow-[0_0_20px_rgba(0,0,0,0.08)] backdrop-blur-2xl">
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-50 font-[family-name:var(--font-heading)] text-sm font-bold text-slate-900 shadow-sm shadow-black/5">
            <span className="absolute inset-0 rounded-2xl bg-amber-500/5 blur-md" />
            <span className="relative">S</span>
          </div>
          <span className="font-[family-name:var(--font-heading)] text-lg font-bold tracking-tight text-slate-900">SIMDP</span>
        </Link>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 md:hidden"
          >
            <X className="h-5 w-5 text-slate-700" />
          </Button>
        )}
      </div>

      <Separator className="bg-slate-200" />

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {filteredMenuItems.map((group) => (
          <div key={group.group}>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{group.group}</p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const hasChildren = Boolean(item.children?.length);
                const isExpanded = expandedMenus.includes(item.href);
                const isActive = pathname === item.href || item.children?.some((c) => pathname === c.href);
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
                              ? "border border-amber-200/50 bg-amber-50 text-amber-600"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <item.icon className={cn("h-[18px] w-[18px] shrink-0", isActive ? "text-amber-600" : "text-slate-600")} />
                            {item.label}
                          </span>
                          <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform duration-200", isExpanded && "rotate-180")} />
                        </button>
                        {isExpanded && item.children && (
                          <ul className="mt-1 ml-4 space-y-0.5 border-l border-slate-200 pl-3">
                            {item.children.map((child) => {
                              const isChildActive = pathname === child.href;

                              return (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    onClick={onClose}
                                    className={cn(
                                      "flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-200 ease-in-out",
                                      isChildActive
                                        ? "border border-amber-200/50 bg-amber-50 text-amber-600 shadow-sm"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                  >
                                    <child.icon className={cn("h-4 w-4 shrink-0", isChildActive ? "text-amber-600" : "text-slate-600")} />
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
                            ? "border border-amber-200/50 bg-amber-50 text-amber-600 shadow-sm"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        <item.icon className={cn("h-[18px] w-[18px] shrink-0", isExactActive ? "text-amber-600" : "text-slate-600")} />
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

      <div className="border-t border-slate-200 p-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowLogoutConfirm(true)}
          className="mb-3 h-9 w-full justify-center gap-2 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-rose-600"
        >
          <LogOut className="h-4 w-4" /> Keluar
        </Button>
        <p className="text-center text-[11px] text-slate-500">SIMDP v1.0 &copy; 2026</p>
      </div>

      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Keluar dari sesi?</DialogTitle>
            <DialogDescription>
              Anda akan keluar dari portal ERP dan perlu login ulang untuk melanjutkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowLogoutConfirm(false)}>
              Batal
            </Button>
            <Button type="button" variant="destructive" onClick={handleLogout}>
              Ya, Keluar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
