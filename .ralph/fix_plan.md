# fix_plan.md — Bicho Capricho Catálogo 2026

## Bloqueantes reales (pre-lanzamiento)

- [ ] Links de redes sociales del footer siguen `href="#"` (Instagram,
      Facebook, WhatsApp del footer) — confirmado en vivo 2026-07-12.
      Gerardo dijo que los llena él, no insistir más.
- [ ] WhatsApp sigue en placeholder `521234567890` — confirmado en vivo
      (botón flotante y "Cotizar por WhatsApp"). Gerardo lo hace él.
- [x] Contraseña default del panel admin eliminada — login Supabase Auth
      (magic link), `ellegadodelosantiguos@gmail.com`.
- [x] `og:url`/canonical corregidos a `catalogo.manekistore.com.mx` — YA EN
      VIVO, verificado 2026-07-12.
- [x] **Deploy CERRADO** — `catalogo.manekistore.com.mx` vivo, HTTPS válido,
      Coolify app `bicho-capricho-catalogo` corriendo, puerto real usado
      `127.0.0.1:8085:80` (8084 estaba ocupado por otra app).
- [x] Redirect URLs en Supabase Auth agregadas 2026-07-12 vía navegador
      (sesión de Gerardo): `https://catalogo.manekistore.com.mx/**` y
      `http://localhost:8080/**`. Confirmado guardado ("Total URLs: 2").
      Magic link de admin ya funciona completo.

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

## SEO/Perf ronda 2 — CERRADO (2026-07-12)

- [x] Preconnect a Supabase (`hoqcrljgmamaumtdrtzi.supabase.co`) en
      `index.html` — verificado presente en el HTML servido.
- [x] Soft-404 corregido: el sitio no tiene rutas de cliente (solo
      `#anchors`), se quitó el fallback SPA de `nginx.conf`. URLs
      inexistentes devuelven `404` real, verificado con curl.
- [x] Headers de seguridad: `X-Content-Type-Options`, `X-Frame-Options`,
      `Referrer-Policy` — verificados presentes en respuesta real.

## Colecciones + mockups + estampado — CERRADO (2026-07-12)

- [x] Colecciones como entidad real (`catalogo_colecciones`) con
      slugify+upsert anti-duplicado, filtro público, banner, deep link,
      toggle activa/inactiva, modal propio separado del de producto.
- [x] Librería de mockups de playera reusable (33 fotos WebP, assets
      estáticos en `assets/mockups/`, no Supabase Storage).
- [x] Flujo bulk: subir diseño PNG por colección → genera 4 productos
      (uno por corte: Hombre/Mujer/Juvenil/Niños) con swatches por color,
      evita duplicado visual de swatch.
- [x] Selector de estampado (posición + tamaño) en el modal de producto,
      solo cuando `sizeGuide === 'playera'`. Precios y zona replicados de
      `bicho-capricho-web/Configurador.tsx`. Sin rectángulo overlay (diseño
      ya viene compuesto en la foto). Precio y mensaje de WhatsApp se
      actualizan en vivo con la selección.

## SEO/Perf — CERRADO (2026-07-11)

- [x] Gzip end-to-end (nginx contenedor + fix nginx host: `proxy_http_version
      1.1` + `proxy_set_header Accept-Encoding "gzip"` DENTRO del `location`).
- [x] `robots.txt` + `sitemap.xml` — verificados 200 en vivo.
- [x] JSON-LD `Product` dinámico — solo se activa con productos reales de
      Supabase (0 hoy, correcto que no inyecte nada todavía).
- [x] Overflow horizontal (`.side-sticker.sticker-right-1`) — verificado en
      vivo 2026-07-12, `canScrollRight: 0`.

## Accesibilidad + perf modal — CERRADO (2026-07-12)

- [x] Wishlist auditada — ya completa (localStorage + panel + WhatsApp),
      no requería cambios.
- [x] Carrusel del modal: `alt` real con nombre de producto + índice de
      foto (antes vacío).
- [x] Foco accesible: modal mueve foco al botón cerrar al abrir, regresa
      al elemento disparador al cerrar.
- [x] Imágenes del carrusel con `loading="lazy"` (excepto primera) +
      fade-in CSS al cargar.

## Panel admin: 5 mejoras de flujo — CERRADO (2026-07-12)

- [x] Buscador por nombre en tabla de productos.
- [x] Botón duplicar producto (clona todo + "(copia)" en nombre).
- [x] Toggle rápido de agotado desde la tabla (sin abrir modal).
- [x] Reordenar galería de fotos arrastrando miniaturas.
- [x] Exportar catálogo completo a CSV.

## Panel admin: guardas y bulk — CERRADO (2026-07-12)

- [x] Aviso de cambios sin guardar al cerrar modal de producto.
- [x] Selección múltiple + acciones en bloque (agotado/disponible/eliminar).
- [x] Descartado a propósito: CRUD de categorías en admin — Gerardo las
      controla desde el POS de Bicho Capricho, no tocar.

## Ronda brainstorming: 8 mejoras admin + catálogo — CERRADO (2026-07-12)

- [x] Preview en vivo del producto en el modal admin (panel lateral que
      actualiza nombre/precio/desc/foto mientras editas).
- [x] Snackbar "Deshacer" 5s al eliminar (individual y en bloque) —
      reemplaza el borrado inmediato tras confirmar.
- [x] Dashboard de pendientes: chips clicables "sin foto" / "sin
      descripción" que filtran la tabla.
- [x] Compresión de fotos individuales — ya existía (`compressImage`,
      800px + WebP), no requería cambios.
- [x] Botón "Compartir" (Web Share API + fallback copiar link) en el
      modal público — incluye deep link nuevo `?producto=<id>`.
- [x] Sección "Recién agregado" en el catálogo público, usa `created_at`.
- [x] QR descargable del catálogo completo y por colección (admin,
      vía api.qrserver.com, abre en pestaña para guardar).
- [x] Productos agotados van al final del listado público, no mezclados.

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
