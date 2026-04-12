/* ── Mobile UI — bottom nav, drawer, badge ─────────────────
   L'IIFE garantisce che i listener vengano attaccati sempre,
   indipendentemente dal flusso asincrono di initApp.
   initMobileUI() viene anche chiamata da initApp per
   ri-attaccare i listener dopo il login se necessario.
─────────────────────────────────────────────────────────── */

/* Attacca i listener al bottom nav — chiamata sia come IIFE
   che da initApp() per garantire doppia copertura */
function initMobileUI() {

  const drawerOverlay  = document.getElementById('drawerOverlay');
  const sidebarDrawer  = document.getElementById('sidebarDrawer');
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

  if (bnavClienti)    bnavClienti.addEventListener('click',    () => { openDrawer(); setActiveBnav(bnavClienti); });
  if (bnavCalendario) bnavCalendario.addEventListener('click', () => {
    closeDrawer();
    document.querySelector('.calendar-wrap')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveBnav(bnavCalendario);
  });
  if (bnavAddCliente) bnavAddCliente.addEventListener('click', event => { closeDrawer(); openNewClientModal(event.currentTarget); });
  if (bnavResoconto)  bnavResoconto.addEventListener('click',  () => { closeDrawer(); renderReport(); openModal('reportModalBackdrop'); });
  if (bnavPacchetti)  bnavPacchetti.addEventListener('click',  () => { closeDrawer(); renderPackages(); openModal('packagesModalBackdrop'); });
  if (openAccountBtnMobile) openAccountBtnMobile.addEventListener('click', async () => {
    populateCloudConfigInputs(); await refreshGoogleStatus(); openModal('accountModalBackdrop');
  });

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

/* IIFE: gira subito al parse, garantisce listener anche se initApp
   non riesce a completarsi per qualsiasi motivo */
(function() {
  /* Aspetta che il DOM sia pronto (lo script è a fine body,
     quindi document è già disponibile) */
  try { initMobileUI(); } catch(e) {
    /* Se initMobileUI fallisce (funzioni non ancora definite),
       riprova dopo che initApp le ha caricate */
    window._mobileUIRetry = true;
  }
})();

let _unreadMsgCount = 0;
