'use client'

import { Product } from '@/lib/types'
import Link from 'next/link'
import Image from 'next/image'

interface ProductCardProps {
  product: Product
  sellerName?: string
}

export function ProductCard({ product, sellerName }: ProductCardProps) {
  const conditionColors: Record<string, string> = {
    new: 'bg-green-100 text-green-800',
    like_new: 'bg-green-100 text-green-800',
    good: 'bg-blue-100 text-blue-800',
    fair: 'bg-amber-100 text-amber-800',
  }

  const sizeDisplay = {
    top: product.size,
    bottom: product.size,
    dress: product.size,
    competition_costume: product.size,
    shoes: product.size,
    accessories: 'One Size',
  }[product.category]

  return (
    <Link href={`/shop/${product.id}`}>
      <div className="group cursor-pointer h-full flex flex-col">
        <div className="relative overflow-hidden rounded-xl bg-gray-100 mb-4 aspect-square shadow-sm group-hover:shadow-xl transition-all duration-300">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-4 right-4">
            <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${conditionColors[product.condition]}`}>
              {product.condition === 'like_new' ? 'Som ny' : product.condition === 'new' ? 'Ny' : product.condition === 'good' ? 'God stand' : 'Brukbar stand'}
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <h3 className="font-serif font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-heat-orange-600 transition mb-3">
            {product.title}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
              Str. {sizeDisplay}
            </span>
          </div>

          {sellerName && (
            <p className="text-xs text-gray-500 mb-auto">fra {sellerName}</p>
          )}

          <div className="flex justify-between items-end mt-auto pt-4 border-t border-gray-100">
            <span className="text-2xl font-bold bg-gradient-to-r from-heat-orange-600 to-heat-red-600 bg-clip-text text-transparent">
              {product.price}
            </span>
            <span className="text-xs text-gray-500 font-medium">NOK</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
