/*"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Phone, Users, Shield, Video, MapPin, Bell } from "lucide-react"
import { useRouter } from "next/navigation"

interface FeatureExplanationDialogProps {
  onClose: () => void
}

export function FeatureExplanationDialog({ onClose }: FeatureExplanationDialogProps) {
  const [open, setOpen] = useState(true)
  const router = useRouter()

  const handleClose = () => {
    setOpen(false)
    onClose()
    router.push("/user-selection")
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) {
          handleClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">SafeGuard Features</DialogTitle>
          <DialogDescription className="text-center">
            Learn about the key features available in the app
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="protected" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="protected">Female User</TabsTrigger>
            <TabsTrigger value="protector">Male User</TabsTrigger>
          </TabsList>

          <TabsContent value="protected" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                  <Phone className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-medium">Emergency SOS</h3>
                  <p className="text-sm text-muted-foreground">
                    Instantly alert emergency contacts with your location, start video/audio recording, and notify
                    nearby users.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                  <Users className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-medium">Suspect Alert</h3>
                  <p className="text-sm text-muted-foreground">
                    Report suspicious activity to your contacts with your location and details about the situation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                  <Video className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">Video Recording</h3>
                  <p className="text-sm text-muted-foreground">
                    Record video evidence of your surroundings that can be shared with emergency contacts.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                  <MapPin className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium">Live Location</h3>
                  <p className="text-sm text-muted-foreground">
                    Share your real-time location with trusted contacts and see nearby protectors during emergencies.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="protector" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">Patrol Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Actively monitor alerts in your vicinity and respond to emergencies from protected users.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                  <MapPin className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium">Alert Radar</h3>
                  <p className="text-sm text-muted-foreground">
                    View real-time alerts on a map and navigate to users in need of assistance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                  <Phone className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-medium">Quick Actions</h3>
                  <p className="text-sm text-muted-foreground">
                    Quickly share your location, contact emergency services, or broadcast alerts to nearby users.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                  <Bell className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-medium">Demo Alert</h3>
                  <p className="text-sm text-muted-foreground">
                    Test the emergency response system with a simulated alert to understand how it works.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button className="w-full" onClick={handleClose}>
            Continue to App
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
