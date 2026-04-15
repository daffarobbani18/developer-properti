import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIMDP | Web Publik & Portal Customer",
  description: "Landing marketing dan portal customer untuk Ekosistem Digital Properti Terpadu",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
