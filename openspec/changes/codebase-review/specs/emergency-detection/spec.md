## Purpose

Provides a reliable, discoverable way for a user to trigger an emergency SOS from any screen: shake detection on motion-capable devices, a visible in-app fallback for devices without motion sensors, and a deterministic result (navigate to the emergency response flow).

## ADDED Requirements

### Requirement: Shake gesture triggers SOS
The system SHALL monitor device motion while an emergency-capable screen is mounted and SHALL navigate to the emergency response screen after a shake gesture is confirmed. A shake SHALL be confirmed only after at least 3 distinct acceleration spikes are detected within a rolling 1.5 second window.

#### Scenario: Successful shake triggers emergency
- **WHEN** the device reports 3 distinct acceleration spikes (total delta above threshold) within 1.5 seconds while an emergency-capable screen is mounted
- **THEN** the system navigates to the emergency response screen

#### Scenario: Single spike does not trigger SOS
- **WHEN** the device reports fewer than 3 acceleration spikes in the window
- **THEN** the system takes no action and continues monitoring

### Requirement: Motion sensor lifecycle is clean
The system SHALL attach at most one `devicemotion` listener per mounted screen and SHALL remove that listener when the screen unmounts or when motion is disabled. A second mount of the same screen SHALL NOT create duplicate listeners that double-trigger SOS.

#### Scenario: Screen unmount removes listener
- **WHEN** the user navigates away from an emergency-capable screen
- **THEN** the `devicemotion` listener is removed and no further shake events fire

#### Scenario: Re-mount does not duplicate listeners
- **WHEN** the user navigates to a screen that mounts the detector a second time while a previous instance is still mounted
- **THEN** only one SOS can be triggered per shake event

### Requirement: iOS permission handling
On iOS-style browsers that require `DeviceMotionEvent.requestPermission`, the app SHALL request permission once before listening. If the user denies permission, the system SHALL show a non-blocking message and the app remains usable with the manual SOS button.

#### Scenario: Permission denied
- **WHEN** the user denies device-motion permission on iOS
- **THEN** the app shows a dismissible notice explaining SOS-by-shake is unavailable and keeps the manual SOS button functional

### Requirement: Fallback trigger for unsupported devices
The system SHALL offer the manual emergency button on every emergency-capable screen so SOS can be triggered on devices without motion support.

#### Scenario: Device without motion support
- **WHEN** the device does not support `devicemotion`
- **THEN** the manual SOS button is still available and functional