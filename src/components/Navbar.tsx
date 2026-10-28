import React, { useState } from 'react';
import { 
  Building2, 
  Heart, 
  Scale, 
  MessageCircle, 
  Sparkles, 
  Settings, 
  Menu, 
  X, 
  PhoneCall,
  KeyRound
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const { 
    favorites, 
    comparisonList, 
    setIsComparatorOpen, 
    setIsCustomRequestOpen, 
    setIsAdminOpen,
    setFilters 
  } = useProperties();
  const { isAuthenticated } = useAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleFilterOperation = (operation: 'venta' | 'arriendo' | 'todas') => {
    setFilters(prev => ({ ...prev, operation }));
    const section = document.getElementById('propiedades-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer group py-1"
            >
              <Logo size="md" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            <button 
              onClick={() => handleFilterOperation('todas')}
              className="text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors"
            >
              Propiedades
            </button>
            <button 
              onClick={() => handleFilterOperation('venta')}
              className="text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors"
            >
              En Venta
            </button>
            <button 
              onClick={() => handleFilterOperation('arriendo')}
              className="text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors"
            >
              En Arriendo
            </button>
            
            <button
              onClick={() => setIsCustomRequestOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200/80 hover:bg-teal-100 transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Solicitar a Medida
            </button>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Comparator Button */}
            <button
              onClick={() => setIsComparatorOpen(true)}
              title="Comparar propiedades seleccionadas"
              className="relative p-2.5 rounded-xl text-slate-600 hover:text-teal-700 hover:bg-slate-100 transition-all"
            >
              <Scale className="w-5 h-5" />
              {comparisonList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse shadow">
                  {comparisonList.length}
                </span>
              )}
            </button>

            {/* Favorites Button */}
            <button
              onClick={() => {
                const section = document.getElementById('propiedades-section');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
              }}
              title={`Favoritos guardados (${favorites.length})`}
              className="relative p-2.5 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-slate-100 transition-all"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* WhatsApp Quick Link */}
            <a
              href="https://wa.me/56976691216?text=Hola%20Aliaga%20Gesti%C3%B3n%20%26%20Corretaje%2C%20quisiera%20asesor%C3%ADa%20sobre%20sus%20propiedades%20disponibles."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp</span>
            </a>

            {/* Mantenedor de Propiedades button */}
            <button
              onClick={() => setIsAdminOpen(true)}
              title={isAuthenticated ? 'Mantenedor (Sesión Activa)' : 'Acceso Seguro al Mantenedor'}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                isAuthenticated
                  ? 'bg-teal-50 border-teal-300 text-teal-900 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              }`}
            >
              <KeyRound className="w-4 h-4 text-teal-600" />
              <span>Mantenedor</span>
              {isAuthenticated && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" title="Sesión Activa" />
              )}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsComparatorOpen(true)}
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Scale className="w-5 h-5" />
              {comparisonList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {comparisonList.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleFilterOperation('venta')}
              className="py-2.5 px-3 rounded-xl bg-slate-50 text-slate-800 font-semibold text-sm hover:bg-teal-50 hover:text-teal-700"
            >
              Comprar
            </button>
            <button
              onClick={() => handleFilterOperation('arriendo')}
              className="py-2.5 px-3 rounded-xl bg-slate-50 text-slate-800 font-semibold text-sm hover:bg-teal-50 hover:text-teal-700"
            >
              Arrendar
            </button>
          </div>

          <button
            onClick={() => {
              setIsCustomRequestOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-bold text-sm"
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
            Solicitar una Propiedad a Medida
          </button>

          <a
            href="https://wa.me/56976691216?text=Hola%20Aliaga%20Gesti%C3%B3n%20%26%20Corretaje%2C%20quisiera%20asesor%C3%ADa%20sobre%20sus%20propiedades."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-md"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            Contactar por WhatsApp (+56 9 7669 1216)
          </a>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
              Llámanos: +56 9 7669 1216
            </span>
            <button
              onClick={() => {
                setIsAdminOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1 text-teal-700 font-bold hover:underline"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Mantenedor Seguro</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
