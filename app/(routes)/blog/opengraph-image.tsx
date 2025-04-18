import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'DMV.gg - Blog'
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
        <div style={{ fontSize: 60, marginTop: 40 }}>Blog</div>
        <div style={{ fontSize: 32, marginTop: 20, opacity: 0.8 }}>Tips and guides for passing your DMV test</div>
      </div>
    ),
    {
      ...size,
    }
  )
} 