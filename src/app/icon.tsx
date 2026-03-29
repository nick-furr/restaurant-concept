import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}
      >
        <span
          style={{
            fontSize: 20,
            color: '#c9a96e',
            fontWeight: 400,
            lineHeight: 1,
          }}
        >
          G
        </span>
      </div>
    ),
    { ...size }
  )
}
