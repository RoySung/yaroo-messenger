# tunnel-development Specification

## Purpose

TBD - created by archiving change 'allow-ngrok-dev-origin'. Update Purpose after archive.

## Requirements

### Requirement: Allow ngrok origins for Next.js development resources

The `@yaroo/chat` Next.js configuration SHALL allow `*.ngrok-free.app` through `allowedDevOrigins` when the development server evaluates requests for internal development resources. The configuration SHALL use hostname patterns without a URL scheme or path. It SHALL NOT allow origins outside the configured pattern.

#### Scenario: Load a Turbopack chunk through an ngrok free-tier tunnel

- **WHEN** a request for an existing `/_next/static/chunks/` resource includes `Origin: https://3441-36-230-250-80.ngrok-free.app`
- **THEN** Next.js SHALL return the chunk with HTTP 200 in development mode

##### Example: Ephemeral tunnel chunk request

- **GIVEN** the development server has compiled `/_next/static/chunks/_0_5o7zc._.js`
- **WHEN** that path is requested with `Origin: https://3441-36-230-250-80.ngrok-free.app`
- **THEN** the response status is 200

#### Scenario: Reject an unrelated development origin

- **WHEN** a request for an existing `/_next/static/chunks/` resource includes `Origin: https://unrelated.example`
- **THEN** Next.js SHALL retain its HTTP 403 development-origin rejection

<!-- @trace
source: allow-ngrok-dev-origin
updated: 2026-10-12
code:
  - apps/yaroo-chat/public/avatars/cat_kai.svg
  - .agents/skills/spectra-ingest/SKILL.md
  - .superpowers/brainstorm/11427-1787799688/state/server-stopped
  - .agents/skills/spectra-propose/SKILL.md
  - apps/yaroo-demo-web/DESIGN.md
  - packages/ui/package.json
  - apps/yaroo-chat/package.json
  - GEMINI.md
  - apps/yaroo-demo-web/index.html
  - .agents/skills/spectra-debug/SKILL.md
  - apps/yaroo-chat/tsconfig.json
  - AGENTS.md
  - apps/yaroo-web/index.html
  - packages/chat-protocol/tsconfig.json
  - apps/yaroo-backend/src/index.ts
  - apps/yaroo-chat/app/hooks/usePhonePortrait.ts
  - README.md
  - apps/yaroo-chat/public/icons.svg
  - packages/chat-protocol/package.json
  - apps/yaroo-demo-web/vite.config.ts
  - .superpowers/brainstorm/13286-1787817833/state/server-stopped
  - .agents/skills/spectra-analyze/SKILL.md
  - packages/chat-protocol/src/index.ts
  - apps/yaroo-chat/app/globals.css
  - .superpowers/brainstorm/11427-1787799688/content/mobile-shell-options.html
  - apps/yaroo-chat/public/favicon.svg
  - apps/yaroo-web/tsconfig.json
  - apps/yaroo-chat/public/avatars/cat_patrick.svg
  - apps/yaroo-demo-web/.impeccable/design.json
  - apps/yaroo-demo-web/src/components/LoginScreen.tsx
  - .superpowers/brainstorm/13286-1787817833/content/mobile-shell-options-v2.html
  - apps/yaroo-chat/app/layout.tsx
  - apps/yaroo-demo-web/src/App.tsx
  - apps/yaroo-chat/next.config.ts
  - apps/yaroo-web/package.json
  - .superpowers/brainstorm/11427-1787799688/state/server.pid
  - apps/yaroo-web/src/main.tsx
  - .agents/skills/spectra-apply/SKILL.md
  - package.json
  - .agents/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-review/SKILL.md
  - apps/yaroo-chat/public/avatars/cat_roy.svg
  - apps/yaroo-chat/public/avatars/cat_golden.svg
  - .agents/skills/spectra-drift/SKILL.md
  - .superpowers/brainstorm/13286-1787817833/content/waiting-accessibility.html
  - apps/yaroo-web/vite.config.ts
  - apps/yaroo-demo-web/src/components/ChatWindow.tsx
  - .agents/skills/spectra-discuss/SKILL.md
  - apps/yaroo-chat/app/components/LoginScreen.tsx
  - apps/yaroo-chat/postcss.config.mjs
  - .agents/skills/spectra-archive/SKILL.md
  - apps/yaroo-chat/public/avatars/cat_ann.svg
  - apps/yaroo-chat/app/chatClient.ts
  - apps/yaroo-chat/app/types/chatTypes.ts
  - apps/yaroo-backend/package.json
  - .agents/skills/spectra-commit/SKILL.md
  - apps/yaroo-demo-web/src/hooks/usePhonePortrait.ts
  - .superpowers/brainstorm/13286-1787817833/state/server.pid
  - apps/yaroo-demo-web/src/app.css
  - apps/yaroo-chat/public/yaroo-logo.svg
  - apps/yaroo-chat/public/avatars/cat_candy.svg
  - .superpowers/brainstorm/11324-1787799668/state/server.pid
  - apps/yaroo-chat/public/avatars/cat_hsuan.svg
  - apps/yaroo-chat/app/types/userTypes.ts
  - apps/yaroo-chat/next-env.d.ts
  - apps/yaroo-chat/public/avatars/cat_meatball.svg
  - apps/yaroo-chat/app/page.tsx
  - apps/yaroo-chat/app/types/protocolTypes.ts
  - apps/yaroo-demo-web/src/components/MainMessenger.tsx
  - apps/yaroo-chat/app/components/ChatWindow.tsx
  - apps/yaroo-chat/server.ts
  - .agents/skills/spectra-ask/SKILL.md
  - apps/yaroo-backend/tsconfig.json
  - apps/yaroo-demo-web/public/avatars/user_main.jpg
  - apps/yaroo-chat/app/ChatApp.tsx
  - .agents/skills/spectra-verify/SKILL.md
  - apps/yaroo-chat/server/chatServer.ts
  - apps/yaroo-chat/app/components/MainMessenger.tsx
  - CLAUDE.md
  - apps/yaroo-chat/public/avatars/cat_nine.svg
  - apps/yaroo-demo-web/PRODUCT.md
tests:
  - apps/yaroo-chat/server/chatServer.test.ts
-->