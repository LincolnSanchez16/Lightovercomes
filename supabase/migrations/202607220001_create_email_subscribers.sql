create table if not exists public.email_subscribers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  status text not null default 'subscribed'
    check (status in ('subscribed', 'unsubscribed', 'suppressed')),
  source text not null default 'website',
  page_path text,
  consent_text text not null,
  consented_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint email_subscribers_email_normalized
    check (email = lower(btrim(email))),
  constraint email_subscribers_name_length
    check (char_length(name) between 1 and 120),
  constraint email_subscribers_email_format
    check (email ~ '^[a-z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$'),
  constraint email_subscribers_source_length
    check (char_length(source) between 1 and 80),
  constraint email_subscribers_page_path_length
    check (page_path is null or char_length(page_path) <= 240),
  constraint email_subscribers_consent_length
    check (char_length(consent_text) between 1 and 500)
);

alter table public.email_subscribers enable row level security;

revoke all on table public.email_subscribers from anon, authenticated;

drop function if exists public.subscribe_to_updates(text, text, text, text);

create or replace function public.subscribe_to_updates(
  subscriber_name text,
  subscriber_email text,
  signup_source text default 'website',
  signup_page text default null,
  consent_copy text default 'I agree to receive email updates from Light Overcomes.'
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_name text := left(btrim(subscriber_name), 120);
  normalized_email text := lower(btrim(subscriber_email));
  normalized_source text := left(coalesce(nullif(btrim(signup_source), ''), 'website'), 80);
  normalized_page text := nullif(left(coalesce(btrim(signup_page), ''), 240), '');
  normalized_consent text := left(coalesce(nullif(btrim(consent_copy), ''), 'I agree to receive email updates from Light Overcomes.'), 500);
begin
  if normalized_name = '' then
    raise exception 'A name is required.' using errcode = '22023';
  end if;

  if normalized_email !~ '^[a-z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$' then
    raise exception 'A valid email address is required.' using errcode = '22023';
  end if;

  insert into public.email_subscribers (
    name,
    email,
    status,
    source,
    page_path,
    consent_text,
    consented_at,
    unsubscribed_at,
    updated_at
  )
  values (
    normalized_name,
    normalized_email,
    'subscribed',
    normalized_source,
    normalized_page,
    normalized_consent,
    now(),
    null,
    now()
  )
  on conflict (email) do update
  set
    name = excluded.name,
    status = 'subscribed',
    source = excluded.source,
    page_path = excluded.page_path,
    consent_text = excluded.consent_text,
    consented_at = excluded.consented_at,
    unsubscribed_at = null,
    updated_at = now();

  return 'subscribed';
end;
$$;

revoke all on function public.subscribe_to_updates(text, text, text, text, text) from public;
grant execute on function public.subscribe_to_updates(text, text, text, text, text) to anon, authenticated;

comment on table public.email_subscribers is
  'Email update subscribers collected by Light Overcomes website forms.';

comment on function public.subscribe_to_updates(text, text, text, text, text) is
  'Accepts a public email signup without exposing the subscriber table for reads.';
