export type MapViewType = "female" | "male" | "emergency"

export interface MapLocation {
  lat: number
  lng: number
}

export type MapAlertType = "emergency" | "suspect"

export interface MapAlert {
  id: string
  name: string
  type: MapAlertType
  markerType?: "circle" | "pin"
  location: MapLocation
  distance: string
  time: string
  status: string
}

export type ResponderKind = "ambulance" | "police" | "protector"

export interface ResponderUnit {
  id: string
  name: string
  type: ResponderKind
  location: MapLocation
  distance: string
  status: string
  initials?: string
}

// Single source of truth for the demo fallback location (Jamshedpur, India).
export const DEFAULT_LOCATION: MapLocation = { lat: 22.7744, lng: 86.2444 }