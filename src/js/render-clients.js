function getClientUrgency(client) {
  const plan = getActivePlan(client.id);
  const stats = planStats(plan);
  const needsAttention = (client.paymentStatus || 'unpaid') !== 'paid' || stats.remaining <= 3;
  const highAttention = (client.paymentStatus || 'unpaid') === 'unpaid' || (stats.cancelled || 0) >= 3;
  const nextLesson = stats.nextLesson ? `${formatDateFancy(stats.nextLesson.date)} · ${stats.nextLesson.time}` : 'Nessuna lezione';
  return {
    level: highAttention ? 'bad' : needsAttention ? 'warn' : 'ok',
    nextLesson,
    remaining: stats.remaining,
    done: stats.done,
    total: stats.total
  };
}

function buildClientListMarkup(sortedClients) {
  return sortedClients.map((client, idx) => {
    const activePlan = getActivePlan(client.id);
    const pkg = getPackage(activePlan?.packageId);
    const packageName = getClientOfferLabel(client, activePlan, pkg);
    const urgency = getClientUrgency(client);
    const revenue = activePlan ? formatCurrency(getPlanTotalPrice(activePlan, pkg, client)) : '—';
    return `
      <div class="client-card ${client.id === state.selectedClientId ? 'active' : ''}" data-client-id="${client.id}" tabindex="0" role="button" aria-label="Apri cliente ${escapeHtml(getClientFullName(client))}" style="--i:${Math.min(idx, 12)}">>
        <div class="client-meta-row">
          <div style="display:flex;gap:10px;align-items:center;min-width:0;flex:1 1 auto;">
            <div class="avatar">${escapeHtml(initials(getClientFullName(client)))}</div>
            <div class="client-meta-grid">
              <strong style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(getClientFullName(client))}</strong>
              <div class="small muted" style="text-transform:uppercase;line-height:1.2;">${escapeHtml(packageName)}</div>
            </div>
          </div>
        </div>
        <div class="client-subgrid">
          <div class="client-submeta">
            <span>${escapeHtml(urgency.nextLesson)}</span>
            <span>${urgency.done}/${urgency.total}</span>
          </div>
          <div class="client-data-points">
            <div class="client-data-point">
              <span>Residuo</span>
              <strong>${urgency.remaining} sessioni</strong>
            </div>
            <div class="client-data-point">
              <span>Valore</span>
              <strong>${escapeHtml(revenue)}</strong>
            </div>
          </div>
        </div>
        <div class="client-utility-row">
          <span class="tag compact ${client.paymentStatus === 'paid' ? 'green' : client.paymentStatus === 'partial' ? 'gold' : 'red'}">${escapeHtml(getPaymentStatusLabel(client.paymentStatus || 'unpaid'))}</span>
          <span class="tag compact ${getClientServiceType(client) === 'personal' ? 'blue' : ''}">${escapeHtml(serviceTypeLabel(getClientServiceType(client)))}</span>
        </div>
      </div>
    `;
  }).join('');
}

function showClientSkeletons(count = 5) {
  const html = Array.from({ length: count }, () => `
    <div class="skeleton-card">
      <div style="display:flex;gap:10px;align-items:center;">
        <div class="skeleton-line" style="width:40px;height:40px;border-radius:50%;flex-shrink:0;"></div>
        <div style="flex:1;display:grid;gap:7px;">
          <div class="skeleton-line" style="height:13px;width:65%;"></div>
          <div class="skeleton-line" style="height:11px;width:40%;"></div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <div class="skeleton-line" style="height:11px;"></div>
        <div class="skeleton-line" style="height:11px;"></div>
      </div>
    </div>`).join('');
  if (el.clientList) el.clientList.innerHTML = html;
  const drawerList = document.getElementById('clientListDrawer');
  if (drawerList) drawerList.innerHTML = html;
}

function renderClientList() {
  const q = state.search.trim().toLowerCase();
  const clients = state.clients.filter(client => {
    const urgency = getClientUrgency(client);
    const serviceType = getClientServiceType(client);
    const matchesQuery = !q || getClientFullName(client).toLowerCase().includes(q) || String(client.notes || '').toLowerCase().includes(q) || serviceTypeLabel(serviceType).toLowerCase().includes(q);
    if (!matchesQuery) return false;
    if (state.clientFilter === 'urgent') return isManagedClient(client) && (urgency.level === 'bad' || urgency.level === 'warn');
    if (state.clientFilter === 'expiring') return isManagedClient(client) && urgency.remaining > 0 && urgency.remaining <= 3;
    if (state.clientFilter === 'unpaid') return isManagedClient(client) && (client.paymentStatus || 'unpaid') !== 'paid';
    if (state.clientFilter === 'free_session') return serviceType === 'free_session';
    return true;
  });
  const sortedClients = clients.slice().sort((a, b) => {
    const ua = getClientUrgency(a);
    const ub = getClientUrgency(b);
    const score = level => level === 'bad' ? 2 : level === 'warn' ? 1 : 0;
    return score(ub.level) - score(ua.level) || ua.remaining - ub.remaining || getClientFullName(a).localeCompare(getClientFullName(b));
  });
  el.clientCountTag.textContent = clients.length;
  if (el.clientFilterRow) {
    el.clientFilterRow.querySelectorAll('[data-client-filter]').forEach(button => {
      button.classList.toggle('active', button.getAttribute('data-client-filter') === state.clientFilter);
    });
  }
  const drawerCountTag = document.getElementById('clientCountTagDrawer');
  if (drawerCountTag) drawerCountTag.textContent = String(clients.length);
  if (!sortedClients.length) {
    const isFiltered = state.clientFilter !== 'all' || state.search.trim();
    const emptyMarkup = isFiltered
      ? '<div class="empty">Nessun cliente trovato</div>'
      : `<div class="empty" style="padding:24px 16px;display:grid;gap:12px;text-align:center;">
           <div style="font-size:2rem;">👤</div>
           <div style="font-weight:700;color:#fff;">Nessun cliente ancora</div>
           <div style="font-size:0.88rem;color:var(--muted);line-height:1.45;">Usa il pulsante + Cliente per iniziare a gestire lezioni e pacchetti.</div>
         </div>`;
    el.clientList.innerHTML = emptyMarkup;
    const drawerList = document.getElementById('clientListDrawer');
    if (drawerList) drawerList.innerHTML = emptyMarkup;
    return;
  }
  const markup = buildClientListMarkup(sortedClients);
  el.clientList.innerHTML = markup;
  const drawerList = document.getElementById('clientListDrawer');
  if (drawerList) drawerList.innerHTML = markup;
}

function getCalendarAnchorDate() {
  if (state.calendarView === 'month') return startOfMonth(state.viewDate);
  return fromISO(state.selectedDay || todayISO());
}

function setCalendarView(view) {
  state.calendarView = ['month', 'week', 'day'].includes(view) ? view : 'month';
  if (!state.selectedDay) state.selectedDay = todayISO();
  saveState();
  renderAll();
}

function moveCalendar(step) {
  if (state.calendarView === 'month') {
    state.viewDate = addMonths(state.viewDate, step);
  } else if (state.calendarView === 'week') {
    const next = addDays(getCalendarAnchorDate(), step * 7);
    state.selectedDay = toISO(next);
    state.viewDate = startOfMonth(next);
  } else {
    const next = addDays(getCalendarAnchorDate(), step);
    state.selectedDay = toISO(next);
    state.viewDate = startOfMonth(next);
  }
  saveState();
  renderAll();
}

function resetCalendarToToday() {
  const today = new Date();
  state.viewDate = startOfMonth(today);
  state.selectedDay = toISO(today);
  saveState();
  renderAll();
}

function getCalendarSearchMatches(query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return [];
  return state.clients.filter(client => {
    const text = `${getClientFullName(client)} ${getPackage(getActivePlan(client.id)?.packageId)?.name || ''}`.toLowerCase();
    return text.includes(q);
  }).slice(0, 8);
}

function renderCalendarQuickSearchResults() {
  const matches = getCalendarSearchMatches(state.calendarQuickSearch);
  el.calendarQuickSearchResults.hidden = !matches.length;
  if (!matches.length) {
    el.calendarQuickSearchResults.innerHTML = '';
    return;
  }
  el.calendarQuickSearchResults.innerHTML = matches.map(client => {
    const pkg = getPackage(getActivePlan(client.id)?.packageId);
    return `<button type="button" class="quick-search-item" data-quick-client="${client.id}">
      <strong>${escapeHtml(getClientFullName(client))}</strong>
      <span class="muted small">${escapeHtml(pkg?.name || 'Senza pacchetto')}</span>
    </button>`;
  }).join('');
}
