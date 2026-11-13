-- ════════════════════════════════════════════════════════════════════
-- APPLICATA il 2026-11-13 al progetto FITFLOW (nome migrazione: rls_hardening).
-- Questo file è la copia di quanto eseguito, per tenerne traccia nel repo.
--
-- Situazione trovata: RLS già attiva su tutte le tabelle e ogni trainer
-- vedeva solo le proprie righe. Problemi corretti:
--   - regole doppie su user_app_state e client_messages
--   - regole valide per tutti i ruoli invece che solo per chi ha fatto login
--   - auth.uid() ricalcolato per ogni riga (avviso di prestazioni)
--   - il ruolo anonimo (chiave pubblica) aveva permessi completi su
--     client_messages e audit_log, e tutti avevano TRUNCATE (svuotare la
--     tabella, operazione che la RLS non blocca)
--   - funzioni dei trigger senza search_path fisso (avviso di sicurezza)
--
-- Verificato dopo: ogni trainer vede e aggiorna solo le proprie righe,
-- updated_at si aggiorna, il ruolo anonimo viene respinto.
--
-- Per tornare indietro: vedi la sezione ROLLBACK in fondo.
-- ════════════════════════════════════════════════════════════════════

-- user_app_state
drop policy if exists "read own data" on public.user_app_state;
drop policy if exists "write own data" on public.user_app_state;
drop policy if exists user_app_state_select_own on public.user_app_state;
drop policy if exists user_app_state_insert_own on public.user_app_state;
drop policy if exists user_app_state_update_own on public.user_app_state;
drop policy if exists user_app_state_delete_own on public.user_app_state;
create policy user_app_state_select_own on public.user_app_state for select to authenticated
  using ((select auth.uid()) = user_id);
create policy user_app_state_insert_own on public.user_app_state for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy user_app_state_update_own on public.user_app_state for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy user_app_state_delete_own on public.user_app_state for delete to authenticated
  using ((select auth.uid()) = user_id);

-- client_messages (il portale cliente passa dalla funzione client-portal, non da qui)
drop policy if exists trainer_select on public.client_messages;
drop policy if exists trainer_insert on public.client_messages;
drop policy if exists trainer_insert_reply on public.client_messages;
drop policy if exists trainer_update on public.client_messages;
drop policy if exists trainer_update_read on public.client_messages;
create policy trainer_select on public.client_messages for select to authenticated
  using ((select auth.uid()) = user_id);
create policy trainer_insert on public.client_messages for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy trainer_update on public.client_messages for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- audit_log (oggi vuota e non usata dall'app)
drop policy if exists "Insert audit" on public.audit_log;
create policy "Insert audit" on public.audit_log for insert to authenticated
  with check ((select auth.uid()) = user_id);

-- user_data (oggi vuota e non usata dall'app)
drop policy if exists "Utente legge solo i propri dati" on public.user_data;
drop policy if exists "Utente inserisce i propri dati" on public.user_data;
drop policy if exists "Utente aggiorna i propri dati" on public.user_data;
drop policy if exists "Utente elimina i propri dati" on public.user_data;
create policy "Utente legge solo i propri dati" on public.user_data for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Utente inserisce i propri dati" on public.user_data for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Utente aggiorna i propri dati" on public.user_data for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Utente elimina i propri dati" on public.user_data for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Permessi
revoke all on public.client_messages, public.audit_log from anon;
revoke truncate, trigger, references on public.user_app_state, public.client_messages,
  public.audit_log, public.user_data from anon, authenticated;

-- Funzioni dei trigger
alter function public.set_updated_at() set search_path = '';
alter function public.set_user_app_state_updated_at() set search_path = '';
alter function public.set_google_calendar_connections_updated_at() set search_path = '';

-- ════════════════════════════════════════════════════════════════════
-- ROLLBACK (non eseguire, solo per riferimento): stato precedente.
-- Le regole erano tutte "to public" con auth.uid() senza select:
--   user_app_state: "read own data" (select), "write own data" (all),
--     user_app_state_select_own/insert_own/update_own/delete_own
--   client_messages: trainer_select, trainer_insert, trainer_insert_reply,
--     trainer_update, trainer_update_read (update senza with check)
--   audit_log: "Insert audit"; user_data: le quattro regole "Utente ..."
--   anon aveva tutti i permessi su client_messages e audit_log;
--   anon/authenticated avevano truncate, trigger, references.
-- ════════════════════════════════════════════════════════════════════
