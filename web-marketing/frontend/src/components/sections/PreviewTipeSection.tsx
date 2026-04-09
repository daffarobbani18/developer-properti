import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import Button from '@/components/ui/Button';
import UnitCard from '@/components/shared/UnitCard';
import { getFeaturedUnits } from '@/data/units';

/**
 * PreviewTipeSection — 3 kartu unit unggulan di homepage.
 * Desktop: grid 3 kolom. Mobile: scroll horizontal (snap).
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §2.3
 */

export default function PreviewTipeSection() {
  const featured = getFeaturedUnits();

  return (
    <SectionWrapper
      id="tipe-rumah"
      background="white"
      spacing="lg"
      title="Pilihan Tipe Rumah"
      subtitle="Temukan tipe hunian yang sesuai dengan kebutuhan dan kemampuan Anda."
    >
      {/*
        Mobile  : flex row → horizontal scroll + snap
        sm+     : grid 2-col
        lg+     : grid 3-col
        Gunakan satu `display` per breakpoint — tidak campur `flex` dan `grid`.
      */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-3 -mx-4 px-4 sm:pb-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:mx-0 sm:px-0 lg:grid-cols-3">
        {featured.map((unit) => (
          <div key={unit.slug} className="snap-start shrink-0 w-[78vw] sm:w-auto">
            <UnitCard unit={unit} className="h-full" />
          </div>
        ))}
      </div>

      {/* Tombol lihat semua */}
      <div className="flex justify-center mt-10">
        <Link href="/tipe-rumah">
          <Button variant="outline" size="md" iconRight={<ChevronRight size={16} />}>
            Lihat Semua Tipe Rumah
          </Button>
        </Link>
      </div>
    </SectionWrapper>
  );
}
