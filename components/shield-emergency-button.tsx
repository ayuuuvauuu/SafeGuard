"use client"

import { useRouter } from "next/navigation"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ShieldEmergencyButton() {
  const router = useRouter()

  return (
    <Button
      variant="destructive"
      className="h-auto w-full py-4 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-base"
      onClick={() => router.push("/emergency-response")}
    >
      <Shield className="h-5 w-5" />
      Emergency SOS
    </Button>
  )
}