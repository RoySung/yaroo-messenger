# direct-messaging Specification

## Purpose

TBD - created by archiving change 'add-realtime-chat'. Update Purpose after archive.

## Requirements

### Requirement: Validated direct message submission

A joined sender SHALL submit "message:send" with a target session ID and message text. The server SHALL trim the text, count Unicode code points, accept 1 through 1,000 code points, and reject malformed, blank, or over-limit input without broadcasting.

#### Scenario: Reject blank message

- **WHEN** a joined user submits a message containing only whitespace
- **THEN** the server returns error code "INVALID_MESSAGE" and emits no message event

#### Scenario: Reject over-limit message

- **WHEN** a joined user submits a message longer than 1,000 Unicode code points after trimming
- **THEN** the server returns error code "INVALID_MESSAGE" and emits no message event


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
### Requirement: Authoritative one-to-one routing

For a valid submission, the server SHALL verify that the target session is connected, create the sender identity from joined socket state, create a UUID and ISO 8601 timestamp, and emit the same "message:received" record only to the sender and target sockets.

#### Scenario: Deliver a direct message to both participants

- **GIVEN** Roy and Bei are joined and Tom is also joined
- **WHEN** Roy sends "hello" to Bei's session ID
- **THEN** Roy and Bei receive one record with the same server-generated ID, sender, target, text, and timestamp, while Tom receives no message record

#### Scenario: Ignore claimed sender identity

- **WHEN** Roy's joined socket submits a payload containing additional claimed sender fields
- **THEN** the delivered message identifies Roy from server session state and ignores the claimed fields


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
### Requirement: Offline recipient failure

The server SHALL reject a message whose target session is absent and SHALL return error code "RECIPIENT_OFFLINE" without creating or broadcasting a message.

#### Scenario: Target disconnects before send

- **GIVEN** Roy has a chat window for Bei
- **WHEN** Bei disconnects and Roy sends a message to Bei's stale session ID
- **THEN** Roy sees the offline-recipient error and no message appears as delivered


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
### Requirement: Server-confirmed chat rendering

The frontend SHALL add messages from authoritative "message:received" events, group them by peer session ID, use React text rendering, and avoid optimistic insertion. Enter SHALL send nonblank text and Shift+Enter SHALL insert a newline.

#### Scenario: Render a confirmed message

- **WHEN** a chat window receives a valid authoritative message for its peer
- **THEN** it renders the server sender name, text, and timestamp exactly once

#### Scenario: Surface a rejected send

- **WHEN** a message acknowledgment returns an error
- **THEN** the chat window displays the error and retains the unsent input for correction


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
### Requirement: Ephemeral message history

Direct messages SHALL exist only in active clients' React state and transient server event objects. The system SHALL NOT persist messages or restore history after a page reload or server restart.

#### Scenario: Reload the browser

- **GIVEN** a chat window contains exchanged messages
- **WHEN** that browser reloads and rejoins
- **THEN** the prior messages are absent

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