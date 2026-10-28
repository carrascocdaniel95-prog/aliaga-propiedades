export type OperationType = 'venta' | 'arriendo';

export type PropertyType = 'departamento' | 'casa' | 'parcela' | 'oficina' | 'penthouse';

export type PropertyStatus = 'disponible' | 'reservado' | 'vendido';

export interface PropertySpecs {
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  storageUnits?: number;
  totalArea: number; // m²
  builtArea: number; // m²
  floor?: number;
  petFriendly: boolean;
  orientation?: 'Oriente' | 'Poniente' | 'Norte' | 'Sur' | 'Nororiente' | 'Suroriente';
  yearBuilt?: number;
}

export interface PropertyAgent {
  name: string;
  role: string;
  phone: string;
  whatsapp: string; // international format e.g. "56912345678"
  email: string;
  photo: string;
}

export interface Property {
  id: string;
  code: string; // e.g. "PL-101"
  title: string;
  description: string;
  operation: OperationType;
  propertyType: PropertyType;
  status: PropertyStatus;
  featured: boolean;
  
  // Pricing
  price: number;
  currency: 'CLP' | 'UF';
  priceUF?: number;
  commonExpenses?: number; // Gastos comunes en CLP
  
  // Location
  address: string;
  commune: string;
  city: string;
  neighborhood?: string;
  mapEmbedUrl?: string;
  
  // Specs & Amenities
  specs: PropertySpecs;
  amenities: string[]; // ['Piscina', 'Quincho', 'Gimnasio', 'Seguridad 24/7', 'Terraza', 'Calefacción central', 'Conserjería', 'Salón de eventos']
  
  // Media
  images: string[];
  videoUrl?: string; // YouTube embed, mp4 or direct video tour
  videoType?: 'youtube' | 'mp4';
  virtualTourUrl?: string;
  
  agent: PropertyAgent;
  createdAt: string;
}

export interface PropertyFilters {
  searchQuery: string;
  operation: OperationType | 'todas';
  propertyType: PropertyType | 'todas';
  commune: string;
  minPrice: number;
  maxPrice: number;
  currency: 'CLP' | 'UF';
  minBedrooms: number;
  minBathrooms: number;
  petFriendlyOnly: boolean;
  parkingOnly: boolean;
  selectedAmenities: string[];
  sortBy: 'price-asc' | 'price-desc' | 'area-desc' | 'newest';
}

export interface VisitRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyCode: string;
  propertyPrice: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  visitType: 'presencial' | 'videollamada';
  preferredDate: string;
  preferredTimeSlot: string;
  comments?: string;
  status: 'pendiente' | 'confirmada' | 'realizada' | 'cancelada';
  createdAt: string;
}

export interface CustomPropertyRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  operation: OperationType;
  propertyType: PropertyType | 'cualquiera';
  preferredCommunes: string[];
  maxBudget: number;
  currency: 'CLP' | 'UF';
  minBedrooms: number;
  minBathrooms: number;
  mustHaves: string[];
  comments?: string;
  status: 'nueva' | 'en_busqueda' | 'contactado' | 'archivada';
  createdAt: string;
}
