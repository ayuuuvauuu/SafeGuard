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
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X, Shield, Bell, MapPin, Phone, Users } from "lucide-react"

interface AppTutorialProps {
  userType: "female" | "male"
  onClose: () => void
}

export function AppTutorial({ userType, onClose }: AppTutorialProps) {
  const [open, setOpen] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)

  // Define tutorial steps based on user type
  const femaleSteps = [
    {
      title: "Welcome to SafeGuard",
      description: "Your personal safety companion. Let's walk through the key features.",
      icon: <Shield className="h-12 w-12 text-pink-500" />,
    },
    {
      title: "Emergency SOS",
      description: "Quickly activate emergency mode to alert contacts, record video/audio, and share your location.",
      icon: <Phone className="h-12 w-12 text-pink-500" />,
    },
    {
      title: "Suspect Alert",
      description: "Report suspicious activity with photo evidence and location sharing.",
      icon: <Bell className="h-12 w-12 text-pink-500" />,
    },
    {
      title: "Live Location",
      description: "View your location and see nearby protectors who can help in emergencies.",
      icon: <MapPin className="h-12 w-12 text-pink-500" />,
    },
    {
      title: "Emergency Contacts",
      description: "Add family members and friends who will be notified during emergencies.",
      icon: <Users className="h-12 w-12 text-pink-500" />,
    },
  ]

  const maleSteps = [
    {
      title: "Welcome to SafeGuard",
      description: "Your platform to help provide safety to others. Let's walk through the key features.",
      icon: <Shield className="h-12 w-12 text-blue-500" />,
    },
    {
      title: "Alert Radar",
      description: "Monitor real-time alerts from users in your vicinity who need assistance.",
      icon: <Bell className="h-12 w-12 text-blue-500" />,
    },
    {
      title: "Quick Actions",
      description: "Quickly share your location, contact emergency services, or broadcast alerts.",
      icon: <Phone className="h-12 w-12 text-blue-500" />,
    },
    {
      title: "Patrol Mode",
      description: "Actively monitor your area for any emergency alerts from protected users.",
      icon: <MapPin className="h-12 w-12 text-blue-500" />,
    },
    {
      title: "Response Tools",
      description: "Navigate to users in need and communicate with them during emergencies.",
      icon: <Users className="h-12 w-12 text-blue-500" />,
    },
  ]

  const steps = userType === "female" ? femaleSteps : maleSteps
  const accentColor = userType === "female" ? "pink" : "blue"

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleClose()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="absolute right-4 top-4">
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-6 w-6 rounded-full">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <div className={`flex justify-center mb-4 text-${accentColor}-500`}>{steps[currentStep].icon}</div>
          <DialogTitle className="text-xl text-center">{steps[currentStep].title}</DialogTitle>
          <DialogDescription className="text-center">{steps[currentStep].description}</DialogDescription>
        </DialogHeader>

        <div className="flex justify-center mt-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 w-8 mx-1 rounded-full ${
                index === currentStep ? `bg-${accentColor}-500` : "bg-gray-300 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>

        <DialogFooter className="flex flex-row justify-between mt-6">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0} className="px-3">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Skip
            </Button>
          </div>
          <Button onClick={handleNext} className={`bg-${accentColor}-500 hover:bg-${accentColor}-600`}>
            {currentStep === steps.length - 1 ? "Get Started" : "Next"}
            {currentStep !== steps.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
