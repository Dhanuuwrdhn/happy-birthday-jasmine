import type { Metadata } from 'next'
import { Cormorant_Garamond, Caveat } from 'next/font/google'
import './globals.css'

// Two families only: one printed, one handwritten — the way a letter set works.
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-serif',
})
const caveat = Caveat({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-hand' })

export const metadata: Metadata = {
  title: 'For Jasmine',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${caveat.variable}`}>{children}</body>
    </html>
  )
}
