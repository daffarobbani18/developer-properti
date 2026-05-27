"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
}

export default function AppShell({ children, title }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === "/") {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 font-[family-name:var(--font-body)] text-zinc-900 selection:bg-amber-200 selection:text-amber-900">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Gradient transition strip between sidebar and content */}
      <div className="hidden md:block w-[3px] bg-gradient-to-b from-zinc-900 via-zinc-800/60 to-zinc-900 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/20 to-transparent w-4 left-full pointer-events-none" />
      </div>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 border-r border-white/10 bg-zinc-950 p-0 text-white">
          <SheetTitle className="sr-only">List Navigasi</SheetTitle>
          <Sidebar onClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Area */}
      <main className="relative flex flex-1 flex-col overflow-hidden">
        <Header title={title} onMenuClick={() => setMobileOpen(true)} showMenuButton />

        <div className="flex-1 overflow-y-auto content-surface">
          <div className="p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
