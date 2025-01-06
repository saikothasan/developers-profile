import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Developer Profile',
  description: 'Created with by saikothasan',
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
