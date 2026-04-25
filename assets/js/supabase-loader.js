
    (function () {
      function tryLoad(urls, idx) {
        if (idx >= urls.length) {
          console.error('[DSWORLD] Impossibile caricare supabase-js da tutti i CDN disponibili.');
          return;
        }
        var s = document.createElement('script');
        s.src = urls[idx];
        s.onerror = function () {
          console.warn('[DSWORLD] CDN non disponibile:', urls[idx], '— provo il successivo…');
          document.head.removeChild(s);
          tryLoad(urls, idx + 1);
        };
        document.head.appendChild(s);
      }
      tryLoad([
        'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
        'https://unpkg.com/@supabase/supabase-js@2',
        'https://esm.sh/@supabase/supabase-js@2'
      ], 0);
    })();
  