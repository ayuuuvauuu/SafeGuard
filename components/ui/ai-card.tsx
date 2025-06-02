import type React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface AICardProps extends React.ComponentProps<typeof Card> {
  glassEffect?: boolean
  animate?: boolean
  children: React.ReactNode
}

export function AICard({ glassEffect = false, animate = false, className, children, ...props }: AICardProps) {
  return (
    <Card
      className={cn(
        "border-opacity-40 overflow-hidden",
        glassEffect && "bg-opacity-70 backdrop-blur-md",
        animate && "ai-card",
        className,
      )}
      {...props}
    >
      {children}
    </Card>
  )
}

export function AICardHeader({ className, ...props }: React.ComponentProps<typeof CardHeader>) {
  return <CardHeader className={cn("pb-2", className)} {...props} />
}

export function AICardTitle({ className, ...props }: React.ComponentProps<typeof CardTitle>) {
  return <CardTitle className={cn("text-lg font-semibold", className)} {...props} />
}

export function AICardDescription({ className, ...props }: React.ComponentProps<typeof CardDescription>) {
  return <CardDescription className={cn("text-sm", className)} {...props} />
}

export function AICardContent({ className, ...props }: React.ComponentProps<typeof CardContent>) {
  return <CardContent className={cn("pt-0", className)} {...props} />
}

export function AICardFooter({ className, ...props }: React.ComponentProps<typeof CardFooter>) {
  return <CardFooter className={cn("flex justify-between", className)} {...props} />
}
