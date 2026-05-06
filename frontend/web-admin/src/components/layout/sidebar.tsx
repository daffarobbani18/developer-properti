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
    <aside className="relative z-20 flex h-full w-64 flex-col bg-zinc-950 transition-all duration-300">
      <div className="flex h-24 shrink-0 items-center justify-between border-b border-white/5 px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 rotate-45 items-center justify-center rounded-lg border border-amber-500/50 bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <span className="font-serif text-lg font-bold text-transparent bg-clip-text bg-gradient-to-br from-amber-200 to-amber-500 -rotate-45">G</span>
          </div>
          <span className="font-serif text-sm tracking-widest text-white uppercase">
            Griya<span className="font-light">Persada</span>
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 p-2 text-zinc-300 transition-colors hover:bg-white/5 hover:text-white md:hidden"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {filteredMenuItems.map((group) => (
          <div key={group.group}>
            <p className="mb-4 px-4 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">{group.group}</p>
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
                            "group flex w-full items-center justify-between rounded-xl px-4 py-3 transition-all duration-300",
                            isActive
                              ? "bg-amber-500/10 text-amber-500"
                              : "text-zinc-400 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          <span className="flex items-center gap-3 text-sm font-medium">
                            <item.icon className={cn("h-[18px] w-[18px] shrink-0", isActive ? "text-amber-500" : "text-zinc-500 group-hover:text-zinc-300")} />
                            {item.label}
                          </span>
                          <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isExpanded ? "rotate-180" : "opacity-50")} />
                        </button>
                        {isExpanded && item.children && (
                          <ul className="mt-2 ml-6 space-y-1 border-l border-white/10 pl-4">
                            {item.children.map((child) => {
                              const isChildActive = pathname === child.href;

                              return (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    onClick={onClose}
                                    className={cn(
                                      "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300",
                                      isChildActive
                                        ? "text-amber-500"
                                        : "text-zinc-500 hover:text-white"
                                    )}
                                  >
                                    <child.icon className={cn("h-[14px] w-[14px] shrink-0", isChildActive ? "text-amber-500" : "text-zinc-500 group-hover:text-zinc-300")} />
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
                          "group flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300",
                          isExactActive
                            ? "bg-amber-500/10 text-amber-500"
                            : "text-zinc-400 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <item.icon className={cn("h-[18px] w-[18px] shrink-0", isExactActive ? "text-amber-500" : "text-zinc-500 group-hover:text-zinc-300")} />
                        <span className={cn("text-sm font-medium", isExactActive && "text-amber-500")}>{item.label}</span>
                        {isExactActive && <div className="ml-auto h-5 w-1 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/5 p-6">
        <button
          type="button"
          onClick={() => setShowLogoutConfirm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-transparent px-4 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-rose-500"
        >
          <LogOut className="h-4 w-4" /> Keluar
        </button>
        <p className="mt-4 text-center text-[10px] tracking-wider text-zinc-600">GRIYA PERSADA &copy; 2026</p>
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
