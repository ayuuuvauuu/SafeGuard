"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, MapPin, Car, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"

interface ProtocolModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProtocolModal({ open, onOpenChange }: ProtocolModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [transportMode, setTransportMode] = useState("cab")
  const [customMessage, setCustomMessage] = useState("")
  const router = useRouter()

  // Pre-defined message
  const defaultMessage =
    "I'm starting a journey and sharing my location with you. Please check on me if I don't arrive at my destination on time."

  const handleSubmit = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      onOpenChange(false)
      router.push("/travel-status")
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
           {" "}
      <DialogContent className="sm:max-w-md">
               {" "}
        <DialogHeader>
                   {" "}
          <DialogTitle className="text-center text-blue-500 flex items-center justify-center gap-2">
                        <MapPin className="h-6 w-6" />            Travel Protocol          {" "}
          </DialogTitle>
                   {" "}
          <DialogDescription className="text-center">
                        Share your journey details with trusted contacts          {" "}
          </DialogDescription>
                 {" "}
        </DialogHeader>
               {" "}
        <div className="py-4 space-y-4">
                   {" "}
          <div className="space-y-2">
                        <Label htmlFor="destination">Destination</Label>           {" "}
            <Input id="destination" placeholder="Where are you going?" />         {" "}
          </div>
                   {" "}
          <div className="space-y-2">
                        <Label>Mode of Transport</Label>           {" "}
            <RadioGroup defaultValue="cab" onValueChange={setTransportMode}>
                           {" "}
              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="cab" id="cab" />               {" "}
                <Label htmlFor="cab" className="flex items-center gap-2">
                                    <Car className="h-4 w-4" />                  Cab/Taxi                {" "}
                </Label>
                             {" "}
              </div>
                           {" "}
              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="walk" id="walk" />               {" "}
                <Label htmlFor="walk" className="flex items-center gap-2">
                                    <User className="h-4 w-4" />                  Walking                {" "}
                </Label>
                             {" "}
              </div>
                           {" "}
              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="other" id="other" />               {" "}
                <Label htmlFor="other">Other</Label>             {" "}
              </div>
                         {" "}
            </RadioGroup>
                     {" "}
          </div>
                   {" "}
          {transportMode === "cab" && (
            <div className="space-y-2">
                            <Label htmlFor="cabDetails">Cab/Driver Details</Label>             {" "}
              <Input id="cabDetails" placeholder="Vehicle number, driver name, etc." />           {" "}
            </div>
          )}
                   {" "}
          <div className="space-y-2">
                        <Label htmlFor="duration">Expected Duration</Label>           {" "}
            <Select defaultValue="30">
                           {" "}
              <SelectTrigger>
                                <SelectValue placeholder="Select duration" />             {" "}
              </SelectTrigger>
                           {" "}
              <SelectContent>
                                <SelectItem value="15">15 minutes</SelectItem>               {" "}
                <SelectItem value="30">30 minutes</SelectItem>               {" "}
                <SelectItem value="45">45 minutes</SelectItem>                <SelectItem value="60">1 hour</SelectItem>
                                <SelectItem value="90">1.5 hours</SelectItem>               {" "}
                <SelectItem value="120">2 hours</SelectItem>               {" "}
                <SelectItem value="custom">Custom</SelectItem>             {" "}
              </SelectContent>
                         {" "}
            </Select>
                     {" "}
          </div>
                   {" "}
          <div className="space-y-2">
                        <Label>Who to notify</Label>           {" "}
            <div className="grid grid-cols-2 gap-2">
                           {" "}
              <Button variant="outline" className="justify-start">
                                <User className="mr-2 h-4 w-4" />                Mom              {" "}
              </Button>
                           {" "}
              <Button variant="outline" className="justify-start">
                                <User className="mr-2 h-4 w-4" />                Dad              {" "}
              </Button>
                           {" "}
              <Button variant="outline" className="justify-start">
                                <User className="mr-2 h-4 w-4" />                Sister              {" "}
              </Button>
                           {" "}
              <Button variant="outline" className="justify-start text-primary">
                                <User className="mr-2 h-4 w-4" />                Add Contact              {" "}
              </Button>
                         {" "}
            </div>
                     {" "}
          </div>
                   {" "}
          <div className="space-y-2">
                        <Label htmlFor="alert-message">Alert Message (Optional)</Label>           {" "}
            <div className="text-xs text-muted-foreground mb-2">Default message: "{defaultMessage}"</div>           {" "}
            <Textarea
              id="alert-message"
              placeholder="Add additional details about your journey..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={2}
            />
                     {" "}
          </div>
                 {" "}
        </div>
               {" "}
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
                   {" "}
          <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
                        Cancel          {" "}
          </Button>
                   {" "}
          <Button className="w-full bg-blue-500 hover:bg-blue-600" onClick={handleSubmit} disabled={isSubmitting}>
                       {" "}
            {isSubmitting ? (
              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />                Starting...            
                 {" "}
              </>
            ) : (
              "Start Journey Tracking"
            )}
                     {" "}
          </Button>
                 {" "}
        </DialogFooter>
             {" "}
      </DialogContent>
         {" "}
    </Dialog>
  )
}
