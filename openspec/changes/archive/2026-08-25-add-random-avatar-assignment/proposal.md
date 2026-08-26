## Why

Every live chat participant is currently rendered with the same hard-coded avatar, so contacts and conversations are difficult to distinguish. Assigning an avatar from the existing character artwork on each login gives sessions a lightweight visual identity without adding accounts, uploads, or persistent profile data.

## What Changes

- Randomly assign one of the 9 existing cat avatars when a user logs in, allowing independent sessions to receive the same avatar.
- Keep the assigned avatar stable for the logical login session, including automatic Socket.IO reconnects, and assign a new random avatar after a new explicit login.
- Include a validated avatar identifier in shared online-user data so every client renders the same avatar for a participant.
- Replace the frontend's hard-coded cat_roy.svg mapping with the assigned avatar identifier.
- Remove the unused user_main.jpg asset from both the live web application and the static demo asset copies; it is excluded from the assignment pool.
- Remove girl_cute.jpg, girl_glasses.jpg, and guy_blond.jpg from the live web application and from the assignment pool. A reconnect that presents one of these retired identifiers is rejected and returns the anonymous user to login for a new cat assignment.

## Capabilities

### New Capabilities

- `random-avatar-assignment`: Server-assigned, session-scoped avatars, reconnect stability, shared rendering, and the allowed avatar catalog.

### Modified Capabilities

(none)

## Impact

- Affected specs: random-avatar-assignment
- Affected code:
  - Modified:
    - packages/chat-protocol/src/index.ts
    - apps/yaroo-backend/src/chatServer.ts
    - apps/yaroo-backend/src/chatServer.test.ts
    - apps/yaroo-web/src/chatClient.ts
    - apps/yaroo-web/src/App.tsx
  - Removed:
    - apps/yaroo-web/public/avatars/user_main.jpg
    - apps/yaroo-demo-web/public/avatars/user_main.jpg
    - apps/yaroo-web/public/avatars/girl_cute.jpg
    - apps/yaroo-web/public/avatars/girl_glasses.jpg
    - apps/yaroo-web/public/avatars/guy_blond.jpg
- APIs: SessionJoinPayload and OnlineUser gain an avatar identifier used for reconnect and rendering.
- Dependencies: no new runtime or development dependencies.
