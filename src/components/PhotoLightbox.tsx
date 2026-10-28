import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';

export const PhotoLightbox: React.FC = () => {
  const { lightboxData, closeLightbox, setLightboxIndex } = useProperties();

  useEffect(() => {
    if (!lightboxData) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') {
        setLightboxIndex((lightboxData.currentIndex + 1) % lightboxData.images.length);
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex(
          lightboxData.currentIndex === 0
            ? lightboxData.images.length - 1
            : lightboxData.currentIndex - 1
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxData, closeLightbox, setLightboxIndex]);

  if (!lightboxData) return null;

  const currentImg = lightboxData.images[lightboxData.currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex(
      lightboxData.currentIndex === 0
        ? lightboxData.images.length - 1
        : lightboxData.currentIndex - 1
    );
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((lightboxData.currentIndex + 1) % lightboxData.images.length);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200 select-none"
      onClick={closeLightbox}
    >
      {/* Top Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-20">
        <div className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-sm">
          Foto {lightboxData.currentIndex + 1} de {lightboxData.images.length}
        </div>

        <button
          onClick={closeLightbox}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image */}
      <div 
        className="relative max-w-7xl max-h-[85vh] p-4 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentImg}
          alt={`Foto ${lightboxData.currentIndex + 1}`}
          className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl"
        />

        {/* Navigation Arrows */}
        {lightboxData.images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Foto anterior"
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all backdrop-blur-sm"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Foto siguiente"
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all backdrop-blur-sm"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      {lightboxData.images.length > 1 && (
        <div 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 max-w-[90vw] overflow-x-auto p-2 rounded-2xl bg-black/50 backdrop-blur-md"
          onClick={(e) => e.stopPropagation()}
        >
          {lightboxData.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setLightboxIndex(idx)}
              className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                lightboxData.currentIndex === idx
                  ? 'border-teal-400 scale-105'
                  : 'border-transparent opacity-50 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
