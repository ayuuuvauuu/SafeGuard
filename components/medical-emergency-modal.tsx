"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { AlertCircle, Heart, Phone, User, Stethoscope, Activity } from "lucide-react"
import { useRouter } from "next/navigation"

interface MedicalEmergencyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isMaleInterface?: boolean
  showMedicalDetailsOnly?: boolean
  onActivate?: () => void
}

export function MedicalEmergencyModal({
  open,
  onOpenChange,
  isMaleInterface = false,
  showMedicalDetailsOnly = false,
  onActivate,
}: MedicalEmergencyModalProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("emergency")
  const [shareLocation, setShareLocation] = useState(true)
  const [shareMedicalInfo, setShareMedicalInfo] = useState(true)
  const [notifyContacts, setNotifyContacts] = useState(true)
  const [callEmergencyServices, setCallEmergencyServices] = useState(false)

  // Medical information form state
  const [bloodType, setBloodType] = useState("")
  const [allergies, setAllergies] = useState("")
  const [conditions, setConditions] = useState("")
  const [medications, setMedications] = useState("")
  const [emergencyContact, setEmergencyContact] = useState("")
  const [contactPhone, setContactPhone] = useState("")

  // Load saved medical info from localStorage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedMedicalInfo = localStorage.getItem("medicalInfo")
        if (savedMedicalInfo) {
          const parsedInfo = JSON.parse(savedMedicalInfo)
          setBloodType(parsedInfo.bloodType || "")
          setAllergies(parsedInfo.allergies || "")
          setConditions(parsedInfo.conditions || "")
          setMedications(parsedInfo.medications || "")
          setEmergencyContact(parsedInfo.emergencyContact || "")
          setContactPhone(parsedInfo.contactPhone || "")
        }
      } catch (error) {
        console.error("Error loading medical info:", error)
      }
    }
  }, [open])

  // Handle emergency activation
  const handleActivate = () => {
    // Save medical info to localStorage
    if (typeof window !== "undefined") {
      try {
        const medicalInfo = {
          bloodType,
          allergies,
          conditions,
          medications,
          emergencyContact,
          contactPhone,
        }
        localStorage.setItem("medicalInfo", JSON.stringify(medicalInfo))
      } catch (error) {
        console.error("Error saving medical info:", error)
      }
    }

    if (onActivate) {
      onActivate()
    } else {
      // Navigate to medical response page
      router.push("/medical-response")
    }
    onOpenChange(false)
  }

  const themeColor = isMaleInterface ? "blue" : "pink"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-black text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className={`text-${themeColor}-500 flex items-center gap-2`}>
            {showMedicalDetailsOnly ? (
              <>
                <Stethoscope className="h-5 w-5" />
                Medical Information
              </>
            ) : (
              <>
                <Heart className="h-5 w-5" />
                Medical Emergency
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {showMedicalDetailsOnly
              ? "Your medical information and emergency contacts"
              : "Activate medical emergency services and notify your contacts"}
          </DialogDescription>
        </DialogHeader>

        {showMedicalDetailsOnly ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="blood-type" className="text-gray-400">
                  Blood Type (optional)
                </Label>
                <Input
                  id="blood-type"
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  placeholder="e.g., O+"
                  className="bg-gray-900"
                />
              </div>
              <div>
                <Label htmlFor="allergies" className="text-gray-400">
                  Allergies (optional)
                </Label>
                <Input
                  id="allergies"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g., Penicillin, Peanuts"
                  className="bg-gray-900"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="conditions" className="text-gray-400">
                Medical Conditions (optional)
              </Label>
              <Input
                id="conditions"
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                placeholder="e.g., Asthma, Hypertension"
                className="bg-gray-900"
              />
            </div>
            <div>
              <Label htmlFor="medications" className="text-gray-400">
                Current Medications (optional)
              </Label>
              <Input
                id="medications"
                value={medications}
                onChange={(e) => setMedications(e.target.value)}
                placeholder="e.g., Albuterol, Lisinopril"
                className="bg-gray-900"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergency-contact" className="text-gray-400">
                  Emergency Contact (optional)
                </Label>
                <Input
                  id="emergency-contact"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="e.g., Jane Doe"
                  className="bg-gray-900"
                />
              </div>
              <div>
                <Label htmlFor="contact-phone" className="text-gray-400">
                  Contact Phone (optional)
                </Label>
                <Input
                  id="contact-phone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g., +91 98765 43210"
                  className="bg-gray-900"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                className={`bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white`}
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <Tabs defaultValue="emergency" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-900">
              <TabsTrigger
                value="emergency"
                className={`data-[state=active]:bg-${themeColor}-600 data-[state=active]:text-white`}
              >
                Emergency
              </TabsTrigger>
              <TabsTrigger
                value="medical"
                className={`data-[state=active]:bg-${themeColor}-600 data-[state=active]:text-white`}
              >
                Medical Info
              </TabsTrigger>
            </TabsList>
            <TabsContent value="emergency" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className={`h-5 w-5 text-${themeColor}-500`} />
                    <Label htmlFor="share-location" className="text-white">
                      Share Location
                    </Label>
                  </div>
                  <Switch
                    id="share-location"
                    checked={shareLocation}
                    onCheckedChange={setShareLocation}
                    className={`data-[state=checked]:bg-${themeColor}-600`}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Stethoscope className={`h-5 w-5 text-${themeColor}-500`} />
                    <Label htmlFor="share-medical" className="text-white">
                      Share Medical Info
                    </Label>
                  </div>
                  <Switch
                    id="share-medical"
                    checked={shareMedicalInfo}
                    onCheckedChange={setShareMedicalInfo}
                    className={`data-[state=checked]:bg-${themeColor}-600`}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className={`h-5 w-5 text-${themeColor}-500`} />
                    <Label htmlFor="notify-contacts" className="text-white">
                      Notify Emergency Contacts
                    </Label>
                  </div>
                  <Switch
                    id="notify-contacts"
                    checked={notifyContacts}
                    onCheckedChange={setNotifyContacts}
                    className={`data-[state=checked]:bg-${themeColor}-600`}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className={`h-5 w-5 text-${themeColor}-500`} />
                    <Label htmlFor="call-emergency" className="text-white">
                      Call Emergency Services (911)
                    </Label>
                  </div>
                  <Switch
                    id="call-emergency"
                    checked={callEmergencyServices}
                    onCheckedChange={setCallEmergencyServices}
                    className={`data-[state=checked]:bg-${themeColor}-600`}
                  />
                </div>
                <div>
                  <Label htmlFor="emergency-notes" className="text-gray-400">
                    Additional Notes
                  </Label>
                  <Textarea
                    id="emergency-notes"
                    placeholder="Describe your situation or any additional information..."
                    className="bg-gray-900 h-20"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="medical" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="blood-type-tab" className="text-gray-400">
                    Blood Type (optional)
                  </Label>
                  <Input
                    id="blood-type-tab"
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    placeholder="e.g., O+"
                    className="bg-gray-900"
                  />
                </div>
                <div>
                  <Label htmlFor="allergies-tab" className="text-gray-400">
                    Allergies (optional)
                  </Label>
                  <Input
                    id="allergies-tab"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="e.g., Penicillin, Peanuts"
                    className="bg-gray-900"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="conditions-tab" className="text-gray-400">
                  Medical Conditions (optional)
                </Label>
                <Input
                  id="conditions-tab"
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  placeholder="e.g., Asthma, Hypertension"
                  className="bg-gray-900"
                />
              </div>
              <div>
                <Label htmlFor="medications-tab" className="text-gray-400">
                  Current Medications (optional)
                </Label>
                <Input
                  id="medications-tab"
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                  placeholder="e.g., Albuterol, Lisinopril"
                  className="bg-gray-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergency-contact-tab" className="text-gray-400">
                    Emergency Contact (optional)
                  </Label>
                  <Input
                    id="emergency-contact-tab"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="e.g., Jane Doe"
                    className="bg-gray-900"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-phone-tab" className="text-gray-400">
                    Contact Phone (optional)
                  </Label>
                  <Input
                    id="contact-phone-tab"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g., +91 98765 43210"
                    className="bg-gray-900"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {!showMedicalDetailsOnly && (
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleActivate}
              disabled={!shareLocation}
            >
              <Activity className="mr-2 h-4 w-4" />
              Activate Medical Emergency
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
