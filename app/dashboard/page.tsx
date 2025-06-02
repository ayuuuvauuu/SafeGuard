"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Shield, Phone, Menu, UserIcon as Female, UserIcon as Male, Heart } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import ShakeDetector from "@/shakedector"

// Dynamically import components that use browser APIs with SSR disabled
const LiveMap = dynamic(() => import("@/components/live-map").then((mod) => mod.LiveMap), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-gray-800 flex items-center justify-center text-white">
      <p>Loading map...</p>
    </div>
  ),
})

const NearbyUsers = dynamic(() => import("@/components/nearby-users").then((mod) => mod.NearbyUsers), {
  ssr: false,
  loading: () => (
    <div className="space-y-2 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
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

// Dynamically import modals
const FakeExitModal = dynamic(() => import("@/components/fake-exit-modal").then((mod) => mod.FakeExitModal), {
  ssr: false,
})
const EmergencyModal = dynamic(() => import("@/components/emergency-modal").then((mod) => mod.EmergencyModal), {
  ssr: false,
})
const SuspectModal = dynamic(() => import("@/components/suspect-modal").then((mod) => mod.SuspectModal), { ssr: false })
const MedicalEmergencyModal = dynamic(
  () => import("@/components/medical-emergency-modal").then((mod) => mod.MedicalEmergencyModal),
  { ssr: false },
)
const EmergencyContactsModal = dynamic(
  () => import("@/components/emergency-contacts-modal").then((mod) => mod.EmergencyContactsModal),
  { ssr: false },
)

export default function Dashboard() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)
  const [showSuspectModal, setShowSuspectModal] = useState(false)
  const [showFakeExitModal, setShowFakeExitModal] = useState(false)
  const [showContactsModal, setShowContactsModal] = useState(false)
  const [showMedicalEmergencyModal, setShowMedicalEmergencyModal] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [medicalEmergencyActive, setMedicalEmergencyActive] = useState(false)
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(true)

    // Check URL parameters
    const action = searchParams?.get("action")
    if (action === "sos") {
      setShowEmergencyModal(true)
    } else if (action === "medical") {
      setShowMedicalEmergencyModal(true)
    }
  }, [searchParams])

  useEffect(() => {
    if (!isBrowser) return

    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode, isBrowser])

  useEffect(() => {
    if (!isBrowser || !medicalEmergencyActive) return

    try {
      const audio = new Audio("/alert-sound.mp3")
      audio.play().catch((e) => console.log("Audio play failed:", e))

      if (navigator.vibrate) {
        navigator.vibrate([300, 100, 300])
      }

      document.title = "🚨 MEDICAL EMERGENCY - SafeGuard"

      return () => {
        document.title = "SafeGuard"
      }
    } catch (error) {
      console.error("Browser API error:", error)
    }
  }, [medicalEmergencyActive, isBrowser])

  const switchToMale = () => {
    if (!isBrowser || medicalEmergencyActive) return // Prevent switching during medical emergency

    try {
      localStorage.setItem("userType", "male")
      router.push("/protector-dashboard")
    } catch (error) {
      console.error("localStorage error:", error)
      router.push("/protector-dashboard")
    }
  }

  const activateMedicalEmergency = () => {
    setMedicalEmergencyActive(true)
    setShowMedicalEmergencyModal(false)
  }

  const deactivateMedicalEmergency = () => {
    setMedicalEmergencyActive(false)
    if (isBrowser) {
      document.title = "SafeGuard"
    }
  }

  return (
    <main className={`min-h-screen bg-black ${medicalEmergencyActive ? "border-l-4 border-r-4 border-red-600" : ""}`}>
      <ShakeDetector />
      <div className="container py-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setShowContactsModal(true)} className="rounded-full">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">
              SafeGuard
              {medicalEmergencyActive && (
                <span className="ml-2 text-sm bg-red-600 text-white px-2 py-1 rounded-full animate-pulse">
                  Emergency Active
                </span>
              )}
            </h1>
          </div>
        </div>

        <Card className="md:col-span-2 mb-6 border-gray-800 bg-black text-white">
          <CardHeader>
            <CardTitle className="text-pink-500">Emergency Response</CardTitle>
            <CardDescription className="text-gray-400">Quick actions for emergency situations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                className="h-auto py-6 flex flex-col gap-2 bg-red-600 hover:bg-red-700 text-white"
                onClick={() => setShowEmergencyModal(true)}
              >
                <Phone className="h-6 w-6 mb-1" />
                <span className="text-base">Emergency SOS</span>
                <span className="text-xs font-normal">Alerts emergency contacts</span>
              </Button>
              <Button
                className="h-auto py-6 flex flex-col gap-2 bg-yellow-500 hover:bg-yellow-600 text-white"
                onClick={() => setShowSuspectModal(true)}
              >
                <Bell className="h-6 w-6 mb-1" />
                <span className="text-base">Suspect Alert</span>
                <span className="text-xs font-normal">Report suspicious activity</span>
              </Button>
              <Button
                className={`h-auto py-6 flex flex-col gap-2 ${
                  medicalEmergencyActive ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
                onClick={medicalEmergencyActive ? deactivateMedicalEmergency : () => setShowMedicalEmergencyModal(true)}
              >
                <Heart className="h-6 w-6 mb-1" />
                <span className="text-base">{medicalEmergencyActive ? "Deactivate Medical" : "Medical Emergency"}</span>
                <span className="text-xs font-normal">
                  {medicalEmergencyActive ? "End medical emergency" : "Request medical assistance"}
                </span>
              </Button>
              <Button
                className="h-auto py-6 flex flex-col gap-2 bg-black hover:bg-gray-900 text-white border border-gray-700"
                onClick={() => setShowFakeExitModal(true)}
              >
                <Shield className="h-6 w-6 mb-1" />
                <span className="text-base">Fake Exit</span>
                <span className="text-xs font-normal">Disguised app operation</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="map" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 bg-black border border-gray-800">
            <TabsTrigger value="map" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
              Live Map
            </TabsTrigger>
            <TabsTrigger value="nearby" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
              Nearby Users
            </TabsTrigger>
          </TabsList>
          <TabsContent value="map" className="mt-4">
            <Card className={`border-gray-800 bg-black text-white ${medicalEmergencyActive ? "border-red-600" : ""}`}>
              <CardHeader>
                <CardTitle className={medicalEmergencyActive ? "text-red-500" : "text-pink-500"}>
                  {medicalEmergencyActive ? "Medical Emergency - Live Location" : "Your Location"}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {medicalEmergencyActive
                    ? "Medical services have been notified of your location"
                    : "Real-time location tracking"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] relative">
                {isBrowser && (
                  <LiveMap
                    showProtectors={true}
                    showRoutes={false}
                    isMedicalEmergency={medicalEmergencyActive}
                    onDeactivateMedical={deactivateMedicalEmergency}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="nearby" className="mt-4">
            <Card className="border-gray-800 bg-black text-white">
              <CardHeader>
                <CardTitle className="text-pink-500">Nearby SafeGuard Users</CardTitle>
                <CardDescription className="text-gray-400">Other users within 150m radius</CardDescription>
              </CardHeader>
              <CardContent>{isBrowser && <NearbyUsers enableMessaging={true} hideStatus={true} />}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mb-8 border-gray-800 bg-black text-white">
          <CardHeader>
            <CardTitle className="text-pink-500">User Type</CardTitle>
            <CardDescription className="text-gray-400">Switch between female and male interfaces</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button className="bg-pink-600 hover:bg-pink-700 text-white" disabled>
                <Female className="mr-2 h-5 w-5" />
                <span className="text-sm sm:text-base">Female</span>
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={switchToMale}
                disabled={medicalEmergencyActive} // Disable button during medical emergency
                title={medicalEmergencyActive ? "End emergency first" : "Switch to male interface"}
              >
                <Male className="mr-2 h-5 w-5" />
                <span className="text-sm sm:text-base">Male</span>
                {medicalEmergencyActive && <span className="text-xs ml-1">(Disabled during emergency)</span>}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals - Only render on client side */}
      {isBrowser && (
        <>
          <EmergencyModal open={showEmergencyModal} onOpenChange={setShowEmergencyModal} />
          <SuspectModal open={showSuspectModal} onOpenChange={setShowSuspectModal} />
          <FakeExitModal open={showFakeExitModal} onOpenChange={setShowFakeExitModal} />
          <EmergencyContactsModal open={showContactsModal} onOpenChange={setShowContactsModal} />
          <MedicalEmergencyModal
            open={showMedicalEmergencyModal}
            onOpenChange={setShowMedicalEmergencyModal}
            onActivate={activateMedicalEmergency}
          />
        </>
      )}
    </main>
  )
}
