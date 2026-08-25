create table if not exists public.contact_message_rate_limits (
  key_hash text primary key,
  window_started_at timestamptz not null default now(),
  attempt_count integer not null default 0
    check (attempt_count >= 0),
  updated_at timestamptz not null default now(),
  constraint contact_message_rate_limit_key_format
    check (key_hash ~ '^[a-f0-9]{64}$')
);

create index if not exists contact_message_rate_limits_updated_at_idx
  on public.contact_message_rate_limits (updated_at);

alter table public.contact_message_rate_limits enable row level security;

revoke all on table public.contact_message_rate_limits from anon, authenticated;

create or replace function public.consume_contact_message_rate_limit(
  rate_limit_keys text[],
  max_attempts integer,
  window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  rate_limit_key text;
  current_attempts integer;
  window_length interval;
begin
  if coalesce(cardinality(rate_limit_keys), 0) not between 1 and 4 then
    raise exception 'Invalid rate-limit keys.' using errcode = '22023';
  end if;

  if max_attempts not between 1 and 100 or window_seconds not between 1 and 86400 then
    raise exception 'Invalid rate-limit configuration.' using errcode = '22023';
  end if;

  window_length := make_interval(secs => window_seconds);

  foreach rate_limit_key in array rate_limit_keys loop
    if rate_limit_key !~ '^[a-f0-9]{64}$' then
      raise exception 'Invalid rate-limit key.' using errcode = '22023';
    end if;

    insert into public.contact_message_rate_limits as limits (
      key_hash,
      window_started_at,
      attempt_count,
      updated_at
    )
    values (
      rate_limit_key,
      now(),
      1,
      now()
    )
    on conflict (key_hash) do update
    set
      window_started_at = case
        when limits.window_started_at <= now() - window_length then now()
        else limits.window_started_at
      end,
      attempt_count = case
        when limits.window_started_at <= now() - window_length then 1
        else limits.attempt_count + 1
      end,
      updated_at = now()
    returning attempt_count into current_attempts;

    if current_attempts > max_attempts then
      return false;
    end if;
  end loop;

  return true;
end;
$$;

revoke all on function public.consume_contact_message_rate_limit(text[], integer, integer)
  from public;
grant execute on function public.consume_contact_message_rate_limit(text[], integer, integer)
  to service_role;

create or replace function public.submit_contact_message(
  contact_name text,
  contact_email text,
  message_body text,
  message_source text default 'website-contact',
  message_page text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_name text := left(
    regexp_replace(btrim(coalesce(contact_name, '')), '[[:space:]]+', ' ', 'g'),
    120
  );
  normalized_email text := lower(btrim(coalesce(contact_email, '')));
  normalized_message text := left(btrim(coalesce(message_body, '')), 5000);
  normalized_source text := left(
    coalesce(nullif(btrim(message_source), ''), 'website-contact'),
    80
  );
  normalized_page text := nullif(left(coalesce(btrim(message_page), ''), 240), '');
  inserted_id uuid;
begin
  if normalized_name = '' then
    raise exception 'A name is required.' using errcode = '22023';
  end if;

  if normalized_email !~ '^[a-z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$' then
    raise exception 'A valid email address is required.' using errcode = '22023';
  end if;

  if char_length(normalized_message) < 10 then
    raise exception 'A message is required.' using errcode = '22023';
  end if;

  insert into public.contact_messages (
    name,
    email,
    message,
    source,
    page_path
  )
  values (
    normalized_name,
    normalized_email,
    normalized_message,
    normalized_source,
    normalized_page
  )
  returning id into inserted_id;

  return inserted_id;
end;
$$;

revoke all on function public.submit_contact_message(text, text, text, text, text)
  from public;
grant execute on function public.submit_contact_message(text, text, text, text, text)
  to service_role;

comment on table public.contact_message_rate_limits is
  'Keyed hashes and counters used to rate-limit public contact-message submissions without storing raw IP addresses.';

comment on function public.consume_contact_message_rate_limit(text[], integer, integer) is
  'Atomically consumes contact-message rate-limit capacity for one or more keyed hashes.';
