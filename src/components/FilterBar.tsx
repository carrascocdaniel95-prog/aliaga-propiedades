import React, { useState } from 'react';
import { 
  RotateCcw, 
  ChevronDown, 
  SlidersHorizontal, 
  Check
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';

const POPULAR_AMENITIES = [
  'Piscina',
  'Quincho',
  'Gimnasio',
  'Seguridad 24/7',
  'Terraza',
  'Jacuzzi',
  'Calefacción'
];

export const FilterBar: React.FC = () => {
  const { filters, setFilters, resetFilters, filteredProperties, properties } = useProperties();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const isFiltered = 
    filters.operation !== 'todas' ||
    filters.propertyType !== 'todas' ||
    filters.commune !== 'todas' ||
    filters.minBedrooms > 0 ||
    filters.minBathrooms > 0 ||
    filters.petFriendlyOnly ||
    filters.parkingOnly ||
    filters.selectedAmenities.length > 0 ||
    filters.searchQuery !== '';

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => {
      const exists = prev.selectedAmenities.includes(amenity);
      return {
        ...prev,
        selectedAmenities: exists
          ? prev.selectedAmenities.filter(a => a !== amenity)
          : [...prev.selectedAmenities, amenity]
      };
    });
  };

  return (
    <div id="propiedades-section" className="bg-white border-y border-slate-200/80 sticky top-20 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        
        {/* Main Controls Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Operation & Count */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 hidden sm:inline-block">
              Operación:
            </span>
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {(['todas', 'venta', 'arriendo'] as const).map(op => (
                <button
                  key={op}
                  onClick={() => setFilters(prev => ({ ...prev, operation: op }))}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                    filters.operation === op
                      ? 'bg-white text-teal-800 shadow-xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {op === 'todas' ? 'Todas' : op === 'venta' ? 'En Venta' : 'En Arriendo'}
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            {/* Type selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {(['todas', 'departamento', 'casa', 'penthouse', 'parcela'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFilters(prev => ({ ...prev, propertyType: type }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    filters.propertyType === type
                      ? 'bg-teal-50 border border-teal-300 text-teal-800'
                      : 'bg-slate-50 border border-slate-200/70 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {type === 'todas' ? 'Todos los tipos' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Right Controls: Sort & Advanced Filter Toggle */}
          <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
            
            {/* Properties Counter */}
            <div className="text-xs text-slate-500 font-medium">
              <span className="font-bold text-slate-900">{filteredProperties.length}</span> de {properties.length} disponibles
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                aria-label="Ordenar propiedades por"
                className="appearance-none pl-3 pr-8 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
              >
                <option value="newest">Más recientes</option>
                <option value="price-asc">Menor precio</option>
                <option value="price-desc">Mayor precio</option>
                <option value="area-desc">Mayor superficie (m²)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Advanced Filters Button */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                showAdvanced || filters.selectedAmenities.length > 0 || filters.minBedrooms > 0 || filters.minBathrooms > 0 || filters.petFriendlyOnly
                  ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtros</span>
            </button>

            {/* Reset Filters */}
            {isFiltered && (
              <button
                onClick={resetFilters}
                title="Limpiar todos los filtros"
                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

          </div>

        </div>

        {/* Advanced Filters Collapsible Drawer */}
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
            
            {/* Bedrooms selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Dormitorios Mínimos
              </label>
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4].map(num => (
                  <button
                    key={num}
                    onClick={() => setFilters(prev => ({ ...prev, minBedrooms: num }))}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      filters.minBedrooms === num
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {num === 0 ? 'Cualquiera' : `${num}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Bathrooms selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Baños Mínimos
              </label>
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3].map(num => (
                  <button
                    key={num}
                    onClick={() => setFilters(prev => ({ ...prev, minBathrooms: num }))}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      filters.minBathrooms === num
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {num === 0 ? 'Cualquiera' : `${num}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick check toggles */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Comodidades Clave
              </label>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={filters.petFriendlyOnly}
                    onChange={(e) => setFilters(prev => ({ ...prev, petFriendlyOnly: e.target.checked }))}
                    className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                  />
                  <span>Acepta mascotas (Pet Friendly)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={filters.parkingOnly}
                    onChange={(e) => setFilters(prev => ({ ...prev, parkingOnly: e.target.checked }))}
                    className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                  />
                  <span>Con estacionamiento incluido</span>
                </label>
              </div>
            </div>

            {/* Amenities chips */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Amenidades Específicas
              </label>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_AMENITIES.map(amenity => {
                  const isSelected = filters.selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      onClick={() => handleAmenityToggle(amenity)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                        isSelected
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      {amenity}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
