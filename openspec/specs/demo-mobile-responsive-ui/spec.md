# demo-mobile-responsive-ui Specification

## Purpose

TBD - created by archiving change 'adapt-demo-mobile-rwd'. Update Purpose after archive.

## Requirements

### Requirement: Phone portrait mode has a deterministic activation boundary

The demo app SHALL activate phone portrait behavior when `(max-width: 767px) and (orientation: portrait)` matches and SHALL update the active layout when that media-query result changes without requiring a page reload.

#### Scenario: Supported portrait viewport enters mobile mode

- **WHEN** the viewport is 375 pixels wide by 667 pixels high in portrait orientation
- **THEN** the demo renders its phone portrait layout

#### Scenario: Landscape viewport retains desktop mode

- **WHEN** the viewport is 667 pixels wide by 375 pixels high in landscape orientation
- **THEN** the demo retains the desktop window layout

#### Scenario: Layout responds to an orientation change

- **WHEN** an active 375-by-667 portrait session changes to 667-by-375 landscape
- **THEN** the demo exits phone portrait mode without reloading or discarding active chat state


<!-- @trace
source: adapt-demo-mobile-rwd
updated: 2026-10-12
code:
  - apps/yaroo-demo-web/src/app.css
  - apps/yaroo-chat/app/components/MainMessenger.tsx
  - .superpowers/brainstorm/13286-1787817833/content/mobile-shell-options-v2.html
  - .superpowers/brainstorm/11427-1787799688/state/server-stopped
  - .agents/skills/spectra-commit/SKILL.md
  - apps/yaroo-chat/app/hooks/usePhonePortrait.ts
  - apps/yaroo-demo-web/src/hooks/usePhonePortrait.ts
  - .agents/skills/spectra-ingest/SKILL.md
  - apps/yaroo-chat/app/ChatApp.tsx
  - apps/yaroo-chat/next-env.d.ts
  - apps/yaroo-chat/app/globals.css
  - .agents/skills/spectra-ask/SKILL.md
  - .superpowers/brainstorm/11427-1787799688/content/mobile-shell-options.html
  - .superpowers/brainstorm/13286-1787817833/state/server.pid
  - .superpowers/brainstorm/11427-1787799688/state/server.pid
  - apps/yaroo-chat/app/components/LoginScreen.tsx
  - apps/yaroo-demo-web/src/App.tsx
  - apps/yaroo-demo-web/src/components/MainMessenger.tsx
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
  - AGENTS.md
  - .agents/skills/spectra-drift/SKILL.md
  - .superpowers/brainstorm/11324-1787799668/state/server.pid
  - apps/yaroo-chat/app/components/ChatWindow.tsx
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - apps/yaroo-chat/app/layout.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .superpowers/brainstorm/13286-1787817833/content/waiting-accessibility.html
  - .agents/skills/spectra-review/SKILL.md
  - .agents/skills/spectra-verify/SKILL.md
  - apps/yaroo-demo-web/index.html
  - apps/yaroo-demo-web/src/components/ChatWindow.tsx
  - apps/yaroo-demo-web/src/components/LoginScreen.tsx
  - .agents/skills/spectra-analyze/SKILL.md
  - .superpowers/brainstorm/13286-1787817833/state/server-stopped
-->

---
### Requirement: Mobile surfaces fill the available viewport

In phone portrait mode, the login, contact list, and active chat surfaces SHALL each occupy the available dynamic viewport as a single XP-styled window and SHALL NOT use draggable positioning, overlapping windows, an outer floating shadow, or page-level horizontal scrolling.

#### Scenario: Login fits a narrow phone

- **WHEN** the login screen renders at 320 by 568 pixels
- **THEN** the entire form remains reachable through vertical scrolling and no form control is clipped horizontally

#### Scenario: Chat fills the phone viewport

- **WHEN** a chat renders at 430 by 932 pixels
- **THEN** its titlebar, conversation history, and composer remain inside one viewport-filling XP surface with no horizontal page overflow


<!-- @trace
source: adapt-demo-mobile-rwd
updated: 2026-10-12
code:
  - apps/yaroo-demo-web/src/app.css
  - apps/yaroo-chat/app/components/MainMessenger.tsx
  - .superpowers/brainstorm/13286-1787817833/content/mobile-shell-options-v2.html
  - .superpowers/brainstorm/11427-1787799688/state/server-stopped
  - .agents/skills/spectra-commit/SKILL.md
  - apps/yaroo-chat/app/hooks/usePhonePortrait.ts
  - apps/yaroo-demo-web/src/hooks/usePhonePortrait.ts
  - .agents/skills/spectra-ingest/SKILL.md
  - apps/yaroo-chat/app/ChatApp.tsx
  - apps/yaroo-chat/next-env.d.ts
  - apps/yaroo-chat/app/globals.css
  - .agents/skills/spectra-ask/SKILL.md
  - .superpowers/brainstorm/11427-1787799688/content/mobile-shell-options.html
  - .superpowers/brainstorm/13286-1787817833/state/server.pid
  - .superpowers/brainstorm/11427-1787799688/state/server.pid
  - apps/yaroo-chat/app/components/LoginScreen.tsx
  - apps/yaroo-demo-web/src/App.tsx
  - apps/yaroo-demo-web/src/components/MainMessenger.tsx
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
  - AGENTS.md
  - .agents/skills/spectra-drift/SKILL.md
  - .superpowers/brainstorm/11324-1787799668/state/server.pid
  - apps/yaroo-chat/app/components/ChatWindow.tsx
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - apps/yaroo-chat/app/layout.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .superpowers/brainstorm/13286-1787817833/content/waiting-accessibility.html
  - .agents/skills/spectra-review/SKILL.md
  - .agents/skills/spectra-verify/SKILL.md
  - apps/yaroo-demo-web/index.html
  - apps/yaroo-demo-web/src/components/ChatWindow.tsx
  - apps/yaroo-demo-web/src/components/LoginScreen.tsx
  - .agents/skills/spectra-analyze/SKILL.md
  - .superpowers/brainstorm/13286-1787817833/state/server-stopped
-->

---
### Requirement: Mobile navigation uses a list-to-chat stack

In phone portrait mode, the contact list SHALL be the home surface, opening a contact SHALL present exactly one full-screen chat, a visible back action SHALL return to the contact list without deleting that conversation, and closing the chat SHALL remove the conversation from the open-chat collection before returning to the list.

#### Scenario: Open and return without losing messages

- **WHEN** a user opens 貝貝, sends a message, returns to the contact list, and opens 貝貝 again
- **THEN** 貝貝's existing in-memory conversation and the sent message remain visible

#### Scenario: Opening another contact replaces the visible chat

- **WHEN** the user returns to the contact list from 貝貝 and opens Tom
- **THEN** Tom is the only visible chat while 貝貝 remains in the open-chat collection

#### Scenario: Closing removes the active chat

- **WHEN** the user closes Tom's mobile chat
- **THEN** Tom is removed from the open-chat collection and the contact list becomes visible


<!-- @trace
source: adapt-demo-mobile-rwd
updated: 2026-10-12
code:
  - apps/yaroo-demo-web/src/app.css
  - apps/yaroo-chat/app/components/MainMessenger.tsx
  - .superpowers/brainstorm/13286-1787817833/content/mobile-shell-options-v2.html
  - .superpowers/brainstorm/11427-1787799688/state/server-stopped
  - .agents/skills/spectra-commit/SKILL.md
  - apps/yaroo-chat/app/hooks/usePhonePortrait.ts
  - apps/yaroo-demo-web/src/hooks/usePhonePortrait.ts
  - .agents/skills/spectra-ingest/SKILL.md
  - apps/yaroo-chat/app/ChatApp.tsx
  - apps/yaroo-chat/next-env.d.ts
  - apps/yaroo-chat/app/globals.css
  - .agents/skills/spectra-ask/SKILL.md
  - .superpowers/brainstorm/11427-1787799688/content/mobile-shell-options.html
  - .superpowers/brainstorm/13286-1787817833/state/server.pid
  - .superpowers/brainstorm/11427-1787799688/state/server.pid
  - apps/yaroo-chat/app/components/LoginScreen.tsx
  - apps/yaroo-demo-web/src/App.tsx
  - apps/yaroo-demo-web/src/components/MainMessenger.tsx
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
  - AGENTS.md
  - .agents/skills/spectra-drift/SKILL.md
  - .superpowers/brainstorm/11324-1787799668/state/server.pid
  - apps/yaroo-chat/app/components/ChatWindow.tsx
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - apps/yaroo-chat/app/layout.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .superpowers/brainstorm/13286-1787817833/content/waiting-accessibility.html
  - .agents/skills/spectra-review/SKILL.md
  - .agents/skills/spectra-verify/SKILL.md
  - apps/yaroo-demo-web/index.html
  - apps/yaroo-demo-web/src/components/ChatWindow.tsx
  - apps/yaroo-demo-web/src/components/LoginScreen.tsx
  - .agents/skills/spectra-analyze/SKILL.md
  - .superpowers/brainstorm/13286-1787817833/state/server-stopped
-->

---
### Requirement: Core demo interactions remain directly operable

Phone portrait mode SHALL keep login, contact selection, message composition, send, emoji insertion, Buzz, and back navigation directly operable. Disabled call, video, file-transfer, and photo actions SHALL NOT displace or obscure these core controls.

#### Scenario: Complete the primary mobile flow

- **WHEN** a user signs in, opens an online contact, inserts an emoji, sends a message, and triggers Buzz
- **THEN** each action completes using a visible control without switching to desktop mode or scrolling the page horizontally

#### Scenario: Disabled actions do not crowd the composer

- **WHEN** the chat renders at 320 pixels wide
- **THEN** the message field, emoji action, Buzz action, and send button remain visible or reachable while disabled secondary actions stay outside the primary composer row


<!-- @trace
source: adapt-demo-mobile-rwd
updated: 2026-10-12
code:
  - apps/yaroo-demo-web/src/app.css
  - apps/yaroo-chat/app/components/MainMessenger.tsx
  - .superpowers/brainstorm/13286-1787817833/content/mobile-shell-options-v2.html
  - .superpowers/brainstorm/11427-1787799688/state/server-stopped
  - .agents/skills/spectra-commit/SKILL.md
  - apps/yaroo-chat/app/hooks/usePhonePortrait.ts
  - apps/yaroo-demo-web/src/hooks/usePhonePortrait.ts
  - .agents/skills/spectra-ingest/SKILL.md
  - apps/yaroo-chat/app/ChatApp.tsx
  - apps/yaroo-chat/next-env.d.ts
  - apps/yaroo-chat/app/globals.css
  - .agents/skills/spectra-ask/SKILL.md
  - .superpowers/brainstorm/11427-1787799688/content/mobile-shell-options.html
  - .superpowers/brainstorm/13286-1787817833/state/server.pid
  - .superpowers/brainstorm/11427-1787799688/state/server.pid
  - apps/yaroo-chat/app/components/LoginScreen.tsx
  - apps/yaroo-demo-web/src/App.tsx
  - apps/yaroo-demo-web/src/components/MainMessenger.tsx
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
  - AGENTS.md
  - .agents/skills/spectra-drift/SKILL.md
  - .superpowers/brainstorm/11324-1787799668/state/server.pid
  - apps/yaroo-chat/app/components/ChatWindow.tsx
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - apps/yaroo-chat/app/layout.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .superpowers/brainstorm/13286-1787817833/content/waiting-accessibility.html
  - .agents/skills/spectra-review/SKILL.md
  - .agents/skills/spectra-verify/SKILL.md
  - apps/yaroo-demo-web/index.html
  - apps/yaroo-demo-web/src/components/ChatWindow.tsx
  - apps/yaroo-demo-web/src/components/LoginScreen.tsx
  - .agents/skills/spectra-analyze/SKILL.md
  - .superpowers/brainstorm/13286-1787817833/state/server-stopped
-->

---
### Requirement: Mobile chat reflows secondary information

In phone portrait mode, the chat SHALL replace the fixed-width contact sidebar with a compact identity region that communicates avatar, nickname, and presence context, and its menu and action chrome SHALL wrap, scroll within their own region, or use progressive disclosure without clipping the viewport.

#### Scenario: Contact context remains available

- **WHEN** a chat is visible at 375 pixels wide
- **THEN** the contact's nickname and presence context are visible without a 145-pixel side column reducing the message history width

#### Scenario: Chat chrome does not overflow the page

- **WHEN** menu and toolbar actions exceed the available width
- **THEN** overflow is contained within the relevant chrome region and the document has no horizontal page scrollbar


<!-- @trace
source: adapt-demo-mobile-rwd
updated: 2026-10-12
code:
  - apps/yaroo-demo-web/src/app.css
  - apps/yaroo-chat/app/components/MainMessenger.tsx
  - .superpowers/brainstorm/13286-1787817833/content/mobile-shell-options-v2.html
  - .superpowers/brainstorm/11427-1787799688/state/server-stopped
  - .agents/skills/spectra-commit/SKILL.md
  - apps/yaroo-chat/app/hooks/usePhonePortrait.ts
  - apps/yaroo-demo-web/src/hooks/usePhonePortrait.ts
  - .agents/skills/spectra-ingest/SKILL.md
  - apps/yaroo-chat/app/ChatApp.tsx
  - apps/yaroo-chat/next-env.d.ts
  - apps/yaroo-chat/app/globals.css
  - .agents/skills/spectra-ask/SKILL.md
  - .superpowers/brainstorm/11427-1787799688/content/mobile-shell-options.html
  - .superpowers/brainstorm/13286-1787817833/state/server.pid
  - .superpowers/brainstorm/11427-1787799688/state/server.pid
  - apps/yaroo-chat/app/components/LoginScreen.tsx
  - apps/yaroo-demo-web/src/App.tsx
  - apps/yaroo-demo-web/src/components/MainMessenger.tsx
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
  - AGENTS.md
  - .agents/skills/spectra-drift/SKILL.md
  - .superpowers/brainstorm/11324-1787799668/state/server.pid
  - apps/yaroo-chat/app/components/ChatWindow.tsx
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - apps/yaroo-chat/app/layout.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .superpowers/brainstorm/13286-1787817833/content/waiting-accessibility.html
  - .agents/skills/spectra-review/SKILL.md
  - .agents/skills/spectra-verify/SKILL.md
  - apps/yaroo-demo-web/index.html
  - apps/yaroo-demo-web/src/components/ChatWindow.tsx
  - apps/yaroo-demo-web/src/components/LoginScreen.tsx
  - .agents/skills/spectra-analyze/SKILL.md
  - .superpowers/brainstorm/13286-1787817833/state/server-stopped
-->

---
### Requirement: Mobile content and controls meet touch accessibility baselines

In phone portrait mode, primary interactive targets SHALL measure at least 44 by 44 CSS pixels, message and input text SHALL compute to at least 16 CSS pixels, keyboard focus SHALL remain visibly indicated, and presence state SHALL include information beyond color alone.

#### Scenario: Primary controls are touch sized

- **WHEN** the login, contact list, and chat are inspected at 320, 375, and 430 pixels wide
- **THEN** login, contact rows, back, send, emoji, and Buzz targets each measure at least 44 by 44 CSS pixels

#### Scenario: Text remains readable and focus remains visible

- **WHEN** a keyboard user focuses the mobile message field and send action
- **THEN** both controls show a visible focus indicator and the field text computes to at least 16 CSS pixels

#### Scenario: Presence is not color only

- **WHEN** a contact's presence is displayed in the mobile identity region
- **THEN** a text label or equivalent accessible name communicates the presence state in addition to its color badge


<!-- @trace
source: adapt-demo-mobile-rwd
updated: 2026-10-12
code:
  - apps/yaroo-demo-web/src/app.css
  - apps/yaroo-chat/app/components/MainMessenger.tsx
  - .superpowers/brainstorm/13286-1787817833/content/mobile-shell-options-v2.html
  - .superpowers/brainstorm/11427-1787799688/state/server-stopped
  - .agents/skills/spectra-commit/SKILL.md
  - apps/yaroo-chat/app/hooks/usePhonePortrait.ts
  - apps/yaroo-demo-web/src/hooks/usePhonePortrait.ts
  - .agents/skills/spectra-ingest/SKILL.md
  - apps/yaroo-chat/app/ChatApp.tsx
  - apps/yaroo-chat/next-env.d.ts
  - apps/yaroo-chat/app/globals.css
  - .agents/skills/spectra-ask/SKILL.md
  - .superpowers/brainstorm/11427-1787799688/content/mobile-shell-options.html
  - .superpowers/brainstorm/13286-1787817833/state/server.pid
  - .superpowers/brainstorm/11427-1787799688/state/server.pid
  - apps/yaroo-chat/app/components/LoginScreen.tsx
  - apps/yaroo-demo-web/src/App.tsx
  - apps/yaroo-demo-web/src/components/MainMessenger.tsx
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
  - AGENTS.md
  - .agents/skills/spectra-drift/SKILL.md
  - .superpowers/brainstorm/11324-1787799668/state/server.pid
  - apps/yaroo-chat/app/components/ChatWindow.tsx
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - apps/yaroo-chat/app/layout.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .superpowers/brainstorm/13286-1787817833/content/waiting-accessibility.html
  - .agents/skills/spectra-review/SKILL.md
  - .agents/skills/spectra-verify/SKILL.md
  - apps/yaroo-demo-web/index.html
  - apps/yaroo-demo-web/src/components/ChatWindow.tsx
  - apps/yaroo-demo-web/src/components/LoginScreen.tsx
  - .agents/skills/spectra-analyze/SKILL.md
  - .superpowers/brainstorm/13286-1787817833/state/server-stopped
-->

---
### Requirement: Mobile layout respects dynamic viewport and safe areas

The phone portrait layout SHALL use dynamic viewport sizing with a standards-compatible fallback, SHALL apply top and bottom safe-area insets where provided, and SHALL keep the focused composer reachable above the on-screen keyboard through flex reflow or inner scrolling.

#### Scenario: Safe-area insets protect controls

- **WHEN** the browser reports non-zero top or bottom safe-area insets
- **THEN** the titlebar and composer controls remain outside the obstructed areas

#### Scenario: Focused composer remains reachable

- **WHEN** the on-screen keyboard reduces the available height while the message textarea is focused
- **THEN** the textarea and send action remain reachable without horizontal page scrolling


<!-- @trace
source: adapt-demo-mobile-rwd
updated: 2026-10-12
code:
  - apps/yaroo-demo-web/src/app.css
  - apps/yaroo-chat/app/components/MainMessenger.tsx
  - .superpowers/brainstorm/13286-1787817833/content/mobile-shell-options-v2.html
  - .superpowers/brainstorm/11427-1787799688/state/server-stopped
  - .agents/skills/spectra-commit/SKILL.md
  - apps/yaroo-chat/app/hooks/usePhonePortrait.ts
  - apps/yaroo-demo-web/src/hooks/usePhonePortrait.ts
  - .agents/skills/spectra-ingest/SKILL.md
  - apps/yaroo-chat/app/ChatApp.tsx
  - apps/yaroo-chat/next-env.d.ts
  - apps/yaroo-chat/app/globals.css
  - .agents/skills/spectra-ask/SKILL.md
  - .superpowers/brainstorm/11427-1787799688/content/mobile-shell-options.html
  - .superpowers/brainstorm/13286-1787817833/state/server.pid
  - .superpowers/brainstorm/11427-1787799688/state/server.pid
  - apps/yaroo-chat/app/components/LoginScreen.tsx
  - apps/yaroo-demo-web/src/App.tsx
  - apps/yaroo-demo-web/src/components/MainMessenger.tsx
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
  - AGENTS.md
  - .agents/skills/spectra-drift/SKILL.md
  - .superpowers/brainstorm/11324-1787799668/state/server.pid
  - apps/yaroo-chat/app/components/ChatWindow.tsx
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - apps/yaroo-chat/app/layout.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .superpowers/brainstorm/13286-1787817833/content/waiting-accessibility.html
  - .agents/skills/spectra-review/SKILL.md
  - .agents/skills/spectra-verify/SKILL.md
  - apps/yaroo-demo-web/index.html
  - apps/yaroo-demo-web/src/components/ChatWindow.tsx
  - apps/yaroo-demo-web/src/components/LoginScreen.tsx
  - .agents/skills/spectra-analyze/SKILL.md
  - .superpowers/brainstorm/13286-1787817833/state/server-stopped
-->

---
### Requirement: Buzz provides a reduced-motion-safe mobile response

Buzz SHALL retain its visible message and available audio cue in phone portrait mode, SHALL NOT move content beyond the viewport boundary, and SHALL replace positional shaking with a non-positional emphasis when `prefers-reduced-motion: reduce` is active.

#### Scenario: Standard mobile Buzz stays bounded

- **WHEN** a user triggers Buzz in phone portrait mode without reduced motion
- **THEN** the Buzz message appears and any movement remains bounded without exposing an off-screen desktop or hiding controls

#### Scenario: Reduced-motion Buzz does not shake

- **WHEN** a user triggers Buzz while `prefers-reduced-motion: reduce` is active
- **THEN** the Buzz message and a non-positional emphasis appear without changing the window or page position


<!-- @trace
source: adapt-demo-mobile-rwd
updated: 2026-10-12
code:
  - apps/yaroo-demo-web/src/app.css
  - apps/yaroo-chat/app/components/MainMessenger.tsx
  - .superpowers/brainstorm/13286-1787817833/content/mobile-shell-options-v2.html
  - .superpowers/brainstorm/11427-1787799688/state/server-stopped
  - .agents/skills/spectra-commit/SKILL.md
  - apps/yaroo-chat/app/hooks/usePhonePortrait.ts
  - apps/yaroo-demo-web/src/hooks/usePhonePortrait.ts
  - .agents/skills/spectra-ingest/SKILL.md
  - apps/yaroo-chat/app/ChatApp.tsx
  - apps/yaroo-chat/next-env.d.ts
  - apps/yaroo-chat/app/globals.css
  - .agents/skills/spectra-ask/SKILL.md
  - .superpowers/brainstorm/11427-1787799688/content/mobile-shell-options.html
  - .superpowers/brainstorm/13286-1787817833/state/server.pid
  - .superpowers/brainstorm/11427-1787799688/state/server.pid
  - apps/yaroo-chat/app/components/LoginScreen.tsx
  - apps/yaroo-demo-web/src/App.tsx
  - apps/yaroo-demo-web/src/components/MainMessenger.tsx
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
  - AGENTS.md
  - .agents/skills/spectra-drift/SKILL.md
  - .superpowers/brainstorm/11324-1787799668/state/server.pid
  - apps/yaroo-chat/app/components/ChatWindow.tsx
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - apps/yaroo-chat/app/layout.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .superpowers/brainstorm/13286-1787817833/content/waiting-accessibility.html
  - .agents/skills/spectra-review/SKILL.md
  - .agents/skills/spectra-verify/SKILL.md
  - apps/yaroo-demo-web/index.html
  - apps/yaroo-demo-web/src/components/ChatWindow.tsx
  - apps/yaroo-demo-web/src/components/LoginScreen.tsx
  - .agents/skills/spectra-analyze/SKILL.md
  - .superpowers/brainstorm/13286-1787817833/state/server-stopped
-->

---
### Requirement: Desktop behavior remains unchanged

When phone portrait mode is inactive, the demo SHALL preserve fixed-size draggable windows, overlapping open chats, z-index focus, and the existing desktop visual density.

#### Scenario: Multiple desktop chats remain layered

- **WHEN** the viewport is 1024 by 768 pixels and the user opens 貝貝 and Tom
- **THEN** both chat windows remain visible, draggable, and selectable by z-index focus

#### Scenario: Wide desktop retains existing composition

- **WHEN** the viewport is 1440 by 900 pixels
- **THEN** the main messenger and chat windows retain their desktop dimensions and floating-window shadows

<!-- @trace
source: adapt-demo-mobile-rwd
updated: 2026-10-12
code:
  - apps/yaroo-demo-web/src/app.css
  - apps/yaroo-chat/app/components/MainMessenger.tsx
  - .superpowers/brainstorm/13286-1787817833/content/mobile-shell-options-v2.html
  - .superpowers/brainstorm/11427-1787799688/state/server-stopped
  - .agents/skills/spectra-commit/SKILL.md
  - apps/yaroo-chat/app/hooks/usePhonePortrait.ts
  - apps/yaroo-demo-web/src/hooks/usePhonePortrait.ts
  - .agents/skills/spectra-ingest/SKILL.md
  - apps/yaroo-chat/app/ChatApp.tsx
  - apps/yaroo-chat/next-env.d.ts
  - apps/yaroo-chat/app/globals.css
  - .agents/skills/spectra-ask/SKILL.md
  - .superpowers/brainstorm/11427-1787799688/content/mobile-shell-options.html
  - .superpowers/brainstorm/13286-1787817833/state/server.pid
  - .superpowers/brainstorm/11427-1787799688/state/server.pid
  - apps/yaroo-chat/app/components/LoginScreen.tsx
  - apps/yaroo-demo-web/src/App.tsx
  - apps/yaroo-demo-web/src/components/MainMessenger.tsx
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
  - AGENTS.md
  - .agents/skills/spectra-drift/SKILL.md
  - .superpowers/brainstorm/11324-1787799668/state/server.pid
  - apps/yaroo-chat/app/components/ChatWindow.tsx
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - apps/yaroo-chat/app/layout.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .superpowers/brainstorm/13286-1787817833/content/waiting-accessibility.html
  - .agents/skills/spectra-review/SKILL.md
  - .agents/skills/spectra-verify/SKILL.md
  - apps/yaroo-demo-web/index.html
  - apps/yaroo-demo-web/src/components/ChatWindow.tsx
  - apps/yaroo-demo-web/src/components/LoginScreen.tsx
  - .agents/skills/spectra-analyze/SKILL.md
  - .superpowers/brainstorm/13286-1787817833/state/server-stopped
-->