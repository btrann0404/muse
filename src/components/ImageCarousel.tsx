"use client";

import { useState } from "react";

interface ImageCarouselProps {
  images: string[];
  onImageClick: (image: string) => void;
}

export default function ImageCarousel({ images, onImageClick }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative bg-[#fdfcfa]">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="h-full w-full cursor-pointer object-contain"
          onClick={() => onImageClick(images[currentIndex])}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            {currentIndex > 0 && (
              <button
                onClick={goToPrevious}
                className="absolute left-3 top-1/2 -translate-y-1/2 border border-[#2d2d2a] border-opacity-20 bg-[#fdfcfa] bg-opacity-90 px-2.5 py-1.5 text-xs font-light text-[#2d2d2a] opacity-60 backdrop-blur-sm transition-opacity hover:opacity-100"
              >
                ←
              </button>
            )}
            {currentIndex < images.length - 1 && (
              <button
                onClick={goToNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 border border-[#2d2d2a] border-opacity-20 bg-[#fdfcfa] bg-opacity-90 px-2.5 py-1.5 text-xs font-light text-[#2d2d2a] opacity-60 backdrop-blur-sm transition-opacity hover:opacity-100"
              >
                →
              </button>
            )}
          </>
        )}

        {/* Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(index);
                }}
                className={`h-1.5 w-1.5 rounded-full transition-all ${
                  index === currentIndex ? "bg-[#2d2d2a] opacity-60" : "bg-[#2d2d2a] opacity-20"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

