## Purpose

Defines a single, consistent auth and role system: one sign-on path, persisted user data, roles that are not hardcoded to gender, and Firebase configuration injected from the environment instead of committed source.

## ADDED Requirements

### Requirement: Single auth path
The app SHALL have exactly one functional authentication implementation. Registration and login SHALL both use the same auth backend. The in-memory mock auth SHALL be removed from the app runtime.

#### Scenario: Register then login
- **WHEN** a user registers with an email and then logs in with those credentials
- **THEN** login succeeds against the same backend that stored the registration

#### Scenario: No second auth backend
- **WHEN** any page or component triggers authentication
- **THEN** it uses the single shared auth service

### Requirement: User identity persists
Identity state, once established (sign-in, sign-up) SHALL survive page reload within the session, and the UI SHALL reflect the currently signed-in user (name, role) when rendering dashboards.

#### Scenario: Reload keeps sign-in
- **WHEN** the user signs in then reloads the page
- **THEN** the app still recognizes the signed-in user

### Requirement: Registration validates input
Registration SHALL reject empty fields, invalid email format, and passwords under 8 characters with a visible error message; error messages SHALL be specific to the failed field.

#### Scenario: Weak password rejected
- **WHEN** the user submits a password shorter than 8 characters
- **THEN** the form shows a password-specific error and no account is created

### Requirement: Role is not gender-derived
The protected/protector role for a user SHALL be stored with the user profile, default deriving from registration only as an explicitly communicated choice, and the app SHALL NOT map gender = Male to protector by default without user awareness.

#### Scenario: Any gender can choose protectory role
- **WHEN** a user with a female gender is offered the protector interface
- **THEN** the app allows it based on their profile role, not their gender

### Requirement: Firebase configuration via environment
Firebase config values (apiKey, projectId, etc.) SHALL be read from build-time environment variables, with the committed source holding no credentials.

#### Scenario: Env missing on build
- **WHEN** the app builds without the Firebase env vars set
- **THEN** the build provides a fallback demo-mode config or fails loudly with a clear message, but never silently embeds a real key