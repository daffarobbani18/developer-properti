import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="content-section">
      <div className="container panel" style={{ textAlign: "center" }}>
        <h2>Halaman Tidak Ditemukan</h2>
        <p>Maaf, halaman yang Anda cari belum tersedia atau sudah dipindahkan.</p>
        <Link className="link-button primary" href="/">
          Kembali ke Beranda
        </Link>
      </div>
    </section>
  );
}
