-- ════════════════════════════════════════════════════════════════════
-- CONTROLLO SICUREZZA DEL DATABASE — sola lettura, non modifica nulla
-- (eseguito il 2026-11-13; correzioni in supabase/migrations/20261113060000_rls_hardening.sql)
--
-- Come usarlo: Supabase → SQL Editor → incolla TUTTO questo file → Run.
-- Il risultato è un'unica tabella. Non contiene dati dei clienti (solo
-- nomi di tabelle, colonne e regole), quindi si può condividere.
--
-- Cosa guardare:
--   1. "RLS attiva?"  deve dire SI per user_app_state, client_messages e
--      google_calendar_connections. Se dice NO, chiunque abbia la chiave
--      pubblica dell'app può leggere quella tabella per intero.
--   2. "Regola"       ogni regola deve limitare alle proprie righe
--      (deve comparire auth.uid() = user_id). Una regola con USING: true
--      apre la tabella a tutti.
--   3. "Colonna"      user_app_state.app_data dovrebbe essere jsonb e
--      updated_at un timestamp.
-- ════════════════════════════════════════════════════════════════════
select *
from (
  select
    1 as ordine,
    'RLS attiva?'::text as controllo,
    c.relname::text as tabella,
    (case when c.relrowsecurity then 'SI' else 'NO  <-- PERICOLO' end)::text as valore,
    ''::text as dettaglio
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind = 'r'

  union all

  select
    2,
    'Regola'::text,
    p.tablename::text,
    (p.policyname || '  [' || p.cmd || ']  per: ' || array_to_string(p.roles, ', '))::text,
    ('USING: ' || coalesce(p.qual, '-') || '   |   CHECK: ' || coalesce(p.with_check, '-'))::text
  from pg_policies p
  where p.schemaname = 'public'

  union all

  select
    3,
    'Colonna'::text,
    col.table_name::text,
    (col.column_name || ' : ' || col.data_type)::text,
    (case when col.is_nullable = 'YES' then 'può essere vuota' else 'obbligatoria' end)::text
  from information_schema.columns col
  where col.table_schema = 'public'
    and col.table_name in ('user_app_state', 'client_messages', 'google_calendar_connections')

  union all

  select
    4,
    'Permessi'::text,
    g.table_name::text,
    g.grantee::text,
    string_agg(g.privilege_type::text, ', ' order by g.privilege_type::text)
  from information_schema.role_table_grants g
  where g.table_schema = 'public'
    and g.grantee in ('anon', 'authenticated')
  group by g.table_name, g.grantee

  union all

  select
    5,
    'Realtime'::text,
    pt.tablename::text,
    'pubblicata in supabase_realtime'::text,
    ''::text
  from pg_publication_tables pt
  where pt.pubname = 'supabase_realtime' and pt.schemaname = 'public'
) as controllo_sicurezza
order by ordine, tabella, valore;
