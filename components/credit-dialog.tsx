"use client"

import { useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Image from "next/image"

interface CreditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreditDialog({ open, onOpenChange }: CreditDialogProps) {
  useEffect(() => {
    // Show dialog for 3 seconds then close it
    const timer = setTimeout(() => {
      onOpenChange(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center">
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <div className="relative w-16 h-16 mb-2">
            <Image src="/logo.png" alt="SafeGuard Logo" fill className="object-contain" priority />
          </div>
          <h2 className="text-xl font-semibold">SafeGuard</h2>
          <p className="text-sm text-muted-foreground">Your personal safety companion</p>
          <p className="text-sm font-medium">Developed by</p>
          <p className="text-base font-bold">Akshat Bhardwaj and Ayush Mishra</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
