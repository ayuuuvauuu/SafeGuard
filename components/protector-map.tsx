"use client"

import { useState, useEffect } from "react"
import { MapComponent } from "./map-component"

interface ProtectorMapProps {
  alerts?: any[]
}

export function ProtectorMap({ alerts: initialAlerts = [] }: ProtectorMapProps) {
  const [location, setLocation] = useState({ lat: 22.7744, lng: 84.2444 }) // Default: ghs
  const [routes, setRoutes] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>(initialAlerts)

  // Simulate getting user's location
  useEffect(() => {
    // In a real app, we would use the Geolocation API
    // For demo, we'll just set a random location near the default
    const randomOffset = () => (Math.random() - 0.5) * 0.01

    setTimeout(() => {
      setLocation({
        lat: 22.7744 + randomOffset(),
        lng: 84.2444 + randomOffset(),
      })
    }, 1000)
  }, [])

  // Generate sample alerts if none provided
  useEffect(() => {
    if (initialAlerts.length === 0) {
      // Create sample alerts near user location
      const sampleAlerts = [
        {
          id: "alert-1",
          name: "Sarah Johnson",
          type: "emergency",
          location: {
            lat: location.lat + 0.003,
            lng: location.lng + 0.002,
          },
          distance: "300m",
          time: "2 min ago",
          status: "Active",
        },
        {
          id: "alert-2",
          name: "Emily Davis",
          type: "alert",
          location: {
            lat: location.lat - 0.002,
            lng: location.lng + 0.004,
          },
          distance: "450m",
          time: "5 min ago",
          status: "Active",
        },
      ]
      setAlerts(sampleAlerts)
    }
  }, [location, initialAlerts])

  // Create routes to alerts
  useEffect(() => {
    if (alerts.length > 0) {
      const alertRoutes = alerts.map((alert) => ({
        id: `route-${alert.id}`,
        from: location,
        to: alert.location,
        color: alert.type === "emergency" ? "#ef4444" : "#f59e0b",
      }))
      setRoutes(alertRoutes)
    }
  }, [location, alerts])

  return (
    <div className="w-full h-full relative map-container">
      <MapComponent location={location} isProtector={true} alerts={alerts} routes={routes} />
    </div>
  )
}
