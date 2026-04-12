// supabase/functions/client-portal/index.ts
// Deploy con: supabase functions deploy client-portal
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
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

  const { token, action, payload } = body
  if (!token) return json({ error: 'Token mancante' }, 400)

  // Trova il cliente con questo token scansionando tutti gli stati
  const { data: states, error: statesErr } = await supabase
    .from('user_app_state')
    .select('user_id, app_data')

  if (statesErr) return json({ error: 'Errore database' }, 500)

  let foundUserId: string | null = null
  let foundClient: Record<string, unknown> | null = null
  let appData: Record<string, unknown> | null = null

  for (const row of states ?? []) {
    const data = row.app_data as Record<string, unknown>
    const clients = (data?.clients ?? []) as Record<string, unknown>[]
    const match = clients.find((c) => c.shareToken === token)
    if (match) {
      foundUserId = row.user_id
      foundClient = match
      appData = data
      break
    }
  }

  if (!foundClient || !appData) return json({ error: 'Link non valido o scaduto' }, 404)

  // ── GET DATA ──────────────────────────────────────────────────
  if (action === 'get_data') {
    const clientId = foundClient.id as string
    const lessons = ((appData.lessons ?? []) as Record<string, unknown>[])
      .filter((l) => l.clientId === clientId)
      .map((l) => ({
        id: l.id,
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

    // Messaggi dal cliente (tabella separata)
    const { data: messages } = await supabase
      .from('client_messages')
      .select('id, sender, text, type, lesson_id, created_at, read')
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
            startDate: (activePlan as Record<string, unknown>).startDate,
            totalPrice: (activePlan as Record<string, unknown>).totalPrice,
          }
        : null,
      package: pkg
        ? {
            name: (pkg as Record<string, unknown>).name,
            sessions: (pkg as Record<string, unknown>).sessions,
            duration: (pkg as Record<string, unknown>).duration,
            perWeek: (pkg as Record<string, unknown>).perWeek,
          }
        : null,
      messages: messages ?? [],
    })
  }

  // ── SEND MESSAGE ──────────────────────────────────────────────
  if (action === 'send_message') {
    const text = ((payload?.text ?? '') as string).trim()
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
    const lessonId = payload?.lessonId as string
    const lessonDate = payload?.lessonDate as string
    if (!lessonId) return json({ error: 'lessonId mancante' }, 400)

    const { error } = await supabase.from('client_messages').insert({
      client_token: token,
      user_id: foundUserId,
      client_id: foundClient.id,
      sender: 'client',
      text: `Richiesta disdetta lezione del ${lessonDate ?? lessonId}`,
      type: 'cancel_request',
      lesson_id: lessonId,
      read: false,
    })
    if (error) return json({ error: 'Errore invio' }, 500)
    return json({ ok: true })
  }

  // ── RESCHEDULE REQUEST ────────────────────────────────────────
  if (action === 'reschedule_request') {
    const lessonId = payload?.lessonId as string
    const lessonDate = payload?.lessonDate as string
    const preferredDate = payload?.preferredDate as string | undefined
    if (!lessonId) return json({ error: 'lessonId mancante' }, 400)

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

  // ── TRAINER REPLY (chiamata da index.html con auth normale) ───
  // Nota: questa action è chiamata dalla app trainer, non dal cliente.
  // Il trainer usa il proprio JWT, ma per semplicità usiamo lo stesso endpoint.
  if (action === 'trainer_reply') {
    const text = ((payload?.text ?? '') as string).trim()
    if (!text) return json({ error: 'Risposta vuota' }, 400)

    const { error } = await supabase.from('client_messages').insert({
      client_token: token,
      user_id: foundUserId,
      client_id: foundClient.id,
      sender: 'trainer',
      text,
      type: 'message',
      read: false,
    })
    if (error) return json({ error: 'Errore risposta' }, 500)

    // Segna tutti i messaggi del cliente come letti
    await supabase
      .from('client_messages')
      .update({ read: true })
      .eq('client_token', token)
      .eq('sender', 'client')

    return json({ ok: true })
  }

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
