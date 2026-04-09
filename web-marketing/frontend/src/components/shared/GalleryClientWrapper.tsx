'use client';

import { useState } from 'react';
import { GalleryPhoto, GalleryCategory, getAllGalleryPhotos, getGalleryByCategory } from '@/data/gallery';
import { UnitImage } from '@/types';
import GalleryFilterClient from '@/components/shared/GalleryFilterClient';
import GalleryGrid from '@/components/shared/GalleryGrid';
import Lightbox from '@/components/shared/Lightbox';

export default function GalleryClientWrapper() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | 'Semua'>('Semua');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Get filtered photos
  const filteredPhotos: GalleryPhoto[] =
    activeCategory === 'Semua'
      ? getAllGalleryPhotos()
      : getGalleryByCategory(activeCategory as GalleryCategory);

  // Convert to UnitImage format for Lightbox
  const lightboxImages: UnitImage[] = filteredPhotos.map((photo) => ({
    src: photo.image,
    alt: photo.title,
    caption: photo.caption || photo.title,
  }));

  const handleCategoryChange = (category: GalleryCategory | 'Semua') => {
    setActiveCategory(category);
    setSelectedPhotoIndex(0);
  };

  const handlePhotoClick = (photo: GalleryPhoto, index: number) => {
    setSelectedPhotoIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      {/* Filter */}
      <GalleryFilterClient onCategoryChange={handleCategoryChange} />

      {/* Grid */}
      <GalleryGrid
        photos={filteredPhotos}
        onPhotoClick={handlePhotoClick}
      />

      {/* Lightbox */}
      <Lightbox
        images={lightboxImages}
        initialIndex={selectedPhotoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
