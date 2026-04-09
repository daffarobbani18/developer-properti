import { KprCalculator } from "../../components/KprCalculator";

export const metadata = {
  title: "Simulasi KPR"
};

export default function SimulasiKprPage() {
  return (
    <section className="content-section">
      <div className="container">
        <header className="section-head">
          <h2>Simulasi KPR Online</h2>
          <p>Hitung estimasi cicilan bulanan berdasarkan harga rumah, DP, tenor, dan suku bunga.</p>
        </header>

        <KprCalculator />
      </div>
    </section>
  );
}
