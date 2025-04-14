import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'DMV.gg - Cookie Policy'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #3b82f6, #1e3a8a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: 128, fontWeight: 'bold' }}>DMV.gg</div>
        <div style={{ fontSize: 60, marginTop: 40 }}>Cookie Policy</div>
        <div style={{ fontSize: 32, marginTop: 20, opacity: 0.8 }}>Information about how we use cookies</div>
      </div>
    ),
    { ...size }
  )
} 