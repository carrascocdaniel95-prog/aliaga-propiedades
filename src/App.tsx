import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { PropertyProvider, useProperties } from './context/PropertyContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { VisitBookingModal } from './components/VisitBookingModal';
import { CustomPropertyRequestModal } from './components/CustomPropertyRequestModal';
import { PropertyComparatorModal } from './components/PropertyComparatorModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { PhotoLightbox } from './components/PhotoLightbox';
import { ValueProposition } from './components/ValueProposition';
import { ChatAgent } from './components/ChatAgent';
import { Footer } from './components/Footer';
import { Home, RotateCcw } from 'lucide-react';

const PropertyAppContent: React.FC = () => {
  const { 
    filteredProperties, 
    resetFilters,
    selectedProperty, 
    setSelectedProperty,
    bookingProperty, 
    setBookingProperty 
  } = useProperties();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Hero Showcase with Quick Search */}
      <Hero />

      {/* Main Interactive Catalog Section */}
      <main className="flex-1">
        {/* Sticky Filter Bar */}
        <FilterBar />

        {/* Property Grid Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          
          {filteredProperties.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-xs max-w-xl mx-auto p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                <Home className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900">
                  No encontramos propiedades con esos filtros
                </h3>
                <p className="text-xs text-slate-500">
                  Prueba ampliando el rango de búsqueda o restableciendo los filtros activos.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer Filtros</span>
              </button>
            </div>
          ) : (
            /* Properties Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

        </div>

        {/* Value Proposition & Trust Section */}
        <ValueProposition />
      </main>

      {/* Modals & Overlays */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}

      {bookingProperty && (
        <VisitBookingModal
          property={bookingProperty}
          onClose={() => setBookingProperty(null)}
        />
      )}

      <CustomPropertyRequestModal />
      <PropertyComparatorModal />
      <AdminPanelModal />
      <PhotoLightbox />
      <ChatAgent />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <PropertyProvider>
        <PropertyAppContent />
      </PropertyProvider>
    </AuthProvider>
  );
};

export default App;
