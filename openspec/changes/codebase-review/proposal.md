## Why

SafeGuard is a women's safety app whose core safety-critical paths do not deliver what the UI promises: shake-to-SOS navigates to a non-existent route, "recording" and "police notified" are hardcoded fiction, the PWA cannot be installed (missing icons, wrong scope, no service worker), and real bugs hide behind a build config that ignores TypeScript and lint errors. In a product built to be reached for in dangerous situations, correctness and reliability are the product.

## What Changes

- Fix the shake-to-SOS pipeline: correct route (`/emergency-response`), a single canonical `ShakeDetector`, clean `devicemotion` listener lifecycle, and iOS motion-permission handling.
- Repair asset references: provide the `alert-sound.mp3` and PWA icons the code and manifest reference, or remove the references.
- Make the PWA installable and offline-capable: fix `manifest.json` `scope`/`start_url` (`/login` → `/`), add a service worker, precache a minimal offline shell.
- Make simulated behavior honest: label demo data and simulated outcomes (emergency contacts alerted, police ETA, recording, nearby users) as demo state instead of presented-as-real, and replace real/identifiable names (Baba Ram Rahim, Salman Khan, Mamata Banerjee, Mayawati, etc.) with neutral placeholders.
- Fix the map data flow: `LiveMap` forwards `alerts` to `MapView`, police units actually render, the default map location is corrected (wrong longitude), and the dynamic Tailwind class strings in the medical emergency modal are replaced with static classes.
- Unify auth: one authentication path (Firebase), real `storeUserInfo` behavior, registration with validation, roles derived from the user record rather than a gender-only mapping, and Firebase config injected from env instead of hardcoded source.
- Re-enable guardrails: re-enable `eslint.ignoreDuringBuilds` / `typescript.ignoreBuildErrors` in `next.config.mjs`, and adopt `npx tsc --noEmit` plus `npm run lint` as acceptance gates.
- Delete dead code: duplicate map components, duplicate shake detectors (`shakedector.tsx`, `shake.js`), Firebase-hostage placeholder `public/index.html` / `404.html`, stale `styles/globals.css`, and wire up or remove orphan flows (`onboarding`, `permissions`).
- Improve UX/a11y: remove `userScalable: false`, label the dashboard hamburger-button (menu opens Contacts), replace `alert()` dialogs, provide error visibility.

## Capabilities

### New Capabilities
- `emergency-detection`: Shake/tap SOS works — one canonical `ShakeDetector` component, correct target route, clean listener lifecycle, iOS permission-denied path, and a button fallback for unsupported devices.
- `emergency-response`: Emergency flow states are honest (demo-labeling), alert sound/vibration fire from real assets, recorded-video/audio shows "preview" or actually records (MediaRecorder), and emergency contacts are actually read from the saved contacts.
- `safety-map`: Map is driven by a single data path (`LiveMap → MapView → MapComponent → LeafletMap`), defaults are correct, police/ambulance/protector markers are rendered from real props, and `any[]` props are replaced with typed models.
- `pwa-reliability`: Manifest is installable (icons present, correct scope/start_url), a service worker is registered, the app shell works offline, and documented limits of PWA background behavior inform the UI copy.
- `auth-roles`: One auth system (Firebase), real user persistence (`storeUserInfo`), role derived from profile data (not gender only), validation on registration, and Firebase config injected from environment variables.
- `code-hygiene`: No dead or duplicate code, typecheck and lint run clean, no real-person demo data, accessible labels, non-blocking dialogs.

### Modified Capabilities
- (none — `openspec/specs/` contains no specs yet; all capabilities above are new)

## Impact

- Files touched: `components/ShakeDetector.tsx` (rewrite), delete `shakedector.tsx`, `shake.js`; `app/dashboard`, `app/emergency-response`, `app/medical-response`, `app/suspect-status`, `app/protector-dashboard`, `app/travel-status`, `lib/firebase.ts`, `lib/auth.ts`, `next.config.mjs`, `public/manifest.json`, `public/*` (icons, sound, service worker, remove boilerplate), `components/medical-emergency-modal.tsx`, `components/map-view.tsx`, `components/map-component.tsx`, `components/leaflet-map.tsx`, `components/video-stream.tsx`, `components/emergency-contacts-modal.tsx`, `app/layout.tsx`, `app/onboarding`, `app/permissions`.
- Dependencies: `firebase` moves from devDependencies to dependencies; introduce a service worker (manual `public/sw.js` vs `next-pwa` — decided in design).
- Systems: SOS navigation, PWA install, auth flows, and emergency simulation become functional and honest.
- No production data changes; the in-memory mock auth disappears.