-- ════════════════════════════════════════════════════════════════════
-- CONTROLLO DEI LINK DEL PORTALE CLIENTE — sola lettura, non modifica nulla
-- (tabella creata da supabase/migrations/20261113080000_client_portal_links.sql)
--
-- Come usarlo: Supabase → SQL Editor → incolla TUTTO questo file → Run.
-- Il risultato è una tabellina di soli numeri: non contiene nomi né codici dei
-- clienti, quindi si può condividere.
--
-- Cosa guardare: la colonna "valore" deve corrispondere alla colonna "atteso".
-- In particolare le righe 3 e 4 devono dire 0 e le righe da 6 a 9 devono dire "SI".
-- Se compare l'errore "relation public.client_portal_links does not exist"
-- vuol dire che la migrazione non è stata ancora applicata.
--
-- Se le righe 3 o 4 non dicono 0, per riallineare (scrive solo nella tabella
-- dei link, mai nei dati dei trainer) eseguire:
--   select public.sync_client_portal_links(user_id, app_data)
--   from public.user_app_state order by created_at, user_id;
-- ════════════════════════════════════════════════════════════════════
with nei_dati as (
  select s.user_id, c.value ->> 'shareToken' as token
  from public.user_app_state s
  cross join lateral jsonb_array_elements(
    case when jsonb_typeof(s.app_data -> 'clients') = 'array'
         then s.app_data -> 'clients' else '[]'::jsonb end
  ) as c(value)
  where jsonb_typeof(c.value -> 'shareToken') = 'string'
    and length(c.value ->> 'shareToken') between 1 and 200
)
select *
from (
  select 1 as riga, 'Codici presenti nei dati dei trainer'::text as controllo,
         (select count(distinct d.token) from nei_dati d)::text as valore,
         ''::text as atteso
  union all
  select 2, 'Link registrati nella tabella',
         (select count(*) from public.client_portal_links)::text,
         'uguale alla riga 1'
  union all
  select 3, 'Codici presenti nei dati ma assenti dalla tabella',
         (select count(*) from nei_dati d
           where not exists (select 1 from public.client_portal_links l where l.token = d.token))::text,
         '0'
  union all
  select 4, 'Link della tabella senza un cliente corrispondente',
         (select count(*) from public.client_portal_links l
           where not exists (select 1 from nei_dati d where d.token = l.token and d.user_id = l.user_id))::text,
         '0'
  union all
  select 5, 'Codici usati da più di un trainer',
         (select count(*) from (select 1 from nei_dati d group by d.token having count(distinct d.user_id) > 1) x)::text,
         '0 (se non è 0, quel link resta al trainer registrato per primo)'
  union all
  select 6, 'Allineamento automatico attivo',
         (case when exists (
            select 1 from pg_trigger t
            where t.tgrelid = 'public.user_app_state'::regclass
              and t.tgname = 'trg_user_app_state_portal_links'
              and t.tgenabled = 'O'
          ) then 'SI' else 'NO  <-- i link nuovi non vengono registrati' end),
         'SI'
  union all
  select 7, 'Tabella protetta (RLS attiva)',
         (case when (select c.relrowsecurity from pg_class c where c.oid = 'public.client_portal_links'::regclass)
               then 'SI' else 'NO  <-- PERICOLO' end),
         'SI'
  union all
  select 8, 'Chi non ha fatto login non può fare nulla sulla tabella',
         (case when not has_table_privilege('anon', 'public.client_portal_links', 'select')
                and not has_table_privilege('anon', 'public.client_portal_links', 'insert')
                and not has_table_privilege('anon', 'public.client_portal_links', 'update')
                and not has_table_privilege('anon', 'public.client_portal_links', 'delete')
               then 'SI' else 'NO  <-- PERICOLO' end),
         'SI'
  union all
  select 9, 'Un trainer può solo leggere (le proprie righe), non scrivere',
         (case when has_table_privilege('authenticated', 'public.client_portal_links', 'select')
                and not has_table_privilege('authenticated', 'public.client_portal_links', 'insert')
                and not has_table_privilege('authenticated', 'public.client_portal_links', 'update')
                and not has_table_privilege('authenticated', 'public.client_portal_links', 'delete')
                and not has_table_privilege('authenticated', 'public.client_portal_links', 'truncate')
                and not has_function_privilege('authenticated', 'public.sync_client_portal_links(uuid, jsonb)', 'execute')
                and not has_function_privilege('anon', 'public.sync_client_portal_links(uuid, jsonb)', 'execute')
               then 'SI' else 'NO  <-- PERICOLO' end),
         'SI'
) as controllo_link
order by riga;
