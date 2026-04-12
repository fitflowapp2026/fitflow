/* ═══════════════════════════════════════════════════════════
   HERO GREETING & TODAY STRIP
═══════════════════════════════════════════════════════════ */
function renderHeroGreeting() {
  const dateLabel = document.getElementById('heroDateLabel');
  const greeting  = document.getElementById('heroGreeting');
  const strip     = document.getElementById('todayLessonsStrip');
  const stripItems = document.getElementById('todayStripItems');

  if (!dateLabel || !greeting) return;

  /* Date label */
  const now = new Date();
  const dayStr = now.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  dateLabel.textContent = dayStr.charAt(0).toUpperCase() + dayStr.slice(1);

  /* Greeting by time of day */
  const hour = now.getHours();
  const saluto = hour < 12 ? 'Buongiorno' : hour < 18 ? 'Buon pomeriggio' : 'Buonasera';
  const todayBreakdown = getTodayLessonBreakdown(todayISO());
  const todayCount = todayBreakdown.personal + todayBreakdown.free;
  const alerts = getAlerts();
  const expiringCount = alerts.filter(a => a.type === 'renewal').length;

  const parts = [];
  if (todayBreakdown.personal > 0) parts.push(`${todayBreakdown.personal} ${todayBreakdown.personal === 1 ? 'lezione' : 'lezioni'}`);
  if (todayBreakdown.free > 0) parts.push(`${todayBreakdown.free} free`);
  if (expiringCount > 0) parts.push(`${expiringCount} ${expiringCount === 1 ? 'rinnovo in scadenza' : 'rinnovi in scadenza'}`);

  let subText = '';
  if (parts.length) subText = parts.join(' · ');
  else subText = 'Nessuna lezione oggi';

  greeting.textContent = saluto + '!';

  /* Update subtitle */
  const heroSub = document.getElementById('heroSubtitle');
  if (heroSub) heroSub.textContent = subText;

  /* Today's lessons strip */
  if (!strip || !stripItems) return;
  const todayLessons = state.lessons
    .filter(l => l.date === todayISO())
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  if (todayLessons.length === 0) {
    strip.hidden = true;
    return;
  }
  strip.hidden = false;
  stripItems.innerHTML = todayLessons.map(lesson => {
    const client = getClient(lesson.clientId);
    const name   = client ? getClientFullName(client).split(' ')[0] : 'Cliente';
    return `<button class="today-lesson-chip status-${lesson.status}" data-lesson-id="${lesson.id}" type="button" aria-label="${escapeHtml(getClientFullName(client))} alle ${lesson.time}">
      <span class="chip-time">${escapeHtml(lesson.time || '--:--')}</span>
      <span class="chip-name">${escapeHtml(name)}</span>
    </button>`;
  }).join('');
  stripItems.querySelectorAll('[data-lesson-id]').forEach(btn => {
    btn.addEventListener('click', () => openLessonModal(btn.getAttribute('data-lesson-id')));
  });
}

/* ═══════════════════════════════════════════════════════════
   PWA INSTALL BANNER
═══════════════════════════════════════════════════════════ */
let _pwaInstallPrompt = null;
function initPWAInstallBanner() {
  const banner      = document.getElementById('pwaInstallBanner');
  const installBtn  = document.getElementById('pwaInstallBtn');
  const dismissBtn  = document.getElementById('pwaInstallDismissBtn');
  if (!banner) return;

  /* Already dismissed this session */
  if (sessionStorage.getItem('pwa_banner_dismissed')) return;
  /* Already installed as standalone */
  if (window.matchMedia('(display-mode: standalone)').matches) return;

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    _pwaInstallPrompt = e;
    banner.classList.add('show');
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!_pwaInstallPrompt) return;
      _pwaInstallPrompt.prompt();
      const { outcome } = await _pwaInstallPrompt.userChoice;
      if (outcome === 'accepted') showToast('DSWORLD installato!', 'ok');
      _pwaInstallPrompt = null;
      banner.classList.remove('show');
    });
  }
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      banner.classList.remove('show');
      sessionStorage.setItem('pwa_banner_dismissed', '1');
    });
  }
}

function throttle(fn, delay) {
  let last = 0;
  let timer = null;
  return (...args) => {
    const now = Date.now();
    const remaining = delay - (now - last);
    if (remaining <= 0) {
      clearTimeout(timer);
      timer = null;
      last = now;
      fn(...args);
      return;
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      last = Date.now();
      fn(...args);
    }, remaining);
  };
}

function bindClientListDelegation(root, { closeDrawerOnSelect = false } = {}) {
  if (!root || root.dataset.bound === 'true') return;
  root.dataset.bound = 'true';
  const activate = target => {
    const card = target.closest('[data-client-id]');
    if (!card || !root.contains(card)) return;
    selectClient(card.getAttribute('data-client-id'));
    if (closeDrawerOnSelect) {
      document.getElementById('sidebarDrawer')?.classList.remove('open');
      document.getElementById('drawerOverlay')?.classList.remove('open');
      unlockBodyScroll();
    }
  };
  root.addEventListener('click', event => activate(event.target));
  root.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const card = event.target.closest('[data-client-id]');
    if (!card || !root.contains(card)) return;
    event.preventDefault();
    activate(card);
  });
}

function initInteractionDelegation() {
  bindClientListDelegation(el.clientList);
  bindClientListDelegation(document.getElementById('clientListDrawer'), { closeDrawerOnSelect: true });

  if (el.calendarQuickSearchResults && el.calendarQuickSearchResults.dataset.bound !== 'true') {
    el.calendarQuickSearchResults.dataset.bound = 'true';
    el.calendarQuickSearchResults.addEventListener('click', event => {
      const button = event.target.closest('[data-quick-client]');
      if (!button) return;
      const clientId = button.getAttribute('data-quick-client');
      selectClient(clientId);
      const client = getClient(clientId);
      el.calendarQuickSearch.value = client ? getClientFullName(client) : '';
      state.calendarQuickSearch = '';
      renderCalendarQuickSearchResults();
    });
  }

  if (el.calendarGrid && el.calendarGrid.dataset.bound !== 'true') {
    el.calendarGrid.dataset.bound = 'true';
    el.calendarGrid.addEventListener('click', event => {
      const lessonBtn = event.target.closest('.lesson-pill');
      if (lessonBtn) {
        event.stopPropagation();
        openLessonModal(lessonBtn.getAttribute('data-lesson-id'));
        return;
      }
      const addBtn = event.target.closest('.day-add');
      if (addBtn) {
        event.stopPropagation();
        const iso = addBtn.getAttribute('data-add-date');
        state.selectedDay = iso;
        if (window.innerWidth <= 580) {
          state.calendarView = 'day';
          saveState();
          renderAll();
        } else {
          openDayModal(iso);
        }
        return;
      }
      const cell = event.target.closest('.day-cell');
      if (!cell) return;
      const iso = cell.getAttribute('data-date');
      state.selectedDay = iso;
      if (window.innerWidth <= 580) {
        state.calendarView = 'day';
        saveState();
        renderAll();
      } else {
        openDayModal(iso);
      }
    });
  }

  if (el.agendaWrap && el.agendaWrap.dataset.bound !== 'true') {
    el.agendaWrap.dataset.bound = 'true';
    el.agendaWrap.addEventListener('click', event => {
      const slotTime = event.target.closest('[data-slot-time]');
      if (slotTime) {
        addLessonFromDaySlot(state.selectedDay || todayISO(), slotTime.getAttribute('data-slot-time'));
        return;
      }
      const slotLesson = event.target.closest('[data-slot-lesson-id]');
      if (slotLesson) {
        openLessonModal(slotLesson.getAttribute('data-slot-lesson-id'));
        return;
      }
      const lesson = event.target.closest('[data-lesson-id]');
      if (lesson) openLessonModal(lesson.getAttribute('data-lesson-id'));
    });
  }
}

/* ═══════════════════════════════════════════════════════════
   DEBOUNCED CLIENT SEARCH
═══════════════════════════════════════════════════════════ */
function debounce(fn, delay) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

/* Patch client search inputs to use debounce */
function initDebouncedSearch() {
  const searchIds = ['clientSearch', 'clientSearchDrawer'];
  const debouncedUpdate = debounce(value => {
    state.search = value;
    renderClientList();
  }, 160);
  searchIds.forEach(id => {
    const input = document.getElementById(id);
    if (!input || input.dataset.debounced === 'true') return;
    input.dataset.debounced = 'true';
    input.addEventListener('input', e => {
      const value = e.target.value;
      searchIds.forEach(otherId => {
        if (otherId === id) return;
        const other = document.getElementById(otherId);
        if (other && other.value !== value) other.value = value;
      });
      debouncedUpdate(value);
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   FREE SESSION → CONVERSIONE PERCORSO
   Si apre: (a) quando si clicca "Svolta" su lezione free,
            (b) auto-complete timer,
            (c) clic sul cliente con lezione done non convertita
═══════════════════════════════════════════════════════════ */
function openFreeSessionConversionModal(client) {
  const backdrop = document.getElementById('fscBackdrop');
  if (!backdrop) return;

  const subtitleEl  = document.getElementById('fscSubtitle');
  const purchaseSec = document.getElementById('fscPurchaseSection');
  const previewEl   = document.getElementById('fscPreview');

  subtitleEl.textContent = `${getClientFullName(client)} ha completato la free session. Ha deciso di iniziare un percorso?`;

  /* Pacchetti disponibili: includi PACK 99, escludi FREE SESSION puro */
  const packages = state.packages.filter(p => p.name.toUpperCase() !== 'FREE SESSION');

  /* Se non ci sono pacchetti, vai direttamente a modifica cliente */
  if (!packages.length) {
    backdrop.classList.remove('open');
    unlockBodyScroll();
    renderClientModal(client);
    openModal('clientModalBackdrop');
    showToast('Aggiungi prima un pacchetto.', 'warn');
    return;
  }

  /* Popola il select con fresh clone per rimuovere listener precedenti */
  const oldSel = document.getElementById('fscPackageSelect');
  const newSel = oldSel.cloneNode(false); // cloneNode(false) = solo elemento, senza figli
  oldSel.parentNode.replaceChild(newSel, oldSel);
  newSel.innerHTML = packages.map(p =>
    `<option value="${p.id}">${escapeHtml(p.name)} — ${formatCurrency(p.totalPrice)}</option>`
  ).join('');

  const oldPrice = document.getElementById('fscPriceInput');
  const newPrice = oldPrice.cloneNode(false);
  oldPrice.parentNode.replaceChild(newPrice, oldPrice);
  newPrice.value = '';

  /* Funzione di aggiornamento preview */
  function refreshPreview() {
    const pkg = getPackage(newSel.value);
    if (!pkg) { previewEl.innerHTML = ''; return; }
    if (!newPrice.value) newPrice.value = pkg.totalPrice > 0 ? pkg.totalPrice : '';
    previewEl.innerHTML = buildPackageSummary(pkg, Number(newPrice.value) || pkg.totalPrice);
  }

  /* Mostra/nascondi sezione acquisto in base alla scelta iniziale */
  purchaseSec.style.display = 'grid';
  newSel.addEventListener('change', () => { newPrice.value = ''; refreshPreview(); });
  newPrice.addEventListener('input', refreshPreview);

  /* Trigger iniziale */
  const firstPkg = packages[0];
  if (firstPkg) {
    newPrice.value = firstPkg.totalPrice > 0 ? firstPkg.totalPrice : '';
    previewEl.innerHTML = buildPackageSummary(firstPkg, Number(newPrice.value) || 0);
  }

  /* Clone bottoni per rimuovere listener stantii */
  ['fscNoBtn','fscSkipBtn','fscYesBtn'].forEach(id => {
    const el2   = document.getElementById(id);
    const clone = el2.cloneNode(true);
    el2.parentNode.replaceChild(clone, el2);
  });

  function closeFsc() { backdrop.classList.remove('open'); unlockBodyScroll(); }

  /* NO → da ricontattare */
  document.getElementById('fscNoBtn').addEventListener('click', () => {
    client.conversionStatus = 'follow_up';
    saveState(true); renderAll(); closeFsc();
    showToast(`${getClientFullName(client)} segnato come da ricontattare.`, 'warn');
  });

  /* SKIP → decide dopo */
  document.getElementById('fscSkipBtn').addEventListener('click', closeFsc);

  /* SÌ → avvia percorso */
  document.getElementById('fscYesBtn').addEventListener('click', () => {
    const selEl = document.getElementById('fscPackageSelect');
    const prEl  = document.getElementById('fscPriceInput');
    const pkg   = getPackage(selEl?.value);
    if (!pkg) { showToast('Seleziona un pacchetto.', 'warn'); return; }
    const price = Number(prEl?.value);
    if (isNaN(price) || price < 0) { showToast('Inserisci un prezzo valido.', 'warn'); return; }

    /* Converti cliente */
    client.serviceType      = 'personal';
    client.freeSessionDone  = true;
    client.conversionStatus = 'path_started';
    client.packagePrice     = price;
    client.paymentStatus    = 'unpaid';
    client.paymentMode      = 'single';

    /* Crea nuovo piano */
    const newPlanId = uid('plan');
    state.plans.push({
      id: newPlanId, clientId: client.id, packageId: pkg.id,
      startDate: todayISO(), checkMode: '12',
      saleType: 'new', createdAt: new Date().toISOString()
    });
    client.activePlanId = newPlanId;

    /* Snapshot pagamento */
    ensureClientHistoryBuckets(client);
    pushClientPaymentSnapshot(client, 'create');

    saveState(true); renderAll(); closeFsc();
    showToast(`✅ Percorso avviato — ${escapeHtml(pkg.name)} · ${formatCurrency(price)}`, 'ok');
  });

  backdrop.classList.add('open');
  lockBodyScroll();
  requestAnimationFrame(() => document.getElementById('fscYesBtn')?.focus());
}

/* ═══════════════════════════════════════════════════════════
   MONTH PICKER — default = oggi, griglia 4×3 mesi
═══════════════════════════════════════════════════════════ */
const MONTHS_IT_SHORT = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];

function openMonthPicker(defaultDate, onConfirm) {
  const backdrop = document.getElementById('mpBackdrop');
  if (!backdrop) { onConfirm(defaultDate); return; }

  const todayM = new Date().getMonth();
  const todayY = new Date().getFullYear();
  let pickerY  = defaultDate.getFullYear();
  let pickerM  = defaultDate.getMonth();

  function renderMpGrid() {
    document.getElementById('mpYearLabel').textContent = pickerY;
    const grid = document.getElementById('mpGrid');
    grid.innerHTML = MONTHS_IT_SHORT.map((name, i) => {
      const isActive  = i === pickerM;
      const isCurrent = i === todayM && pickerY === todayY;
      return `<button class="mp-month-btn${isActive?' mp-active':''}${isCurrent&&!isActive?' mp-current':''}"
        data-m="${i}" type="button">${name}${isCurrent&&!isActive?' ·':''}</button>`;
    }).join('');
    grid.querySelectorAll('[data-m]').forEach(btn =>
      btn.addEventListener('click', () => { pickerM = +btn.dataset.m; renderMpGrid(); })
    );
  }

  /* Clone bottoni per eliminare listener stantii */
  ['mpPrevYear','mpNextYear','mpCancelBtn','mpConfirmBtn'].forEach(id => {
    const el2   = document.getElementById(id);
    const clone = el2.cloneNode(true);
    el2.parentNode.replaceChild(clone, el2);
  });

  document.getElementById('mpPrevYear').addEventListener('click',  () => { pickerY--; renderMpGrid(); });
  document.getElementById('mpNextYear').addEventListener('click',  () => { pickerY++; renderMpGrid(); });
  document.getElementById('mpCancelBtn').addEventListener('click', () => { backdrop.classList.remove('open'); unlockBodyScroll(); });
  document.getElementById('mpConfirmBtn').addEventListener('click', () => {
    backdrop.classList.remove('open'); unlockBodyScroll();
    onConfirm(new Date(pickerY, pickerM, 1));
  });

  backdrop.addEventListener('click', e => {
    if (e.target === backdrop) { backdrop.classList.remove('open'); unlockBodyScroll(); }
  }, { once: true });

  renderMpGrid();
  backdrop.classList.add('open');
  lockBodyScroll();
  requestAnimationFrame(() => document.getElementById('mpConfirmBtn')?.focus());
}
