'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { testimonials } from '@/data/testimonials';

/**
 * TestimoniSection — carousel auto-play, pause-on-hover, touch swipe, dots.
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §2.5
 */

export default function TestimoniSection() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const total = testimonials.length;

  const prev = useCallback(() =>
    setCurrent((c) => (c - 1 + total) % total), [total]);
  const next = useCallback(() =>
    setCurrent((c) => (c + 1) % total), [total]);

  /* Auto-play setiap 5 detik */
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  /* Touch swipe handlers */
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      delta > 0 ? next() : prev();
    }
    touchStartX.current = null;
  }

  const t = testimonials[current];

  return (
    <SectionWrapper
      id="testimoni"
      background="primary"
      spacing="lg"
      title="Kata Mereka yang Sudah Memilih Kami"
      subtitle="Ribuan keluarga telah mempercayakan hunian impian mereka kepada kami."
      titleLight
    >
      <div
        className="max-w-3xl mx-auto"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Card testimoni */}
        <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-7 md:p-10 border border-white/15">
          {/* Icon quote */}
          <Quote
            size={40}
            className="text-[#D4A843] absolute top-6 right-7 opacity-40"
            aria-hidden
          />

          {/* Bintang */}
          <div className="flex gap-1 mb-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < t.rating ? 'text-[#D4A843] fill-[#D4A843]' : 'text-white/20'}
              />
            ))}
          </div>

          {/* Kutipan */}
          <blockquote className="text-[15px] md:text-[17px] text-white/90 leading-relaxed mb-6 italic">
            &ldquo;{t.quote}&rdquo;
          </blockquote>

          {/* Identitas */}
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full overflow-hidden bg-[#EEF1F4] flex-shrink-0">
              {t.avatar ? (
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#2D5F8B] text-white text-lg font-bold">
                  {t.name.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <p className="text-white font-semibold text-sm">{t.name}</p>
              <p className="text-white/60 text-xs">{t.unitType}</p>
            </div>
          </div>
        </div>

        {/* Navigasi + dots */}
        <div className="flex items-center justify-between mt-7">
          {/* Prev */}
          <button
            onClick={prev}
            aria-label="Testimoni sebelumnya"
            className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center
              text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Testimoni ${i + 1}`}
                className={cn(
                  'rounded-full transition-all duration-300',
                  i === current
                    ? 'w-6 h-2.5 bg-[#D4A843]'
                    : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/50',
                )}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={next}
            aria-label="Testimoni berikutnya"
            className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center
              text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </SectionWrapper>
  );
}
