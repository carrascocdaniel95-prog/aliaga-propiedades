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
-- Permiten a la aplicación web sincronizarse con la API pública
-- ========================================================

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visit_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_property_requests ENABLE ROW LEVEL SECURITY;

-- Limpieza preventiva de políticas anteriores
DROP POLICY IF EXISTS "Acceso total a propiedades" ON public.properties;
DROP POLICY IF EXISTS "Acceso total a solicitudes de visita" ON public.visit_requests;
DROP POLICY IF EXISTS "Acceso total a búsquedas personalizadas" ON public.custom_property_requests;

-- Políticas de acceso para la aplicación web
CREATE POLICY "Acceso total a propiedades"
    ON public.properties FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Acceso total a solicitudes de visita"
    ON public.visit_requests FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Acceso total a búsquedas personalizadas"
    ON public.custom_property_requests FOR ALL
    USING (true)
    WITH CHECK (true);

-- ========================================================
-- Catálogo Inicial de Propiedades (Semillero / Seed)
-- ========================================================

INSERT INTO public.properties (code, title, description, operation, property_type, status, featured, price, currency, price_uf, common_expenses, address, commune, city, neighborhood, map_embed_url, specs, amenities, images, video_url, video_type, agent)
VALUES 
(
    'PL-701',
    'Exclusiva Villa Lacustre en Pucón con Playa Privada & Vista al Volcán',
    'Impresionante residencia frente al Lago Villarrica, emplazada en un terreno con añosos coigües, arrayanes y araucarias nativas. Construcción de diseño bioclimático en madera noble de roble de demolición y piedra volcánica. Cuenta con amplio living comedor con chimenea flotante de acero, ventanales panorámicos hacia el lago y el volcán Villarrica. Muelle privado para lancha, bajada de embarcaciones, quincho cerrado frente a la playa y hot-tub de cedro.',
    'venta',
    'casa',
    'disponible',
    true,
    28500,
    'UF',
    28500,
    120000,
    'Camino Pucón a Villarrica km 8.5',
    'Pucón',
    'La Araucanía',
    'Playa Linda',
    'https://maps.google.com/maps?q=Pucon,+Araucania&t=&z=13&ie=UTF8&iwloc=&output=embed',
    '{"bedrooms": 5, "bathrooms": 5, "parkingSpots": 6, "totalArea": 5200, "builtArea": 420, "petFriendly": true, "orientation": "Norte", "yearBuilt": 2023}'::jsonb,
    ARRAY['Orilla de lago privada', 'Muelle propio para lanchas', 'Hot-tub de madera nativa', 'Bosque nativo con Araucarias', 'Quincho panorámico con parrilla y spiedo', 'Chimenea a leña de alto rendimiento', 'Calefacción central por aerotermia', 'Generador eléctrico de respaldo', 'Seguridad privada con control de acceso'],
    ARRAY['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1600&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'],
    'https://www.youtube.com/embed/n4d1-J2q1-s?autoplay=0',
    'youtube',
    '{"name": "Paulina Aliaga", "role": "Directora & Broker Inmobiliaria", "phone": "+56 9 7669 1216", "whatsapp": "56976691216", "email": "contacto@paulipropiedades.cl"}'::jsonb
),
(
    'PL-702',
    'Refugio de Montaña Contemporáneo en Malalcahuello',
    'Exclusiva propiedad estilo A-frame nórdico en el corazón del valle de Malalcahuello, a minutos del centro de esquí Corralco y la Reserva Nacional Malalcahuello-Nalcas. Inmersa en un bosque prístino de araucarias milenarias. Aislación térmica superior con ventanas termopanel triple, estufa a pellets con encendido domótico por smartphone, terraza con tina caliente temperada y vista directa al Volcán Lonquimay.',
    'arriendo',
    'casa',
    'disponible',
    true,
    1450000,
    'CLP',
    NULL,
    45000,
    'Ruta 181 km 88, Sector Suizo',
    'Malalcahuello',
    'La Araucanía',
    'Valle Las Raíces',
    'https://maps.google.com/maps?q=Malalcahuello,+Curacautin&t=&z=13&ie=UTF8&iwloc=&output=embed',
    '{"bedrooms": 3, "bathrooms": 2, "parkingSpots": 4, "totalArea": 2500, "builtArea": 165, "petFriendly": true, "orientation": "Nororiente", "yearBuilt": 2024}'::jsonb,
    ARRAY['Bosque de Araucarias milenarias', 'Tina de agua caliente exterior (Hot-Tub)', 'A 10 min de Termas y Corralco Ski Resort', 'Internet fibra óptica de alta velocidad', 'Estufa a pellets inteligente', 'Guarda-esquís calefaccionado', 'Terraza con deck de pino oregón'],
    ARRAY['https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1600&q=80', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80'],
    'https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=0',
    'youtube',
    '{"name": "Paulina Aliaga", "role": "Directora & Broker Inmobiliaria", "phone": "+56 9 7669 1216", "whatsapp": "56976691216", "email": "contacto@paulipropiedades.cl"}'::jsonb
),
(
    'PL-703',
    'Penthouse Dúplex de Lujo en Los Pablos, Temuco',
    'Extraordinario penthouse dúplex ubicado en el sector más exclusivo de Los Pablos en Temuco. Vista despejada panorámica de 270 grados a la cordillera y al Monumento Natural Cerro Ñielol. Doble altura en living con muro de piedra laja y chimenea a bioetanol. Terraza privada en azotea de 95 m² con jacuzzi techado, quincho integrado con mesón de granito negro y bar.',
    'venta',
    'penthouse',
    'disponible',
    true,
    16800,
    'UF',
    16800,
    320000,
    'Av. Los Pablos 2190',
    'Temuco',
    'La Araucanía',
    'Los Pablos',
    'https://maps.google.com/maps?q=Los+Pablos,+Temuco&t=&z=14&ie=UTF8&iwloc=&output=embed',
    '{"bedrooms": 4, "bathrooms": 4, "parkingSpots": 3, "totalArea": 310, "builtArea": 215, "petFriendly": true, "orientation": "Suroriente", "yearBuilt": 2022}'::jsonb,
    ARRAY['Azotea privada con jacuzzi panorámico', 'Quincho cerrado exclusivo en piso superior', 'Calefacción central por losa radiante', 'Ascensor directo al departamento con clave', 'Seguridad 24/7 con circuito cerrado', 'Club House y piscina temperada del condominio'],
    ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80'],
    'https://www.youtube.com/embed/ysz5S6PUM-U?autoplay=0',
    'youtube',
    '{"name": "Paulina Aliaga", "role": "Directora & Broker Inmobiliaria", "phone": "+56 9 7669 1216", "whatsapp": "56976691216", "email": "contacto@paulipropiedades.cl"}'::jsonb
)
ON CONFLICT (code) DO NOTHING;
