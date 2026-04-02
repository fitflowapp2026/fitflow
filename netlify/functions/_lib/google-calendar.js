const crypto = require('crypto');
const { getEnv, signState } = require('./utils');
const { upsertGoogleConnection } = require('./supabase');

const GOOGLE_SCOPE = [
  'https://www.googleapis.com/auth/calendar.app.created',
  'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
  'https://www.googleapis.com/auth/calendar.events.freebusy'
].join(' ');
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3';

function getRedirectUri() {
  return getEnv('GOOGLE_REDIRECT_URI');
}

function getTimeZone() {
  return process.env.FITFLOW_TIME_ZONE || 'Europe/Rome';
}

function buildAuthUrl({ uid, returnTo }) {
  const params = new URLSearchParams({
    client_id: getEnv('GOOGLE_CLIENT_ID'),
    redirect_uri: getRedirectUri(),
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'true',
    scope: GOOGLE_SCOPE,
    state: signState({ uid, returnTo, ts: Date.now(), nonce: crypto.randomBytes(10).toString('hex') })
  });
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

async function exchangeCodeForTokens(code) {
  const body = new URLSearchParams({
    code,
    client_id: getEnv('GOOGLE_CLIENT_ID'),
    client_secret: getEnv('GOOGLE_CLIENT_SECRET'),
    redirect_uri: getRedirectUri(),
    grant_type: 'authorization_code'
  });
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || data.error || 'Google token exchange failed');
  return data;
}

async function refreshGoogleAccessToken(refreshToken) {
  const body = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: getEnv('GOOGLE_CLIENT_ID'),
    client_secret: getEnv('GOOGLE_CLIENT_SECRET'),
    grant_type: 'refresh_token'
  });
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || data.error || 'Google refresh token failed');
  return data.access_token;
}

function encryptRefreshToken(refreshToken) {
  const key = crypto.createHash('sha256').update(getEnv('GOOGLE_TOKEN_ENCRYPTION_KEY')).digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(refreshToken, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    refresh_token_enc: enc.toString('base64'),
    refresh_token_iv: iv.toString('base64'),
    refresh_token_tag: tag.toString('base64')
  };
}

function decryptRefreshToken(record) {
  if (!record?.refresh_token_enc || !record?.refresh_token_iv || !record?.refresh_token_tag) return '';
  const key = crypto.createHash('sha256').update(getEnv('GOOGLE_TOKEN_ENCRYPTION_KEY')).digest();
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(record.refresh_token_iv, 'base64'));
  decipher.setAuthTag(Buffer.from(record.refresh_token_tag, 'base64'));
  const dec = Buffer.concat([
    decipher.update(Buffer.from(record.refresh_token_enc, 'base64')),
    decipher.final()
  ]);
  return dec.toString('utf8');
}

async function googleApi(accessToken, path, { method = 'GET', body = null, headers = {} } = {}) {
  const response = await fetch(`${GOOGLE_CALENDAR_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (response.status === 204) return null;
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const message = data?.error?.message || data?.error_description || `Google Calendar error ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = data;
    throw error;
  }
  return data;
}

async function getCalendar(accessToken, calendarId) {
  return googleApi(accessToken, `/calendars/${encodeURIComponent(calendarId)}`);
}

async function createSecondaryCalendar(accessToken, calendarName = 'FitFlow Clienti') {
  return googleApi(accessToken, '/calendars', {
    method: 'POST',
    body: {
      summary: calendarName,
      timeZone: getTimeZone()
    }
  });
}

async function ensureCalendar(accessToken, connection, userId) {
  if (connection?.calendar_id) {
    try {
      await getCalendar(accessToken, connection.calendar_id);
      return { id: connection.calendar_id, summary: connection.calendar_name || 'FitFlow Clienti' };
    } catch (error) {
      if (error.status !== 404) throw error;
    }
  }
  const created = await createSecondaryCalendar(accessToken, connection?.calendar_name || 'FitFlow Clienti');
  await upsertGoogleConnection({
    user_id: userId,
    calendar_id: created.id,
    calendar_name: created.summary || 'FitFlow Clienti',
    is_connected: true,
    connected_at: new Date().toISOString()
  });
  return { id: created.id, summary: created.summary || 'FitFlow Clienti' };
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

function addMinutesLocal(dateStr, timeStr, minutesToAdd) {
  const [year, month, day] = String(dateStr).split('-').map(Number);
  const [hours, minutes] = String(timeStr || '00:00').split(':').map(Number);
  const base = new Date(
    Number.isFinite(year) ? year : 1970,
    Number.isFinite(month) ? month - 1 : 0,
    Number.isFinite(day) ? day : 1,
    Number.isFinite(hours) ? hours : 0,
    Number.isFinite(minutes) ? minutes : 0,
    0,
    0
  );
  const end = new Date(base.getTime() + minutesToAdd * 60000);
  return {
    date: `${end.getFullYear()}-${pad2(end.getMonth() + 1)}-${pad2(end.getDate())}`,
    time: `${pad2(end.getHours())}:${pad2(end.getMinutes())}:00`
  };
}

function buildEventBody(lesson) {
  const timeZone = lesson.calendarTimeZone || getTimeZone();
  const duration = Number(lesson.duration || 60);
  const startTime = `${String(lesson.time || '00:00').slice(0,5)}:00`;
  const endLocal = addMinutesLocal(lesson.date, lesson.time || '00:00', duration);
  const serviceMap = { free_session: 'FREE SESSION', pack99: 'PACK 99', personal: 'PERSONAL' };
  const serviceLabel = serviceMap[String(lesson.serviceType || lesson.clientServiceType || 'personal')] || 'PERSONAL';
  const summaryBase = `${lesson.clientName || 'Cliente'} · ${serviceLabel}`;
  // Una lezione svolta non deve cambiare titolo sul calendario esterno.
  // Manteniamo lo stesso evento e aggiorniamo solo i metadati interni/descrizione.
  const summary = lesson.status === 'cancelled'
    ? `ANNULLATA • ${summaryBase}`
    : summaryBase;
  const descriptionLines = [
    'Creato da FitFlow',
    lesson.packageName ? `Pacchetto: ${lesson.packageName}` : '',
    lesson.note ? `Nota: ${lesson.note}` : '',
    lesson.clientNotes ? `Cliente: ${lesson.clientNotes}` : '',
    `Stato: ${lesson.status || 'scheduled'}`,
    `FitFlow lessonId: ${lesson.id}`
  ].filter(Boolean);
  return {
    summary,
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 60 },
        { method: 'popup', minutes: 15 }
      ]
    },
    description: descriptionLines.join('\n'),
    ...(lesson.sendCalendarInvite && lesson.clientEmail ? {
      attendees: [{ email: String(lesson.clientEmail).trim() }]
    } : {}),
    start: {
      dateTime: `${lesson.date}T${startTime}`,
      timeZone
    },
    end: {
      dateTime: `${endLocal.date}T${endLocal.time}`,
      timeZone
    },
    extendedProperties: {
      private: {
        fitflowLessonId: String(lesson.id || ''),
        fitflowClientId: String(lesson.clientId || ''),
        fitflowPlanId: String(lesson.planId || ''),
        fitflowStatus: String(lesson.status || 'scheduled')
      }
    }
  };
}

async function insertEvent(accessToken, calendarId, lesson) {
  const path = `/calendars/${encodeURIComponent(calendarId)}/events${lesson.sendCalendarInvite && lesson.clientEmail ? '?sendUpdates=all' : ''}`;
  return googleApi(accessToken, path, {
    method: 'POST',
    body: buildEventBody(lesson)
  });
}

async function updateEvent(accessToken, calendarId, eventId, lesson) {
  const path = `/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}${lesson.sendCalendarInvite && lesson.clientEmail ? '?sendUpdates=all' : ''}`;
  return googleApi(accessToken, path, {
    method: 'PUT',
    body: buildEventBody(lesson)
  });
}

async function deleteEvent(accessToken, calendarId, eventId, lesson = null) {
  try {
    const path = `/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}${lesson?.sendCalendarInvite && lesson?.clientEmail ? '?sendUpdates=all' : ''}`;
    await googleApi(accessToken, path, {
      method: 'DELETE'
    });
    return true;
  } catch (error) {
    if (error.status === 404 || error.status === 410) return false;
    throw error;
  }
}


async function listCalendars(accessToken) {
  const result = await googleApi(accessToken, '/users/me/calendarList');
  return Array.isArray(result?.items) ? result.items : [];
}

async function queryFreeBusy(accessToken, timeMin, timeMax, calendarIds = []) {
  if (!Array.isArray(calendarIds) || !calendarIds.length) return {};
  const result = await googleApi(accessToken, '/freeBusy', {
    method: 'POST',
    body: {
      timeMin,
      timeMax,
      timeZone: getTimeZone(),
      items: calendarIds.map(id => ({ id }))
    }
  });
  return result?.calendars || {};
}

module.exports = {
  GOOGLE_SCOPE,
  buildAuthUrl,
  exchangeCodeForTokens,
  refreshGoogleAccessToken,
  encryptRefreshToken,
  decryptRefreshToken,
  ensureCalendar,
  insertEvent,
  updateEvent,
  deleteEvent,
  listCalendars,
  queryFreeBusy
};
