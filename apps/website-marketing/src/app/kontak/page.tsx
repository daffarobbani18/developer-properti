import { LeadForm } from "../../components/LeadForm";

export const metadata = {
  title: "Kontak"
};

export default function KontakPage() {
  return (
    <section className="content-section">
      <div className="container">
        <header className="section-head">
          <h2>Kontak Marketing</h2>
          <p>Konsultasikan kebutuhan Anda, jadwalkan survey, atau minta penawaran terbaik hari ini.</p>
        </header>

        <div className="kpr-card">
          <div className="panel">
            <h3>Kantor Marketing</h3>
            <p>Jl. Boulevard Cluster Mutiara No. 12, Cikarang</p>
            <p>WhatsApp: +62 812-3456-7890</p>
            <p>Telepon: (021) 5551 2026</p>
            <p>Email: marketing@grahamutiara.id</p>
            <p>Jam Operasional: Senin - Minggu, 08.30 - 17.30</p>
          </div>

          <div className="panel">
            <h3>Formulir Minat</h3>
            <LeadForm />
          </div>
        </div>
      </div>
    </section>
  );
}
