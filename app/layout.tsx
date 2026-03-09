import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Instart - Where India\'s Startups Meet Their Investors',
  description: 'The premium platform connecting ambitious Indian founders with visionary investors. AI-powered matching, secure deal rooms, and real-time insights.',
  generator: 'v0.app',
  keywords: ['startup', 'investors', 'India', 'funding', 'venture capital', 'seed funding', 'angel investors'],
  authors: [{ name: 'Instart' }],
  openGraph: {
    title: 'Instart - Where India\'s Startups Meet Their Investors',
    description: 'The premium platform connecting ambitious Indian founders with visionary investors.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
