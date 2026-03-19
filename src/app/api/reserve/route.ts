import { createClient } from '@supabase/supabase-js'

function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const TIME_RE = /^\d{2}:\d{2}(:\d{2})?$/

function err(message: string, status: number) {
  return Response.json({ error: message }, { status })
}

// ---------------------------------------------------------------------------
// POST /api/reserve
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  // Parse body
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return err('Request body must be valid JSON', 400)
  }

  const {
    guestName,
    guestEmail,
    guestPhone,
    restaurantId,
    reservationDate,
    reservationTime,
    partySize,
    specialRequests,
  } = body

  // Required-field presence check
  const missing = (
    [
      ['guestName', guestName],
      ['guestEmail', guestEmail],
      ['guestPhone', guestPhone],
      ['restaurantId', restaurantId],
      ['reservationDate', reservationDate],
      ['reservationTime', reservationTime],
      ['partySize', partySize],
    ] as [string, unknown][]
  )
    .filter(([, v]) => v === undefined || v === null || v === '')
    .map(([k]) => k)

  if (missing.length > 0) {
    return Response.json(
      { error: 'Missing required fields', fields: missing },
      { status: 400 }
    )
  }

  // Type + format validation
  if (typeof guestName !== 'string' || !guestName.trim()) {
    return err('guestName must be a non-empty string', 400)
  }
  if (typeof guestEmail !== 'string' || !EMAIL_RE.test(guestEmail.trim())) {
    return err('guestEmail must be a valid email address', 400)
  }
  if (typeof guestPhone !== 'string' || !guestPhone.trim()) {
    return err('guestPhone must be a non-empty string', 400)
  }
  if (typeof reservationDate !== 'string' || !DATE_RE.test(reservationDate) || isNaN(Date.parse(reservationDate))) {
    return err('reservationDate must be a valid date in YYYY-MM-DD format', 400)
  }
  if (typeof reservationTime !== 'string' || !TIME_RE.test(reservationTime)) {
    return err('reservationTime must be a valid time in HH:MM format', 400)
  }

  const parsedPartySize = Number(partySize)
  if (!Number.isInteger(parsedPartySize) || parsedPartySize < 1) {
    return err('partySize must be a positive integer', 400)
  }

  // ---------------------------------------------------------------------------
  // Insert reservation using service role (bypasses RLS)
  // ---------------------------------------------------------------------------
  const supabase = createServiceClient()

  const { data, error: insertError } = await supabase
    .from('reservations')
    .insert({
      guest_name: guestName.trim(),
      guest_email: guestEmail.trim().toLowerCase(),
      guest_phone: guestPhone.trim(),
      restaurant_id: restaurantId,
      reservation_date: reservationDate,
      reservation_time: reservationTime,
      party_size: parsedPartySize,
      special_requests: specialRequests
        ? String(specialRequests).trim() || null
        : null,
    })
    .select('id')
    .single()

  if (insertError) {
    console.error('[POST /api/reserve] insert error:', insertError)
    return err('Failed to create reservation', 500)
  }

  // ---------------------------------------------------------------------------
  // Mark confirmation as sent (placeholder — Resend wired later)
  // ---------------------------------------------------------------------------
  const { error: updateError } = await supabase
    .from('reservations')
    .update({ confirmation_sent_at: new Date().toISOString() })
    .eq('id', data.id)

  if (updateError) {
    // Non-fatal: the reservation was created. Log and continue.
    console.error('[POST /api/reserve] confirmation_sent_at update error:', updateError)
  }

  return Response.json({ id: data.id }, { status: 201 })
}
