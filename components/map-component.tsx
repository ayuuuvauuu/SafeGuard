"use client"

import { LeafletMap } from "./leaflet-map"
import type { MapViewType } from "./map-view"

interface MapComponentProps {
  location: {
    lat: number
    lng: number
  }
  viewType?: MapViewType
  isProtector?: boolean
  alerts?: any[]
  ambulances?: any[]
  policeUnits?: any[]
  protectors?: any[]
  isMedicalEmergency?: boolean
}

export function MapComponent({
  location,
  viewType,
  isProtector = false,
  alerts = [],
  ambulances = [],
  policeUnits = [],
  protectors = [],
  isMedicalEmergency = false,
}: MapComponentProps) {
  const resolvedViewType: MapViewType = viewType ?? (isProtector ? "emergency" : "female")

  return (
    <div className="w-full h-full relative map-container">
      <LeafletMap
        location={location}
        viewType={resolvedViewType}
        alerts={alerts}
        ambulances={ambulances}
        policeUnits={policeUnits}
        protectors={protectors}
        isMedicalEmergency={isMedicalEmergency}
      />
    </div>
  )
}
