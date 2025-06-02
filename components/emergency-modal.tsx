"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle, Camera, Mic, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface EmergencyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Pre-defined emergency scenarios
const emergencyScenarios = [
  {
    id: "general",
    label: "General Emergency",
    message: "I'm in an emergency situation. Please help me. My current location is being shared with you.",
  },
  {
    id: "following",
    label: "Someone is following me",
    message: "Someone is following me and I feel unsafe. Please check on me and track my location.",
  },
  {
    id: "threatened",
    label: "I'm being threatened",
    message: "I'm being threatened and feel in danger. Please help me immediately. My location is being shared.",
  },
]

export function EmergencyModal({ open, onOpenChange }: EmergencyModalProps) {
  const [isActivated, setIsActivated] = useState(false)
  const [countdown, setCountdown] = useState(3) // Changed from 5 to 3
  const [selectedScenario, setSelectedScenario] = useState("general")
  const [customMessage, setCustomMessage] = useState("")
  const router = useRouter()

  const activateEmergency = () => {
    setIsActivated(true)

    // Simulate countdown
    let count = 3 // Changed from 5 to 3
    const timer = setInterval(() => {
      count -= 1
      setCountdown(count)

      if (count <= 0) {
        clearInterval(timer)
        // In a real app, this would trigger the emergency protocol
        setTimeout(() => {
          onOpenChange(false)
          setIsActivated(false)
          setCountdown(3) // Changed from 5 to 3
          router.push("/emergency-response")
        }, 1000)
      }
    }, 1000)
  }

  const cancelEmergency = () => {
    setIsActivated(false)
    setCountdown(3) // Changed from 5 to 3
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-black border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-red-500 flex items-center justify-center gap-2">
            <AlertCircle className="h-6 w-6" />
            Emergency SOS
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            {isActivated ? "SOS will be activated in:" : "This will alert your emergency contacts and start recording"}
          </DialogDescription>
        </DialogHeader>

        {isActivated ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="text-6xl font-bold text-red-500 mb-6">{countdown}</div>
            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-black p-3 mb-2 border border-gray-800">
                  <MapPin className="h-6 w-6 text-red-500" />
                </div>
                <span className="text-xs text-center">
                  Location
                  <br />
                  Sharing
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-black p-3 mb-2 border border-gray-800">
                  <Camera className="h-6 w-6 text-red-500" />
                </div>
                <span className="text-xs text-center">
                  Video
                  <br />
                  Recording
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-black p-3 mb-2 border border-gray-800">
                  <Mic className="h-6 w-6 text-red-500" />
                </div>
                <span className="text-xs text-center">
                  Audio
                  <br />
                  Recording
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <p className="mb-2 text-center">When activated, SafeGuard will:</p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <span>Send alerts with your live location to all emergency contacts</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <span>Start video and audio recording</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <span>Alert nearby app users who can help</span>
              </li>
            </ul>

            <div className="space-y-2">
              <Label htmlFor="emergency-scenario" className="text-gray-300">
                Select Emergency Scenario
              </Label>
              <RadioGroup
                id="emergency-scenario"
                value={selectedScenario}
                onValueChange={setSelectedScenario}
                className="space-y-2"
              >
                {emergencyScenarios.map((scenario) => (
                  <div key={scenario.id} className="flex items-start space-x-2 border border-gray-700 p-3 rounded-md">
                    <RadioGroupItem value={scenario.id} id={scenario.id} className="mt-1 text-red-500" />
                    <div className="grid gap-1.5">
                      <Label htmlFor={scenario.id} className="font-medium text-white">
                        {scenario.label}
                      </Label>
                      <p className="text-sm text-gray-400">{scenario.message}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-message" className="text-gray-300">
                Additional Details (Optional)
              </Label>
              <Textarea
                id="custom-message"
                placeholder="Add any additional details about your situation..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={2}
                className="bg-black border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {isActivated ? (
            <button
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
              onClick={cancelEmergency}
            >
              Cancel
            </button>
          ) : (
            <>
              <button
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </button>
              <button
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md transition-colors"
                onClick={activateEmergency}
              >
                Activate SOS
              </button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
