## Context

`@yaroo/chat` uses a custom Node.js server to run a Next.js development server and Socket.IO from one local port. An ngrok HTTPS tunnel exposes that port under an ephemeral `*.ngrok-free.app` hostname. Browsers load Turbopack development chunks as cross-origin dev resources and include that hostname in the `Origin` header. Without an allowlist entry, Next.js returns HTTP 403 before the custom request handler serves the chunk.

## Goals / Non-Goals

**Goals:**

- Permit current and future ephemeral ngrok free-tier hostnames to load Next.js development resources.
- Keep Next.js cross-origin protection enabled for hosts outside the intended ngrok namespace.
- Keep production runtime behavior unchanged.

**Non-Goals:**

- Do not configure CORS for application APIs or Socket.IO.
- Do not alter the custom HTTP server, ports, proxy headers, or ngrok invocation.
- Do not allow arbitrary origin patterns.

## Decisions

### Allow the one-label ngrok free-tier hostname pattern

Set Next.js `allowedDevOrigins` to `*.ngrok-free.app`. Next.js matches this pattern against the hostname parsed from the request `Origin`, so it includes ephemeral tunnel subdomains without allowing the bare domain or unrelated domains.

An exact hostname would require editing configuration whenever ngrok issues a new address. A broad `*` pattern would weaken development-origin protection beyond the tunnel namespace.

### Keep the setting in Next.js configuration only

`allowedDevOrigins` is Next.js's development-only control for internal development assets and endpoints. It directly addresses the rejected Turbopack chunk without changing application-level CORS or the same-origin Socket.IO connection.

## Implementation Contract

**Observable behavior:** When `@yaroo/chat` runs with its development command and a browser opens the app through `https://<tunnel>.ngrok-free.app`, requests for `/_next` development chunks with that origin receive the normal chunk response rather than HTTP 403. Requests from an unrelated origin remain blocked by Next.js.

**Interface and data shape:** `apps/yaroo-chat/next.config.ts` SHALL export a `NextConfig` whose `allowedDevOrigins` list contains the hostname pattern `*.ngrok-free.app`. The list SHALL contain hostnames and hostname patterns only; it SHALL NOT contain a protocol or path.

**Failure modes:** Next.js SHALL continue to return its development-origin rejection for origins that do not match the configured ngrok pattern. The application SHALL retain its existing behavior for ordinary requests and Socket.IO connections.

**Acceptance criteria:** A local HTTP request for an existing `/_next/static/chunks/` file with `Origin: https://3441-36-230-250-80.ngrok-free.app` returns HTTP 200. The same request with `Origin: https://unrelated.example` returns HTTP 403. `pnpm --filter @yaroo/chat build` exits successfully.

**Scope boundaries:** This change modifies Next.js development-origin configuration only. It excludes production origin policy, API CORS headers, Socket.IO CORS, server topology, and tunnel configuration.

## Risks / Trade-offs

- [Any ngrok free-tier subdomain can request development-only resources] → Limit the pattern to exactly one subdomain label under `ngrok-free.app`; production traffic does not use this setting.
- [Future ngrok domain changes] → The configuration remains intentionally explicit and requires a separate update if ngrok changes its hostname suffix.
- [Confusing this setting with application CORS] → Document the setting as Next.js development-resource authorization and keep the Socket.IO and HTTP runtime unchanged.

## Migration Plan

1. Restart the development server after changing Next.js configuration.
2. Reopen the ngrok URL so the browser obtains fresh development chunks.
3. Roll back by removing the `allowedDevOrigins` entry and restarting the development server.

## Open Questions

None.
