## Purpose

Defines the observable behavior of the emergency response screens (SOS, medical, suspect): clear demo-state labeling where behavior is simulated, working alert sound/vibration backed by real assets, honest recording/evidence behavior, and use of the user's saved emergency contacts.

## ADDED Requirements

### Requirement: Simulated notifications are labeled as demo
Where police dispatch, contact notification, nearby-user alerts, or response ETAs are simulated rather than real, the UI SHALL visibly label them as simulated (e.g., "Demo"/"Simulated") so a user cannot mistake fake alerts for actual dispatched responders.

#### Scenario: Demo label on simulated status cards
- **WHEN** the emergency response screen shows a police/contact/nearby status card backed by hardcoded data
- **THEN** the card includes a visible "Demo"/"Simulated" marker

### Requirement: Emergency sound and vibration
The emergency response screens SHALL play a real bundled alert sound and vibrate when activated. If the sound asset is unavailable, the screen SHALL NOT error; vibration and title updates STILL happen.

#### Scenario: Sound asset present
- **WHEN** the user activates an emergency and the shared alert sound asset exists
- **THEN** the sound plays and the device vibrates

#### Scenario: Sound asset missing
- **WHEN** the alert-sound asset is missing from the deployment
- **THEN** the app logs the failure, still vibrates, and still shows the emergency title without breaking the screen

### Requirement: Recording behavior is honest
When an emergency screen shows "recording", the system SHALL either actually record (capturing media with a recordable format) or clearly show "preview/not recording" state. The on-screen clock SHALL not claim a live recording when no recording is being captured.

#### Scenario: Recording simulated
- **WHEN** the emergency response screen does not capture media
- **THEN** the UI shows preview-only/non-recording state instead of an elapsed "recording" counter

#### Scenario: Recording implemented
- **WHEN** the emergency response screen captures media
- **THEN** the media is recorded in a container format and the elapsed counter reflects actual recording duration

### Requirement: Evidence survives refresh
Photo and medical evidence captured during an emergency SHALL persist across a full page reload.

#### Scenario: Photo evidence reload
- **WHEN** the user captures a suspect photo and then reloads the suspect-status screen
- **THEN** the captured photo is still visible

### Requirement: Emergency contacts drive SOS messaging
Emergency contacts managed in the app SHALL be the contacts referenced by the SOS activation flow, and the flow SHALL show their number of contacts in "contacts alerted" summaries where real messaging is simulated.

#### Scenario: SOS uses saved contacts
- **WHEN** the user activates SOS with 3 saved emergency contacts
- **THEN** the contacts-alerted status reflects those saved contacts (count and names)

### Requirement: Deactivation of emergency is deliberate
Ending an emergency SHALL require an explicit confirmation step and SHALL be distinct from the "fake exit" disguise interaction.

#### Scenario: Confirmation before end
- **WHEN** the user taps "End Emergency" / "Deactivate"
- **THEN** the system shows a confirmation prompt before terminating the emergency state