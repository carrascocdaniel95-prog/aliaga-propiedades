import React, { useState } from 'react';
import { 
  Heart, 
  Scale, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Car, 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  MessageCircle, 
  Calendar, 
  Sparkles,
  Camera
} from 'lucide-react';
import { Property } from '../types/property';
import { useProperties } from '../context/PropertyContext';
import { formatPrice, createPropertyWhatsAppMessage, getWhatsAppUrl } from '../utils/formatters';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { 
    setSelectedProperty, 
    setBookingProperty, 
    toggleFavorite, 
    isFavorite, 
    toggleComparison, 
    isInComparison,
    openLightbox 
  } = useProperties();

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const isFav = isFavorite(property.id);
  const isComp = isInComparison(property.id);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex(prev => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex(prev => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  const whatsappMessage = createPropertyWhatsAppMessage(property);
  const whatsappUrl = getWhatsAppUrl(property.agent.whatsapp || '56976691216', whatsappMessage);

  return (
    <div 
      onClick={() => setSelectedProperty(property)}
      className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 hover:border-teal-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Media Carousel / Header */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        
        {/* Main image */}
        <img
          src={property.images[activeImageIndex] || property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top Badges overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {/* Operation Badge */}
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md ${
              property.operation === 'venta' ? 'bg-teal-600' : 'bg-blue-600'
            }`}>
              {property.operation === 'venta' ? 'En Venta' : 'En Arriendo'}
            </span>

            {/* Featured Badge */}
            {property.featured && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400 text-slate-900 shadow-md">
                <Sparkles className="w-3 h-3 fill-slate-900" />
                Destacada
              </span>
            )}
          </div>

          {/* Action buttons (Favorite & Compare) */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {/* Compare Toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleComparison(property.id);
              }}
              title={isComp ? 'Quitar de comparar' : 'Agregar para comparar'}
              className={`p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
                isComp
                  ? 'bg-teal-600 text-white ring-2 ring-teal-300'
                  : 'bg-white/90 text-slate-700 hover:bg-white hover:text-teal-600'
              }`}
            >
              <Scale className="w-4 h-4" />
            </button>

            {/* Favorite Toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(property.id);
              }}
              title={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
              className={`p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
                isFav
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/90 text-slate-700 hover:bg-white hover:text-rose-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Carousel Arrow Controls (if multiple images) */}
        {property.images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              aria-label="Foto anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              aria-label="Foto siguiente"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 backdrop-blur-xs">
              {property.images.slice(0, 5).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === activeImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Bottom Badges: Code & Video / Photos Indicator */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 text-slate-200 backdrop-blur-xs">
            {property.code}
          </span>
          {property.videoUrl && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-600/90 text-white backdrop-blur-xs">
              <Play className="w-3 h-3 fill-white" />
              Video Tour
            </span>
          )}
        </div>

        {/* Photos Count / Quick Lightbox */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openLightbox(property.images, activeImageIndex);
          }}
          className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs"
        >
          <Camera className="w-3 h-3" />
          {property.images.length} fotos
        </button>

      </div>

      {/* Property Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Price & Expenses */}
          <div className="flex items-baseline justify-between mb-1">
            <div className="text-2xl font-extrabold text-slate-900">
              {formatPrice(property.price, property.currency)}
            </div>
            {property.commonExpenses && (
              <span className="text-xs text-slate-500 font-medium">
                GC: ${property.commonExpenses.toLocaleString('es-CL')}
              </span>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mb-3">
            <MapPin className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
            <span className="truncate">{property.address}, {property.commune}</span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-800 line-clamp-2 mb-3 group-hover:text-teal-700 transition-colors">
            {property.title}
          </h3>

          {/* Specs Bar */}
          <div className="grid grid-cols-4 gap-2 py-3 border-y border-slate-100 text-slate-600 mb-4 text-xs font-semibold">
            <div className="flex flex-col items-center justify-center p-1 rounded-xl bg-slate-50" title="Dormitorios">
              <div className="flex items-center gap-1 text-slate-700">
                <Bed className="w-3.5 h-3.5 text-teal-600" />
                <span>{property.specs.bedrooms}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-normal">Dorm.</span>
            </div>

            <div className="flex flex-col items-center justify-center p-1 rounded-xl bg-slate-50" title="Baños">
              <div className="flex items-center gap-1 text-slate-700">
                <Bath className="w-3.5 h-3.5 text-teal-600" />
                <span>{property.specs.bathrooms}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-normal">Baños</span>
            </div>

            <div className="flex flex-col items-center justify-center p-1 rounded-xl bg-slate-50" title="Superficie total">
              <div className="flex items-center gap-1 text-slate-700">
                <Maximize2 className="w-3.5 h-3.5 text-teal-600" />
                <span>{property.specs.totalArea}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-normal">m² tot.</span>
            </div>

            <div className="flex flex-col items-center justify-center p-1 rounded-xl bg-slate-50" title="Estacionamientos">
              <div className="flex items-center gap-1 text-slate-700">
                <Car className="w-3.5 h-3.5 text-teal-600" />
                <span>{property.specs.parkingSpots}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-normal">Estac.</span>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="space-y-2 pt-1">
          <div className="grid grid-cols-2 gap-2">
            
            {/* Schedule Visit Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setBookingProperty(property);
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 font-bold text-xs transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Agendar</span>
            </button>

            {/* Direct WhatsApp Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-600/20 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* View Details Text link */}
          <button
            type="button"
            onClick={() => setSelectedProperty(property)}
            className="w-full text-center py-1 text-xs font-bold text-teal-700 hover:text-teal-800 hover:underline"
          >
            Ver fotos, video tour y ficha completa →
          </button>
        </div>

      </div>

    </div>
  );
};
