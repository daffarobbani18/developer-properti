'use client';

import { useState } from 'react';
import { GalleryCategory, GALLERY_CATEGORIES } from '@/data/gallery';

interface GalleryFilterClientProps {
  onCategoryChange: (category: GalleryCategory | 'Semua') => void;
}

export default function GalleryFilterClient({
  onCategoryChange,
}: GalleryFilterClientProps) {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | 'Semua'>('Semua');

  const handleCategoryClick = (category: GalleryCategory | 'Semua') => {
    setActiveCategory(category);
    onCategoryChange(category);
  };

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center py-6 md:py-8">
      {/* Tombol Semua */}
      <button
        onClick={() => handleCategoryClick('Semua')}
        className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
          activeCategory === 'Semua'
            ? 'bg-[#1E3A5F] text-white shadow-md'
            : 'bg-[#F8FAFB] text-[#374151] border border-[#EEF1F4] hover:border-[#D4A843] hover:bg-[#EEF1F4]'
        }`}
        aria-pressed={activeCategory === 'Semua'}
      >
        Semua
      </button>

      {/* Tombol Kategori */}
      {GALLERY_CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
            activeCategory === category
              ? 'bg-[#1E3A5F] text-white shadow-md'
              : 'bg-[#F8FAFB] text-[#374151] border border-[#EEF1F4] hover:border-[#D4A843] hover:bg-[#EEF1F4]'
          }`}
          aria-pressed={activeCategory === category}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
