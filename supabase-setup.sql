-- ============================================================
-- SETPOINT - banco de dados na nuvem (Supabase / Postgres)
-- Cole este arquivo inteiro no "SQL Editor" do Supabase e clique em Run.
-- Pode rodar mais de uma vez sem problema.
-- ============================================================

-- Equipes salvas de cada usuário
create table if not exists public.teams (
  user_id        uuid        not null default auth.uid() references auth.users(id) on delete cascade,
  id             text        not null,                 -- id gerado pelo app
  name           text        not null default '',
  data           jsonb       not null default '{}'::jsonb,  -- equipe completa (jogadores etc.)
  client_updated bigint      not null default 0,       -- hora da última alteração no aparelho (ms)
  deleted        boolean     not null default false,   -- exclusão lógica (para sincronizar apagamentos)
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),   -- preenchido pelo servidor
  primary key (user_id, id)                            -- impede partida/equipe duplicada por usuário
);

-- Partidas (inclui todos os eventos: pontos, tempos, substituições, observações)
create table if not exists public.matches (
  user_id        uuid        not null default auth.uid() references auth.users(id) on delete cascade,
  id             text        not null,
  name           text        not null default '',
  data           jsonb       not null default '{}'::jsonb,
  client_updated bigint      not null default 0,
  deleted        boolean     not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  primary key (user_id, id)
);

-- O servidor (e não o celular) decide o updated_at
create or replace function public.setpoint_touch()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists teams_touch   on public.teams;
drop trigger if exists matches_touch on public.matches;
create trigger teams_touch   before insert or update on public.teams   for each row execute function public.setpoint_touch();
create trigger matches_touch before insert or update on public.matches for each row execute function public.setpoint_touch();

create index if not exists teams_user_upd   on public.teams   (user_id, updated_at);
create index if not exists matches_user_upd on public.matches (user_id, updated_at);

-- SEGURANÇA: cada usuário só enxerga e altera as próprias linhas
alter table public.teams   enable row level security;
alter table public.matches enable row level security;

drop policy if exists teams_own   on public.teams;
drop policy if exists matches_own on public.matches;
create policy teams_own   on public.teams   for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy matches_own on public.matches for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Visitantes sem login não têm acesso nenhum; usuários logados usam as regras acima
revoke all on public.teams   from anon;
revoke all on public.matches from anon;
grant select, insert, update, delete on public.teams   to authenticated;
grant select, insert, update, delete on public.matches to authenticated;
