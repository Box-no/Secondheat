'use client'

import { getProducts } from '@/lib/data/products'
import { ProductGrid } from '@/components/products/ProductGrid'
import { useAuth } from '@/lib/auth/context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Product } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { X, Sliders } from 'lucide-react'

export default function ShopPage() {
  const { isMember, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const [filters, setFilters] = useState({
    category: 'all',
    size: 'all',
    condition: 'all',
    minPrice: 0,
    maxPrice: 2000,
  })

  useEffect(() => {
    if (authLoading) return
    if (!isMember) {
      router.push('/join')
      return
    }

    async function loadProducts() {
      const allProducts = await getProducts()
      setProducts(allProducts)
      setIsLoading(false)
    }

    loadProducts()
  }, [isMember, authLoading, router])

  const categories = [
    { value: 'all', label: 'Alle kategorier' },
    { value: 'top', label: 'Topper' },
    { value: 'bottom', label: 'Bukser/Skjørt' },
    { value: 'dress', label: 'Kjoler' },
    { value: 'shoes', label: 'Sko' },
    { value: 'accessories', label: 'Tilbehør' },
  ]

  const sizes = ['all', 'XS', 'S', 'M', 'L', 'XL', '36', '37', '38', '39', '40']
  const conditions = [
    { value: 'all', label: 'Alle stander' },
    { value: 'new', label: 'Ny' },
    { value: 'like_new', label: 'Som ny' },
    { value: 'good', label: 'God stand' },
    { value: 'fair', label: 'Brukbar stand' },
  ]

  // Filter and search logic
  const filteredProducts = products
    .filter((p) => {
      // Filter by status (approved only)
      if (p.status !== 'approved') return false

      // Apply category filter
      if (filters.category !== 'all' && p.category !== filters.category) return false

      // Apply size filter
      if (filters.size !== 'all' && p.size !== filters.size) return false

      // Apply condition filter
      if (filters.condition !== 'all' && p.condition !== filters.condition) return false

      // Apply price filter
      if (p.price < filters.minPrice || p.price > filters.maxPrice) return false

      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        return (
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        )
      }

      return true
    })
    .sort((a, b) => {
      // Apply sorting
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime()
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime()
        default:
          return 0
      }
    })

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.size !== 'all' ||
    filters.condition !== 'all' ||
    filters.minPrice !== 0 ||
    filters.maxPrice !== 2000 ||
    searchQuery.trim() !== ''

  const clearFilters = () => {
    setFilters({
      category: 'all',
      size: 'all',
      condition: 'all',
      minPrice: 0,
      maxPrice: 2000,
    })
    setSearchQuery('')
    setSortBy('newest')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-heat-orange-200 border-t-heat-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Laster produkter...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-heat-orange-600 font-semibold text-sm uppercase tracking-wide mb-3">
            🔥 Bla og oppdag
          </p>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-3">
            Finn ditt neste favoritteplagg
          </h1>
          <p className="text-gray-700 text-lg">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'plagg' : 'plagg'} fra dansere som deg
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Søk etter navn, beskrivelse..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-heat-orange-500 focus:ring-2 focus:ring-heat-orange-100 outline-none transition text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 sticky top-20 border border-gray-100 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-serif font-bold text-gray-900">Filter</h2>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-heat-orange-600 hover:text-heat-orange-700 font-semibold"
                    >
                      Fjern alle
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-3 uppercase tracking-wider">
                  Kategori
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-heat-orange-400 focus:border-transparent outline-none transition bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Size Filter */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-3 uppercase tracking-wider">
                  Størrelse
                </label>
                <select
                  value={filters.size}
                  onChange={(e) => setFilters({ ...filters, size: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-heat-orange-400 focus:border-transparent outline-none transition bg-white"
                >
                  <option value="all">Alle størrelser</option>
                  {sizes.filter(s => s !== 'all').map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              {/* Condition Filter */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-3 uppercase tracking-wider">
                  Stand
                </label>
                <select
                  value={filters.condition}
                  onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-heat-orange-400 focus:border-transparent outline-none transition bg-white"
                >
                  {conditions.map((cond) => (
                    <option key={cond.value} value={cond.value}>
                      {cond.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="border-t border-gray-200 pt-6">
                <label className="text-xs font-semibold text-gray-700 block mb-4 uppercase tracking-wider">
                  Prisintervall
                </label>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                  className="w-full accent-heat-orange-600 cursor-pointer"
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm text-gray-600">{filters.minPrice} NOK</span>
                  <span className="text-sm font-semibold text-heat-orange-600">{filters.maxPrice} NOK</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Mobile Filters Button + Sorting */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-heat-orange-400 transition"
              >
                <Sliders size={18} />
                <span>Filter</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-heat-orange-400 focus:border-transparent outline-none transition bg-white"
              >
                <option value="newest">Nyeste først</option>
                <option value="oldest">Eldste først</option>
                <option value="price-low">Pris: Lav til høy</option>
                <option value="price-high">Pris: Høy til lav</option>
              </select>
            </div>

            {/* Mobile Filters */}
            {showMobileFilters && (
              <div className="lg:hidden bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-serif font-bold text-gray-900">Filter</h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-heat-orange-600 hover:text-heat-orange-700 font-semibold"
                    >
                      Fjern alle
                    </button>
                  )}
                </div>

                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-heat-orange-400 outline-none bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.size}
                  onChange={(e) => setFilters({ ...filters, size: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-heat-orange-400 outline-none bg-white"
                >
                  <option value="all">Alle størrelser</option>
                  {sizes.filter(s => s !== 'all').map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.condition}
                  onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-heat-orange-400 outline-none bg-white"
                >
                  {conditions.map((cond) => (
                    <option key={cond.value} value={cond.value}>
                      {cond.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Results */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">Ingen varer funnet</h3>
                <p className="text-gray-600 mb-8">
                  {searchQuery
                    ? `Ingen resultater for «${searchQuery}»`
                    : 'Prøv å justere filtrene dine'}
                </p>
                {hasActiveFilters && (
                  <Button
                    onClick={clearFilters}
                    className="bg-heat-orange-600 hover:bg-heat-orange-700 text-white"
                  >
                    Fjern filtre
                  </Button>
                )}
              </div>
            ) : (
              <>
                <ProductGrid products={filteredProducts} />
                <div className="text-center mt-12 text-gray-600">
                  <p className="text-sm">Viser {filteredProducts.length} {filteredProducts.length === 1 ? 'plagg' : 'plagg'}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
