# buzz-notification Specification

## Purpose

TBD - created by archiving change 'add-realtime-chat'. Update Purpose after archive.

## Requirements

### Requirement: Real-time Buzz delivery

A joined sender SHALL submit "buzz:send" with a target session ID. For an accepted request, the server SHALL create a UUID and ISO 8601 timestamp, return the authoritative Buzz record to the sender acknowledgment, and emit one "buzz:received" event to the target socket.

#### Scenario: Deliver Buzz to an online target

- **GIVEN** Roy and Bei are joined
- **WHEN** Roy sends Buzz to Bei's session ID
- **THEN** Roy receives a successful acknowledgment and Bei receives one Buzz event with the same ID, sender, target, and timestamp


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
### Requirement: Buzz user experience

Both participants' chat windows SHALL add a system message for an accepted Buzz. Only the recipient SHALL invoke the existing synthesized chime and chat-window shake; the sender SHALL not invoke those recipient effects.

#### Scenario: Recipient handles Buzz

- **WHEN** Bei receives Roy's authoritative Buzz event
- **THEN** Bei's chat window adds a Buzz system message, attempts to play the chime, and shakes the window

#### Scenario: Sender handles accepted Buzz

- **WHEN** Roy receives a successful Buzz acknowledgment
- **THEN** Roy's chat window adds a Buzz system message without playing the chime or shaking the window


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
### Requirement: Per-pair Buzz cooldown

The server SHALL accept at most one Buzz from the same sender session to the same target session within any 3,000 millisecond interval. Cooldown state SHALL be server-owned and in memory.

#### Scenario: Reject rapid repeated Buzz

- **GIVEN** Roy has sent an accepted Buzz to Bei
- **WHEN** Roy sends another Buzz to Bei before 3,000 milliseconds have elapsed
- **THEN** the server returns error code "BUZZ_COOLDOWN" with a nonnegative retry delay and emits no second recipient event

#### Scenario: Accept Buzz after cooldown

- **GIVEN** Roy sent an accepted Buzz to Bei at least 3,000 milliseconds earlier
- **WHEN** Roy sends Buzz to Bei again
- **THEN** the server accepts and delivers the new Buzz

#### Scenario: Cooldown is pair-specific

- **GIVEN** Roy has sent an accepted Buzz to Bei within the last 3,000 milliseconds
- **WHEN** Roy sends Buzz to Tom
- **THEN** the server evaluates the Roy-to-Tom pair independently and accepts it when that pair has no active cooldown


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
### Requirement: Invalid Buzz failure

The server SHALL reject Buzz from an unjoined sender or Buzz targeting an absent session without recipient effects or system messages.

#### Scenario: Target is offline

- **WHEN** a joined sender submits Buzz to a disconnected session ID
- **THEN** the server returns error code "RECIPIENT_OFFLINE" and emits no Buzz event

#### Scenario: Surface Buzz error

- **WHEN** the frontend receives a failed Buzz acknowledgment
- **THEN** the sender's chat window displays the error and does not add a successful Buzz system message


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
### Requirement: Ephemeral Buzz state

Buzz events and cooldown records SHALL remain in memory only and SHALL be cleared by a server restart.

#### Scenario: Restart clears cooldown

- **GIVEN** a sender-recipient pair has an active Buzz cooldown
- **WHEN** the backend process restarts
- **THEN** the new process contains no cooldown record for that pair

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