const allowedProductionOrigins = new Set([
  'https://lightovercomes.com',
  'https://www.lightovercomes.com',
])

const resources = new Map([
  ['christian-life-resource', 'Christian Life Resource'],
])

const emailPattern =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/

function isAllowedOrigin(origin) {
  if (!origin) return false
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
    return jsonResponse(origin, 403, { error: 'Unable to save this resource claim.' })
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin) })
  }

  if (request.method !== 'POST') {
    return jsonResponse(origin, 405, { error: 'Unable to save this resource claim.' })
  }

  try {
    const contentLength = Number(request.headers.get('content-length') || 0)
    if (contentLength > 8_192) {
      return jsonResponse(origin, 413, { error: 'Unable to save this resource claim.' })
    }

    const requestBody = await request.text()
    if (requestBody.length > 8_192) {
      return jsonResponse(origin, 413, { error: 'Unable to save this resource claim.' })
    }

    const body = JSON.parse(requestBody)
    const name = cleanText(body.claimant_name, 120)
    const email = cleanText(body.claimant_email, 254).toLowerCase()
    const resourceKey = cleanText(body.resource_key, 80)
    const resourceTitle = resources.get(resourceKey)
    const source = cleanText(body.claim_source, 80) || 'website'
    const pagePath = cleanText(body.claim_page, 240) || null
    const marketingOptIn = body.marketing_opt_in === true

    if (cleanText(body.website, 200)) {
      return jsonResponse(origin, 200, { status: 'claimed' })
    }

    if (!name || !emailPattern.test(email) || !resourceTitle) {
      return jsonResponse(origin, 400, { error: 'Enter a valid name and email address.' })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const brevoApiKey = Deno.env.get('BREVO_API_KEY')
    const resourceListId = Number(Deno.env.get('BREVO_RESOURCE_LIST_ID'))
    const updatesListId = Number(Deno.env.get('BREVO_LIST_ID'))

    if (
      !supabaseUrl ||
      !serviceRoleKey ||
      !brevoApiKey ||
      !Number.isInteger(resourceListId) ||
      resourceListId <= 0 ||
      (marketingOptIn && (!Number.isInteger(updatesListId) || updatesListId <= 0))
    ) {
      console.error('Resource claim service configuration is incomplete.')
      return jsonResponse(origin, 503, { error: 'Unable to save this resource claim.' })
    }

    const databaseResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/claim_resource`, {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        claimant_name: name,
        claimant_email: email,
        claimed_resource_key: resourceKey,
        claimed_resource_title: resourceTitle,
        claim_source: source,
        claim_page: pagePath,
        wants_marketing: marketingOptIn,
      }),
    })

    if (!databaseResponse.ok) {
      console.error('Resource claim database write failed.', databaseResponse.status)
      return jsonResponse(origin, 503, { error: 'Unable to save this resource claim.' })
    }

    if (marketingOptIn) {
      const subscriberResponse = await fetch(
        `${supabaseUrl}/rest/v1/rpc/subscribe_to_updates`,
        {
          method: 'POST',
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subscriber_name: name,
            subscriber_email: email,
            signup_source: 'christian-resource-claim',
            signup_page: pagePath,
            consent_copy:
              'Also send me ministry updates and new resources from Light Overcomes. I can unsubscribe at any time.',
          }),
        },
      )

      if (!subscriberResponse.ok) {
        console.error('Resource claim marketing consent write failed.', subscriberResponse.status)
        return jsonResponse(origin, 503, { error: 'Unable to save this resource claim.' })
      }
    }

    const listIds = marketingOptIn
      ? Array.from(new Set([resourceListId, updatesListId]))
      : [resourceListId]

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
        listIds,
        updateEnabled: true,
      }),
    })

    if (!brevoResponse.ok) {
      console.error('Resource claim Brevo sync failed.', brevoResponse.status)
      return jsonResponse(origin, 503, { error: 'Unable to save this resource claim.' })
    }

    return jsonResponse(origin, 200, { status: 'claimed' })
  } catch (error) {
    console.error(
      'Resource claim request failed.',
      error instanceof Error ? error.message : 'Unknown error',
    )
    return jsonResponse(origin, 500, { error: 'Unable to save this resource claim.' })
  }
})
