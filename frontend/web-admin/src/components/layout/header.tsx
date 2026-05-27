"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Menu, Search, CalendarDays, UserRound, LogOut, Settings, ChevronDown } from "lucide-react";
import { readRoleFromAuthPayload, type UserRole } from "@/lib/access";
import Breadcrumb, { getPageTitle } from "@/components/layout/breadcrumb";

interface HeaderProps {
  title?: string;
  onMenuClick: () => void;
  showMenuButton?: boolean;
}

export default function Header({ onMenuClick, showMenuButton = true }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [now, setNow] = useState<Date | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      const localAuth = localStorage.getItem("simdp_auth");
      const sessionAuth = sessionStorage.getItem("simdp_auth");
      const authRaw = localAuth ?? sessionAuth;

      if (!authRaw) {
        setUserName(null);
        setUserRole(null);
        return;
      }

      const parsed = JSON.parse(authRaw) as { email?: string; role?: string };
      if (parsed?.email) {
        const namePart = parsed.email.split("@")[0];
        const pretty = namePart.replace(/[._\-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        setUserName(pretty);
      } else {
        setUserName(null);
      }

      const role = readRoleFromAuthPayload(authRaw);
      setUserRole(role);
    } catch {
      setUserName(null);
      setUserRole(null);
    }
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("simdp_auth");
      sessionStorage.removeItem("simdp_auth");
      document.cookie = "simdp_role=; path=/; max-age=0; samesite=lax";
      document.cookie = "simdp_email=; path=/; max-age=0; samesite=lax";
    } catch {
      // Ignore storage/cookie errors
    }
    setShowUserMenu(false);
    router.replace("/login");
  };

  const topBarDate = useMemo(
    () =>
      now
        ? new Intl.DateTimeFormat("id-ID", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(now)
        : "",
    [now]
  );

  const topBarTime = useMemo(
    () =>
      now
        ? new Intl.DateTimeFormat("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }).format(now)
        : "",
    [now]
  );

  const pageTitle = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/95 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-8">
        {/* Left: Menu button + Breadcrumb & Title */}
        <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4">
          {showMenuButton ? (
            <button
              onClick={onMenuClick}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 shadow-sm transition-all hover:bg-zinc-50 hover:shadow-md md:hidden"
              aria-label="Buka menu navigasi"
            >
              <Menu size={16} />
            </button>
          ) : null}

          <div className="min-w-0 hidden md:flex flex-col gap-0.5">
            <Breadcrumb />
            <h1 className="font-[family-name:var(--font-heading)] text-lg font-normal text-zinc-900 truncate leading-tight">
              {pageTitle}
            </h1>
          </div>
          <div className="min-w-0 md:hidden">
            <h1 className="font-[family-name:var(--font-heading)] text-base font-normal text-zinc-900 truncate">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Center: Search */}
        <div className="hidden min-w-0 max-w-md flex-1 lg:flex">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input
              type="text"
              placeholder="Cari unit, tipe, pelanggan..."
              className="w-full rounded-xl border border-zinc-200/80 bg-zinc-50/50 py-2 pl-10 pr-14 text-sm text-zinc-700 outline-none transition-all focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:shadow-sm placeholder:text-zinc-400"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-zinc-200 bg-zinc-100/80 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-400">
              ⌘K
            </div>
          </div>
        </div>

        {/* Right: Date, Notifications, User */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className={`hidden items-center gap-2 rounded-xl border border-zinc-100 bg-zinc-50/80 px-3 py-1.5 text-right md:flex ${!now ? 'opacity-0' : 'opacity-100 transition-opacity'}`}>
            <CalendarDays size={14} className="text-zinc-400" />
            <div className="leading-tight text-left">
              <p className="text-[10px] font-medium text-zinc-400">{topBarDate || "..."}</p>
              <p className="text-xs font-semibold text-zinc-700">{topBarTime || "..."}</p>
            </div>
          </div>

          <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/80 bg-white text-zinc-500 shadow-sm transition-all hover:bg-zinc-50 hover:shadow-md">
            <Bell size={16} />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500"></span>
          </button>

          {/* User dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-white px-2 py-1.5 shadow-sm cursor-pointer hover:bg-zinc-50 hover:shadow-md transition-all"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-xs font-bold text-white shadow-sm">
                {userName ? userName.split(" ").map((s) => s[0]).slice(0,2).join("") : "--"}
              </div>
              <div className="hidden min-w-0 sm:block text-left">
                <p className="truncate text-sm font-semibold leading-tight text-zinc-800 max-w-[120px]">{userName ?? "Pengguna"}</p>
                <p className="truncate text-[10px] text-zinc-400">{(userRole && roleLabel(userRole)) ?? "Akses Portal"}</p>
              </div>
              <ChevronDown size={14} className={`hidden sm:block text-zinc-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 animate-scale-in origin-top-right rounded-xl border border-zinc-200/80 bg-white p-1.5 shadow-lg shadow-zinc-200/50 z-50">
                <div className="px-3 py-2.5 border-b border-zinc-100 mb-1">
                  <p className="text-sm font-semibold text-zinc-900">{userName ?? "Pengguna"}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{(userRole && roleLabel(userRole)) ?? "Akses Portal"}</p>
                </div>
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900">
                  <UserRound size={15} className="text-zinc-400" />
                  Profil Saya
                </button>
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900">
                  <Settings size={15} className="text-zinc-400" />
                  Pengaturan
                </button>
                <div className="border-t border-zinc-100 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    <LogOut size={15} />
                    Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function roleLabel(role: UserRole) {
  switch (role) {
    case "admin":
      return "Administrator";
    case "inventory":
      return "Admin Inventory";
    case "sales":
      return "Sales & Marketing";
    case "finance":
      return "Finance & Accounting";
    case "legal":
      return "Legal & Perizinan";
    case "supervisor":
      return "Pengawas Lapangan";
    default:
      return "Akses Portal";
  }
}
