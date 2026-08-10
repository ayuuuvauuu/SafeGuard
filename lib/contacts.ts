export interface EmergencyContact {
  id: string
  name: string
  phone: string
  relation: string
}

export function getEmergencyContacts(): EmergencyContact[] {
  if (typeof window === "undefined") return []

  try {
    const saved = localStorage.getItem("emergencyContacts")
    if (!saved) return []
    const parsed = JSON.parse(saved) as EmergencyContact[]
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error("Error reading emergency contacts:", error)
    return []
  }
}

export function formatContactsSummary(contacts: EmergencyContact[]) {
  const savedNames = contacts
    .map((contact) => contact.name.trim())
    .filter((name) => name.length > 0)

  if (savedNames.length === 0) return "your emergency contacts"

  if (savedNames.length === 1) return savedNames[0]

  if (savedNames.length === 2) return savedNames.join(" and ")

  return `${savedNames[0]}, ${savedNames[1]} and ${savedNames.length - 2} more`
}
