const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/$/, '')
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

export const isEmailSignupConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const isEmailSignupEnabled =
  import.meta.env.VITE_EMAIL_SIGNUP_ENABLED === 'true' && isEmailSignupConfigured

export const isEmailSignupPreview =
  import.meta.env.DEV || import.meta.env.VITE_EMAIL_SIGNUP_PREVIEW === 'true'

export const isEmailSignupVisible = isEmailSignupEnabled || isEmailSignupPreview

export const emailConsentCopy =
  'I agree to receive email updates and new resources from Light Overcomes. I can unsubscribe at any time.'

export async function subscribeToUpdates({ name, email, source, pagePath }) {
  if (!isEmailSignupConfigured) {
    throw new Error()
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/subscribe_to_updates`, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subscriber_name: name.trim(),
      subscriber_email: email.trim().toLowerCase(),
      signup_source: source,
      signup_page: pagePath,
      consent_copy: emailConsentCopy,
    }),
  })

  if (!response.ok) {
    throw new Error()
  }
}
