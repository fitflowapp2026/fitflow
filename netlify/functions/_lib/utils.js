const crypto = require('crypto');

function json(statusCode, data) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    },
    body: JSON.stringify(data)
  };
}

function redirect(location) {
  return {
    statusCode: 302,
    headers: {
      Location: location,
      'Cache-Control': 'no-store'
    },
    body: ''
  };
}

function getEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env ${name}`);
  return value;
}

function getSiteOrigin(event) {
  const proto = event.headers['x-forwarded-proto'] || 'https';
  const host = event.headers['x-forwarded-host'] || event.headers.host;
  return `${proto}://${host}`;
}

function getBearerToken(event) {
  const header = event.headers.authorization || event.headers.Authorization || '';
  if (!header.startsWith('Bearer ')) return '';
  return header.slice('Bearer '.length).trim();
}

function parseJsonBody(event) {
  if (!event.body) return {};
  try {
    return JSON.parse(event.body);
  } catch (error) {
    return {};
  }
}

function encodeBase64Url(input) {
  return Buffer.from(input).toString('base64url');
}

function decodeBase64Url(input) {
  return Buffer.from(input, 'base64url').toString('utf8');
}

function signState(payload) {
  const secret = getEnv('GOOGLE_OAUTH_STATE_SECRET');
  const encoded = encodeBase64Url(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', secret).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
}

function verifyState(token) {
  const secret = getEnv('GOOGLE_OAUTH_STATE_SECRET');
  const [encoded, sig] = String(token || '').split('.');
  if (!encoded || !sig) throw new Error('Invalid OAuth state');
  const expected = crypto.createHmac('sha256', secret).update(encoded).digest('base64url');
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) throw new Error('OAuth state mismatch');
  const payload = JSON.parse(decodeBase64Url(encoded));
  if (!payload?.uid || !payload?.ts) throw new Error('OAuth state payload missing');
  if (Date.now() - Number(payload.ts) > 15 * 60 * 1000) throw new Error('OAuth state expired');
  return payload;
}

function normalizeReturnTo(returnTo, event) {
  const origin = getSiteOrigin(event);
  try {
    const parsed = new URL(returnTo || origin);
    if (parsed.origin !== origin) return origin;
    return `${parsed.origin}${parsed.pathname}`;
  } catch (error) {
    return origin;
  }
}

module.exports = {
  json,
  redirect,
  getEnv,
  getSiteOrigin,
  getBearerToken,
  parseJsonBody,
  signState,
  verifyState,
  normalizeReturnTo
};
