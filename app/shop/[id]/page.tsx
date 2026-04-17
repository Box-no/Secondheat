'use client'

import { getProductById } from '@/lib/data/products'
import { getSellerById } from '@/lib/data/sellers'
import { validateDiscountCode } from '@/lib/data/discounts'
import { Button } from '@/components/ui/button'
import { PaymentSelector, PaymentMethod } from '@/components/checkout/PaymentSelector'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Heart, Tag, CheckCircle2, XCircle } from 'lucide-react'
import { useEffect, useState, use } from 'react'
import { Product } from '@/lib/types'

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [seller, setSeller] = useState<any>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('klarna')
  const [discountInput, setDiscountInput] = useState('')
  const [discountLoading, setDiscountLoading] = useState(false)
  const [discountResult, setDiscountResult] = useState<{
    savings: number
    finalPrice: number
    description: string
  } | null>(null)
  const [discountError, setDiscountError] = useState<string | null>(null)
  const [showPayment, setShowPayment] = useState(false)

  useEffect(() => {
    async function loadData() {
      const productData = await getProductById(id)
      if (!productData) {
        notFound()
      }
      setProduct(productData)
      const sellerData = await getSellerById(productData.sellerId)
      setSeller(sellerData)
      setIsLoading(false)
    }
    loadData()
  }, [id])

  if (isLoading || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-heat-orange-200 border-t-heat-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Laster produkt...</p>
        </div>
      </div>
    )
  }

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)

  const finalPrice = discountResult ? discountResult.finalPrice : product.price

  async function handleApplyDiscount() {
    if (!discountInput.trim()) return
    setDiscountLoading(true)
    setDiscountError(null)
    setDiscountResult(null)

    const result = await validateDiscountCode(discountInput, 'purchase', product?.price ?? 0)
    if (result) {
      setDiscountResult({
        savings: result.savings,
        finalPrice: result.finalPrice,
        description: result.code.description,
      })
    } else {
      setDiscountError('Ugyldig eller utløpt rabattkode.')
    }
    setDiscountLoading(false)
  }

  const categoryLabel: Record<string, string> = {
    top: 'Topp',
    bottom: 'Bunn',
    dress: 'Kjole',
    competition_costume: 'Konkurransekostyme',
    shoes: 'Sko',
    accessories: 'Tilbehør',
  }

  const conditionLabel: Record<string, string> = {
    new: 'Ny',
    like_new: 'Som ny',
    good: 'God stand',
    fair: 'Brukbar stand',
  }

  const statusLabel: Record<string, string> = {
    approved: 'Tilgjengelig',
    sold: 'Solgt',
    pending: 'Venter på godkjenning',
    rejected: 'Avvist',
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-heat-orange-600 hover:text-heat-orange-700 mb-12 text-sm font-medium group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Tilbake til butikk
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Carousel */}
          <div className="space-y-4">
            <div
              className="relative rounded-2xl overflow-hidden bg-gray-100 shadow-lg"
              style={{ aspectRatio: '4/5' }}
            >
              <Image
                src={product.images[currentImageIndex]}
                alt={product.title}
                fill
                className="object-cover w-full h-full"
                priority
              />
              {product.status === 'sold' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-5xl font-serif font-bold text-white">SOLGT</span>
                </div>
              )}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition z-10"
                  >
                    <ChevronLeft size={24} className="text-gray-900" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition z-10"
                  >
                    <ChevronRight size={24} className="text-gray-900" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {currentImageIndex + 1} / {product.images.length}
                  </div>
                </>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 rounded-lg overflow-hidden transition border-2 ${
                      index === currentImageIndex
                        ? 'border-heat-orange-600 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} bilde ${index + 1}`}
                      width={80}
                      height={100}
                      className="object-cover w-20 h-24"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                {categoryLabel[product.category]}
              </span>
              <h1 className="text-5xl font-serif font-bold text-gray-900 mt-3 leading-tight">
                {product.title}
              </h1>
              <div className="mt-6 flex items-end gap-3">
                {discountResult ? (
                  <>
                    <p className="text-4xl font-bold text-heat-orange-600">
                      {finalPrice}{' '}
                      <span className="text-lg text-gray-500 font-normal">kr</span>
                    </p>
                    <p className="text-xl text-gray-400 line-through mb-0.5">
                      {product.price} kr
                    </p>
                    <span className="text-sm font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                      − {discountResult.savings} kr
                    </span>
                  </>
                ) : (
                  <p className="text-4xl font-bold text-heat-orange-600">
                    {product.price}{' '}
                    <span className="text-lg text-gray-500 font-normal">kr</span>
                  </p>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="bg-gray-50 p-8 rounded-2xl space-y-6 border border-gray-100">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Størrelse</p>
                  <p className="text-2xl font-semibold text-gray-900">{product.size}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Stand</p>
                  <p className="text-2xl font-semibold text-gray-900">{conditionLabel[product.condition]}</p>
                </div>
              </div>

              {(product.waist || product.height) && (
                <div className="border-t border-gray-200 pt-6 grid grid-cols-2 gap-8">
                  {product.waist && (
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Midje</p>
                      <p className="text-xl font-semibold text-gray-900">{product.waist} cm</p>
                    </div>
                  )}
                  {product.height && (
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Høyde</p>
                      <p className="text-xl font-semibold text-gray-900">{product.height} cm</p>
                    </div>
                  )}
                </div>
              )}

              {product.danceStyles && product.danceStyles.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">Brukt til</p>
                  <div className="flex flex-wrap gap-2">
                    {product.danceStyles.map((style) => {
                      const styleLabels: Record<string, string> = {
                        disco_freestyle: 'Disco / Freestyle',
                        slow: 'Slow',
                        konkurranse: 'Konkurranse',
                        sportsdans: 'Sportsdans',
                      }
                      return (
                        <span key={style} className="px-3 py-1 bg-heat-orange-100 text-heat-orange-800 rounded-full text-xs font-medium">
                          {styleLabels[style] || style}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}

              {product.deliveryMethod && (
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Levering</p>
                  <p className="text-base font-semibold text-gray-900">
                    {product.deliveryMethod === 'send' ? '📦 Sendes med post' : '🤝 Leveres personlig'}
                  </p>
                </div>
              )}

              <div className="border-t border-gray-200 pt-6">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">Status</p>
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                    product.status === 'sold' ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-700'
                  }`}
                >
                  {statusLabel[product.status]}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-4">Om denne varen</h3>
              <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
            </div>

            {/* Seller */}
            {seller && (
              <div className="bg-gradient-to-br from-heat-orange-50 to-heat-orange-25 p-8 rounded-2xl border border-heat-orange-100 space-y-5">
                <div>
                  <p className="text-xs text-heat-orange-700 font-semibold uppercase tracking-wider mb-4">Selges av</p>
                  <div className="flex items-start gap-4">
                    {seller.avatar && (
                      <Image src={seller.avatar} alt={seller.name} width={48} height={48} className="rounded-full" />
                    )}
                    <div>
                      <h3 className="font-serif font-bold text-gray-900 text-lg">{seller.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Medlem siden {seller.memberSince.getFullYear()} &bull;{' '}
                        {seller.listingCount} aktiv{seller.listingCount !== 1 ? 'e annonser' : ' annonse'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact options */}
                <div className="border-t border-heat-orange-200 pt-5 space-y-3">
                  <p className="text-xs text-heat-orange-700 font-semibold uppercase tracking-wider">Kontakt selger</p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <a
                      href={`mailto:${seller.email}?subject=Interessert i: ${product?.title || 'din vare'}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-heat-orange-100 text-heat-orange-700 font-medium rounded-lg border border-heat-orange-200 transition text-sm"
                    >
                      <span>✉️</span> E-post
                    </a>
                    {seller.phone && (
                      <a
                        href={`tel:${seller.phone}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-heat-orange-100 text-heat-orange-700 font-medium rounded-lg border border-heat-orange-200 transition text-sm"
                      >
                        <span>📞</span> Ring
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Buy / actions */}
            {product.status !== 'sold' && (
              <>
                {!showPayment ? (
                  <div className="flex gap-4">
                    <Button
                      onClick={() => setShowPayment(true)}
                      className="flex-1 bg-heat-orange-600 hover:bg-heat-orange-700 text-white py-3 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl"
                    >
                      Kjøp nå – {finalPrice} kr
                    </Button>
                    <Button
                      variant="outline"
                      className="px-5 py-3 rounded-xl border-2 hover:border-heat-orange-400 hover:bg-heat-orange-50"
                    >
                      <Heart size={22} className="stroke-gray-400" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-5 bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <h3 className="font-serif font-bold text-gray-900 text-lg">Fullfør kjøp</h3>

                    {/* Discount code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Rabattkode (valgfritt)
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={discountInput}
                            onChange={(e) => {
                              setDiscountInput(e.target.value.toUpperCase())
                              setDiscountError(null)
                              setDiscountResult(null)
                            }}
                            placeholder="F.eks. DANS2025"
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heat-orange-500 outline-none transition uppercase text-sm tracking-wide bg-white"
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={handleApplyDiscount}
                          disabled={discountLoading || !discountInput.trim()}
                          className="bg-gray-800 hover:bg-gray-900 text-white px-4 text-sm disabled:opacity-40"
                        >
                          {discountLoading ? '...' : 'Bruk'}
                        </Button>
                      </div>
                      {discountResult && (
                        <div className="mt-2 flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                          <CheckCircle2 size={16} className="flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold">{discountResult.description}</p>
                            <p className="text-xs">Du sparer {discountResult.savings} kr</p>
                          </div>
                        </div>
                      )}
                      {discountError && (
                        <div className="mt-2 flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                          <XCircle size={16} className="flex-shrink-0" />
                          <p className="text-sm">{discountError}</p>
                        </div>
                      )}
                    </div>

                    {/* Price summary */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{product.title}</span>
                        <span>{product.price} kr</span>
                      </div>
                      {discountResult && (
                        <div className="flex justify-between text-sm text-green-700">
                          <span>Rabatt</span>
                          <span>− {discountResult.savings} kr</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2">
                        <span>Totalt</span>
                        <span>{finalPrice} kr</span>
                      </div>
                    </div>

                    <PaymentSelector selected={paymentMethod} onChange={setPaymentMethod} />

                    <Button className="w-full bg-heat-orange-600 hover:bg-heat-orange-700 text-white py-3 font-semibold rounded-xl">
                      Betal {finalPrice} kr via {paymentMethod === 'klarna' ? 'Klarna' : paymentMethod === 'invoice' ? 'faktura/bank' : 'kort'}
                    </Button>
                    <button
                      onClick={() => setShowPayment(false)}
                      className="w-full text-sm text-gray-500 hover:text-gray-700 text-center"
                    >
                      Avbryt
                    </button>
                  </div>
                )}
              </>
            )}

            {product.status === 'sold' && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 p-6 rounded-xl">
                <p className="text-sm text-amber-900 font-medium">
                  Denne varen er solgt. Sjekk andre tilgjengelige varer eller kom tilbake senere.
                </p>
                <Link
                  href="/shop"
                  className="inline-block mt-3 text-sm text-heat-orange-600 font-semibold hover:underline"
                >
                  Se alle varer →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
