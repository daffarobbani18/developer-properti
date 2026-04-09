export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <section>
          <h3>Graha Mutiara Cikarang</h3>
          <p>
            Hunian modern dengan akses strategis, desain fungsional, dan lingkungan yang dirancang untuk
            kehidupan keluarga aktif.
          </p>
        </section>

        <section>
          <h4>Kantor Marketing</h4>
          <p>Jl. Boulevard Cluster Mutiara No. 12, Cikarang</p>
          <p>Senin - Minggu, 08.30 - 17.30</p>
          <p>Email: marketing@grahamutiara.id</p>
        </section>

        <section>
          <h4>Kontak Cepat</h4>
          <p>WA: +62 812-3456-7890</p>
          <p>Telepon: (021) 5551 2026</p>
          <p>Instagram: @grahamutiara</p>
        </section>
      </div>
      <div className="container footer-bottom">Copyright {new Date().getFullYear()} Graha Mutiara. All rights reserved.</div>
    </footer>
  );
}
