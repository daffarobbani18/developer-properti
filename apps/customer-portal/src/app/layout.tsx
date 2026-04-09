import type { Metadata } from "next";
import { Lora, Nunito_Sans } from "next/font/google";

import "./globals.css";

const heading = Lora({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700"]
});

const body = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "SIMDP Customer Portal",
  description: "Portal pembeli untuk progres unit, tagihan, dokumen, dan bantuan"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className={`${heading.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
