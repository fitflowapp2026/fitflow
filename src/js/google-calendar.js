function resetGoogleState() {
  cloud.google = {
    connected: false,
    calendarId: '',
    calendarName: '',
    googleEmail: '',
    lastError: '',
    lastSyncAt: '',
    syncing: false
  };
  updateGoogleUi();
}

function updateGoogleUi() {
  const loggedIn = Boolean(cloud.user);
  const connected = Boolean(cloud.google?.connected);
  const baseStatus = !loggedIn ? 'Accedi prima' : connected ? 'Connesso' : 'Non collegato';
  if (el.googleStatusLabel) el.googleStatusLabel.textContent = cloud.google?.syncing ? 'Sync in corso' : baseStatus;
  let hint = 'Accedi per collegare Google Calendar.';
  if (loggedIn && connected) {
    const parts = [cloud.google.calendarName || 'DSWORLD Clienti'];
    if (cloud.google.googleEmail) parts.push(cloud.google.googleEmail);
    parts.push('sync automatica attiva');
    hint = parts.join(' • ');
  } else if (loggedIn) {
    hint = 'Collega Google per creare e sincronizzare automaticamente il calendario DSWORLD Clienti. Gli altri calendari Google selezionati sul tuo account bloccano gli slot non disponibili.';
  }
  if (cloud.google?.lastError) hint = `${hint} • ${cloud.google.lastError}`;
  if (el.googleStatusHint) el.googleStatusHint.textContent = hint;
  if (el.connectGoogleBtn) el.connectGoogleBtn.textContent = connected ? 'Ricollega Google Calendar' : 'Collega Google Calendar';
  if (el.googleResyncBtn) el.googleResyncBtn.disabled = !loggedIn || !connected || cloud.google?.syncing;
  if (el.disconnectGoogleBtn) el.disconnectGoogleBtn.disabled = !loggedIn || !connected || cloud.google?.syncing;
}

async function googleApi(path, { method = 'GET', body = null } = {}) {
  const token = getAuthToken();
  if (!token) throw new Error('Login richiesto.');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  try {
    const cacheBust = path === 'google-status' ? `?_=${Date.now()}` : '';
    const response = await fetch(`${GOOGLE_FN_BASE}/${path}${cacheBust}`, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        ...(body ? { 'Content-Type': 'application/json' } : {})
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    });
    let payload = {};
    try { payload = await response.json(); } catch (error) { payload = {}; }
    if (!response.ok) throw new Error(payload.error || payload.message || `HTTP ${response.status}`);
    return payload;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function refreshGoogleStatus() {
  if (!cloud.user || !cloud.client || cloud.allowLocalOnly) {
    resetGoogleState();
    return false;
  }
  try {
    const data = await googleApi('google-status');
    cloud.google.connected = Boolean(data.connected);
    cloud.google.calendarId = data.calendarId || '';
    cloud.google.calendarName = data.calendarName || 'DSWORLD Clienti';
    cloud.google.googleEmail = data.googleEmail || '';
    cloud.google.lastError = '';
  } catch (error) {
    console.error(error);
    cloud.google.connected = false;
    cloud.google.calendarId = '';
    cloud.google.calendarName = '';
    cloud.google.googleEmail = '';
    cloud.google.lastError = 'stato Google non disponibile';
  }
  updateGoogleUi();
  return cloud.google.connected;
}

function buildGoogleSyncPayload(lessonLike) {
  const lessonId = lessonLike?.id || lessonLike;
  const lesson = getLesson(lessonId) || (typeof lessonLike === 'object' ? lessonLike : null);
  if (!lesson) return null;
  const client = getClient(lesson.clientId);
  const plan = getPlan(lesson.planId);
  const pkg = getPackage(plan?.packageId);
  return {
    ...lesson,
    googleEventId: lesson.googleEventId || lessonLike?.googleEventId || '',
    clientName: lesson.clientName || getClientFullName(client) || 'Cliente',
    clientEmail: client?.email || '',
    sendCalendarInvite: !!(client?.sendCalendarInvite === true || client?.sendCalendarInvite === 'yes'),
    clientNotes: lesson.clientNotes || client?.notes || '',
    packageName: lesson.packageName || pkg?.name || '',
    serviceType: getLessonServiceType(lesson, client),
    clientServiceType: getClientServiceType(client),
    planStartDate: lesson.planStartDate || plan?.startDate || '',
    calendarTimeZone: 'Europe/Rome'
  };
}

function queueGoogleTask(task, { silent = true } = {}) {
  if (!cloud.googleQueue) cloud.googleQueue = Promise.resolve();
  cloud.googleQueue = cloud.googleQueue.then(task).catch(error => {
    console.error(error);
    cloud.google.lastError = error.message || 'errore sync Google';
    updateGoogleUi();
    if (!silent) showToast('Sync Google non riuscita.', 'error');
  });
  return cloud.googleQueue;
}

function shouldSkipGoogleCreateForLesson(action, payload, { allowCreateWithoutEventId = false } = {}) {
  if (!payload) return true;
  const isDelete = action === 'delete';
  const isTerminalStatus = payload.status === 'done' || payload.status === 'cancelled';
  if ((isDelete || isTerminalStatus) && !payload.googleEventId && !allowCreateWithoutEventId) {
    console.warn('[DSWORLD Google Sync] Sync evitata per lezione senza googleEventId:', payload.id, 'azione:', action, 'stato:', payload.status);
    return true;
  }
  return false;
}

async function requestGoogleLessonSync(action, lessonLike, { silent = true, allowCreateWithoutEventId = false } = {}) {
  if (!cloud.user || !cloud.google?.connected) return { skipped: true };
  const payload = buildGoogleSyncPayload(lessonLike);
  if (!payload) return { skipped: true };
  const isDelete = action === 'delete';
  if (shouldSkipGoogleCreateForLesson(action, payload, { allowCreateWithoutEventId })) return { skipped: true, reason: 'missing_google_event_id' };
  return queueGoogleTask(async () => {
    cloud.google.syncing = true;
    cloud.google.lastError = '';
    updateGoogleUi();
    const result = await googleApi('google-sync', { method: 'POST', body: { action, lesson: payload } });
    cloud.google.syncing = false;
    cloud.google.lastSyncAt = new Date().toISOString();
    cloud.google.lastError = '';
    if (action !== 'delete' && result?.googleEventId) {
      const liveLesson = getLesson(payload.id);
      if (liveLesson && liveLesson.googleEventId !== result.googleEventId) {
        liveLesson.googleEventId = result.googleEventId;
        saveState();
      }
    }
    if (result?.calendarName) cloud.google.calendarName = result.calendarName;
    updateGoogleUi();
    return result;
  }, { silent: isDelete ? false : silent });
}

async function syncAllLessonsToGoogle(showToastOnSuccess = true) {
  if (!cloud.user) {
    showToast('Accedi prima.');
    return false;
  }
  if (!cloud.google?.connected) {
    showToast('Collega Google Calendar.');
    return false;
  }
  const lessons = state.lessons.map(item => buildGoogleSyncPayload(item)).filter(Boolean);
  cloud.google.syncing = true;
  cloud.google.lastError = '';
  updateGoogleUi();
  try {
    const result = await googleApi('google-replay-sync', { method: 'POST', body: { lessons } });
    let changed = false;
    (result.mappings || []).forEach(mapping => {
      const lesson = getLesson(mapping.id);
      if (lesson && mapping.googleEventId && lesson.googleEventId !== mapping.googleEventId) {
        lesson.googleEventId = mapping.googleEventId;
        changed = true;
      }
    });
    if (changed) saveState();
    cloud.google.lastSyncAt = new Date().toISOString();
    updateGoogleUi();
    if (showToastOnSuccess) showToast(`Google aggiornato: ${result.synced || 0} lezioni.`);
    return true;
  } catch (error) {
    console.error(error);
    cloud.google.lastError = error.message || 'errore sync Google';
    updateGoogleUi();
    showToast('Sync Google non riuscita.', 'error');
    return false;
  } finally {
    cloud.google.syncing = false;
    updateGoogleUi();
  }
}

async function startGoogleCalendarConnect() {
  if (!cloud.user) {
    showToast('Accedi prima.');
    return;
  }
  try {
    const result = await googleApi('google-auth-start', {
      method: 'POST',
      body: { returnTo: `${window.location.origin}${window.location.pathname}` }
    });
    if (!result.url) throw new Error('URL Google non disponibile.');
    window.location.href = result.url;
  } catch (error) {
    console.error(error);
    showToast('Connessione Google non riuscita.', 'error');
  }
}

async function disconnectGoogleCalendar() {
  if (!cloud.user || !cloud.google?.connected) return;
  try {
    await googleApi('google-disconnect', { method: 'POST' });
    resetGoogleState();
    showToast('Google Calendar scollegato.', 'ok');
  } catch (error) {
    console.error(error);
    showToast('Scollegamento non riuscito.', 'error');
  }
}

function migrateLegacy(parsed) {
  const packages = [];
  const packageMap = new Map();
  const clients = [];
  const plans = [];
  const lessons = [];

  function getOrCreateLegacyPackage(client) {
    const key = [client.totalLessons, client.packageWeeks, client.sessionsPerWeek, client.lessonDuration].join('|');
    if (packageMap.has(key)) return packageMap.get(key);
    const pkg = {
      id: uid('pkg'),
      name: `${client.totalLessons} lez / ${client.packageWeeks} sett`,
      lessonsTotal: Number(client.totalLessons || 12),
      weeks: Number(client.packageWeeks || 8),
      perWeek: Number(client.sessionsPerWeek || 2),
      duration: Number(client.lessonDuration || 60),
      totalPrice: Number(client.packagePrice || 0),
      createdAt: client.createdAt || new Date().toISOString()
    };
    packages.push(pkg);
    packageMap.set(key, pkg.id);
    return pkg.id;
  }

  (parsed.clients || []).forEach(oldClient => {
    const packageId = getOrCreateLegacyPackage(oldClient);
    const clientId = oldClient.id || uid('client');
    const planId = uid('plan');
    const clientLessons = (parsed.lessons || []).filter(item => item.clientId === oldClient.id);
    const firstLesson = clientLessons.filter(item => item.status !== 'cancelled').map(item => item.date).sort()[0] || String(oldClient.createdAt || todayISO()).slice(0, 10);
    const legacyName = oldClient.name || 'Cliente';
    const legacyParts = splitFullName(legacyName);
    clients.push({
      id: clientId,
      firstName: legacyParts.firstName,
      lastName: legacyParts.lastName,
      name: legacyName,
      email: '',
      sendCalendarInvite: false,
      notes: oldClient.notes || '',
      serviceType: 'personal',
      freeSessionDone: true,
      packagePurchased: true,
      conversionStatus: 'path_started',
      scheduleMode: oldClient.defaultTime ? 'same' : 'different',
      fixedTime: oldClient.defaultTime || '',
      activePlanId: planId,
      createdAt: oldClient.createdAt || new Date().toISOString()
    });
    plans.push({
      id: planId,
      clientId,
      packageId,
      startDate: firstLesson,
      checkMode: normalizeCheckMode(oldClient.checkMode),
      saleType: 'new',
      createdAt: oldClient.createdAt || new Date().toISOString()
    });
    clientLessons.forEach(oldLesson => lessons.push({
      id: oldLesson.id || uid('lesson'),
      clientId,
      planId,
      date: oldLesson.date,
      time: oldLesson.time,
      duration: Number(oldLesson.duration || oldClient.lessonDuration || 60),
      status: oldLesson.status === 'completed' ? 'done' : oldLesson.status || 'scheduled',
      note: oldLesson.note || '',
      linkedTo: oldLesson.linkedTo || null,
      createdAt: oldLesson.createdAt || new Date().toISOString()
    }));
  });

  return {
    clients,
    packages: packages.length ? packages : seedPackages(),
    plans,
    lessons,
    selectedClientId: clients[0]?.id || null,
    viewDate: toISO(startOfMonth(new Date()))
  };
}
