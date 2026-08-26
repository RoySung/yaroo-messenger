## 1. Shared Avatar Contract

- [x] 1.1 Implement **Define the canonical avatar catalog and public contract**, **Closed avatar catalog**, and **Interface and failure contract** in `packages/chat-protocol/src/index.ts`: export the exact 12-entry `AVATAR_IDS`/`AvatarId` contract, add `OnlineUser.avatarId`, add optional `SessionJoinPayload.resumeAvatarId`, and add `INVALID_AVATAR` with a Traditional Chinese message; verify with `pnpm --filter @yaroo/chat-protocol build` and a source assertion that `user_main.jpg` and arbitrary URLs are absent from the catalog.

## 2. Authoritative Backend Assignment

- [x] [P] 2.1 Implement **Assign on the server and resume with the server-issued identifier**, **Random avatar on explicit login**, and **Avatar is part of the public user record** in `apps/yaroo-backend/src/chatServer.ts`: inject a deterministic test selector, select independently when no resume identifier exists, allow duplicates, store the result on the joined session, and publish it in every `OnlineUser`; verify with focused integration cases in `apps/yaroo-backend/src/chatServer.test.ts` for selection, duplicate assignment, snapshots, and presence-update stability.
- [x] 2.2 Implement **Invalid resume avatar is rejected safely** in the join parser before nickname reservation: reuse only catalog identifiers and return `INVALID_AVATAR` without session or snapshot mutation for non-string or unknown values; verify with integration cases for a remote URL, malformed runtime values, and successful reuse of the nickname after rejection via `pnpm --filter @yaroo/backend test`.

## 3. Reconnect and Rendering

- [x] [P] 3.1 Implement **Automatic reconnect preserves the assignment** in `apps/yaroo-web/src/chatClient.ts`: after initial success store the server-issued identifier as `resumeAvatarId` only in the in-memory automatic-rejoin payload while fresh login payloads remain unchanged; verify with `pnpm --filter @yaroo/web build` plus a focused source or client assertion that initial join omits the field and rejoin emits the returned identifier.
- [x] [P] 3.2 Implement **Resolve only catalog identifiers in the frontend** and **Live frontend renders the assigned bundled asset** in `apps/yaroo-web/src/App.tsx`: use `/avatars/{avatarId}` consistently for the current user, contacts, inbound chats, and active chat refreshes, with `cat_roy.svg` as the defensive fallback for incompatible runtime data; verify with `pnpm --filter @yaroo/web build` and manual assertions that contact-list and chat-window sources match and an unknown value never becomes a requested path.

## 4. Asset Cleanup

- [x] [P] 4.1 Implement **Remove both unused user_main asset copies** by deleting `apps/yaroo-web/public/avatars/user_main.jpg` and `apps/yaroo-demo-web/public/avatars/user_main.jpg`; verify `rg -n "user_main\\.jpg" apps/yaroo-web apps/yaroo-demo-web` returns no reference or file listing and both `pnpm --filter @yaroo/web build` and `pnpm --filter @yaroo/demo-web build` pass without broken bundled avatar paths.

## 5. End-to-End Verification

- [x] 5.1 Verify **Observable behavior** and all **Acceptance criteria** by running `pnpm --filter @yaroo/backend test`, `pnpm build`, and `pnpm lint`, then manually using two browsers to confirm each explicit login gets a catalog avatar, peers see the same image in all views, automatic reconnect retains it, presence updates do not change it, and duplicate draws remain usable.
- [x] 5.2 Review the final diff against **Scope boundaries** and confirm it contains only the protocol contract, backend assignment/validation/tests, live frontend reconnect/rendering, and the two asset deletions; verify `git diff -- packages/chat-protocol/src/index.ts apps/yaroo-backend/src/chatServer.ts apps/yaroo-backend/src/chatServer.test.ts apps/yaroo-web/src/chatClient.ts apps/yaroo-web/src/App.tsx apps/yaroo-web/public/avatars/user_main.jpg apps/yaroo-demo-web/public/avatars/user_main.jpg` shows no avatar controls, persistence, uniqueness allocation, remote media, or demo mock-data changes.

## 6. Retire the Three Live Web JPG Avatars

- [x] 6.1 Implement **Define the nine-avatar catalog and public contract**, **Closed avatar catalog**, and **Invalid resume avatar is rejected safely** in `packages/chat-protocol/src/index.ts` and `apps/yaroo-backend/src/chatServer.test.ts`: remove `girl_cute.jpg`, `girl_glasses.jpg`, and `guy_blond.jpg` from `AVATAR_IDS`; update deterministic tests to use catalog cats; prove every retired identifier produces `INVALID_AVATAR` without nickname reservation while a new explicit join receives a cat avatar through `pnpm --filter @yaroo/backend test`.
- [x] [P] 6.2 Implement **Retire the three designated live web avatar assets** by deleting `apps/yaroo-web/public/avatars/girl_cute.jpg`, `apps/yaroo-web/public/avatars/girl_glasses.jpg`, and `apps/yaroo-web/public/avatars/guy_blond.jpg` while preserving their static-demo copies; verify all three specified paths are absent, `rg -n "girl_cute\\.jpg|girl_glasses\\.jpg|guy_blond\\.jpg" apps/yaroo-web` finds no live-web reference, and `pnpm --filter @yaroo/web build` plus `pnpm --filter @yaroo/demo-web build` pass.
- [x] 6.3 Verify updated **Observable behavior**, **Interface and failure contract**, **Acceptance criteria**, and **Scope boundaries** by running `pnpm --filter @yaroo/backend test`, `pnpm build`, and `pnpm lint`; manually verify a fresh login only renders catalog cat files and a retired-JPG automatic rejoin returns to login without publishing presence.
