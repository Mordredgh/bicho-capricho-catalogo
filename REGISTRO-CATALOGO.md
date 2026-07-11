- **BUG #9 — Fotos de productos no actualizan**: eliminado `mix-blend-mode: multiply` del `<img>` en `createCardHTML()` (`catalogo.js` línea 85). Verificado que `mainImage` se guarda y carga correctamente en el admin.
- **BUG #10 — Mini-faces con bordes raros**: `.mini-faces img` reducido de `48px` a `40px` para caber dentro del `i` de `44px`. Eliminado `overflow: hidden` sobrante (`styles.css` líneas 75-76).
- **BUG #11 — Animaciones bloqueantes**: `@keyframes doodleDraw` cambiado de `clip-path` (forzaba repaint) a `transform: scale()` + `opacity`. Agregado `will-change: transform, opacity` a 15 elementos animados. `prefers-reduced-motion` también resetea `will-change` (`styles.css` líneas 122-130, 609-610).
- **BUG #12 — Hero text no responsive**: corregido `line-height` de `.88` a `1.05` en desktop, agregado font-size `56px` + `line-height: 1.08` en tablet (900px), y `clamp(50px,8.5vw,68px)` + `line-height: 1.12` + `max-width: 90vw` en móvil (600px) (`styles.css` líneas 21, 70-71).

- **Tipografías**: `Baloo 2` → `Fredoka` (títulos), `Quicksand` agregada (precios/interfaz), `Caveat` agregada (acentos/eslóganes).
- **Voz de marca**: textos revisados, eslogan oficial corregido a "Más que un regalo".
- **Assets copiados**: patrones (30 SVG), doodles (38 PNG), marcos (30 SVG), gradientes (8 PNG), badges (8 PNG).
- **Integración visual**: patrones como fondos sutiles, doodles en hero, badges oficiales en tarjetas, marco stitch en personalizados.
- **Badges aplicados**: 6 tarjetas de producto con badges oficiales (nuevo, favorito, personalizado, promo, top venta, edición limitada).
- **Assets renombrados**: todos los archivos con caracteres especiales renombrados a nombres limpios sin espacios ni tildes.
- **WhatsApp**: placeholder `521234567890` — **pendiente reemplazar con número real**.
- **Auditoría (5 jul 2026)**: detección de bugs críticos, problemas de performance y accesibilidad.
- **Limpieza de duplicados (5 jul 2026)**: 58 archivos eliminados (~24.5 MB liberados).
- **Conversión WebP (5 jul 2026)**: 16 imágenes PNG → WebP (~8.8 MB ahorrados). Referencias actualizadas en HTML y CSS.
- **Bug CSS z-index (5 jul 2026)**: corrección de transparencia en sección de personalizados.
- **Bug mix-blend-mode (5 jul 2026)**: corrección de fondo blanco en doodle de corazón y mini-faces.
- **Favicon agregado (5 jul 2026)**: `favicon-32.png` (navegador) y `favicon-180.png` (Apple Touch) generados desde `mascota.png`. Enlazados en `<head>` de `index.html`.
- **Badge favorito documentado (5 jul 2026)**: no existe en el kit oficial; temporalmente usa `badge-oferta.webp`, con comentario TODO en CSS.
- **Meta tags + Open Graph (5 jul 2026)**: meta description, OG y Twitter Card agregados. Imagen `og-image.webp` (1200×630)- **Mejoras Opcionales:**
  - 🔄 Configurados Meta Description, Open Graph y Twitter Cards.
  - 🗑️ Limpieza de archivos: Eliminados ~16 PNGs sobrantes de `/marcos` ahorrando ~7 MB. Total ahorrado en la sesión: ~31.55 MB.
  - 🛠️ Fase inicial del Panel de Administración (Fase 5) completada (`admin.html`), con CRUD en `localStorage`.
  - 🤖 Establecida directiva de agente para recordar automáticamente la asignación de Badges al crear productos.

## ✅ Fase 6 Completada: Catálogo Dinámico, Modal y Uploads (05 Julio 2026)
- **Panel de Admin (`admin.html`)**:
  - Implementación de campos de subida para **Foto Principal** y **Galería**.
  - Lógica de compresión en cliente (`canvas` a WebP) antes de guardar en `localStorage` (mitiga el límite de 5MB).
  - Previsualización de miniaturas de imágenes en la tabla de productos.
- **Catálogo Dinámico (`index.html` y `catalogo.js`)**:
  - Reemplazo de productos quemados en HTML por renderizado dinámico desde `localStorage`.
  - Archivo `script.js` renombrado a `catalogo.js` para forzar la actualización de caché en entornos locales (`file:///`).
  - Lógica anti-corrupción (`try/catch`) añadida al leer `localStorage`, previniendo bloqueos por datos residuales de sesiones previas.
  - Productos de muestra ampliados de 6 a 10 para probar nativamente el *swipe* y la paginación.
  - Layout actualizado a **4 columnas**.
  - Implementación de paginación por grupos de 8 productos utilizando **CSS Scroll Snap** (swipe lateral) e indicadores (dots).
- **Modal de Detalles del Producto**:
  - Estructura y diseño de modal inyectado en `index.html`.
  - Carrusel de fotos dinámico para cada producto.
  - Generación de botón de WhatsApp con enlace pre-llenado (`https://wa.me/NUM?text=Hola, me encantó [Producto]...`).

### FASE 1 — Tipografías y voz de marca (completada)
- Reemplazo de `Baloo 2` por `Fredoka` en todos los títulos y encabezados.
- Agregada `Nunito` como cuerpo de texto principal.
- Agregada `Quicksand` para interfaz y precios.
- Agregada `Caveat` para acentos manuscritos y eslóganes.
- Revisión de textos para que respeten la voz cálida y juguetona de Bicho Capricho.
- Corrección del eslogan oficial a "Más que un regalo".

### FASE 2 — Copia oficial de assets (completada)
- Patrones (30 SVG) copiados a `assets/patterns/`.
- Doodles (38 PNG) copiados a `assets/doodles/`.
- Marcos (30 SVG) copiados a `assets/frames/`.
- Gradientes (8 PNG) copiados a `assets/gradients/`.
- Badges (8 PNG) copiados a `assets/badges/` y renombrados sin caracteres especiales:
  - `badge-nuevo.png`
  - `badge-oferta.png`
  - `badge-personalizado.png`
  - `badge-promo.png`
  - `badge-top-vent.png`
  - `badge-ed-lim.png`
  - `badge-recomend.png`
  - `badge-premium.png`
- Sin modificación de los archivos originales en `ELEMENTOS PUBLICIDAD`.

### FASE 3 — Integración visual de assets (completada)
- CSS actualizado con rutas corregidas a badges renombrados.
- Badges oficiales aplicados a las 6 tarjetas de producto:
  - Tarjeta 1 (Taza Carita Feliz): Favorito / top-left.
  - Tarjeta 2 (Termo Bestie): Nuevo / top-left.
  - Tarjeta 3 (Playera Buena Vibra): Top Venta / top-right + doodle-accent.
  - Tarjeta 4 (Velita Apapacho): Promo / top-left.
  - Tarjeta 5 (Tote Bag Favorita): Personalizado / top-right.
  - Tarjeta 6 (Llavero Inicial): Edición Limitada / top-right.
- Modificadores CSS `.badge-official.top-left` y `.top-right` con rotaciones alternadas (-7deg / +5deg).

### FASE 4 — Auditoría, optimización y corrección de bugs (5 jul 2026)

#### 4.1 Auditoría general
Se auditaron los 4 archivos del proyecto (`index.html`, `styles.css`, `script.js`, `assets/`) identificando:
- 3 bugs críticos, 4 problemas importantes y 5 menores.
- Bugs críticos documentados: número de WhatsApp placeholder, links de redes sociales vacíos (`href="#"`), badge `.favorito` usando imagen de `.oferta`.

#### 4.2 Limpieza de archivos duplicados
- Carpetas afectadas: `assets/doodles/`, `assets/patrones/`, `assets/marcos/`.
- Cada archivo existía en doble versión: nombre con espacios y nombre con guiones bajos.
- Se eliminaron **58 archivos** (las versiones con espacios), conservando las versiones con guiones bajos que el CSS ya referencia.
- Espacio liberado: **~24.55 MB**.

#### 4.3 Conversión PNG → WebP
Script Node.js ejecutado con `sharp` para convertir las imágenes de mayor peso:

| Archivo | Antes | Después | Reducción |
|---|---|---|---|
| `crafty-senalando.png` | 2 006 KB | 76 KB | -96% |
| `crafty-corazon.png` | 1 655 KB | 73 KB | -96% |
| `mugsy-pulgar.png` | 1 443 KB | 40 KB | -97% |
| `tote-saludando.png` | 1 346 KB | 88 KB | -93% |
| `logo-bicho-capricho.png` | 273 KB | 118 KB | -57% |
| 8 badges PNG | ~1 900 KB | ~878 KB | ~-54% |
| 3 doodles PNG (usados en CSS) | ~1 625 KB | ~125 KB | ~-92% |

- Total ahorrado: **~8.80 MB**.
- Los archivos `.png` originales permanecen como respaldo.
- Todas las referencias en `index.html` y `styles.css` actualizadas de `.png` → `.webp`.

#### 4.4 Corrección de bug z-index — transparencia en sección "Personalizados"
**Causa:** El pseudo-elemento `::after` de `.custom-section` tenía `z-index:0` y al renderizarse como último hijo pintaba el overlay de burbujas (opacidad 18%) **por encima** del blob, la tarjeta y la mascota, haciéndolos parecer semi-transparentes.

**Fix en `styles.css`:**
- `isolation: isolate` añadido a `.custom-section` → crea un stacking context aislado.
- `z-index:0` → `z-index:-1` en `.custom-section::after` → el overlay queda detrás del contenido.

#### 4.5 Corrección de bug fondo blanco — doodle corazón y mini-faces
**Causa:** Los PNGs de doodles (`Coraz_n_garabateado_de_contorno`) eran dibujos escaneados sobre fondo blanco; la conversión a WebP conservó ese fondo blanco, visible sobre el hero oscuro y los círculos de color.

**Fix en `styles.css`:**
- `mix-blend-mode: multiply` añadido a `.hero-art .doodle-deco` → píxeles blancos se mezclan con el fondo, volviéndose invisibles.
- `mix-blend-mode: multiply` añadido a `.mini-faces img` → fondo blanco de la imagen adopta el color del círculo (`lima`, `lila`, `rosa`).

### FASE 5 — Meta tags, limpieza de PNGs y panel de administración (5 jul 2026)

#### 5.1 Meta description + Open Graph
Agregados en el `<head>` de `index.html`:
- `<meta name="description">` — texto SEO para buscadores.
- Tags Open Graph (`og:title`, `og:description`, `og:image`, `og:locale`) — vista previa al compartir en WhatsApp y Facebook.
- Twitter Card — vista previa en X/Twitter.
- `assets/og-image.webp` (1200×630) — imagen generada con IA en paleta de colores de Bicho Capricho.

#### 5.2 Eliminación de PNGs originales
16 archivos `.png` eliminados tras confirmar existencia de versión `.webp`:
`crafty-corazon`, `crafty-senalando`, `logo-bicho-capricho`, `mugsy-pulgar`, `tote-saludando`, los 8 badges, y los 3 doodles usados en CSS.
- Espacio liberado adicional: **~7 MB**.
- Total liberado en sesión: **~31.55 MB** (duplicados + conversión + PNGs).

#### 5.3 Panel de administración — `admin.html`
Archivo independiente `admin.html` con:
- **Login con contraseña** (`bicho2026` — cambiar antes de publicar).
- **Tabla de productos** con nombre, categoría, precio, badge y descripción.
- **CRUD completo**: agregar, editar y eliminar productos con modal.
- **El formulario siempre pregunta el badge** antes de guardar.
- **Config de WhatsApp**: guarda el número en `localStorage`.
- **Exportar / Importar JSON**: respaldo y migración de datos.
- **Stats en tiempo real**: total de productos, cuántos tienen badge, cuántas categorías.
- Datos almacenados en `localStorage` del navegador (sin servidor necesario).

## Objetivo

Diseñar la primera fase de un catálogo web interactivo para Bicho Capricho, centrado en la presentación visual de productos y pedidos personalizados.

El catálogo debe sentirse como una extensión de la identidad de Bicho Capricho y no como una tienda genérica o una landing page corporativa.

## Ubicación principal

Todos los archivos relacionados con el catálogo se guardan en:

`F:\PROYECTOS\BICHO CAPRICHO\CATALOGO 2026`

## Archivos creados

- `index.html`: estructura y contenido del catálogo.
- `styles.css`: diseño visual y adaptación responsive.
- `script.js`: filtros de categorías y enlaces de pedido.
- `assets/`: recursos gráficos utilizados.
- `REGISTRO-CATALOGO.md`: este documento.

## Estructura implementada

1. Navegación principal.
2. Portada con propuesta de valor.
3. Navegación y filtros por categorías.
4. Seis productos de demostración.
5. Sección para pedidos personalizados.
6. Bloque de beneficios y confianza.
7. Pie de página con contacto y redes.
8. Botones preparados para abrir WhatsApp.
9. Diseño adaptable para escritorio, tableta y celular.

## Interacciones implementadas

- Filtros por categoría.
- Navegación interna entre secciones.
- Botones de producto con mensaje prellenado para WhatsApp.
- Botón flotante de WhatsApp.
- Estados visuales al pasar sobre botones y productos.

El número de WhatsApp sigue siendo temporal: `520000000000`.

## Recursos oficiales integrados

### Identidad

- Logo horizontal oficial con mascota.

### Mascotas

- Crafty señalando.
- Crafty con corazón.
- Tote saludando.
- Mugsy con pulgar arriba.

Las mascotas se utilizan como guías y acentos con una función concreta, no como decoración aleatoria.

### Iconos de categorías

- Vasos y tumblers.
- Ropa y textiles.
- Cajas de regalo.
- Accesorios personalizados.

También se copiaron al proyecto los iconos de tazas y velas para futuras ampliaciones.

## Revisión de recursos disponibles

Se revisaron aproximadamente 850 recursos visuales dentro de:

`F:\PROYECTOS\BICHO CAPRICHO`

Se excluyeron dependencias, compilaciones, carpetas `node_modules` y archivos técnicos.

Colecciones visuales identificadas:

- Mascotas 3D y sus diferentes poses.
- Logos oficiales.
- Iconos de categorías.
- Iconos de beneficios, contacto, ocasiones y técnicas.
- Patrones de marca.
- Marcos y contenedores.
- Marcos de collage.
- Doodles y garabatos.
- Badges.
- Divisores.
- Gradientes.
- Elementos individuales.
- Fondos y escenarios.

## Identidad visual estudiada

Fuente de referencia:

`C:\Users\gerar\Downloads\BICHO CAPRICHO\BRAND KIT.jpg`

### Paleta oficial

- Bosque: `#1c4f32`
- Lavanda: `#dfbfff`
- Uva: `#9669c4`
- Lima: `#c3ec9f`
- Oliva: `#678d47`
- Mantequilla: `#FFD166`
- Rosa: `#FFB4C8`
- Crema: `#F8F4EC`

### Tipografías oficiales

- Fredoka One: títulos y encabezados.
- Caveat: acentos, eslóganes y detalles artesanales.
- Nunito: cuerpo y texto general.
- Quicksand: interfaz, precios y datos.

### Personalidad

- Juguetona.
- Cálida.
- Cercana.
- Creativa.
- Detallista.

### Voz de marca

La marca habla como una amiga creativa que sabe qué regalo hace sentir especial a cada persona.

Palabras y conceptos que deben priorizarse:

- Capricho.
- Especial.
- Único.
- Sorpresa.
- Con amor.
- Memorable.

Palabras y enfoques que deben evitarse:

- Barato.
- Descuento como argumento principal.
- Promo genérica.
- Normal.
- Genérico.
- Mensajes centrados únicamente en precio.

## Dirección visual acordada

- Fondos crema, bosque, lavanda, rosa y lima.
- Composiciones alegres inspiradas en scrapbook.
- Marcos y formas decorativas en lugar de tarjetas corporativas planas.
- Mascotas integradas con intención.
- Iconografía 3D oficial.
- Detalles como estrellas, corazones y trazos hechos a mano.
- Fotografías o productos con composiciones ligeramente inclinadas.
- Espaciado suficiente para mantener legibilidad, sin caer en minimalismo corporativo.
- Patrones lineales oficiales como recurso secundario.
- Elementos publicitarios utilizados con moderación para evitar saturación.

## Estado actual

El diseño base está terminado y funciona como prototipo visual.

La integración inicial de logo, mascotas e iconos oficiales está terminada.

La revisión del Brand Kit detectó que todavía deben ajustarse:

- Tipografía de títulos de Baloo a Fredoka One.
- Uso de Quicksand en precios y elementos de interfaz.
- Inclusión controlada de Caveat.
- Sustitución de algunos elementos decorativos genéricos por patrones y doodles oficiales.
- Revisión del tono de todos los textos.

## Próximos pasos

### ⏳ Pendientes — datos por confirmar

1. **WhatsApp** — pendiente hasta que el cliente envíe el número real. Buscar y reemplazar `521234567890` en `index.html` (×2) y `script.js` (×1).
2. **Redes sociales** — pendiente hasta que el cliente envíe los links. Los `href="#"` del footer (Instagram, Facebook, WhatsApp) están reservados.

### 🔧 Pendientes técnicos

3. **Badge `.favorito`** — se asignará cuando se agregue el producto real desde el panel.
4. **Cambiar contraseña del admin** — la contraseña por defecto es `bicho2026`; cambiar en `admin.html` antes de publicar.
5. **Agregar URL del sitio en los tags OG** — cuando el sitio tenga dominio, agregar `<meta property="og:url" content="https://tudominio.com">`.
6. **Conectar productos del panel al catálogo** — actualmente los productos se guardan en `localStorage`; para que aparezcan en el catálogo hay que implementar la lectura dinámica en `script.js` (Fase 6).

## Criterio de conservación

Los recursos originales de Bicho Capricho no se modifican. Los archivos necesarios se copian a la carpeta `assets` del catálogo y se renombran de forma descriptiva para facilitar su mantenimiento.

## ✅ Fase 7 Completada: Estética Scrapbook, Mascotas Dinámicas y Swatches (05 Julio 2026)
- **Mascotas Dinámicas por Categoría**:
  - Copiado el paquete completo de 9 mascotas oficiales pre-optimizadas en formato WebP desde el proyecto React (`bicho-capricho-web`) a `CATALOGO 2026/assets/mascotas/`.
  - Implementación de un contenedor de mascota flotante en el encabezado del catálogo (`.heading-mascot`).
  - Al cambiar de categoría en el catálogo, la mascota cambia físicamente con una animación elástica suave para coincidir con la categoría elegida:
    * **Todos**: Crafty (Regalo saludando)
    * **Vasos y tazas**: Mugsy (Taza saludando)
    * **Textil**: Estampilla (Playera saludando)
    * **Detalles**: Flik (Vela saludando)
    * **Personalizados**: Tote (Bolsa saludando)
- **Estructura Scrapbook en Pedidos Personalizados**:
  - Rediseño de la sección de cotización de 3 pasos. Ahora cada paso se muestra como una **tarjeta de papel texturizada (Polaroid/Nota)** con rotaciones alternadas orgánicas.
  - Añadido un efecto visual de **cinta washi adhesiva (washi tape)** semi-transparente sobre cada paso en colores oficiales (Rosa chicle, Mantequilla, Lima) simulando un tablero de scrapbooking real.
- **Marcos de Foto Orgánicos y Flexibles**:
  - Añadidas clases CSS para formas de marcos dinámicas aplicadas de manera alterna en el catálogo (`frame-arch`, `frame-squircle`, `frame-asymmetric`, `frame-pill`). Esto rompe las cuadrículas corporativas tradicionales en favor del scrapbook boutique.
- **Color Swatches (Muestras de Color) y Administrador de HEX**:
  - Inyectada una mini-hilera de círculos de colores de personalización disponibles debajo de la descripción de cada producto en su tarjeta, con interacción hover (efecto de escala).
  - Implementación en `admin.html` de un **selector dinámico de colores HEX** (usando paleta picker + input de texto HEX) para agregar y remover colores con códigos exactos.
  - Actualizada la renderización en `catalogo.js` para soportar tanto las clases predefinidas heredadas como cualquier valor HEX inyectado inline (`style="background-color: ..."`).
- **Detalle de Libreta Anillada (Notebook Spiral)**:
  - Agregado el contenedor `.notebook-spiral` en el lateral izquierdo del modal de detalles del producto, con 8 anillas metálicas 3D creadas puramente en CSS para dar el efecto de cuaderno físico abierto.
- **Doodles Superpuestos en Tarjetas (Card Doodles) y Fix de Transparencia**:
  - Convertidos a WebP los doodles oficiales (`Asterisco garabateado.png`, `Corazón garabateado de contorno.png`, `Espiral pequeña de énfasis.png`) y guardados en `assets/doodles/`.
  - Configurado `createCardHTML` para alternar la inclusión de estos doodles en las esquinas de los productos de forma orgánica.
  - **Resolución de Bug de Fondo Blanco:** Reemplazado el archivo de fondo del doodle de corazón en la cabecera hero (`Coraz_n_garabateado_de_contorno.webp`) por el nuevo `doodle-corazon-contorno.webp` con canal alfa de transparencia completo, solucionando de forma definitiva el recuadro grisáceo/blanco que se mostraba en el navegador.
- **Beneficios estilo Boceto (Hand-drawn Benefits)**:
  - Convertido a WebP el doodle `Círculo garabateado (para rodear una palabra).png`.
  - Reemplazados los contenedores perfectos de los beneficios en el pie de página por una composición de círculo doodle superpuesta detrás de cada ícono de marca.
- **Regla de Medidas (Size Guide Assistant)**:
  - Añadida regla a `AGENTS.md` para que el asistente siempre pregunte por la necesidad de una tabla de medidas cuando se gestionan productos textiles.

### Fase 8 y 9 — Interactividad de Catálogo y Scrapbook Físico (Completado)
- **Barra de Búsqueda y Estado Vacío**:
  - Agregado campo de búsqueda dinámico arriba de las categorías que responde al instante y se combina con los filtros.
  - Ilustrado el estado sin resultados con **Flik pensando** (`sticker pensando.webp`).
- **Tablón de Preguntas Frecuentes (FAQ Board)**:
  - Creada una nueva sección de 4 post-its de colores (Rosa chicle, Lavanda, Mantequilla, Lima) con rotaciones alternadas.
  - Diseñados alfileres decorativos en 3D (`.faq-pin`) usando gradientes de CSS para dar la apariencia de estar clavadas al tablón.
- **Sugerencia Sorpresa / Inspírate**:
  - Implementado un botón flotante con **Crafty emocionado** (`regalo emocionado.webp`) en el margen inferior izquierdo.
  - Al dar clic, un popover modal selecciona y muestra un producto sorpresa aleatorio, con atajos directos para ver los detalles.
- **Pestaña de Cuidados en Modal**:
  - Inyectado un bloque dinámico en el modal detallado (`.pm-care-instructions`) que muestra consejos de cuidado automatizados según el producto (Vasos, Textil o Genérico).
- **Mascotas Decorativas en Márgenes (Side Stickers)**:
  - Agregadas tres ilustraciones de mascotas en los extremos laterales de la página (Mugsy, Flik y Bolsa) para pantallas grandes de escritorio, reforzando la estética física del diario.
- **Torn Washi Tapes (Cintas Adhesivas en Fotos)**:
  - Implementado un bloque `.card-washi` arriba de cada foto del catálogo en colores alternados y recortados con `clip-path` emulando cinta rasgada a mano.
- **Fix de Anillas 3D Completas en Modal**:
  - Cambiada la visualización del modal a `overflow: visible;` permitiendo que las anillas del cuaderno salgan completamente de la tarjeta y floten sobre el fondo, logrando un efecto 3D realista.

### Fase 10 — Interactividad Premium de Scrapbook (Completado)
- **Guía de Medidas Collapsible para Textil**:
  - Agregado el contenedor `#pm-size-guide-container` en el panel de detalles del modal.
  - Implementado un acordeón interactivo (`.size-guide-accordion`) que se despliega exclusivamente en productos de la categoría textil, revelando una tabla de medidas manuscrita con tipografía `Quicksand`.
- **Efecto Hover 3D (Parallax) en Tarjetas**:
  - Programado un detector de movimiento del mouse en `catalogo.js` que calcula el ángulo de inclinación relativo.
  - Las tarjetas rotan y se elevan suavemente en 3D siguiendo el cursor del mouse, y regresan a su inclinación y rotación scrapbook original al retirar el cursor.
- **Confeti de Doodles del Cursor**:
  - Creada una micro-animación donde brotan 10 destellos y corazones en colores de marca en la punta del mouse al hacer clic en tarjetas, WhatsApp o botones de la sorpresa.
- **Transición "Page Flip" (Hojeado) en Categorías**:
  - Vinculada una animación CSS en `#catalog-slider` que aplica transformaciones tridimensionales (`rotateY`, `skewY` y traslación) al cambiar de categoría o buscar texto, emulando físicamente el paso de una página de cuaderno.

### Fase 11 — Estética Detallada de Scrapbook y Micro-interacciones (Completado)
- **Efecto de Pegado en Washi Tapes (Peeling)**:
  - Añadida una animación CSS `tapePeel` en la carga del washi tape (`.card-washi`) de arriba a abajo, dando la sensación de pegado manual y frescura táctil cada vez que se filtran o cargan tarjetas.
- **Efecto de Trazado de Doodles**:
  - Diseñada la animación `doodleDraw` que revela progresivamente los doodles de esquina (`.card-doodle`) expandiendo su `clip-path` desde el centro. Evita interferencias en las rotaciones nativas de las tarjetas.
- **Mascotas e Hilos FAQ Dinámicos (Micro-interacciones)**:
  - Habilitados los eventos de mouse en pegatinas laterales (`pointer-events: auto`). Al pasar el cursor, Mugsy, Flik o la Bolsa se asoman 18px más allá de su margen para saludar.
  - Al colocar el puntero sobre los post-its de FAQ, la nota oscila levemente según su inclinación y el alfiler rojo troquelado (`.faq-pin`) se mece de izquierda a derecha.

### Fase 12 — Lista de Caprichos / Cotización Múltiple (Completado)
- **Botón Flotante de la Lista (Hanging Tag)**:
  - Agregado el botón flotante `#floating-wishlist` sobre el botón de WhatsApp (alineado a `bottom: 95px`). Diseñado como etiqueta colgante scrapbook (lila, con hilo y rotación).
  - Incluye un contador dinámico que calcula la suma de cantidades y una animación de brinco (`wishlistBounce`) al añadir elementos.
- **Overlay del Muro de Wishlist (Libreta de Lista)**:
  - Creado el overlay `#wishlist-overlay` con desenfoque de fondo y estilo libreta escolar (lomo morado oscuro a la izquierda).
  - Renders dinámicos cargados desde `localStorage` para garantizar la persistencia del carrito del cliente.
- **Botones de Cantidades y Eliminar**:
  - Incorporados controles de `+` y `-` por cada item del carrito y botón de papelera para remover.
- **Integración con WhatsApp Consolidado**:
  - Programado el formateador dinámico de texto que convierte la lista en un único mensaje de WhatsApp estructurado con viñetas y cantidades.
- **Acciones del Modal de Detalles**:
  - Modificado `#pm-price-row` para acomodar el botón lila de *"Pedir Directo"* y el nuevo botón Mantequilla *"Añadir a mi lista ✨"* en formato responsivo.

---

## 🎨 Guía de Identidad de Marca — Bicho Capricho
Esta sección sirve como referencia permanente de las directrices y reglas del Brand Kit de Bicho Capricho aplicadas en este proyecto:

### 1. Paleta de Colores Oficiales
* **Bosque (Verde oscuro):** `#1c4f32` (El ancla oscura. Protagoniza el 60% de las superficies).
* **Crema (Fondo suave):** `#f8f4ec` (Usado para dar aire y respiro visual).
* **Mantequilla (Amarillo):** `#ffd166`
* **Lavanda (Lila claro):** `#dfbfff`
* **Uva (Morado):** `#9669c4`
* **Rosa chicle (Rosa):** `#ffb4c8`
* **Lima (Verde claro):** `#c3ec9f`
* **Oliva (Verde oliva):** `#678d47`

### 2. Tipografías Oficiales
* **Fredoka One (Fredoka):** Usada exclusivamente en títulos, encabezados y elementos destacados de UI.
* **Nunito:** Tipografía principal para el cuerpo de texto.
* **Quicksand:** Utilizada para textos secundarios, precios, botones y elementos de interfaz.
* **Caveat:** Tipografía manuscrita para acentos secundarios y notas decorativas.

### 3. Voz y Tono de Marca
* **Tono:** Boutique, cálido-mexicano, juguetón y detallista. Habla como una amiga creativa.
* **Palabras Permitidas (SÍ):** *capricho, especial, único, sorpresa, con amor, memorable.*
* **Palabras Prohibidas (NO):** *barato, descuento, promo, normal, genérico.* (Cero textos de tipo puramente transaccional o de bajo costo).

### 4. Directivas de Diseño Visual
* **Efectos Liquid Glass:** Los componentes con filtros esmerilados (`backdrop-filter: blur()`) solo se permiten colocar sobre fondos coloridos (como Bosque o Lavanda). Nunca aplicarlos sobre fondos neutros o blancos para no comprometer el contraste y legibilidad.
* **Regla de Badges en Admin**: El sistema de administración (`admin.html`) y las interacciones del agente siempre deben requerir o preguntar el badge oficial del producto antes de proceder con el guardado.

---

## Estado actual
El diseño base y la lógica dinámica están 100% completados con la integración completa del kit de marca y la estética scrapbook interactiva.

## Próximos pasos
1. **WhatsApp** — pendiente hasta que el cliente envíe el número real. Reemplazar `521234567890` en `index.html` y `catalogo.js`.
2. **Redes sociales** — pendientes enlaces de Instagram y Facebook en el footer.
3. **Contraseña del panel admin** — la contraseña por defecto es `bicho2026`; cambiar en `admin.html` antes de publicar a producción.
4. **Agregar URL del sitio en los tags OG** — cuando se tenga el dominio, configurar el tag de `og:url` en `index.html`.

## Criterio de conservación
Los recursos originales de Bicho Capricho no se modifican. Los archivos necesarios se copian a la carpeta `assets` del catálogo y se renombran de forma descriptiva para facilitar su mantenimiento.


---

## AUDITORIA DE BUGS (Julio 2026)

### CRITICOS
| # | Bug | Archivo | Estado |
|---|-----|---------|--------|
| 1 | Selector CSS duplicado .slider-btn | styles.css | ✅ Verificado — no hay duplicación real. |
| 2 | Botones de slider ocultos inconsistentemente | catalogo.js -> renderCatalog() | ✅ Verificado — lógica correcta y consistente. |
| 3 | Ruta de badges potencialmente rota | catalogo.js -> createCardHTML() | ✅ CORREGIDO — array validBadges y badgeFileMap implementados. |
| 4 | Badge favorito sin estilos CSS | styles.css | ✅ CORREGIDO — mapeado a badge-oferta.webp vía badgeFileMap en catalogo.js. |
| 5 | mix-blend-mode: multiply en mini-faces genera gris oscuro | styles.css -> .mini-faces img | ✅ CORREGIDO — eliminado mix-blend-mode: multiply de .mini-faces img. Imágenes ya tienen transparencia. |
| 6 | Inconsistencia de z-index entre overlays | styles.css | ✅ Verificado — jerarquía correcta: WA(10) < Wishlist(99) < Modal(100/200). |
| 7 | Productos duplicados al editar | catalogo.js -> loadProducts() | ✅ CORREGIDO — filtrado por nombre (case-insensitive) antes de concatenar defaults. |
| 8 | Sin manejo de QuotaExceededError | catalogo.js + admin.html | ✅ CORREGIDO — try/catch en saveWishlist(), saveProducts(), saveWA(), importJSON(). |

### IMPORTANTES
| # | Problema | Archivo | Estado |
|---|----------|---------|--------|
| 9 | Fotos de productos no actualizan (mix-blend-mode en img principal) | catalogo.js -> createCardHTML() | ✅ CORREGIDO — eliminado mix-blend-mode: multiply del <img> de producto. |
| 10 | Mini-faces con bordes raros (recorte overflow:hidden) | styles.css -> .mini-faces | ✅ CORREGIDO — img 40px dentro de i 44px, sin overflow:hidden. |
| 11 | Animaciones bloqueantes (clip-path fuerza repaint) | styles.css -> @keyframes doodleDraw | ✅ CORREGIDO — clip-path → transform/opacity. +will-change en 15 elementos. |
| 12 | Hero text no responsive (line-height y font-size en tablet/móvil) | styles.css -> .hero h1 | ✅ CORREGIDO — clamp ajustado, line-height suelto, reglas por breakpoint. |
| 13 | CSS monolitico no minificado | styles.css (~6000+ lineas) | PENDIENTE — Requiere proceso de build (esbuild/vite). Se documenta para cuando se configure CI/CD. |
| 14 | Carga sincrona de Google Fonts sin display=swap | index.html | ✅ CORREGIDO — Link cargado con media=print + onload para no bloquear render. Fallback noscript incluido. |
| 15 | Sin loading=lazy en imagenes | index.html (mascotas, productos) | ✅ CORREGIDO — loading=lazy aplicado a todas las imágenes no críticas. Imágenes hero con loading=eager. Imágenes de tarjetas dinámicas en catalogo.js también actualizadas. |
| 16 | allProducts.indexOf(p) puede devolver indice incorrecto | catalogo.js -> renderCatalog() | ✅ CORREGIDO — Reemplazado indexOf por findIndex con comparación por name+category. Fallback a offset de página si no encuentra. |
| 17 | Acordeon de guia de medidas sin ARIA | catalogo.js -> openProductModal() | ✅ CORREGIDO — Agregados aria-expanded, aria-controls, role=region, aria-labelledby y atributo hidden sincronizados con el estado open/close. |
| 18 | Imagenes sin atributos width y height | index.html y catalogo.js | ✅ CORREGIDO — width y height añadidos a todas las imágenes estáticas. Imágenes dinámicas de tarjetas con alt=p.name. |
| 19 | Sin Service Worker / PWA | Todo el proyecto | PENDIENTE — Requiere hosting HTTPS. Pendiente para cuando se publique el sitio. |
| 20 | Exposicion de autenticacion en sessionStorage | admin.html | ✅ CORREGIDO — Reemplazado token '1' por hash SHA-256 (SubtleCrypto) derivado de password + salt por sesión. Requiere doble match stored/ref para validar. |

### MENORES
| # | Problema | Archivo | Detalle |
|---|----------|---------|---------|
| 17 | Tooltip de sorpresa sin delay | styles.css -> .surprise-tooltip | Aparece inmediatamente al hover. Un delay de 500ms mejora la UX. |
| 18 | `<br>` forzado en heading responsive | index.html | ✅ CORREGIDO — `<br>` eliminado, el texto fluye naturalmente en móvil. |
| 19 | Sin prefers-reduced-motion | styles.css + catalogo.js | ✅ CORREGIDO — Media query completa con 10 reglas específicas por componente. JS omite confeti y parallax 3D en tiempo real con matchMedia. |
| 20 | Uso excesivo de !important en CSS | styles.css | PENDIENTE |
| 21 | onclick inline en botones de tabla | admin.html -> renderTable() | PENDIENTE |
| 22 | Sin debounce en busqueda | catalogo.js -> #search-input | ✅ CORREGIDO — Debounce de 300ms implementado con clearTimeout/setTimeout. |
| 23 | Toast sin stack (cola) | admin.html -> showToast() | Si se llama multiples veces rapidamente, los toasts se superponen. Impedir nuevo toast hasta que el anterior desaparezca. |

---

## FUNCIONES SELECCIONADAS PARA IMPLEMENTAR

### A. Cross-Sell en Modal
✅ COMPLETADO (Fase 14) — 2-3 productos relacionados de la misma categoría al fondo del modal de producto.

### B. Comparador de Productos
✅ COMPLETADO (Fase 14) — Botón 📊 en cada tarjeta (hover), barra fija abajo, panel comparativo lado a lado con swatches, precio y descripción. Máximo 3 productos.

### D. Sugerencias Inteligentes de Búsqueda
✅ COMPLETADO (Fase 14) — Dropdown con thumbnail, nombre, categoría y precio al escribir 2+ letras. Clic abre el modal directo.

### I. Storytelling en Producto
❌ DESCARTADO — El usuario decidió no implementarlo.

### K. Filtros Avanzados
✅ COMPLETADO (Fase 14) — Opción A: Campos de precio numérico (precio mínimo y precio máximo opcional) en el formulario de edición del panel de Admin. Slider de rango de precios interactivo (doble manilla) y filtro por envío gratis en el catálogo que recalcula el grid y dots de paginación automáticamente al filtrar los datos de origen.

---

## ANIMACIONES SELECCIONADAS PARA IMPLEMENTAR

### A. Animacion de Desempaquetado (Unboxing)
✅ COMPLETADO (Fase 14) — Al añadir a la lista de deseos, una caja de regalo (🎁) aparece en el botón y se abre (📦) liberando una miniatura del producto que vuela en espiral directamente hacia el botón flotante de la lista de deseos en la esquina, provocando un rebote elástico e inyección de confeti.

### B. Efecto de Escritura (Typewriter)
✅ COMPLETADO (Fase 14) — Eslogan dinámico en el Hero que escribe y borra las palabras clave ("regalo", "capricho", "detalle", "sorpresa", "momento"). Optimizado con contenedor de ancho fijo (`width: 9ch`) y salto de línea para evitar vibración o desacomodo del layout (layout shift) del texto estático.

### C. Parallax en Scroll
✅ COMPLETADO (Fase 14) — Las secciones `.custom-section`, `.benefits` y `.faq-section` se trasladan verticalmente a velocidades sutiles y distintas para dar sensación de profundidad física.

### D. Animacion de 'Carga Magica'
✅ COMPLETADO (Fase 14) — Pantalla de bienvenida (Loader) a pantalla completa con fondo verde Bosque, wiggling de Crafty saludando, estrellas y confeti orbitando, y una barra de carga fluida. Se desvanece y escala suavemente al cargar el sitio.

### E. Efecto de 'Sello' al Confirmar Pedido
✅ COMPLETADO (Fase 14) — El sello de "¡Capricho Añadido!" se estampa en el centro del viewport con rotación rápida y escala amortiguada al agregar un producto.

### F. Animacion de Cierre de Modal
✅ COMPLETADO (Fase 14) — El modal se encoge con un efecto elástico y las anillas se abren al cerrarlo.

### G. Fondo de Particulas
✅ COMPLETADO (Fase 14) — Partículas mágicas (♥, ★, ✦, ✿) de marca flotando y rotando suavemente en el Canvas del Hero.

### H. Animacion de 'Pegado' en Washi Tapes
✅ COMPLETADO (Fase 14) — Las cintas washi de colores se pegan con deformación y estiramiento vertical (`scaleY`) al renderizar las tarjetas.

### J. Animacion de 'Nueva Categoria'
✅ COMPLETADO (Fase 14) — Transición de hojeado de página de cuaderno (Page Flip) al alternar categorías de producto o buscar.


---

## ✅ MEJORAS DE MARCA ADICIONALES (Fase 14.3 - Julio 2026)

### 1. 📏 Guías de Medidas Dinámicas (Presets)
- **Admin (`admin.html`)**: Selector de presets de guías (*Playera Unisex, Sudadera con Gorro, Capacidad de Vasos/Tazas, Ninguna*) en el formulario. Autoselecciona automáticamente "Playera" al elegir categoría textil para mitigar errores del administrador.
- **Catálogo (`catalogo.js` y `index.html`)**: Renderizado dinámico de tablas de medidas de alta definición y accesibilidad ARIA en el modal de producto. Soporta fallback automático a "Playera" para productos textiles heredados sin preset asignado.

### 2. 🎨 Washi Tapes Coordinadas por Color
- **Catálogo (`catalogo.js`)**: Las cintas washi adhesivas que fijan cada tarjeta en el grid se asignan de acuerdo al color representativo que el administrador elija para el producto en el Admin (rosa, lila, amarillo, lima, uva, cielo).
- **CSS (`styles.css`)**: Integrados estilos específicos con opacidades sutiles de marca para washi tapes `.sky` (azul cielo) y `.grape` (morado uva).

### 3. 📂 Pestañas de Categoría en Panel de Administración
- **Admin (`admin.html`)**: Barra de navegación de pestañas (`Todo`, `Vasos`, `Textil`, `Detalles`, `Personalizados`) que filtra en tiempo real la tabla de edición. Mapea y conserva dinámicamente los índices reales en `localStorage` al editar o eliminar productos en la vista filtrada.

### 4. 🖼️ Swatches de Color Interactivos en Tarjetas
- **Catálogo (`catalogo.js`)**: Los círculos de color (swatches) de cada tarjeta se volvieron interactivos. Al pasar el cursor o hacer clic, la foto principal del producto cambia para mostrar la variante de ese color. 
- **Lógica**: Asigna de forma automática la foto principal al primer color y las fotos de la galería en orden secuencial a los siguientes. Bloquea la propagación de eventos (`event.stopPropagation()`) para que el cambio de color no abra el modal del producto accidentalmente.
- **CSS (`styles.css`)**: Agregado el estilo `.swatch-dot.active` para escalar y enmarcar la variante activa.


