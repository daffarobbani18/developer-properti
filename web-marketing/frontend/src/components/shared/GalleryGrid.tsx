'use client';

import Image from 'next/image';
import { GalleryPhoto } from '@/data/gallery';
import { ZoomIn } from 'lucide-react';

interface GalleryGridProps {
  photos: GalleryPhoto[];
  onPhotoClick: (photo: GalleryPhoto, index: number) => void;
}

export default function GalleryGrid({
  photos,
  onPhotoClick,
}: GalleryGridProps) {
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 md:py-24">
        <div className="text-center">
          <p className="text-[#374151] text-lg md:text-xl">
            Tidak ada foto untuk kategori ini
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {photos.map((photo, index) => (
        <div
          key={photo.id}
          className="group relative overflow-hidden rounded-lg bg-[#F8FAFB] aspect-video cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-300"
          onClick={() => onPhotoClick(photo, index)}
        >
          {/* Image */}
          <Image
            src={photo.image}
            alt={photo.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8//8/AwAI/AL+LKXDCQAAAABJRU5ErkJggg=="
          />

          {/* Overlay & Hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
            <ZoomIn className="w-10 h-10 text-white mb-2" />
            <p className="text-white font-semibold text-center px-4 text-sm md:text-base">
              {photo.title}
            </p>
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 left-3 px-3 py-1 bg-[#D4A843] text-white text-xs font-semibold rounded-full">
            {photo.category}
          </div>
        </div>
      ))}
    </div>
  );
}
