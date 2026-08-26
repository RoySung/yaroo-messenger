# Yaroo! Messenger

Yaroo! Messenger is an unofficial fan-made tribute to Yahoo! Messenger and the
playful immediacy of 2000s desktop instant-messaging software. Built as a
TypeScript pnpm monorepo, it reimagines that nostalgic experience as an
anonymous real-time messenger and a static interface demo with a shared visual
language. It is not affiliated with or endorsed by Yahoo.

## What Is Included

- Anonymous nickname sessions with random, reconnect-resumable cat avatars.
- Presence and custom-status updates.
- Direct real-time messages between online users.
- Buzz notifications with a per-recipient cooldown.
- Draggable, XP-style messenger and conversation windows.
- A static Vite demo for iterating on the interface with mock data.

The live application keeps its sessions, messages, and cooldowns in memory. It
does not currently provide accounts, persistence, or a database.

## Tech Stack

- React 19 and TypeScript
- Next.js 16 for the live chat application
- Socket.IO for real-time communication
- Vite for the static UI demo and UI package build
- Tailwind CSS 4
- pnpm workspaces

## Requirements

- Node.js 20.9 or later
- pnpm

## Getting Started

```bash
pnpm install
pnpm dev:chat
```

The live chat application starts at [http://localhost:3000](http://localhost:3000).
Use a different valid TCP port when needed:

```bash
PORT=4000 pnpm dev:chat
```

To run the static UI demo instead:

```bash
pnpm dev:demo
```

## Commands

Run these commands from the repository root.

| Command | Purpose |
| --- | --- |
| `pnpm install` | Install all workspace dependencies. |
| `pnpm dev:chat` | Build the protocol package and start the live Next.js + Socket.IO app. |
| `pnpm start:chat` | Start the built live chat server. |
| `pnpm dev:demo` | Start the Vite-based static UI demo. |
| `pnpm build` | Build every workspace. |
| `pnpm lint` | Run Oxlint. |
| `pnpm --filter @yaroo/chat test` | Run real-time chat-server integration tests. |

### Development Targets

`pnpm dev:chat` builds the shared protocol package, then starts the live
`@yaroo/chat` application. It runs the Next.js interface and custom Socket.IO
server together, so separate browser sessions can join, update presence, send
direct messages, and send Buzz notifications in real time.

`pnpm dev:demo` starts `@yaroo/demo-web`, a standalone Vite interface demo.
Its contacts, statuses, and conversations are loaded from mock data; it has no
Socket.IO connection, backend service, persistence, or real-time communication
logic. Use it to inspect and iterate on the UI without starting the live chat
system.

## Project Structure

```text
.
├── apps/
│   ├── yaroo-chat/               # Live anonymous messenger
│   │   ├── app/                  # Next.js UI, client adapter, and chat state
│   │   ├── server/               # HTTP + Socket.IO server and integration tests
│   │   └── public/               # Live-app avatars and icons
│   └── yaroo-demo-web/           # Vite static UI demo
│       ├── src/                  # Mock-driven messenger interface
│       └── public/               # Demo-specific assets
├── packages/
│   ├── chat-protocol/            # Shared real-time protocol contract
│   └── ui/                       # XP-style UI components and theme styles
├── openspec/
│   ├── specs/                    # Accepted specifications
│   └── changes/                  # Active and archived change proposals
├── AGENTS.md                     # Canonical guidance for coding agents
├── CLAUDE.md -> AGENTS.md        # Shared guidance symlink
└── GEMINI.md -> AGENTS.md        # Shared guidance symlink
```

## Workspace Guide

| Workspace | Contents | Responsibility |
| --- | --- | --- |
| `apps/yaroo-chat` | Next.js app, custom HTTP server, Socket.IO server/client, and real-time tests | The live product. It owns anonymous sessions, server validation, online presence, direct-message delivery, and Buzz notifications. |
| `apps/yaroo-demo-web` | Vite React app, mock contacts, and mock message history | A static visual demo. It demonstrates the interaction design without a server or live network state. |
| `packages/chat-protocol` | Event constants, payloads, acknowledgement types, limits, errors, presence states, and avatar IDs | The source of truth for the client/server Socket.IO contract. It is framework-independent. |
| `packages/ui` | Reusable components such as windows, buttons, text inputs, avatars, menus, status badges, and the shared theme | Presentation primitives used to create the XP-inspired interface. |

## How the Live Chat Works

```text
Next.js UI → ChatClient → Socket.IO event contract → chatServer → online clients
                 ↑               │                    │
          @yaroo/ui       @yaroo/chat-protocol   in-memory sessions
```

`packages/chat-protocol` defines the names and shapes of every Socket.IO event.
The browser uses `ChatClient` to send those typed events; the server validates
them, updates its in-memory session state, and sends acknowledgements or events
to the relevant connected clients. `@yaroo/ui` stays focused on reusable visual
and interaction primitives rather than chat-domain rules.

## Contributing

Behavior changes are managed with Spectra/OpenSpec:

1. Review accepted behavior in `openspec/specs/`.
2. Create or update a proposal in `openspec/changes/` before implementing a new
   behavior.
3. Use the Spectra workflow: `discuss? → propose → apply ⇄ ingest → archive`.
4. Run the relevant verification command before handing work off.

See [AGENTS.md](AGENTS.md) for package boundaries, development guidance, and the
available Spectra skills.
