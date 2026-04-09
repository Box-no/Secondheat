export type UserRole = 'buyer' | 'seller' | 'both' | 'admin'

export type DiscountType = 'percentage' | 'fixed'

export interface DiscountCode {
  id: string
  code: string
  type: DiscountType
  value: number
  description: string
  appliesTo: 'membership' | 'purchase' | 'both'
  maxUses: number
  usedCount: number
  expiresAt?: Date
  isActive: boolean
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  isMember: boolean
  memberSince?: Date
  avatar?: string
}

export interface Product {
  id: string
  sellerId: string
  title: string
  description: string
  price: number
  size: string
  category: 'top' | 'bottom' | 'dress' | 'shoes' | 'accessories'
  condition: 'new' | 'like_new' | 'good' | 'fair'
  images: string[]
  status: 'pending' | 'approved' | 'rejected' | 'sold'
  createdAt: Date
}

export interface Seller {
  id: string
  name: string
  email: string
  phone?: string
  memberSince: Date
  avatar?: string
  listingCount: number
}

export interface Order {
  id: string
  productId: string
  buyerId: string
  sellerId: string
  amount: number
  status: 'paid' | 'label_sent' | 'shipped' | 'delivered'
  shippingLabelUrl?: string
  createdAt: Date
}

export interface Message {
  id: string
  orderId: string
  senderId: string
  senderName: string
  content: string
  createdAt: Date
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isMember: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}
