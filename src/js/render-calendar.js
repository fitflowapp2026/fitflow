
function buildRecurringPreviewDates({ startDate, weekdays, lessonsTotal }) {
  const selectedDays = sortWeekdays(weekdays);
  const total = Number(lessonsTotal || 0);
  if (!startDate || !selectedDays.length || !total) return [];
  const cursor = fromISO(startDate);
  const results = [];
  let attempts = 0;
  while (results.length < total && attempts < 500) {
    const iso = toISO(cursor);
    const weekday = normalizeWeekday(cursor.getDay());
    if (selectedDays.includes(weekday)) results.push(iso);
    cursor.setDate(cursor.getDate() + 1);
    attempts += 1;
  }
  return results;
}

function renderFixedSchedulePreview() {
  const serviceType = el.clientServiceType?.value || 'personal';
  let pkg = getPackage(el.clientPackage.value);
  if (serviceType === 'free_session') pkg = ensureSpecialPackage('free_session');
  const fixedTime = el.clientFixedTime.value;
  const fixedDays = getSelectedClientWeekdays();
  const variableSelections = getVariableScheduleSelections();
  const mode = document.querySelector('input[name="scheduleMode"]:checked')?.value || 'same';
  if (!el.fixedScheduleQuickText || !el.fixedSchedulePreview || !pkg) return;
  const previewDates = buildRecurringPreviewDates({
    startDate: el.clientStartDate.value || todayISO(),
    weekdays: mode === 'same' ? fixedDays : variableSelections.map(item => item.weekday),
    lessonsTotal: pkg.lessonsTotal
  });
  if (mode === 'same') {
    const summaryDays = fixedDays.length ? fixedDays.map(weekdayLabel).join(', ') : 'giorni da scegliere';
    const summaryTime = fixedTime || 'orario da scegliere';
    el.fixedScheduleQuickText.textContent = `Piano rapido: ${pkg.lessonsTotal} lezioni • ${summaryDays} • ${summaryTime}`;
    if (!fixedDays.length || !fixedTime) {
      el.fixedSchedulePreview.innerHTML = '<div class="muted small">Scegli ora e giorni: qui vedi subito le prime date prima di confermare.</div>';
      return;
    }
    el.fixedSchedulePreview.innerHTML = previewDates.slice(0, 6).map((iso, index) => `
      <div class="fixed-preview-item">
        <span>${index + 1}. ${escapeHtml(formatDateFancy(iso))}</span>
        <span class="tag blue">${summaryTime}</span>
      </div>
    `).join('') + (previewDates.length > 6 ? `<div class="muted small">+ altre ${previewDates.length - 6} date già pronte</div>` : '');
    return;
  }
  const summaryDays = variableSelections.length ? variableSelections.map(item => `${weekdayLabel(item.weekday)} ${item.time}`).join(' • ') : 'giorni da scegliere';
  el.fixedScheduleQuickText.textContent = `Piano rapido: ${pkg.lessonsTotal} lezioni • ${summaryDays}`;
  if (!variableSelections.length) {
    el.fixedSchedulePreview.innerHTML = '<div class="muted small">Seleziona i giorni con il relativo orario: qui vedi subito le prime date prima di confermare.</div>';
    return;
  }
  const timesByWeekday = Object.fromEntries(variableSelections.map(item => [item.weekday, item.time]));
  el.fixedSchedulePreview.innerHTML = previewDates.slice(0, 6).map((iso, index) => {
    const weekday = normalizeWeekday(fromISO(iso).getDay());
    const slotTime = timesByWeekday[weekday] || '';
    return `
      <div class="fixed-preview-item">
        <span>${index + 1}. ${escapeHtml(formatDateFancy(iso))}</span>
        <span class="tag blue">${slotTime}</span>
      </div>
    `;
  }).join('') + (previewDates.length > 6 ? `<div class="muted small">+ altre ${previewDates.length - 6} date già pronte</div>` : '');
}

function renderWeekAgenda(anchorDate = getCalendarAnchorDate()) {
  const monday = addDays(anchorDate, -((anchorDate.getDay() + 6) % 7));
  const weekDays = Array.from({ length: 7 }, (_, index) => addDays(monday, index));
  const hours = Array.from({ length: 15 }, (_, index) => `${String(index + 7).padStart(2, '0')}:00`);
  const isMobile = window.innerWidth <= 580;

  if (isMobile) {
    const DAY_LETTERS_WEEK = ['L','M','M','G','V','S','D'];
    const todayISOStr = todayISO();

    let weekHtml = '<div class="week-grid-mobile">';

    /* ── Corner cell ── */
    weekHtml += '<div class="wgm-corner"></div>';

    /* ── Day header cells ── */
    weekDays.forEach(day => {
      const iso = toISO(day);
      const isToday = iso === todayISOStr;
      const letter = DAY_LETTERS_WEEK[(day.getDay() + 6) % 7];
      weekHtml += `<div class="wgm-head">
        <div class="wgm-letter">${letter}</div>
        <div class="wgm-num${isToday ? ' wgm-num-today' : ''}">${day.getDate()}</div>
      </div>`;
    });

    /* ── Hour rows ── */
    hours.forEach(time => {
      /* Time label */
      weekHtml += `<div class="wgm-time">${time}</div>`;
      /* Day cells */
      weekDays.forEach(day => {
        const iso = toISO(day);
        const slotLessons = state.lessons
          .filter(item => item.date === iso && item.time.slice(0, 2) === time.slice(0, 2))
          .sort((a, b) => a.time.localeCompare(b.time));
        if (slotLessons.length) {
          const pills = slotLessons.map(lesson => `
            <button type="button" class="wgm-pill status-${lesson.status}${lesson.duoGroupId ? ' duo' : ''}" data-lesson-id="${lesson.id}">
              <span class="wgm-pill-name">${escapeHtml(getLessonDisplayTitle(lesson))}</span>
              <span class="wgm-pill-time">${lesson.time}</span>
            </button>
          `).join('');
          weekHtml += `<div class="wgm-cell wgm-cell-busy">${pills}</div>`;
        } else {
          weekHtml += `<div class="wgm-cell" data-add-slot="${iso}|${time}"></div>`;
        }
      });
    });

    weekHtml += '</div>';
    el.agendaWrap.innerHTML = weekHtml;

    el.agendaWrap.querySelectorAll('[data-add-slot]').forEach(cell => {
      cell.addEventListener('click', () => {
        const [iso, time] = cell.getAttribute('data-add-slot').split('|');
        addLessonFromDaySlot(iso, time);
      });
    });
    el.agendaWrap.querySelectorAll('[data-lesson-id]').forEach(button => button.addEventListener('click', () => {
      openLessonModal(button.getAttribute('data-lesson-id'));
    }));
    return;
  }

  el.agendaWrap.innerHTML = `
    <div class="agenda-week-grid">
      <div class="agenda-week-day"></div>
      ${weekDays.map(day => `<div class="agenda-week-day" data-open-day="${toISO(day)}">${escapeHtml(day.toLocaleDateString('it-IT', { weekday: 'short', day: '2-digit', month: '2-digit' }))}</div>`).join('')}
      ${hours.map(time => `
        <div class="agenda-week-time">${time}</div>
        ${weekDays.map(day => {
          const iso = toISO(day);
          const slotLessons = state.lessons
            .filter(item => item.date === iso && item.time.slice(0, 2) === time.slice(0, 2))
            .sort((a, b) => a.time.localeCompare(b.time));
          return `
            <div class="agenda-week-cell" data-week-slot="${iso}|${time}">
              ${slotLessons.length ? slotLessons.map(lesson => {
                const isDuo = !!lesson.duoGroupId;
                return `<button type="button" class="lesson-pill agenda-inline-pill status-${lesson.status}${isDuo ? ' duo' : ''}" data-lesson-id="${lesson.id}">
                  <strong>${isDuo ? '👥 ' : ''}${escapeHtml(getLessonDisplayTitle(lesson))}</strong>
                  <span>${lesson.time}</span>
                </button>`;
              }).join('') : (getExternalBusyOverlap({ date: iso, time, duration: 60 }) ? `<div class="lesson-pill agenda-inline-pill" style="opacity:.68;cursor:not-allowed;"><strong>OCCUPATO</strong><span>${time}</span></div>` : `<button type="button" class="agenda-week-add" data-add-slot="${iso}|${time}">Slot libero</button>`)}
            </div>
          `;
        }).join('')}
      `).join('')}
    </div>
  `;
  el.agendaWrap.querySelectorAll('[data-open-day]').forEach(node => node.addEventListener('click', () => {
    state.selectedDay = node.getAttribute('data-open-day');
    state.calendarView = 'day';
    saveState();
    renderAll();
  }));
  el.agendaWrap.querySelectorAll('[data-add-slot]').forEach(button => button.addEventListener('click', () => {
    const [iso, time] = button.getAttribute('data-add-slot').split('|');
    addLessonFromDaySlot(iso, time);
  }));
  el.agendaWrap.querySelectorAll('[data-lesson-id]').forEach(button => button.addEventListener('click', () => {
    openLessonModal(button.getAttribute('data-lesson-id'));
  }));
}

function renderDayAgenda(dayIso = state.selectedDay || todayISO()) {
  const dayLessons = getLessonsByDate(dayIso);
  const dayLabel = formatDateFancy(dayIso);
  const selectedClient = getClient(state.selectedClientId);
  const activePlan = selectedClient ? getActivePlan(selectedClient.id) : null;
  const selectedPackage = getPackage(activePlan?.packageId);
  const selectedDuration = Number(selectedPackage?.duration || 60);
  const slotTimes = buildDaySlotTimes();
  el.agendaWrap.innerHTML = `
    <div class="agenda-card">
      <div class="agenda-card-top">
        <div>
          <div class="agenda-hour">${escapeHtml(dayLabel)}</div>
          <div class="muted small">Vista lista del giorno con spazi liberi e lezioni fissate</div>
        </div>
        <button class="btn btn-soft btn-small" type="button" id="openSelectedDayModalBtn">Apri giornata completa</button>
      </div>
      <div class="day-slots-wrap">
        <div class="day-slots-title">Orari del giorno</div>
        <div class="day-slot-grid" id="agendaDaySlotGrid">
          ${slotTimes.map(time => {
            const exactLesson = dayLessons.find(lesson => lesson.time === time && lesson.status !== 'cancelled');
            const cancelledLesson = dayLessons.find(lesson => lesson.time === time && lesson.status === 'cancelled');
            const slotDuration = Number(exactLesson?.duration || selectedDuration || 60);
            const endTime = addMinutesToTime(time, slotDuration);
            const overlappingLesson = getOverlappingLesson({ date: dayIso, time, duration: selectedDuration || 60 });
            if (exactLesson) {
              const statusText = exactLesson.status === 'done' ? 'Svolta' : 'Apri';
              const duoPartnerAgenda = getDuoPartner(exactLesson);
              const duoTagAgenda = duoPartnerAgenda ? ' 👥 DUO' : '';
              const duoMetaAgenda = duoPartnerAgenda
                ? `${escapeHtml(getClientFullName(getClient(exactLesson.clientId)))} + ${escapeHtml(getClientFullName(getClient(duoPartnerAgenda.clientId)))}`
                : escapeHtml(getLessonDisplayTitle(exactLesson));
              return `
                <button class="day-slot exact${duoPartnerAgenda ? ' duo' : ''}" data-slot-lesson-id="${exactLesson.id}">
                  <div class="day-slot-main">
                    <div class="day-slot-time">${time} - ${endTime}${duoTagAgenda}</div>
                    <div class="day-slot-meta">${duoMetaAgenda}${exactLesson.note ? ` • ${escapeHtml(exactLesson.note)}` : ''}</div>
                  </div>
                  <span class="day-slot-state">${statusText}</span>
                </button>
              `;
            }
            if (overlappingLesson) {
              const overlapExactAgenda = dayLessons.find(l => l.time === time && l.status !== 'cancelled');
              const isHiddenDuoPartnerAgenda = overlapExactAgenda && overlapExactAgenda.duoGroupId && overlapExactAgenda.duoGroupId === overlappingLesson.duoGroupId;
              if (isHiddenDuoPartnerAgenda) return '';
              return `
                <button class="day-slot busy" data-slot-lesson-id="${overlappingLesson.id}">
                  <div class="day-slot-main">
                    <div class="day-slot-time">${time} - ${endTime}</div>
                    <div class="day-slot-meta">Occupato da ${escapeHtml(getLessonDisplayTitle(overlappingLesson))} • ${overlappingLesson.time}</div>
                  </div>
                  <span class="day-slot-state">Occupato</span>
                </button>
              `;
            }
            const externalBusy = getExternalBusyOverlap({ date: dayIso, time, duration: selectedDuration || 60 });
            if (externalBusy) {
              return `
                <button class="day-slot busy" type="button" disabled>
                  <div class="day-slot-main">
                    <div class="day-slot-time">${time} - ${endTime}</div>
                    <div class="day-slot-meta">Occupato da calendario esterno</div>
                  </div>
                  <span class="day-slot-state">Occupato</span>
                </button>
              `;
            }
            return `
              <button class="day-slot free" data-slot-time="${time}" ${selectedClient ? '' : 'disabled'}>
                <div class="day-slot-main">
                  <div class="day-slot-time">${time} - ${endTime}</div>
                  <div class="day-slot-meta">${cancelledLesson ? 'Lezione annullata: slot di nuovo disponibile' : (selectedClient ? 'Inserisci qui la lezione' : 'Seleziona prima un cliente')}</div>
                </div>
                <span class="day-slot-state">Aggiungi</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>
      <div class="day-lessons-wrap" ${dayLessons.length ? '' : 'hidden'}>
        <div class="day-slots-title">Lezioni fissate</div>
        <div class="day-detail-list" id="agendaDayLessonList">
          ${(() => {
            const seenGroups = new Set();
            return dayLessons.filter(lesson => {
              if (!lesson.duoGroupId) return true;
              if (seenGroups.has(lesson.duoGroupId)) return false;
              seenGroups.add(lesson.duoGroupId);
              return true;
            }).map(lesson => {
              const statusText = lesson.status === 'done' ? 'Svolta' : lesson.status === 'cancelled' ? 'Annullata' : 'Programmata';
              return `
                <button class="day-lesson-item" data-lesson-id="${lesson.id}">
                  <div class="day-lesson-main">
                    <strong>${escapeHtml(getLessonDisplayTitle(lesson) || 'Cliente')}</strong>
                    <div class="day-lesson-meta">${lesson.time} • ${lesson.duration || 60} min${lesson.note ? ` • ${escapeHtml(lesson.note)}` : ''}</div>
                  </div>
                  <div class="day-lesson-side">
                    <span class="day-status-chip status-${lesson.status}">${statusText}</span>
                    <span class="muted small">Apri</span>
                  </div>
                </button>
              `;
            }).join('');
          })()}
        </div>
        ${dayLessons.length ? '' : '<div class="day-empty">Nessuna lezione fissata in questa giornata.</div>'}
      </div>
    </div>
  `;
  const modalBtn = document.getElementById('openSelectedDayModalBtn');
  if (modalBtn) modalBtn.addEventListener('click', () => openDayModal(dayIso));
  el.agendaWrap.querySelectorAll('[data-slot-time]').forEach(button => button.addEventListener('click', () => {
    addLessonFromDaySlot(dayIso, button.getAttribute('data-slot-time'));
  }));
  el.agendaWrap.querySelectorAll('[data-slot-lesson-id]').forEach(button => button.addEventListener('click', () => {
    openLessonModal(button.getAttribute('data-slot-lesson-id'));
  }));
  el.agendaWrap.querySelectorAll('[data-lesson-id]').forEach(button => button.addEventListener('click', () => {
    openLessonModal(button.getAttribute('data-lesson-id'));
  }));
}

function renderCalendarHead() {
  const client = getClient(state.selectedClientId);
  const isMobileMonth = state.calendarView === 'month' && window.innerWidth <= 580;
  el.calendarViewButtons.forEach(button => {
    const isActive = button.getAttribute('data-calendar-view') === state.calendarView;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
  if (state.calendarView === 'month') {
    el.calendarHead.style.display = 'grid';
    el.calendarHead.innerHTML = (isMobileMonth ? ['L','M','M','G','V','S','D'] : DAYS_IT).map(day => `<div>${day}</div>`).join('');
    el.monthLabel.textContent = formatMonthLabel(state.viewDate);
  } else if (state.calendarView === 'week') {
    el.calendarHead.style.display = 'none';
    const monday = addDays(getCalendarAnchorDate(), -((getCalendarAnchorDate().getDay() + 6) % 7));
    const sunday = addDays(monday, 6);
    el.monthLabel.textContent = `Settimana ${monday.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })} - ${sunday.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })}`;
  } else {
    el.calendarHead.style.display = 'none';
    el.monthLabel.textContent = fromISO(state.selectedDay || todayISO()).toLocaleDateString('it-IT', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  }
  el.calendarMeta.textContent = client ? `Cliente attivo: ${getClientFullName(client)}` : 'Nessun cliente attivo';
  if (el.calendarQuickSearch && document.activeElement !== el.calendarQuickSearch && !state.calendarQuickSearch) {
    el.calendarQuickSearch.value = client ? getClientFullName(client) : '';
  }
  renderCalendarQuickSearchResults();
}

function renderCalendar() {
  if (state.calendarView !== 'month') {
    el.calendarGrid.innerHTML = '';
    el.calendarGrid.style.display = 'none';
    el.calendarGrid.classList.remove('ios-month-grid');
    el.agendaWrap.hidden = false;
    if (state.calendarView === 'week') renderWeekAgenda(getCalendarAnchorDate());
    else renderDayAgenda(state.selectedDay || todayISO());
    return;
  }
  const isMobileMonth = window.innerWidth <= 580;
  el.calendarGrid.style.display = 'grid';
  el.calendarGrid.classList.toggle('ios-month-grid', isMobileMonth);
  el.agendaWrap.hidden = true;
  const first = new Date(state.viewDate.getFullYear(), state.viewDate.getMonth(), 1);
  const startOffset = (first.getDay() + 6) % 7;
  const startDate = addDays(first, -startOffset);
  const cells = [];

  for (let i = 0; i < 42; i++) {
    const date = addDays(startDate, i);
    const iso = toISO(date);
    const dayLessons = getLessonsByDate(iso);
    const isOther = date.getMonth() !== state.viewDate.getMonth();
    const isToday = iso === todayISO();
    const visibleLessons = dayLessons.slice(0, isMobileMonth ? 1 : 2);
    const hiddenLessons = Math.max(0, dayLessons.length - visibleLessons.length);
    const weekdayLetter = ['D','L','M','M','G','V','S'][date.getDay()];
    cells.push(`
      <div class="day-cell ${isOther ? 'other-month' : ''} ${isToday ? 'today' : ''} ${iso === state.selectedDay ? 'selected-day' : ''}" data-date="${iso}">
        <div class="day-top">
          <div class="day-top-main">
            ${isMobileMonth ? '' : `<div class="day-weekday">${weekdayLetter}</div>`}
            <div class="day-number">${date.getDate()}</div>
          </div>
          <button class="day-add" data-add-date="${iso}" title="Apri giorno">＋</button>
        </div>
        <div class="day-events">
          ${dayLessons.length ? visibleLessons.map(lesson => {
            const client = getClient(lesson.clientId);
            const isDuo = !!lesson.duoGroupId;
            return `
              <button class="lesson-pill status-${lesson.status}${isDuo ? ' duo' : ''}" data-lesson-id="${lesson.id}" title="${escapeHtml(getClientFullName(client) || '')}">
                <strong>${isDuo ? '👥 ' : ''}${escapeHtml(getLessonDisplayTitle(lesson) || 'Cliente')}</strong>
                <span>${lesson.time}</span>
              </button>
            `;
          }).join('') : ''}
          ${hiddenLessons ? `<div class="calendar-more">+${hiddenLessons} altre</div>` : ''}
        </div>
      </div>
    `);
  }
  el.calendarGrid.innerHTML = cells.join('');
}

function getLessonsByDate(date) {
  if (!derived.lessonsByDate) {
    derived.lessonsByDate = new Map();
    state.lessons.forEach(item => {
      if (!derived.lessonsByDate.has(item.date)) derived.lessonsByDate.set(item.date, []);
      derived.lessonsByDate.get(item.date).push(item);
    });
    derived.lessonsByDate.forEach((items, key) => {
      items.sort((a, b) => a.time.localeCompare(b.time) || getClientFullName(getClient(a.clientId)).localeCompare(getClientFullName(getClient(b.clientId))));
      derived.lessonsByDate.set(key, items);
    });
  }
  return derived.lessonsByDate.get(date) || [];
}

function openDayModal(date) {
  state.selectedDay = date;
  renderDayModal(date);
  refreshGoogleBlockingAvailability(true);
  openModal('dayModalBackdrop');
}

function addLessonFromDaySlot(date, time) {
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
  const capacity = getPlanCapacity(plan.id);
  if (capacity.isFull) {
    showToast('Pacchetto completato: non puoi inserire altre lezioni.');
    return;
  }
  if (getExternalBusyOverlap({ date, time, duration: pkg.duration })) { showToast('Slot occupato da altro calendario.', 'warn'); return; }
  const ok = createLesson({ clientId: client.id, planId: plan.id, date, time, duration: pkg.duration, setFixedTime: client.scheduleMode === 'same' });
  if (ok) renderDayModal(date);
}

function renderDayModal(date = state.selectedDay) {
  if (!date) return;
  state.selectedDay = date;
  const dayLessons = getLessonsByDate(date);
  const dayDate = fromISO(date);
  const selectedClient = getClient(state.selectedClientId);
  const activePlan = selectedClient ? getActivePlan(selectedClient.id) : null;
  const selectedPackage = getPackage(activePlan?.packageId);
  const selectedDuration = Number(selectedPackage?.duration || 60);
  const slotTimes = buildDaySlotTimes();
  el.dayModalTitle.textContent = dayDate.toLocaleDateString('it-IT', { weekday: 'long', day: '2-digit', month: 'long' });
  el.dayModalSubtitle.textContent = selectedClient
    ? `Cliente attivo: ${getClientFullName(selectedClient)} • tocca l'orario per fissare la lezione`
    : `Apri il cliente e poi tocca l'orario desiderato`;
  el.dayAddLessonBtn.textContent = selectedClient ? 'Tocca l\'ora' : 'Seleziona cliente';
  el.dayAddLessonBtn.disabled = true;

  el.daySlotGrid.innerHTML = slotTimes.map(time => {
    const exactLesson = dayLessons.find(lesson => lesson.time === time && lesson.status !== 'cancelled');
    const cancelledLesson = dayLessons.find(lesson => lesson.time === time && lesson.status === 'cancelled');
    const slotDuration = Number(exactLesson?.duration || selectedDuration || 60);
    const endTime = addMinutesToTime(time, slotDuration);
    const overlappingLesson = getOverlappingLesson({ date, time, duration: selectedDuration || 60 });
    if (exactLesson) {
      const statusText = exactLesson.status === 'done' ? 'Svolta' : 'Apri';
      const duoPartnerSlot = getDuoPartner(exactLesson);
      const duoTag = duoPartnerSlot ? ' 👥 DUO' : '';
      const duoMeta = duoPartnerSlot
        ? `${escapeHtml(getClientFullName(getClient(exactLesson.clientId)))} + ${escapeHtml(getClientFullName(getClient(duoPartnerSlot.clientId)))}`
        : escapeHtml(getLessonDisplayTitle(exactLesson));
      return `
        <button class="day-slot exact${duoPartnerSlot ? ' duo' : ''}" data-slot-lesson-id="${exactLesson.id}">
          <div class="day-slot-main">
            <div class="day-slot-time">${time} - ${endTime}${duoTag}</div>
            <div class="day-slot-meta">${duoMeta}${exactLesson.note ? ` • ${escapeHtml(exactLesson.note)}` : ''}</div>
          </div>
          <span class="day-slot-state">${statusText}</span>
        </button>
      `;
    }
    if (overlappingLesson) {
      // Se il conflitto è la lezione-partner di un DUO già mostrata come exactLesson, salta
      const overlapExact = dayLessons.find(l => l.time === time && l.status !== 'cancelled');
      const isHiddenDuoPartner = overlapExact && overlapExact.duoGroupId && overlapExact.duoGroupId === overlappingLesson.duoGroupId;
      if (isHiddenDuoPartner) {
        // Slot già coperto dal duo: non mostrare riga separata
        return '';
      }
      return `
        <button class="day-slot busy" data-slot-lesson-id="${overlappingLesson.id}">
          <div class="day-slot-main">
            <div class="day-slot-time">${time} - ${endTime}</div>
            <div class="day-slot-meta">Occupato da ${escapeHtml(getLessonDisplayTitle(overlappingLesson))} • ${overlappingLesson.time}</div>
          </div>
          <span class="day-slot-state">Occupato</span>
        </button>
      `;
    }
    const externalBusy = getExternalBusyOverlap({ date, time, duration: selectedDuration || 60 });
    if (externalBusy) {
      return `
        <button class="day-slot busy" type="button" disabled>
          <div class="day-slot-main">
            <div class="day-slot-time">${time} - ${endTime}</div>
            <div class="day-slot-meta">Occupato da calendario esterno</div>
          </div>
          <span class="day-slot-state">Occupato</span>
        </button>
      `;
    }
    return `
      <button class="day-slot free" data-slot-time="${time}" ${selectedClient ? '' : 'disabled'}>
        <div class="day-slot-main">
          <div class="day-slot-time">${time} - ${endTime}</div>
          <div class="day-slot-meta">${cancelledLesson ? 'Lezione annullata: slot di nuovo disponibile' : (selectedClient ? 'Inserisci qui la lezione' : 'Seleziona prima un cliente')}</div>
        </div>
        <span class="day-slot-state">Aggiungi</span>
      </button>
    `;
  }).join('');

  el.daySlotGrid.querySelectorAll('[data-slot-time]').forEach(button => {
    button.addEventListener('click', () => addLessonFromDaySlot(date, button.getAttribute('data-slot-time')));
  });
  el.daySlotGrid.querySelectorAll('[data-slot-lesson-id]').forEach(button => {
    button.addEventListener('click', () => {
      closeModal('dayModalBackdrop');
      openLessonModal(button.getAttribute('data-slot-lesson-id'));
    });
  });

  el.dayLessonsWrap.hidden = !dayLessons.length;
  if (!dayLessons.length) {
    el.dayLessonList.innerHTML = '';
    return;
  }
  // Nei DUO mostra solo la lezione "primaria" (la prima del gruppo per id)
  const seenDuoGroups = new Set();
  const dayLessonsDeduped = dayLessons.filter(lesson => {
    if (!lesson.duoGroupId) return true;
    if (seenDuoGroups.has(lesson.duoGroupId)) return false;
    seenDuoGroups.add(lesson.duoGroupId);
    return true;
  });
  el.dayLessonList.innerHTML = dayLessonsDeduped.map(lesson => {
    const client = getClient(lesson.clientId);
    const statusText = lesson.status === 'done' ? 'Svolta' : lesson.status === 'cancelled' ? 'Annullata' : 'Programmata';
    return `
      <button class="day-lesson-item" data-lesson-id="${lesson.id}">
        <div class="day-lesson-main">
          <strong>${escapeHtml(getLessonDisplayTitle(lesson) || 'Cliente')}</strong>
          <div class="day-lesson-meta">${lesson.time} • ${lesson.duration || 60} min${lesson.note ? ` • ${escapeHtml(lesson.note)}` : ''}</div>
        </div>
        <div class="day-lesson-side">
          <span class="day-status-chip status-${lesson.status}">${statusText}</span>
          <span class="muted small">Apri</span>
        </div>
      </button>
    `;
  }).join('');
  el.dayLessonList.querySelectorAll('[data-lesson-id]').forEach(button => {
    button.addEventListener('click', () => {
      closeModal('dayModalBackdrop');
      openLessonModal(button.getAttribute('data-lesson-id'));
    });
  });
}
