import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'DMV.gg Blog Post'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image({ params }: { params: { slug: string } }) {
  // Format the slug for display (convert-slug-to-title)
  const title = params.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(to bottom right, #3b82f6, #1e3a8a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '60px',
        }}
      >
        <div style={{ 
          fontSize: 40, 
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 60
        }}>DMV.gg Blog</div>
        <div style={{ 
          fontSize: 70, 
          fontWeight: 'bold',
          textAlign: 'center',
          maxWidth: '100%',
          lineHeight: 1.2
        }}>{title}</div>
      </div>
    ),
    {
      ...size,
    }
  )
} 