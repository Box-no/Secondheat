import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth/context'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'SecondHeat — Second-Hand Dance Clothes',
  description: 'Buy and sell quality second-hand dance wear from the community.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
