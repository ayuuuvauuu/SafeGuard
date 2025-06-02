"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">SafeGuard</h1>
          <p className="text-gray-400">Your personal safety companion</p>
        </div>

        <div className="space-y-4">
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={() => router.push("/login")}>
            Login
          </Button>
        </div>
      </div>
    </main>
  )
}
