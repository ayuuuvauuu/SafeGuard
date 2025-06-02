"use client"

import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { Button } from "@/components/ui/button"
import { Phone, Navigation } from "lucide-react"
import {
  createUserLocationMarker,
  createAlertMarker,
  createAlertPinMarker,
  createAmbulanceMarker,
  createPoliceMarker,
  createProtectorMarker,
  createProtectorInitialsMarker,
} from "./user-marker"
import type { MapViewType } from "./map-view"

interface LeafletMapProps {
  location: {
    lat: number
    lng: number
  }
  viewType: MapViewType
  alerts?: any[]
  ambulances?: any[]
  policeUnits?: any[]
  protectors?: any[]
  isMedicalEmergency?: boolean
}

// Component to recenter map when location changes
function RecenterAutomatically({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  const initialZoomRef = useRef(map.getZoom())

  useEffect(() => {
    map.setView([lat, lng], initialZoomRef.current)
  }, [lat, lng, map])

  return null
}

export function LeafletMap({
  location,
  viewType,
  alerts = [],
  ambulances = [],
  policeUnits = [],
  protectors = [],
  isMedicalEmergency = false,
}: LeafletMapProps) {
  // Create icons
  const userIcon = createUserLocationMarker(isMedicalEmergency)
  const alertCircleIcon = createAlertMarker()
  const alertPinIcon = createAlertPinMarker()
  const ambulanceIcon = createAmbulanceMarker()
  const policeIcon = createPoliceMarker()
  const protectorIcon = createProtectorMarker()

  // Determine circle color based on view type and emergency state
  const getCircleColor = () => {
    if (isMedicalEmergency) return "red"
    if (viewType === "female") return "pink"
    if (viewType === "male") return "blue"
    return "green"
  }

  return (
    <div className="map-container w-full h-full">
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={15}
        className="w-full h-full"
        style={{ height: "100%", width: "100%", minHeight: "300px" }}
        attributionControl={false}
        zoomControl={true}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Auto-recenter component */}
        <RecenterAutomatically lat={location.lat} lng={location.lng} />

        {/* User's location marker */}
        <Marker position={[location.lat, location.lng]} icon={userIcon}>
          <Popup>
            <div className="text-center">
              <p className="font-medium">Your Current Location</p>
              <p className="text-xs text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</p>
              {isMedicalEmergency && <p className="text-xs text-red-500 font-bold mt-1">MEDICAL EMERGENCY ACTIVE</p>}
            </div>
          </Popup>
        </Marker>

        {/* Location radius circle */}
        <Circle
          center={[location.lat, location.lng]}
          radius={500}
          pathOptions={{
            color: getCircleColor(),
            fillColor: getCircleColor(),
            fillOpacity: 0.1,
            weight: isMedicalEmergency ? 2 : 1,
          }}
        />

        {/* Alert markers with different icon types */}
        {alerts.map((alert) => (
          <Marker
            key={alert.id}
            position={[alert.location.lat, alert.location.lng]}
            icon={alert.markerType === "pin" ? alertPinIcon : alertCircleIcon}
          >
            <Popup>
              <div className="text-center p-1">
                <p className="font-medium">{alert.name}</p>
                <p className="text-xs text-red-500 uppercase font-bold mb-2">
                  {alert.type === "emergency" ? "Emergency SOS" : "Suspect Alert"}
                </p>
                <p className="text-xs mb-2">
                  {alert.distance} away • {alert.time}
                </p>
                <div className="flex gap-1 mt-1">
                  <Button size="sm" className="w-full flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>Call</span>
                  </Button>
                  <Button size="sm" variant="outline" className="w-full flex items-center gap-1">
                    <Navigation className="h-3 w-3" />
                    <span>Navigate</span>
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Ambulance markers (only for emergency view or medical emergency) */}
        {(viewType === "emergency" || isMedicalEmergency) &&
          ambulances.map((ambulance) => (
            <Marker key={ambulance.id} position={[ambulance.location.lat, ambulance.location.lng]} icon={ambulanceIcon}>
              <Popup>
                <div className="text-center p-1">
                  <p className="text-sm font-semibold mb-1">{ambulance.name}</p>
                  <p className="text-xs uppercase font-bold mb-1 text-red-500">Medical Services</p>
                  <p className="text-xs mb-1">
                    {ambulance.distance} away • {ambulance.status}
                  </p>
                  <div className="flex gap-1 mt-1">
                    <Button size="sm" className="w-full flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>Call</span>
                    </Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Police unit markers (only for emergency view) */}
        {(viewType === "emergency" || isMedicalEmergency) &&
          policeUnits.map((police) => (
            <Marker key={police.id} position={[police.location.lat, police.location.lng]} icon={policeIcon}>
              <Popup>
                <div className="text-center p-1">
                  <p className="text-sm font-semibold mb-1">{police.name}</p>
                  <p className="text-xs uppercase font-bold mb-1 text-blue-500">Police Unit</p>
                  <p className="text-xs mb-1">
                    {police.distance} away • {police.status}
                  </p>
                  <div className="flex gap-1 mt-1">
                    <Button size="sm" className="w-full flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>Call</span>
                    </Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Protector markers with initials */}
        {(viewType === "emergency" || isMedicalEmergency) &&
          protectors.map((protector) => (
            <Marker
              key={protector.id}
              position={[protector.location.lat, protector.location.lng]}
              icon={protector.initials ? createProtectorInitialsMarker(protector.initials) : protectorIcon}
            >
              <Popup>
                <div className="text-center p-1">
                  <p className="text-sm font-semibold mb-1">{protector.name}</p>
                  <p className="text-xs uppercase font-bold mb-1 text-green-500">Protector</p>
                  <p className="text-xs mb-1">
                    {protector.distance} away • {protector.status}
                  </p>
                  <div className="flex gap-1 mt-1">
                    <Button size="sm" className="w-full flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>Call</span>
                    </Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  )
}
