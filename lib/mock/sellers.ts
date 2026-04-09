import { Seller } from '@/lib/types'

export const mockSellers: Seller[] = [
  {
    id: '1',
    name: 'Emma Lundgren',
    email: 'emma@example.com',
    memberSince: new Date('2023-03-15'),
    avatar: 'https://picsum.photos/100/100?random=1',
    listingCount: 4,
  },
  {
    id: '2',
    name: 'Sofia Bergström',
    email: 'sofia@example.com',
    memberSince: new Date('2023-06-20'),
    avatar: 'https://picsum.photos/100/100?random=2',
    listingCount: 3,
  },
  {
    id: '3',
    name: 'Liv Johansen',
    email: 'liv@example.com',
    memberSince: new Date('2023-01-10'),
    avatar: 'https://picsum.photos/100/100?random=3',
    listingCount: 5,
  },
  {
    id: '4',
    name: 'Anna Svendsen',
    email: 'anna@example.com',
    memberSince: new Date('2024-01-05'),
    avatar: 'https://picsum.photos/100/100?random=4',
    listingCount: 2,
  },
]
