'use client'

import { Product } from '@/lib/types'
import { ProductCard } from './ProductCard'
import { useEffect, useState } from 'react'
import { getSellers } from '@/lib/data/sellers'

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const [sellerMap, setSellerMap] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadSellers() {
      const sellers = await getSellers()
      const map: Record<string, string> = {}
      sellers.forEach((seller) => {
        map[seller.id] = seller.name
      })
      setSellerMap(map)
    }
    loadSellers()
  }, [])

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          sellerName={sellerMap[product.sellerId]}
        />
      ))}
    </div>
  )
}
