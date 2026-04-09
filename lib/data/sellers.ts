import { Seller } from '@/lib/types'
import { mockSellers } from '@/lib/mock/sellers'

function mapSeller(row: any): Seller {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || undefined,
    avatar: row.avatar_url || undefined,
    memberSince: new Date(row.member_since || row.created_at),
    listingCount: row.listing_count || 0,
  }
}

async function getClient() {
  try {
    const { supabase } = await import('@/lib/supabase/client')
    return supabase
  } catch {
    return null
  }
}

export async function getSellers(): Promise<Seller[]> {
  const supabase = await getClient()
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_member', true)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data || []).map(mapSeller)
    } catch (error) {
      console.error('Supabase getSellers error:', error)
    }
  }
  return mockSellers
}

export async function getSellerById(id: string): Promise<Seller | null> {
  const supabase = await getClient()
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (error) throw error
      return data ? mapSeller(data) : null
    } catch (error) {
      console.error('Supabase getSellerById error:', error)
    }
  }
  return mockSellers.find((s) => s.id === id) || null
}
