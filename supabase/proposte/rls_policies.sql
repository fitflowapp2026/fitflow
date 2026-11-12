-- ════════════════════════════════════════════════════════════════════
-- REGOLE DI ACCESSO (RLS) — ogni trainer vede e modifica solo i propri dati
--
-- STATO: PROPOSTA, mai eseguita. È stata scritta leggendo il codice
-- dell'app, senza poter vedere il database vero. Per questo sta in
-- supabase/proposte/ e non in supabase/migrations/: nessuno strumento la
-- applica da solo. Prima di eseguirla (Supabase → SQL Editor):
--   1. esegui supabase/checks/rls_audit.sql e guarda cosa c'è già;
--   2. se le colonne user_id NON sono di tipo uuid, sostituisci
--      (select auth.uid()) con (select auth.uid())::text in tutto il file.
--
-- Cosa fa:
--   - attiva la RLS sulle tre tabelle usate dall'app;
--   - crea regole "solo le proprie righe" per user_app_state e
--     client_messages (le usa l'app del trainer dopo il login);
--   - nessuna regola per google_calendar_connections: la leggono solo le
--     funzioni Netlify con la chiave di servizio, che salta la RLS. Dal
--     browser quella tabella deve restare inaccessibile.
--
-- Cosa NON fa:
--   - non elimina regole già presenti con altri nomi. Le regole si sommano:
--     se ne esiste una troppo larga (es. USING: true) va tolta a mano,
--     altrimenti continua a valere.
--   - non tocca i dati.
--
-- Il portale cliente (client.html) non è toccato: passa dalla funzione
-- client-portal, che usa la chiave di servizio.
--
-- Si può eseguire più volte senza danni. Se una colonna ha un tipo diverso
-- dal previsto l'esecuzione si ferma con un errore e non cambia nulla.
-- ════════════════════════════════════════════════════════════════════
begin;

-- ── user_app_state: l'archivio di ogni trainer (una riga per utente) ──
alter table public.user_app_state enable row level security;

drop policy if exists "fitflow_state_select_own" on public.user_app_state;
create policy "fitflow_state_select_own" on public.user_app_state
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "fitflow_state_insert_own" on public.user_app_state;
create policy "fitflow_state_insert_own" on public.user_app_state
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "fitflow_state_update_own" on public.user_app_state;
create policy "fitflow_state_update_own" on public.user_app_state
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "fitflow_state_delete_own" on public.user_app_state;
create policy "fitflow_state_delete_own" on public.user_app_state
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ── client_messages: messaggi tra trainer e clienti ───────────────────
-- L'app del trainer li legge filtrando solo per link o per "non letti",
-- senza indicare l'utente: è questa regola a impedire che un trainer veda
-- i messaggi dei clienti di un altro.
alter table public.client_messages enable row level security;

drop policy if exists "fitflow_messages_select_own" on public.client_messages;
create policy "fitflow_messages_select_own" on public.client_messages
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "fitflow_messages_insert_own" on public.client_messages;
create policy "fitflow_messages_insert_own" on public.client_messages
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "fitflow_messages_update_own" on public.client_messages;
create policy "fitflow_messages_update_own" on public.client_messages
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "fitflow_messages_delete_own" on public.client_messages;
create policy "fitflow_messages_delete_own" on public.client_messages
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ── google_calendar_connections: token Google (cifrati) ───────────────
-- RLS attiva e nessuna regola = nessun accesso dal browser.
alter table public.google_calendar_connections enable row level security;

commit;
