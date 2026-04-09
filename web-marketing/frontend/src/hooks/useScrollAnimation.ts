'use client';

import { useEffect, useRef } from 'react';

/**
 * Hook untuk memicu animasi scroll (fade-up) menggunakan IntersectionObserver.
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §6.3
 *
 * Cara pakai:
 *   const ref = useScrollAnimation();
 *   <div ref={ref} className="animate-fade-up">...</div>
 *
 * Class `is-visible` ditambahkan saat elemen masuk viewport,
 * yang memicu transisi CSS `.animate-fade-up.is-visible` di globals.css.
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.15,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // animasi hanya sekali
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
