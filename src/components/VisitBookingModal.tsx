import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  MessageSquare, 
  CheckCircle, 
  MessageCircle,
  Building
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Property } from '../types/property';
import { useProperties } from '../context/PropertyContext';
import { formatPrice, getWhatsAppUrl } from '../utils/formatters';

interface VisitBookingModalProps {
  property: Property;
  onClose: () => void;
}

export const VisitBookingModal: React.FC<VisitBookingModalProps> = ({ property, onClose }) => {
  const { addVisitRequest } = useProperties();

  const [visitType, setVisitType] = useState<'presencial' | 'videollamada'>('presencial');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('11:00 - 12:30 (Mañana)');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [comments, setComments] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName || !clientEmail || !clientPhone) {
      alert('Por favor completa todos los campos de contacto obligatorios.');
      return;
    }

    const ref = `VIS-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingRef(ref);

    addVisitRequest({
      propertyId: property.id,
      propertyTitle: property.title,
      propertyCode: property.code,
      propertyPrice: formatPrice(property.price, property.currency),
      clientName,
      clientEmail,
      clientPhone,
      visitType,
      preferredDate: date,
      preferredTimeSlot: timeSlot,
      comments
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setIsSuccess(true);
  };

  const whatsappConfirmationText = `¡Hola Aliaga Gestión & Corretaje! Acabo de solicitar agendar una visita (${visitType.toUpperCase()}) para la propiedad "${property.title}" (Código: ${property.code}) para la fecha ${date} en el horario ${timeSlot}. Mi nombre es ${clientName}. Referencia: ${bookingRef}`;
  const whatsappUrl = getWhatsAppUrl(property.agent.whatsapp || '56976691216', whatsappConfirmationText);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div 
        className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {isSuccess ? '¡Solicitud Registrada con Éxito!' : 'Agendar Visita'}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Propiedad Código: {property.code} • {formatPrice(property.price, property.currency)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h4 className="text-2xl font-black text-slate-900">
                ¡Gracias, {clientName}!
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Tu solicitud de visita <strong className="capitalize">{visitType}</strong> para el <strong>{date}</strong> ({timeSlot}) ha sido recibida con el código de seguimiento <strong>#{bookingRef}</strong>.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left text-xs space-y-1.5 text-slate-600">
              <p><strong className="text-slate-800">Propiedad:</strong> {property.title} ({property.code})</p>
              <p><strong className="text-slate-800">Dirección:</strong> {property.address}, {property.commune}</p>
              <p><strong className="text-slate-800">Agente asignado:</strong> {property.agent.name} ({property.agent.phone})</p>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Confirmar Inmediatamente por WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors"
              >
                Cerrar y seguir navegando
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Property Summary Strip */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-16 h-14 object-cover rounded-xl"
              />
              <div className="flex-1 min-w-0">
                <h5 className="font-bold text-slate-900 text-xs truncate">{property.title}</h5>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-teal-600" />
                  {property.commune}
                </p>
              </div>
            </div>

            {/* Visit Type Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Modalidad de la Visita
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVisitType('presencial')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                    visitType === 'presencial'
                      ? 'bg-teal-50 border-teal-500 text-teal-800 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building className="w-4 h-4 text-teal-600" />
                  <span>Presencial en la Propiedad</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVisitType('videollamada')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                    visitType === 'videollamada'
                      ? 'bg-teal-50 border-teal-500 text-teal-800 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Video className="w-4 h-4 text-teal-600" />
                  <span>Videollamada en Vivo</span>
                </button>
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Fecha Preferida
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Horario Preferido
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="09:30 - 11:00 (Mañana)">09:30 - 11:00 (Mañana)</option>
                    <option value="11:00 - 12:30 (Mañana)">11:00 - 12:30 (Mañana)</option>
                    <option value="14:00 - 15:30 (Tarde)">14:00 - 15:30 (Tarde)</option>
                    <option value="16:00 - 17:30 (Tarde)">16:00 - 17:30 (Tarde)</option>
                    <option value="18:00 - 19:30 (Tarde/Noche)">18:00 - 19:30 (Tarde/Noche)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Tu nombre y apellido"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Teléfono / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="+56 9 1234 5678"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Correo Electrónico *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="ejemplo@email.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Comentarios o Requerimientos Especiales (Opcional)
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    placeholder="¿Tienes alguna consulta antes de la visita?"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-lg shadow-teal-600/25 transition-all"
              >
                Confirmar Solicitud de Visita
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                Un agente de Aliaga Gestión & Corretaje se contactará contigo para validar la fecha y hora.
              </p>
            </div>

          </form>
        )}

      </div>

    </div>
  );
};
