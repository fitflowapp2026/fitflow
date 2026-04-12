function normalizePackageData() {
  state.packages = (state.packages || []).map(pkg => ({ ...pkg, totalPrice: Number(pkg?.totalPrice || 0) }));
}

function getClient(id) { return state.clients.find(item => item.id === id) || null; }
function getPackage(id) { return state.packages.find(item => item.id === id) || null; }
function getPlan(id) { return state.plans.find(item => item.id === id) || null; }
function getActivePlan(clientId) {
  const client = getClient(clientId);
  if (!client) return null;
  return getPlan(client.activePlanId) || state.plans.filter(plan => plan.clientId === clientId).sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt))).slice(-1)[0] || null;
}
function getLesson(id) { return state.lessons.find(item => item.id === id) || null; }
function getLessonsForClient(clientId) {
  return state.lessons.filter(item => item.clientId === clientId).sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
}
function getLessonsForPlan(planId) {
  return state.lessons.filter(item => item.planId === planId).sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
}

function getPlanCapacity(planId) {
  const plan = getPlan(planId);
  const pkg = getPackage(plan?.packageId);
  const total = Number(pkg?.lessonsTotal || 0);
  const used = getLessonsForPlan(planId).filter(item => item.status !== 'cancelled').length;
  const remaining = Math.max(total - used, 0);
  return { total, used, remaining, isFull: total > 0 && used >= total };
}

function canUsePlanSlot(planId, lessonId = null) {
  const plan = getPlan(planId);
  const pkg = getPackage(plan?.packageId);
  const total = Number(pkg?.lessonsTotal || 0);
  if (!total) return true;
  const used = getLessonsForPlan(planId).filter(item => item.status !== 'cancelled' && item.id !== lessonId).length;
  return used < total;
}

function planStats(plan) {
  if (!plan) return { total: 0, done: 0, remaining: 0, firstLesson: null, nextLesson: null, progress: 0, cancelled: 0 };
  const pkg = getPackage(plan.packageId);
  const lessons = getLessonsForPlan(plan.id);
  const done = lessons.filter(item => item.status === 'done').length;
  const cancelled = lessons.filter(item => item.status === 'cancelled').length;
  const effective = lessons.filter(item => item.status !== 'cancelled');
  const firstLesson = effective.map(item => item.date).sort()[0] || null;
  const nextLesson = lessons.filter(item => item.status !== 'cancelled' && item.date >= todayISO()).sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))[0] || null;
  const base = Number(pkg?.lessonsTotal || 0);
  const carryOver = Number(plan?.carryOverLessons || 0);
  const total = base + carryOver;
  const remaining = Math.max(total - done, 0);
  const progress = total ? Math.min(100, Math.round((done / total) * 100)) : 0;
  return { total, done, remaining, firstLesson, nextLesson, progress, cancelled, carryOver };
}

function clientHistoryStats(clientId) {
  const lessons = getLessonsForClient(clientId);
  const cancelled = lessons.filter(item => item.status === 'cancelled').length;
  const done = lessons.filter(item => item.status === 'done').length;
  const future = lessons.filter(item => item.status !== 'cancelled' && item.date >= todayISO()).length;
  const lastSeen = lessons.filter(item => item.status !== 'cancelled').map(item => item.date).sort().slice(-1)[0] || null;
  return { lessons, cancelled, done, future, lastSeen };
}

function getMonthSnapshot(monthDate) {
  const lessons = state.lessons.filter(item => sameMonth(fromISO(item.date), monthDate));
  const done = lessons.filter(item => item.status === 'done').length;
  const cancelled = lessons.filter(item => item.status === 'cancelled').length;
  const scheduled = lessons.filter(item => item.status === 'scheduled').length;
  const total = lessons.filter(item => item.status !== 'cancelled').length;
  const newClients = state.clients.filter(client => sameMonth(new Date(client.createdAt || client.startDate || new Date()), monthDate)).length;
  const revenue = lessons
    .filter(item => item.status === 'done')
    .reduce((sum, lesson) => {
      const plan = getPlan(lesson.planId);
      const pkg = getPackage(plan?.packageId);
      return sum + getPlanUnitValue(plan, pkg, getClient(lesson.clientId), lesson);
    }, 0);
  return { lessons, done, cancelled, scheduled, total, newClients, revenue };
}

function countFreeSlots(days = 7) {
  const slots = buildDaySlotTimes();
  let free = 0;
  for (let offset = 0; offset < days; offset += 1) {
    const iso = toISO(addDays(new Date(), offset));
    slots.forEach(time => {
      if (!hasTimeConflict({ date: iso, time, duration: 60 })) free += 1;
    });
  }
  return free;
}

function getClientHealth(client) {
  const urgency = getClientUrgency(client);
  if (urgency.level === 'bad') return 'Alto rischio';
  if (urgency.level === 'warn') return 'Monitor';
  return 'Regolare';
}

function getUrgencyLabel(level) {
  if (level === 'bad') return 'Alto rischio';
  if (level === 'warn') return 'Attenzione';
  return 'Stabile';
}

function sessionPerWeekLabel(value) {
  const n = Number(value || 0);
  if (n === 1) return '1 sessione / settimana';
  return `${n} sessioni / settimana`;
}

function compactPackageLabel(pkg) {
  if (!pkg) return '—';
  const name = String(pkg.name || '').trim();
  const weeks = Number(pkg.weeks || 0);
  if (weeks > 0 && !/settiman/i.test(name)) return `${name} · ${weeks} settimane`;
  return name || '—';
}

function getDeltaMeta(current, previous, reverse = false) {
  const delta = Number(current || 0) - Number(previous || 0);
  const direction = delta === 0 ? 'flat' : ((delta > 0) !== reverse ? 'up' : 'down');
  const sign = delta > 0 ? '+' : '';
  return {
    delta,
    direction,
    text: delta === 0 ? 'In linea' : `${sign}${formatNumberMax2(delta)} vs mese prec.`,
  };
}

function getUsualTimes(clientId) {
  const client = getClient(clientId);
  const counts = new Map();
  getLessonsForClient(clientId).filter(item => item.status !== 'cancelled').forEach(lesson => {
    counts.set(lesson.time, (counts.get(lesson.time) || 0) + 1);
  });
  if (client?.fixedTime) counts.set(client.fixedTime, (counts.get(client.fixedTime) || 0) + 0.5);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(entry => entry[0]);
}

function getUsualWeekdays(clientId) {
  const counts = new Map();
  getLessonsForClient(clientId).filter(item => item.status !== 'cancelled').forEach(lesson => {
    const weekday = normalizeWeekday(fromISO(lesson.date).getDay());
    counts.set(weekday, (counts.get(weekday) || 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(entry => entry[0]);
}

function getPreferredTime(clientId) {
  const client = getClient(clientId);
  if (client?.scheduleMode === 'same' && client.fixedTime) return client.fixedTime;
  return getUsualTimes(clientId)[0] || '';
}

function getOverlappingLesson({ lessonId = null, date, time, duration, duoGroupId = null }) {
  const start = minutesFromTime(time);
  const end = start + Number(duration || 0);
  return state.lessons.find(lesson => {
    if (lesson.id === lessonId) return false;
    if (lesson.date !== date || lesson.status === 'cancelled') return false;
    // Due lezioni dello stesso gruppo DUO possono coesistere nello stesso slot
    if (duoGroupId && lesson.duoGroupId === duoGroupId) return false;
    const otherStart = minutesFromTime(lesson.time);
    const otherEnd = otherStart + Number(lesson.duration || 60);
    return start < otherEnd && end > otherStart;
  }) || null;
}

function hasTimeConflict({ lessonId = null, date, time, duration, duoGroupId = null }) {
  return Boolean(getOverlappingLesson({ lessonId, date, time, duration, duoGroupId }) || getExternalBusyOverlap({ date, time, duration }));
}

function addMinutesToTime(time, minutesToAdd) {
  const total = minutesFromTime(time) + Number(minutesToAdd || 0);
  const normalized = ((total % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function buildDaySlotTimes() {
  const slots = [];
  for (let minutes = 6 * 60; minutes <= 22 * 60; minutes += 30) {
    slots.push(`${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`);
  }
  return slots;
}

function getLessonEndDate(lesson) {
  const start = fromISO(lesson.date);
  const [hours, minutes] = String(lesson.time || '00:00').split(':').map(Number);
  start.setHours(Number.isFinite(hours) ? hours : 0, Number.isFinite(minutes) ? minutes : 0, 0, 0);
  return new Date(start.getTime() + Number(lesson.duration || 60) * 60000);
}

function autoCompleteElapsedLessons() {
  const now = new Date();
  let changed = false;
  const changedLessons = [];
  state.lessons.forEach(lesson => {
    if (lesson.status !== 'scheduled') return;
    if (getLessonEndDate(lesson) <= now) {
      lesson.status = 'done';
      changedLessons.push(lesson.id);
      changed = true;
    }
  });
  if (changed) {
    saveState();
    changedLessons.forEach(id => requestGoogleLessonSync('upsert', id));
    /* Free session auto-completata → proponi conversione se nessun modal è aperto */
    const noModal = !document.querySelector('.modal-backdrop.open, .confirm-modal-backdrop.open, .fsc-backdrop.open');
    if (noModal) {
      changedLessons.forEach(id => {
        const lesson = getLesson(id);
        if (!lesson) return;
        const client = getClient(lesson.clientId);
        if (client && getClientServiceType(client) === 'free_session' && client.conversionStatus !== 'path_started') {
          setTimeout(() => openFreeSessionConversionModal(client), 800);
        }
      });
    }
  }
  return changed;
}

function getAlerts() {
  const alerts = [];
  const today = todayISO();
  state.clients.forEach(client => {
    const activePlan = getActivePlan(client.id);
    const stats = planStats(activePlan);
    const managed = isManagedClient(client);
    if (managed && activePlan && stats.firstLesson) {
      const first = fromISO(stats.firstLesson);
      if (activePlan.checkMode === '8') {
        const due = toISO(addWeeks(first, 8));
        if (due <= today) alerts.push({ type: 'check', clientId: client.id, text: `Check 8 settimane`, when: due });
      }
      if (activePlan.checkMode === '12') {
        const due = toISO(addWeeks(first, 12));
        if (due <= today) alerts.push({ type: 'check', clientId: client.id, text: `Check 12 settimane`, when: due });
      }
    }
    if (managed && stats.remaining > 0 && stats.remaining <= 3) {
      alerts.push({ type: 'renewal', clientId: client.id, text: `Restano ${stats.remaining} lezioni`, when: stats.nextLesson?.date || today });
    }
    if (managed && (client.paymentStatus || 'unpaid') !== 'paid') {
      const planStartDate = activePlan?.startDate || null;
      if (!planStartDate || planStartDate <= today) {
        // Piano già iniziato → alert pagamento urgente
        const paymentText = client.paymentStatus === 'partial' ? 'Pagamento parziale da chiudere' : 'Pagamento da incassare';
        alerts.push({ type: 'payment', clientId: client.id, text: paymentText, when: stats.nextLesson?.date || planStartDate || today });
      } else {
        // Piano non ancora iniziato → avviso soft, non urgente
        alerts.push({ type: 'check', clientId: client.id, text: `Pacchetto inizia il ${formatDateFancy(planStartDate)} — incasso da gestire`, when: planStartDate });
      }
    }
    const history = clientHistoryStats(client.id);
    if (history.lastSeen) {
      const lastDate = fromISO(history.lastSeen);
      const diffDays = Math.floor((new Date().setHours(0,0,0,0) - lastDate.setHours(0,0,0,0)) / 86400000);
      if (diffDays >= 60 && history.future === 0) {
        const text = managed ? 'Follow-up dopo 2 mesi' : 'Ricontatto free session';
        alerts.push({ type: 'followup', clientId: client.id, text, when: history.lastSeen });
      }
    } else if (!managed && stats.future === 0) {
      alerts.push({ type: 'followup', clientId: client.id, text: 'Free session da ricontattare', when: client.createdAt || today });
    }
  });
  const dismissed = Array.isArray(state.dismissedAlerts) ? state.dismissedAlerts : [];
  return alerts
    .map(a => {
      const c = state.clients.find(cl => cl.id === a.clientId);
      const plan = c ? getActivePlan(c.id) : null;
      const st = plan ? planStats(plan) : {};
      let stateKey = a.when || '';
      if (a.type === 'payment') stateKey = c?.paymentStatus || 'unpaid';
      if (a.type === 'renewal') stateKey = String(st.remaining ?? '');
      if (a.type === 'check')   stateKey = plan?.checkMode || '';
      return { ...a, alertId: `${a.type}_${a.clientId}_${stateKey}` };
    })
    .filter(a => !dismissed.includes(a.alertId))
    .sort((a, b) => String(a.when).localeCompare(String(b.when)));
}


function getClientTimelineEntries(client) {
  if (!client) return [];
  const plan = getActivePlan(client.id);
  const stats = planStats(plan);
  const history = clientHistoryStats(client.id);
  const renewals = Array.isArray(client.renewalHistory) ? client.renewalHistory : [];
  const payments = Array.isArray(client.paymentHistory) ? client.paymentHistory : [];
  const entries = [];
  entries.push({
    tone: stats.nextLesson ? 'info' : 'warn',
    title: stats.nextLesson ? `Prossima sessione ${formatDateFancy(stats.nextLesson.date)} · ${stats.nextLesson.time}` : 'Nessuna sessione futura pianificata',
    text: stats.nextLesson ? 'Agenda già fissata' : 'Serve una nuova prenotazione'
  });
  entries.push({
    tone: history.lastSeen ? 'good' : 'warn',
    title: history.lastSeen ? `Ultima presenza ${formatDateFancy(history.lastSeen)}` : 'Nessuna presenza registrata',
    text: history.lastSeen ? `${history.done} sessioni completate` : 'Cliente ancora da attivare'
  });
  entries.push({
    tone: client.paymentStatus === 'paid' ? 'good' : client.paymentStatus === 'partial' ? 'warn' : 'bad',
    title: getPaymentStatusLabel(client.paymentStatus || 'unpaid'),
    text: payments.length ? `Ultimo movimento ${formatDateFancy(payments[payments.length - 1].at || payments[payments.length - 1].date || todayISO())}` : 'Nessuno storico pagamenti'
  });
  if (renewals.length) {
    const lastRenewal = renewals[renewals.length - 1];
    entries.push({
      tone: 'info',
      title: `Ultimo rinnovo ${formatDateFancy(lastRenewal.at || lastRenewal.startDate || todayISO())}`,
      text: compactPackageLabel(getPackage(lastRenewal.packageId)) || 'Pacchetto rinnovato'
    });
  } else {
    entries.push({
      tone: stats.remaining <= 3 ? 'warn' : 'info',
      title: stats.remaining <= 3 ? `Restano ${stats.remaining} lezioni` : 'Percorso in corso',
      text: stats.remaining <= 3 ? 'Momento giusto per proporre rinnovo' : 'Nessuna azione urgente sul rinnovo'
    });
  }
  return entries.slice(0, 4);
}

function getOperationalActionCards() {
  const alerts = getAlerts();
  const upcomingLesson = state.lessons
    .filter(item => item.status === 'scheduled' && `${item.date}T${item.time}` >= `${todayISO()}T00:00`)
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))[0];
  const unpaid = state.clients.find(client => isManagedClient(client) && (client.paymentStatus || 'unpaid') !== 'paid');
  const expiring = state.clients
    .filter(client => {
      const plan = getActivePlan(client.id);
      const stats = planStats(plan);
      return isManagedClient(client) && stats.remaining > 0 && stats.remaining <= 3;
    })
    .sort((a, b) => planStats(getActivePlan(a.id)).remaining - planStats(getActivePlan(b.id)).remaining)[0];
  const followup = alerts.find(item => item.type === 'followup');
  const unpaidCount = state.clients.filter(c => isManagedClient(c) && (c.paymentStatus || 'unpaid') !== 'paid').length;
  return [
    upcomingLesson ? {
      tone: 'info',
      label: 'Prossima lezione',
      value: getClientFullName(getClient(upcomingLesson.clientId)) || 'Sessione pianificata',
      sub: `${formatDateFancy(upcomingLesson.date)} · ${upcomingLesson.time}`,
      meta: 'Apri giorno',
      action: 'open-day',
      clientId: upcomingLesson.clientId,
      date: upcomingLesson.date
    } : {
      tone: 'good',
      label: 'Prossima lezione',
      value: 'Agenda libera',
      sub: 'Nessuna sessione imminente',
      meta: 'Nuova prenotazione',
      action: 'new-client'
    },
    unpaidCount > 0 ? {
      tone: 'danger',
      label: 'Clienti a rischio',
      value: `${unpaidCount} client${unpaidCount === 1 ? 'e' : 'i'}`,
      sub: 'Pagamenti non saldati',
      meta: 'Apri lista',
      action: 'open-at-risk'
    } : {
      tone: 'good',
      label: 'Clienti a rischio',
      value: 'Tutto saldato',
      sub: 'Nessun incasso aperto',
      meta: 'OK',
      action: 'noop'
    }
  ];
}

function focusClient(clientId) {
  const client = getClient(clientId);
  if (!client) return null;
  state.selectedClientId = client.id;
  const next = planStats(getActivePlan(client.id)).nextLesson;
  if (next?.date) {
    state.selectedDay = next.date;
    state.viewDate = startOfMonth(fromISO(next.date));
  }
  return client;
}

function handleOperationalAction(button) {
  const action = button.getAttribute('data-action');
  const clientId = button.getAttribute('data-client-id');
  const date = button.getAttribute('data-date');
  if (clientId) focusClient(clientId);
  if (action === 'renew' && clientId) {
    saveState();
    renderAll();
    openRenewModal();
    return;
  }
  if (action === 'open-client' && clientId) {
    saveState();
    renderAll();
    return;
  }
  if (action === 'open-day' && date) {
    state.selectedDay = date;
    state.viewDate = startOfMonth(fromISO(date));
    state.calendarView = 'day';
    saveState();
    renderAll();
    return;
  }
  if (action === 'new-client') {
    openNewClientModal(button);
    return;
  }
  if (action === 'open-at-risk') {
    renderAtRiskModal();
    openModal('atRiskModalBackdrop');
    return;
  }
}

function quickBookSelectedClient(offsetDays = 0) {
  const client = getClient(state.selectedClientId);
  if (!client) {
    showToast('Seleziona un cliente.');
    return;
  }
  const plan = getActivePlan(client.id);
  const pkg = getPackage(plan?.packageId);
  if (!plan || !pkg) {
    showToast('Pacchetto mancante.');
    return;
  }
  const targetDate = toISO(addDays(new Date(), offsetDays));
  const preferredTime = getPreferredTime(client.id) || client.fixedTime || '09:00';
  if (!hasTimeConflict({ date: targetDate, time: preferredTime, duration: pkg.duration })) {
    const ok = createLesson({ clientId: client.id, planId: plan.id, date: targetDate, time: preferredTime, duration: pkg.duration, setFixedTime: client.scheduleMode === 'same' });
    if (ok) {
      state.selectedDay = targetDate;
      state.viewDate = startOfMonth(fromISO(targetDate));
      state.calendarView = 'day';
      renderAll();
      showToast(`Lezione fissata ${offsetDays === 0 ? 'oggi' : 'domani'} alle ${preferredTime}.`, 'ok');
      return;
    }
  }
  state.selectedDay = targetDate;
  state.viewDate = startOfMonth(fromISO(targetDate));
  renderDayModal(targetDate);
  openModal('dayModalBackdrop');
}


function getSuggestedReschedules(lesson) {
  const client = getClient(lesson.clientId);
  if (!client) return [];
  const times = [...new Set([lesson.time, client.fixedTime, ...getUsualTimes(client.id), ...getDefaultTimes()].filter(Boolean))].slice(0, 6);
  const weekdays = getUsualWeekdays(client.id);
  const targetWeekdays = weekdays.length ? weekdays.slice(0, 3) : [normalizeWeekday(fromISO(lesson.date).getDay())];
  const suggestions = [];
  const seen = new Set();
  for (let offset = 1; offset <= 35 && suggestions.length < 8; offset++) {
    const date = addDays(fromISO(lesson.date), offset);
    if (!targetWeekdays.includes(normalizeWeekday(date.getDay()))) continue;
    for (const time of times) {
      const iso = toISO(date);
      const key = `${iso}_${time}`;
      if (seen.has(key)) continue;
      if (state.lessons.some(item => item.clientId === client.id && item.date === iso && item.time === time && item.status !== 'cancelled')) continue;
      if (hasTimeConflict({ date: iso, time, duration: lesson.duration })) continue;
      seen.add(key);
      suggestions.push({ date: iso, time });
      if (suggestions.length >= 8) break;
    }
  }
  return suggestions;
}

let activeModalTrigger = null;
function getFocusableElements(root) {
  return [...root.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(item => !item.disabled && item.offsetParent !== null);
}
function trapModalFocus(event) {
  const open = document.querySelector('.modal-backdrop.open .modal');
  if (!open || event.key !== 'Tab') return;
  const focusable = getFocusableElements(open);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
let bodyScrollLockDepth = 0;
let bodyScrollLockY = 0;

function lockBodyScroll() {
  bodyScrollLockDepth += 1;
  if (bodyScrollLockDepth > 1) return;
  bodyScrollLockY = window.scrollY || window.pageYOffset || 0;
  document.documentElement.classList.add('modal-scroll-lock');
  document.body.classList.add('modal-scroll-lock');
  document.body.style.top = `-${bodyScrollLockY}px`;
}

function unlockBodyScroll(force = false) {
  if (force) {
    bodyScrollLockDepth = 0;
  } else if (bodyScrollLockDepth > 0) {
    bodyScrollLockDepth -= 1;
  }
  if (bodyScrollLockDepth > 0) return;
  const restoreY = Math.abs(parseInt(document.body.style.top || '0', 10)) || bodyScrollLockY || 0;
  document.documentElement.classList.remove('modal-scroll-lock');
  document.body.classList.remove('modal-scroll-lock');
  document.body.style.top = '';
  window.scrollTo(0, restoreY);
  bodyScrollLockY = 0;
}

/* ── Haptic feedback leggero (Android) ─────────────────────── */
function haptic(ms = 8) {
  try { if (navigator.vibrate) navigator.vibrate(ms); } catch(e) {}
}

/* ── Dynamic theme-color per status bar iOS ─────────────────── */
const _themeColorMeta = document.querySelector('meta[name="theme-color"]');
function setThemeColor(color) {
  if (_themeColorMeta) _themeColorMeta.setAttribute('content', color);
}

function openModal(id, trigger = document.activeElement) {
  if (id === 'operazioniModalBackdrop') renderOperazioniModal();
  if (id === 'atRiskModalBackdrop') renderAtRiskModal();
  if (id === 'completamentoModalBackdrop') renderCompletamentoModal();
  const backdrop = document.getElementById(id);
  if (!backdrop) return;
  activeModalTrigger = trigger instanceof HTMLElement ? trigger : activeModalTrigger;
  backdrop.classList.add('open');
  lockBodyScroll();
  /* Theme color contestuale per tipo di modal */
  const dangerModals = ['confirmModalBackdrop'];
  const isDanger = dangerModals.includes(id) ||
    backdrop.querySelector('.btn-danger') !== null;
  setThemeColor(isDanger ? '#1a0505' : '#0b0b0b');
  haptic(6);
  const modal = backdrop.querySelector('.modal');
  if (modal) {
    if (!modal.hasAttribute('tabindex')) modal.setAttribute('tabindex', '-1');
    const target = getFocusableElements(modal)[0] || modal;
    requestAnimationFrame(() => target.focus());
    /* Swipe-to-close on mobile */
    attachSwipeClose(modal, () => closeModal(backdrop.id));
  }
}
function closeModal(id) {
  const backdrop = document.getElementById(id);
  if (!backdrop) return;
  backdrop.classList.remove('open');
  unlockBodyScroll();
  if (!document.querySelector('.modal-backdrop.open')) {
    setThemeColor('#141414');
  }
  if (!document.querySelector('.modal-backdrop.open') && activeModalTrigger && document.body.contains(activeModalTrigger)) {
    activeModalTrigger.focus();
  }
}

/* ── Swipe-to-close for bottom sheet modals ─────────────── */
function attachSwipeClose(el, onClose) {
  if (el._swipeAttached) return;
  el._swipeAttached = true;

  const interactiveSelector = 'input, textarea, select, button, [contenteditable="true"]';
  let startY = 0;
  let currentY = 0;
  let dragging = false;
  let canStartDrag = false;

  function findScrollableAncestor(node) {
    let current = node;
    while (current && current !== el) {
      if (current instanceof HTMLElement) {
        const style = window.getComputedStyle(current);
        const canScroll = /(auto|scroll|overlay)/.test(style.overflowY || '');
        if (canScroll && current.scrollHeight > current.clientHeight + 2) return current;
      }
      current = current.parentElement;
    }
    return null;
  }

  function startedFromTopZone(target, touchY) {
    if (!(target instanceof HTMLElement)) return false;
    if (target.closest(interactiveSelector)) return false;
    const scrollable = findScrollableAncestor(target);
    if (scrollable && scrollable.scrollTop > 0) return false;
    const modalTop = el.getBoundingClientRect().top;
    return (touchY - modalTop) <= 88;
  }

  el.addEventListener('touchstart', e => {
    if (window.innerWidth > 580) return;
    startY = e.touches[0].clientY;
    currentY = startY;
    canStartDrag = startedFromTopZone(e.target, startY);
    dragging = false;
    if (!canStartDrag) return;
    el.style.transition = 'none';
  }, { passive: true });

  el.addEventListener('touchmove', e => {
    if (!canStartDrag) return;
    currentY = e.touches[0].clientY;
    const dy = Math.max(0, currentY - startY);
    if (dy < 8 && !dragging) return;
    dragging = true;
    el.style.transform = `translateY(${dy}px)`;
  }, { passive: true });

  function resetSwipeState() {
    dragging = false;
    canStartDrag = false;
    el.style.transition = '';
  }

  el.addEventListener('touchend', () => {
    if (!canStartDrag) return;
    const dy = currentY - startY;
    resetSwipeState();
    if (dy > 90) {
      el.style.transform = 'translateY(100%)';
      setTimeout(() => { el.style.transform = ''; onClose(); }, 220);
    } else {
      el.style.transform = '';
    }
  });

  el.addEventListener('touchcancel', () => {
    if (!canStartDrag && !dragging) return;
    resetSwipeState();
    el.style.transform = '';
  });
  el.addEventListener('touchmove', e => {
    if (!window.innerWidth || window.innerWidth > 580) return;
    const target = e.target;
    const isScrollableArea = target instanceof HTMLElement && !!target.closest('.modal, .confirm-modal, .fsc-modal, .mp-modal');
    if (!isScrollableArea) e.preventDefault();
  }, { passive: false });
}

/* ── Custom confirm dialog (replaces window.confirm) ─────── */
function showConfirm(title, message, onConfirm, confirmLabel = 'Elimina') {
  const backdrop = document.getElementById('confirmModalBackdrop');
  const titleEl  = document.getElementById('confirmModalTitle');
  const msgEl    = document.getElementById('confirmModalMsg');
  const okBtn    = document.getElementById('confirmModalOk');
  const cancelBtn = document.getElementById('confirmModalCancel');
  if (!backdrop) { if (onConfirm) onConfirm(); return; }
  titleEl.textContent   = title;
  msgEl.textContent     = message;
  okBtn.textContent     = confirmLabel;
  backdrop.classList.add('open');
  lockBodyScroll();
  /* remove old listeners */
  const newOk = okBtn.cloneNode(true);
  const newCancel = cancelBtn.cloneNode(true);
  okBtn.replaceWith(newOk);
  cancelBtn.replaceWith(newCancel);
  function close() {
    backdrop.classList.remove('open');
    unlockBodyScroll();
  }
  newOk.addEventListener('click', () => { close(); if (onConfirm) onConfirm(); });
  newCancel.addEventListener('click', close);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); }, { once: true });
  requestAnimationFrame(() => newOk.focus());
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    const confirmOpen = document.getElementById('confirmModalBackdrop')?.classList.contains('open');
    if (confirmOpen) { document.getElementById('confirmModalBackdrop').classList.remove('open'); unlockBodyScroll(); return; }
    const openBackdrop = document.querySelector('.modal-backdrop.open');
    if (openBackdrop) closeModal(openBackdrop.id);
  }
  trapModalFocus(event);
});
