## Summary

將 yaroo-messenger 單體專案重構為 pnpm workspace monorepo 架構，劃分為三個獨立 app（yaroo-backend、yaroo-web、yaroo-demo-web），建立共用 UI 套件（含 design token 與基礎元件），全面引入 TypeScript 與 Tailwind CSS v4。

## Motivation

目前專案是單一 Vite + React 應用，所有程式碼混在一起。隨著產品規劃朝向完整的即時通訊平台發展，需要：

1. **關注點分離**：前端展示（demo）、正式 Web 應用、後端服務需各自獨立演進
2. **共享設計系統**：目前的 CSS 變數、顏色、間距散落在各元件的 CSS 檔案中，需要抽取為統一的 design token，方便跨 app 共用
3. **基礎元件復用**：Window、WindowHeader、Avatar、StatusBadge 等基礎元件應可跨 app 複用
4. **型別安全**：引入 TypeScript 提升程式碼品質與開發體驗
5. **現代化樣式管理**：引入 Tailwind CSS v4 統一管理樣式，利用 `@theme` 整合 design token
6. **維護性**：monorepo 結構便於統一管理依賴版本、lint 規則、構建流程

## Proposed Solution

### Monorepo 結構（使用 pnpm workspace）

```
yaroo-messenger/
├── pnpm-workspace.yaml
├── package.json (root)
├── tsconfig.json (root)
├── apps/
│   ├── yaroo-demo-web/   ← 現有內容全面改寫為 TS + Tailwind
│   ├── yaroo-web/        ← 正式 Web 應用（空殼）
│   └── yaroo-backend/    ← 後端服務（空殼）
└── packages/
    └── ui/               ← 共用 UI 套件（token + 元件 + hook）
```

### 統一 UI 套件（@yaroo/ui）

合併 design token 與基礎元件為單一套件，包含：

1. **Design Token**：透過 Tailwind v4 `@theme` 定義在 CSS 入口檔中
   - Color、Typography、Spacing、Border、Shadow、Gradient 共 6 類
   - 各 app 只需 import `@yaroo/ui` 的 CSS 即可使用所有 token

2. **基礎元件**（全部使用 Tailwind utility classes + TypeScript）：
   - Window、WindowHeader、Avatar、StatusBadge
   - XpButton、TextInput、TextArea、Checkbox、Select
   - Toolbar、MenuBar

3. **Hook**：useDraggable

### 技術選型

| 層面 | 選擇 | 理由 |
|------|------|------|
| Monorepo 工具 | pnpm workspace | 原生支援、無額外構建工具、適合中小型專案 |
| 前端框架 | React 19 | 沿用既有，穩定成熟 |
| 打包工具 | Vite 8 | 沿用既有，各 app 獨立配置 |
| 語言 | TypeScript (.tsx/.ts) | 全面轉換，提升型別安全與開發體驗 |
| CSS 方案 | Tailwind CSS v4 | CSS-first 配置，`@theme` 整合 design token，utility-first 樣式管理 |
| Token 整合 | Tailwind v4 `@theme` inline | token 定義在 `@yaroo/ui` 的 CSS 入口檔，各 app import 即用 |
| UI 套件打包 | Vite Library Mode | 輸出 ESM + 型別宣告，供各 app 引用 |
| Lint | oxlint | 沿用既有 |
| 後端框架 | 待定 | yaroo-backend 先建立空殼，技術選型在後續 change 決定 |

## Non-Goals

- **不引入 Turborepo / Nx**：pnpm workspace 已足夠，避免過度工程化
- **不重新設計 UI**：保持現有視覺呈現完全一致，僅改變實作方式（CSS → Tailwind）
- **不實作後端邏輯**：yaroo-backend 僅建立空殼目錄結構
- **不實作正式 Web 應用邏輯**：yaroo-web 僅建立空殼
- **不引入 CSS-in-JS**：使用 Tailwind utility classes 管理樣式

## Alternatives Considered

1. **Turborepo**: 功能更完整但增加學習曲線與依賴，目前規模不需要
2. **Nx**: 過於重量級，適合大型企業專案
3. **Tailwind v3**: 需要 tailwind.config.js，v4 的 CSS-first 配置更直覺
4. **分開 tokens 與 ui 為兩個套件**: 增加管理複雜度，token 與元件緊密耦合，合併更簡潔

## Impact

- Affected specs: 無既有 spec
- Affected code:
  - New: `pnpm-workspace.yaml`, `tsconfig.json`, `apps/yaroo-demo-web/`, `apps/yaroo-web/`, `apps/yaroo-backend/`, `packages/ui/`
  - Modified: `package.json` (改為 root workspace 配置)
  - Removed: 搬遷後，根目錄的 `src/`、`index.html`、`vite.config.js` 將移除

## Capabilities

### New Capabilities

- `shared-ui`: 統一的共用 UI 套件，包含 Tailwind v4 `@theme` design token（色彩、字型、間距、陰影、漸層）與 11 個 TypeScript 基礎元件（Window、Avatar、Button 等）及 useDraggable hook
- `monorepo-workspace`: pnpm workspace 架構配置，管理多 app 與共用套件

### Modified Capabilities

（無既有 capability）
