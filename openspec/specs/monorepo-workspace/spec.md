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
### Requirement: yaroo-web provides TypeScript placeholder app

The apps/yaroo-web directory SHALL contain a minimal Vite + React + TypeScript application with a package.json (name: @yaroo/web), tsconfig.json, vite.config.ts, index.html, and a src/main.tsx entry file.

#### Scenario: yaroo-web starts successfully

- **WHEN** user runs `pnpm --filter @yaroo/web dev`
- **THEN** the Vite dev server starts and serves a placeholder page


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
### Requirement: yaroo-backend provides TypeScript placeholder service

The apps/yaroo-backend directory SHALL contain a minimal TypeScript entry point with a package.json (name: @yaroo/backend), tsconfig.json, and a src/index.ts file.

#### Scenario: yaroo-backend runs without errors

- **WHEN** user runs `npx tsx apps/yaroo-backend/src/index.ts`
- **THEN** the script executes and exits without errors

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