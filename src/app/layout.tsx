import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mise en Place — Meal Planner',
  description: 'Plan meals, build grocery lists, track your pantry and leftovers.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, height: '100%' }}>{children}</body>
    </html>
  )
}
