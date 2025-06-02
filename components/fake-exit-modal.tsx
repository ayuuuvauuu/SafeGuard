"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

interface FakeExitModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FakeExitModal({ open, onOpenChange }: FakeExitModalProps) {
  const router = useRouter()

  const handleFakeExit = () => {
    // Try to close the window
    if (typeof window !== "undefined") {
      // Try multiple methods to close the window
      try {
        window.close()

        // If window.close() doesn't work (some browsers block it),
        // redirect to a blank page that will attempt to close itself
        setTimeout(() => {
          const closePage = window.open("", "_self")
          if (closePage) {
            closePage.document.write(`
              <html>
                <head>
                  <title>Closing...</title>
                  <script>
                    window.close();
                    setTimeout(function() {
                      window.location.href = "about:blank";
                    }, 100);
                  </script>
                </head>
                <body style="background-color: black; color: white; text-align: center; padding-top: 100px;">
                  <h1>Closing SafeGuard...</h1>
                  <p>If this page doesn't close automatically, please close it manually.</p>
                </body>
              </html>
            `)
            closePage.document.close()
          }
        }, 100)
      } catch (e) {
        console.error("Could not close window:", e)
      }
    }

    // Fallback if window.close() doesn't work
    onOpenChange(false)
    router.push("/dashboard")
  }

  const handleRealExit = () => {
    // In a real app, this would actually close the emergency mode
    onOpenChange(false)
    router.push("/dashboard")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <AlertCircle className="h-6 w-6 text-pink-500" />
            Exit Emergency Mode
          </DialogTitle>
          <DialogDescription className="text-center">Choose how you want to exit the emergency mode</DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-4">
          <div className="border rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <EyeOff className="h-5 w-5 text-pink-500" />
              <h3 className="font-medium">Fake Exit (Recommended)</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              The app will appear to close, but will continue running in the background. Location tracking, recording,
              and alerts will remain active.
            </p>
            <Button className="w-full mt-2 bg-pink-500 hover:bg-pink-600" onClick={handleFakeExit}>
              Fake Exit
            </Button>
          </div>

          <div className="border rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-destructive" />
              <h3 className="font-medium">Real Exit</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              This will completely end the emergency mode and stop all tracking and recording. Only use this when you
              are safe.
            </p>
            <Button
              variant="outline"
              className="w-full mt-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={handleRealExit}
            >
              End Emergency Mode
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
