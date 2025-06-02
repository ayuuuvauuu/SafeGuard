"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import MapComponent with SSR disabled
const MapComponent = dynamic(() => import("./map-component").then((mod) => mod.MapComponent), { ssr: false })

export type MapViewType = "female" | "male" | "emergency"

interface MapViewProps {
  viewType?: MapViewType
  isMedicalEmergency?: boolean
  onDeactivateMedical?: () => void
}

export function MapView({ viewType = "female", isMedicalEmergency = false, onDeactivateMedical }: MapViewProps) {
  const [location, setLocation] = useState({ lat: 22.7744, lng: 84.2444 }) // Default: ghs
  const [alerts, setAlerts] = useState<any[]>([])
  const [ambulances, setAmbulances] = useState<any[]>([])
  const [policeUnits, setPoliceUnits] = useState<any[]>([])
  const [protectors, setProtectors] = useState<any[]>([])
  const watchIdRef = useRef<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [locationLoaded, setLocationLoaded] = useState(false)
  const initialLocationRef = useRef<{ lat: number; lng: number } | null>(null)
  const [isBrowser, setIsBrowser] = useState(false)

  // Set browser state
  useEffect(() => {
    setIsBrowser(true)
  }, [])

  // Real-time location tracking
  useEffect(() => {
    if (!isBrowser) return

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
  }, [isBrowser])

  // Simulate location if geolocation fails
  const simulateLocation = () => {
    // Use a more realistic default location (Jamshedpur, India)
    const newLocation = {
      lat: 22.8046,
      lng: 86.2029,
    }
    setLocation(newLocation)
    initialLocationRef.current = newLocation
  }

  // Generate alerts for male dashboard
  useEffect(() => {
    if (!isBrowser) return

    if (viewType === "male" && !isMedicalEmergency) {
      // Use current location for alerts
      const baseLocation = location
      const generatedAlerts = generateAlerts(baseLocation)
      setAlerts(generatedAlerts)
    } else if (viewType === "emergency" || isMedicalEmergency) {
      // For emergency view, generate emergency alerts
      const baseLocation = location
      const emergencyAlerts = generateEmergencyAlerts(baseLocation)
      setAlerts(emergencyAlerts)
    } else {
      setAlerts([])
    }
  }, [location, viewType, isMedicalEmergency, isBrowser])

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
  const generateAlerts = (center: { lat: number; lng: number }) => {
    const degreesPerMeter = 0.00001
    const alerts = []

    // Generate exactly 2 alerts at fixed positions relative to the user
    // First alert - northeast of user (using red circle)
    alerts.push({
      id: "alert-1",
      name: "Amrita",
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
    alerts.push({
      id: "alert-2",
      name: "Ritika",
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

    return alerts
  }

  // Generate emergency alerts
  const generateEmergencyAlerts = (center: { lat: number; lng: number }) => {
    const alerts = []

    // Generate an emergency alert at the user's location
    alerts.push({
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

    return alerts
  }

  // Generate a single ambulance (for emergency view)
  const generateAmbulance = (center: { lat: number; lng: number }) => {
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
  const generatePoliceUnits = (center: { lat: number; lng: number }) => {
    const degreesPerMeter = 0.00001
    const policeUnits = []

    // Add 1 police unit (200m southwest of user)
    const distance = 200 * degreesPerMeter
    const lat = center.lat - distance * 0.7
    const lng = center.lng - distance * 0.7

    policeUnits.push({
      id: "police-1",
      name: "Police Unit 1",
      type: "police",
      location: { lat, lng },
      distance: "200m",
      status: "On The Way",
    })

    return policeUnits
  }

  // Generate protectors (for emergency view)
  const generateProtectors = (center: { lat: number; lng: number }) => {
    const degreesPerMeter = 0.00001
    const protectors = []

    // Add 3 protectors with initials - all within 400m of user
    // First protector - northwest of user (250m)
    protectors.push({
      id: "protector-1",
      name: "Rahul M.",
      initials: "RM",
      type: "protector",
      location: {
        lat: center.lat + 250 * degreesPerMeter,
        lng: center.lng - 250 * degreesPerMeter,
      },
      distance: "250m",
      status: "Responding",
    })

    // Second protector - southwest of user (300m)
    protectors.push({
      id: "protector-2",
      name: "Amit K.",
      initials: "AK",
      type: "protector",
      location: {
        lat: center.lat - 300 * degreesPerMeter,
        lng: center.lng - 300 * degreesPerMeter,
      },
      distance: "300m",
      status: "Notified",
    })

    // Third protector - east of user (400m)
    protectors.push({
      id: "protector-3",
      name: "Vikram S.",
      initials: "VS",
      type: "protector",
      location: {
        lat: center.lat + 200 * degreesPerMeter,
        lng: center.lng + 400 * degreesPerMeter,
      },
      distance: "400m",
      status: "On the way",
    })

    return protectors
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
          alerts={alerts}
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
