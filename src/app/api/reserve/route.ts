import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { ConfirmationEmail } from '@/emails/ConfirmationEmail'

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
  let body: { guestName: string; guestEmail: string; guestPhone?: string; restaurantId: string; reservationDate: string; reservationTime: string; partySize: number; specialRequests?: string }
  try {
    body = await request.json() as typeof body
  } catch {
    return err('Request body must be valid JSON', 400)
  }

  console.log('reserve body:', body)

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

  const { data: restaurantData, error: restaurantError } = await createServiceClient()
    .from('restaurants')
    .select('id')
    .eq('id', restaurantId)
    .single()
  console.log('restaurant lookup:', { data: restaurantData, error: restaurantError })

  // Required-field presence check
  const missing = (
    [
      ['guestName', guestName],
      ['guestEmail', guestEmail],
      ['restaurantId', restaurantId],
      ['reservationDate', reservationDate],
      ['reservationTime', reservationTime],
      ['partySize', partySize],
    ] as [string, unknown][]
  )
    .filter(([, v]) => v === undefined || v === null || v === '')
    .map(([k]) => k)

  console.log('validation: required fields', { missing, passed: missing.length === 0 })
  if (missing.length > 0) {
    return Response.json(
      { error: 'Missing required fields', fields: missing },
      { status: 400 }
    )
  }

  // Type + format validation
  if (typeof guestName !== 'string' || !guestName.trim()) {
    console.log('validation: guestName FAILED', { guestName })
    return err('guestName must be a non-empty string', 400)
  }
  console.log('validation: guestName passed')

  if (typeof guestEmail !== 'string' || !EMAIL_RE.test(guestEmail.trim())) {
    console.log('validation: guestEmail FAILED', { guestEmail })
    return err('guestEmail must be a valid email address', 400)
  }
  console.log('validation: guestEmail passed')

  if (typeof reservationDate !== 'string' || !DATE_RE.test(reservationDate) || isNaN(Date.parse(reservationDate))) {
    console.log('validation: reservationDate FAILED', { reservationDate })
    return err('reservationDate must be a valid date in YYYY-MM-DD format', 400)
  }
  console.log('validation: reservationDate passed')

  if (typeof reservationTime !== 'string' || !TIME_RE.test(reservationTime)) {
    console.log('validation: reservationTime FAILED', { reservationTime })
    return err('reservationTime must be a valid time in HH:MM format', 400)
  }
  console.log('validation: reservationTime passed')

  const parsedPartySize = Number(partySize)
  if (!Number.isInteger(parsedPartySize) || parsedPartySize < 1) {
    console.log('validation: partySize FAILED', { partySize, parsedPartySize })
    return err('partySize must be a positive integer', 400)
  }
  console.log('validation: partySize passed', { parsedPartySize })

  // ---------------------------------------------------------------------------
  // Insert reservation using service role (bypasses RLS)
  // ---------------------------------------------------------------------------
  const supabase = createServiceClient()

  const insertPayload = {
    guest_name: guestName.trim(),
    guest_email: guestEmail.trim().toLowerCase(),
    guest_phone: guestPhone?.trim() || null,
    restaurant_id: restaurantId,
    reservation_date: reservationDate,
    reservation_time: reservationTime,
    party_size: parsedPartySize,
    special_requests: specialRequests
      ? String(specialRequests).trim() || null
      : null,
  }
  console.log('insert payload:', insertPayload)

  const { data, error: insertError } = await supabase
    .from('reservations')
    .insert(insertPayload)
    .select('id')
    .single()

  console.log('insert result:', { data, error: insertError })

  if (insertError) {
    console.error('[POST /api/reserve] insert error:', insertError)
    return err('Failed to create reservation', 500)
  }

  // ---------------------------------------------------------------------------
  // Send confirmation email via Resend
  // ---------------------------------------------------------------------------
  const resend = new Resend(process.env.RESEND_API_KEY)
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'reservations@nickfurr.com'
  const restaurantName = process.env.RESTAURANT_NAME ?? 'The Restaurant'

  const { error: emailError } = await resend.emails.send({
    from: fromEmail,
    to: guestEmail.trim().toLowerCase(),
    subject: 'Your reservation is confirmed',
    react: ConfirmationEmail({
      guestName: guestName.trim(),
      restaurantName,
      reservationDate,
      reservationTime,
      partySize: parsedPartySize,
      specialRequests: specialRequests ? String(specialRequests).trim() || null : null,
      reservationId: data.id,
    }),
  })

  if (emailError) {
    console.error('[POST /api/reserve] resend error:', emailError)
  } else {
    const { error: updateError } = await supabase
      .from('reservations')
      .update({ confirmation_sent_at: new Date().toISOString() })
      .eq('id', data.id)

    if (updateError) {
      console.error('[POST /api/reserve] confirmation_sent_at update error:', updateError)
    }
  }

  return Response.json({ id: data.id }, { status: 201 })
}
