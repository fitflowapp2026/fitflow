function buildPackageSummary(pkg, priceOverride = null) {
  if (!pkg) return '<div class="muted">Nessun pacchetto</div>';
  const total = Number(priceOverride != null ? priceOverride : (pkg.totalPrice || 0));
  const unit = Number(pkg.lessonsTotal || 0) > 0 ? total / Number(pkg.lessonsTotal || 0) : 0;
  return `
    <strong>${escapeHtml(pkg.name)}</strong>
    <div class="pill-row" style="margin-top:10px;">
      <span class="tag">${pkg.lessonsTotal} lezioni</span>
      <span class="tag">${pkg.weeks} settimane</span>
      <span class="tag">${pkg.perWeek} / settimana</span>
      <span class="tag">${pkg.duration} min</span>
      <span class="tag">${formatCurrency(total)}</span>
      <span class="tag">${formatCurrency(unit)}/lez</span>
    </div>
  `;
}

function renderPackageOptions(select, selectedId) {
  select.innerHTML = state.packages.map(pkg => `<option value="${pkg.id}" ${pkg.id === selectedId ? 'selected' : ''}>${escapeHtml(pkg.name)}</option>`).join('');
  if (!select.value && state.packages[0]) select.value = state.packages[0].id;
}

function getSelectedClientWeekdays() {
  return sortWeekdays([...el.clientWeekdayPicker.querySelectorAll('[data-weekday].active')].map(button => Number(button.getAttribute('data-weekday'))));
}

function renderVariableScheduleGrid(selected = []) {
  if (!el.clientVariableScheduleGrid) return;
  const lookup = new Map((selected || []).map(item => [Number(item.weekday), item.time || '']));
  el.clientVariableScheduleGrid.innerHTML = [1,2,3,4,5,6,7].map(day => `
    <label class="summary-row" style="gap:10px;align-items:center;">
      <span style="display:flex;align-items:center;gap:8px;">
        <input type="checkbox" data-variable-weekday="${day}" ${lookup.has(day) ? 'checked' : ''} />
        <span>${weekdayLabel(day)}</span>
      </span>
      <input type="time" data-variable-time="${day}" value="${escapeHtml(lookup.get(day) || '')}" style="max-width:150px;" />
    </label>
  `).join('');
  el.clientVariableScheduleGrid.querySelectorAll('input').forEach(input => input.addEventListener('input', renderFixedSchedulePreview));
  el.clientVariableScheduleGrid.querySelectorAll('input[type="checkbox"]').forEach(input => input.addEventListener('change', renderFixedSchedulePreview));
}

function getVariableScheduleSelections() {
  if (!el.clientVariableScheduleGrid) return [];
  return [1,2,3,4,5,6,7].map(day => {
    const checked = el.clientVariableScheduleGrid.querySelector(`[data-variable-weekday="${day}"]`)?.checked;
    const time = el.clientVariableScheduleGrid.querySelector(`[data-variable-time="${day}"]`)?.value || '';
    return checked && time ? { weekday: day, time } : null;
  }).filter(Boolean).sort((a,b)=>a.weekday-b.weekday);
}

function updateInstallmentsUI() {
  const isFreeSession = el.clientServiceType?.value === 'free_session';
  const isInstallments = el.clientPaymentMode?.value === 'installments';
  if (el.clientInstallmentsRow) el.clientInstallmentsRow.hidden = isFreeSession || !isInstallments;
  if (!isInstallments) {
    if (el.clientInstallmentsTotal) el.clientInstallmentsTotal.value = '2';
    if (el.clientInstallmentsPaid) el.clientInstallmentsPaid.value = el.clientPaymentStatus?.value === 'paid' ? '1' : '0';
  } else {
    // Modalità rate: aggiorna il select paymentStatus in base alle rate inserite
    const total = Math.min(3, Math.max(2, Number(el.clientInstallmentsTotal?.value || 2)));
    const paid  = Math.max(0, Math.min(total, Number(el.clientInstallmentsPaid?.value || 0)));
    const derived = paid >= total ? 'paid' : paid > 0 ? 'partial' : 'unpaid';
    if (el.clientPaymentStatus) el.clientPaymentStatus.value = derived;
  }
}

function updateFixedScheduleUI() {
  const mode = document.querySelector('input[name="scheduleMode"]:checked')?.value || 'same';
  const serviceType = el.clientServiceType?.value || 'personal';
  let pkg = getPackage(el.clientPackage.value);
  if (serviceType === 'free_session') pkg = ensureSpecialPackage('free_session');
  const requiredDays = Math.max(1, Number(pkg?.perWeek || 1));
  const selectedDays = getSelectedClientWeekdays();
  const variableSelections = getVariableScheduleSelections();
  el.fixedScheduleBlock.hidden = false;
  if (el.variableScheduleBlock) el.variableScheduleBlock.style.display = mode !== 'different' ? 'none' : 'grid';
  const sameFields = document.getElementById('sameScheduleFields');
  if (sameFields) sameFields.hidden = mode !== 'same';
  if (mode !== 'same') {
    const selectedText = variableSelections.length ? variableSelections.map(item => `${weekdayLabel(item.weekday)} ${item.time}`).join(', ') : 'nessuno';
    el.fixedScheduleHint.textContent = `Seleziona ${requiredDays} giorni con orari diversi. Giorni scelti: ${selectedText}.`;
    renderFixedSchedulePreview();
    return;
  }
  const dayWord = requiredDays === 1 ? 'giorno' : 'giorni';
  const selectedText = selectedDays.length ? selectedDays.map(weekdayLabel).join(', ') : 'nessuno';
  el.fixedScheduleHint.textContent = `Seleziona ${requiredDays} ${dayWord} e un'ora fissa. Al salvataggio creo tutte le lezioni del pacchetto. Giorni scelti: ${selectedText}.`;
}

function renderClientWeekdayPicker(selectedDays = [], requiredDays = null) {
  const days = sortWeekdays(selectedDays);
  el.clientWeekdayPicker.innerHTML = [1,2,3,4,5,6,7].map(day => `
    <button type="button" class="weekday-chip ${days.includes(day) ? 'active' : ''}" data-weekday="${day}">${weekdayLabel(day)}</button>
  `).join('');
  el.clientWeekdayPicker.querySelectorAll('[data-weekday]').forEach(button => {
    button.addEventListener('click', () => {
      const day = Number(button.getAttribute('data-weekday'));
      let picked = getSelectedClientWeekdays();
      if (picked.includes(day)) {
        picked = picked.filter(item => item !== day);
      } else {
        picked.push(day);
      }
      picked = sortWeekdays(picked);
      if (requiredDays && picked.length > requiredDays) {
        picked = picked.slice(picked.length - requiredDays);
      }
      renderClientWeekdayPicker(picked, requiredDays);
      updateFixedScheduleUI();
    });
  });
  updateFixedScheduleUI();
  renderFixedSchedulePreview();
}

function createRecurringLessonsForClient({ client, plan, pkg, startDate, weekdays, time, timesByWeekday = null, firstLessonType = null, standardLessonType = null }) {
  const selectedDays = sortWeekdays(weekdays);
  if (!client || !plan || !pkg || !startDate || (!time && !timesByWeekday) || !selectedDays.length) return 0;
  const total = Number(pkg.lessonsTotal || 0);
  if (!total) return 0;
  const cursor = fromISO(startDate);
  cursor.setHours(0, 0, 0, 0);
  const createdLessons = [];
  let attempts = 0;
  while (createdLessons.length < total && attempts < 730) {
    const iso = toISO(cursor);
    const weekday = normalizeWeekday(cursor.getDay());
    if (selectedDays.includes(weekday)) {
      const slotTime = (timesByWeekday && timesByWeekday[weekday]) || time;
      if (!slotTime) { cursor.setDate(cursor.getDate() + 1); attempts += 1; continue; }
      if (!state.lessons.some(item => item.clientId === client.id && item.date === iso && item.time === slotTime && item.status !== 'cancelled')
        && !hasTimeConflict({ date: iso, time: slotTime, duration: pkg.duration })
        && canUsePlanSlot(plan.id)) {
        const lessonType = createdLessons.length === 0 && firstLessonType ? firstLessonType : (standardLessonType || lessonTypeForNewLesson(client));
        const lesson = {
          id: uid('lesson'),
          clientId: client.id,
          planId: plan.id,
          date: iso,
          time: slotTime,
          duration: Number(pkg.duration || 60),
          lessonType,
          status: 'scheduled',
          note: '',
          linkedTo: null,
          googleEventId: '',
          createdAt: new Date().toISOString()
        };
        state.lessons.push(lesson);
        createdLessons.push(lesson.id);
      }
    }
    cursor.setDate(cursor.getDate() + 1);
    attempts += 1;
  }
  if (createdLessons.length) {
    saveState();
    renderAll();
    createdLessons.forEach(id => requestGoogleLessonSync('upsert', id, { allowCreateWithoutEventId: true }));
  }
  return createdLessons.length;
}

function getManagedClientsForMonth(monthDate = startOfMonth(new Date())) {
  const unique = new Map();

  /* 1. Clienti che hanno lezioni SVOLTE o PROGRAMMATE nel mese
        → escludi lezioni free_session pure (tipo servizio free_session)
        → includi pack99 (è personal con una free iniziale) */
  state.lessons
    .filter(lesson => {
      if (lesson.status === 'cancelled') return false;
      if (!sameMonth(fromISO(lesson.date), monthDate)) return false;
      /* Escludi lezioni di tipo free_session puro */
      const lType = lesson.lessonType || lesson.type || '';
      if (lType === 'free_session') return false;
      return true;
    })
    .forEach(lesson => {
      const client = getClient(lesson.clientId);
      if (!client) return;
      /* Escludi clienti il cui servizio principale è free_session (non hanno ancora acquistato) */
      if (getClientServiceType(client) === 'free_session') return;
      unique.set(client.id, client);
    });

  /* 2. Clienti che hanno acquistato un pacchetto (piano creato) nel mese
        → includi anche pack99
        → escludi free_session puri */
  state.plans
    .filter(plan => sameMonth(new Date(plan.createdAt || plan.startDate || new Date()), monthDate))
    .forEach(plan => {
      const client = getClient(plan.clientId);
      if (!client) return;
      if (getClientServiceType(client) === 'free_session') return;
      const pkg = getPackage(plan.packageId);
      /* Escludi pacchetti che sono solo FREE SESSION */
      if (pkg && pkg.name.toUpperCase() === 'FREE SESSION') return;
      unique.set(client.id, client);
    });

  return [...unique.values()].sort((a, b) => {
    const left  = `${String(a.lastName  || '').trim()} ${String(a.firstName || '').trim()}`.trim().toUpperCase();
    const right = `${String(b.lastName  || '').trim()} ${String(b.firstName || '').trim()}`.trim().toUpperCase();
    return left.localeCompare(right, 'it');
  });
}

async function exportManagedXlsx() {
  /* Apri il month picker con default = mese corrente (oggi) */
  openMonthPicker(new Date(), async (monthDate) => {
    try {
      showToast('Preparazione Excel…');
      await ensureExcelJS();
      if (!window.ExcelJS) { showToast('Modulo Excel non disponibile.', 'error'); return; }

      const clients  = getManagedClientsForMonth(monthDate);
      const meseIT   = MONTHS_IT[monthDate.getMonth()]; /* es. "Aprile" */
      const mmyyyy   = `${String(monthDate.getMonth()+1).padStart(2,'0')}-${monthDate.getFullYear()}`;
      const fileName = `Elenco Gestiti PT ${mmyyyy}.xlsx`;

      const workbook = new window.ExcelJS.Workbook();
      const binary   = Uint8Array.from(atob(GESTITI_TEMPLATE_BASE64), c => c.charCodeAt(0));
      await workbook.xlsx.load(binary.buffer);
      const sheet    = workbook.getWorksheet('Gestiti') || workbook.worksheets[0];

      /* ── Stili ── */
      const whiteFill = { type:'pattern', pattern:'solid', fgColor:{argb:'FFFFFFFF'}, bgColor:{argb:'FFFFFFFF'} };
      const blackFill = { type:'pattern', pattern:'solid', fgColor:{argb:'FF000000'}, bgColor:{argb:'FF000000'} };
      const border    = { left:{style:'thin',color:{argb:'FF000000'}}, right:{style:'thin',color:{argb:'FF000000'}}, top:{style:'thin',color:{argb:'FF000000'}}, bottom:{style:'thin',color:{argb:'FF000000'}} };

      function applyCell(addr, { fill=whiteFill, font={}, alignment={}, value }={}) {
        const cell = sheet.getCell(addr);
        if (typeof value !== 'undefined') cell.value = value;
        cell.fill   = cloneJson(fill);
        cell.border = cloneJson(border);
        cell.font   = { name: font.name||cell.font?.name||'Calibri', size: font.size||cell.font?.size||11, bold: typeof font.bold==='boolean'?font.bold:!!cell.font?.bold, italic: typeof font.italic==='boolean'?font.italic:!!cell.font?.italic, color: font.color||{argb:'FF000000'} };
        cell.alignment = { vertical:'middle', horizontal: alignment.horizontal||cell.alignment?.horizontal||'left', wrapText: typeof alignment.wrapText==='boolean'?alignment.wrapText:!!cell.alignment?.wrapText };
        return cell;
      }

      /* ── B1: nome mese in italiano (testo, non data) ── */
      applyCell('B1', {
        fill: blackFill,
        font: { name:'Calibri', size:14, bold:true, color:{argb:'FFFFFFFF'} },
        alignment: { horizontal:'center' },
        value: meseIT /* stringa italiana, es. "Aprile" */
      });

      /* ── B2: pulisci ── */
      applyCell('B2', {
        fill: whiteFill,
        font: { name:'Calibri', size:11, bold:true, italic:true, color:{argb:'FF000000'} },
        alignment: { horizontal:'center' }
      });

      /* ── Pulisci righe precedenti fino a riga sufficiente ── */
      const clearUntil = Math.max(sheet.rowCount || 40, 3 + clients.length + 4);
      for (let row = 3; row <= clearUntil; row++) {
        applyCell(`B${row}`, {
          fill: whiteFill,
          font: { name:'Helvetica', size:11, bold:false, italic:false, color:{argb:'FF000000'} },
          alignment: { horizontal:'left' },
          value: ''
        });
      }

      /* ── D1 header ── */
      applyCell('D1', { fill:blackFill, font:{name:'Calibri',size:12,bold:true,color:{argb:'FFFFFFFF'}}, alignment:{horizontal:'left'} });
      ['D2','D3','D4','D5','D6'].forEach(a => applyCell(a, { fill:whiteFill, font:{name:'Calibri',size:11,color:{argb:'FF000000'}}, alignment:{horizontal:'left',wrapText:true} }));

      /* ── Nomi clienti da B3 in giù ── */
      clients.forEach((client, i) => {
        const fullName = `${String(client.firstName||'').trim()} ${String(client.lastName||'').trim()}`.replace(/\s+/g,' ').trim().toUpperCase();
        applyCell(`B${3 + i}`, {
          fill: whiteFill,
          font: { name:'Helvetica', size:11, bold:false, italic:false, color:{argb:'FF000000'} },
          alignment: { horizontal:'left' },
          value: fullName
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob   = new Blob([buffer], { type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url    = URL.createObjectURL(blob);
      const a      = Object.assign(document.createElement('a'), { href:url, download:fileName });
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      showToast(`✅ Excel ${meseIT} ${monthDate.getFullYear()} — ${clients.length} gestiti.`, 'ok');
    } catch (err) {
      console.error(err);
      showToast('Excel non generato.', 'error');
    }
  });
}

function getPaymentStatusLabel(status = 'unpaid') {
  return status === 'paid' ? 'SALDATO' : status === 'partial' ? 'ACCONTO' : 'DA PAGARE';
}

function getPaymentModeLabel(mode = 'single') {
  return mode === 'installments' ? 'RATEIZZATO' : 'UNICA SOLUZIONE';
}

function formatSnapshotDate(value) {
  try {
return new Date(value).toLocaleDateString('it-IT');
  } catch (error) {
return '—';
  }
}

function ensureClientHistoryBuckets(client) {
  if (!client) return;
  if (!Array.isArray(client.paymentHistory)) client.paymentHistory = [];
  if (!Array.isArray(client.renewalHistory)) client.renewalHistory = [];
}

function pushClientPaymentSnapshot(client, reason = 'update') {
  if (!client) return;
  ensureClientHistoryBuckets(client);
  const snapshot = {
id: uid('payhist'),
createdAt: new Date().toISOString(),
reason,
paymentStatus: client.paymentStatus || 'unpaid',
paymentMode: client.paymentMode || 'single',
installmentsTotal: Number(client.installmentsTotal || 1),
installmentsPaid: Number(client.installmentsPaid || 0)
  };
  const last = client.paymentHistory[client.paymentHistory.length - 1];
  if (last && last.paymentStatus === snapshot.paymentStatus && last.paymentMode === snapshot.paymentMode && Number(last.installmentsTotal || 1) === snapshot.installmentsTotal && Number(last.installmentsPaid || 0) === snapshot.installmentsPaid) {
return;
  }
  client.paymentHistory.push(snapshot);
}
