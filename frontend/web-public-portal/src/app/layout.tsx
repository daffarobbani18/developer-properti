import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Web Public + Portal",
  description: "Ekosistem Digital Properti Terpadu",
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
