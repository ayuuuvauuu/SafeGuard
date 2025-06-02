"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Bell, Shield, UserIcon as Female, UserIcon as Male } from "lucide-react"
import { Footer } from "@/components/footer"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

// Dynamically import components
const LiveMap = dynamic(() => import("@/components/live-map").then((mod) => mod.LiveMap), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-gray-800 flex items-center justify-center text-white">
      <p>Loading map...</p>
    </div>
  ),
})

const AlertCard = dynamic(() => import("@/components/alert-card").then((mod) => mod.AlertCard), { ssr: false })
const DemoAlertModal = dynamic(() => import("@/components/demo-alert-modal").then((mod) => mod.DemoAlertModal), {
  ssr: false,
})

// Sample data for alerts - exactly 2 alerts as requested
const activeAlerts = [
  {
    id: "1",
    name: "Mamata Banerjee",
    type: "emergency",
    distance: "1.2 km",
    time: "2 mins ago",
    status: "Active",
    location: { lat: 22.78, lng: 86.25 },
  },
  {
    id: "2",
    name: "Mayawati",
    type: "suspect",
    distance: "0.8 km",
    time: "5 mins ago",
    status: "Active",
    location: { lat: 22.76, lng: 86.23 },
  },
]

const historyAlerts = [
  {
    id: "3",
    name: "Mehbooba Mufti",
    type: "emergency",
    distance: "1.5 km",
    time: "15 mins ago",
    status: "Resolved",
    location: { lat: 22.79, lng: 86.22 },
  },
  {
    id: "4",
    name: "Uorfi Javed",
    type: "suspect",
    distance: "2.1 km",
    time: "30 mins ago",
    status: "Resolved",
    location: { lat: 22.75, lng: 86.26 },
  },
  {
    id: "5",
    name: "Rakhi Sawant",
    type: "emergency",
    distance: "1.8 km",
    time: "45 mins ago",
    status: "Resolved",
    location: { lat: 22.77, lng: 86.27 },
  },
]

export default function ProtectorDashboard() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(true)
  const [showDemoModal, setShowDemoModal] = useState(false)
  const [isBrowser, setIsBrowser] = useState(false)

  // Set browser state
  useEffect(() => {
    setIsBrowser(true)

    // Set dark mode
    if (typeof document !== "undefined") {
      document.documentElement.classList.add("dark")
    }
  }, [])

  // Switch to female interface
  const switchToFemale = () => {
    if (!isBrowser) return

    try {
      localStorage.setItem("userType", "female")
      router.push("/dashboard")
    } catch (error) {
      console.error("localStorage error:", error)
      router.push("/dashboard")
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container py-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">SafeGuard</h1>
            <p className="text-sm text-muted-foreground">Protector Dashboard</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="col-span-full border-blue-500/20">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Protector Status</CardTitle>
                  <CardDescription>You are actively monitoring nearby alerts</CardDescription>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="default"
                  className="flex flex-col items-center gap-1 h-auto py-3 bg-blue-600 hover:bg-blue-700"
                >
                  <Shield className="h-5 w-5" />
                  <span>Patrol Mode</span>
                  <span className="text-xs text-blue-100">Active monitoring</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-1 h-auto py-3 border-blue-500/50"
                  onClick={() => setShowDemoModal(true)}
                >
                  <Bell className="h-5 w-5 text-blue-500" />
                  <span className="text-blue-500 dark:text-blue-400">Demo Alert</span>
                  <span className="text-xs text-muted-foreground">Test features</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full md:col-span-2 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Alert Radar</CardTitle>
              <CardDescription className="text-sm md:text-base">Alerts from users in your vicinity</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isBrowser && <LiveMap isProtector={true} viewType="male" alerts={activeAlerts} />}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active Alerts</TabsTrigger>
            <TabsTrigger value="history">Alert History</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-4 space-y-4">
            {activeAlerts.length > 0 && isBrowser ? (
              activeAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No active alerts at this time.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="history" className="mt-4 space-y-4">
            {historyAlerts.length > 0 && isBrowser ? (
              historyAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No alert history available.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* User Type Switcher */}
        <Card className="mb-8 border-blue-500/20">
          <CardHeader>
            <CardTitle>User Type</CardTitle>
            <CardDescription>Switch between male and female interfaces</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="bg-pink-500 hover:bg-pink-600 h-auto py-4 flex items-center justify-center"
                onClick={switchToFemale}
              >
                <Female className="mr-2 h-5 w-5" />
                <span className="text-sm sm:text-base">Female</span>
              </Button>
              <Button
                variant="default"
                className="bg-blue-500 hover:bg-blue-600 h-auto py-4 flex items-center justify-center"
                disabled
              >
                <Male className="mr-2 h-5 w-5" />
                <span className="text-sm sm:text-base">Male</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demo Alert Modal */}
      {isBrowser && <DemoAlertModal open={showDemoModal} onOpenChange={setShowDemoModal} />}

      <Footer />
    </main>
  )
}
