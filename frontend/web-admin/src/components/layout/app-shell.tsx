"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

interface AppShellProps {
  children: React.ReactNode;
  title: string;
}

export default function AppShell({ children, title }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-white/80 backdrop-blur-md border-r border-slate-200/50">
          <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
          <Sidebar onClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={title} onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
