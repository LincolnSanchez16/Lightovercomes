const allowedProductionOrigins = new Set([
  'https://lightovercomes.com',
  'https://www.lightovercomes.com',
  'https://lightovercomes.org',
  'https://www.lightovercomes.org',
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

function jsonResponse(origin, status, body, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(origin),
      ...extraHeaders,
      'Content-Type': 'application/json',
    },
  })
}

function cleanText(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function cleanName(value) {
  return typeof value === 'string'
    ? value.normalize('NFKC').trim().replace(/\s+/gu, ' ').slice(0, 120)
    : ''
}

function getClientIp(request) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return (
    forwardedFor ||
    request.headers.get('cf-connecting-ip')?.trim() ||
    request.headers.get('x-real-ip')?.trim() ||
    ''
  )
}

async function createRateLimitHash(scope, value, secret) {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(`${scope}:${value}`))

  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, '0')).join(
    '',
  )
}

async function consumeRateLimit({
  supabaseUrl,
  serviceRoleKey,
  keys,
  maxAttempts,
  windowSeconds,
}) {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/rpc/consume_contact_message_rate_limit`,
    {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rate_limit_keys: keys,
        max_attempts: maxAttempts,
        window_seconds: windowSeconds,
      }),
    },
  )

  if (!response.ok) {
    console.error('Contact message rate-limit check failed.', response.status)
    throw new Error('Rate-limit service unavailable.')
  }

  return (await response.json()) === true
}

Deno.serve(async (request) => {
  const origin = request.headers.get('origin')

  if (!isAllowedOrigin(origin)) {
    console.warn('Rejected contact message origin.', origin || 'missing')
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
    const name = cleanName(body.contact_name)
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
    const brevoApiKey = Deno.env.get('BREVO_API_KEY')
    const brevoTemplateId = Number(Deno.env.get('BREVO_CONTACT_TEMPLATE_ID'))

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Contact message service configuration is incomplete.')
      return jsonResponse(origin, 503, { error: 'Unable to send this message.' })
    }

    const clientIp = getClientIp(request)
    const minuteKeys = [
      await createRateLimitHash('contact-minute-email', email, serviceRoleKey),
    ]
    const hourKeys = [await createRateLimitHash('contact-hour-email', email, serviceRoleKey)]

    if (clientIp) {
      minuteKeys.push(
        await createRateLimitHash('contact-minute-ip', clientIp, serviceRoleKey),
      )
      hourKeys.push(await createRateLimitHash('contact-hour-ip', clientIp, serviceRoleKey))
    }

    const minuteLimitAllowed = await consumeRateLimit({
      supabaseUrl,
      serviceRoleKey,
      keys: minuteKeys,
      maxAttempts: 3,
      windowSeconds: 60,
    })
    const hourLimitAllowed = minuteLimitAllowed
      ? await consumeRateLimit({
          supabaseUrl,
          serviceRoleKey,
          keys: hourKeys,
          maxAttempts: 10,
          windowSeconds: 3600,
        })
      : false

    if (!minuteLimitAllowed || !hourLimitAllowed) {
      return jsonResponse(
        origin,
        429,
        { error: 'Too many messages were sent. Please wait a little while and try again.' },
        { 'Retry-After': minuteLimitAllowed ? '3600' : '60' },
      )
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

    if (
      brevoApiKey &&
      Number.isInteger(brevoTemplateId) &&
      brevoTemplateId > 0
    ) {
      const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoApiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          to: [{ email, name }],
          templateId: brevoTemplateId,
          params: { name },
          tags: ['website-contact-confirmation'],
        }),
      })

      if (!brevoResponse.ok) {
        console.error('Contact confirmation email failed.', brevoResponse.status)
      }
    } else {
      console.error('Contact confirmation email configuration is incomplete.')
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
