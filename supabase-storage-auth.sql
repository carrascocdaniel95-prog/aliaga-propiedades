-- ========================================================
-- Fotos propias y acceso seguro al mantenedor
-- Ejecuta este script completo en el SQL Editor de Supabase.
-- Se puede volver a ejecutar sin duplicar nada.
--
-- Antes de ejecutarlo:
--   1. Authentication > Users > Add user: crea el usuario administrador
--      con su correo y una contraseña nueva (no uses "pauli2026").
--   2. Reemplaza CORREO_ADMIN@ejemplo.cl en el paso 6 por ese correo.
-- Después de ejecutarlo:
--   3. Authentication > Sign In / Providers: desactiva "Allow new users to sign up".
-- ========================================================

-- 1. Lista de administradores (sin políticas: no se puede leer desde la web)
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.admin_users WHERE user_id = (SELECT auth.uid())
    );
$$;

-- 2. Propiedades: lectura pública, escritura solo administradores
DROP POLICY IF EXISTS "Acceso total a propiedades" ON public.properties;
DROP POLICY IF EXISTS "Lectura publica de propiedades" ON public.properties;
DROP POLICY IF EXISTS "Administradores gestionan propiedades" ON public.properties;

CREATE POLICY "Lectura publica de propiedades"
    ON public.properties FOR SELECT
    USING (true);

CREATE POLICY "Administradores gestionan propiedades"
    ON public.properties FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 3. Solicitudes de visita: el público solo puede enviar
DROP POLICY IF EXISTS "Acceso total a solicitudes de visita" ON public.visit_requests;
DROP POLICY IF EXISTS "Publico envia solicitudes de visita" ON public.visit_requests;
DROP POLICY IF EXISTS "Administradores gestionan visitas" ON public.visit_requests;

CREATE POLICY "Publico envia solicitudes de visita"
    ON public.visit_requests FOR INSERT
    TO anon, authenticated
    WITH CHECK (status = 'pendiente');

CREATE POLICY "Administradores gestionan visitas"
    ON public.visit_requests FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 4. Solicitudes "Buscamos por ti": el público solo puede enviar
DROP POLICY IF EXISTS "Acceso total a búsquedas personalizadas" ON public.custom_property_requests;
DROP POLICY IF EXISTS "Publico envia busquedas personalizadas" ON public.custom_property_requests;
DROP POLICY IF EXISTS "Administradores gestionan busquedas" ON public.custom_property_requests;

CREATE POLICY "Publico envia busquedas personalizadas"
    ON public.custom_property_requests FOR INSERT
    TO anon, authenticated
    WITH CHECK (status = 'nueva');

CREATE POLICY "Administradores gestionan busquedas"
    ON public.custom_property_requests FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 5. Bucket de fotos: se ven por URL pública, solo administradores suben o borran
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('property-images', 'property-images', true, 5242880, ARRAY['image/webp', 'image/jpeg'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Administradores suben fotos" ON storage.objects;
DROP POLICY IF EXISTS "Administradores ven fotos" ON storage.objects;
DROP POLICY IF EXISTS "Administradores borran fotos" ON storage.objects;

CREATE POLICY "Administradores suben fotos"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'property-images' AND public.is_admin());

CREATE POLICY "Administradores ven fotos"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'property-images' AND public.is_admin());

CREATE POLICY "Administradores borran fotos"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'property-images' AND public.is_admin());

-- 6. Registrar al administrador (reemplaza el correo)
INSERT INTO public.admin_users (user_id)
SELECT id FROM auth.users WHERE email = 'CORREO_ADMIN@ejemplo.cl'
ON CONFLICT (user_id) DO NOTHING;

-- Debe mostrar el correo del administrador. Si sale vacío, revisa el paso 6.
SELECT u.email FROM public.admin_users a JOIN auth.users u ON u.id = a.user_id;
