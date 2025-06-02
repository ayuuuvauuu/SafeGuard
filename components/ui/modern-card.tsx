import type * as React from "react"
import { cn } from "@/lib/utils"

interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: "purple-blue" | "pink-purple" | "blue-teal" | "teal-blue" | "none"
  glassEffect?: boolean
  hoverEffect?: boolean
  borderEffect?: boolean
  children: React.ReactNode
}

export function ModernCard({
  gradient = "none",
  glassEffect = false,
  hoverEffect = false,
  borderEffect = false,
  className,
  children,
  ...props
}: ModernCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden",
        gradient !== "none" && `gradient-${gradient}`,
        glassEffect && "glass-morphism",
        hoverEffect && "card-hover",
        borderEffect && "gradient-border",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function ModernCardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 flex flex-col items-center", className)} {...props} />
}

export function ModernCardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />
}

export function ModernCardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-xl font-bold text-center mb-1", className)} {...props} />
}

export function ModernCardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-center text-muted-foreground", className)} {...props} />
}

export function ModernCardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0 flex items-center justify-center gap-4", className)} {...props} />
}
