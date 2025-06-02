"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Onboarding() {
  const [isLoading, setIsLoading] = useState(false)
  const [contacts, setContacts] = useState([{ name: "", phone: "" }])
  const router = useRouter()

  const addContact = () => {
    setContacts([...contacts, { name: "", phone: "" }])
  }

  const removeContact = (index: number) => {
    const newContacts = [...contacts]
    newContacts.splice(index, 1)
    setContacts(newContacts)
  }

  const updateContact = (index: number, field: string, value: string) => {
    const newContacts = [...contacts]
    newContacts[index] = { ...newContacts[index], [field]: value }
    setContacts(newContacts)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate saving contacts
    setTimeout(() => {
      setIsLoading(false)
      router.push("/permissions")
    }, 1500)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Emergency Contacts</CardTitle>
          <CardDescription>Add contacts who will be notified in case of an emergency</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {contacts.map((contact, index) => (
              <div key={index} className="space-y-3 p-3 border rounded-lg relative">
                <div className="space-y-2">
                  <Label htmlFor={`name-${index}`}>Contact Name</Label>
                  <Input
                    id={`name-${index}`}
                    value={contact.name}
                    onChange={(e) => updateContact(index, "name", e.target.value)}
                    placeholder="Enter contact name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`phone-${index}`}>Phone Number</Label>
                  <Input
                    id={`phone-${index}`}
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => updateContact(index, "phone", e.target.value)}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                {contacts.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 text-destructive"
                    onClick={() => removeContact(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={addContact}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Contact
            </Button>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
