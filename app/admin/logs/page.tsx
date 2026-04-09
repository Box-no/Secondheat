'use client'

import { useAuth } from '@/lib/auth/context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getActivityLogs } from '@/lib/data/logs'
import { Activity } from 'lucide-react'
import Link from 'next/link'

interface ActivityLog {
  id: string
  user_id: string
  action: string
  resource_type: string | null
  resource_id: string | null
  details: Record<string, any> | null
  created_at: string
  user?: {
    name: string
    email: string
    role: string
  }
}

export default function AdminLogsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/')
      return
    }

    async function loadLogs() {
      const activityLogs = await getActivityLogs(100)
      setLogs(activityLogs)
      setIsLoading(false)
    }

    loadLogs()
  }, [user, router])

  const filteredLogs =
    filter === 'all'
      ? logs
      : logs.filter((log) => log.action.includes(filter))

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      user_signup: 'User Signup',
      user_login: 'User Login',
      user_logout: 'User Logout',
      user_update_profile: 'Profile Updated',
      product_created: 'Product Listed',
      product_approved: 'Product Approved',
      product_rejected: 'Product Rejected',
      product_deleted: 'Product Deleted',
      order_created: 'Order Created',
      order_updated: 'Order Updated',
      message_sent: 'Message Sent',
    }
    return labels[action] || action
  }

  const getActionColor = (action: string) => {
    if (action.includes('signup') || action.includes('login')) return 'bg-blue-100 text-blue-800'
    if (action.includes('product_approved')) return 'bg-green-100 text-green-800'
    if (action.includes('product_rejected')) return 'bg-red-100 text-red-800'
    if (action.includes('product')) return 'bg-purple-100 text-purple-800'
    if (action.includes('order')) return 'bg-amber-100 text-amber-800'
    return 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading activity logs...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
              Activity logs
            </h1>
            <p className="text-gray-600">Real-time tracking of all user and system activities</p>
          </div>
          <Link href="/admin" className="text-heat-orange-600 hover:text-heat-orange-700 font-medium">
            ← Back to admin
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All activities' },
              { value: 'signup', label: 'Signups' },
              { value: 'product', label: 'Products' },
              { value: 'order', label: 'Orders' },
              { value: 'approved', label: 'Approvals' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === option.value
                    ? 'bg-heat-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center">
              <Activity size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">No activities found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Resource
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-900">{log.user?.name || 'Unknown'}</p>
                          <p className="text-gray-600 text-xs">{log.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getActionColor(
                            log.action
                          )}`}
                        >
                          {getActionLabel(log.action)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {log.resource_type && log.resource_id ? (
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {log.resource_type}/{log.resource_id.slice(0, 8)}
                          </code>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {log.details ? (
                          <details className="cursor-pointer">
                            <summary className="text-heat-orange-600 font-medium hover:underline">
                              Show details
                            </summary>
                            <pre className="mt-2 bg-gray-50 p-2 rounded text-xs overflow-auto max-w-sm">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </details>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString('en-NO', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
          <p className="text-sm text-gray-600">
            Showing {filteredLogs.length} of {logs.length} activities
          </p>
        </div>
      </div>
    </div>
  )
}
