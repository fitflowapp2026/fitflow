const { redirect, verifyState, getSiteOrigin } = require('./_lib/utils');
const { getGoogleConnection, upsertGoogleConnection } = require('./_lib/supabase');
const { exchangeCodeForTokens, encryptRefreshToken, decryptRefreshToken, refreshGoogleAccessToken, ensureCalendar } = require('./_lib/google-calendar');

function appendStatus(returnTo, flag, reason = '') {
  const url = new URL(returnTo);
  url.searchParams.set('google', flag);
  if (reason) url.searchParams.set('reason', reason);
  return url.toString();
}

exports.handler = async function handler(event) {
  const query = event.queryStringParameters || {};
  const fallback = getSiteOrigin(event);
  if (query.error) {
    return redirect(appendStatus(fallback, 'error', query.error));
  }
  try {
    const state = verifyState(query.state || '');
    const returnTo = state.returnTo || fallback;
    if (!query.code) return redirect(appendStatus(returnTo, 'error', 'missing_code'));

    const existing = await getGoogleConnection(state.uid);
    const tokenData = await exchangeCodeForTokens(query.code);
    const refreshToken = tokenData.refresh_token || decryptRefreshToken(existing);
    if (!refreshToken) return redirect(appendStatus(returnTo, 'error', 'missing_refresh_token'));

    const accessToken = tokenData.access_token || await refreshGoogleAccessToken(refreshToken);
    const calendar = await ensureCalendar(accessToken, existing, state.uid);
    const encrypted = encryptRefreshToken(refreshToken);

    await upsertGoogleConnection({
      user_id: state.uid,
      is_connected: true,
      calendar_id: calendar.id,
      calendar_name: calendar.summary || 'FitFlow Clienti',
      scope: tokenData.scope || existing?.scope || null,
      connected_at: new Date().toISOString(),
      ...encrypted
    });

    return redirect(appendStatus(returnTo, 'connected'));
  } catch (error) {
    console.error(error);
    return redirect(appendStatus(fallback, 'error', 'callback_failed'));
  }
};
