import { DiscountCode } from '@/lib/types'
import { mockDiscountCodes } from '@/lib/mock/discounts'

export interface AppliedDiscount {
  code: DiscountCode
  savings: number
  finalPrice: number
}

export async function validateDiscountCode(
  code: string,
  appliesTo: 'membership' | 'purchase',
  originalPrice: number
): Promise<AppliedDiscount | null> {
  // TODO: Replace with Supabase query
  // const { data } = await supabase
  //   .from('discount_codes')
  //   .select('*')
  //   .eq('code', code.toUpperCase())
  //   .eq('is_active', true)
  //   .single()

  const discount = mockDiscountCodes.find(
    (d) =>
      d.code === code.toUpperCase() &&
      d.isActive &&
      (d.appliesTo === appliesTo || d.appliesTo === 'both') &&
      d.usedCount < d.maxUses &&
      (!d.expiresAt || d.expiresAt > new Date())
  )

  if (!discount) return null

  const savings =
    discount.type === 'percentage'
      ? Math.round(originalPrice * (discount.value / 100))
      : Math.min(discount.value, originalPrice)

  return {
    code: discount,
    savings,
    finalPrice: originalPrice - savings,
  }
}

export async function getActiveDiscountCodes(): Promise<DiscountCode[]> {
  // TODO: Replace with Supabase query (admin only)
  // const { data } = await supabase.from('discount_codes').select('*').eq('is_active', true)
  return mockDiscountCodes.filter((d) => d.isActive)
}
