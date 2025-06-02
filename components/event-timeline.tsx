"use client"
import { AlertCircle, MapPin, Phone, Shield, Users, Video } from "lucide-react"

interface EventTimelineProps {
  expanded: boolean
}

export function EventTimeline({ expanded }: EventTimelineProps) {
  // In a real app, these would come from the backend
  const events = [
    {
      id: 1,
      time: "14:32:05",
      title: "Emergency SOS Activated",
      description: "Emergency protocol initiated",
      icon: <AlertCircle className="h-4 w-4 text-red-500" />,
      type: "alert",
    },
    {
      id: 2,
      time: "14:32:06",
      title: "Location Shared",
      description: "Telco Colony, Jamshedpur",
      icon: <MapPin className="h-4 w-4 text-blue-500" />,
      type: "location",
    },
    {
      id: 3,
      time: "14:32:07",
      title: "Recording Started",
      description: "Video and audio recording initiated",
      icon: <Video className="h-4 w-4 text-purple-500" />,
      type: "recording",
    },
    {
      id: 4,
      time: "14:32:10",
      title: "Emergency Contacts Notified",
      description: "3 contacts received the alert",
      icon: <Phone className="h-4 w-4 text-green-500" />,
      type: "contacts",
    },
    {
      id: 5,
      time: "14:32:15",
      title: "Police Notified",
      description: "Emergency details sent to authorities",
      icon: <Shield className="h-4 w-4 text-indigo-500" />,
      type: "police",
    },
    {
      id: 6,
      time: "14:32:20",
      title: "Nearby Users Alerted",
      description: "7 users within 2km radius notified",
      icon: <Users className="h-4 w-4 text-amber-500" />,
      type: "users",
    },
    {
      id: 7,
      time: "14:33:05",
      title: "Police Response",
      description: "Police unit dispatched, ETA 8 minutes",
      icon: <Shield className="h-4 w-4 text-indigo-500" />,
      type: "police",
    },
    {
      id: 8,
      time: "14:34:12",
      title: "Contact Response",
      description: "Mom: 'I'm on my way. Stay on the line.'",
      icon: <Phone className="h-4 w-4 text-green-500" />,
      type: "contacts",
    },
  ]

  // Display all events if expanded, otherwise just the first 4
  const displayEvents = expanded ? events : events.slice(0, 4)

  return (
    <div className="space-y-2">
      {displayEvents.map((event) => (
        <div key={event.id} className="flex items-start gap-2 text-xs">
          <div className="bg-muted p-1 rounded-full mt-0.5">{event.icon}</div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="font-medium">{event.title}</div>
              <div className="text-muted-foreground">{event.time}</div>
            </div>
            <div className="text-muted-foreground">{event.description}</div>
          </div>
        </div>
      ))}

      {!expanded && events.length > 4 && (
        <div className="text-xs text-center text-muted-foreground">+ {events.length - 4} more events</div>
      )}
    </div>
  )
}
