
async function loadClientMessages(client) {
  const panel = document.getElementById('clientMessagesPanel');
  if (!panel || !client.shareToken) return;

  panel.style.display = 'block';
  panel.innerHTML = `
    <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);margin-bottom:8px;">
      Messaggi dal cliente
      <span id="msgLoadingIndicator" style="color:var(--warn);margin-left:6px;">caricamento…</span>
    </div>
    <div id="trainerMsgList" style="display:grid;gap:6px;max-height:220px;overflow-y:auto;"></div>
    <div style="display:flex;gap:8px;margin-top:10px;">
      <input id="trainerReplyInput" type="text" placeholder="Rispondi al cliente…"
        autocapitalize="sentences" autocorrect="off" enterkeyhint="send"
        style="flex:1;padding:10px 14px;background:#151515;border:1px solid rgba(255,255,255,0.08);color:#fff;border-radius:14px;font:inherit;font-size:0.88rem;outline:none;" />
      <button class="btn btn-primary btn-small" onclick="sendTrainerReply('${escapeHtml(client.shareToken)}')">Invia</button>
    </div>
  `;

  /* Query diretta a Supabase — RLS filtra per user_id automaticamente */
  const cfg = loadSupabaseConfig();
  const token = getAuthToken();
  const indicator = document.getElementById('msgLoadingIndicator');
  const msgList = document.getElementById('trainerMsgList');

  try {
    const res = await fetch(
      `${cfg.url.replace(/\/$/, '')}/rest/v1/client_messages?client_token=eq.${encodeURIComponent(client.shareToken)}&order=created_at.asc&select=*`,
      {
        headers: {
          'apikey': cfg.key,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (indicator) indicator.remove();
    if (!msgList) return;

    if (!res.ok) {
      msgList.innerHTML = `<div style="font-size:0.82rem;color:var(--muted);">Errore caricamento messaggi (${res.status}).</div>`;
      return;
    }

    const messages = await res.json();

    if (!Array.isArray(messages) || !messages.length) {
      msgList.innerHTML = `<div style="font-size:0.82rem;color:var(--muted);">Nessun messaggio ancora.</div>`;
      return;
    }

    msgList.innerHTML = messages.map(m => renderMsgBubble(m, m.sender === 'trainer')).join('');
    msgList.scrollTop = msgList.scrollHeight;

    const now = new Date().toISOString();
    /* Segna messaggi del cliente come delivered + read */
    await fetch(
      `${cfg.url.replace(/\/$/, '')}/rest/v1/client_messages?client_token=eq.${encodeURIComponent(client.shareToken)}&sender=eq.client`,
      {
        method: 'PATCH',
        headers: {
          'apikey': cfg.key,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ delivered_at: now, read: true })
      }
    );
    /* Aggiorna badge dopo lettura */
    refreshUnreadMessages();

  } catch(e) {
    if (indicator) indicator.remove();
    if (msgList) msgList.innerHTML = `<div style="font-size:0.82rem;color:var(--muted);">Errore connessione.</div>`;
  }
}

async function sendTrainerReply(clientToken) {
  const input = document.getElementById('trainerReplyInput');
  const text = input?.value?.trim();
  if (!text) return;
  input.value = '';
  haptic(6);

  const cfg = loadSupabaseConfig();
  const authToken = getAuthToken();
  const client = getClient(state.selectedClientId);
  if (!client || !cloud.user) { showToast('Errore: utente non trovato.', 'error'); return; }

  try {
    const res = await fetch(
      `${cfg.url.replace(/\/$/, '')}/rest/v1/client_messages`,
      {
        method: 'POST',
        headers: {
          'apikey': cfg.key,
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          client_token: clientToken,
          user_id: cloud.user.id,
          client_id: client.id,
          sender: 'trainer',
          text,
          type: 'message',
          read: false
        })
      }
    );
    if (res.ok || res.status === 201) {
      showToast('Risposta inviata!', 'ok');
      loadClientMessages(client);
      /* Broadcast al portale cliente — notifica istantanea */
      broadcastToClient(clientToken, 'new_message');
    } else {
      showToast('Errore invio risposta.', 'error');
    }
  } catch(e) {
    showToast('Errore connessione.', 'error');
  }
}

/* ── Modal messaggi — lista clienti + chat ───────────────── */
let _activeMsgClientToken = null;
let _activeMsgClientId = null;

async function openMessagesModal(preselectedClientId = null) {
  renderMessagesClientList(preselectedClientId);
  openModal('messagesModalBackdrop');
  if (preselectedClientId) {
    const client = getClient(preselectedClientId);
    if (client?.shareToken) openMsgChat(client);
  }
}

async function renderMessagesClientList(highlightId = null) {
  const listEl = document.getElementById('messagesClientList');
  if (!listEl) return;

  const cfg = loadSupabaseConfig();
  const token = getAuthToken();

  /* Carica conteggio messaggi non letti per cliente */
  let unreadByToken = {};
  try {
    const res = await fetch(
      `${cfg.url.replace(/\/$/, '')}/rest/v1/client_messages?sender=eq.client&read=eq.false&select=client_token`,
      { headers: { 'apikey': cfg.key, 'Authorization': `Bearer ${token}` } }
    );
    if (res.ok) {
      const rows = await res.json();
      rows.forEach(r => { unreadByToken[r.client_token] = (unreadByToken[r.client_token] || 0) + 1; });
    }
  } catch(e) {}

  const clientsWithPortal = state.clients.filter(c => c.shareToken);
  if (!clientsWithPortal.length) {
    listEl.innerHTML = `<div class="muted small" style="padding:12px;">Nessun cliente ha ancora il portale attivo.</div>`;
    return;
  }

  /* Ordina: non letti prima (più non letti = primo), poi alfabetico */
  const sorted = clientsWithPortal.slice().sort((a, b) => {
    const ua = unreadByToken[a.shareToken] || 0;
    const ub = unreadByToken[b.shareToken] || 0;
    if (ub !== ua) return ub - ua;
    return getClientFullName(a).localeCompare(getClientFullName(b));
  });

  /* Mostra/nascondi bottone "Segna tutti letti" */
  const totalUnread = Object.values(unreadByToken).reduce((s, v) => s + v, 0);
  const markAllBtn = document.getElementById('markAllReadBtn');
  if (markAllBtn) markAllBtn.style.display = totalUnread > 0 ? '' : 'none';

  listEl.innerHTML = sorted.map(c => {
    const unread = unreadByToken[c.shareToken] || 0;
    const isActive = c.id === _activeMsgClientId;
    return `
      <div class="msg-client-row ${unread > 0 ? 'has-unread' : ''} ${isActive ? 'active' : ''}"
        onclick="openMsgChatById('${c.id}')">
        <div class="avatar" style="width:34px;height:34px;font-size:0.78rem;flex-shrink:0;">${escapeHtml(initials(getClientFullName(c)))}</div>
        <div style="flex:1;min-width:0;">
          <strong style="display:block;font-size:0.9rem;${unread > 0 ? '' : 'opacity:0.7'}">${escapeHtml(getClientFullName(c))}</strong>
          <div style="font-size:0.75rem;color:var(--muted);">${unread > 0 ? `${unread} non letto${unread > 1 ? 'i' : ''}` : 'Nessun non letto'}</div>
        </div>
        ${unread > 0 ? `<span style="min-width:20px;height:20px;border-radius:99px;background:var(--accent);color:#fff;font-size:0.7rem;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${unread}</span>` : ''}
      </div>`;
  }).join('');
}

function openMsgChatById(clientId) {
  const client = getClient(clientId);
  if (client) openMsgChat(client);
}

/* ── Spunte stile WhatsApp ───────────────────────────────────
   ✓  grigia  = inviato (inserito nel DB)
   ✓✓ grigie  = consegnato (destinatario ha caricato la lista)
   ✓✓ blu     = letto (destinatario ha aperto la chat)
─────────────────────────────────────────────────────────── */
function renderTicks(m) {
  /* Le spunte appaiono solo sui messaggi inviati da chi visualizza */
  const gray = 'rgba(255,255,255,0.45)';
  const blue = '#53bdeb';
  const svg = (color1, color2) =>
    `<svg width="14" height="9" viewBox="0 0 14 9" fill="none" style="flex-shrink:0;margin-left:3px;vertical-align:middle;" aria-hidden="true">
      <path d="M1 4.5L4 7.5L9 2" stroke="${color1}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      ${color2 ? `<path d="M5 4.5L8 7.5L13 2" stroke="${color2}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
    </svg>`;
  if (m.read)          return svg(blue, blue);        // ✓✓ blu
  if (m.delivered_at)  return svg(gray, gray);        // ✓✓ grigie
  return svg(gray, null);                             // ✓  grigia
}

function renderMsgBubble(m, isSender) {
  const time = new Date(m.created_at).toLocaleString('it-IT', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' });
  const typeBadge = m.type === 'cancel_request'
    ? `<span style="font-size:0.7rem;font-weight:700;padding:2px 7px;border-radius:6px;background:rgba(239,68,68,0.15);color:#ffb3b3;display:block;margin-bottom:3px;">Disdetta</span>`
    : m.type === 'reschedule_request'
    ? `<span style="font-size:0.7rem;font-weight:700;padding:2px 7px;border-radius:6px;background:rgba(245,158,11,0.15);color:var(--warn);display:block;margin-bottom:3px;">Spostamento</span>`
    : '';
  const ticks = isSender ? renderTicks(m) : '';
  return `
    <div style="display:flex;flex-direction:column;align-items:${isSender ? 'flex-end' : 'flex-start'};">
      <div data-msg-id="${m.id}" style="max-width:85%;padding:9px 13px;border-radius:${isSender ? '16px 4px 16px 16px' : '4px 16px 16px 16px'};background:${isSender ? 'rgba(229,9,20,0.16)' : 'rgba(255,255,255,0.07)'};border:1px solid ${isSender ? 'rgba(229,9,20,0.25)' : 'rgba(255,255,255,0.08)'};">
        ${typeBadge}
        <span style="font-size:0.88rem;">${escapeHtml(m.text)}</span>
        <div style="display:flex;align-items:center;justify-content:flex-end;gap:2px;margin-top:3px;">
          <span style="font-size:0.68rem;color:rgba(255,255,255,0.45);">${time}</span>
          ${ticks}
        </div>
      </div>
    </div>`;
}

async function openMsgChat(client) {
  _activeMsgClientToken = client.shareToken;
  _activeMsgClientId = client.id;

  const body = document.querySelector('.messages-modal-body');
  const chatEl = document.getElementById('messagesChat');
  const nameEl = document.getElementById('msgChatClientName');
  const chatList = document.getElementById('msgChatList');
  const sub = document.getElementById('messagesModalSub');

  /* Mobile: show-chat class nasconde sidebar e mostra chat */
  if (body) body.classList.add('show-chat');
  if (chatEl) chatEl.style.display = 'flex';
  if (nameEl) nameEl.textContent = getClientFullName(client);
  if (sub) sub.textContent = getClientFullName(client);
  if (chatList) chatList.innerHTML = `<div class="muted small" style="padding:8px 0;">Caricamento…</div>`;

  /* Aggiorna sidebar per evidenziare il cliente attivo */
  renderMessagesClientList();

  const cfg = loadSupabaseConfig();
  const token = getAuthToken();

  try {
    const res = await fetch(
      `${cfg.url.replace(/\/$/, '')}/rest/v1/client_messages?client_token=eq.${encodeURIComponent(client.shareToken)}&order=created_at.asc&select=*`,
      { headers: { 'apikey': cfg.key, 'Authorization': `Bearer ${token}` } }
    );
    const messages = res.ok ? await res.json() : [];

    if (!chatList) return;
    if (!Array.isArray(messages) || !messages.length) {
      chatList.innerHTML = `<div class="muted small">Nessun messaggio ancora.</div>`;
    } else {
      chatList.innerHTML = messages.map(m => renderMsgBubble(m, m.sender === 'trainer')).join('');
      chatList.scrollTop = chatList.scrollHeight;
    }

    const now = new Date().toISOString();
    /* Segna messaggi del cliente come delivered + read */
    await fetch(
      `${cfg.url.replace(/\/$/, '')}/rest/v1/client_messages?client_token=eq.${encodeURIComponent(client.shareToken)}&sender=eq.client`,
      { method: 'PATCH', headers: { 'apikey': cfg.key, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ delivered_at: now, read: true }) }
    );
    refreshUnreadMessages();

  } catch(e) {
    if (chatList) chatList.innerHTML = `<div class="muted small">Errore caricamento.</div>`;
  }
}

async function sendMsgChatReply() {
  const input = document.getElementById('msgChatInput');
  const text = input?.value?.trim();
  if (!text || !_activeMsgClientToken || !_activeMsgClientId) return;
  input.value = '';
  haptic(6);
  const cfg = loadSupabaseConfig();
  const token = getAuthToken();
  const client = getClient(_activeMsgClientId);
  if (!client || !cloud.user) return;
  try {
    await fetch(`${cfg.url.replace(/\/$/, '')}/rest/v1/client_messages`, {
      method: 'POST',
      headers: { 'apikey': cfg.key, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ client_token: _activeMsgClientToken, user_id: cloud.user.id, client_id: client.id, sender: 'trainer', text, type: 'message', read: false })
    });
    showToast('Risposta inviata!', 'ok');
    openMsgChat(client);
    loadClientMessages(client);
    /* Broadcast al portale cliente — notifica istantanea */
    broadcastToClient(_activeMsgClientToken, 'new_message');
  } catch(e) { showToast('Errore invio.', 'error'); }
}

function initMessagesModal() {
  /* Bottone indietro — mobile torna alla lista */
  document.getElementById('msgBackBtn')?.addEventListener('click', () => {
    const body = document.querySelector('.messages-modal-body');
    if (body) body.classList.remove('show-chat');
    document.getElementById('messagesChat').style.display = 'none';
    document.getElementById('messagesModalSub').textContent = 'Conversazioni con i clienti';
    _activeMsgClientToken = null;
    _activeMsgClientId = null;
    renderMessagesClientList();
  });

  /* Bottone Segna tutti letti */
  document.getElementById('markAllReadBtn')?.addEventListener('click', async () => {
    const cfg = loadSupabaseConfig();
    const token = getAuthToken();
    try {
      await fetch(
        `${cfg.url.replace(/\/$/, '')}/rest/v1/client_messages?sender=eq.client&read=eq.false&user_id=eq.${cloud.user.id}`,
        { method: 'PATCH', headers: { 'apikey': cfg.key, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' }, body: JSON.stringify({ read: true }) }
      );
      refreshUnreadMessages();
      renderMessagesClientList();
      showToast('Tutti i messaggi segnati come letti.', 'ok');
    } catch(e) { showToast('Errore.', 'error'); }
  });

  /* Bottone invia */
  document.getElementById('msgChatSendBtn')?.addEventListener('click', sendMsgChatReply);
  document.getElementById('msgChatInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); sendMsgChatReply(); }
  });

  /* Bottoni apertura modal */
  document.getElementById('openMessagesMobileBtn')?.addEventListener('click', () => openMessagesModal());
  document.getElementById('openMessagesBtn')?.addEventListener('click', () => openMessagesModal());

  /* Reset show-chat quando si chiude il modal */
  document.getElementById('messagesModalBackdrop')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) {
      document.querySelector('.messages-modal-body')?.classList.remove('show-chat');
      _activeMsgClientToken = null;
      _activeMsgClientId = null;
    }
  });
}
