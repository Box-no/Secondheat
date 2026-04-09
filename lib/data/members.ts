import { User } from '@/lib/types'

// Mock members store (in real implementation, would be Supabase)
const mockMembers: Map<string, User> = new Map()

export async function getMemberById(id: string): Promise<User | null> {
  // TODO: Replace with Supabase query
  // const { data } = await supabase.from('profiles').select('*').eq('id', id).single()
  return mockMembers.get(id) || null
}

export async function checkMembership(userId: string): Promise<boolean> {
  // TODO: Replace with Supabase query
  // const { data } = await supabase.from('profiles').select('is_member').eq('id', userId).single()
  const member = mockMembers.get(userId)
  return member?.isMember ?? false
}

export async function createMember(user: User): Promise<User> {
  // TODO: Replace with Supabase mutation
  mockMembers.set(user.id, user)
  return user
}
