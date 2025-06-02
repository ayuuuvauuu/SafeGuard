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
import { Plus, Trash2, Users, Save } from "lucide-react"

interface EmergencyContactsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Contact {
  id: string
  name: string
  phone: string
  relation: string
}

export function EmergencyContactsModal({ open, onOpenChange }: EmergencyContactsModalProps) {
  const [contacts, setContacts] = useState<Contact[]>([])

  // Load contacts from localStorage on mount
  useEffect(() => {
    const savedContacts = localStorage.getItem("emergencyContacts")
    if (savedContacts) {
      try {
        setContacts(JSON.parse(savedContacts))
      } catch (e) {
        console.error("Error parsing contacts:", e)
        setContacts([])
      }
    } else {
      // Initialize with one empty contact if none exist
      setContacts([{ id: generateId(), name: "", phone: "", relation: "" }])
    }
  }, [open])

  // Generate a unique ID for new contacts
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Add a new contact
  const addContact = () => {
    setContacts([...contacts, { id: generateId(), name: "", phone: "", relation: "" }])
  }

  // Remove a contact
  const removeContact = (id: string) => {
    setContacts(contacts.filter((contact) => contact.id !== id))
  }

  // Update a contact field
  const updateContact = (id: string, field: keyof Contact, value: string) => {
    setContacts(contacts.map((contact) => (contact.id === id ? { ...contact, [field]: value } : contact)))
  }

  // Save contacts
  const saveContacts = () => {
    // Filter out empty contacts
    const validContacts = contacts.filter((c) => c.name.trim() !== "" && c.phone.trim() !== "")
    localStorage.setItem("emergencyContacts", JSON.stringify(validContacts))
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-pink-500" />
            Emergency Contacts
          </DialogTitle>
          <DialogDescription>Add family members and friends who will be notified during emergencies</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {contacts.map((contact, index) => (
            <div key={contact.id} className="space-y-3 p-3 border rounded-lg relative">
              <div className="space-y-2">
                <Label htmlFor={`name-${contact.id}`}>Name</Label>
                <Input
                  id={`name-${contact.id}`}
                  value={contact.name}
                  onChange={(e) => updateContact(contact.id, "name", e.target.value)}
                  placeholder="Enter contact name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`phone-${contact.id}`}>Phone Number</Label>
                <Input
                  id={`phone-${contact.id}`}
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => updateContact(contact.id, "phone", e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`relation-${contact.id}`}>Relationship</Label>
                <Input
                  id={`relation-${contact.id}`}
                  value={contact.relation}
                  onChange={(e) => updateContact(contact.id, "relation", e.target.value)}
                  placeholder="E.g., Parent, Sibling, Friend"
                />
              </div>
              {contacts.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 text-destructive"
                  onClick={() => removeContact(contact.id)}
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
        </div>

        <DialogFooter>
          <Button className="w-full bg-pink-500 hover:bg-pink-600 flex items-center gap-2" onClick={saveContacts}>
            <Save className="h-4 w-4" />
            Save Contacts
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
