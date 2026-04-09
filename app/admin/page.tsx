'use client'

import { useAuth } from '@/lib/auth/context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getAdminStats } from '@/lib/data/admin'
import Link from 'next/link'
import { CheckCircle, Clock, Users, ShoppingCart, Activity } from 'lucide-react'

export default function AdminDashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (user?.role !== 'admin') {
      router.push('/')
      return
    }

    async function loadStats() {
      const adminStats = await getAdminStats()
      setStats(adminStats)
      setPageLoading(false)
    }

    loadStats()
  }, [user, authLoading, router])

  if (authLoading || pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Laster administrasjonspanel…</p>
      </div>
    )
  }

  const quickActions = [
    {
      label: 'Godkjenn produkter',
      icon: Clock,
      href: '/admin/approvals',
      count: stats?.pendingApprovals,
      color: 'bg-amber-100 text-amber-700',
    },
    {
      label: 'Vis medlemmer',
      icon: Users,
      href: '/admin/members',
      count: stats?.totalMembers,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      label: 'Vis bestillinger',
      icon: ShoppingCart,
      href: '/admin/orders',
      count: stats?.ordersThisMonth,
      color: 'bg-green-100 text-green-700',
    },
    {
      label: 'Aktivitetslogg',
      icon: Activity,
      href: '/admin/logs',
      color: 'bg-purple-100 text-purple-700',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-12">
          Administrasjonspanel
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-500 text-sm font-medium">Venter på godkjenning</p>
              <Clock className="text-amber-500" size={24} />
            </div>
            <p className="text-4xl font-bold text-gray-900">{stats?.pendingApprovals}</p>
          </div>

          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-500 text-sm font-medium">Aktive annonser</p>
              <CheckCircle className="text-green-500" size={24} />
            </div>
            <p className="text-4xl font-bold text-gray-900">{stats?.activeListings}</p>
          </div>

          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-500 text-sm font-medium">Totalt medlemmer</p>
              <Users className="text-blue-500" size={24} />
            </div>
            <p className="text-4xl font-bold text-gray-900">{stats?.totalMembers}</p>
          </div>

          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-500 text-sm font-medium">Bestillinger denne måneden</p>
              <ShoppingCart className="text-purple-500" size={24} />
            </div>
            <p className="text-4xl font-bold text-gray-900">{stats?.ordersThisMonth}</p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
            Hurtigvalg
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.href} href={action.href}>
                  <div className="bg-white rounded-lg p-8 hover:shadow-lg transition cursor-pointer h-full">
                    <div
                      className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}
                    >
                      <Icon size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{action.label}</h3>
                    {action.count !== undefined && (
                      <p className="text-3xl font-bold text-gray-900">{action.count}</p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
