import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ShakeDetector: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    let shakeCount = 0;
    let lastShakeTime = 0;

    const handleShake = () => {
      const currentTime = Date.now();
      const timeSinceLastShake = currentTime - lastShakeTime;

      if (timeSinceLastShake > 500) {
        shakeCount = 1;
      } else {
        shakeCount++;
      }

      lastShakeTime = currentTime;

      if (shakeCount >= 3) {
        router.push('/app/emergency-response/page');
        shakeCount = 0;
      }
    };

    if (typeof window !== 'undefined' && 'ondevicemotion' in window) {
      window.addEventListener('devicemotion', (event) => {
        const acceleration = event.accelerationIncludingGravity;
        if (acceleration) {
          const { x, y, z } = acceleration;
          const totalAcceleration = Math.sqrt(x ** 2 + y ** 2 + z ** 2);

          if (totalAcceleration > 20) {
            handleShake();
          }
        }
      });

      return () => {
        window.removeEventListener('devicemotion', (event) => {
          // Empty event listener to satisfy removeEventListener
        });
      };
    }
  }, [router]);

  return null; // This component doesn't render anything
};

export default ShakeDetector;