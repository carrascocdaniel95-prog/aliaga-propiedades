import React from 'react';
import { X, Check, Sparkles, HeartHandshake } from 'lucide-react';
import { HAND_LOGOS, HandLogoOption } from './Logo';

interface LogoPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLogo: HandLogoOption;
  onSelectLogo: (logoKey: HandLogoOption) => void;
}

export const LogoPickerModal: React.FC<LogoPickerModalProps> = ({
  isOpen,
  onClose,
  currentLogo,
  onSelectLogo
}) => {
  if (!isOpen) return null;

  const options = Object.values(HAND_LOGOS);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div 
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">
                Logotipos Ultra-Minimalistas (Mano Abierta & Sur de Chile)
              </h3>
              <p className="text-xs text-slate-400">
                Líneas puras, poéticas y simples que simbolizan cobijo, hospitalidad y arraigo en La Araucanía
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Grid */}
        <div className="overflow-y-auto p-6 flex-1 bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {options.map((opt, idx) => {
              const isSelected = currentLogo === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => onSelectLogo(opt.id)}
                  className={`bg-white rounded-2xl p-4 border-2 transition-all cursor-pointer flex flex-col justify-between hover:shadow-lg ${
                    isSelected
                      ? 'border-teal-600 ring-2 ring-teal-200 shadow-md'
                      : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    
                    {/* Badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        Opción {idx + 1}
                      </span>
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-600 text-white shadow-xs">
                          <Check className="w-3 h-3" /> Activo en la web
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400">
                          {opt.tagline}
                        </span>
                      )}
                    </div>

                    {/* Preview Area */}
                    <div className="aspect-square rounded-2xl overflow-hidden bg-amber-50/30 border border-slate-100 flex items-center justify-center p-3">
                      {opt.image ? (
                        <img
                          src={opt.image}
                          alt={opt.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        /* Vector preview */
                        <div className="w-28 h-28 text-teal-800 flex items-center justify-center">
                          {opt.id === 'pehuen-mano' && (
                            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 65 C25 50, 40 45, 52 50 C58 45, 68 45, 75 52 C80 50, 86 52, 88 58 C90 62, 85 70, 72 75 C60 80, 35 78, 20 65 Z" />
                              <path d="M52 50 L52 70" />
                              <path d="M68 50 L68 72" />
                              <line x1="50" y1="20" x2="50" y2="46" strokeWidth="3.5" />
                              <path d="M35 28 Q50 32 65 28" />
                              <path d="M30 36 Q50 40 70 36" />
                              <path d="M38 22 Q50 25 62 22" />
                            </svg>
                          )}
                          {opt.id === 'manos-del-sur' && (
                            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="50" cy="50" r="44" />
                              <path d="M25 55 L45 32 L65 55" />
                              <path d="M22 68 C35 60, 50 62, 78 68 C72 75, 45 78, 22 68 Z" />
                              <path d="M60 52 C65 52, 70 56, 75 62" />
                            </svg>
                          )}
                          {opt.id === 'tierras-del-sur' && (
                            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 64 C30 52, 45 56, 80 62 C74 72, 45 76, 18 64 Z" />
                              <path d="M38 48 L50 36 L62 48" strokeWidth="3.5" />
                              <line x1="50" y1="36" x2="50" y2="22" />
                              <path d="M42 26 L50 20 L58 26" />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div>
                      <h4 className="font-serif font-black text-slate-900 text-base leading-snug">
                        {opt.name}
                      </h4>
                      <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
                        {opt.subtitle}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>

                  </div>

                  {/* Button */}
                  <div className="pt-3 border-t border-slate-100 mt-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectLogo(opt.id);
                      }}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? '✓ Logotipo Activo' : 'Elegir este Logotipo'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Selecciona una opción para aplicarla en toda la plataforma al instante.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
          >
            Listo / Cerrar
          </button>
        </div>

      </div>

    </div>
  );
};
