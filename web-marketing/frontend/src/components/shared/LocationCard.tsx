import { Location } from '@/data/locations';
import { MapPin, Clock, ExternalLink } from 'lucide-react';

interface LocationCardProps {
  location: Location;
}

export default function LocationCard({ location }: LocationCardProps) {
  return (
    <div className="bg-white rounded-lg border border-[#EEF1F4] p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="text-3xl md:text-4xl mb-2">{location.icon}</div>
          <h3 className="text-lg md:text-xl font-semibold text-[#111827] line-clamp-2">
            {location.name}
          </h3>
          <p className="text-sm text-[#D4A843] font-medium">{location.category}</p>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2 mb-4 flex-1">
        <div className="flex items-center gap-2 text-[#374151] text-sm md:text-base">
          <MapPin className="w-4 h-4 md:w-5 md:h-5 text-[#1E3A5F] flex-shrink-0" />
          <span>{location.distance} km</span>
        </div>
        <div className="flex items-center gap-2 text-[#374151] text-sm md:text-base">
          <Clock className="w-4 h-4 md:w-5 md:h-5 text-[#1E3A5F] flex-shrink-0" />
          <span>~{location.duration}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-2 md:gap-3">
        <a
          href={location.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1 px-3 py-2 md:px-4 md:py-2.5 bg-[#1E3A5F] text-white text-xs md:text-sm font-medium rounded-lg hover:bg-[#2D5F8B] transition-colors duration-300"
        >
          <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden sm:inline">Maps</span>
        </a>
        <a
          href={location.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1 px-3 py-2 md:px-4 md:py-2.5 bg-[#D4A843] text-white text-xs md:text-sm font-medium rounded-lg hover:bg-[#c0942a] transition-colors duration-300"
        >
          <MapPin className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden sm:inline">Arah</span>
        </a>
      </div>

      {/* Description */}
      {location.description && (
        <p className="text-xs md:text-sm text-[#64748B] mt-3 pt-3 border-t border-[#EEF1F4] line-clamp-2">
          {location.description}
        </p>
      )}
    </div>
  );
}
