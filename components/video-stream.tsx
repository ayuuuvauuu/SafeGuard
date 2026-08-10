"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { CameraOff, Camera, RefreshCw } from "lucide-react"

interface VideoStreamProps {
  isActive: boolean
  isFrontCamera: boolean
}

export function VideoStream({ isActive, isFrontCamera }: VideoStreamProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Request camera access
  useEffect(() => {
    // Only run this effect on the client side
    if (typeof window === "undefined" || !isActive) return

    let cancelled = false

    async function setupCamera() {
      try {
        const constraints = {
          video: {
            facingMode: isFrontCamera ? "user" : "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: true,
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
        if (cancelled) {
          mediaStream.getTracks().forEach((track) => track.stop())
          return
        }

        streamRef.current = mediaStream
        setHasPermission(true)
        setErrorMessage(null)

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (err: any) {
        console.error("Error accessing camera:", err)
        setHasPermission(false)
        setErrorMessage(err.message || "Could not access camera")
      }
    }

    setupCamera()

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [isActive, isFrontCamera])

  // TODO: Implement actual recording with MediaRecorder once a server/store
  // exists to accept the recorded blobs. Until then this stream is a live
  // preview only and is not persisted anywhere.
  if (!isActive) {
    return (
      <div className="w-full h-[250px] md:h-[300px] bg-gray-800 flex flex-col items-center justify-center text-white">
        <CameraOff className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">Camera is off</p>
        <p className="text-sm opacity-70 mt-1">Press Start Preview to activate</p>
      </div>
    )
  }

  // Error state
  if (hasPermission === false) {
    return (
      <div className="w-full h-[250px] md:h-[300px] bg-gray-800 flex flex-col items-center justify-center text-white p-4">
        <CameraOff className="h-12 w-12 mb-4 text-red-500" />
        <p className="text-lg font-medium">Camera Access Denied</p>
        <p className="text-sm opacity-70 mt-1 text-center">
          {errorMessage || "Please check your camera permissions in browser settings"}
        </p>
        <Button variant="outline" className="mt-4 bg-gray-700" onClick={() => setHasPermission(null)}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full h-[250px] md:h-[300px] bg-gray-800 relative">
      {/* Live video feed */}
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

      {/* Honest preview badge — no fake recording indicator */}
      <div className="absolute top-2 left-2 text-xs bg-black/60 text-yellow-300 px-2 py-1 rounded-full">
        PREVIEW - not recording
      </div>

      {/* Camera status indicator */}
      <div className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded-full">
        <Camera className="h-3 w-3 inline mr-1" />
        {isFrontCamera ? "Front Camera" : "Rear Camera"}
      </div>
    </div>
  )
}