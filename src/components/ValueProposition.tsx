import React from 'react';
import { Camera, ShieldCheck, Video, Sparkles } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';

export const ValueProposition: React.FC = () => {
  const { setIsCustomRequestOpen } = useProperties();

  const features = [
    {
      icon: <Camera className="w-6 h-6 text-teal-600" />,
      title: 'Fotografía Arquitectónica & Video Tours',
      description: 'Cada propiedad cuenta con galería en alta resolución y recorrido en video para que conozcas la distribución real antes de agendar.'
    },
    {
      icon: <Video className="w-6 h-6 text-teal-600" />,
      title: 'Visitas Flexibles: En Terreno o por Videollamada',
      description: 'Si estás fuera de la ciudad o con agenda apretada, realizamos visitas guiadas en vivo por videollamada interactiva.'
    },
    {
      icon: <Sparkles className="w-6 h-6 text-teal-600" />,
      title: 'Búsqueda a Medida Gratuita',
      description: 'Si la propiedad de tus sueños aún no está en catálogo, nos encargamos de rastrear el mercado para conseguirla.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-teal-600" />,
      title: 'Transparencia & Seguridad Legal',
      description: 'Revisión exhaustiva de títulos, contratos notariados y acompañamiento paso a paso hasta la firma de escritura o arriendo.'
    }
  ];

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            ¿Por qué elegir Aliaga Gestión & Corretaje?
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Una experiencia inmobiliaria diferente, cercana y moderna
          </h2>
          <p className="text-sm text-slate-600">
            Combinamos tecnología multimedia inmersiva con la atención personalizada que necesitas para tomar la mejor decisión de inversión o arriendo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <div 
              key={idx}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-teal-300 transition-all space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center">
                {feat.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {feat.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Banner CTA */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-teal-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-black text-slate-900">
              ¿Tienes requerimientos específicos de metraje, ubicación o estilo?
            </h4>
            <p className="text-xs text-slate-500">
              Completa nuestro formulario de búsqueda guiada y déjalo en manos de especialistas.
            </p>
          </div>
          <button
            onClick={() => setIsCustomRequestOpen(true)}
            className="flex-shrink-0 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all"
          >
            Solicitar Búsqueda a Medida →
          </button>
        </div>

      </div>
    </section>
  );
};
