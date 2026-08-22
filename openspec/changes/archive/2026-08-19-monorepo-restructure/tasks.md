## 1. Monorepo 基礎架構

- [x] 1.1 建立 pnpm workspace 配置（對應設計決策「使用 pnpm workspace 作為 monorepo 管理方案」）：建立 `pnpm-workspace.yaml` 宣告 `apps/*` 與 `packages/*` 為 workspace 成員；依照設計文件「目錄結構配置」建立整體目錄架構；修改根目錄 `package.json` 為 workspace root 配置（移除現有 dependencies/devDependencies，加入 workspace scripts）。滿足「pnpm workspace configuration」需求與「monorepo workspace」合約。驗證：`pnpm install` 在根目錄成功執行不報錯。
- [x] 1.2 建立根目錄 package.json workspace scripts：`dev` 啟動 demo-web 開發伺服器、`build` 建構所有套件與 app、`lint` 執行全域 lint。滿足「Root package.json provides workspace scripts」需求。驗證：`pnpm dev` 能正確觸發 `@yaroo/demo-web` 的 dev 指令。
- [x] 1.3 對應設計決策「全面引入 TypeScript」，建立根目錄 `tsconfig.json` 共用配置（strict mode 啟用、JSX react-jsx、ES2022 target）。滿足「Shared TypeScript configuration」需求。驗證：TypeScript strict mode 規則生效。

## 2. 共用 UI 套件（對應設計合約「packages/ui（@yaroo/ui）」）

- [x] 2.1 建立 `packages/ui/package.json`（name: `@yaroo/ui`，peer dependency: react, devDependencies 含 tailwindcss v4）、`packages/ui/tsconfig.json`（繼承根目錄 tsconfig）、`packages/ui/vite.config.ts`（Vite Library Mode 輸出 ESM + 型別宣告）。對應設計決策「Token 與 UI 元件合併為單一套件」與「基礎元件清單與 API 設計」中定義的目錄結構。驗證：`pnpm --filter @yaroo/ui build` 成功產出 dist/ 目錄。
- [x] 2.2 對應設計決策「採用 Tailwind CSS v4 全面管理樣式」與「Tailwind v4 @theme token 架構」，建立 `packages/ui/src/styles/theme.css`，定義所有 Tailwind v4 `@theme` token（色彩、字型、間距、圓角、陰影）與 `:root` 漸層 CSS Custom Properties。滿足「UI package provides Tailwind v4 design tokens via @theme」、「Color tokens match existing brand values」、「Typography tokens define font stacks and sizes」、「Spacing, border-radius, and shadow tokens」、「Gradient handling via CSS Custom Properties」需求。驗證：Tailwind 能產生 `bg-yr-purple`、`text-yr-md`、`p-yr-2`、`rounded-yr-md`、`shadow-yr-window` 等 utility classes，所有 token 值與 spec Example 表格一致。
- [x] 2.3 實作 Window TypeScript 元件（`packages/ui/src/components/Window/`），使用 Tailwind utility classes 渲染經典視窗容器，匯出 `WindowProps` 型別，接受 children/style/className/onMouseDown props。滿足「Window component provides draggable container」需求。驗證：元件使用 Tailwind classes（如 `shadow-yr-window rounded-t-yr-xl border border-yr-purple-dark`），TypeScript 編譯通過。
- [x] 2.4 實作 WindowHeader TypeScript 元件（`packages/ui/src/components/WindowHeader/`），使用 Tailwind classes + gradient CSS variable 渲染紫色漸層標題列，匯出 `WindowHeaderProps` 型別。滿足「WindowHeader component provides titlebar with controls」需求。驗證：點擊關閉按鈕觸發 onClose 回呼；標題列使用 `var(--yr-gradient-titlebar)` 漸層。
- [x] 2.5 實作 Avatar TypeScript 元件（`packages/ui/src/components/Avatar/`），三種尺寸 sm/md/lg 對應 26/52/90px，匯出 `AvatarProps` 型別。滿足「Avatar component renders user images with TypeScript size types」需求。驗證：各尺寸渲染正確 pixel 值，TypeScript size 型別為 'sm'|'md'|'lg'。
- [x] 2.6 實作 StatusBadge TypeScript 元件（`packages/ui/src/components/StatusBadge/`），使用 `bg-yr-status-*` Tailwind classes 對應各狀態顏色。滿足「StatusBadge component shows presence status」需求。驗證：available 狀態使用 `bg-yr-status-available`（#4CAF50）。
- [x] 2.7 實作 XpButton TypeScript 元件（`packages/ui/src/components/XpButton/`），提供三種 variant（default/primary/close），使用 Tailwind classes + gradient CSS variables。滿足「XpButton component provides classic styled buttons」需求。驗證：default variant 具有白灰漸層，close variant 具有紅色漸層與白色文字。
- [x] 2.8 實作 TextInput TypeScript 元件（`packages/ui/src/components/TextInput/`），使用 Tailwind classes（含 `focus:border-yr-purple`）。滿足「TextInput component provides styled text input」需求。驗證：focus 時邊框變為品牌紫色。
- [x] 2.9 實作 TextArea TypeScript 元件（`packages/ui/src/components/TextArea/`），使用 `resize-none` Tailwind class。滿足「TextArea component provides styled multiline input」需求。驗證：渲染後無 resize handle。
- [x] 2.10 實作 Checkbox TypeScript 元件（`packages/ui/src/components/Checkbox/`），使用 accent-yr-purple 樣式。滿足「Checkbox component provides labeled checkbox」需求。驗證：核取方塊顯示紫色 accent。
- [x] 2.11 實作 Select TypeScript 元件（`packages/ui/src/components/Select/`），匯出 typed options 型別。滿足「Select component provides styled dropdown」需求。驗證：選項正確渲染並可切換選取。
- [x] 2.12 實作 Toolbar TypeScript 元件（`packages/ui/src/components/Toolbar/`），使用 gradient CSS variable + Tailwind classes。滿足「Toolbar component provides action bar container」需求。驗證：渲染後具有 XP 風格漸層背景與底部邊框。
- [x] 2.13 實作 MenuBar TypeScript 元件（`packages/ui/src/components/MenuBar/`），hover 使用 `hover:bg-yr-highlight hover:text-white` Tailwind classes。滿足「MenuBar component provides menu strip」需求。驗證：hover 選單項目時背景變為 #316AC5 且文字變白。
- [x] 2.14 搬遷 useDraggable hook 至 `packages/ui/src/hooks/useDraggable.ts`，加入完整 TypeScript 型別定義。滿足「useDraggable hook with TypeScript types」需求。驗證：hook 回傳值具有正確型別（position: {x: number, y: number}, handleMouseDown: React.MouseEventHandler）。
- [x] 2.15 建立 barrel export（`packages/ui/src/index.ts`），匯出所有元件、Props 型別與 hook。驗證：`import { Window, WindowProps, Avatar, useDraggable } from '@yaroo/ui'` 可正確解析且型別正確。

## 3. yaroo-demo-web 重寫

- [x] 3.1 依照設計文件「yaroo-demo-web 重寫策略」建立 `apps/yaroo-demo-web/` 目錄結構：package.json（name: `@yaroo/demo-web`，dependencies 含 `@yaroo/ui: workspace:*`、tailwindcss v4）、tsconfig.json、vite.config.ts、index.html。將現有 `public/` 完整複製至 `apps/yaroo-demo-web/public/`。滿足「yaroo-demo-web preserves existing functionality with TS and Tailwind」需求的基礎設定。驗證：目錄結構完整，package.json 依賴正確。
- [x] 3.2 建立 `apps/yaroo-demo-web/src/app.css` Tailwind 入口檔案（含 `@import '@yaroo/ui/styles/theme.css'`、Tailwind 指令、全域樣式如 body 背景漸層與 scrollbar），並以 TypeScript 重寫 main.tsx。滿足「Cross-package references use workspace protocol」需求。驗證：`pnpm --filter @yaroo/demo-web dev` 啟動不報錯，Tailwind utility classes 可用。
- [x] 3.3 以 TypeScript 重寫 mockData.ts，加入完整型別定義（User, Contact, ContactGroup, ChatMessage 等介面）。驗證：TypeScript 編譯通過，型別可被元件引用。
- [x] 3.4 以 TypeScript + Tailwind 全面重寫 App.tsx，使用 `@yaroo/ui` 元件與 hook，所有樣式改用 Tailwind utility classes。驗證：App 正確管理視窗 z-index、active chats 狀態。
- [x] 3.5 以 TypeScript + Tailwind 全面重寫 LoginScreen 元件，改用 `@yaroo/ui` 的 Window、WindowHeader、TextInput、Checkbox、XpButton 元件，所有樣式使用 Tailwind utility classes。驗證：登入畫面視覺呈現與重寫前一致——Logo 區域、表單、核取方塊、登入按鈕、忘記密碼/申請帳號連結全部正確顯示。
- [x] 3.6 以 TypeScript + Tailwind 全面重寫 MainMessenger 元件，改用 `@yaroo/ui` 的 Window、WindowHeader、Avatar、StatusBadge、Toolbar、MenuBar、Select 元件，所有樣式使用 Tailwind utility classes。驗證：主視窗視覺呈現與重寫前一致——個人檔案區、工具列、聯絡人群組摺疊/展開、狀態編輯、底部狀態列全部正確顯示與互動。
- [x] 3.7 以 TypeScript + Tailwind 全面重寫 ChatWindow 元件，改用 `@yaroo/ui` 的 Window、WindowHeader、Avatar、Toolbar、XpButton、TextArea 元件，保留聊天記錄、訊息發送、叮咚震動、顏文字選擇器等業務邏輯，所有樣式使用 Tailwind utility classes。驗證：聊天視窗視覺與互動與重寫前一致——訊息顯示、發送、Buzz 震動動畫與音效、顏文字插入全部正常運作。
- [x] 3.8 最終驗證 yaroo-demo-web 完整操作流程與視覺一致性。滿足「yaroo-demo-web preserves existing functionality with TS and Tailwind」完整需求。驗證：`pnpm --filter @yaroo/demo-web dev` 啟動後，瀏覽器中的完整操作流程（登入 → 瀏覽聯絡人 → 開啟聊天 → 發送訊息 → 使用叮咚）與重寫前完全一致，TypeScript strict mode 編譯通過。

## 4. 空殼 App 建立

- [x] 4.1 對應設計合約「apps/yaroo-web 與 apps/yaroo-backend」，建立 `apps/yaroo-web/` TypeScript 空殼 app：package.json（name: `@yaroo/web`）、tsconfig.json、vite.config.ts、index.html、src/main.tsx（渲染佔位文字）。滿足「yaroo-web provides TypeScript placeholder app」需求。驗證：`pnpm --filter @yaroo/web dev` 啟動後顯示佔位頁面。
- [x] 4.2 對應設計合約「apps/yaroo-web 與 apps/yaroo-backend」，建立 `apps/yaroo-backend/` TypeScript 空殼服務：package.json（name: `@yaroo/backend`）、tsconfig.json、src/index.ts（console.log 訊息後正常退出）。滿足「yaroo-backend provides TypeScript placeholder service」需求。驗證：`npx tsx apps/yaroo-backend/src/index.ts` 執行不報錯。

## 5. 清理與驗證

- [x] 5.1 清除根目錄已搬遷的檔案（src/、index.html、vite.config.js），更新根目錄 .gitignore 加入各 app/package 的 node_modules 與 dist。驗證：根目錄不再包含已搬遷的原始碼檔案，`pnpm install && pnpm --filter @yaroo/demo-web dev` 從乾淨狀態成功啟動。
