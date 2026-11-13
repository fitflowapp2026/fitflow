-- ════════════════════════════════════════════════════════════════════
-- APPLICATA il 2026-11-13 al progetto FITFLOW (nome migrazione: client_portal_links).
-- Questo file è la copia di quanto eseguito, per tenerne traccia nel repo.
--
-- A COSA SERVE
-- Ogni cliente apre il proprio portale con un link personale
-- (client.html?t=CODICE). Per capire di quale trainer è un codice, la funzione
-- client-portal lo cercava dentro i dati di TUTTI i trainer: con 3 trainer va
-- bene, con centinaia ogni apertura del portale diventa lenta e costosa.
--
-- Questa migrazione crea un "elenco dei link" (tabella client_portal_links:
-- codice → trainer e cliente). La funzione guarda prima lì (ricerca immediata,
-- tramite indice) e poi legge soltanto i dati di quel trainer.
--
-- COSA FA, IN ORDINE
--   1. crea la tabella client_portal_links, protetta: il ruolo anonimo non può
--      fare nulla, un trainer può solo LEGGERE le proprie righe
--   2. crea il meccanismo (trigger) che la tiene allineata da sola: a ogni
--      salvataggio dei dati di un trainer sistema i link di quel trainer
--   3. la riempie con i codici dei clienti già presenti e controlla di averli
--      copiati tutti; se qualcosa non torna si ferma con un errore
--
-- COSA NON FA
--   - non modifica i dati dei trainer: user_app_state viene solo letta
--   - non cambia i codici: i link già inviati ai clienti restano gli stessi
--   - non richiede modifiche ad app.html
--
-- ORDINE CONSIGLIATO
--   1. applicare questa migrazione, tutta insieme (Supabase → SQL Editor →
--      incolla TUTTO questo file → Run)
--   2. eseguire il controllo supabase/checks/portal_links_check.sql
--   3. solo dopo, pubblicare la funzione client-portal aggiornata
-- Finché la funzione nuova non è pubblicata, quella attuale continua a lavorare
-- come sempre: la tabella viene compilata ma nessuno la usa ancora.
--
-- Si può eseguire più volte senza danni.
-- Per tornare indietro: sezione ROLLBACK in fondo.
-- ════════════════════════════════════════════════════════════════════

-- ── 1. Tabella ──────────────────────────────────────────────────────
create table if not exists public.client_portal_links (
  token      text primary key,                 -- il codice del link (shareToken del cliente)
  user_id    uuid not null references auth.users (id) on delete cascade,  -- il trainer
  client_id  text,                             -- l'id del cliente nei dati del trainer
  updated_at timestamptz not null default now()
);

comment on table public.client_portal_links is
  'Elenco dei link del portale cliente (codice -> trainer). La compila il trigger su user_app_state: non modificare a mano.';

-- Per trovare in fretta le righe di un trainer (trigger, eliminazione account)
create index if not exists client_portal_links_user_id_idx
  on public.client_portal_links (user_id);

alter table public.client_portal_links enable row level security;

-- Un trainer può solo leggere le proprie righe. Non esistono regole di scrittura:
-- scrive soltanto il trigger qui sotto. La funzione client-portal usa la chiave
-- di servizio, che non passa da queste regole.
drop policy if exists client_portal_links_select_own on public.client_portal_links;
create policy client_portal_links_select_own on public.client_portal_links
  for select to authenticated
  using ((select auth.uid()) = user_id);

-- Supabase assegna da solo tutti i permessi sulle tabelle nuove: qui si tolgono.
revoke all on table public.client_portal_links from public, anon, authenticated;
grant select on table public.client_portal_links to authenticated;
grant select on table public.client_portal_links to service_role;

-- ── 2. Allineamento automatico ──────────────────────────────────────
-- Porta i link di UN trainer a corrispondere ai clienti presenti nei suoi dati
-- (app_data -> 'clients'). Tocca solo ciò che è cambiato:
--   - toglie i codici dei clienti che non ci sono più
--   - aggiunge i codici dei clienti nuovi
--   - corregge il cliente collegato, se un codice è passato a un altro cliente
-- Se i codici non sono cambiati (il caso normale) non scrive nulla.
-- Un codice già registrato a nome di un altro trainer NON viene toccato: così
-- nessuno può prendersi il link di un cliente altrui copiandone il codice.
-- Il formato del codice lo decide la funzione client-portal (TOKEN_RE): qui si
-- scartano solo i valori vuoti o lunghissimi.
create or replace function public.sync_client_portal_links(p_user_id uuid, p_app_data jsonb)
returns void
language sql
set search_path = ''
as $$
  with wanted as materialized (
    -- una riga per codice; se due clienti avessero lo stesso codice vale il
    -- primo della lista, come fa la funzione client-portal
    select distinct on (c.value ->> 'shareToken')
           c.value ->> 'shareToken' as token,
           c.value ->> 'id'         as client_id
    from jsonb_array_elements(
           case when jsonb_typeof(p_app_data -> 'clients') = 'array'
                then p_app_data -> 'clients' else '[]'::jsonb end
         ) with ordinality as c(value, pos)
    where jsonb_typeof(c.value -> 'shareToken') = 'string'
      and length(c.value ->> 'shareToken') between 1 and 200
    order by c.value ->> 'shareToken', c.pos
  ),
  removed as (
    delete from public.client_portal_links l
    where l.user_id = p_user_id
      and not exists (select 1 from wanted w where w.token = l.token)
  ),
  changed as (
    update public.client_portal_links l
    set client_id = w.client_id, updated_at = now()
    from wanted w
    where l.token = w.token
      and l.user_id = p_user_id
      and l.client_id is distinct from w.client_id
  )
  insert into public.client_portal_links (token, user_id, client_id)
  select w.token, p_user_id, w.client_id
  from wanted w
  where not exists (select 1 from public.client_portal_links l where l.token = w.token)
  order by w.token
  on conflict (token) do nothing;
$$;

-- Funzione del trigger. Gira con i permessi di chi l'ha creata (security
-- definer), perché i trainer non hanno il permesso di scrivere nella tabella.
-- Se qualcosa va storto NON blocca il salvataggio dei dati del trainer: lascia
-- un avviso nei log del database e l'allineamento riprova al salvataggio dopo.
create or replace function public.user_app_state_sync_portal_links()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid;
begin
  if tg_op = 'DELETE' then
    -- dati del trainer eliminati: i suoi link non valgono più
    v_user_id := old.user_id;
    delete from public.client_portal_links where user_id = old.user_id;
  else
    v_user_id := new.user_id;
    if tg_op = 'UPDATE' and old.user_id is distinct from new.user_id then
      delete from public.client_portal_links where user_id = old.user_id;
    end if;
    perform public.sync_client_portal_links(new.user_id, new.app_data);
  end if;
  return null;
exception when others then
  raise warning 'client_portal_links non allineata per il trainer %: % (%)', v_user_id, sqlerrm, sqlstate;
  return null;
end;
$$;

-- Nessuno può chiamare queste funzioni dall'esterno: le usa solo il trigger.
revoke all on function public.sync_client_portal_links(uuid, jsonb) from public, anon, authenticated;
revoke all on function public.user_app_state_sync_portal_links() from public, anon, authenticated;

create or replace trigger trg_user_app_state_portal_links
  after insert or update or delete on public.user_app_state
  for each row execute function public.user_app_state_sync_portal_links();

-- ── 3. Copia dei codici già presenti, con controllo ─────────────────
do $$
declare
  r record;
  v_righe integer;
  v_mancanti integer;
  v_estranee integer;
  v_condivisi integer;
begin
  -- Mentre si copia nessun trainer deve salvare a metà: i salvataggi aspettano
  -- qualche millisecondo, le letture (app e portale) non vengono fermate.
  lock table public.user_app_state in share row exclusive mode;

  -- righe rimaste da un'esecuzione precedente per trainer che non hanno più dati
  delete from public.client_portal_links l
  where not exists (select 1 from public.user_app_state s where s.user_id = l.user_id);

  -- un trainer alla volta, dal più vecchio: se due trainer avessero lo stesso
  -- codice, resta a chi si è registrato prima
  for r in
    select s.user_id, s.app_data from public.user_app_state s order by s.created_at, s.user_id
  loop
    perform public.sync_client_portal_links(r.user_id, r.app_data);
  end loop;

  -- controllo: ogni codice presente nei dati deve avere la sua riga, e ogni riga
  -- deve corrispondere a un cliente di quel trainer
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
  select
    (select count(*) from public.client_portal_links),
    (select count(*) from nei_dati d
      where not exists (select 1 from public.client_portal_links l where l.token = d.token)),
    (select count(*) from public.client_portal_links l
      where not exists (select 1 from nei_dati d where d.token = l.token and d.user_id = l.user_id)),
    (select count(*) from (select 1 from nei_dati d group by d.token having count(distinct d.user_id) > 1) x)
  into v_righe, v_mancanti, v_estranee, v_condivisi;

  if v_mancanti > 0 or v_estranee > 0 then
    raise exception 'client_portal_links non corrisponde ai dati dei trainer: % codici mancanti, % righe senza cliente. Migrazione interrotta.', v_mancanti, v_estranee;
  end if;
  if v_condivisi > 0 then
    raise warning 'client_portal_links: % codici compaiono nei dati di più trainer; ognuno resta al trainer registrato per primo.', v_condivisi;
  end if;
  raise notice 'client_portal_links: % link registrati.', v_righe;
end;
$$;

-- ════════════════════════════════════════════════════════════════════
-- ROLLBACK (non eseguire, solo per riferimento). Riporta il database a com'era
-- prima di questa migrazione. I dati dei trainer non vengono toccati e i link
-- dei clienti continuano a funzionare: senza la tabella la funzione client-portal
-- torna da sola alla ricerca di prima, quindi non serve ripubblicarla.
--
--   drop trigger if exists trg_user_app_state_portal_links on public.user_app_state;
--   drop function if exists public.user_app_state_sync_portal_links();
--   drop function if exists public.sync_client_portal_links(uuid, jsonb);
--   drop table if exists public.client_portal_links;
-- ════════════════════════════════════════════════════════════════════
