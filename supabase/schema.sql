-- Run this file in the Supabase SQL Editor for the SR Enterprises project.
create table if not exists public.products (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  data jsonb not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.products enable row level security;

-- No public or authenticated table policies are intentionally created.
-- Browser clients must never read/write this table directly. The Vercel API uses
-- SUPABASE_SERVICE_ROLE_KEY only on the server and verifies admin identity first.
revoke all on public.products from anon, authenticated;
grant all on public.products to service_role;

create index if not exists products_active_created_at_idx
  on public.products (active, created_at desc);

-- Admin sign-in:
-- 1) Create the admin user in Supabase Authentication and confirm its email.
-- 2) Set ADMIN_EMAIL in Vercel to exactly that email.
-- 3) Keep service-role keys only in Vercel Environment Variables.
