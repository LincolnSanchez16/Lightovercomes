const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/$/, '')
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

export const isContactFormConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const isContactFormEnabled =
  import.meta.env.VITE_CONTACT_FORM_ENABLED === 'true' && isContactFormConfigured

export const isContactFormPreview =
  import.meta.env.DEV || import.meta.env.VITE_EMAIL_SIGNUP_PREVIEW === 'true'

export const isContactFormVisible = isContactFormEnabled || isContactFormPreview

export async function submitContactMessage({ name, email, message, source, pagePath, website = '' }) {
  if (!isContactFormConfigured) {
    throw new Error()
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/submit-contact-message`, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contact_name: name.trim(),
      contact_email: email.trim().toLowerCase(),
      contact_message: message.trim(),
      contact_source: source,
      contact_page: pagePath,
      website,
    }),
  })

  if (!response.ok) {
    let errorMessage = 'We could not send your message right now. Please try again shortly.'

    try {
      const responseBody = await response.json()
      if (typeof responseBody?.error === 'string' && responseBody.error.trim()) {
        errorMessage = responseBody.error.trim()
      }
    } catch {
      // Keep the generic message when the service does not return JSON.
    }

    throw new Error(errorMessage)
  }
}
