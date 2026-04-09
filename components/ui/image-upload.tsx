'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Loader } from 'lucide-react'

interface ImageUploadInputProps {
  onChange: (urls: string[]) => void
  maxImages?: number
}

export function ImageUploadInput({ onChange, maxImages = 4 }: ImageUploadInputProps) {
  const [images, setImages] = useState<{ url: string; file: File }[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadImages = async (files: File[]) => {
    setUploading(true)
    setError(null)

    try {
      const { supabase } = await import('@/lib/supabase/client')

      let newImages = [...images]
      const uploadedUrls: string[] = []

      for (const file of files) {
        // Validate file
        if (!file.type.startsWith('image/')) {
          setError('Only image files are allowed')
          continue
        }

        if (file.size > 5 * 1024 * 1024) {
          setError('Image must be less than 5MB')
          continue
        }

        // Check if we've reached max images
        if (newImages.length >= maxImages) {
          setError(`Maximum ${maxImages} images allowed`)
          break
        }

        // Upload to Supabase Storage
        const fileName = `products/${Date.now()}-${Math.random()}-${file.name}`

        const { data, error: uploadError } = await supabase.storage
          .from('Product image')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          setError(`Failed to upload ${file.name}: ${uploadError.message}`)
          continue
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('Product image')
          .getPublicUrl(fileName)

        const publicUrl = urlData.publicUrl
        uploadedUrls.push(publicUrl)
        newImages = [...newImages, { url: publicUrl, file }]
      }

      setImages(newImages)
      onChange(newImages.map((img) => img.url))
      setUploading(false)
    } catch (err) {
      setError('Failed to upload images. Check Supabase configuration.')
      setUploading(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      await uploadImages(files)
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onChange(newImages.map((img) => img.url))
  }

  const remainingSlots = maxImages - images.length

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
          uploading
            ? 'border-gray-300 bg-gray-50'
            : 'border-heat-orange-300 hover:border-heat-orange-500 hover:bg-heat-orange-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading || images.length >= maxImages}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader size={32} className="text-heat-orange-600 animate-spin" />
            <p className="text-sm text-gray-600">Uploading images...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload size={32} className="text-heat-orange-600" />
            <p className="text-base font-medium text-gray-900">
              {remainingSlots > 0 ? 'Click to upload or drag images' : 'Maximum images reached'}
            </p>
            <p className="text-xs text-gray-600">
              {remainingSlots > 0
                ? `PNG, JPG, GIF up to 5MB (${remainingSlots} slot${remainingSlots !== 1 ? 's' : ''} remaining)`
                : 'Remove an image to add more'}
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((img, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={img.url}
                  alt={`Upload preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-lg"
              >
                <X size={16} />
              </button>

              {/* Image Number */}
              <p className="text-xs text-gray-600 mt-2 text-center">
                {index + 1} of {images.length}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
