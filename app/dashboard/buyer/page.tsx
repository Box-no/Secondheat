'use client'

import { useAuth } from '@/lib/auth/context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getOrdersByBuyer } from '@/lib/data/orders'
import { getProductById } from '@/lib/data/products'
import Link from 'next/link'
import { Order, Product } from '@/lib/types'
import { MessageCircle } from 'lucide-react'

interface OrderWithProduct extends Order {
  product?: Product | null
}

export default function BuyerDashboardPage() {
  const { user, isMember, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<OrderWithProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!isMember) {
      router.push('/join')
      return
    }

    async function loadOrders() {
      if (user) {
        const buyerOrders = await getOrdersByBuyer(user.id)
        const ordersWithProducts = await Promise.all(
          buyerOrders.map(async (order) => ({
            ...order,
            product: await getProductById(order.productId),
          }))
        )
        setOrders(ordersWithProducts)
      }
      setIsLoading(false)
    }

    loadOrders()
  }, [user, isMember, authLoading, router])

  const statusColors: Record<string, string> = {
    paid: 'bg-blue-100 text-blue-800',
    label_sent: 'bg-amber-100 text-amber-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">
          Mine kjøp
        </h1>

        {isLoading ? (
          <p className="text-gray-600">Laster dine ordre...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600 text-lg mb-4">Du har ikke gjort noen kjøp ennå</p>
            <Link
              href="/shop"
              className="inline-block bg-heat-orange-600 hover:bg-heat-orange-700 text-white px-6 py-2 rounded transition"
            >
              Begynn å handle
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg p-6 flex items-center justify-between"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">
                    {order.product?.title || 'Produkt'}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Ordre {order.id} • {order.createdAt.toLocaleDateString('nb-NO')}
                  </p>
                  <span
                    className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}
                  >
                    {order.status === 'paid'
                      ? 'Betaling mottatt'
                      : order.status === 'label_sent'
                        ? 'Etikett sendt'
                        : order.status === 'shipped'
                          ? 'Under frakt'
                          : 'Levert'}
                  </span>
                </div>

                <div className="text-right space-y-3">
                  <p className="font-bold text-heat-orange-600 text-lg">
                    {order.amount} kr
                  </p>
                  <Link
                    href={`/messages/${order.id}`}
                    className="inline-flex items-center gap-2 bg-heat-orange-100 hover:bg-heat-orange-200 text-heat-orange-700 px-4 py-2 rounded transition"
                  >
                    <MessageCircle size={16} />
                    Melding
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
