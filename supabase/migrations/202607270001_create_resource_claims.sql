create table if not exists public.resource_claims (
  id uuid primary key default gen_random_uuid(),
  resource_key text not null,
  resource_title text not null,
  name text not null,
  email text not null,
  status text not null default 'pending'
    check (status in ('pending', 'delivered', 'cancelled', 'failed')),
  source text not null default 'website',
  page_path text,
  marketing_opt_in boolean not null default false,
  claim_count integer not null default 1 check (claim_count > 0),
  first_claimed_at timestamptz not null default now(),
  last_claimed_at timestamptz not null default now(),
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint resource_claims_email_normalized
    check (email = lower(btrim(email))),
  constraint resource_claims_resource_key_length
    check (char_length(resource_key) between 1 and 80),
  constraint resource_claims_resource_title_length
    check (char_length(resource_title) between 1 and 160),
  constraint resource_claims_name_length
    check (char_length(name) between 1 and 120),
  constraint resource_claims_email_format
    check (email ~ '^[a-z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$'),
  constraint resource_claims_source_length
    check (char_length(source) between 1 and 80),
  constraint resource_claims_page_path_length
    check (page_path is null or char_length(page_path) <= 240),
  unique (resource_key, email)
);

create index if not exists resource_claims_status_key_idx
  on public.resource_claims (status, resource_key, last_claimed_at);

alter table public.resource_claims enable row level security;

revoke all on table public.resource_claims from anon, authenticated;

drop function if exists public.claim_resource(text, text, text, text, text, text, boolean);

create or replace function public.claim_resource(
  claimant_name text,
  claimant_email text,
  claimed_resource_key text,
  claimed_resource_title text,
  claim_source text default 'website',
  claim_page text default null,
  wants_marketing boolean default false
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_name text := left(btrim(claimant_name), 120);
  normalized_email text := lower(btrim(claimant_email));
  normalized_key text := left(btrim(claimed_resource_key), 80);
  normalized_title text := left(btrim(claimed_resource_title), 160);
  normalized_source text := left(coalesce(nullif(btrim(claim_source), ''), 'website'), 80);
  normalized_page text := nullif(left(coalesce(btrim(claim_page), ''), 240), '');
begin
  if normalized_name = '' then
    raise exception 'A name is required.' using errcode = '22023';
  end if;

  if normalized_email !~ '^[a-z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$' then
    raise exception 'A valid email address is required.' using errcode = '22023';
  end if;

  if normalized_key = '' or normalized_title = '' then
    raise exception 'A resource is required.' using errcode = '22023';
  end if;

  insert into public.resource_claims (
    resource_key,
    resource_title,
    name,
    email,
    status,
    source,
    page_path,
    marketing_opt_in
  )
  values (
    normalized_key,
    normalized_title,
    normalized_name,
    normalized_email,
    'pending',
    normalized_source,
    normalized_page,
    wants_marketing
  )
  on conflict (resource_key, email) do update
  set
    resource_title = excluded.resource_title,
    name = excluded.name,
    status = case
      when public.resource_claims.status = 'delivered' then 'delivered'
      else 'pending'
    end,
    source = excluded.source,
    page_path = excluded.page_path,
    marketing_opt_in = public.resource_claims.marketing_opt_in or excluded.marketing_opt_in,
    claim_count = public.resource_claims.claim_count + 1,
    last_claimed_at = now(),
    updated_at = now();

  return 'claimed';
end;
$$;

revoke all on function public.claim_resource(text, text, text, text, text, text, boolean)
  from public, anon, authenticated;
grant execute on function public.claim_resource(text, text, text, text, text, text, boolean)
  to service_role;

comment on table public.resource_claims is
  'Pending and fulfilled resource requests collected by Light Overcomes.';

comment on function public.claim_resource(text, text, text, text, text, text, boolean) is
  'Records a resource claim through the server-side Edge Function only.';
