# realtime-presence Specification

## Purpose

TBD - created by archiving change 'add-realtime-chat'. Update Purpose after archive.

## Requirements

### Requirement: Authoritative visible presence snapshots

After a join, accepted presence update, or disconnect, the server SHALL emit a complete recipient-specific "presence:snapshot" to every joined client. A snapshot SHALL exclude the receiving user and every connected user whose presence is "invisible".

#### Scenario: Two visible users join

- **GIVEN** "Roy" is joined with presence "available"
- **WHEN** "Bei" joins with presence "busy"
- **THEN** Roy's snapshot contains Bei, Bei's snapshot contains Roy, and neither snapshot contains its receiving user

#### Scenario: Invisible user is excluded

- **GIVEN** Roy and Bei are joined and visible
- **WHEN** Bei changes presence to "invisible"
- **THEN** Roy's next snapshot does not contain Bei and Bei continues to receive snapshots of visible users


<!-- @trace
source: add-realtime-chat
updated: 2026-10-12
code:
  - .agents/skills/spectra-commit/SKILL.md
  - packages/chat-protocol/package.json
  - apps/yaroo-chat/app/components/MainMessenger.tsx
  - .superpowers/brainstorm/13286-1787817833/content/mobile-shell-options-v2.html
  - apps/yaroo-chat/public/yaroo-logo.svg
  - .agents/skills/spectra-drift/SKILL.md
  - apps/yaroo-backend/tsconfig.json
  - apps/yaroo-chat/public/avatars/cat_meatball.svg
  - .superpowers/brainstorm/11427-1787799688/state/server-stopped
  - apps/yaroo-demo-web/src/App.tsx
  - .superpowers/brainstorm/13286-1787817833/state/server.pid
  - .superpowers/brainstorm/11427-1787799688/state/server.pid
  - apps/yaroo-chat/public/avatars/cat_ann.svg
  - apps/yaroo-web/src/main.tsx
  - .agents/skills/spectra-ingest/SKILL.md
  - apps/yaroo-demo-web/src/components/ChatWindow.tsx
  - apps/yaroo-demo-web/src/hooks/usePhonePortrait.ts
  - apps/yaroo-chat/public/avatars/cat_roy.svg
  - packages/chat-protocol/tsconfig.json
  - apps/yaroo-chat/public/avatars/cat_nine.svg
  - apps/yaroo-demo-web/PRODUCT.md
  - apps/yaroo-chat/postcss.config.mjs
  - AGENTS.md
  - apps/yaroo-chat/app/globals.css
  - apps/yaroo-chat/public/avatars/cat_kai.svg
  - apps/yaroo-chat/app/ChatApp.tsx
  - GEMINI.md
  - apps/yaroo-chat/app/types/chatTypes.ts
  - .agents/skills/spectra-review/SKILL.md
  - apps/yaroo-backend/package.json
  - apps/yaroo-chat/app/chatClient.ts
  - apps/yaroo-demo-web/src/components/MainMessenger.tsx
  - apps/yaroo-web/vite.config.ts
  - .agents/skills/spectra-analyze/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - apps/yaroo-web/tsconfig.json
  - .agents/skills/spectra-audit/SKILL.md
  - apps/yaroo-web/package.json
  - apps/yaroo-chat/public/avatars/cat_patrick.svg
  - apps/yaroo-chat/public/icons.svg
  - apps/yaroo-chat/server/chatServer.ts
  - .agents/skills/spectra-apply/SKILL.md
  - apps/yaroo-chat/public/favicon.svg
  - apps/yaroo-chat/public/avatars/cat_golden.svg
  - .agents/skills/spectra-ask/SKILL.md
  - .superpowers/brainstorm/13286-1787817833/content/waiting-accessibility.html
  - apps/yaroo-demo-web/src/components/LoginScreen.tsx
  - apps/yaroo-demo-web/.impeccable/design.json
  - apps/yaroo-chat/app/page.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - apps/yaroo-demo-web/index.html
  - packages/ui/package.json
  - apps/yaroo-chat/app/hooks/usePhonePortrait.ts
  - .superpowers/brainstorm/11427-1787799688/content/mobile-shell-options.html
  - .agents/skills/spectra-propose/SKILL.md
  - apps/yaroo-demo-web/DESIGN.md
  - README.md
  - apps/yaroo-chat/server.ts
  - apps/yaroo-chat/package.json
  - apps/yaroo-chat/app/components/ChatWindow.tsx
  - .superpowers/brainstorm/11324-1787799668/state/server.pid
  - apps/yaroo-demo-web/public/avatars/user_main.jpg
  - .agents/skills/spectra-verify/SKILL.md
  - apps/yaroo-chat/app/types/protocolTypes.ts
  - apps/yaroo-chat/public/avatars/cat_hsuan.svg
  - apps/yaroo-backend/src/index.ts
  - apps/yaroo-chat/next-env.d.ts
  - package.json
  - apps/yaroo-chat/app/types/userTypes.ts
  - apps/yaroo-chat/next.config.ts
  - apps/yaroo-web/index.html
  - .agents/skills/spectra-debug/SKILL.md
  - .superpowers/brainstorm/13286-1787817833/state/server-stopped
  - CLAUDE.md
  - packages/chat-protocol/src/index.ts
  - apps/yaroo-chat/app/components/LoginScreen.tsx
  - apps/yaroo-chat/tsconfig.json
  - apps/yaroo-demo-web/vite.config.ts
  - apps/yaroo-chat/public/avatars/cat_candy.svg
  - apps/yaroo-chat/app/layout.tsx
  - apps/yaroo-demo-web/src/app.css
tests:
  - apps/yaroo-chat/server/chatServer.test.ts
-->

---
### Requirement: Presence and custom status updates

A joined user SHALL set presence to exactly one of "available", "busy", "away", or "invisible". The server SHALL trim custom status text, allow 0 through 40 Unicode code points, store the accepted values in memory, and broadcast new snapshots.

#### Scenario: Update presence and custom status

- **GIVEN** Roy is visible to Bei
- **WHEN** Roy updates presence to "busy" and custom status to "Deep work"
- **THEN** Bei's next snapshot represents Roy with presence "busy" and custom status "Deep work"

#### Scenario: Reject invalid presence

- **WHEN** a joined user submits a presence value outside the closed enum
- **THEN** the server returns error code "INVALID_PRESENCE", retains the previous values, and emits no changed snapshot

#### Scenario: Reject an over-limit custom status

- **WHEN** a joined user submits custom status text longer than 40 Unicode code points
- **THEN** the server returns error code "STATUS_TOO_LONG", retains the previous values, and emits no changed snapshot


<!-- @trace
source: add-realtime-chat
updated: 2026-10-12
code:
  - .agents/skills/spectra-commit/SKILL.md
  - packages/chat-protocol/package.json
  - apps/yaroo-chat/app/components/MainMessenger.tsx
  - .superpowers/brainstorm/13286-1787817833/content/mobile-shell-options-v2.html
  - apps/yaroo-chat/public/yaroo-logo.svg
  - .agents/skills/spectra-drift/SKILL.md
  - apps/yaroo-backend/tsconfig.json
  - apps/yaroo-chat/public/avatars/cat_meatball.svg
  - .superpowers/brainstorm/11427-1787799688/state/server-stopped
  - apps/yaroo-demo-web/src/App.tsx
  - .superpowers/brainstorm/13286-1787817833/state/server.pid
  - .superpowers/brainstorm/11427-1787799688/state/server.pid
  - apps/yaroo-chat/public/avatars/cat_ann.svg
  - apps/yaroo-web/src/main.tsx
  - .agents/skills/spectra-ingest/SKILL.md
  - apps/yaroo-demo-web/src/components/ChatWindow.tsx
  - apps/yaroo-demo-web/src/hooks/usePhonePortrait.ts
  - apps/yaroo-chat/public/avatars/cat_roy.svg
  - packages/chat-protocol/tsconfig.json
  - apps/yaroo-chat/public/avatars/cat_nine.svg
  - apps/yaroo-demo-web/PRODUCT.md
  - apps/yaroo-chat/postcss.config.mjs
  - AGENTS.md
  - apps/yaroo-chat/app/globals.css
  - apps/yaroo-chat/public/avatars/cat_kai.svg
  - apps/yaroo-chat/app/ChatApp.tsx
  - GEMINI.md
  - apps/yaroo-chat/app/types/chatTypes.ts
  - .agents/skills/spectra-review/SKILL.md
  - apps/yaroo-backend/package.json
  - apps/yaroo-chat/app/chatClient.ts
  - apps/yaroo-demo-web/src/components/MainMessenger.tsx
  - apps/yaroo-web/vite.config.ts
  - .agents/skills/spectra-analyze/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - apps/yaroo-web/tsconfig.json
  - .agents/skills/spectra-audit/SKILL.md
  - apps/yaroo-web/package.json
  - apps/yaroo-chat/public/avatars/cat_patrick.svg
  - apps/yaroo-chat/public/icons.svg
  - apps/yaroo-chat/server/chatServer.ts
  - .agents/skills/spectra-apply/SKILL.md
  - apps/yaroo-chat/public/favicon.svg
  - apps/yaroo-chat/public/avatars/cat_golden.svg
  - .agents/skills/spectra-ask/SKILL.md
  - .superpowers/brainstorm/13286-1787817833/content/waiting-accessibility.html
  - apps/yaroo-demo-web/src/components/LoginScreen.tsx
  - apps/yaroo-demo-web/.impeccable/design.json
  - apps/yaroo-chat/app/page.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - apps/yaroo-demo-web/index.html
  - packages/ui/package.json
  - apps/yaroo-chat/app/hooks/usePhonePortrait.ts
  - .superpowers/brainstorm/11427-1787799688/content/mobile-shell-options.html
  - .agents/skills/spectra-propose/SKILL.md
  - apps/yaroo-demo-web/DESIGN.md
  - README.md
  - apps/yaroo-chat/server.ts
  - apps/yaroo-chat/package.json
  - apps/yaroo-chat/app/components/ChatWindow.tsx
  - .superpowers/brainstorm/11324-1787799668/state/server.pid
  - apps/yaroo-demo-web/public/avatars/user_main.jpg
  - .agents/skills/spectra-verify/SKILL.md
  - apps/yaroo-chat/app/types/protocolTypes.ts
  - apps/yaroo-chat/public/avatars/cat_hsuan.svg
  - apps/yaroo-backend/src/index.ts
  - apps/yaroo-chat/next-env.d.ts
  - package.json
  - apps/yaroo-chat/app/types/userTypes.ts
  - apps/yaroo-chat/next.config.ts
  - apps/yaroo-web/index.html
  - .agents/skills/spectra-debug/SKILL.md
  - .superpowers/brainstorm/13286-1787817833/state/server-stopped
  - CLAUDE.md
  - packages/chat-protocol/src/index.ts
  - apps/yaroo-chat/app/components/LoginScreen.tsx
  - apps/yaroo-chat/tsconfig.json
  - apps/yaroo-demo-web/vite.config.ts
  - apps/yaroo-chat/public/avatars/cat_candy.svg
  - apps/yaroo-chat/app/layout.tsx
  - apps/yaroo-demo-web/src/app.css
tests:
  - apps/yaroo-chat/server/chatServer.test.ts
-->

---
### Requirement: Invisible discovery semantics

Invisible presence SHALL hide a user from discovery without disconnecting the session. The invisible user SHALL initiate messages or Buzz to visible users, and a peer with the invisible user's session ID from an existing chat SHALL continue to target that connected session.

#### Scenario: Continue an existing chat after becoming invisible

- **GIVEN** Roy and Bei have an open chat and Bei's session ID is known to Roy
- **WHEN** Bei changes presence to "invisible"
- **THEN** Bei disappears from Roy's presence snapshot while direct messages between their connected sessions remain valid


<!-- @trace
source: add-realtime-chat
updated: 2026-10-12
code:
  - .agents/skills/spectra-commit/SKILL.md
  - packages/chat-protocol/package.json
  - apps/yaroo-chat/app/components/MainMessenger.tsx
  - .superpowers/brainstorm/13286-1787817833/content/mobile-shell-options-v2.html
  - apps/yaroo-chat/public/yaroo-logo.svg
  - .agents/skills/spectra-drift/SKILL.md
  - apps/yaroo-backend/tsconfig.json
  - apps/yaroo-chat/public/avatars/cat_meatball.svg
  - .superpowers/brainstorm/11427-1787799688/state/server-stopped
  - apps/yaroo-demo-web/src/App.tsx
  - .superpowers/brainstorm/13286-1787817833/state/server.pid
  - .superpowers/brainstorm/11427-1787799688/state/server.pid
  - apps/yaroo-chat/public/avatars/cat_ann.svg
  - apps/yaroo-web/src/main.tsx
  - .agents/skills/spectra-ingest/SKILL.md
  - apps/yaroo-demo-web/src/components/ChatWindow.tsx
  - apps/yaroo-demo-web/src/hooks/usePhonePortrait.ts
  - apps/yaroo-chat/public/avatars/cat_roy.svg
  - packages/chat-protocol/tsconfig.json
  - apps/yaroo-chat/public/avatars/cat_nine.svg
  - apps/yaroo-demo-web/PRODUCT.md
  - apps/yaroo-chat/postcss.config.mjs
  - AGENTS.md
  - apps/yaroo-chat/app/globals.css
  - apps/yaroo-chat/public/avatars/cat_kai.svg
  - apps/yaroo-chat/app/ChatApp.tsx
  - GEMINI.md
  - apps/yaroo-chat/app/types/chatTypes.ts
  - .agents/skills/spectra-review/SKILL.md
  - apps/yaroo-backend/package.json
  - apps/yaroo-chat/app/chatClient.ts
  - apps/yaroo-demo-web/src/components/MainMessenger.tsx
  - apps/yaroo-web/vite.config.ts
  - .agents/skills/spectra-analyze/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - apps/yaroo-web/tsconfig.json
  - .agents/skills/spectra-audit/SKILL.md
  - apps/yaroo-web/package.json
  - apps/yaroo-chat/public/avatars/cat_patrick.svg
  - apps/yaroo-chat/public/icons.svg
  - apps/yaroo-chat/server/chatServer.ts
  - .agents/skills/spectra-apply/SKILL.md
  - apps/yaroo-chat/public/favicon.svg
  - apps/yaroo-chat/public/avatars/cat_golden.svg
  - .agents/skills/spectra-ask/SKILL.md
  - .superpowers/brainstorm/13286-1787817833/content/waiting-accessibility.html
  - apps/yaroo-demo-web/src/components/LoginScreen.tsx
  - apps/yaroo-demo-web/.impeccable/design.json
  - apps/yaroo-chat/app/page.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - apps/yaroo-demo-web/index.html
  - packages/ui/package.json
  - apps/yaroo-chat/app/hooks/usePhonePortrait.ts
  - .superpowers/brainstorm/11427-1787799688/content/mobile-shell-options.html
  - .agents/skills/spectra-propose/SKILL.md
  - apps/yaroo-demo-web/DESIGN.md
  - README.md
  - apps/yaroo-chat/server.ts
  - apps/yaroo-chat/package.json
  - apps/yaroo-chat/app/components/ChatWindow.tsx
  - .superpowers/brainstorm/11324-1787799668/state/server.pid
  - apps/yaroo-demo-web/public/avatars/user_main.jpg
  - .agents/skills/spectra-verify/SKILL.md
  - apps/yaroo-chat/app/types/protocolTypes.ts
  - apps/yaroo-chat/public/avatars/cat_hsuan.svg
  - apps/yaroo-backend/src/index.ts
  - apps/yaroo-chat/next-env.d.ts
  - package.json
  - apps/yaroo-chat/app/types/userTypes.ts
  - apps/yaroo-chat/next.config.ts
  - apps/yaroo-web/index.html
  - .agents/skills/spectra-debug/SKILL.md
  - .superpowers/brainstorm/13286-1787817833/state/server-stopped
  - CLAUDE.md
  - packages/chat-protocol/src/index.ts
  - apps/yaroo-chat/app/components/LoginScreen.tsx
  - apps/yaroo-chat/tsconfig.json
  - apps/yaroo-demo-web/vite.config.ts
  - apps/yaroo-chat/public/avatars/cat_candy.svg
  - apps/yaroo-chat/app/layout.tsx
  - apps/yaroo-demo-web/src/app.css
tests:
  - apps/yaroo-chat/server/chatServer.test.ts
-->

---
### Requirement: Disconnect cleanup and reconnect

The server SHALL remove a user immediately when the joined socket disconnects and SHALL broadcast new snapshots. The frontend SHALL use Socket.IO automatic reconnection and submit a new join with the prior nickname and selected presence after reconnecting. A rejected rejoin SHALL return the application to the login form with the rejection message.

#### Scenario: Connected user disconnects

- **GIVEN** Roy's snapshot contains Bei
- **WHEN** Bei's socket disconnects
- **THEN** the server releases Bei's normalized nickname and Roy's next snapshot does not contain Bei

#### Scenario: Client reconnects successfully

- **GIVEN** Roy was joined before a transport disconnect
- **WHEN** the Socket.IO client reconnects and Roy's nickname is available
- **THEN** the frontend rejoins Roy and replaces local presence with the new authoritative snapshot

#### Scenario: Client rejoin is rejected

- **WHEN** an automatically reconnecting client receives a failed session join acknowledgment
- **THEN** the frontend stops the joined experience and displays the server error on the login form


<!-- @trace
source: add-realtime-chat
updated: 2026-10-12
code:
  - .agents/skills/spectra-commit/SKILL.md
  - packages/chat-protocol/package.json
  - apps/yaroo-chat/app/components/MainMessenger.tsx
  - .superpowers/brainstorm/13286-1787817833/content/mobile-shell-options-v2.html
  - apps/yaroo-chat/public/yaroo-logo.svg
  - .agents/skills/spectra-drift/SKILL.md
  - apps/yaroo-backend/tsconfig.json
  - apps/yaroo-chat/public/avatars/cat_meatball.svg
  - .superpowers/brainstorm/11427-1787799688/state/server-stopped
  - apps/yaroo-demo-web/src/App.tsx
  - .superpowers/brainstorm/13286-1787817833/state/server.pid
  - .superpowers/brainstorm/11427-1787799688/state/server.pid
  - apps/yaroo-chat/public/avatars/cat_ann.svg
  - apps/yaroo-web/src/main.tsx
  - .agents/skills/spectra-ingest/SKILL.md
  - apps/yaroo-demo-web/src/components/ChatWindow.tsx
  - apps/yaroo-demo-web/src/hooks/usePhonePortrait.ts
  - apps/yaroo-chat/public/avatars/cat_roy.svg
  - packages/chat-protocol/tsconfig.json
  - apps/yaroo-chat/public/avatars/cat_nine.svg
  - apps/yaroo-demo-web/PRODUCT.md
  - apps/yaroo-chat/postcss.config.mjs
  - AGENTS.md
  - apps/yaroo-chat/app/globals.css
  - apps/yaroo-chat/public/avatars/cat_kai.svg
  - apps/yaroo-chat/app/ChatApp.tsx
  - GEMINI.md
  - apps/yaroo-chat/app/types/chatTypes.ts
  - .agents/skills/spectra-review/SKILL.md
  - apps/yaroo-backend/package.json
  - apps/yaroo-chat/app/chatClient.ts
  - apps/yaroo-demo-web/src/components/MainMessenger.tsx
  - apps/yaroo-web/vite.config.ts
  - .agents/skills/spectra-analyze/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - apps/yaroo-web/tsconfig.json
  - .agents/skills/spectra-audit/SKILL.md
  - apps/yaroo-web/package.json
  - apps/yaroo-chat/public/avatars/cat_patrick.svg
  - apps/yaroo-chat/public/icons.svg
  - apps/yaroo-chat/server/chatServer.ts
  - .agents/skills/spectra-apply/SKILL.md
  - apps/yaroo-chat/public/favicon.svg
  - apps/yaroo-chat/public/avatars/cat_golden.svg
  - .agents/skills/spectra-ask/SKILL.md
  - .superpowers/brainstorm/13286-1787817833/content/waiting-accessibility.html
  - apps/yaroo-demo-web/src/components/LoginScreen.tsx
  - apps/yaroo-demo-web/.impeccable/design.json
  - apps/yaroo-chat/app/page.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - apps/yaroo-demo-web/index.html
  - packages/ui/package.json
  - apps/yaroo-chat/app/hooks/usePhonePortrait.ts
  - .superpowers/brainstorm/11427-1787799688/content/mobile-shell-options.html
  - .agents/skills/spectra-propose/SKILL.md
  - apps/yaroo-demo-web/DESIGN.md
  - README.md
  - apps/yaroo-chat/server.ts
  - apps/yaroo-chat/package.json
  - apps/yaroo-chat/app/components/ChatWindow.tsx
  - .superpowers/brainstorm/11324-1787799668/state/server.pid
  - apps/yaroo-demo-web/public/avatars/user_main.jpg
  - .agents/skills/spectra-verify/SKILL.md
  - apps/yaroo-chat/app/types/protocolTypes.ts
  - apps/yaroo-chat/public/avatars/cat_hsuan.svg
  - apps/yaroo-backend/src/index.ts
  - apps/yaroo-chat/next-env.d.ts
  - package.json
  - apps/yaroo-chat/app/types/userTypes.ts
  - apps/yaroo-chat/next.config.ts
  - apps/yaroo-web/index.html
  - .agents/skills/spectra-debug/SKILL.md
  - .superpowers/brainstorm/13286-1787817833/state/server-stopped
  - CLAUDE.md
  - packages/chat-protocol/src/index.ts
  - apps/yaroo-chat/app/components/LoginScreen.tsx
  - apps/yaroo-chat/tsconfig.json
  - apps/yaroo-demo-web/vite.config.ts
  - apps/yaroo-chat/public/avatars/cat_candy.svg
  - apps/yaroo-chat/app/layout.tsx
  - apps/yaroo-demo-web/src/app.css
tests:
  - apps/yaroo-chat/server/chatServer.test.ts
-->

---
### Requirement: Live presence interface

The main messenger SHALL render contacts and the online count from the latest server snapshot rather than mock contact data. It SHALL allow the current user to update presence and a custom status of at most 40 Unicode code points and SHALL surface rejected updates.

#### Scenario: Snapshot replaces displayed users

- **WHEN** the frontend receives a new presence snapshot
- **THEN** the displayed live-user list and online count exactly reflect that snapshot

<!-- @trace
source: add-realtime-chat
updated: 2026-10-12
code:
  - .agents/skills/spectra-commit/SKILL.md
  - packages/chat-protocol/package.json
  - apps/yaroo-chat/app/components/MainMessenger.tsx
  - .superpowers/brainstorm/13286-1787817833/content/mobile-shell-options-v2.html
  - apps/yaroo-chat/public/yaroo-logo.svg
  - .agents/skills/spectra-drift/SKILL.md
  - apps/yaroo-backend/tsconfig.json
  - apps/yaroo-chat/public/avatars/cat_meatball.svg
  - .superpowers/brainstorm/11427-1787799688/state/server-stopped
  - apps/yaroo-demo-web/src/App.tsx
  - .superpowers/brainstorm/13286-1787817833/state/server.pid
  - .superpowers/brainstorm/11427-1787799688/state/server.pid
  - apps/yaroo-chat/public/avatars/cat_ann.svg
  - apps/yaroo-web/src/main.tsx
  - .agents/skills/spectra-ingest/SKILL.md
  - apps/yaroo-demo-web/src/components/ChatWindow.tsx
  - apps/yaroo-demo-web/src/hooks/usePhonePortrait.ts
  - apps/yaroo-chat/public/avatars/cat_roy.svg
  - packages/chat-protocol/tsconfig.json
  - apps/yaroo-chat/public/avatars/cat_nine.svg
  - apps/yaroo-demo-web/PRODUCT.md
  - apps/yaroo-chat/postcss.config.mjs
  - AGENTS.md
  - apps/yaroo-chat/app/globals.css
  - apps/yaroo-chat/public/avatars/cat_kai.svg
  - apps/yaroo-chat/app/ChatApp.tsx
  - GEMINI.md
  - apps/yaroo-chat/app/types/chatTypes.ts
  - .agents/skills/spectra-review/SKILL.md
  - apps/yaroo-backend/package.json
  - apps/yaroo-chat/app/chatClient.ts
  - apps/yaroo-demo-web/src/components/MainMessenger.tsx
  - apps/yaroo-web/vite.config.ts
  - .agents/skills/spectra-analyze/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - apps/yaroo-web/tsconfig.json
  - .agents/skills/spectra-audit/SKILL.md
  - apps/yaroo-web/package.json
  - apps/yaroo-chat/public/avatars/cat_patrick.svg
  - apps/yaroo-chat/public/icons.svg
  - apps/yaroo-chat/server/chatServer.ts
  - .agents/skills/spectra-apply/SKILL.md
  - apps/yaroo-chat/public/favicon.svg
  - apps/yaroo-chat/public/avatars/cat_golden.svg
  - .agents/skills/spectra-ask/SKILL.md
  - .superpowers/brainstorm/13286-1787817833/content/waiting-accessibility.html
  - apps/yaroo-demo-web/src/components/LoginScreen.tsx
  - apps/yaroo-demo-web/.impeccable/design.json
  - apps/yaroo-chat/app/page.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - apps/yaroo-demo-web/index.html
  - packages/ui/package.json
  - apps/yaroo-chat/app/hooks/usePhonePortrait.ts
  - .superpowers/brainstorm/11427-1787799688/content/mobile-shell-options.html
  - .agents/skills/spectra-propose/SKILL.md
  - apps/yaroo-demo-web/DESIGN.md
  - README.md
  - apps/yaroo-chat/server.ts
  - apps/yaroo-chat/package.json
  - apps/yaroo-chat/app/components/ChatWindow.tsx
  - .superpowers/brainstorm/11324-1787799668/state/server.pid
  - apps/yaroo-demo-web/public/avatars/user_main.jpg
  - .agents/skills/spectra-verify/SKILL.md
  - apps/yaroo-chat/app/types/protocolTypes.ts
  - apps/yaroo-chat/public/avatars/cat_hsuan.svg
  - apps/yaroo-backend/src/index.ts
  - apps/yaroo-chat/next-env.d.ts
  - package.json
  - apps/yaroo-chat/app/types/userTypes.ts
  - apps/yaroo-chat/next.config.ts
  - apps/yaroo-web/index.html
  - .agents/skills/spectra-debug/SKILL.md
  - .superpowers/brainstorm/13286-1787817833/state/server-stopped
  - CLAUDE.md
  - packages/chat-protocol/src/index.ts
  - apps/yaroo-chat/app/components/LoginScreen.tsx
  - apps/yaroo-chat/tsconfig.json
  - apps/yaroo-demo-web/vite.config.ts
  - apps/yaroo-chat/public/avatars/cat_candy.svg
  - apps/yaroo-chat/app/layout.tsx
  - apps/yaroo-demo-web/src/app.css
tests:
  - apps/yaroo-chat/server/chatServer.test.ts
-->