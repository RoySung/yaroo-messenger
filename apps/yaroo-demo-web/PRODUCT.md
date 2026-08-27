# Product

## Register

product

## Users

Yaroo! Messenger 的 demo app 面向想在手機直向環境中完整操作聊天流程，或快速展示與試玩復古即時通介面的使用者。主要工作是瀏覽聯絡人、進入一對一聊天、閱讀與輸入訊息、使用 Buzz，並在不需要後端服務的情況下體驗產品互動。

## Product Purpose

這個 Vite demo 以 mock data 呈現 Yaroo! Messenger 的介面與互動設計。它既是可操作的靜態產品展示，也是驗證共享視覺語言與互動方向的實驗場；它不提供真實帳號、Socket.IO 連線、持久化或即時通訊。

## Brand Personality

懷舊、俏皮、直接。介面應讓人立即聯想到 2000 年代 XP 桌面即時通訊軟體，同時讓現代觸控裝置上的操作保持清楚、可靠且有回饋。

## Anti-references

不得將手機版設計成 LINE、WhatsApp 或其他一般現代聊天 App 的外觀，也不得用大型圓角卡片、極簡無邊框介面或現代原生導覽取代 Yaroo! 的紫黃品牌、XP 視窗框架與桌面軟體語彙。手機版也不是把固定尺寸桌面視窗等比例縮小後塞進 viewport。

## Design Principles

1. 全螢幕轉譯視窗，而不是縮小桌面：手機畫面仍像一扇 Yaroo! XP 視窗，但固定貼齊可用 viewport，並以堆疊式導覽連接聯絡人與聊天。
2. 核心功能跨裝置一致：手機版保留登入、聯絡人、聊天、訊息輸入、Buzz 與必要狀態資訊，只重排次要內容。
3. 外觀懷舊、操作現代：保留緊湊的視窗 chrome 與品牌語彙，同時提供符合觸控需求的尺寸、焦點與回饋。
4. Demo 與 live app 邊界清楚：這個 surface 繼續由 mock data 驅動，不暗示即時連線、帳號或持久化能力。
5. 行動版優先服務手機直向：本階段不延伸至手機橫向或平板專屬版面。

## Accessibility & Inclusion

主要訊息與輸入內容使用至少 16px 的可讀字級；主要互動目標至少 44×44px，且不依賴 hover 才能操作。鍵盤焦點應清楚可見。Buzz 等動態回饋需尊重 `prefers-reduced-motion`，以非位移或靜態提示替代劇烈搖晃。文字與背景對比至少符合 WCAG 2.2 AA，狀態不得只靠顏色表達。
