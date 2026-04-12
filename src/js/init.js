
async function initApp() {
  loadStateLocal();
  resetPackageForm();
  el.clientStartDate.value = todayISO();
  /* Mostra skeleton subito mentre si caricano i dati */
  showClientSkeletons(6);
  
  /* 1. Carica le credenziali dal ponte Netlify */
  await loadRemoteConfig();
  
  /* 2. Recupera la configurazione (che ora dovrebbe avere le chiavi caricate) */
  const config = loadSupabaseConfig();
  console.log('[DSWORLD] Configurazione caricata:', config.url ? 'URL presente' : 'URL mancante');

  /* 3. Inizializza il client Supabase con la nuova configurazione */
  if (config.url && config.key) {
    const clientReady = initSupabaseClient(config);
    if (clientReady) {
      console.log('[DSWORLD] Client Supabase inizializzato con successo.');
    } else {
      console.error('[DSWORLD] Client Supabase NON inizializzato. Libreria o client non disponibile.');
    }
  } else {
    console.warn('[DSWORLD] Attenzione: Chiavi Supabase non trovate dopo loadRemoteConfig.');
  }

  persistSupabaseConfig(config);
  await ensureSupabaseReady();

  const currentUrl = new URL(window.location.href);
  const googleFlag = currentUrl.searchParams.get('google');
  const isRecoveryUrl = window.location.href.includes('type=recovery');
  
  if (isRecoveryUrl) {
    openModal('passwordUpdateModalBackdrop');
    updateAuthMessage('Imposta la nuova password per completare il reset.');
  }
  if (googleFlag === 'connected') {
    await refreshGoogleStatus();
    if (cloud.google.connected) await syncAllLessonsToGoogle(false);
    showToast('Google Calendar collegato.', 'ok');
    clearUrlParams(['google']);
  } else if (googleFlag === 'disconnected') {
    resetGoogleState();
    showToast('Google Calendar scollegato.', 'ok');
    clearUrlParams(['google']);
  } else if (googleFlag === 'error') {
    showToast('Connessione Google non riuscita.', 'error');
    clearUrlParams(['google', 'reason']);
  }
  renderAll();
  initInteractionDelegation();
  updateGoogleUi();
  renderHeroGreeting();
  initDebouncedSearch();
  initFormKeyboardNav();
  initMessagesModal();
  /* Prima carica il conteggio, poi avvia Realtime */
  refreshUnreadMessages();
  initRealtimeMessages();

  /* ── PWA: register Service Worker ────────────────────── */
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  /* ── PWA: show install banner ─────────────────────────── */
  initPWAInstallBanner();

  /* Smart auto-complete: schedule next tick at the exact minute the nearest lesson ends */
  (function scheduleNextAutoComplete() {
    const now = new Date();
    const next = state.lessons
      .filter(l => l.status === 'scheduled')
      .map(l => getLessonEndDate(l))
      .filter(d => d > now)
      .sort((a, b) => a - b)[0];
    const delay = next ? Math.max(15000, next - now + 2000) : 60000;
    setTimeout(() => {
      if (!_rendering && autoCompleteElapsedLessons()) renderAll();
      scheduleNextAutoComplete();
    }, delay);
  })();
}