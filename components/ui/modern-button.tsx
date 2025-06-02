import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const modernButtonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        gradient: "text-white",
        glass: "glass-morphism text-white hover:bg-white/20",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
        full: "w-full py-3 px-4",
      },
      gradient: {
        none: "",
        "purple-blue": "gradient-purple-blue",
        "pink-purple": "gradient-pink-purple",
        "blue-teal": "gradient-blue-teal",
        "teal-blue": "gradient-teal-blue",
      },
      animation: {
        none: "",
        pulse: "pulse",
        "pulse-pink": "pulse pulse-pink",
        "pulse-blue": "pulse pulse-blue",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      gradient: "none",
      animation: "none",
    },
  },
)

export interface ModernButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof modernButtonVariants> {
  asChild?: boolean
}

const ModernButton = React.forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({ className, variant, size, gradient, animation, ...props }, ref) => {
    return (
      <button
        className={cn(modernButtonVariants({ variant, size, gradient, animation, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
ModernButton.displayName = "ModernButton"

export { ModernButton, modernButtonVariants }
