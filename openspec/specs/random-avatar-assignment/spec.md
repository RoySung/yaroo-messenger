# random-avatar-assignment Specification

## Purpose

TBD - created by archiving change 'add-random-avatar-assignment'. Update Purpose after archive.

## Requirements

### Requirement: Closed avatar catalog

The shared chat protocol SHALL define a closed avatar catalog containing exactly `cat_ann.svg`, `cat_candy.svg`, `cat_golden.svg`, `cat_hsuan.svg`, `cat_kai.svg`, `cat_meatball.svg`, `cat_nine.svg`, `cat_patrick.svg`, and `cat_roy.svg`. The catalog SHALL NOT contain `user_main.jpg`, `girl_cute.jpg`, `girl_glasses.jpg`, `guy_blond.jpg`, arbitrary paths, or URLs.

#### Scenario: Protocol exposes the supported catalog

- **WHEN** a caller reads the shared avatar catalog
- **THEN** it contains the 9 named identifiers and no other value

#### Scenario: Legacy main-user asset is unavailable

- **WHEN** either frontend application is built
- **THEN** its public avatar directory does not contain `user_main.jpg`

#### Scenario: Retired JPG avatars are absent from the live web application

- **WHEN** the live web application is built
- **THEN** its public avatar directory does not contain `girl_cute.jpg`, `girl_glasses.jpg`, or `guy_blond.jpg`


<!-- @trace
source: add-random-avatar-assignment
updated: 2026-08-25
code:
  - apps/yaroo-web/src/components/MainMessenger.tsx
  - apps/yaroo-web/src/components/LoginScreen.tsx
  - apps/yaroo-web/public/yaroo-logo.svg
  - package.json
  - apps/yaroo-web/src/protocolTypes.ts
  - apps/yaroo-web/public/avatars/cat_golden.svg
  - apps/yaroo-web/vite.config.ts
  - packages/chat-protocol/src/index.ts
  - packages/chat-protocol/package.json
  - apps/yaroo-web/tsconfig.json
  - apps/yaroo-web/public/avatars/cat_ann.svg
  - apps/yaroo-web/public/avatars/cat_kai.svg
  - apps/yaroo-web/public/avatars/girl_glasses.jpg
  - apps/yaroo-web/public/avatars/guy_blond.jpg
  - apps/yaroo-web/src/main.tsx
  - packages/ui/package.json
  - apps/yaroo-web/public/avatars/cat_nine.svg
  - apps/yaroo-web/src/mockData.ts
  - apps/yaroo-backend/src/protocolTypes.ts
  - packages/chat-protocol/tsconfig.json
  - apps/yaroo-web/public/favicon.svg
  - apps/yaroo-web/src/App.tsx
  - apps/yaroo-backend/src/chatServer.ts
  - apps/yaroo-web/public/avatars/girl_cute.jpg
  - apps/yaroo-web/public/avatars/cat_hsuan.svg
  - apps/yaroo-web/index.html
  - apps/yaroo-demo-web/public/avatars/user_main.jpg
  - apps/yaroo-backend/src/index.ts
  - apps/yaroo-demo-web/vite.config.ts
  - apps/yaroo-web/src/vite-env.d.ts
  - apps/yaroo-backend/tsconfig.json
  - apps/yaroo-web/src/chatTypes.ts
  - apps/yaroo-web/public/icons.svg
  - apps/yaroo-web/src/chatClient.ts
  - apps/yaroo-backend/package.json
  - apps/yaroo-web/src/components/ChatWindow.tsx
  - apps/yaroo-web/package.json
  - apps/yaroo-web/public/avatars/cat_meatball.svg
  - apps/yaroo-web/public/avatars/cat_candy.svg
  - apps/yaroo-web/public/avatars/cat_patrick.svg
  - apps/yaroo-web/public/avatars/cat_roy.svg
  - apps/yaroo-web/src/app.css
tests:
  - apps/yaroo-backend/src/chatServer.test.ts
-->

---
### Requirement: Random avatar on explicit login

When a valid session join payload omits `resumeAvatarId`, the server SHALL select one identifier from the closed avatar catalog and store it with the joined session. Selection SHALL be independent for each join and SHALL allow multiple active sessions to receive the same identifier.

#### Scenario: Initial join receives a catalog avatar

- **WHEN** an unjoined socket submits a valid nickname and initial presence without `resumeAvatarId`
- **THEN** the successful acknowledgment contains one avatar identifier from the closed catalog

#### Scenario: Duplicate assignments remain valid

- **GIVEN** the configured selector returns `cat_ann.svg` for two different valid joins
- **WHEN** both sockets join under distinct nicknames
- **THEN** both joins succeed with `avatarId` equal to `cat_ann.svg`


<!-- @trace
source: add-random-avatar-assignment
updated: 2026-08-25
code:
  - apps/yaroo-web/src/components/MainMessenger.tsx
  - apps/yaroo-web/src/components/LoginScreen.tsx
  - apps/yaroo-web/public/yaroo-logo.svg
  - package.json
  - apps/yaroo-web/src/protocolTypes.ts
  - apps/yaroo-web/public/avatars/cat_golden.svg
  - apps/yaroo-web/vite.config.ts
  - packages/chat-protocol/src/index.ts
  - packages/chat-protocol/package.json
  - apps/yaroo-web/tsconfig.json
  - apps/yaroo-web/public/avatars/cat_ann.svg
  - apps/yaroo-web/public/avatars/cat_kai.svg
  - apps/yaroo-web/public/avatars/girl_glasses.jpg
  - apps/yaroo-web/public/avatars/guy_blond.jpg
  - apps/yaroo-web/src/main.tsx
  - packages/ui/package.json
  - apps/yaroo-web/public/avatars/cat_nine.svg
  - apps/yaroo-web/src/mockData.ts
  - apps/yaroo-backend/src/protocolTypes.ts
  - packages/chat-protocol/tsconfig.json
  - apps/yaroo-web/public/favicon.svg
  - apps/yaroo-web/src/App.tsx
  - apps/yaroo-backend/src/chatServer.ts
  - apps/yaroo-web/public/avatars/girl_cute.jpg
  - apps/yaroo-web/public/avatars/cat_hsuan.svg
  - apps/yaroo-web/index.html
  - apps/yaroo-demo-web/public/avatars/user_main.jpg
  - apps/yaroo-backend/src/index.ts
  - apps/yaroo-demo-web/vite.config.ts
  - apps/yaroo-web/src/vite-env.d.ts
  - apps/yaroo-backend/tsconfig.json
  - apps/yaroo-web/src/chatTypes.ts
  - apps/yaroo-web/public/icons.svg
  - apps/yaroo-web/src/chatClient.ts
  - apps/yaroo-backend/package.json
  - apps/yaroo-web/src/components/ChatWindow.tsx
  - apps/yaroo-web/package.json
  - apps/yaroo-web/public/avatars/cat_meatball.svg
  - apps/yaroo-web/public/avatars/cat_candy.svg
  - apps/yaroo-web/public/avatars/cat_patrick.svg
  - apps/yaroo-web/public/avatars/cat_roy.svg
  - apps/yaroo-web/src/app.css
tests:
  - apps/yaroo-backend/src/chatServer.test.ts
-->

---
### Requirement: Avatar is part of the public user record

Every successful `OnlineUser` record SHALL contain the joined session's assigned `avatarId`. The server SHALL preserve that identifier in join acknowledgments, recipient-specific presence snapshots, and successful presence-update acknowledgments.

#### Scenario: Peer observes the assigned avatar

- **GIVEN** Roy is joined with `avatarId` equal to `cat_candy.svg`
- **WHEN** Bei receives a presence snapshot containing Roy
- **THEN** Roy's public user record contains `avatarId` equal to `cat_candy.svg`

#### Scenario: Presence update retains the avatar

- **GIVEN** Roy is joined with `avatarId` equal to `cat_nine.svg`
- **WHEN** Roy successfully changes presence from available to away
- **THEN** the acknowledgment and subsequent peer snapshots retain `avatarId` equal to `cat_nine.svg`


<!-- @trace
source: add-random-avatar-assignment
updated: 2026-08-25
code:
  - apps/yaroo-web/src/components/MainMessenger.tsx
  - apps/yaroo-web/src/components/LoginScreen.tsx
  - apps/yaroo-web/public/yaroo-logo.svg
  - package.json
  - apps/yaroo-web/src/protocolTypes.ts
  - apps/yaroo-web/public/avatars/cat_golden.svg
  - apps/yaroo-web/vite.config.ts
  - packages/chat-protocol/src/index.ts
  - packages/chat-protocol/package.json
  - apps/yaroo-web/tsconfig.json
  - apps/yaroo-web/public/avatars/cat_ann.svg
  - apps/yaroo-web/public/avatars/cat_kai.svg
  - apps/yaroo-web/public/avatars/girl_glasses.jpg
  - apps/yaroo-web/public/avatars/guy_blond.jpg
  - apps/yaroo-web/src/main.tsx
  - packages/ui/package.json
  - apps/yaroo-web/public/avatars/cat_nine.svg
  - apps/yaroo-web/src/mockData.ts
  - apps/yaroo-backend/src/protocolTypes.ts
  - packages/chat-protocol/tsconfig.json
  - apps/yaroo-web/public/favicon.svg
  - apps/yaroo-web/src/App.tsx
  - apps/yaroo-backend/src/chatServer.ts
  - apps/yaroo-web/public/avatars/girl_cute.jpg
  - apps/yaroo-web/public/avatars/cat_hsuan.svg
  - apps/yaroo-web/index.html
  - apps/yaroo-demo-web/public/avatars/user_main.jpg
  - apps/yaroo-backend/src/index.ts
  - apps/yaroo-demo-web/vite.config.ts
  - apps/yaroo-web/src/vite-env.d.ts
  - apps/yaroo-backend/tsconfig.json
  - apps/yaroo-web/src/chatTypes.ts
  - apps/yaroo-web/public/icons.svg
  - apps/yaroo-web/src/chatClient.ts
  - apps/yaroo-backend/package.json
  - apps/yaroo-web/src/components/ChatWindow.tsx
  - apps/yaroo-web/package.json
  - apps/yaroo-web/public/avatars/cat_meatball.svg
  - apps/yaroo-web/public/avatars/cat_candy.svg
  - apps/yaroo-web/public/avatars/cat_patrick.svg
  - apps/yaroo-web/public/avatars/cat_roy.svg
  - apps/yaroo-web/src/app.css
tests:
  - apps/yaroo-backend/src/chatServer.test.ts
-->

---
### Requirement: Automatic reconnect preserves the assignment

After an initial join succeeds, the live chat client SHALL retain the server-issued `avatarId` only in memory and SHALL submit it as `resumeAvatarId` during automatic Socket.IO rejoin. The server SHALL reuse a valid catalog `resumeAvatarId`. A fresh user-initiated login SHALL omit `resumeAvatarId` and trigger a new independent assignment.

#### Scenario: Automatic reconnect reuses the avatar

- **GIVEN** Roy's initial login returned `avatarId` equal to `cat_patrick.svg`
- **WHEN** the Socket.IO client automatically reconnects and rejoins during the same logical login
- **THEN** its rejoin payload contains `resumeAvatarId` equal to `cat_patrick.svg` and the successful user record retains that identifier

#### Scenario: Explicit new login draws again

- **GIVEN** a previous logical login used `cat_roy.svg` and has ended
- **WHEN** the visitor explicitly submits the login form again
- **THEN** the join payload omits `resumeAvatarId` and the server invokes the avatar selector for the new session


<!-- @trace
source: add-random-avatar-assignment
updated: 2026-08-25
code:
  - apps/yaroo-web/src/components/MainMessenger.tsx
  - apps/yaroo-web/src/components/LoginScreen.tsx
  - apps/yaroo-web/public/yaroo-logo.svg
  - package.json
  - apps/yaroo-web/src/protocolTypes.ts
  - apps/yaroo-web/public/avatars/cat_golden.svg
  - apps/yaroo-web/vite.config.ts
  - packages/chat-protocol/src/index.ts
  - packages/chat-protocol/package.json
  - apps/yaroo-web/tsconfig.json
  - apps/yaroo-web/public/avatars/cat_ann.svg
  - apps/yaroo-web/public/avatars/cat_kai.svg
  - apps/yaroo-web/public/avatars/girl_glasses.jpg
  - apps/yaroo-web/public/avatars/guy_blond.jpg
  - apps/yaroo-web/src/main.tsx
  - packages/ui/package.json
  - apps/yaroo-web/public/avatars/cat_nine.svg
  - apps/yaroo-web/src/mockData.ts
  - apps/yaroo-backend/src/protocolTypes.ts
  - packages/chat-protocol/tsconfig.json
  - apps/yaroo-web/public/favicon.svg
  - apps/yaroo-web/src/App.tsx
  - apps/yaroo-backend/src/chatServer.ts
  - apps/yaroo-web/public/avatars/girl_cute.jpg
  - apps/yaroo-web/public/avatars/cat_hsuan.svg
  - apps/yaroo-web/index.html
  - apps/yaroo-demo-web/public/avatars/user_main.jpg
  - apps/yaroo-backend/src/index.ts
  - apps/yaroo-demo-web/vite.config.ts
  - apps/yaroo-web/src/vite-env.d.ts
  - apps/yaroo-backend/tsconfig.json
  - apps/yaroo-web/src/chatTypes.ts
  - apps/yaroo-web/public/icons.svg
  - apps/yaroo-web/src/chatClient.ts
  - apps/yaroo-backend/package.json
  - apps/yaroo-web/src/components/ChatWindow.tsx
  - apps/yaroo-web/package.json
  - apps/yaroo-web/public/avatars/cat_meatball.svg
  - apps/yaroo-web/public/avatars/cat_candy.svg
  - apps/yaroo-web/public/avatars/cat_patrick.svg
  - apps/yaroo-web/public/avatars/cat_roy.svg
  - apps/yaroo-web/src/app.css
tests:
  - apps/yaroo-backend/src/chatServer.test.ts
-->

---
### Requirement: Invalid resume avatar is rejected safely

The server SHALL validate a present `resumeAvatarId` before reserving a nickname or joining the socket. A non-string value or string outside the closed catalog SHALL return `INVALID_AVATAR`, SHALL NOT add session state, and SHALL NOT emit a presence snapshot caused by that request.

#### Scenario: Reject an arbitrary remote URL

- **WHEN** an unjoined socket submits `resumeAvatarId` equal to `https://example.test/avatar.png`
- **THEN** the server returns `INVALID_AVATAR` and the socket remains unjoined

#### Scenario: Reject a retired JPG on reconnect

- **WHEN** an unjoined socket submits `resumeAvatarId` equal to `girl_cute.jpg`
- **THEN** the server returns `INVALID_AVATAR`, does not reserve the nickname, and the next explicit login without `resumeAvatarId` can receive a catalog cat avatar

#### Scenario: Rejected avatar does not reserve nickname

- **GIVEN** a join for nickname `Roy` was rejected because its `resumeAvatarId` was invalid
- **WHEN** another socket submits nickname `Roy` with a valid join payload
- **THEN** the later join succeeds because the rejected request did not reserve the nickname


<!-- @trace
source: add-random-avatar-assignment
updated: 2026-08-25
code:
  - apps/yaroo-web/src/components/MainMessenger.tsx
  - apps/yaroo-web/src/components/LoginScreen.tsx
  - apps/yaroo-web/public/yaroo-logo.svg
  - package.json
  - apps/yaroo-web/src/protocolTypes.ts
  - apps/yaroo-web/public/avatars/cat_golden.svg
  - apps/yaroo-web/vite.config.ts
  - packages/chat-protocol/src/index.ts
  - packages/chat-protocol/package.json
  - apps/yaroo-web/tsconfig.json
  - apps/yaroo-web/public/avatars/cat_ann.svg
  - apps/yaroo-web/public/avatars/cat_kai.svg
  - apps/yaroo-web/public/avatars/girl_glasses.jpg
  - apps/yaroo-web/public/avatars/guy_blond.jpg
  - apps/yaroo-web/src/main.tsx
  - packages/ui/package.json
  - apps/yaroo-web/public/avatars/cat_nine.svg
  - apps/yaroo-web/src/mockData.ts
  - apps/yaroo-backend/src/protocolTypes.ts
  - packages/chat-protocol/tsconfig.json
  - apps/yaroo-web/public/favicon.svg
  - apps/yaroo-web/src/App.tsx
  - apps/yaroo-backend/src/chatServer.ts
  - apps/yaroo-web/public/avatars/girl_cute.jpg
  - apps/yaroo-web/public/avatars/cat_hsuan.svg
  - apps/yaroo-web/index.html
  - apps/yaroo-demo-web/public/avatars/user_main.jpg
  - apps/yaroo-backend/src/index.ts
  - apps/yaroo-demo-web/vite.config.ts
  - apps/yaroo-web/src/vite-env.d.ts
  - apps/yaroo-backend/tsconfig.json
  - apps/yaroo-web/src/chatTypes.ts
  - apps/yaroo-web/public/icons.svg
  - apps/yaroo-web/src/chatClient.ts
  - apps/yaroo-backend/package.json
  - apps/yaroo-web/src/components/ChatWindow.tsx
  - apps/yaroo-web/package.json
  - apps/yaroo-web/public/avatars/cat_meatball.svg
  - apps/yaroo-web/public/avatars/cat_candy.svg
  - apps/yaroo-web/public/avatars/cat_patrick.svg
  - apps/yaroo-web/public/avatars/cat_roy.svg
  - apps/yaroo-web/src/app.css
tests:
  - apps/yaroo-backend/src/chatServer.test.ts
-->

---
### Requirement: Live frontend renders the assigned bundled asset

The live frontend SHALL convert a known `avatarId` into `/avatars/{avatarId}` for the current user, presence contacts, and chat-window participants. It SHALL NOT randomize during rendering or use a remote URL from server data. If runtime data contains an unknown identifier despite the typed contract, the frontend SHALL render `/avatars/cat_roy.svg` as a defensive fallback.

#### Scenario: Assigned avatar is consistent across views

- **GIVEN** Bei's public user record contains `avatarId` equal to `cat_hsuan.svg`
- **WHEN** Roy views Bei in the contact list and opens Bei's chat window
- **THEN** both views render `/avatars/cat_hsuan.svg`

#### Scenario: Unknown runtime identifier falls back locally

- **WHEN** the live frontend receives an incompatible public user record with an avatar identifier outside the catalog
- **THEN** it renders `/avatars/cat_roy.svg` and does not fetch the unknown value as a URL or path

<!-- @trace
source: add-random-avatar-assignment
updated: 2026-08-25
code:
  - apps/yaroo-web/src/components/MainMessenger.tsx
  - apps/yaroo-web/src/components/LoginScreen.tsx
  - apps/yaroo-web/public/yaroo-logo.svg
  - package.json
  - apps/yaroo-web/src/protocolTypes.ts
  - apps/yaroo-web/public/avatars/cat_golden.svg
  - apps/yaroo-web/vite.config.ts
  - packages/chat-protocol/src/index.ts
  - packages/chat-protocol/package.json
  - apps/yaroo-web/tsconfig.json
  - apps/yaroo-web/public/avatars/cat_ann.svg
  - apps/yaroo-web/public/avatars/cat_kai.svg
  - apps/yaroo-web/public/avatars/girl_glasses.jpg
  - apps/yaroo-web/public/avatars/guy_blond.jpg
  - apps/yaroo-web/src/main.tsx
  - packages/ui/package.json
  - apps/yaroo-web/public/avatars/cat_nine.svg
  - apps/yaroo-web/src/mockData.ts
  - apps/yaroo-backend/src/protocolTypes.ts
  - packages/chat-protocol/tsconfig.json
  - apps/yaroo-web/public/favicon.svg
  - apps/yaroo-web/src/App.tsx
  - apps/yaroo-backend/src/chatServer.ts
  - apps/yaroo-web/public/avatars/girl_cute.jpg
  - apps/yaroo-web/public/avatars/cat_hsuan.svg
  - apps/yaroo-web/index.html
  - apps/yaroo-demo-web/public/avatars/user_main.jpg
  - apps/yaroo-backend/src/index.ts
  - apps/yaroo-demo-web/vite.config.ts
  - apps/yaroo-web/src/vite-env.d.ts
  - apps/yaroo-backend/tsconfig.json
  - apps/yaroo-web/src/chatTypes.ts
  - apps/yaroo-web/public/icons.svg
  - apps/yaroo-web/src/chatClient.ts
  - apps/yaroo-backend/package.json
  - apps/yaroo-web/src/components/ChatWindow.tsx
  - apps/yaroo-web/package.json
  - apps/yaroo-web/public/avatars/cat_meatball.svg
  - apps/yaroo-web/public/avatars/cat_candy.svg
  - apps/yaroo-web/public/avatars/cat_patrick.svg
  - apps/yaroo-web/public/avatars/cat_roy.svg
  - apps/yaroo-web/src/app.css
tests:
  - apps/yaroo-backend/src/chatServer.test.ts
-->