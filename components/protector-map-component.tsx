"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { MapPin } from "lucide-react"
import dynamic from "next/dynamic"

// Define types for props
interface ProtectorMapComponentProps {
  location: {
    lat: number
    lng: number
  }
  alerts: any[]
}

// Fallback component when map can't be loaded
const MapFallback = () => (
  <div className="w-full h-[400px] bg-gray-100 flex flex-col items-center justify-center text-gray-500 border rounded-md">
        <MapPin className="h-8 w-8 mb-2 opacity-50" />    <p className="text-sm font-medium">Map unavailable</p>   {" "}
    <p className="text-xs">Using default location</p> {" "}
  </div>
)

// Dynamically import the Leaflet map component with no SSR
const ProtectorLeafletMap = dynamic(() => import("./protector-leaflet-map").then((mod) => mod.ProtectorLeafletMap), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">
            <p className="text-sm text-gray-500">Loading map...</p>   {" "}
    </div>
  ),
})

// Main component that handles the dynamic import
export function ProtectorMapComponent({ location, alerts }: ProtectorMapComponentProps) {
  const [hasError, setHasError] = useState(false)

  // If there's an error, show the fallback
  if (hasError) {
    return <MapFallback />
  }

  // Use error boundary pattern
  try {
    return (
      <ErrorBoundary fallback={<MapFallback />}>
                <ProtectorLeafletMap location={location} alerts={alerts} />     {" "}
      </ErrorBoundary>
    )
  } catch (error) {
    console.error("Error rendering map:", error)
    return <MapFallback />
  }
}

// Simple error boundary component
function ErrorBoundary({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error("Caught error:", error)
      setHasError(true)
    }

    window.addEventListener("error", errorHandler)
    return () => window.removeEventListener("error", errorHandler)
  }, [])

  return hasError ? fallback : children
}
