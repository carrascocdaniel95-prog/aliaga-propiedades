import React from 'react';

interface FacelessExecutiveAvatarProps {
  className?: string;
  size?: number;
}

export const FacelessExecutiveAvatar: React.FC<FacelessExecutiveAvatarProps> = ({ 
  className = "w-10 h-10", 
  size = 40 
}) => {
  return (
    <div 
      className={`relative rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-gradient-to-br from-[#132742] via-[#1c3a60] to-[#0f1f33] shadow-md border-2 border-[#c5a358] ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* Fondo sutil */}
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="100%" stopColor="#0d1b2a" />
          </linearGradient>

          {/* Tono de piel cálido suave */}
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f7d5be" />
            <stop offset="100%" stopColor="#eabf9f" />
          </linearGradient>

          {/* Sombra de cuello */}
          <linearGradient id="neckShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d8a884" />
            <stop offset="100%" stopColor="#eabf9f" />
          </linearGradient>

          {/* Cabello ejecutivo elegante */}
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2c221e" />
            <stop offset="100%" stopColor="#1a1412" />
          </linearGradient>

          {/* Traje sastre ejecutivo azul corporativo Aliaga */}
          <linearGradient id="suitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#173153" />
            <stop offset="100%" stopColor="#0e1e33" />
          </linearGradient>

          {/* Broche o detalle dorado */}
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3e0aa" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#aa8214" />
          </linearGradient>
        </defs>

        {/* Círculo de fondo */}
        <circle cx="50" cy="50" r="50" fill="url(#bgGrad)" />

        {/* Resplandor suave dorado de fondo */}
        <circle cx="50" cy="46" r="34" fill="url(#goldGrad)" opacity="0.12" />

        {/* Cabello parte trasera (moño bajo pulcro) */}
        <ellipse cx="50" cy="42" rx="23" ry="24" fill="url(#hairGrad)" />
        <ellipse cx="50" cy="30" rx="14" ry="11" fill="#15100e" />

        {/* Cuello estilizado */}
        <path d="M43 54 L57 54 L56 68 L44 68 Z" fill="url(#neckShadow)" />

        {/* Rostro Faceless / Minimalista */}
        <path
          d="M33 42 C33 30 40 24 50 24 C60 24 67 30 67 42 C67 52 59 60 50 60 C41 60 33 52 33 42 Z"
          fill="url(#skinGrad)"
        />

        {/* Peinado frontal elegante (raya al costado ejecutiva, sin rostro) */}
        <path
          d="M33 40 C34 31 41 24 50 24 C57 24 64 28 67 35 C63 32 55 31 46 33 C39 35 35 38 33 40 Z"
          fill="url(#hairGrad)"
        />
        {/* Mechón lateral estilizado */}
        <path
          d="M66 36 C66 43 64 48 62 50 C63 46 66 40 66 36 Z"
          fill="#1f1815"
        />

        {/* Arete de perla o botón dorado minimalista */}
        <circle cx="33" cy="45" r="2" fill="url(#goldGrad)" />
        <circle cx="67" cy="45" r="2" fill="url(#goldGrad)" />

        {/* Blusa cuello en V blanca */}
        <path d="M42 66 L50 78 L58 66 L54 64 L46 64 Z" fill="#ffffff" />
        <path d="M46 64 L50 74 L54 64 Z" fill="#e2e8f0" />

        {/* Traje sastre blazer azul marino estructurado */}
        <path
          d="M20 100 C20 86 28 72 40 68 L48 78 L40 92 L20 100 Z"
          fill="url(#suitGrad)"
        />
        <path
          d="M80 100 C80 86 72 72 60 68 L52 78 L60 92 L80 100 Z"
          fill="url(#suitGrad)"
        />

        {/* Solapas del blazer */}
        <path d="M37 68 L47 78 L43 90 L33 76 Z" fill="#204068" />
        <path d="M63 68 L53 78 L57 90 L67 76 Z" fill="#1b385c" />

        {/* Botón / pin dorado de solapa */}
        <circle cx="39" cy="80" r="1.8" fill="url(#goldGrad)" />
      </svg>
    </div>
  );
};
