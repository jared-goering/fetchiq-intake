import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FetchIQ',
  description: 'Opportunity mapping and business intelligence platform',
  generator: 'FetchIQ',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
