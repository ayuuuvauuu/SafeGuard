"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Send } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface NearbyUsersProps {
  enableMessaging?: boolean
  hideStatus?: boolean
}

export function NearbyUsers({ enableMessaging = false, hideStatus = false }: NearbyUsersProps) {
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [messageText, setMessageText] = useState("")
  const [messages, setMessages] = useState<Record<string, { text: string; sent: boolean }[]>>({})
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(true)
    // Initialize messages state
    setMessages({
      RS: [],
      AK: [],
      VP: [],
      SM: [],
    })
  }, [])

  // In a real app, these would come from the backend
  const users = [
    {
      id: 1,
      name: "Baba Ram Rahim",
      distance: "0.3km",
      status: "Responding",
      avatar: "/placeholder-user.jpg",
      initials: "RS",
    },
    {
      id: 2,
      name: "Salman Khan",
      distance: "0.7km",
      status: "Notified",
      avatar: "/placeholder-user.jpg",
      initials: "AK",
    },
    {
      id: 3,
      name: "Batman",
      distance: "1.2km",
      status: "Responding",
      avatar: "/placeholder-user.jpg",
      initials: "VP",
    },
    {
      id: 4,
      name: "Shaktimaan",
      distance: "1.5km",
      status: "Notified",
      avatar: "/placeholder-user.jpg",
      initials: "SM",
    },
  ]

  const handleSendMessage = () => {
    if (!activeChat || !messageText.trim()) return

    // Add message to chat
    setMessages((prev) => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), { text: messageText, sent: true }],
    }))

    setMessageText("")

    // Simulate response after 1 second
    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [activeChat]: [...(prev[activeChat] || []), { text: "I'm on my way to help. Stay safe!", sent: false }],
      }))
    }, 1000)
  }

  if (!isBrowser) {
    return (
      <div className="space-y-2 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-800">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gray-700"></div>
              <div>
                <div className="h-4 w-24 bg-gray-700 rounded"></div>
                <div className="h-3 w-16 bg-gray-700 rounded mt-1"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">{user.distance} away</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!hideStatus && (
              <Badge
                variant={user.status === "Responding" ? "default" : "secondary"}
                className={user.status === "Responding" ? "bg-green-500" : ""}
              >
                {user.status}
              </Badge>
            )}

            {enableMessaging && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setActiveChat(user.initials)}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}

      {/* Chat Dialog */}
      <Dialog open={!!activeChat} onOpenChange={(open) => !open && setActiveChat(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{activeChat && users.find((u) => u.initials === activeChat)?.name}</DialogTitle>
          </DialogHeader>

          <div className="h-[300px] overflow-y-auto border rounded-md p-3 space-y-2">
            {activeChat && messages[activeChat]?.length > 0 ? (
              messages[activeChat].map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-2 rounded-lg ${msg.sent ? "bg-pink-500 text-white" : "bg-muted"}`}>
                    {msg.text}
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No messages yet. Start a conversation!
              </div>
            )}
          </div>

          <DialogFooter className="flex-row gap-2">
            <Input
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button className="bg-pink-500 hover:bg-pink-600" onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default NearbyUsers
