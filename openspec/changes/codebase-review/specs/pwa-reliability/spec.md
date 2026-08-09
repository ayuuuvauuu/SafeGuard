## Purpose

Makes SafeGuard genuinely installable and usable offline: correct manifest scope and start URL, real icons, a registered service worker with a cached app shell, and honest UI copy about what a web app can and cannot do in an emergency.

## ADDED Requirements

### Requirement: Manifest is installable
The web app manifest SHALL reference only assets that exist in the repo, use a scope of `/`, and be valid enough for browsers to offer installation.

#### Scenario: Install prompt available
- **WHEN** a supported browser loads the site over HTTPS
- **THEN** it offers to install SafeGuard as a standalone app

#### Scenario: Manifest assets exist
- **WHEN** the manifest is fetched
- **THEN** every icon and screenshot URL it references resolves to a file

### Requirement: Service worker registered
The app SHALL register a service worker at startup (with a valid in-scope path) and the worker SHALL cache the app shell (entry HTML, JS/CSS assets, icons, manifest) so an already-loaded install reopens offline.

#### Scenario: Offline startup after install
- **WHEN** a user opens the installed app with no network
- **THEN** the shell loads and shows an offline notice instead of a connection error

#### Scenario: First online visit
- **WHEN** a user visits without network and never previously loaded the site
- **THEN** the app shows a clear "no internet" state rather than a crash

### Requirement: Emergency flows degrade honestly offline
When offline, emergency activation, evidence capture, and SOS messaging SHALL behave as documented in-app: simulated/demo only, and the UI SHALL warn the user that alerts cannot be delivered while offline.

#### Scenario: Offline SOS attempt
- **WHEN** the user activates SOS with no connectivity
- **THEN** the screen warns that contacts cannot be notified and offers the manual call button

### Requirement: Honest background-capability copy
Copy in the app (manifest description, fake-exit, emergency pages) SHALL NOT claim background tracking, background recording, or background alerts that a mobile web app cannot perform, and SHALL explain the limitation in words.

#### Scenario: Fake exit claims checked
- **WHEN** the fake-exit dialog is shown
- **THEN** its description of what continues running in the background matches what the app actually does while hidden by the OS