"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  Camera,
  CameraOff,
  Clock,
  Mic,
  MicOff,
  Phone,
  Shield,
  Users,
  X,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import ShakeDetector from "@/shakedector"

// Dynamically import components that use browser APIs with SSR disabled
const LiveMap = dynamic(() => import("@/components/live-map").then((mod) => mod.LiveMap), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-800 flex items-center justify-center text-white">
      <p>Loading map...</p>
    </div>
  ),
})

const VideoStream = dynamic(() => import("@/components/video-stream").then((mod) => mod.VideoStream), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-800 flex items-center justify-center text-white">
      <p>Loading video stream...</p>
    </div>
  ),
})

const EventTimeline = dynamic(() => import("@/components/event-timeline").then((mod) => mod.EventTimeline), {
  ssr: false,
  loading: () => (
    <div className="space-y-2 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="h-4 w-4 rounded-full bg-gray-700 mt-1"></div>
          <div className="flex-1">
            <div className="h-4 w-24 bg-gray-700 rounded"></div>
            <div className="h-3 w-full bg-gray-700 rounded mt-1"></div>
          </div>
        </div>
      ))}
    </div>
  ),
})

const NearbyUsers = dynamic(() => import("@/components/nearby-users").then((mod) => mod.NearbyUsers), {
  ssr: false,
  loading: () => (
    <div className="space-y-2 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-800">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gray-700"></div>
            <div>
              <div className="h-4 w-24 bg-gray-700 rounded"></div>
              <div className="h-3 w-16 bg-gray-700 rounded mt-1"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
})

const FakeExitModal = dynamic(() => import("@/components/fake-exit-modal").then((mod) => mod.FakeExitModal), {
  ssr: false,
})

export default function EmergencyResponse() {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isFrontCamera, setIsFrontCamera] = useState(false)
  const [isVideoActive, setIsVideoActive] = useState(true)
  const [isAudioActive, setIsAudioActive] = useState(true)
  const [showFakeExitModal, setShowFakeExitModal] = useState(false)
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false)
  const [isBrowser, setIsBrowser] = useState(false)
  const router = useRouter()

  // Set browser state
  useEffect(() => {
    setIsBrowser(true)
  }, [])

  // Simulate elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Play alert sound and vibrate - only on client side
  useEffect(() => {
    // Only run in browser environment
    if (!isBrowser) return

    try {
      const audio = new Audio("/alert-sound.mp3")
      audio.play().catch((e) => console.log("Audio play failed:", e))

      if (navigator.vibrate) {
        navigator.vibrate([300, 100, 300])
      }
    } catch (error) {
      console.error("Error with browser APIs:", error)
    }

    // Update document title only on client side
    document.title = "🚨 EMERGENCY ACTIVE - SafeGuard"

    return () => {
      document.title = "SafeGuard"
    }
  }, [isBrowser])

  // Format elapsed time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Handle camera switch
  const toggleCamera = () => {
    setIsFrontCamera(!isFrontCamera)
  }

  // Handle video toggle
  const toggleVideo = () => {
    setIsVideoActive(!isVideoActive)
  }

  // Handle audio toggle
  const toggleAudio = () => {
    setIsAudioActive(!isAudioActive)
  }

  // Handle emergency end
  const endEmergency = () => {
    router.push("/dashboard")
  }

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <ShakeDetector />
      <header className="border-b bg-red-600 text-white">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 animate-pulse" />
            <div>
              <div className="font-bold text-xl">Emergency Active</div>
              <div className="text-xs">SOS activated {formatTime(elapsedTime)} ago</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/20 hover:bg-white/30"
              onClick={() => setShowFakeExitModal(true)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container flex-1 p-2 md:p-4 space-y-4 overflow-auto">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Live Map */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                {isBrowser && (
                  <LiveMap
                    location={{ lat: 22.77, lng: 86.24 }}
                    showProtectors={true}
                    showPolice={true}
                    showRoutes={true}
                    viewType="emergency"
                  />
                )}
                <div className="absolute bottom-2 right-2">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                    Live Location Sharing
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Video Stream */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                {isBrowser && <VideoStream isActive={isVideoActive} isFrontCamera={isFrontCamera} />}
                <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                      onClick={toggleCamera}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                      onClick={toggleVideo}
                    >
                      {isVideoActive ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                      onClick={toggleAudio}
                    >
                      {isAudioActive ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                    {isVideoActive ? "Live Streaming" : "Video Paused"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Card className="bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <div className="text-xs font-medium text-green-800 dark:text-green-300">Police Notified</div>
                <div className="text-xs text-green-600 dark:text-green-400">ETA: 8 mins</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-3 flex items-center gap-2">
              <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="text-xs font-medium text-blue-800 dark:text-blue-300">Contacts Alerted</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">3 received</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-100 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <CardContent className="p-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <div>
                <div className="text-xs font-medium text-amber-800 dark:text-amber-300">Nearby Users</div>
                <div className="text-xs text-amber-600 dark:text-amber-400">7 within 2km</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <div>
                <div className="text-xs font-medium text-purple-800 dark:text-purple-300">Evidence</div>
                <div className="text-xs text-purple-600 dark:text-purple-400">Recording: {formatTime(elapsedTime)}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Emergency Timeline</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
              >
                {isTimelineExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
            {isBrowser && <EventTimeline expanded={isTimelineExpanded} />}
          </CardContent>
        </Card>

        {/* Nearby Users */}
        <Card>
          <CardContent className="p-3">
            <h3 className="text-sm font-medium mb-2">Nearby Users Alerted</h3>
            {isBrowser && <NearbyUsers enableMessaging={true} />}
          </CardContent>
        </Card>

        {/* Emergency Controls */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="destructive" className="w-full" onClick={endEmergency}>
            End Emergency
          </Button>
          <Button
            variant="outline"
            className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            onClick={() => setShowFakeExitModal(true)}
          >
            Fake Exit
          </Button>
        </div>
      </div>

      {isBrowser && showFakeExitModal && <FakeExitModal open={showFakeExitModal} onOpenChange={setShowFakeExitModal} />}
    </main>
  )
}
