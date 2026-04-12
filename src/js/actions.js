function openNewClientModal(trigger = document.activeElement) {
  requestAnimationFrame(() => renderClientModal(null, trigger));
}

document.getElementById('openClientBtn').addEventListener('click', event => openNewClientModal(event.currentTarget));
document.getElementById('openPackagesBtn').addEventListener('click', () => { renderPackages(); openModal('packagesModalBackdrop'); });
document.getElementById('openReportBtn').addEventListener('click', () => { renderReport(); openModal('reportModalBackdrop'); });
el.exportManagedXlsxBtn.addEventListener('click', exportManagedXlsx);
document.getElementById('prevMonthBtn').addEventListener('click', () => moveCalendar(-1));
document.getElementById('nextMonthBtn').addEventListener('click', () => moveCalendar(1));
document.getElementById('todayBtn').addEventListener('click', resetCalendarToToday);
const handleResize = throttle(() => { applyResponsiveDefaults(); renderCalendarHead(); renderCalendar(); }, 140);
window.addEventListener('resize', handleResize);
document.getElementById('exportBtn').addEventListener('click', exportBackup);
document.getElementById('importInput').addEventListener('change', event => importBackup(event.target.files?.[0]));
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => {
  const id = button.getAttribute('data-close');
  if (id === 'messagesModalBackdrop') {
    document.querySelector('.messages-modal-body')?.classList.remove('show-chat');
    _activeMsgClientToken = null;
    _activeMsgClientId = null;
  }
  closeModal(id);
}));
document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.addEventListener('click', event => { if (event.target === backdrop) closeModal(backdrop.id); }));

document.querySelectorAll('[data-auth-tab]').forEach(button => {
  button.addEventListener('click', () => setAuthTab(button.getAttribute('data-auth-tab')));
});
el.saveSupabaseConfigBtn.addEventListener('click', () => saveCloudConfigFromInputs());
el.saveCloudConfigBtn.addEventListener('click', () => saveCloudConfigFromInputs());
el.useDemoLocalBtn.addEventListener('click', () => {
  cloud.allowLocalOnly = true;
  updateUserBadge();
  updateSyncBadge('Solo cache locale');
  updateAuthMessage('Modalità locale attiva. Nessuna sincronizzazione cloud.');
  renderAll();
});
el.openAccountBtn.addEventListener('click', async () => { populateCloudConfigInputs(); await refreshGoogleStatus(); openModal('accountModalBackdrop'); });
el.manualSyncBtn.addEventListener('click', async () => {
  const ok = await syncStateToCloud(true);
  if (ok) showToast('Sincronizzazione completata.');
});
el.connectGoogleBtn.addEventListener('click', startGoogleCalendarConnect);
el.googleResyncBtn.addEventListener('click', () => syncAllLessonsToGoogle(true));
el.disconnectGoogleBtn.addEventListener('click', disconnectGoogleCalendar);
el.logoutBtnModal.addEventListener('click', logoutCloud);
el.showResetTabBtn.addEventListener('click', () => {
  el.authResetEmail.value = el.authLoginEmail.value.trim();
  setAuthTab('reset');
});
el.sendResetPasswordBtn.addEventListener('click', () => {
  const email = cloud.user?.email || el.authLoginEmail.value.trim() || el.authResetEmail.value.trim();
  sendPasswordReset(email);
});
el.loginPanel.addEventListener('submit', event => {
  event.preventDefault();
  signInWithPassword(el.authLoginEmail.value.trim(), el.authLoginPassword.value);
});
el.signupPanel.addEventListener('submit', event => {
  event.preventDefault();
  signUpWithPassword(el.authSignupEmail.value.trim(), el.authSignupPassword.value);
});
el.resetPanel.addEventListener('submit', event => {
  event.preventDefault();
  sendPasswordReset(el.authResetEmail.value.trim());
});
el.passwordUpdateForm.addEventListener('submit', event => {
  event.preventDefault();
  updatePasswordFromRecovery(el.passwordUpdateInput.value);
});

el.clientSearch.addEventListener('input', event => { state.search = event.target.value; renderClientList(); });
if (el.clientFilterRow) {
  el.clientFilterRow.querySelectorAll('[data-client-filter]').forEach(button => {
    button.addEventListener('click', () => {
      state.clientFilter = button.getAttribute('data-client-filter');
      /* sync aria-pressed state */
      el.clientFilterRow.querySelectorAll('[data-client-filter]').forEach(b => {
        const isActive = b.getAttribute('data-client-filter') === state.clientFilter;
        b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
      renderClientList();
    });
  });
}
if (el.calendarQuickSearch) {
  el.calendarQuickSearch.addEventListener('input', event => {
    state.calendarQuickSearch = event.target.value;
    renderCalendarQuickSearchResults();
  });
  el.calendarQuickSearch.addEventListener('focus', () => renderCalendarQuickSearchResults());
  el.calendarQuickSearch.addEventListener('blur', () => {
    setTimeout(() => {
      state.calendarQuickSearch = '';
      renderCalendarQuickSearchResults();
    }, 120);
  });
}
el.calendarViewButtons.forEach(button => button.addEventListener('click', () => setCalendarView(button.getAttribute('data-calendar-view'))));
el.clientPackage.addEventListener('change', () => {
  const serviceType = el.clientServiceType?.value || 'personal';
  let pkg = getPackage(el.clientPackage.value);
  if (serviceType === 'free_session') pkg = ensureSpecialPackage('free_session');
  if (el.clientPackagePrice && pkg) el.clientPackagePrice.value = Number(pkg.totalPrice || 0);
  el.packagePreview.innerHTML = buildPackageSummary(pkg, Number(el.clientPackagePrice?.value || pkg?.totalPrice || 0));
  renderClientWeekdayPicker(getSelectedClientWeekdays().length ? getSelectedClientWeekdays() : [normalizeWeekday(fromISO(el.clientStartDate.value || todayISO()).getDay())], Math.max(1, Number(pkg?.perWeek || 1)));
  updateFixedScheduleUI();
  if (el.clientPackagePrice && pkg) el.clientPackagePrice.value = Number(pkg.totalPrice || 0);
  updateClientServiceUi();
  renderFixedSchedulePreview();
});
el.clientStartDate.addEventListener('change', () => {
  if (!getSelectedClientWeekdays().length) {
    const serviceType = el.clientServiceType?.value || 'personal';
  let pkg = getPackage(el.clientPackage.value);
  if (serviceType === 'free_session') pkg = ensureSpecialPackage('free_session');
    renderClientWeekdayPicker([normalizeWeekday(fromISO(el.clientStartDate.value || todayISO()).getDay())], Math.max(1, Number(pkg?.perWeek || 1)));
  }
  renderFixedSchedulePreview();
});
el.clientFixedTime.addEventListener('input', renderFixedSchedulePreview);
if (el.clientPackagePrice) el.clientPackagePrice.addEventListener('input', () => {
  const pkg = getPackage(el.clientPackage?.value);
  if (el.packagePreview) el.packagePreview.innerHTML = buildPackageSummary(pkg, Number(el.clientPackagePrice?.value || pkg?.totalPrice || 0));
});
el.clientPaymentMode.addEventListener('change', updateInstallmentsUI);
el.clientPaymentStatus.addEventListener('change', updateInstallmentsUI);
// Aggiorna paymentStatus in tempo reale quando si cambiano le rate
if (el.clientInstallmentsTotal) el.clientInstallmentsTotal.addEventListener('input', updateInstallmentsUI);
if (el.clientInstallmentsPaid)  el.clientInstallmentsPaid.addEventListener('input', updateInstallmentsUI);
document.querySelectorAll('input[name="scheduleMode"]').forEach(input => input.addEventListener('change', () => {
  updateFixedScheduleUI();
  renderFixedSchedulePreview();
}));
el.clientServiceType.addEventListener('change', () => { updateClientServiceUi(); updateFixedScheduleUI(); renderFixedSchedulePreview(); });
el.clientFreeSessionDone.addEventListener('change', () => { updateClientServiceUi(); updateFixedScheduleUI(); renderFixedSchedulePreview(); });
el.renewPackage.addEventListener('change', () => { el.renewPreview.innerHTML = buildPackageSummary(getPackage(el.renewPackage.value)); });
el.reportFilterBar?.querySelectorAll('[data-report-filter]').forEach(button => button.addEventListener('click', () => { state.reportFilter = button.getAttribute('data-report-filter') || 'all'; applyReportFilter(); }));

el.clientForm.addEventListener('submit', event => {
  event.preventDefault();
  const firstName = el.clientName.value.trim();
  const lastName = el.clientSurname.value.trim();
  const name = [firstName, lastName].filter(Boolean).join(' ').trim();
  if (!firstName || !lastName) { showToast('Inserisci nome e cognome.'); return; }
  const serviceType = el.clientServiceType.value || 'personal';
  const clientEmail = (el.clientEmail?.value || '').trim();
  const sendCalendarInvite = el.clientSendCalendarInvite?.value === 'yes';
  if (sendCalendarInvite && !clientEmail) { showToast('Inserisci l\'email del cliente per inviare il calendario.'); return; }
  const freeSessionDone = el.clientFreeSessionDone.value === 'yes';
  const packagePurchased = el.clientPackagePurchased.value === 'yes';
  const conversionStatus = el.clientConversionStatus.value || 'path_started';
  const paymentMode = el.clientPaymentMode.value || 'single';
  const installmentsTotal = paymentMode === 'installments' ? Math.min(3, Math.max(2, Number(el.clientInstallmentsTotal.value || 2))) : 2;
  const installmentsPaid = paymentMode === 'installments' ? Math.max(0, Math.min(installmentsTotal, Number(el.clientInstallmentsPaid.value || 0))) : 0;
  // Se modalità rate: lo stato si deriva dalle rate (non dal select) — evita incoerenze
  const paymentStatusRaw = el.clientPaymentStatus.value || 'unpaid';
  const paymentStatus = paymentMode === 'installments'
    ? (installmentsPaid >= installmentsTotal ? 'paid' : installmentsPaid > 0 ? 'partial' : 'unpaid')
    : paymentStatusRaw;
  const normalizedPaymentStatus = serviceType === 'free_session' ? null : paymentStatus;
  const normalizedPaymentMode = serviceType === 'free_session' ? null : paymentMode;
  const normalizedInstallmentsTotal = serviceType === 'free_session' ? 0 : installmentsTotal;
  const normalizedInstallmentsPaid = serviceType === 'free_session' ? 0 : installmentsPaid;
  let packageId = el.clientPackage.value;
  let pkg = getPackage(packageId);
  if (serviceType === 'free_session') {
    pkg = ensureSpecialPackage('free_session');
    packageId = pkg.id;
  }
  if (!pkg) { showToast('Crea prima un pacchetto.'); return; }
  const packageIsPack99 = isPack99Package(pkg);
  const scheduleMode = document.querySelector('input[name="scheduleMode"]:checked')?.value || 'same';
  const fixedTime = scheduleMode === 'same' ? el.clientFixedTime.value : '';
  const fixedDays = scheduleMode === 'same' ? getSelectedClientWeekdays() : [];
  const variableSchedule = scheduleMode === 'different' ? getVariableScheduleSelections() : [];
  const requiredDays = Math.max(1, Number(pkg.perWeek || 1));
  if (scheduleMode === 'same' && fixedTime && fixedDays.length !== requiredDays) {
    showToast(`Seleziona ${requiredDays} ${requiredDays === 1 ? 'giorno fisso' : 'giorni fissi'} per il piano rapido.`);
    return;
  }
  if (scheduleMode === 'different' && variableSchedule.length && variableSchedule.length !== requiredDays) {
    showToast(`Seleziona ${requiredDays} giorni con orari specifici per il piano rapido.`);
    return;
  }
  const currentId = el.clientId.value;
  if (currentId) {
    const client = getClient(currentId);
    const plan = getActivePlan(currentId);
    if (!client || !plan) return;
    client.firstName = firstName;
    client.lastName = lastName;
    client.name = name;
    client.email = clientEmail;
    client.sendCalendarInvite = sendCalendarInvite;
    client.notes = el.clientNotes.value.trim();
    client.serviceType = serviceType;
    client.freeSessionDone = freeSessionDone;
    client.packagePurchased = serviceType === 'free_session' ? false : packagePurchased;
    client.conversionStatus = conversionStatus;
    client.paymentStatus = normalizedPaymentStatus;
    client.paymentMode = normalizedPaymentMode;
    client.installmentsTotal = normalizedInstallmentsTotal;
    client.installmentsPaid = normalizedInstallmentsPaid;
    client.packagePrice = Number(el.clientPackagePrice?.value || pkg?.totalPrice || 0);
    client.scheduleMode = scheduleMode;
    client.fixedTime = scheduleMode === 'same' ? fixedTime : '';
    client.fixedDays = scheduleMode === 'same' ? fixedDays : [];
    client.variableSchedule = scheduleMode === 'different' ? variableSchedule : [];
    ensureClientHistoryBuckets(client);
    pushClientPaymentSnapshot(client, 'update');
    plan.packageId = packageId;
    plan.startDate = el.clientStartDate.value;
    plan.checkMode = el.clientCheckMode.value;
    plan.totalPrice = Number(el.clientPackagePrice?.value || pkg?.totalPrice || 0);
    state.lessons = state.lessons.map(lesson => lesson.planId === plan.id ? { ...lesson, duration: pkg.duration, lessonType: lesson.lessonType || serviceType } : lesson);
    saveState(true);
    renderAll();
    closeModal('clientModalBackdrop');
    showToast('Cliente aggiornato.');
    return;
  }
  const clientId = uid('client');
  const planId = uid('plan');
  const clientPayload = {
    id: clientId,
    firstName,
    lastName,
    name,
    email: clientEmail,
    sendCalendarInvite,
    notes: el.clientNotes.value.trim(),
    shareToken: generateShareToken(),
    serviceType,
    freeSessionDone,
    packagePurchased: serviceType === 'free_session' ? false : packagePurchased,
    conversionStatus,
    paymentStatus: normalizedPaymentStatus,
    paymentMode: normalizedPaymentMode,
    installmentsTotal: normalizedInstallmentsTotal,
    installmentsPaid: normalizedInstallmentsPaid,
    packagePrice: Number(el.clientPackagePrice?.value || pkg?.totalPrice || 0),
    scheduleMode,
    fixedTime: scheduleMode === 'same' ? fixedTime : '',
    fixedDays: scheduleMode === 'same' ? fixedDays : [],
    variableSchedule: scheduleMode === 'different' ? variableSchedule : [],
    activePlanId: planId,
    createdAt: new Date().toISOString()
  };
  const planPayload = {
    id: planId,
    clientId,
    packageId,
    startDate: el.clientStartDate.value,
    checkMode: el.clientCheckMode.value,
    saleType: 'new',
    totalPrice: Number(el.clientPackagePrice?.value || pkg?.totalPrice || 0),
    planType: serviceType,
    createdAt: new Date().toISOString()
  };
  state.clients.unshift(clientPayload);
  state.plans.push(planPayload);
  state.selectedClientId = clientId;
  saveState(true);
  let plannedCount = 0;
  if (scheduleMode === 'same' && fixedTime && fixedDays.length) {
    plannedCount = createRecurringLessonsForClient({
      client: clientPayload,
      plan: planPayload,
      pkg,
      startDate: planPayload.startDate,
      weekdays: fixedDays,
      time: fixedTime,
      firstLessonType: packageIsPack99 && !freeSessionDone ? 'free_session' : serviceType,
      standardLessonType: 'personal'
    });
  } else if (scheduleMode === 'different' && variableSchedule.length) {
    plannedCount = createRecurringLessonsForClient({
      client: clientPayload,
      plan: planPayload,
      pkg,
      startDate: planPayload.startDate,
      weekdays: variableSchedule.map(item => item.weekday),
      timesByWeekday: Object.fromEntries(variableSchedule.map(item => [item.weekday, item.time])),
      firstLessonType: packageIsPack99 && !freeSessionDone ? 'free_session' : serviceType,
      standardLessonType: 'personal'
    });
  } else {
    renderAll();
  }
  closeModal('clientModalBackdrop');
  showToast(plannedCount ? `Cliente creato. ${plannedCount} lezioni già fissate.` : 'Cliente creato.');
});

el.deleteClientBtn.addEventListener('click', () => {
  const clientId = el.clientId.value;
  const client = getClient(clientId);
  if (!client) return;
  showConfirm(`Elimina ${getClientFullName(client)}`, `Verranno eliminati il cliente, tutte le sue lezioni e il piano attivo. Questa azione non è reversibile.`, () => {
    const lessonsToDelete = state.lessons.filter(item => item.clientId === clientId).map(item => buildGoogleSyncPayload(item));
    state.clients = state.clients.filter(item => item.id !== clientId);
    state.plans = state.plans.filter(item => item.clientId !== clientId);
    state.lessons = state.lessons.filter(item => item.clientId !== clientId);
    state.selectedClientId = getDefaultSelectedClientId();
    saveState(true);
    renderAll();
    lessonsToDelete.forEach(item => requestGoogleLessonSync('delete', item));
    closeModal('clientModalBackdrop');
    showToast('Cliente eliminato.', 'ok');
  });
});

el.packageForm.addEventListener('submit', event => {
  event.preventDefault();
  const payload = {
    id: el.packageId.value || uid('pkg'),
    name: el.packageName.value.trim(),
    lessonsTotal: Number(el.packageLessons.value || 0),
    weeks: Number(el.packageWeeks.value || 0),
    perWeek: Number(el.packagePerWeek.value || 0),
    duration: Number(el.packageDuration.value || 0),
    totalPrice: Number(el.packagePrice.value || 0),
    createdAt: new Date().toISOString()
  };
  if (!payload.name || !payload.lessonsTotal || !payload.weeks || !payload.perWeek || !payload.duration || payload.totalPrice < 0) {
    showToast('Completa il pacchetto.');
    return;
  }
  const idx = state.packages.findIndex(item => item.id === payload.id);
  if (idx >= 0) {
    const createdAt = state.packages[idx].createdAt;
    state.packages[idx] = { ...payload, createdAt };
  } else {
    state.packages.unshift(payload);
  }
  state.selectedPackageId = payload.id;
  saveState();
  renderAll();
  showToast('Pacchetto salvato.', 'ok');
});

document.getElementById('resetPackageBtn').addEventListener('click', resetPackageForm);

el.deletePackageBtn.addEventListener('click', () => {
  const id = el.packageId.value;
  if (!id) return;
  const used = state.plans.some(plan => plan.packageId === id);
  if (used) {
    showToast('Pacchetto già usato da un cliente.', 'warn');
    return;
  }
  showConfirm('Elimina pacchetto', 'Il pacchetto verrà rimosso definitivamente.', () => {
    state.packages = state.packages.filter(item => item.id !== id);
    saveState(true);
    resetPackageForm();
    renderAll();
    showToast('Pacchetto eliminato.', 'ok');
  });
});

el.dayAddLessonBtn.addEventListener('click', () => {
  if (!state.selectedDay) return;
  const firstFree = el.daySlotGrid.querySelector('[data-slot-time]');
  if (firstFree) firstFree.scrollIntoView({ block: 'center', behavior: 'smooth' });
});

document.getElementById('confirmTimeBtn').addEventListener('click', () => {
  if (!state.pendingAdd) return;
  const time = el.timeManualInput.value || state.pendingTimeValue;
  if (!time) { showToast('Seleziona un orario.'); return; }
  const ok = createLesson({
    clientId: state.pendingAdd.clientId,
    planId: state.pendingAdd.planId,
    date: state.pendingAdd.date,
    time,
    duration: state.pendingAdd.duration,
    setFixedTime: state.pendingAdd.shouldFix
  });
  if (ok) {
    state.pendingAdd = null;
    state.pendingTimeValue = '';
    closeModal('timeModalBackdrop');
  }
});

document.getElementById('statusScheduledBtn').addEventListener('click', () => applyLessonStatus('scheduled'));
document.getElementById('statusDoneBtn').addEventListener('click', () => applyLessonStatus('done'));
document.getElementById('statusCancelledBtn').addEventListener('click', () => applyLessonStatus('cancelled'));
document.getElementById('saveLessonBtn').addEventListener('click', saveLessonDetails);
document.getElementById('quickRecoverBtn').addEventListener('click', () => {
  const lesson = getLesson(state.selectedLessonId);
  if (!lesson) return;
  lesson.status = 'cancelled';
  saveState();
  renderAll();
  requestGoogleLessonSync('upsert', lesson);
  openLessonModal(lesson.id);
  showToast('Lezione segnata come annullata.');
});
document.getElementById('deleteLessonBtn').addEventListener('click', deleteLesson);

el.renewForm.addEventListener('submit', event => {
  event.preventDefault();
  const client = getClient(state.selectedClientId);
  const pkg = getPackage(el.renewPackage.value);
  if (!client || !pkg) return;

  // Calcola le lezioni rimanenti dal piano attuale da riportare
  const oldPlan = getActivePlan(client.id);
  const oldStats = oldPlan ? planStats(oldPlan) : { remaining: 0 };
  const carryOver = Math.max(0, oldStats.remaining || 0);

  const newPlanId = uid('plan');
  state.plans.push({
    id: newPlanId,
    clientId: client.id,
    packageId: pkg.id,
    startDate: el.renewStartDate.value,
    checkMode: el.renewCheckMode.value,
    saleType: 'renewal',
    planType: 'personal',
    totalPrice: Number(el.renewPrice?.value ?? client.packagePrice ?? pkg.totalPrice ?? 0),
    carryOverLessons: carryOver,   // lezioni riportate dal pacchetto precedente
    createdAt: new Date().toISOString()
  });

  // Resetta sempre il pagamento per il nuovo pacchetto
  client.paymentStatus = 'unpaid';
  if (!client.paymentMode) client.paymentMode = 'single';

  if (getClientServiceType(client) === 'free_session') {
    client.serviceType = 'personal';
    client.packagePurchased = true;
    client.conversionStatus = 'path_started';
  }

  // Dismetti gli alert vecchi di rinnovo e pagamento per questo cliente
  if (!Array.isArray(state.dismissedAlerts)) state.dismissedAlerts = [];
  ['renewal', 'payment'].forEach(type => {
    // Rimuovi qualsiasi alert precedente di questo tipo per il cliente
    state.dismissedAlerts = state.dismissedAlerts.filter(id => !id.startsWith(`${type}_${client.id}_`));
  });

  ensureClientHistoryBuckets(client);
  client.renewalHistory.push({
    id: uid('renewhist'),
    createdAt: new Date().toISOString(),
    packageId: pkg.id,
    packageName: pkg.name,
    startDate: el.renewStartDate.value,
    carryOverLessons: carryOver
  });
  client.activePlanId = newPlanId;
  saveState(true);
  renderAll();
  closeModal('renewModalBackdrop');
  const carryMsg = carryOver > 0 ? ` (+ ${carryOver} lezioni riportate)` : '';
  showToast(`Rinnovo registrato${carryMsg}.`, 'ok');
});

// "Chiudi senza rinnovo": rimuove gli alert di pagamento/rinnovo senza creare un nuovo piano
document.getElementById('closeWithoutRenewBtn')?.addEventListener('click', () => {
  const client = getClient(state.selectedClientId);
  if (!client) return;
  showConfirm(
    'Chiudi senza rinnovo',
    `Verranno rimossi gli avvisi di pagamento e rinnovo per ${getClientFullName(client)}. Il pacchetto attuale resta invariato.`,
    () => {
      // Segna il pagamento come risolto
      client.paymentStatus = 'paid';
      // Rimuovi alert precedenti di questo cliente
      if (!Array.isArray(state.dismissedAlerts)) state.dismissedAlerts = [];
      state.dismissedAlerts = state.dismissedAlerts.filter(id =>
        !id.startsWith(`payment_${client.id}_`) && !id.startsWith(`renewal_${client.id}_`)
      );
      saveState(true);
      renderAll();
      closeModal('renewModalBackdrop');
      showToast('Pacchetto chiuso — avvisi rimossi.', 'ok');
    }
  );
});

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) return;
  try { saveLocalState(); } catch (error) { console.error(error); }
  if (cloud.client && cloud.user && !cloud.allowLocalOnly) {
    syncStateToCloud(true).catch(error => console.error(error));
  }
});
window.addEventListener('beforeunload', () => {
  try { saveLocalState(); } catch (error) { console.error(error); }
});

/* ═══════════════════════════════════════════════════════════
   HERO GREETING & TODAY STRIP
═══════════════════════════════════════════════════════════ */
