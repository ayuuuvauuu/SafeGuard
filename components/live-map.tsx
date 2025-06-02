"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

// Dynamically import MapView with SSR disabled
const MapView = dynamic(() => import("./map-view").then((mod) => mod.MapView), { ssr: false })

interface LiveMapProps {
  location?: { lat: number; lng: number }
  showProtectors?: boolean
  showPolice?: boolean
  showRoutes?: boolean
  isProtector?: boolean
  alerts?: any[]
  isMedicalEmergency?: boolean
  onDeactivateMedical?: () => void
  viewType?: "female" | "male" | "emergency"
}

export function LiveMap({
  location,
  showProtectors = false,
  showPolice = false,
  showRoutes = false,
  isProtector = false,
  alerts = [],
  isMedicalEmergency = false,
  onDeactivateMedical,
  viewType,
}: LiveMapProps) {
  const [mapType, setMapType] = useState<"female" | "male" | "emergency">("female")

  useEffect(() => {
    // Determine map type based on props
    if (isProtector) {
      setMapType("male")
    } else if (showPolice || viewType === "emergency") {
      setMapType("emergency")
    } else {
      setMapType("female")
    }
  }, [isProtector, showPolice, viewType])

  return (
    <div className="w-full h-full relative">
      <MapView viewType={mapType} isMedicalEmergency={isMedicalEmergency} onDeactivateMedical={onDeactivateMedical} />
    </div>
  )
}

export default LiveMap
