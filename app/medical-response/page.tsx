"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Clock, Heart, Phone, Shield, Users, X, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Dynamically import components that use browser APIs with SSR disabled
const LiveMap = dynamic(() => import("@/components/live-map").then((mod) => mod.LiveMap), { ssr: false })
const EventTimeline = dynamic(() => import("@/components/event-timeline").then((mod) => mod.EventTimeline), {
  ssr: false,
})
const NearbyUsers = dynamic(() => import("@/components/nearby-users").then((mod) => mod.NearbyUsers), { ssr: false })

// Default location (Jamshedpur, India)
const defaultLocation = { lat: 22.77, lng: 86.24 }

export default function MedicalResponse() {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false)
  const [isBrowser, setIsBrowser] = useState(false)

  // Add state variables for medical information
  const [bloodType, setBloodType] = useState("")
  const [allergies, setAllergies] = useState("")
  const [conditions, setConditions] = useState("")
  const [medications, setMedications] = useState("")
  const [emergencyContact, setEmergencyContact] = useState("")
  const [contactPhone, setContactPhone] = useState("")

  // Set browser state
  useEffect(() => {
    setIsBrowser(true)

    // Load medical info from localStorage if available
    if (typeof window !== "undefined") {
      try {
        const savedMedicalInfo = localStorage.getItem("medicalInfo")
        if (savedMedicalInfo) {
          const parsedInfo = JSON.parse(savedMedicalInfo)
          setBloodType(parsedInfo.bloodType || "")
          setAllergies(parsedInfo.allergies || "")
          setConditions(parsedInfo.conditions || "")
          setMedications(parsedInfo.medications || "")
          setEmergencyContact(parsedInfo.emergencyContact || "")
          setContactPhone(parsedInfo.contactPhone || "")
        }
      } catch (error) {
        console.error("Error loading medical info:", error)
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

    // Update document title
    document.title = "🚑 MEDICAL EMERGENCY - SafeGuard"

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

  // Save medical info changes
  const saveMedicalInfo = () => {
    if (typeof window !== "undefined") {
      try {
        const medicalInfo = {
          bloodType,
          allergies,
          conditions,
          medications,
          emergencyContact,
          contactPhone,
        }
        localStorage.setItem("medicalInfo", JSON.stringify(medicalInfo))
        alert("Medical information updated successfully!")
      } catch (error) {
        console.error("Error saving medical info:", error)
        alert("Failed to save medical information.")
      }
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b bg-blue-600 text-white">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 animate-pulse" />
            <div>
              <div className="font-bold text-xl">Medical Emergency</div>
              <div className="text-xs">Activated {formatTime(elapsedTime)} ago</div>
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
              {isBrowser && <LiveMap location={defaultLocation} isMedicalEmergency={true} />}
              <div className="absolute bottom-2 right-2">
                <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                  Live Location Sharing
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Card className="bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="text-xs font-medium text-blue-800 dark:text-blue-300">Medical Services</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">ETA: 5 mins</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-3 flex items-center gap-2">
              <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <div className="text-xs font-medium text-green-800 dark:text-green-300">Contacts Alerted</div>
                <div className="text-xs text-green-600 dark:text-green-400">3 received</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-100 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <CardContent className="p-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <div>
                <div className="text-xs font-medium text-amber-800 dark:text-amber-300">Nearby Users</div>
                <div className="text-xs text-amber-600 dark:text-amber-400">5 within 2km</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <div>
                <div className="text-xs font-medium text-purple-800 dark:text-purple-300">Status</div>
                <div className="text-xs text-purple-600 dark:text-purple-400">Active: {formatTime(elapsedTime)}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Medical Information</h3>
              <Button size="sm" variant="outline" className="text-blue-500" onClick={saveMedicalInfo}>
                Save Changes
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label htmlFor="bloodType" className="text-muted-foreground">
                  Blood Type (optional):
                </Label>
                <Input
                  id="bloodType"
                  placeholder="e.g., O+"
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="allergies" className="text-muted-foreground">
                  Allergies (optional):
                </Label>
                <Input
                  id="allergies"
                  placeholder="e.g., Penicillin, Peanuts"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="conditions" className="text-muted-foreground">
                  Conditions (optional):
                </Label>
                <Input
                  id="conditions"
                  placeholder="e.g., Asthma, Hypertension"
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="medications" className="text-muted-foreground">
                  Medications (optional):
                </Label>
                <Input
                  id="medications"
                  placeholder="e.g., Albuterol, Lisinopril"
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="emergencyContact" className="text-muted-foreground">
                  Emergency Contact (optional):
                </Label>
                <Input
                  id="emergencyContact"
                  placeholder="e.g., Jane Doe"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contactPhone" className="text-muted-foreground">
                  Contact Phone (optional):
                </Label>
                <Input
                  id="contactPhone"
                  placeholder="e.g., +91 98765 43210"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

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

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="destructive" className="w-full" asChild>
            <Link href="/dashboard">End Emergency</Link>
          </Button>
          <Button variant="outline" className="w-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
            <Shield className="mr-2 h-4 w-4" />
            Call Emergency Services
          </Button>
        </div>
      </div>

      <Footer />
    </main>
  )
}
