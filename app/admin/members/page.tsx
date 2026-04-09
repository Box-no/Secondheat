'use client'

import { useAuth } from '@/lib/auth/context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getSellers } from '@/lib/data/sellers'
import { Seller } from '@/lib/types'

export default function MembersPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [members, setMembers] = useState<Seller[]>([])
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (user?.role !== 'admin') {
      router.push('/')
      return
    }

    async function loadMembers() {
      const list = await getSellers()
      setMembers(list)
      setPageLoading(false)
    }

    loadMembers()
  }, [user, authLoading, router])

  if (authLoading || pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Laster medlemmer…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900">Medlemmer</h1>
          <span className="text-sm text-gray-500">{members.length} totalt</span>
        </div>

        {members.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-500 text-lg">Ingen medlemmer ennå</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Navn
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    E-post
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Medlem siden
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Annonser
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {member.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{member.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {member.memberSince instanceof Date && !isNaN(member.memberSince.getTime())
                        ? member.memberSince.toLocaleDateString('nb-NO')
                        : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {member.listingCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
