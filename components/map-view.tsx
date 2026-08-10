"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import dynamic from "next/dynamic"
import { DEFAULT_LOCATION, MapLocation, MapAlert, MapViewType, ResponderUnit } from "./map-types"

// Dynamically import MapComponent with SSR disabled
const MapComponent = dynamic(() => import("./map-component").then((mod) => mod.MapComponent), { ssr: false })

export type { MapViewType }

interface MapViewProps {
  location?: MapLocation
  viewType?: MapViewType
  alerts?: MapAlert[]
  isMedicalEmergency?: boolean
  onDeactivateMedical?: () => void
}

export function MapView({
  location: externalLocation,
  viewType = "female",
  alerts: externalAlerts = [],
  isMedicalEmergency = false,
  onDeactivateMedical,
}: MapViewProps) {
  const defaultLocationRef = useRef<MapLocation>(externalLocation ?? DEFAULT_LOCATION)
  const [location, setLocation] = useState<MapLocation>(defaultLocationRef.current)
  const [ambulances, setAmbulances] = useState<ResponderUnit[]>([])
  const [policeUnits, setPoliceUnits] = useState<ResponderUnit[]>([])
  const [protectors, setProtectors] = useState<ResponderUnit[]>([])
  const watchIdRef = useRef<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [locationLoaded, setLocationLoaded] = useState(false)
  const initialLocationRef = useRef<MapLocation | null>(null)
  const [isBrowser, setIsBrowser] = useState(false)

  // Set browser state
  useEffect(() => {
    setIsBrowser(true)
  }, [])

  // Honor an externally-provided location (pages like travel/suspect/medical pass one)
  useEffect(() => {
    if (externalLocation) {
      setLocation(externalLocation)
      initialLocationRef.current = externalLocation
    }
  }, [externalLocation?.lat, externalLocation?.lng])

  // Real-time location tracking (skipped when a page provides the location)
  useEffect(() => {
    if (!isBrowser || externalLocation) return

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      simulateLocation() // Fallback to simulated location
      return
    }

    // First get a quick position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setLocation(newLocation)
        // Store initial location for stable marker positions
        if (!initialLocationRef.current) {
          initialLocationRef.current = newLocation
        }
        setLocationLoaded(true)
        setError(null)
      },
      (err) => {
        console.error("Error getting initial location:", err)
        // Fallback to simulated location
        simulateLocation()
        setLocationLoaded(true)
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 },
    )

    // Then start watching position with high accuracy
    try {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setLocation(newLocation)
          // Store initial location for stable marker positions if not already set
          if (!initialLocationRef.current) {
            initialLocationRef.current = newLocation
          }
          setLocationLoaded(true)
          setError(null)
        },
        (err) => {
          console.error("Error watching location:", err)
          if (!locationLoaded) {
            // Fallback to simulated location if we haven't loaded a location yet
            simulateLocation()
            setLocationLoaded(true)
          }
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 10000,
        },
      )
    } catch (error) {
      console.error("Error setting up geolocation watch:", error)
      simulateLocation()
    }

    // Cleanup function
    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        try {
          navigator.geolocation.clearWatch(watchIdRef.current)
        } catch (error) {
          console.error("Error clearing geolocation watch:", error)
        }
      }
    }
  }, [isBrowser, externalLocation])

  // Simulate location if geolocation fails
  const simulateLocation = () => {
    setLocation(DEFAULT_LOCATION)
    initialLocationRef.current = DEFAULT_LOCATION
  }

  // Prefer externally-provided alerts (e.g. protector dashboard) over generated ones.
  // Derived with useMemo rather than an effect + state: the default `[]` for
  // `externalAlerts` is a fresh array identity every render, so depending on it in an
  // effect would re-run and re-set state forever ("Maximum update depth exceeded").
  const renderedAlerts = useMemo<MapAlert[]>(() => {
    if (externalAlerts.length > 0) return externalAlerts
    if (viewType === "male" && !isMedicalEmergency) return generateAlerts(location)
    if (viewType === "emergency" || isMedicalEmergency) return generateEmergencyAlerts(location)
    return []
  }, [externalAlerts, viewType, isMedicalEmergency, location])

  // Generate ambulances for emergency view - update when location changes
  useEffect(() => {
    if (!isBrowser) return

    if (isMedicalEmergency || viewType === "emergency") {
      // Use current location for ambulances
      const baseLocation = location
      const generatedAmbulance = generateAmbulance(baseLocation)
      setAmbulances([generatedAmbulance])
    } else {
      setAmbulances([])
    }
  }, [location, viewType, isMedicalEmergency, isBrowser])

  // Generate police units for emergency view - update when location changes
  useEffect(() => {
    if (!isBrowser) return

    if (viewType === "emergency" || isMedicalEmergency) {
      // Use current location for police units
      const baseLocation = location
      const generatedPoliceUnits = generatePoliceUnits(baseLocation)
      setPoliceUnits(generatedPoliceUnits)
    } else {
      setPoliceUnits([])
    }
  }, [location, viewType, isMedicalEmergency, isBrowser])

  // Generate protectors for emergency view - update when location changes
  useEffect(() => {
    if (!isBrowser) return

    if (viewType === "emergency" || isMedicalEmergency) {
      // Use current location for protectors
      const baseLocation = location
      const generatedProtectors = generateProtectors(baseLocation)
      setProtectors(generatedProtectors)
    } else {
      setProtectors([])
    }
  }, [location, viewType, isMedicalEmergency, isBrowser])

  // Generate alerts from female users (for male dashboard)
  const generateAlerts = (center: MapLocation): MapAlert[] => {
    const degreesPerMeter = 0.00001
    const generatedAlerts: MapAlert[] = []

    // Generate exactly 2 alerts at fixed positions relative to the user
    // First alert - northeast of user (using red circle)
    generatedAlerts.push({
      id: "alert-1",
      name: "Divya",
      type: "emergency",
      markerType: "circle", // Use circle marker
      location: {
        lat: center.lat + 400 * degreesPerMeter,
        lng: center.lng + 100 * degreesPerMeter,
      },
      distance: "700m",
      time: typeof Date !== "undefined" ? `${new Date().toLocaleTimeString()}` : "Now",
      status: "Active",
    })

    // Second alert - southeast of user (using pin marker)
    generatedAlerts.push({
      id: "alert-2",
      name: "Pooja",
      type: "suspect",
      markerType: "pin", // Use pin marker
      location: {
        lat: center.lat - 300 * degreesPerMeter,
        lng: center.lng + 200 * degreesPerMeter,
      },
      distance: "600m",
      time: typeof Date !== "undefined" ? `${new Date().toLocaleTimeString()}` : "Now",
      status: "Active",
    })

    return generatedAlerts
  }

  // Generate emergency alerts
  const generateEmergencyAlerts = (center: MapLocation): MapAlert[] => {
    const generatedAlerts: MapAlert[] = []

    // Generate an emergency alert at the user's location
    generatedAlerts.push({
      id: "emergency-alert",
      name: "Your Emergency",
      type: "emergency",
      markerType: "circle", // Use circle marker
      location: {
        lat: center.lat,
        lng: center.lng,
      },
      distance: "0m",
      time: typeof Date !== "undefined" ? `${new Date().toLocaleTimeString()}` : "Now",
      status: "Active",
    })

    return generatedAlerts
  }

  // Generate a single ambulance (for emergency view)
  const generateAmbulance = (center: MapLocation): ResponderUnit => {
    const degreesPerMeter = 0.00001

    // Position ambulance to the east of the user (300m away)
    const distance = 300 * degreesPerMeter
    const lat = center.lat
    const lng = center.lng + distance

    return {
      id: "ambulance-1",
      name: "Ambulance 1",
      type: "ambulance",
      location: { lat, lng },
      distance: "300m",
      status: "On The Way",
    }
  }

  // Generate police units (for emergency view)
  const generatePoliceUnits = (center: MapLocation): ResponderUnit[] => {
    const degreesPerMeter = 0.00001
    const units: ResponderUnit[] = []

    // Add 1 police unit (200m southwest of user)
    const distance = 200 * degreesPerMeter
    const lat = center.lat - distance * 0.7
    const lng = center.lng - distance * 0.7

    units.push({
      id: "police-1",
      name: "Police Unit 1",
      type: "police",
      location: { lat, lng },
      distance: "200m",
      status: "On The Way",
    })

    return units
  }

  // Generate protectors (for emergency view)
  const generateProtectors = (center: MapLocation): ResponderUnit[] => {
    const degreesPerMeter = 0.00001
    const units: ResponderUnit[] = []

    // Add 3 protectors with initials - all within 400m of user
    // First protector - northwest of user (250m)
    units.push({
      id: "protector-1",
      name: "Rohan G.",
      initials: "RG",
      type: "protector",
      location: {
        lat: center.lat + 250 * degreesPerMeter,
        lng: center.lng - 250 * degreesPerMeter,
      },
      distance: "250m",
      status: "Responding",
    })

    // Second protector - southwest of user (300m)
    units.push({
      id: "protector-2",
      name: "Arjun P.",
      initials: "AP",
      type: "protector",
      location: {
        lat: center.lat - 300 * degreesPerMeter,
        lng: center.lng - 300 * degreesPerMeter,
      },
      distance: "300m",
      status: "Notified",
    })

    // Third protector - east of user (400m)
    units.push({
      id: "protector-3",
      name: "Karan S.",
      initials: "KS",
      type: "protector",
      location: {
        lat: center.lat + 200 * degreesPerMeter,
        lng: center.lng + 400 * degreesPerMeter,
      },
      distance: "400m",
      status: "On the way",
    })

    return units
  }

  return (
    <div className="w-full h-full relative">
      {error && (
        <div className="absolute top-2 left-2 right-2 z-10 bg-red-500 text-white p-2 rounded-md text-sm">{error}</div>
      )}

      {isMedicalEmergency && onDeactivateMedical && (
        <div className="absolute top-2 right-2 z-10">
          <Button
            onClick={onDeactivateMedical}
            className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
            size="sm"
          >
            <X className="h-4 w-4" />
            Deactivate Medical Emergency
          </Button>
        </div>
      )}

      {isBrowser && (
        <MapComponent
          location={location}
          viewType={viewType}
          alerts={renderedAlerts}
          ambulances={ambulances}
          policeUnits={policeUnits}
          protectors={protectors}
          isMedicalEmergency={isMedicalEmergency}
        />
      )}
    </div>
  )
}

export default MapView