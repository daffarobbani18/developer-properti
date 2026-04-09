import { UnitCard } from "../../components/UnitCard";
import { unitTypes } from "../../lib/data";

export const metadata = {
  title: "Tipe Rumah"
};

export default function TipeRumahPage() {
  return (
    <section className="content-section">
      <div className="container">
        <header className="section-head">
          <h2>Tipe Rumah Graha Mutiara</h2>
          <p>Pilih tipe unit sesuai kebutuhan luas ruang, budget, dan rencana keluarga Anda.</p>
        </header>

        <div className="unit-grid">
          {unitTypes.map((unit) => (
            <UnitCard key={unit.slug} unit={unit} />
          ))}
        </div>
      </div>
    </section>
  );
}
