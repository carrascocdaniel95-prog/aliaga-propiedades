import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Home, 
  Key, 
  Check, 
  CheckCircle, 
  MessageCircle,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useProperties } from '../context/PropertyContext';
import { OperationType, PropertyType } from '../types/property';
import { createCustomRequestWhatsAppMessage, getWhatsAppUrl } from '../utils/formatters';

const COMMON_COMMUNES = [
  'Las Condes',
  'Lo Barnechea',
  'Vitacura',
  'Providencia',
  'La Reina',
  'Ñuñoa',
  'Colina / Chicureo',
  'Puerto Varas',
  'Viña del Mar / Reñaca'
];

const MUST_HAVE_OPTIONS = [
  'Acepta mascotas (Pet Friendly)',
  'Con estacionamiento',
  'Terraza amplia o jardín',
  'Piscina en edificio / casa',
  'Cerca de metro o locomoción',
  'Seguridad 24 horas',
  'Home Office / Sala de estar'
];

export const CustomPropertyRequestModal: React.FC = () => {
  const { isCustomRequestOpen, setIsCustomRequestOpen, addCustomRequest } = useProperties();

  const [operation, setOperation] = useState<OperationType>('venta');
  const [propertyType, setPropertyType] = useState<PropertyType | 'cualquiera'>('departamento');
  const [selectedCommunes, setSelectedCommunes] = useState<string[]>(['Las Condes']);
  const [maxBudget, setMaxBudget] = useState<number>(operation === 'venta' ? 12000 : 850000);
  const [currency, setCurrency] = useState<'CLP' | 'UF'>(operation === 'venta' ? 'UF' : 'CLP');
  const [minBedrooms, setMinBedrooms] = useState(2);
  const [minBathrooms, setMinBathrooms] = useState(2);
  const [mustHaves, setMustHaves] = useState<string[]>(['Con estacionamiento']);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [comments, setComments] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [requestRef, setRequestRef] = useState('');

  if (!isCustomRequestOpen) return null;

  const handleCommuneToggle = (commune: string) => {
    setSelectedCommunes(prev => 
      prev.includes(commune) ? prev.filter(c => c !== commune) : [...prev, commune]
    );
  };

  const handleMustHaveToggle = (item: string) => {
    setMustHaves(prev => 
      prev.includes(item) ? prev.filter(m => m !== item) : [...prev, item]
    );
  };

  const handleOperationChange = (op: OperationType) => {
    setOperation(op);
    if (op === 'venta') {
      setCurrency('UF');
      setMaxBudget(12000);
    } else {
      setCurrency('CLP');
      setMaxBudget(850000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName || !clientPhone || !clientEmail) {
      alert('Por favor ingresa tus datos de contacto para enviarte las propuestas.');
      return;
    }

    const ref = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    setRequestRef(ref);

    addCustomRequest({
      clientName,
      clientEmail,
      clientPhone,
      operation,
      propertyType,
      preferredCommunes: selectedCommunes,
      maxBudget,
      currency,
      minBedrooms,
      minBathrooms,
      mustHaves,
      comments
    });

    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.5 }
    });

    setIsSuccess(true);
  };

  const whatsappMessage = createCustomRequestWhatsAppMessage({
    name: clientName,
    operation,
    propertyType: propertyType === 'cualquiera' ? 'cualquiera' : propertyType,
    maxBudget,
    currency,
    communes: selectedCommunes
  });
  const whatsappUrl = getWhatsAppUrl('56976691216', `${whatsappMessage} Referencia: #${requestRef}`);

  const handleClose = () => {
    setIsCustomRequestOpen(false);
    setIsSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div 
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-teal-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">
                {isSuccess ? '¡Solicitud Personalizada Enviada!' : 'Solicita una Propiedad a tu Medida'}
              </h3>
              <p className="text-xs text-teal-200 font-medium">
                ¿Buscas comprar o arrendar? Nuestro equipo te buscará la propiedad perfecta.
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-teal-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 flex-1">
          {isSuccess ? (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h4 className="text-2xl font-black text-slate-900">
                  ¡Excelente, {clientName}!
                </h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Hemos registrado tus preferencias de búsqueda bajo el código de seguimiento <strong>#{requestRef}</strong>. Revisaremos nuestro catálogo exclusivo y redes inmobiliarias para enviarte opciones que se ajusten al 100%.
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-left text-xs space-y-2 text-slate-700">
                <p><strong>Operación:</strong> Para {operation.toUpperCase()}</p>
                <p><strong>Tipo de inmueble:</strong> {propertyType.toUpperCase()}</p>
                <p><strong>Comunas preferidas:</strong> {selectedCommunes.join(', ') || 'Cualquiera'}</p>
                <p><strong>Presupuesto tope:</strong> {currency === 'UF' ? `UF ${maxBudget.toLocaleString('es-CL')}` : `$${maxBudget.toLocaleString('es-CL')}`}</p>
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Enviar requerimiento por WhatsApp (+56 9 7669 1216)</span>
                </a>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-2.5 px-4 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Step 1: Operation Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  1. ¿Qué deseas hacer?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleOperationChange('venta')}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                      operation === 'venta'
                        ? 'bg-teal-50 border-teal-500 text-teal-800 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Key className="w-4 h-4 text-teal-600" />
                    <span>Quiero Comprar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOperationChange('arriendo')}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                      operation === 'arriendo'
                        ? 'bg-teal-50 border-teal-500 text-teal-800 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Home className="w-4 h-4 text-teal-600" />
                    <span>Quiero Arrendar</span>
                  </button>
                </div>
              </div>

              {/* Step 2: Property Type & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    2. Tipo de Propiedad
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="departamento">Departamento</option>
                    <option value="casa">Casa</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="parcela">Parcela / Terreno</option>
                    <option value="oficina">Oficina Comercial</option>
                    <option value="cualquiera">Cualquiera de las anteriores</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    3. Presupuesto Máximo ({currency})
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        min="1"
                        required
                        value={maxBudget}
                        onChange={(e) => setMaxBudget(Number(e.target.value))}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as any)}
                      className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                    >
                      <option value="UF">UF</option>
                      <option value="CLP">CLP ($)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 3: Preferred Communes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  4. Comunas o Sectores de tu Interés
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_COMMUNES.map(commune => {
                    const isSelected = selectedCommunes.includes(commune);
                    return (
                      <button
                        key={commune}
                        type="button"
                        onClick={() => handleCommuneToggle(commune)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-teal-700 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{commune}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Bedrooms & Bathrooms */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Dormitorios Mínimos
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setMinBedrooms(num)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          minBedrooms === num
                            ? 'bg-teal-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {num}+
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Baños Mínimos
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setMinBathrooms(num)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          minBathrooms === num
                            ? 'bg-teal-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {num}+
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 5: Must Haves */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  5. Requerimientos indispensables
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {MUST_HAVE_OPTIONS.map(opt => {
                    const checked = mustHaves.includes(opt);
                    return (
                      <label 
                        key={opt}
                        onClick={() => handleMustHaveToggle(opt)}
                        className={`flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium cursor-pointer border transition-all ${
                          checked ? 'bg-teal-50 border-teal-300 text-teal-900' : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                          checked ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {checked && <Check className="w-3 h-3" />}
                        </div>
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Step 6: Contact Information */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                  6. Tus Datos de Contacto
                </label>

                <div>
                  <input
                    type="text"
                    required
                    placeholder="Tu nombre completo"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="tel"
                    required
                    placeholder="Teléfono / WhatsApp (+56 9...)"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Correo electrónico"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <textarea
                  rows={2}
                  placeholder="Detalles adicionales (ej: fecha estimada de mudanza, orientación preferida, etc.)"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-lg shadow-teal-600/25 transition-all"
                >
                  Enviar Requerimiento a Aliaga Gestión & Corretaje
                </button>
              </div>

            </form>
          )}
        </div>

      </div>

    </div>
  );
};
