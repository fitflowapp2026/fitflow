
function renderClientHistory(client) {
  if (!client) return;
  ensureClientHistoryBuckets(client);
  const paymentRows = [...(client.paymentHistory || [])].slice().reverse();
  
  // Protezione contro l'elemento mancante (evita il crash)
  const historyEl = document.getElementById('clientPaymentHistory') || el.clientPaymentHistory;
  if (historyEl) {
    historyEl.innerHTML = paymentRows.length ? paymentRows.map(item => {
      const extra = item.paymentMode === 'installments' ? ` · RATE ${Number(item.installmentsPaid || 0)}/${Number(item.installmentsTotal || 1)}` : '';
      return `<div class="summary-row"><span>${escapeHtml(formatSnapshotDate(item.createdAt))} · ${escapeHtml(getPaymentStatusLabel(item.paymentStatus))} · ${escapeHtml(getPaymentModeLabel(item.paymentMode))}${extra}</span><span class="tag">${escapeHtml(item.reason === 'create' ? 'iniziale' : 'update')}</span></div>`;
    }).join('') : '<div class="muted">Nessun pagamento registrato</div>';
  }

  // Protezione anche per la cronologia dei piani
  const planHistoryEl = document.getElementById('clientPlanHistory') || el.clientPlanHistory;
  if (planHistoryEl) {
    const planRows = state.plans
      .filter(plan => plan.clientId === client.id && plan.saleType === 'renewal')
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .map(plan => {
        const pkg = getPackage(plan.packageId);
        return {
          date: plan.createdAt || plan.startDate,
          label: `${pkg?.name || 'Pacchetto'} · dal ${formatDateFancy(plan.startDate)}`
        };
      });
    planHistoryEl.innerHTML = planRows.length ? planRows.map(item => `<div class="summary-row"><span>${escapeHtml(formatSnapshotDate(item.date))} · ${escapeHtml(item.label)}</span></div>`).join('') : '<div class="muted">Nessun rinnovo registrato</div>';
  }
}

function renderClientAppointments(client = null) {
  const show = !!client;
  if (el.clientAppointmentsWrap) el.clientAppointmentsWrap.hidden = !show;
  if (!show || !el.clientAppointmentsList) return;

  const lessons = getLessonsForClient(client.id).filter(item => item.status !== 'cancelled');
  if (!lessons.length) {
el.clientAppointmentsList.innerHTML = '<div class="muted">Nessun appuntamento fissato</div>';
return;
  }

  el.clientAppointmentsList.innerHTML = lessons.map((lesson, index) => {
    const dateFormatted = fromISO(lesson.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const statusTag = lesson.status === 'done'
      ? '<span class="tag green" style="flex-shrink:0;">Svolta</span>'
      : '<span class="tag blue" style="flex-shrink:0;">Programmata</span>';
    return `<div class="summary-row">
  <span>Lezione ${index + 1}: ${escapeHtml(dateFormatted)} ore ${escapeHtml(lesson.time)}</span>
  ${statusTag}
</div>`;
  }).join('');
}

function buildAppointmentsText(clientId) {
  const client = getClient(clientId);
  if (!client) return '';
  const lessons = getLessonsForClient(clientId).filter(item => item.status !== 'cancelled');
  if (!lessons.length) return '';
  const lines = lessons.map((lesson, index) => {
    const dateFormatted = fromISO(lesson.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `Lezione ${index + 1}: ${dateFormatted} ore ${lesson.time}`;
  });
  return lines.join('\n');
}

function copyAppointmentsToClipboard() {
  const clientId = el.clientId.value;
  const text = buildAppointmentsText(clientId);
  if (!text) {
    showToast('Nessun appuntamento da copiare.');
    return;
  }
  /* Web Share API — apre il foglio nativo iOS (WhatsApp, Mail, AirDrop…) */
  if (navigator.share) {
    navigator.share({ title: 'Appuntamenti DSWORLD', text })
      .then(() => showToast('Appuntamenti condivisi!', 'ok'))
      .catch(err => { if (err.name !== 'AbortError') showToast('Condivisione annullata.'); });
    return;
  }
  /* Fallback clipboard */
  navigator.clipboard.writeText(text).then(() => {
    showToast('Appuntamenti copiati!', 'ok');
  }).catch(() => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText = 'position:fixed;opacity:0;';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    showToast('Appuntamenti copiati!', 'ok');
  });
}

function applyReportFilter() {
  const filter = state.reportFilter || 'all';
  const toggle = (node, show) => { if (node) node.style.display = show ? '' : 'none'; };
  toggle(el.reportSectionFreeSession, filter === 'all' || filter === 'free_session');
  toggle(el.reportSectionPack99, filter === 'all' || filter === 'pack99');
  toggle(el.reportSectionPersonal, filter === 'all' || filter === 'personal');
  toggle(el.reportSectionOutstanding, filter === 'all' || filter === 'outstanding');
  toggle(el.reportSectionInstallments, filter === 'all' || filter === 'installments');
  if (el.reportFilterBar) {
    el.reportFilterBar.querySelectorAll('[data-report-filter]').forEach(button => {
      const active = button.getAttribute('data-report-filter') === filter;
      button.className = active ? 'btn btn-soft btn-small active' : 'btn btn-ghost btn-small';
    });
  }
}

function renderClientModal(client = null, trigger = document.activeElement) {
  el.clientModalTitle.textContent = client ? 'Modifica cliente' : 'Nuovo cliente';
  el.clientId.value = client?.id || '';
  const nameParts = splitFullName(client?.name || '');
  el.clientName.value = client?.firstName || nameParts.firstName || '';
  el.clientSurname.value = client?.lastName || nameParts.lastName || '';
  if (el.clientEmail) el.clientEmail.value = client?.email || '';
  if (el.clientSendCalendarInvite) el.clientSendCalendarInvite.value = client?.sendCalendarInvite ? 'yes' : 'no';
  el.clientNotes.value = client?.notes || '';
  el.clientStartDate.value = client ? (getActivePlan(client.id)?.startDate || todayISO()) : todayISO();
  const activePlan = client ? getActivePlan(client.id) : null;
  renderPackageOptions(el.clientPackage, activePlan?.packageId || state.packages[0]?.id || '');
  el.clientCheckMode.value = normalizeCheckMode(activePlan?.checkMode);
  el.clientServiceType.value = client?.serviceType || 'personal';
  el.clientFreeSessionDone.value = client?.freeSessionDone ? 'yes' : 'no';
  el.clientPackagePurchased.value = client?.packagePurchased ? 'yes' : 'no';
  el.clientConversionStatus.value = client?.conversionStatus || 'path_started';
  el.clientPaymentStatus.value = client?.paymentStatus || 'unpaid';
  el.clientPaymentMode.value = client?.paymentMode || 'single';
  el.clientInstallmentsTotal.value = String(client?.installmentsTotal || 2);
  el.clientInstallmentsPaid.value = String(client?.installmentsPaid || 0);
  const mode = client?.scheduleMode || 'same';
  document.querySelectorAll('input[name="scheduleMode"]').forEach(input => input.checked = input.value === mode);
  const serviceType = el.clientServiceType?.value || 'personal';
  let pkg = getPackage(el.clientPackage.value);
  if (serviceType === 'free_session') pkg = ensureSpecialPackage('free_session');
  const defaultDay = normalizeWeekday(fromISO(el.clientStartDate.value || todayISO()).getDay());
  el.clientFixedTime.value = client?.fixedTime || '';
  renderClientWeekdayPicker(client?.fixedDays?.length ? client.fixedDays : [defaultDay], Math.max(1, Number(pkg?.perWeek || 1)));
  renderVariableScheduleGrid(client?.variableSchedule || []);
  const selectedPkg = getPackage(el.clientPackage.value);
  if (el.clientPackagePrice) el.clientPackagePrice.value = Number(client?.packagePrice || selectedPkg?.totalPrice || 0);
  el.packagePreview.innerHTML = buildPackageSummary(selectedPkg, Number(el.clientPackagePrice?.value || selectedPkg?.totalPrice || 0));
  updateClientServiceUi();
  updateInstallmentsUI();
  updateFixedScheduleUI();
  renderClientHistory(client);
  renderClientAppointments(client);
  if (el.copyAppointmentsBtn) {
    el.copyAppointmentsBtn.onclick = copyAppointmentsToClipboard;
  }
  el.deleteClientBtn.style.display = client ? 'inline-flex' : 'none';
  openModal('clientModalBackdrop', trigger);
}
