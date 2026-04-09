import Link from "next/link";

import type { UnitType } from "../lib/data";
import { formatCurrency } from "../lib/format";

type UnitCardProps = {
  unit: UnitType;
};

export function UnitCard({ unit }: UnitCardProps) {
  return (
    <article className="unit-card">
      <div className="unit-thumb" style={{ backgroundImage: `url(${unit.heroImage})` }} />
      <div className="unit-content">
        <div className="unit-top">
          <h3>{unit.name}</h3>
          <span className={`status-pill status-${unit.status.toLowerCase()}`}>{unit.status}</span>
        </div>

        <p>{unit.description}</p>

        <ul className="unit-meta">
          <li>Luas Tanah: {unit.landArea} m2</li>
          <li>Luas Bangunan: {unit.buildingArea} m2</li>
          <li>Kamar Tidur: {unit.bedrooms}</li>
        </ul>

        <strong className="price">Mulai {formatCurrency(unit.priceFrom)}</strong>

        <div className="unit-actions">
          <Link href={`/tipe-rumah/${unit.slug}`} className="link-button primary">
            Lihat Detail
          </Link>
          <Link href="/simulasi-kpr" className="link-button outline">
            Simulasi KPR
          </Link>
        </div>
      </div>
    </article>
  );
}
