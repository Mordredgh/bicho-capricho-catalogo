# fix_plan.md — Bicho Capricho Catálogo 2026

## Bloqueantes reales (pre-lanzamiento)

- [ ] Links de redes sociales del footer (`href="#"` en `index.html`) —
      requieren URLs reales de cliente/negocio. No inventar, preguntar a
      Gerardo si no las tiene a mano.
- [ ] Confirmar número real de WhatsApp cargado en Admin (reemplaza el
      placeholder `521234567890`) antes de publicar en dominio final.
- [x] Contraseña default del panel admin eliminada por completo — login ahora
      es Supabase Auth (magic link) restringido a
      `ellegadodelosantiguos@gmail.com`, no hay password que rotar.
- [ ] Actualizar `og:url` en `index.html` (actualmente
      `https://bichocapricho.mx` placeholder) al dominio real cuando se
      defina (ver Obsidian `PRIORIDAD 1 - CIERRE BICHO CAPRICHO` — dominio
      final `bichocapricho.com.mx` pendiente de compra).
- [ ] Deploy temporal en `catalogo.manekistore.com.mx`: falta `git init` +
      repo GitHub (Coolify lo requiere), registro DNS en Hostinger, y crear
      app en Coolify con puerto fijo `127.0.0.1:8084:80` (siguiente libre
      tras POS 8081/Web 8082/CRM 8083). `Dockerfile`/`nginx.conf` ya listos.
- [ ] Agregar Redirect URLs en Supabase Dashboard → Authentication → URL
      Configuration: `http://localhost:8080/**` y
      `https://catalogo.manekistore.com.mx/**` — si no, el magic link de
      login no vuelve a `admin.html`. No hay tool MCP para esto, es manual.

## Integración Supabase — CERRADO (2026-07-11)

- [x] Tabla `catalogo_productos` ya existía en Supabase con el esquema
      correcto (0 filas) — no hubo que crearla.
- [x] `service_role key` eliminada del código y de la UI por completo (era
      vulnerabilidad: bypassa RLS, expuesta en localStorage del navegador).
      Reemplazada por `sbClient.storage.upload()` con sesión autenticada.
- [x] RLS de `catalogo_productos` estaba abierta a cualquiera sin login
      (`qual=true`) — corregido a `auth.jwt()->>'email' = ADMIN_EMAIL` para
      INSERT/UPDATE/DELETE.
- [x] RLS de storage `bc-catalogo` permitía subir a cualquier usuario
      autenticado (no solo el admin) — corregido igual, restringido al
      correo específico.
- [x] `catToSlug()` en `catalogo.js` ya usa el id de Supabase directamente
      como slug — no requería fix, código ya correcto.
- [ ] Subir productos reales desde el panel admin (tabla lista y segura,
      falta contenido real del negocio).

## Deuda técnica — CERRADO (2026-07-11)

- [x] `styles.css` — build de minificación agregado (`npm run build`,
      esbuild → `dist/styles.min.css` 68KB desde 92KB). Fuente se queda
      legible, no se reescribió a mano.
- [x] Bug real encontrado en el proceso: comentario de sección sin cerrar al
      final de `styles.css` (línea 2605) rompía cualquier
      parser/minificador — era código muerto, eliminado.
- [x] `onclick` inline en botones editar/eliminar de `renderTable()`
      (`admin.html`) reemplazado por event delegation (data-action/data-id).
- [ ] Uso excesivo de `!important` en `styles.css` — NO se tocó. Requiere
      QA visual línea por línea que Gerardo debe hacer manualmente (sin git
      en este proyecto, un cambio masivo de especificidad CSS sin forma de
      revertir ni de verificar visualmente es demasiado riesgoso para hacer
      a ciegas). Hacerlo como tarea aparte si se quiere, con revisión visual
      del propio Gerardo paso a paso.

## Optional / Future

- [ ] Code-splitting de `catalogo.js`/`admin.html` si el proyecto migra a
      bundler — no evaluar sin pedido explícito (YAGNI).
- [ ] Automatizar conversión WebP fuera del navegador (hoy es client-side en
      Admin, funciona bien para el volumen actual).

## Ya resuelto (referencia, no re-tocar sin motivo)

- [x] Badge `favorito` corregido (usaba imagen de `oferta` por defecto,
      documentado con TODO en CSS hasta tener badge propio).
- [x] Imágenes PNG pesadas convertidas a WebP (>95% reducción).
- [x] Favicon + Apple touch icon.
- [x] Meta description + Open Graph + Twitter cards.
- [x] 58 archivos duplicados eliminados de `assets/doodles` y
      `assets/patrones` (~24.5 MB liberados).
- [x] `aria-label` con `role="img"` corregido.
