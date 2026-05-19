create table if not exists public.pokedex_profiles (
  trainer_id text primary key,
  caught_ids integer[] not null default '{}',
  updated_at timestamp with time zone not null default now()
);

alter table public.pokedex_profiles enable row level security;

drop policy if exists "Public read pokedex profiles" on public.pokedex_profiles;
drop policy if exists "Public insert pokedex profiles" on public.pokedex_profiles;
drop policy if exists "Public update pokedex profiles" on public.pokedex_profiles;

create policy "Public read pokedex profiles"
  on public.pokedex_profiles
  for select
  using (true);

create policy "Public insert pokedex profiles"
  on public.pokedex_profiles
  for insert
  with check (true);

create policy "Public update pokedex profiles"
  on public.pokedex_profiles
  for update
  using (true)
  with check (true);
