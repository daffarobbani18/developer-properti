import Image from 'next/image';
import { Facility } from '@/types';

interface FacilityCardProps {
  facility: Facility;
}

export default function FacilityCard({ facility }: FacilityCardProps) {
  return (
    <div className="bg-white rounded-lg border border-[#EEF1F4] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="relative w-full aspect-video overflow-hidden bg-[#F8FAFB]">
        <Image
          src={facility.image}
          alt={facility.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8//8/AwAI/AL+LKXDCQAAAABJRU5ErkJggg=="
        />
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 flex flex-col flex-1">
        <h3 className="text-lg md:text-xl font-semibold text-[#111827] mb-2">
          {facility.name}
        </h3>
        <p className="text-sm md:text-base text-[#374151] flex-1 leading-relaxed">
          {facility.description}
        </p>
      </div>
    </div>
  );
}
