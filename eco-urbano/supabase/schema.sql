-- EcoUrbano schema example for Supabase
-- Run this in the Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create table if not exists public.ocorrencias (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  type text not null check (type in ('alagamento', 'fumaca', 'descarte_irregular', 'buraco_via', 'desmatamento_urbano', 'outro')),
  description text not null,
  address text not null,
  latitude double precision not null,
  longitude double precision not null,
  status text not null default 'ativo' check (status in ('ativo', 'resolvido')),
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name,
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.ocorrencias enable row level security;

create policy "profiles_own_read"
on public.profiles
for select
using (auth.uid() = id);

create policy "profiles_own_update"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "profiles_insert_self"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "ocorrencias_own_select"
on public.ocorrencias
for select
using (auth.uid() = user_id);

create policy "ocorrencias_own_insert"
on public.ocorrencias
for insert
with check (auth.uid() = user_id);

create policy "ocorrencias_own_update"
on public.ocorrencias
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "ocorrencias_own_delete"
on public.ocorrencias
for delete
using (auth.uid() = user_id);

create index if not exists idx_ocorrencias_user_id on public.ocorrencias(user_id);
create index if not exists idx_ocorrencias_created_at on public.ocorrencias(created_at desc);
