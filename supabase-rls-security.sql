-- Bicho Capricho Catalogo 2026 - RLS hardening
-- Ejecutar manualmente en Supabase Dashboard -> SQL Editor.
-- No usar service_role en navegador. El admin opera con Supabase Auth y este correo.

begin;

-- Tablas publicas del catalogo.
alter table public.categories enable row level security;
alter table public.catalogo_productos enable row level security;
alter table public.catalogo_colecciones enable row level security;
alter table public.catalogo_mockups enable row level security;

-- Evita acumulacion de politicas permisivas antiguas.
drop policy if exists "Public read categories" on public.categories;
drop policy if exists "Public read visible catalog products" on public.catalogo_productos;
drop policy if exists "Admin full catalog products" on public.catalogo_productos;
drop policy if exists "Public read visible collections" on public.catalogo_colecciones;
drop policy if exists "Admin full collections" on public.catalogo_colecciones;
drop policy if exists "Admin full mockups" on public.catalogo_mockups;

-- Categories: lectura publica; no se gestionan desde este admin.
create policy "Public read categories"
  on public.categories
  for select
  to anon, authenticated
  using (true);

-- Productos: publico solo ve filas activas/visibles.
-- Nota: RLS no oculta columnas. El frontend publico usa select explicito y no pide notas_admin.
create policy "Public read visible catalog products"
  on public.catalogo_productos
  for select
  to anon, authenticated
  using (
    coalesce(activo, true) = true
    and coalesce(visible_catalogo, true) = true
  );

-- Admin: CRUD completo solo para el correo autorizado.
create policy "Admin full catalog products"
  on public.catalogo_productos
  for all
  to authenticated
  using (auth.jwt() ->> 'email' = 'ellegadodelosantiguos@gmail.com')
  with check (auth.jwt() ->> 'email' = 'ellegadodelosantiguos@gmail.com');

-- Colecciones: publico solo ve activas/visibles.
create policy "Public read visible collections"
  on public.catalogo_colecciones
  for select
  to anon, authenticated
  using (
    coalesce(activa, true) = true
    and coalesce(visible_catalogo, true) = true
  );

create policy "Admin full collections"
  on public.catalogo_colecciones
  for all
  to authenticated
  using (auth.jwt() ->> 'email' = 'ellegadodelosantiguos@gmail.com')
  with check (auth.jwt() ->> 'email' = 'ellegadodelosantiguos@gmail.com');

-- Mockups: no son necesarios para el catalogo publico; solo admin.
create policy "Admin full mockups"
  on public.catalogo_mockups
  for all
  to authenticated
  using (auth.jwt() ->> 'email' = 'ellegadodelosantiguos@gmail.com')
  with check (auth.jwt() ->> 'email' = 'ellegadodelosantiguos@gmail.com');

-- Storage del catalogo: lectura publica, escritura/borrado solo admin.
drop policy if exists "Public read bc-catalogo" on storage.objects;
drop policy if exists "Block anon insert bc-catalogo" on storage.objects;
drop policy if exists "Admin insert bc-catalogo" on storage.objects;
drop policy if exists "Admin update bc-catalogo" on storage.objects;
drop policy if exists "Admin delete bc-catalogo" on storage.objects;

create policy "Public read bc-catalogo"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'bc-catalogo');

create policy "Admin insert bc-catalogo"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'bc-catalogo'
    and auth.jwt() ->> 'email' = 'ellegadodelosantiguos@gmail.com'
  );

create policy "Admin update bc-catalogo"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'bc-catalogo'
    and auth.jwt() ->> 'email' = 'ellegadodelosantiguos@gmail.com'
  )
  with check (
    bucket_id = 'bc-catalogo'
    and auth.jwt() ->> 'email' = 'ellegadodelosantiguos@gmail.com'
  );

create policy "Admin delete bc-catalogo"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'bc-catalogo'
    and auth.jwt() ->> 'email' = 'ellegadodelosantiguos@gmail.com'
  );

commit;

-- Verificacion rapida:
-- select schemaname, tablename, policyname, cmd, roles from pg_policies
-- where tablename in ('categories','catalogo_productos','catalogo_colecciones','catalogo_mockups','objects')
-- order by schemaname, tablename, policyname;
