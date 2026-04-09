'use client'

import { useAuth } from '@/lib/auth/context'
import { useRouter } from 'next/navigation'
import { useEffect, useState, FormEvent } from 'react'
import { getMessageThread } from '@/lib/data/messages'
import { getOrderById } from '@/lib/data/orders'
import { getProductById } from '@/lib/data/products'
import { Message, Order, Product } from '@/lib/types'
import Image from 'next/image'
import { Send } from 'lucide-react'

interface MessagesPageProps {
  params: { orderId: string }
}

export default function MessagesPage({ params }: MessagesPageProps) {
  const { user, isMember, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [order, setOrder] = useState<Order | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [messageText, setMessageText] = useState('')

  useEffect(() => {
    if (authLoading) return
    if (!isMember) {
      router.push('/join')
      return
    }

    async function loadData() {
      const orderData = await getOrderById(params.orderId)
      if (orderData) {
        setOrder(orderData)
        const productData = await getProductById(orderData.productId)
        setProduct(productData)

        const threadMessages = await getMessageThread(params.orderId)
        setMessages(threadMessages)
      }
      setIsLoading(false)
    }

    loadData()
  }, [params.orderId, isMember, authLoading, router])

  async function handleSendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!messageText.trim() || !user) return

    // Mock: add message to list
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      orderId: params.orderId,
      senderId: user.id,
      senderName: user.name,
      content: messageText,
      createdAt: new Date(),
    }

    setMessages([...messages, newMessage])
    setMessageText('')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading messages...</p>
      </div>
    )
  }

  if (!order || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Order not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Messages Section */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="mx-auto max-w-4xl px-4 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">
                Conversation
              </h1>
              <p className="text-sm text-gray-600 mt-1">Order #{order.id}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isOwnMessage = msg.senderId === user?.id
            return (
              <div
                key={msg.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-lg ${
                    isOwnMessage
                      ? 'bg-heat-orange-500 text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm font-medium mb-1">
                    {isOwnMessage ? 'You' : msg.senderName}
                  </p>
                  <p className="text-sm">{msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-heat-orange-100' : 'text-gray-500'
                    }`}
                  >
                    {msg.createdAt.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 sticky bottom-0 p-4">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heat-orange-500 focus:border-transparent outline-none transition"
            />
            <button
              type="submit"
              disabled={!messageText.trim()}
              className="bg-heat-orange-600 hover:bg-heat-orange-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Order Summary Sidebar */}
      <div className="hidden lg:block w-80 bg-white border-l border-gray-200">
        <div className="sticky top-0 h-screen overflow-y-auto p-6 space-y-6">
          <h3 className="text-lg font-bold text-gray-900">Order summary</h3>

          {/* Product Card */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="relative aspect-square mb-4 bg-white rounded overflow-hidden">
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            <h4 className="font-bold text-gray-900 line-clamp-2 mb-2">
              {product.title}
            </h4>
            <p className="text-lg font-bold text-heat-orange-600">
              {order.amount} NOK
            </p>
          </div>

          {/* Status */}
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                Order status
              </p>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {order.status === 'paid'
                  ? 'Payment received'
                  : order.status === 'label_sent'
                    ? 'Label sent'
                    : order.status === 'shipped'
                      ? 'In transit'
                      : 'Delivered'}
              </span>
            </div>

            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                Order date
              </p>
              <p className="text-sm text-gray-900">
                {order.createdAt.toLocaleDateString()}
              </p>
            </div>

            {order.shippingLabelUrl && (
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                  Tracking
                </p>
                <a
                  href={order.shippingLabelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-heat-orange-600 hover:text-heat-orange-700 underline"
                >
                  View shipping label
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
