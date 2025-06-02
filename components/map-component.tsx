"use client"

import { useState, useEffect } from "react"
import { LeafletMap } from "./leaflet-map"
import type { MapViewType } from "./map-view"

interface MapComponentProps {
  location: {
    lat: number
    lng: number
  }
  isProtector?: boolean
  alerts?: any[]
  routes?: any[]
  isMedicalEmergency?: boolean
}

export function MapComponent({
  location,
  isProtector = false,
  alerts = [],
  routes = [],
  isMedicalEmergency = false,
}: MapComponentProps) {
  const [ambulances, setAmbulances] = useState<any[]>([])
  const [policeUnits, setPoliceUnits] = useState<any[]>([])
  const [protectors, setProtectors] = useState<any[]>([])
  const [viewType, setViewType] = useState<MapViewType>(isProtector ? "emergency" : "female")

  // Generate sample emergency services
  useEffect(() => {
    // For demo purposes, we'll create some sample emergency services
    // In a real app, these would come from an API

    // Create ambulances
    const sampleAmbulances = [
      {
        id: "amb-1",
        name: "Ambulance Unit 1",
        location: {
          lat: location.lat + 0.005,
          lng: location.lng - 0.003,
        },
        distance: "600m",
        status: "On the way",
      },
      {
        id: "amb-2",
        name: "Ambulance Unit 2",
        location: {
          lat: location.lat - 0.007,
          lng: location.lng + 0.002,
        },
        distance: "800m",
        status: "Dispatched",
      },
    ]

    // Create police units
    const samplePoliceUnits = [
      {
        id: "pol-1",
        name: "Police Unit 1",
        location: {
          lat: location.lat - 0.003,
          lng: location.lng - 0.006,
        },
        distance: "700m",
        status: "On the way",
      },
      {
        id: "pol-2",
        name: "Police Unit 2",
        location: {
          lat: location.lat + 0.006,
          lng: location.lng + 0.004,
        },
        distance: "750m",
        status: "Dispatched",
      },
    ]

    // Create protectors
    const sampleProtectors = [
      {
        id: "prot-1",
        name: "John Smith",
        location: {
          lat: location.lat + 0.002,
          lng: location.lng - 0.004,
        },
        distance: "450m",
        status: "Responding",
      },
      {
        id: "prot-2",
        name: "Maria Garcia",
        location: {
          lat: location.lat - 0.004,
          lng: location.lng - 0.001,
        },
        distance: "500m",
        status: "Nearby",
      },
    ]

    setAmbulances(sampleAmbulances)
    setPoliceUnits(samplePoliceUnits)
    setProtectors(sampleProtectors)
  }, [location])

  return (
    <div className="w-full h-full relative map-container">
      <LeafletMap
        location={location}
        viewType={viewType}
        alerts={alerts}
        ambulances={ambulances}
        protectors={protectors}
        isMedicalEmergency={isMedicalEmergency}
        isProtector={isProtector}
      />
    </div>
  )
}
