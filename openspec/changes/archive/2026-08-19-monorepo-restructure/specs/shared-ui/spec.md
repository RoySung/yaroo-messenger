## ADDED Requirements

### Requirement: UI package provides Tailwind v4 design tokens via @theme

The `@yaroo/ui` package SHALL export a CSS file (`styles/theme.css`) containing Tailwind v4 `@theme` definitions for all design tokens. The tokens SHALL cover 6 categories: Color (brand, semantic, status, text), Typography (font family, sizes, weights), Spacing (scale from 2px to 32px), Border/Radius, Shadow, and Gradient-related CSS Custom Properties.

#### Scenario: App imports theme and gets Tailwind utilities

- **WHEN** an app imports `@yaroo/ui/styles/theme.css` in its Tailwind CSS entry file
- **THEN** all `yr-*` Tailwind utility classes are available (e.g., `bg-yr-purple`, `text-yr-md`, `p-yr-2`, `rounded-yr-md`, `shadow-yr-window`)

### Requirement: Color tokens match existing brand values

The theme SHALL define color tokens matching all existing brand and semantic colors.

#### Scenario: Color tokens produce correct Tailwind utilities

- **WHEN** theme.css is loaded by Tailwind v4
- **THEN** `bg-yr-purple` applies background `#6B0086`, `text-yr-text-dark` applies color `#222222`

##### Example: Color token mapping

| Tailwind Utility | CSS Value | Source |
|-----------------|-----------|--------|
| `bg-yr-purple` | `#6B0086` | `--yaroo-purple` |
| `bg-yr-purple-dark` | `#4A005E` | `--yaroo-purple-dark` |
| `bg-yr-purple-light` | `#9B62B2` | `--yaroo-purple-light` |
| `bg-yr-purple-bg` | `#EAE2EF` | `--yaroo-purple-bg` |
| `bg-yr-yellow` | `#FFD400` | `--yaroo-yellow` |
| `bg-yr-yellow-light` | `#FFF8D0` | `--yaroo-yellow-light` |
| `bg-yr-bg` | `#ECE9D8` | `--yaroo-bg` |
| `bg-yr-panel-bg` | `#F4F3ED` | `--yaroo-panel-bg` |
| `bg-yr-highlight` | `#316AC5` | `--yaroo-blue-highlight` |
| `bg-yr-hover-bg` | `#FFEBB5` | `--yaroo-hover-bg` |
| `text-yr-text-dark` | `#222222` | `--text-dark` |
| `text-yr-text-light` | `#666666` | `--text-light` |
| `text-yr-text-link` | `#0044BB` | `--text-link` |
| `bg-yr-status-available` | `#4CAF50` | hardcoded |
| `bg-yr-status-busy` | `#F44336` | hardcoded |
| `bg-yr-status-away` | `#FFC107` | hardcoded |
| `bg-yr-status-offline` | `#BDBDBD` | hardcoded |

### Requirement: Typography tokens define font stacks and sizes

The theme SHALL define typography tokens for the font family stack and font sizes (xs=10px through xl=16px).

#### Scenario: Typography tokens available as Tailwind utilities

- **WHEN** theme.css is loaded
- **THEN** `font-yr` applies the font stack `'Segoe UI', Tahoma, 'PMingLiU', '新細明體', Arial, sans-serif`
- **THEN** `text-yr-base` applies font-size `12px`

### Requirement: Spacing, border-radius, and shadow tokens

The theme SHALL define spacing tokens (2px through 32px), border-radius tokens (sm=2px through xl=6px), and shadow tokens (window, button, inset, control).

#### Scenario: Spacing and radius tokens available

- **WHEN** theme.css is loaded
- **THEN** `p-yr-2` applies padding `8px`, `rounded-yr-md` applies border-radius `3px`, `shadow-yr-window` applies the window shadow value

### Requirement: Gradient handling via CSS Custom Properties

The theme SHALL define gradient values as CSS Custom Properties outside `@theme` (since Tailwind `@theme` does not support gradient values natively). Components SHALL reference these via `style` prop or Tailwind arbitrary values.

#### Scenario: Titlebar gradient accessible

- **WHEN** theme.css is loaded
- **THEN** `var(--yr-gradient-titlebar)` resolves to `linear-gradient(to bottom, #9453AD 0%, #68007E 45%, #520063 100%)`

### Requirement: Window component provides draggable container

The `@yaroo/ui` package SHALL export a TypeScript `Window` component that renders a styled container matching the classic messenger window appearance using Tailwind utility classes. The component SHALL accept `children`, `style`, `className`, and `onMouseDown` props with proper TypeScript types.

#### Scenario: Window renders with correct styling

- **WHEN** a Window component is rendered
- **THEN** it displays with the classic messenger window frame (border, shadow, rounded top corners) using Tailwind classes

### Requirement: WindowHeader component provides titlebar with controls

The `@yaroo/ui` package SHALL export a TypeScript `WindowHeader` component with `title`, `logoSrc`, `onClose`, `onMinimize`, `onMaximize`, `onMouseDown`, and `children` props. The titlebar SHALL use Tailwind classes plus the gradient CSS variable for the purple gradient background.

#### Scenario: WindowHeader renders with title and controls

- **WHEN** WindowHeader is rendered with title "Yaroo! 即時通" and logoSrc "/yaroo-logo.svg"
- **THEN** it displays the purple gradient titlebar with logo, title text, and three control buttons

#### Scenario: Close button triggers callback

- **WHEN** user clicks the close button on WindowHeader
- **THEN** the `onClose` callback is invoked

### Requirement: Avatar component renders user images with TypeScript size types

The `@yaroo/ui` package SHALL export a TypeScript `Avatar` component with `src`, `alt`, `size` ('sm'|'md'|'lg'), `pixelated` (boolean), and `className` props. Size mapping: sm=26px, md=52px, lg=90px.

#### Scenario: Avatar sizes render correctly

- **WHEN** Avatar is rendered with size 'md'
- **THEN** the image is 52x52 pixels with border styling via Tailwind classes

##### Example: Avatar size mapping

| Size | Width | Height | Use Case |
|------|-------|--------|----------|
| `sm` | 26px | 26px | Contact list items |
| `md` | 52px | 52px | Profile area |
| `lg` | 90px | 90px | Chat sidebar |

### Requirement: StatusBadge component shows presence status

The `@yaroo/ui` package SHALL export a TypeScript `StatusBadge` component with `status` ('available'|'busy'|'away'|'offline'|'invisible') and `size` props. Each status SHALL use the corresponding `yr-status-*` Tailwind color token.

#### Scenario: StatusBadge displays correct color per status

- **WHEN** StatusBadge is rendered with status 'available'
- **THEN** it displays a green circle using `bg-yr-status-available` Tailwind class

##### Example: Status to Tailwind class mapping

| Status | Tailwind Class | Color |
|--------|---------------|-------|
| `available` | `bg-yr-status-available` | `#4CAF50` |
| `busy` | `bg-yr-status-busy` | `#F44336` |
| `away` | `bg-yr-status-away` | `#FFC107` |
| `offline` | `bg-yr-status-offline` | `#BDBDBD` |
| `invisible` | `bg-yr-status-offline` | `#BDBDBD` |

### Requirement: XpButton component provides classic styled buttons

The `@yaroo/ui` package SHALL export a TypeScript `XpButton` component with `variant` ('default'|'primary'|'close'), `children`, `onClick`, `className`, and standard button HTML props. All variants SHALL use Tailwind classes with gradient CSS variables for the XP-style appearance.

#### Scenario: Default XpButton renders with classic gradient

- **WHEN** XpButton is rendered with variant 'default'
- **THEN** it displays with the classic white-to-gray gradient and 3D inset shadow

#### Scenario: Close XpButton renders with red gradient

- **WHEN** XpButton is rendered with variant 'close'
- **THEN** it displays with red gradient background and white text

### Requirement: TextInput component provides styled text input

The `@yaroo/ui` package SHALL export a TypeScript `TextInput` component that renders a styled input using Tailwind classes. It SHALL accept standard HTML input props plus `className`. Focus state SHALL show `yr-purple` border color.

#### Scenario: TextInput focus state uses brand color

- **WHEN** TextInput receives focus
- **THEN** the border color changes to `yr-purple` via Tailwind `focus:border-yr-purple`

### Requirement: TextArea component provides styled multiline input

The `@yaroo/ui` package SHALL export a TypeScript `TextArea` component with standard HTML textarea props. Resize SHALL be disabled via Tailwind `resize-none` class.

#### Scenario: TextArea renders without resize handle

- **WHEN** TextArea is rendered
- **THEN** it has `resize-none` class and displays with inset shadow styling

### Requirement: Checkbox component provides labeled checkbox

The `@yaroo/ui` package SHALL export a TypeScript `Checkbox` component with `checked`, `onChange`, `label` (string), and `children` props. The checkbox accent-color SHALL use `yr-purple`.

#### Scenario: Checkbox renders with purple accent

- **WHEN** Checkbox is rendered with label "記住我的帳號與密碼"
- **THEN** it displays with `accent-yr-purple` styling on the checkbox input

### Requirement: Select component provides styled dropdown

The `@yaroo/ui` package SHALL export a TypeScript `Select` component with `value`, `onChange`, `options` (array of {value: string, label: string}), and `className` props.

#### Scenario: Select renders with typed options

- **WHEN** Select is rendered with options [{value: 'available', label: '🟢 線上'}]
- **THEN** it renders a styled dropdown with proper TypeScript option typing

### Requirement: Toolbar component provides action bar container

The `@yaroo/ui` package SHALL export a TypeScript `Toolbar` component with `children` and `className` props. It SHALL render a horizontal container with the classic toolbar gradient background using Tailwind classes.

#### Scenario: Toolbar renders with gradient

- **WHEN** Toolbar is rendered
- **THEN** it displays with the XP toolbar gradient background via CSS variable and bottom border

### Requirement: MenuBar component provides menu strip

The `@yaroo/ui` package SHALL export a TypeScript `MenuBar` component with `items` (Array of {label: string, onClick?: () => void}) and `className` props. Menu items SHALL highlight with `bg-yr-highlight` on hover.

#### Scenario: MenuBar item highlights on hover

- **WHEN** user hovers over a menu item
- **THEN** the item gets `bg-yr-highlight text-white` via Tailwind hover utilities

### Requirement: useDraggable hook with TypeScript types

The `@yaroo/ui` package SHALL export a TypeScript `useDraggable` hook that returns typed position state and handlers. The hook SHALL accept `initialPosition` ({x: number, y: number}) and `onFocus` callback. It SHALL return `{ position, setPosition, isDragging, handleMouseDown }` with proper TypeScript types.

#### Scenario: useDraggable provides typed drag behavior

- **WHEN** a component uses useDraggable with initialPosition {x: 100, y: 50}
- **THEN** position is typed as {x: number, y: number} and handleMouseDown is typed as React.MouseEventHandler
