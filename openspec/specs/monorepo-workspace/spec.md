# monorepo-workspace Specification

## Purpose

TBD - created by archiving change 'monorepo-restructure'. Update Purpose after archive.

## Requirements

### Requirement: pnpm workspace configuration

The project root SHALL contain a `pnpm-workspace.yaml` file that declares `apps/*` and `packages/*` as workspace members. Running `pnpm install` at the project root SHALL install dependencies for all workspace members.

#### Scenario: Workspace installs all dependencies

- **WHEN** user runs `pnpm install` at project root
- **THEN** all workspace members (apps and packages) have their dependencies installed


<!-- @trace
source: monorepo-restructure
updated: 2026-08-19
code:
  - apps/yaroo-demo-web/public/avatars/cat_ann.svg
  - apps/yaroo-demo-web/public/avatars/cat_kai.svg
  - packages/ui/src/components/TextArea/TextArea.tsx
  - apps/yaroo-demo-web/src/mockData.ts
  - apps/yaroo-demo-web/src/components/ChatWindow.tsx
  - packages/ui/src/components/Window/Window.tsx
  - packages/ui/src/hooks/useDraggable.ts
  - apps/yaroo-demo-web/public/avatars/cat_candy.svg
  - packages/ui/src/components/Toolbar/index.ts
  - packages/ui/src/components/MenuBar/MenuBar.tsx
  - apps/yaroo-web/tsconfig.json
  - apps/yaroo-backend/package.json
  - apps/yaroo-demo-web/package.json
  - packages/ui/tsconfig.json
  - pnpm-workspace.yaml
  - apps/yaroo-backend/tsconfig.json
  - apps/yaroo-demo-web/public/avatars/user_main.jpg
  - apps/yaroo-demo-web/public/avatars/cat_meatball.svg
  - package.json
  - packages/ui/src/components/Checkbox/Checkbox.tsx
  - CLAUDE.md
  - apps/yaroo-web/index.html
  - GEMINI.md
  - packages/ui/vite.config.ts
  - .spectra.yaml
  - packages/ui/src/components/TextInput/TextInput.tsx
  - apps/yaroo-demo-web/index.html
  - apps/yaroo-demo-web/public/avatars/cat_hsuan.svg
  - packages/ui/src/components/Window/index.ts
  - README.md
  - apps/yaroo-demo-web/public/avatars/cat_nine.svg
  - packages/ui/src/index.ts
  - apps/yaroo-demo-web/public/avatars/girl_cute.jpg
  - apps/yaroo-demo-web/src/components/MainMessenger.tsx
  - chat_active_screenshot.png
  - packages/ui/src/components/Avatar/Avatar.tsx
  - tsconfig.json
  - apps/yaroo-web/package.json
  - apps/yaroo-backend/src/index.ts
  - apps/yaroo-demo-web/public/avatars/girl_glasses.jpg
  - packages/ui/src/components/MenuBar/index.ts
  - packages/ui/src/components/Toolbar/Toolbar.tsx
  - apps/yaroo-demo-web/public/avatars/cat_golden.svg
  - packages/ui/src/components/StatusBadge/index.ts
  - apps/yaroo-demo-web/public/favicon.svg
  - packages/ui/src/components/XpButton/XpButton.tsx
  - packages/ui/src/components/Select/Select.tsx
  - packages/ui/src/components/WindowHeader/WindowHeader.tsx
  - .oxlintrc.json
  - apps/yaroo-demo-web/public/avatars/cat_patrick.svg
  - apps/yaroo-demo-web/tsconfig.json
  - packages/ui/src/components/WindowHeader/index.ts
  - apps/yaroo-demo-web/public/avatars/cat_roy.svg
  - apps/yaroo-demo-web/src/components/LoginScreen.tsx
  - apps/yaroo-demo-web/public/icons.svg
  - apps/yaroo-demo-web/src/app.css
  - apps/yaroo-demo-web/vite.config.ts
  - main_messenger_roy.png
  - packages/ui/src/components/Checkbox/index.ts
  - packages/ui/src/components/StatusBadge/StatusBadge.tsx
  - packages/ui/src/components/TextInput/index.ts
  - apps/yaroo-demo-web/src/main.tsx
  - apps/yaroo-web/src/main.tsx
  - packages/ui/src/components/Avatar/index.ts
  - packages/ui/package.json
  - packages/ui/src/hooks/index.ts
  - packages/ui/src/components/Select/index.ts
  - packages/ui/src/components/TextArea/index.ts
  - packages/ui/src/components/XpButton/index.ts
  - .npmrc
  - apps/yaroo-demo-web/public/yaroo-logo.svg
  - apps/yaroo-demo-web/public/avatars/guy_blond.jpg
  - login_screen.png
  - apps/yaroo-demo-web/src/App.tsx
  - apps/yaroo-web/vite.config.ts
  - packages/ui/src/styles/theme.css
-->

---
### Requirement: Root package.json provides workspace scripts

The root `package.json` SHALL define convenience scripts for common operations. The `dev` script SHALL start the demo-web development server. The `build` script SHALL build all packages and apps. The `lint` script SHALL run linting across the workspace.

#### Scenario: Root dev script starts demo-web

- **WHEN** user runs `pnpm dev` at project root
- **THEN** the yaroo-demo-web development server starts


<!-- @trace
source: monorepo-restructure
updated: 2026-08-19
code:
  - apps/yaroo-demo-web/public/avatars/cat_ann.svg
  - apps/yaroo-demo-web/public/avatars/cat_kai.svg
  - packages/ui/src/components/TextArea/TextArea.tsx
  - apps/yaroo-demo-web/src/mockData.ts
  - apps/yaroo-demo-web/src/components/ChatWindow.tsx
  - packages/ui/src/components/Window/Window.tsx
  - packages/ui/src/hooks/useDraggable.ts
  - apps/yaroo-demo-web/public/avatars/cat_candy.svg
  - packages/ui/src/components/Toolbar/index.ts
  - packages/ui/src/components/MenuBar/MenuBar.tsx
  - apps/yaroo-web/tsconfig.json
  - apps/yaroo-backend/package.json
  - apps/yaroo-demo-web/package.json
  - packages/ui/tsconfig.json
  - pnpm-workspace.yaml
  - apps/yaroo-backend/tsconfig.json
  - apps/yaroo-demo-web/public/avatars/user_main.jpg
  - apps/yaroo-demo-web/public/avatars/cat_meatball.svg
  - package.json
  - packages/ui/src/components/Checkbox/Checkbox.tsx
  - CLAUDE.md
  - apps/yaroo-web/index.html
  - GEMINI.md
  - packages/ui/vite.config.ts
  - .spectra.yaml
  - packages/ui/src/components/TextInput/TextInput.tsx
  - apps/yaroo-demo-web/index.html
  - apps/yaroo-demo-web/public/avatars/cat_hsuan.svg
  - packages/ui/src/components/Window/index.ts
  - README.md
  - apps/yaroo-demo-web/public/avatars/cat_nine.svg
  - packages/ui/src/index.ts
  - apps/yaroo-demo-web/public/avatars/girl_cute.jpg
  - apps/yaroo-demo-web/src/components/MainMessenger.tsx
  - chat_active_screenshot.png
  - packages/ui/src/components/Avatar/Avatar.tsx
  - tsconfig.json
  - apps/yaroo-web/package.json
  - apps/yaroo-backend/src/index.ts
  - apps/yaroo-demo-web/public/avatars/girl_glasses.jpg
  - packages/ui/src/components/MenuBar/index.ts
  - packages/ui/src/components/Toolbar/Toolbar.tsx
  - apps/yaroo-demo-web/public/avatars/cat_golden.svg
  - packages/ui/src/components/StatusBadge/index.ts
  - apps/yaroo-demo-web/public/favicon.svg
  - packages/ui/src/components/XpButton/XpButton.tsx
  - packages/ui/src/components/Select/Select.tsx
  - packages/ui/src/components/WindowHeader/WindowHeader.tsx
  - .oxlintrc.json
  - apps/yaroo-demo-web/public/avatars/cat_patrick.svg
  - apps/yaroo-demo-web/tsconfig.json
  - packages/ui/src/components/WindowHeader/index.ts
  - apps/yaroo-demo-web/public/avatars/cat_roy.svg
  - apps/yaroo-demo-web/src/components/LoginScreen.tsx
  - apps/yaroo-demo-web/public/icons.svg
  - apps/yaroo-demo-web/src/app.css
  - apps/yaroo-demo-web/vite.config.ts
  - main_messenger_roy.png
  - packages/ui/src/components/Checkbox/index.ts
  - packages/ui/src/components/StatusBadge/StatusBadge.tsx
  - packages/ui/src/components/TextInput/index.ts
  - apps/yaroo-demo-web/src/main.tsx
  - apps/yaroo-web/src/main.tsx
  - packages/ui/src/components/Avatar/index.ts
  - packages/ui/package.json
  - packages/ui/src/hooks/index.ts
  - packages/ui/src/components/Select/index.ts
  - packages/ui/src/components/TextArea/index.ts
  - packages/ui/src/components/XpButton/index.ts
  - .npmrc
  - apps/yaroo-demo-web/public/yaroo-logo.svg
  - apps/yaroo-demo-web/public/avatars/guy_blond.jpg
  - login_screen.png
  - apps/yaroo-demo-web/src/App.tsx
  - apps/yaroo-web/vite.config.ts
  - packages/ui/src/styles/theme.css
-->

---
### Requirement: Shared TypeScript configuration

The project root SHALL contain a `tsconfig.json` with shared TypeScript configuration (strict mode enabled, JSX react-jsx, ES2022 target). Each app and package SHALL have its own `tsconfig.json` that extends the root configuration.

#### Scenario: TypeScript strict mode enforced

- **WHEN** any workspace member runs TypeScript compilation
- **THEN** strict mode rules are enforced (strictNullChecks, noImplicitAny, etc.)


<!-- @trace
source: monorepo-restructure
updated: 2026-08-19
code:
  - apps/yaroo-demo-web/public/avatars/cat_ann.svg
  - apps/yaroo-demo-web/public/avatars/cat_kai.svg
  - packages/ui/src/components/TextArea/TextArea.tsx
  - apps/yaroo-demo-web/src/mockData.ts
  - apps/yaroo-demo-web/src/components/ChatWindow.tsx
  - packages/ui/src/components/Window/Window.tsx
  - packages/ui/src/hooks/useDraggable.ts
  - apps/yaroo-demo-web/public/avatars/cat_candy.svg
  - packages/ui/src/components/Toolbar/index.ts
  - packages/ui/src/components/MenuBar/MenuBar.tsx
  - apps/yaroo-web/tsconfig.json
  - apps/yaroo-backend/package.json
  - apps/yaroo-demo-web/package.json
  - packages/ui/tsconfig.json
  - pnpm-workspace.yaml
  - apps/yaroo-backend/tsconfig.json
  - apps/yaroo-demo-web/public/avatars/user_main.jpg
  - apps/yaroo-demo-web/public/avatars/cat_meatball.svg
  - package.json
  - packages/ui/src/components/Checkbox/Checkbox.tsx
  - CLAUDE.md
  - apps/yaroo-web/index.html
  - GEMINI.md
  - packages/ui/vite.config.ts
  - .spectra.yaml
  - packages/ui/src/components/TextInput/TextInput.tsx
  - apps/yaroo-demo-web/index.html
  - apps/yaroo-demo-web/public/avatars/cat_hsuan.svg
  - packages/ui/src/components/Window/index.ts
  - README.md
  - apps/yaroo-demo-web/public/avatars/cat_nine.svg
  - packages/ui/src/index.ts
  - apps/yaroo-demo-web/public/avatars/girl_cute.jpg
  - apps/yaroo-demo-web/src/components/MainMessenger.tsx
  - chat_active_screenshot.png
  - packages/ui/src/components/Avatar/Avatar.tsx
  - tsconfig.json
  - apps/yaroo-web/package.json
  - apps/yaroo-backend/src/index.ts
  - apps/yaroo-demo-web/public/avatars/girl_glasses.jpg
  - packages/ui/src/components/MenuBar/index.ts
  - packages/ui/src/components/Toolbar/Toolbar.tsx
  - apps/yaroo-demo-web/public/avatars/cat_golden.svg
  - packages/ui/src/components/StatusBadge/index.ts
  - apps/yaroo-demo-web/public/favicon.svg
  - packages/ui/src/components/XpButton/XpButton.tsx
  - packages/ui/src/components/Select/Select.tsx
  - packages/ui/src/components/WindowHeader/WindowHeader.tsx
  - .oxlintrc.json
  - apps/yaroo-demo-web/public/avatars/cat_patrick.svg
  - apps/yaroo-demo-web/tsconfig.json
  - packages/ui/src/components/WindowHeader/index.ts
  - apps/yaroo-demo-web/public/avatars/cat_roy.svg
  - apps/yaroo-demo-web/src/components/LoginScreen.tsx
  - apps/yaroo-demo-web/public/icons.svg
  - apps/yaroo-demo-web/src/app.css
  - apps/yaroo-demo-web/vite.config.ts
  - main_messenger_roy.png
  - packages/ui/src/components/Checkbox/index.ts
  - packages/ui/src/components/StatusBadge/StatusBadge.tsx
  - packages/ui/src/components/TextInput/index.ts
  - apps/yaroo-demo-web/src/main.tsx
  - apps/yaroo-web/src/main.tsx
  - packages/ui/src/components/Avatar/index.ts
  - packages/ui/package.json
  - packages/ui/src/hooks/index.ts
  - packages/ui/src/components/Select/index.ts
  - packages/ui/src/components/TextArea/index.ts
  - packages/ui/src/components/XpButton/index.ts
  - .npmrc
  - apps/yaroo-demo-web/public/yaroo-logo.svg
  - apps/yaroo-demo-web/public/avatars/guy_blond.jpg
  - login_screen.png
  - apps/yaroo-demo-web/src/App.tsx
  - apps/yaroo-web/vite.config.ts
  - packages/ui/src/styles/theme.css
-->

---
### Requirement: Cross-package references use workspace protocol

Apps that depend on local packages SHALL declare dependencies using the `workspace:*` protocol in their package.json. This ensures pnpm resolves these dependencies to the local workspace packages.

#### Scenario: Demo-web references local UI package

- **WHEN** apps/yaroo-demo-web/package.json declares `"@yaroo/ui": "workspace:*"`
- **THEN** pnpm resolves this to the local packages/ui directory


<!-- @trace
source: monorepo-restructure
updated: 2026-08-19
code:
  - apps/yaroo-demo-web/public/avatars/cat_ann.svg
  - apps/yaroo-demo-web/public/avatars/cat_kai.svg
  - packages/ui/src/components/TextArea/TextArea.tsx
  - apps/yaroo-demo-web/src/mockData.ts
  - apps/yaroo-demo-web/src/components/ChatWindow.tsx
  - packages/ui/src/components/Window/Window.tsx
  - packages/ui/src/hooks/useDraggable.ts
  - apps/yaroo-demo-web/public/avatars/cat_candy.svg
  - packages/ui/src/components/Toolbar/index.ts
  - packages/ui/src/components/MenuBar/MenuBar.tsx
  - apps/yaroo-web/tsconfig.json
  - apps/yaroo-backend/package.json
  - apps/yaroo-demo-web/package.json
  - packages/ui/tsconfig.json
  - pnpm-workspace.yaml
  - apps/yaroo-backend/tsconfig.json
  - apps/yaroo-demo-web/public/avatars/user_main.jpg
  - apps/yaroo-demo-web/public/avatars/cat_meatball.svg
  - package.json
  - packages/ui/src/components/Checkbox/Checkbox.tsx
  - CLAUDE.md
  - apps/yaroo-web/index.html
  - GEMINI.md
  - packages/ui/vite.config.ts
  - .spectra.yaml
  - packages/ui/src/components/TextInput/TextInput.tsx
  - apps/yaroo-demo-web/index.html
  - apps/yaroo-demo-web/public/avatars/cat_hsuan.svg
  - packages/ui/src/components/Window/index.ts
  - README.md
  - apps/yaroo-demo-web/public/avatars/cat_nine.svg
  - packages/ui/src/index.ts
  - apps/yaroo-demo-web/public/avatars/girl_cute.jpg
  - apps/yaroo-demo-web/src/components/MainMessenger.tsx
  - chat_active_screenshot.png
  - packages/ui/src/components/Avatar/Avatar.tsx
  - tsconfig.json
  - apps/yaroo-web/package.json
  - apps/yaroo-backend/src/index.ts
  - apps/yaroo-demo-web/public/avatars/girl_glasses.jpg
  - packages/ui/src/components/MenuBar/index.ts
  - packages/ui/src/components/Toolbar/Toolbar.tsx
  - apps/yaroo-demo-web/public/avatars/cat_golden.svg
  - packages/ui/src/components/StatusBadge/index.ts
  - apps/yaroo-demo-web/public/favicon.svg
  - packages/ui/src/components/XpButton/XpButton.tsx
  - packages/ui/src/components/Select/Select.tsx
  - packages/ui/src/components/WindowHeader/WindowHeader.tsx
  - .oxlintrc.json
  - apps/yaroo-demo-web/public/avatars/cat_patrick.svg
  - apps/yaroo-demo-web/tsconfig.json
  - packages/ui/src/components/WindowHeader/index.ts
  - apps/yaroo-demo-web/public/avatars/cat_roy.svg
  - apps/yaroo-demo-web/src/components/LoginScreen.tsx
  - apps/yaroo-demo-web/public/icons.svg
  - apps/yaroo-demo-web/src/app.css
  - apps/yaroo-demo-web/vite.config.ts
  - main_messenger_roy.png
  - packages/ui/src/components/Checkbox/index.ts
  - packages/ui/src/components/StatusBadge/StatusBadge.tsx
  - packages/ui/src/components/TextInput/index.ts
  - apps/yaroo-demo-web/src/main.tsx
  - apps/yaroo-web/src/main.tsx
  - packages/ui/src/components/Avatar/index.ts
  - packages/ui/package.json
  - packages/ui/src/hooks/index.ts
  - packages/ui/src/components/Select/index.ts
  - packages/ui/src/components/TextArea/index.ts
  - packages/ui/src/components/XpButton/index.ts
  - .npmrc
  - apps/yaroo-demo-web/public/yaroo-logo.svg
  - apps/yaroo-demo-web/public/avatars/guy_blond.jpg
  - login_screen.png
  - apps/yaroo-demo-web/src/App.tsx
  - apps/yaroo-web/vite.config.ts
  - packages/ui/src/styles/theme.css
-->

---
### Requirement: yaroo-demo-web preserves existing functionality with TS and Tailwind

The apps/yaroo-demo-web app SHALL contain the fully rewritten application code using TypeScript and Tailwind CSS v4. All existing features SHALL function identically: login screen, main messenger window, chat windows, window dragging, message sending, buzz/ding-dong feature, emoji picker, and status editing. Visual appearance SHALL be identical to the pre-rewrite version.

#### Scenario: Demo-web visual and functional parity

- **WHEN** user runs the demo-web development server and navigates to it
- **THEN** the login screen appears identical to the pre-rewrite version
- **THEN** after login, the main messenger and chat windows appear and behave identically
- **THEN** all TypeScript files compile without errors under strict mode


<!-- @trace
source: monorepo-restructure
updated: 2026-08-19
code:
  - apps/yaroo-demo-web/public/avatars/cat_ann.svg
  - apps/yaroo-demo-web/public/avatars/cat_kai.svg
  - packages/ui/src/components/TextArea/TextArea.tsx
  - apps/yaroo-demo-web/src/mockData.ts
  - apps/yaroo-demo-web/src/components/ChatWindow.tsx
  - packages/ui/src/components/Window/Window.tsx
  - packages/ui/src/hooks/useDraggable.ts
  - apps/yaroo-demo-web/public/avatars/cat_candy.svg
  - packages/ui/src/components/Toolbar/index.ts
  - packages/ui/src/components/MenuBar/MenuBar.tsx
  - apps/yaroo-web/tsconfig.json
  - apps/yaroo-backend/package.json
  - apps/yaroo-demo-web/package.json
  - packages/ui/tsconfig.json
  - pnpm-workspace.yaml
  - apps/yaroo-backend/tsconfig.json
  - apps/yaroo-demo-web/public/avatars/user_main.jpg
  - apps/yaroo-demo-web/public/avatars/cat_meatball.svg
  - package.json
  - packages/ui/src/components/Checkbox/Checkbox.tsx
  - CLAUDE.md
  - apps/yaroo-web/index.html
  - GEMINI.md
  - packages/ui/vite.config.ts
  - .spectra.yaml
  - packages/ui/src/components/TextInput/TextInput.tsx
  - apps/yaroo-demo-web/index.html
  - apps/yaroo-demo-web/public/avatars/cat_hsuan.svg
  - packages/ui/src/components/Window/index.ts
  - README.md
  - apps/yaroo-demo-web/public/avatars/cat_nine.svg
  - packages/ui/src/index.ts
  - apps/yaroo-demo-web/public/avatars/girl_cute.jpg
  - apps/yaroo-demo-web/src/components/MainMessenger.tsx
  - chat_active_screenshot.png
  - packages/ui/src/components/Avatar/Avatar.tsx
  - tsconfig.json
  - apps/yaroo-web/package.json
  - apps/yaroo-backend/src/index.ts
  - apps/yaroo-demo-web/public/avatars/girl_glasses.jpg
  - packages/ui/src/components/MenuBar/index.ts
  - packages/ui/src/components/Toolbar/Toolbar.tsx
  - apps/yaroo-demo-web/public/avatars/cat_golden.svg
  - packages/ui/src/components/StatusBadge/index.ts
  - apps/yaroo-demo-web/public/favicon.svg
  - packages/ui/src/components/XpButton/XpButton.tsx
  - packages/ui/src/components/Select/Select.tsx
  - packages/ui/src/components/WindowHeader/WindowHeader.tsx
  - .oxlintrc.json
  - apps/yaroo-demo-web/public/avatars/cat_patrick.svg
  - apps/yaroo-demo-web/tsconfig.json
  - packages/ui/src/components/WindowHeader/index.ts
  - apps/yaroo-demo-web/public/avatars/cat_roy.svg
  - apps/yaroo-demo-web/src/components/LoginScreen.tsx
  - apps/yaroo-demo-web/public/icons.svg
  - apps/yaroo-demo-web/src/app.css
  - apps/yaroo-demo-web/vite.config.ts
  - main_messenger_roy.png
  - packages/ui/src/components/Checkbox/index.ts
  - packages/ui/src/components/StatusBadge/StatusBadge.tsx
  - packages/ui/src/components/TextInput/index.ts
  - apps/yaroo-demo-web/src/main.tsx
  - apps/yaroo-web/src/main.tsx
  - packages/ui/src/components/Avatar/index.ts
  - packages/ui/package.json
  - packages/ui/src/hooks/index.ts
  - packages/ui/src/components/Select/index.ts
  - packages/ui/src/components/TextArea/index.ts
  - packages/ui/src/components/XpButton/index.ts
  - .npmrc
  - apps/yaroo-demo-web/public/yaroo-logo.svg
  - apps/yaroo-demo-web/public/avatars/guy_blond.jpg
  - login_screen.png
  - apps/yaroo-demo-web/src/App.tsx
  - apps/yaroo-web/vite.config.ts
  - packages/ui/src/styles/theme.css
-->

---
### Requirement: yaroo-chat provides a unified Next.js chat application

The `apps/yaroo-chat` directory SHALL contain a Next.js application named `@yaroo/chat`. One Node.js HTTP runtime SHALL serve the Next.js product interface and the Socket.IO chat service on the same origin, and the root `dev:chat` command SHALL start only `@yaroo/chat` rather than coordinating separate product frontend and backend applications.

#### Scenario: Start the unified development application

- **WHEN** a developer runs `pnpm dev:chat`
- **THEN** the command starts `@yaroo/chat`, serves the product interface, and accepts its Socket.IO connections through the same HTTP origin

#### Scenario: Build the unified production application

- **WHEN** a developer runs `pnpm --filter @yaroo/chat build`
- **THEN** the command builds the Next.js assets consumed by the package's custom Node.js entry point without creating a second deployable backend service

#### Scenario: Static demo remains independent

- **WHEN** a developer runs `pnpm dev:demo`
- **THEN** only `@yaroo/demo-web` starts and it retains static mock behavior without connecting to the live chat runtime

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