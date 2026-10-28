import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Plus, 
  Building2, 
  Users, 
  Trash2, 
  Edit3, 
  RotateCcw, 
  MessageCircle, 
  Calendar,
  LogOut,
  KeyRound,
  Eye,
  Check,
  Star,
  MapPin,
  Camera,
  Play,
  Shield,
  Search,
  ExternalLink
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import { AdminLogin } from './AdminLogin';
import { Property, OperationType, PropertyType, PropertyStatus } from '../types/property';
import { formatPrice, getWhatsAppUrl } from '../utils/formatters';

const DEFAULT_AMENITIES_LIST = [
  'Piscina temperada',
  'Piscina exterior',
  'Quincho techado',
  'Gimnasio equipado',
  'Seguridad 24/7',
  'Conserjería',
  'Terraza panorámica',
  'Jacuzzi privado',
  'Calefacción central',
  'Bodega doble',
  'Sala de eventos',
  'Espacio Co-Work',
  'Jardín formado',
  'Estacionamiento de visitas'
];

export const AdminPanelModal: React.FC = () => {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    properties, 
    addProperty, 
    updateProperty, 
    deleteProperty, 
    resetDefaultProperties,
    setSelectedProperty,
    visitRequests,
    updateVisitStatus,
    customRequests,
    updateCustomRequestStatus
  } = useProperties();

  const { isAuthenticated, currentUser, logout, changePassword, resetDefaultPassword } = useAuth();

  const [activeTab, setActiveTab] = useState<'properties' | 'create_edit' | 'visits' | 'custom_requests' | 'security'>('properties');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Search & Filter in Table
  const [tableSearch, setTableSearch] = useState('');
  const [tableOperationFilter, setTableOperationFilter] = useState<'todas' | 'venta' | 'arriendo'>('todas');
  const [tableStatusFilter, setTableStatusFilter] = useState<'todas' | PropertyStatus>('todas');

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formOperation, setFormOperation] = useState<OperationType>('venta');
  const [formType, setFormType] = useState<PropertyType>('departamento');
  const [formStatus, setFormStatus] = useState<PropertyStatus>('disponible');
  const [formFeatured, setFormFeatured] = useState<boolean>(true);
  const [formPrice, setFormPrice] = useState<number>(10000);
  const [formCurrency, setFormCurrency] = useState<'CLP' | 'UF'>('UF');
  const [formExpenses, setFormExpenses] = useState<number>(120000);
  const [formAddress, setFormAddress] = useState('');
  const [formCommune, setFormCommune] = useState('Las Condes');
  const [formCity, setFormCity] = useState('Santiago');
  const [formNeighborhood, setFormNeighborhood] = useState('');
  const [formMapEmbed, setFormMapEmbed] = useState('');
  
  // Specs form
  const [formBedrooms, setFormBedrooms] = useState<number>(2);
  const [formBathrooms, setFormBathrooms] = useState<number>(2);
  const [formTotalArea, setFormTotalArea] = useState<number>(90);
  const [formBuiltArea, setFormBuiltArea] = useState<number>(80);
  const [formParking, setFormParking] = useState<number>(1);
  const [formStorage, setFormStorage] = useState<number>(1);
  const [formFloor, setFormFloor] = useState<number>(5);
  const [formOrientation, setFormOrientation] = useState<string>('Nororiente');
  const [formYearBuilt, setFormYearBuilt] = useState<number>(2023);
  const [formPetFriendly, setFormPetFriendly] = useState(true);

  // Multimedia form
  const [formImages, setFormImages] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Piscina temperada',
    'Quincho techado',
    'Seguridad 24/7'
  ]);
  const [customAmenityInput, setCustomAmenityInput] = useState('');

  // Agent form
  const [agentName, setAgentName] = useState('Paulina Aliaga');
  const [agentPhone, setAgentPhone] = useState('+56 9 7669 1216');
  const [agentWhatsapp, setAgentWhatsapp] = useState('56976691216');
  const [agentEmail, setAgentEmail] = useState('paulina@aliagapropiedades.cl');
  const [agentPhoto, setAgentPhoto] = useState('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80');

  // Security tab state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [securityMsg, setSecurityMsg] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isAdminOpen) return null;

  // If not authenticated, render login screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
        <div 
          className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <AdminLogin
            onSuccess={() => setActiveTab('properties')}
            onCancel={() => setIsAdminOpen(false)}
          />
        </div>
      </div>
    );
  }

  // Auth is valid, proceed with Mantenedor
  const startEdit = (prop: Property) => {
    setEditingProperty(prop);
    setFormTitle(prop.title);
    setFormCode(prop.code);
    setFormOperation(prop.operation);
    setFormType(prop.propertyType);
    setFormStatus(prop.status);
    setFormFeatured(prop.featured);
    setFormPrice(prop.price);
    setFormCurrency(prop.currency);
    setFormExpenses(prop.commonExpenses || 0);
    setFormAddress(prop.address);
    setFormCommune(prop.commune);
    setFormCity(prop.city);
    setFormNeighborhood(prop.neighborhood || '');
    setFormMapEmbed(prop.mapEmbedUrl || '');
    setFormBedrooms(prop.specs.bedrooms);
    setFormBathrooms(prop.specs.bathrooms);
    setFormTotalArea(prop.specs.totalArea);
    setFormBuiltArea(prop.specs.builtArea);
    setFormParking(prop.specs.parkingSpots);
    setFormStorage(prop.specs.storageUnits || 0);
    setFormFloor(prop.specs.floor || 1);
    setFormOrientation(prop.specs.orientation || 'Nororiente');
    setFormYearBuilt(prop.specs.yearBuilt || 2023);
    setFormPetFriendly(prop.specs.petFriendly);
    setFormImages(prop.images.join('\n'));
    setFormVideoUrl(prop.videoUrl || '');
    setFormDescription(prop.description);
    setSelectedAmenities(prop.amenities || []);
    setAgentName(prop.agent.name);
    setAgentPhone(prop.agent.phone);
    setAgentWhatsapp(prop.agent.whatsapp);
    setAgentEmail(prop.agent.email);
    setAgentPhoto(prop.agent.photo);
    setActiveTab('create_edit');
  };

  const startCreate = () => {
    setEditingProperty(null);
    setFormTitle('');
    setFormCode(`PL-${Math.floor(500 + Math.random() * 499)}`);
    setFormOperation('venta');
    setFormType('departamento');
    setFormStatus('disponible');
    setFormFeatured(true);
    setFormPrice(9200);
    setFormCurrency('UF');
    setFormExpenses(130000);
    setFormAddress('Av. Vitacura 3500');
    setFormCommune('Vitacura');
    setFormCity('Santiago');
    setFormNeighborhood('Jardín del Este');
    setFormMapEmbed('https://maps.google.com/maps?q=Vitacura,+Santiago&t=&z=14&ie=UTF8&iwloc=&output=embed');
    setFormBedrooms(3);
    setFormBathrooms(2);
    setFormTotalArea(115);
    setFormBuiltArea(98);
    setFormParking(2);
    setFormStorage(1);
    setFormFloor(7);
    setFormOrientation('Nororiente');
    setFormYearBuilt(2022);
    setFormPetFriendly(true);
    setFormImages('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80\nhttps://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80\nhttps://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80');
    setFormVideoUrl('https://www.youtube.com/embed/kJQP7kiw5Fk');
    setFormDescription('Excelente propiedad con amplios espacios, finas terminaciones en cuarzo y madera natural. Gran conectividad y seguridad.');
    setSelectedAmenities(['Piscina temperada', 'Quincho techado', 'Seguridad 24/7', 'Conserjería', 'Gimnasio equipado']);
    setAgentName('Paulina Aliaga');
    setAgentPhone('+56 9 7669 1216');
    setAgentWhatsapp('56976691216');
    setAgentEmail('paulina@aliagapropiedades.cl');
    setAgentPhoto('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80');
    setActiveTab('create_edit');
  };

  const handleAmenityCheck = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleAddCustomAmenity = () => {
    if (customAmenityInput.trim() && !selectedAmenities.includes(customAmenityInput.trim())) {
      setSelectedAmenities(prev => [...prev, customAmenityInput.trim()]);
      setCustomAmenityInput('');
    }
  };

  const handleSaveProperty = (e: React.FormEvent) => {
    e.preventDefault();

    const imageArray = formImages
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    const propertyPayload = {
      code: formCode || `PL-${Math.floor(100 + Math.random() * 900)}`,
      title: formTitle,
      description: formDescription,
      operation: formOperation,
      propertyType: formType,
      status: formStatus,
      featured: formFeatured,
      price: Number(formPrice),
      currency: formCurrency,
      commonExpenses: Number(formExpenses) || undefined,
      address: formAddress,
      commune: formCommune,
      city: formCity,
      neighborhood: formNeighborhood || undefined,
      mapEmbedUrl: formMapEmbed || undefined,
      specs: {
        bedrooms: Number(formBedrooms),
        bathrooms: Number(formBathrooms),
        parkingSpots: Number(formParking),
        storageUnits: Number(formStorage),
        totalArea: Number(formTotalArea),
        builtArea: Number(formBuiltArea),
        floor: Number(formFloor),
        orientation: formOrientation as any,
        yearBuilt: Number(formYearBuilt),
        petFriendly: formPetFriendly
      },
      amenities: selectedAmenities,
      images: imageArray.length > 0 ? imageArray : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'],
      videoUrl: formVideoUrl || undefined,
      videoType: 'youtube' as const,
      agent: {
        name: agentName,
        role: 'Directora & Broker Inmobiliaria',
        phone: agentPhone,
        whatsapp: agentWhatsapp,
        email: agentEmail,
        photo: agentPhoto
      }
    };

    if (editingProperty) {
      updateProperty(editingProperty.id, propertyPayload);
    } else {
      addProperty(propertyPayload);
    }

    setEditingProperty(null);
    setActiveTab('properties');
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setSecurityMsg({ text: 'Las nuevas contraseñas no coinciden.', isError: true });
      return;
    }
    const res = changePassword(currentPass, newPass);
    if (res.success) {
      setSecurityMsg({ text: res.message || 'Contraseña cambiada.', isError: false });
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      setSecurityMsg({ text: res.message || 'Error al cambiar contraseña.', isError: true });
    }
  };

  // Filtered properties in mantenedor table
  const tableProperties = properties.filter(prop => {
    if (tableOperationFilter !== 'todas' && prop.operation !== tableOperationFilter) return false;
    if (tableStatusFilter !== 'todas' && prop.status !== tableStatusFilter) return false;
    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase();
      const match = prop.title.toLowerCase().includes(q) ||
                    prop.code.toLowerCase().includes(q) ||
                    prop.commune.toLowerCase().includes(q) ||
                    prop.address.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Photo previews from current textarea
  const imagePreviews = formImages.split('\n').map(s => s.trim()).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      <div 
        className="relative bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header: System Bar */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4 z-10">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30 shadow-inner">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold tracking-tight">
                  Mantenedor Central de Propiedades
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Acceso Seguro
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Aliaga Gestión & Corretaje • Publicación, edición multimedia y seguimiento de clientes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* User Profile Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-slate-200">{currentUser?.name}</span>
              <span className="text-[10px] text-slate-400">({currentUser?.role})</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => logout()}
              title="Cerrar Sesión Segura"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>

            {/* Close Modal */}
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-slate-100 px-6 py-2 flex items-center justify-between border-b border-slate-200 overflow-x-auto gap-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { setActiveTab('properties'); setEditingProperty(null); }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'properties'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Propiedades ({properties.length})</span>
            </button>

            <button
              onClick={startCreate}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'create_edit'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{editingProperty ? `Editar: ${editingProperty.code}` : '+ Agregar Propiedad'}</span>
            </button>

            <button
              onClick={() => { setActiveTab('visits'); setEditingProperty(null); }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'visits'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Visitas ({visitRequests.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('custom_requests'); setEditingProperty(null); }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'custom_requests'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Solicitudes a Medida ({customRequests.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('security'); setEditingProperty(null); }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'security'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Clave & Seguridad</span>
            </button>
          </div>

          {activeTab === 'properties' && (
            <button
              onClick={() => {
                if (confirm('¿Restablecer el catálogo a las propiedades de demostración iniciales?')) {
                  resetDefaultProperties();
                }
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 text-[11px] font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer Demo</span>
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1 bg-slate-50/50">
          
          {/* TAB 1: PROPERTIES MANTENEDOR TABLE */}
          {activeTab === 'properties' && (
            <div className="space-y-4">
              
              {/* Filter & Search Bar */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
                
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar por código, título o comuna..."
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Operation selector */}
                <select
                  value={tableOperationFilter}
                  onChange={(e) => setTableOperationFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                >
                  <option value="todas">Todas las operaciones</option>
                  <option value="venta">En Venta</option>
                  <option value="arriendo">En Arriendo</option>
                </select>

                {/* Status selector */}
                <select
                  value={tableStatusFilter}
                  onChange={(e) => setTableStatusFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                >
                  <option value="todas">Todos los estados</option>
                  <option value="disponible">Disponible</option>
                  <option value="reservado">Reservado</option>
                  <option value="vendido">Vendido / Arrendado</option>
                </select>

                {/* Add button */}
                <button
                  onClick={startCreate}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Nueva Propiedad</span>
                </button>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Propiedad</th>
                        <th className="py-3 px-3">Código</th>
                        <th className="py-3 px-3">Operación</th>
                        <th className="py-3 px-3">Precio</th>
                        <th className="py-3 px-3">Comuna</th>
                        <th className="py-3 px-3">Estado</th>
                        <th className="py-3 px-3 text-center">Multimedia</th>
                        <th className="py-3 px-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tableProperties.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-slate-400">
                            No se encontraron propiedades con los criterios de búsqueda.
                          </td>
                        </tr>
                      ) : (
                        tableProperties.map(prop => (
                          <tr key={prop.id} className="hover:bg-teal-50/30 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={prop.images[0]}
                                  alt={prop.title}
                                  className="w-12 h-10 object-cover rounded-lg border border-slate-200"
                                />
                                <div className="max-w-xs">
                                  <div className="flex items-center gap-1">
                                    {prop.featured && (
                                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                    )}
                                    <span className="font-bold text-slate-900 truncate block text-xs">
                                      {prop.title}
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-slate-400 capitalize">
                                    {prop.propertyType} • {prop.specs.totalArea} m²
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-3 font-mono font-bold text-teal-700">
                              {prop.code}
                            </td>

                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                prop.operation === 'venta' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}>
                                {prop.operation}
                              </span>
                            </td>

                            <td className="py-3 px-3 font-extrabold text-slate-800">
                              {formatPrice(prop.price, prop.currency)}
                            </td>

                            <td className="py-3 px-3 text-slate-600 font-medium">
                              {prop.commune}
                            </td>

                            <td className="py-3 px-3">
                              <select
                                value={prop.status}
                                onChange={(e) => updateProperty(prop.id, { status: e.target.value as any })}
                                className={`text-[10px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                                  prop.status === 'disponible' 
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                                    : prop.status === 'reservado'
                                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                                    : 'bg-slate-100 text-slate-600 border-slate-300'
                                }`}
                              >
                                <option value="disponible">Disponible</option>
                                <option value="reservado">Reservado</option>
                                <option value="vendido">Vendido / Arrendado</option>
                              </select>
                            </td>

                            <td className="py-3 px-3 text-center">
                              <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                                <span className="flex items-center gap-0.5">
                                  <Camera className="w-3.5 h-3.5 text-teal-600" />
                                  {prop.images.length}
                                </span>
                                {prop.videoUrl && (
                                  <span className="flex items-center gap-0.5 text-rose-600" title="Video tour activo">
                                    <Play className="w-3 h-3 fill-rose-600" />
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-3 px-4 text-right space-x-1">
                              {/* Preview in website */}
                              <button
                                onClick={() => {
                                  setSelectedProperty(prop);
                                  setIsAdminOpen(false);
                                }}
                                title="Ver en la página web"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => startEdit(prop)}
                                title="Editar propiedad completa"
                                className="p-1.5 rounded-lg text-teal-700 hover:bg-teal-50 transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => {
                                  if (confirm(`¿Estás seguro de eliminar permanentemente "${prop.title}" (${prop.code})?`)) {
                                    deleteProperty(prop.id);
                                  }
                                }}
                                title="Eliminar propiedad"
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CREATE / EDIT PROPERTY FORM */}
          {activeTab === 'create_edit' && (
            <form onSubmit={handleSaveProperty} className="space-y-6 max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h4 className="text-lg font-black text-slate-900">
                    {editingProperty ? `Editando Propiedad (${editingProperty.code})` : 'Publicar Nueva Propiedad'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Completa la información técnica, fotos y video tour para el catálogo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('properties')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  Volver a la lista
                </button>
              </div>

              {/* Section 1: Basic Info */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  1. Información Principal
                </h5>
                
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-8">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Título de la Publicación *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Espectacular Departamento con Terraza y Vista Despejada"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Código Identificador *</label>
                    <input
                      type="text"
                      required
                      placeholder="PL-101"
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold font-mono text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Operación</label>
                    <select
                      value={formOperation}
                      onChange={(e) => setFormOperation(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                    >
                      <option value="venta">En Venta</option>
                      <option value="arriendo">En Arriendo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Propiedad</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                    >
                      <option value="departamento">Departamento</option>
                      <option value="casa">Casa</option>
                      <option value="penthouse">Penthouse</option>
                      <option value="parcela">Parcela</option>
                      <option value="oficina">Oficina Comercial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Estado</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                    >
                      <option value="disponible">Disponible</option>
                      <option value="reservado">Reservado</option>
                      <option value="vendido">Vendido / Arrendado</option>
                    </select>
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer text-xs font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={formFeatured}
                        onChange={(e) => setFormFeatured(e.target.checked)}
                        className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                      />
                      <span>⭐ Destacada</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Precio *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Moneda</label>
                    <select
                      value={formCurrency}
                      onChange={(e) => setFormCurrency(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                    >
                      <option value="UF">UF</option>
                      <option value="CLP">CLP ($)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Gastos Comunes ($ CLP aprox)</label>
                    <input
                      type="number"
                      value={formExpenses}
                      onChange={(e) => setFormExpenses(Number(e.target.value))}
                      placeholder="120000"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Location */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h5 className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  2. Ubicación Geográfica
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Dirección Exacta</label>
                    <input
                      type="text"
                      required
                      placeholder="Camino Villarrica a Pucón km 8.5"
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Comuna</label>
                    <input
                      type="text"
                      required
                      placeholder="Villarrica, Pucón, Temuco..."
                      value={formCommune}
                      onChange={(e) => setFormCommune(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Barrio o Sector</label>
                    <input
                      type="text"
                      placeholder="Los Pablos, Playa Linda, Portal de la Frontera..."
                      value={formNeighborhood}
                      onChange={(e) => setFormNeighborhood(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Technical Specs */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h5 className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  3. Especificaciones y Metraje
                </h5>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Dormitorios</label>
                    <input
                      type="number"
                      min="0"
                      value={formBedrooms}
                      onChange={(e) => setFormBedrooms(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Baños</label>
                    <input
                      type="number"
                      min="1"
                      value={formBathrooms}
                      onChange={(e) => setFormBathrooms(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Superficie Total (m²)</label>
                    <input
                      type="number"
                      min="1"
                      value={formTotalArea}
                      onChange={(e) => setFormTotalArea(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Superficie Útil (m²)</label>
                    <input
                      type="number"
                      min="1"
                      value={formBuiltArea}
                      onChange={(e) => setFormBuiltArea(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Estacionamientos</label>
                    <input
                      type="number"
                      min="0"
                      value={formParking}
                      onChange={(e) => setFormParking(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Bodegas</label>
                    <input
                      type="number"
                      min="0"
                      value={formStorage}
                      onChange={(e) => setFormStorage(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Piso / Nivel</label>
                    <input
                      type="number"
                      value={formFloor}
                      onChange={(e) => setFormFloor(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Orientación</label>
                    <select
                      value={formOrientation}
                      onChange={(e) => setFormOrientation(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white"
                    >
                      <option value="Nororiente">Nororiente</option>
                      <option value="Suroriente">Suroriente</option>
                      <option value="Norte">Norte</option>
                      <option value="Sur">Sur</option>
                      <option value="Oriente">Oriente</option>
                      <option value="Poniente">Poniente</option>
                    </select>
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formPetFriendly}
                      onChange={(e) => setFormPetFriendly(e.target.checked)}
                      className="rounded text-teal-600 w-4 h-4"
                    />
                    <span>🐾 Acepta Mascotas (Pet Friendly)</span>
                  </label>
                </div>
              </div>

              {/* Section 4: Multimedia Management */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h5 className="text-xs font-bold uppercase tracking-wider text-teal-700 flex items-center justify-between">
                  <span>4. Gestión Multimedia (Fotos & Video Tour)</span>
                  <span className="text-[11px] text-slate-400 font-normal">Previsualización en tiempo real</span>
                </h5>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      URLs de Fotos en Alta Calidad (Una por línea)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const demoUrl = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80';
                        setFormImages(prev => prev ? `${prev}\n${demoUrl}` : demoUrl);
                      }}
                      className="text-[11px] font-bold text-teal-700 underline"
                    >
                      + Añadir foto de prueba
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={formImages}
                    onChange={(e) => setFormImages(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                  />
                </div>

                {/* Live Photo Previews */}
                {imagePreviews.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 mb-1.5 block">
                      Vista previa de fotos cargadas ({imagePreviews.length}):
                    </span>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {imagePreviews.map((url, idx) => (
                        <div key={idx} className="relative flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border border-slate-200 group">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = imagePreviews.filter((_, i) => i !== idx);
                              setFormImages(updated.join('\n'));
                            }}
                            className="absolute top-1 right-1 p-0.5 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    URL de Video Tour 4K (YouTube o MP4)
                  </label>
                  <input
                    type="text"
                    value={formVideoUrl}
                    onChange={(e) => setFormVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=kJQP7kiw5Fk"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Section 5: Amenities */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h5 className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  5. Equipamiento y Comodidades
                </h5>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {DEFAULT_AMENITIES_LIST.map(amenity => {
                    const checked = selectedAmenities.includes(amenity);
                    return (
                      <label
                        key={amenity}
                        onClick={() => handleAmenityCheck(amenity)}
                        className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium cursor-pointer border transition-all ${
                          checked ? 'bg-teal-50 border-teal-300 text-teal-900 font-bold' : 'border-slate-100 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                          checked ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {checked && <Check className="w-3 h-3" />}
                        </div>
                        <span className="truncate">{amenity}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Agregar otra amenidad personalizada..."
                    value={customAmenityInput}
                    onChange={(e) => setCustomAmenityInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomAmenity(); } }}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomAmenity}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    + Agregar
                  </button>
                </div>
              </div>

              {/* Section 6: Description */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700">
                  Descripción Detallada de la Propiedad *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Escribe los aspectos destacados, terminaciones, conectividad y entorno..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs leading-relaxed"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('properties')}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-7 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-lg shadow-teal-600/25 transition-all"
                >
                  {editingProperty ? 'Guardar Cambios de Propiedad' : 'Publicar Propiedad en Catálogo'}
                </button>
              </div>

            </form>
          )}

          {/* TAB 3: SCHEDULED VISITS */}
          {activeTab === 'visits' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-extrabold text-slate-900">
                  Solicitudes de Visitas Agendadas ({visitRequests.length})
                </h4>
                <p className="text-xs text-slate-500">
                  Historial de visitas presenciales y por videollamada solicitadas por clientes
                </p>
              </div>

              {visitRequests.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-400">
                  No hay visitas agendadas registradas aún.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visitRequests.map(req => {
                    const clientWaMsg = `Hola ${req.clientName}, te contactamos de Aliaga Gestión & Corretaje para coordinar tu visita (${req.visitType.toUpperCase()}) para la propiedad ${req.propertyCode} agendada el ${req.preferredDate} a las ${req.preferredTimeSlot}.`;
                    const waUrl = getWhatsAppUrl(req.clientPhone, clientWaMsg);

                    return (
                      <div key={req.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                              {req.visitType === 'presencial' ? '🏢 Visita en Terreno' : '📹 Videollamada 4K'}
                            </span>
                            <h5 className="font-extrabold text-slate-900 text-sm mt-1">{req.clientName}</h5>
                            <p className="text-xs text-slate-500">{req.clientPhone} • {req.clientEmail}</p>
                          </div>
                          
                          <select
                            value={req.status}
                            onChange={(e) => updateVisitStatus(req.id, e.target.value as any)}
                            className="text-[11px] font-bold px-2 py-1 rounded-lg border border-slate-300 bg-white"
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="confirmada">Confirmada</option>
                            <option value="realizada">Realizada</option>
                            <option value="cancelada">Cancelada</option>
                          </select>
                        </div>

                        <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                          <p><strong>Propiedad:</strong> {req.propertyTitle} ({req.propertyCode})</p>
                          <p><strong>Fecha preferida:</strong> {req.preferredDate} ({req.preferredTimeSlot})</p>
                          {req.comments && <p><strong>Nota:</strong> {req.comments}</p>}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-slate-400">Solicitado: {req.createdAt}</span>
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-sm"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-white" />
                            <span>Contactar por WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CUSTOM SEARCH REQUESTS */}
          {activeTab === 'custom_requests' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-extrabold text-slate-900">
                  Solicitudes de Propiedades a Medida ({customRequests.length})
                </h4>
                <p className="text-xs text-slate-500">
                  Requerimientos de clientes que buscan comprar o arrendar una propiedad específica
                </p>
              </div>

              {customRequests.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-400">
                  No hay solicitudes a medida registradas aún.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customRequests.map(req => {
                    const clientWaMsg = `Hola ${req.clientName}, te escribimos de Aliaga Gestión & Corretaje respecto a tu búsqueda para ${req.operation.toUpperCase()} de un(a) ${req.propertyType}. ¡Hemos seleccionado propiedades ideales para tu presupuesto!`;
                    const waUrl = getWhatsAppUrl(req.clientPhone, clientWaMsg);

                    return (
                      <div key={req.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                              Para {req.operation.toUpperCase()} • {req.propertyType}
                            </span>
                            <h5 className="font-extrabold text-slate-900 text-sm mt-1">{req.clientName}</h5>
                            <p className="text-xs text-slate-500">{req.clientPhone} • {req.clientEmail}</p>
                          </div>
                          
                          <select
                            value={req.status}
                            onChange={(e) => updateCustomRequestStatus(req.id, e.target.value as any)}
                            className="text-[11px] font-bold px-2 py-1 rounded-lg border border-slate-300 bg-white"
                          >
                            <option value="nueva">Nueva</option>
                            <option value="en_busqueda">En Búsqueda</option>
                            <option value="contactado">Contactado</option>
                            <option value="archivada">Archivada</option>
                          </select>
                        </div>

                        <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                          <p><strong>Presupuesto tope:</strong> {req.currency === 'UF' ? `UF ${req.maxBudget.toLocaleString('es-CL')}` : `$${req.maxBudget.toLocaleString('es-CL')}`}</p>
                          <p><strong>Comunas preferidas:</strong> {req.preferredCommunes.join(', ') || 'Cualquiera'}</p>
                          <p><strong>Dormitorios / Baños:</strong> {req.minBedrooms}+ dorm. • {req.minBathrooms}+ baños</p>
                          {req.mustHaves.length > 0 && (
                            <p><strong>Requisitos clave:</strong> {req.mustHaves.join(', ')}</p>
                          )}
                          {req.comments && <p><strong>Comentarios:</strong> {req.comments}</p>}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-slate-400">Recibido: {req.createdAt}</span>
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-sm"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-white" />
                            <span>Responder por WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SECURITY & PASSWORD CHANGE */}
          {activeTab === 'security' && (
            <div className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
              
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-black text-slate-900">
                  Seguridad de Acceso al Mantenedor
                </h4>
                <p className="text-xs text-slate-500">
                  Cambia la contraseña de acceso del administrador
                </p>
              </div>

              {securityMsg && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${
                  securityMsg.isError ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}>
                  {securityMsg.text}
                </div>
              )}

              <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contraseña Actual *</label>
                  <input
                    type="password"
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nueva Contraseña *</label>
                  <input
                    type="password"
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Mínimo 5 caracteres"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirmar Nueva Contraseña *</label>
                  <input
                    type="password"
                    required
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Repite la nueva contraseña"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  Actualizar Contraseña
                </button>
              </form>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>¿Olvidaste tu contraseña?</span>
                <button
                  type="button"
                  onClick={() => {
                    resetDefaultPassword();
                    alert('La contraseña ha sido restablecida a la predeterminada: pauli2026');
                  }}
                  className="text-teal-700 font-bold underline"
                >
                  Restablecer a "pauli2026"
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
