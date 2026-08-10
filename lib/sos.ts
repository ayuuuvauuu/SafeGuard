export interface EmergencyAlertOptions {
  title?: string
  sound?: string
  vibration?: number[]
}

export function startEmergencyAlert(options: EmergencyAlertOptions = {}) {
  const { title = "🚨 EMERGENCY - SafeGuard", sound = "/alert-sound.mp3", vibration = [300, 100, 300] } = options

  const previousTitle = document.title
  document.title = title

  let audio: HTMLAudioElement | null = null
  try {
    audio = new Audio(sound)
    audio.volume = 1
    audio.play().catch((error) => {
      console.log("Alert sound unavailable:", error)
    })
  } catch (error) {
    console.log("Alert sound unavailable:", error)
  }

  if ("vibrate" in navigator) {
    navigator.vibrate(vibration)
  }

  return function stopEmergencyAlert() {
    document.title = previousTitle
    if (audio) {
      audio.pause()
      audio = null
    }
    if ("vibrate" in navigator) {
      navigator.vibrate(0)
    }
  }
}
