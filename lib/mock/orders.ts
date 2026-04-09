import { Order } from '@/lib/types'

export const mockOrders: Order[] = [
  {
    id: 'ord-1',
    productId: '3',
    buyerId: 'buyer-1',
    sellerId: '2',
    amount: 850,
    status: 'delivered',
    shippingLabelUrl: 'https://example.com/labels/ord-1.pdf',
    createdAt: new Date('2024-02-15'),
  },
  {
    id: 'ord-2',
    productId: '1',
    buyerId: 'buyer-1',
    sellerId: '1',
    amount: 299,
    status: 'shipped',
    shippingLabelUrl: 'https://example.com/labels/ord-2.pdf',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 'ord-3',
    productId: '5',
    buyerId: 'buyer-2',
    sellerId: '3',
    amount: 399,
    status: 'label_sent',
    shippingLabelUrl: 'https://example.com/labels/ord-3.pdf',
    createdAt: new Date('2024-03-01'),
  },
  {
    id: 'ord-4',
    productId: '4',
    buyerId: 'buyer-3',
    sellerId: '2',
    amount: 249,
    status: 'paid',
    createdAt: new Date('2024-03-06'),
  },
]
