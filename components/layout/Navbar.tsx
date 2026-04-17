'use client'

import { useAuth } from '@/lib/auth/context'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, LogOut, LayoutDashboard } from 'lucide-react'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setUserMenuOpen(true)
  }

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setUserMenuOpen(false), 150)
  }

  const handleSignOut = async () => {
    setUserMenuOpen(false)
    await signOut()
    router.push('/')
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-black shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/images/logos/secondheat-logo.png"
              alt="SecondHeat"
              width={50}
              height={50}
              className="h-12 w-auto group-hover:opacity-80 transition-opacity"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/how-it-works"
              className="text-sm font-medium text-white/80 hover:text-white transition"
            >
              Slik fungerer det
            </Link>

            {user && (
              <>
                <Link
                  href="/shop"
                  className="text-sm font-medium text-white/80 hover:text-white transition"
                >
                  Butikk
                </Link>
                <Link
                  href="/sell"
                  className="text-sm font-medium text-white/80 hover:text-white transition"
                >
                  Selg
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="text-sm font-medium text-white/80 hover:text-white transition"
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Auth Links */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                {/* User dropdown */}
                <div
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition select-none">
                    {user.name}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      <div className="px-4 py-2.5 border-b border-gray-100">
                        <p className="text-xs text-gray-400 font-medium">Innlogget som</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/dashboard/buyer"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-heat-orange-600 transition-colors"
                      >
                        <LayoutDashboard size={15} />
                        Oversikt
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} />
                        Logg ut
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-white/80 hover:text-white"
                >
                  Logg inn
                </Link>
                <Link
                  href="/join"
                  className="inline-block bg-heat-orange-500 hover:bg-heat-orange-600 text-white px-4 py-2 rounded text-sm font-medium transition"
                >
                  Bli medlem
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-6 space-y-4 border-t border-gray-800 pt-4">
            <Link
              href="/how-it-works"
              className="block text-sm font-medium text-white/80 hover:text-white px-2"
            >
              Slik fungerer det
            </Link>
            {user && (
              <>
                <Link
                  href="/shop"
                  className="block text-sm font-medium text-white/80 hover:text-white px-2"
                >
                  Butikk
                </Link>
                <Link
                  href="/sell"
                  className="block text-sm font-medium text-white/80 hover:text-white px-2"
                >
                  Selg
                </Link>
                <Link
                  href="/dashboard/buyer"
                  className="block text-sm font-medium text-white/80 hover:text-white px-2"
                >
                  Oversikt
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block text-sm font-medium text-red-400 hover:text-red-300 px-2 text-left"
                >
                  Logg ut
                </button>
              </>
            )}
            {!user && (
              <>
                <Link
                  href="/login"
                  className="block text-sm font-medium text-white/80 hover:text-white px-2"
                >
                  Logg inn
                </Link>
                <Link
                  href="/join"
                  className="block bg-heat-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium text-center"
                >
                  Bli medlem
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
