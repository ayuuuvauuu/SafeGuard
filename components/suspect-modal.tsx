"use client"

import { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, AlertCircle, Camera, Mic, MapPin, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface SuspectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Pre-defined suspect scenarios
const suspectScenarios = [
  {
    id: "following",
    label: "Someone is following me",
    description: "A person has been following me for some time and I feel unsafe.",
  },
  {
    id: "suspicious-person",
    label: "Suspicious person nearby",
    description: "There's a suspicious person loitering in the area.",
  },
  {
    id: "cab-driver",
    label: "Cab driver is suspicious",
    description: "My cab driver is behaving suspiciously and I'm concerned for my safety.",
  },
  {
    id: "group",
    label: "Suspicious group of people",
    description: "There's a group of people behaving suspiciously and making me uncomfortable.",
  },
]

export function SuspectModal({ open, onOpenChange }: SuspectModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState("following")
  const [customMessage, setCustomMessage] = useState("")
  const [showCamera, setShowCamera] = useState(false)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const router = useRouter()

  // Clean up camera resources when modal closes
  useEffect(() => {
    if (!open && streamRef.current) {
      stopCamera()
    }
  }, [open])

  // Default message based on selected scenario
  const getDefaultMessage = () => {
    const scenario = suspectScenarios.find((s) => s.id === selectedScenario)
    return scenario
      ? `I've noticed suspicious activity: ${scenario.description} I'm sharing my location for safety.`
      : ""
  }

  const handleSubmit = () => {
    setIsSubmitting(true)

    // Save captured photo to localStorage if available
    if (capturedPhoto && typeof window !== "undefined") {
      try {
        localStorage.setItem("suspectPhoto", capturedPhoto)
      } catch (error) {
        console.error("Error saving photo to localStorage:", error)
      }
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      onOpenChange(false)
      setCustomMessage("")
      setCapturedPhoto(null)
      setShowCamera(false)
      router.push("/suspect-status")
    }, 2000)
  }

  // Stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
  }

  // Start camera
  const startCamera = async () => {
    setCameraError(null)
    setShowCamera(true)

    try {
      // First check if we have permission
      const permissionStatus = await navigator.permissions.query({ name: "camera" as PermissionName })

      if (permissionStatus.state === "denied") {
        setCameraError("Camera permission denied. Please enable camera access in your browser settings.")
        setHasCameraPermission(false)
        setShowCamera(false)
        return
      }

      if (videoRef.current) {
        const constraints = {
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        streamRef.current = stream
        videoRef.current.srcObject = stream
        setHasCameraPermission(true)
      }
    } catch (err: any) {
      console.error("Error accessing camera:", err)
      setCameraError(err.message || "Could not access camera. Please check permissions.")
      setHasCameraPermission(false)
      setShowCamera(false)
    }
  }

  // Capture photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw video frame to canvas
      const context = canvas.getContext("2d")
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convert canvas to data URL
        try {
          const photoData = canvas.toDataURL("image/jpeg")
          setCapturedPhoto(photoData)

          // Stop camera stream
          stopCamera()
        } catch (error) {
          console.error("Error capturing photo:", error)
          setCameraError("Failed to capture photo. Please try again.")
        }
      }
    }
  }

  // Retake photo
  const retakePhoto = async () => {
    setCapturedPhoto(null)
    await startCamera()
  }

  // Close camera
  const closeCamera = () => {
    stopCamera()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen && showCamera) {
          stopCamera()
        }
        onOpenChange(newOpen)
      }}
    >
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800 text-white">
        {showCamera ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-yellow-500">Capture Photo Evidence</DialogTitle>

              <DialogDescription className="text-center text-gray-400">
                Take a photo of the suspicious person or situation
              </DialogDescription>
            </DialogHeader>

            {cameraError ? (
              <div className="p-4 bg-red-900/50 rounded-md text-center">
                <p className="text-red-200 mb-2">{cameraError}</p>
                <button
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
                  onClick={() => setShowCamera(false)}
                >
                  Go Back
                </button>
              </div>
            ) : (
              <>
                <div className="relative mt-2 bg-black rounded-md overflow-hidden">
                  {capturedPhoto ? (
                    <img
                      src={capturedPhoto || "/placeholder.svg"}
                      alt="Captured evidence"
                      className="w-full h-auto max-h-[300px] object-contain"
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-[300px] object-cover"
                      onLoadedMetadata={() => {
                        // Ensure video is playing
                        if (videoRef.current) {
                          videoRef.current.play().catch((e) => {
                            console.error("Error playing video:", e)
                          })
                        }
                      }}
                    />
                  )}
                  <canvas ref={canvasRef} className="hidden" />

                  <div className="absolute bottom-2 right-2">
                    <button
                      className="bg-gray-800/80 backdrop-blur-sm text-white py-1 px-2 rounded-md text-sm flex items-center"
                      onClick={closeCamera}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </button>
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  {capturedPhoto ? (
                    <div className="flex gap-2">
                      <button
                        className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
                        onClick={retakePhoto}
                      >
                        Retake Photo
                      </button>
                      <button
                        className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md transition-colors"
                        onClick={() => setShowCamera(false)}
                      >
                        Use Photo
                      </button>
                    </div>
                  ) : (
                    <button
                      className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md transition-colors"
                      onClick={capturePhoto}
                    >
                      Capture Photo
                    </button>
                  )}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-yellow-500 flex items-center justify-center gap-2">
                <AlertCircle className="h-6 w-6" />
                Suspect Alert
              </DialogTitle>
              <DialogDescription className="text-center text-gray-400">
                Report suspicious activity and alert your emergency contacts
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4">
              <div className="grid grid-cols-3 gap-4 w-full">
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-gray-800 p-3 mb-2">
                    <MapPin className="h-6 w-6 text-yellow-500" />
                  </div>
                  <span className="text-xs text-center">
                    Location
                    <br />
                    Sharing
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-gray-800 p-3 mb-2">
                    <Camera className="h-6 w-6 text-yellow-500" />
                  </div>
                  <span className="text-xs text-center">
                    Photo
                    <br />
                    Capture
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-gray-800 p-3 mb-2">
                    <Mic className="h-6 w-6 text-yellow-500" />
                  </div>
                  <span className="text-xs text-center">
                    Audio
                    <br />
                    Note
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="suspect-scenario" className="text-gray-300">
                  Select Suspicious Activity
                </Label>
                <RadioGroup
                  id="suspect-scenario"
                  value={selectedScenario}
                  onValueChange={setSelectedScenario}
                  className="space-y-2"
                >
                  {suspectScenarios.map((scenario) => (
                    <div key={scenario.id} className="flex items-start space-x-2 border border-gray-700 p-3 rounded-md">
                      <RadioGroupItem value={scenario.id} id={scenario.id} className="mt-1 text-yellow-500" />
                      <div className="grid gap-1.5">
                        <Label htmlFor={scenario.id} className="font-medium text-white">
                          {scenario.label}
                        </Label>
                        <p className="text-sm text-gray-400">{scenario.description}</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional-details" className="text-gray-300">
                  Additional Details (Optional)
                </Label>
                <Textarea
                  id="additional-details"
                  placeholder="Add any additional details about the situation..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={2}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              {capturedPhoto && (
                <div className="space-y-2">
                  <Label className="text-gray-300">Photo Evidence</Label>
                  <div className="relative border border-gray-700 rounded-md overflow-hidden">
                    <img
                      src={capturedPhoto || "/placeholder.svg"}
                      alt="Captured evidence"
                      className="w-full h-auto max-h-[150px] object-contain"
                    />
                    <button
                      className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full bg-gray-800/80 flex items-center justify-center"
                      onClick={() => setCapturedPhoto(null)}
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>
              )}

              {!capturedPhoto && (
                <button
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                  onClick={startCamera}
                >
                  <Camera className="h-4 w-4" />
                  Capture Photo Evidence
                </button>
              )}
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <button
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </button>
              <button
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Alert"
                )}
              </button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
