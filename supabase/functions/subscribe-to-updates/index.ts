const allowedProductionOrigins = new Set([
  'https://lightovercomes.com',
  'https://www.lightovercomes.com',
])

const emailPattern =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/

function isAllowedOrigin(origin) {
  if (!origin) return true
  if (allowedProductionOrigins.has(origin)) return true

  try {
    const url = new URL(origin)
    return (
      (url.hostname === 'localhost' || url.hostname === '127.0.0.1') &&
      (url.protocol === 'http:' || url.protocol === 'https:')
    )
  } catch {
    return false
  }
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || 'https://www.lightovercomes.com',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Cache-Control': 'no-store',
    Vary: 'Origin',
  }
}

function jsonResponse(origin, status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(origin),
      'Content-Type': 'application/json',
    },
  })
}

function cleanText(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

Deno.serve(async (request) => {
  const origin = request.headers.get('origin')

  if (!isAllowedOrigin(origin)) {
    return jsonResponse(origin, 403, { error: 'Unable to complete signup.' })
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin) })
  }

  if (request.method !== 'POST') {
    return jsonResponse(origin, 405, { error: 'Unable to complete signup.' })
  }

  try {
    const contentLength = Number(request.headers.get('content-length') || 0)
    if (contentLength > 8_192) {
      return jsonResponse(origin, 413, { error: 'Unable to complete signup.' })
    }

    const requestBody = await request.text()
    if (requestBody.length > 8_192) {
      return jsonResponse(origin, 413, { error: 'Unable to complete signup.' })
    }

    const body = JSON.parse(requestBody)
    const name = cleanText(body.subscriber_name, 120)
    const email = cleanText(body.subscriber_email, 254).toLowerCase()
    const source = cleanText(body.signup_source, 80) || 'website'
    const pagePath = cleanText(body.signup_page, 240) || null
    const consentCopy =
      cleanText(body.consent_copy, 500) ||
      'I agree to receive email updates from Light Overcomes.'

    if (cleanText(body.website, 200)) {
      return jsonResponse(origin, 200, { status: 'subscribed' })
    }

    if (!name || !emailPattern.test(email)) {
      return jsonResponse(origin, 400, { error: 'Enter a valid name and email address.' })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const brevoApiKey = Deno.env.get('BREVO_API_KEY')
    const brevoListId = Number(Deno.env.get('BREVO_LIST_ID'))

    if (
      !supabaseUrl ||
      !serviceRoleKey ||
      !brevoApiKey ||
      !Number.isInteger(brevoListId) ||
      brevoListId <= 0
    ) {
      console.error('Email signup service configuration is incomplete.')
      return jsonResponse(origin, 503, { error: 'Unable to complete signup.' })
    }

    const databaseResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/subscribe_to_updates`, {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriber_name: name,
        subscriber_email: email,
        signup_source: source,
        signup_page: pagePath,
        consent_copy: consentCopy,
      }),
    })

    if (!databaseResponse.ok) {
      console.error('Email signup database write failed.', databaseResponse.status)
      return jsonResponse(origin, 503, { error: 'Unable to complete signup.' })
    }

    const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': brevoApiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: name,
          SIGNUP_SOURCE: source,
        },
        listIds: [brevoListId],
        updateEnabled: true,
      }),
    })

    if (!brevoResponse.ok) {
      console.error('Brevo contact sync failed.', brevoResponse.status)
      return jsonResponse(origin, 503, { error: 'Unable to complete signup.' })
    }

    return jsonResponse(origin, 200, { status: 'subscribed' })
  } catch (error) {
    console.error('Email signup request failed.', error instanceof Error ? error.message : 'Unknown error')
    return jsonResponse(origin, 500, { error: 'Unable to complete signup.' })
  }
})
