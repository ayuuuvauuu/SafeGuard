import type React from "react"
import { cn } from "@/lib/utils"

interface FeatureListProps extends React.HTMLAttributes<HTMLUListElement> {
  items: string[]
  color?: string
  iconColor?: string
}

export function FeatureList({ items, color = "bg-primary", iconColor, className, ...props }: FeatureListProps) {
  return (
    <ul className={cn("space-y-3", className)} {...props}>
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3">
          <div className={cn("h-2 w-2 rounded-full mt-1.5 flex-shrink-0", iconColor || color)} />
          <span className="text-sm">{item}</span>
        </li>
      ))}
    </ul>
  )
}
