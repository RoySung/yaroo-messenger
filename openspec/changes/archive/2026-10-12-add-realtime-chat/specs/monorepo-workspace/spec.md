## ADDED Requirements

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

## REMOVED Requirements

### Requirement: yaroo-web provides TypeScript placeholder app

**Reason**: The product frontend is no longer a separate Vite application; its implemented Messenger interface moves into the unified Next.js `@yaroo/chat` application.

**Migration**: Move the live UI, client connection layer, styles, and public assets from `apps/yaroo-web` into `apps/yaroo-chat`, verify equivalent behavior in `@yaroo/chat`, and then remove `apps/yaroo-web`.

#### Scenario: Separate product frontend is absent after migration

- **WHEN** the unified application migration is complete
- **THEN** `apps/yaroo-web` is absent and no root workspace script targets `@yaroo/web`

### Requirement: yaroo-backend provides TypeScript placeholder service

**Reason**: The real-time service is no longer a separately operated application; the Next.js `@yaroo/chat` Node.js runtime owns the Socket.IO server.

**Migration**: Move the in-memory chat server and its integration tests from `apps/yaroo-backend` into `apps/yaroo-chat/server`, attach it to the Next.js HTTP server, verify the existing protocol suite, and then remove `apps/yaroo-backend`.

#### Scenario: Separate chat backend is absent after migration

- **WHEN** the unified application migration is complete
- **THEN** `apps/yaroo-backend` is absent and no root workspace script targets `@yaroo/backend`
