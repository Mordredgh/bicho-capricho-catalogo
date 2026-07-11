/* Bicho Capricho — Supabase client config (anon key + Auth de sesion, sin service_role en el navegador) */
const SUPA_URL    = 'https://hoqcrljgmamaumtdrtzi.supabase.co';
const SUPA_ANON   = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvcWNybGpnbWFtYXVtdGRydHppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzOTAwOTgsImV4cCI6MjA4Njk2NjA5OH0.x_gYRz29tK7InMxQaDyZL2bdD1-hCCJ1qg6tgvmRO5o';
const SUPA_BUCKET = 'bc-catalogo';
const SUPA_PUBLIC_URL = `${SUPA_URL}/storage/v1/object/public/${SUPA_BUCKET}`;
const ADMIN_EMAIL = 'ellegadodelosantiguos@gmail.com';

// Solo admin.html carga el SDK de supabase-js (login + storage autenticado).
// index.html/catalogo.js nunca lo necesita, solo hace lecturas públicas con supaGet.
const sbClient = (typeof window !== 'undefined' && window.supabase)
  ? window.supabase.createClient(SUPA_URL, SUPA_ANON)
  : null;

function _supaHeaders(key = SUPA_ANON) {
  return {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json'
  };
}

async function supaGet(table, query = '') {
  const url = `${SUPA_URL}/rest/v1/${table}${query ? '?' + query : ''}`;
  const res = await fetch(url, { headers: _supaHeaders() });
  if (!res.ok) throw new Error(`Supabase ${table} ${res.status}`);
  return res.json();
}

// Sube al bucket bc-catalogo usando la sesión de Supabase Auth del admin logueado.
// RLS en storage.objects exige auth.jwt().email = ADMIN_EMAIL — sin sesión, esto falla.
async function supaUploadAuth(filePath, fileBlob) {
  if (!sbClient) throw new Error('Cliente Supabase no disponible');
  const { error } = await sbClient.storage.from(SUPA_BUCKET).upload(filePath, fileBlob, {
    upsert: true,
    contentType: fileBlob.type || 'image/webp'
  });
  if (error) throw new Error(error.message);
  return `${SUPA_PUBLIC_URL}/${filePath}`;
}
