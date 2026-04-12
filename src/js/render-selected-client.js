
function renderSelectedClient() {
  const client = getClient(state.selectedClientId);
  if (!client) {
    const emptyHtml = `
      <div class="mobile-empty-card">
        <div class="selected-name">Nessun cliente selezionato</div>
        <div class="muted small" style="margin-top:6px;">Apri un cliente dalla lista per vedere stato, prossima sessione e azioni rapide.</div>
      </div>
    `;
    el.selectedClientCard.innerHTML = `
      <div class="selected-name">Nessun cliente</div>
      <div class="muted">Apri + Cliente per iniziare.</div>
    `;
    if (el.mobileSelectedClientCard) el.mobileSelectedClientCard.innerHTML = emptyHtml;
    return;
  }
  const plan = getActivePlan(client.id);
  const pkg = getPackage(plan?.packageId);
  const stats = planStats(plan);
  const history = clientHistoryStats(client.id);
  const nextLesson = stats.nextLesson ? `${formatDateFancy(stats.nextLesson.date)} · ${stats.nextLesson.time}` : 'Nessuna lezione futura';
  const paymentLabel = getPaymentStatusLabel(client.paymentStatus || 'unpaid');
  const health = getClientHealth(client);
  const avgSessionValue = stats.total ? formatCurrency(getPlanTotalPrice(plan, pkg, client) / Math.max(stats.total, 1)) : '—';
  const scheduleLabel = client.scheduleMode === 'same' ? 'Pianificazione fissa' : 'Pianificazione variabile';
  const serviceLabel = serviceTypeLabel(getClientServiceType(client));
  const fixedTimeLabel = client.fixedTime ? `Orario base ${escapeHtml(client.fixedTime)}` : 'Programmazione flessibile';
  const progressTags = `
    <span class="tag">${stats.done}/${stats.total} svolte</span>
    <span class="tag ${stats.remaining <= 3 ? 'gold' : ''}">${stats.remaining} rimaste</span>
    <span class="tag ${client.paymentStatus === 'paid' ? 'green' : client.paymentStatus === 'partial' ? 'gold' : 'red'}${client.paymentStatus !== 'paid' ? ' stat-box-clickable' : ''}" style="${client.paymentStatus !== 'paid' ? 'cursor:pointer;' : ''}" id="paymentStatusTag" data-open-payment="1">${escapeHtml(paymentLabel)}${client.paymentStatus !== 'paid' ? ' ›' : ''}</span>
    <span class="tag">${history.cancelled} annullate</span>
  `;
  el.selectedClientCard.innerHTML = `
    <div class="selected-card-head">
      <div style="min-width:0;">
        <div class="selected-name">${escapeHtml(getClientFullName(client))}</div>
        <div class="selected-pill-row">
          <span class="tag ${client.scheduleMode === 'same' ? 'blue' : ''}">${scheduleLabel}</span>
          <span class="tag gold">${escapeHtml(serviceLabel)}</span>
        </div>
      </div>
      <div class="selected-card-actions">
        <button class="btn btn-tertiary btn-small" id="heroCopyAppointmentsBtn" title="Copia appuntamenti" style="flex-shrink:0;font-size:0.76rem;padding:8px 12px;">Copia appuntamenti</button>
      </div>
    </div>
    <div class="selected-metrics">
      <div class="metric-tile"><div class="k">Pacchetto</div><div class="v">${escapeHtml(compactPackageLabel(pkg))}</div><div class="subline">${pkg ? escapeHtml(sessionPerWeekLabel(pkg.perWeek)) : 'Nessun pacchetto attivo'}</div></div>
      <div class="metric-tile"><div class="k">Prossima sessione</div><div class="v is-small">${escapeHtml(nextLesson)}</div><div class="subline">${fixedTimeLabel}</div></div>
      <div class="metric-tile"><div class="k">Stato</div><div class="v is-accent">${escapeHtml(health)}</div><div class="subline">${escapeHtml(paymentLabel)}</div></div>
      <div class="metric-tile"><div class="k">Valore medio</div><div class="v">${escapeHtml(avgSessionValue)}</div><div class="subline">per sessione</div></div>
    </div>
    <div>
      <div class="small muted">Avanzamento percorso</div>
      <div class="progress" style="margin-top:8px;"><span style="width:${stats.progress}%"></span></div>
      <div class="pill-row" style="margin-top:10px;">
        ${progressTags}
      </div>
    </div>
    <div class="section-block timeline-block">
      <div class="timeline-head">
        <div class="timeline-title">Timeline cliente</div>
        <span class="tag compact ${stats.remaining <= 3 ? 'gold' : 'blue'}">${stats.remaining} residue</span>
      </div>
      <div class="timeline-list">
        ${getClientTimelineEntries(client).map(item => `
          <div class="timeline-item">
            <span class="timeline-dot ${item.tone}"></span>
            <div class="timeline-content">
              <strong>${escapeHtml(item.title)}</strong>
              <span>${escapeHtml(item.text)}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="inline-actions">
      <button class="btn btn-soft btn-small" id="editClientBtn">Modifica</button>
      <button class="btn btn-primary btn-small" id="renewClientBtn">Rinnova</button>
      <button class="btn btn-soft btn-small" id="sharePortalBtn" title="Apri portale cliente">🔗 Portale</button>
      <button class="btn btn-ghost btn-small" id="sharePortalLinkBtn" title="Condividi link portale">↗ Condividi</button>
    </div>
    <div id="clientMessagesPanel" style="display:none;margin-top:4px;"></div>
  `;
  if (el.mobileSelectedClientCard) {
    el.mobileSelectedClientCard.innerHTML = `
      <div class="mobile-selected-top">
        <div style="min-width:0;">
          <div class="mobile-selected-title">${escapeHtml(getClientFullName(client))}</div>
          <div class="mobile-selected-sub">${escapeHtml(serviceLabel)} · ${scheduleLabel}</div>
        </div>
        <button class="btn btn-tertiary btn-small" id="mobileCopyAppointmentsBtn" type="button">Copia</button>
      </div>
      <div class="selected-pill-row">
        <span class="tag ${client.paymentStatus === 'paid' ? 'green' : client.paymentStatus === 'partial' ? 'gold' : 'red'}${client.paymentStatus !== 'paid' ? ' stat-box-clickable' : ''}" style="${client.paymentStatus !== 'paid' ? 'cursor:pointer;' : ''}" id="mobilePaymentStatusTag" data-open-payment="1">${escapeHtml(paymentLabel)}${client.paymentStatus !== 'paid' ? ' ›' : ''}</span>
        <span class="tag ${stats.remaining <= 3 ? 'gold' : ''}">${stats.remaining} rimaste</span>
      </div>
      <div class="mobile-kpi-row">
        <div class="mobile-kpi"><div class="k">Prossima sessione</div><div class="v">${escapeHtml(nextLesson)}</div></div>
        <div class="mobile-kpi"><div class="k">Pacchetto</div><div class="v">${escapeHtml(compactPackageLabel(pkg))}</div></div>
        <div class="mobile-kpi"><div class="k">Avanzamento</div><div class="v">${stats.done}/${stats.total} svolte</div></div>
        <div class="mobile-kpi"><div class="k">Valore medio</div><div class="v">${escapeHtml(avgSessionValue)}</div></div>
      </div>
      <div class="section-block timeline-block">
        <div class="timeline-title">Timeline</div>
        <div class="timeline-list">
          ${getClientTimelineEntries(client).slice(0,3).map(item => `
            <div class="timeline-item">
              <span class="timeline-dot ${item.tone}"></span>
              <div class="timeline-content">
                <strong>${escapeHtml(item.title)}</strong>
                <span>${escapeHtml(item.text)}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="mobile-selected-progress">
        <div class="small muted">Avanzamento percorso</div>
        <div class="progress" style="margin-top:8px;"><span style="width:${stats.progress}%"></span></div>
      </div>
      <div class="mobile-selected-actions">
        <button class="btn btn-soft btn-small" id="mobileEditClientBtn" type="button">Modifica cliente</button>
        <button class="btn btn-primary btn-small" id="mobileRenewClientBtn" type="button">Rinnova pacchetto</button>
        <button class="btn btn-soft btn-small" id="mobileSharePortalBtn" type="button">🔗 Portale</button>
        <button class="btn btn-ghost btn-small" id="mobileSharePortalLinkBtn" type="button">↗ Condividi</button>
        <button class="btn btn-soft btn-small" id="mobileMsgClientBtn" type="button" style="position:relative;">
          💬 Messaggi
          <span class="msg-badge" id="msgBadgeClientCard" style="top:-6px;right:-6px;">0</span>
        </button>
      </div>
    `;
  }

  const copyAppointments = () => {
    const text = buildAppointmentsText(client.id);
    if (!text) { showToast('Nessun appuntamento da copiare.'); return; }
    if (navigator.share) {
      navigator.share({ title: `Appuntamenti ${getClientFullName(client)}`, text })
        .then(() => showToast('Appuntamenti condivisi!', 'ok'))
        .catch(err => { if (err.name !== 'AbortError') showToast('Condivisione annullata.'); });
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      showToast('Appuntamenti copiati!', 'ok');
    }).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showToast('Appuntamenti copiati!', 'ok');
    });
  };

  document.getElementById('heroCopyAppointmentsBtn').addEventListener('click', copyAppointments);
  // Tag pagamento cliccabile (desktop e mobile)
  document.getElementById('paymentStatusTag')?.addEventListener('click', openPaymentQuickModal);
  document.getElementById('mobilePaymentStatusTag')?.addEventListener('click', openPaymentQuickModal);
  document.getElementById('editClientBtn').addEventListener('click', () => renderClientModal(client));
  document.getElementById('renewClientBtn').addEventListener('click', openRenewModal);

  /* Portale cliente — apre il portale + condividi link */
  const sharePortalFn = () => {
    if (!client.shareToken) { showToast('Token non trovato, modifica e salva il cliente.', 'warn'); return; }
    const url = clientPortalUrl(client.shareToken);
    /* Apre il portale in una nuova scheda */
    window.open(url, '_blank');
    haptic(8);
  };
  const sharePortalLinkFn = () => {
    if (!client.shareToken) return;
    const url = clientPortalUrl(client.shareToken);
    if (navigator.share) {
      navigator.share({ title: `DSWORLD — Portale di ${getClientFullName(client)}`, url })
        .catch(e => { if (e.name !== 'AbortError') navigator.clipboard.writeText(url).then(() => showToast('Link copiato!', 'ok')); });
    } else {
      navigator.clipboard.writeText(url).then(() => showToast('Link copiato!', 'ok'))
        .catch(() => showToast('Link: ' + url));
    }
    haptic(8);
  };
  document.getElementById('sharePortalBtn')?.addEventListener('click', sharePortalFn);
  document.getElementById('mobileSharePortalBtn')?.addEventListener('click', sharePortalFn);
  /* Tasto destro / long press → condivide il link */
  document.getElementById('sharePortalBtn')?.addEventListener('contextmenu', e => { e.preventDefault(); sharePortalLinkFn(); });
  document.getElementById('mobileSharePortalBtn')?.addEventListener('contextmenu', e => { e.preventDefault(); sharePortalLinkFn(); });
  /* Bottoni condividi dedicati */
  document.getElementById('sharePortalLinkBtn')?.addEventListener('click', sharePortalLinkFn);
  document.getElementById('mobileSharePortalLinkBtn')?.addEventListener('click', sharePortalLinkFn);

  /* Carica messaggi del cliente */
  loadClientMessages(client);
  const nextAgendaDate = stats.nextLesson?.date || todayISO();
  const openDayForClient = () => {
    state.selectedDay = nextAgendaDate;
    state.viewDate = startOfMonth(fromISO(nextAgendaDate));
    state.calendarView = 'day';
    saveState();
    renderAll();
  };
  if (document.getElementById('mobileCopyAppointmentsBtn')) document.getElementById('mobileCopyAppointmentsBtn').addEventListener('click', copyAppointments);
  if (document.getElementById('mobileEditClientBtn')) document.getElementById('mobileEditClientBtn').addEventListener('click', () => renderClientModal(client));
  if (document.getElementById('mobileRenewClientBtn')) document.getElementById('mobileRenewClientBtn').addEventListener('click', openRenewModal);
  if (document.getElementById('mobileMsgClientBtn')) document.getElementById('mobileMsgClientBtn').addEventListener('click', () => openMessagesModal(client.id));
}

function renderAlerts() {
  const alerts = getAlerts();
  const visibleAlerts = state.heroAlertsExpanded ? alerts.slice(0, 6) : alerts.slice(0, 3);
  if (!alerts.length) {
    el.alertStrip.innerHTML = '<div class="alert-strip-head"><span>Avvisi operativi</span></div><div class="alert-stack"><div class="alert-chip"><strong>Nessun avviso operativo</strong><span>Tutto sotto controllo.</span></div></div>';
    return;
  }
  const hiddenCount = Math.max(0, alerts.length - visibleAlerts.length);
  el.alertStrip.innerHTML = `
    <div class="alert-strip-head">
      <span>Avvisi operativi</span>
      ${alerts.length > 3 ? `<button class="text-link-btn" id="toggleAlertsBtn" type="button">${state.heroAlertsExpanded ? 'Mostra meno' : `Mostra tutti (${alerts.length})`}</button>` : ''}
    </div>
    <div class="alert-stack">
      ${visibleAlerts.map(alert => {
        const typeClass = alert.type === 'check' ? 'check' : alert.type === 'renewal' ? 'renewal' : alert.type === 'payment' ? 'payment' : 'followup';
        const client = getClient(alert.clientId);
        const title = client ? getClientFullName(client) : 'Cliente';
        return `<button class="alert-chip ${typeClass}" data-alert-client="${alert.clientId}" style="text-align:left;cursor:pointer;border-right-color:rgba(255,255,255,0.06);border-top-color:rgba(255,255,255,0.06);border-bottom-color:rgba(255,255,255,0.06);" title="Apri cliente ${escapeHtml(title)}"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(alert.text)}</span></button>`;
      }).join('')}
      ${hiddenCount && !state.heroAlertsExpanded ? `<div class="calendar-more">+${hiddenCount} altri avvisi disponibili</div>` : ''}
    </div>
  `;
  const toggle = document.getElementById('toggleAlertsBtn');
  if (toggle) toggle.addEventListener('click', () => {
    state.heroAlertsExpanded = !state.heroAlertsExpanded;
    renderAlerts();
  });
  el.alertStrip.querySelectorAll('[data-alert-client]').forEach(button => {
    button.addEventListener('click', () => {
      selectClient(button.getAttribute('data-alert-client'));
    });
  });
}
