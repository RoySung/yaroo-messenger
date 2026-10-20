## Why

The current messenger is a static single-browser demo backed by mock contacts and simulated replies, so it cannot demonstrate communication between real users. A lightweight anonymous real-time service is needed to make the existing interface usable as an ephemeral online chat without collecting credentials or requiring account registration.

## What Changes

- Add anonymous sign-in using a unique active nickname; the password field remains illustrative and is never transmitted, validated, persisted, or used.
- Replace mock contacts with a live presence list synchronized through Socket.IO.
- Let each connected user publish a presence state and a custom status message.
- Add real-time one-to-one messages between connected users with server-generated message identifiers and timestamps.
- Add real-time Buzz delivery with a sound, chat-window shake, system message, and a per-sender/per-recipient cooldown.
- Keep all sessions, presence, messages, and cooldown state in server memory so a server restart clears all chat data.
- Host the complete online chat experience in the product application, `@yaroo/web`, and restore `@yaroo/demo-web` to its original static demonstration behavior.
- **BREAKING** Supersede the completed split `@yaroo/web` plus `@yaroo/backend` topology with one Next.js application, `@yaroo/chat`, under `apps/yaroo-chat`; the Next.js runtime serves the product UI and owns the Socket.IO server on the same HTTP server.
- **BREAKING** Remove `apps/yaroo-web` and `apps/yaroo-backend` after their client, server, tests, public assets, and package scripts have been migrated and verified in `apps/yaroo-chat`.
- Preserve `@yaroo/demo-web` as the static demonstration and retain `@yaroo/ui`, `@yaroo/chat-protocol`, all existing real-time behavior, and the archived random-avatar behavior as workspace dependencies or contracts rather than duplicating them in the new application.

## Capabilities

### New Capabilities

- `anonymous-chat-access`: Anonymous nickname-based entry, unique active nickname enforcement, and explicit non-use of the illustrative password field.
- `realtime-presence`: Live online-user membership, presence state, custom status, invisible-mode semantics, disconnect cleanup, and reconnect behavior.
- `direct-messaging`: Validated one-to-one real-time message delivery between active sessions.
- `buzz-notification`: Validated and rate-limited real-time Buzz delivery between active sessions.

### Modified Capabilities

- `monorepo-workspace`: Replace the separate Vite product frontend and TypeScript backend applications with a single Next.js full-stack chat application and a single development/production entry point.

## Impact

- Affected specs: anonymous-chat-access, realtime-presence, direct-messaging, buzz-notification
- Affected code:
  - New:
    - packages/chat-protocol/package.json
    - packages/chat-protocol/tsconfig.json
    - packages/chat-protocol/src/index.ts
    - apps/yaroo-backend/src/chatServer.ts
    - apps/yaroo-backend/src/chatServer.test.ts
    - apps/yaroo-web/src/chatClient.ts
  - Modified:
    - pnpm-lock.yaml
    - apps/yaroo-backend/package.json
    - apps/yaroo-backend/tsconfig.json
    - apps/yaroo-backend/src/index.ts
    - apps/yaroo-web/package.json
    - apps/yaroo-web/tsconfig.json
    - apps/yaroo-web/vite.config.ts
    - apps/yaroo-web/src/main.tsx
    - apps/yaroo-demo-web files temporarily changed by the initial implementation, which are restored to their pre-change static-demo versions
  - Removed from `@yaroo/demo-web`: chat client, protocol bridge, and real-time runtime integration introduced by the initial implementation
- Dependencies: add Socket.IO server and client packages; no database or paid third-party service is introduced.
- Architecture redesign impact:
  - New:
    - `apps/yaroo-chat/package.json`
    - `apps/yaroo-chat/next.config.ts`
    - `apps/yaroo-chat/tsconfig.json`
    - `apps/yaroo-chat/server.ts`
    - `apps/yaroo-chat/app/` for the Next.js App Router UI
    - `apps/yaroo-chat/server/` for the in-memory Socket.IO chat service and integration tests
    - `apps/yaroo-chat/public/` for the live product assets
  - Modified:
    - `package.json` so `dev:chat` and the production chat command target only `@yaroo/chat`
    - `pnpm-lock.yaml` for Next.js and the consolidated application dependency graph
  - Removed after successful migration:
    - `apps/yaroo-web/`
    - `apps/yaroo-backend/`
  - Preserved:
    - `apps/yaroo-demo-web/`
    - `packages/ui/`
    - `packages/chat-protocol/`
- Dependencies: add Next.js to `@yaroo/chat`; retain React, Socket.IO, `@yaroo/ui`, and `@yaroo/chat-protocol`; remove the superseded Vite-only product tooling and standalone backend package dependency graph.
