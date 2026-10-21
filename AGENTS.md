# Yaroo Messenger Agent Guide

## Repository Overview

Yaroo Messenger is an unofficial fan-made tribute to Yahoo! Messenger and the
nostalgic feel of 2000s desktop instant-messaging software. This pnpm monorepo
contains a live, anonymous real-time messenger, a static UI demo, shared React
UI primitives, and a framework-independent Socket.IO protocol contract. Do not
imply affiliation with or endorsement by Yahoo.

## Workspace Map

```text
apps/
  yaroo-chat/       Live Next.js + Socket.IO messenger
  yaroo-demo-web/   Vite-based static UI demo with mock data
packages/
  chat-protocol/    Shared events, payloads, limits, errors, and types
  ui/               Reusable XP-inspired React components and theme styles
openspec/
  specs/            Accepted behavioral specifications
  changes/          Active and archived Spectra changes
```

### Workspace Responsibilities

| Path | Responsibility |
| --- | --- |
| `apps/yaroo-chat/app` | Next.js client UI, login/session state, Socket.IO client adapter, and chat windows. |
| `apps/yaroo-chat/server` | Custom HTTP/Socket.IO server, in-memory sessions, validation, delivery, presence, and Buzz cooldowns. |
| `apps/yaroo-chat/server/chatServer.test.ts` | Integration tests for real-time server behavior. |
| `apps/yaroo-demo-web/src` | Static presentation demo; contacts and conversations come from `mockData.ts`, not a server. |
| `packages/chat-protocol/src/index.ts` | Shared protocol contract. Keep it framework-free and update it before consumers when changing event behavior. |
| `packages/ui/src` | Reusable visual components, theme CSS, and generic interaction hooks. Keep chat-domain state out of this package. |
| `*/public` | Application-specific static assets. When an avatar identifier changes, keep protocol identifiers and each app's asset set aligned. |

## Architecture Boundaries

- Applications may depend on `@yaroo/ui` and `@yaroo/chat-protocol`.
- `@yaroo/chat-protocol` owns Socket.IO event names, payloads, acknowledgements,
  error codes, chat limits, presence states, and avatar IDs. Do not duplicate
  these literals in an app.
- The chat server is authoritative: validate untrusted payloads there and return
  the typed acknowledgement contract for both success and failure.
- `@yaroo/ui` provides presentational primitives and generic hooks only. Put
  chat-specific behavior in the application workspace.
- `@yaroo/demo-web` deliberately uses mock data and has no real-time backend.
  Do not document or implement it as a live chat client without an explicit
  product change.
- The live server holds sessions and cooldowns in memory. Do not imply durable
  accounts, message history, or database-backed state unless those systems are
  added.

## Development Commands

Run commands from the repository root.

| Goal | Command |
| --- | --- |
| Install dependencies | `pnpm install` |
| Start the live chat app | `pnpm dev:chat` |
| Start the static demo | `pnpm dev:demo` |
| Build all workspaces | `pnpm build` |
| Lint the repository | `pnpm lint` |
| Test chat server behavior | `pnpm --filter @yaroo/chat test` |

`@yaroo/chat` requires Node.js 20.9 or newer. It listens on port `3000` by
default; set `PORT` to use another valid TCP port. Development binds to
`127.0.0.1` by default, while production start binds to `0.0.0.0`; set `HOST`
to choose another hostname or IP address explicitly.

`pnpm dev:chat` starts the live Next.js and Socket.IO system. It is the target
for work on real-time sessions, presence, messages, Buzz behavior, and server
validation. `pnpm dev:demo` starts only the standalone Vite interface demo;
its contacts and conversations come from mock data, and it has no backend,
Socket.IO connection, persistence, or real-time communication logic.

## Change Guidelines

1. Locate the owning workspace before editing. A protocol change normally
   requires updates to `packages/chat-protocol`, the chat server, the chat
   client, and its tests.
2. Reuse exported protocol types, limits, and event constants instead of adding
   app-local equivalents.
3. Keep TypeScript strict and make validation explicit at network boundaries.
   Never trust a Socket.IO payload because it matches a TypeScript type.
4. Preserve the distinction between live data in `yaroo-chat` and mock data in
   `yaroo-demo-web`.
5. Keep changes focused. Do not reformat or alter unrelated in-progress work.
6. Before handoff, run the narrowest relevant command; run the chat server test
   suite whenever server or protocol behavior changes.

<!-- SPECTRA:START v1.3.0 -->

# Spectra Instructions

This project uses Spectra for Spec-Driven Development(SDD). Specs live in `openspec/specs/`, change proposals in `openspec/changes/`.

## Use `$spectra-*` skills when:

- An explicitly requested Spectra decision needs structure → `$spectra-discuss`
- User explicitly requests a Spectra change proposal → `$spectra-propose`
- Continue tasks for an identified change → `$spectra-apply`
- Update requirements or plans for an identified change → `$spectra-ingest`
- Check implementation matches artifacts → `$spectra-verify`
- Review implementation quality and logic issues → `$spectra-review`
- Analyze artifact consistency before coding → `$spectra-analyze`
- Audit security sharp edges → `$spectra-audit`
- Check stale changes before resuming → `$spectra-drift`
- Debug a concrete bug systematically → `$spectra-debug`
- Implementation is done → `$spectra-archive`
- Commit only files related to a specific change → `$spectra-commit`

Explicit skill invocation takes precedence. Apply existing authorization within its unchanged scope.

## Workflow

discuss? → propose → apply ⇄ ingest → verify / review → archive

- `discuss` is optional — skip if requirements are clear
- Requirements change mid-work? Plan mode (`/plan`) → `ingest` → resume `apply`

## Parked Changes

Changes can be parked（暫存）— temporarily moved out of `openspec/changes/`. Parked changes won't appear in `spectra list` but can be found with `spectra list --parked`. To restore: `spectra unpark <name>`. The `$spectra-apply` and `$spectra-ingest` skills disclose parking and restore when the named operation is already explicitly requested; respect a known refusal, otherwise ask for missing authorization.

<!-- SPECTRA:END -->
