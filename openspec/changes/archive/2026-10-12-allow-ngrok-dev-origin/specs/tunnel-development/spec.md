## ADDED Requirements

### Requirement: Allow ngrok origins for Next.js development resources

The `@yaroo/chat` Next.js configuration SHALL allow `*.ngrok-free.app` through `allowedDevOrigins` when the development server evaluates requests for internal development resources. The configuration SHALL use hostname patterns without a URL scheme or path. It SHALL NOT allow origins outside the configured pattern.

#### Scenario: Load a Turbopack chunk through an ngrok free-tier tunnel

- **WHEN** a request for an existing `/_next/static/chunks/` resource includes `Origin: https://3441-36-230-250-80.ngrok-free.app`
- **THEN** Next.js SHALL return the chunk with HTTP 200 in development mode

##### Example: Ephemeral tunnel chunk request

- **GIVEN** the development server has compiled `/_next/static/chunks/_0_5o7zc._.js`
- **WHEN** that path is requested with `Origin: https://3441-36-230-250-80.ngrok-free.app`
- **THEN** the response status is 200

#### Scenario: Reject an unrelated development origin

- **WHEN** a request for an existing `/_next/static/chunks/` resource includes `Origin: https://unrelated.example`
- **THEN** Next.js SHALL retain its HTTP 403 development-origin rejection
