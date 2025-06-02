// components/user-marker.tsx
import L from "leaflet"

// Create user location marker
export function createUserLocationMarker(isEmergency = false) {
  return L.icon({
    iconUrl: "/user-location-blue.png",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
    className: isEmergency ? "emergency-marker-pulse" : "",
  })
}

// Create alert marker (red circle)
export function createAlertMarker() {
  return L.icon({
    iconUrl: "/alert-circle.png",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
    className: "alert-marker-pulse",
  })
}

// Create alert pin marker (red pin)
export function createAlertPinMarker() {
  return L.icon({
    iconUrl: "/alert-pin.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    className: "alert-marker-pulse",
  })
}

// Create ambulance marker
export function createAmbulanceMarker() {
  return L.icon({
    iconUrl: "/ambulance-icon-new.png",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
    className: "ambulance-marker-pulse",
  })
}

// Create police marker
export function createPoliceMarker() {
  return L.icon({
    iconUrl: "/police-icon.png",
    iconSize: [40, 40], // Increased size for better visibility
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
    className: "police-marker-pulse",
  })
}

// Create protector marker
export function createProtectorMarker() {
  return L.icon({
    iconUrl: "/protector-icon.png",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
    className: "protector-marker-pulse",
  })
}

// Create protector initials marker
export function createProtectorInitialsMarker(initials: string) {
  const canvas = document.createElement("canvas")
  canvas.width = 40
  canvas.height = 40

  const ctx = canvas.getContext("2d")
  if (ctx) {
    // Draw circle background
    ctx.beginPath()
    ctx.arc(20, 20, 18, 0, Math.PI * 2)
    ctx.fillStyle = "#22c55e" // Green background
    ctx.fill()

    // Draw border
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw text
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 16px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(initials, 20, 20)
  }

  const dataUrl = canvas.toDataURL()

  return L.icon({
    iconUrl: dataUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
    className: "protector-marker-pulse",
  })
}
