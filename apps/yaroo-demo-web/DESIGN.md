---
name: Yaroo! Messenger Demo
description: A pocket-sized XP messenger that keeps its desktop soul on touch screens.
colors:
  yaroo-purple: "#6B0086"
  yaroo-purple-dark: "#4A005E"
  yaroo-purple-light: "#9B62B2"
  yaroo-purple-bg: "#EAE2EF"
  yaroo-yellow: "#FFD400"
  yaroo-yellow-light: "#FFF8D0"
  window-bg: "#ECE9D8"
  panel-bg: "#F4F3ED"
  white: "#FFFFFF"
  border: "#9D9DA1"
  border-light: "#D4D0C8"
  highlight: "#316AC5"
  hover-bg: "#FFEBB5"
  text-dark: "#222222"
  text-light: "#666666"
  text-link: "#0044BB"
  status-available: "#4CAF50"
  status-busy: "#F44336"
  status-away: "#FFC107"
  status-offline: "#BDBDBD"
typography:
  display:
    fontFamily: "Segoe UI, Tahoma, PMingLiU, 新細明體, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.25
  headline:
    fontFamily: "Segoe UI, Tahoma, PMingLiU, 新細明體, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.3
  title:
    fontFamily: "Segoe UI, Tahoma, PMingLiU, 新細明體, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Segoe UI, Tahoma, PMingLiU, 新細明體, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "Segoe UI, Tahoma, PMingLiU, 新細明體, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.3
rounded:
  sm: "2px"
  md: "3px"
  lg: "4px"
  xl: "6px"
spacing:
  xs: "2px"
  sm: "4px"
  sm-plus: "6px"
  md: "8px"
  md-plus: "10px"
  lg: "12px"
  xl: "16px"
  xxl: "20px"
  xxxl: "24px"
components:
  button-default:
    backgroundColor: "{colors.white}"
    textColor: "{colors.text-dark}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "3px 16px"
  button-primary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.text-dark}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "3px 16px"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.text-dark}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "2px 4px"
  titlebar:
    backgroundColor: "{colors.yaroo-purple-dark}"
    textColor: "{colors.white}"
    typography: "{typography.title}"
    rounded: "{rounded.xl}"
    padding: "4px 8px"
---

# Design System: Yaroo! Messenger Demo

## Overview

**Creative North Star: "掌心即時通"**

Yaroo! 把 2000 年代桌面即時通的觸感放進掌心，而不是把桌面截圖縮小。紫色漸層標題列、暖灰視窗背景、方正控制項、細邊框與結構性陰影共同建立 XP 視窗感；在手機直向環境中，整個 viewport 就是一扇視窗，聯絡人與聊天透過堆疊式導覽切換。

這套系統保持懷舊、俏皮、直接，但不犧牲現代觸控品質。桌面 chrome 可以緊湊，手機上的訊息與輸入內容必須至少 16px，主要互動目標必須至少 44×44px。它明確拒絕 LINE、WhatsApp 式的一般現代聊天 App，也拒絕大型圓角卡片、無邊框極簡與把固定桌面視窗等比例縮小。

**Key Characteristics:**

- 紫色 XP 標題列是最強識別，黃色只標示品牌與主要動作。
- 暖灰視窗、白色內容面板、細邊框形成清楚的桌面軟體層級。
- 小圓角、內凹控制項與短距離陰影提供真實的按壓感。
- 手機直向以單一全螢幕視窗與堆疊導覽取代拖曳、重疊多視窗。
- 動態只傳達狀態；Buzz 尊重 reduced motion，不以劇烈搖晃作為唯一回饋。

## Colors

這是完整而克制的 Yaroo! 紫黃品牌色盤：紫色建立視窗識別，黃色只保留給品牌與關鍵動作，暖灰與白色承載長時間閱讀。

### Primary

- **Messenger Purple**：標題列、焦點邊框與品牌辨識的主要色。
- **Deep Titlebar Purple**：視窗外框、標題列深端與高對比文字背景。
- **Soft Purple Panel**：選取、提示與低強度品牌背景。

### Secondary

- **Yaroo Signal Yellow**：Logo 與主要動作提示；不鋪滿大面積內容。
- **Soft Signal Yellow**：主要按鈕與輕量提示的暖色背景。
- **XP Selection Blue**：選單目前項目與傳統桌面選取狀態。

### Tertiary

- **Presence Green / Busy Red / Away Amber / Offline Gray**：在線狀態語彙；每個顏色都必須搭配文字或圖形資訊。

### Neutral

- **Window Warm Gray**：視窗主背景與表單周邊。
- **Panel Ivory Gray**：選單列、工具列與次要面板。
- **Content White**：訊息紀錄、輸入欄與需要最高可讀性的內容。
- **Structural Gray / Light Divider**：視窗邊框、面板分隔與內凹控制項。
- **Ink Black / Secondary Gray / Link Blue**：主要文字、次要文字與可操作連結。

### Named Rules

**The Purple Titlebar Rule.** 紫色必須集中在視窗標題、焦點與品牌辨識；不得將所有容器都塗成紫色。

**The Yellow Signal Rule.** 黃色只表示 Logo、主要動作或短暫提示；同一畫面不得有多個互相競爭的黃色區塊。

## Typography

**Display Font:** Segoe UI（Tahoma、PMingLiU、新細明體與 Arial fallback）  
**Body Font:** Segoe UI（Tahoma、PMingLiU、新細明體與 Arial fallback）  
**Label Font:** Segoe UI（Tahoma、PMingLiU、新細明體與 Arial fallback）

**Character:** 單一系統 sans 字體讓介面像可信賴的桌面工具，而不是經過品牌化包裝的現代聊天產品。層級由字重、色彩和面板結構建立，不使用展示字體。

### Hierarchy

- **Display**（700，16px，1.25）：Logo 周邊短標題與手機主要頁面名稱。
- **Headline**（700，14px，1.3）：區段標題、聯絡人群組與重要狀態。
- **Title**（700，13px，1.3）：XP 標題列與主要控制標籤。
- **Body**（400，12px，1.4）：桌面 chrome 與密集輔助資訊；手機訊息與輸入內容覆寫為至少 16px。
- **Label**（400，11px，1.3）：選單、工具列與時間戳；不得承擔手機主要閱讀內容。

### Named Rules

**The Chrome–Content Split.** 視窗 chrome 可維持 11–14px 的桌面密度；手機主要內容一律至少 16px，禁止為了懷舊而犧牲可讀性。

## Elevation

Yaroo! 使用結構性而非裝飾性陰影。外層視窗陰影把 XP 視窗從藍色桌面背景抬起；按鈕與輸入欄使用短距離內陰影表示凸起或內凹。手機全螢幕模式移除外層漂浮陰影，保留控制項內部層次。

### Shadow Vocabulary

- **Desktop Window**（`0 8px 24px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.2)`）：僅用於桌面可拖曳視窗。
- **Raised Control**（`inset 0 1px 0 #fff, 0 1px 2px rgba(0,0,0,0.15)`）：按鈕預設狀態。
- **Recessed Field**（`inset 1px 1px 3px rgba(0,0,0,0.12)`）：訊息紀錄與輸入欄。
- **Pressed Control**（`inset 1px 1px 2px rgba(0,0,0,0.15)`）：按下狀態。

### Named Rules

**The Structural Shadow Rule.** 陰影只能說明視窗、凸起按鈕或內凹欄位的結構；禁止用大範圍柔光把容器裝飾成現代卡片。

## Components

### Buttons

- **Shape:** 近方形小圓角（3px），搭配 1px 灰色邊框與 XP 垂直漸層。
- **Primary:** 使用 2px 深藍外框加白灰漸層，不用實心現代品牌按鈕。
- **Hover / Focus:** hover 提亮，active 切換內凹陰影，focus 顯示清楚的 1px 深色 focus ring。
- **Mobile:** 主要動作外觀不變，但可點區域至少 44×44px；文字不得小於 14px。

### Cards / Containers

- **Corner Style:** 外層視窗上緣 6px、下緣 4px；內部面板 2–4px。
- **Background:** 暖灰視窗包住白色內容面板，次要 chrome 使用象牙灰。
- **Shadow Strategy:** 桌面視窗使用外陰影；手機全螢幕視窗取消外陰影。
- **Border:** 1px 深紫視窗外框或結構灰面板邊框。
- **Internal Padding:** 4、6、8、12、16px，依資訊層級遞增。

### Inputs / Fields

- **Style:** 白底、1px 藍灰邊框、小圓角與內凹陰影。
- **Focus:** 邊框切換為 Messenger Purple，保留瀏覽器可辨識 focus 狀態。
- **Error / Disabled:** error 必須有文字訊息；disabled 使用降低對比並保留可辨識標籤，不能只靠顏色。
- **Mobile:** 訊息輸入文字至少 16px，避免 iOS 聚焦縮放；輸入區位於虛擬鍵盤上方並尊重 safe area。

### Navigation

- **Desktop:** 多個可拖曳視窗以 z-index 和標題列焦點管理。
- **Mobile:** 登入、聯絡人、聊天各自佔滿可用 viewport；點聯絡人推入聊天視窗，標題列提供明確返回動作。不得保留拖曳或縮放互動。
- **Menus:** 保留 XP 選單標籤；手機觸控時開啟的選項必須落在 viewport 內，並提供至少 44px 高的選項列。

### Window Header

紫色三段漸層、白色粗體標題、16px Logo 與 XP 視窗控制是簽名元件。手機版用返回動作取代無效的最小化／最大化按鈕；關閉聊天仍以明確的返回或關閉語義呈現，不放置無作用控制。

### Presence Badge

10、14、20px 圓形狀態標記搭配白邊與短陰影。手機聯絡人列必須同時顯示狀態文字或可理解的上下文，不得只讓顏色承擔語義。

## Do's and Don'ts

### Do:

- **Do** 讓手機 viewport 成為一扇完整 XP 視窗，並以堆疊導覽連接聯絡人與聊天。
- **Do** 保留 Messenger Purple、Deep Titlebar Purple、Yaroo Signal Yellow 與暖灰視窗背景的既有角色。
- **Do** 讓手機主要內容至少 16px、主要觸控目標至少 44×44px，並處理 safe-area inset。
- **Do** 讓 Buzz 同時提供視覺、文字或聲音回饋；在 reduced motion 下取消劇烈位移。
- **Do** 讓 demo 繼續由 mock data 驅動，所有互動都能在沒有 backend 的情況下展示。

### Don't:

- **Don't** 將手機版設計成 LINE、WhatsApp 或其他一般現代聊天 App 的外觀。
- **Don't** 使用大型圓角卡片、極簡無邊框介面或現代原生導覽取代 Yaroo! 的紫黃品牌、XP 視窗框架與桌面軟體語彙。
- **Don't** 把固定尺寸桌面視窗等比例縮小後塞進 viewport，或在手機保留拖曳、重疊與任意定位。
- **Don't** 隱藏登入、聯絡人、聊天、訊息輸入或 Buzz 等核心功能來換取版面空間。
- **Don't** 依賴 hover、顏色或劇烈搖晃作為唯一的操作與狀態提示。
