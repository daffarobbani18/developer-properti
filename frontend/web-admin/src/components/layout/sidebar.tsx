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
  House,
  Package,
  MapTrifold,
  FileText,
  Bank,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
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
        label: "Daftar Proyek",
        href: "/admin/proyek",
        icon: Buildings,
        roles: ["inventory", "admin"],
      },
      {
        label: "Tipe Rumah",
        href: "/admin/tipe-rumah",
        icon: House,
        roles: ["inventory", "admin"],
      },
      {
        label: "Kavling & Unit",
        href: "/admin/kavling-unit",
        icon: Package,
        roles: ["inventory", "admin"],
      },
      {
        label: "Site Plan",
        href: "/admin/site-plan",
        icon: MapTrifold,
        roles: ["inventory", "admin"],
      },
      {
        label: "Leads",
        href: "/sales/leads",
        icon: UsersFour,
        roles: ["sales"],
      },
      {
        label: "Pipeline",
        href: "/sales/pipeline",
        icon: Kanban,
        roles: ["sales"],
      },
      {
        label: "Unit",
        href: "/sales/unit",
        icon: HouseSimple,
        roles: ["sales"],
      },
      {
        label: "Transaksi",
        href: "/sales/transaksi",
        icon: Receipt,
        roles: ["sales"],
      },
      {
        label: "Aktivitas",
        href: "/sales/aktivitas",
        icon: Pulse,
        roles: ["sales"],
      },
      {
        label: "Finance & Accounting",
        href: "/finance",
        icon: CurrencyDollar,
        roles: ["finance"],
        children: [
          { label: "Cashflow", href: "/finance/cashflow", icon: ChartLineUp, roles: ["finance"] },
          { label: "Tagihan", href: "/finance/tagihan", icon: Receipt, roles: ["finance"] },
          { label: "Pengeluaran", href: "/finance/pengeluaran", icon: Wallet, roles: ["finance"] },
          { label: "RAB & Realisasi", href: "/finance/rab", icon: ListChecks, roles: ["finance"] },
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
        children: [
          { label: "Pipeline KPR", href: "/legal/kpr", icon: Bank, roles: ["legal"] },
          { label: "Dokumen & BAST", href: "/legal/dokumen", icon: FileText, roles: ["legal"] },
        ],
      },

      {
        label: "Proyek Lapangan",
        href: "/supervisor/proyek",
        icon: Buildings,
        roles: ["supervisor"],
        children: [{ label: "Daftar Proyek", href: "/supervisor/proyek", icon: Buildings, roles: ["supervisor"] }],
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
  const [currentRole, setCurrentRole] = useState<RoleWithGuest>("guest");
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [pendingTagihanCount, setPendingTagihanCount] = useState(0);
  const [pendingKprCount, setPendingKprCount] = useState(0);
  const [pendingExpenseCount, setPendingExpenseCount] = useState(0);

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

  useEffect(() => {
    let isMounted = true;

    const fetchPendingTagihan = async () => {
      if (currentRole !== "finance") return;
      
      try {
        const loginRes = await fetch("http://localhost:4000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "finance@erp.com", password: "password123" })
        });
        const { token } = await loginRes.json();
        if (!token) return;

        const res = await fetch("http://localhost:4000/api/finance/bookings", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (res.ok && isMounted && Array.isArray(data.data)) {
          const pendingCount = data.data.filter((b: any) => b.status === "Menunggu Verifikasi").length;
          setPendingTagihanCount(pendingCount);
        }
      } catch (err) {
        console.error("Failed to fetch pending tagihan for sidebar", err);
      }
    };

    const fetchPendingKpr = async () => {
      if (currentRole !== "legal") return;
      try {
        const loginRes = await fetch("http://localhost:4000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "legal@erp.com", password: "password123" })
        });
        const { token } = await loginRes.json();
        if (!token) return;

        const res = await fetch("http://localhost:4000/api/legal/kpr", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (res.ok && isMounted && Array.isArray(data)) {
          const pendingCount = data.filter((b: any) => !b.kprApplication || b.kprApplication.status === "Kumpul Berkas").length;
          setPendingKprCount(pendingCount);
        }
      } catch (err) {
        console.error("Failed to fetch pending kpr for sidebar", err);
      }
    };

    const fetchPendingExpense = async () => {
      if (currentRole !== "finance") return;
      try {
        const loginRes = await fetch("http://localhost:4000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "finance@erp.com", password: "password123" })
        });
        const { token } = await loginRes.json();
        if (!token) return;

        const res = await fetch("http://localhost:4000/api/finance/expenses", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (res.ok && isMounted && Array.isArray(data.data)) {
          const pendingCount = data.data.filter((b: any) => b.status === "Menunggu Transfer").length;
          setPendingExpenseCount(pendingCount);
        }
      } catch (err) {
        console.error("Failed to fetch pending expense for sidebar", err);
      }
    };

    fetchPendingTagihan();
    fetchPendingKpr();
    fetchPendingExpense();
    const interval = setInterval(() => {
      fetchPendingTagihan();
      fetchPendingKpr();
      fetchPendingExpense();
    }, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [currentRole, pathname]);

  const toggleExpand = (href: string) => {
    setExpandedMenus((prev) => (prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]));
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
                                    {child.label === "Tagihan" && pendingTagihanCount > 0 && (
                                      <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white shadow-sm">
                                        {pendingTagihanCount}
                                      </span>
                                    )}
                                    {child.label === "Pipeline KPR" && pendingKprCount > 0 && (
                                      <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white shadow-sm">
                                        {pendingKprCount}
                                      </span>
                                    )}
                                    {child.label === "Pengeluaran" && pendingExpenseCount > 0 && (
                                      <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white shadow-sm">
                                        {pendingExpenseCount}
                                      </span>
                                    )}
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
        <p className="mt-3 text-center text-[10px] tracking-[0.15em] font-medium text-zinc-600 uppercase">Griya Persada &copy; 2026</p>
      </div>
    </aside>
  );
}
