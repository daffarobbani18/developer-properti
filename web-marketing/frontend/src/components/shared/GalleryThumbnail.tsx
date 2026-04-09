'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Lightbox from '@/components/shared/Lightbox';
import type { UnitImage } from '@/types';

/**
 * GalleryThumbnail — komponen galeri interaktif dengan thumbnail.
 * - Foto utama besar (aspect 16:9)
 * - Thumbnail di bawah (swipeable di mobile)
 * - Klik thumbnail → update main photo
 * - Klik main photo → buka Lightbox fullscreen
 * - Counter foto
 * - Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §3.2
 */

interface GalleryThumbnailProps {
  images: UnitImage[];
  className?: string;
}

export default function GalleryThumbnail({
  images,
  className,
}: GalleryThumbnailProps) {
  const [mainIndex, setMainIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full bg-[#EEF1F4] rounded-xl aspect-video flex items-center justify-center text-[#94A3B8]">
        <div className="text-center">
          <Maximize2 size={32} className="mx-auto mb-2 opacity-50" />
          <p>Tidak ada foto</p>
        </div>
      </div>
    );
  }

  const main = images[mainIndex];

  /* Touch swipe untuk thumbnail */
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      const newIndex = delta > 0 ? mainIndex + 1 : mainIndex - 1;
      if (newIndex >= 0 && newIndex < images.length) {
        setMainIndex(newIndex);
      }
    }
    touchStartX.current = null;
    setIsDragging(false);
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Foto utama — clickable untuk lightbox */}
      <div
        className="relative w-full bg-[#EEF1F4] rounded-lg overflow-hidden cursor-pointer group"
        onClick={() => setLightboxOpen(true)}
      >
        <div className="relative w-full aspect-video">
          <Image
            src={main.src}
            alt={main.alt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 800px"
            priority
          />
          
          {/* Overlay - tombol expand */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <Maximize2
              size={32}
              className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
              strokeWidth={1.5}
            />
          </div>

          {/* Counter foto */}
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs md:text-sm font-medium px-3 py-1.5 rounded-full">
            {mainIndex + 1} / {images.length}
          </div>
        </div>
      </div>

      {/* Thumbnails — scrollable mobile, grid desktop */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-2 md:gap-3 overflow-x-auto pb-2 md:pb-0">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setMainIndex(i)}
              className={cn(
                'relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden',
                'border-2 transition-all duration-200 cursor-pointer',
                i === mainIndex
                  ? 'border-[#D4A843] ring-2 ring-[#D4A843]'
                  : 'border-transparent hover:border-[#E2E8F0]',
              )}
              aria-label={`Thumbnail foto ${i + 1}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox modal */}
      <Lightbox
        images={images}
        initialIndex={mainIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
