export interface AdminStats {
  pendingApprovals: number
  activeListings: number
  totalMembers: number
  ordersThisMonth: number
}

async function getClient() {
  try {
    const { supabase } = await import('@/lib/supabase/client')
    return supabase
  } catch {
    return null
  }
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await getClient()

  if (supabase) {
    try {
      const now = new Date()
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

      const [pending, active, members, ordersMonth] = await Promise.all([
        supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending'),
        supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved'),
        supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('is_member', true),
        supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', firstOfMonth),
      ])

      return {
        pendingApprovals: pending.count ?? 0,
        activeListings: active.count ?? 0,
        totalMembers: members.count ?? 0,
        ordersThisMonth: ordersMonth.count ?? 0,
      }
    } catch (error) {
      console.error('Supabase getAdminStats error:', error)
    }
  }

  const { mockProducts } = await import('@/lib/mock/products')
  const { mockOrders } = await import('@/lib/mock/orders')
  const { mockSellers } = await import('@/lib/mock/sellers')

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  return {
    pendingApprovals: mockProducts.filter((p) => p.status === 'pending').length,
    activeListings: mockProducts.filter((p) => p.status === 'approved').length,
    totalMembers: mockSellers.length,
    ordersThisMonth: mockOrders.filter((o) => {
      return (
        o.createdAt.getMonth() === currentMonth &&
        o.createdAt.getFullYear() === currentYear
      )
    }).length,
  }
}

export async function triggerShippingLabel(orderId: string): Promise<string> {
  // TODO: Replace with Bring/PostNord API call
  console.log('Mock: Generating shipping label for order', orderId)
  return `https://example.com/labels/${orderId}.pdf`
}
