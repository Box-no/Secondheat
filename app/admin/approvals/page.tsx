'use client'

import { useAuth } from '@/lib/auth/context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getPendingProducts, approveProduct, rejectProduct } from '@/lib/data/products'
import { getSellerById } from '@/lib/data/sellers'
import { Product, Seller } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'
import Image from 'next/image'

const conditionLabels: Record<string, string> = {
  new: 'Ny',
  like_new: 'Som ny',
  good: 'God',
  fair: 'Grei',
}

interface PendingProductWithSeller extends Product {
  seller?: Seller | null
}

export default function ApprovalsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<PendingProductWithSeller[]>([])
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (user?.role !== 'admin') {
      router.push('/')
      return
    }

    async function loadPending() {
      const pending = await getPendingProducts()
      const withSellers = await Promise.all(
        pending.map(async (p) => ({
          ...p,
          seller: await getSellerById(p.sellerId),
        }))
      )
      setProducts(withSellers)
      setPageLoading(false)
    }

    loadPending()
  }, [user, authLoading, router])

  async function handleApprove(id: string) {
    await approveProduct(id, user?.id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  async function handleReject(id: string) {
    await rejectProduct(id, user?.id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  if (authLoading || pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Laster produkter til godkjenning…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">
          Produktgodkjenning
        </h1>

        {products.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-500 text-lg">Ingen produkter venter på godkjenning</p>
          </div>
        ) : (
          <div className="space-y-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-48 h-48 relative bg-gray-100 flex-shrink-0">
                    {product.images[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {product.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-gray-500">Pris</p>
                          <p className="font-bold text-gray-900">{product.price} kr</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Størrelse</p>
                          <p className="font-bold text-gray-900">{product.size}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Stand</p>
                          <p className="font-bold text-gray-900">
                            {conditionLabels[product.condition] ?? product.condition}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Selger</p>
                          <p className="font-bold text-gray-900">
                            {product.seller?.name ?? '—'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleApprove(product.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                      >
                        <Check size={18} />
                        Godkjenn
                      </Button>
                      <Button
                        onClick={() => handleReject(product.id)}
                        variant="outline"
                        className="flex-1 border-red-300 text-red-600 hover:bg-red-50 flex items-center justify-center gap-2"
                      >
                        <X size={18} />
                        Avvis
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
