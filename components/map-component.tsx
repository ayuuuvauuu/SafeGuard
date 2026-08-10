"use client"

import { LeafletMap } from "./leaflet-map"
import { MapAlert, MapLocation, MapViewType, ResponderUnit } from "./map-types"

interface MapComponentProps {
  location: MapLocation
  viewType?: MapViewType
  isProtector?: boolean
  alerts?: MapAlert[]
  ambulances?: ResponderUnit[]
  policeUnits?: ResponderUnit[]
  protectors?: ResponderUnit[]
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