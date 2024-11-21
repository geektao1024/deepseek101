"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] relative group",
  {
    variants: {
      variant: {
        default: "bg-[#007AFF] text-white shadow-sm hover:bg-[#0066CC] active:bg-[#0055AA]",
        destructive: "bg-[#FF3B30] text-white shadow-sm hover:bg-[#FF2D55] active:bg-[#FF2D55]",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-[#F2F2F7] text-[#3A3A3C] hover:bg-[#E5E5EA] active:bg-[#D1D1D6]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-[#007AFF] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  icon?: React.ReactNode
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, icon, loading, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            {icon && children && (
              <span className="inline-flex items-center gap-2">
                <span className="h-5 w-5 flex items-center justify-center">{icon}</span>
                <span>{children}</span>
              </span>
            )}
            {icon && !children && (
              <span className="h-5 w-5 flex items-center justify-center">{icon}</span>
            )}
            {!icon && children && (
              <span>{children}</span>
            )}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

