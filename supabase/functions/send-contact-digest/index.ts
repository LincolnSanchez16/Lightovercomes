const TIME_ZONE = 'America/Denver'
const DIGEST_HOURS = new Set([8, 9])
const MESSAGE_LIMIT = 50

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  })
}

function secureEqual(left, right) {
  if (!left || !right || left.length !== right.length) return false

  let difference = 0
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }

  return difference === 0
}

function getMountainClock(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))

  return {
    digestDate: `${values.year}-${values.month}-${values.day}`,
    hour: Number(values.hour),
  }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function formatTimestamp(value) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function pluralize(count, singular, plural = `${singular}s`) {
  return count === 1 ? singular : plural
}

function buildDigestHtml({ digestDate, messages, totalCount }) {
  const remainingCount = Math.max(totalCount - messages.length, 0)
  const messageBlocks = messages
    .map(
      (message, index) => `
        <section style="padding:24px 0;${index ? 'border-top:1px solid #d6e0d5;' : ''}">
          <p style="margin:0 0 6px;font:700 18px/1.35 Arial,sans-serif;color:#133e2d;">
            ${escapeHtml(message.name)}
          </p>
          <p style="margin:0 0 14px;font:14px/1.5 Arial,sans-serif;color:#55705f;">
            <a href="mailto:${encodeURIComponent(message.email)}" style="color:#2f6748;">
              ${escapeHtml(message.email)}
            </a>
            &nbsp;&middot;&nbsp; ${escapeHtml(formatTimestamp(message.created_at))}
          </p>
          <p style="margin:0 0 14px;white-space:pre-wrap;font:16px/1.65 Georgia,serif;color:#183c2d;">
            ${escapeHtml(message.message)}
          </p>
          <p style="margin:0;font:12px/1.5 Arial,sans-serif;color:#718276;">
            Source: ${escapeHtml(message.source)}${
              message.page_path ? ` &nbsp;&middot;&nbsp; Page: ${escapeHtml(message.page_path)}` : ''
            }
          </p>
        </section>`,
    )
    .join('')

  const emptyState = `
    <div style="padding:34px 0 12px;text-align:center;">
      <p style="margin:0;font:24px/1.4 Georgia,serif;color:#183c2d;">No new messages this morning.</p>
      <p style="margin:10px 0 0;font:14px/1.5 Arial,sans-serif;color:#55705f;">
        The daily check completed successfully.
      </p>
    </div>`

  const overflowNotice = remainingCount
    ? `<p style="margin:22px 0 0;padding:14px;background:#eef4ec;font:14px/1.5 Arial,sans-serif;color:#315c45;">
        ${remainingCount} additional ${pluralize(remainingCount, 'message')} will be included in the next digest.
      </p>`
    : ''

  return `<!doctype html>
  <html lang="en">
    <body style="margin:0;background:#edf3ec;color:#183c2d;">
      <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
        ${totalCount} new Light Overcomes ${pluralize(totalCount, 'message')}.
      </div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#edf3ec;">
        <tr>
          <td align="center" style="padding:32px 16px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;">
              <tr>
                <td style="padding:34px 38px;background:#123e2d;color:#ffffff;">
                  <p style="margin:0 0 10px;font:700 12px/1 Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;">
                    Light Overcomes
                  </p>
                  <h1 style="margin:0;font:700 34px/1.15 Arial,sans-serif;letter-spacing:0;">
                    ${totalCount} new ${pluralize(totalCount, 'message')}
                  </h1>
                  <p style="margin:12px 0 0;font:15px/1.5 Arial,sans-serif;color:#dbe8dd;">
                    Daily contact digest for ${escapeHtml(digestDate)}
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 38px 34px;">
                  ${messages.length ? messageBlocks : emptyState}
                  ${overflowNotice}
                  <p style="margin:28px 0 0;padding-top:20px;border-top:1px solid #d6e0d5;font:12px/1.55 Arial,sans-serif;color:#718276;">
                    This private digest contains contact-form entries submitted to Light Overcomes. Reply directly to a sender using their linked email address.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`
}

async function callRpc({ supabaseUrl, serviceRoleKey, functionName, body }) {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/${functionName}`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    console.error(`Contact digest RPC ${functionName} failed.`, response.status)
    throw new Error('Contact digest database operation failed.')
  }

  if (response.status === 204) return null
  return response.json()
}

async function markRunFailed({ supabaseUrl, serviceRoleKey, runId, reason }) {
  if (!runId) return

  try {
    await callRpc({
      supabaseUrl,
      serviceRoleKey,
      functionName: 'fail_contact_message_digest',
      body: {
        failed_run_id: runId,
        failure_reason: reason,
      },
    })
  } catch {
    console.error('Unable to record contact digest failure.')
  }
}

Deno.serve(async (request) => {
  if (request.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed.' })
  }

  const cronSecret = Deno.env.get('CONTACT_DIGEST_CRON_SECRET') || ''
  if (!secureEqual(request.headers.get('x-digest-secret') || '', cronSecret)) {
    return jsonResponse(401, { error: 'Unauthorized.' })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const brevoApiKey = Deno.env.get('BREVO_API_KEY')
  const recipientEmail = Deno.env.get('BREVO_DIGEST_RECIPIENT') || 'bpkruis@gmail.com'
  const senderEmail = Deno.env.get('BREVO_DIGEST_SENDER_EMAIL') || 'bpkruis@gmail.com'
  const testRecipientEmail = Deno.env.get('BREVO_DIGEST_TEST_RECIPIENT') || ''

  if (!supabaseUrl || !serviceRoleKey || !brevoApiKey || !cronSecret) {
    console.error('Contact digest configuration is incomplete.')
    return jsonResponse(503, { error: 'Digest service unavailable.' })
  }

  let forceRun = false
  let includeTestCopy = false
  try {
    const requestBody = await request.json()
    forceRun = requestBody?.force === true
    includeTestCopy = requestBody?.includeTestCopy === true
  } catch {
    // Scheduled requests may omit a body.
  }

  const now = new Date()
  const { digestDate, hour } = getMountainClock(now)

  if (!forceRun && !DIGEST_HOURS.has(hour)) {
    return jsonResponse(200, { status: 'outside-delivery-window', digestDate })
  }

  let runId = null

  try {
    const beginResult = await callRpc({
      supabaseUrl,
      serviceRoleKey,
      functionName: 'begin_contact_message_digest',
      body: {
        requested_digest_date: digestDate,
        requested_recipient_email: recipientEmail,
      },
    })
    const run = Array.isArray(beginResult) ? beginResult[0] : null
    runId = run?.run_id || null

    if (!run?.should_send) {
      return jsonResponse(200, { status: 'already-processed', digestDate })
    }

    const query = new URL(`${supabaseUrl}/rest/v1/contact_messages`)
    query.searchParams.set(
      'select',
      'id,name,email,message,source,page_path,created_at',
    )
    query.searchParams.set('digest_sent_at', 'is.null')
    query.searchParams.set('created_at', `lte.${now.toISOString()}`)
    query.searchParams.set('order', 'created_at.asc')
    query.searchParams.set('limit', String(MESSAGE_LIMIT))

    const messagesResponse = await fetch(query, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: 'count=exact',
      },
    })

    if (!messagesResponse.ok) {
      console.error('Contact digest message query failed.', messagesResponse.status)
      throw new Error('Unable to load contact messages.')
    }

    const messages = await messagesResponse.json()
    const contentRange = messagesResponse.headers.get('content-range') || ''
    const parsedCount = Number(contentRange.split('/')[1])
    const totalCount = Number.isFinite(parsedCount) ? parsedCount : messages.length
    const subject = `${totalCount} new Light Overcomes ${pluralize(totalCount, 'message')}`

    const emailPayload = {
      sender: { name: 'Light Overcomes', email: senderEmail },
      to: [{ email: recipientEmail, name: 'Brian Kruis' }],
      ...(includeTestCopy && testRecipientEmail
        ? { cc: [{ email: testRecipientEmail, name: 'Lincoln Sanchez' }] }
        : {}),
      subject,
      htmlContent: buildDigestHtml({ digestDate, messages, totalCount }),
      headers: { idempotencyKey: runId },
      tags: ['website-contact-digest'],
      ...(messages.length === 1
        ? {
            replyTo: {
              email: messages[0].email,
              name: messages[0].name,
            },
          }
        : {}),
    }

    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': brevoApiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(emailPayload),
    })
    const brevoBody = await brevoResponse.json().catch(() => ({}))
    const isIdempotentDuplicate =
      brevoResponse.status === 400 && brevoBody?.code === 'duplicate_parameter'

    if (!brevoResponse.ok && !isIdempotentDuplicate) {
      console.error(
        'Contact digest email failed.',
        brevoResponse.status,
        brevoBody?.code || 'unknown-code',
        brevoBody?.message || 'No error message returned.',
      )
      throw new Error('Brevo rejected the contact digest.')
    }

    await callRpc({
      supabaseUrl,
      serviceRoleKey,
      functionName: 'complete_contact_message_digest',
      body: {
        completed_run_id: runId,
        included_message_ids: messages.map((message) => message.id),
        total_message_count: totalCount,
        delivery_message_id: brevoBody?.messageId || '',
      },
    })

    return jsonResponse(200, {
      status: 'sent',
      digestDate,
      messageCount: totalCount,
      includedCount: messages.length,
    })
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Digest delivery failed.'
    console.error('Contact digest request failed.', reason)
    await markRunFailed({ supabaseUrl, serviceRoleKey, runId, reason })
    return jsonResponse(500, { error: 'Digest delivery failed.' })
  }
})
