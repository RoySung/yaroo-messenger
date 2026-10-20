## Context

The product application, `@yaroo/web`, is currently a placeholder, while `@yaroo/demo-web` contains the retro Messenger interface with fixed mock users, a static contact list, and simulated replies. The backend exits immediately after printing placeholder messages. This change installs the complete Messenger interface and its real-time client in `@yaroo/web`, connects it to a Node.js real-time service, and preserves `@yaroo/demo-web` as the original static demonstration.

The approved constraints are anonymous use, no credential collection, unique active nicknames, in-memory-only state, live presence, one-to-one messaging, editable presence and custom status, and real-time Buzz. The change adds Socket.IO as a self-hosted MIT-licensed library; it does not add an external platform account or database.

The split product implementation described above was completed in `@yaroo/web` and `@yaroo/backend`. This redesign supersedes only that application boundary: their product UI and server logic move into `@yaroo/chat`, a Next.js application with a custom Node.js server. Existing real-time behavior, `@yaroo/chat-protocol`, `@yaroo/ui`, the random-avatar contract, and the independent static `@yaroo/demo-web` application remain in force.

## Goals / Non-Goals

**Goals:**

- Allow multiple browsers to join the same ephemeral chat service with unique active nicknames.
- Synchronize visible online users, presence states, custom status text, direct messages, and Buzz events in real time.
- Ensure the illustrative password never leaves the login component and has no effect on admission.
- Preserve current draggable windows and reuse existing UI components.
- Make `@yaroo/web` the only frontend application that owns the online chat runtime while retaining `@yaroo/demo-web` as a static demo.
- Define a shared typed event contract and deterministic server-side validation.
- Surface every rejected user operation with a stable error code and readable Traditional Chinese message.
- Replace the separately operated product frontend and backend with one `@yaroo/chat` package whose Next.js and Socket.IO services share an HTTP runtime and origin.
- Preserve all approved chat and random-avatar behavior while changing package ownership, build commands, and deployment topology.

**Non-Goals:**

- Registration, authentication, password storage, authorization roles, or account recovery.
- A database, offline messages, conversation history after reload, delivery receipts beyond the active Socket.IO acknowledgment, or horizontal server scaling.
- Group chats, friends/groups, file or photo transfer, voice/video calls, persistent avatars, encryption beyond the deployment transport, or moderation tools.
- Completing unrelated buttons and menus already present in the demo.
- Sharing runtime chat state or Socket.IO dependencies with `@yaroo/demo-web`.
- Replacing Socket.IO, changing protocol event names or payload shapes, or changing in-memory state semantics as part of the Next.js migration.
- Supporting Next.js serverless, edge, static-export, or multi-replica deployment modes; the unified chat requires one long-lived Node.js process.

## Decisions

### Host the live product in @yaroo/web and preserve demo

The complete retro Messenger UI, public assets, and real-time connection layer belong to `@yaroo/web`. The product application imports the shared `@yaroo/ui` components and `@yaroo/chat-protocol` contract and owns the `socket.io-client` dependency. `@yaroo/demo-web` is restored to its pre-change source, manifest, TypeScript configuration, and static mock behavior; it does not import the chat protocol or connect to the backend.

Migrating the proven UI and connection flow directly is preferred over introducing a new shared frontend package because the two applications have different responsibilities: one is the live product and the other is a stable demonstration. Making `@yaroo/web` wrap or import the demo application was rejected because that would preserve the incorrect ownership boundary.

This ownership decision records the completed pre-redesign phase. It is superseded by **Consolidate the product into @yaroo/chat with Next.js** below; the requirement that `@yaroo/demo-web` remain independent still applies.

### Use Socket.IO with an in-memory authoritative server

The backend will host an HTTP server and Socket.IO in the existing `@yaroo/backend` application. A registry keyed by Socket.IO socket ID stores joined users; messages are routed only after server validation. No chat state is written to files, browser storage, or a database.

Socket.IO is preferred over raw WebSocket because reconnects, typed acknowledgments, heartbeat-based disconnect detection, and room targeting are built in. HTTP plus Server-Sent Events was rejected because bidirectional chat would require separate send and receive transports.

The default backend port is 3001. `PORT` can override it. `CHAT_ALLOWED_ORIGINS` is a comma-separated allowlist and defaults to `http://localhost:5173` plus `https://*.ngrok-free.app` for tunnel-based development. A wildcard is accepted only as the complete leftmost hostname label and is converted to a boundary-safe origin matcher; an empty value, bare `*`, or embedded wildcard is rejected at startup. The frontend reads `VITE_CHAT_SERVER_URL` and defaults to `http://localhost:3001`.

The transport and in-memory authority remain unchanged, but the standalone `@yaroo/backend`, cross-origin development topology, `CHAT_ALLOWED_ORIGINS`, and `VITE_CHAT_SERVER_URL` configuration are superseded by **Serve Next.js and Socket.IO from one Node.js HTTP runtime** below.

### Consolidate the product into @yaroo/chat with Next.js

Create `apps/yaroo-chat` as the sole live product package named `@yaroo/chat`. Use the Next.js App Router for the browser interface, mark interactive Messenger entry components with the client-component boundary, and keep reusable presentational controls in `@yaroo/ui`. Move the live public assets and product CSS into the new package without changing their browser-visible paths.

Move the in-memory chat server, its integration tests, and the frontend connection layer under the same package. Continue importing public protocol types and validation constants from `@yaroo/chat-protocol` so browser and server code do not create divergent local contracts. Preserve the current nine-avatar catalog and reconnect behavior from the archived random-avatar change.

Using Next.js is preferred over keeping Vite plus a standalone Node service because the product now has one package, command surface, and deployment unit. Keeping two processes behind a shared proxy was rejected because it would hide rather than remove the operational boundary requested by this redesign. Moving the protocol into the application was rejected because the protocol is an independently testable contract already shared across client and server code.

### Serve Next.js and Socket.IO from one Node.js HTTP runtime

Use a custom Node.js entry point, `apps/yaroo-chat/server.ts`, to create one HTTP server, attach Socket.IO exactly once, and delegate ordinary HTTP requests to the prepared Next.js request handler. The Socket.IO client connects with `io()` to the current origin; normal development and production operation therefore require neither a public backend URL nor product-to-backend CORS configuration.

`pnpm dev:chat` delegates only to `pnpm --filter @yaroo/chat dev`. The package uses `tsx watch server.ts --dev` for development, `next build` to generate the Next.js production assets, and `tsx server.ts` to launch the custom entry point in production mode. `tsx` is a runtime dependency because Next.js does not compile or bundle the custom server file. The entry point treats the explicit `--dev` flag as development and defaults to production, avoiding a platform-specific environment-variable assignment in package scripts. The configured `PORT` controls the shared listener and defaults to `3000`; the package declares Node.js `>=20.9.0`, matching the Next.js runtime floor.

A custom server is preferred over a Next.js Route Handler because Socket.IO requires a long-lived upgrade-capable HTTP server and connection-owned in-memory state. A serverless or edge handler was rejected because instance churn and request-scoped execution cannot satisfy the existing ephemeral session contract. The custom server intentionally gives up Automatic Static Optimization and cannot be combined with Next.js `output: "standalone"`; that trade-off is acceptable for this stateful demo.

### Share protocol types and validation limits

A new `@yaroo/chat-protocol` workspace package defines event names, public data types, acknowledgment unions, presence values, stable error codes, and character limits. Both applications import these definitions.

The public shapes are:

- `PresenceState`: `available | busy | away | invisible`.
- `OnlineUser`: `{ sessionId, nickname, presence, customStatus }`.
- `ChatMessage`: `{ id, fromSessionId, toSessionId, fromNickname, text, sentAt }`.
- `BuzzEvent`: `{ id, fromSessionId, toSessionId, fromNickname, sentAt }`.
- `Ack<T>`: `{ ok: true, data: T }` or `{ ok: false, error: { code, message } }`.

The archived random-avatar change extends `OnlineUser` with a catalog-owned `avatarId` and extends automatic rejoin input with `resumeAvatarId`; those current contracts remain normative during the application-boundary migration even though they were introduced after the original list above.

Client-to-server events are `session:join`, `presence:update`, `message:send`, and `buzz:send`. Server-to-client events are `presence:snapshot`, `message:received`, and `buzz:received`.

Limits count Unicode code points after trimming: nickname 1–24, custom status 0–40, and message 1–1,000. Presence must match the closed enum. The server creates UUIDs and ISO 8601 timestamps. Sender identity always comes from the joined socket; payloads cannot override it.

### Join anonymously with a unique active nickname

The login form labels the account field as nickname and explains that no registration is required. It labels the password as an arbitrary illustrative input and explains that it is not recorded or used. Password state remains inside `LoginScreen`; `onLogin`, the Socket.IO handshake, and `session:join` contain no password property.

The normalized nickname key is the trimmed nickname converted to lowercase. A joined socket reserves that key until disconnect. Duplicate, empty, and over-limit nicknames receive explicit acknowledgment errors. The initial presence is `available` or `invisible`, based on the existing hidden-login control.

A successfully joined client receives its own `OnlineUser` record. Automatic Socket.IO reconnection triggers a new join with the same nickname and selected state. If rejoin is rejected, the app returns to login with the server error instead of entering a partially connected state.

### Broadcast recipient-specific presence snapshots

After join, presence update, or disconnect, the server emits a complete snapshot to every joined client. Each snapshot excludes its recipient and excludes users whose presence is `invisible`. This full-snapshot model avoids client-side merge drift and is sufficient for the demo scale.

An invisible user still receives snapshots and can contact visible users. A conversation already known to another client remains usable while the invisible user stays connected, because invisibility changes discovery rather than session validity. Disconnect removes the user immediately; attempts targeting that stale session receive `RECIPIENT_OFFLINE`.

The main messenger renders one live group from the snapshot, displays status and custom text, and derives the online count from the same array. It no longer uses mock contacts for runtime presence.

### Route direct messages with server acknowledgments

A joined sender emits `message:send` with `{ toSessionId, text }`. The server verifies the recipient is joined, trims and validates the message, creates the authoritative message, emits `message:received` to both sockets, and acknowledges success. The sender and recipient therefore render the same ID and timestamp. Errors never create a local optimistic message.

Chat windows store messages only in React state, scoped by the peer session ID. Static chat history and random automated replies are removed. Enter sends; Shift+Enter inserts a newline. Rendering remains React text content, not raw HTML.

### Deliver Buzz with a per-pair cooldown

A joined sender emits `buzz:send` with `{ toSessionId }`. The server verifies the recipient and tracks the last accepted time for the sender-recipient pair. One Buzz is accepted per pair per 3,000 milliseconds.

On acceptance, the recipient receives `buzz:received`; both chat windows add a system message. Only the recipient plays the existing synthesized chime and shakes its chat window. The sender receives the authoritative Buzz data through the acknowledgment and does not play or shake. A cooldown rejection returns `BUZZ_COOLDOWN` with a retry delay and produces no recipient event.

### Make failure modes explicit and safe

All mutation events require a joined socket and return `NOT_JOINED` otherwise. Other stable codes are `INVALID_NICKNAME`, `NICKNAME_TAKEN`, `INVALID_PRESENCE`, `STATUS_TOO_LONG`, `INVALID_MESSAGE`, `RECIPIENT_OFFLINE`, and `BUZZ_COOLDOWN`. Malformed payloads are rejected without throwing or changing state.

From an adversarial perspective, the server ignores claimed sender data, bounds text, applies the Buzz cooldown, and never receives passwords. For a hurried implementer, shared constants and acknowledgments make validation the default path. For a confused caller, closed event types and error codes prevent silent coercion or ambiguous success.

## Implementation Contract

### Observable behavior

Two supported browsers running `@yaroo/web` and connected to the same backend can join under distinct nicknames, see one another unless either selects invisible, observe status updates, exchange direct messages, and send rate-limited Buzz notifications. Disconnects remove users from presence. Server restart clears every session, message, and cooldown. Running `@yaroo/demo-web` retains its original static mock behavior and does not open a Socket.IO connection.

The first sentence above records the completed split-topology behavior. After the redesign, two supported browsers load `@yaroo/chat` from one origin and connect to Socket.IO on that same origin. The user-visible login, presence, direct-message, Buzz, reconnect, and random-avatar behavior is unchanged. Neither `@yaroo/web` nor `@yaroo/backend` remains as a workspace package after migration.

The password field accepts any value including empty text, but the join callback and every network payload contain only nickname and initial presence. No remember-password or automatic-login behavior is active.

### Interface and failure contract

The protocol data shapes, event names, limits, and error codes in the decisions above are normative. Every client mutation uses `Ack<T>`; the UI displays failed join errors on the login form and failed presence, message, or Buzz operations in the relevant messenger/chat window.

Snapshots are authoritative replacements, not deltas. Message sender identity, IDs, timestamps, and Buzz cooldown decisions are server-owned. Invalid types, unknown presence values, blank messages, over-limit text, offline recipients, and unjoined sockets fail without broadcast or state mutation.

The unified runtime exposes the existing Socket.IO event contract at the same origin as the Next.js interface. Browser code uses a relative/current-origin Socket.IO connection. Ordinary Next.js requests and Socket.IO upgrade or polling requests share one `PORT`; starting the package twice on the same port fails visibly with the operating-system bind error rather than silently starting a frontend without chat service.

### Acceptance criteria

- Backend integration tests connect two Socket.IO clients and verify unique nickname enforcement, recipient-specific presence, state updates, invisible filtering, disconnect cleanup, direct-message routing, input bounds, Buzz delivery, and 3-second cooldown.
- A frontend boundary test or source-level assertion verifies that the password is absent from the `@yaroo/web` login callback and chat protocol.
- `pnpm --filter @yaroo/web build` passes with the real-time Messenger as its entry experience, and `pnpm --filter @yaroo/demo-web build` passes without `socket.io-client` or `@yaroo/chat-protocol` runtime dependencies.
- `pnpm --filter @yaroo/backend test`, `pnpm build`, and `pnpm lint` pass.
- Manual verification in two browser windows confirms login guidance, live online list, status editing, two-way messages, recipient-only Buzz sound/shake, and visible operation errors.

The five criteria above document the completed split-topology phase. The redesign supersedes commands that target `@yaroo/web` or `@yaroo/backend` with these acceptance criteria:

- `pnpm --filter @yaroo/chat test` runs the migrated Socket.IO integration suite and proves the same nickname, presence, message, Buzz, reconnect, input-bound, and avatar contracts.
- `pnpm --filter @yaroo/chat build` completes a Next.js production build, and `pnpm --filter @yaroo/chat start` serves both the built interface and Socket.IO from one configured port.
- A source assertion confirms the browser client uses a current-origin Socket.IO connection and no `VITE_CHAT_SERVER_URL` or `CHAT_ALLOWED_ORIGINS` dependency remains in the live product runtime.
- Workspace manifest inspection confirms `apps/yaroo-web` and `apps/yaroo-backend` are absent, while `@yaroo/demo-web`, `@yaroo/ui`, and `@yaroo/chat-protocol` remain buildable.
- `pnpm build`, `pnpm lint`, `spectra analyze add-realtime-chat --json`, and `spectra validate add-realtime-chat` pass; a two-browser smoke test against `@yaroo/chat` confirms login, presence, avatars, direct messages, Buzz, and reconnect behavior.

### Scope boundaries

Implementation is limited to the shared chat protocol, the backend real-time service, the `@yaroo/web` login/messenger/chat flow, and restoration of `@yaroo/demo-web` to its pre-change static behavior. Unrelated UI controls remain disabled or illustrative. A shared frontend application package, production deployment, TLS termination, data persistence, accounts, offline delivery, group messaging, and horizontally shared presence are outside this change.

For the redesign, in scope is migrating the existing live product from `apps/yaroo-web` and `apps/yaroo-backend` into `apps/yaroo-chat`, adopting Next.js App Router and a custom Node.js server, switching to same-origin Socket.IO, updating workspace scripts and tests, and deleting the superseded app directories only after verification. Out of scope is changing chat protocol behavior, changing the static demo, merging `@yaroo/ui` or `@yaroo/chat-protocol` into the app, adding persistence or authentication, deploying infrastructure, or supporting serverless, edge, static-export, and multi-replica runtimes.

## Migration Plan

1. Recreate the proven Messenger UI and real-time client under `@yaroo/web`, including the public assets, styles, shared UI aliases, chat protocol dependency, and Socket.IO client dependency.
2. Build `@yaroo/web` and verify the password boundary before removing the misplaced implementation.
3. Restore every tracked `@yaroo/demo-web` file changed for online chat to its pre-change content and remove only the untracked chat integration files created by this change.
4. Build both frontend applications, run backend tests and repository lint, and manually confirm that only `@yaroo/web` connects to the chat backend.

Rollback restores the previous `@yaroo/web` placeholder and reapplies the recorded online-chat patch to `@yaroo/demo-web`; backend and shared protocol code are unaffected by the frontend ownership correction.

The four steps and rollback above are the completed ownership-correction history. The pending redesign migration is:

1. Scaffold `@yaroo/chat` with Next.js App Router, the custom Node.js HTTP entry point, and package-local build, start, and test commands while leaving both source applications intact.
2. Move the backend chat service and integration suite into `@yaroo/chat/server`, attach it to the shared HTTP server, and prove the unchanged protocol and random-avatar behavior.
3. Move the live product UI, connection layer, CSS, and public assets into `@yaroo/chat`; replace Vite environment usage with a current-origin Socket.IO connection and verify Next.js client boundaries.
4. Run the unified integration tests, production build/start smoke test, two-browser behavior test, static-demo build, repository build, and lint.
5. Remove `apps/yaroo-web` and `apps/yaroo-backend`, update root scripts and lockfile, and repeat the complete verification suite.

Before step 5, rollback consists of deleting the new unreferenced package and retaining the two source applications. After step 5, rollback restores the two removed app directories and the prior root scripts from version control; no protocol or persistent data migration is required because state remains in memory.

## Risks / Trade-offs

- [Memory-only state loses all data on restart] → This is an explicit product constraint and is stated in the UI-facing behavior.
- [A single process cannot share presence across replicas] → Deploy one backend process for this demo; distributed adapters are outside scope.
- [Invisible users can contact visible users and remain reachable in existing chats] → Document invisibility as discovery hiding, not message blocking.
- [Nickname uniqueness is case-insensitive but not full Unicode confusable detection] → Trim and lowercase consistently; advanced identity protection requires accounts and is outside scope.
- [Audio autoplay policies can block Buzz sound] → Keep the existing fail-silent audio helper while always showing the system message and shake.
- [Frontend and backend can run on different origins] → Use an explicit development CORS allowlist and document environment overrides.
- [The shared ngrok domain is broader than a single tunnel] → Limit wildcard matching to HTTPS subdomains with a hostname boundary, reject lookalikes and bare wildcards, and override `CHAT_ALLOWED_ORIGINS` with exact production origins outside tunnel-based development.
- [A custom Next.js server is incompatible with serverless hosts, Automatic Static Optimization, and `output: "standalone"`] → Document and test the supported long-lived Node.js deployment contract; serverless, edge, static export, standalone output, and horizontal scaling remain explicitly out of scope.
- [Attaching Socket.IO more than once during development reloads creates duplicate listeners] → Keep HTTP and Socket.IO construction in the custom process entry point rather than a reloadable Route Handler, and add a start-level integration assertion that one client event produces one server event.
- [Deleting the source applications too early makes regression diagnosis difficult] → Keep both apps until the unified test, build, production-start, and two-browser checks pass, then remove them in a separate task and rerun the same suite.
