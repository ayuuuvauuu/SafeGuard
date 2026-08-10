"use client"

import dynamic from "next/dynamic"
import { MapAlert, MapLocation, MapViewType } from "./map-types"

// Dynamically import MapView with SSR disabled
const MapView = dynamic(() => import("./map-view").then((mod) => mod.MapView), { ssr: false })

interface LiveMapProps {
  location?: MapLocation
  isProtector?: boolean
  alerts?: MapAlert[]
  isMedicalEmergency?: boolean
  onDeactivateMedical?: () => void
  viewType?: MapViewType
}

export function LiveMap({
  location,
  isProtector = false,
  alerts = [],
  isMedicalEmergency = false,
  onDeactivateMedical,
  viewType,
}: LiveMapProps) {
  const mapType: MapViewType = viewType ?? (isProtector ? "male" : "female")

  return (
    <div className="w-full h-full relative">
      <MapView
        location={location}
        viewType={mapType}
        alerts={alerts}
        isMedicalEmergency={isMedicalEmergency}
        onDeactivateMedical={onDeactivateMedical}
      />
    </div>
  )
}

export default LiveMap