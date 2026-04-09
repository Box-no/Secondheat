'use client'

import { useAuth } from '@/lib/auth/context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getAllOrders } from '@/lib/data/orders'
import { triggerShippingLabel } from '@/lib/data/admin'
import { Order } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Download, ExternalLink } from 'lucide-react'

const statusLabels: Record<string, string> = {
  paid: 'Betalt',
  label_sent: 'Etikett sendt',
  shipped: 'Under frakt',
  delivered: 'Levert',
}

const statusColors: Record<string, string> = {
  paid: 'bg-blue-100 text-blue-800',
  label_sent: 'bg-amber-100 text-amber-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
}

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const [loadingLabels, setLoadingLabels] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (authLoading) return
    if (user?.role !== 'admin') {
      router.push('/')
      return
    }

    async function loadOrders() {
      const list = await getAllOrders()
      setOrders(list)
      setPageLoading(false)
    }

    loadOrders()
  }, [user, authLoading, router])

  async function handleGenerateLabel(orderId: string) {
    setLoadingLabels((prev) => new Set([...prev, orderId]))
    const labelUrl = await triggerShippingLabel(orderId)
    console.log('Fraktlabel generert:', labelUrl)
    setLoadingLabels((prev) => {
      const next = new Set(prev)
      next.delete(orderId)
      return next
    })
    alert('Fraktlabel generert (mock). Vil bli lagret på bestillingen ved live integrasjon.')
  }

  if (authLoading || pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Laster bestillinger…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900">Bestillinger</h1>
          <span className="text-sm text-gray-500">{orders.length} totalt</span>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-500 text-lg">Ingen bestillinger ennå</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Bestillings-ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Beløp
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Dato
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Handling
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 font-mono">
                      {order.id.slice(0, 8)}…
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {order.amount.toLocaleString('nb-NO')} kr
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] ?? 'bg-gray-100 text-gray-700'}`}
                      >
                        {statusLabels[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.createdAt instanceof Date && !isNaN(order.createdAt.getTime())
                        ? order.createdAt.toLocaleDateString('nb-NO')
                        : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {order.status === 'paid' && (
                        <Button
                          onClick={() => handleGenerateLabel(order.id)}
                          disabled={loadingLabels.has(order.id)}
                          className="bg-heat-orange-600 hover:bg-heat-orange-700 text-white disabled:bg-gray-300 flex items-center gap-2"
                          size="sm"
                        >
                          <Download size={14} />
                          {loadingLabels.has(order.id) ? 'Genererer…' : 'Generer label'}
                        </Button>
                      )}
                      {order.shippingLabelUrl && (
                        <a
                          href={order.shippingLabelUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-heat-orange-600 hover:text-heat-orange-700 underline text-sm"
                        >
                          <ExternalLink size={13} />
                          Vis label
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
