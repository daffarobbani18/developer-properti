import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LeadForm } from "../../../components/LeadForm";
import { unitTypes } from "../../../lib/data";
import { formatCurrency } from "../../../lib/format";

type PageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return unitTypes.map((unit) => ({ slug: unit.slug }));
}

export default function UnitDetailPage({ params }: PageProps) {
  const unit = unitTypes.find((item) => item.slug === params.slug);
  if (!unit) {
    notFound();
  }

  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6281234567890";

  return (
    <section className="content-section">
      <div className="container">
        <header className="section-head">
          <h2>{unit.name}</h2>
          <p>{unit.description}</p>
        </header>

        <div className="panel" style={{ marginBottom: "1rem" }}>
          <strong className="price">Mulai {formatCurrency(unit.priceFrom)}</strong>
          <p>
            Luas tanah {unit.landArea} m2 · Luas bangunan {unit.buildingArea} m2 · {unit.bedrooms} kamar tidur ·{" "}
            {unit.bathrooms} kamar mandi · Carport {unit.carport} mobil.
          </p>
          <div className="unit-actions">
            <a className="link-button primary" href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer">
              Jadwalkan Survey
            </a>
            <Link className="link-button outline" href="/simulasi-kpr">
              Simulasi KPR
            </Link>
          </div>
        </div>

        <div className="gallery-grid" style={{ marginBottom: "1rem" }}>
          {unit.gallery.map((image) => (
            <Image
              key={image}
              src={image}
              alt={`${unit.name} photo`}
              width={900}
              height={620}
              style={{ width: "100%", height: "auto" }}
            />
          ))}
        </div>

        <div className="panel">
          <h3>Minat Pada {unit.name}?</h3>
          <LeadForm defaultInterest={unit.name} />
        </div>
      </div>
    </section>
  );
}
