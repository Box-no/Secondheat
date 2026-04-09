'use client'

import { Button } from '@/components/ui/button'
import { ImageUploadInput } from '@/components/ui/image-upload'
import { useAuth } from '@/lib/auth/context'
import { useRouter } from 'next/navigation'
import { useEffect, useState, FormEvent } from 'react'
import { createProduct } from '@/lib/data/products'

export default function SellPage() {
  const { user, isMember, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    size: '',
    condition: '',
    price: '',
    description: '',
    images: [] as string[],
  })

  useEffect(() => {
    if (authLoading) return
    if (!isMember) {
      router.push('/join')
    }
  }, [isMember, authLoading, router])

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        router.push('/dashboard/seller')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [submitted, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImagesChange = (urls: string[]) => {
    setFormData((prev) => ({ ...prev, images: urls }))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    // Validate images
    if (formData.images.length === 0) {
      setError('Please upload at least one image')
      return
    }

    setLoading(true)

    try {
      // Call createProduct with form data
      await createProduct({
        sellerId: user?.id || '',
        title: formData.title,
        category: formData.category as 'top' | 'bottom' | 'dress' | 'shoes' | 'accessories',
        size: formData.size,
        condition: formData.condition as 'new' | 'like_new' | 'good' | 'fair',
        price: parseInt(formData.price),
        description: formData.description,
        images: formData.images,
      })

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit listing')
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">📋</div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            Annonse sendt inn
          </h1>
          <p className="text-gray-600 mb-8">
            Varen din er til vurdering. Vi varsler deg når den er godkjent.
          </p>
          <Button
            onClick={() => router.push('/dashboard/seller')}
            className="bg-heat-orange-600 hover:bg-heat-orange-700 text-white"
          >
            Gå til oversikt
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">
          Selg dansetøy
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Varenavn
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="F.eks. Svart ballettdrakt"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heat-orange-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Kategori
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heat-orange-500 focus:border-transparent outline-none transition"
            >
              <option value="">Velg kategori</option>
              <option value="top">Topp</option>
              <option value="bottom">Bunn</option>
              <option value="dress">Kjole</option>
              <option value="shoes">Sko</option>
              <option value="accessories">Tilbehør</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Størrelse
            </label>
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              required
              placeholder="F.eks. M eller 37"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heat-orange-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Stand
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heat-orange-500 focus:border-transparent outline-none transition"
            >
              <option value="">Velg stand</option>
              <option value="new">Ny</option>
              <option value="like_new">Som ny</option>
              <option value="good">God stand</option>
              <option value="fair">Brukbar stand</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Pris (kr)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              placeholder="299"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heat-orange-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Beskrivelse
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={5}
              placeholder="Beskriv varen. Materiale, slitasje, vaskeråd..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heat-orange-500 focus:border-transparent outline-none transition"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-4">
              Bilder (obligatorisk)
            </label>
            <ImageUploadInput onChange={handleImagesChange} maxImages={4} />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-heat-orange-600 hover:bg-heat-orange-700 text-white py-3 text-lg disabled:opacity-50"
          >
            {loading ? 'Sender inn...' : 'Send inn annonse'}
          </Button>
        </form>
      </div>
    </div>
  )
}
