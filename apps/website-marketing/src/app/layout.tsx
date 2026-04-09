import type { Metadata } from "next";
import { Sora, Space_Grotesk } from "next/font/google";

import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { WhatsAppFloat } from "../components/WhatsAppFloat";

import "./globals.css";

const heading = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "700"]
});

const body = Sora({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://grahamutiara.example.com"),
  title: {
    default: "Graha Mutiara Cikarang",
    template: "%s | Graha Mutiara"
  },
  description:
    "Website resmi Graha Mutiara Cikarang: tipe rumah, galeri, simulasi KPR, dan form lead terhubung langsung ke tim sales.",
  openGraph: {
    title: "Graha Mutiara Cikarang",
    description:
      "Hunian modern dengan akses strategis. Lihat tipe rumah, simulasi KPR, dan jadwalkan survey sekarang.",
    url: "https://grahamutiara.example.com",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className={`${heading.variable} ${body.variable}`}>
        <div className="page-bg" />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
