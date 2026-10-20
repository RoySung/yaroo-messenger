# anonymous-chat-access Specification

## Purpose

TBD - created by archiving change 'add-realtime-chat'. Update Purpose after archive.

## Requirements

### Requirement: Anonymous login guidance

The login interface SHALL identify the account field as a nickname and SHALL state that no registration is required. The password field SHALL state that any value, including an empty value, is illustrative only and is not recorded or used.

#### Scenario: Login form explains anonymous access

- **WHEN** an unjoined visitor opens the application
- **THEN** the form labels the identity input as nickname and explains that the password has no authentication or storage effect


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
### Requirement: Password isolation

The frontend SHALL keep the password value inside the login form component and SHALL NOT include a password property in the login callback, Socket.IO handshake, session join event, shared protocol, browser storage, or backend state. Remember-password and automatic-login controls SHALL be removed or disabled.

#### Scenario: Submit an arbitrary password

- **WHEN** a visitor enters nickname "Roy" and password "anything" and submits the form
- **THEN** the session join payload contains nickname "Roy" and the selected initial presence and contains no password value

#### Scenario: Submit an empty password

- **WHEN** a visitor enters a valid nickname, leaves the password empty, and submits the form
- **THEN** login admission is evaluated only from the nickname and initial presence


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
### Requirement: Unique active nickname

The server SHALL trim a nickname, count Unicode code points, require 1 through 24 code points, and reserve a lowercase normalized key for each joined socket. It SHALL reject another active join using the same normalized key.

#### Scenario: Join with an available nickname

- **WHEN** an unjoined socket submits nickname "Roy" and initial presence "available"
- **THEN** the server returns a successful acknowledgment containing a server-owned session ID and nickname "Roy"

#### Scenario: Reject a case-insensitive duplicate

- **GIVEN** an active session has nickname "Roy"
- **WHEN** another socket submits nickname "roy"
- **THEN** the server returns error code "NICKNAME_TAKEN" and does not join the second socket

#### Scenario: Reject invalid nickname bounds

- **WHEN** a socket submits a whitespace-only nickname or a nickname longer than 24 Unicode code points
- **THEN** the server returns error code "INVALID_NICKNAME" and does not reserve a nickname


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
### Requirement: Joined-socket authority

The server SHALL associate identity with the joined Socket.IO socket and SHALL reject mutation events from sockets that have not joined. It SHALL derive sender identity from server state rather than client payload data.

#### Scenario: Unjoined socket sends a mutation

- **WHEN** an unjoined socket emits a presence update, direct message, or Buzz event
- **THEN** the server returns error code "NOT_JOINED" and performs no broadcast or state mutation


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
### Requirement: Ephemeral session storage

The server SHALL keep session identity only in process memory and SHALL clear all anonymous sessions when the process restarts.

#### Scenario: Restart the chat server

- **GIVEN** one or more users are joined
- **WHEN** the backend process restarts
- **THEN** the new process begins with no joined users or reserved nicknames

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