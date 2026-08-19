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
    return jsonResponse(origin, 403, { error: 'Unable to send this message.' })
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin) })
  }

  if (request.method !== 'POST') {
    return jsonResponse(origin, 405, { error: 'Unable to send this message.' })
  }

  try {
    const contentLength = Number(request.headers.get('content-length') || 0)
    if (contentLength > 16_384) {
      return jsonResponse(origin, 413, { error: 'Unable to send this message.' })
    }

    const requestBody = await request.text()
    if (requestBody.length > 16_384) {
      return jsonResponse(origin, 413, { error: 'Unable to send this message.' })
    }

    const body = JSON.parse(requestBody)
    const name = cleanText(body.contact_name, 120)
    const email = cleanText(body.contact_email, 254).toLowerCase()
    const message = cleanText(body.contact_message, 5000)
    const source = cleanText(body.contact_source, 80) || 'website-contact'
    const pagePath = cleanText(body.contact_page, 240) || null

    if (cleanText(body.website, 200)) {
      return jsonResponse(origin, 200, { status: 'received' })
    }

    if (!name || !emailPattern.test(email) || message.length < 10) {
      return jsonResponse(origin, 400, { error: 'Enter a valid name, email, and message.' })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Contact message service configuration is incomplete.')
      return jsonResponse(origin, 503, { error: 'Unable to send this message.' })
    }

    const databaseResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/submit_contact_message`, {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contact_name: name,
        contact_email: email,
        message_body: message,
        message_source: source,
        message_page: pagePath,
      }),
    })

    if (!databaseResponse.ok) {
      console.error('Contact message database write failed.', databaseResponse.status)
      return jsonResponse(origin, 503, { error: 'Unable to send this message.' })
    }

    return jsonResponse(origin, 200, { status: 'received' })
  } catch (error) {
    console.error(
      'Contact message request failed.',
      error instanceof Error ? error.message : 'Unknown error',
    )
    return jsonResponse(origin, 500, { error: 'Unable to send this message.' })
  }
})
