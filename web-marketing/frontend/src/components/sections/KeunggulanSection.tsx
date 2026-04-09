import {
  MapPin, Home, BadgeDollarSign, Building2, ShieldCheck, Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { keunggulan } from '@/data/keunggulan';
import type { LucideIcon } from 'lucide-react';

/**
 * KeunggulanSection — grid 6 keunggulan perumahan.
 * 3 kolom desktop, 2 kolom tablet, 1 kolom mobile.
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §2.2
 */

/* Map nama string ke komponen Lucide */
const iconMap: Record<string, LucideIcon> = {
  MapPin, Home, BadgeDollarSign, Building2, ShieldCheck, Award,
};

export default function KeunggulanSection() {
  return (
    <SectionWrapper
      id="keunggulan"
      background="light"
      spacing="lg"
      title="Mengapa Memilih Kami?"
      subtitle="Kami hadir dengan komitmen memberikan hunian terbaik yang nyaman, aman, dan terjangkau untuk keluarga Indonesia."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {keunggulan.map((item, i) => {
          const Icon = iconMap[item.icon] ?? MapPin;
          return (
            <div
              key={item.id}
              className={cn(
                'bg-white rounded-[12px] p-6 flex gap-4',
                'shadow-[0_1px_4px_rgba(0,0,0,0.06)]',
                'transition-all duration-200 hover:shadow-[0_4px_16px_rgba(30,58,95,0.1)] hover:-translate-y-0.5',
                'animate-fade-up',
              )}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Ikon */}
              <div className="w-12 h-12 rounded-xl bg-[#1E3A5F]/8 flex items-center justify-center flex-shrink-0">
                <Icon size={22} className="text-[#1E3A5F]" strokeWidth={1.8} />
              </div>

              {/* Teks */}
              <div>
                <h4 className="text-[15px] md:text-[16px] font-semibold text-[#111827] mb-1.5">
                  {item.title}
                </h4>
                <p className="text-[13px] md:text-sm text-[#64748B] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
