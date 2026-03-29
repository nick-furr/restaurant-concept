import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Georgia, "Times New Roman", serif',
          position: 'relative',
        }}
      >
        {/* Corner accents */}
        <div
          style={{
            position: 'absolute',
            top: 48,
            left: 48,
            width: 40,
            height: 40,
            borderTop: '1px solid #c9a96e',
            borderLeft: '1px solid #c9a96e',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 48,
            right: 48,
            width: 40,
            height: 40,
            borderTop: '1px solid #c9a96e',
            borderRight: '1px solid #c9a96e',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            left: 48,
            width: 40,
            height: 40,
            borderBottom: '1px solid #c9a96e',
            borderLeft: '1px solid #c9a96e',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            right: 48,
            width: 40,
            height: 40,
            borderBottom: '1px solid #c9a96e',
            borderRight: '1px solid #c9a96e',
          }}
        />

        {/* Eyebrow */}
        <p
          style={{
            fontSize: 16,
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            color: '#c9a96e',
            margin: 0,
            marginBottom: 32,
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}
        >
          Fine Dining · Est. 2018
        </p>

        {/* Restaurant name */}
        <h1
          style={{
            fontSize: 96,
            fontWeight: 400,
            letterSpacing: '0.05em',
            color: '#f5f0e8',
            margin: 0,
            lineHeight: 1,
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}
        >
          The Grand Table
        </h1>

        {/* Gold rule */}
        <div
          style={{
            width: 80,
            height: 1,
            background: '#c9a96e',
            margin: '36px 0',
          }}
        />

        {/* Tagline */}
        <p
          style={{
            fontSize: 22,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(245, 240, 232, 0.55)',
            margin: 0,
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}
        >
          Reserve Your Table — Fine Dining Concept
        </p>

        {/* Built by */}
        <p
          style={{
            position: 'absolute',
            bottom: 56,
            fontSize: 14,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(201, 169, 110, 0.6)',
            margin: 0,
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}
        >
          Built by Nick Furr
        </p>
      </div>
    ),
    { ...size }
  )
}
