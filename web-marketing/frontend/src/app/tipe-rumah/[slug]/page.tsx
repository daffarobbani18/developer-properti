import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE_NAME } from '@/lib/constants';
import { getUnitBySlug, units, getRelatedUnits } from '@/data/units';
import DetailUnitClient from '@/components/shared/DetailUnitClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return units.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const unit = getUnitBySlug(slug);
  if (!unit) return {};
  return {
    title: `${unit.name} — ${SITE_NAME}`,
    description: unit.description,
    openGraph: {
      title: unit.name,
      description: unit.description,
      images: unit.images.length > 0 ? [{ url: unit.images[0].src }] : [],
    },
  };
}

/**
/**
 * Halaman detail unit (/tipe-rumah/[slug])
 * Menampilkan galeri interaktif, spesifikasi lengkap, denah, dan CTA.
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §3.2
 */
export default async function DetailUnitPage({ params }: Props) {
  const { slug } = await params;
  const unit = getUnitBySlug(slug);
  if (!unit) notFound();

  return (
    <main className="min-h-screen bg-white">
      <DetailUnitClient
        unit={unit}
        relatedUnits={getRelatedUnits(unit.slug)}
      />
    </main>
  );
}
