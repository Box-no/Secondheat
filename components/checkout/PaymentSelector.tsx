'use client'

export type PaymentMethod = 'klarna' | 'vipps' | 'card'

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
    id: 'vipps',
    label: 'Vipps',
    description: 'Betal enkelt med Vipps',
    logo: '🟠',
  },
  {
    id: 'card',
    label: 'Kort',
    description: 'Visa eller Mastercard',
    logo: '💳',
  },
]

export function PaymentSelector({ selected, onChange }: PaymentSelectorProps) {
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

      {/* TODO: Replace placeholders with real integrations
        Klarna:  import { KlarnaSDK } from '@klarna/klarna-js-sdk' — https://developers.klarna.com
        Vipps:   POST /api/vipps/init — https://developer.vippsmobilepay.com
        Card:    import { loadStripe } from '@stripe/stripe-js' — https://stripe.com/docs
      */}
      <p className="text-xs text-gray-400 mt-1">
        Alle betalinger er kryptert og sikre.
      </p>
    </div>
  )
}
