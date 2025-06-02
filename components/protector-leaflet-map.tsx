// "use client"
//
// import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet"
// import L from "leaflet"
// import "leaflet/dist/leaflet.css"
// import { Button } from "@/components/ui/button"
// import { Phone, Navigation } from "lucide-react"
//
// interface ProtectorLeafletMapProps {
//   location: {
//     lat: number
//     lng: number
//   }
//   alerts: any[]
// }
//
// export function ProtectorLeafletMap({ location, alerts }: ProtectorLeafletMapProps) {
//   // Create icons
//   const userIcon = L.icon({
//     iconUrl: "/alert-marker.png",
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34],
//   })
//
//   const emergencyIcon = L.icon({
//     iconUrl: "/alert-marker.png",
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34],
//   })
//
//   return (
//     <MapContainer center={location} zoom={14} className="w-full h-full" style={{ height: "400px", width: "100%" }}>
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//
//       {/* User's location */}
//       <Marker position={location} icon={userIcon}>
//         <Popup>
//           <div className="text-center">
//             <p className="font-medium">Your Location</p>
//             <p className="text-xs text-muted-foreground">Protector Mode Active</p>
//           </div>
//         </Popup>
//       </Marker>
//
//       {/* 2km radius circle */}
//       <Circle center={location} radius={2000} pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.1 }} />
//
//       {/* Alert markers */}
//       {alerts.map((alert) => (
//         <Marker key={alert.id} position={alert.location} icon={emergencyIcon}>
//           <Popup>
//             <div className="text-center p-1">
//               <p className="font-medium">{alert.name}</p>
//               <p className="text-xs text-red-500 uppercase font-bold mb-2">
//                 {alert.type === "emergency" ? "Emergency SOS" : "Suspect Alert"}
//               </p>
//               <p className="text-xs mb-2">
//                 {alert.distance} away • {alert.time}
//               </p>
//               <div className="flex gap-2 mt-2">
//                 <Button size="sm" className="w-full flex items-center gap-1">
//                   <Phone className="h-3 w-3" />
//                   <span>Call</span>
//                 </Button>
//                 <Button size="sm" variant="outline" className="w-full flex items-center gap-1">
//                   <Navigation className="h-3 w-3" />
//                   <span>Navigate</span>
//                 </Button>
//               </div>
//             </div>
//           </Popup>
//         </Marker>
//       ))}
//     </MapContainer>
//   )
// }

"use client"

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Button } from "@/components/ui/button"
import { Phone, Navigation } from "lucide-react"

interface ProtectorLeafletMapProps {
  location: {
    lat: number
    lng: number
  }
  alerts: any[]
}

export function ProtectorLeafletMap({ location, alerts }: ProtectorLeafletMapProps) {
  // Create icons
  const userIcon = L.icon({
    iconUrl: "/alert-marker.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  })

  const emergencyIcon = L.icon({
    iconUrl: "/alert-marker.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  })

  return (
    <MapContainer center={location} zoom={14} className="w-full h-full" style={{ height: "400px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* User's location */}
      <Marker position={location} icon={userIcon}>
        <Popup>
          <div className="text-center">
            <p className="font-medium">Your Location</p>
            <p className="text-xs text-muted-foreground">Protector Mode Active</p>
          </div>
        </Popup>
      </Marker>

      {/* 2km radius circle */}
      <Circle center={location} radius={2000} pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.1 }} />

      {/* Alert markers */}
      {alerts.map((alert) => (
        <Marker key={alert.id} position={alert.location} icon={emergencyIcon}>
          <Popup>
            <div className="text-center p-1">
              <p className="font-medium">{alert.name}</p>
              <p className="text-xs text-red-500 uppercase font-bold mb-2">
                {alert.type === "emergency" ? "Emergency SOS" : "Suspect Alert"}
              </p>
              <p className="text-xs mb-2">
                {alert.distance} away • {alert.time}
              </p>
              <div className="flex gap-2 mt-2">
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
    </MapContainer>
  )
}
