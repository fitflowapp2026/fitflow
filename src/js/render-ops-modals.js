/* ── Modal pagamento rapido ──────────────────────── */
function openPaymentQuickModal() {
  const client = getClient(state.selectedClientId);
  if (!client || client.paymentStatus === 'paid') return;
  renderPaymentQuickModal(client);
  openModal('paymentQuickModalBackdrop');
}

function renderPaymentQuickModal(client) {
  const title = document.getElementById('paymentQuickTitle');
  const sub = document.getElementById('paymentQuickSub');
  const content = document.getElementById('paymentQuickContent');
  if (!content) return;

  const isInstallments = client.paymentMode === 'installments';
  const total = Math.min(3, Math.max(1, Number(client.installmentsTotal || 2)));
  const paid = Number(client.installmentsPaid || 0);

  if (title) title.textContent = isInstallments ? 'Pagamento a rate' : 'Pagamento';
  if (sub) sub.textContent = escapeHtml(getClientFullName(client));

  if (!isInstallments) {
    // Pagamento unica soluzione
    content.innerHTML = `
      <div style="font-size:0.95rem;color:rgba(255,255,255,0.75);">Stato attuale: <strong>DA PAGARE</strong></div>
      <div class="inline-actions">
        <button class="btn btn-good" id="pqMarkPaidBtn">✓ Saldato</button>
        <button class="btn btn-ghost btn-small" data-close="paymentQuickModalBackdrop">Annulla</button>
      </div>`;
    document.getElementById('pqMarkPaidBtn')?.addEventListener('click', () => {
      client.paymentStatus = 'paid';
      pushClientPaymentSnapshot(client, 'update');
      saveState(true); renderAll();
      closeModal('paymentQuickModalBackdrop');
      showToast('Pagamento saldato.', 'ok');
    });
  } else {
    // Pagamento a rate — max 3
    const rateButtons = Array.from({ length: total }, (_, i) => i + 1).map(n => `
      <button class="btn ${n === total ? 'btn-good' : 'btn-soft'} ${paid >= n ? 'active' : ''}"
        data-pq-rate="${n}" ${paid >= n ? 'style="opacity:.45;pointer-events:none;"' : ''}>
        ${n === total ? `✓ ${n} rate — tutto saldato` : `${n} ${n === 1 ? 'rata' : 'rate'} pagate`}
      </button>`).join('');

    content.innerHTML = `
      <div style="font-size:0.95rem;color:rgba(255,255,255,0.75);">
        Rate pagate: <strong>${paid} / ${total}</strong>
      </div>
      <div style="display:grid;gap:8px;">${rateButtons}</div>
      <button class="btn btn-ghost btn-small" data-close="paymentQuickModalBackdrop">Annulla</button>`;

    content.querySelectorAll('[data-pq-rate]').forEach(btn => {
      btn.addEventListener('click', () => {
        const n = Number(btn.getAttribute('data-pq-rate'));
        client.installmentsPaid = n;
        client.paymentStatus = n >= total ? 'paid' : 'partial';
        pushClientPaymentSnapshot(client, 'update');
        saveState(true); renderAll();
        closeModal('paymentQuickModalBackdrop');
        const msg = n >= total ? 'Tutto saldato.' : `${n} ${n === 1 ? 'rata' : 'rate'} registrate.`;
        showToast(msg, 'ok');
      });
    });
  }
}

/* ── Modal completamento lezioni ─────────────────── */
function renderCompletamentoModal() {
  const el_content = document.getElementById('completamentoModalContent');
  const el_sub = document.getElementById('completamentoModalSub');
  if (!el_content) return;
  const monthDate = state.viewDate;
  const lessons = state.lessons.filter(item => sameMonth(fromISO(item.date), monthDate));
  const done = lessons.filter(l => l.status === 'done');
  const cancelled = lessons.filter(l => l.status === 'cancelled');
  const scheduled = lessons.filter(l => l.status === 'scheduled');
  if (el_sub) el_sub.textContent = `${formatMonthLabel(monthDate)} · ${done.length} svolte · ${cancelled.length} annullate`;
  if (!lessons.length) {
    el_content.innerHTML = '<div style="padding:10px 0;color:rgba(255,255,255,0.55);font-size:0.88rem;">Nessuna lezione in questo mese.</div>';
    return;
  }
  const rows = [...done, ...scheduled, ...cancelled];
  el_content.innerHTML = rows.map(lesson => {
    const client = getClient(lesson.clientId);
    const statusIcon = lesson.status === 'done' ? '✓' : lesson.status === 'cancelled' ? '✕' : '·';
    const statusCls = lesson.status === 'done' ? 'color:#1db954' : lesson.status === 'cancelled' ? 'color:#ef4444;opacity:.7' : 'color:rgba(255,255,255,.55)';
    return `<div class="ops-alert-row" style="cursor:default;">
      <div class="ops-alert-info">
        <span class="ops-alert-icon" style="${statusCls};font-weight:900;">${statusIcon}</span>
        <div>
          <div class="ops-alert-name">${escapeHtml(getClientFullName(client) || 'Cliente')}</div>
          <div class="ops-alert-text">${escapeHtml(formatDateFancy(lesson.date))} · ${escapeHtml(lesson.time)}</div>
        </div>
      </div>
    </div>`;
  }).join('');
}

/* ── Modal avvisi operativi ───────────────────────── */
function renderOperazioniModal() {
  const el_content = document.getElementById('operazioniModalContent');
  if (!el_content) return;
  const alerts = getAlerts();
  if (!alerts.length) {
    el_content.innerHTML = '<div style="padding:10px 0;color:rgba(255,255,255,0.55);font-size:0.88rem;">Nessun avviso operativo — tutto sotto controllo.</div>';
    return;
  }
  el_content.innerHTML = alerts.map(alert => {
    const client = getClient(alert.clientId);
    const typeLabel = alert.type === 'renewal' ? '🔄' : alert.type === 'payment' ? '💰' : alert.type === 'followup' ? '📞' : '⚠️';
    const tone = alert.type === 'payment' ? 'payment' : alert.type === 'renewal' ? 'renewal' : 'followup';
    return `<div class="ops-alert-row ${tone}" data-alert-row="${escapeHtml(alert.alertId)}">
      <div class="ops-alert-info">
        <span class="ops-alert-icon">${typeLabel}</span>
        <div>
          <div class="ops-alert-name">${escapeHtml(getClientFullName(client) || 'Cliente')}</div>
          <div class="ops-alert-text">${escapeHtml(alert.text || '')}</div>
        </div>
      </div>
      <div class="ops-alert-actions">
        ${client ? `<button class="btn btn-ghost btn-small" data-ops-client="${client.id}">Apri</button>` : ''}
        <button class="btn btn-ghost btn-small" data-dismiss-alert="${escapeHtml(alert.alertId)}" title="Chiudi avviso">✕</button>
      </div>
    </div>`;
  }).join('');
  el_content.querySelectorAll('[data-ops-client]').forEach(btn => {
    btn.addEventListener('click', () => {
      focusClient(btn.getAttribute('data-ops-client'));
      saveState(); renderAll();
      closeModal('operazioniModalBackdrop');
    });
  });
  el_content.querySelectorAll('[data-dismiss-alert]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-dismiss-alert');
      if (!Array.isArray(state.dismissedAlerts)) state.dismissedAlerts = [];
      if (!state.dismissedAlerts.includes(id)) state.dismissedAlerts.push(id);
      saveState(true);
      renderHero();
      renderOperazioniModal();
    });
  });
}

/* ── Modal clienti a rischio ───────────────────────── */
function renderAtRiskModal() {
  const el_content = document.getElementById('atRiskModalContent');
  if (!el_content) return;
  const unpaidClients = state.clients.filter(c => isManagedClient(c) && (c.paymentStatus || 'unpaid') !== 'paid');
  const titleEl = document.getElementById('atRiskModalTitle');
  if (titleEl) titleEl.textContent = unpaidClients.length ? `Clienti a rischio (${unpaidClients.length})` : 'Clienti a rischio';
  if (!unpaidClients.length) {
    el_content.innerHTML = '<div style="padding:10px 0;color:rgba(255,255,255,0.55);font-size:0.88rem;">Nessun incasso aperto — tutto saldato.</div>';
    return;
  }
  el_content.innerHTML = unpaidClients.map(client => {
    const statusLabel = getPaymentStatusLabel(client.paymentStatus || 'unpaid');
    const modeLabel = client.paymentMode === 'installments'
      ? ` · Rate ${client.installmentsPaid || 0}/${client.installmentsTotal || 2}`
      : '';
    const plan = getActivePlan(client.id);
    const pkg = getPackage(plan?.packageId);
    return `<div class="ops-alert-row payment">
      <div class="ops-alert-info">
        <span class="ops-alert-icon">💰</span>
        <div>
          <div class="ops-alert-name">${escapeHtml(getClientFullName(client))}</div>
          <div class="ops-alert-text">${escapeHtml(statusLabel)}${modeLabel}${pkg ? ` · ${escapeHtml(pkg.name)}` : ''}</div>
        </div>
      </div>
      <button class="btn btn-ghost btn-small" data-risk-client="${client.id}">Apri</button>
    </div>`;
  }).join('');
  el_content.querySelectorAll('[data-risk-client]').forEach(btn => {
    btn.addEventListener('click', () => {
      focusClient(btn.getAttribute('data-risk-client'));
      saveState(); renderAll();
      closeModal('atRiskModalBackdrop');
    });
  });
}

function renderOperationalBoard() {
  if (!el.opsBoard) return;
  const cards = getOperationalActionCards();
  el.opsBoard.innerHTML = cards.map(item => `
    <button class="ops-card is-${item.tone}" type="button"
      data-action="${escapeHtml(item.action || 'noop')}"
      ${item.clientId ? `data-client-id="${item.clientId}"` : ''}
      ${item.date ? `data-date="${item.date}"` : ''}>
      <div class="k">${escapeHtml(item.label)}</div>
      <div class="v">${escapeHtml(String(item.value || '—'))}</div>
      <div class="s">${escapeHtml(String(item.sub || ''))}</div>
      <span class="meta">${escapeHtml(String(item.meta || 'Apri'))}</span>
    </button>
  `).join('');
  el.opsBoard.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', () => handleOperationalAction(button));
  });
}
