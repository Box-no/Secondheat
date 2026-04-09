import { Order } from '@/lib/types'
import { mockOrders } from '@/lib/mock/orders'

function mapOrder(row: any): Order {
  return {
    id: row.id,
    productId: row.product_id,
    buyerId: row.buyer_id,
    sellerId: row.seller_id,
    amount: row.amount,
    status: row.status,
    shippingLabelUrl: row.shipping_label_url || undefined,
    createdAt: new Date(row.created_at),
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

export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = await getClient()
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (error) throw error
      return data ? mapOrder(data) : null
    } catch (error) {
      console.error('Supabase getOrderById error:', error)
    }
  }
  return mockOrders.find((o) => o.id === id) || null
}

export async function getOrdersBySeller(sellerId: string): Promise<Order[]> {
  const supabase = await getClient()
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data || []).map(mapOrder)
    } catch (error) {
      console.error('Supabase getOrdersBySeller error:', error)
    }
  }
  return mockOrders.filter((o) => o.sellerId === sellerId)
}

export async function getOrdersByBuyer(buyerId: string): Promise<Order[]> {
  const supabase = await getClient()
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('buyer_id', buyerId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data || []).map(mapOrder)
    } catch (error) {
      console.error('Supabase getOrdersByBuyer error:', error)
    }
  }
  return mockOrders.filter((o) => o.buyerId === buyerId)
}

export async function getAllOrders(): Promise<Order[]> {
  const supabase = await getClient()
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data || []).map(mapOrder)
    } catch (error) {
      console.error('Supabase getAllOrders error:', error)
    }
  }
  return mockOrders
}
