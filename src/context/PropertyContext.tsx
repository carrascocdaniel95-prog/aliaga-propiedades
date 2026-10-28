import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Property, PropertyFilters, VisitRequest, CustomPropertyRequest } from '../types/property';
import { INITIAL_PROPERTIES, INITIAL_VISIT_REQUESTS, INITIAL_CUSTOM_REQUESTS } from '../data/mockProperties';

interface PropertyContextType {
  properties: Property[];
  filteredProperties: Property[];
  filters: PropertyFilters;
  setFilters: React.Dispatch<React.SetStateAction<PropertyFilters>>;
  resetFilters: () => void;
  
  // Property Actions
  addProperty: (property: Omit<Property, 'id' | 'createdAt'>) => void;
  updateProperty: (id: string, updated: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  resetDefaultProperties: () => void;
  
  // Favorites
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  
  // Comparison
  comparisonList: string[];
  toggleComparison: (id: string) => void;
  isInComparison: (id: string) => boolean;
  clearComparison: () => void;
  
  // Requests
  visitRequests: VisitRequest[];
  addVisitRequest: (request: Omit<VisitRequest, 'id' | 'status' | 'createdAt'>) => void;
  updateVisitStatus: (id: string, status: VisitRequest['status']) => void;
  
  customRequests: CustomPropertyRequest[];
  addCustomRequest: (request: Omit<CustomPropertyRequest, 'id' | 'status' | 'createdAt'>) => void;
  updateCustomRequestStatus: (id: string, status: CustomPropertyRequest['status']) => void;
  
  // UI Modal Controls
  selectedProperty: Property | null;
  setSelectedProperty: (prop: Property | null) => void;
  
  bookingProperty: Property | null;
  setBookingProperty: (prop: Property | null) => void;
  
  isCustomRequestOpen: boolean;
  setIsCustomRequestOpen: (open: boolean) => void;
  
  isComparatorOpen: boolean;
  setIsComparatorOpen: (open: boolean) => void;
  
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  
  lightboxData: { images: string[]; currentIndex: number } | null;
  openLightbox: (images: string[], index?: number) => void;
  closeLightbox: () => void;
  setLightboxIndex: (index: number) => void;
}

const DEFAULT_FILTERS: PropertyFilters = {
  searchQuery: '',
  operation: 'todas',
  propertyType: 'todas',
  commune: 'todas',
  minPrice: 0,
  maxPrice: 0,
  currency: 'CLP',
  minBedrooms: 0,
  minBathrooms: 0,
  petFriendlyOnly: false,
  parkingOnly: false,
  selectedAmenities: [],
  sortBy: 'newest'
};

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Properties state with localStorage persistence
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('pauli_properties');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_PROPERTIES;
  });

  useEffect(() => {
    localStorage.setItem('pauli_properties', JSON.stringify(properties));
  }, [properties]);

  // Filters state
  const [filters, setFilters] = useState<PropertyFilters>(DEFAULT_FILTERS);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('pauli_favorites');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('pauli_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Comparison state
  const [comparisonList, setComparisonList] = useState<string[]>(() => {
    const saved = localStorage.getItem('pauli_comparison');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('pauli_comparison', JSON.stringify(comparisonList));
  }, [comparisonList]);

  // Visit requests state
  const [visitRequests, setVisitRequests] = useState<VisitRequest[]>(() => {
    const saved = localStorage.getItem('pauli_visit_requests');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_VISIT_REQUESTS;
  });

  useEffect(() => {
    localStorage.setItem('pauli_visit_requests', JSON.stringify(visitRequests));
  }, [visitRequests]);

  // Custom property requests state
  const [customRequests, setCustomRequests] = useState<CustomPropertyRequest[]>(() => {
    const saved = localStorage.getItem('pauli_custom_requests');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_CUSTOM_REQUESTS;
  });

  useEffect(() => {
    localStorage.setItem('pauli_custom_requests', JSON.stringify(customRequests));
  }, [customRequests]);

  // Modal & View States
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [bookingProperty, setBookingProperty] = useState<Property | null>(null);
  const [isCustomRequestOpen, setIsCustomRequestOpen] = useState(false);
  const [isComparatorOpen, setIsComparatorOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [lightboxData, setLightboxData] = useState<{ images: string[]; currentIndex: number } | null>(null);

  // Filtered Properties Computation
  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      // Operation filter
      if (filters.operation !== 'todas' && prop.operation !== filters.operation) {
        return false;
      }
      // Property type filter
      if (filters.propertyType !== 'todas' && prop.propertyType !== filters.propertyType) {
        return false;
      }
      // Commune filter
      if (filters.commune !== 'todas' && filters.commune !== '' && prop.commune.toLowerCase() !== filters.commune.toLowerCase()) {
        return false;
      }
      // Search query (title, address, commune, code, description)
      if (filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase();
        const matchTitle = prop.title.toLowerCase().includes(query);
        const matchCode = prop.code.toLowerCase().includes(query);
        const matchCommune = prop.commune.toLowerCase().includes(query);
        const matchCity = prop.city.toLowerCase().includes(query);
        const matchAddress = prop.address.toLowerCase().includes(query);
        const matchDesc = prop.description.toLowerCase().includes(query);
        if (!matchTitle && !matchCode && !matchCommune && !matchCity && !matchAddress && !matchDesc) {
          return false;
        }
      }
      // Min Bedrooms
      if (filters.minBedrooms > 0 && prop.specs.bedrooms < filters.minBedrooms) {
        return false;
      }
      // Min Bathrooms
      if (filters.minBathrooms > 0 && prop.specs.bathrooms < filters.minBathrooms) {
        return false;
      }
      // Pet Friendly
      if (filters.petFriendlyOnly && !prop.specs.petFriendly) {
        return false;
      }
      // Parking
      if (filters.parkingOnly && prop.specs.parkingSpots < 1) {
        return false;
      }
      // Amenities
      if (filters.selectedAmenities.length > 0) {
        const hasAllAmenities = filters.selectedAmenities.every(amenity =>
          prop.amenities.some(a => a.toLowerCase().includes(amenity.toLowerCase()))
        );
        if (!hasAllAmenities) return false;
      }
      // Price filters
      if (filters.minPrice > 0 && prop.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice > 0 && prop.price > filters.maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'area-desc') return b.specs.totalArea - a.specs.totalArea;
      // newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [properties, filters]);

  // Actions
  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const addProperty = (newPropData: Omit<Property, 'id' | 'createdAt'>) => {
    const newProp: Property = {
      ...newPropData,
      id: `prop-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProperties(prev => [newProp, ...prev]);
  };

  const updateProperty = (id: string, updated: Partial<Property>) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    if (selectedProperty && selectedProperty.id === id) {
      setSelectedProperty(prev => prev ? { ...prev, ...updated } : null);
    }
  };

  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
    setFavorites(prev => prev.filter(favId => favId !== id));
    setComparisonList(prev => prev.filter(compId => compId !== id));
    if (selectedProperty?.id === id) setSelectedProperty(null);
  };

  const resetDefaultProperties = () => {
    setProperties(INITIAL_PROPERTIES);
    localStorage.removeItem('pauli_properties');
  };

  // Favorites helpers
  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);

  // Comparison helpers
  const toggleComparison = (id: string) => {
    setComparisonList(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= 4) {
        alert('Puedes comparar un máximo de 4 propiedades simultáneamente.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const isInComparison = (id: string) => comparisonList.includes(id);

  const clearComparison = () => {
    setComparisonList([]);
  };

  // Requests helpers
  const addVisitRequest = (requestData: Omit<VisitRequest, 'id' | 'status' | 'createdAt'>) => {
    const newRequest: VisitRequest = {
      ...requestData,
      id: `vis-${Date.now()}`,
      status: 'pendiente',
      createdAt: new Date().toLocaleString('es-CL')
    };
    setVisitRequests(prev => [newRequest, ...prev]);
  };

  const updateVisitStatus = (id: string, status: VisitRequest['status']) => {
    setVisitRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const addCustomRequest = (requestData: Omit<CustomPropertyRequest, 'id' | 'status' | 'createdAt'>) => {
    const newRequest: CustomPropertyRequest = {
      ...requestData,
      id: `cust-${Date.now()}`,
      status: 'nueva',
      createdAt: new Date().toLocaleString('es-CL')
    };
    setCustomRequests(prev => [newRequest, ...prev]);
  };

  const updateCustomRequestStatus = (id: string, status: CustomPropertyRequest['status']) => {
    setCustomRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  // Lightbox
  const openLightbox = (images: string[], index: number = 0) => {
    setLightboxData({ images, currentIndex: index });
  };

  const closeLightbox = () => {
    setLightboxData(null);
  };

  const setLightboxIndex = (index: number) => {
    if (lightboxData) {
      setLightboxData({ ...lightboxData, currentIndex: index });
    }
  };

  return (
    <PropertyContext.Provider
      value={{
        properties,
        filteredProperties,
        filters,
        setFilters,
        resetFilters,
        addProperty,
        updateProperty,
        deleteProperty,
        resetDefaultProperties,
        favorites,
        toggleFavorite,
        isFavorite,
        comparisonList,
        toggleComparison,
        isInComparison,
        clearComparison,
        visitRequests,
        addVisitRequest,
        updateVisitStatus,
        customRequests,
        addCustomRequest,
        updateCustomRequestStatus,
        selectedProperty,
        setSelectedProperty,
        bookingProperty,
        setBookingProperty,
        isCustomRequestOpen,
        setIsCustomRequestOpen,
        isComparatorOpen,
        setIsComparatorOpen,
        isAdminOpen,
        setIsAdminOpen,
        lightboxData,
        openLightbox,
        closeLightbox,
        setLightboxIndex
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
};
