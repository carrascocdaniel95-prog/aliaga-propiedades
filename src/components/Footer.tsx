import React from 'react';
import { MapPin, Phone, Mail, MessageCircle, Shield } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const { setIsCustomRequestOpen, setFilters } = useProperties();

  const handleFilter = (op: 'venta' | 'arriendo') => {
    setFilters(prev => ({ ...prev, operation: op }));
    const el = document.getElementById('propiedades-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 py-10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-xl sm:text-2xl font-black tracking-tight">
              ¿Quieres vender o arrendar tu propiedad con nosotros?
            </h4>
            <p className="text-teal-200 text-xs sm:text-sm">
              Sesión de fotos profesional en alta resolución y producción de video tour 4K incluidos.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://wa.me/56976691216?text=Hola%20Aliaga%20Gesti%C3%B3n%20%26%20Corretaje%2C%20quiero%20publicar%20mi%20propiedad%20con%20ustedes."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>Contactar por WhatsApp (+56 9 7669 1216)</span>
            </a>
            <button
              onClick={() => setIsCustomRequestOpen(true)}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors"
            >
              Solicitar Búsqueda a Medida
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Col 1: About */}
        <div className="space-y-4">
          <Logo variant="dark" size="md" />
          <p className="text-slate-400 leading-relaxed">
            Corretaje inmobiliario exclusivo en la Región de La Araucanía y el Sur de Chile. Casas lacustres, parcelas con bosque nativo, departamentos urbanos y oficinas de alto estándar. Experiencia visual inmersiva con video tours 4K.
          </p>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold">
            <Shield className="w-4 h-4" />
            <span>Asesoría legal y corretaje certificado</span>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="space-y-3">
          <h5 className="text-white font-bold uppercase tracking-wider text-xs">Propiedades</h5>
          <ul className="space-y-2">
            <li>
              <button onClick={() => handleFilter('venta')} className="hover:text-teal-400 transition-colors">
                Casas y Departamentos en Venta
              </button>
            </li>
            <li>
              <button onClick={() => handleFilter('arriendo')} className="hover:text-teal-400 transition-colors">
                Departamentos y Casas en Arriendo
              </button>
            </li>
            <li>
              <button onClick={() => setIsCustomRequestOpen(true)} className="hover:text-teal-400 transition-colors">
                Servicio "Búsqueda a tu Medida"
              </button>
            </li>
            <li>
              <a href="#propiedades-section" className="hover:text-teal-400 transition-colors">
                Propiedades Destacadas
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Sectores principales */}
        <div className="space-y-3">
          <h5 className="text-white font-bold uppercase tracking-wider text-xs">Sectores de Cobertura</h5>
          <p className="text-teal-400 font-semibold text-xs">
            Principalmente en:
          </p>
          <ul className="space-y-1.5">
            <li>Temuco (Los Pablos, Portal de la Frontera, Av. Alemania)</li>
            <li>Villarrica (Cuenca del Lago, Molco, Segunda Faja)</li>
            <li>Pucón (Playa Linda, La Poza, Camino al Volcán)</li>
            <li>Lago Caburgua & Curarrehue</li>
            <li>Curacautín, Malalcahuello & Zona Lacustre</li>
          </ul>
          <p className="text-white font-bold text-xs pt-1">
            Y en todo Chile
          </p>
        </div>

        {/* Col 4: Contact & Office */}
        <div className="space-y-3">
          <h5 className="text-white font-bold uppercase tracking-wider text-xs">Oficina & Contacto</h5>
          <ul className="space-y-2.5">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
              <span>Los Pablos 2190, Dpto. 1001, Temuco</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-teal-500 flex-shrink-0" />
              <span>+56 9 7669 1216</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-teal-500 flex-shrink-0" />
              <span>contacto@paulipropiedades.cl</span>
            </li>
            <li className="text-[11px] text-slate-500 pt-1">
              Horario de atención: Lunes a Sábado de 09:00 a 19:30 hrs.
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright */}
      <div className="border-t border-slate-900 py-6 text-center text-[11px] text-slate-500">
        <p>© 2026 Aliaga Gestión & Corretaje. Todos los derechos reservados. Desarrollado con tecnología interactiva moderna.</p>
      </div>

    </footer>
  );
};
