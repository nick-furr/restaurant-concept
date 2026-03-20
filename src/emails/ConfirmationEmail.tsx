import React from 'react'

interface ConfirmationEmailProps {
  guestName: string
  restaurantName: string
  reservationDate: string
  reservationTime: string
  partySize: number
  specialRequests: string | null
  reservationId: string
}

export function ConfirmationEmail({
  guestName,
  restaurantName,
  reservationDate,
  reservationTime,
  partySize,
  specialRequests,
  reservationId,
}: ConfirmationEmailProps) {
  const bookingRef = reservationId.slice(0, 8).toUpperCase()

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Reservation Confirmed</title>
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f5f5f4', fontFamily: 'Georgia, serif' }}>
        <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#f5f5f4', padding: '40px 16px' }}>
          <tbody>
            <tr>
              <td align="center">
                <table width="100%" cellPadding={0} cellSpacing={0} style={{ maxWidth: 560, backgroundColor: '#ffffff', borderRadius: 8, overflow: 'hidden' }}>
                  <tbody>
                    {/* Header */}
                    <tr>
                      <td style={{ backgroundColor: '#1c1917', padding: '36px 40px', textAlign: 'center' }}>
                        <p style={{ margin: 0, color: '#d4b896', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase' }}>
                          {restaurantName}
                        </p>
                        <h1 style={{ margin: '12px 0 0', color: '#ffffff', fontSize: 24, fontWeight: 'normal', letterSpacing: 1 }}>
                          Your reservation is confirmed
                        </h1>
                      </td>
                    </tr>

                    {/* Body */}
                    <tr>
                      <td style={{ padding: '36px 40px' }}>
                        <p style={{ margin: '0 0 24px', color: '#44403c', fontSize: 15, lineHeight: 1.6 }}>
                          Dear {guestName},
                        </p>
                        <p style={{ margin: '0 0 28px', color: '#44403c', fontSize: 15, lineHeight: 1.6 }}>
                          We look forward to welcoming you. Here are your booking details:
                        </p>

                        {/* Details box */}
                        <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#fafaf9', border: '1px solid #e7e5e4', borderRadius: 6, marginBottom: 28 }}>
                          <tbody>
                            <tr>
                              <td style={{ padding: '20px 24px' }}>
                                <DetailRow label="Date" value={reservationDate} />
                                <DetailRow label="Time" value={reservationTime} />
                                <DetailRow label="Party size" value={String(partySize)} last={!specialRequests} />
                                {specialRequests && (
                                  <DetailRow label="Special requests" value={specialRequests} last />
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/* Booking reference */}
                        <table width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: 28 }}>
                          <tbody>
                            <tr>
                              <td style={{ textAlign: 'center' }}>
                                <p style={{ margin: '0 0 6px', color: '#78716c', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>
                                  Booking reference
                                </p>
                                <p style={{ margin: 0, color: '#1c1917', fontSize: 22, letterSpacing: 4, fontFamily: 'monospace' }}>
                                  {bookingRef}
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <p style={{ margin: 0, color: '#78716c', fontSize: 13, lineHeight: 1.6 }}>
                          If you need to make changes to your reservation, please contact us directly and have your booking reference ready.
                        </p>
                      </td>
                    </tr>

                    {/* Footer */}
                    <tr>
                      <td style={{ backgroundColor: '#fafaf9', borderTop: '1px solid #e7e5e4', padding: '20px 40px', textAlign: 'center' }}>
                        <p style={{ margin: 0, color: '#a8a29e', fontSize: 12 }}>
                          {restaurantName}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  )
}

function DetailRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <table width="100%" cellPadding={0} cellSpacing={0} style={{ borderBottom: last ? 'none' : '1px solid #e7e5e4', marginBottom: last ? 0 : 12, paddingBottom: last ? 0 : 12 }}>
      <tbody>
        <tr>
          <td style={{ color: '#78716c', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', width: '40%' }}>{label}</td>
          <td style={{ color: '#1c1917', fontSize: 14 }}>{value}</td>
        </tr>
      </tbody>
    </table>
  )
}
