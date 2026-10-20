-- SR Enterprises: private customer enquiry inbox
create table if not exists public.enquiries (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  interest text not null default 'General enquiry',
  message text not null default '',
  source text not null default 'contact-form',
  product_id text,
  product_name text,
  status text not null default 'new' check (status in ('new','contacted','closed')),
  created_at timestamptz not null default now()
);
alter table public.enquiries enable row level security;
revoke all on table public.enquiries from anon, authenticated;
create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_status_idx on public.enquiries (status, created_at desc);
