import Link from "next/link";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/tipe-rumah", label: "Tipe Rumah" },
  { href: "/galeri", label: "Galeri" },
  { href: "/fasilitas", label: "Fasilitas" },
  { href: "/lokasi", label: "Lokasi" },
  { href: "/simulasi-kpr", label: "Simulasi KPR" },
  { href: "/kontak", label: "Kontak" }
];

export function SiteHeader() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6281234567890";

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">GM</span>
          <span>
            <strong>Graha Mutiara</strong>
            <small>Cikarang</small>
          </span>
        </Link>

        <nav aria-label="Menu utama" className="main-nav">
          {navItems.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <a className="cta-button" href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer">
          Hubungi Kami
        </a>
      </div>
    </header>
  );
}
