'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, UserRole, AuthContextType } from '@/lib/types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMember, setIsMember] = useState(false)

  useEffect(() => {
    let mounted = true

    const fetchProfile = async (supabase: any, userId: string) => {
      for (let attempt = 0; attempt < 5; attempt++) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle()
        if (data) return data
        if (attempt < 4) await new Promise((r) => setTimeout(r, 800))
      }
      return null
    }

    const buildUser = (profile: any, email: string): User => ({
      id: profile.id,
      name: profile.name || '',
      email: profile.email || email,
      role: profile.role as UserRole,
      isMember: profile.is_member,
      memberSince: profile.member_since ? new Date(profile.member_since) : undefined,
      avatar: profile.avatar_url || undefined,
    })

    const initAuth = async () => {
      try {
        const { supabase } = await import('@/lib/supabase/client')
        const { data: { session } } = await supabase.auth.getSession()

        if (mounted && session?.user) {
          const profile = await fetchProfile(supabase, session.user.id)
          if (profile && mounted) {
            const userData = buildUser(profile, session.user.email || '')
            setUser(userData)
            setIsMember(profile.is_member)
          }
        }
      } catch (err) {
        console.error('[Auth] Init error:', err)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    initAuth()

    let subscription: any = null

    const setupAuthListener = async () => {
      try {
        const { supabase } = await import('@/lib/supabase/client')

        const { data } = supabase.auth.onAuthStateChange(
          async (event: string, session: any) => {
            if (session?.user && mounted) {
              try {
                const profile = await fetchProfile(supabase, session.user.id)
                if (profile && mounted) {
                  setUser(buildUser(profile, session.user.email || ''))
                  setIsMember(profile.is_member)
                }
              } catch (err) {
                console.error('[Auth] Error loading profile:', err)
              }
            } else if (!session?.user && mounted) {
              setUser(null)
              setIsMember(false)
            }
          }
        )

        subscription = data.subscription
      } catch (err) {
        console.error('[Auth] Error setting up listener:', err)
      }
    }

    setupAuthListener()

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { supabase } = await import('@/lib/supabase/client')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signOut = async () => {
    const { supabase } = await import('@/lib/supabase/client')
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setIsMember(false)
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isMember,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
