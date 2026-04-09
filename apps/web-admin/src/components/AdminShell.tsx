"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { clearAuthState } from "../lib/auth-storage";
import { navItems } from "../lib/navigation";
import type { AuthUser } from "../lib/types";

type AdminShellProps = {
  user: AuthUser;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function AdminShell({ user, title, subtitle, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const menus = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h1>SIMDP</h1>
          <small>Web Admin</small>
        </div>
        <nav>
          {menus.map((item) => (
            <Link key={item.href} href={item.href} className={pathname.startsWith(item.href) ? "active" : ""}>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="admin-content">
        <header className="admin-header">
          <div>
            <h2>{title}</h2>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          <div className="user-box">
            <strong>{user.fullName}</strong>
            <small>{user.role}</small>
            <button
              type="button"
              onClick={() => {
                clearAuthState();
                router.replace("/login");
              }}
            >
              Logout
            </button>
          </div>
        </header>
        <section>{children}</section>
      </div>
    </div>
  );
}
