import React from 'react';
import { 
  X, 
  Scale, 
  Trash2, 
  Check, 
  Minus, 
  MessageCircle
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { formatPrice, createPropertyWhatsAppMessage, getWhatsAppUrl } from '../utils/formatters';

export const PropertyComparatorModal: React.FC = () => {
  const { 
    comparisonList, 
    clearComparison, 
    toggleComparison, 
    isComparatorOpen, 
    setIsComparatorOpen,
    properties,
    setSelectedProperty
  } = useProperties();

  if (!isComparatorOpen) return null;

  const comparedProps = properties.filter(p => comparisonList.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      <div 
        className="relative bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Comparador de Propiedades
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Comparando {comparedProps.length} {comparedProps.length === 1 ? 'propiedad' : 'propiedades'} lado a lado (máx 4)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {comparedProps.length > 0 && (
              <button
                onClick={clearComparison}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Vaciar comparador</span>
              </button>
            )}

            <button
              onClick={() => setIsComparatorOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1">
          {comparedProps.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Scale className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-800">
                  Aún no has agregado propiedades para comparar
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Explora las propiedades del catálogo y presiona el ícono de la balanza en las fichas que desees comparar.
                </p>
              </div>
              <button
                onClick={() => setIsComparatorOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-colors shadow-md"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs min-w-[650px]">
                
                {/* Visual Head Row: Photo & Title */}
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="p-3 w-40 text-slate-400 font-bold uppercase tracking-wider text-[11px] align-top bg-slate-50/50 rounded-tl-2xl">
                      Propiedad
                    </th>
                    {comparedProps.map(prop => (
                      <th key={prop.id} className="p-3 align-top min-w-[200px]">
                        <div className="space-y-2">
                          <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100">
                            <img
                              src={prop.images[0]}
                              alt={prop.title}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => toggleComparison(prop.id)}
                              title="Quitar"
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                              {prop.code}
                            </span>
                            <h4 className="font-bold text-slate-900 text-xs line-clamp-2 mt-1">
                              {prop.title}
                            </h4>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {/* Price */}
                  <tr>
                    <td className="p-3 font-bold text-slate-700 bg-slate-50/50">Precio</td>
                    {comparedProps.map(prop => (
                      <td key={prop.id} className="p-3">
                        <span className="text-base font-extrabold text-teal-700">
                          {formatPrice(prop.price, prop.currency)}
                        </span>
                        <div className="text-[10px] uppercase font-bold text-slate-400">
                          En {prop.operation}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Gastos Comunes */}
                  <tr>
                    <td className="p-3 font-bold text-slate-700 bg-slate-50/50">Gastos Comunes</td>
                    {comparedProps.map(prop => (
                      <td key={prop.id} className="p-3 text-slate-600 font-medium">
                        {prop.commonExpenses ? `$${prop.commonExpenses.toLocaleString('es-CL')} / mes` : 'No especificado'}
                      </td>
                    ))}
                  </tr>

                  {/* Tipo & Ubicación */}
                  <tr>
                    <td className="p-3 font-bold text-slate-700 bg-slate-50/50">Ubicación / Comuna</td>
                    {comparedProps.map(prop => (
                      <td key={prop.id} className="p-3 text-slate-700 font-semibold">
                        {prop.commune}, {prop.city}
                      </td>
                    ))}
                  </tr>

                  {/* Superficie Total & Útil */}
                  <tr>
                    <td className="p-3 font-bold text-slate-700 bg-slate-50/50">Superficie Total / Útil</td>
                    {comparedProps.map(prop => (
                      <td key={prop.id} className="p-3 text-slate-700 font-semibold">
                        {prop.specs.totalArea} m² tot. / {prop.specs.builtArea} m² útil
                      </td>
                    ))}
                  </tr>

                  {/* Dormitorios & Baños */}
                  <tr>
                    <td className="p-3 font-bold text-slate-700 bg-slate-50/50">Dormitorios / Baños</td>
                    {comparedProps.map(prop => (
                      <td key={prop.id} className="p-3 text-slate-700 font-semibold">
                        {prop.specs.bedrooms} dorm. • {prop.specs.bathrooms} baños
                      </td>
                    ))}
                  </tr>

                  {/* Estacionamientos */}
                  <tr>
                    <td className="p-3 font-bold text-slate-700 bg-slate-50/50">Estacionamientos / Bodegas</td>
                    {comparedProps.map(prop => (
                      <td key={prop.id} className="p-3 text-slate-700 font-medium">
                        {prop.specs.parkingSpots} estac. • {prop.specs.storageUnits || 0} bodegas
                      </td>
                    ))}
                  </tr>

                  {/* Pet Friendly */}
                  <tr>
                    <td className="p-3 font-bold text-slate-700 bg-slate-50/50">Acepta Mascotas</td>
                    {comparedProps.map(prop => (
                      <td key={prop.id} className="p-3">
                        {prop.specs.petFriendly ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                            <Check className="w-3.5 h-3.5" /> Sí
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400">
                            <Minus className="w-3.5 h-3.5" /> No
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Video Tour */}
                  <tr>
                    <td className="p-3 font-bold text-slate-700 bg-slate-50/50">Video Tour 4K</td>
                    {comparedProps.map(prop => (
                      <td key={prop.id} className="p-3">
                        {prop.videoUrl ? (
                          <span className="inline-flex items-center gap-1 text-rose-600 font-bold">
                            <Check className="w-3.5 h-3.5" /> Incluido
                          </span>
                        ) : (
                          <span className="text-slate-400">No disponible</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Actions Row */}
                  <tr>
                    <td className="p-3 font-bold text-slate-700 bg-slate-50/50">Acciones Directas</td>
                    {comparedProps.map(prop => {
                      const msg = createPropertyWhatsAppMessage(prop);
                      const waUrl = getWhatsAppUrl(prop.agent.whatsapp || '56976691216', msg);

                      return (
                        <td key={prop.id} className="p-3 space-y-1.5">
                          <button
                            onClick={() => {
                              setIsComparatorOpen(false);
                              setSelectedProperty(prop);
                            }}
                            className="w-full py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] text-center"
                          >
                            Ver Ficha Completa
                          </button>

                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1"
                          >
                            <MessageCircle className="w-3 h-3 fill-white" />
                            <span>WhatsApp</span>
                          </a>
                        </td>
                      );
                    })}
                  </tr>

                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
