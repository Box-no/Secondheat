'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FormEvent, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'

export default function LoginPage() {
  const router = useRouter()
  const { signIn, user, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    }
  }, [user, isLoading, router])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await signIn(email, password)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Innlogging mislyktes'
      setError(message)
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Velkommen tilbake</h1>
          <p className="text-gray-600">Logg inn på din SecondHeat-konto</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              E-post
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heat-orange-500 focus:border-transparent outline-none transition"
              placeholder="deg@eksempel.no"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
              Passord
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heat-orange-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting || isLoading}
            className="w-full bg-heat-orange-600 hover:bg-heat-orange-700 text-white py-3 disabled:opacity-50"
          >
            {submitting || isLoading ? 'Logger inn...' : 'Logg inn'}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-gray-600">
            Ikke medlem ennå?{' '}
            <Link href="/join" className="text-heat-orange-600 font-medium hover:text-heat-orange-700">
              Bli medlem her
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
