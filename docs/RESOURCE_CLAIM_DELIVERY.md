# Christian Life Resource Delivery

The Christian Values page has a dedicated resource claim flow. It is separate
from the general Stay Connected newsletter signup.

## Current Flow

1. A visitor selects **Claim this resource** on `/christian-values`.
2. The `claim-resource` Edge Function validates the request.
3. The request is stored in `public.resource_claims` with a `pending` status.
4. The contact is added to Brevo list `#6`, **Christian Life Resource Claims**.
5. If the visitor separately checks the ministry-updates box, the function also
   records newsletter consent and adds the contact to the Website Updates list.

Brevo automation `#2`, **Christian Life Resource Delivery**, is configured with
the list trigger and a branded delivery email. It must stay inactive until the
final PDF and download URL are available. Its download button currently points
back to `/christian-values` as a safe placeholder.

## Activation Checklist

1. Upload the finished PDF to a stable public location.
2. Replace the placeholder download-button link in automation message `#7`.
3. Test the link, sender, personalization, mobile layout, and unsubscribe footer.
4. Send a one-time campaign to existing contacts in the resource-claim list.
5. Activate the automation for future contacts added to that list.
6. Mark fulfilled database claims as `delivered` and set `delivered_at`.

## Supabase Setup

Run `supabase/migrations/202607270001_create_resource_claims.sql`, deploy the
`claim-resource` Edge Function, and set this Edge Function secret:

```text
BREVO_RESOURCE_LIST_ID=6
```

The function also reuses `BREVO_API_KEY` and `BREVO_LIST_ID`. The latter is only
used when a visitor separately opts into ministry updates.
