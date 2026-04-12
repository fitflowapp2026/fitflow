function getPackageUnitValue(pkg) {
  const lessonsTotal = Number(pkg?.lessonsTotal || 0);
  const totalPrice = Number(pkg?.totalPrice || 0);
  return lessonsTotal > 0 ? totalPrice / lessonsTotal : 0;
}

function seedPackages() {
  return [
    { id: uid('pkg'), name: 'Start 8', lessonsTotal: 8, weeks: 4, perWeek: 2, duration: 60, totalPrice: 0, createdAt: new Date().toISOString() },
    { id: uid('pkg'), name: 'Base 12', lessonsTotal: 12, weeks: 8, perWeek: 2, duration: 60, totalPrice: 0, createdAt: new Date().toISOString() },
    { id: uid('pkg'), name: 'Intensivo 16', lessonsTotal: 16, weeks: 8, perWeek: 2, duration: 75, totalPrice: 0, createdAt: new Date().toISOString() }
  ];
}

function serviceTypeLabel(type) {
  if (type === 'free_session') return 'FREE SESSION';
  return 'PERSONAL';
}

function isPack99Package(pkgOrName) {
  const raw = typeof pkgOrName === 'string' ? pkgOrName : (pkgOrName?.name || '');
  const normalized = String(raw || '').toUpperCase().replace(/\s+/g, '');
  return normalized === 'PACK99';
}

function getPlanTotalPrice(plan, pkg = null, client = null) {
  const direct = Number(plan?.totalPrice || 0);
  if (direct > 0) return direct;
  const clientPrice = Number(client?.packagePrice || 0);
  if (clientPrice > 0) return clientPrice;
  return Number((pkg || getPackage(plan?.packageId))?.totalPrice || 0);
}

function getPlanUnitValue(plan, pkg = null, client = null, lesson = null) {
  if (lesson && (lesson.lessonType || lesson.type) === 'free_session') return 0;
  const packageObj = pkg || getPackage(plan?.packageId);
  const lessonsTotal = Number(packageObj?.lessonsTotal || 0);
  const totalPrice = getPlanTotalPrice(plan, packageObj, client);
  return lessonsTotal > 0 ? totalPrice / lessonsTotal : 0;
}

function ensureSpecialPackage(type, freeDone = false) {
  const matchName = type === 'free_session'
    ? 'FREE SESSION'
    : (freeDone ? 'PACK 99' : 'PACK 99 + FREE SESSION');
  let pkg = state.packages.find(item => String(item.name || '').toUpperCase() === matchName);
  if (pkg) return pkg;
  pkg = {
    id: uid('pkg'),
    name: matchName,
    lessonsTotal: type === 'free_session' ? 1 : (freeDone ? 3 : 4),
    weeks: type === 'free_session' ? 1 : 4,
    perWeek: 1,
    duration: 60,
    totalPrice: 0,
    createdAt: new Date().toISOString()
  };
  state.packages.unshift(pkg);
  return pkg;
}

function getClientServiceType(client) {
  return client?.serviceType || 'personal';
}

function isManagedClient(client) {
  return getClientServiceType(client) !== 'free_session';
}

function getManagedClients() {
  return state.clients.filter(isManagedClient);
}

function getDefaultSelectedClientId(preferredId = null) {
  if (preferredId && state.clients.some(client => client.id === preferredId)) return preferredId;
  const managedClients = getManagedClients();
  if (managedClients.length) return managedClients[0].id;
  return state.clients[0]?.id || null;
}

function getTodayLessonBreakdown(date = todayISO()) {
  return state.lessons.reduce((acc, lesson) => {
    if (lesson.date !== date || lesson.status === 'cancelled') return acc;
    const type = getLessonServiceType(lesson);
    if (type === 'free_session') acc.free += 1;
    else acc.personal += 1;
    return acc;
  }, { personal: 0, free: 0 });
}

function getClientOfferLabel(client, plan = null, pkg = null) {
  const type = getClientServiceType(client);
  if (type === 'free_session') return 'FREE SESSION';
  return ((pkg?.name || serviceTypeLabel(type)) + (pkg && pkg.weeks ? ` (${pkg.perWeek || 1} x week)` : '')).toUpperCase();
}

function getLessonServiceType(lesson, client = null) {
  return lesson?.lessonType || getClientServiceType(client || getClient(lesson?.clientId));
}

function getDuoPartner(lesson) {
  if (!lesson?.duoGroupId) return null;
  return state.lessons.find(l => l.duoGroupId === lesson.duoGroupId && l.id !== lesson.id) || null;
}

function getLessonDisplayTitle(lesson) {
  const client = getClient(lesson.clientId);
  const partner = getDuoPartner(lesson);
  const partnerName = partner ? ` + ${getClientFullName(getClient(partner.clientId))}` : '';
  return `${getClientFullName(client)}${partnerName} · ${serviceTypeLabel(getLessonServiceType(lesson, client))}`;
}

function clientHasAnyFreeSession(clientId) {
  return state.lessons.some(item => item.clientId === clientId && getLessonServiceType(item) === 'free_session' && item.status !== 'cancelled');
}

function lessonTypeForNewLesson(client) {
  return getClientServiceType(client);
}

function getVisibleAvailabilityRange() {
  if (state.calendarView === 'week') {
    const anchor = getCalendarAnchorDate();
    const monday = addDays(anchor, -((anchor.getDay() + 6) % 7));
    const sunday = addDays(monday, 7);
    return { start: `${toISO(monday)}T00:00:00`, end: `${toISO(sunday)}T23:59:59` };
  }
  if (state.calendarView === 'day') {
    const iso = state.selectedDay || todayISO();
    return { start: `${iso}T00:00:00`, end: `${iso}T23:59:59` };
  }
  const first = new Date(state.viewDate.getFullYear(), state.viewDate.getMonth(), 1);
  const startOffset = (first.getDay() + 6) % 7;
  const startDate = addDays(first, -startOffset);
  const endDate = addDays(startDate, 41);
  return { start: `${toISO(startDate)}T00:00:00`, end: `${toISO(endDate)}T23:59:59` };
}

function getExternalBusyOverlap({ date, time, duration }) {
  const start = new Date(`${date}T${String(time).slice(0,5)}:00`);
  const end = new Date(start.getTime() + Number(duration || 60) * 60000);
  return (state.googleBlockingBusy || []).find(block => {
    const bStart = new Date(block.start);
    const bEnd = new Date(block.end);
    return start < bEnd && end > bStart;
  }) || null;
}

async function refreshGoogleBlockingAvailability(force = false) {
  if (!cloud.user || !cloud.google?.connected) {
    state.googleBlockingBusy = [];
    state.googleBlockingBusyKey = '';
    return;
  }
  const range = getVisibleAvailabilityRange();
  const key = `${range.start}|${range.end}`;
  if (!force && state.googleBlockingBusyKey === key) return;
  state.googleBlockingBusyKey = key;
  try {
    const result = await googleApi('google-availability', { method: 'POST', body: range });
    state.googleBlockingBusy = Array.isArray(result.busy) ? result.busy : [];
    if (el.dayModalBackdrop?.classList.contains('show') && state.selectedDay) renderDayModal(state.selectedDay);
    if (state.calendarView === 'week') renderWeekAgenda(getCalendarAnchorDate());
    if (state.calendarView === 'day') renderDayAgenda(state.selectedDay || todayISO());
  } catch (error) {
    console.error(error);
  }
}

function updateFreeSessionDoneUi() {
  const rowLabel = document.getElementById('clientFreeSessionDoneLabel');
  const type = el.clientServiceType?.value || 'personal';
  const pkg = getPackage(el.clientPackage?.value);
  const show = type === 'free_session' || isPack99Package(pkg);
  if (rowLabel) rowLabel.style.display = show ? '' : 'none';
}

function updateClientServiceUi() {
  const type = el.clientServiceType?.value || 'personal';
  const isPersonal = type === 'personal';
  const isFreeSession = type === 'free_session';
  if (el.clientPackage) el.clientPackage.disabled = !isPersonal;
  if (el.clientPackagePrice) el.clientPackagePrice.disabled = !isPersonal;
  const toggleField = (node, visible) => {
    if (!node) return;
    node.style.display = visible ? '' : 'none';
  };
  toggleField(document.getElementById('clientPackageLabel'), !isFreeSession);
  toggleField(document.getElementById('clientPackagePriceLabel'), !isFreeSession);
  toggleField(document.getElementById('clientPackagePurchasedLabel'), !isFreeSession);
  toggleField(document.getElementById('clientPaymentStatusLabel'), !isFreeSession);
  toggleField(document.getElementById('clientPaymentModeLabel'), !isFreeSession);
  if (el.clientInstallmentsRow) el.clientInstallmentsRow.hidden = isFreeSession || el.clientPaymentMode?.value !== 'installments';
  if (isFreeSession) {
    if (el.clientPackagePurchased) el.clientPackagePurchased.value = 'no';
    if (el.clientPaymentStatus) el.clientPaymentStatus.value = 'unpaid';
    if (el.clientPaymentMode) el.clientPaymentMode.value = 'single';
    if (el.clientInstallmentsTotal) el.clientInstallmentsTotal.value = '2';
    if (el.clientInstallmentsPaid) el.clientInstallmentsPaid.value = '0';
  }
  updateFreeSessionDoneUi();
  const preview = document.getElementById('packagePreview');
  if (!preview) return;
  if (type === 'free_session') {
    preview.innerHTML = '<strong>FREE SESSION</strong><div class="muted small">1 sola sessione gratuita da fissare.</div>';
    return;
  }
  const pkg = getPackage(el.clientPackage?.value);
  const freeDone = el.clientFreeSessionDone?.value === 'yes';
  if (isPack99Package(pkg)) {
    preview.innerHTML = `<strong>PACK99</strong><div class="muted small">${freeDone ? '3 lezioni personal.' : '1 free session + 3 lezioni personal.'}</div>`;
    return;
  }
  preview.innerHTML = buildPackageSummary(pkg, Number(el.clientPackagePrice?.value || pkg?.totalPrice || 0));
}
