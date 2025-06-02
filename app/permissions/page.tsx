"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, MapPin, Mic, Camera, Bell } from "lucide-react"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function Permissions() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // In a real app, you would request these permissions
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">App Permissions</CardTitle>
          <CardDescription>SafeGuard needs these permissions to protect you in emergency situations</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <Label htmlFor="location" className="text-base font-medium">
                    Location
                  </Label>
                  <p className="text-sm text-muted-foreground">Share your location in emergencies</p>
                </div>
              </div>
              <Switch id="location" defaultChecked />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <Label htmlFor="camera" className="text-base font-medium">
                    Camera
                  </Label>
                  <p className="text-sm text-muted-foreground">Record video during emergencies</p>
                </div>
              </div>
              <Switch id="camera" defaultChecked />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Mic className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <Label htmlFor="microphone" className="text-base font-medium">
                    Microphone
                  </Label>
                  <p className="text-sm text-muted-foreground">Record audio during emergencies</p>
                </div>
              </div>
              <Switch id="microphone" defaultChecked />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <Label htmlFor="notifications" className="text-base font-medium">
                    Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">Receive safety alerts and updates</p>
                </div>
              </div>
              <Switch id="notifications" defaultChecked />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Grant Permissions"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
