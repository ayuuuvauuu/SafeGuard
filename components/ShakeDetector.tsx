"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ShakeDetector() {
  const router = useRouter()
  const [showMotionNotice, setShowMotionNotice] = useState(false)

  useEffect(() => {
    let triggered = false
    const spikeTimes: number[] = []
    const threshold = 15
    const minSpikeGap = 100
    const windowMs = 1500

    function handleMotion(event: DeviceMotionEvent) {
      let acc = event.acceleration
      if (!acc || acc.x === null || acc.y === null || acc.z === null) {
        acc = event.accelerationIncludingGravity
        if (!acc || acc.x === null || acc.y === null || acc.z === null) return
      }

      const totalDelta = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z)
      const now = performance.now()

      if (totalDelta < threshold) return

      const lastSpike = spikeTimes[spikeTimes.length - 1] ?? 0
      if (now - lastSpike < minSpikeGap) return

      spikeTimes.push(now)
      while (spikeTimes.length > 0 && spikeTimes[0] < now - windowMs) {
        spikeTimes.shift()
      }

      if (spikeTimes.length >= 3) {
        trigger()
      }
    }

    function trigger() {
      if (triggered) return
      triggered = true
      router.push("/emergency-response")
    }

    async function initMotionPermission() {
      try {
        const DeviceMotionEventWithPermission = DeviceMotionEvent as typeof DeviceMotionEvent & {
          requestPermission?: () => Promise<"granted" | "denied">
        }
        if (
          typeof DeviceMotionEvent !== "undefined" &&
          typeof DeviceMotionEventWithPermission.requestPermission === "function"
        ) {
          const response = await DeviceMotionEventWithPermission.requestPermission()
          if (response !== "granted") {
            setShowMotionNotice(true)
            return
          }
        }
      } catch (e) {
        setShowMotionNotice(true)
        return
      }

      if ("ondevicemotion" in window) {
        window.addEventListener("devicemotion", handleMotion)
      }
    }

    initMotionPermission()

    return () => {
      window.removeEventListener("devicemotion", handleMotion)
    }
  }, [router])

  if (!showMotionNotice) return null

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[90%] max-w-sm -translate-x-1/2 rounded-lg bg-slate-900 p-4 text-sm text-white shadow-lg">
      <button
        aria-label="Dismiss notification"
        onClick={() => setShowMotionNotice(false)}
        className="absolute right-2 top-2 text-slate-400 hover:text-white"
      >
        ×
      </button>
      <p className="font-medium">Shake-to-SOS is off</p>
      <p className="mt-1 text-slate-300">
        Motion permission was denied, so shaking this phone will not trigger an emergency. Use the SOS button instead.
      </p>
    </div>
  )
}