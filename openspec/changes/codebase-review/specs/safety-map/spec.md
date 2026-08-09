## Purpose

Defines the live-map behavior across female, protector, and emergency views: one consistent data flow from screen to map tiles, correct and consistent default locations, typed data, and all responder markers (police, ambulance, protector) rendered from real props.

## ADDED Requirements

### Requirement: Single map data path
A screen's map props (location, alerts, responders, medical state) SHALL flow through every map layer to the final leaflet renderer. No prop passed by a screen SHALL be silently dropped; unused props SHALL be removed from the component signatures.

#### Scenario: Alerts passed by screen reach markers
- **WHEN** the protector dashboard passes a list of alerts to the map
- **THEN** the map renders markers for exactly those alerts

#### Scenario: Props not forwarded are removed
- **WHEN** a map component signature accepts a prop it never uses or forwards
- **THEN** the prop is removed from the signature

### Requirement: Consistent default location
When geolocation is unavailable, the map SHALL fall back to a single app-wide default location; all pages and map layers SHALL use the same default so screens do not display contradictory positions.

#### Scenario: Same fallback everywhere
- **WHEN** geolocation fails on the dashboard, travel-status, and medical screens
- **THEN** all screens show the same fallback coordinate

### Requirement: Responder markers render from real data
Police, ambulance, and protector markers SHALL render from the data the map layer was given, not from state the layer silently re-generates. If a view has no police units, no police marker SHALL appear.

#### Scenario: No police in data
- **WHEN** the female dashboard map receives no police units
- **THEN** no police markers appear

#### Scenario: Police in emergency data
- **WHEN** the emergency view provides police units
- **THEN** police markers render at those coordinates

### Requirement: Typed map data
Map data (alerts, responders, routes, locations) SHALL use explicit types rather than `any`, so callers and renderers agree on shape.

#### Scenario: Type mismatch rejected
- **WHEN** a screen passes data that does not match the typed map model
- **THEN** the type checker flags the error at build time