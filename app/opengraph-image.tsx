import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'DMV.gg - Ace Your DMV Test'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
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
        <div style={{ fontSize: 60, marginTop: 40 }}>Ace Your DMV Test</div>
      </div>
    ),
    {
      ...size,
    }
  )
} 