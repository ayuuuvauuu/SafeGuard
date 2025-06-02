"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, MapPin, ArrowLeft, Camera, Mic, X } from "lucide-react"
import Link from "next/link"
import { LiveMap } from "@/components/live-map"
import { Footer } from "@/components/footer"

// Default location (Jamshedpur, India)
const defaultLocation = { lat: 22.77, lng: 86.24 }

export default function SuspectStatus() {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [capturedPhotos, setCapturedPhotos] = useState<number>(0) // Number of photos captured
  const [photoEvidence, setPhotoEvidence] = useState<string | null>(null)
  const [isBrowser, setIsBrowser] = useState(false)

  // Set browser state and load photo evidence
  useEffect(() => {
    setIsBrowser(true)

    // Load photo from localStorage if available
    if (typeof window !== "undefined") {
      try {
        const savedPhoto = localStorage.getItem("suspectPhoto")
        if (savedPhoto) {
          setPhotoEvidence(savedPhoto)
          setCapturedPhotos(1)
        }
      } catch (error) {
        console.error("Error loading photo:", error)
      }
    }
  }, [])

  // Simulate elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Format elapsed time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Handle capture photo
  const handleCapturePhoto = () => {
    setCapturedPhotos(capturedPhotos + 1)
    alert("Photo captured successfully!")
  }

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b bg-amber-600 text-white">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center text-white">
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Link>
            <div>
              <div className="font-bold text-xl">Suspect Alert</div>
              <div className="text-xs">Alert active for {formatTime(elapsedTime)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full bg-white/20 hover:bg-white/30" asChild>
              <Link href="/dashboard">
                <X className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container flex-1 p-4 md:p-6 space-y-4 overflow-auto">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              {isBrowser && <LiveMap location={defaultLocation} showProtectors={false} />}
              <div className="absolute bottom-2 right-2">
                <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                  Live Location Sharing
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <Card className="bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <div className="text-xs font-medium text-green-800 dark:text-green-300">Alert Status</div>
                <div className="text-xs text-green-600 dark:text-green-400">Active</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-3 flex items-center gap-2">
              <Camera className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="text-xs font-medium text-blue-800 dark:text-blue-300">Photo Evidence</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">{capturedPhotos} captured</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-3 flex items-center gap-2">
              <Mic className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <div>
                <div className="text-xs font-medium text-purple-800 dark:text-purple-300">Audio Note</div>
                <div className="text-xs text-purple-600 dark:text-purple-400">Recording: {formatTime(elapsedTime)}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert Details */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Suspect Description</h3>
              <p className="text-sm text-muted-foreground">
                Male, approximately 30-35 years old, wearing a black jacket and blue jeans. Suspicious behavior observed
                near the ATM. Appears to be following people.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Contacts Notified</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Mom</span>
                  <Badge variant="outline" className="text-green-500">
                    Received
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Dad</span>
                  <Badge variant="outline" className="text-green-500">
                    Received
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Sister</span>
                  <Badge variant="outline" className="text-muted">
                    Pending
                  </Badge>
                </div>
              </div>
            </div>

            {photoEvidence && (
              <div>
                <h3 className="text-sm font-medium mb-2">Photo Evidence</h3>
                <div className="grid grid-cols-1 gap-2">
                  <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
                    <img
                      src={photoEvidence || "/placeholder.svg"}
                      alt="Suspect evidence"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-1 right-1 text-xs bg-background/80 px-1 rounded">Photo 1</div>
                  </div>
                </div>
              </div>
            )}

            {!photoEvidence && capturedPhotos > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Photo Evidence</h3>
                <div className="grid grid-cols-1 gap-2">
                  <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <Camera className="h-8 w-8 opacity-50" />
                    </div>
                    <div className="absolute bottom-1 right-1 text-xs bg-background/80 px-1 rounded">Photo 1</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium mb-2">Alert Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-xs">
                <div className="bg-muted p-1 rounded-full mt-0.5">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Suspect Alert Activated</div>
                    <div className="text-muted-foreground">14:32:05</div>
                  </div>
                  <div className="text-muted-foreground">Alert initiated</div>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs">
                <div className="bg-muted p-1 rounded-full mt-0.5">
                  <MapPin className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Location Shared</div>
                    <div className="text-muted-foreground">14:32:06</div>
                  </div>
                  <div className="text-muted-foreground">Telco Colony, Jamshedpur</div>
                </div>
              </div>

              {photoEvidence && (
                <div className="flex items-start gap-2 text-xs">
                  <div className="bg-muted p-1 rounded-full mt-0.5">
                    <Camera className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Photo Captured</div>
                      <div className="text-muted-foreground">14:32:15</div>
                    </div>
                    <div className="text-muted-foreground">Evidence photo saved</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="destructive" className="w-full" asChild>
            <Link href="/dashboard">End Alert</Link>
          </Button>
          <Button variant="outline" className="w-full" onClick={handleCapturePhoto}>
            Capture Photo
          </Button>
        </div>
      </div>

      <Footer />
    </main>
  )
}
