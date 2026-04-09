'use client'

import { useAuth } from '@/lib/auth/context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getProductsBySeller } from '@/lib/data/products'
import { getOrdersBySeller } from '@/lib/data/orders'
import Link from 'next/link'
import { Product, Order } from '@/lib/types'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Note: This is already 'use client' from the first line
export default function SellerDashboardPage() {
  const { user, isMember, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!isMember) {
      router.push('/join')
      return
    }

    async function loadData() {
      if (user) {
        const sellerProducts = await getProductsBySeller(user.id)
        const sellerOrders = await getOrdersBySeller(user.id)
        setProducts(sellerProducts)
        setOrders(sellerOrders)
      }
      setIsLoading(false)
    }

    loadData()
  }, [user, isMember, authLoading, router])

  const stats = {
    active: products.filter((p) => p.status === 'approved').length,
    pending: products.filter((p) => p.status === 'pending').length,
    sold: products.filter((p) => p.status === 'sold').length,
    revenue: orders
      .filter((o) => o.status !== 'paid')
      .reduce((sum, o) => sum + o.amount, 0),
  }

  const statusColors: Record<string, string> = {
    approved: 'bg-green-100 text-green-800',
    pending: 'bg-amber-100 text-amber-800',
    sold: 'bg-gray-100 text-gray-800',
    rejected: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-gray-900">
            Selger-oversikt
          </h1>
          <Link href="/sell">
            <Button className="bg-heat-orange-600 hover:bg-heat-orange-700 text-white flex items-center gap-2">
              <Plus size={20} />
              Legg ut vare
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <p className="text-gray-600">Laster oversikten din...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-lg p-6">
                <p className="text-gray-600 text-sm font-medium">Aktive annonser</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.active}</p>
              </div>
              <div className="bg-white rounded-lg p-6">
                <p className="text-gray-600 text-sm font-medium">Venter på godkjenning</p>
                <p className="text-3xl font-bold text-heat-orange-600 mt-2">{stats.pending}</p>
              </div>
              <div className="bg-white rounded-lg p-6">
                <p className="text-gray-600 text-sm font-medium">Solgte varer</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.sold}</p>
              </div>
              <div className="bg-white rounded-lg p-6">
                <p className="text-gray-600 text-sm font-medium">Ventende utbetaling</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.revenue} kr</p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Mine annonser</h2>
              {products.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center">
                  <p className="text-gray-600 mb-4">Du har ikke lagt ut noe ennå</p>
                  <Link
                    href="/sell"
                    className="inline-block bg-heat-orange-600 hover:bg-heat-orange-700 text-white px-6 py-2 rounded transition"
                  >
                    Legg ut din første vare
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="border-b border-gray-200 bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Vare</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Pris</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.title}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{product.price} kr</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[product.status]}`}>
                              {product.status === 'approved'
                                ? 'Aktiv'
                                : product.status === 'pending'
                                  ? 'Venter'
                                  : product.status === 'sold'
                                    ? 'Solgt'
                                    : 'Avvist'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {orders.length > 0 && (
              <div>
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Nylige salg</h2>
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-lg p-6 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-bold text-gray-900">Ordre {order.id}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {order.createdAt.toLocaleDateString('nb-NO')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-heat-orange-600">{order.amount} kr</p>
                        <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {order.status === 'paid'
                            ? 'Betalt'
                            : order.status === 'label_sent'
                              ? 'Etikett sendt'
                              : 'Sendt'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
