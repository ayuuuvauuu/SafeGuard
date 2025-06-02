"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle, MapPin, Phone, Navigation, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface DemoAlertModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DemoAlertModal({ open, onOpenChange }: DemoAlertModalProps) {
  const [progress, setProgress] = useState(0)
  const [showAlert, setShowAlert] = useState(false)
  const [isVibrating, setIsVibrating] = useState(false)

  useEffect(() => {
    if (open) {
      // Reset state when modal opens
      setProgress(0)
      setShowAlert(false)
      setIsVibrating(false)

      // Start progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setShowAlert(true)
            startVibration()
            return 100
          }
          return prev + 5
        })
      }, 200)

      return () => {
        clearInterval(interval)
        stopVibration()
      }
    } else {
      stopVibration()
    }
  }, [open])

  const startVibration = () => {
    setIsVibrating(true)

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        // Create a pattern of vibration and pause
        const vibrationPattern = []
        for (let i = 0; i < 15; i++) {
          vibrationPattern.push(800, 200) // 800ms vibration, 200ms pause
        }

        // Try to vibrate with pattern
        const success = navigator.vibrate(vibrationPattern)

        // If pattern vibration fails, try continuous vibration
        if (!success) {
          navigator.vibrate(15000) // Vibrate for 15 seconds
        }

        // Fallback for browsers that don't support patterns
        setTimeout(() => {
          stopVibration()
        }, 15000)
      } catch (error) {
        console.error("Vibration error:", error)
      }
    }
  }

  const stopVibration = () => {
    setIsVibrating(false)
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(0) // Stop vibration
      } catch (error) {
        console.error("Error stopping vibration:", error)
      }
    }
  }

  const handleCall = () => {
    stopVibration()
    alert("Calling emergency contact...")
    onOpenChange(false)
  }

  const handleNavigate = () => {
    stopVibration()
    alert("Navigating to emergency location...")
    onOpenChange(false)
  }

  const handleClose = () => {
    stopVibration()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {!showAlert ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">Demo Mode</DialogTitle>
              <DialogDescription className="text-center">
                Simulating an emergency alert in your area...
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-4">
              <Progress value={progress} className="h-2" />
              <p className="text-center text-sm text-muted-foreground">
                {progress < 100 ? "Searching for nearby emergencies..." : "Emergency found!"}
              </p>
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="bg-red-500 -mx-6 -mt-6 px-6 py-4 rounded-t-lg">
              <div className="absolute right-4 top-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full bg-white/20 hover:bg-white/40 text-white"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-center gap-2 text-white">
                <AlertCircle className="h-6 w-6 animate-pulse" />
                <DialogTitle className="text-white">Emergency Alert</DialogTitle>
              </div>
              <Badge className="bg-white/20 text-white mx-auto mt-2">DEMO MODE</Badge>
              {isVibrating && <div className="sr-only">Phone is vibrating</div>}
            </DialogHeader>

            <div className="py-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 font-bold">AS</span>
                </div>
                <div>
                  <h3 className="font-medium">Mamata Banerjee</h3>
                  <p className="text-sm text-muted-foreground">Emergency SOS Activated</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <span>0.8km away</span>
                </div>
                <div className="text-muted-foreground">Just now</div>
              </div>

              <div className="border rounded-md p-3 bg-muted/50">
                <p className="text-sm">
                  This is a simulated emergency alert to demonstrate how the protector mode works. In a real emergency,
                  you would receive notifications even when the app is not running in the background and your phone will
                  vibrate for 15 seconds.
                </p>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button className="w-full bg-red-500 hover:bg-red-600 flex items-center gap-2" onClick={handleCall}>
                <Phone className="h-4 w-4" />
                Call
              </Button>
              <Button variant="outline" className="w-full flex items-center gap-2" onClick={handleNavigate}>
                <Navigation className="h-4 w-4" />
                Navigate
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
