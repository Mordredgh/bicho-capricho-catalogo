# PROMPT — Bicho Capricho Catálogo 2026

## Qué es este proyecto

Catálogo público estático y offline-first (PWA) de Bicho Capricho, estética
Scrapbook. Vive en `F:\PROYECTOS\BICHO CAPRICHO\CATALOGO 2026`. Sin repo git,
local-first. Sirve como portal de exhibición — NO es la tienda transaccional
(esa es [[BICHO CAPRICHO WEB]], proyecto aparte).

## Stack

HTML5 + CSS3 + JavaScript Vanilla + Service Worker (Stale-While-Revalidate) +
Supabase (solo categorías + storage de fotos). Productos viven en
`localStorage` + `defaultProducts`, 100% independiente de la tienda web real.

- `supabase_project`: hoqcrljgmamaumtdrtzi
- `supabase_bucket`: bc-catalogo (público)

## Reglas de dominio (no romper)

- **LAYOUT_SHAKE_PREVENTION**: typewriter del hero usa contenedor rígido
  `width: 9ch` — no romper eso, causa vibración lateral en móvil.
- **GLASSMORPHISM_COLOR_BG_ONLY**: `backdrop-filter: blur()` solo sobre fondos
  con color (bosque #1c4f32, lavanda, rosa). Nunca sobre blanco/crema.
- **TAPE_COLOR_COORDINATION**: color de washi tape en tarjeta de producto debe
  coincidir con `color_representativo` asignado en Admin.
- **INTERACTIVE_SWATCHES**: swatches de color cambian imagen principal sin
  abrir modal.
- Voz de marca: cálido, boutique — capricho/especial/único/sorpresa. Nunca
  "barato/descuento/promo/genérico" en copy.
- `admin.html` debe abrirse vía HTTP server (`python -m http.server`), nunca
  `file://` — localStorage no funciona sobre file://.

## Reglas globales del usuario (aplican siempre)

- Hablar caveman tight en respuestas, código/commits normales.
- TDD cuando aplique cambio de lógica no trivial.
- YAGNI — no sobre-ingeniería, no features no pedidas.
- Nada de mocks/placeholders que se cuelen a producción sin avisar
  (WhatsApp de prueba, links `#`, etc. — exactamente el tipo de deuda que
  este backlog ataca).

## Fuente de verdad adicional

- `REGISTRO-CATALOGO.md` — bitácora completa fase por fase.
- `auditoria_catalogo2026.md` — auditoría de bugs, ya con la mayoría resuelta.
- `Inicio.md` — guía de lanzamiento a producción (checklist manual pre-publish).
- Obsidian: `F:\Gerardo Brain\BICHO CAPRICHO CATÁLOGO 2026.md` (master, se
  actualiza con cada cambio real — no acumular, anotar al momento).
