import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "SIMDP — Web Admin",
  description: "Sistem Informasi Manajemen Developer Perumahan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${plusJakarta.variable} ${inter.variable} font-[family-name:var(--font-body)] antialiased bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 min-h-screen text-slate-900`}
      >
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
