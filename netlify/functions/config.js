exports.handler = async (event, context) => {
  // Gestione preflight CORS (richieste OPTIONS dal browser)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': 'https://fitflowevolution.com',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  // Verifica che le variabili d'ambiente siano presenti
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('[FitFlow] Variabili d\'ambiente SUPABASE_URL o SUPABASE_ANON_KEY mancanti.');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Configurazione server incompleta.' }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      // La anon key di Supabase è pubblica per design.
      // La sicurezza reale è garantita dalle RLS policy su Supabase, non da questa chiave.
      'Access-Control-Allow-Origin': 'https://fitflowevolution.com',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify({
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    }),
  };
};
