# Pauli Propiedades - Plataforma Inmobiliaria Interactiva 🏡✨

Plataforma web moderna e interactiva desarrollada con **React + Vite + TypeScript + Tailwind CSS** para visualización multimedia de propiedades (fotografías en alta resolución y video tours 4K) y gestión de solicitudes de arriendo y compra.

---

## 🚀 Características Principales

### 1. 📸 Visualización Interactiva Multimedia
- **Galería de fotos en alta resolución**: Carrusel dinámico en cada tarjeta y visor con miniaturas.
- **Lightbox a pantalla completa**: Navegación con teclado (flechas y Escape) para examinar cada detalle arquitectónico.
- **Video Tours 4K**: Reproductor interactivo integrado para ver recorridos virtuales antes de visitar la propiedad.
- **Ubicación en Mapa**: Visualización geográfica de comunas y sectores.

### 2. 📝 Solicitudes de Compra y Arriendo
- **Agendar Visita Personalizada**: Formulario para coordinar visitas **Presenciales** o por **Videollamada en vivo** con fecha y hora preferida.
- **"Busco una Propiedad a mi Medida"**: Formulario guiado donde los clientes ingresan su presupuesto (CLP / UF), comunas de interés, dormitorios, amenidades deseadas y requisitos indispensables.
- **Integración Directa con WhatsApp**: Enlaces directos que generan mensajes automáticos pre-rellenados con el código de la propiedad (`PL-301`, etc.), título y valor.

### 3. ⚖️ Comparador de Propiedades
- Selecciona hasta 4 propiedades para contrastar lado a lado sus especificaciones (Precio, Gastos comunes, m² totales y útiles, dormitorios, baños, estacionamientos, si acepta mascotas y comodidades).

### 4. ❤️ Favoritos con Persistencia
- Guarda propiedades favoritas que se mantienen guardadas en el navegador (`localStorage`).

### 5. 🔐 Mantenedor de Propiedades con Acceso Seguro (Usuario y Clave)
- **Control de Acceso Seguro**:
  - Requiere inicio de sesión con credenciales de administrador antes de ingresar al mantenedor.
  - **Usuario por defecto:** `admin` (o `paulina@paulipropiedades.cl`)
  - **Contraseña por defecto:** `pauli2026`
  - Botón de auto-completado rápido para pruebas inmediatas y validación de errores en tiempo real.
- **Gestión Completa de Publicaciones (CRUD)**:
  - **+ Agregar Nueva Propiedad**: Formulario con código, título, operación (Venta/Arriendo), tipo de inmueble, estado (Disponible, Reservado, Vendido), precio en UF o CLP, gastos comunes, dirección y comuna.
  - **Gestión Multimedia en Vivo**: Carga de URLs de fotos con previsualizador instantáneo de imágenes y campo para video tour 4K.
  - **Equipamiento & Amenidades**: Checklist de amenidades predeterminadas más opción de agregar amenidades personalizadas.
  - **Edición y Eliminación**: Modificación inmediata de cualquier propiedad y eliminación permanente con confirmación.
  - **Cambio de Estado en 1 Clic**: Actualiza directamente en la tabla si una propiedad está `Disponible`, `Reservada` o `Vendida / Arrendada`.
- **CRM de Solicitudes**:
  - Pestaña de **Visitas Agendadas**: Gestiona citas presenciales o videollamadas con botón para contactar al cliente por WhatsApp.
  - Pestaña de **Solicitudes a Medida**: Revisa requerimientos de búsqueda personalizados con presupuesto y comunas.
- **Seguridad & Clave de Acceso**:
  - Formulario para actualizar la contraseña del mantenedor en cualquier momento.
  - Opción de restaurar la contraseña a su valor inicial en caso de olvido.

---

## 💻 Ejecución del Proyecto

El servidor de desarrollo ya está activo en tu equipo:
- **Local:** [http://localhost:3000](http://localhost:3000)
- **Red Local:** `http://192.168.0.17:3000`

### Comandos útiles:
```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar compilación de producción
npm run preview
```

---

## 📂 Estructura del Código

- `src/types/property.ts`: Modelos de datos TypeScript (Property, Specs, Filters, Requests).
- `src/data/mockProperties.ts`: Catálogo inicial con fotografías arquitectónicas y videos.
- `src/context/PropertyContext.tsx`: Gestión global de estado (filtros, persistencia, CRM).
- `src/components/Navbar.tsx`: Barra de navegación con accesos rápidos y contadores.
- `src/components/Hero.tsx`: Cabecera con buscador por operación, tipo y comuna.
- `src/components/FilterBar.tsx`: Barra de filtros avanzados y ordenamiento.
- `src/components/PropertyCard.tsx`: Tarjetas de propiedades interactivas con carrusel.
- `src/components/PropertyDetailModal.tsx`: Ficha completa con visor de fotos, video tour y mapa.
- `src/components/VisitBookingModal.tsx`: Modal para agendar visitas presenciales/virtuales.
- `src/components/CustomPropertyRequestModal.tsx`: Formulario de búsqueda a la medida.
- `src/components/PropertyComparatorModal.tsx`: Comparador de propiedades en matriz.
- `src/components/AdminPanelModal.tsx`: Panel administrador para gestión y solicitudes.
- `src/components/PhotoLightbox.tsx`: Visor a pantalla completa.
