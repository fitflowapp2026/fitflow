function openRenewModal() {
  const client = getClient(state.selectedClientId);
  if (!client) { showToast('Seleziona un cliente.'); return; }

  /* Se c'è già un pending plan non ancora promosso, mostra direttamente
     il modal di pianificazione invece di aprire un nuovo rinnovo */
  if (client.pendingPlanId) {
    const pending = getPendingPlan(client.id);
    const pendingPkg = getPackage(pending?.packageId);
    if (pending && pendingPkg) {
      showConfirm(
        'Rinnovo già registrato',
        `Hai già un pacchetto "${pendingPkg.name}" in attesa. Vuoi pianificare le lezioni del vecchio o del nuovo pacchetto?`,
        () => openScheduleNewPlanModal(client, pending, pendingPkg, {
          showOldPlan: true,
          oldPlan: getActivePlan(client.id),
          carryOver: planStats(getActivePlan(client.id)).remaining
        }),
        'Pianifica lezioni'
      );
      return;
    }
  }

  const activePlan = getActivePlan(client.id);
  renderPackageOptions(el.renewPackage, activePlan?.packageId || state.packages[0]?.id || '');
  el.renewCheckMode.value = normalizeCheckMode(activePlan?.checkMode);
  const lastLesson = getLessonsForClient(client.id).filter(item => item.status !== 'cancelled').map(item => item.date).sort().slice(-1)[0];
  el.renewStartDate.value = lastLesson || todayISO();

  const oldStats = activePlan ? planStats(activePlan) : { remaining: 0 };
  const carryPreview = Math.max(0, oldStats.remaining || 0);

  const syncPrice = () => {
    const pkg = getPackage(el.renewPackage.value);
    const defaultPrice = Number(client.packagePrice || pkg?.totalPrice || 0);
    if (el.renewPrice && !el.renewPrice._touched) el.renewPrice.value = defaultPrice;
    const statusNote = carryPreview > 0
      ? ` · ${carryPreview} lezioni rimanenti dal pacchetto corrente`
      : ' · Pacchetto corrente completato';
    if (el.renewPriceHint) el.renewPriceHint.textContent = `Default: ${formatCurrency(defaultPrice)}${statusNote}`;
    el.renewPreview.innerHTML = buildPackageSummary(pkg, Number(el.renewPrice?.value || defaultPrice));
  };
  syncPrice();
  if (el.renewPrice) {
    el.renewPrice._touched = false;
    el.renewPrice.oninput = () => { el.renewPrice._touched = true; syncPrice(); };
  }
  el.renewPackage.onchange = () => { if (el.renewPrice) el.renewPrice._touched = false; syncPrice(); };
  openModal('renewModalBackdrop');
}

/* ── Modal pianificazione dopo rinnovo ──────────────────────────
   Appare dopo aver confermato il rinnovo e permette con un click
   di pianificare le lezioni del vecchio pacchetto rimanenti
   e/o le prime lezioni del nuovo pacchetto.
──────────────────────────────────────────────────────────────── */
function openScheduleNewPlanModal(client, newPlan, newPkg, { showOldPlan = false, oldPlan = null, carryOver = 0 } = {}) {
  if (!client || !newPlan || !newPkg) return;

  const hasSchedule = (client.scheduleMode === 'same' && client.fixedTime && (client.fixedDays || []).length > 0)
                   || (client.scheduleMode === 'different' && (client.variableSchedule || []).length > 0);

  const oldStats = oldPlan ? planStats(oldPlan) : { remaining: 0 };
  const oldRemaining = Math.max(0, oldStats.remaining || 0);

  /* Costruisce il contenuto del modal dinamicamente */
  const existingBackdrop = document.getElementById('scheduleAfterRenewBackdrop');
  if (existingBackdrop) existingBackdrop.remove();

  const backdrop = document.createElement('div');
  backdrop.id = 'scheduleAfterRenewBackdrop';
  backdrop.className = 'modal-backdrop';
  backdrop.style.cssText = 'display:flex;z-index:80;';

  const oldPlanSection = (showOldPlan && oldPlan && oldRemaining > 0) ? `
    <div class="mini-card" style="border-color:rgba(245,158,11,0.3);background:rgba(245,158,11,0.06);cursor:pointer;" id="scheduleOldPlanCard">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
        <div>
          <div class="section-title" style="color:var(--warn);">Pacchetto precedente — ancora attivo</div>
          <div class="muted small" style="margin-top:6px;">${oldRemaining} lezioni rimanenti da completare.</div>
        </div>
        <span style="color:var(--warn);font-size:1.1rem;flex-shrink:0;">›</span>
      </div>
      ${hasSchedule ? `
        <button class="btn btn-soft btn-small" style="margin-top:10px;width:100%;" id="scheduleOldPlanBtn">
          Pianifica le ${oldRemaining} lezioni rimanenti →
        </button>
      ` : `
        <button class="btn btn-soft btn-small" style="margin-top:10px;width:100%;" id="scheduleOldPlanOpenClientBtn">
          Imposta orario fisso →
        </button>
      `}
    </div>
  ` : '';

  const newPlanSection = `
    <div class="mini-card" style="border-color:rgba(29,185,84,0.3);background:rgba(29,185,84,0.06);cursor:pointer;" id="scheduleNewPlanCard">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
        <div>
          <div class="section-title" style="color:var(--good);">Nuovo pacchetto — ${escapeHtml(newPkg.name)}</div>
          <div class="muted small" style="margin-top:6px;">${newPkg.lessonsTotal} lezioni · inizia ${formatDateShort(newPlan.startDate)}</div>
        </div>
        <span style="color:var(--good);font-size:1.1rem;flex-shrink:0;">›</span>
      </div>
      ${hasSchedule ? `
        <button class="btn btn-primary btn-small" style="margin-top:10px;width:100%;" id="scheduleNewPlanBtn">
          Pianifica tutte le ${newPkg.lessonsTotal} lezioni del nuovo pacchetto →
        </button>
      ` : `
        <button class="btn btn-soft btn-small" style="margin-top:10px;width:100%;" id="scheduleNewPlanOpenClientBtn">
          Imposta orario fisso →
        </button>
      `}
    </div>
  `;

  backdrop.innerHTML = `
    <div class="modal narrow" role="dialog" aria-modal="true" style="max-width:480px;">
      <div class="modal-top">
        <div>
          <h3 class="modal-title">Pianifica lezioni</h3>
          <div class="muted small">${escapeHtml(getClientFullName(client))}</div>
        </div>
        <button class="btn btn-ghost btn-small" id="scheduleAfterRenewClose">Chiudi</button>
      </div>
      <div style="display:grid;gap:14px;">
        ${oldPlanSection}
        ${newPlanSection}
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);

  /* Chiudi */
  backdrop.querySelector('#scheduleAfterRenewClose').addEventListener('click', () => backdrop.remove());
  backdrop.addEventListener('click', e => { if (e.target === backdrop) backdrop.remove(); });

  /* Pianifica lezioni vecchio pacchetto */
  backdrop.querySelector('#scheduleOldPlanBtn')?.addEventListener('click', () => {
    if (!oldPlan) return;
    const oldPkg = getPackage(oldPlan.packageId);
    if (!oldPkg) return;
    const weekdays = client.scheduleMode === 'same' ? (client.fixedDays || []) : (client.variableSchedule || []).map(v => v.weekday);
    const timesByWeekday = client.scheduleMode === 'different'
      ? Object.fromEntries((client.variableSchedule || []).map(v => [v.weekday, v.time]))
      : null;
    const count = createRecurringLessonsForClient({
      client, plan: oldPlan, pkg: { ...oldPkg, lessonsTotal: oldRemaining },
      startDate: todayISO(),
      weekdays,
      time: client.fixedTime || '',
      timesByWeekday
    });
    if (count > 0) {
      showToast(`${count} lezioni del vecchio pacchetto pianificate.`, 'ok');
      backdrop.querySelector('#scheduleOldPlanBtn').disabled = true;
      backdrop.querySelector('#scheduleOldPlanBtn').textContent = `✓ ${count} lezioni pianificate`;
    } else {
      showToast('Nessuno slot disponibile. Controlla il calendario.', 'warn');
    }
  });

  /* Pianifica lezioni nuovo pacchetto */
  backdrop.querySelector('#scheduleNewPlanBtn')?.addEventListener('click', () => {
    const weekdays = client.scheduleMode === 'same' ? (client.fixedDays || []) : (client.variableSchedule || []).map(v => v.weekday);
    const timesByWeekday = client.scheduleMode === 'different'
      ? Object.fromEntries((client.variableSchedule || []).map(v => [v.weekday, v.time]))
      : null;
    const count = createRecurringLessonsForClient({
      client, plan: newPlan, pkg: newPkg,
      startDate: newPlan.startDate || todayISO(),
      weekdays,
      time: client.fixedTime || '',
      timesByWeekday
    });
    /* Se il vecchio piano era già esaurito, promuovi automaticamente */
    maybePromotePendingPlan(client.id);
    if (count > 0) {
      showToast(`${count} lezioni del nuovo pacchetto pianificate.`, 'ok');
      backdrop.querySelector('#scheduleNewPlanBtn').disabled = true;
      backdrop.querySelector('#scheduleNewPlanBtn').textContent = `✓ ${count} lezioni pianificate`;
    } else {
      showToast('Nessuno slot disponibile. Controlla il calendario.', 'warn');
    }
  });

  /* Imposta orario fisso — apre scheda cliente (quando non c'è orario fisso) */
  const openClientAndClose = () => {
    backdrop.remove();
    requestAnimationFrame(() => renderClientModal(client));
  };
  backdrop.querySelector('#scheduleOldPlanOpenClientBtn')?.addEventListener('click', openClientAndClose);
  backdrop.querySelector('#scheduleNewPlanOpenClientBtn')?.addEventListener('click', openClientAndClose);
}

function renderReport() {
  const monthDate = state.viewDate;
  el.reportMonthLabel.textContent = formatMonthLabel(monthDate);
  const lessons = state.lessons.filter(item => sameMonth(fromISO(item.date), monthDate));
  const done = lessons.filter(item => item.status === 'done').length;
  const cancelled = lessons.filter(item => item.status === 'cancelled').length;
  const scheduled = lessons.filter(item => item.status === 'scheduled').length;
  const monthClients = state.clients.filter(client => sameMonth(new Date(client.createdAt || new Date()), monthDate));
  const freeClients = monthClients.filter(client => getClientServiceType(client) === 'free_session');
  const pack99Plans = state.plans.filter(plan => sameMonth(new Date(plan.createdAt || new Date()), monthDate) && isPack99Package(getPackage(plan.packageId)));
  const pack99ClientIds = new Set(pack99Plans.map(plan => plan.clientId));
  const pack99Clients = state.clients.filter(client => pack99ClientIds.has(client.id));
  const personalClients = monthClients.filter(client => getClientServiceType(client) !== 'free_session');
  const convertedClients = state.clients.filter(client => {
    const firstPersonalPlan = state.plans.find(plan => plan.clientId === client.id && (plan.planType || plan.type || 'personal') === 'personal');
    if (!firstPersonalPlan || !sameMonth(new Date(firstPersonalPlan.createdAt || new Date()), monthDate)) return false;
    const hadFree = (client.freeSessionDone === true) || !!state.lessons.find(lesson => lesson.clientId === client.id && (lesson.lessonType || lesson.type) === 'free_session');
    return hadFree;
  });
  const renewals = state.plans.filter(plan => plan.saleType === 'renewal' && sameMonth(new Date(plan.createdAt || new Date()), monthDate));
  const soldPlans = state.plans.filter(plan => sameMonth(new Date(plan.createdAt || new Date()), monthDate));
  const packageCounts = new Map();
  soldPlans.forEach(plan => {
    const pkg = getPackage(plan.packageId);
    const key = pkg?.name || 'Senza nome';
    packageCounts.set(key, (packageCounts.get(key) || 0) + 1);
  });
  const packageRows = [...packageCounts.entries()].sort((a, b) => b[1] - a[1]);

  const monthLessonsByType = { free_session: [], personal: [] };
  lessons.forEach(lesson => {
    const type = lesson.lessonType || lesson.type || 'personal';
    if (monthLessonsByType[type]) monthLessonsByType[type].push(lesson);
  });
  const monthPlansByType = { free_session: [], personal: [] };
  soldPlans.forEach(plan => {
    const type = (plan.planType || plan.type || 'personal');
    if (monthPlansByType[type]) monthPlansByType[type].push(plan);
  });

  const cancelCounts = new Map();
  lessons.filter(item => item.status === 'cancelled').forEach(lesson => {
    const client = getClient(lesson.clientId);
    const key = getClientFullName(client) || 'Cliente';
    cancelCounts.set(key, (cancelCounts.get(key) || 0) + 1);
  });
  const cancelRows = [...cancelCounts.entries()].sort((a, b) => b[1] - a[1]);
  const completionRate = done + cancelled ? Math.round((done / (done + cancelled)) * 100) : 0;
  const mood = completionRate >= 85 ? { title: 'Mese forte', text: `Completamento ${completionRate}%` } : completionRate >= 65 ? { title: 'Mese stabile', text: `Completamento ${completionRate}%` } : { title: 'Mese da rivedere', text: `Completamento ${completionRate}%` };
  const cancelRate = done + cancelled ? Math.round((cancelled / (done + cancelled)) * 100) : 0;
  const inactiveClients = getManagedClients().filter(client => {
    const lessonsForClient = getLessonsForClient(client.id).filter(item => item.status !== 'cancelled').sort((a, b) => a.date.localeCompare(b.date));
    const lastSeen = lessonsForClient.length ? fromISO(lessonsForClient[lessonsForClient.length - 1].date) : null;
    return !lastSeen || ((new Date() - lastSeen) / 86400000) > 30;
  });
  const soldPackages = soldPlans.map(plan => getPackage(plan.packageId)).filter(Boolean);
  const avgPackageLessons = soldPackages.length ? Math.round(soldPackages.reduce((sum, pkg) => sum + Number(pkg.lessonsTotal || 0), 0) / soldPackages.length) : 0;
  const monthClientIds = new Set(soldPlans.map(plan => plan.clientId));
  const monthPaymentClients = state.clients.filter(client => monthClientIds.has(client.id));
  const paidClients = monthPaymentClients.filter(client => client.paymentStatus === 'paid').length;
  const outstandingClients = monthPaymentClients.filter(client => client.paymentStatus !== 'paid').length;
  const activeInstallments = monthPaymentClients.filter(client => client.paymentMode === 'installments' && Number(client.installmentsPaid || 0) < Number(client.installmentsTotal || 1)).length;
  const totalMonthlyLessons = lessons.filter(item => item.status !== 'cancelled').length;
  const monthlyBalance = lessons
    .filter(item => item.status === 'done')
    .reduce((sum, lesson) => {
      const plan = getPlan(lesson.planId);
      const pkg = getPackage(plan?.packageId);
      return sum + getPlanUnitValue(plan, pkg, getClient(lesson.clientId), lesson);
    }, 0);

  const freeCompleted = monthLessonsByType.free_session.filter(item => item.status === 'done').length;
  const freeScheduled = monthLessonsByType.free_session.filter(item => item.status === 'scheduled').length;
  const freeCancelled = monthLessonsByType.free_session.filter(item => item.status === 'cancelled').length;
  const personalCompleted = monthLessonsByType.personal.filter(item => item.status === 'done').length;
  const personalScheduled = monthLessonsByType.personal.filter(item => item.status === 'scheduled').length;
  const personalCancelled = monthLessonsByType.personal.filter(item => item.status === 'cancelled').length;

  const previousSnapshot = getMonthSnapshot(addMonths(monthDate, -1));
  el.reportStats.innerHTML = [
    { label: 'Inseriti nel mese', value: monthClients.length, note: 'Tutti i clienti creati nel mese', ...getDeltaMeta(monthClients.length, previousSnapshot.newClients) },
    { label: 'Free session', value: freeClients.length, note: 'Lead entrati come prova', ...getDeltaMeta(freeClients.length, 0) },
    { label: 'Pack99', value: pack99Clients.length, note: 'Clienti con pack99 venduto nel mese', ...getDeltaMeta(pack99Clients.length, 0) },
    { label: 'Convertiti', value: convertedClients.length, note: 'Da free session a cliente', ...getDeltaMeta(convertedClients.length, 0) },
    { label: 'Rinnovi', value: renewals.length, note: 'Clienti riattivati', ...getDeltaMeta(renewals.length, 0) },
    { label: 'Totale lezioni', value: totalMonthlyLessons, note: 'Volume operativo del mese', ...getDeltaMeta(totalMonthlyLessons, previousSnapshot.total) },
    { label: 'Saldo mese', value: formatCurrency(monthlyBalance), note: 'Ricavo realizzato', ...getDeltaMeta(monthlyBalance, previousSnapshot.revenue) },
    { label: 'Tasso annulli', value: `${cancelRate}%`, note: 'Da mantenere basso', ...getDeltaMeta(cancelRate, previousSnapshot.done + previousSnapshot.cancelled ? Math.round((previousSnapshot.cancelled / (previousSnapshot.done + previousSnapshot.cancelled)) * 100) : 0, true) }
  ].map(item => `
    <div class="report-card">
      <div class="muted small">${item.label}</div>
      <div class="big">${item.value}</div>
      <div class="report-card-delta ${item.direction}">${item.text}</div>
      <div class="report-card-note">${item.note}</div>
    </div>
  `).join('');

  el.reportMoodTitle.textContent = 'Gestionale del mese';
  el.reportMoodText.textContent = `${mood.text} • Inseriti ${monthClients.length} • Conversioni ${convertedClients.length} • Saldo ${formatCurrency(monthlyBalance)}`;
  if (el.reportMoodTextPanel) {
    el.reportMoodTextPanel.innerHTML = [
      { label: 'Pagati', value: paidClients },
      { label: 'Da incassare', value: outstandingClients },
      { label: 'Rate aperte', value: activeInstallments },
      { label: 'Clienti inattivi', value: inactiveClients.length },
      { label: 'Pacchetto medio', value: avgPackageLessons ? `${avgPackageLessons} lez.` : '—' }
    ].map(item => `<div class="summary-row"><span>${escapeHtml(item.label)}</span><span class="tag">${escapeHtml(String(item.value))}</span></div>`).join('');
  }

  const renderClientRows = (clients, badgeLabel, badgeClass = '') => clients.length ? clients.map(client => {
    const activePlan = getActivePlan(client.id);
    const pkg = getPackage(activePlan?.packageId);
    return `<div class="management-card">
      <div class="management-card-head">
        <div>
          <div class="management-card-title">${escapeHtml(getClientFullName(client))}</div>
          <div class="management-card-meta">${escapeHtml(client.phone || client.email || 'Scheda cliente')} ${pkg ? `• ${escapeHtml(pkg.name || '')}` : ''}</div>
        </div>
        <span class="tag ${badgeClass}">${escapeHtml(badgeLabel)}</span>
      </div>
      <div class="inline-actions"><button class="btn btn-soft btn-small" data-report-client="${client.id}">Apri</button></div>
    </div>`;
  }).join('') : '<div class="muted">Nessun inserimento</div>';

  const renderTypeSection = (rows = []) => rows.length ? `
    <div class="summary-list">
      ${rows.map(row => `
        <div class="summary-row">
          <span>${escapeHtml(String(row.label || ''))}</span>
          <span class="tag ${escapeHtml(String(row.badgeClass || ''))}">${escapeHtml(String(row.value ?? '—'))}</span>
        </div>
      `).join('')}
    </div>
  ` : '<div class="muted">Nessun dato disponibile</div>';

  el.reportNewClients.innerHTML = renderClientRows(monthClients, 'nuovo');
  el.reportTopPackages.innerHTML = packageRows.length ? packageRows.slice(0, 8).map(([name, count]) => `<div class="summary-row"><span>${escapeHtml(name)}</span><span class="tag gold">${count}</span></div>`).join('') : '<div class="muted">Nessun movimento commerciale</div>';

  const freeBalance = monthLessonsByType.free_session.filter(item => item.status === 'done').reduce((sum, lesson) => {
    const plan = getPlan(lesson.planId);
    return sum + getPackageUnitValue(getPackage(plan?.packageId));
  }, 0);
  const personalBalance = monthLessonsByType.personal.filter(item => item.status === 'done').reduce((sum, lesson) => {
    const plan = getPlan(lesson.planId);
    return sum + getPackageUnitValue(getPackage(plan?.packageId));
  }, 0);

  el.reportFreeSession.innerHTML = renderClientRows(freeClients, 'free', 'blue') + renderTypeSection([
    { label: 'Svolte', value: freeCompleted },
    { label: 'Programmate', value: freeScheduled },
    { label: 'Annullate', value: freeCancelled },
    { label: 'Saldo mese', value: formatCurrency(freeBalance) }
  ]);
  el.reportPack99.innerHTML = renderClientRows(pack99Clients, 'pack99', 'gold') + renderTypeSection([
    { label: 'Pack99 venduti', value: pack99Plans.length },
    { label: 'Clienti coinvolti', value: pack99Clients.length },
    { label: 'Lezioni personal', value: personalCompleted },
    { label: 'Saldo personal', value: formatCurrency(personalBalance) }
  ]);
  el.reportPersonal.innerHTML = renderClientRows(personalClients, 'cliente', 'green') + renderTypeSection([
    { label: 'Percorsi venduti', value: monthPlansByType.personal.length },
    { label: 'Lezioni svolte', value: personalCompleted },
    { label: 'Programmate', value: personalScheduled },
    { label: 'Annullate', value: personalCancelled }
  ]);
  el.reportOutstanding.innerHTML = renderTypeSection(monthPaymentClients.filter(client => client.paymentStatus !== 'paid').map(client => ({
    label: `${getClientFullName(client)} · ${getPaymentStatusLabel(client.paymentStatus)}`,
    value: client.paymentMode === 'installments' ? `${Number(client.installmentsPaid || 0)}/${Number(client.installmentsTotal || 1)} rate` : 'da saldare'
  })));
  el.reportInstallments.innerHTML = renderTypeSection(monthPaymentClients.filter(client => client.paymentMode === 'installments' && Number(client.installmentsPaid || 0) < Number(client.installmentsTotal || 1)).map(client => ({
    label: getClientFullName(client),
    value: `${Number(client.installmentsPaid || 0)}/${Number(client.installmentsTotal || 1)}`
  })));
  applyReportFilter();
  el.reportCancelRanking.innerHTML = cancelRows.length ? cancelRows.slice(0, 8).map(([name, count]) => `<div class="summary-row"><span>${escapeHtml(name)}</span><span class="tag red">${count}</span></div>`).join('') : '<div class="muted">Nessun annullamento</div>';
  el.reportFollowups.innerHTML = convertedClients.length ? convertedClients.map(client => `<div class="summary-row"><span>${escapeHtml(getClientFullName(client))}</span><button class="btn btn-soft btn-small" data-report-client="${client.id}">Apri</button></div>`).join('') : '<div class="muted">Nessuna conversione da free session</div>';
  document.querySelectorAll('[data-report-client]').forEach(button => {
    button.addEventListener('click', () => {
      selectClient(button.getAttribute('data-report-client'));
      closeModal('reportModalBackdrop');
    });
  });
}

function exportBackup() {
  const payload = {
    exportedAt: new Date().toISOString(),
    clients: state.clients,
    packages: state.packages,
    plans: state.plans,
    lessons: state.lessons
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const filename = `dsworld-backup-${todayISO()}.json`;
  /* Web Share API con file — AirDrop, iCloud Drive, Mail… */
  if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], filename, { type: 'application/json' })] })) {
    const file = new File([blob], filename, { type: 'application/json' });
    navigator.share({ title: 'DSWORLD Backup', files: [file] })
      .then(() => showToast('Backup condiviso!', 'ok'))
      .catch(err => { if (err.name !== 'AbortError') fallbackDownload(blob, filename); });
    return;
  }
  fallbackDownload(blob, filename);
}

function fallbackDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Backup esportato.');
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

function importBackup(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || '{}'));
      if (!Array.isArray(parsed.clients)) throw new Error('invalid');
      if (parsed.packages && !Array.isArray(parsed.packages)) throw new Error('invalid');
      if (parsed.plans && !Array.isArray(parsed.plans)) throw new Error('invalid');
      if (parsed.lessons && !Array.isArray(parsed.lessons)) throw new Error('invalid');
      const sanitize = (arr) => (arr || []).map(item => {
        if (typeof item !== 'object' || item === null || Array.isArray(item)) return null;
        const clean = {};
        for (const [k, v] of Object.entries(item)) {
          if (typeof v === 'string') clean[k] = v.replace(/<script[\s>]/gi, '');
          else clean[k] = v;
        }
        return clean;
      }).filter(Boolean);
      state.clients = sanitize(parsed.clients);
      state.packages = sanitize(parsed.packages) || seedPackages();
      state.plans = sanitize(parsed.plans) || [];
      state.lessons = sanitize(parsed.lessons) || [];
      state.selectedClientId = getDefaultSelectedClientId();
      saveState();
      renderAll();
      showToast('Backup importato.', 'ok');
    } catch (error) {
      console.error(error);
      showToast('Backup non valido.', 'error');
    }
  };
  reader.readAsText(file);
}

function resetPackageForm() {
  state.selectedPackageId = null;
  el.packageId.value = '';
  el.packageName.value = '';
  el.packageLessons.value = 12;
  el.packageWeeks.value = 8;
  el.packagePerWeek.value = 2;
  el.packageDuration.value = 60;
  el.packagePrice.value = 0;
  renderPackages();
}

function setAuthTab(tab) {
  document.querySelectorAll('[data-auth-tab]').forEach(button => button.classList.toggle('active', button.getAttribute('data-auth-tab') === tab));
  el.loginPanel.classList.toggle('active', tab === 'login');
  el.signupPanel.classList.toggle('active', tab === 'signup');
  el.resetPanel.classList.toggle('active', tab === 'reset');
}

async function saveCloudConfigFromInputs() {
  const config = loadSupabaseConfig();
  persistSupabaseConfig(config);
  initSupabaseClient(config);
  populateCloudConfigInputs();
  updateAuthMessage('Cloud collegato. Ora accedi con email e password.');
  await ensureSupabaseReady();
}

async function signInWithPassword(email, password) {
  if (!cloud.client) {
    initSupabaseClient(loadSupabaseConfig());
    if (!cloud.client) {
      showToast('Cloud non disponibile.');
      return;
    }
  }
  const { error } = await cloud.client.auth.signInWithPassword({ email, password });
  if (error) {
    console.error(error);
    updateAuthMessage(error.message || 'Login non riuscito.');
    showToast('Login non riuscito.');
    return;
  }
  updateAuthMessage('Accesso eseguito.');
  showToast('Accesso eseguito.', 'ok');
}

async function signUpWithPassword(email, password) {
  if (!email || !password) { showToast('Inserisci email e password.'); return; }
  if (password.length < 8) { showToast('Password troppo corta (min 8 caratteri).'); return; }
  if (!cloud.client) {
    initSupabaseClient(loadSupabaseConfig());
    if (!cloud.client) {
      showToast('Cloud non disponibile.');
      return;
    }
  }
  const { error } = await cloud.client.auth.signUp({ email, password });
  if (error) {
    console.error(error);
    updateAuthMessage(error.message || 'Registrazione non riuscita.');
    showToast('Registrazione non riuscita.');
    return;
  }
  updateAuthMessage('Account creato. Controlla l\'email se la conferma è attiva.');
  showToast('Account creato.', 'ok');
  setAuthTab('login');
  el.authLoginEmail.value = email;
}

function getResetRedirectUrl() {
  return `${window.location.origin}${window.location.pathname}`;
}

async function sendPasswordReset(email) {
  if (!email) {
    updateAuthMessage("Inserisci l'email del tuo account.");
    showToast("Inserisci l'email.");
    return;
  }
  if (!cloud.client) {
    initSupabaseClient(loadSupabaseConfig());
    if (!cloud.client) {
      showToast('Cloud non disponibile.');
      return;
    }
  }
  const { error } = await cloud.client.auth.resetPasswordForEmail(email, {
    redirectTo: getResetRedirectUrl()
  });
  if (error) {
    console.error(error);
    updateAuthMessage(error.message || 'Invio reset non riuscito.');
    showToast('Reset non inviato.');
    return;
  }
  updateAuthMessage('Email di reset inviata. Apri il link ricevuto per scegliere la nuova password.');
  showToast('Email di reset inviata.');
  el.authResetEmail.value = email;
  el.authLoginEmail.value = email;
  setAuthTab('login');
}

function handlePasswordRecovery(session) {
  cloud.session = session || cloud.session || null;
  cloud.user = session?.user || cloud.user || null;
  updateUserBadge();
  openModal('passwordUpdateModalBackdrop');
  updateAuthMessage('Apri la finestra e imposta la nuova password.');
  showToast('Imposta la nuova password.');
}

async function updatePasswordFromRecovery(newPassword) {
  if (!newPassword || newPassword.length < 8) {
    showToast('Password troppo corta.');
    return;
  }
  if (!cloud.client) {
    initSupabaseClient(loadSupabaseConfig());
    if (!cloud.client) {
      showToast('Cloud non disponibile.');
      return;
    }
  }
  const { error } = await cloud.client.auth.updateUser({ password: newPassword });
  if (error) {
    console.error(error);
    updateAuthMessage(error.message || 'Aggiornamento password non riuscito.');
    showToast('Password non aggiornata.');
    return;
  }
  const cleanUrl = new URL(window.location.href);
  cleanUrl.hash = '';
  if (cleanUrl.searchParams.get('type') === 'recovery') cleanUrl.searchParams.delete('type');
  window.history.replaceState({}, document.title, cleanUrl.toString());
  closeModal('passwordUpdateModalBackdrop');
  el.passwordUpdateInput.value = '';
  updateAuthMessage('Password aggiornata. Ora puoi accedere normalmente.');
  showToast('Password aggiornata.', 'ok');
  setAuthTab('login');
}

async function logoutCloud() {
  if (!cloud.client) return;
  const { error } = await cloud.client.auth.signOut();
  if (error) {
    console.error(error);
    showToast('Uscita non riuscita.');
    return;
  }
  showToast("Sei uscito dall'account.");
}


function renderClientFormStickySummary() {
  const box = document.getElementById('clientFormStickySummary');
  if (!box) return;
  const pkg = getPackage(el.clientPackage?.value);
  const price = Number(el.clientPackagePrice?.value || pkg?.totalPrice || 0);
  /* Progress: count filled required-ish fields */
  const fields = [
el.clientName?.value?.trim(),
el.clientSurname?.value?.trim(),
el.clientPackage?.value,
el.clientStartDate?.value,
el.clientFixedTime?.value,
  ];
  const filled = fields.filter(Boolean).length;
  const pct = Math.round((filled / fields.length) * 100);
  const pctColor = pct < 40 ? 'var(--bad)' : pct < 80 ? 'var(--warn)' : 'var(--good)';
  box.innerHTML = `
<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
  <div style="flex:1;height:4px;border-radius:99px;background:rgba(255,255,255,0.08);overflow:hidden;">
    <div style="width:${pct}%;height:100%;border-radius:99px;background:${pctColor};transition:width 300ms ease;"></div>
  </div>
  <span style="font-size:0.78rem;color:var(--muted);flex-shrink:0;">${pct}%</span>
</div>
<div class="summary-row"><span>Pacchetto</span><strong>${escapeHtml(pkg?.name || 'Seleziona un pacchetto')}</strong></div>
<div class="summary-row"><span>Valore</span><strong>${formatCurrency(price)}</strong></div>
<div class="summary-row"><span>Formula</span><strong>${escapeHtml(pkg ? `${pkg.lessonsTotal} lezioni · ${pkg.perWeek}/sett. · ${pkg.duration} min` : '—')}</strong></div>
  `;
}


function applyResponsiveDefaults() {
  if (!state.calendarView || !['month', 'week', 'day'].includes(state.calendarView)) {
    state.calendarView = 'month';
  }
  if (!state.selectedDay) {
    state.selectedDay = todayISO();
  }
}

let _rendering = false;
