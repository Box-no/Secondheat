'use client'

import { Button } from '@/components/ui/button'
import { FormEvent, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/auth/signup'
import { useAuth } from '@/lib/auth/context'
import { validateDiscountCode } from '@/lib/data/discounts'
import Link from 'next/link'
import { Tag, CheckCircle2, XCircle } from 'lucide-react'

export default function JoinPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [discountInput, setDiscountInput] = useState('')
  const [discountLoading, setDiscountLoading] = useState(false)
  const [discountApplied, setDiscountApplied] = useState(false)
  const [discountError, setDiscountError] = useState<string | null>(null)
  const [membershipPrice, setMembershipPrice] = useState(99)

  // As soon as auth context confirms the user is loaded, navigate home
  useEffect(() => {
    if (submitted && user) {
      router.push('/')
    }
  }, [submitted, user, router])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  async function handleApplyDiscount() {
    if (!discountInput.trim()) return
    setDiscountLoading(true)
    setDiscountError(null)
    setDiscountApplied(false)

    const result = await validateDiscountCode(discountInput, 'membership', 99)
    if (result) {
      setMembershipPrice(result.finalPrice)
      setDiscountApplied(true)
    } else {
      setDiscountError('Ugyldig eller utløpt rabattkode.')
    }
    setDiscountLoading(false)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!termsAccepted) {
      setError('Du må godta kjøps- og salgsvilkårene for å fortsette.')
      return
    }
    if (!formData.name.trim()) {
      setError('Vennligst oppgi ditt navn.')
      return
    }
    if (formData.password.length < 6) {
      setError('Passordet må være minst 6 tegn.')
      return
    }

    setLoading(true)

    try {
      await signUp(formData.email, formData.password, formData.name, 'both')
      setSubmitted(true)
      // useEffect above will redirect as soon as auth context confirms user is loaded.
      // Fallback: redirect after 5s in case the profile takes unusually long.
      setTimeout(() => router.push('/'), 5000)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registrering mislyktes'
      setError(message)
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-heat-orange-50 via-heat-red-50 to-heat-purple-50">
        <div className="text-center max-w-md">
          <div className="text-7xl mb-6">💃</div>
          <h1 className="text-5xl font-serif font-bold text-gray-900 mb-3">Du er med!</h1>
          <p className="text-lg text-gray-700 mb-2">Velkommen til SecondHeat-fellesskapet</p>
          <p className="text-gray-600">Tar deg til forsiden…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">
            Bli med i fellesskapet
          </h1>
          <p className="text-gray-700 text-lg mb-1">
            Kjøp, selg og knytt kontakt med dansere som deg
          </p>
          <p className="text-heat-orange-600 font-semibold text-sm">
            {membershipPrice === 0 ? 'Gratis med rabattkode 🎉' : `${membershipPrice} kr å bli medlem`}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900">
              Fullt navn
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heat-orange-500 focus:border-transparent outline-none transition"
              placeholder="Sofia Hansen"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              E-post
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
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
              value={formData.password}
              onChange={handleInputChange}
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heat-orange-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {/* Membership price summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Medlemskap</span>
              {discountApplied ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 line-through">99 kr</span>
                  <span className="text-sm font-bold text-heat-orange-600">{membershipPrice} kr</span>
                </div>
              ) : (
                <span className="text-sm font-bold text-gray-900">99 kr</span>
              )}
            </div>

            {/* Discount code input */}
            <div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={discountInput}
                    onChange={(e) => {
                      setDiscountInput(e.target.value.toUpperCase())
                      setDiscountError(null)
                    }}
                    placeholder="Rabattkode"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heat-orange-500 focus:border-transparent outline-none transition uppercase text-sm tracking-wide bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyDiscount}
                  disabled={discountLoading || !discountInput.trim() || discountApplied}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg disabled:opacity-40 transition"
                >
                  {discountLoading ? '...' : 'Bruk'}
                </button>
              </div>
              {discountApplied && (
                <div className="mt-2 flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <CheckCircle2 size={14} className="flex-shrink-0" />
                  <p className="text-xs font-medium">Rabattkode anvendt!</p>
                </div>
              )}
              {discountError && (
                <div className="mt-2 flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  <XCircle size={14} className="flex-shrink-0" />
                  <p className="text-xs">{discountError}</p>
                </div>
              )}
            </div>
          </div>

          {/* Terms acceptance */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-heat-orange-600 flex-shrink-0"
              />
              <span className="text-sm text-gray-700">
                Jeg har lest og godtar{' '}
                <Link
                  href="/terms"
                  target="_blank"
                  className="text-heat-orange-600 hover:underline font-semibold"
                >
                  kjøps- og salgsvilkårene
                </Link>{' '}
                til SecondHeat, inkludert regler for kjøp, salg, angrerett og plattformavgift.
              </span>
            </label>
          </div>

          <Button
            type="submit"
            disabled={loading || !termsAccepted}
            className="w-full bg-heat-orange-600 hover:bg-heat-orange-700 text-white py-3 disabled:opacity-50 text-base font-semibold"
          >
            {loading ? 'Oppretter konto...' : `Bli medlem – ${membershipPrice} kr`}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Allerede medlem?{' '}
          <Link href="/login" className="text-heat-orange-600 hover:text-heat-orange-700 font-medium">
            Logg inn
          </Link>
        </div>
      </div>
    </div>
  )
}
