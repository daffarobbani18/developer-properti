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
  let unit = getUnitBySlug(resolvedParams.slug);

  if (!unit) {
    try {
      const res = await fetch(`http://localhost:4000/api/property-types/${resolvedParams.slug}`, { cache: "no-store" });
      if (res.ok) {
        const backendData = await res.json();
        const priceFmt = `Rp ${backendData.price}`;
        unit = {
          id: backendData.id,
          name: backendData.name,
          slug: backendData.id,
          description: `Tipe ${backendData.name} adalah hunian eksklusif dengan luas bangunan ${backendData.luasBangunan}m² di atas lahan seluas ${backendData.luasTanah}m². Desain dirancang memaksimalkan pencahayaan dan sirkulasi udara alami.`,
          highlight: `Fasad modern tropis dengan tata ruang optimal yang menyesuaikan gaya hidup keluarga masa kini.`,
          price: priceFmt,
          badge: "Tipe Premium",
          status: "Tersedia",
          images: backendData.imageUrl ? [
            backendData.imageUrl,
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80"
          ] : [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80"
          ],
          bedroom: `${backendData.bedrooms} Kamar Tidur`,
          buildingArea: `${backendData.luasBangunan}m²`,
          surfaceArea: `${backendData.luasTanah}m²`,
          facilities: ["Smart Home System", "Keamanan 24 Jam", "Taman Bermain", "Clubhouse"],
          specs: [
            { label: "Pondasi", value: "Batu Kali & Foot Plat" },
            { label: "Dinding", value: "Bata Merah Plester" },
            { label: "Kamar Mandi", value: `${backendData.bathrooms}` },
            { label: "Listrik", value: "2200 VA" }
          ]
        };
      }
    } catch (e) {
      console.error("Failed to fetch property type from backend:", e);
    }
  }

  if (!unit) {
    notFound();
  }

  const propertyPriceNumeric = parsePriceToNumber(unit.price);

  return <DetailContent unit={unit} propertyPriceNumeric={propertyPriceNumeric} />;
}
