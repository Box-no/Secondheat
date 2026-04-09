import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heat-orange-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-heat-orange-500 to-heat-red-600 text-white hover:from-heat-orange-600 hover:to-heat-red-700 active:scale-95 shadow-md hover:shadow-lg',
        destructive: 'bg-heat-red-600 text-white hover:bg-heat-red-700 active:scale-95',
        outline:
          'border-2 border-gray-300 bg-white text-gray-900 hover:border-heat-orange-400 hover:bg-heat-orange-50',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-95',
        ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
        link: 'text-heat-orange-600 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-6 py-2 text-sm',
        sm: 'h-9 px-3 text-xs rounded-md',
        lg: 'h-12 px-8 text-base',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
)
Button.displayName = 'Button'

export { Button, buttonVariants }
