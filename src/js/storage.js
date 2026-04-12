function getSnapshot() {
  return {
    clients: state.clients,
    packages: state.packages,
    plans: state.plans,
    lessons: state.lessons,
    selectedClientId: state.selectedClientId,
    viewDate: toISO(state.viewDate),
    dismissedAlerts: state.dismissedAlerts || []
  };
}

function hasMeaningfulState(payload) {
  return Boolean((payload?.clients || []).length || (payload?.plans || []).length || (payload?.lessons || []).length || (payload?.packages || []).length);
}

function persistBackupSnapshot(snapshot) {
  const payload = { ...snapshot, backupAt: new Date().toISOString() };
  try {
    localStorage.setItem(BACKUP_LATEST_KEY, JSON.stringify(payload));
    sessionStorage.setItem(SESSION_BACKUP_KEY, JSON.stringify(payload));
    const history = JSON.parse(localStorage.getItem(BACKUP_HISTORY_KEY) || '[]');
    const now = new Date();
    const todayKey   = now.toISOString().slice(0, 10);
    const weekKey    = `w${Math.floor((now - new Date(now.getFullYear(), 0, 1)) / 604800000)}`;
    // Keep one slot per calendar day (last 7 days) + one per week (last 4 weeks)
    const byDay  = {};
    const byWeek = {};
    history.forEach(item => {
      const d = String(item.backupAt || '').slice(0, 10);
      const diffDays = Math.floor((now - new Date(d)) / 86400000);
      if (diffDays < 7)  byDay[d]  = byDay[d]  || item;
      const w = `w${Math.floor((new Date(d) - new Date(new Date(d).getFullYear(), 0, 1)) / 604800000)}`;
      const diffWeeks = Math.floor((now - new Date(d)) / 604800000);
      if (diffWeeks < 4) byWeek[w] = byWeek[w] || item;
    });
    byDay[todayKey]  = payload;
    byWeek[weekKey]  = payload;
    const merged = Object.values({ ...byWeek, ...byDay });
    merged.sort((a, b) => String(b.backupAt).localeCompare(String(a.backupAt)));
    localStorage.setItem(BACKUP_HISTORY_KEY, JSON.stringify(merged.slice(0, 11)));
  } catch (error) {
    console.error('persistBackupSnapshot error:', error);
  }
}

    function saveLocalState() {
  // ATTENZIONE: I dati sensibili dei clienti memorizzati localmente (localStorage)
  // non sono crittografati. Per una sicurezza enterprise, questi dati dovrebbero
  // essere crittografati prima di essere salvati e decrittografati al recupero.
  // Considerare l'uso di IndexedDB con crittografia per dati offline sensibili.
  const snapshot = getSnapshot();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    persistBackupSnapshot(snapshot);
  } catch (error) {
    if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      showToast('Spazio locale esaurito. Esporta un backup per liberare spazio.', 'error');
      console.error('localStorage quota exceeded:', error);
    } else {
      console.error('saveLocalState error:', error);
    }
  }
}

function getBackupSnapshot() {
  const candidates = [
    localStorage.getItem(BACKUP_LATEST_KEY),
    sessionStorage.getItem(SESSION_BACKUP_KEY)
  ];
  try {
    const history = JSON.parse(localStorage.getItem(BACKUP_HISTORY_KEY) || '[]');
    history.forEach(item => candidates.push(JSON.stringify(item)));
  } catch (error) {
    console.error(error);
  }
  for (const raw of candidates) {
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      if (hasMeaningfulState(parsed) || (parsed?.packages || []).length) return parsed;
    } catch (error) {
      console.error(error);
    }
  }
  return null;
}

function loadSupabaseConfig() {
        // In un ambiente di produzione, queste credenziali dovrebbero essere caricate in modo sicuro
  // da un endpoint server-side (es. Netlify Function) o da variabili d'ambiente.
  // Per ora, usiamo i valori di fallback (vuoti) che verranno sovrascritti dal config remoto.
  return { url: DEFAULT_SUPABASE_URL, key: DEFAULT_SUPABASE_ANON_KEY };
}

function persistSupabaseConfig(config) {
  cloud.config = config || { url: DEFAULT_SUPABASE_URL, key: DEFAULT_SUPABASE_ANON_KEY };
}

function updateAuthMessage(message) {
  el.authMessage.textContent = message;
}

function updateSyncBadge(message) {
  el.syncBadge.textContent = message;
  el.cloudStatusLabel.textContent = message;
  const dot = document.getElementById('cloudDot');
  if (dot) {
    const msg = message.toLowerCase();
    const isSyncing = msg.includes('sincroniz') || msg.includes('caricamento');
    const isOnline  = msg.includes('salvato') || msg.includes('caricato') || msg.includes('completat') || msg.includes('aggiornato');
    const isError   = msg.includes('errore') || msg.includes('non riuscit') || msg.includes('disattivato') || msg.includes('non configurato') || msg.includes('troppo grandi');
    const isWarn    = msg.includes('locale') || msg.includes('offline') || msg.includes('attesa') || msg.includes('login');
    dot.classList.toggle('syncing', isSyncing);
    dot.style.background = isSyncing ? '' : isOnline ? '#1db954' : isError ? '#ef4444' : isWarn ? '#f59e0b' : 'rgba(255,255,255,0.25)';
    dot.title = message;
  }
  const banner = document.getElementById('offlineBanner');
  if (banner) {
    const isErr = message.toLowerCase().includes('errore') || message.toLowerCase().includes('non riuscit');
    banner.classList.toggle('show', isErr);
  }
}

function updateUserBadge() {
  const email = cloud.user?.email || 'Non connesso';
  el.userBadge.textContent = email;
  el.cloudUserEmail.textContent = email;
  document.body.classList.toggle('signed-out', !cloud.user && !cloud.allowLocalOnly);
}

function populateCloudConfigInputs() {
  const cfg = cloud.config || loadSupabaseConfig();
  if (el.sbProjectUrl) el.sbProjectUrl.value = cfg.url || '';
  if (el.sbAnonKey) el.sbAnonKey.value = cfg.key || '';
  if (el.cloudProjectUrl) el.cloudProjectUrl.value = cfg.url || '';
  if (el.cloudAnonKey) el.cloudAnonKey.value = cfg.key || '';
  if (el.supabaseConfigStatus) el.supabaseConfigStatus.textContent = 'Cloud collegato. Accedi o registrati.';
}

function initSupabaseClient(config) {
  if (!config?.url || !config?.key) {
    cloud.client = null;
    return false;
  }
  if (!window.supabase?.createClient) {
    console.error('[DSWORLD] Libreria Supabase non caricata.');
    cloud.client = null;
    updateSyncBadge('Errore libreria Supabase');
    return false;
  }
  try {
    cloud.config = config;
    const client = window.supabase.createClient(config.url, config.key);
    if (!client || !client.auth) {
      console.error('[DSWORLD] Client Supabase non valido o incompleto.');
      cloud.client = null;
      updateSyncBadge('Errore inizializzazione cloud');
      return false;
    }
    cloud.client = client;
    cloud.allowLocalOnly = false;
    populateCloudConfigInputs();
    updateSyncBadge('Cloud pronto');
    return true;
  } catch (err) {
    console.error('[DSWORLD] Errore createClient:', err);
    cloud.client = null;
    updateSyncBadge('Errore inizializzazione cloud');
    return false;
  }
}
