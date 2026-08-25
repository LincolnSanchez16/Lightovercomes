# Contact Message Daily Digest

The daily digest sends Brian one private Brevo email containing the count and
content of new website contact messages. Supabase remains the source of truth;
Google Sheets is intentionally not used as a second store for contact data.

## Delivery

- Recipient: `bpkruis@gmail.com`
- Time zone: `America/Denver`
- Delivery window: 8:00-9:59 a.m. Mountain Time
- Content: total new count plus up to 50 complete messages
- Empty mornings: a zero-message confirmation is still sent
- Replies: when a digest has one message, Reply goes directly to that visitor

The Cron job runs every 15 minutes during the UTC hours that cover 8:00-9:59
a.m. in both Mountain Standard and Mountain Daylight Time. The delivery ledger
prevents duplicate daily sends, while failed or interrupted runs become eligible
for retry after ten minutes.

## Data model

Run `supabase/migrations/202608250001_create_contact_message_digests.sql`.
It adds:

- `contact_messages.digest_sent_at`
- the private `contact_message_digest_runs` delivery ledger
- service-role-only functions for beginning, completing, and failing a run

## Edge Function

Deploy without public JWT verification because the function authenticates a
separate high-entropy Cron secret:

```sh
npx supabase functions deploy send-contact-digest \
  --project-ref ybdstjtcottakchchrwg \
  --no-verify-jwt \
  --use-api
```

Required Supabase Edge Function secrets:

- `CONTACT_DIGEST_CRON_SECRET`
- `BREVO_API_KEY`
- `BREVO_DIGEST_RECIPIENT=bpkruis@gmail.com`
- `BREVO_DIGEST_SENDER_EMAIL`
- `BREVO_DIGEST_TEST_RECIPIENT` for an explicitly requested one-time test copy

Until `lightovercomes.org@gmail.com` is verified as a Brevo sender, use the
existing verified `bpkruis@gmail.com` sender. Change only the sender secret after
Brevo verification; no redeploy is required.

## Cron

Store the same Cron secret in Supabase Vault as
`contact_digest_cron_secret`. Schedule the following command as
`send-contact-message-digest`:

```sql
select net.http_post(
  url := 'https://ybdstjtcottakchchrwg.supabase.co/functions/v1/send-contact-digest',
  headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'x-digest-secret', (
      select decrypted_secret
      from vault.decrypted_secrets
      where name = 'contact_digest_cron_secret'
    )
  ),
  body := jsonb_build_object('scheduled', true),
  timeout_milliseconds := 15000
);
```

Cron expression: `0,15,30,45 14-16 * * *`

The Edge Function checks Denver local time and exits without sending outside
the 8:00-9:59 a.m. window.

## Privacy

The digest contains private visitor contact details and message content. It is
sent only to Brian and is not a marketing subscription. Do not forward it to a
shared mailing list or sync it to a broadly accessible spreadsheet.
