function renderHero() {
  const snapshot = getMonthSnapshot(state.viewDate);
  const alerts = getAlerts();
  const urgentAlerts = alerts.filter(item => item.type === 'renewal' || item.type === 'payment').length;
  const completionRate = snapshot.done + snapshot.cancelled ? Math.round((snapshot.done / (snapshot.done + snapshot.cancelled)) * 100) : 0;
  const todayLessons = state.lessons.filter(item => item.date === todayISO() && item.status !== 'cancelled').length;
  // Fix 4: atRisk solo mese corrente con piano iniziato
  const viewMonth = state.viewDate;
  const atRisk = state.clients.filter(c => {
    if (!isManagedClient(c)) return false;
    if ((c.paymentStatus || 'unpaid') === 'paid') return false;
    const plan = getActivePlan(c.id);
    if (!plan || (plan.startDate && plan.startDate > todayISO())) return false;
    const hasLessonsMonth = state.lessons.some(l =>
      l.clientId === c.id && l.status !== 'cancelled' && sameMonth(fromISO(l.date), viewMonth));
    const planStart = fromISO(plan.startDate || todayISO());
    return hasLessonsMonth || sameMonth(planStart, viewMonth) || planStart <= new Date();
  }).length;
  const previous = getMonthSnapshot(addMonths(state.viewDate, -1));

  /* Revenue trend */
  const revDelta = snapshot.revenue - (previous.revenue || 0);
  const revTrend = revDelta === 0 ? 'flat' : revDelta > 0 ? 'up' : 'down';
  const revTrendLabel = revDelta === 0 ? '≈ invariato' : `${revDelta > 0 ? '+' : ''}${formatCurrency(revDelta)} vs mese prec.`;
  const revTrendIcon = revTrend === 'up' ? '↑' : revTrend === 'down' ? '↓' : '→';

  const upcomingHeroLesson = state.lessons
    .filter(item => item.status === 'scheduled' && `${item.date}T${item.time}` >= `${todayISO()}T00:00`)
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))[0] || null;

  const prossimaVal = upcomingHeroLesson ? getClientFullName(getClient(upcomingHeroLesson.clientId)) : 'Agenda libera';
  const prossimaSub = upcomingHeroLesson ? `${formatDateFancy(upcomingHeroLesson.date)} · ${upcomingHeroLesson.time}` : 'Nessuna sessione imminente';

  // Fix 3: Prossima lezione nella riga heroInsights fianco a Clienti a rischio
  el.heroInsights.innerHTML = [
    { key: 'Incasso mese', value: formatCurrency(snapshot.revenue), sub: `Mese prec. ${formatCurrency(previous.revenue || 0)}`, extra: `<span class="trend ${revTrend}">${revTrendIcon} ${revTrendLabel}</span>`, cls: 'revenue-card' },
    { key: 'Sessioni oggi', value: todayLessons, sub: todayLessons ? 'Operatività in agenda' : 'Giornata libera', cls: '' },
    { key: 'Clienti a rischio', value: atRisk, sub: atRisk ? 'Pagamenti o rinnovi aperti' : 'Nessun rischio critico', cls: `risk-card${atRisk ? ' has-risk' : ''} stat-box-clickable`, clickId: 'heroRischioInsight' },
    { key: 'Prossima lezione', value: prossimaVal, sub: prossimaSub, cls: upcomingHeroLesson ? 'stat-box-clickable' : '', clickId: upcomingHeroLesson ? 'heroProssimaInsight' : null }
  ].map(item => `
    <div class="hero-insight${item.cls ? ' ' + item.cls : ''}"${item.clickId ? ` id="${item.clickId}" role="button" tabindex="0"` : ''}>
      <div class="k">${item.key}</div>
      <div class="v">${item.value}</div>
      <div class="s">${item.sub}</div>
      ${item.extra || ''}
    </div>
  `).join('');
  const rischioInsight = document.getElementById('heroRischioInsight');
  if (rischioInsight) {
    rischioInsight.addEventListener('click', () => openModal('atRiskModalBackdrop'));
    rischioInsight.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal('atRiskModalBackdrop'); } });
  }
  const prossimaInsight = document.getElementById('heroProssimaInsight');
  if (prossimaInsight && upcomingHeroLesson) {
    const goToDay = () => {
      state.selectedDay = upcomingHeroLesson.date;
      state.viewDate = startOfMonth(fromISO(upcomingHeroLesson.date));
      state.calendarView = 'day';
      saveState(); renderAll();
    };
    prossimaInsight.addEventListener('click', goToDay);
    prossimaInsight.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goToDay(); } });
  }

  // Fix 2: Completamento NON cliccabile — heroStats 3 voci
  el.heroStats.innerHTML = [
    { label: 'Base clienti', value: getManagedClients().length, sub: `${snapshot.newClients} nuovi nel mese` },
    { label: 'Completamento', value: `${completionRate}%`, sub: `${snapshot.done} svolte • ${snapshot.cancelled} annullate` },
    { label: 'Operazioni', value: alerts.length, sub: urgentAlerts ? `${urgentAlerts} urgenti` : 'Nessun avviso urgente', id: 'heroAlertToggle' }
  ].map(item => `
    <div class="stat-box${item.id ? ' stat-box-clickable' : ''}" ${item.id ? `id="${item.id}" role="button" tabindex="0"` : ''}>
      <div class="label">${item.label}</div>
      <div class="value">${item.value}</div>
      <div class="sub">${item.sub}</div>
    </div>
  `).join('');
  const toggleBtn = document.getElementById('heroAlertToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => openModal('operazioniModalBackdrop'));
    toggleBtn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal('operazioniModalBackdrop'); } });
  }
}


/* ── Modal pagamento rapido ──────────────────────── */
