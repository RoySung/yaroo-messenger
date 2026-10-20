## Context

The demo app currently treats the browser viewport as a desktop: `LoginScreen`, `MainMessenger`, and every `ChatWindow` render fixed-size, absolutely positioned `Window` components and use `useDraggable` for mouse movement. `App` keeps multiple chats mounted and uses z-index to focus overlapping windows. This works for the static desktop presentation but clips content and exposes ineffective desktop controls on phone portrait screens.

The target is the Vite demo only. It remains driven by `mockData.ts` and does not gain Socket.IO, persistence, accounts, or server behavior. The existing `@yaroo/ui` theme and presentational primitives remain the visual source of truth. The approved design direction is “Pocket Messenger”: preserve the purple XP titlebar, warm-gray window surfaces, compact chrome, and tactile controls while adapting content and navigation for touch.

## Goals / Non-Goals

**Goals:**

- Make login, contacts, and one-to-one chat fully usable on phone portrait viewports.
- Present each mobile surface as one viewport-filling XP window with stacked list-to-chat navigation.
- Preserve message send, emoji insertion, Buzz, status context, and demo auto-replies.
- Use readable mobile content, 44-by-44-pixel touch targets, dynamic viewport units, and safe-area padding.
- Preserve the current desktop and landscape multi-window experience.

**Non-Goals:**

- Add dedicated phone landscape, tablet, foldable, or installable native-app layouts.
- Change the live `apps/yaroo-chat` client, server, protocol, or shared chat semantics.
- Replace the XP visual language with LINE-, WhatsApp-, or generic native-messenger patterns.
- Add backend connectivity, durable messages, authentication, or real accounts to the demo.
- Redesign disabled mock actions such as calls, video, and file transfer into working features.

## Decisions

### Detect phone portrait with a single app-owned media query

Add an app-specific `usePhonePortrait` hook backed by `window.matchMedia('(max-width: 767px) and (orientation: portrait)')`. The hook provides the behavioral branch needed by `App` and component props, while the same query in `app.css` owns layout styling. It subscribes to media-query changes so resizing or rotating returns to the correct mode without a reload.

Alternative: infer mobile from a user agent. Rejected because device identity does not describe the available layout or input mode and is brittle in desktop emulation. Alternative: use CSS alone. Rejected because `App` must also change navigation and which chat is interactively visible.

### Turn windows into full-viewport surfaces without changing shared UI

Pass app-local mobile classes and behavior through existing `Window` and `WindowHeader` extension points. In phone portrait mode, each surface uses fixed positioning at the viewport origin, `100dvh`, safe-area padding, zero outer shadow, zero outer radius, and no draggable mouse handler. Shared primitives stay generic; the demo owns its compact navigation behavior.

Alternative: add chat-specific responsive props to `@yaroo/ui`. Rejected because the shared package must remain presentational and the first delivery explicitly targets the demo. Alternative: scale the fixed desktop window. Rejected because scaled controls and text remain inaccessible and the multi-window model does not fit the phone viewport.

### Model mobile navigation in App state

Keep the existing `activeChats` collection so demo conversations survive list-to-chat transitions. In phone portrait mode, `activeWindowId === 'main'` shows the contact list and a `chat-<contactId>` value shows exactly one chat. Opening a contact activates that chat; a mobile back action returns to `main` without removing the chat; closing a chat removes it and returns to `main`. Desktop continues to mount and layer all open chats by z-index.

Alternative: replace `activeChats` with a single selected contact on mobile. Rejected because rotating or widening the viewport would discard open desktop chat state and complicate state migration.

### Reflow each screen around touch and safe-area constraints

The login window fills the phone viewport and its inner form scrolls vertically when the available height is reduced. The contact list fills the viewport, keeps its identity and status controls at the top, and gives each contact row a minimum 44-pixel tap target. The chat window replaces the fixed 145-pixel sidebar with a compact contact identity strip, lets menus and toolbars wrap or scroll without clipping, gives message content and the composer 16-pixel text, and anchors the composer above the bottom safe area and virtual keyboard through flex layout and dynamic viewport height.

Disabled secondary toolbar actions can remain in horizontally scrollable chrome or move behind existing menus, but login, contact selection, send, emoji, Buzz, and back navigation remain directly operable. The viewport meta tag enables `viewport-fit=cover` so safe-area environment variables are effective.

Alternative: hide the menu, identity, and composer tools until there is room. Rejected because hiding core context and actions harms the demo and makes the mobile surface resemble a generic modern messenger.

### Preserve Buzz feedback with reduced-motion fallback

Desktop retains the current audible Buzz and shake. Phone portrait constrains movement so transformed content cannot expose an off-screen desktop or make controls unreachable. Under `prefers-reduced-motion: reduce`, the shake is replaced by a short non-positional visual emphasis while the existing audible cue and Buzz message remain available.

Alternative: disable Buzz on mobile. Rejected because Buzz is a signature demo interaction and a core acceptance condition.

### Verify fixed portrait widths and desktop regression widths

Use production build and browser verification rather than adding a new test framework in this change. Verify phone portrait at 320 by 568, 375 by 667, and 430 by 932 pixels; verify desktop preservation at 1024 by 768 and 1440 by 900 pixels. At each phone size, complete login, open 貝貝, return to contacts, reopen the conversation, send a message, open and close emoji controls, and trigger Buzz with normal and reduced motion. Browser assertions include no horizontal page overflow, no clipped composer, directly reachable core actions, and visible focus indicators.

Alternative: add Vitest and a DOM test stack solely for responsive layout. Rejected for this first demo-only adaptation because DOM tests do not validate viewport reflow, safe areas, or clipping and would add dependencies without replacing browser verification.

## Implementation Contract

**Behavior:** Phone portrait mode activates when the media query `(max-width: 767px) and (orientation: portrait)` matches. Login, contacts, and chat each occupy the available viewport as one XP-styled surface. Opening a contact replaces the visible list with one chat; back returns to the list without losing that chat’s in-memory messages; close removes the active chat. Core demo actions remain available and the page does not require horizontal scrolling.

**Interface:** `usePhonePortrait(): boolean` is an app-local hook that reports the live media-query result and removes its change listener on cleanup. `App` passes an explicit mobile-mode signal and navigation callbacks to the three screen components where behavior cannot be expressed through CSS alone. CSS uses one matching phone-portrait query and app-specific classes; the shared UI package API remains unchanged.

**Failure modes:** Browsers without dynamic viewport or safe-area values fall back to standard viewport height and zero safe-area insets without hiding core content. If the media-query listener API changes across supported browsers, the hook provides the compatible add/remove listener path. A failed Web Audio context remains silent as it does today, while the visible Buzz message and motion or reduced-motion emphasis still occur.

**Acceptance criteria:** `pnpm --filter @yaroo/demo-web build` exits successfully. Manual browser checks at 320x568, 375x667, and 430x932 complete the full login-to-chat flow with no horizontal page overflow and with the composer visible after focusing its textarea. Each primary touch target measures at least 44 by 44 pixels and mobile message/input text computes to at least 16px. At 1024x768 and 1440x900, draggable overlapping windows for 貝貝 and Tom, z-index focus, and multiple open chats remain available. With reduced motion enabled, Buzz does not move the window or page position.

**Scope boundaries:** In scope are the demo app shell, its three main screens, app-owned responsive detection, viewport metadata, mobile layout styling, and browser verification. Out of scope are the live chat app, shared protocol, server, persistence, native packaging, tablet-specific composition, and phone-landscape design.

## Risks / Trade-offs

- [CSS and JavaScript breakpoint drift] → Define the exact media-query string once in the hook and repeat it verbatim in a named CSS section covered by review and viewport checks.
- [Virtual keyboards vary across mobile browsers] → Use `100dvh`, flex-based min-height constraints, scrollable inner regions, and focused-input checks on at least one real iPhone and one real Android before release.
- [XP density can conflict with touch accessibility] → Keep chrome visually compact while expanding invisible or structural tap areas to 44 by 44 pixels and using 16-pixel primary content text.
- [Rotating can reveal stale navigation state] → Preserve `activeChats` and `activeWindowId` across media-query changes so desktop layering resumes deterministically.
- [Full-window Buzz transforms can reveal the page background] → Apply bounded emphasis to an inner chat surface and provide a non-positional reduced-motion variant.
