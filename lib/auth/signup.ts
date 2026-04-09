import { logActivity } from '@/lib/data/logs'
import { UserRole } from '@/lib/types'

export async function signUp(
  email: string,
  password: string,
  name: string,
  role: UserRole = 'buyer'
) {
  try {
    const { supabase } = await import('@/lib/supabase/client')

    console.log('[Signup] Starting signup for:', email)

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      console.error('[Signup] Auth error:', authError)
      throw new Error(`Auth failed: ${authError.message}`)
    }

    const userId = authData.user?.id
    if (!userId) {
      throw new Error('No user ID returned from signup')
    }

    console.log('[Signup] Auth user created:', userId)

    // Create profile record
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        name,
        email,
        role,
        is_member: true,
        member_since: new Date().toISOString(),
      })
      .select()

    if (profileError) {
      console.error('[Signup] Profile error:', profileError)
      throw new Error(`Profile creation failed: ${profileError.message}`)
    }

    console.log('[Signup] Profile created successfully')

    // Log signup
    await logActivity(userId, 'user_signup', 'profile', userId, { role })

    return { userId, email }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Signup failed'
    console.error('[Signup] Final error:', message)
    throw new Error(message)
  }
}

export async function updateUserProfile(
  userId: string,
  updates: {
    name?: string
    avatar_url?: string
    role?: UserRole
  }
) {
  try {
    const { supabase } = await import('@/lib/supabase/client')
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)

    if (error) throw error

    await logActivity(userId, 'user_update_profile', 'profile', userId, updates)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Update failed'
    throw new Error(message)
  }
}

export async function changeUserRole(userId: string, newRole: UserRole) {
  try {
    const { supabase } = await import('@/lib/supabase/client')
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)

    if (error) throw error

    await logActivity(userId, 'user_update_profile', 'profile', userId, { role: newRole })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Role change failed'
    throw new Error(message)
  }
}
