import { locationHighlights } from "../../lib/data";

export const metadata = {
  title: "Lokasi"
};

export default function LokasiPage() {
  return (
    <section className="content-section">
      <div className="container">
        <header className="section-head">
          <h2>Lokasi Strategis</h2>
          <p>Akses cepat ke tol, transportasi, fasilitas pendidikan, dan pusat layanan kesehatan.</p>
        </header>

        <div className="panel" style={{ marginBottom: "1rem" }}>
          <ul className="location-list">
            {locationHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="map-wrap panel">
          <iframe
            title="Peta lokasi Graha Mutiara"
            src="https://www.google.com/maps?q=Cikarang&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
