"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { signUpWithEmail, mapFirebaseError, firebaseConfigured } from "@/lib/firebase"

type RoleChoice = "Protected" | "Protector"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Register() {
  const [name, setName] = useState("")
  const [gender, setGender] = useState("undeclared") // Neutral default, per spec
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<RoleChoice>("Protected")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("Please enter your full name.")
      return
    }
    if (!email.trim() || !EMAIL_PATTERN.test(email.trim())) {
      setError("Please enter a valid email address.")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    setIsLoading(true)
    try {
      await signUpWithEmail(name.trim(), email.trim(), password, gender, role)
      if (typeof window !== "undefined") {
        localStorage.setItem("userRole", role)
      }
      router.push("/user-selection")
    } catch (signUpError: any) {
      setError(mapFirebaseError(signUpError, "Registration failed. Please try again."))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Enter your details to register for SafeGuard</CardDescription>
        </CardHeader>
        {!firebaseConfigured && (
          <div className="mx-6 mb-2 rounded-md bg-amber-500/15 px-3 py-2 text-sm text-amber-700 dark:text-amber-300">
            Firebase is not configured. Set <code>NEXT_PUBLIC_FIREBASE_*</code> environment variables to enable
            registration.
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender (optional)</Label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="undeclared">Prefer not to say</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Account role</Label>
              <p className="text-xs text-muted-foreground">
                Your role decides which dashboard you can use. Anyone can pick either role regardless of gender — this
                is a separate choice.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={role === "Protected" ? "default" : "outline"}
                  onClick={() => setRole("Protected")}
                >
                  I may need help (Protected)
                </Button>
                <Button
                  type="button"
                  variant={role === "Protector" ? "default" : "outline"}
                  onClick={() => setRole("Protector")}
                >
                  I want to help (Protector)
                </Button>
              </div>
            </div>
            {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading || !firebaseConfigured}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Register"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Login
        </Link>
      </p>
    </main>
  )
}