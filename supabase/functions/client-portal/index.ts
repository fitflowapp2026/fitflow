// supabase/functions/client-portal/index.ts
// Deploy con: supabase functions deploy client-portal
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
}

const TOKEN_RE = /^[A-Za-z0-9_-]{12,64}$/
const ALLOWED_ACTIONS = new Set([
  'get_data',
  'send_message',
  'cancel_request',
  'reschedule_request',
  'mark_read',
  'mark_delivered',
])
const MAX_FIELD = 60
// Limite di invii per ogni link: evita che un link venga usato per inondare il trainer
const WRITE_ACTIONS = new Set(['send_message', 'cancel_request', 'reschedule_request'])
const MAX_PER_MINUTE = 6
const MAX_PER_DAY = 150

// Accetta solo stringhe brevi: evita testi arbitrari/lunghissimi nei messaggi automatici
function shortText(value: unknown): string {
  return typeof value === 'string' ? value.trim().slice(0, MAX_FIELD) : ''
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: CORS })
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  // Supabase client con service_role — mai esposto al frontend
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  let body: { token?: string; action?: string; payload?: Record<string, unknown> }
  try { body = await req.json() } catch { return json({ error: 'Body non valido' }, 400) }

  const { action, payload } = body
  const token = typeof body.token === 'string' ? body.token : ''
  // I token validi sono stringhe alfanumeriche lunghe: scarta subito tutto il resto
  if (!TOKEN_RE.test(token)) return json({ error: 'Link non valido o scaduto' }, 404)
  if (typeof action !== 'string' || !ALLOWED_ACTIONS.has(action)) {
    return json({ error: 'Azione non riconosciuta' }, 400)
  }

  // ── A quale trainer appartiene questo link? ───────────────────
  // Ricerca veloce: la tabella client_portal_links (codice → trainer) è tenuta
  // allineata dal database a ogni salvataggio dei dati (trigger su user_app_state,
  // vedi supabase/migrations/20261113080000_client_portal_links.sql).
  // Si legge una riga piccola tramite indice e poi SOLO i dati di quel trainer:
  // il costo non cresce con il numero dei trainer.
  // La tabella dice solo DOVE guardare: più sotto si controlla comunque che nei
  // dati di quel trainer ci sia davvero un cliente con questo codice.
  let rows: { user_id: string; app_data: unknown }[] | null = null
  const link = await supabase
    .from('client_portal_links')
    .select('user_id')
    .eq('token', token)
    .maybeSingle()

  if (link.error) {
    // Riserva: la tabella non risponde (es. migrazione non ancora applicata).
    // Si usa la ricerca di prima, dentro i dati dei trainer (filtro jsonb nel database).
    console.error('[client-portal] tabella dei link non disponibile, uso la ricerca di riserva:', link.error.message)
    const lookup = await supabase
      .from('user_app_state')
      .select('user_id, app_data')
      .contains('app_data', { clients: [{ shareToken: token }] })
      .limit(1)

    if (lookup.error) {
      // Ultima riserva (es. colonna non jsonb): scansione completa.
      console.error('[client-portal] lookup mirato fallito, uso scansione:', lookup.error.message)
      const all = await supabase.from('user_app_state').select('user_id, app_data')
      if (all.error) return json({ error: 'Errore database' }, 500)
      rows = all.data
    } else {
      rows = lookup.data
    }
  } else if (link.data) {
    const owner = await supabase
      .from('user_app_state')
      .select('user_id, app_data')
      .eq('user_id', link.data.user_id)
      .limit(1)
    if (owner.error) return json({ error: 'Errore database' }, 500)
    rows = owner.data
  } else {
    // La tabella ha risposto e il codice non c'è: link inesistente o cliente
    // eliminato. Non si leggono i dati di nessun trainer.
    rows = []
  }

  let foundUserId: string | null = null
  let foundClient: Record<string, unknown> | null = null
  let appData: Record<string, unknown> | null = null

  for (const row of rows ?? []) {
    const data = (row.app_data ?? {}) as Record<string, unknown>
    const clients = (Array.isArray(data.clients) ? data.clients : []) as (Record<string, unknown> | null)[]
    // Vale solo se il cliente ha davvero questo codice nei dati del trainer
    const match = clients.find((c) => c?.shareToken === token)
    if (match) {
      foundUserId = row.user_id
      foundClient = match
      appData = data
      break
    }
  }

  if (!foundClient || !appData) return json({ error: 'Link non valido o scaduto' }, 404)

  // Il cliente può agire solo sulle proprie lezioni
  const clientLessons = ((appData.lessons ?? []) as Record<string, unknown>[])
    .filter((l) => l.clientId === foundClient!.id)
  const ownsLesson = (lessonId: string) => clientLessons.some((l) => l.id === lessonId)

  // ── Limite di invii ───────────────────────────────────────────
  // Conta i messaggi già arrivati da questo link nell'ultimo minuto e nelle ultime
  // 24 ore. Se il conteggio non riesce si lascia passare: meglio un messaggio in
  // più che bloccare un cliente per un errore del database.
  if (WRITE_ACTIONS.has(action)) {
    const sentSince = async (ms: number) => {
      const { count, error } = await supabase
        .from('client_messages')
        .select('id', { count: 'exact', head: true })
        .eq('client_token', token)
        .eq('sender', 'client')
        .gte('created_at', new Date(Date.now() - ms).toISOString())
      return error ? 0 : (count ?? 0)
    }
    if ((await sentSince(60_000)) >= MAX_PER_MINUTE || (await sentSince(86_400_000)) >= MAX_PER_DAY) {
      return json({ error: 'Troppi messaggi in poco tempo. Riprova tra qualche minuto.' }, 429)
    }
  }

  // ── GET DATA ──────────────────────────────────────────────────
  if (action === 'get_data') {
    const clientId = foundClient.id as string
    const lessons = ((appData.lessons ?? []) as Record<string, unknown>[])
      .filter((l) => l.clientId === clientId)
      .map((l) => ({
        id: l.id,
        planId: l.planId,
        date: l.date,
        time: l.time,
        duration: l.duration,
        status: l.status,
        lessonType: l.lessonType,
      }))

    const plans = (appData.plans ?? []) as Record<string, unknown>[]
    const activePlan = plans.find(
      (p) => p.clientId === clientId && p.id === foundClient!.activePlanId
    ) ?? plans.filter((p) => p.clientId === clientId).slice(-1)[0] ?? null

    const packages = (appData.packages ?? []) as Record<string, unknown>[]
    const pkg = activePlan
      ? packages.find((p) => p.id === (activePlan as Record<string, unknown>).packageId) ?? null
      : null

    // Lezioni totali del percorso: nell'app il campo del pacchetto si chiama lessonsTotal
    // (più eventuali lezioni bonus o riportate sul piano). Prima veniva letto un campo
    // "sessions" che non esiste, e il portale mostrava "undefined sessioni".
    const planRecord = (activePlan ?? {}) as Record<string, unknown>
    const pkgRecord = (pkg ?? {}) as Record<string, unknown>
    const totalSessions =
      Number(pkgRecord.lessonsTotal ?? pkgRecord.sessions ?? 0) +
      Number(planRecord.bonusLessons ?? 0) +
      Number(planRecord.carryOverLessons ?? 0)

    // Messaggi dal cliente (tabella separata)
    const { data: messages } = await supabase
      .from('client_messages')
      .select('id, sender, text, type, lesson_id, created_at, read, delivered_at')
      .eq('client_token', token)
      .order('created_at', { ascending: true })

    return json({
      client: {
        name: foundClient.name,
        firstName: foundClient.firstName,
        lastName: foundClient.lastName,
        email: foundClient.email,
      },
      lessons,
      plan: activePlan
        ? {
            id: planRecord.id,
            startDate: planRecord.startDate,
            totalPrice: planRecord.totalPrice,
          }
        : null,
      package: pkg
        ? {
            name: pkgRecord.name,
            sessions: totalSessions > 0 ? totalSessions : null,
            duration: pkgRecord.duration,
            perWeek: pkgRecord.perWeek,
          }
        : null,
      messages: messages ?? [],
    })
  }

  // ── SEND MESSAGE ──────────────────────────────────────────────
  if (action === 'send_message') {
    const text = typeof payload?.text === 'string' ? payload.text.trim() : ''
    if (!text) return json({ error: 'Messaggio vuoto' }, 400)
    if (text.length > 1000) return json({ error: 'Messaggio troppo lungo' }, 400)

    const { error } = await supabase.from('client_messages').insert({
      client_token: token,
      user_id: foundUserId,
      client_id: foundClient.id,
      sender: 'client',
      text,
      type: 'message',
      read: false,
    })
    if (error) return json({ error: 'Errore invio' }, 500)
    return json({ ok: true })
  }

  // ── CANCEL REQUEST ────────────────────────────────────────────
  if (action === 'cancel_request') {
    const lessonId = shortText(payload?.lessonId)
    const lessonDate = shortText(payload?.lessonDate)
    if (!lessonId) return json({ error: 'lessonId mancante' }, 400)
    if (!ownsLesson(lessonId)) return json({ error: 'Lezione non trovata' }, 404)

    const { error } = await supabase.from('client_messages').insert({
      client_token: token,
      user_id: foundUserId,
      client_id: foundClient.id,
      sender: 'client',
      text: `Richiesta disdetta lezione del ${lessonDate || lessonId}`,
      type: 'cancel_request',
      lesson_id: lessonId,
      read: false,
    })
    if (error) return json({ error: 'Errore invio' }, 500)
    return json({ ok: true })
  }

  // ── RESCHEDULE REQUEST ────────────────────────────────────────
  if (action === 'reschedule_request') {
    const lessonId = shortText(payload?.lessonId)
    const lessonDate = shortText(payload?.lessonDate)
    const preferredDate = shortText(payload?.preferredDate)
    if (!lessonId) return json({ error: 'lessonId mancante' }, 400)
    if (!ownsLesson(lessonId)) return json({ error: 'Lezione non trovata' }, 404)

    const msg = preferredDate
      ? `Richiesta spostamento lezione del ${lessonDate} → preferenza: ${preferredDate}`
      : `Richiesta spostamento lezione del ${lessonDate}`

    const { error } = await supabase.from('client_messages').insert({
      client_token: token,
      user_id: foundUserId,
      client_id: foundClient.id,
      sender: 'client',
      text: msg,
      type: 'reschedule_request',
      lesson_id: lessonId,
      read: false,
    })
    if (error) return json({ error: 'Errore invio' }, 500)
    return json({ ok: true })
  }

  // NB: l'azione "trainer_reply" è stata rimossa. Chiunque avesse il link del portale
  // poteva usarla per scrivere messaggi a nome del trainer. Il trainer risponde dalla
  // app con il proprio login (insert diretto su client_messages, protetto da RLS).

  // ── MARK READ — cliente segna messaggi trainer come letti ──────
  if (action === 'mark_read') {
    const now = new Date().toISOString()
    await supabase
      .from('client_messages')
      .update({ delivered_at: now, read: true })
      .eq('client_token', token)
      .eq('sender', 'trainer')
      .is('read', false)
    return json({ ok: true })
  }

  // ── MARK DELIVERED — cliente segna messaggi come consegnati ────
  if (action === 'mark_delivered') {
    const now = new Date().toISOString()
    await supabase
      .from('client_messages')
      .update({ delivered_at: now })
      .eq('client_token', token)
      .eq('sender', 'trainer')
      .is('delivered_at', null)
    return json({ ok: true })
  }

  return json({ error: 'Azione non riconosciuta' }, 400)
})
