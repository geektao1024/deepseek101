import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-red-500/50 bg-red-50 text-red-700 dark:border-red-500 [&>svg]:text-red-600",
        success:
          "border-green-500/50 bg-green-50 text-green-700 dark:border-green-500 [&>svg]:text-green-600",
        warning:
          "border-yellow-500/50 bg-yellow-50 text-yellow-700 dark:border-yellow-500 [&>svg]:text-yellow-600",
        info:
          "border-blue-500/50 bg-blue-50 text-blue-700 dark:border-blue-500 [&>svg]:text-blue-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

export { Alert, alertVariants }
