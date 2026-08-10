"use client"

import { useEffect, useState } from "react"
import { WifiOff } from "lucide-react"

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const update = () => setIsOffline(!navigator.onLine)
    update()
    window.addEventListener("offline", update)
    window.addEventListener("online", update)
    return () => {
      window.removeEventListener("offline", update)
      window.removeEventListener("online", update)
    }
  }, [])

  if (!isOffline) return null

  return (
    <div
      role="status"
      className="flex items-center gap-2 bg-amber-500/90 px-4 py-2 text-sm font-medium text-white"
    >
      <WifiOff className="h-4 w-4 shrink-0" />
      You are offline — emergency alerts cannot be delivered until you reconnect. Use a phone call to reach help.
    </div>
  )
}