# Contact Message Delivery

The public homepage contact form sends messages through the
`submit-contact-message` Supabase Edge Function.

## Submission flow

1. The browser validates and normalizes the visitor's name, email, and message.
2. The Edge Function normalizes internal whitespace so multi-word names are valid.
3. The function applies two server-side limits to both the normalized email and a
   keyed hash of the client IP:
   - 3 submissions per 60 seconds
   - 10 submissions per 60 minutes
4. The raw IP address is never stored.
5. The accepted message is stored through the `submit_contact_message` database
   function.
6. Brevo sends a transactional confirmation using the template configured by
   `BREVO_CONTACT_TEMPLATE_ID`.

The Brevo confirmation is transactional only. It does not add the visitor to a
marketing list. A Brevo delivery failure is logged, but the stored contact message
still returns success so the visitor does not create a duplicate by resubmitting.

## Supabase configuration

Apply these migrations in order:

- `supabase/migrations/202608190001_create_contact_messages.sql`
- `supabase/migrations/202608240001_add_contact_rate_limits.sql`

Deploy the function with JWT verification disabled, as configured in
`supabase/config.toml`:

```sh
npx supabase functions deploy submit-contact-message \
  --project-ref ybdstjtcottakchchrwg \
  --no-verify-jwt \
  --use-api
```

The function needs these Edge Function secrets:

```text
BREVO_API_KEY
BREVO_CONTACT_TEMPLATE_ID
```

The branded HTML source used by the Brevo template is stored at
`supabase/email-templates/contact-message-confirmation.html`.
