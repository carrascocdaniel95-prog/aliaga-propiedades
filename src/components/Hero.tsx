import React, { useState } from 'react';
import { Search, MapPin, Home, Key, PlayCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { OperationType, PropertyType } from '../types/property';

export const Hero: React.FC = () => {
  const { filters, setFilters, setIsCustomRequestOpen } = useProperties();
  const [localOperation, setLocalOperation] = useState<OperationType | 'todas'>(filters.operation);
  const [localType, setLocalType] = useState<PropertyType | 'todas'>(filters.propertyType);
  const [localCommune, setLocalCommune] = useState<string>(filters.commune);
  const [localQuery, setLocalQuery] = useState<string>(filters.searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({
      ...prev,
      operation: localOperation,
      propertyType: localType,
      commune: localCommune,
      searchQuery: localQuery
    }));
    const el = document.getElementById('propiedades-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-slate-900 text-white overflow-hidden">
      {/* Background with subtle gradient & overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 transform scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/60" />

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/30 text-teal-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            Fotos de Alta Resolución & Video Tours 4K
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-slate-200 text-xs font-medium backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Propiedades Verificadas
          </div>
        </div>

        {/* Main Headings */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Descubre tu próximo espacio con <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-300 to-emerald-400">experiencia interactiva</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
            Explora galerías completas, recorre en video antes de visitar y solicita la propiedad ideal para comprar o arrendar con atención personalizada inmediata.
          </p>
        </div>

        {/* Interactive Search Box */}
        <div className="mt-10 max-w-4xl mx-auto bg-white rounded-3xl p-3 sm:p-5 shadow-2xl border border-slate-100 text-slate-800">
          
          {/* Operation Tabs */}
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <button
              type="button"
              onClick={() => setLocalOperation('todas')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                localOperation === 'todas'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todas las Opciones
            </button>
            <button
              type="button"
              onClick={() => setLocalOperation('venta')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                localOperation === 'venta'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              Comprar
            </button>
            <button
              type="button"
              onClick={() => setLocalOperation('arriendo')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                localOperation === 'arriendo'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              Arrendar
            </button>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            
            {/* Search Input */}
            <div className="lg:col-span-4 relative">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Búsqueda o Código
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ej: Parcela en Villarrica, Casa en Pucón, PL-701..."
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>
            </div>

            {/* Property Type */}
            <div className="lg:col-span-3">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Tipo de Propiedad
              </label>
              <select
                value={localType}
                onChange={(e) => setLocalType(e.target.value as PropertyType | 'todas')}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 bg-white"
              >
                <option value="todas">Todos los tipos</option>
                <option value="departamento">Departamento</option>
                <option value="casa">Casa</option>
                <option value="penthouse">Penthouse</option>
                <option value="parcela">Parcela</option>
                <option value="oficina">Oficina Comercial</option>
              </select>
            </div>

            {/* Location / Commune */}
            <div className="lg:col-span-3">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Comuna / Sector
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={localCommune}
                  onChange={(e) => setLocalCommune(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 bg-white"
                >
                  <option value="todas">Todas las zonas (Araucanía & Chile)</option>
                  <option value="Pucón">Pucón (Lago Villarrica)</option>
                  <option value="Villarrica">Villarrica</option>
                  <option value="Temuco">Temuco</option>
                  <option value="Malalcahuello">Malalcahuello (Volcán Lonquimay)</option>
                  <option value="Caburgua">Caburgua</option>
                  <option value="Las Condes">Las Condes (Santiago)</option>
                  <option value="Puerto Varas">Puerto Varas</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="lg:col-span-2 pt-2 sm:pt-5">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-600/25 transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Buscar</span>
              </button>
            </div>

          </form>

          {/* Quick Footer hint */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <span className="flex items-center gap-1.5">
              <PlayCircle className="w-4 h-4 text-teal-600" />
              Haz clic en cualquier propiedad para ver su video tour y fotos en pantalla completa.
            </span>
            <button
              type="button"
              onClick={() => setIsCustomRequestOpen(true)}
              className="text-teal-700 hover:text-teal-800 font-semibold underline"
            >
              ¿No encuentras lo que buscas? Déjanos tu requerimiento aquí
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
