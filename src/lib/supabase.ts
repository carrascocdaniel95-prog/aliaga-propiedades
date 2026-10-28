import { createClient } from '@supabase/supabase-js';
import { Property, VisitRequest, CustomPropertyRequest } from '../types/property';

// 1. Configuración del cliente Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('tu-proyecto')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==========================================
// Mappers: Base de Datos (snake_case) <-> Frontend (camelCase)
// ==========================================

export const dbToProperty = (row: any): Property => ({
  id: row.id,
  code: row.code,
  title: row.title,
  description: row.description || '',
  operation: row.operation,
  propertyType: row.property_type,
  status: row.status || 'disponible',
  featured: Boolean(row.featured),
  price: Number(row.price),
  currency: row.currency || 'CLP',
  priceUF: row.price_uf ? Number(row.price_uf) : undefined,
  commonExpenses: row.common_expenses ? Number(row.common_expenses) : undefined,
  address: row.address,
  commune: row.commune,
  city: row.city,
  neighborhood: row.neighborhood || undefined,
  mapEmbedUrl: row.map_embed_url || undefined,
  specs: row.specs || {
    bedrooms: 1,
    bathrooms: 1,
    parkingSpots: 0,
    totalArea: 50,
    builtArea: 50,
    petFriendly: true
  },
  amenities: Array.isArray(row.amenities) ? row.amenities : [],
  images: Array.isArray(row.images) ? row.images : [],
  videoUrl: row.video_url || undefined,
  videoType: row.video_type || undefined,
  virtualTourUrl: row.virtual_tour_url || undefined,
  agent: row.agent || {
    name: 'Paulina Aliaga',
    role: 'Directora & Corredora',
    phone: '+56 9 7669 1216',
    whatsapp: '56976691216',
    email: 'contacto@paulipropiedades.cl',
    photo: ''
  },
  createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
});

export const propertyToDb = (p: Partial<Property> & { code: string; title: string }) => {
  const payload: any = {};
  if (p.id && !p.id.startsWith('prop-')) payload.id = p.id;
  if (p.code !== undefined) payload.code = p.code;
  if (p.title !== undefined) payload.title = p.title;
  if (p.description !== undefined) payload.description = p.description;
  if (p.operation !== undefined) payload.operation = p.operation;
  if (p.propertyType !== undefined) payload.property_type = p.propertyType;
  if (p.status !== undefined) payload.status = p.status;
  if (p.featured !== undefined) payload.featured = p.featured;
  if (p.price !== undefined) payload.price = p.price;
  if (p.currency !== undefined) payload.currency = p.currency;
  if (p.priceUF !== undefined) payload.price_uf = p.priceUF;
  if (p.commonExpenses !== undefined) payload.common_expenses = p.commonExpenses;
  if (p.address !== undefined) payload.address = p.address;
  if (p.commune !== undefined) payload.commune = p.commune;
  if (p.city !== undefined) payload.city = p.city;
  if (p.neighborhood !== undefined) payload.neighborhood = p.neighborhood;
  if (p.mapEmbedUrl !== undefined) payload.map_embed_url = p.mapEmbedUrl;
  if (p.specs !== undefined) payload.specs = p.specs;
  if (p.amenities !== undefined) payload.amenities = p.amenities;
  if (p.images !== undefined) payload.images = p.images;
  if (p.videoUrl !== undefined) payload.video_url = p.videoUrl;
  if (p.videoType !== undefined) payload.video_type = p.videoType;
  if (p.virtualTourUrl !== undefined) payload.virtual_tour_url = p.virtualTourUrl;
  if (p.agent !== undefined) payload.agent = p.agent;
  return payload;
};

// ==========================================
// Operaciones con Supabase
// ==========================================

export const fetchPropertiesFromSupabase = async (): Promise<Property[] | null> => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error al obtener propiedades de Supabase:', error.message);
      return null;
    }
    return (data || []).map(dbToProperty);
  } catch (err) {
    console.error('Error de conexión a Supabase:', err);
    return null;
  }
};

export const upsertPropertyToSupabase = async (property: Property): Promise<boolean> => {
  if (!supabase) return false;
  try {
    const dbPayload = propertyToDb(property);
    const { error } = await supabase
      .from('properties')
      .upsert(dbPayload, { onConflict: 'code' });

    if (error) {
      console.error('Error al guardar propiedad en Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error al conectar con Supabase en upsert:', err);
    return false;
  }
};

export const deletePropertyFromSupabase = async (property: Property): Promise<boolean> => {
  if (!supabase) return false;
  try {
    const query = property.id && !property.id.startsWith('prop-')
      ? supabase.from('properties').delete().eq('id', property.id)
      : supabase.from('properties').delete().eq('code', property.code);

    const { error } = await query;
    if (error) {
      console.error('Error al eliminar propiedad en Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error al conectar con Supabase en delete:', err);
    return false;
  }
};

// Solicitudes de visita
export const insertVisitRequestToSupabase = async (
  request: Omit<VisitRequest, 'id' | 'status' | 'createdAt'>
): Promise<boolean> => {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('visit_requests').insert({
      property_title: request.propertyTitle,
      property_code: request.propertyCode,
      property_price: request.propertyPrice,
      client_name: request.clientName,
      client_email: request.clientEmail,
      client_phone: request.clientPhone,
      visit_type: request.visitType,
      preferred_date: request.preferredDate,
      preferred_time_slot: request.preferredTimeSlot,
      comments: request.comments || null,
      status: 'pendiente'
    });

    if (error) {
      console.warn('No se pudo registrar visita en Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error de conexión en visit_requests:', err);
    return false;
  }
};

// Solicitudes personalizadas ("Buscamos por ti")
export const insertCustomRequestToSupabase = async (
  request: Omit<CustomPropertyRequest, 'id' | 'status' | 'createdAt'>
): Promise<boolean> => {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('custom_property_requests').insert({
      client_name: request.clientName,
      client_email: request.clientEmail,
      client_phone: request.clientPhone,
      operation: request.operation,
      property_type: request.propertyType,
      preferred_communes: request.preferredCommunes,
      max_budget: request.maxBudget,
      currency: request.currency,
      min_bedrooms: request.minBedrooms,
      min_bathrooms: request.minBathrooms,
      must_haves: request.mustHaves,
      comments: request.comments || null,
      status: 'nueva'
    });

    if (error) {
      console.warn('No se pudo registrar solicitud personalizada en Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error de conexión en custom_property_requests:', err);
    return false;
  }
};
