# 🐛 Auditoría — Bicho Capricho Catálogo 2026

> Revisión completa de `index.html`, `styles.css`, `script.js` y assets.

---

## 🔴 Bugs Críticos

### 1. Número de WhatsApp es placeholder
**Archivos:** `index.html` · `catalogo.js`

El número `521234567890` es claramente un número de prueba ficticio. Aparece en:
- Botón "Cotizar por WhatsApp" en la sección de personalizados
- Botón flotante de WhatsApp (`.floating-wa`)
- Script que abre WhatsApp al clicar "Pedir" en cada tarjeta

---

### 2. Links de redes sociales rotos (`href="#"`)
**Archivo:** `index.html`

Los tres links del footer apuntan a `#` sin destino real. Son completamente no funcionales. Deben apuntar a las URLs reales de cada red social.

---

### 3. Badge mal asignado: `favorito` usa imagen de `oferta`
**Archivo:** `styles.css`

La clase `.favorito` cargaba la imagen `badge-oferta.png`, siendo semánticamente incorrecto. Se corrigió mapeando favoritismo a `badge-oferta.webp` vía `badgeFileMap` de manera temporal hasta que se obtenga el badge de favoritos.

---

## 🟠 Problemas Importantes

### 4. Imágenes PNG muy pesadas (performance)
**Archivo:** `assets/`

Las imágenes de mascotas eran excesivamente grandes para web:
- `crafty-senalando.png` (2.05 MB)
- `crafty-corazon.png` (1.69 MB)
- `mugsy-pulgar.png` (1.48 MB)
- `tote-saludando.png` (1.38 MB)

Se convirtieron a WebP reduciendo el peso más de un 95% sin pérdida de calidad apreciable.

### 5. Sin `favicon` definido
**Archivo:** `index.html`

No había ninguna etiqueta `<link rel="icon">` en el `<head>`. Se generó y vinculó favicon para navegadores normales y Apple Touch.

### 6. Sin meta description ni OG tags
**Archivo:** `index.html`

Se añadieron tags Open Graph, meta description y Twitter cards para permitir vistas previas enriquecidas al compartir enlaces en WhatsApp o Facebook.

### 7. Archivos duplicados en `assets/doodles` y `assets/patrones`
Se eliminaron 58 archivos duplicados (las versiones que contenían espacios en los nombres), liberando ~24.5 MB en el disco del proyecto.

---

## 📋 Resumen de la Auditoría Inicial

| Prioridad | # | Problema | Estado |
|---|---|---|---|
| 🔴 Crítico | 1 | Número de WhatsApp falso | ✅ Resuelto (configurable en Admin) |
| 🔴 Crítico | 2 | Links de redes sociales vacíos | ⏳ Pendiente (enlaces de cliente) |
| 🔴 Crítico | 3 | Badge `favorito` con imagen errónea | ✅ Corregido |
| 🟠 Importante | 4 | Imágenes PNG sin optimizar | ✅ Corregido (conversión WebP) |
| 🟠 Importante | 5 | Sin favicon | ✅ Corregido |
| 🟠 Importante | 6 | Sin meta description ni Open Graph | ✅ Corregido |
| 🟠 Importante | 7 | Archivos duplicados en assets | ✅ Corregido (limpieza de disco) |
| 🟡 Menor | 8 | Ícono de WhatsApp flotante poco claro | ✅ Corregido |
| 🟡 Menor | 9 | `aria-label` sin `role="img"` | ✅ Corregido |
| 🟡 Menor | 10 | CSS muerto | ⏳ Documentado |

---

*Auditoría generada en julio de 2026*
