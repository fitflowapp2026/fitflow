
async function syncStateToCloud(force = false) {
  if (!cloud.client || !cloud.user || cloud.allowLocalOnly) return false;
  if (cloud.saving && !force) return false;
  cloud.saving = true;
  updateSyncBadge('Sincronizzazione...');
  const payload = getSnapshot();
  const payloadStr = JSON.stringify(payload);
  if (payloadStr.length > 4 * 1024 * 1024) {
    cloud.saving = false;
    updateSyncBadge('Dati troppo grandi');
    showToast('I dati superano il limite cloud. Esporta un backup.', 'error');
    return false;
  }
  const { error } = await cloud.client
    .from('user_app_state')
    .upsert({ user_id: cloud.user.id, app_data: payload, updated_at: new Date().toISOString() });
  cloud.saving = false;
  if (error) {
    console.error('syncStateToCloud error:', error);
    /* Granular error handling */
    if (error.status === 401 || error.message?.includes('JWT') || error.message?.includes('token')) {
      updateSyncBadge('Sessione scaduta');
      showToast('Sessione scaduta — effettua di nuovo il login.', 'warn');
    } else if (error.status === 403) {
      updateSyncBadge('Accesso negato');
      showToast('Permesso negato dal cloud. Contatta il supporto.', 'error');
    } else if (error.status === 0 || error.message?.includes('network') || error.message?.includes('fetch')) {
      updateSyncBadge('Offline');
      showToast('Nessuna connessione. I dati sono salvati in locale.', 'warn');
    } else if (error.status >= 500) {
      updateSyncBadge('Errore server');
      showToast('Errore server cloud. Riprova tra qualche secondo.', 'error');
    } else {
      updateSyncBadge('Errore cloud');
      showToast('Sync cloud non riuscita.', 'error');
    }
    return false;
  }
  updateSyncBadge('Cloud salvato');
  return true;
}

function queueCloudSave(urgent = false) {
  if (!cloud.client || !cloud.user || cloud.allowLocalOnly) return;
  clearTimeout(cloud.saveTimer);
  const delay = urgent ? 800 : 2500;
  cloud.saveTimer = setTimeout(() => { syncStateToCloud().catch(err => console.error('Cloud save failed:', err)); }, delay);
}

function saveState(urgent = false) {
  invalidateDerivedData();
  saveLocalState();
  queueCloudSave(urgent);
}

function applySnapshot(parsed) {
  state.clients = Array.isArray(parsed.clients) ? parsed.clients : [];
  state.packages = Array.isArray(parsed.packages) ? parsed.packages : [];
  normalizePackageData();
  state.plans = Array.isArray(parsed.plans) ? parsed.plans : [];
  state.lessons = Array.isArray(parsed.lessons) ? parsed.lessons : [];
  invalidateDerivedData();
  state.selectedClientId = parsed.selectedClientId || null;
  state.viewDate = parsed.viewDate ? startOfMonth(fromISO(parsed.viewDate)) : startOfMonth(new Date());
  state.dismissedAlerts = Array.isArray(parsed.dismissedAlerts) ? parsed.dismissedAlerts : [];

  let normalizedPlans = false;
  state.plans.forEach(plan => {
    const normalized = normalizeCheckMode(plan.checkMode);
    if (plan.checkMode !== normalized) {
      plan.checkMode = normalized;
      normalizedPlans = true;
    }
  });

  if (!state.packages.length) state.packages = seedPackages();
  if (!state.selectedClientId || !getClient(state.selectedClientId)) state.selectedClientId = getDefaultSelectedClientId(state.selectedClientId);
  if (normalizedPlans) saveLocalState();
}

function loadStateLocal() {
  let loaded = false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      applySnapshot(JSON.parse(raw));
      loaded = true;
    } else {
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        const migrated = migrateLegacy(JSON.parse(legacy));
        applySnapshot(migrated);
        saveLocalState();
        loaded = true;
      }
    }
  } catch (error) {
    console.error(error);
  }
  if (!loaded) {
    const backup = getBackupSnapshot();
    if (backup) {
      applySnapshot(backup);
      saveLocalState();
      showToast('Ripristino automatico del backup locale.', 'warn');
    }
  }
  if (!state.packages.length) state.packages = seedPackages();
  if (!state.selectedClientId || !getClient(state.selectedClientId)) state.selectedClientId = getDefaultSelectedClientId(state.selectedClientId);
  /* Genera shareToken per clienti esistenti che non ce l'hanno */
  let needsSave = false;
  state.clients.forEach(c => { if (!c.shareToken) { c.shareToken = generateShareToken(); needsSave = true; } });
  if (needsSave) saveLocalState();
}

async function hydrateStateFromCloud() {
  if (!cloud.client || !cloud.user || cloud.allowLocalOnly) return false;
  updateSyncBadge('Caricamento cloud...');
  const { data, error, status } = await cloud.client
    .from('user_app_state')
    .select('app_data, updated_at')
    .eq('user_id', cloud.user.id)
    .maybeSingle();

  if (error && status !== 406) {
    console.error('hydrateStateFromCloud error:', error);
    if (status === 401 || error.message?.includes('JWT')) {
      updateSyncBadge('Sessione scaduta');
      showToast('Sessione scaduta — effettua di nuovo il login.', 'warn');
    } else if (!navigator.onLine || status === 0) {
      updateSyncBadge('Offline — dati locali');
      showToast('Nessuna connessione. Usando dati locali.', 'warn');
    } else {
      updateSyncBadge('Errore caricamento');
      showToast('Impossibile caricare i dati cloud.', 'error');
    }
    return false;
  }

  if (data?.app_data) {
    applySnapshot(data.app_data);
    saveLocalState();
    updateSyncBadge('Cloud caricato');
    return true;
  }

  if (hasMeaningfulState(getSnapshot())) {
    await syncStateToCloud(true);
  } else {
    if (!state.packages.length) state.packages = seedPackages();
    saveLocalState();
    await syncStateToCloud(true);
  }
  return false;
}

async function handleSession(session) {
  const previousUserId = cloud.user?.id || null;
  cloud.session = session || null;
  cloud.user = session?.user || null;

  /* Se l'utente cambia (logout + login con altro account), pulisci
     immediatamente tutto il localStorage e lo stato in memoria.
     Previene che i dati di un trainer finiscano in un altro account. */
  const newUserId = cloud.user?.id || null;
  if (previousUserId && newUserId && previousUserId !== newUserId) {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(BACKUP_LATEST_KEY);
      localStorage.removeItem(BACKUP_HISTORY_KEY);
      sessionStorage.removeItem(SESSION_BACKUP_KEY);
    } catch (_) {}
    state.clients  = [];
    state.plans    = [];
    state.lessons  = [];
    state.packages = [];
    state.selectedClientId = null;
  }

  updateUserBadge();
  if (!cloud.user) {
    resetGoogleState();
    updateSyncBadge(cloud.allowLocalOnly ? 'Solo cache locale' : 'Login richiesto');
    /* Rimuovi canale realtime se logout */
    if (_realtimeChannel && cloud.client) {
      cloud.client.removeChannel(_realtimeChannel);
      _realtimeChannel = null;
    }
    updateMsgBadges(0);
    renderAll();
    return;
  }
  await hydrateStateFromCloud();
  await refreshGoogleStatus();
  /* Riavvia Realtime per il nuovo utente */
  refreshUnreadMessages();
  initRealtimeMessages();
  renderAll();
}

async function ensureSupabaseReady() {
  populateCloudConfigInputs();
  if (cloud.allowLocalOnly) {
    updateSyncBadge('Solo cache locale');
    updateUserBadge();
    resetGoogleState();
    return false;
  }
  const config = loadSupabaseConfig();
  if (!config?.url || !config?.key) {
    updateSyncBadge('Cloud non configurato');
    updateUserBadge();
    resetGoogleState();
    return false;
  }
  const ready = initSupabaseClient(config);
  if (!ready || !cloud.client?.auth) {
    console.error('[DSWORLD] Client cloud non disponibile dopo initSupabaseClient.');
    updateUserBadge();
    resetGoogleState();
    return false;
  }
  if (!cloud.listenerBound) {
    cloud.client.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') handlePasswordRecovery(session);
      handleSession(session);
    });
    cloud.listenerBound = true;
  }
  const { data, error } = await cloud.client.auth.getSession();
  if (error) console.error(error);
  await handleSession(data?.session || null);
  return true;
}

function getAuthToken() {
  return cloud.session?.access_token || '';
}

function clearUrlParams(keys = []) {
  const url = new URL(window.location.href);
  let changed = false;
  keys.forEach(key => {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key);
      changed = true;
    }
  });
  if (changed) window.history.replaceState({}, document.title, url.toString());
}
