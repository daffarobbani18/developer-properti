import Link from "next/link";

import { LeadForm } from "../components/LeadForm";
import { Section } from "../components/Section";
import { UnitCard } from "../components/UnitCard";
import { facilities, locationHighlights, testimonials, unitTypes } from "../lib/data";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-panel">
            <h1>Hunian Modern yang Transparan dari Booking hingga Serah Terima</h1>
            <p>
              Graha Mutiara Cikarang dirancang untuk keluarga muda yang ingin rumah nyaman, akses strategis,
              dan proses pembelian yang jelas. Lihat tipe rumah, hitung simulasi KPR, dan jadwalkan survey
              langsung dari website ini.
            </p>
            <div className="hero-badges">
              <span>One Gate System</span>
              <span>Progress Konstruksi Terbuka</span>
              <span>Akses Tol 9 Menit</span>
            </div>
            <div className="unit-actions" style={{ marginTop: "1rem" }}>
              <Link className="link-button primary" href="/tipe-rumah">
                Lihat Tipe Rumah
              </Link>
              <Link className="link-button outline" href="/simulasi-kpr">
                Simulasi KPR
              </Link>
            </div>
          </div>
          <div
            className="hero-media"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1400&q=80)"
            }}
            aria-label="Foto kawasan perumahan"
          />
        </div>
      </section>

      <Section title="Keunggulan Kawasan" subtitle="Kenapa banyak keluarga memilih Graha Mutiara Cikarang?">
        <div className="feature-grid">
          {facilities.map((item) => (
            <article key={item.title} className="feature-card">
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Preview Tipe Rumah" subtitle="Tiga tipe unggulan dengan skema pembayaran fleksibel.">
        <div className="unit-grid">
          {unitTypes.map((unit) => (
            <UnitCard key={unit.slug} unit={unit} />
          ))}
        </div>
      </Section>

      <Section title="Lokasi Strategis" subtitle="Dekat akses utama dan fasilitas publik penting.">
        <div className="panel">
          <ul className="location-list">
            {locationHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </Section>

      <Section title="Testimoni Pembeli" subtitle="Cerita singkat dari keluarga yang sudah booking unit.">
        <div className="testimonials">
          {testimonials.map((item) => (
            <article key={item.name} className="testimonial">
              <p>{`"${item.quote}"`}</p>
              <strong>{item.name}</strong>
            </article>
          ))}
        </div>
      </Section>

      <Section
        title="Jadwalkan Survey Sekarang"
        subtitle="Isi formulir di bawah ini. Tim sales akan menghubungi Anda maksimal 1x24 jam."
      >
        <div className="panel">
          <LeadForm />
        </div>
      </Section>
    </>
  );
}
