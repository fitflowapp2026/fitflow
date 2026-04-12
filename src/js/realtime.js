function updateMsgBadges(count) {
  _unreadMsgCount = count;
  const ids = ['msgBadgeBnav', 'msgBadgeMobileTopbar', 'msgBadgeDesktop'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = count > 9 ? '9+' : String(count);
    el.classList.toggle('show', count > 0);
  });
}

const _debouncedRefreshUnread = (function(){
  let t; return function(){ clearTimeout(t); t = setTimeout(refreshUnreadMessages, 200); };
})();

async function refreshUnreadMessages() {
  if (!cloud.user || !cloud.client || cloud.allowLocalOnly) return;
  try {
    /* Query singola su Supabase — le RLS filtrano automaticamente per user_id */
    const cfg = loadSupabaseConfig();
    if (!cfg.url || !cfg.key) return;
    const token = getAuthToken();
    if (!token) return;
    const res = await fetch(
      `${cfg.url.replace(/\/$/, '')}/rest/v1/client_messages?sender=eq.client&read=eq.false&select=id`,
      {
        headers: {
          'apikey': cfg.key,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    if (!res.ok) return;
    const rows = await res.json();
    updateMsgBadges(Array.isArray(rows) ? rows.length : 0);
  } catch(e) {}
}

/* Polling ogni 60 secondi — fallback se Realtime non disponibile */
function initMessagePolling() {
  refreshUnreadMessages();
  setInterval(refreshUnreadMessages, 60000);
}

/* ── Supabase Realtime — notifica istantanea nuovi messaggi ── */
let _realtimeChannel = null;

/* Invia broadcast al canale del portale cliente */
function broadcastToClient(clientToken, event = 'new_message') {
  if (!cloud.client || !clientToken) return;
  try {
    cloud.client
      .channel(`portal-${clientToken}`)
      .send({ type: 'broadcast', event, payload: { ts: Date.now() } })
      .catch(() => {});
  } catch(e) {}
}

function initRealtimeMessages() {
  if (!cloud.client || !cloud.user || cloud.allowLocalOnly) return;

  /* Rimuovi canale precedente se esiste */
  if (_realtimeChannel) {
    cloud.client.removeChannel(_realtimeChannel);
    _realtimeChannel = null;
  }

  _realtimeChannel = cloud.client
    .channel('client-messages-' + cloud.user.id)
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'client_messages', filter: `user_id=eq.${cloud.user.id}` },
      (payload) => {
        if (payload.new?.sender === 'client') {
          refreshUnreadMessages();
          if (_activeMsgClientId && payload.new?.client_id === _activeMsgClientId) {
            const client = getClient(_activeMsgClientId);
            if (client) openMsgChat(client);
          }
          haptic([10, 50, 10]);
        }
      }
    )
    .on('postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'client_messages', filter: `user_id=eq.${cloud.user.id}` },
      (payload) => {
        /* Aggiorna spunte in tempo reale quando il cliente legge */
        if (_activeMsgClientId) {
          const msgEl = document.querySelector(`[data-msg-id="${payload.new?.id}"]`);
          if (msgEl && payload.new?.sender === 'trainer') {
            const tickContainer = msgEl.querySelector('svg');
            if (tickContainer) {
              const gray = 'rgba(255,255,255,0.45)';
              const blue = '#53bdeb';
              const mkPath = (d, c) => `<path d="${d}" stroke="${c}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`;
              const d1 = 'M1 4.5L4 7.5L9 2';
              const d2 = 'M5 4.5L8 7.5L13 2';
              if (payload.new.read) {
                tickContainer.innerHTML = mkPath(d1, blue) + mkPath(d2, blue);
              } else if (payload.new.delivered_at) {
                tickContainer.innerHTML = mkPath(d1, gray) + mkPath(d2, gray);
              }
            }
          }
        }
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('[DSWORLD] Realtime messaggi attivo.');
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        console.warn('[DSWORLD] Realtime non disponibile, uso polling.');
        /* Fallback al polling se realtime fallisce */
        initMessagePolling();
      }
    });
}

function getPortalEdgeUrl() {
  const cfg = loadSupabaseConfig();
  return cfg.url ? cfg.url.replace(/\/$/, '') + '/functions/v1/client-portal' : '';
}

async function callPortalEdge(token, action, payload = {}) {
  const edgeUrl = getPortalEdgeUrl();
  if (!edgeUrl) return null;
  try {
    const cfg = loadSupabaseConfig();
    const res = await fetch(edgeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': cfg.key || '',
        'Authorization': 'Bearer ' + (cfg.key || '')
      },
      body: JSON.stringify({ token, action, payload })
    });
    return await res.json();
  } catch(e) { return null; }
}
