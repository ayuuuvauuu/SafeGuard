"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, ArrowLeft, Car, User, X, CheckCircle } from "lucide-react"
import Link from "next/link"
import { LiveMap } from "@/components/live-map"
import { Footer } from "@/components/footer"
import { Progress } from "@/components/ui/progress"

// Default location (Jamshedpur, India)
const defaultLocation = { lat: 22.77, lng: 86.24 }

export default function TravelStatus() {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [remainingTime, setRemainingTime] = useState(1800) // 30 minutes in seconds

  // Simulate elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
      setRemainingTime((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Calculate progress percentage
  const progressPercentage = 100 - (remainingTime / 1800) * 100

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b bg-blue-600 text-white">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center text-white">
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Link>
            <div>
              <div className="font-bold text-xl">Travel Protocol</div>
              <div className="text-xs">Journey in progress for {formatTime(elapsedTime)}</div>
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
              <LiveMap location={defaultLocation} />
              <div className="absolute bottom-2 right-2">
                <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                  Live Location Sharing
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Journey Progress */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Journey Progress</h3>
              <Badge variant="outline" className="text-blue-500">
                {formatTime(remainingTime)} remaining
              </Badge>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Telco Colony</span>
              <span>Destination: Jubilee Park</span>
            </div>
          </CardContent>
        </Card>

        {/* Journey Details */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Journey Details</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Transport Mode</span>
                  </div>
                  <span className="text-sm">Cab</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Expected Duration</span>
                  </div>
                  <span className="text-sm">30 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Cab Details</span>
                  </div>
                  <span className="text-sm">JH05 AB 1234</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Contacts Monitoring</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Mom</span>
                  <Badge variant="outline" className="text-green-500 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Monitoring
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Dad</span>
                  <Badge variant="outline" className="text-green-500 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Monitoring
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium mb-2">Journey Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-xs">
                <div className="bg-muted p-1 rounded-full mt-0.5">
                  <Car className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Journey Started</div>
                    <div className="text-muted-foreground">14:32:05</div>
                  </div>
                  <div className="text-muted-foreground">From Telco Colony</div>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs">
                <div className="bg-muted p-1 rounded-full mt-0.5">
                  <MapPin className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Location Update</div>
                    <div className="text-muted-foreground">14:37:06</div>
                  </div>
                  <div className="text-muted-foreground">Passing Sakchi Market</div>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs">
                <div className="bg-muted p-1 rounded-full mt-0.5">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Contact Check-in</div>
                    <div className="text-muted-foreground">14:40:15</div>
                  </div>
                  <div className="text-muted-foreground">Mom: "Are you okay?"</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="destructive" className="w-full" asChild>
            <Link href="/dashboard">End Journey</Link>
          </Button>
          <Button
            variant="outline"
            className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            asChild
          >
            <Link href="/emergency-response">Emergency SOS</Link>
          </Button>
        </div>
      </div>

      <Footer />
    </main>
  )
}
