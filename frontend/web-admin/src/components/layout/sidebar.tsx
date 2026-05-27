"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SquaresFour,
  UsersThree,
  CurrencyDollar,
  Kanban,
  HardHat,
  Stamp,
  X,
  CaretDown,
  UsersFour,
  HouseSimple,
  Receipt,
  Pulse,
  Buildings,
  SignOut,
  ChartLineUp,
  Wallet,
  Invoice,
  ListChecks,
} from "@phosphor-icons/react";
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
    items: [{ label: "Dashboard", href: "/", icon: SquaresFour, roles: USER_ROLES }],
  },
  {
    group: "Operasional",
    items: [
      {
        label: "Admin Inventory",
        href: "/inventory",
        icon: Buildings,
        roles: ["inventory"],
      },
      {
        label: "Sales & Marketing",
        href: "/sales",
        icon: UsersThree,
        roles: ["sales"],
        children: [
          { label: "Leads", href: "/crm/leads", icon: UsersFour, roles: ["sales"] },
          { label: "Pipeline", href: "/crm/pipeline", icon: Kanban, roles: ["sales"] },
          { label: "Unit", href: "/crm/unit", icon: HouseSimple, roles: ["sales"] },
          { label: "Transaksi", href: "/crm/transaksi", icon: Receipt, roles: ["sales"] },
          { label: "Aktivitas", href: "/crm/aktivitas", icon: Pulse, roles: ["sales"] },
        ],
      },
      {
        label: "Finance & Accounting",
        href: "/finance",
        icon: CurrencyDollar,
        roles: ["finance"],
        children: [
          { label: "Cashflow", href: "/keuangan/cashflow", icon: ChartLineUp, roles: ["finance"] },
          { label: "Tagihan", href: "/keuangan/tagihan", icon: Receipt, roles: ["finance"] },
          { label: "Pengeluaran", href: "/keuangan/pengeluaran", icon: Wallet, roles: ["finance"] },
          { label: "RAB & Realisasi", href: "/keuangan/rab", icon: ListChecks, roles: ["finance"] },
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
        icon: Stamp,
        roles: ["legal"],
      },
      {
        label: "Monitoring Proyek",
        href: "/proyek",
        icon: Buildings,
        roles: ["supervisor", "inventory"],
        children: [{ label: "Daftar Proyek", href: "/proyek", icon: Buildings, roles: ["supervisor", "inventory"] }],
      },
    ],
  },
];

const roleLabels: Record<UserRole, string> = {
  admin: "Administrator",
  inventory: "Admin Inventory",
  sales: "Sales & Marketing",
  finance: "Finance & Accounting",
  legal: "Legal & Perizinan",
  supervisor: "Pengawas Lapangan",
};

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

  // Auto-expand menus whose children match the current path
  useEffect(() => {
    const autoExpand: string[] = [];
    menuItems.forEach((group) => {
      group.items.forEach((item) => {
        if (item.children?.some((child) => pathname === child.href || pathname.startsWith(child.href + "/"))) {
          autoExpand.push(item.href);
        }
      });
    });
    if (autoExpand.length > 0) {
      setExpandedMenus((prev) => {
        const merged = new Set([...prev, ...autoExpand]);
        return Array.from(merged);
      });
    }
  }, [pathname]);

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
      }) as MenuGroup[];
  }, [currentRole]);

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
    <aside className="relative z-20 flex h-full w-64 flex-col bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 sidebar-glow transition-all duration-300">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.06] px-5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500 blur-md opacity-20 rounded-lg group-hover:opacity-30 transition-opacity" />
            <div className="relative flex h-8 w-8 rotate-45 items-center justify-center rounded-lg border border-amber-500/40 bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
              <span className="font-[family-name:var(--font-heading)] text-base font-bold text-transparent bg-clip-text bg-gradient-to-br from-amber-200 to-amber-500 -rotate-45">G</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-[family-name:var(--font-heading)] text-sm tracking-wider text-white">
              Griya<span className="font-light text-zinc-400">Persada</span>
            </span>
            {currentRole !== "guest" && (
              <span className="text-[9px] text-amber-500/80 uppercase tracking-[0.15em] font-medium">
                {roleLabels[currentRole]}
              </span>
            )}
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 p-1.5 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white md:hidden"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-5 overflow-y-auto custom-scrollbar px-3 py-4">
        {filteredMenuItems.map((group) => (
          <div key={group.group}>
            <p className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-600">{group.group}</p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const hasChildren = Boolean(item.children?.length);
                const isExpanded = expandedMenus.includes(item.href);
                const isActive = pathname === item.href || item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href + "/"));
                const isExactActive = pathname === item.href;

                return (
                  <li key={item.href}>
                    {hasChildren ? (
                      <>
                        <button
                          onClick={() => toggleExpand(item.href)}
                          className={cn(
                            "group flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-200",
                            isActive
                              ? "bg-amber-500/10 text-amber-400"
                              : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                          )}
                        >
                          <span className="flex items-center gap-3 text-[13px] font-medium">
                            <item.icon weight="duotone" className={cn("h-[17px] w-[17px] shrink-0", isActive ? "text-amber-400" : "text-zinc-500 group-hover:text-zinc-400")} />
                            {item.label}
                          </span>
                          <CaretDown className={cn("h-3.5 w-3.5 transition-transform duration-300", isExpanded ? "rotate-180 text-amber-400" : "text-zinc-600")} />
                        </button>
                        <div
                          className={cn(
                            "overflow-hidden transition-all duration-300",
                            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                          )}
                        >
                          <ul className="mt-1 ml-5 space-y-0.5 border-l border-white/[0.06] pl-3">
                            {item.children?.map((child) => {
                              const isChildActive = pathname === child.href || pathname.startsWith(child.href + "/");

                              return (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    onClick={onClose}
                                    className={cn(
                                      "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200",
                                      isChildActive
                                        ? "text-amber-400 bg-amber-500/[0.08]"
                                        : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]"
                                    )}
                                  >
                                    <child.icon weight="duotone" className={cn("h-[14px] w-[14px] shrink-0", isChildActive ? "text-amber-400" : "text-zinc-600 group-hover:text-zinc-400")} />
                                    {child.label}
                                    {isChildActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]" />}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
                          isExactActive
                            ? "bg-amber-500/10 text-amber-400"
                            : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                        )}
                      >
                        <item.icon weight="duotone" className={cn("h-[17px] w-[17px] shrink-0", isExactActive ? "text-amber-400" : "text-zinc-500 group-hover:text-zinc-400")} />
                        <span className={cn("text-[13px] font-medium", isExactActive && "text-amber-400")}>{item.label}</span>
                        {isExactActive && <div className="ml-auto h-5 w-1 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"></div>}
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
      <div className="border-t border-white/[0.06] p-4">
        <button
          type="button"
          onClick={() => setShowLogoutConfirm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-[13px] font-medium text-zinc-500 transition-all hover:bg-white/[0.06] hover:text-rose-400 hover:border-rose-500/20"
        >
          <SignOut className="h-4 w-4" /> Keluar
        </button>
        <p className="mt-3 text-center text-[9px] tracking-[0.15em] text-zinc-700 uppercase">Griya Persada &copy; 2026</p>
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
