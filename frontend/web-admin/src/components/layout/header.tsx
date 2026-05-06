"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, Menu, Search, CalendarDays, UserRound } from "lucide-react";
import { readRoleFromAuthPayload, type UserRole } from "@/lib/access";

interface HeaderProps {
  title?: string;
  onMenuClick: () => void;
  showMenuButton?: boolean;
}

export default function Header({ onMenuClick, showMenuButton = true }: HeaderProps) {
  const [now, setNow] = useState<Date | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

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

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between gap-4 px-4 py-2 md:px-8">
        <div className="flex min-w-0 items-center gap-3 md:gap-4">
          {showMenuButton ? (
            <button
              onClick={onMenuClick}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 md:hidden"
              aria-label="Buka menu navigasi"
            >
              <Menu size={18} />
            </button>
          ) : null}

          <div className="min-w-0" />
        </div>

        <div className="hidden min-w-0 flex-1 justify-start px-0 md:flex">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="text"
              placeholder="Pencarian cepat ID Unit, Tipe..."
              className="w-full rounded-full border border-zinc-200 bg-white py-2.5 pl-11 pr-16 text-sm text-zinc-700 shadow-[0_2px_10px_rgba(0,0,0,0.04)] outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] font-semibold text-zinc-500">
              ⌘K
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className={`hidden items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-right shadow-sm md:flex ${!now ? 'opacity-0' : 'opacity-100 transition-opacity'}`}>
            <CalendarDays size={16} className="text-zinc-400" />
            <div className="leading-tight text-left">
              <p className="text-[11px] font-medium text-zinc-500">{topBarDate || "..."}</p>
              <p className="text-sm font-semibold text-zinc-900">{topBarTime || "..."}</p>
            </div>
          </div>

          <button className="relative flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:bg-zinc-50">
            <Bell size={18} />
            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500"></span>
          </button>

          <div className="flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-2 py-1.5 shadow-sm cursor-pointer hover:bg-zinc-50 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-zinc-950">
              {userName ? userName.split(" ").map((s) => s[0]).slice(0,2).join("") : "--"}
            </div>
            <div className="hidden min-w-0 sm:block text-left">
              <p className="truncate text-sm font-semibold leading-tight text-zinc-900">{userName ?? "Pengguna"}</p>
              <p className="truncate text-[11px] uppercase tracking-wide text-zinc-500">{(userRole && roleLabel(userRole)) ?? "Akses Portal"}</p>
            </div>
            <div className="hidden h-6 w-px bg-zinc-200 sm:block" />
            <UserRound size={16} className="hidden text-zinc-400 sm:block" />
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
