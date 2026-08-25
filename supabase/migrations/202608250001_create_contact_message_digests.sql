alter table public.contact_messages
  add column if not exists digest_sent_at timestamptz;

create index if not exists contact_messages_pending_digest_idx
  on public.contact_messages (created_at)
  where digest_sent_at is null;

create table if not exists public.contact_message_digest_runs (
  id uuid primary key default gen_random_uuid(),
  digest_date date not null unique,
  status text not null default 'processing'
    check (status in ('processing', 'sent', 'failed')),
  attempt_count integer not null default 1
    check (attempt_count > 0),
  message_count integer not null default 0
    check (message_count >= 0),
  included_count integer not null default 0
    check (included_count >= 0),
  recipient_email text not null default 'bpkruis@gmail.com',
  brevo_message_id text,
  last_error text,
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  sent_at timestamptz
);

alter table public.contact_message_digest_runs enable row level security;

revoke all on table public.contact_message_digest_runs from anon, authenticated;

create or replace function public.begin_contact_message_digest(
  requested_digest_date date,
  requested_recipient_email text
)
returns table (
  run_id uuid,
  should_send boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  existing_run public.contact_message_digest_runs%rowtype;
  inserted_id uuid;
  normalized_recipient text := lower(btrim(coalesce(requested_recipient_email, '')));
begin
  if normalized_recipient = '' then
    raise exception 'A digest recipient is required.' using errcode = '22023';
  end if;

  insert into public.contact_message_digest_runs (
    digest_date,
    recipient_email
  )
  values (
    requested_digest_date,
    normalized_recipient
  )
  on conflict (digest_date) do nothing
  returning id into inserted_id;

  if inserted_id is not null then
    return query select inserted_id, true;
    return;
  end if;

  select *
  into existing_run
  from public.contact_message_digest_runs
  where digest_date = requested_digest_date
  for update;

  if existing_run.status = 'sent' then
    return query select existing_run.id, false;
    return;
  end if;

  if existing_run.status = 'processing'
    and existing_run.updated_at > now() - interval '10 minutes' then
    return query select existing_run.id, false;
    return;
  end if;

  update public.contact_message_digest_runs
  set
    status = 'processing',
    attempt_count = attempt_count + 1,
    recipient_email = normalized_recipient,
    last_error = null,
    started_at = now(),
    updated_at = now()
  where id = existing_run.id;

  return query select existing_run.id, true;
end;
$$;

create or replace function public.complete_contact_message_digest(
  completed_run_id uuid,
  included_message_ids uuid[],
  total_message_count integer,
  delivery_message_id text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if coalesce(cardinality(included_message_ids), 0) > 0 then
    update public.contact_messages
    set
      digest_sent_at = coalesce(digest_sent_at, now()),
      updated_at = now()
    where id = any(included_message_ids)
      and digest_sent_at is null;
  end if;

  update public.contact_message_digest_runs
  set
    status = 'sent',
    message_count = greatest(coalesce(total_message_count, 0), 0),
    included_count = coalesce(cardinality(included_message_ids), 0),
    brevo_message_id = nullif(left(coalesce(delivery_message_id, ''), 500), ''),
    last_error = null,
    sent_at = now(),
    updated_at = now()
  where id = completed_run_id;

  if not found then
    raise exception 'Digest run was not found.' using errcode = '22023';
  end if;
end;
$$;

create or replace function public.fail_contact_message_digest(
  failed_run_id uuid,
  failure_reason text
)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.contact_message_digest_runs
  set
    status = 'failed',
    last_error = left(coalesce(failure_reason, 'Digest delivery failed.'), 500),
    updated_at = now()
  where id = failed_run_id;
$$;

revoke all on function public.begin_contact_message_digest(date, text) from public;
revoke all on function public.complete_contact_message_digest(uuid, uuid[], integer, text) from public;
revoke all on function public.fail_contact_message_digest(uuid, text) from public;

grant execute on function public.begin_contact_message_digest(date, text) to service_role;
grant execute on function public.complete_contact_message_digest(uuid, uuid[], integer, text)
  to service_role;
grant execute on function public.fail_contact_message_digest(uuid, text) to service_role;

comment on column public.contact_messages.digest_sent_at is
  'When this contact message was included in a successfully delivered daily digest.';

comment on table public.contact_message_digest_runs is
  'Delivery ledger for the private daily contact-message digest.';
