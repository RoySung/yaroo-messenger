## Context

The live application currently converts every `OnlineUser` into a display user with `/avatars/cat_roy.svg`, even though both frontend applications already ship 13 avatar assets. The active real-time chat implementation owns session identity in the backend, publishes `OnlineUser` records through acknowledgments and presence snapshots, and keeps a `SessionJoinPayload` in the browser for automatic Socket.IO rejoin. Avatar assignment must fit that ephemeral model: no account, browser storage, database, upload, or external media service is introduced.

The approved product behavior is a fresh random avatar on every explicit login, stability throughout that logical login including automatic reconnects, the 9 existing cat artworks only, and duplicate assignments when different sessions draw the same entry. `girl_cute.jpg`, `girl_glasses.jpg`, and `guy_blond.jpg` are retired from the live web application.

## Goals / Non-Goals

**Goals:**

- Give every joined session one server-selected avatar from a closed 9-entry catalog.
- Publish the same avatar identifier to the owner and every observing client.
- Preserve the identifier across automatic reconnects within the same logical login.
- Map identifiers to bundled assets without accepting arbitrary URLs or paths.
- Remove both unused copies of `user_main.jpg`.
- Remove the three user-specified JPG avatars from the live web application.
- Make selection and reconnect behavior deterministic under backend integration tests.

**Non-Goals:**

- User selection, reroll controls, uploads, generated artwork, remote URLs, or profile editing.
- Unique avatar allocation or prevention of duplicate assignments.
- Persistence across explicit logins, browser reloads, backend sessions, or devices.
- Changes to static demo contacts or avatar presentation beyond removing its unused `user_main.jpg` copy.
- Retiring or deleting the static demo copies of the three JPG avatars.

## Decisions

### Define the nine-avatar catalog and public contract

The shared chat protocol will export `AVATAR_IDS`, an `AvatarId` union derived from it, and an `INVALID_AVATAR` error code. Each identifier is the exact bundled filename so the live frontend can resolve it as `/avatars/${avatarId}` without a second filename map. The catalog contains exactly `cat_ann.svg`, `cat_candy.svg`, `cat_golden.svg`, `cat_hsuan.svg`, `cat_kai.svg`, `cat_meatball.svg`, `cat_nine.svg`, `cat_patrick.svg`, and `cat_roy.svg`.

`OnlineUser` gains required `avatarId: AvatarId`. `SessionJoinPayload` gains optional `resumeAvatarId: AvatarId`; the login form does not set it, while the chat client sets it only after receiving a successful server assignment. Using identifiers instead of arbitrary paths keeps transport data compact and prevents path or URL injection. A frontend-only random choice was rejected because the backend would no longer be the source of the public user record. A nickname hash was rejected because it would persist across explicit logins rather than reroll.

### Assign on the server and resume with the server-issued identifier

When `resumeAvatarId` is absent, the server's avatar selector chooses one entry from `AVATAR_IDS` independently of other sessions. No allocation registry is maintained, so duplicates are valid and the pool never exhausts. `ChatServerOptions` exposes an avatar-selector seam for deterministic tests; production uses a random index over the fixed non-empty catalog.

After a successful explicit join, `ChatClient` stores its original join fields plus the returned `avatarId` as `resumeAvatarId`. An automatic reconnect resubmits that payload, and the server reuses the catalog entry. A later user-initiated login starts from the form payload without `resumeAvatarId` and therefore draws again. This rejoin hint is not an authentication credential: a custom client can request a catalog entry, which is acceptable because avatars convey no authority or protected identity. A server-side reconnect token was rejected as disproportionate for anonymous in-memory sessions.

The server validates a present `resumeAvatarId` against `AVATAR_IDS` before reserving the nickname or adding the socket to session state. An invalid value, including a retired JPG identifier, returns `INVALID_AVATAR` and performs no join or presence broadcast. The client already treats a failed automatic rejoin as a return to login, so the next explicit login omits the identifier and receives a new cat assignment. The assigned identifier remains part of the joined-session record and therefore survives presence updates and is included by the existing public-user projection.

### Resolve only catalog identifiers in the frontend

The live frontend's `toDisplayUser` conversion will derive the image source from the validated `avatarId` rather than hard-code `cat_roy.svg`. The same conversion is already used for the current user, presence contacts, inbound chat creation, and refreshed active chats, so one change propagates the assigned image consistently. A defensive catalog membership check falls back to `cat_roy.svg` if runtime data from an incompatible or malformed server escapes static typing; the fallback does not alter protocol or session state.

The browser does not fetch remote avatar URLs, store the assignment, or randomize during rendering. Randomizing in each component was rejected because one participant could appear with different images across clients and rerenders.

### Retire the three designated live web avatar assets

`apps/yaroo-web/public/avatars/girl_cute.jpg`, `apps/yaroo-web/public/avatars/girl_glasses.jpg`, and `apps/yaroo-web/public/avatars/guy_blond.jpg` are not members of the reduced catalog and will be deleted. Their static-demo copies remain outside this request and no demo source changes are needed because its mock users already reference other avatar files.

## Implementation Contract

### Observable behavior

On an explicit successful login, the user and all peers see one of the 9 catalog images for that session. The image remains unchanged after presence updates and automatic Socket.IO reconnects. Submitting the login form again after returning to the login screen triggers a new independent draw; the result is allowed to equal the prior image or another user's image. A reconnect carrying a retired JPG identifier is rejected and returns the browser to login, where an explicit login draws a cat avatar.

`user_main.jpg` is absent from both public avatar directories and can never be assigned. The static demo continues to render its existing mock contacts without broken avatar requests.

### Interface and failure contract

The normative public shapes are `OnlineUser.avatarId: AvatarId` and `SessionJoinPayload.resumeAvatarId?: AvatarId`. Initial login payloads omit the optional field. After success, automatic rejoin payloads use exactly the `avatarId` returned by the server. Join acknowledgments, presence snapshots, and successful presence-update acknowledgments contain the same session avatar identifier.

An unknown, retired, or non-string runtime `resumeAvatarId` returns `INVALID_AVATAR` with a Traditional Chinese error message. The rejected socket does not reserve its nickname, join session state, or cause a presence snapshot. The server never publishes an avatar value outside `AVATAR_IDS`. If the live frontend nevertheless receives an unknown value from an incompatible server, it renders `cat_roy.svg` as a local defensive fallback.

### Acceptance criteria

- Backend integration tests inject a deterministic avatar selector and verify 9-entry initial assignment, duplicate allowance, presence publication, presence-update stability, valid cat reconnect reuse, and retired-JPG resume rejection without state mutation.
- A client-level assertion or focused test verifies that a successful initial join stores the returned identifier for automatic rejoin while a fresh form submission omits it.
- `pnpm --filter @yaroo/backend test` passes.
- `pnpm --filter @yaroo/web build` and `pnpm --filter @yaroo/demo-web build` pass after both unused assets are removed.
- `pnpm build` and `pnpm lint` pass.
- Manual verification with two browsers confirms consistent avatars across the main messenger and chat windows and no avatar change during a forced automatic reconnect.

### Scope boundaries

Implementation is limited to the shared protocol catalog and types, backend join/session publication, live frontend reconnect and display mapping, backend tests, and deletion of the three named live web assets. It does not add UI controls, persistence, uniqueness rules, new artwork, remote media, or changes to the demo's mock data or its JPG asset copies.

## Migration Plan

1. Extend the shared protocol so backend and live frontend compile against the avatar contract together.
2. Add server assignment, validation, and deterministic integration coverage.
3. Store the server-issued identifier for automatic rejoin and render it in the live frontend.
4. Delete the three named live web JPG files, verify retired reconnect rejection, and run backend, frontend, repository build, and lint verification.

Rollback restores the two deleted assets and removes the avatar fields, selector, validation, reconnect hint, and display mapping as one coordinated protocol rollback. No persisted data requires migration.

## Risks / Trade-offs

- [A custom client can submit a valid `resumeAvatarId` on its first join] → Treat the field as a non-authoritative appearance hint with no permissions; the server still restricts it to the bundled catalog.
- [Independent random selection can produce repeated avatars] → This is explicit product behavior and avoids pool exhaustion or reassignment cascades.
- [A browser reconnects with a retired JPG identifier] → The normal invalid-resume path returns it to anonymous login, where the next explicit login receives a catalog cat avatar.
- [Protocol changes must land atomically across packages] → Build the workspace and both frontends after the shared type update.

## Open Questions

None. The avatar pool, lifecycle, duplicate behavior, asset removal, and reconnect semantics are approved.
