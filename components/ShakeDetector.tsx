// components/ShakeDetector.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ShakeDetector() {
  const router = useRouter();

  useEffect(() => {
    let shakeCount = 0;
    let lastShakeTime = 0;
    const shakeThreshold = 15;
    const shakeTimeout = 1000;

    let lastX: number | null = null;
    let lastY: number | null = null;
    let lastZ: number | null = null;

    function handleMotion(event: DeviceMotionEvent) {
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;

      const { x, y, z } = acc;

      if (lastX !== null && lastY !== null && lastZ !== null) {
        const deltaX = Math.abs(x! - lastX);
        const deltaY = Math.abs(y! - lastY);
        const deltaZ = Math.abs(z! - lastZ);

        const totalDelta = deltaX + deltaY + deltaZ;
        const currentTime = Date.now();

        if (totalDelta > shakeThreshold && currentTime - lastShakeTime > shakeTimeout) {
          lastShakeTime = currentTime;
          shakeCount++;

          if (shakeCount >= 3) {
            shakeCount = 0;
            router.push('/app/emergency-response'); // ✅ Correct Next.js route
          }
        }
      }

      lastX = x;
      lastY = y;
      lastZ = z;
    }

    async function initMotionPermission() {
      // For iOS: Request permission if needed
      // @ts-ignore
      if (typeof DeviceMotionEvent?.requestPermission === 'function') {
        try {
          // @ts-ignore
          const response = await DeviceMotionEvent.requestPermission();
          if (response !== 'granted') {
            alert('Motion permission denied.');
            return;
          }
        } catch (e) {
          console.error('Motion permission error', e);
        }
      }

      if ('ondevicemotion' in window) {
        window.addEventListener('devicemotion', handleMotion, false);
      } else {
        alert("This device does not support motion detection.");
      }
    }

    initMotionPermission();

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [router]);

  return null;
}
