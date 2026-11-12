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

module.exports = {
  verifyUser,
  getGoogleConnection,
  upsertGoogleConnection,
  patchGoogleConnection
};
