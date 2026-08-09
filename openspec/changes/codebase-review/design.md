# Design — codebase-review

## Context

Current state (from the review): two auth backends coexist (`lib/auth.ts` mock in-memory vs `lib/firebase.ts` Google popup); `ShakeDetector` exists twice (`shakedector.tsx` at root, imported by dashboard/emergency pages, and `components/ShakeDetector.tsx` which mirrors it) and both navigate to the nonexistent `/app/emergency-response`; the map chain `LiveMap → MapView → MapComponent → LeafletMap` drops the `alerts` prop and never renders `policeUnits`; `public/manifest.json` points at `/login` scope and missing icons; no service worker exists; `public/index.html`/`404.html` are Firebase boilerplate; `next.config.mjs` suppresses type/lint errors; the medical modal builds Tailwind class names with template strings (which Tailwind JIT purges). See proposal.md — Why for the full list.

## Goals / Non-Goals

- Goals: functional SOS from shake; honest emergency simulation; fix map data flow and defaults; installable + offline-shell PWA; one auth path on Firebase; env-backed Firebase config; re-enabled build gates; dead code deleted; accessible UI.
- Non-Goals: real SMS/push dispatch, real police integration, background service in the web app, native app wrapper, backend service (Firestore logic beyond minimal profile store), data migration (no production data exists at this scale).

## Decisions

1. **SOS detector: one canonical `components/ShakeDetector.tsx`, with a direct route and honest thresholds**
   - Rewrite to push `/emergency-response`, keep `shakeCount ≥ 3` spikes within a 1.5s window, register iOS `DeviceMotionEvent.requestPermission` from a gesture, and attach/detach cleanly.
   - Why: the root `shakedector.tsx` had a broken cleanup (it registered an anonymous handler and removed a different one) and the wrong route; both detector files make the app confusing. Keeping shake + manual button means no device is left without SOS.
2. **Emergency alerts: add a small `lib/sos.ts` helper for sound + vibration + session-scoped (not just visual) emergency state**
   - The helper loads `/alert-sound.mp3`, vibrates, sets `document.title`, and returns cleanup. Referenced from dashboard, emergency-response, medical-response.
   - We add the missing static asset (`alert-sound.mp3`, small synthesized file) once, shared by all three screens, rather than per-page imports with per-page error paths.
3. **Recording honesty: replace the "REC overlay" claim until real recording exists**
   - `video-stream` currently shows a live preview with a canvas overlay claiming recording at the bottom right. We label the UI "PREVIEW-NO REC" (and the elapsed "Recording" status card becomes "Preview"), leaving hook behind: `MediaRecorder` flow can plug into the same component later.
   - Alternative considered: implementing `MediaRecorder` now. Excluded because no storage/upload path exists; honest preview has smaller scope and matches the demo stage.
4. **Contacts: real read path into SOS copy**
   - `emergency-contacts-modal` saves to `localStorage["emergencyContacts"]`; the emergency status card and SOS modal will read the same key to show real names/count (demo-labeled: "Demo — alerts your contacts: X, Y"), instead of hardcoded "3 received".
5. **Map: canonical data path + typed models**
   - Define `MapLocation, MapAlert, ResponderUnit` types in `components/map-types.ts`.
   - `LiveMap` forwards everything it receives (location, alerts, police/ambulances/protectors, viewType...) to `MapView`; `MapView` forwards to `MapComponent`; `MapComponent` renders via `LeafletMap` the markers for police/ambulance/protectors with the data actually given. Remove `any[]` props.
   - Fix default: one `DEFAULT_LOCATION` (Jamshedpur `{ lat: 22.8046, lng: 86.2029 }`) exported from `map-types.ts` and used by pages (travel-status, suspect-status, medical-response default maps) and map-view fallback. The current map-view default `{ lat: 22.7744, lng: 84.2444 }` (wrong longitude) is replaced.
   - The render chain `live-map → map-view → map-component → leaflet-map` is used and stays canonical. Remove dead map files: `protector-map.tsx`, `protector-map-component.tsx`, `protector-map-component-copy-2.tsx`, `protector-leaflet-map.tsx` (grep-verified unused).
6. **Medical modal dynamic classes: replace with static theme classes**
   - `medical-emergency-modal.tsx` builds classes like `bg-${themeColor}-600` at runtime — Tailwind JIT strips these, so the accent theming silently fails. Fix: a static map from `themeColor` to complete class strings (`{ pink: "bg-pink-600 ...", blue: "bg-blue-600 ..." }`).
7. **PWA: manual `public/sw.js` with a small runtime cache strategy (no `next-pwa` dependency)**
   - Register in `app/layout.tsx` (client effect in the layout via a tiny `useEffect` client wrapper) with `navigator.serviceWorker.register("/sw.js")`.
   - `sw.js`: `precache` the app shell (`/`, `/manifest.json`, `/logo.png`, `index HTML`) and a stale-while-revalidate strategy for same-origin requests. Keep it dependency-free and cache-busted by version constant updated manually.
   - Why not `next-pwa`: it brings its own webpack build tooling to a demo that needs 10 lines of SW; less machinery, easier removal when the app goes native.
   - Manifest fixes: `scope: "/"`, `start_url: "/"`, real `icon-512x512.png` + maskable `icon-192x192.png` (generate from `logo.png`), remove missing screenshot or add a real one, `shortcuts` point at real routes (`/dashboard?action=sos` kept, medical to `/dashboard?action=medical` — fix the protector-dashboard mishap).
8. **Auth: Firebase becomes the single backend; registration moves to Firebase email/password**
   - Why: Firebase is the real backend already deployed; keeping the in-memory mock (`lib/auth.ts`) means registers die on refresh. Scope: create documented `createAccount`/`signInWithEmail` wrappers in `lib/firebase.ts` (or a new `lib/auth-api.ts`), add email/password options alongside Google on the register/login screens. `storeUserInfo` calls Firestore `users/{uid}` with the profile (no hardcoded gating by gender).
   - Role: stored on profile as `role ∈ {Protector, Protected}`, default from gender-typical mapping at registration but editable; the role switch between dashboards uses the profile role when present.
   - Alternative considered: keep mock auth as demo-only, labeled. Rejected: two systems whose behavior contradicts the app's promise confuse users and review.
   - Env: move `firebaseConfig` read from `process.env.NEXT_PUBLIC_FIREBASE_*` with a dev fallback that logs-and-warns. The committed key should be replaced by the developer in the deploy environment (key rotation in Firebase console; new key goes to env var).
9. **Build gates:** remove `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors`; add `npm run lint` script stays (`next lint`) and AGENTS.md verification line updated: `npx tsc --noEmit` must pass before PR. This exposes ~all current breakages in one go (hence "tasks" includes a fix-the-repo pass before other behavior work lands).
10. **Dead code sweep listing** (deferred list from review):
   - Delete (grep-verified unused): root `shakedector.tsx`, `shake.js`, `protector-map.tsx`, `protector-map-component.tsx`, `protector-map-component-copy-2.tsx`, `protector-leaflet-map.tsx`, `app-tutorial.tsx`, `feature-list.tsx`, `feature-explanation-dialog.tsx`, `protocol-modal.tsx`, `user-switcher.tsx`; plus `styles/globals.css` (stale), `public/index.html`, `public/404.html`.
   - Wire or delete `onboarding`/`permissions`; we recommend deleting them (they are fake — the real onboarding is in the auth modal) or making `permissions` real (request camera/location) — decision in task: make `permissions` page the real permission-request step in the post-auth flow.
11. **Content**: replace real-person demo names in `nearby-users.tsx`, `protector-dashboard` mock alerts, `map-view` generator data with neutral fictional names. `event-timeline` strings "Police notified" stay, but those screens only appear after SOS which is described as demo — that's fine: label status cards "Demo".

## Risks / Trade-offs

- [Re-enabling build gates will surface existing type/lint errors blocked by the old config] → Order tasks to fix gates only after the sweep; the lint/type fix is part of this change (no prod code change before fixes).
- [Replacing a shared `alert-sound` path may fail if missing for a while] → Add the asset in the same commit as the sound helper; the helper degrades silently (no sound, keeps vibrating).
- [Service worker caching HTML can ship stale app content after deploy] → include `version` in SW and bump at launch; provide list of precached paths in SW comment.
- [Moving Firebase config to env with no fallback breaks current dev flow] → fallback: log clear message and default to a "config missing" state that renders a demo banner instead of a white screen.
- [Deleting files can orphan imports] → sweep task greps all references (`rg "from \"@/..."`) and rebuilds with gates on.
- [`public/index.html` removal may change Firebase Hosting 404 behavior] → after deploy, verify `/` serves the app and `/404` shows Next's modal.

## Migration Plan

1. Land hygiene pass (dead code, build gates, fake-data, a11y) as its own commit-sizable task: it unblocks everything else and reduces noise.
2. Land map + emergency + SOS fixes.
3. Land auth switch (mock removed → Firebase only) with the `.env` file added to `.gitignore`, documented in AGENTS.md.
4. Land PWA assets/SW/manifest; deploy to Firebase Hosting; verify install + offline shell + new home route behavior.
5. Rollback: each phase is a separate produce-remote deploy; Firebase Hosting keeps previous release; worst case restore previous deploy via Hosting console.

## Open Questions

- None that change the specs/approach. The only open item: whether the future native-app path replaces the service worker (does not affect these edits).