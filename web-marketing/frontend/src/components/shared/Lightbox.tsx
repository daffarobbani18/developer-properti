'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UnitImage } from '@/types';

/**
 * Lightbox — modal fullscreen untuk galeri foto.
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §3.3
 *
 * Features:
 * - Tampilan fullscreen dengan background gelap
 * - Navigasi: prev/next arrow, keyboard (←/→, Esc), swipe gesture
 * - Counter foto
 * - Close: tombol X, click background, keyboard Esc
 * - Prevent body scroll saat aktif
 * - Fade in/out animation
 */

interface LightboxProps {
  images: UnitImage[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function Lightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}: LightboxProps) {
  const [current, setCurrent] = useState(initialIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef<number | null>(null);

  /* Prevent body scroll saat lightbox aktif */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const goToPrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent((c) => (c - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent((c) => (c + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToIndex = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  /* Keyboard navigation */
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrev();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  /* Touch swipe */
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      delta > 0 ? goToNext() : goToPrev();
    }
    touchStartX.current = null;
  }

  if (!isOpen) return null;

  const image = images[current];

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Konten modal */}
      <div
        className={cn(
          'relative w-full h-full flex flex-col items-center justify-center',
          'animate-fade-in transition-opacity duration-300',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header dengan close button */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 md:p-6">
          {/* Counter */}
          <div className="text-white/80 text-sm md:text-base font-medium">
            {current + 1} / {images.length}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Tutup lightbox"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={24} className="text-white" strokeWidth={1.5} />
          </button>
        </div>

        {/* Foto utama */}
        <div
          className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center"
          key={`photo-${current}`}
        >
          <div className="relative w-full h-full">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className={cn(
                'object-contain transition-opacity duration-300',
                isTransitioning ? 'opacity-50' : 'opacity-100',
              )}
              sizes="100vw"
              priority
            />
          </div>
        </div>

        {/* Caption */}
        {image.caption && (
          <div className="absolute bottom-16 md:bottom-20 bg-black/60 text-white px-4 py-2 rounded-lg text-sm md:text-base max-w-xs text-center">
            {image.caption}
          </div>
        )}

        {/* Navigation: Prev */}
        {images.length > 1 && (
          <button
            onClick={goToPrev}
            aria-label="Foto sebelumnya"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            disabled={isTransitioning}
          >
            <ChevronLeft size={24} className="text-white" strokeWidth={1.5} />
          </button>
        )}

        {/* Navigation: Next */}
        {images.length > 1 && (
          <button
            onClick={goToNext}
            aria-label="Foto berikutnya"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            disabled={isTransitioning}
          >
            <ChevronRight size={24} className="text-white" strokeWidth={1.5} />
          </button>
        )}

        {/* Thumbnail dots di bawah */}
        {images.length > 1 && (
          <div className="absolute bottom-4 md:bottom-6 flex gap-2 flex-wrap justify-center max-w-md">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goToIndex(i)}
                aria-label={`Foto ${i + 1}`}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-200',
                  i === current
                    ? 'bg-white w-8'
                    : 'bg-white/40 hover:bg-white/60',
                )}
                disabled={isTransitioning}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
