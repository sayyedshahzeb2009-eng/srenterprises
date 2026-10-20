-- Run once in Supabase SQL Editor for SR Enterprises contact settings.
-- The table stores customer-facing contact details; all writes are server-side via the service role.
create table if not exists public.site_settings (
  id text primary key check (id = 'public'),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;
revoke all on table public.site_settings from anon, authenticated;
insert into public.site_settings (id, data)
values ('public', jsonb_build_object('phone', '', 'email', ''))
on conflict (id) do nothing;
