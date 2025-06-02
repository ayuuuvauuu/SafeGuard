"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, Navigation, AlertCircle } from "lucide-react"

interface AlertCardProps {
  alert: {
    id: string
    name: string
    type: string
    distance: string
    time: string
    status: string
  }
}

export function AlertCard({ alert }: AlertCardProps) {
  const handleRespond = () => {
    // Just show an alert instead of redirecting
    alert("Response sent to " + alert.name)
  }

  const handleCall = () => {
    alert("Calling " + alert.name)
  }

  const handleNavigate = () => {
    alert("Navigating to " + alert.name + "'s location")
  }

  return (
    <Card className="border-gray-800 bg-black text-white overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row items-stretch">
          <div
            className={`w-full sm:w-2 flex-shrink-0 ${alert.type === "emergency" ? "bg-red-600" : "bg-amber-600"}`}
          ></div>
          <div className="p-4 flex-grow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
              <div className="flex items-center gap-2 mb-2 sm:mb-0">
                <AlertCircle className={`h-5 w-5 ${alert.type === "emergency" ? "text-red-500" : "text-amber-500"}`} />
                <h3 className="font-semibold text-lg">{alert.name}</h3>
              </div>
              <Badge
                variant="outline"
                className={`${alert.status === "Active" ? "bg-green-900 text-green-100" : "bg-gray-800 text-gray-300"}`}
              >
                {alert.status}
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <div className="text-sm text-gray-400 mb-2 sm:mb-0">
                <span className="inline-block mr-3">
                  <span className="font-medium">Distance:</span> {alert.distance}
                </span>
                <span className="inline-block">
                  <span className="font-medium">Time:</span> {alert.time}
                </span>
              </div>
              <div className="text-sm">
                <Badge
                  className={`${
                    alert.type === "emergency" ? "bg-red-900 text-red-100" : "bg-amber-900 text-amber-100"
                  }`}
                >
                  {alert.type === "emergency" ? "Emergency SOS" : "Suspect Alert"}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleRespond}>
                Respond
              </Button>
              <Button className="w-full flex items-center justify-center gap-1" onClick={handleCall}>
                <Phone className="h-4 w-4" />
                <span>Call</span>
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-1"
                onClick={handleNavigate}
              >
                <Navigation className="h-4 w-4" />
                <span>Navigate</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
