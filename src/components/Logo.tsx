import React, { useState, useEffect } from 'react';

export type HandLogoOption = 
  | 'aliaga'
  | 'sur-hogar' 
  | 'araucania-mano' 
  | 'pehuen-mano' 
  | 'manos-del-sur'
  | 'tierras-del-sur';

export interface HandLogoMeta {
  id: HandLogoOption;
  name: string;
  subtitle: string;
  tagline: string;
  description: string;
  image?: string;
  fullLogoImage?: string;
  isVectorSvg?: boolean;
}

export const HAND_LOGOS: Record<HandLogoOption, HandLogoMeta> = {
  'aliaga': {
    id: 'aliaga',
    name: 'ALIAGA',
    subtitle: 'GESTIÓN & CORRETAJE',
    tagline: 'Mano abierta sosteniendo hogares en azul marino y dorado',
    description: 'Logotipo oficial de Aliaga Gestión & Corretaje: mano abierta que sostiene y cobija propiedades con trazo dorado y azul corporativo.',
    image: '/logo-aliaga-emblem.jpg',
    fullLogoImage: '/logo-aliaga.jpg'
  },
  'sur-hogar': {
    id: 'sur-hogar',
    name: 'Sur Propiedades',
    subtitle: 'Bienes Raíces • Araucanía',
    tagline: 'Mano abierta sosteniendo el hogar',
    description: 'Trazo continuo y minimalista de una mano abierta que sostiene la silueta de una casa con brote de araucaria. Simboliza confianza, entrega de llaves y cobijo sureño.',
    image: '/logo-hand-house.jpg'
  },
  'araucania-mano': {
    id: 'araucania-mano',
    name: 'Araucanía Propiedades',
    subtitle: 'Sur de Chile',
    tagline: 'Mano abierta cobijando la Araucaria',
    description: 'Ilustración lineal poética de una mano abierta que sostiene delicadamente un árbol de araucaria. Representa el cuidado patrimonial, raíces y respeto por la tierra.',
    image: '/logo-hand-araucaria.jpg'
  },
  'pehuen-mano': {
    id: 'pehuen-mano',
    name: 'Pehuén Inmobiliaria',
    subtitle: 'La Araucanía • Chile',
    tagline: 'Mano acogedora & Pehuén minimalista',
    description: 'Diseño geométrico limpio: una palma abierta estilizada que sostiene un brote de pehuén simétrico y techo en ángulo.',
    isVectorSvg: true
  },
  'manos-del-sur': {
    id: 'manos-del-sur',
    name: 'Manos del Sur',
    subtitle: 'Propiedades & Campos',
    tagline: 'Sello circular con mano y volcán',
    description: 'Sello minimalista con líneas puras: una mano abierta en gesto de bienvenida con la cumbre de la cordillera y bosque nativo.',
    isVectorSvg: true
  },
  'tierras-del-sur': {
    id: 'tierras-del-sur',
    name: 'Tierras del Sur',
    subtitle: 'Bienes Raíces • Araucanía',
    tagline: 'Mano abierta & llave de montaña',
    description: 'Silueta lineal elegante de una mano que recibe y entrega un hogar en el sur.',
    isVectorSvg: true
  }
};

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  showSubtitle?: boolean;
  selectedLogo?: HandLogoOption;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'light',
  showSubtitle = true,
  selectedLogo
}) => {
  const isDark = variant === 'dark';

  const [activeKey, setActiveKey] = useState<HandLogoOption>(() => {
    return selectedLogo || 'aliaga';
  });

  useEffect(() => {
    if (selectedLogo) {
      setActiveKey(selectedLogo);
    }
  }, [selectedLogo]);

  const activeData = HAND_LOGOS[activeKey] || HAND_LOGOS['aliaga'];

  const iconDimensions = {
    sm: { className: 'w-10 h-10', sizePx: 40 },
    md: { className: 'w-14 h-14 sm:w-16 sm:h-16', sizePx: 60 },
    lg: { className: 'w-16 h-16 sm:w-20 sm:h-20', sizePx: 76 }
  };

  const dim = iconDimensions[size] || iconDimensions.lg;

  const titleSizes = {
    sm: 'text-lg font-black font-serif',
    md: 'text-2xl sm:text-3xl font-black font-serif',
    lg: 'text-3xl sm:text-4xl font-black font-serif'
  };

  const isAliaga = activeKey === 'aliaga';

  return (
    <div className="flex items-center gap-3.5 select-none">
      
      {/* Icon or Image Emblem */}
      <div 
        className={`relative ${dim.className} rounded-2xl overflow-hidden border ${
          isDark 
            ? 'border-[#c5a358]/50 bg-slate-900 shadow-md' 
            : isAliaga 
              ? 'border-[#c5a358]/70 bg-white shadow-md' 
              : 'border-slate-200/90 bg-amber-50/20 shadow-slate-100'
        } shadow-sm transition-transform group-hover:scale-105 flex items-center justify-center flex-shrink-0 p-1`}
        style={{ width: dim.sizePx, height: dim.sizePx, minWidth: dim.sizePx, minHeight: dim.sizePx, maxWidth: dim.sizePx, maxHeight: dim.sizePx }}
      >
        
        {activeData.image ? (
          <img
            src={activeData.image}
            alt={activeData.name}
            className="w-full h-full object-cover block rounded-xl"
            style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
          />
        ) : (
          /* High-res vector hand SVG for pure line options */
          <div className="w-full h-full p-2 flex items-center justify-center">
            {activeKey === 'pehuen-mano' && (
              <svg viewBox="0 0 100 100" className="w-full h-full text-teal-800" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                {/* Minimalist open hand */}
                <path d="M20 65 C25 50, 40 45, 52 50 C58 45, 68 45, 75 52 C80 50, 86 52, 88 58 C90 62, 85 70, 72 75 C60 80, 35 78, 20 65 Z" />
                <path d="M52 50 L52 70" />
                <path d="M68 50 L68 72" />
                {/* Stylized small Araucaria on palm */}
                <line x1="50" y1="20" x2="50" y2="46" strokeWidth="3.5" />
                <path d="M35 28 Q50 32 65 28" />
                <path d="M30 36 Q50 40 70 36" />
                <path d="M38 22 Q50 25 62 22" />
              </svg>
            )}

            {activeKey === 'manos-del-sur' && (
              <svg viewBox="0 0 100 100" className="w-full h-full text-teal-800" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                {/* Circular ring */}
                <circle cx="50" cy="50" r="44" strokeWidth="2.5" />
                {/* Mountain contour */}
                <path d="M25 55 L45 32 L65 55" strokeWidth="2.5" />
                <path d="M45 32 L49 39 L41 39 Z" fill="currentColor" opacity="0.3" />
                {/* Open hand at base */}
                <path d="M22 68 C35 60, 50 62, 78 68 C72 75, 45 78, 22 68 Z" />
                <path d="M60 52 C65 52, 70 56, 75 62" />
              </svg>
            )}

            {activeKey === 'tierras-del-sur' && (
              <svg viewBox="0 0 100 100" className="w-full h-full text-teal-800" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                {/* Open hand cupping a small gable roof */}
                <path d="M18 64 C30 52, 45 56, 80 62 C74 72, 45 76, 18 64 Z" />
                {/* Minimal roof and tree */}
                <path d="M38 48 L50 36 L62 48" strokeWidth="3.5" />
                <line x1="50" y1="36" x2="50" y2="22" />
                <path d="M42 26 L50 20 L58 26" />
              </svg>
            )}
          </div>
        )}

      </div>

      {/* Typography */}
      <div className="flex flex-col justify-center">
        <div className={`tracking-wider leading-none ${titleSizes[size]} ${
          isDark 
            ? 'text-white' 
            : isAliaga 
              ? 'text-[#173153]' 
              : 'text-slate-900'
        }`}>
          {activeData.name}
        </div>
        {showSubtitle && (
          <div className={`font-black uppercase tracking-[0.24em] mt-1.5 flex items-center gap-1.5 ${
            isDark 
              ? 'text-[#f3e0aa]' 
              : isAliaga 
                ? 'text-[#b38f38]' 
                : 'text-teal-800'
          } ${size === 'lg' ? 'text-xs sm:text-[13px]' : 'text-[10px] sm:text-[11px]'}`}>
            <span>{activeData.subtitle}</span>
          </div>
        )}
      </div>

    </div>
  );
};
