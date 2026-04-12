═══════════════════════════════════════════════════════════ */
(function initMobileUI() {
  const drawerOverlay = document.getElementById('drawerOverlay');
  const sidebarDrawer = document.getElementById('sidebarDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const bnavClienti   = document.getElementById('bnavClienti');
  const bnavCalendario = document.getElementById('bnavCalendario');
  const bnavAddCliente = document.getElementById('bnavAddCliente');
  const bnavResoconto  = document.getElementById('bnavResoconto');
  const bnavPacchetti  = document.getElementById('bnavPacchetti');
  const openAccountBtnMobile = document.getElementById('openAccountBtnMobile');

  function openDrawer() {
    sidebarDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
    lockBodyScroll();
    const search = document.getElementById('clientSearchDrawer');
    if (search) setTimeout(() => search.focus(), 260);
  }
  function closeDrawer() {
    sidebarDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    unlockBodyScroll();
  }

  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (bnavClienti) bnavClienti.addEventListener('click', () => { openDrawer(); setActiveBnav(bnavClienti); });
  if (bnavCalendario) bnavCalendario.addEventListener('click', () => {
    closeDrawer();
    document.querySelector('.calendar-wrap')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveBnav(bnavCalendario);
  });
  if (bnavAddCliente) bnavAddCliente.addEventListener('click', event => { closeDrawer(); openNewClientModal(event.currentTarget); });
  if (bnavResoconto) bnavResoconto.addEventListener('click', () => { closeDrawer(); renderReport(); openModal('reportModalBackdrop'); });
  if (bnavPacchetti) bnavPacchetti.addEventListener('click', () => { closeDrawer(); renderPackages(); openModal('packagesModalBackdrop'); });
  if (openAccountBtnMobile) openAccountBtnMobile.addEventListener('click', async () => { populateCloudConfigInputs(); await refreshGoogleStatus(); openModal('accountModalBackdrop'); });

  function setActiveBnav(activeBtn) {
    document.querySelectorAll('.bnav-btn').forEach(b => b.classList.remove('active'));
    if (activeBtn) activeBtn.classList.add('active');
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
        /* sync main sidebar filter row */
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
  const syncObserver = new MutationObserver(mirrorSyncBadge);
  const syncBadgeEl = document.getElementById('syncBadge');
  if (syncBadgeEl) syncObserver.observe(syncBadgeEl, { characterData: true, subtree: true, childList: true });

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

  /* Patch renderClientList to also populate drawer */
  const _origRenderAll = window._renderAllOrig || null;
})();

/* ── Navigazione automatica tra campi form con tasto Enter ── */
/* ═══════════════════════════════════════════════════════════
   PORTALE CLIENTE — messaggi in arrivo (vista trainer)
═══════════════════════════════════════════════════════════ */

/* Sostituisci con l'URL della tua Edge Function Supabase */
/* ═══════════════════════════════════════════════════════════
   BADGE MESSAGGI NON LETTI — aggiorna tutti i badge
═══════════════════════════════════════════════════════════ */
let _unreadMsgCount = 0;
