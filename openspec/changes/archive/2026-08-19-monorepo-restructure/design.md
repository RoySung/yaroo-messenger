## Context

目前 yaroo-messenger 是一個單體 Vite + React 19 專案，根目錄包含所有原始碼（src/）、靜態資源（public/）、以及唯一的建構配置（vite.config.js）。專案使用 JavaScript（JSX）與 Vanilla CSS，實作了一個懷舊 XP 風格的 Yaroo! 即時通介面，包含三個主要頁面元件（LoginScreen、MainMessenger、ChatWindow）以及一個共用 hook（useDraggable）。

設計語彙以 CSS Custom Properties 定義在 index.css 的 :root 中，涵蓋色彩（yaroo-purple 系列、yaroo-yellow、狀態色等）。各元件額外在自身 CSS 中使用大量硬編碼的顏色值、漸層、陰影。

專案規劃朝向多 app 架構發展，同時需要現代化技術堆疊（TypeScript + Tailwind CSS v4）。

## Goals / Non-Goals

**Goals:**

- 建立 pnpm workspace monorepo 架構
- 全面引入 TypeScript（所有檔案 .tsx/.ts）
- 全面採用 Tailwind CSS v4，所有元件以 Tailwind utility classes 重寫樣式
- 將 design token 與基礎元件合併為單一 `@yaroo/ui` 套件
- 使用 Tailwind v4 `@theme` 定義 design token，各 app import 即用
- 現有程式碼全面重寫為 TS + Tailwind 搬遷至 apps/yaroo-demo-web
- 確保 yaroo-demo-web 視覺呈現與目前完全一致
- 建立 apps/yaroo-web 與 apps/yaroo-backend 空殼

**Non-Goals:**

- 不引入 Turborepo / Nx 等 monorepo 編排工具
- 不重新設計任何 UI 元素的外觀（僅改變實作方式）
- 不實作 yaroo-backend 或 yaroo-web 的業務邏輯
- 不引入 CSS-in-JS
- 不改變現有的 mock 資料結構

## Decisions

### 使用 pnpm workspace 作為 monorepo 管理方案

**選擇**: pnpm workspace
**替代方案**: Turborepo（增加學習曲線）、Nx（過於重量級）、Lerna（不再積極維護）
**理由**: pnpm workspace 是 pnpm 內建功能，零額外依賴，語法簡潔。目前專案規模（3 apps + 1 package）不需要遠端快取或任務圖編排。

### 全面引入 TypeScript

**選擇**: 所有檔案使用 .tsx/.ts，包含搬遷的 demo-web 元件
**替代方案**: 僅新程式碼用 TS，舊程式碼保留 JSX
**理由**: 搭配全面 Tailwind 重寫，每個檔案都會是全新撰寫，沒有「遷移成本」的問題。根目錄提供共用 tsconfig.json，各 app/package 繼承擴展。TypeScript strict mode 啟用。

### 採用 Tailwind CSS v4 全面管理樣式

**選擇**: Tailwind CSS v4，CSS-first `@theme` 配置，所有元件使用 utility classes
**替代方案**: Tailwind v3（需 tailwind.config.js）、維持 Vanilla CSS
**理由**: v4 的 `@theme` 機制讓 design token 直接定義在 CSS 中，與 Tailwind 生態無縫整合。utility-first 寫法減少 CSS 檔案維護負擔。XP 風格的特殊漸層、陰影透過 `@theme` 自訂 token（如 `--gradient-yr-titlebar`）或 arbitrary value / inline style 處理。

### Token 與 UI 元件合併為單一套件

**選擇**: `@yaroo/ui` 單一套件，包含 Tailwind `@theme` token + 所有基礎元件 + hook
**替代方案**: 分開 `@yaroo/tokens` 與 `@yaroo/ui` 兩個套件
**理由**: token 與元件緊密耦合（元件使用 token），分開管理增加依賴複雜度。合併後各 app 只需一個 import 即可使用完整設計系統。

套件結構：
```
packages/ui/
├── package.json          # name: @yaroo/ui
├── tsconfig.json
├── vite.config.ts        # library mode
└── src/
    ├── index.ts          # barrel export
    ├── styles/
    │   └── theme.css     # Tailwind @theme token 定義
    ├── components/
    │   ├── Window/
    │   │   ├── Window.tsx
    │   │   └── index.ts
    │   ├── WindowHeader/
    │   ├── Avatar/
    │   ├── StatusBadge/
    │   ├── XpButton/
    │   ├── TextInput/
    │   ├── TextArea/
    │   ├── Checkbox/
    │   ├── Select/
    │   ├── Toolbar/
    │   └── MenuBar/
    └── hooks/
        └── useDraggable.ts
```

### Tailwind v4 @theme token 架構

Token 定義在 `packages/ui/src/styles/theme.css` 中，使用 Tailwind v4 `@theme` 語法：

```css
@theme {
  /* Color — 品牌色 */
  --color-yr-purple: #6B0086;
  --color-yr-purple-dark: #4A005E;
  --color-yr-purple-light: #9B62B2;
  --color-yr-purple-bg: #EAE2EF;
  --color-yr-yellow: #FFD400;
  --color-yr-yellow-light: #FFF8D0;

  /* Color — 背景 */
  --color-yr-bg: #ECE9D8;
  --color-yr-panel-bg: #F4F3ED;
  --color-yr-white: #FFFFFF;

  /* Color — 邊框 */
  --color-yr-border: #9D9DA1;
  --color-yr-border-light: #D4D0C8;

  /* Color — 語義色 */
  --color-yr-highlight: #316AC5;
  --color-yr-hover-bg: #FFEBB5;

  /* Color — 文字 */
  --color-yr-text-dark: #222222;
  --color-yr-text-light: #666666;
  --color-yr-text-link: #0044BB;

  /* Color — 狀態 */
  --color-yr-status-available: #4CAF50;
  --color-yr-status-busy: #F44336;
  --color-yr-status-away: #FFC107;
  --color-yr-status-offline: #BDBDBD;

  /* Typography */
  --font-yr: 'Segoe UI', Tahoma, 'PMingLiU', '新細明體', Arial, sans-serif;
  --text-yr-xs: 10px;
  --text-yr-sm: 11px;
  --text-yr-base: 12px;
  --text-yr-md: 13px;
  --text-yr-lg: 14px;
  --text-yr-xl: 16px;

  /* Spacing */
  --spacing-yr-0\.5: 2px;
  --spacing-yr-1: 4px;
  --spacing-yr-1\.5: 6px;
  --spacing-yr-2: 8px;
  --spacing-yr-2\.5: 10px;
  --spacing-yr-3: 12px;
  --spacing-yr-4: 16px;
  --spacing-yr-5: 20px;
  --spacing-yr-6: 24px;
  --spacing-yr-8: 32px;

  /* Border Radius */
  --radius-yr-sm: 2px;
  --radius-yr-md: 3px;
  --radius-yr-lg: 4px;
  --radius-yr-xl: 6px;

  /* Shadow */
  --shadow-yr-window: 0 8px 24px rgba(0, 0, 0, 0.35), 0 2px 6px rgba(0, 0, 0, 0.2);
  --shadow-yr-button: inset 0 1px 0 #FFF, 0 1px 2px rgba(0, 0, 0, 0.15);
  --shadow-yr-inset: inset 1px 1px 3px rgba(0, 0, 0, 0.12);
  --shadow-yr-control: inset 1px 1px 2px rgba(0, 0, 0, 0.15);
}
```

Tailwind 會自動產生對應的 utility classes：`bg-yr-purple`、`text-yr-md`、`p-yr-2`、`rounded-yr-md`、`shadow-yr-window` 等。

漸層因 Tailwind `@theme` 不直接支援，以兩種方式處理：
1. CSS Custom Properties 定義在 `:root`（非 `@theme`），元件中以 `style` prop 使用
2. 元件內直接使用 Tailwind arbitrary value：`bg-[linear-gradient(...)]`

### 基礎元件清單與 API 設計

從現有三大元件提取 11 個 TypeScript 基礎元件，全部使用 Tailwind utility classes：

| 元件 | Props | 來源 |
|------|-------|------|
| `Window` | `children`, `style`, `className`, `onMouseDown` | `.window` 樣式 |
| `WindowHeader` | `title`, `logoSrc`, `onClose`, `onMinimize`, `onMaximize`, `onMouseDown`, `children` | `.window-header` |
| `Avatar` | `src`, `alt`, `size` ('sm'\|'md'\|'lg'), `pixelated`, `className` | 大頭貼各尺寸 |
| `StatusBadge` | `status` ('available'\|'busy'\|'away'\|'offline'\|'invisible'), `size` | 狀態圓點 |
| `XpButton` | `variant` ('default'\|'primary'\|'close'), `children`, `onClick`, `className` | XP 風格按鈕 |
| `TextInput` | 標準 HTML input props + `className` | 登入表單輸入 |
| `TextArea` | 標準 HTML textarea props + `className` | 聊天輸入框 |
| `Checkbox` | `checked`, `onChange`, `label`, `children` | 登入選項 |
| `Select` | `value`, `onChange`, `options`, `className` | 狀態下拉選單 |
| `Toolbar` | `children`, `className` | 工具列容器 |
| `MenuBar` | `items` (Array of {label, onClick}), `className` | 選單列 |

每個元件使用 Tailwind utility classes（`bg-yr-purple text-white p-yr-2 rounded-yr-md` 等），不建立額外 CSS 檔案。特殊漸層透過 `style` prop 或 arbitrary value 處理。

### 目錄結構配置

```
yaroo-messenger/
├── pnpm-workspace.yaml
├── package.json              # workspace root
├── tsconfig.json             # 共用 TS 配置
├── .gitignore
├── .spectra.yaml
├── openspec/
├── apps/
│   ├── yaroo-demo-web/
│   │   ├── package.json      # name: @yaroo/demo-web
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   ├── index.html
│   │   ├── public/           # 搬遷現有 public/
│   │   └── src/
│   │       ├── main.tsx
│   │       ├── App.tsx
│   │       ├── app.css       # Tailwind 指令 + app-level 樣式
│   │       ├── mockData.ts
│   │       └── components/   # LoginScreen, MainMessenger, ChatWindow（全面 Tailwind 重寫）
│   ├── yaroo-web/
│   │   ├── package.json      # name: @yaroo/web
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   ├── index.html
│   │   └── src/
│   │       └── main.tsx      # 空殼入口
│   └── yaroo-backend/
│       ├── package.json      # name: @yaroo/backend
│       ├── tsconfig.json
│       └── src/
│           └── index.ts      # 空殼入口
├── packages/
│   └── ui/
│       ├── package.json      # name: @yaroo/ui
│       ├── tsconfig.json
│       ├── vite.config.ts    # library mode
│       └── src/
│           ├── index.ts      # barrel export
│           ├── styles/
│           │   └── theme.css # @theme token + 漸層 CSS vars
│           ├── components/
│           │   ├── Window/
│           │   ├── WindowHeader/
│           │   ├── Avatar/
│           │   ├── StatusBadge/
│           │   ├── XpButton/
│           │   ├── TextInput/
│           │   ├── TextArea/
│           │   ├── Checkbox/
│           │   ├── Select/
│           │   ├── Toolbar/
│           │   └── MenuBar/
│           └── hooks/
│               └── useDraggable.ts
```

### yaroo-demo-web 重寫策略

由於全面引入 TS + Tailwind，demo-web 的搬遷本質上是「全面重寫」：

1. 將現有 public/ 目錄整體複製至 apps/yaroo-demo-web/public/
2. 以 TypeScript 重寫所有原始碼檔案（main.tsx, App.tsx, mockData.ts）
3. 使用 `@yaroo/ui` 的基礎元件重寫 LoginScreen、MainMessenger、ChatWindow
4. 所有樣式改用 Tailwind utility classes，不再使用獨立 CSS 檔案
5. Tailwind 入口 CSS 中 import `@yaroo/ui` 的 theme.css
6. 最終確認 `pnpm --filter @yaroo/demo-web dev` 啟動後，視覺呈現與現有完全一致

### apps/yaroo-web 與 apps/yaroo-backend

空殼 app，僅包含最基本的入口檔案與 package.json。

## Implementation Contract

### packages/ui（@yaroo/ui）

**行為**: 提供一個包含 Tailwind v4 design token 與 11 個 React TypeScript 基礎元件的共用套件。

**介面**:
- 套件名稱: `@yaroo/ui`
- 匯出方式: barrel export（`import { Window, Avatar, XpButton, useDraggable } from '@yaroo/ui'`）
- CSS 入口: `@yaroo/ui/styles/theme.css`，包含 Tailwind `@theme` token 定義
- 型別: 每個元件匯出對應的 Props 型別（如 `WindowProps`, `AvatarProps`）
- 每個元件遵循上述 Props 表定義的 API

**驗收條件**:
- `pnpm --filter @yaroo/ui build` 成功產出 ESM 格式的 dist/
- 各元件可獨立 import 並正確渲染
- 視覺呈現與現有對應元素一致
- 元件使用 Tailwind utility classes，不包含獨立 CSS 檔案
- TypeScript strict mode 編譯通過

### apps/yaroo-demo-web

**行為**: 將現有單體應用全面重寫為 TypeScript + Tailwind，保持所有功能與視覺呈現完全一致。

**驗收條件**:
- `pnpm --filter @yaroo/demo-web dev` 能正常啟動開發伺服器
- 登入畫面、主聯絡人視窗、聊天視窗的外觀與互動行為與重寫前完全一致
- 視窗可拖曳、訊息可發送、叮咚（Buzz）功能正常、顏文字選擇器正常
- Mock 資料內容不變
- TypeScript strict mode 編譯通過

### apps/yaroo-web 與 apps/yaroo-backend

**行為**: 空殼 app，僅包含最基本的入口檔案與 package.json。

**驗收條件**:
- yaroo-web: `pnpm --filter @yaroo/web dev` 能啟動並顯示佔位頁面
- yaroo-backend: `node apps/yaroo-backend/src/index.ts` 或 `npx tsx apps/yaroo-backend/src/index.ts` 能執行不報錯

### monorepo workspace

**行為**: pnpm workspace 配置正確，各 app 可引用本地 packages。

**驗收條件**:
- `pnpm install` 在根目錄成功安裝所有依賴
- workspace: 協議的跨套件引用正確解析
- 根目錄 `pnpm dev` 可正常啟動 demo-web

## Risks / Trade-offs

**[風險] 全面重寫後視覺呈現出現差異** → Tailwind utility classes 需精確對應現有的漸層、陰影、間距等 pixel 級樣式。需逐一比對重寫前後的畫面，特別是 XP 風格的多步漸層（titlebar 三色漸層）和 inset shadow 效果。

**[風險] Tailwind v4 不支援部分 XP 風格樣式** → 多步漸層、精確的 inset shadow 組合等無法用標準 Tailwind utility 表達。解決方案：使用 `@theme` 外的 CSS Custom Properties 定義漸層值，元件中以 `style` prop 或 arbitrary value 引用。

**[風險] TypeScript 全面轉換增加工作量** → 搭配 Tailwind 全面重寫，每個檔案本就需要全新撰寫，TS 轉換的邊際成本較低。

**[取捨] 不使用 CSS Modules** → Tailwind utility classes 本身就是 atomic CSS，不會產生命名衝突。元件級的自訂樣式透過 Tailwind arbitrary value 或 inline style 處理。

## Open Questions

無。技術選型與架構方向已經由 grilling session 確認。
