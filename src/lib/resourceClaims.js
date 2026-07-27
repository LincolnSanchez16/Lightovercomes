const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/$/, '')
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

export const isResourceClaimConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const isResourceClaimEnabled =
  import.meta.env.VITE_EMAIL_SIGNUP_ENABLED === 'true' && isResourceClaimConfigured

export const isResourceClaimPreview =
  import.meta.env.DEV || import.meta.env.VITE_EMAIL_SIGNUP_PREVIEW === 'true'

export async function claimResource({
  name,
  email,
  resourceKey,
  source,
  pagePath,
  marketingOptIn,
  website = '',
}) {
  if (!isResourceClaimConfigured) {
    throw new Error()
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/claim-resource`, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      claimant_name: name.trim(),
      claimant_email: email.trim().toLowerCase(),
      resource_key: resourceKey,
      claim_source: source,
      claim_page: pagePath,
      marketing_opt_in: marketingOptIn,
      website,
    }),
  })

  if (!response.ok) {
    throw new Error()
  }
}
