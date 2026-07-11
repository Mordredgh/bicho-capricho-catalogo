-- ═══════════════════════════════════════════════════════════════════
-- BICHO CAPRICHO — Catálogo 2026 — Migración Supabase
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query
-- ═══════════════════════════════════════════════════════════════════

-- 1. Nuevas columnas en tabla products
--    (las que ya existen se saltan por el IF NOT EXISTS)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS precio_texto         text,
  ADD COLUMN IF NOT EXISTS badge                text,
  ADD COLUMN IF NOT EXISTS badge_pos            text    DEFAULT 'top-left',
  ADD COLUMN IF NOT EXISTS color_representativo text    DEFAULT 'lilac',
  ADD COLUMN IF NOT EXISTS colores              jsonb   DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS size_guide           text    DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS free_shipping        boolean DEFAULT false;

-- 2. Storage bucket bc-catalogo
-- ─────────────────────────────────────────────────────────────────
-- PASO MANUAL (no se puede via SQL):
--   Supabase Dashboard → Storage → New bucket
--   Nombre:  bc-catalogo
--   Public:  ✓ (activar "Public bucket")
-- ─────────────────────────────────────────────────────────────────
-- Luego ejecutar estas políticas RLS (bucket ya debe existir):

-- Lectura pública sin autenticación
CREATE POLICY "Public read bc-catalogo"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'bc-catalogo');

-- Inserción con service_role (sin restricción de rol, RLS bypassed por service key)
-- Si quieres restringir solo a service_role, basta con que el bucket exista
-- y las peticiones usen el service_role key (bypassa RLS automáticamente).
-- Estas políticas extra protegen si alguien usa el anon key:

CREATE POLICY "Block anon insert bc-catalogo"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'bc-catalogo'
    AND auth.role() = 'authenticated'
  );

-- ═══════════════════════════════════════════════════════════════════
-- VERIFICACIÓN: Correr esto para confirmar que las columnas existen
-- ═══════════════════════════════════════════════════════════════════
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'products'
  AND column_name IN (
    'precio_texto','badge','badge_pos',
    'color_representativo','colores','size_guide','free_shipping'
  )
ORDER BY column_name;
