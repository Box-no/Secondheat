'use client'

import { useState } from 'react'
import { UserRole } from '@/lib/types'

export function RoleSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentRole, setCurrentRole] = useState<UserRole>('buyer')

  const roles: { value: UserRole; label: string; icon: string }[] = [
    { value: 'buyer', label: 'Buyer', icon: '🛍️' },
    { value: 'seller', label: 'Seller', icon: '👗' },
    { value: 'admin', label: 'Admin', icon: '👨‍💼' },
  ]

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role)
    localStorage.setItem('selectedRole', role)
    // Reload to apply the new role
    window.location.reload()
  }

  const activeRole = roles.find((r) => r.value === currentRole)

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-heat-orange-100 hover:bg-heat-orange-200 text-heat-orange-700 font-medium text-sm transition-colors"
      >
        <span>{activeRole?.icon}</span>
        <span>{activeRole?.label}</span>
        <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
          <div className="p-3 space-y-2">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider px-2 py-1">
              Switch Role
            </p>
            {roles.map((role) => (
              <button
                key={role.value}
                onClick={() => handleRoleChange(role.value)}
                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all ${
                  currentRole === role.value
                    ? 'bg-heat-orange-100 text-heat-orange-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{role.icon}</span>
                <div>
                  <p className="font-medium">{role.label}</p>
                  <p className="text-xs text-gray-500">
                    {role.value === 'buyer' && 'Shop & purchase'}
                    {role.value === 'seller' && 'List & manage'}
                    {role.value === 'admin' && 'Review & approve'}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-gray-100 px-3 py-2 bg-gray-50 text-xs text-gray-500">
            💡 Prototype mode: role persists until browser reset
          </div>
        </div>
      )}
    </div>
  )
}
