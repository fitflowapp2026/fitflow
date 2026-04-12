function selectClient(clientId) {
  state.selectedClientId = clientId;
  saveState(true);
  renderAll();
  /* Se è un cliente free session con lezione già svolta → proponi conversione */
  const client = getClient(clientId);
  if (client && getClientServiceType(client) === 'free_session' && client.conversionStatus !== 'path_started') {
    const hasDone = getLessonsForClient(clientId).some(l => l.status === 'done');
    if (hasDone) setTimeout(() => openFreeSessionConversionModal(client), 300);
  }
}

function quickAddFromDate(date) {
  openDayModal(date);
}

function renderTimeModal() {
  if (!state.pendingAdd) return;
  const client = getClient(state.pendingAdd.clientId);
  el.timeModalTitle.textContent = client?.scheduleMode === 'same' ? 'Primo orario' : 'Scegli orario';
  el.timeModalSubtitle.textContent = `${getClientFullName(client) || 'Cliente'} • ${formatDateFancy(state.pendingAdd.date)}`;
  const suggestions = [...new Set([...getUsualTimes(state.pendingAdd.clientId), ...getDefaultTimes()])].slice(0, 8);
  el.timeManualInput.value = state.pendingTimeValue || '';
  el.timeSuggestionChips.innerHTML = suggestions.map(time => `<button class="time-chip ${time === state.pendingTimeValue ? 'active' : ''}" data-time="${time}">${time}</button>`).join('');
  el.timeSuggestionChips.querySelectorAll('[data-time]').forEach(button => {
    button.addEventListener('click', () => {
      state.pendingTimeValue = button.getAttribute('data-time');
      el.timeManualInput.value = state.pendingTimeValue;
      renderTimeModal();
    });
  });
}

function createLesson({ clientId, planId, date, time, duration, setFixedTime = false, note = '', linkedTo = null, duoGroupId = null }) {
  const client = getClient(clientId);
  if (!client || !time) {
    showToast('Inserisci un orario.');
    return false;
  }
  if (!canUsePlanSlot(planId)) {
    showToast('Hai raggiunto il numero massimo di lezioni del pacchetto.', 'warn');
    return false;
  }
  if (state.lessons.some(item => item.clientId === clientId && item.date === date && item.time === time && item.status !== 'cancelled')) {
    showToast('Cliente già inserito in questo slot.', 'warn');
    return false;
  }
  if (hasTimeConflict({ date, time, duration, duoGroupId })) {
    showToast('Conflitto di orario.', 'warn');
    return false;
  }
  const lesson = {
    id: uid('lesson'),
    clientId,
    planId,
    date,
    time,
    duration: Number(duration || 60),
    status: 'scheduled',
    note,
    linkedTo,
    duoGroupId,
    googleEventId: '',
    createdAt: new Date().toISOString()
  };
  state.lessons.push(lesson);
  if (setFixedTime && client.scheduleMode === 'same' && !client.fixedTime) client.fixedTime = time;
  saveState(true);
  renderAll();
  requestGoogleLessonSync('upsert', lesson, { allowCreateWithoutEventId: true });
  showToast(`Lezione inserita: ${formatDateFancy(date)} • ${time}`);
  return lesson;
}

function openLessonModal(lessonId) {
  state.selectedLessonId = lessonId;
  const lesson = getLesson(lessonId);
  if (!lesson) return;
  const client = getClient(lesson.clientId);
  const plan = getPlan(lesson.planId);
  const pkg = getPackage(plan?.packageId);
  const quickTimes = [...new Set([lesson.time, client?.fixedTime, ...getUsualTimes(lesson.clientId), ...getDefaultTimes()].filter(Boolean))].slice(0, 8);
  const suggestions = getSuggestedReschedules(lesson);
  el.lessonModalTitle.textContent = getClientFullName(client) || 'Lezione';
  el.lessonModalSubtitle.textContent = `${formatDateFancy(lesson.date)} • ${pkg?.duration || lesson.duration} min`;
  el.lessonTimeInput.value = lesson.time;
  el.lessonNoteInput.value = lesson.note || '';
  el.lessonQuickTimes.innerHTML = quickTimes.map(time => `<button class="time-chip ${time === lesson.time ? 'active' : ''}" data-time="${time}">${time}</button>`).join('');
  el.lessonQuickTimes.querySelectorAll('[data-time]').forEach(button => {
    button.addEventListener('click', () => applyLessonTime(button.getAttribute('data-time')));
  });
  el.rescheduleList.innerHTML = suggestions.length ? suggestions.map(item => `
    <button class="suggestion-btn" data-date="${item.date}" data-time="${item.time}">${formatDateFancy(item.date)} • ${item.time}</button>
  `).join('') : '<div class="empty" style="grid-column:1/-1;">Nessun suggerimento</div>';
  el.rescheduleList.querySelectorAll('[data-date]').forEach(button => {
    button.addEventListener('click', () => rescheduleCancelledLesson({ date: button.getAttribute('data-date'), time: button.getAttribute('data-time') }));
  });

  // ── Sezione DUO ──────────────────────────────────────────
  const partner = getDuoPartner(lesson);
  if (partner) {
    // Ha già un partner → mostra badge e bottone scollega
    const partnerClient = getClient(partner.clientId);
    el.duoPartnerBadge.textContent = `👥 ${getClientFullName(partnerClient)}`;
    el.duoPartnerRow.style.display = 'flex';
    el.duoAddRow.style.display = 'none';
    el.duoUnlinkBtn.onclick = () => unlinkDuoLesson(lesson.id);
  } else {
    // Nessun partner → mostra selector con gli altri clienti
    el.duoPartnerRow.style.display = 'none';
    el.duoAddRow.style.display = 'grid';
    const otherClients = state.clients.filter(c => c.id !== lesson.clientId && getActivePlan(c.id));
    el.duoClientSelect.innerHTML = otherClients.length
      ? otherClients.map(c => `<option value="${c.id}">${escapeHtml(getClientFullName(c))}</option>`).join('')
      : '<option value="">Nessun cliente con pacchetto attivo</option>';
    el.duoLinkBtn.disabled = !otherClients.length;
    el.duoLinkBtn.onclick = () => {
      const selectedId = el.duoClientSelect.value;
      if (selectedId) createDuoLesson(lesson.id, selectedId);
    };
  }

  openModal('lessonModalBackdrop');
}

function applyLessonStatus(status) {
  const lesson = getLesson(state.selectedLessonId);
  if (!lesson) return;
  if (lesson.status === 'cancelled' && status !== 'cancelled' && !canUsePlanSlot(lesson.planId, lesson.id)) {
    showToast('Pacchetto pieno: non puoi riattivare questa lezione.', 'warn');
    return;
  }
  lesson.status = status;
  // Sincronizza stato al partner DUO
  const duoPartnerStatus = getDuoPartner(lesson);
  if (duoPartnerStatus) {
    duoPartnerStatus.status = status;
    requestGoogleLessonSync('upsert', duoPartnerStatus);
  }
  saveState(true);
  renderAll();
  requestGoogleLessonSync('upsert', lesson);
  openLessonModal(lesson.id);
  showToast('Stato aggiornato.', 'ok');

  /* Free session completata → apri modale conversione */
  if (status === 'done') {
    const client = getClient(lesson.clientId);
    if (client && getClientServiceType(client) === 'free_session' && client.conversionStatus !== 'path_started') {
      setTimeout(() => openFreeSessionConversionModal(client), 350);
    }
  }
}

function applyLessonTime(time) {
  const lesson = getLesson(state.selectedLessonId);
  if (!lesson) return;
  if (hasTimeConflict({ lessonId: lesson.id, date: lesson.date, time, duration: lesson.duration })) {
    showToast('Conflitto di orario.', 'warn');
    return;
  }
  lesson.time = time;
  const client = getClient(lesson.clientId);
  if (client?.scheduleMode === 'same') client.fixedTime = time;
  saveState(true);
  renderAll();
  requestGoogleLessonSync('upsert', lesson);
  openLessonModal(lesson.id);
  showToast('Orario aggiornato.', 'ok');
}

function saveLessonDetails() {
  const lesson = getLesson(state.selectedLessonId);
  if (!lesson) return;
  const newTime = el.lessonTimeInput.value;
  if (!newTime) {
    showToast('Inserisci un orario.');
    return;
  }
  if (hasTimeConflict({ lessonId: lesson.id, date: lesson.date, time: newTime, duration: lesson.duration })) {
    showToast('Conflitto di orario.', 'warn');
    return;
  }
  lesson.time = newTime;
  lesson.note = el.lessonNoteInput.value.trim();
  const client = getClient(lesson.clientId);
  if (client?.scheduleMode === 'same') client.fixedTime = newTime;
  // Sincronizza orario e nota al partner DUO
  const duoPartnerSave = getDuoPartner(lesson);
  if (duoPartnerSave) {
    duoPartnerSave.time = newTime;
    duoPartnerSave.note = lesson.note;
    requestGoogleLessonSync('upsert', duoPartnerSave);
  }
  saveState();
  renderAll();
  requestGoogleLessonSync('upsert', lesson);
  openLessonModal(lesson.id);
  showToast('Lezione salvata.', 'ok');
}

/* ── DUO: collega un secondo cliente a una lezione esistente ── */
function createDuoLesson(existingLessonId, partnerClientId) {
  const existingLesson = getLesson(existingLessonId);
  if (!existingLesson) return;
  const partnerClient = getClient(partnerClientId);
  if (!partnerClient) { showToast('Cliente non trovato.', 'warn'); return; }
  if (existingLesson.clientId === partnerClientId) { showToast('Scegli un cliente diverso.', 'warn'); return; }

  const partnerPlan = getActivePlan(partnerClientId);
  const partnerPkg = getPackage(partnerPlan?.packageId);
  if (!partnerPlan || !partnerPkg) { showToast('Pacchetto mancante per il secondo cliente.', 'warn'); return; }

  // Genera un duoGroupId condiviso (o riusa quello esistente)
  const duoGroupId = existingLesson.duoGroupId || uid('duo');
  existingLesson.duoGroupId = duoGroupId;

  const ok = createLesson({
    clientId: partnerClientId,
    planId: partnerPlan.id,
    date: existingLesson.date,
    time: existingLesson.time,
    duration: existingLesson.duration,
    note: existingLesson.note || '',
    duoGroupId,
  });
  if (ok) {
    saveState(true);
    renderAll();
    openLessonModal(existingLessonId);
    showToast('Lezione DUO collegata.', 'ok');
  } else {
    // rollback duoGroupId se createLesson ha fallito
    existingLesson.duoGroupId = null;
  }
}

function unlinkDuoLesson(lessonId) {
  const lesson = getLesson(lessonId);
  if (!lesson?.duoGroupId) return;
  const partner = getDuoPartner(lesson);
  showConfirm('Scollega DUO', `Le due lezioni diventeranno indipendenti. I pacchetti non vengono modificati.`, () => {
    if (partner) partner.duoGroupId = null;
    lesson.duoGroupId = null;
    saveState(true);
    renderAll();
    openLessonModal(lesson.id);
    showToast('Lezioni scollegate.', 'ok');
  });
}

function rescheduleCancelledLesson({ date, time }) {
  const lesson = getLesson(state.selectedLessonId);
  if (!lesson) return;
  const wasCancelled = lesson.status === 'cancelled';
  if (!wasCancelled) {
    lesson.status = 'cancelled';
    saveState();
    requestGoogleLessonSync('upsert', lesson);
  }
  const ok = createLesson({
    clientId: lesson.clientId,
    planId: lesson.planId,
    date,
    time,
    duration: lesson.duration,
    note: `Recupero della lezione del ${formatDateShort(lesson.date)}`,
    linkedTo: lesson.id,
    setFixedTime: false
  });
  if (ok) openLessonModal(lesson.id);
}

function deleteLesson() {
  const lesson = getLesson(state.selectedLessonId);
  if (!lesson) return;
  const partner = getDuoPartner(lesson);
  const confirmMsg = partner
    ? `Questa è una lezione DUO: verranno eliminate sia la lezione di ${getClientFullName(getClient(lesson.clientId))} che quella di ${getClientFullName(getClient(partner.clientId))}. Questa azione non è reversibile.`
    : 'La lezione verrà rimossa definitivamente. Questa azione non è reversibile.';
  showConfirm('Elimina lezione', confirmMsg, () => {
    const deletedPayload = buildGoogleSyncPayload(lesson);
    state.lessons = state.lessons.filter(item => item.id !== lesson.id);
    if (partner) {
      const partnerPayload = buildGoogleSyncPayload(partner);
      state.lessons = state.lessons.filter(item => item.id !== partner.id);
      requestGoogleLessonSync('delete', partnerPayload);
    }
    saveState(true);
    renderAll();
    requestGoogleLessonSync('delete', deletedPayload);
    closeModal('lessonModalBackdrop');
    showToast(partner ? 'Lezione DUO eliminata.' : 'Lezione eliminata.', 'ok');
  });
}
