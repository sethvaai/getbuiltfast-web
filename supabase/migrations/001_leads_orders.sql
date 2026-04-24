-- GetBuiltFast — initial schema
-- Run in the Supabase SQL editor for project cbzqhcbstgeqizgvkmfd
-- or via: supabase db push (after linking the project)

create extension if not exists "pgcrypto";

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  phone text,
  company_name text,
  client_type text,
  project_type text,
  features jsonb,
  integrations jsonb,
  style_preferences jsonb,
  reference_urls text[],
  timeline text,
  budget_range text,
  rush_delivery boolean,
  estimated_price_min integer,
  estimated_price_max integer,
  description text,
  hear_about_us text,
  status text default 'new',
  created_at timestamp default now()
);

create index if not exists leads_email_idx on leads(email);
create index if not exists leads_status_idx on leads(status);
create index if not exists leads_created_at_idx on leads(created_at desc);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  email text not null,
  product_name text not null,
  amount_cents integer not null,
  status text default 'pending',
  client_type text,
  project_brief text,
  lead_id uuid references leads(id),
  created_at timestamp default now(),
  paid_at timestamp
);

create index if not exists orders_email_idx on orders(email);
create index if not exists orders_status_idx on orders(status);
create index if not exists orders_stripe_session_idx on orders(stripe_session_id);

-- RLS: the service role key bypasses RLS, so API routes work.
-- Enable RLS anyway so that anon/authenticated cannot read leads/orders directly.
alter table leads  enable row level security;
alter table orders enable row level security;
