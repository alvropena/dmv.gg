import { type Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { GeistSans, GeistMono } from 'geist/font'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import './globals.css'

const geistSans = GeistSans
const geistMono = GeistMono

export const metadata: Metadata = {
  title: 'DMV.gg - Knowledge Test',
  description: 'A simple quiz to help you prepare for the DMV knowledge test.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="flex-1 py-16 px-4 md:px-6">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
