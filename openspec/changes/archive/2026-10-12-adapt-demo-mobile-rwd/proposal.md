## Why

The static demo currently renders fixed-size, absolutely positioned desktop windows, so phone portrait viewports clip the login, contact list, and chat experience and retain mouse-first dragging controls. The demo needs a deliberate mobile adaptation that remains fully operable and demonstrable without losing its XP messenger identity.

## What Changes

- Add a phone-portrait responsive mode that turns each demo surface into one full-viewport XP window instead of a draggable floating window.
- Use stacked navigation on phone portrait: the contact list is the home surface, opening a contact presents one full-screen chat, and a visible back action returns to the list.
- Reflow login, contacts, chat history, contact identity, toolbars, and composer for narrow viewports, safe areas, touch targets, and the on-screen keyboard.
- Preserve the existing desktop multi-window behavior outside the supported phone-portrait mode.
- Keep core demo interactions available on mobile, including login, contact selection, message composition, send, emoji insertion, and Buzz, while allowing disabled secondary actions to use progressive disclosure.
- Add reduced-motion and non-hover interaction behavior for Buzz and touch controls.

## Capabilities

### New Capabilities

- `demo-mobile-responsive-ui`: Defines the phone-portrait layout, navigation, interaction, accessibility, and desktop-preservation behavior for the static demo app.

### Modified Capabilities

(none)

## Impact

- Affected specs: `demo-mobile-responsive-ui`
- Affected code:
  - Modified: `apps/yaroo-demo-web/index.html`, `apps/yaroo-demo-web/src/app.css`, `apps/yaroo-demo-web/src/App.tsx`, `apps/yaroo-demo-web/src/components/LoginScreen.tsx`, `apps/yaroo-demo-web/src/components/MainMessenger.tsx`, `apps/yaroo-demo-web/src/components/ChatWindow.tsx`
  - New: `apps/yaroo-demo-web/src/hooks/usePhonePortrait.ts`
  - Removed: none
- Unaffected systems: `apps/yaroo-chat`, `packages/chat-protocol`, server behavior, persistence, and network communication
