## 1. Next.js development-origin configuration

- [x] 1.1 Implement **Allow ngrok origins for Next.js development resources** by applying the **Allow the one-label ngrok free-tier hostname pattern** and **Keep the setting in Next.js configuration only** decisions in `apps/yaroo-chat/next.config.ts`: an ngrok `*.ngrok-free.app` origin SHALL receive HTTP 200 for an existing `/_next/static/chunks/` resource, while `https://unrelated.example` SHALL receive HTTP 403; verify both requests against the running development server and run `pnpm --filter @yaroo/chat build`.
