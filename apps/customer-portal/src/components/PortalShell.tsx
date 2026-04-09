"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { clearAuthState } from "../lib/auth-storage";
import type { CustomerUser } from "../lib/types";

const navItems = [
  { href: "/beranda", label: "Beranda" },
  { href: "/progres", label: "Progres" },
  { href: "/tagihan", label: "Tagihan" },
  { href: "/dokumen", label: "Dokumen" },
  { href: "/bantuan/tiket", label: "Bantuan" }
];

type PortalShellProps = {
  user: CustomerUser;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function PortalShell({ user, title, subtitle, children }: PortalShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="portal-shell">
      <header className="portal-header">
        <div>
          <h1>Customer Portal</h1>
          <small>{user.fullName}</small>
        </div>
        <button
          type="button"
          onClick={() => {
            clearAuthState();
            router.replace("/login");
          }}
        >
          Logout
        </button>
      </header>

      <nav className="portal-nav" aria-label="Menu customer">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={pathname.startsWith(item.href) ? "active" : ""}>
            {item.label}
          </Link>
        ))}
      </nav>

      <main className="portal-main">
        <section className="portal-title">
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </section>
        {children}
      </main>
    </div>
  );
}
