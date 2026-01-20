import type { Metadata } from 'next'
import Layout from '@/components/dom/Layout'
import './globals.css'

export const metadata: Metadata = {
  title: 'CyberShift | Avant-Garde Fashion',
  description: 'High-performance 3D fashion experience.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Oswald:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
