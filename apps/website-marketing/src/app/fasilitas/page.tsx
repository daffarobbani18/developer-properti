import { facilities } from "../../lib/data";

export const metadata = {
  title: "Fasilitas"
};

export default function FasilitasPage() {
  return (
    <section className="content-section">
      <div className="container">
        <header className="section-head">
          <h2>Fasilitas Kawasan</h2>
          <p>Dirancang untuk mendukung kenyamanan harian keluarga di dalam cluster.</p>
        </header>

        <div className="feature-grid">
          {facilities.map((item) => (
            <article className="feature-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
