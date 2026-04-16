import { notFound } from "next/navigation";
import { PUBLIC_UNITS, getUnitBySlug } from "@/lib/public-unit-data";
import { DetailContent } from "./detail-content";

type Params = {
  slug: string;
};

// Parse price string like "Rp 2.8 M" to numeric value in rupiah
function parsePriceToNumber(priceStr: string): number {
  const cleaned = priceStr.replace(/[^\d.,]/g, "").replace(",", ".");
  const value = parseFloat(cleaned);
  const normalized = priceStr.toLowerCase();
  if (normalized.includes("miliar") || normalized.includes(" m")) return value * 1000000000;
  if (normalized.includes("juta") || normalized.includes(" jt")) return value * 1000000;
  return value;
}

export function generateStaticParams() {
  return PUBLIC_UNITS.map((unit) => ({ slug: unit.slug }));
}

export default async function UnitDetailPage({ params }: { params: Promise<Params> }) {
  const resolvedParams = await params;
  const unit = getUnitBySlug(resolvedParams.slug);

  if (!unit) {
    notFound();
  }

  const propertyPriceNumeric = parsePriceToNumber(unit.price);

  return <DetailContent unit={unit} propertyPriceNumeric={propertyPriceNumeric} />;
}
