import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Caveat } from 'next/font/google'
import './globals.css'

// Two families only: one printed, one handwritten — the way a letter set works.
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-serif',
})
const caveat = Caveat({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-hand' })

const title = 'For Jasmine'
const description = 'A letter that only opens on 27 September 2026.'

// What WhatsApp and the rest show when the link is shared: the sealed envelope,
// the date, and nothing that gives away what is inside.
export const metadata: Metadata = {
  metadataBase: new URL('https://jasmine.syahrialdanu.my.id'),
  title,
  description,
  openGraph: {
    title,
    description,
    url: '/',
    siteName: title,
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'A sealed envelope dated 27 September 2026' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og.png'],
  },
}

// themeColor belongs in the viewport export since Next 14, not in metadata.
export const viewport: Viewport = {
  themeColor: '#ddc2bd',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${caveat.variable}`}>{children}</body>
    </html>
  )
}
