# AGENT.md — Estado dinámico del proyecto

## Build / Test

Proyecto estático sin build step ni framework. No hay `npm run build` ni
`npm test` reales — `package.json` solo trae deps mínimas de dev tooling.

Verificación manual después de cambios:

```bash
python -m http.server 8080
```

Abrir `http://localhost:8080/index.html` (catálogo) y
`http://localhost:8080/admin.html` (panel admin — nunca por file://).

## Checks a correr tras cambios de código

- Ningún linter/formatter configurado en el repo — revisar visualmente.
- Si se toca `catalogo.js` o `supabase-config.js`: confirmar en consola del
  navegador que no hay errores al cargar categorías desde Supabase.
- Si se toca `admin.html`: confirmar que WebP compression y export/import JSON
  siguen funcionando.
- Nunca commitear la `service_role key` de Supabase — vive solo en
  `localStorage.bc_supa_service_key` del navegador del usuario.

## Notas de entorno

- Sin git — cambios no versionados. Ser conservador, no reescribir archivos
  completos si no hace falta.
- `admin.html` es 56 KB, `catalogo.js` 68 KB, `styles.css` 92 KB — monolíticos,
  a propósito (sin build step). No proponer split/bundler salvo que el usuario
  lo pida explícitamente (ver deuda técnica documentada en fix_plan).
