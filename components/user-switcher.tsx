"use client"

import { Button } from "@/components/ui/button"
import { UserCog } from "lucide-react"

interface UserSwitcherProps {
  currentType: "protected" | "protector"
  onSwitch: () => void
}

export function UserSwitcher({ currentType, onSwitch }: UserSwitcherProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant="outline"
        size="sm"
        className="rounded-full p-3 bg-primary/10 backdrop-blur-sm"
        onClick={onSwitch}
      >
        <UserCog className="h-5 w-5" />
        <span className="sr-only">Switch to {currentType === "protected" ? "Protector" : "Protected"} Mode</span>
      </Button>
    </div>
  )
}
