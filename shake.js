// shake.js

let shakeCount = 0;
let lastShakeTime = 0;
const shakeThreshold = 15; // Adjust this value as needed
const shakeTimeout = 1000; // Minimum time between shakes in milliseconds

let lastX = null;
let lastY = null;
let lastZ = null;

function handleMotion(event) {
  const acc = event.accelerationIncludingGravity;
  if (!acc) return;

  const { x, y, z } = acc;

  if (lastX !== null && lastY !== null && lastZ !== null) {
    const deltaX = Math.abs(x - lastX);
    const deltaY = Math.abs(y - lastY);
    const deltaZ = Math.abs(z - lastZ);

    const totalDelta = deltaX + deltaY + deltaZ;

    const currentTime = Date.now();
    if (totalDelta > shakeThreshold && (currentTime - lastShakeTime) > shakeTimeout) {
      lastShakeTime = currentTime;
      shakeCount++;

      if (shakeCount >= 3) {
        // Optionally, reset shakeCount if you want to detect subsequent shakes
        // shakeCount = 0;
        shakeCount = 0;

        // You can also add a visual indicator that the SOS has been activated
        window.location.href = 'app/emergency-response/page.tsx';
      }
    }
  }

  lastX = x;
  lastY = y;
  lastZ = z;
}

// Check if the device supports the devicemotion event
if ('ondevicemotion' in window) {
  window.addEventListener('devicemotion', handleMotion, false);
} else {
  console.warn("Device does not support 'devicemotion' event.");
  // Provide fallback behavior or instructions for users on unsupported devices
  alert("This device does not support the shake gesture for emergency SOS. Please use an alternative method to activate emergency services.");
}