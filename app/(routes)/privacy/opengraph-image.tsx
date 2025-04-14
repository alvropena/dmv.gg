import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'DMV.gg - Privacy Policy'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#2852E2',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '40px',
          fontFamily: 'Arial Rounded MT Bold, Arial Rounded, Arial, sans-serif',
        }}
      >
        <div style={{ fontSize: 128, fontWeight: 'bold' }}>DMV.gg</div>
        <div style={{ fontSize: 60, marginTop: 40 }}>Privacy Policy</div>
        <div style={{ fontSize: 32, marginTop: 20, opacity: 0.8 }}>How we handle and protect your data</div>
      </div>
    ),
    { ...size }
  )
} 