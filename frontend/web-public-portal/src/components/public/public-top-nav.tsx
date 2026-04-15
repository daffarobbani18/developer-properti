"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

type PublicTopNavProps = {
  theme?: "light" | "dark";
};

const links = [
  { label: "Beranda", href: "/" },
  { label: "Unit", href: "/unit" },
  { label: "Lokasi", href: "/lokasi" },
  { label: "Tentang", href: "/tentang" },
  { label: "FAQ", href: "/faq" },
  { label: "Kontak", href: "/kontak" },
];

export function PublicTopNav({ theme = "light" }: PublicTopNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDark = theme === "dark";

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
        isDark ? "bg-zinc-950/85 border-zinc-800" : "bg-white/85 border-zinc-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3">
          <div
            className={`w-9 h-9 flex items-center justify-center border transform rotate-45 ${
              isDark ? "border-amber-500" : "border-amber-600"
            }`}
          >
            <span
              className={`font-serif text-sm transform -rotate-45 ${
                isDark ? "text-zinc-100" : "text-zinc-900"
              }`}
            >
              G
            </span>
          </div>
          <span
            className={`font-serif text-lg tracking-widest uppercase ${
              isDark ? "text-zinc-100" : "text-zinc-900"
            }`}
          >
            Griya<span className="font-light">Persada</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              className={`text-xs uppercase tracking-[0.2em] transition-colors ${
                isDark ? "text-zinc-300 hover:text-amber-400" : "text-zinc-600 hover:text-amber-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#vip"
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs uppercase tracking-[0.2em] rounded-sm transition-colors"
          >
            VIP Access
          </Link>
        </nav>

        <button
          className={`md:hidden ${isDark ? "text-amber-400" : "text-amber-600"}`}
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {mobileOpen && (
        <div className={`md:hidden border-t ${isDark ? "border-zinc-800 bg-zinc-950" : "border-zinc-200 bg-white"}`}>
          <div className="px-4 sm:px-6 py-5 flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-xs uppercase tracking-[0.2em] ${
                  isDark ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#vip"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex w-fit px-5 py-2.5 bg-amber-600 text-white text-xs uppercase tracking-[0.2em] rounded-sm"
            >
              VIP Access
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
