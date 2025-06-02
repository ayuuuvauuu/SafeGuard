"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { UserIcon as Female, UserIcon as Male } from "lucide-react"
import { CreditDialog } from "@/components/credit-dialog"

export default function UserSelection() {
  const router = useRouter()
  const [showCredits, setShowCredits] = useState(false)
  const [selectedType, setSelectedType] = useState<"female" | "male" | null>(null)

  const selectUserType = (type: "female" | "male") => {
    // Store user type in localStorage for theming
    localStorage.setItem("userType", type)
    setSelectedType(type)

    // Show credits first
    setShowCredits(true)
  }

  // Common features for both user types
  const commonFeatures = {
    female: ["Emergency SOS alerts", "Suspect reporting", "Location sharing", "Emergency contacts"],
    male: ["Alert monitoring", "Emergency response", "Location tracking", "Quick actions"],
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      {showCredits && (
        <CreditDialog
          open={showCredits}
          onOpenChange={(open) => {
            setShowCredits(open)
            if (!open && selectedType) {
              // After credits are closed, redirect to the appropriate dashboard
              if (selectedType === "female") {
                router.push("/dashboard")
              } else {
                router.push("/protector-dashboard")
              }
            }
          }}
        />
      )}

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Select User Type</h1>
          <p className="text-muted-foreground">Choose which interface you want to use</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Card className="overflow-hidden border-pink-500/20">
            <Button variant="ghost" className="h-auto p-0 w-full" onClick={() => selectUserType("female")}>
              <CardContent className="p-0">
                <div className="bg-pink-950/30 p-6 flex flex-col items-center">
                  <Female className="h-12 w-12 text-pink-500 mb-2" />
                  <CardTitle className="text-xl mb-1">Female User</CardTitle>
                  <CardDescription className="text-center">
                    Access emergency features and protection tools
                  </CardDescription>
                </div>
                <div className="p-4 h-[152px]">
                  {" "}
                  {/* Fixed height to match both cards */}
                  <ul className="text-sm space-y-2">
                    {commonFeatures.female.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-pink-500 mt-1.5 flex-shrink-0"></div>
                        <span className="break-normal">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Button>
          </Card>

          <Card className="overflow-hidden border-blue-500/20">
            <Button variant="ghost" className="h-auto p-0 w-full" onClick={() => selectUserType("male")}>
              <CardContent className="p-0">
                <div className="bg-blue-950/30 p-6 flex flex-col items-center">
                  <Male className="h-12 w-12 text-blue-500 mb-2" />
                  <CardTitle className="text-xl mb-1">Male User</CardTitle>
                  <CardDescription className="text-center">Monitor alerts and provide assistance</CardDescription>
                </div>
                <div className="p-4 h-[152px]">
                  {" "}
                  {/* Fixed height to match both cards */}
                  <ul className="text-sm space-y-2">
                    {commonFeatures.male.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                        <span className="break-normal">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Button>
          </Card>
        </div>
      </div>
    </main>
  )
}
