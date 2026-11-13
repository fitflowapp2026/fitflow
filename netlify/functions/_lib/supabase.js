const { getEnv } = require('./utils');

function getSupabaseUrl() {
  return getEnv('SUPABASE_URL').replace(/\/$/, '');
}

function getServiceRoleKey() {
  return getEnv('SUPABASE_SERVICE_ROLE_KEY');
}

async function serviceRequest(path, { method = 'GET', body = null, headers = {} } = {}) {
  const response = await fetch(`${getSupabaseUrl()}${path}`, {
    method,
    headers: {
      apikey: getServiceRoleKey(),
      Authorization: `Bearer ${getServiceRoleKey()}`,
      'Content-Type': 'application/json',
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!response.ok) {
    // Il dettaglio resta nei log del server: al browser arriva solo un errore generico
    const text = await response.text();
    console.error(`[supabase] request failed: ${method} ${path.split('?')[0]} → ${response.status} ${text.slice(0, 300)}`);
    throw new Error('Errore database');
  }
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function verifyUser(accessToken) {
  if (!accessToken) throw new Error('Missing access token');
  const response = await fetch(`${getSupabaseUrl()}/auth/v1/user`, {
    method: 'GET',
    headers: {
      apikey: getServiceRoleKey(),
      Authorization: `Bearer ${accessToken}`
    }
  });
  if (!response.ok) {
    console.error(`[supabase] auth failed: ${response.status}`);
    throw new Error('Unauthorized');
  }
  return response.json();
}

async function getGoogleConnection(userId) {
  const rows = await serviceRequest(`/rest/v1/google_calendar_connections?user_id=eq.${encodeURIComponent(userId)}&select=*`);
  return Array.isArray(rows) && rows[0] ? rows[0] : null;
}

async function upsertGoogleConnection(record) {
  const rows = await serviceRequest('/rest/v1/google_calendar_connections?on_conflict=user_id&select=*', {
    method: 'POST',
    headers: {
      Prefer: 'resolution=merge-duplicates,return=representation'
    },
    body: record
  });
  return Array.isArray(rows) && rows[0] ? rows[0] : null;
}

async function patchGoogleConnection(userId, patch) {
  const rows = await serviceRequest(`/rest/v1/google_calendar_connections?user_id=eq.${encodeURIComponent(userId)}&select=*`, {
    method: 'PATCH',
    headers: {
      Prefer: 'return=representation'
    },
    body: patch
  });
  return Array.isArray(rows) && rows[0] ? rows[0] : null;
}

// ── Eliminazione dell'account ────────────────────────────────────────
// L'id di un utente Supabase è sempre un UUID. Senza un id valido non parte
// nessuna richiesta: un'eliminazione senza il filtro sull'utente non deve
// poter esistere.
const USER_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUserId(value) {
  return typeof value === 'string' && USER_ID_RE.test(value);
}

// Elimina da una tabella SOLO le righe di quell'utente (colonna user_id).
async function deleteUserRows(table, userId) {
  if (!isUserId(userId)) throw new Error('Id utente non valido');
  if (!/^[a-z_]+$/.test(String(table))) throw new Error('Nome tabella non valido');
  await serviceRequest(`/rest/v1/${table}?user_id=eq.${encodeURIComponent(userId)}`, {
    method: 'DELETE',
    headers: { Prefer: 'return=minimal' }
  });
}

// Elimina l'utente di Supabase Auth: email, password e sessioni aperte.
async function deleteAuthUser(userId) {
  if (!isUserId(userId)) throw new Error('Id utente non valido');
  await serviceRequest(`/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
    method: 'DELETE',
    body: { should_soft_delete: false }
  });
}

module.exports = {
  verifyUser,
  getGoogleConnection,
  upsertGoogleConnection,
  patchGoogleConnection,
  isUserId,
  deleteUserRows,
  deleteAuthUser
};
