create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  source text not null default 'website-contact',
  page_path text,
  status text not null default 'new'
    check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contact_messages_email_normalized
    check (email = lower(btrim(email))),
  constraint contact_messages_name_length
    check (char_length(name) between 1 and 120),
  constraint contact_messages_email_format
    check (email ~ '^[a-z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$'),
  constraint contact_messages_message_length
    check (char_length(message) between 10 and 5000),
  constraint contact_messages_source_length
    check (char_length(source) between 1 and 80),
  constraint contact_messages_page_path_length
    check (page_path is null or char_length(page_path) <= 240)
);

create index if not exists contact_messages_status_created_at_idx
  on public.contact_messages (status, created_at desc);

alter table public.contact_messages enable row level security;

revoke all on table public.contact_messages from anon, authenticated;

drop function if exists public.submit_contact_message(text, text, text, text, text);

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
  normalized_name text := left(btrim(coalesce(contact_name, '')), 120);
  normalized_email text := lower(btrim(coalesce(contact_email, '')));
  normalized_message text := left(btrim(coalesce(message_body, '')), 5000);
  normalized_source text := left(coalesce(nullif(btrim(message_source), ''), 'website-contact'), 80);
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

revoke all on function public.submit_contact_message(text, text, text, text, text) from public;
grant execute on function public.submit_contact_message(text, text, text, text, text) to service_role;

comment on table public.contact_messages is
  'Questions, ideas, success stories, and other messages submitted through Light Overcomes contact forms.';

comment on function public.submit_contact_message(text, text, text, text, text) is
  'Stores a validated contact message without exposing the contact_messages table publicly.';
