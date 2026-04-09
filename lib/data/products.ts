import { Product } from '@/lib/types'
import { mockProducts } from '@/lib/mock/products'
import { logActivity } from '@/lib/data/logs'

function mapProduct(row: any): Product {
  return {
    id: row.id,
    sellerId: row.seller_id,
    title: row.title,
    description: row.description,
    price: row.price,
    size: row.size,
    category: row.category,
    condition: row.condition,
    images: row.images || [],
    status: row.status,
    createdAt: new Date(row.created_at),
  }
}

function dbErr(label: string, error: any) {
  const msg = error?.message ?? error?.details ?? JSON.stringify(error)
  console.error(`[products] ${label}:`, msg, error?.hint ? `(hint: ${error.hint})` : '')
}

async function getClient() {
  try {
    const { supabase } = await import('@/lib/supabase/client')
    return supabase
  } catch {
    return null
  }
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await getClient()
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data || []).map(mapProduct)
    } catch (error) {
      dbErr('getProducts', error)
    }
  }
  return mockProducts.filter((p) => p.status === 'approved')
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await getClient()
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (error) throw error
      return data ? mapProduct(data) : null
    } catch (error) {
      dbErr('getProductById', error)
    }
  }
  return mockProducts.find((p) => p.id === id) || null
}

export async function getProductsBySeller(sellerId: string): Promise<Product[]> {
  const supabase = await getClient()
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data || []).map(mapProduct)
    } catch (error) {
      dbErr('getProductsBySeller', error)
    }
  }
  return mockProducts.filter((p) => p.sellerId === sellerId)
}

export async function getPendingProducts(): Promise<Product[]> {
  const supabase = await getClient()
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data || []).map(mapProduct)
    } catch (error) {
      dbErr('getPendingProducts', error)
    }
  }
  return mockProducts.filter((p) => p.status === 'pending')
}

export async function approveProduct(id: string, adminId?: string): Promise<void> {
  const supabase = await getClient()
  if (supabase) {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: 'approved' })
        .eq('id', id)
      if (error) throw error
      if (adminId) await logActivity(adminId, 'product_approved', 'products', id)
      return
    } catch (error) {
      dbErr('approveProduct', error)
    }
  }
  const product = mockProducts.find((p) => p.id === id)
  if (product) product.status = 'approved'
}

export async function rejectProduct(id: string, adminId?: string): Promise<void> {
  const supabase = await getClient()
  if (supabase) {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: 'rejected' })
        .eq('id', id)
      if (error) throw error
      if (adminId) await logActivity(adminId, 'product_rejected', 'products', id)
      return
    } catch (error) {
      dbErr('rejectProduct', error)
    }
  }
  const product = mockProducts.find((p) => p.id === id)
  if (product) product.status = 'rejected'
}

export async function createProduct(
  data: Omit<Product, 'id' | 'status' | 'createdAt'>
): Promise<Product> {
  const supabase = await getClient()
  if (supabase) {
    try {
      const { data: newProduct, error } = await supabase
        .from('products')
        .insert([{
          seller_id: data.sellerId,
          title: data.title,
          description: data.description,
          price: data.price,
          size: data.size,
          category: data.category,
          condition: data.condition,
          images: data.images,
          status: 'pending',
        }])
        .select()
        .single()
      if (error) throw error
      await logActivity(data.sellerId, 'product_created', 'products', newProduct.id, {
        title: data.title,
        price: data.price,
      })
      return mapProduct(newProduct)
    } catch (error) {
      dbErr('createProduct', error)
      throw error
    }
  }
  const newProduct: Product = {
    ...data,
    id: String(Date.now()),
    status: 'pending',
    createdAt: new Date(),
  }
  mockProducts.push(newProduct)
  return newProduct
}
