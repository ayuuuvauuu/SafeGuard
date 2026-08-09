# Tasks — codebase-review

## 1. Hygiene & build gates

- [ ] 1.1 Re-enable guards: remove `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors` from `next.config.mjs` and run `npm run lint` + `npx tsc --noEmit` to get the baseline error inventory
- [ ] 1.2 Fix all baseline type errors surfaced by 1.1 (record each fix in the commit message); do not re-add ignore flags
- [ ] 1.3 Fix all baseline lint errors surfaced by 1.1 (unused imports/vars first); remove dead imports
- [ ] 1.4 Add `.env*` to `.gitignore` (for the auth phase) and confirm `public/` has no environment-specific files left after cleanup
- [ ] 1.5 Update AGENTS.md Commands/Verification: `npx tsc --noEmit` and `npm run lint` must pass before PR; note Firebase env-var requirement

## 2. Dead code & stale files sweep

- [ ] 2.1 Delete root `shakedector.tsx` and `shake.js`
- [ ] 2.2 Delete unused map copies: `protector-map.tsx`, `protector-map-component.tsx`, `protector-map-component-copy-2.tsx`, `protector-leaflet-map.tsx` (grep-verified unused)
- [ ] 2.3 Delete unused components: `app-tutorial.tsx`, `feature-list.tsx`, `feature-explanation-dialog.tsx`, `protocol-modal.tsx`, `user-switcher.tsx`
- [ ] 2.4 Delete stale `styles/globals.css` (root `app/globals.css` is canonical)
- [ ] 2.5 Delete Firebase boilerplate `public/index.html` and `public/404.html`; verify `/` still serves the app and 404 shows Next's error page
- [ ] 2.6 Remove duplicate `import "./globals.css"` lines at the bottom of `app/layout.tsx`
- [ ] 2.7 Wire or remove orphan flows: delete `app/onboarding` and `app/permissions`, or repurpose `permissions` as the real permission-request step in the post-auth flow (decide during apply; keep behavior coherent with specs)

## 3. Demo content & honesty (emergency-response spec)

- [ ] 3.1 Replace real-person names in `components/nearby-users.tsx` (Baba Ram Rahim, Salman Khan, Batman, Shaktimaan) with neutral fictional names
- [ ] 3.2 Replace real-person names in `app/protector-dashboard/page.tsx` mock alerts (Mamata Banerjee, Mayawati, Mehbooba Mufti, Uorfi Javed, Rakhi Sawant) with fictional names
- [ ] 3.3 Replace names in `map-view.tsx` alert/protector generators (Amrita, Ritika, Rahul M., Amit K., Vikram S.) with fictional names consistent with 3.1/3.2
- [ ] 3.4 Label simulated status cards ("Police Notified ETA 8 mins", "Contacts Alerted 3 received", "Nearby Users 7 within 2km") as Demo/Simulated on emergency-response, medical-response, and suspect-status pages
- [ ] 3.5 Label nearby-users list and messaging as simulated ("Demo — no real users nearby")
- [ ] 3.6 Ensure "Contacts Alerted" count reads the user's saved `emergencyContacts` (fallback "0") instead of a hardcoded "3"

## 4. SOS detection (emergency-detection spec)

- [ ] 4.1 Rewrite `components/ShakeDetector.tsx`: push `/emergency-response`, require 3 spikes within a 1.5s window, iOS `DeviceMotionEvent.requestPermission` from a gesture, and clean `devicemotion` removeEventListener on unmount (use a stable named handler)
- [ ] 4.2 Re-point `app/dashboard/page.tsx` and `app/emergency-response/page.tsx` imports from `@/shakedector` to `@/components/ShakeDetector` and delete the root file (already in 2.1)
- [ ] 4.3 Guard against double-mount duplicates (e.g., ensure only one detector instance is active per screen) and against triggering on non-emergency screens
- [ ] 4.4 Add manual SOS fallback: ensure the Emergency SOS button on the dashboard and the emergency header button are always available, and show a dismissible notice when motion permission is denied (no device-motion → button still works)

## 5. Emergency sound, recording & contacts (emergency-response spec)

- [ ] 5.1 Create `lib/sos.ts` helper: plays `/alert-sound.mp3`, vibrates pattern, sets `document.title` with emergency prefix, returns cleanup
- [ ] 5.2 Add `public/alert-sound.mp3` asset (small generated tone) referenced by all three screens
- [ ] 5.3 Replace per-page sound/title logic in `dashboard`, `emergency-response`, `medical-response` with the `lib/sos.ts` helper (keeps silent-degrade if asset missing)
- [ ] 5.4 Make `video-stream.tsx` honest: remove the REC/timestamp overlay claim and show "PREVIEW — not recording" (elapsed "Evidence Recording" counter on emergency-response becomes "Preview time"); leave a clearly-marked `MediaRecorder` TODO
- [ ] 5.5 Confirm emergency contacts modal data flows into the SOS copy (count + names) per 3.6 and the emergency modal's "will alert your contacts" text
- [ ] 5.6 Add a confirmation step to "End Emergency" (dashboard deactivate + emergency-response end button) per spec
- [ ] 5.7 Remove the inert "Call Emergency Services" button on medical-response (or wire it to `tel:` with a region-appropriate number — ask user; default: remove)

## 6. Map data flow (safety-map spec)

- [ ] 6.1 Create `components/map-types.ts` with typed `MapLocation`, `MapAlert`, `ResponderUnit`, `MapViewType` models and a single exported `DEFAULT_LOCATION`
- [ ] 6.2 Fix `map-view.tsx` default: use `DEFAULT_LOCATION` (correct lng 86.x, not 84.x) and route the geolocation-failure fallback through the same constant
- [ ] 6.3 Fix `map-view.tsx` location state so pages passing a `location` prop (travel-status, suspect-status, medical-response) actually drive the map with it (honor the prop over the internal default)
- [ ] 6.4 Thread `alerts` through `LiveMap → MapView → MapComponent → LeafletMap` so protector-dashboard's `activeAlerts` render as markers
- [ ] 6.5 Render police units from real props in the leaflet layer (currently generated-but-dropped); ambulances/protectors also from given data, with empty-data → no markers
- [ ] 6.6 Replace `any[]` map props with the typed models from 6.1 across live-map/map-view/map-component/leaflet-map
- [ ] 6.7 Remove `routes` prop if it is not rendered anywhere; else wire it

## 7. PWA & manifest (pwa-reliability spec)

- [ ] 7.1 Fix `public/manifest.json`: `scope: "/"`, `start_url: "/"`, keep/repair shortcuts to real routes, drop references to missing `/screenshot1.png` or add a real screenshot
- [ ] 7.2 Generate `public/icon-192x192.png` and `public/icon-512x512.png` (maskable) from `logo.png`; add to manifest icons; remove stale icon references
- [ ] 7.3 Add `public/sw.js` with a version constant, precache of `/`, `/manifest.json`, `/logo.png`, icons, and a stale-while-revalidate strategy for same-origin requests
- [ ] 7.4 Register the service worker client-side (small client wrapper used from `app/layout.tsx`); log registration errors
- [ ] 7.5 Add an offline notice (install-time fetch-failure or `navigator.onLine` listener) on the dashboard so an offline user sees "alerts cannot be delivered" per spec
- [ ] 7.6 Fix "Fake Exit" copy to not claim background tracking/recording/alerts that the web app cannot perform (label as disguise navigation only)

## 8. Auth & roles (auth-roles spec)

- [ ] 8.1 Move `firebaseConfig` in `lib/firebase.ts` to `process.env.NEXT_PUBLIC_FIREBASE_*` with a loud fallback for missing env (dev banner, never silent fake key)
- [ ] 8.2 Move `firebase` (and `@firebase/app`) from devDependencies to dependencies in `package.json`
- [ ] 8.3 Implement real `storeUserInfo`: write `users/{uid}` (name, role, gender, createdAt) to Firestore on Google sign-in and on email registration
- [ ] 8.4 Add email/password registration + login using Firebase auth (`createUserWithEmailAndPassword`, `signInWithEmailAndPassword`) with validation (email format, password ≥ 8 chars, specific error messages) on `app/register/page.tsx`
- [ ] 8.5 Remove `lib/auth.ts` mock and its imports; register and login pages both use Firebase; add session persistence (`onAuthStateChanged`) so reload keeps the user signed in
- [ ] 8.6 Add a role field to the profile (default from registration gender choice but stored, not derived at runtime); dashboards read the profile role for the role switch
- [ ] 8.7 Fix register page: default gender to a neutral/undeclared option instead of "Male", and make the protectory/protected mapping explicit to the user before registration
- [ ] 8.8 Re-verify the login page (remove dead commented-out admin/Admin login block) and keep a single Google+email login surface

## 9. Accessibility & UX

- [ ] 9.1 Remove `userScalable: false` from `app/layout.tsx` viewport
- [ ] 9.2 Add aria-labels to icon-only buttons (dashboard hamburger/menu, timeline chevrons, camera toggles, fake-exit X)
- [ ] 9.3 Replace `alert()` calls (register success, photo captured, medical info saved, etc.) with toasts/inline messages (sonner is already a dependency)
- [ ] 9.4 Move medical-emergency-modal dynamic Tailwind classes (`bg-${themeColor}-600` etc.) to a static class map so the pink/blue theming actually renders

## 10. Verification & docs

- [ ] 10.1 Run `npx tsc --noEmit` clean and `npm run lint` clean; run `npm run build` and fix anything it surfaces
- [ ] 10.2 Smoke-test flows: register → login → user-selection → female dashboard → SOS (shake path and button) → emergency-response (sound, vibration, title, demo labels) → fake exit → contacts modal → medical modal → suspect capture → protector dashboard alerts render on map
- [ ] 10.3 Verify PWA: build, `npx serve` or Firebase preview, install prompt, offline reload shows the shell + offline notice, manifest icons resolve
- [ ] 10.4 Update AGENTS.md architecture notes: single auth system, canonical components list, no dead files, verification commands, env-var requirement for Firebase