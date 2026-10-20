## Problem

When `@yaroo/chat` runs in Next.js development mode behind an ngrok tunnel, browser requests for `/_next` development chunks include the tunnel origin and are rejected with HTTP 403. The chat application cannot load through the tunnel.

## Root Cause

The Next.js configuration does not define `allowedDevOrigins`. Next.js therefore blocks its development-only assets when their `Origin` header is an ngrok hostname.

## Proposed Solution

Allow one-level `ngrok-free.app` subdomains through Next.js `allowedDevOrigins`. The setting applies only in development mode and accommodates the ephemeral hostname issued by an ngrok tunnel.

## Non-Goals

- Do not relax origin checks for arbitrary domains.
- Do not change production server behavior, Socket.IO behavior, or application authentication.
- Do not add an ngrok dependency or manage tunnel lifecycle.

## Success Criteria

- A request for a Next.js development chunk with an `Origin` host matching `*.ngrok-free.app` receives HTTP 200.
- A request from an unrelated origin remains rejected by Next.js development-origin protection.
- The production build continues to succeed.

## Capabilities

### New Capabilities

- `tunnel-development`: Development-only tunnel origins can load Next.js development resources.

### Modified Capabilities

(none)

## Impact

- Affected code:
  - Modified: apps/yaroo-chat/next.config.ts
  - New: openspec/changes/allow-ngrok-dev-origin/
