## Purpose

Keeps the codebase maintainable and trustworthy for a safety app: no dead or duplicate code, typecheck and lint enforced, no real-person data in demo content, accessible UI, and no blocked-on-alert() interactions.

## ADDED Requirements

### Requirement: No dead or duplicate code
The repo SHALL contain no unused route pages, no duplicate map/shake-detector components, and no stale fixtures: every file tracked in git SHALL be either referenced at build time or scheduled for removal. Dead files SHALL be deleted, not commented.

#### Scenario: Dead file removed
- **WHEN** a component is not imported by any page
- **THEN** that component file is deleted

#### Scenario: Duplicate implementations removed
- **WHEN** two files implement the same behavior (e.g., two shake detectors)
- **THEN** one canonical implementation remains and all imports point to it

### Requirement: Build gates re-enabled
The build SHALL fail on TypeScript errors and lint errors. `next.config.mjs` SHALL NOT suppress type errors (ESLint...) during builds.

#### Scenario: Type error fails build
- **WHEN** `npm run build` runs with a TypeScript type error
- **THEN** the build fails

#### Scenario: Lint error fails build
- **WHEN** `npm run lint` runs with a lint error
- **THEN** the lint step fails

### Requirement: No real-person demo data
Demo/mock data used in the UI (alert victims, nearby users, protectors) SHALL use clearly fictional names and SHALL NOT use names/faces of real, identifiable people.

#### Scenario: Fictional demo names
- **WHEN** a page renders mock user data (alerts, nearby users)
- **THEN** all names are fictional placeholders

### Requirement: Accessible interaction
Interactive affordances SHALL have accessible labels; icons used without text SHALL have aria-labels (or visible text equivalents). `userScalable` SHALL NOT be disabled in the viewport meta.

#### Scenario: Icon button labeled
- **WHEN** a page renders an icon-only interactive element
- **THEN** it has an aria-label accessible description

#### Scenario: Pinch zoom available
- **WHEN** the viewport meta is applied
- **THEN** `user-scalable` is not set to `no` / scaling is not disabled

### Requirement: Non-blocking feedback
The app SHALL NOT use `alert()`, `prompt()` or `confirm()` for feedback; blocking dialogs SHALL be replaced by in-app toast/inline messaging.

#### Scenario: Toast instead of alert
- **WHEN** an action needs to inform the user (e.g., "registered successfully")
- **THEN** the app uses a toast or inline message and the page stays responsive

### Breaking build contract note
Deleting `public/index.html` and `public/404.html` (Firebase boilerplate) is part of the hygiene scope; these must not break the Next.js homepage or 404 behavior after removal.