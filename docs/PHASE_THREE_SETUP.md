# Light Overcomes Phase Three Setup

## Email intake

The website intake is ready for a Supabase project without creating website accounts or using Supabase Auth.

1. Create the Supabase project.
2. Open the Supabase SQL Editor and run `supabase/migrations/202607220001_create_email_subscribers.sql`.
3. Copy the project URL and publishable/anon key from the Supabase project settings.
4. Add these values to the local `.env` file and to the Vercel project environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_EMAIL_SIGNUP_ENABLED=true`
5. Redeploy the website after adding the Vercel values.

The public website can call only the `subscribe_to_updates` database function. It cannot list, search, update, or delete subscriber records. The Supabase secret/service-role key must never be added to a `VITE_` variable or browser code.

The intake records the subscriber's name, normalized email address, subscription status, signup source, page path, exact consent wording, and consent date. The browser stores only the date when the visitor completes the prompt so it does not repeatedly interrupt them. The corner invitation appears after a visitor reaches 40% of a page and opens a centered dialog only when selected. The Resources page also includes a non-floating inline form.

Local development always displays the corner button so its dialog and validation can be reviewed before Supabase is connected. In that preview state, submissions are not stored and the confirmation says so. A hosted staging deployment can use `VITE_EMAIL_SIGNUP_PREVIEW=true`; do not enable that value in production.

The form includes a hidden bot-trap field. Before a larger public campaign, route the same database function through a Supabase Edge Function with rate limiting or a challenge service so automated submissions cannot flood the list.

Official references:

- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase JavaScript inserts](https://supabase.com/docs/reference/javascript/insert)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

## Email sendouts

Sendouts should be added as a server-side Supabase Edge Function after the client chooses the sending service and the custom domain is ready. SMTP credentials or provider API keys belong in Supabase project secrets, never in the website. That later function should send only to records with `status = 'subscribed'`, include an unsubscribe link, and record delivery results.

Google Workspace SMTP is designed primarily for mailbox and application sending. For newsletters or large announcements, a dedicated sending provider connected to the Light Overcomes domain will provide better unsubscribe handling, deliverability, bounce processing, and sending limits.

## Subsplash Giving

Subsplash, not Supabase, should remain the system that handles donor accounts, gifts, payment details, funds, receipts, recurring gifts, and payouts. The Light Overcomes website only needs to securely display or link to the Giving experience.

The client should prepare:

- Exact legal organization name and matching tax ID/EIN.
- An authorized Giving Account Owner and finance users.
- Tax-exempt documentation. Subsplash says a church may be asked for a 501(c)(3) letter, state nonprofit incorporation letter, or articles of incorporation. A non-church entity needs a 501(c)(3) determination or proof that it has applied.
- DBA or affiliation documentation when the public name differs from the legal name or the organization uses a parent organization's exemption.
- A checking account for deposits, including routing and account information. Subsplash does not support savings accounts for deposits.
- Giving funds and subfunds, default fund, one-time/recurring options, donor-facing giving text, receipt contact information, and the staff who should access financial records.

After approval, the dashboard provides three useful website options under Giving settings: a standalone link, an embed link, or an iFrame embed. For the dedicated Light Overcomes Give page, use Subsplash's responsive/autofit iFrame embed once the client supplies the generated code. The existing Vercel website already provides HTTPS.

Official references:

- [Setting up Subsplash Giving](https://support.subsplash.com/en/articles/9021030-setting-up-giving)
- [Adding Subsplash Giving to a website](https://support.subsplash.com/en/articles/9021114-adding-subsplash-giving-to-your-website)
- [Subsplash Giving settings and link types](https://support.subsplash.com/en/articles/9021475-giving-settings)

## Calling All Leaders

The `/calling-all-leaders` route is published as the book preview for *Called to Be Warriors, Leaders, and Champions*. Its cover appears with the other books in Resources. Desktop keeps the cover centered while the text scrolls; mobile uses the full reading width without repeating the cover.

## Google Workspace

The client owns this setup. Confirm the domain, Workspace subscription, DNS verification, and desired mailboxes or aliases before connecting a sending service. The website does not need the mailbox password for email intake.
