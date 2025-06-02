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
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Request camera access
  useEffect(() => {
    // Only run this effect on the client side
    if (typeof window === "undefined" || !isActive) return

    async function setupCamera() {
      try {
        if (isActive) {
          const constraints = {
            video: {
              facingMode: isFrontCamera ? "user" : "environment",
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: true,
          }

          const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
          setStream(mediaStream)
          setHasPermission(true)
          setErrorMessage(null)

          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream
          }
        }
      } catch (err: any) {
        console.error("Error accessing camera:", err)
        setHasPermission(false)
        setErrorMessage(err.message || "Could not access camera")
        setStream(null)
      }
    }

    setupCamera()

    // Cleanup
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
        setStream(null)
      }
    }
  }, [isActive, isFrontCamera])

  // Draw timestamp and recording indicator on canvas
  useEffect(() => {
    if (!canvasRef.current || !isActive || !hasPermission || typeof window === "undefined") return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number

    function drawOverlay() {
      if (!ctx || !canvas) return

      // Clear only the areas where we draw the overlay
      ctx.clearRect(0, 0, canvas.width, 30) // Top area for recording indicator
      ctx.clearRect(canvas.width - 150, canvas.height - 30, 150, 30) // Bottom right for timestamp

      // Add recording indicator
      ctx.fillStyle = "rgba(255, 0, 0, 0.7)"
      ctx.beginPath()
      ctx.arc(20, 20, 8, 0, Math.PI * 2)
      ctx.fill()

      // Add "REC" text
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.font = "12px sans-serif"
      ctx.fillText("REC", 35, 24)

      // Add timestamp
      const now = new Date()
      const timeString = now.toLocaleTimeString()
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(timeString, canvas.width - 10, canvas.height - 10)

      // Continue animation
      animationFrameId = requestAnimationFrame(drawOverlay)
    }

    // Set canvas size to match video
    function updateCanvasSize() {
      if (videoRef.current) {
        canvas.width = videoRef.current.clientWidth
        canvas.height = videoRef.current.clientHeight
      }
    }

    // Initial setup
    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)

    // Start animation
    drawOverlay()

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateCanvasSize)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isActive, hasPermission])

  // Fallback UI when camera is not active
  if (!isActive) {
    return (
      <div className="w-full h-[250px] md:h-[300px] bg-gray-800 flex flex-col items-center justify-center text-white">
        <CameraOff className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">Camera is off</p>
        <p className="text-sm opacity-70 mt-1">Press Start Recording to activate</p>
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

      {/* Overlay canvas for timestamp and recording indicator */}
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />

      {/* Camera status indicator */}
      <div className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded-full">
        <Camera className="h-3 w-3 inline mr-1" />
        {isFrontCamera ? "Front Camera" : "Rear Camera"}
      </div>
    </div>
  )
}
