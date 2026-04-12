/* ── Mobile UI — drawer, bottom nav, sync badge ──────────────
   Chiamata da initApp() invece che come IIFE, così eventuali
   errori nei file precedenti non la bloccano.
   Usa anche event delegation sul bottomNav come fallback.
─────────────────────────────────────────────────────────────── */
function initMobileUI() {
  const drawerOverlay = document.getElementById('drawerOverlay');
  const sidebarDrawer = document.getElementById('sidebarDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const bnavClienti    = document.getElementById('bnavClienti');
  const bnavCalendario = document.getElementById('bnavCalendario');
  const bnavAddCliente = document.getElementById('bnavAddCliente');
  const bnavResoconto  = document.getElementById('bnavResoconto');
  const bnavPacchetti  = document.getElementById('bnavPacchetti');
  const openAccountBtnMobile = document.getElementById('openAccountBtnMobile');

  function openDrawer() {
    if (!sidebarDrawer || !drawerOverlay) return;
    sidebarDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
    lockBodyScroll();
    const search = document.getElementById('clientSearchDrawer');
    if (search) setTimeout(() => search.focus(), 260);
  }
  function closeDrawer() {
    if (!sidebarDrawer || !drawerOverlay) return;
    sidebarDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    unlockBodyScroll();
  }

  function setActiveBnav(activeBtn) {
    document.querySelectorAll('.bnav-btn').forEach(b => b.classList.remove('active'));
    if (activeBtn) activeBtn.classList.add('active');
  }

  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);

  /* Safeguard: rimuovi eventuali lock rimasti sul body prima di ogni azione nav */
  function safeNavAction(fn) {
    document.body.classList.remove('modal-scroll-lock');
    document.documentElement.classList.remove('modal-scroll-lock');
    fn();
  }

  if (bnavClienti) bnavClienti.addEventListener('click', () => safeNavAction(() => { openDrawer(); setActiveBnav(bnavClienti); }));
  if (bnavCalendario) bnavCalendario.addEventListener('click', () => safeNavAction(() => {
    closeDrawer();
    document.querySelector('.calendar-wrap')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveBnav(bnavCalendario);
  }));
  if (bnavAddCliente) bnavAddCliente.addEventListener('click', event => safeNavAction(() => { closeDrawer(); openNewClientModal(event.currentTarget); }));
  if (bnavResoconto) bnavResoconto.addEventListener('click', () => safeNavAction(() => { closeDrawer(); renderReport(); openModal('reportModalBackdrop'); }));
  if (bnavPacchetti) bnavPacchetti.addEventListener('click', () => safeNavAction(() => { closeDrawer(); renderPackages(); openModal('packagesModalBackdrop'); }));
  if (openAccountBtnMobile) openAccountBtnMobile.addEventListener('click', async () => {
    populateCloudConfigInputs();
    await refreshGoogleStatus();
    openModal('accountModalBackdrop');
  });

  /* Event delegation come fallback — cattura i click sul bottomNav
     anche se i listener diretti non fossero stati attaccati */
  const bottomNav = document.getElementById('bottomNav');
  if (bottomNav) {
    bottomNav.addEventListener('click', event => {
      const btn = event.target.closest('[id^="bnav"]');
      if (!btn) return;
      const id = btn.id;
      if (id === 'bnavClienti')    { openDrawer(); setActiveBnav(btn); }
      if (id === 'bnavCalendario') { closeDrawer(); document.querySelector('.calendar-wrap')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); setActiveBnav(btn); }
      if (id === 'bnavAddCliente') { closeDrawer(); openNewClientModal(btn); }
      if (id === 'bnavResoconto')  { closeDrawer(); renderReport(); openModal('reportModalBackdrop'); }
      if (id === 'bnavPacchetti')  { closeDrawer(); renderPackages(); openModal('packagesModalBackdrop'); }
    });
  }

  /* Sync drawer client search/filter with main state */
  const drawerSearch = document.getElementById('clientSearchDrawer');
  if (drawerSearch) {
    drawerSearch.addEventListener('input', event => {
      state.search = event.target.value;
      renderClientList();
    });
  }
  const drawerFilterRow = document.getElementById('clientFilterRowDrawer');
  if (drawerFilterRow) {
    drawerFilterRow.querySelectorAll('[data-drawer-filter]').forEach(button => {
      button.addEventListener('click', () => {
        state.clientFilter = button.getAttribute('data-drawer-filter');
        drawerFilterRow.querySelectorAll('[data-drawer-filter]').forEach(b => {
          const isActive = b.getAttribute('data-drawer-filter') === state.clientFilter;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
        el.clientFilterRow?.querySelectorAll('[data-client-filter]').forEach(b => {
          const isActive = b.getAttribute('data-client-filter') === state.clientFilter;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
        renderClientList();
      });
    });
  }

  const exportBtnDrawer = document.getElementById('exportBtnDrawer');
  if (exportBtnDrawer) exportBtnDrawer.addEventListener('click', exportBackup);

  /* Mirror sync badge to mobile topbar */
  const syncBadgeMobile = document.getElementById('syncBadgeMobile');
  function mirrorSyncBadge() {
    if (!syncBadgeMobile) return;
    const main = document.getElementById('syncBadge');
    if (!main) return;
    const isOk = main.textContent.toLowerCase().includes('sincron') || main.textContent.toLowerCase().includes('cloud');
    syncBadgeMobile.style.color = isOk ? '#1db954' : 'rgba(255,255,255,0.4)';
    syncBadgeMobile.title = main.textContent;
  }
  const syncBadgeEl = document.getElementById('syncBadge');
  if (syncBadgeEl) new MutationObserver(mirrorSyncBadge).observe(syncBadgeEl, { characterData: true, subtree: true, childList: true });

  /* Offline retry button */
  const offlineRetryBtn = document.getElementById('offlineRetryBtn');
  if (offlineRetryBtn) {
    offlineRetryBtn.addEventListener('click', async () => {
      document.getElementById('offlineBanner')?.classList.remove('show');
      const ok = await syncStateToCloud(true);
      if (ok) showToast('Sincronizzazione completata.', 'ok');
      else showToast('Ancora offline. Riprova più tardi.', 'error');
    });
  }
}

let _unreadMsgCount = 0;
