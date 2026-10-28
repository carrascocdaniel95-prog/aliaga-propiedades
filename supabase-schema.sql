-- ========================================================
-- Schema de Supabase para Aliaga Gestión & Corretaje
-- Ejecuta este script en el SQL Editor de tu panel de Supabase
-- ========================================================

-- 1. Tabla de Propiedades
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    operation VARCHAR(20) NOT NULL CHECK (operation IN ('venta', 'arriendo')),
    property_type VARCHAR(30) NOT NULL CHECK (property_type IN ('departamento', 'casa', 'parcela', 'oficina', 'penthouse')),
    status VARCHAR(20) DEFAULT 'disponible' CHECK (status IN ('disponible', 'reservado', 'vendido')),
    featured BOOLEAN DEFAULT false,
    price NUMERIC NOT NULL,
    currency VARCHAR(10) DEFAULT 'CLP' CHECK (currency IN ('CLP', 'UF')),
    price_uf NUMERIC,
    common_expenses NUMERIC,
    address TEXT NOT NULL,
    commune VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    neighborhood VARCHAR(100),
    map_embed_url TEXT,
    specs JSONB NOT NULL DEFAULT '{
        "bedrooms": 1,
        "bathrooms": 1,
        "parkingSpots": 0,
        "totalArea": 50,
        "builtArea": 50,
        "petFriendly": true
    }'::jsonb,
    amenities TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    video_url TEXT,
    video_type VARCHAR(20),
    virtual_tour_url TEXT,
    agent JSONB NOT NULL DEFAULT '{
        "name": "Paulina Aliaga",
        "role": "Directora & Corredora",
        "phone": "+56 9 7669 1216",
        "whatsapp": "56976691216",
        "email": "contacto@paulipropiedades.cl"
    }'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de Solicitudes de Visita (Visit Requests)
CREATE TABLE IF NOT EXISTS public.visit_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    property_title VARCHAR(255) NOT NULL,
    property_code VARCHAR(50) NOT NULL,
    property_price VARCHAR(50) NOT NULL,
    client_name VARCHAR(150) NOT NULL,
    client_email VARCHAR(150) NOT NULL,
    client_phone VARCHAR(50) NOT NULL,
    visit_type VARCHAR(30) NOT NULL CHECK (visit_type IN ('presencial', 'videollamada')),
    preferred_date DATE NOT NULL,
    preferred_time_slot VARCHAR(50) NOT NULL,
    comments TEXT,
    status VARCHAR(30) DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'confirmada', 'realizada', 'cancelada')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de Solicitudes Personalizadas ("Buscamos por ti")
CREATE TABLE IF NOT EXISTS public.custom_property_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name VARCHAR(150) NOT NULL,
    client_email VARCHAR(150) NOT NULL,
    client_phone VARCHAR(50) NOT NULL,
    operation VARCHAR(20) NOT NULL CHECK (operation IN ('venta', 'arriendo')),
    property_type VARCHAR(30) NOT NULL,
    preferred_communes TEXT[] DEFAULT '{}',
    max_budget NUMERIC,
    currency VARCHAR(10) DEFAULT 'CLP' CHECK (currency IN ('CLP', 'UF')),
    min_bedrooms INT DEFAULT 1,
    min_bathrooms INT DEFAULT 1,
    must_haves TEXT[] DEFAULT '{}',
    comments TEXT,
    status VARCHAR(30) DEFAULT 'nueva' CHECK (status IN ('nueva', 'en_busqueda', 'contactado', 'archivada')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- Políticas de Seguridad (Row Level Security - RLS)
-- ========================================================

-- Activar RLS en todas las tablas
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visit_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_property_requests ENABLE ROW LEVEL SECURITY;

-- Propiedades: lectura pública para cualquier visitante de la web
CREATE POLICY "Lectura pública de propiedades" 
    ON public.properties FOR SELECT 
    USING (true);

-- Propiedades: creación, actualización y borrado solo para usuarios autenticados (Admin)
CREATE POLICY "Admin gestiona propiedades" 
    ON public.properties FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Solicitudes de visita: cualquiera puede enviar una solicitud (INSERT)
CREATE POLICY "Público puede agendar visitas" 
    ON public.visit_requests FOR INSERT 
    WITH CHECK (true);

-- Solicitudes de visita: solo admin puede verlas y modificarlas
CREATE POLICY "Admin gestiona solicitudes de visita" 
    ON public.visit_requests FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Solicitudes personalizadas: cualquiera puede enviar su solicitud
CREATE POLICY "Público puede solicitar búsqueda" 
    ON public.custom_property_requests FOR INSERT 
    WITH CHECK (true);

-- Solicitudes personalizadas: solo admin puede gestionarlas
CREATE POLICY "Admin gestiona búsquedas personalizadas" 
    ON public.custom_property_requests FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);
