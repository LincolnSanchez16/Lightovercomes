# Client Revision Checklist - August 19, 2026

## Website Revisions

- [x] Replace the one-strike "Content preview unavailable" state with a second image-source attempt and a clean branded fallback.
- [x] Show a visible runtime beneath every witness-card video.
- [x] Show the 2:18 runtime on the longer "Everyone Needs Lasting Hope" video CTA.
- [x] Add an explicit fullscreen control to the witness-card video player.
- [x] Automatically adapt the video modal to a wide 16:9 layout when a future ASL video is landscape.
- [x] Remove "God Gives Wisdom" from the Daily Encounters preview.
- [x] Add "God is Redeemer" to the Daily Encounters preview.
- [x] Rename "100 Quotes to Help People Turn Away from Pornography" to "100 Freedom Statements to Help People Turn Away from Pornography."
- [x] Move every "Coming Soon" label above its book cover so no title artwork is covered.
- [x] Add the homepage contact prompt: "What questions, ideas, or success stories would you like to share with us?"
- [x] Add validated name, email, and message fields without automatically subscribing contacts to ministry updates.
- [x] Update the Privacy Policy to cover contact-message storage and use.
- [x] Ensure direct QR arrivals open the Find & Share Hope page without automatically opening or playing any video.
- [x] Keep public errors generic so database and provider details are not exposed.

## Contact Backend

- [x] Add the locked `contact_messages` table migration with Row Level Security and no public reads.
- [x] Add the `submit_contact_message` database function for validated inserts.
- [x] Add and deploy the `submit-contact-message` Supabase Edge Function.
- [x] Verify the deployed endpoint rejects invalid requests with a clean response.
- [ ] Run `supabase/migrations/202608190001_create_contact_messages.sql` in the Supabase SQL Editor. The CLI pooler timed out from this machine.
- [ ] Set `VITE_CONTACT_FORM_ENABLED=true` in Vercel after the migration succeeds, then redeploy. The form intentionally remains hidden in production until then.

## Client Inputs Still Needed

- [ ] Provide the completed ASL video edit. Recommended master: interpreter full-screen, Brian picture-in-picture, 16:9 landscape.
- [ ] Provide the publisher's revised devotional-title list when editing is complete.

## Verification

- [x] Production build passes.
- [x] ESLint passes.
- [x] No browser console errors on the affected routes.
- [x] No horizontal overflow at 1440px desktop width.
- [x] No horizontal overflow at 390px mobile width.
