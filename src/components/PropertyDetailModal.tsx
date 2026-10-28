import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Car, 
  Package, 
  Compass, 
  Calendar, 
  CalendarCheck, 
  Sparkles, 
  Heart, 
  Scale, 
  MessageCircle, 
  Play, 
  Camera, 
  Map, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Expand, 
  Share2, 
  Phone
} from 'lucide-react';
import { Property } from '../types/property';
import { useProperties } from '../context/PropertyContext';
import { formatPrice, createPropertyWhatsAppMessage, getWhatsAppUrl, extractYouTubeEmbedUrl } from '../utils/formatters';

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({ property, onClose }) => {
  const { 
    setBookingProperty, 
    toggleFavorite, 
    isFavorite, 
    toggleComparison, 
    isInComparison, 
    openLightbox 
  } = useProperties();

  const [activeTab, setActiveTab] = useState<'photos' | 'video' | 'map'>('photos');
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const isFav = isFavorite(property.id);
  const isComp = isInComparison(property.id);

  const whatsappMessage = createPropertyWhatsAppMessage(property);
  const whatsappUrl = getWhatsAppUrl(property.agent.whatsapp || '56976691216', whatsappMessage);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleNextPhoto = () => {
    setActivePhotoIdx(prev => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  const handlePrevPhoto = () => {
    setActivePhotoIdx(prev => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-start justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      <div 
        className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden my-4 sm:my-8 border border-slate-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Sticky Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white ${
              property.operation === 'venta' ? 'bg-teal-600' : 'bg-blue-600'
            }`}>
              {property.operation === 'venta' ? 'En Venta' : 'En Arriendo'}
            </span>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              Código: {property.code}
            </span>
            <span className="hidden sm:inline-flex text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              {property.status === 'disponible' ? 'Disponible para Entrega' : property.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Share button */}
            <button
              onClick={handleCopyLink}
              title="Copiar enlace"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
            >
              <Share2 className="w-5 h-5" />
              {copiedLink && (
                <span className="absolute -bottom-8 right-0 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded shadow whitespace-nowrap">
                  ¡Enlace copiado!
                </span>
              )}
            </button>

            {/* Compare toggle */}
            <button
              onClick={() => toggleComparison(property.id)}
              title={isComp ? 'Quitar de comparar' : 'Comparar'}
              className={`p-2 rounded-xl transition-all ${
                isComp ? 'bg-teal-600 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Scale className="w-5 h-5" />
            </button>

            {/* Favorite toggle */}
            <button
              onClick={() => toggleFavorite(property.id)}
              title={isFav ? 'Quitar de favoritos' : 'Favorito'}
              className={`p-2 rounded-xl transition-all ${
                isFav ? 'bg-rose-500 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-white' : ''}`} />
            </button>

            {/* Close modal */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
          
          {/* Title & Location Header */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              {property.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-slate-600 text-sm font-medium">
              <span className="flex items-center gap-1 text-teal-700">
                <MapPin className="w-4 h-4" />
                {property.address}, {property.commune}, {property.city}
              </span>
              {property.neighborhood && (
                <span className="text-slate-400">• Sector {property.neighborhood}</span>
              )}
            </div>
          </div>

          {/* Interactive Multimedia Stage: Photos / Video / Map */}
          <div className="space-y-3">
            
            {/* View Switcher Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <button
                onClick={() => setActiveTab('photos')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'photos'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Fotos en Alta Calidad ({property.images.length})</span>
              </button>

              {property.videoUrl && (
                <button
                  onClick={() => setActiveTab('video')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'video'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Video Tour 4K</span>
                </button>
              )}

              {property.mapEmbedUrl && (
                <button
                  onClick={() => setActiveTab('map')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'map'
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Map className="w-4 h-4" />
                  <span>Ubicación en Mapa</span>
                </button>
              )}
            </div>

            {/* TAB 1: Photo Viewer */}
            {activeTab === 'photos' && (
              <div className="space-y-3">
                <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-950 group">
                  <img
                    src={property.images[activePhotoIdx]}
                    alt={`Foto ${activePhotoIdx + 1} de ${property.title}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Navigation Arrows */}
                  <button
                    onClick={handlePrevPhoto}
                    aria-label="Foto anterior"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all backdrop-blur-xs"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    onClick={handleNextPhoto}
                    aria-label="Foto siguiente"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all backdrop-blur-xs"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Fullscreen Button */}
                  <button
                    onClick={() => openLightbox(property.images, activePhotoIdx)}
                    className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/90 text-white text-xs font-bold backdrop-blur-xs transition-all"
                  >
                    <Expand className="w-4 h-4" />
                    <span>Pantalla Completa</span>
                  </button>

                  {/* Counter */}
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-black/60 text-white text-xs font-bold backdrop-blur-xs">
                    {activePhotoIdx + 1} / {property.images.length}
                  </div>
                </div>

                {/* Thumbnails strip */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  {property.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`relative flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        activePhotoIdx === idx
                          ? 'border-teal-600 scale-102 ring-2 ring-teal-200'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: Video Player */}
            {activeTab === 'video' && property.videoUrl && (
              <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-black shadow-lg">
                <iframe
                  src={extractYouTubeEmbedUrl(property.videoUrl)}
                  title={`Video Tour de ${property.title}`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* TAB 3: Map Viewer */}
            {activeTab === 'map' && property.mapEmbedUrl && (
              <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <iframe
                  src={property.mapEmbedUrl}
                  title={`Ubicación de ${property.title}`}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            )}

          </div>

          {/* Details & Action Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 8 Cols: Specs, Description, Amenities */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-teal-700">
                    <Bed className="w-5 h-5" />
                    <span className="text-lg font-extrabold text-slate-800">{property.specs.bedrooms}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium mt-1">Dormitorios</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-teal-700">
                    <Bath className="w-5 h-5" />
                    <span className="text-lg font-extrabold text-slate-800">{property.specs.bathrooms}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium mt-1">Baños completos</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-teal-700">
                    <Maximize2 className="w-5 h-5" />
                    <span className="text-lg font-extrabold text-slate-800">{property.specs.totalArea} m²</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium mt-1">Superficie Total ({property.specs.builtArea} m² útil)</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-teal-700">
                    <Car className="w-5 h-5" />
                    <span className="text-lg font-extrabold text-slate-800">{property.specs.parkingSpots}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium mt-1">Estacionamientos</span>
                </div>
              </div>

              {/* Secondary Specs row */}
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                {property.specs.storageUnits !== undefined && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100">
                    <Package className="w-4 h-4 text-slate-500" />
                    <span>{property.specs.storageUnits} Bodega(s)</span>
                  </div>
                )}
                {property.specs.orientation && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100">
                    <Compass className="w-4 h-4 text-slate-500" />
                    <span>Orientación {property.specs.orientation}</span>
                  </div>
                )}
                {property.specs.floor && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100">
                    <span>Piso {property.specs.floor}</span>
                  </div>
                )}
                {property.specs.petFriendly && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <span>🐾 Acepta Mascotas</span>
                  </div>
                )}
                {property.specs.yearBuilt && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>Año {property.specs.yearBuilt}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Descripción General</h4>
                <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-3">Equipamiento & Amenidades</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {property.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 p-2.5 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right 4 Cols: Pricing & Direct Actions Box */}
            <div className="lg:col-span-4 bg-slate-50 rounded-3xl p-6 border border-slate-200/80 space-y-6">
              
              {/* Price card */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Valor de {property.operation === 'venta' ? 'Venta' : 'Arriendo'}
                </span>
                <div className="text-3xl font-black text-slate-900 mt-1">
                  {formatPrice(property.price, property.currency)}
                </div>
                {property.commonExpenses && (
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Gastos comunes aprox.: ${property.commonExpenses.toLocaleString('es-CL')} / mes
                  </p>
                )}
              </div>

              {/* Main Action Buttons */}
              <div className="space-y-2.5">
                
                {/* Schedule Visit */}
                <button
                  type="button"
                  onClick={() => setBookingProperty(property)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-600/25 transition-all"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Agendar Visita (Presencial o Virtual)</span>
                </button>

                {/* WhatsApp Direct */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Consultar por WhatsApp Directo</span>
                </a>

                {/* Compare / Favorite row */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => toggleComparison(property.id)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isComp 
                        ? 'bg-teal-50 border-teal-400 text-teal-800' 
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>{isComp ? 'En comparador' : 'Comparar'}</span>
                  </button>

                  <button
                    onClick={() => toggleFavorite(property.id)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isFav 
                        ? 'bg-rose-50 border-rose-300 text-rose-700' 
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{isFav ? 'Guardada' : 'Guardar'}</span>
                  </button>
                </div>

              </div>

              {/* Assigned Agent Card */}
              <div className="pt-4 border-t border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
                  Agente a Cargo
                </span>
                <div className="flex items-center gap-3">
                  <img
                    src={property.agent.photo}
                    alt={property.agent.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-teal-500 shadow-sm"
                  />
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">{property.agent.name}</h5>
                    <p className="text-xs text-slate-500">{property.agent.role}</p>
                    <div className="flex items-center gap-1 text-[11px] text-teal-700 font-semibold mt-0.5">
                      <Phone className="w-3 h-3" />
                      <span>{property.agent.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security reassurance */}
              <div className="bg-white p-3 rounded-xl border border-slate-200/60 text-[11px] text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-teal-600" />
                  Garantía Aliaga Gestión & Corretaje:
                </p>
                <p>Estudio de títulos y antecedentes legales al día. Sin sorpresas ni comisiones ocultas.</p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
