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

-- 1b. Agrupa variantes de un mismo diseño sin depender del nombre visible.
ALTER TABLE catalogo_productos
  ADD COLUMN IF NOT EXISTS grupo_diseno text;

-- Backfill compatible con los productos ya generados como "Diseño - Corte".
UPDATE catalogo_productos
SET grupo_diseno = trim(regexp_replace(nombre, '\\s-\\s(Hombre|Mujer|Juvenil|Niños)\\s*$', '', 'i'))
WHERE coleccion IS NOT NULL
  AND coalesce(grupo_diseno, '') = ''
  AND nombre ~* '\\s-\\s(Hombre|Mujer|Juvenil|Niños)\\s*$';

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

-- 2026-07-13: Separación formal catálogo general vs diseños de colección.
-- Evita depender del nombre visible ("Buzz - Hombre") para agrupar variantes.
ALTER TABLE public.catalogo_productos
  ADD COLUMN IF NOT EXISTS tipo_item text NOT NULL DEFAULT 'producto_general',
  ADD COLUMN IF NOT EXISTS orden integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS visible_catalogo boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notas_admin text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS derechos_sensibles boolean NOT NULL DEFAULT false;

ALTER TABLE public.catalogo_colecciones
  ADD COLUMN IF NOT EXISTS orden integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS destacada boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS visible_catalogo boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS derechos_sensibles boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notas_admin text NOT NULL DEFAULT '';

UPDATE public.catalogo_productos
SET tipo_item = CASE
  WHEN coalesce(coleccion, '') <> '' THEN 'diseno_coleccion'
  ELSE 'producto_general'
END
WHERE tipo_item IS NULL OR tipo_item = 'producto_general';

CREATE INDEX IF NOT EXISTS idx_catalogo_productos_tipo_visible_orden
  ON public.catalogo_productos (tipo_item, visible_catalogo, orden);

CREATE INDEX IF NOT EXISTS idx_catalogo_colecciones_visible_orden
  ON public.catalogo_colecciones (visible_catalogo, orden);
