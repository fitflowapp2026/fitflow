function initFormKeyboardNav() {
  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const el = e.target;
    if (!['INPUT', 'SELECT'].includes(el.tagName)) return;
    if (el.tagName === 'SELECT') return;
    if (el.getAttribute('enterkeyhint') === 'done') { el.blur(); return; }
    e.preventDefault();
    const form = el.closest('form');
    if (!form) return;
    const focusable = Array.from(form.querySelectorAll('input:not([type=hidden]):not([disabled]), select:not([disabled]), textarea:not([disabled])'));
    const idx = focusable.indexOf(el);
    if (idx >= 0 && idx < focusable.length - 1) {
      focusable[idx + 1].focus();
    } else {
      el.blur();
    }
  });
}

/* ── Swipe orizzontale sul calendario per cambiare periodo ── */
(function initCalendarSwipe() {
  const calWrap = document.querySelector('.calendar-wrap');
  if (!calWrap) return;
  let startX = 0, startY = 0, moved = false;
  calWrap.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    moved = false;
  }, { passive: true });
  calWrap.addEventListener('touchmove', e => {
    const dx = Math.abs(e.touches[0].clientX - startX);
    const dy = Math.abs(e.touches[0].clientY - startY);
    if (dx > dy && dx > 8) moved = true;
  }, { passive: true });
  calWrap.addEventListener('touchend', e => {
    if (!moved) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) < 50) return;
    haptic(6);
    moveCalendar(dx < 0 ? 1 : -1);
  }, { passive: true });
})();

/* ── Service Worker background sync message handler ─── */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data?.type === 'SYNC_REQUESTED') {
      if (cloud.client && cloud.user && !cloud.allowLocalOnly) {
        syncStateToCloud(true).catch(err => console.error('BG sync failed:', err));
      }
    }
  });
}

/* ── Network online/offline detection ────────────────── */
window.addEventListener('online', () => {
  showToast('Connessione ripristinata.', 'ok');
  document.getElementById('offlineBanner')?.classList.remove('show');
  if (cloud.client && cloud.user && !cloud.allowLocalOnly) {
    syncStateToCloud(true).catch(err => console.error('Reconnect sync failed:', err));
  }
});
window.addEventListener('offline', () => {
  showToast('Connessione persa — modalità offline.', 'warn');
  document.getElementById('offlineBanner')?.classList.add('show');
  updateSyncBadge('Offline');
});

// Attende che window.supabase sia disponibile (necessario con CDN di fallback asincroni)
(function waitForSupabase(attempts) {
  if (window.supabase && window.supabase.createClient) {
    initApp();
  } else if (attempts > 0) {
    setTimeout(function () { waitForSupabase(attempts - 1); }, 150);
  } else {
    console.error('[DSWORLD] supabase-js non caricato dopo tutti i tentativi CDN.');
    initApp();
  }
})(40); // 40 x 150ms = 6 secondi max di attesa
