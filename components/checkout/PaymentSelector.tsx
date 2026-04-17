'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export type PaymentMethod = 'klarna' | 'invoice' | 'card'

interface PaymentSelectorProps {
  selected: PaymentMethod
  onChange: (method: PaymentMethod) => void
}

const methods: { id: PaymentMethod; label: string; description: string; logo: string }[] = [
  {
    id: 'klarna',
    label: 'Klarna',
    description: 'Del opp betalingen – betal over tid',
    logo: '🩷',
  },
  {
    id: 'invoice',
    label: 'Faktura / Bank',
    description: 'Betal via faktura eller bankoverføring',
    logo: '🏦',
  },
  {
    id: 'card',
    label: 'Kort',
    description: 'Visa eller Mastercard',
    logo: '💳',
  },
]

const KLARNA_TERMS = `Vilkår for Klarna-betaling

Betaling skjer via Klarna. Med Klarna kan kjøper velge å betale med en gang, via faktura eller delbetaling.

Ved bruk av Klarna inngår kunden en egen avtale direkte med Klarna. secondheat.no håndterer ikke betaling direkte og er ikke ansvarlig for Klarnas tjenester eller betingelser.

Se Klarnas fullstendige vilkår på klarna.com/no/vilkar`

export function PaymentSelector({ selected, onChange }: PaymentSelectorProps) {
  const [showKlarnaTerms, setShowKlarnaTerms] = useState(false)

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-900">Betalingsmetode</label>
      <div className="grid grid-cols-1 gap-3">
        {methods.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => onChange(method.id)}
            className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl border-2 text-left transition-all ${
              selected === method.id
                ? 'border-heat-orange-500 bg-heat-orange-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <span className="text-2xl">{method.logo}</span>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{method.label}</p>
              <p className="text-xs text-gray-500">{method.description}</p>
            </div>
            <div className="ml-auto">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selected === method.id
                    ? 'border-heat-orange-500 bg-heat-orange-500'
                    : 'border-gray-300'
                }`}
              >
                {selected === method.id && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Klarna terms accordion */}
      {selected === 'klarna' && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowKlarnaTerms(!showKlarnaTerms)}
            className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition text-left"
          >
            <span className="text-xs font-medium text-gray-700">Vilkår for Klarna-betaling</span>
            {showKlarnaTerms ? (
              <ChevronUp size={14} className="text-gray-500 flex-shrink-0" />
            ) : (
              <ChevronDown size={14} className="text-gray-500 flex-shrink-0" />
            )}
          </button>
          {showKlarnaTerms && (
            <div className="px-4 py-4 bg-white border-t border-gray-200">
              <pre className="text-xs text-gray-600 whitespace-pre-wrap font-sans leading-relaxed">
                {KLARNA_TERMS}
              </pre>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-1">
        Alle betalinger er kryptert og sikre.
      </p>
    </div>
  )
}
