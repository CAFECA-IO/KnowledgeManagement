文章標題：App Router vs Pages Router in Next.js

# 前言

此篇文章的目的在於，了解 App Router 和 Pages Router 之間的差異，以便於判斷之後的專案是否要改用 App Router。（目前的專案都是使用 Pages Router）

首先會先簡單介紹 Next.js，再來是針對 App Router 與 Page Router 的差異進行比較，並介紹 App Router 的幾個重要功能，最後會做一個實作。

此篇文章的內容大部分都會由官方文件及網路上部落格文章擷取而成，所有資料來源會整理於本文的最後一個章節「參考資料」裡面。

## 初步認識 Next.js

### 1. React vs Next.js：函式庫與框架

React 是用來建構使用者介面的 JavaScript 函式庫 (Library)。

而 Next.js 則是建立 React 之上的框架，除了客戶端渲染 (Client-side Rendering)，還支援兩種形式的預渲染：靜態網站生成 (Static Site Generation) 和伺服器端渲染 (Server-side Rendering)。

可參考官網的標語介紹：

- [React](https://react.dev/)：用於打造使用者介面的函式庫（The **library** for web and native user interfaces）
  - 此外官方也提到：「建議使用者使用全端 React 框架，如 Next.js 或  [Remix](https://remix.run/)，以處理專案中的路由與資料處理等需求」
- [Next.js](https://nextjs.org/)：用於網頁開發的 React 框架（The React **Framework** for the Web）

#### 補充——React 是不是框架？

為什麼常常聽到有人說 React 是一個 Javascript library 不是一個框架？究竟 library 和 Framework 兩者差在哪裡呢？

開發一個 app 包含了許多面向，像是 UI、routing、data fetching、rendering、部署等等，而一個「框架」應該要能全面地 cover 這些需求。

假如習慣使用像是 create-react-app 這些 boilerplate 來建立 React 專案的人，可能會以為 React 本身一手包辦了所有事情。但其實打開 create-react-app 專案的 package.json 檔案，我們會發現它只幫我們先裝好了常用的套件，像是 React-DOM、Webpack 等等。**事實上 React 本身只負責 UI 的建造，其餘工作必須交給其他第三方套件執行**，像是 React-DOM 負責真實操控 DOM、React-Router 負責路由切換等等，因此會說 React 只是一個 library。

Library 好處是讓專案的自由度高，開發者可依需求自由挑選工具，像是可使用不同 React Renderer (ex: React Native) 將 UI 渲染到不同裝置上，且通常與第三方套件的相容性也會比較高；但自由度高也意味著需要額外花時間精力來選擇、設定各式工具。

相較於 library，框架則提供較為完整的 solutions，而  **Next.js 除了整合 React.js 負責 UI 建造外，也提供了 routing、rendering、data fetching、integrations 等任務的解決方案。**

但 React 到底是個 library 還是框架，其實一直存在不同的觀點。像今年 React core team 的成員之一 Sebastian 在接受 Vercel 的[訪談](https://www.youtube.com/watch?v=g5BGoLyGjY0&t=1076s)時，提到 React 也是用 framework 這個詞，他也說他沒很在意到底該說 library 還是 framework，所以這部分或許挺見仁見智。

### 2. 為什麼選擇 Next.js

Angular、React、Vue，也就是俗稱的前端三大「框架」，常用於快速開發單頁式應用程式（Single Page Application，SPA），可達到前後端分離，以及提升使用者體驗等目的，例如 Gmail、Facebook 和 Netflix 等平台。

然而，由於 SPA 是利用客戶端渲染（CSR）技術，由 JavaScript 動態產生內容，若檢視原始碼會發現無法看到新增的內容，這將導致 SEO（搜尋引擎最佳化）較差的問題；也因為初次載入頁面需下載大量的 JavaScript 檔案，使第一次渲染較為費時，反而降低使用者體驗。

那該怎麼辦呢？

只要第一個畫面改由伺服器端渲染（SSR），即可解決 SEO 問題，其他畫面仍維持使用者端渲染（CSR），減少伺服器運算負荷，如此不就能夠兩者兼得了嗎？

React 可透過「搭建後端 Server + 處理 Hydration + Webpack 打包配置」等設定來實現 SSR，但相對來說門檻較高，需耗費較多成本學習。

於是前端 SSR 框架就誕生了，如 React 的  [Next.js](https://nextjs.org/)  和  [Gatsby.js](https://www.gatsbyjs.com/)，以及 Vue 的  [Nuxt.js](https://nuxt.com/)。

### 3. Next.js 特色

由  [Vercel](https://github.com/vercel/next.js)  團隊建立的 Next.js，解決了上述幾點網頁開發遇到的問題，以下是官網提及有關 Next.js v14（發布於 2023 年 12 月）的幾項特點：

- Data Fetching：可控制資料載入的時機點
- CSS Support：內建支援 CSS、Sass 檔案，並支援 CSS 模組化
- Route Handlers：基於檔案架構的路由系統，如  `page/home.tsx`
- API Routes：支援 API 路由，易於建立與管理 API 端點
- Pre-rendering：支援兩種形式的預渲染，分別是靜態網站生成 (SSG) 和伺服器渲染 (SSR)
- Built-in Optimizations：針對圖片、字體、JavaScript 載入進行自動優化，包括延遲載入與緩存處理

綜合上述優點，Next.js 有助於優化網頁效能與 SEO，適合用於建立著陸頁面（Landing Page）或是產品展示頁面，但較不適合應用在經常變動的網站，避免伺服器負荷過大。

而 Next.js 實際使用案例可參考  [Showcase](https://nextjs.org/showcase)  頁面，如 Notion、Tik Tok 以及 Twitch 等網站。

## 初步認識 Next.js 路由架構——App Router 與 Pages Router

Next.js 使用基於檔案系統的路由（file-system based router），意思是路由會根據專案的檔案結構自動被定義，不需額外去做設定。

究竟什麼是 App Router 跟 Pages Router 呢？簡單來說，它們是  **Next 開發的兩套路由架構**。

根據版本不同，Next.js 提供兩種管理頁面路由的方式，分別是舊版本適用的 Pages Router 以及 v13 後推出的 App Router，兩者最明顯的差異在於：

Pages Router :

1. 定義頁面層級的路由
2. 所有元件為 React Client Component（客戶端元件）

App Router :

1. 定義應用程式層級的路由
2. 所有元件預設為 React Server Component（伺服器端元件）

定義路由分為頁面層級和應用程式層級，簡單來說 Pages Router 是在 `/pages` 目錄中定義的，此目錄中的每個檔案自動成為一個路由；App Router 的路由則是透過 `/app` 目錄中的資料夾結構定義的。

另外，在 App Router 中所有元件預設為 React Server Component（RSC），意思是由伺服器將 React Component 準備好，再傳給 Client 顯示在畫面上。

而 RSC 的優缺點如下：

優點:

1. 整合後端操作，如存取資料庫（DB）、讀取檔案（File System）
2. 降低資料間的依賴關係，改善請求瀑布流（Waterfall）導致的效能問題
3. 降低 JS Bundle Size 以提升頁面效能

缺點:

1. 無法使用 React Hooks
2. 無法使用瀏覽器 API
3. 無法操作 DOM 事件監聽

面對上述缺點，Next.js 可依照使用情境不同，將元件定義為 Server Component 或 Client Component。舉例來說，當某個元件需要使用 Hooks 管理時，可透過在程式碼開頭加上 `'use client'` 來標示元件類型，該元件底下的子元件也會自動視為 Client Component。

但也因為如此，相較於 Page Router，新版的 App Router 學習曲線會較高，需瞭解 Server 如何運作，以及判斷哪些元件適合放在 Server 或 Client 端，在使用時須特別注意。

另外，**App Router 與 Page Router 是可以並存的**，但也是有一些基本的限制，像是兩個目錄不能同時定義一個 router，否則會報錯。官網有提供如何從 Page Router migrate App Router 的[教學文章](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)，可以參考如何轉換。

以下章節將會針對 App Router 與 Page Router 的差異進行比較，並介紹 App Router 的幾個重要功能。但在介紹之前，先趁現在介紹一些可能會在文件中看到的術語，以及路由的基本概念。

### 相關術語和路由基本概念

1. 路由 (Route)：每個應用程式的骨架就是路由，路由指的是網址的路徑，例如 `/about`、`/blog` 等

2. 元件樹：
   ![image](https://github.com/user-attachments/assets/f5c20deb-0589-47f5-a73c-32e3b58e683c)

   - 樹狀結構 (Tree)：用於視覺化階層結構的慣例。例如，父元件和子元件組成的元件樹、資料夾結構等。
   - 子樹 (Subtree)：樹狀結構的一部分，從新的根節點 (第一個) 開始，到樹葉 (最後一個) 結束。
   - 根節點 (Root)：樹或子樹中的第一個節點，例如根布局。
   - 葉節點 (Leaf)：子樹中沒有子節點的節點，例如 URL 路徑中的最後一段。

3. URL：
   ![image](https://github.com/user-attachments/assets/8cfd70a7-d35c-4b82-b6a0-b719045fec57)

   - URL 段 (URL Segment)：由斜線分隔的 URL 路徑的一部分。
   - URL 路徑 (URL Path)：在域名之後出現的 URL 部分 (由段組成) 。

4. 資料夾和檔案的角色：
   Next.js 使用基於檔案系統 (file-system based) 的路由器，其中：

   - 資料夾 (Folders)：用於定義路由。一個路由是巢狀資料夾的一個單一路徑，它遵循檔案系統的層次結構，從 **根資料夾** 到包含 `page.js` 檔案的最終 **葉資料夾**。
   - 檔案 (Files)：用於為路由段建立 UI。

5. 路由段 (Route Segments)：
   路由中的每個資料夾代表一個路由段。每個路由段都對應到 URL 路徑中的一個段。
   ![image](https://github.com/user-attachments/assets/1243f3ed-6862-40fa-89aa-14bf33b1d74d)

   - 路由段 (Route Segment)：由檔案或資料夾名稱定義的路由部分。例如，`/app/blog/page.tsx` 中的 `blog` 是路由段。
   - 路由檔案 (Route File)：定義路由段的檔案。例如，`/app/blog/page.tsx` 是一個路由檔案。
   - 路由資料夾 (Route Folder)：包含路由檔案的資料夾。例如，`/app/blog` 是一個路由資料夾。
   - 路由根 (Route Root)：路由樹的根。例如，`/app` 是一個路由根。

6. 巢狀路由 (Nested Routes) ：
   要建立一個巢狀路由，就將資料夾巢狀在一起。例如，可以透過在 `app` 目錄中巢狀兩個新資料夾來添加新的 `/dashboard/settings` 路由。
   `/dashboard/settings` 路由由三個段組成：

   - `/` (根段)
   - `dashboard` (段)
   - `settings` (葉段)

7. 檔案慣例 (File Conventions)：
   Next.js 提供了一組特殊檔案名稱，是專門用來在巢狀路由中，建立具有特定行為的 UI：
   | [`layout`](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates#layouts) | 用於段及其子段的共享 UI |
   | [`page`](https://nextjs.org/docs/app/building-your-application/routing/pages) | 路由的唯一 UI，並使路由公開可訪問 |
   | [`loading`](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming) | 用於段及其子段的載入 UI |
   | [`not-found`](https://nextjs.org/docs/app/api-reference/file-conventions/not-found) | 用於段及其子段的未找到 UI |
   | [`error`](https://nextjs.org/docs/app/building-your-application/routing/error-handling) | 用於段及其子段的錯誤 UI |
   | [`global-error`](https://nextjs.org/docs/app/building-your-application/routing/error-handling) | 全域錯誤 UI |
   | [`route`](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) | 伺服器端 API 端點 |
   | [`template`](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates#templates) | 專門重新渲染的佈局 UI |
   | [`default`](https://nextjs.org/docs/app/api-reference/file-conventions/default) | 並行路由 的備用 UI |

   > 注意：這些特殊檔案的副檔名可以是 .js、.jsx 或 .tsx。

8. 元件層次結構 (Component Hierarchy)：
   在路由段的特殊檔案中定義的 React 元件會以特定的層次結構渲染：

   - `layout.js`
   - `template.js`
   - `error.js`（React 錯誤邊界）
   - `loading.js`（React 延遲邊界）
   - `not-found.js`（React 錯誤邊界）
   - `page.js` 或巢狀 `layout.js` <br>

   ![image](https://github.com/user-attachments/assets/5164bd1c-1b6b-433f-8a21-96350726ac08)
   在巢狀路由中，某段的元件會巢狀在其父段的元件內部。
   ![image](https://github.com/user-attachments/assets/4bfed3fc-6b4f-4a9b-91ec-4cd813dbcc4e)

# 專案建立——專案架構差異

## 建立 Next.js 專案

首先在終端輸入指令 `npx create-next-app` 建立 Next.js 專案。

接著會依序出現下列幾個提問，分別如下：

```
What is your project named? my-app
// 專案名稱，格式需為英文小寫

Would you like to use TypeScript? No / Yes
// 是否支援 TypeScript

Would you like to use ESLint? No / Yes
// 是否使用 ESLint（用來規範 Coding Style 的套件）

Would you like to use Tailwind CSS? No / Yes
// 是否使用 Tailwind CSS

Would you like to use `src/` directory? No / Yes
// 是否外加一層 src 資料夾 (會新增一個 src 資料夾，除了 public 資料夾外，所有檔案都會放在 src 資料夾底下)

Would you like to use App Router? (recommended) No / Yes
// 是否使用 App Router

Would you like to customize the default import alias (@/*)? No / Yes
// 是否自訂 alias 調整預設的 baseURL 匯入路徑

What import alias would you like configured? @/*
// alias 預設使用 @ 是否修改
```

在 `Would you like to use App Router? (recommended) No / Yes` 這個步驟選擇 Yes，即可選擇 App Router 路由系統；若選擇 No 則會選擇 Page Router 路由系統。

初始專案架構主要分成以下三大類：（選擇使用 App Router 的情況）

- `app` 資料夾：放置 components、pages 與 api 等檔案
  - layout.tsx：在多個頁面之間定義共用 UI，其狀態將會被保存，如：nav、header、footer 等元件
  - page.tsx：在資料夾底下需包含 page.tsx 檔案，才會被定義為一個 route segment，如：app/blog/page.tsx
  - globals.css：定義全域樣式
- `public` 資料夾：放置靜態檔案，如圖片等
  - 需要引入 /public/next.svg 檔案時，路徑可直接指向 /next.svg
- 各類設定檔：包含 next.config.js、tsconfig.json、package.json 等用於設定專案配置的檔案

注意：如果是選擇使用 App Router 來建立專案的話，就會預設出現一個 `app` 資料夾；而如果使用 Page Router 就會預設出現一個 `pages` 資料夾。

所以如果是選擇使用 Page Router 的話，也是會出現類似上述的資料夾結構。只是就不會有 `app` 資料夾，而是會出現 `pages` 資料夾。

在 `pages` 資料夾內會用來放置所有頁面元件（每個檔案會成為一個路由），同時我們會特別建立一個 `components` 資料夾專門用來放置非頁面元件。這個 `components` 資料夾是我們自己建立的，並不是 Next.js 預設的資料夾，我們通常會放在 `/src` 資料夾底下。

這裡提供我們團隊的資料夾結構慣例：

```
└── public
└── src
    ├── components
    ├── constants
    ├── contexts
    ├── interfaces
    ├── lib
    ├── locales
    ├── pages
    ├── styles
    └── ... other folders
└── config files
```

接下來會介紹兩個路由系統所提供的資料夾 `app` 與 `pages` 各別所對應的路由定義規則。

## Page Router 資料夾結構與對應路由

在 App Router 推出之前，都是遵循 Pages Router 的規則來定義路由：專案中會有一個 pages 資料夾，Next 會根據裡面的  `.js/.jsx/.ts/.tsx`  檔案檔名，或是資料夾中的  `index.tsx`  生成 route segment。

比方說，`/pages/about.tsx` 定義的 UI 就會顯示在 /about 中；`/pages/notes/index.tsx` 定義的 UI 就會顯示在 /notes 中；`/pages/blog/first-post.tsx` 定義的 UI 就會顯示在 /blog/first-post 中。

這樣的路由定義模式，會限制專案的檔案結構，因為頁面檔案需統一放在 pages 資料夾中，而與這個 route 相關的 `/components`、`/utils`、`/lib` 等必須放在 pages 資料夾外。

以部落格網站做範例：

```
└── pages
    ├── index.tsx
    ├── login.tsx
    ├── api
    │   └── user.tsx
    ├── posts
    │   └── [id].tsx
    └── blog
        ├── index.tsx
        └── setting.tsx
```

檔案與對應的頁面路由如下：

- `pages/index.tsx` → `/`
- `pages/blog/index.tsx` → `/blog`
- `pages/blog/setting.tsx` → `/blog/setting`
- `pages/posts/[id].tsx` → `/posts/[id]`
  - 檔名可作為動態路由的參數，透過 [useRoute](https://nextjs.org/docs/pages/api-reference/functions/use-router) 這個 Hook 取得 route 相關資訊
- 呼叫 API：`page/api/user.tsx`

## App Router 資料夾結構與對應路由

App Router 的 routing system 則改成，根目錄或 `/src` 中會有一個 `/app`，`/app` 底下資料夾中若有 `pages.js/.jsx/.ts/.tsx`，才會生成一個對應資料夾名稱的 route segment，而 `page.tsx` 則定義該 route segment 的 UI 。

舉例來說，`/app/about/pages.js` 會出現在 /about 中。而 `/about` 裡的其他檔案，除了幾個官方保留的特殊檔案，例如 `pages.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` 等 (後續會再介紹)，不會被影響到 URL；或是 `/app/analytics` 中沒有 `pages.tsx`，就不會有 /analytics 這個 route segment。

以部落格網站做範例：

```
└── app
    ├── blog
    │   └── [slug]
    │        └── page.tsx
    ├── login
    │   └── page.tsx
    ├── @analytics
    │   ├── page.tsx
    │   ├── error.tsx
    │   └── loading.tsx
    ├── api
    │   └── user
    │       ├── index.ts
    │       └── route.ts
    ├── components
    │   ├── loading.tsx
    │   └── button.tsx
    ├── globals.css
    ├── layout.tsx
    └── page.tsx
```

資料夾與對應的頁面路由如下：

- `app/page.tsx` → `/`
- `app/login/page.tsx` → `/login`
- `app/blog/[slug]/page.tsx` → `/blog/[slug]`
  - 目錄可作為動態路由的參數，並以 props 傳入元件
- 呼叫 API：`app/api/user/route.tsx`
- `@` 開頭的 folder 不會對路由造成影響：
  - `app/@analytics/page.tsx` 實際渲染的路由為 `/`，這個特殊的檔案夾是用來切分同一個路由底下的不同邏輯區塊。

以下來自[官方文件提供的示意圖](https://nextjs.org/docs/app/building-your-application/routing)，可以看得更清楚：

![image](https://github.com/user-attachments/assets/6918e8a7-398b-456d-ae27-288757d0d2ce)

除了特殊文件之外，還可以將其他的文件（例如元件、樣式、測試等）一起放置在 app 目錄中的資料夾內。只有 page.js 或 route.js 回傳的內容是公開可訪問的。

# Rendering——渲染的四種方式、路由系統對四種渲染的應用差異、App Router 渲染概念

## 了解 Next.js 中的渲染方法：CSR vs SSR vs SSG vs ISR

### 1. 客戶端渲染 (Client-side Rendering, CSR)

**概述：**
客戶端渲染 (CSR) 是指瀏覽器下載一個最小化的 HTML 頁面和必要的 JavaScript，然後在客戶端渲染頁面。頁面是在初始 HTML 載入後在瀏覽器中動態渲染的。

步驟大概像這樣：
Client（瀏覽器）第一次發送 Request 給 Server → Server 回傳只有容器不含內容的 HTML 檔 → 再由瀏覽器執行 JavaScript 動態產生資料 → 最後將資料渲染到畫面上。（因此第一次渲染較為費時，而只有容器沒有內容的原始碼也不利於 SEO）

**主要特徵：**

- **JavaScript 驅動：** 頁面渲染發生在瀏覽器中，這意味著內容是由 JavaScript 填充的。
- **初始載入延遲：** 頁面顯示可能會有一段時間的延遲，因為 JavaScript 必須先下載、解析和執行，才能顯示整個頁面。
- **SEO 考量：** CSR 可能對 SEO 產生負面影響，因為某些搜尋引擎可能不會執行 JavaScript，導致我們網頁內容被索引的效果不佳。
- **使用時機：** CSR 適用於不需要被搜尋引擎索引的頁面，或是在初始載入後需要高互動性和頻繁更新的頁面。

### 2. 伺服器端渲染 (Server-side Rendering, SSR)

**概述：**
伺服器端渲染 (SSR) 是指頁面的 HTML 是在每次請求時由伺服器生成的。伺服器會獲取所需的資料，渲染頁面，並將完整渲染的 HTML 發送給客戶端。

也就是當 Server（伺服器）在每次收到 Request 時，就會建立好完整的 HTML 內容並發送給 Client（瀏覽器）。

**主要特徵：**

- **動態渲染：** 頁面在每次請求時都會動態渲染，確保內容始終是最新的。
- **SEO 友好：** 由於 HTML 在到達客戶端之前已經完全渲染，因此很容易被搜尋引擎索引。
- **效能考量：** 與靜態方法相比，SSR 可能會較慢，因為伺服器需要在每次請求時渲染頁面。

### 3. 靜態網站生成 (Static Site Generation, SSG)

**概述：**
靜態網站生成 (SSG) 是指頁面的 HTML 在建置(build)時生成，並將相同的 HTML 提供給所有使用者。內容是靜態的，這意味著在下一次建置之前不會發生變化。

**主要特徵：**

- **建置期間渲染：** 頁面在建置期間預先渲染，使其在提供給使用者時速度極快。
- **SEO 友好：** 由於 HTML 是預先渲染的，因此很容易被搜尋引擎索引。
- **適用於靜態內容：** SSG 適合不經常變動的內容，例如部落格文章或行銷頁面。

### 4. 增量靜態再生 (Incremental Static Regeneration, ISR)

**概述：**
增量靜態再生 (ISR) 讓我們能在建置後更新靜態頁面，而不需要完整重建。頁面可以在新的請求進來時在背景中重新生成，確保它們保持最新狀態，同時不犧牲靜態生成的效能優勢。

**主要特徵：**

- **混合方法：** 結合了 SSG 的效能和 SSR 的靈活性。
- **自動更新：** 頁面會在指定的時間間隔後或有新資料時重新生成。
- **SEO 友好：** 由於頁面是靜態生成的，因此很容易被搜尋引擎索引。

## Page Router 處理 4 種渲染的方式

Next.js 提供了一個稱為 **Page Router** 的多功能路由系統，讓開發者可以實現多種渲染方法：**客戶端渲染 (CSR)**、**伺服器端渲染 (SSR)**、**靜態網站生成 (SSG)** 和 **增量靜態再生 (ISR)**。每種方法都有其特定的使用場景和優勢，Next.js 提供了實現這些方法的特定機制。

### 1. 客戶端渲染 (CSR)

- CSR 是透過使用在頁面載入後僅在客戶端進行資料抓取的 React 元件來實現的。
- 為了強制使用 CSR，請避免在頁面元件中使用 `getServerSideProps`、`getStaticProps` 或 `getInitialProps`。這樣頁面就可以靜態傳遞，然後任何動態資料抓取僅在客戶端進行。
- 執行函數：`useEffect()` 或使用由 Next.js 團隊開發的 [SWR](https://swr.vercel.app/) 開源套件

範例：

```jsx
// pages/csr-page.js
import { useEffect, useState } from "react";

function CSRPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return <div>{data ? JSON.stringify(data) : "Loading..."}</div>;
}

export default CSRPage;
```

### 2. 伺服器端渲染 (SSR)

- SSR 是透過 `getServerSideProps` 函數來實現的，該函數會在請求時抓取資料並將其作為屬性傳遞給頁面元件。
- 此函數在每次請求時都在伺服器端執行，確保資料總是最新的。
- 執行函數：`getServerSideProps()`，只會在 Server side 執行，可跳過呼叫 API 步驟直接到資料庫抓取資料。

範例：

```jsx
// pages/ssr-page.js
export async function getServerSideProps(context) {
  const res = await fetch("<https://api.example.com/data>");
  const data = await res.json();

  return {
    props: { data }, // 會作為屬性傳遞給頁面元件
  };
}

function SSRPage({ data }) {
  return <div>{JSON.stringify(data)}</div>;
}

export default SSRPage;
```

### 3. 靜態網站生成 (SSG)

- SSG 是透過 `getStaticProps` 函數實現的，該函數會在建置期間抓取資料並將其作為屬性傳遞給頁面元件。
- 這種方法會在建置期間 (build time) 為頁面生成靜態 HTML 文件，提高效能並減少伺服器負荷。
- 簡單來說就是，SSG 會在網頁打包（built time）時，就由 Server 產生所有需要用到的內容，因此每次 Server 收到 Request 均回傳相同的 HTML 給 Client。
- 執行函數：`getStaticProps()`

範例：

```jsx
// pages/ssg-page.js
export async function getStaticProps() {
  const res = await fetch("<https://api.example.com/data>");
  const data = await res.json();

  return {
    props: { data }, // 會作為屬性傳遞給頁面元件
  };
}

function SSGPage({ data }) {
  return <div>{JSON.stringify(data)}</div>;
}

export default SSGPage;
```

### 4. 增量靜態再生 (ISR)

- ISR 是 SSG 的擴展，使用 `getStaticProps` 及 `revalidate` 屬性來實現。`revalidate` 屬性指定頁面應重新驗證的間隔時間（以秒為單位）。
- 當 `revalidate` 時間過後有請求進來時，Next.js 會在背景中重新生成頁面。
- 簡單來說就是，ISR 是結合 SSG 和 SSR 的渲染方式，可設定條件保存上一次渲染結果，當靜態檔案過期，將觸發 Server 重新 build HTML 檔案以更新頁面。
- 執行函數: `getStaticProps()` 搭配 `revalidate` 屬性

範例：

```jsx
// pages/isr-page.js
export async function getStaticProps() {
  const res = await fetch("<https://api.example.com/data>");
  const data = await res.json();

  return {
    props: { data },
    revalidate: 10, // 以秒為單位，頁面每 10 秒重新驗證一次
  };
}

function ISRPage({ data }) {
  return <div>{JSON.stringify(data)}</div>;
}

export default ISRPage;
```

### Page Router 處理 4 種渲染的方式總結

- **CSR**：使用 React 在客戶端進行內容渲染。不使用特定的函數（`getStaticProps`、`getServerSideProps`）。
- **SSR**：使用 `getServerSideProps` 在伺服器上於每次請求時進行內容渲染。
- **SSG**：使用 `getStaticProps` 在建置期間進行內容渲染，生成靜態 HTML 文件。
- **ISR**：SSG 的變體，使用 `getStaticProps` 和 `revalidate` 屬性允許定期更新靜態內容。

## App Router 處理 4 種渲染的方式

Next.js 的 App Router 引入了一種新的處理客戶端渲染（CSR）、伺服器端渲染（SSR）、靜態網站生成（SSG）和增量靜態再生（ISR）的方法。以下是這些渲染方法的實作方式：

### 1. 客戶端渲染（CSR）

- 在 App Router 中，CSR 的處理方式類似於傳統的 React 應用程式。元件在客戶端進行渲染，資料獲取則使用 React 的 hook，例如 `useEffect`，或使用像 SWR 這樣的庫。
- 在 App Router 中要進行客戶端渲染的話，需要特別在元件的開頭加上 `'use client'` 指令。

範例：

```jsx
"use client";

import { useState, useEffect } from "react";

export default function Page() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/data");
      const result = await response.json();
      setData(result);
    }
    fetchData();
  }, []);

  return <div>{data ? data : "Loading..."}</div>;
}
```

### 2. 伺服器端渲染（SSR）

- 在 App Router 中，SSR 通常在伺服器元件中自動實現。當我們建立一個不使用 `'use client'` 指令的元件時，它會自動在伺服器上進行渲染。
- 可以在伺服器元件中獲取資料，伺服器會在發送 HTML 給客戶端之前先渲染好 HTML。

範例：

```jsx
export default async function Page() {
  const res = await fetch("<https://api.example.com/data>");
  const data = await res.json();

  return <div>{data}</div>;
}
```

### 3. 靜態網站生成（SSG）

- 在 App Router 中，靜態生成是透過在建置期間渲染伺服器元件（server components）來實現的。
- 如果元件在建置期間獲取資料並且不依賴於執行階段變數（例如查詢參數），則會進行靜態生成。
- 詳細說明： <br />
  在傳統的 Next.js 中，`getStaticProps` 用來在建置期間獲取資料並生成靜態頁面。這是一種靜態網站生成 (SSG) 的方法。 <br />
  而在 App Router 中，靜態生成是通過伺服器端元件來實現的。Next.js 會自動處理這些伺服器端元件的預渲染過程，確保在建置期間生成靜態頁面。 <br />
  總而言之，在 App Router 中，我們已不必使用 `getStaticProps` 來實現靜態網站生成，因為 Next.js 的伺服器端元件已經處理了這部分的工作。 <br />

範例：

```jsx
export default async function Page() {
  const res = await fetch("<https://api.example.com/data>");
  const data = await res.json();

  return <div>{data}</div>;
}

// 如果不依賴於執行階段的變數（例如查詢參數），Next.js 將在建置期間靜態生成這個頁面。
```

### 4. 增量靜態再生（ISR）

- App Router 中的 ISR 通過 `fetch` 函數的 `revalidate` 選項來支援。在伺服器元件中使用 `fetch` 並指定 `next: { revalidate: seconds }` 選項時，Next.js 會在指定的秒數後重新生成頁面。
- 這允許頁面在不進行完全重建(rebuild)的情況下保持最新狀態。

範例：

```jsx
export default async function Page() {
  const res = await fetch("<https://api.example.com/data>", { next: { revalidate: 10 } });
  const data = await res.json();

  return <div>{data}</div>;
}

// 該頁面將每 10 秒靜態再生一次。
```

### App Router 處理 4 種渲染的方式總結

- **CSR**：使用客戶端 hook（`useEffect` 等）進行管理。
- **SSR**：在伺服器元件中自動應用。
- **SSG**：透過使用沒有執行階段依賴的伺服器元件來實現。（簡單來說，就是如果伺服器元件在建置頁面時不需要依賴於**執行階段才有的資料或條件**，那麼 Next.js 就能夠在建置階段生成這個頁面，並在頁面發佈後不再需要動態生成。）
- **ISR**：使用 `fetch` 並指定 `revalidate` 選項來實現。

# Rendering——App Router 渲染概念

雖然前面講述 App Router 處理 4 種渲染的方式，但在 App Router 在渲染的概念上，已經不用先前的 CSR、SSR、SSG、ISR 來說明（那主要是 Page Router 在使用的概念），而是以伺服器元件（React Server Component, RSC）和客戶端元件（Client Component）來說明。

## 1. 伺服器元件（React Server Component, RSC）

React 伺服器元件讓我們能撰寫可以在伺服器上渲染和選擇性快取的 UI。在 Next.js 中，渲染工作進一步被分割成**路由段(route segments)**，以實現串流和部分渲染，並且有三種不同的伺服器渲染策略：

- [靜態渲染 (Static Rendering)](https://nextjs.org/docs/app/building-your-application/rendering/server-components#static-rendering-default)
- [動態渲染 (Dynamic Rendering)](https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering)
- [串流 (Streaming)](https://nextjs.org/docs/app/building-your-application/rendering/server-components#streaming)

### 伺服器渲染的好處

在伺服器上進行渲染有幾個好處，包括：

- **資料獲取**：伺服器元件讓我們可將資料獲取移到伺服器，更接近資料來源。這可以通過減少獲取渲染所需資料的時間以及客戶端所需發送的請求數量來提高效能。
- **安全性**：伺服器元件讓我們可將敏感資料和邏輯保留在伺服器上，例如令牌和 API 密鑰，避免將其暴露給客戶端。
- **快取**：透過在伺服器上進行渲染，結果可以被快取並在後續請求和不同使用者之間重複使用。這可以提高效能並減少成本，因為每次請求時所需的渲染和資料獲取量減少。
- **效能**：伺服器元件提供了額外的工具來優化效能。例如，如果我們從完全由客戶端元件組成的應用開始，將非互動性的 UI 部分移到伺服器元件可以減少所需的客戶端 JavaScript。這對於網速較慢或設備較不強的使用者特別有利，因為瀏覽器需要下載、解析和執行的客戶端 JavaScript 減少了。
- **初次頁面載入和 [首次內容繪製 (FCP)](https://web.dev/fcp/)**：可以生成 HTML 讓使用者立即查看頁面，而無需等待客戶端下載、解析和執行渲染頁面所需的 JavaScript。
- **搜尋引擎優化和社群網路分享**：渲染的 HTML 可以被搜尋引擎機器人用來索引頁面內容，以及被社群網路機器人用來生成社交卡片預覽。
- **串流**：伺服器元件將渲染工作拆分成多個區塊，當區塊準備就緒時再逐步將它們串流傳輸到客戶端。也就是在整個頁面渲染完成之前，就先提供部分內容給使用者，這樣可以提升使用者體驗。

### 在 Next.js 中使用伺服器元件

Next.js 預設就是使用伺服器元件，自動實現伺服器渲染，不需要另外設定。

### 伺服器元件如何渲染？

在伺服器上，Next.js 使用 React 的 API 來協調渲染。渲染工作被分割成區塊：依照單獨的路由段(route segments)和 [Suspense Boundaries](https://react.dev/reference/react/Suspense) 來分割。

每個區塊的渲染分為兩個步驟：

1. React 將伺服器元件渲染為一種稱為 **React Server Component Payload (RSC Payload)** 的特殊資料格式。
2. Next.js 使用 RSC Payload 和客戶端元件 JavaScript 指令在伺服器上渲染 **HTML**。

然後，在客戶端：

1. HTML 用於立即顯示路由的快速非互動預覽——這僅限於初次頁面載入。
2. RSC Payload 用於調和客戶端和伺服器元件樹，並更新 DOM。
3. JavaScript 指令用於 [hydrate](https://react.dev/reference/react-dom/client/hydrateRoot) 客戶端元件，並使應用程式具備互動性。

> 什麼是 RSC Payload？
>
> RSC Payload 是渲染的 React 伺服器元件樹的緊湊二進位表示。React 在客戶端使用它來更新瀏覽器的 DOM。
>
> RSC Payload 包含：
>
> - 伺服器元件的渲染結果
> - 客戶端元件應渲染的位置佔位符以及對其 JavaScript 檔案的引用
> - 從伺服器元件傳遞給客戶端元件的任何 props

### 伺服器渲染策略—— 1. 靜態渲染（預設）

靜態渲染是指在 **建置期間** 或在 [資料重新驗證](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration) 之後的背景中進行路由渲染。結果會被快取並推送到 [內容傳遞網路 (CDN)](https://developer.mozilla.org/docs/Glossary/CDN)。這種優化讓我們可以在使用者和伺服器請求之間共享渲染工作的結果。

靜態渲染適用於具有非個人化資料的路由，這些資料在建置期間可以知道，例如靜態部落格文章或產品頁面。

### 伺服器渲染策略—— 2. 動態渲染

動態渲染是指在 **請求時** 為每個使用者渲染路由。

動態渲染適用於具有個人化資料的路由，或者具有僅在請求時才能知道的資訊，例如 cookies 或 URL 的搜尋參數。

> 使用快取資料的動態路由 (Dynamic Routes with Cached Data)
>
> 大多數網站的路由既不是完全靜態的也不是完全動態的——它們是處於一個光譜中。例如，一個電子商務頁面，使用快取的產品資料並定期重新驗證，但同時也具有未快取的個人化客戶資料。
>
> 在 Next.js 中，我們可以動態渲染包含快取和未快取資料的路由。這是因為 RSC Payload 和資料(data)是分開快取的。這讓我們可以選擇動態渲染，並且不用擔心在請求時獲取所有資料對效能的影響。
>
> 了解更多關於 [完整路由快取](https://nextjs.org/docs/app/building-your-application/caching#full-route-cache) 和 [資料快取](https://nextjs.org/docs/app/building-your-application/caching#data-cache) 的資訊。

#### 切換到動態渲染：

在渲染過程中，如果發現 [動態函數](https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-functions) 或未快取資料請求，Next.js 將切換到動態渲染整個路由。

下表總結了動態函數和資料快取如何影響路由是靜態還是動態渲染：

| 動態函數 | 資料   | 路由     |
| -------- | ------ | -------- |
| 否       | 快取   | 靜態渲染 |
| 是       | 快取   | 動態渲染 |
| 否       | 未快取 | 動態渲染 |
| 是       | 未快取 | 動態渲染 |

在上表中，若要使路由完全靜態，所有資料必須被快取。反之，我們可以擁有一個動態渲染的路由，該路由使用快取和未快取的資料獲取。

作為開發者，我們不需要在靜態和動態渲染之間進行選擇，因為 Next.js 將根據所使用的功能和 API 自動選擇每個路由的最佳渲染策略。我們可以選擇何時 [快取](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching) 或 [重新驗證特定資料](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)，並且我們可以選擇 [串流](https://nextjs.org/docs/app/building-your-application/rendering/server-components#streaming) UI 的部分內容。

#### 動態函數：

動態函數 (Dynamic Functions) 依賴於只能在請求時才能知道的資訊，例如使用者的 cookies、當前請求的標頭或 URL 的搜尋參數。在 Next.js 中，這些動態 API 包括：

- [`cookies()`](https://nextjs.org/docs/app/api-reference/functions/cookies)
- [`headers()`](https://nextjs.org/docs/app/api-reference/functions/headers)
- [`unstable_noStore()`](https://nextjs.org/docs/app/api-reference/functions/unstable_noStore)
- [`unstable_after()`](https://nextjs.org/docs/app/api-reference/functions/unstable_after)
- [`searchParams` prop](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional)

使用這些函數其中的任何一個，都會在請求時，讓整個路由進入動態渲染模式。

### 伺服器渲染策略—— 3. 串流

![image](https://github.com/user-attachments/assets/e812544d-3f50-4ba0-af6e-3a3a37f80321)

串流使我們可以逐步從伺服器渲染 UI。渲染工作被拆分成多個區塊，並在準備好時逐步串流到客戶端。這讓使用者可以在整個內容渲染完成之前立即看到部分頁面內容。

![image](https://github.com/user-attachments/assets/2e0e5c4d-d9f4-4154-87aa-f9018cf1147c)

串流是 Next.js App Router 預設內建的功能。這有助於提高初次頁面載入效能，以及需要依賴較慢資料獲取的 UI（這些資料會阻塞整個路由的渲染）。例如，產品頁面上的評論。

我們可以使用 `loading.js` 和 [React Suspense](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming) 開始串流路由段和 UI 元件。請參考 [Loading UI 和串流](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming) 以獲取更多資訊。

## 2. 客戶端元件（Client Component）

客戶端元件讓我們可以撰寫可互動的使用者介面，這些介面是[在伺服器上預先渲染](https://github.com/reactwg/server-components/discussions/4)的，並且可以使用客戶端的 JavaScript 在瀏覽器中執行。

### 客戶端渲染的好處

在客戶端執行渲染有幾個好處，包括：

- **互動性**：客戶端元件可以使用狀態 (state)、效果 (effects) 和事件監聽器 (event listeners)，這意味著它們可以給使用者即時的回饋，並更新使用者介面。
- **瀏覽器 API**：客戶端元件可以訪問瀏覽器 API，例如[地理位置](https://developer.mozilla.org/docs/Web/API/Geolocation_API)或[本地儲存](https://developer.mozilla.org/docs/Web/API/Window/localStorage)。

### 在 Next.js 中使用客戶端元件

要使用客戶端元件，需要在檔案頂部引入 React 的[`"use client"`指令](https://react.dev/reference/react/use-client)，放在所有匯入語句之前。

`"use client"` 用於在伺服器端元件和客戶端元件之間建立[界限](https://nextjs.org/docs/app/building-your-application/rendering#network-boundary)。這意味著在檔案中定義 `"use client"` 後，所有匯入其中的其他模組，包括子元件，都會被視為客戶端包的一部分。

app/counter.tsx

```jsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

下圖顯示，如果未定義 `"use client"` 指令，在巢狀元件 (`toggle.js`) 中使用 `onClick` 和 `useState` 將會導致錯誤。這是因為預設情況下，應用程式路由中的所有元件都是伺服器元件，這些 API 無法使用。通過在 `toggle.js` 中定義 `"use client"` 指令，可以告訴 React 進入客戶端邊界，這些 API 在此可用。

![image](https://github.com/user-attachments/assets/328123ef-503e-45bb-b9c8-35d583a49c5a)

> 補充：定義多個 use client 入口點
>
> 我們可以在 React 元件樹中定義多個 `"use client"` 入口點。這樣就可將應用程式分割為多個客戶端包(client bundles)。
>
> 但是，`"use client"` 並不需要在每個需要在客戶端渲染的元件中定義。只要定義了邊界，所有子元件和匯入其中的模組都會被視為客戶端包的一部分。

### 客戶端元件如何渲染？

在 Next.js 中，客戶端元件的渲染方式取決於請求是屬於**整頁載入**（例如首次訪問應用程式或由瀏覽器重新整理觸發的頁面載入）或者是**後續的導航**。

#### 整頁載入（Full page load）:

為了優化初次頁面載入，Next.js 將使用 React 的 API 在伺服器上為客戶端元件和伺服器元件渲染靜態 HTML 預覽。這意味著，當使用者首次訪問我們的應用程式時，他們將立即看到頁面的內容，而無需等待客戶端下載、解析和執行客戶端元件的 JavaScript 包。

在伺服器上：

1. React 將伺服器元件渲染為一種稱為 [**RSC Payload**](https://nextjs.org/docs/app/building-your-application/rendering/server-components#what-is-the-react-server-component-payload-rsc) 的特殊資料格式，其中包含對客戶端元件的引用。
2. Next.js 使用 RSC Payload 和客戶端元件的 JavaScript 指令，在伺服器上渲染路徑的 **HTML**。

接著，在客戶端：

1. 使用 HTML 立即顯示快速但不可互動的初始預覽。
2. 使用 RSC Payload 來調和客戶端元件和伺服器元件樹，並更新 DOM。
3. 使用 JavaScript 指令來 [hydrate](https://react.dev/reference/react-dom/client/hydrateRoot) 客戶端元件，讓它們的使用者介面可互動。

> 補充：什麼是 Hydration？
>
> Hydration 是將事件監聽器附加到 DOM 的過程，使靜態 HTML 變得可互動。Hydration 的背後是使用 [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot) React API 完成的。

#### 後續導航（Subsequent Navigations）:

在後續導航中，客戶端元件完全在客戶端渲染，無需伺服器渲染的 HTML。

這意味著客戶端元件的 JavaScript 包將被下載並解析。一旦包準備就緒，React 將使用 [RSC Payload](https://nextjs.org/docs/app/building-your-application/rendering/server-components#what-is-the-react-server-component-payload-rsc) 來調和客戶端元件和伺服器元件樹，並更新 DOM。

# Routing——路由差異

以下根據 Next.js 官方文件的說明，總結 App Router 和 Page Router 兩種路由架構系統在路由設定上的差異，並且介紹 App Router 的功能和特性。（因版面有限，就不特別介紹 Page Router 了）

## 1. **定義路由（Defining Routes）**

- **App Router**：路由是透過 `/app` 目錄中的資料夾結構定義的。目錄結構直接對應到 URL 路徑，不依賴於檔案命名規範。
- **Page Router**：路由是在 `/pages` 目錄中定義的。此目錄中的每個檔案自動成為一個路由，且資料夾結構決定動態路由。這種方法簡單明瞭，但在組織路由方面彈性較小。

定義路由的詳細說明已在前面章節提過了，這裡就不贅述。請參考《專案建立——專案架構差異》此章節。

## 2. **佈局和模板（Layouts and Templates）**

- **App Router**：支援內建佈局和模板，允許巢狀佈局和可重用的模板應用於不同路由。這樣的設計可以減少重複的程式碼，並簡化佈局管理。（但如果網站頁面的佈局變化不大，這方面的優勢就不明顯）
- **Page Router**：沒有支援內建的佈局和模板，需要在每個頁面手動實作佈局元件。

說明：

App Router 可以透過特殊檔案  `layout.tsx`  更簡單地實現 persistent layout。

> 什麼是 persistent layout？ <br>
> 簡單來說就是**路由切換時，沒有變動的部分不會 re-render，讓 state 和頁面狀態(ex: 滾輪位置)可以維持一樣。**

以下的範例是參考[這篇文章](https://ithelp.ithome.com.tw/articles/10316237)，內文有仔細講解同樣的需求在 Page Router 可以實現的方式，這裡只截取部分說明以及 App Router 的實作方式。

假設我們有個需求，想要做一個設定頁面 `/settings`，sub routes 包含像是 `/profile`、 `/account`、`/notifications` 等不同設定。

每個 sub routes 都有一個共用的 scroll bar，這個 scroll bar 的寬度固定，超出寬度的部分則用 `overflow-auto` 來讓使用者左右滾動查看。點擊 scrollbar 上的選項時，則會轉到對應的頁面 (ex: 點 Profile 文字按鈕 → 轉至頁面 settings/profile)。最重要的是，我們希望在切換頁面時，scroll bar 不會重新 render，而是保持在原本的位置。

原先在 Page Router 的實作方式大概有三種：

1. 寫一個 ScrollBar 的共用元件，並在 `/pages/settings` 的頁面檔案導入：
   每個要用的頁面都要 import Scrollbar，而且每個頁面切換時，scroll bar 都會重新 render。而作為 SPA 重點之一，persistent layout 即是希望當 URL 切換時，不需改動的 UI 元素可以不 re-render，保留某些狀態 (ex: 當前 scroll bar 位置)，增強使用者體驗。
2. 使用 `getLayout()` 建立一個含有 scroll bar 的 layout：
   這個做法達到了 persistent layout，但每個要使用的頁面都要 import 這個 layout。
3. 在 `_app.tsx` 中加入 scroll bar，並用 URL 判斷是否顯示：
   這個做法也可以達到 persistent layout，也不用每個要使用的檔案都 import layout，但假如今天 layout 很多，可能會讓 `_app.tsx` 很難維護。

為了讓開發者能更輕鬆地實現 persistent layout，App Router 版本推出了一個新的 file convention ： `layout.js/jsx/tsx`。

Layout 是一個可以在路徑底下的子路徑中，共用的 UI。它不會影響 routing 而且當使用者在子路由之間切換時，也不會 re-render。

以剛剛的例子來說，我們可以在 `/app/settings`中建一個 `layout.tsx`，此檔案中 default export 的 component 就會被當作 /settings 路由下的 layout：

```tsx
/* app/settings/layout.tsx */
import ScrollBar from "@/components/ScrollBar";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollBar />
      {children}
    </>
  );
}
```

/settings 底下的頁面元件就會以 children props 的方式傳入 Layout 中，達到元件共用且切換路由時 scroll bar 會維持原本位置的效果！

這裡針對 Layouts 的部分再進一步說明，而 [Templates](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates#templates) 就先不談。

### 版面配置 (Layouts)

版面配置是一種在多個路由之間**共用**的 UI。導航時，版面配置會保留狀態，保持互動性且不會重新渲染(re-render)。而且，版面配置還可以[巢狀](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates#nesting-layouts)(nested)。

我們可以透過在 `layout.js` 檔案中預設匯出一個 React 元件來定義版面配置。而該元件接受一個 `children` 屬性，且該屬性在渲染時會填入**子版面配置（如果存在的話）**或**頁面**。

例如，此版面配置將與 `/dashboard` 和 `/dashboard/settings` 頁面共用：

![image](https://github.com/user-attachments/assets/f3c5aaa3-1b52-4b7a-a4b8-4f59f4c9d78b)

app/dashboard/layout.tsx

```tsx
export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <nav></nav>

      {children}
    </section>
  );
}
```

在 Layout 中有個最特殊的 layout，就是 Root Layout，它的有些規則與一般的 Layouts 不同。

#### 根版面配置 (Root Layout) - 必要

根版面配置定義在 `app` 目錄的頂層，並適用於所有路由。此版面配置是**必要**的，且必須包含 `html` 和 `body` 標籤，允許我們修改伺服器回傳的初始 HTML。

app/layout.tsx

```tsx
/* app/layout.tsx */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "./Header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
```

注意：

- App Router 中一定要有至少一個根版面配置（root layout）。
- 只有根版面配置（root layout）可以包含 `<html>` 和 `<body>` 標籤。
- Root layout 只能是 Server Components。
- 可以使用[路由群組](https://nextjs.org/docs/app/building-your-application/routing/route-groups)來建立多個根版面配置（root layouts）。請參閱[這裡的範例](https://nextjs.org/docs/app/building-your-application/routing/route-groups#creating-multiple-root-layouts)。
- 根版面配置（root layout）取代了 `pages` 目錄中的 [`_app.js`](https://nextjs.org/docs/pages/building-your-application/routing/custom-app) 和 [`_document.js`](https://nextjs.org/docs/pages/building-your-application/routing/custom-document) 檔案。[查看遷移指南](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#migrating-_documentjs-and-_appjs)。

#### 巢狀版面配置 (Nesting Layouts)

預設情況下，資料夾層次結構(folder hierarchy)中的 layouts 是**巢狀**的，意思就是，layouts 會通過其 `children` 屬性來包裹子版面配置(child layouts)。

在特定的路由段（也就是資料夾）中添加 `layout.js` ，會自動**巢狀**版面配置。

例如，在 `/dashboard` 路由建立一個版面配置，也就是在 `dashboard` 目錄中新增一個 `layout.js` 檔案：

![image](https://github.com/user-attachments/assets/23258661-81b0-4ba0-91dc-48f2b401359a)

app/dashboard/layout.tsx

```tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>;
}
```

將上面兩個版面配置結合起來，根版面配置（`app/layout.js`）會包裹 dashboard 的版面配置（`app/dashboard/layout.js`），而 dashboard 的版面配置則包裹 `app/dashboard/*` 內的路由段。

簡單來說就是，巢狀會讓一般的 layout 被以 children props 的形式傳到 root layout。因此，`app/dashboard` 的子路由（像是 /dashboard/about 或者 /dashboard/settings）會同時吃到 root layout 和 dashboard layout。

這兩個版面配置會呈現巢狀，如下圖：

![image](https://github.com/user-attachments/assets/5d1c333e-d172-4013-80bb-40614a5a3218)

或者也可以參考這張圖：
![image](https://github.com/user-attachments/assets/93815c69-5b43-4db7-a9f6-0c807283f6bf)

關於 Layouts 需要了解的事：

- 版面配置（Layouts）可以使用 `.js`、`.jsx` 或 `.tsx` 檔案副檔名。
- 當 `layout.js` 和 `page.js` 檔案在同一個目錄中定義時，layout 會包裹該 page。
- 版面配置預設為[伺服器元件](https://nextjs.org/docs/app/building-your-application/rendering/server-components)，但可以設定為 [Client Component](https://nextjs.org/docs/app/building-your-application/rendering/client-components)。
- 版面配置可以獲取資料。
- 無法在父版面配置（parent layout）與它的子版面配置之間傳遞資料。但可以在路由中多次獲取相同資料，React 將會[自動對 request 進行重複資料刪除（dedupe）](https://nextjs.org/docs/app/building-your-application/caching#request-memoization)，而不會影響效能。
- 版面配置無法訪問 `pathname`（[了解更多](https://nextjs.org/docs/app/api-reference/file-conventions/layout)）。但匯入的客戶端元件可以使用 [`usePathname`](https://nextjs.org/docs/app/api-reference/functions/use-pathname) hook 來訪問 pathname。
- 版面配置無法訪問其下方的路由段。要訪問所有路由段，可以在客戶端元件中使用 [`useSelectedLayoutSegment`](https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segment) 或 [`useSelectedLayoutSegments`](https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segments)。
- 可以使用[路由群組](https://nextjs.org/docs/app/building-your-application/routing/route-groups)來選擇性地將特定路由段包含在共用版面配置中或排除在外。

## 3. **連結和導航（Linking and Navigating）**

- **App Router**：使用 `Link` 元件進行客戶端導航，與 Page Router 相似，但受益於內建的優化功能，可能更好地與 App Router 中的元件層次結構配合。
- **Page Router**：同樣使用 `Link` 元件進行客戶端導航，對大多數使用情況來說是直接有效的。

說明：兩者在這方面的功能類似，但 **App Router** 可能因其巢狀結構而在先進路由功能的無縫整合方面佔據優勢。

在 Next.js 中有四種方式可以在路由之間進行導航：

- 使用 [`<Link>` 元件](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#link-component)
- 使用 [`useRouter` hook](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#userouter-hook)（[客戶端元件](https://nextjs.org/docs/app/building-your-application/rendering/client-components)）
- 使用 [`redirect` 函式](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#redirect-function)（[伺服器元件](https://nextjs.org/docs/app/building-your-application/rendering/server-components)）
- 使用原生 [History API](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#using-the-native-history-api)

### `<Link>` 元件

`<Link>` 是一個內建的元件，它擴展了 HTML 的 `<a>` 標籤，提供了[預取](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#2-prefetching)(prefetching) 和客戶端的路由導航功能。它是 Next.js 中在路由之間進行導航的最主要和最推薦的方式。

我們可以從 `next/link` 中導入它，並將 `href` 屬性傳遞給這個元件來使用它：

app/page.tsx

```tsx
import Link from "next/link";

export default function Page() {
  return <Link href='/dashboard'>Dashboard</Link>;
}
```

我們還可以將其他可選的屬性傳遞給 `<Link>`。詳情請參閱 [API 參考資料](https://nextjs.org/docs/app/api-reference/components/link)。

#### 範例 - 連結到動態段 (Dynamic Segments)

當我們要連結到[動態路由 (dynamic segments)](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)時，可以使用[模板字面值和插值](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals)（template literals and interpolation）來生成一個連結清單。

例如，生成一個部落格文章列表：

app/blog/PostList.js

```jsx
import Link from "next/link";

export default function PostList({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  );
}
```

#### 範例 - 檢查活躍連結

我們可以使用 [`usePathname()`](https://nextjs.org/docs/app/api-reference/functions/use-pathname) 來判斷連結是否處於活躍狀態。

例如，要為活躍的連結添加一個 class，我們可以檢查當前的 `pathname` 是否與連結的 `href` 相符：

@/app/ui/nav-links.tsx

```tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export function Links() {
  const pathname = usePathname();

  return (
    <nav>
      <Link className={`link ${pathname === "/" ? "active" : ""}`} href='/'>
        Home
      </Link>

      <Link className={`link ${pathname === "/about" ? "active" : ""}`} href='/about'>
        About
      </Link>
    </nav>
  );
}
```

#### 範例 - 滾動至指定的 `id`

Next.js App Router 的預設行為是**滾動到新路由的頂部，或保持在回退和前進導航中的滾動位置。**

如果希望在導航時滾動到特定的 `id`，我們可以在網址後附加 `#` 錨點連結，或者直接將錨點連結傳遞給 `href` 屬性。由於 `<Link>` 會渲染為 `<a>` 元素，因此這是可行的。

```jsx
<Link href="/dashboard#settings">Settings</Link>

// 輸出
<a href="/dashboard#settings">Settings</a>

```

> 需要了解：
>
> - 如果在導航時頁面不在視窗中可見，Next.js 將滾動到[頁面](https://nextjs.org/docs/app/building-your-application/routing/pages)。

#### 範例 - 禁用滾動還原

Next.js App Router 的預設行為是**滾動到新路由的頂部，或保持在回退和前進導航中的滾動位置。** 如果想禁用此行為，可以將 `scroll={false}` 傳遞給 `<Link>` 元件，或將 `scroll: false` 傳遞給 `router.push()` 或 `router.replace()`。

```jsx
// next/link
<Link href='/dashboard' scroll={false}>
  Dashboard
</Link>
```

```jsx
// useRouter
import { useRouter } from "next/navigation";

const router = useRouter();

router.push("/dashboard", { scroll: false });
```

### `useRouter()` hook

`useRouter` hook 允許我們從[客戶端元件](https://nextjs.org/docs/app/building-your-application/rendering/client-components)程式化地更改路由。

app/page.js

```jsx
"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <button type='button' onClick={() => router.push("/dashboard")}>
      Dashboard
    </button>
  );
}
```

有關 `useRouter` 方法的完整列表，請參閱 [API 參考資料](https://nextjs.org/docs/app/api-reference/functions/use-router)。

> 建議： 除非有特定需求才使用 useRouter，否則請使用 <Link> 元件在路由之間進行導航。

### `redirect` 函式

對於[伺服器元件](https://nextjs.org/docs/app/building-your-application/rendering/server-components)，請改為使用 `redirect` 函式。

app/team/[id]/page.tsx

```tsx
import { redirect } from "next/navigation";

async function fetchTeam(id: string) {
  const res = await fetch("https://...");
  if (!res.ok) return undefined;
  return res.json();
}

export default async function Profile({ params }: { params: { id: string } }) {
  const team = await fetchTeam(params.id);
  if (!team) {
    redirect("/login");
  }

  // ...
}
```

> 需要了解：
>
> - `redirect` 預設回傳 307（暫時重新導向）狀態碼。當在伺服器操作中使用時，它回傳 303，這通常用於 POST 請求後重新導向到成功頁面。
> - `redirect` 在內部會引發錯誤，因此應在 `try/catch` blocks 外調用。
> - `redirect` 可以在客戶端元件的渲染過程中調用，但不能在事件處理器中調用。我們可以改用 [`useRouter` hook](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#userouter-hook)。
> - `redirect` 也接受絕對 URL，並且可以用於重新導向到外部連結。
> - 如果想在渲染過程之前進行重新導向，請使用 [`next.config.js`](https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirects-in-nextconfigjs) 或 [Middleware](https://nextjs.org/docs/app/building-your-application/routing/redirecting#nextresponseredirect-in-middleware)。

有關更多資訊，請參閱 [`redirect` API 參考資料](https://nextjs.org/docs/app/api-reference/functions/redirect)。

### 使用原生的 History API

Next.js 允許我們使用原生的 [`window.history.pushState`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState) 和 [`window.history.replaceState`](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState) 方法來更新瀏覽器的歷史紀錄堆疊，而不需要重新載入頁面。

`pushState` 和 `replaceState` 的調用會與 Next.js Router 整合，讓我們能夠與 [`usePathname`](https://nextjs.org/docs/app/api-reference/functions/use-pathname) 和 [`useSearchParams`](https://nextjs.org/docs/app/api-reference/functions/use-search-params) 同步。

#### `window.history.pushState`

使用此方法來新增一個新的瀏覽器歷史紀錄。使用者可以回到先前的狀態。例如，要對商品清單進行排序：

使用此方法來新增一個條目到瀏覽器的歷史記錄堆疊（也就是：新增一個新的瀏覽器歷史紀錄）。使用者可以回到之前的狀態。

例如，用來對產品列表進行排序：

```tsx
"use client";

import { useSearchParams } from "next/navigation";

export default function SortProducts() {
  const searchParams = useSearchParams();

  function updateSorting(sortOrder: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sortOrder);
    window.history.pushState(null, "", `?${params.toString()}`);
  }

  return (
    <>
      <button onClick={() => updateSorting("asc")}>升序排序</button>
      <button onClick={() => updateSorting("desc")}>降序排序</button>
    </>
  );
}
```

#### `window.history.replaceState`

使用此方法來替換瀏覽器歷史記錄堆疊中的當前條目（也就是：直接取代當前瀏覽器的歷史紀錄）。使用者無法回到之前的狀態。

例如，用來切換應用程式的語言：

```tsx
"use client";

import { usePathname } from "next/navigation";

export function LocaleSwitcher() {
  const pathname = usePathname();

  function switchLocale(locale: string) {
    // e.g. '/en/about' or '/fr/contact'
    const newPath = `/${locale}${pathname}`;
    window.history.replaceState(null, "", newPath);
  }

  return (
    <>
      <button onClick={() => switchLocale("en")}>English</button>
      <button onClick={() => switchLocale("fr")}>French</button>
    </>
  );
}
```

如果對路由與導航的運作方式有興趣，可以參考文末的補充資訊，有附上解說。

## 4. **錯誤處理（Error Handling）**

- **App Router**：透過巢狀錯誤邊界支援進階錯誤處理，允許對應用程式的不同部分進行更精細的錯誤控制，讓開發人員可以將錯誤隔離到特定的路由或元件。
- **Page Router**：錯誤處理通常涉及建立自訂的 `_error.js` 頁面來進行全域錯誤處理，或使用 `getInitialProps` 在頁面層級捕獲錯誤。

說明：

錯誤可以分為兩類：**預期錯誤（expected errors）**和**未捕獲的例外情況（uncaught exceptions）**：

- **將預期錯誤建模為回傳值**：避免在伺服器操作（Server Actions）中使用 `try`/`catch` 來處理預期錯誤。使用 `useFormState` 來管理這些錯誤並將它們回傳給客戶端。
- **使用錯誤邊界處理未預期的錯誤**：使用 `error.tsx` 和 `global-error.tsx` 文件實現錯誤邊界，來處理未預期的錯誤並提供備援 UI (fallback UI)。

### 處理預期錯誤（Expected Errors）

預期錯誤是指應用程式正常操作期間可能發生的錯誤，例如：來自 [伺服器端表單驗證](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#server-side-form-validation) 或失敗的請求。這些錯誤應該被明確處理並回傳給客戶端。

#### 處理伺服器操作中的預期錯誤

使用 `useFormState` hook 來管理伺服器操作的狀態，包括錯誤處理。

這種方法避免使用 `try`/`catch` 區塊來處理預期錯誤，這些錯誤應被建模為回傳值，而非拋出異常。

app/actions.ts

```tsx
"use server";

import { redirect } from "next/navigation";

export async function createUser(prevState: any, formData: FormData) {
  const res = await fetch("https://...");
  const json = await res.json();

  if (!res.ok) {
    return { message: "Please enter a valid email" };
  }

  redirect("/dashboard");
}
```

接著，我們可以將 action 傳遞給 `useFormState` hook，並使用回傳的 `state` 來顯示錯誤訊息。

app/ui/signup.tsx

```tsx
"use client";

import { useFormState } from "react";
import { createUser } from "@/app/actions";

const initialState = {
  message: "",
};

export function Signup() {
  const [state, formAction] = useFormState(createUser, initialState);

  return (
    <form action={formAction}>
      <label htmlFor='email'>Email</label>
      <input type='text' id='email' name='email' required />
      {/* ... */}
      <p aria-live='polite'>{state?.message}</p>
      <button>Sign up</button>
    </form>
  );
}
```

> 注意：這些範例使用了 Next.js App Router 內建的 React `useFormState` hook。如果使用的是 React 19，則要改用 useActionState。（可參考 [React 文件](https://react.dev/reference/react/useActionState)）

我們還可以使用回傳的狀態來顯示來自客戶端元件的 toast 提示訊息。

#### 處理伺服器元件中的預期錯誤

在伺服器元件內部抓取資料時，我們可以使用 response 來有條件地渲染錯誤訊息或 [`redirect`](https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirect-function)。

app/page.tsx

```tsx
export default async function Page() {
  const res = await fetch(`https://...`);
  const data = await res.json();

  if (!res.ok) {
    return "There was an error.";
  }

  return "...";
}
```

### 未捕獲的例外情況（Uncaught Exceptions）

未捕獲的例外情況，這裡的例外情況，意思就是意外的異常、未預期的錯誤，這些錯誤表示應用程式正常流程中不應該發生的問題或 bug。這些應該通過拋出錯誤來處理，然後由錯誤邊界捕獲。

- **常見做法**：使用 `error.js` 在根佈局以下處理未捕獲的錯誤。
- **可選作法**：使用巢狀的 `error.js` 檔案（例如 `app/dashboard/error.js`）來處理更精細的未捕獲錯誤。
- **不常見做法**：使用 `global-error.js` 在根佈局中處理未捕獲的錯誤。

#### 使用錯誤邊界（Error Boundaries）

Next.js 使用錯誤邊界（Error Boundaries）來處理未捕獲的錯誤。錯誤邊界會捕獲其子元件中的錯誤並顯示備援 UI (fallback UI)，而不是崩潰的元件樹。

通過在路由段中新增一個 `error.tsx` 檔案並導出一個 React 元件來建立錯誤邊界：

app/dashboard/error.tsx

```tsx
"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
```

如果我們希望錯誤向上冒泡到父級錯誤邊界（parent error boundary），可以在渲染 `error` 元件時 `throw`。

#### 處理巢狀路由中的錯誤

錯誤會冒泡到最近的父級錯誤邊界。這讓我們可以透過在[路由層次結構（route hierarchy）](https://nextjs.org/docs/app/building-your-application/routing#component-hierarchy)的不同層級放置 `error.tsx` 檔案，來進行更精細的錯誤處理。

![image](https://github.com/user-attachments/assets/7357c4a9-7b6a-4e27-8c04-a7b833942c1f)

#### 處理全域錯誤

雖然較少見，但我們可以在根佈局中使用 `app/global-error.js` 處理錯誤，這個檔案位於根 app 目錄中，即使在使用[國際化（internationalization）](https://nextjs.org/docs/app/building-your-application/routing/internationalization)時也是如此。

全域錯誤 UI 必須定義自己的 `<html>` 和 `<body>` 標籤，因為當它啟用時，會取代根佈局（root layout）或範本（template）。

app/global-error.tsx

```tsx
"use client"; // Error boundaries must be Client Components

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
```

## 5. **載入 UI 和串流（Loading UI and Streaming）**

- **App Router**：提供對載入狀態和串流的進階支援，透過允許部分 UI 漸進式載入來改善使用者體驗，因此更適合需要複雜載入策略和串流支援的應用程式。
- **Page Router**：載入狀態通常是使用 React 的 `useState` 或 `useEffect` 手動處理的。沒有內建的串流支援。

說明：

特殊檔案 `loading.js` 幫助我們使用 [React Suspense](https://react.dev/reference/react/Suspense) 建立有意義的載入 UI。透過這個約定，我們可以在路由段的內容載入時，從伺服器顯示 [即時載入狀態](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#instant-loading-states)。一旦渲染完成，新內容會自動替換。

![image](https://github.com/user-attachments/assets/52f8bef3-59e6-45ba-be4e-da59f2090d9c)

### 即時載入狀態

即時載入狀態（Instant Loading States）是導航時立即顯示的備援 UI (fallback UI)。我們可以預渲染載入指示器，例如：骨架畫面（skeletons）或轉圈圈（spinners），或是未來畫面的某個小但有意義的部分，如封面照片、標題等。這有助於使用者理解應用程式正在回應，並提供更好的使用者體驗。

在資料夾中新增一個 `loading.js` 檔案來建立一個載入狀態。

![image](https://github.com/user-attachments/assets/68ad32ea-3dba-4c9b-8715-b8e4f7ccc917)

app/dashboard/loading.tsx

```jsx
export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return <LoadingSkeleton />;
}
```

在同一資料夾中，`loading.js` 會被置入於 `layout.js` 裡面。它會自動將 `page.js` 檔案和其之下的所有子元件都包裹在 `<Suspense>` 邊界內。

![image](https://github.com/user-attachments/assets/e4e1b2b5-ebf8-487d-aeac-adcea4a5fd47)

> 值得注意：
>
> - 即使使用 [以伺服器為中心的路由](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#how-routing-and-navigation-works)，導航（Navigation）也是即時的。
> - 導航是可中斷的，這意味著更改路由不需要等待路由內容完全載入後才導航到另一個路由。
> - 共享佈局在新路由段載入時仍然保持互動性。

> 建議：盡量對於路由段（佈局和頁面）使用 loading.js 約定，因為 Next.js 優化了此功能。

### 使用 Suspense 進行串流

除了 `loading.js`，我們還可以手動為自己的 UI 元件建立 Suspense 邊界。App Router 支援在 [Node.js 和 Edge 執行環境](https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)中使用 [Suspense](https://react.dev/reference/react/Suspense) 進行串流。

> 值得注意：
>
> - [某些瀏覽器](https://bugs.webkit.org/show_bug.cgi?id=252413)會緩衝串流回應。我們可能在回應超過 1024 bytes 之前看不到串流回應。這通常只影響「Hello World」應用程式，而不影響實際應用程式。

#### 什麼是串流？

要了解 React 和 Next.js 中的串流如何運作，首先要了解 **伺服器端渲染（SSR）** 及其局限性。

使用 SSR，需要完成一系列步驟才能讓使用者看到並與頁面互動：

1. 首先，在伺服器上抓取給定頁面的所有資料。
2. 然後，伺服器渲染該頁面的 HTML。
3. 將該頁面的 HTML、CSS 和 JavaScript 發送到客戶端。
4. 使用生成的 HTML 和 CSS 顯示非互動的使用者介面。
5. 最後，React [hydrate](https://react.dev/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html) 使用者介面，使其變得互動。

![image](https://github.com/user-attachments/assets/d512e321-a6ca-4c7a-866b-145ecfecd7cb)

這些步驟是按特定順序的（sequential）且阻塞（blocking）的，這意味著伺服器只能在抓取完所有資料後渲染頁面的 HTML。而且，在客戶端，React 只能在下載完頁面中所有元件的程式碼後，才可以進行 hydrate。

結合 React 和 Next.js 的 SSR 透過盡快向使用者顯示非互動式頁面，來幫助改善感知載效能。

> 補充說明： <br>
>
> - 什麼是感知載入效能（Perceived loading performance）？ <br>
>   指的是使用者在訪問網站時所感受到的頁面載入速度。這並不一定是實際的技術載入速度，而是使用者覺得頁面看起來多快可以被看到或開始互動。
> - 為什麼 SSR 可以改善感知載入效能？ <br>
>   使用伺服器端渲染（SSR）時，伺服器會在回應使用者請求時先抓取所有必要的資料並渲染好完整的 HTML 頁面，然後將這個頁面傳送到使用者的瀏覽器。 <br>
>   即使資料抓取和頁面渲染過程本身可能比較慢，但因為使用者可以迅速看到一個完整的頁面，就算這時候頁面還不能進行互動（例如按鈕還不能點擊、表單還不能提交），至少頁面的視覺內容已經顯示出來了，這會讓使用者**覺得**頁面載入得很快。 <br>
>   相比之下，如果使用純粹的客戶端渲染（CSR），使用者必須等待 JavaScript 和所有資料都載入完畢，然後瀏覽器才能渲染頁面。這樣的過程中，使用者可能只會看到一個空白頁面或載入中的指示，這會讓他們**覺得**頁面載入得很慢。 <br>
>   總而言之：
>   1. **SSR 改善了感知載入效能**，是因為它優先顯示了頁面的內容（就算這個頁面在初始載入時不可互動）這可以減少使用者等待的感覺，從而提高了使用者體驗。
>   2. 雖然 SSR 在資料抓取時間較長的情況下仍然會慢，但因為頁面在伺服器上已經渲染好並儘早顯示，使用者不需要等待整個 JavaScript 下載和執行完成，這樣就**感覺**頁面載入得更快了。

![image](https://github.com/user-attachments/assets/2c99379e-3896-4d26-a931-61d75a34083b)

然而，由於伺服器上需要完成所有資料獲取，才能將頁面顯示給使用者，它仍然可能較慢。

**串流（Streaming）** 允許我們將頁面的 HTML 分解為較小的塊，並逐步將這些塊從伺服器發送到客戶端。

![image](https://github.com/user-attachments/assets/72e1b3f0-f925-4751-acfd-b2c6951707f0)

這使得頁面的部分內容可以更快顯示，而不必等待所有資料載入完成後才能渲染任何 UI。

串流與 React 的元件模型配合良好，因為每個元件都可以被視為一個塊。優先級較高的元件（例如產品資訊）或不依賴資料的元件可以優先發送（例如佈局），React 可以更早開始 hydrate。優先級較低的元件（例如評論、相關產品）可以在其資料獲取後在同一伺服器請求中發送。

![image](https://github.com/user-attachments/assets/5364d837-4214-48c6-8222-a040209ce6fc)

當我們想避免長時間的資料請求阻塞頁面渲染時，
串流特別有用，因為它可以減少 [第一個位元組時間 (TTFB)](https://web.dev/ttfb/) 和 [首次顯示內容所需時間 (FCP)](https://web.dev/first-contentful-paint/)。它還有助於提高 [互動準備時間 (TTI)](https://developer.chrome.com/en/docs/lighthouse/performance/interactive/)，尤其是在較慢的設備上。

#### 範例

`<Suspense>` 的運作方式是包裹執行異步操作（例如抓取資料）的元件，當它進行時顯示 fallback UI（例如骨架畫面或轉圈圈），然後在操作完成後替換我們的元件。

app/dashboard/page.tsx

```jsx
import { Suspense } from "react";
import { PostFeed, Weather } from "./Components";

export default function Posts() {
  return (
    <section>
      <Suspense fallback={<p>Loading feed...</p>}>
        <PostFeed />
      </Suspense>
      <Suspense fallback={<p>Loading weather...</p>}>
        <Weather />
      </Suspense>
    </section>
  );
}
```

透過使用 Suspense，可以享受到以下優點：

1. **串流伺服器渲染** - 從伺服器到客戶端逐步渲染 HTML。
2. **選擇性 hydrate** - React 根據使用者互動優先考慮哪些元件首先進行互動。

要了解更多 Suspense 的範例和用例，請參閱 [React 文件](https://react.dev/reference/react/Suspense)。

#### SEO

- Next.js 會等待 [`generateMetadata`](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) 中的資料抓取完成後，才開始將 UI 串流到客戶端。這樣可以保證串流回應（response）的第一部分包含 `<head>` 標籤。
- 由於串流是由伺服器渲染的，因此不會影響 SEO。可以使用 Google 的 [Rich Results Test](https://search.google.com/test/rich-results) 工具來查看我們的頁面在 Google 網頁爬蟲中的顯示方式，並檢視序列化後的 HTML（[來源](https://web.dev/rendering-on-the-web/#seo-considerations)）。

#### 狀態碼

在串流過程中，會回傳 `200` 狀態碼(Status Codes)來表示請求成功。

伺服器仍然可以在串流的內容中向客戶端傳達錯誤或問題，例如使用 [`redirect`](https://nextjs.org/docs/app/api-reference/functions/redirect) 或 [`notFound`](https://nextjs.org/docs/app/api-reference/functions/not-found) 時。由於回應標頭（response headers）已經傳送給客戶端，因此回應的狀態碼無法更新。這不會影響 SEO。

## 6. **重新導向（Redirecting）**

- **App Router**：由於其靈活的路由結構，支援更複雜的重新導向邏輯。可以針對每個路由或一組路由配置重新導向，提供更多重新導向的彈性和控制。
- **Page Router**：重新導向通常在 `next.config.js` 中使用 `redirects` 配置，或在個別頁面元件內部處理。

說明：

在 Next.js 中，有幾種方法可以處理重新導向。以下介紹每種可用的選項、使用案例，以及如何管理大量的重新導向。

| API                             | 目的                         | 位置                               | 狀態碼                           |
| ------------------------------- | ---------------------------- | ---------------------------------- | -------------------------------- |
| `redirect`                      | 在變更或事件後重新導向使用者 | 伺服器元件、伺服器操作、路由處理器 | 307 (暫時性) 或 303 (伺服器操作) |
| `permanentRedirect`             | 在變更或事件後重新導向使用者 | 伺服器元件、伺服器操作、路由處理器 | 308 (永久)                       |
| `useRouter`                     | 執行客戶端導航               | 客戶端元件中的事件處理器           | 不適用                           |
| `redirects` in `next.config.js` | 根據路徑重新導向傳入的請求   | `next.config.js` 檔案              | 307 (暫時性) 或 308 (永久)       |
| `NextResponse.redirect`         | 根據條件重新導向傳入的請求   | 中介軟體                           | 任何                             |

> 提供英文做參考
>
> 伺服器元件 : Server Components
>
> 伺服器操作 : Server Actions
>
> 路由處理器 : Route Handlers
>
> 客戶端元件中的事件處理器 : Event Handlers in Client Components
>
> 中介軟體 : Middleware

### `redirect` 函數

`redirect` 函數可以將使用者重新導向到另一個 URL。我們可以在 [伺服器元件](https://nextjs.org/docs/app/building-your-application/rendering/server-components)、[路由處理器](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) 和 [伺服器操作](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) 中呼叫 `redirect`。

`redirect` 通常在變更或事件後使用。

例如，建立一篇文章：

app/actions.tsx

```tsx
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createPost(id: string) {
  try {
    // Call database
  } catch (error) {
    // Handle errors
  }

  revalidatePath("/posts"); // Update cached posts
  redirect(`/post/${id}`); // Navigate to the new post page
}
```

> 了解一下:
>
> - `redirect` 預設回傳 307 (暫時性重新導向) 狀態碼。當在伺服器操作中使用時，回傳 303 (查看其他)，這通常用於在 POST 請求後重新導向到成功頁面。
> - `redirect` 內部會拋出錯誤，因此應在 `try/catch` 區塊之外呼叫。
> - `redirect` 可以在客戶端元件的渲染過程中呼叫，但不能在事件處理器中呼叫。我們可以使用 [`useRouter` hook](https://nextjs.org/docs/app/building-your-application/routing/redirecting#userouter-hook) 來代替。
> - `redirect` 也接受絕對 URL，並且可以用於重新導向到外部連結。
> - 如果想在渲染過程之前進行重新導向，請使用 [`next.config.js`](https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirects-in-nextconfigjs) 或 [中介軟體](https://nextjs.org/docs/app/building-your-application/routing/redirecting#nextresponseredirect-in-middleware)。

請參考 [`redirect` API 參考](https://nextjs.org/docs/app/api-reference/functions/redirect) 以獲取更多資訊。

### `permanentRedirect` 函數

`permanentRedirect` 函數可以**永久性**地將使用者重新導向到另一個 URL。我們可以在 [伺服器元件](https://nextjs.org/docs/app/building-your-application/rendering/server-components)、[路由處理器](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) 和 [伺服器操作](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) 中呼叫 `permanentRedirect`。

`permanentRedirect` 通常在變更或事件後使用，該事件改變了實體的標準 URL，例如在使用者更改使用者名稱後更新使用者的資料頁面 URL：

app/actions.ts

```tsx
"use server";

import { permanentRedirect } from "next/navigation";
import { revalidateTag } from "next/cache";

export async function updateUsername(username: string, formData: FormData) {
  try {
    // Call database
  } catch (error) {
    // Handle errors
  }

  revalidateTag("username"); // Update all references to the username
  permanentRedirect(`/profile/${username}`); // Navigate to the new user profile
}
```

> 了解一下:
>
> - `permanentRedirect` 預設回傳 308 (永久重新導向) 狀態碼。
> - `permanentRedirect` 也接受絕對 URL，並且可以用於重新導向到外部連結。
> - 如果想在渲染過程之前進行重新導向，請使用 [`next.config.js`](https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirects-in-nextconfigjs) 或 [中介軟體](https://nextjs.org/docs/app/building-your-application/routing/redirecting#nextresponseredirect-in-middleware)。

請參考 [`permanentRedirect` API 參考](https://nextjs.org/docs/app/api-reference/functions/permanentRedirect) 以獲取更多資訊。

### `useRouter()` hook

如果需要在客戶端元件中的事件處理器內進行重新導向，可以使用 `useRouter` hook 的 `push` 方法。例如：

app/page.tsx

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <button type='button' onClick={() => router.push("/dashboard")}>
      Dashboard
    </button>
  );
}
```

> 了解一下:
>
> - 如果不需要程式化地為使用者導航，應該直接使用 [`<Link>`](https://nextjs.org/docs/app/api-reference/components/link) 元件。

請參考 [`useRouter` API 參考](https://nextjs.org/docs/app/api-reference/functions/use-router) 以獲取更多資訊。

### `next.config.js` 中的 `redirects`

`next.config.js` 文件中的 `redirects` 選項允許我們將傳入的請求路徑重新導向到不同的目的地路徑。當我們更改頁面的 URL 結構或有預先知道的重新導向列表時，這非常有用。

`redirects` 支援 [路徑](https://nextjs.org/docs/app/api-reference/next-config-js/redirects#path-matching)、[標頭、cookie 和查詢匹配](https://nextjs.org/docs/app/api-reference/next-config-js/redirects#header-cookie-and-query-matching) (path, header, cookie, and query matching)，提供根據傳入請求進行重新導向的靈活性。

要使用 `redirects`，請將選項添加到我們的 `next.config.js` 文件中：

next.config.js

```tsx
module.exports = {
  async redirects() {
    return [
      // 基本重新導向
      {
        source: "/about",
        destination: "/",
        permanent: true,
      },
      // 通配符路徑匹配
      {
        source: "/blog/:slug",
        destination: "/news/:slug",
        permanent: true,
      },
    ];
  },
};
```

請參考 [`redirects` API 參考](https://nextjs.org/docs/app/api-reference/next-config-js/redirects) 以獲取更多資訊。

> 了解一下:
>
> - `redirects` 可以回傳 307 (暫時性重新導向) 或 308 (永久重新導向) 狀態碼，具體取決於 `permanent` 選項。
> - `redirects` 可能在平台上有限制。例如，在 Vercel 上，有 1,024 次重新導向的限制。要管理大量的重新導向 (1000+)，可以考慮使用 [中介軟體](https://nextjs.org/docs/app/building-your-application/routing/redirecting#nextresponseredirect-in-middleware) 來處理。

### `NextResponse.redirect` 中介軟體

`NextResponse.redirect` 是 [中介軟體](https://nextjs.org/docs/app/building-your-application/routing/redirecting#nextresponseredirect-in-middleware) 的一部分，可以根據條件重新導向傳入的請求。中介軟體是一種強大的工具，可以在請求處理管道的早期進行處理和轉換。

app/middleware.ts

```tsx
import { NextResponse } from "next/server";

export function middleware(request: Request) {
  const url = request.nextUrl.clone();

  if (url.pathname === "/old-path") {
    return NextResponse.redirect(new URL("/new-path", request.url));
  }

  return NextResponse.next();
}
```

請參考 [`NextResponse.redirect` API 參考](https://nextjs.org/docs/app/api-reference/next-response#redirect) 以獲取更多資訊。

如果要大規模管理重新導向（超過 1000 個），可以參考 [Managing redirects at scale (advanced)](https://nextjs.org/docs/app/building-your-application/routing/redirecting#managing-redirects-at-scale-advanced)，這裡就先不贅述。

## 7. **路由群組（Route Groups）**

- **App Router**：允許路由群組以便更好地組織和共享路由配置。
- **Page Router**：不支援路由群組。路由是單獨定義在 `/pages` 目錄內。

說明：

在 `app` 目錄中，巢狀的資料夾通常會對應到 URL 路徑。但我們可以透過將資料夾標記為 **路由群組** ，來避免該資料夾被包含在路由的 URL 路徑中。

這樣可以將路由段和專案檔案組織成邏輯群組，而不會影響 URL 路徑結構。

路由群組適用於：

- [將路由組織成群組](https://nextjs.org/docs/app/building-your-application/routing/route-groups#organize-routes-without-affecting-the-url-path)，例如按網站部分、用途或團隊。
- 在相同的路由段層級啟用[巢狀佈局](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates)：
  - [在相同段中建立多個巢狀佈局，包括多個根佈局](https://nextjs.org/docs/app/building-your-application/routing/route-groups#creating-multiple-root-layouts)
  - [將佈局添加到常見段中的部分路由](https://nextjs.org/docs/app/building-your-application/routing/route-groups#opting-specific-segments-into-a-layout)

### 慣例

可以通過將資料夾的名稱包裹在括號中來建立路由群組：`(folderName)`

### 範例 - 組織路由而不影響 URL 路徑 (Organize routes without affecting the URL path)

為了組織路由而不影響 URL，建立一個群組來保持相關路由在一起。括號中的資料夾將會從 URL 中省略（例如 `(marketing)` 或 `(shop)`）。

![image](https://github.com/user-attachments/assets/cb415406-1862-4c85-8750-cb44f353c938)

即使 `(marketing)` 和 `(shop)` 內的路由共享相同的 URL 層次結構，我們仍可以透過在它們的資料夾內添加 `layout.js` 檔案來為每個群組建立不同的佈局。

![image](https://github.com/user-attachments/assets/fd851435-b128-497f-8460-782f5697fcf3)

### 範例 - 將特定段加入佈局 (Opting specific segments into a layout)

要將特定路由加入佈局，請建立一個新的路由群組（例如 `(shop)`），並將共享相同佈局的路由移入該群組（例如 `account` 和 `cart`）。群組外的路由將不會共享此佈局（例如 `checkout`）。

![image](https://github.com/user-attachments/assets/027afbdc-f24f-471b-991f-9257a58606f4)

### 範例 - 建立多個根佈局 (Creating multiple root layouts)

要建立多個[根佈局](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates#root-layout-required)，請移除頂層的 `layout.js` 檔案，並在每個路由群組內添加 `layout.js` 檔案。這對於將應用程式劃分為具有完全不同 UI 或體驗的部分非常有用。每個根佈局需要添加 `<html>` 和 `<body>` 標籤。

![image](https://github.com/user-attachments/assets/8be449ad-1272-4bfb-a045-fdbc569f7405)

在上面的範例中，`(marketing)` 和 `(shop)` 各自擁有自己的根佈局。

> 注意：
>
> - 路由群組的命名除了組織作用外，沒有其他特殊意義。它們不會影響 URL 路徑。
> - 包含路由群組的路由**不應**解析為與其他路由相同的 URL 路徑。例如，由於路由群組不影響 URL 結構，`(marketing)/about/page.js` 和 `(shop)/about/page.js` 都會解析為 `/about`，並導致錯誤。
> - 如果我們在沒有頂層 `layout.js` 檔案的情況下使用多個根佈局，那麼首頁 `page.js` 檔案應該定義在其中一個路由群組中，例如：`app/(marketing)/page.js`。
> - **跨多個根佈局** 的導航將導致**整頁載入**（而不是客戶端導航）。例如，從使用 `app/(shop)/layout.js` 的 `/cart` 導航到使用 `app/(marketing)/layout.js` 的 `/blog` 會導致整頁載入。這**僅適用於**多個根佈局。

## 8. **專案組織（Project Organization）**

- **App Router**：鼓勵更模組化和有組織的檔案結構，將相關的元件、路由和佈局組合在一起，因此 App Router 更適合大型應用程式的組織。
- **Page Router**：具有較扁平的檔案結構，所有路由都在 `/pages` 目錄中定義。

說明：

除了[路由資料夾和檔案慣例](https://nextjs.org/docs/getting-started/project-structure#app-routing-conventions) (routing folder and file conventions)之外，Next.js 對於如何組織和放置專案檔案並無特定要求。

本小節介紹了可以用來組織專案的預設行為及功能。

- [預設情況下的安全共置](https://nextjs.org/docs/app/building-your-application/routing/colocation#safe-colocation-by-default)
- [專案組織功能](https://nextjs.org/docs/app/building-your-application/routing/colocation#project-organization-features)
- [專案組織策略](https://nextjs.org/docs/app/building-your-application/routing/colocation#project-organization-strategies)

### 預設情況下的安全共置 (Safe colocation by default)

在 `app` 資料夾中，[巢狀資料夾層次結構](https://nextjs.org/docs/app/building-your-application/routing#route-segments) 定義了路由結構。

每個資料夾代表一個路由段 (route segment)，並對應於 URL 路徑中的相應段 (segment)。

然而，即使路由結構是通過資料夾定義的，除非在路由段中新增 `page.js` 或 `route.js` 檔案，否則該路由**無法公開訪問**。

![image](https://github.com/user-attachments/assets/688e8034-c42f-443b-8994-ccf6ae9a2277)

而且，即使某個路由已公開訪問，只有 `page.js` 或 `route.js` 回傳的內容會被傳送到客戶端。

![image](https://github.com/user-attachments/assets/ff646af0-e2f8-492c-adca-7b41d5da24d8)

這意味著專案檔案可以安全地共置在 `app` 目錄中的路由段內，而不會意外成為可路由的 (routable)。

![image](https://github.com/user-attachments/assets/496b3c66-814d-4df4-9b02-4b90e6cbc88d)

> 值得注意的是：
>
> - 這與 `pages` 目錄不同，`pages` 中的任何檔案都被視為路由。
> - 雖然**可以**將專案檔案共置在 `app` 目錄中，但**不必**這樣做。如果我們想要，也是可以[將它們保存在 `app` 目錄外](https://nextjs.org/docs/app/building-your-application/routing/colocation#store-project-files-outside-of-app)。

### 專案組織功能

Next.js 提供了多項功能來幫助我們組織專案。

#### 私人資料夾 (Private Folders)

私人資料夾可以通過在資料夾前加上底線來建立：`_folderName`

這表示該資料夾是私人實作細節，不應被路由系統考慮，因此**將該資料夾及其所有子資料夾**排除在路由之外。

![image](https://github.com/user-attachments/assets/770632d6-1427-499a-bad4-4b9d614e636b)

由於 `app` 目錄中的檔案可以[預設情況下安全共置](https://nextjs.org/docs/app/building-your-application/routing/colocation#safe-colocation-by-default)，因此不需要使用私人資料夾來共置。

然而，私人資料夾對於以下情況可能很有用：

- 將 UI 邏輯與路由邏輯分開。
- 在專案和 Next.js 生態系統中一致地組織內部檔案。
- 在程式碼編輯器中對檔案進行分類和分組。
- 避免與未來 Next.js 檔案約定可能發生的命名衝突。

> 值得注意的是：
>
> - 雖然這不是框架規定，但也可以考慮使用相同的底線模式將私人資料夾外的檔案標記為「私人」。
> - 可以透過在資料夾名稱前加上 `%5F`（底線的 URL 編碼形式）前綴來建立以底線開頭的 URL 段：`%5FfolderName`。
> - 如果不使用私人資料夾，了解 Next.js [特殊檔案慣例](https://nextjs.org/docs/getting-started/project-structure#routing-files) 對於防止意外的命名衝突會很有幫助。

#### 路由群組 (Route groups)

路由群組可以通過將資料夾包裹在括號中建立：`(folderName)`

這表示該資料夾是為了組織用途，**不應包含**在路由的 URL 路徑中。

![image](https://github.com/user-attachments/assets/29491c46-f485-49e3-9097-abe0df094734)

路由群組對於以下情況很有用：

- [按組織路由進行分組](https://nextjs.org/docs/app/building-your-application/routing/route-groups#organize-routes-without-affecting-the-url-path)，例如按網站部分、意圖或團隊劃分。
- 在相同的路由段層級啟用巢狀佈局：
  - [在相同段中建立多個巢狀佈局，包括多個根佈局](https://nextjs.org/docs/app/building-your-application/routing/route-groups#creating-multiple-root-layouts)
  - [在共同段中的部分路由加入佈局](https://nextjs.org/docs/app/building-your-application/routing/route-groups#opting-specific-segments-into-a-layout)

#### `src` 目錄

Next.js 支援將應用程式程式碼（包括 `app`）儲存在可選的 [`src` 目錄](https://nextjs.org/docs/app/building-your-application/configuring/src-directory)中。這樣可以將應用程式程式碼與專案配置檔案分開，後者主要位於專案的根目錄。

![image](https://github.com/user-attachments/assets/e19c7c5a-b7ad-4891-93c2-ff3a35b83aeb)

#### 模組路徑別名 (Module Path Aliases)

Next.js 支援[模組路徑別名](https://nextjs.org/docs/app/building-your-application/configuring/absolute-imports-and-module-aliases)，這使得在深度巢狀的專案檔案中讀取和維護匯入更加容易。

app/dashboard/settings/analytics/page.js

```jsx
// before
import { Button } from "../../../components/button";

// after
import { Button } from "@/components/button";
```

### 專案組織策略

在 Next.js 專案中，如何組織自己的檔案和資料夾沒有對或錯之分。

以下部分列出了一些非常高水準的常見策略概述。最簡單的結論是，選擇一個適合團隊的策略，並在專案中保持一致。

> 值得注意的是：在這裡的範例中使用 components 和 lib 資料夾作為泛指的佔位符，它們的命名對框架並無特別意義，專案可能使用其他資料夾如 ui、utils、hooks、styles 等等。

#### 將專案檔案儲存在 `app` 目錄外

這種策略將所有應用程式程式碼儲存在專案根目錄的共享資料夾中，並將 `app` 目錄純粹用於路由目的。

![image](https://github.com/user-attachments/assets/fb7499d9-776a-43fe-9190-f2f0ba9b3f96)

#### 將專案檔案儲存在 `app` 目錄內的頂層資料夾中

這種策略將所有應用程式程式碼儲存在 `app` 目錄根目錄中的共享資料夾中。

![image](https://github.com/user-attachments/assets/c41c7308-4fb1-4caa-abe7-aced31f1d043)

#### 根據功能或路由拆分專案檔案

此策略將全域共用的應用程式程式碼儲存在根目錄的 `app` 資料夾中，並將更特定的應用程式程式碼**拆分**到使用它們的路由段中。

![image](https://github.com/user-attachments/assets/11c3f54b-5f6b-45cf-9366-c19421d63c53)

## 9. **動態路由（Dynamic Routes）**

- **App Router**：透過目錄結構中的 `[param]` 語法支援動態路由，並且可以處理更複雜的巢狀動態路由。
- **Page Router**：同樣支援動態路由，使用 `/pages` 目錄中的 `[param].js` 檔案。

說明：兩者皆支援動態路由，但 **App Router** 可能在支援巢狀動態路由方面更具優勢。

介紹：
當我們無法事先知道確切的路徑名稱，且希望從動態資料中建立路由時，我們可以使用動態路徑段，這些路徑段會在請求時填充，或是在建置期間[預先渲染](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#generating-static-params)。

### 約定

可以通過將資料夾的名稱用方括號包裹來建立動態路徑段：`[folderName]`。例如，`[id]` 或 `[slug]`。

動態路徑段會作為 `params` 屬性傳遞給 [`layout`](https://nextjs.org/docs/app/api-reference/file-conventions/layout)、[`page`](https://nextjs.org/docs/app/api-reference/file-conventions/page)、[`route`](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) 和 [`generateMetadata`](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function) 函數。

### 範例

例如，一個部落格可以包含如下路由 `app/blog/[slug]/page.js`，其中 `[slug]` 是部落格文章的動態路徑段。

`app/blog/[slug]/page.tsx`

```tsx
export default function Page({ params }: { params: { slug: string } }) {
  return <div>My Post: {params.slug}</div>;
}
```

| 路由                      | 範例網址  | `params`        |
| ------------------------- | --------- | --------------- |
| `app/blog/[slug]/page.js` | `/blog/a` | `{ slug: 'a' }` |
| `app/blog/[slug]/page.js` | `/blog/b` | `{ slug: 'b' }` |
| `app/blog/[slug]/page.js` | `/blog/c` | `{ slug: 'c' }` |

請參閱 [generateStaticParams()](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#generating-static-params) 頁面，以了解如何生成此路徑段的參數。

> 注意：動態路徑段相當於 pages 目錄中的動態路由。

### 生成靜態參數

`generateStaticParams` 函數可以與[動態路徑段](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)結合使用，以在建置期間[靜態生成](https://nextjs.org/docs/app/building-your-application/rendering/server-components#static-rendering-default)路由，而非在請求時動態生成。

`app/blog/[slug]/page.tsx`

```tsx
export async function generateStaticParams() {
  const posts = await fetch("https://.../posts").then((res) => res.json());

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
```

`generateStaticParams` 函數的主要優點是其智慧資料擷取功能。如果在 `generateStaticParams` 函數內使用 `fetch` 請求獲取內容，這些請求會[自動記憶化](https://nextjs.org/docs/app/building-your-application/caching#request-memoization)。這意味著跨多個 `generateStaticParams`、佈局和頁面的相同參數 `fetch` 請求只會執行一次，從而縮短建置時間。

如果我們要從 `pages` 目錄遷移，可以參考[遷移指南](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#dynamic-paths-getstaticpaths)。

欲了解更多資訊和進階用法，請參閱 [`generateStaticParams` 伺服器函數文檔](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)。

### 捕獲所有路徑段

動態路徑段可以透過在方括號內添加省略號來擴展為**捕獲所有**後續路徑段：`[...folderName]`。

例如，`app/shop/[...slug]/page.js` 將匹配 `/shop/clothes`，也會匹配 `/shop/clothes/tops`、`/shop/clothes/tops/t-shirts` 等等。

| 路由                         | 範例網址      | `params`                    |
| ---------------------------- | ------------- | --------------------------- |
| `app/shop/[...slug]/page.js` | `/shop/a`     | `{ slug: ['a'] }`           |
| `app/shop/[...slug]/page.js` | `/shop/a/b`   | `{ slug: ['a', 'b'] }`      |
| `app/shop/[...slug]/page.js` | `/shop/a/b/c` | `{ slug: ['a', 'b', 'c'] }` |

### 可選捕獲所有路徑段

捕獲所有路徑段可以透過將參數包在雙重方括號內來設為**可選**：`[[...folderName]]`。

例如，`app/shop/[[...slug]]/page.js` 不僅會匹配 `/shop`，還會匹配 `/shop/clothes`、`/shop/clothes/tops`、`/shop/clothes/tops/t-shirts`。

**捕獲所有**和**可選捕獲所有**路徑段的區別在於使用可選時，沒有參數的路由也會匹配（如上述範例中的 `/shop`）。

| 路由                           | 範例網址      | `params`                    |
| ------------------------------ | ------------- | --------------------------- |
| `app/shop/[[...slug]]/page.js` | `/shop`       | `{}`                        |
| `app/shop/[[...slug]]/page.js` | `/shop/a`     | `{ slug: ['a'] }`           |
| `app/shop/[[...slug]]/page.js` | `/shop/a/b`   | `{ slug: ['a', 'b'] }`      |
| `app/shop/[[...slug]]/page.js` | `/shop/a/b/c` | `{ slug: ['a', 'b', 'c'] }` |

### TypeScript

當使用 TypeScript 時，我們可以根據配置的路徑段為 `params` 添加類型。

`app/blog/[slug]/page.tsx`

```tsx
export default function Page({ params }: { params: { slug: string } }) {
  return <h1>My Page</h1>;
}
```

| 路由                                | `params` 類型定義                        |
| ----------------------------------- | ---------------------------------------- |
| `app/blog/[slug]/page.js`           | `{ slug: string }`                       |
| `app/shop/[...slug]/page.js`        | `{ slug: string[] }`                     |
| `app/shop/[[...slug]]/page.js`      | `{ slug?: string[] }`                    |
| `app/[categoryId]/[itemId]/page.js` | `{ categoryId: string, itemId: string }` |

> 注意：這可能會在未來由 TypeScript 插件自動完成。

## 10. **平行路由（Parallel Routes）**

- **App Router**：原生支援平行路由，允許同時渲染多個路由，對需要同時渲染多個路由的複雜應用程式有利。
- **Page Router**：不直接支援平行路由；要實現類似效果，需要更複雜的自訂實作。

說明：

平行路由允許我們在相同的佈局 (layout) 內同時或有條件地渲染一個或多個頁面。這對於應用程式中高度動態的部分非常有用，例如儀表板 (dashboards) 和社交網站的動態牆 (feeds)。

例如，在儀表板上，我們可以使用平行路由同時渲染 `team` 和 `analytics` 頁面：

![image](https://github.com/user-attachments/assets/db19743d-a8f5-4350-b0f6-47328332c203)

### 插槽 (Slots)

平行路由是使用命名的 **插槽（slots）** 來建立的。定義插槽的方式是： `@folder` 。例如，下列的檔案結構定義了兩個插槽：`@analytics` 和 `@team`：

![image](https://github.com/user-attachments/assets/28238ec4-2da2-4f51-9cea-b447ba49afb7)

插槽會作為 props 傳遞給共用的父佈局。對於上面的例子，`app/layout.js` 中的元件現在接受 `@analytics` 和 `@team` 插槽的 props，並可以將它們與 `children` prop 並行渲染：

app/layout.tsx

```tsx
export default function Layout({ children, team, analytics }: { children: React.ReactNode; analytics: React.ReactNode; team: React.ReactNode }) {
  return (
    <>
      {children}
      {team}
      {analytics}
    </>
  );
}
```

然而，插槽**不是**[路由段](https://nextjs.org/docs/app/building-your-application/routing#route-segments)，並不會影響 URL 結構。例如，對於 `/@analytics/views`，URL 將會是 `/views`，因為 `@analytics` 是一個插槽。

> 值得注意：
>
> - `children` prop 是一個隱式插槽，不需要對應到一個資料夾。這意味著 `app/page.js` 等同於 `app/@children/page.js`。

### 活動狀態和導航 (Active state and navigation)

預設情況下，Next.js 會追蹤每個插槽的活動*狀態*（或子頁面）。然而，插槽中渲染的內容將取決於導航的類型：

- **[軟導航](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#5-soft-navigation) (Soft Navigation)**：在客戶端導航期間，Next.js 會進行[部分渲染](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#4-partial-rendering)，更改插槽內的子頁面，同時保持其他插槽的活動子頁面，即使它們不符合當前的 URL。
- **硬導航 (Hard Navigation)**：在全頁載入（瀏覽器刷新）後，Next.js 無法確定不符合當前 URL 的插槽的活動狀態。相反，它將為未匹配的插槽渲染一個 [`default.js`](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#defaultjs) 文件，或者如果不存在 `default.js`，則會顯示 `404`。

> 值得注意：
>
> - 未匹配路由的 `404` 有助於確保我們不會意外地在沒有計畫要渲染平行路由的頁面上進行渲染。

#### `default.js`

可以定義一個 `default.js` 檔案作為初次載入或全頁重新載入時未匹配插槽的備援渲染。

注意以下資料夾結構，`@team` 插槽有一個 `/settings` 頁面，但 `@analytics` 沒有。

![image](https://github.com/user-attachments/assets/40b1f17f-81a3-451f-bc4a-9a87c20732f2)

當導航到 `/settings` 時，`@team` 插槽將渲染 `/settings` 頁面，同時保持 `@analytics` 插槽的當前活動頁面。

刷新時，Next.js 會為 `@analytics` 渲染一個 `default.js`。如果 `default.js` 不存在，則會顯示 `404`。

另外，由於 `children` 是一個隱式插槽，當 Next.js 無法恢復父頁面的活動狀態時，我們還需要建立一個 `default.js` 文件來作為 `children` 的備援渲染。

#### `useSelectedLayoutSegment(s)`

[`useSelectedLayoutSegment`](https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segment) 和 [`useSelectedLayoutSegments`](https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segments) 都接受一個 `parallelRoutesKey` 參數，這讓我們可以讀取插槽內的活動路由段。

app/layout.tsx

```tsx
"use client";

import { useSelectedLayoutSegment } from "next/navigation";

export default function Layout({ auth }: { auth: React.ReactNode }) {
  const loginSegment = useSelectedLayoutSegment("auth");
  // ...
}
```

當使用者導航到 `app/@auth/login`（或在 URL 欄中輸入 `/login`）時，`loginSegment` 將等於字串 `"login"`。

### 範例 - 條件路由

可以使用平行路由來根據特定條件（如使用者角色）有條件地渲染路由。例如，為 `/admin` 或 `/user` 角色渲染不同的儀表板頁面：

![image](https://github.com/user-attachments/assets/24a4d83d-77f1-40c0-808a-572d25d0074a)

app/dashboard/layout.tsx

```tsx
import { checkUserRole } from "@/lib/auth";

export default function Layout({ user, admin }: { user: React.ReactNode; admin: React.ReactNode }) {
  const role = checkUserRole();
  return <>{role === "admin" ? admin : user}</>;
}
```

### 範例 - 分頁群組 (Tab Groups)

可以在插槽內添加一個 `layout`，以允許使用者獨立導航該插槽。這對於建立分頁（Tabs）非常有用。

例如，`@analytics` 插槽有兩個子頁面：`/page-views` 和 `/visitors`。

![image](https://github.com/user-attachments/assets/d299fca4-cc5b-434a-a1ae-5ceb6fadfa8c)

在 `@analytics` 中，建立一個 [`layout`](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates) 檔案來在兩個頁面之間共用這些分頁：

app/@analytics/layout.tsx

```tsx
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Link href='/page-views'>Page Views</Link>
        <Link href='/visitors'>Visitors</Link>
      </nav>
      <div>{children}</div>
    </>
  );
}
```

### 範例 - 彈窗 (Modals)

平行路由可以與[攔截路由](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes) (Intercepting Routes) 一起使用，以建立支援深度連結的彈窗。這使我們能解決構建彈窗時的常見挑戰，例如：

- 使彈窗內容能夠**通過 URL 進行分享**。
- 當頁面刷新時，**保留上下文**，而不是關閉彈窗。
- **在向後導航時關閉彈窗**，而不是回到上一個路由。
- **在向前導航時重新打開彈窗**。

考慮以下的 UI 模式，使用者可以透過客戶端導航從佈局中打開登入彈窗，或者訪問單獨的 `/login` 頁面：

![image](https://github.com/user-attachments/assets/96904fae-19f7-46ea-bab3-0f5b659feba9)

要實現此模式，首先建立一個渲染**主要**登入頁面的 `/login` 路由。

![image](https://github.com/user-attachments/assets/3f4086f1-e7a5-48dd-add3-d3ceea22f8ee)

app/login/page.tsx

```tsx
import { Login } from "@/app/ui/login";

export default function Page() {
  return <Login />;
}
```

然後，在 `@auth` 插槽中，新增一個回傳 `null` 的 [`default.js`](https://nextjs.org/docs/app/api-reference/file-conventions/default) 檔案。這樣可以確保當彈窗未啟動時，彈窗不會被渲染。

app/@auth/default.tsx

```tsx
export default function Default() {
  return "...";
}
```

在 `@auth` 插槽內，透過更新 `/(.)login` 資料夾來攔截 `/login` 路由。將 `<Modal>` 元件及其子元素導入 `/(.)login/page.tsx` 檔案中：

app/@auth/(.)login/page.tsx

```tsx
import { Modal } from "@/app/ui/modal";
import { Login } from "@/app/ui/login";

export default function Page() {
  return (
    <Modal>
      <Login />
    </Modal>
  );
}
```

> 值得注意：
>
> - 用來攔截路由的命名規則（例如 `(.)`）可參考[攔截路由命名規則](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes#convention)。
> - 通過將 `<Modal>` 功能與彈窗內容（`<Login>`）分開，我們可以確保彈窗內的任何內容（如[表單](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#forms)）都是伺服器元件。參考[混合使用客戶端和伺服器元件](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#supported-pattern-passing-server-components-to-client-components-as-props)了解更多資訊。

#### 開啟彈窗

現在，我們可以借助 Next.js router 來開啟和關閉彈窗。這確保當彈窗開啟時，URL 會正確更新，並且在向前或向後導航時也能保持一致。

要開啟彈窗，將 `@auth` slot 作為一個 prop 傳遞給父佈局，並將它與 `children` prop 一起渲染。

app/layout.tsx

```tsx
import Link from "next/link";

export default function Layout({ auth, children }: { auth: React.ReactNode; children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Link href='/login'>Open modal</Link>
      </nav>
      <div>{auth}</div>
      <div>{children}</div>
    </>
  );
}
```

當使用者點擊 `<Link>` 時，彈窗會開啟，而不會導航到 `/login` 頁面。然而，在刷新或初次載入時，導航到 `/login` 會將使用者帶到主登入頁面。

#### 關閉彈窗

可以透過呼叫 `router.back()` 或使用 `Link` 元件來關閉彈窗。

app/ui/modal.tsx

```tsx
"use client";

import { useRouter } from "next/navigation";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => {
          router.back();
        }}
      >
        Close modal
      </button>
      <div>{children}</div>
    </>
  );
}
```

當使用 `Link` 元件導航到不再應該渲染 `@auth` slot 的頁面時，我們需要確保平行路由匹配到一個回傳 `null` 的元件。例如，當導航回到根頁面時，我們建立一個 `@auth/page.tsx` 元件：

app/ui/modal.tsx

```tsx
import Link from "next/link";

export function Modal({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Link href='/'>Close modal</Link>
      <div>{children}</div>
    </>
  );
}
```

app/@auth/page.tsx

```tsx
export default function Page() {
  return "...";
}
```

或者，如果要導航到其他頁面（例如 `/foo`、`/foo/bar` 等），可以使用一個捕獲所有的 (catch-all) slot：

app/@auth/[...catchAll]/page.tsx

```tsx
export default function CatchAll() {
  return "...";
}
```

> 值得注意:
>
> - 我們在 `@auth` slot 中使用捕獲所有的路由 (catch-all route) 來關閉彈窗，這在前面 [活動狀態和導航](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#active-state-and-navigation) 小節中有提到。由於客戶端導航到不再匹配 slot 的路由時，slot 仍會保持可見，因此我們需要匹配到一個回傳 `null` 的路由來關閉彈窗。
> - 其他範例包括在畫廊 (gallery) 中開啟照片彈窗，同時擁有一個專門的 `/photo/[id]` 頁面，或在側邊彈窗中開啟購物車。
> - [查看一個範例](https://github.com/vercel-labs/nextgram)，使用攔截和平行路由實現彈窗。

### 範例 - 載入與錯誤 UI

平行路由可以獨立進行串流，讓我們為每個路由定義獨立的錯誤和載入狀態：

![image](https://github.com/user-attachments/assets/83d182d6-c0b3-4b91-8886-df2109679158)

詳細資訊請參考 [載入 UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming) 和 [錯誤處理](https://nextjs.org/docs/app/building-your-application/routing/error-handling) 文件。

## 11. **攔截路由（Intercepting Routes）**

- **App Router**：具有內建的路由攔截功能，可以進行自訂邏輯或處理。
- **Page Router**：沒有直接的路由攔截概念。類似的功能需要透過中介軟體或自訂元件手動實作。

說明：

**攔截路由**讓我們可以在當前的佈局中載入應用程式的其他部分的路由。這種路由模式在我們想顯示某個路由的內容，但不想讓使用者切換到不同的上下文 (context) 時非常有用。

例如，在一個動態消息中點擊一張照片時，可以在一個覆蓋在動態消息上的彈窗中顯示這張照片。在這種情況下，Next.js 攔截了 `/photo/123` 路由，隱藏了 URL，並將其覆蓋在 `/feed` 之上。

![image](https://github.com/user-attachments/assets/7e60416c-b41b-483c-b003-1a3bbfd21c61)

然而，當透過點擊可分享的 URL 或重新整理頁面來導航到這張照片時，應該渲染整個照片頁面，而不是彈窗。不應該發生路由攔截。

![image](https://github.com/user-attachments/assets/f96e9971-4429-41ba-aabc-1628b1ae8db9)

### 約定 (Convention)

攔截路由可以使用 **`(..)` 約定**來定義，這與相對路徑的**約定 `../`** 類似，但針對的是段 (segments)。

可以使用：

- `(.)` 來匹配**相同層級**的路由段
- `(..)` 來匹配**上一層**的路由段
- `(..)(..)` 來匹配**上兩層**的路由段
- `(...)` 來匹配從 `app` 目錄**根目錄**開始的路由段

例如，可以透過在 `feed` 段 (segment) 中建立一個 `(..)photo` 目錄來攔截 `photo` 段。

![image](https://github.com/user-attachments/assets/6a1dc4ee-2704-4a63-844c-c8396368541f)

> 注意：`(..)` 約定是基於路由段 (_route segments_)，而非檔案系統 (file-system)。

> 補充說明：假設有個目錄結構如下
>
> ```
> app/
> │
> ├── dashboard/
> │   ├── page.tsx            (1)  // /dashboard
> │   ├── settings/
> │   │   ├── page.tsx        (2)  // /dashboard/settings
> │   │   └── profile/
> │   │       ├── page.tsx    (3)  // /dashboard/settings/profile
> │   └── @modals/
> │       ├── default.tsx     (4)  // 無攔截時不顯示
> │       ├── (.)profile/
> │       │   └── page.tsx    (5)  // 攔截 /dashboard/profile
> │       └── (..)profile/
> │           └── page.tsx    (6)  // 攔截 /profile
> │
> └── profile/
>     └── page.tsx            (7)  // /profile
> ```
>
> 攔截邏輯解析：
>
> 1. **`@modals/(.)profile/page.tsx`**
>    - **位置**：`app/dashboard/@modals/(.)profile/page.tsx`
>    - **作用**：攔截 **與 `@modals` 同一層級** 的 `profile` 路由片段，即 `/dashboard/profile`。
>    - **效果**：當使用者訪問 `/dashboard/profile` 時，會渲染 `@modals/(.)profile/page.tsx` 中定義的內容（例如彈窗），而不是 `app/dashboard/profile/page.tsx` 的原始內容。
> 2. **`@modals/(..)profile/page.tsx`**
>    - **位置**：`app/dashboard/@modals/(..)profile/page.tsx`
>    - **作用**：攔截 **比 `@modals` 高一層** 的 `profile` 路由片段，即 `/profile`。
>    - **效果**：當使用者訪問 `/profile` 時，會渲染 `@modals/(..)profile/page.tsx` 中定義的內容（例如彈窗），而不是 `app/profile/page.tsx` 的原始內容。

### 範例 - 彈窗 (Modals)

攔截路由可以與[平行路由](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes)一起使用來建立彈窗。這能解決建立彈窗時常見的挑戰，例如：

- 使彈窗內容**可以通過 URL 分享**。
- **保留上下文**，當頁面重新整理時，不會關閉彈窗。
- 在**向後導航**時關閉彈窗，而不是返回到前一個路由。
- 在**向前導航**時重新打開彈窗。

考慮以下的 UI 模式，使用者可以透過客戶端導航從相簿中打開照片彈窗，或直接從可分享的 URL 導航到照片頁面：

![image](https://github.com/user-attachments/assets/81b6954c-8254-4a7b-93cd-3cee805b3723)

在上述範例中，由於 `@modal` 是一個插槽而**不是**一個路由段，因此可以使用 `(..)` 匹配器來定義到 `photo` 段的路徑。這意味著儘管在檔案系統中 `photo` 路由比彈窗高出兩個層級，但在路由段層級中僅比彈窗高出一個層級。

請參考[平行路由](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#modals)文件提供的逐步範例，或查看[圖片畫廊範例](https://github.com/vercel-labs/nextgram)。

> 重要提示：
>
> - 其他範例可能包括在頂部導航欄中打開登入彈窗，同時也有專用的 `/login` 頁面，或在側邊彈窗中打開購物車。

## 12. **路由處理程式（Route Handlers）**

- **App Router**：支援自訂路由處理程式，可以管理路由或 HTTP 方法的特定邏輯。
- **Page Router**：不直接支援路由處理程式；處理邏輯通常嵌入在頁面元件中。

說明：

路由處理器 (Route Handlers) 允許我們使用 Web [Request](https://developer.mozilla.org/docs/Web/API/Request) 和 [Response](https://developer.mozilla.org/docs/Web/API/Response) API，為特定路由建立自定義的請求處理器。

![image](https://github.com/user-attachments/assets/4bfdd0d4-5bb7-4c5a-99ef-b7fde300af8d)

> 注意：路由處理器僅在 app 目錄內可用。它們相當於 pages 目錄中的 [API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)，這意味著不需要同時使用 API Routes 和路由處理器。

### 慣例

路由處理器是在 `app` 目錄內的 [`route.js|ts` 檔案](https://nextjs.org/docs/app/api-reference/file-conventions/route)中定義的：

app/api/route.ts

```tsx
export async function GET(request: Request) {}
```

路由處理器可以像 `page.js` 和 `layout.js` 一樣嵌套在 `app` 目錄的任何位置。但在同一個路由段層級下，**不能**同時存在 `route.js` 和 `page.js` 檔案。

#### 支援的 HTTP 方法

支援以下 [HTTP 方法](https://developer.mozilla.org/docs/Web/HTTP/Methods)：`GET`、`POST`、`PUT`、`PATCH`、`DELETE`、`HEAD` 和 `OPTIONS`。如果調用了不支援的方法，Next.js 會回傳 `405 Method Not Allowed` 回應。

#### 擴展的 `NextRequest` 和 `NextResponse` API

除了支援原生的 [Request](https://developer.mozilla.org/docs/Web/API/Request) 和 [Response](https://developer.mozilla.org/docs/Web/API/Response) API 之外，Next.js 還通過 [`NextRequest`](https://nextjs.org/docs/app/api-reference/functions/next-request) 和 [`NextResponse`](https://nextjs.org/docs/app/api-reference/functions/next-response) 進行擴展，為進階使用情境提供方便的輔助工具。

### 行為 - 快取

路由處理器預設不會快取。不過，也可以選擇為 `GET` 方法啟用快取。要這麼做，請在路由處理器檔案中使用[路由配置選項](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic)，例如 `export const dynamic = 'force-static'`。

app/items/route.ts

```tsx
export const dynamic = "force-static";

export async function GET() {
  const res = await fetch("<https://data.mongodb-api.com/>...", {
    headers: {
      "Content-Type": "application/json",
      "API-Key": process.env.DATA_API_KEY,
    },
  });
  const data = await res.json();

  return Response.json({ data });
}
```

### 行為 - 特殊路由處理器

像是 [`sitemap.ts`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)、[`opengraph-image.tsx`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)、[`icon.tsx`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons) 以及其他[中繼資料檔案](https://nextjs.org/docs/app/api-reference/file-conventions/metadata) 等特殊路由處理器，預設會保持靜態，除非它們使用了動態函式或動態配置選項。

### 行為 - 路由解析

`route` 可以視為最低層級的路由原語。

- 它們 **不會** 像 `page` 一樣參與佈局或客戶端導覽。
- 在與 `page.js` 相同的路由下，**不能** 同時存在 `route.js` 檔案。

每個 `route.js` 或 `page.js` 檔案都會接管該路由的所有 HTTP 請求方法。

app/page.js

```jsx
export default function Page() {
  return <h1>Hello, Next.js!</h1>;
}

// ❌ 衝突
// `app/route.js`
export async function POST(request) {}
```

以下範例展示了如何將路由處理器與其他 Next.js API 和功能結合使用。

### 範例 - 重新驗證快取資料

可以使用增量靜態再生 (ISR) [重新驗證快取資料](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)：

app/posts/route.ts

```tsx
export const revalidate = 60;

export async function GET() {
  let data = await fetch("<https://api.vercel.app/blog>");
  let posts = await data.json();

  return Response.json(posts);
}
```

### 範例 - 動態函式 (Dynamic Functions)

路由處理器可以與 Next.js 的動態函式一起使用，例如 [`cookies`](https://nextjs.org/docs/app/api-reference/functions/cookies) 和 [`headers`](https://nextjs.org/docs/app/api-reference/functions/headers)。

#### Cookies

可以使用 `next/headers` 提供的 [`cookies`](https://nextjs.org/docs/app/api-reference/functions/cookies) 來讀取或設置 Cookie。此伺服器函式可以直接在路由處理器中調用，或者嵌套在另一個函式中。

另外，可以使用 [`Set-Cookie`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie) 標頭回傳一個新的 `Response`。

app/api/route.ts

```tsx
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  return new Response("Hello, Next.js!", {
    status: 200,
    headers: { "Set-Cookie": `token=${token.value}` },
  });
}
```

也可以使用底層的 Web API 從請求中讀取 Cookie ([`NextRequest`](https://nextjs.org/docs/app/api-reference/functions/next-request))：

app/api/route.ts

```tsx
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token");
}
```

#### 標頭 (Headers)

可以使用 `next/headers` 提供的 [`headers`](https://nextjs.org/docs/app/api-reference/functions/headers) 來讀取標頭。此伺服器函式可以直接在路由處理器中調用，或嵌套在另一個函式中。

這個 `headers` 實例是唯讀的。要設置標頭的話，需要回傳一個帶有新 `headers` 的新 `Response`。

app/api/route.ts

```tsx
import { headers } from "next/headers";

export async function GET(request: Request) {
  const headersList = headers();
  const referer = headersList.get("referer");

  return new Response("Hello, Next.js!", {
    status: 200,
    headers: { referer: referer },
  });
}
```

也可以使用底層的 Web API 從請求中讀取標頭 ([`NextRequest`](https://nextjs.org/docs/app/api-reference/functions/next-request))：

app/api/route.ts

```tsx
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
}
```

### 範例 - 重新導向 (Redirects)

app/api/route.ts

```tsx
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  redirect("<https://nextjs.org/>");
}
```

### 範例 - 動態路由段 (Dynamic Route Segments)

> 建議在繼續之前，先閱讀 定義路由 頁面。

路由處理器可以使用 [動態段](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes) 從動態資料中建立請求處理器。

app/items/[slug]/route.ts

```tsx
export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug; // 'a', 'b', or 'c'
}
```

| 路由                        | 範例 URL   | `params`        |
| --------------------------- | ---------- | --------------- |
| `app/items/[slug]/route.js` | `/items/a` | `{ slug: 'a' }` |
| `app/items/[slug]/route.js` | `/items/b` | `{ slug: 'b' }` |
| `app/items/[slug]/route.js` | `/items/c` | `{ slug: 'c' }` |

### 範例 - URL 查詢參數

傳遞給路由處理器的請求物件是 `NextRequest` 實例，它包含了一些[方便的額外方法](https://nextjs.org/docs/app/api-reference/functions/next-request#nexturl)，包括更容易處理查詢參數。

app/api/search/route.ts

```tsx
import { type NextRequest } from "next/server";

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  // query 在 /api/search?query=hello 時為 "hello"
}
```

### 範例 - 串流 (Streaming)

串流通常與大型語言模型 (LLMs) 一起使用，例如 OpenAI，用於生成 AI 內容。了解更多關於 [AI SDK](https://sdk.vercel.ai/docs/introduction) 的資訊。

app/api/chat/route.ts

```tsx
import { openai } from "@ai-sdk/openai";
import { StreamingTextResponse, streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = await streamText({
    model: openai("gpt-4-turbo"),
    messages,
  });

  return new StreamingTextResponse(result.toAIStream());
}
```

這些抽象層使用 Web API 來建立串流。我們也可以直接使用底層的 Web API。

app/api/route.ts

```tsx
// <https://developer.mozilla.org/docs/Web/API/ReadableStream#convert_async_iterator_to_stream>
function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

const encoder = new TextEncoder();

async function* makeIterator() {
  yield encoder.encode("<p>One</p>");
  await sleep(200);
  yield encoder.encode("<p>Two</p>");
  await sleep(200);
  yield encoder.encode("<p>Three</p>");
}

export async function GET() {
  const iterator = makeIterator();
  const stream = iteratorToStream(iterator);

  return new Response(stream);
}
```

### 範例 - 請求正文 (Request Body)

可以使用標準的 Web API 方法來讀取 `Request` 正文：

app/items/route.ts

```typescript
export async function POST(request: Request) {
  const res = await request.json();
  return Response.json({ res });
}
```

### 範例 - 表單資料 (Request Body FormData)

可以使用 `request.formData()` 函式來讀取 `FormData`：

app/items/route.ts

```typescript
export async function POST(request: Request) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  return Response.json({ name, email });
}
```

由於 `formData` 的資料都是字串，我們可能想使用 [`zod-form-data`](https://www.npmjs.com/zod-form-data) 來驗證請求並以我們偏好的格式（例如 `number`）取得資料。

### 範例 - 跨域資源共享 (CORS)

可以使用標準的 Web API 方法為特定的路由處理器設置 CORS 標頭：

app/api/route.ts

```typescript
export async function GET(request: Request) {
  return new Response("Hello, Next.js!", {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
```

> **值得知道**：
>
> - 若要為多個路由處理器添加 CORS 標頭，可以使用 [中介軟體 (Middleware)](https://nextjs.org/docs/app/building-your-application/routing/middleware#cors) 或 [`next.config.js` 檔案](https://nextjs.org/docs/app/api-reference/next-config-js/headers#cors)。
> - 或者，參考 [CORS 範例](https://github.com/vercel/examples/blob/main/edge-functions/cors/lib/cors.ts) 套件。

### 範例 - Webhooks

可以使用路由處理器來接收第三方服務的 Webhooks：

app/api/route.ts

```typescript
export async function POST(request: Request) {
  try {
    const text = await request.text();
    // 處理 Webhook 負載
  } catch (error) {
    return new Response(`Webhook error: ${error.message}`, {
      status: 400,
    });
  }

  return new Response("Success!", {
    status: 200,
  });
}
```

值得注意的是，與使用頁面路由的 API Routes 不同，我們不需要使用 `bodyParser` 來進行任何額外的配置。

### 範例 - 非 UI 回應 (Non-UI Responses)

可以使用路由處理器來回傳非 UI 內容。請注意， [`sitemap.xml`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#generating-a-sitemap-using-code-js-ts)、[`robots.txt`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots#generate-a-robots-file)、[`應用程式圖示`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#generate-icons-using-code-js-ts-tsx) 和 [Open Graph 圖像](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image) 都有內建支援。

app/rss.xml/route.ts

```typescript
export async function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>Next.js Documentation</title>
        <link>https://nextjs.org/docs</link>
        <description>The React Framework for the Web</description>
      </channel>
    </rss>`,
    {
      headers: {
        "Content-Type": "text/xml",
      },
    }
  );
}
```

### 範例 - 路由段配置選項 (Segment Config Options)

路由處理器使用與頁面和佈局相同的 [路由段配置](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)。

app/items/route.ts

```typescript
export const dynamic = "auto";
export const dynamicParams = true;
export const revalidate = false;
export const fetchCache = "auto";
export const runtime = "nodejs";
export const preferredRegion = "auto";
```

有關更多詳情，請參考 [API reference](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)。

## 13. **中介軟體（Middleware）**

- **App Router**：完全支援中介軟體功能來處理請求、修改回應以及在渲染前執行動作。
- **Page Router**：也支援中介軟體，但通常需要更多配置，因為中介軟體是在 `/pages/_middleware.js` 檔案中聲明的。

說明：

Middleware 允許我們在請求完成之前運行程式碼。然後，根據傳入的請求，我們可以透過重寫、重新導向、修改請求、回應標頭，或直接回應來修改回應內容。

Middleware 在快取內容和路由匹配之前運行。詳情請看後面會提到的匹配路徑。

### 使用案例

將 Middleware 整合到我們的應用程式中，可以顯著改善效能、安全性和使用者體驗。

一些 Middleware 特別有效的常見情境包括：

- **認證和授權 (Authentication and Authorization)：** 在授予對特定頁面或 API 路由的存取權之前，確保使用者身份並檢查會話 Cookie。
- **伺服器端重新導向 (Server-Side Redirects)：** 根據特定條件（例如語言環境、使用者角色）在伺服器層級重新導向使用者。
- **路徑重寫 (Path Rewriting)：** 透過動態重寫路徑至 API 路由或頁面來支援 A/B 測試、功能發布或傳統路徑。
- **機器人檢測 (Bot Detection)：** 透過檢測和阻擋機器人流量來保護我們的資源。
- **日誌記錄和分析 (Logging and Analytics)：** 在頁面或 API 處理之前捕捉和分析請求資料以獲得洞察。
- **功能標記 (Feature Flagging)：** 動態啟用或停用功能，以無縫進行功能發布或測試。

同樣重要的是，要認識到 Middleware 也可能不是最佳方法的情境。以下是需要注意的一些情境：

- 複雜的資料獲取和操作：Middleware 不適合用於直接資料獲取或操作，這些應該在路由處理器或伺服器端工具中進行。
- 繁重的計算任務：Middleware 應該輕量化並快速回應，否則可能會導致頁面載入延遲。繁重的計算任務或長時間執行的程序應該在專用的路由處理器中進行。
- 廣泛的會話 (Session) 管理：雖然 Middleware 可以處理基本的會話任務，但廣泛的會話管理應該由專用的認證服務或路由處理器管理。
- 直接的資料庫操作：不建議在 Middleware 中執行直接的資料庫操作。資料庫互動應該在路由處理器或伺服器端工具中進行。

### 約定

使用專案根目錄中的 `middleware.ts`（或 `.js`）檔案來定義 Middleware。例如，將其放置在與 `pages` 或 `app` 同一層級，或是（若適用）放置在 `src` 目錄內。

> 注意：雖然每個專案只支援一個 `middleware.ts` 檔案，但仍可以模組化地組織 Middleware 邏輯。將 Middleware 的功能拆分到單獨的 `.ts` 或 `.js` 檔案中，並在主要的 `middleware.ts` 檔案中匯入它們。這樣可以更簡潔地管理針對特定路由的 Middleware，並在 `middleware.ts` 中集中控制。強制使用單一 Middleware 檔案有助於簡化配置、避免潛在的衝突，並透過避免多層 Middleware 來優化效能。

### 範例

middleware.ts

```tsx
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL("/home", request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/about/:path*",
};
```

### 匹配路徑 (Matching Paths)

Middleware 將會在**專案中的每一個路由**上被觸發。鑑於此，使用匹配器 (matchers) 來精確地針對或排除特定路由是至關重要的。以下是執行順序：

1. `headers` 來自 `next.config.js`
2. `redirects` 來自 `next.config.js`
3. Middleware（`rewrites`、`redirects` 等）
4. `beforeFiles`（`rewrites`）來自 `next.config.js`
5. 檔案系統路由（`public/`、`_next/static/`、`pages/`、`app/` 等）
6. `afterFiles`（`rewrites`）來自 `next.config.js`
7. 動態路由（`/blog/[slug]`）
8. `fallback`（`rewrites`）來自 `next.config.js`

有兩種方式來定義 Middleware 運行的路徑：

1. [自訂匹配器設定](https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher) (Custom matcher config)
2. [條件語句](https://nextjs.org/docs/app/building-your-application/routing/middleware#conditional-statements) (Conditional statements)

#### 匹配器 (Matcher)

`matcher` 允許我們過濾 Middleware 以運行於特定的路徑上。

middleware.js

```jsx
export const config = {
  matcher: "/about/:path*",
};
```

我們可以使用陣列語法來匹配單一路徑或多個路徑：

middleware.js

```jsx
export const config = {
  matcher: ["/about/:path*", "/dashboard/:path*"],
};
```

`matcher` 設定支援完整的正規表達式，因此可以使用像是負向預測（negative lookaheads）或字符匹配。以下是一個負向預測的範例，用來匹配所有除了特定路徑之外的路徑：

middleware.js

```jsx
export const config = {
  matcher: [
    /*
     * 匹配所有請求路徑，除了以下開頭的路徑：
     * - api（API 路由）
     * - _next/static（靜態檔案）
     * - _next/image（影像優化檔案）
     * - favicon.ico、sitemap.xml、robots.txt（後設資料檔案）
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
```

我們也可以透過使用 `missing` 或 `has` 陣列，或是兩者的組合，來繞過某些請求的 Middleware：

middleware.js

```jsx
export const config = {
  matcher: [
    /*
     * 匹配所有請求路徑，除了以下開頭的路徑：
     * - api（API 路由）
     * - _next/static（靜態檔案）
     * - _next/image（影像優化檔案）
     * - favicon.ico、sitemap.xml、robots.txt（後設資料檔案）
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },

    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      has: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },

    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      has: [{ type: "header", key: "x-present" }],
      missing: [{ type: "header", key: "x-missing", value: "prefetch" }],
    },
  ],
};
```

> 值得注意： `matcher`值需要是常數，以便在建置期間進行靜態分析。像變數這樣的動態值會被忽略。

配置的匹配器 (Configured matchers)：

1. **必須**以 `/` 開頭
2. 可以包括命名參數：`/about/:path` 匹配 `/about/a` 和 `/about/b`，但不匹配 `/about/a/c`
3. 可以對命名參數進行修飾（以 `:` 開頭）：`/about/:path*` 匹配 `/about/a/b/c`，因為 `*` 表示「零個或多個」。`?` 表示「零個或一個」，`+` 表示「一個或多個」
4. 可以使用括號中的正規表達式：`/about/(.*)` 等同於 `/about/:path*`

詳細資訊請參閱 [path-to-regexp](https://github.com/pillarjs/path-to-regexp#path-to-regexp-1) 文件。

> 值得注意：為了向下相容，Next.js 始終將 `/public` 視為 `/public/index`。因此，`/public/:path` 的匹配器會匹配。

#### 條件語句 (Conditional Statements)

middleware.ts

```tsx
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/about")) {
    return NextResponse.rewrite(new URL("/about-2", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.rewrite(new URL("/dashboard/user", request.url));
  }
}
```

### NextResponse

`NextResponse` API 可以：

- 將進來的請求 `redirect` 到不同的 URL
- 通過顯示給定的 URL 來 `rewrite` 回應
- 為 API 路由、`getServerSideProps` 和 `rewrite` 目標設定請求標頭 (request headers)
- 設定回應的 cookies
- 設定回應的標頭

要從 Middleware 產生回應，可以：

1. `rewrite` 到產生回應的路由（[Page](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates) 或 [Route Handler](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)）
2. 直接回傳一個 `NextResponse`。請參考 [產生回應](https://nextjs.org/docs/app/building-your-application/routing/middleware#producing-a-response)

### 使用 Cookies

Cookies 是普通的標頭。在 `Request` 中，它們儲存在 `Cookie` 標頭中。在 `Response` 中，它們則在 `Set-Cookie` 標頭中。Next.js 提供了一個方便的方式來通過 `NextRequest` 和 `NextResponse` 上的 `cookies` 擴展來訪問和操作這些 cookies。

1. 對於進來的請求，`cookies` 提供以下方法：`get`、`getAll`、`set` 和 `delete` cookies。還可以使用 `has` 檢查 cookie 是否存在，或使用 `clear` 移除所有 cookies。
2. 對於發出的回應，`cookies` 也有 `get`、`getAll`、`set` 和 `delete` 方法。

middleware.ts

```tsx
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 假設進來的請求中有一個 "Cookie:nextjs=fast" 標頭
  // 使用 `RequestCookies` API 從請求中獲取 cookies
  let cookie = request.cookies.get("nextjs");
  console.log(cookie); // => { name: 'nextjs', value: 'fast', Path: '/' }
  const allCookies = request.cookies.getAll();
  console.log(allCookies); // => [{ name: 'nextjs', value: 'fast' }]

  request.cookies.has("nextjs"); // => true
  request.cookies.delete("nextjs");
  request.cookies.has("nextjs"); // => false

  // 使用 `ResponseCookies` API 在回應中設定 cookies
  const response = NextResponse.next();
  response.cookies.set("vercel", "fast");
  response.cookies.set({
    name: "vercel",
    value: "fast",
    path: "/",
  });
  cookie = response.cookies.get("vercel");
  console.log(cookie); // => { name: 'vercel', value: 'fast', Path: '/' }
  // 發出的回應將會有一個 `Set-Cookie:vercel=fast;path=/` 標頭。

  return response;
}
```

### 設定標頭 (Setting Headers)

可以使用 `NextResponse` API 設定請求和回應標頭（從 Next.js v13.0.0 開始支援設定 _請求_ 標頭）。

middleware.ts

```tsx
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Clone the request headers and set a new header `x-hello-from-middleware1`
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-hello-from-middleware1", "hello");

  // You can also set request headers in NextResponse.next
  const response = NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  });

  // Set a new response header `x-hello-from-middleware2`
  response.headers.set("x-hello-from-middleware2", "hello");
  return response;
}
```

> 值得知道：避免設定過大的標頭，因為這可能會導致  [431 Request Header Fields Too Large](https://developer.mozilla.org/docs/Web/HTTP/Status/431) 錯誤，這取決於後端網路伺服器配置。

#### CORS

可以在 Middleware 中設定 CORS 標頭，以允許跨來源請求，包括 [簡單請求](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests) 和 [預檢請求](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#preflighted_requests)。

middleware.ts

```tsx
import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = ["https://acme.com", "https://my-app.org"];

const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function middleware(request: NextRequest) {
  // Check the origin from the request
  const origin = request.headers.get("origin") ?? "";
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Handle preflighted requests
  const isPreflight = request.method === "OPTIONS";

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
      ...corsOptions,
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  // Handle simple requests
  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
```

> 值得知道： 可以在 [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#cors) 中為個別路由配置 CORS 標頭。

### 產生回應 (Producing a Response)

可以直接透過回傳 `Response` 或 `NextResponse` 實例來從 Middleware 中回應（從 [Next.js v13.1.0](https://nextjs.org/blog/next-13-1#nextjs-advanced-middleware) 開始支援）。

middleware.ts

```tsx
import type { NextRequest } from "next/server";
import { isAuthenticated } from "@lib/auth";

// 限制 Middleware 僅對以 `/api/` 開頭的路徑有效
export const config = {
  matcher: "/api/:function*",
};

export function middleware(request: NextRequest) {
  // 調用我們的認證函數來檢查請求
  if (!isAuthenticated(request)) {
    // 回應 JSON，表示錯誤消息
    return Response.json({ success: false, message: "authentication failed" }, { status: 401 });
  }
}
```

#### `waitUntil` 和 `NextFetchEvent`

`NextFetchEvent` 物件擴展了原生的 [`FetchEvent`](https://developer.mozilla.org/docs/Web/API/FetchEvent) 物件，並包含 [`waitUntil()`](https://developer.mozilla.org/docs/Web/API/ExtendableEvent/waitUntil) 方法。

`waitUntil()` 方法接受一個 promise 作為參數，並延長 Middleware 的生命周期直到該 promise 完成。這對於在背景中執行工作非常有用。

middleware.ts

```tsx
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

export function middleware(req: NextRequest, event: NextFetchEvent) {
  event.waitUntil(
    fetch("<https://my-analytics-platform.com>", {
      method: "POST",
      body: JSON.stringify({ pathname: req.nextUrl.pathname }),
    })
  );

  return NextResponse.next();
}
```

## 14. **國際化（Internationalization）**

- **App Router**：原生支援國際化 (i18n)，使處理多語言內容更容易。
- **Page Router**：也支援國際化，但通常需要在 `next.config.js` 中進行更多手動設置。

說明：

Next.js 能夠配置路由和內容渲染，以支援多種語言。讓網站適應不同的地區設定，包括翻譯內容（本地化）和國際化路由。

### 術語

- **Locale（地區設定）：** 一組語言和格式偏好的識別碼。這通常包括使用者的偏好語言，並可能包括其地理區域。
  - `en-US`：美國使用的英文
  - `nl-NL`：荷蘭使用的荷蘭語
  - `nl`：荷蘭語，沒有特定的區域

### 路由概覽

建議使用者瀏覽器中的語言偏好來選擇使用哪種地區設定。更改你偏好的語言將修改應用程式中傳入的 `Accept-Language` 標頭。

例如，使用以下庫，可以查看傳入的 `Request` 來根據 `Headers`、我們計畫支援的地區設定和預設地區設定來選擇要使用的地區設定。

middleware.js

```javascript
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

let headers = { "accept-language": "en-US,en;q=0.5" };
let languages = new Negotiator({ headers }).languages();
let locales = ["en-US", "nl-NL", "nl"];
let defaultLocale = "en-US";

match(languages, locales, defaultLocale); // -> 'en-US'
```

路由可以通過子路徑 (`/fr/products`) 或網域 (`my-site.fr/products`) 來實現國際化。有了這些資訊，現在可以在 [中介軟體 (Middleware)](https://nextjs.org/docs/app/building-your-application/routing/middleware) 中根據地區設定來重新導向使用者。

middleware.js

```javascript
import { NextResponse } from "next/server";

let locales = ['en-US', 'nl-NL', 'nl']

// 獲取偏好地區設定，可以類似上面的方法或使用庫
function getLocale(request) { ... }

export function middleware(request) {
// 檢查路徑名中是否有任何支援的地區設定
const { pathname } = request.nextUrl
const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

if (pathnameHasLocale) return

// 如果沒有地區設定，進行重新導向
const locale = getLocale(request)
request.nextUrl.pathname = `/${locale}${pathname}`
// 例如，傳入的請求是 /products
// 新的 URL 現在是 /en-US/products
return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
// 跳過所有內部路徑 (_next)
'/((?!_next).*)',
// 可選：僅在根目錄 (/) URL 上運行
// '/'
  ],
}
```

最後，確保 `app/` 內的所有特殊檔案都嵌套在 `app/[lang]` 下。這使得 Next.js 路由器可以動態處理路徑中的不同地區設定，並將 `lang` 參數轉發給每個佈局和頁面。例如：

app/[lang]/page.js

```javascript
// 你現在可以獲取當前的地區設定
// 例如，/en-US/products -> `lang` 是 "en-US"
export default async function Page({ params: { lang } }) {
  return ...
}
```

根佈局也可以嵌套在新資料夾中（例如 `app/[lang]/layout.js`）。

### 本地化 (Localization)

根據使用者偏好的地區設定更改顯示的內容（或稱本地化）並非 Next.js 特有。下面描述的模式可以在任何 Web 應用程式中使用。

假設我們希望在應用程式中支援英文和荷蘭文內容。我們可能會維護兩個不同的“字典”，這些字典是將某些鍵對應到本地化字串的物件。例如：

dictionaries/en.json

```json
{
  "products": {
    "cart": "Add to Cart"
  }
}
```

dictionaries/nl.json

```json
{
  "products": {
    "cart": "Toevoegen aan Winkelwagen"
  }
}
```

然後，我們可以建立一個 `getDictionary` 函式來載入請求地區設定的翻譯：

app/[lang]/dictionaries.js

```javascript
import "server-only";

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  nl: () => import("./dictionaries/nl.json").then((module) => module.default),
};

export const getDictionary = async (locale) => dictionaries[locale]();
```

根據當前選定的語言，我們可以在佈局或頁面中取得字典。

app/[lang]/page.js

```javascript
import { getDictionary } from "./dictionaries";

export default async function Page({ params: { lang } }) {
  const dict = await getDictionary(lang); // en
  return <button>{dict.products.cart}</button>; // Add to Cart
}
```

由於 `app/` 目錄中的所有佈局和頁面預設為 [伺服器端組件](https://nextjs.org/docs/app/building-your-application/rendering/server-components)，我們不需要擔心翻譯檔案的大小會影響客戶端的 JavaScript 包大小。這段代碼 **只會在伺服器上運行**，並且只會將生成的 HTML 發送到瀏覽器。

### 靜態生成 (Static Generation)

要為一組地區設定生成靜態路由，我們可以在任何頁面或佈局中使用 `generateStaticParams`。這可以是全域的，例如，在根佈局中：

app/[lang]/layout.js

```javascript
export async function generateStaticParams() {
  return [{ lang: "en-US" }, { lang: "de" }];
}

export default function Root({ children, params }) {
  return (
    <html lang={params.lang}>
      <body>{children}</body>
    </html>
  );
}
```

### 相關資源可供參考

- [最小化的 i18n 路由和翻譯](https://github.com/vercel/next.js/tree/canary/examples/app-dir-i18n-routing)
- [`next-intl`](https://next-intl-docs.vercel.app/docs/next-13)
- [`next-international`](https://github.com/QuiiBz/next-international)
- [`next-i18n-router`](https://github.com/i18nexus/next-i18n-router)
- [`paraglide-next`](https://inlang.com/m/osslbuzt/paraglide-next-i18n)
- [`lingui`](https://lingui.dev/)

# Data Fetching——資料獲取差異

在 Next.js 中，**Page Router** 和 **App Router** 的 **資料獲取** 方式有明顯差異，這是因為框架的進化。以下是它們的不同之處：

### Page Router

- **使用的函式**：`getStaticProps`，`getServerSideProps`，`getInitialProps`。
- **基於檔案的資料獲取**：資料獲取發生在頁面元件中（`pages` 目錄）使用這些特定的函式：
  - `getStaticProps`：在建置期間進行靜態資料獲取。
  - `getServerSideProps`：在每次請求時於伺服器端進行資料獲取。
  - `getInitialProps`：舊方法，允許在伺服器與客戶端進行資料獲取。
- **靜態與動態渲染**：頁面可以根據使用的函式，進行靜態生成或伺服器端渲染。
- **僅限於頁面**：這些函式只能在頁面元件中使用，無法用於其他部分如 `components/`。

### App Router

- **使用的函式**：`fetch`，`use`，`Suspense`，伺服器元件，並且 `getStaticProps` 被 **React Server Components（RSC）** 取代，來進行靜態與動態渲染。
- **基於元件的資料獲取**：資料可以在 `app` 目錄中的任何元件內進行獲取（不僅限於頁面元件）。
  - **伺服器元件**：在 App Router 中，元件預設為伺服器元件，允許直接在伺服器端進行資料獲取，而無需明確使用伺服器端函式。
  - **使用 `fetch` 進行資料獲取**：由於 App Router 更傾向於元件導向，可以在伺服器元件內使用 `fetch` 來進行資料獲取。
- **靜態與動態段**：App Router 允許在同一頁面（或路由段）內進行部分靜態生成與動態資料獲取。
- **內建 Suspense**：內建的 Suspense 邊界用來處理載入狀態，使得管理非同步資料獲取變得更容易。

### 主要差異總結：

| 功能              | Page Router                                               | App Router                         |
| ----------------- | --------------------------------------------------------- | ---------------------------------- |
| **資料獲取 API**  | `getStaticProps`，`getServerSideProps`，`getInitialProps` | 伺服器元件、`fetch`、Suspense 邊界 |
| **使用位置**      | 僅限於頁面（`pages` 目錄）                                | 任何元件（`app` 目錄）             |
| **伺服器元件**    | 不可用                                                    | 預設即為伺服器元件（RSC）          |
| **渲染方式**      | 根據函式進行靜態或伺服器端渲染                            | 結合靜態與動態渲染於元件內         |
| **Suspense 支援** | 需手動新增                                                | 內建用於處理非同步操作             |

接著介紹如何在 App Router 中進行資料獲取。

## 資料獲取與快取 (Data Fetching and Caching)

這是一個簡單的 Next.js 資料獲取範例：

app/page.tsx

```tsx
export default async function Page() {
  let data = await fetch("https://api.vercel.app/blog");
  let posts = await data.json();
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

此範例展示了在 React 伺服器端元件中，透過 `fetch` API 進行的基本伺服器端資料獲取。

- 可以進一步參考的資料：

  - [`fetch`](https://nextjs.org/docs/app/api-reference/functions/fetch)
  - React [`cache`](https://react.dev/reference/react/cache)
  - Next.js [`unstable_cache`](https://nextjs.org/docs/app/api-reference/functions/unstable_cache)

- 可以進一步參考的其他範例：
  - [Next.js Commerce](https://vercel.com/templates/next.js/nextjs-commerce)
  - [On-Demand ISR](https://on-demand-isr.vercel.app/)
  - [Next.js Forms](https://github.com/vercel/next.js/tree/canary/examples/next-forms)

### 範例 - 使用 `fetch` API 在伺服器端獲取資料

此元件將取得並顯示一份部落格文章列表。來自 `fetch` 的回應將自動被快取 (cache)。

app/page.tsx

```tsx
export default async function Page() {
  let data = await fetch("https://api.vercel.app/blog");
  let posts = await data.json();
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

如果在這條路由中沒有使用任何 [動態函數](https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering)，該頁面將在 `next build` 期間被預渲染為靜態頁面。然後可以通過[增量靜態再生 (ISR)](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration) 更新資料。

如果*不想* 快取 `fetch` 的回應，可以使用以下方式：

```tsx
let data = await fetch("<https://api.vercel.app/blog>", { cache: "no-store" });
```

### 範例 - 使用 ORM 或資料庫在伺服器端獲取資料

此元件將取得並顯示部落格文章列表。來自資料庫的回應將會被快取。

app/page.tsx

```tsx
import { db, posts } from "@/lib/db";

export default async function Page() {
  let allPosts = await db.select().from(posts);
  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

如果在這條路由中沒有使用任何 [動態函數](https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering)，該頁面將在 `next build` 期間被預渲染為靜態頁面。然後可以通過 [增量靜態再生](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)更新資料。

如果*不想* 快取資料庫的回應，可以在檔案中加入以下內容：

```tsx
export const dynamic = "force-dynamic";
```

然而，通常我們會使用 `cookies()`、`headers()` 或從 page props 讀取傳入的 `searchParams`，這會自動使頁面動態渲染。在這種情況下，我們*不需要* 明確地使用 `force-dynamic`。

### 範例 - 在客戶端獲取資料

建議首先嘗試在伺服器端獲取資料。

不過，某些情況下客戶端資料獲取是合理的。在這些情境中，可以在 `useEffect` 中手動呼叫 `fetch`（不推薦），或者依賴社群中的受歡迎 React 函式庫（例如 [SWR](https://swr.vercel.app/) 或 [React Query](https://tanstack.com/query/latest)）進行客戶端資料獲取。

app/page.tsx

```tsx
"use client";

import { useState, useEffect } from "react";

export function Posts() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      let res = await fetch("https://api.vercel.app/blog");
      let data = await res.json();
      setPosts(data);
    }
    fetchPosts();
  }, []);

  if (!posts) return <div>Loading...</div>;

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### 範例 - 使用 ORM 或資料庫進行資料快取

可以使用 `unstable_cache` API 快取回應，以便在執行 `next build` 時預渲染頁面。

app/page.tsx

```tsx
import { unstable_cache } from "next/cache";
import { db, posts } from "@/lib/db";

const getPosts = unstable_cache(
  async () => {
    return await db.select().from(posts);
  },
  ["posts"],
  { revalidate: 3600, tags: ["posts"] }
);

export default async function Page() {
  const allPosts = await getPosts();

  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

此範例將資料庫查詢結果快取 1 小時（3600 秒）。它也添加了 `posts` 的快取標籤，該標籤可以通過[增量靜態再生 (ISR)](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration) 無效化快取。

> 補充：
>
> 1. **快取結果**：這個例子將資料庫查詢的結果快取 1 小時（3600 秒）。這意味著一旦執行查詢並取得結果後，結果會被儲存在快取中。如果在接下來的一小時內再次請求相同的查詢，會從快取中取回結果，而不是重新查詢資料庫。這可以透過減少資料庫負擔並加快回應速度來提升效能。
> 2. **快取標籤**：快取被標記為「posts」。這是一種對快取資料進行標籤或分類的方式。透過標記快取，您可以更有效地管理它。例如，如果您想要使所有與「posts」相關的快取無效，您可以使用這個標籤來進行操作。
> 3. **使用 ISR 進行無效化**：增量靜態再生（ISR）是 Next.js 的一項功能，允許您逐步更新靜態內容。使用 ISR 時，您可以在不重建整個網站的情況下更新靜態頁面。當頁面被重新生成時，它會替換掉舊的快取版本。在這種情況下，快取標籤「posts」可以用來使相關頁面無效或更新。這確保了資料保持最新並反映最新的變更。
>
> 總之這個範例，資料庫查詢結果會被快取 1 小時，並且使用標籤來方便管理，並可以通過增量靜態再生來使快取失效或更新，以確保資料保持最新。

### 範例 - 重複使用跨多個函數的資料

Next.js 使用像是 `generateMetadata` 和 `generateStaticParams` 這樣的 API，我們會需要使用與 `page` 中相同的資料。

如果我們使用的是 `fetch`，請求會自動 [記憶化 (memoized)](https://nextjs.org/docs/app/building-your-application/caching#request-memoization)。這意味著我們可以安全地使用相同選項呼叫相同的 URL，而且只會發送一次請求。

app/page.tsx

```tsx
import { notFound } from "next/navigation";

interface Post {
  id: string;
  title: string;
  content: string;
}

async function getPost(id: string) {
  let res = await fetch(`https://api.example.com/posts/${id}`);
  let post: Post = await res.json();
  if (!post) notFound();
  return post;
}

export async function generateStaticParams() {
  let posts = await fetch("https://api.example.com/posts").then((res) => res.json());

  return posts.map((post: Post) => ({
    id: post.id,
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  let post = await getPost(params.id);

  return {
    title: post.title,
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  let post = await getPost(params.id);

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

如果我們*沒有* 使用 `fetch`，而是直接使用 ORM 或資料庫，我們可以將資料獲取包裹在 React 的 `cache` 函數中。這樣會去除重複 (de-duplicate)，只會發送一次查詢。

```tsx
import { cache } from "react";
import { db, posts, eq } from "@/lib/db"; // Example with Drizzle ORM
import { notFound } from "next/navigation";

export const getPost = cache(async (id) => {
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, parseInt(id)),
  });

  if (!post) notFound();
  return post;
});
```

### 範例 - 重新驗證快取資料

了解更多關於透過[增量靜態再生 (ISR)](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration) 重新驗證快取資料。

### 模式 - 平行與序列資料獲取 (Parallel and sequential data fetching)

在元件內進行資料獲取時，我們需要了解兩種資料獲取模式：平行與序列。

![image](https://github.com/user-attachments/assets/440ebf1a-c4ab-4d94-8e31-324043a9119f)

- **序列**：元件樹中的請求彼此依賴，這可能會導致較長的載入時間。
- **平行**：路由中的請求會立即啟動並同時載入資料，這可以縮短總的資料載入時間。

#### 序列資料獲取 (Sequential data fetching)

如果我們有巢狀的元件，每個元件都獲取自己的資料，那麼如果這些資料請求未被 [記憶化](https://nextjs.org/docs/app/building-your-application/caching#request-memoization)，資料獲取將會按序進行。

有時候我們可能希望使用這種模式，因為一個獲取依賴於另一個的結果。例如，`Playlists` 元件只有在 `Artist` 元件完成資料獲取後才開始獲取資料，因為 `Playlists` 依賴於 `artistID` 屬性：

app/artist/[username]/page.tsx

```tsx
export default async function Page({ params: { username } }: { params: { username: string } }) {
  // Get artist information
  const artist = await getArtist(username);

  return (
    <>
      <h1>{artist.name}</h1>
      {/* Show fallback UI while the Playlists component is loading */}
      <Suspense fallback={<div>Loading...</div>}>
        {/* Pass the artist ID to the Playlists component */}
        <Playlists artistID={artist.id} />
      </Suspense>
    </>
  );
}

async function Playlists({ artistID }: { artistID: string }) {
  // Use the artist ID to fetch playlists
  const playlists = await getArtistPlaylists(artistID);

  return (
    <ul>
      {playlists.map((playlist) => (
        <li key={playlist.id}>{playlist.name}</li>
      ))}
    </ul>
  );
}
```

我們可以使用 [`loading.js`](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)（針對路由段）或 [React `<Suspense>`](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense)（針對巢狀元件）來顯示即時的載入狀態，同時 React 正在串流結果。

這將防止整個路由因資料請求而被阻塞，使用者將能夠與已準備好的頁面部分互動。

#### 平行資料獲取 (Parallel Data Fetching)

預設情況下，佈局和頁面段落會平行渲染。這意味著請求會被平行啟動。

然而，由於 `async`/`await` 的特性，同一段落或元件中的 `await` 請求會阻塞其下方的請求。

為了平行獲取資料，我們可以將請求定義在使用這些資料的元件外部。這樣可以通過平行啟動兩個請求來節省時間，但直到兩個 promises 都被解析後，使用者才會看到渲染結果。

在以下範例中，`getArtist` 和 `getAlbums` 函數被定義在 `Page` 元件外部，並在元件內部使用 `Promise.all` 來啟動：

app/artist/[username]/page.tsx

```tsx
import Albums from "./albums";

async function getArtist(username: string) {
  const res = await fetch(`https://api.example.com/artist/${username}`);
  return res.json();
}

async function getAlbums(username: string) {
  const res = await fetch(`https://api.example.com/artist/${username}/albums`);
  return res.json();
}

export default async function Page({ params: { username } }: { params: { username: string } }) {
  const artistData = getArtist(username);
  const albumsData = getAlbums(username);

  // 平行啟動兩個請求
  const [artist, albums] = await Promise.all([artistData, albumsData]);

  return (
    <>
      <h1>{artist.name}</h1>
      <Albums list={albums} />
    </>
  );
}
```

此外，我們可以添加 [Suspense Boundary](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming) 來拆分渲染工作，並盡早顯示部分結果。

### 模式 - 預載資料 (Preloading Data)

另一種防止資料請求延遲的方式是使用 _預載_ 模式，通過建立一個實用函數 (utility function)，並在阻塞請求之前急切地調用它。

例如，`checkIsAvailable()` 阻止 `<Item/>` 渲染，因此我們可以在它之前調用 `preload()` 來急切地啟動 `<Item/>` 的資料依賴。當 `<Item/>` 渲染時，它的資料已經被獲取。

注意，`preload` 函數不會阻止 `checkIsAvailable()` 的執行。

components/Item.tsx

```tsx
import { getItem } from "@/utils/get-item";

export const preload = (id: string) => {
  // void 會評估給定的表達式並回傳 undefined
  void getItem(id);
};
export default async function Item({ id }: { id: string }) {
  const result = await getItem(id);
  // ...
}
```

> void 相關資訊可參考 [void operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void)

app/item/[id]/page.tsx

```tsx
import Item, { preload, checkIsAvailable } from "@/components/Item";

export default async function Page({ params: { id } }: { params: { id: string } }) {
  // 開始載入項目資料
  preload(id);
  // 執行另一個異步任務
  const isAvailable = await checkIsAvailable();

  return isAvailable ? <Item id={id} /> : null;
}
```

> 值得注意： "preload" 函數也可以有其他名稱，因為它是一種模式，而不是 API。

#### 將 React `cache` 、 `server-only` 與預載模式結合使用

我們可以結合 `cache` 函數、`preload` 模式和 `server-only` 套件來建立一個可以在整個應用程式中使用的資料獲取工具。

utils/get-item.ts

```tsx
import { cache } from "react";
import "server-only";

export const preload = (id: string) => {
  void getItem(id);
};

export const getItem = cache(async (id: string) => {
  // ...
});
```

使用這種方法，我們可以急切地獲取資料、快取回應，並保證這些資料獲取[只在伺服器端進行](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#keeping-server-only-code-out-of-the-client-environment)。

`utils/get-item` 的導出可以被 Layouts、Pages 或其他元件使用，讓它們控制何時獲取項目的資料。

> 值得注意：
>
> - 建議使用 [`server-only` 套件](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#keeping-server-only-code-out-of-the-client-environment) 確保伺服器端資料獲取函數不會在客戶端使用。

### 模式 - 防止敏感資料暴露給客戶端

建議使用 React 的 taint API、[`taintObjectReference`](https://react.dev/reference/react/experimental_taintObjectReference) 和 [`taintUniqueValue`](https://react.dev/reference/react/experimental_taintUniqueValue)，來防止整個物件實例 (instances) 或敏感的值被傳遞給客戶端。

要在應用程式中啟用 tainting，將 Next.js 配置中的 `experimental.taint` 選項設置為 `true`：

next.config.js

```jsx
module.exports = {
  experimental: {
    taint: true,
  },
};
```

然後將我們想要 taint 的物件或值傳遞給 `experimental_taintObjectReference` 或 `experimental_taintUniqueValue` 函數：

app/utils.ts

```tsx
import { queryDataFromDB } from "./api";
import { experimental_taintObjectReference, experimental_taintUniqueValue } from "react";

export async function getUserData() {
  const data = await queryDataFromDB();
  experimental_taintObjectReference("Do not pass the whole user object to the client", data);
  experimental_taintUniqueValue("Do not pass the user's address to the client", data, data.address);
  return data;
}
```

app/page.tsx

```tsx
import { getUserData } from "./data";

export async function Page() {
  const userData = getUserData();
  return (
    <ClientComponent
      user={userData} // this will cause an error because of taintObjectReference
      address={userData.address} // this will cause an error because of taintUniqueValue
    />
  );
}
```

## 伺服器操作與變更 (Server Actions and Mutations)

[伺服器操作](https://react.dev/reference/rsc/server-actions)是執行於伺服器的**非同步函數**。它們可以在伺服器和客戶端元件中被呼叫，用於處理表單提交 (form submissions) 和資料變更 (data mutations) 的操作，在 Next.js 應用程式中非常實用。

> 🎥 觀看: 了解更多關於伺服器操作的資料變更 → [YouTube (10 分鐘)](https://www.youtube.com/watch?si=cJZHlUu_jFhCzHUg&v=dDpZfOQBMaU&feature=youtu.be)。

### 約定

可以使用 React 的 [`"use server"`](https://react.dev/reference/react/use-server) 指令來定義伺服器操作。

可以在 `async` 函數的頂部使用該指令，將該函數標記為伺服器操作，或者在單獨的檔案頂部使用，將檔案中所有匯出的函數都標記為伺服器操作。

#### 伺服器元件

伺服器元件可以使用內嵌函數級別 (inline function level) 或模組級別 (module level) 的 `"use server"` 指令。要內嵌伺服器操作，請在函數的開頭加上 `"use server"`：

app/page.tsx

```tsx
export default function Page() {
  // 伺服器操作
  async function create() {
    "use server";
    // 資料變更
  }

  return "...";
}
```

#### 客戶端元件

要在客戶端元件中呼叫伺服器操作，請建立一個新檔案，並在檔案頂部加上 `"use server"` 指令。該檔案中的所有函數將被標記為伺服器操作，可在客戶端和伺服器元件中重複使用：

app/actions.ts

```tsx
"use server";

export async function create() {}
```

app/ui/button.tsx

```tsx
"use client";

import { create } from "@/app/actions";

export function Button() {
  return <Button onClick={create} />;
}
```

#### 以屬性傳遞操作 (Passing actions as props)

也可以將伺服器操作作為屬性 (props) 傳遞給客戶端元件：

```tsx
<ClientComponent updateItemAction={updateItem} />
```

app/client-component.tsx

```tsx
"use client";

export default function ClientComponent({ updateItemAction }: { updateItemAction: (formData: FormData) => void }) {
  return <form action={updateItemAction}>{/* ... */}</form>;
}
```

通常，Next.js 的 TypeScript plugin 會在 `client-component.tsx` 中標記 `updateItemAction`，因為它是一個函數，通常無法跨越客戶端與伺服器之間序列化。然而，名稱為 `action` 或以 `Action` 結尾的 props 會被假定為接收伺服器操作。這只是一種啟發式方法(heuristic)，因為 TypeScript plugin 實際上並不知道它是否接收到伺服器操作或普通函數。執行期間的型別檢查仍會確保我們不會意外地將一個普通函數傳遞給客戶端元件。

### 行為

- 可以使用 [`<form>` 元素](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#forms) 的 `action` 屬性來呼叫伺服器操作：
  - 伺服器元件預設支援漸進式增強 (progressive enhancement)，這意味著即使 JavaScript 尚未載入或已禁用，表單仍會提交。
  - 在客戶端元件中，當 JavaScript 尚未載入時，會將表單提交排入佇列，優先考慮客戶端的 hydration。
  - 在 hydration 完成後，表單提交時瀏覽器不會重新整理。
- 伺服器操作不限於 `<form>` 元素，還可以從事件處理器、`useEffect`、第三方函式庫 (third-party libraries) 和其他表單元素如 `<button>` 中呼叫。
- 伺服器操作與 Next.js 的 [快取與重新驗證](https://nextjs.org/docs/app/building-your-application/caching) 架構互相整合。當操作被呼叫時，Next.js 可以在一次伺服器請求中回傳更新的 UI 和新資料。
- 伺服器操作背後使用的是 `POST` 方法，且只有此 HTTP 方法可以呼叫它們。
- 伺服器操作的參數和回傳值必須是可由 React 序列化的。請參閱 React 文件中關於 [可序列化的參數和回傳值](https://react.dev/reference/react/use-server#serializable-parameters-and-return-values) 的列表。
- 伺服器操作是函數，因此可以在應用程式的任何地方重複使用。
- 伺服器操作會繼承頁面或佈局的 [執行環境](https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)。
- 伺服器操作會繼承頁面或佈局的 [路由段配置](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)，包括 `maxDuration` 等欄位。

### 範例 - 表單 (Forms)

React 擴展了 HTML [`<form>`](https://developer.mozilla.org/docs/Web/HTML/Element/form) 元素，以允許使用 `action` 屬性呼叫伺服器操作。

當伺服器操作在表單中被呼叫時，該操作會自動接收 [`FormData`](https://developer.mozilla.org/docs/Web/API/FormData/FormData) 物件。不需要使用 React 的 `useState` 來管理欄位，而是可以使用原生的 [`FormData` 方法](https://developer.mozilla.org/en-US/docs/Web/API/FormData#instance_methods) 來獲取資料：

app/invoices/page.tsx

```tsx
export default function Page() {
  async function createInvoice(formData: FormData) {
    "use server";

    const rawFormData = {
      customerId: formData.get("customerId"),
      amount: formData.get("amount"),
      status: formData.get("status"),
    };

    // 變更資料
    // 重新驗證快取
  }

  return <form action={createInvoice}>...</form>;
}
```

> 注意：
>
> - 範例: [具有載入和錯誤狀態的表單](https://github.com/vercel/next.js/tree/canary/examples/next-forms)
> - 當處理具有多個欄位的表單時，建議考慮使用 [`entries()`](https://developer.mozilla.org/en-US/docs/Web/API/FormData/entries) 方法與 JavaScript 的 [`Object.fromEntries()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries)。例如：`const rawFormData = Object.fromEntries(formData)`。需要注意的是，`formData` 會包含額外的 `$ACTION_` 屬性。
> - 查看 [React `<form>` 文件](https://react.dev/reference/react-dom/components/form#handle-form-submission-with-a-server-action) 以了解更多。

### 範例 - 傳遞額外參數 (Passing additional arguments)

可以使用 JavaScript 的 `bind` 方法來傳遞額外參數給伺服器操作。

app/client-component.tsx

```tsx
"use client";

import { updateUser } from "./actions";

export function UserProfile({ userId }: { userId: string }) {
  const updateUserWithId = updateUser.bind(null, userId);

  return (
    <form action={updateUserWithId}>
      <input type='text' name='name' />
      <button type='submit'>更新使用者名稱</button>
    </form>
  );
}
```

伺服器操作會接收 `userId` 參數，還有表單資料：

app/actions.js

```tsx
"use server";

export async function updateUser(userId, formData) {}
```

> 值得注意：
>
> - 另一種方法是將參數作為隱藏欄位傳遞給表單（例如 `<input type="hidden" name="userId" value={userId} />`）。但是，該值將會成為渲染的 HTML 的一部分，且不會被編碼 (encoded)。
> - `.bind` 在伺服器和客戶端元件中都可以使用，並且支援漸進式增強。

### 範例 - 巢狀表單元素 (Nested form elements)

我們也可以在巢狀於 `<form>` 內的元素中呼叫伺服器操作，例如 `<button>`、`<input type="submit">` 和 `<input type="image">`。這些元素接受 `formAction` 屬性或 [事件處理器](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#event-handlers)。

這在我們想在一個表單內呼叫多個伺服器操作時很有用。例如，我們可以建立一個特定的 `<button>` 元素來儲存草稿，並且提供發佈功能。更多資訊請參考 [React `<form>` 文件](https://react.dev/reference/react-dom/components/form#handling-multiple-submission-types)。

### 範例 - 程式化表單提交 (Programmatic form submission)

可以使用 [`requestSubmit()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/requestSubmit) 方法程式化觸發表單提交。例如，當使用者按下 `⌘` + `Enter` 鍵盤快捷鍵提交表單時，我們可以監聽 `onKeyDown` 事件：

app/entry.tsx

```tsx
"use client";

export function Entry() {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === "Enter" || e.key === "NumpadEnter")) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <div>
      <textarea name='entry' rows={20} required onKeyDown={handleKeyDown} />
    </div>
  );
}
```

這會觸發最近的 `<form>` 祖先元素的提交，並呼叫伺服器操作。

### 範例 - 伺服器端表單驗證 (Server-side form validation)

可以使用 HTML 屬性如 `required` 和 `type="email"` 來進行基本的客戶端表單驗證。

對於更進階的伺服器端驗證，我們可以使用像 [zod](https://zod.dev/) 這樣的函式庫來在變更資料前驗證表單欄位：

app/actions.ts

```tsx
"use server";

import { z } from "zod";

const schema = z.object({
  email: z.string({
    invalid_type_error: "無效的電子郵件",
  }),
});

export default async function createUser(formData: FormData) {
  const validatedFields = schema.safeParse({
    email: formData.get("email"),
  });

  // 如果表單資料無效，提前回傳
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 變更資料
}
```

一旦欄位在伺服器端完成驗證，我們可以在伺服器操作中回傳一個可序列化的物件，並使用 React 的 `useFormState` hook 來向使用者顯示訊息。

- 將操作傳遞給 `useFormState` 時，該操作的函數簽名會變更，會接收一個新的 `prevState` 或 `initialState` 參數作為第一個參數。
- `useFormState` 是一個 React hook，因此必須在客戶端元件中使用。

app/actions.ts

```tsx
"use server";

import { redirect } from "next/navigation";

export async function createUser(prevState: any, formData: FormData) {
  const res = await fetch("https://...");
  const json = await res.json();

  if (!res.ok) {
    return { message: "請輸入有效的電子郵件" };
  }

  redirect("/dashboard");
}
```

然後，我們可以將我們的伺服器操作傳遞給 `useFormState` hook，並使用回傳的 `state` 來顯示錯誤訊息。

app/ui/signup.tsx

```tsx
"use client";

import { useFormState } from "react";
import { createUser } from "@/app/actions";

const initialState = {
  message: "",
};

export function Signup() {
  const [state, formAction] = useFormState(createUser, initialState);

  return (
    <form action={formAction}>
      <label htmlFor='email'>電子郵件</label>
      <input type='text' id='email' name='email' required />
      {/* ... */}
      <p aria-live='polite'>{state?.message}</p>
      <button>註冊</button>
    </form>
  );
}
```

> 值得注意：
>
> - 這些範例使用 React 的 `useFormState` hook，它與 Next.js App Router 綁定。如果使用的是 React 19，請改用 `useActionState`。更多資訊請參考 [React 文件](https://react.dev/reference/react/useActionState)。

### 範例 - 等待中的狀態 (Pending states)

> 在變更資料之前，應該始終確保使用者有權限執行該操作。請參閱[身份驗證與授權](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#authentication-and-authorization)。

[`useFormStatus`](https://react.dev/reference/react-dom/hooks/useFormStatus) hook 提供一個 `pending` 布林值，可以在伺服器操作執行期間用來顯示載入中的指示。

app/submit-button.tsx

```tsx
"use client";

import { useFormStatus } from "react";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type='submit'>
      註冊
    </button>
  );
}
```

> 值得注意：
>
> - 在 React 19 中，`useFormStatus` 回傳的物件包含額外的鍵值，如 data、method 和 action。如果未使用 React 19，則只有 `pending` 鍵可用。
> - 在 React 19 中，`useActionState` 也包含一個 `pending` 鍵在回傳的狀態中。

### 範例 - 樂觀更新 (Optimistic updates)

可以使用 React 的 [`useOptimistic`](https://react.dev/reference/react/useOptimistic) hook，在伺服器操作完成前，樂觀地更新使用者介面，而不用等待回應：

app/page.tsx

```tsx
"use client";

import { useOptimistic } from "react";
import { send } from "./actions";

type Message = {
  message: string;
};

export function Thread({ messages }: { messages: Message[] }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic<Message[], string>(messages, (state, newMessage) => [
    ...state,
    { message: newMessage },
  ]);

  const formAction = async (formData) => {
    const message = formData.get("message") as string;
    addOptimisticMessage(message);
    await send(message);
  };

  return (
    <div>
      {optimisticMessages.map((m, i) => (
        <div key={i}>{m.message}</div>
      ))}
      <form action={formAction}>
        <input type='text' name='message' />
        <button type='submit'>發送</button>
      </form>
    </div>
  );
}
```

### 範例 - 事件處理器 (Event handlers)

雖然通常會在 `<form>` 元素中使用伺服器操作，但它們也可以透過事件處理器（例如 `onClick`）來呼叫。例如，要增加點讚次數：

app/like-button.tsx

```tsx
"use client";

import { incrementLike } from "./actions";
import { useState } from "react";

export default function LikeButton({ initialLikes }: { initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes);

  return (
    <>
      <p>總點讚數：{likes}</p>
      <button
        onClick={async () => {
          const updatedLikes = await incrementLike();
          setLikes(updatedLikes);
        }}
      >
        點讚
      </button>
    </>
  );
}
```

我們也可以將事件處理器添加到表單元素中，例如，在 `onChange` 時保存表單欄位的內容：

app/ui/edit-post.tsx

```tsx
"use client";

import { publishPost, saveDraft } from "./actions";

export default function EditPost() {
  return (
    <form action={publishPost}>
      <textarea
        name='content'
        onChange={async (e) => {
          await saveDraft(e.target.value);
        }}
      />
      <button type='submit'>發佈</button>
    </form>
  );
}
```

在這種情況下，當多個事件可能會在短時間內快速觸發時，建議使用 **防抖動 (debouncing)** 技術來避免不必要的伺服器操作呼叫。

### 範例 - `useEffect`

我們可以使用 React 的 [`useEffect`](https://react.dev/reference/react/useEffect) hook 來在元件掛載或相依性變更時呼叫伺服器操作。這對於依賴全域事件或需要自動觸發的資料變更很有幫助。例如，`onKeyDown` 用於應用程式的快捷鍵、無限滾動的交叉觀察者 hook，或在元件掛載時更新查看次數：

app/view-count.tsx

```tsx
"use client";

import { incrementViews } from "./actions";
import { useState, useEffect } from "react";

export default function ViewCount({ initialViews }: { initialViews: number }) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    const updateViews = async () => {
      const updatedViews = await incrementViews();
      setViews(updatedViews);
    };

    updateViews();
  }, []);

  return <p>總查看次數：{views}</p>;
}
```

記得考慮 `useEffect` 的[行為與注意事項](https://react.dev/reference/react/useEffect#caveats)。

### 範例 - 錯誤處理

當發生錯誤時，錯誤將會被最接近的 [`error.js`](https://nextjs.org/docs/app/building-your-application/routing/error-handling) 或客戶端的 `<Suspense>` 邊界捕捉。建議使用 `try/catch` 來回傳錯誤，讓我們的使用者介面來處理。

例如，我們的伺服器操作可能會處理建立新項目時的錯誤並回傳一則訊息：

app/actions.ts

```tsx
"use server";

export async function createTodo(prevState: any, formData: FormData) {
  try {
    // 變更資料
  } catch (e) {
    throw new Error("建立任務失敗");
  }
}
```

> 值得注意：
>
> - 除了拋出錯誤外，我們也可以回傳一個物件，供 `useFormState` 處理。請參閱[伺服器端驗證與錯誤處理](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#server-side-form-validation)。

### 範例 - 重新驗證資料

可以在伺服器操作中使用 [`revalidatePath`](https://nextjs.org/docs/app/api-reference/functions/revalidatePath) API 來重新驗證 [Next.js Cache](https://nextjs.org/docs/app/building-your-application/caching)：

app/actions.ts

```tsx
"use server";

import { revalidatePath } from "next/cache";

export async function createPost() {
  try {
    // ...
  } catch (error) {
    // ...
  }

  revalidatePath("/posts");
}
```

或使用 [`revalidateTag`](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) 來使特定資料抓取的快取標籤失效：

app/actions.ts

```tsx
"use server";

import { revalidateTag } from "next/cache";

export async function createPost() {
  try {
    // ...
  } catch (error) {
    // ...
  }

  revalidateTag("posts");
}
```

### 範例 - 重新導向

如果我們希望在伺服器操作完成後將使用者重新導向到其他路由，可以使用 [`redirect`](https://nextjs.org/docs/app/api-reference/functions/redirect) API。`redirect` 需要在 `try/catch` 區塊外部呼叫：

app/actions.ts

```tsx
"use server";

import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";

export async function createPost(id: string) {
  try {
    // ...
  } catch (error) {
    // ...
  }

  revalidateTag("posts"); // 更新快取的貼文
  redirect(`/post/${id}`); // 導向到新貼文頁面
}
```

### 範例 - Cookies

可以在伺服器操作中使用 [`cookies`](https://nextjs.org/docs/app/api-reference/functions/cookies) API 來 `取得`、`設定` 或 `刪除` cookies：

app/actions.ts

```tsx
"use server";

import { cookies } from "next/headers";

export async function exampleAction() {
  // 取得 cookie
  const value = cookies().get("name")?.value;

  // 設定 cookie
  cookies().set("name", "Delba");

  // 刪除 cookie
  cookies().delete("name");
}
```

請參閱[額外範例](https://nextjs.org/docs/app/api-reference/functions/cookies#deleting-cookies)來了解如何在伺服器操作中刪除 cookies。

### 安全性

#### 驗證與授權

應該將伺服器操作視為公開的 API 端點，並確保使用者有權執行該操作。例如：

app/actions.ts

```tsx
"use server";

import { auth } from "./lib";

export function addItem() {
  const { user } = auth();
  if (!user) {
    throw new Error("你必須登入才能執行此操作");
  }

  // ...
}
```

#### 閉包與加密

在元件內定義伺服器操作會建立一個[閉包](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)，操作可以存取外部函數的作用域。例如，`publish` 操作可以存取 `publishVersion` 變數：

app/page.tsx

```tsx
export default async function Page() {
  const publishVersion = await getLatestVersion();

  async function publish() {
    "use server";
    if (publishVersion !== await getLatestVersion()) {
      throw new Error('自按下發佈以來，版本已變更');
    }
    ...
  }

  return (
    <form>
      <button formAction={publish}>發佈</button>
    </form>
  );
}

```

當我們需要在渲染時捕獲資料的*快照 (snapshot)*（例如 `publishVersion`）以便稍後在呼叫操作時使用它，閉包非常有用。

然而，為了實現這一點，捕獲到的變數會在操作被呼叫時，從伺服器被發送到客戶端再回傳至伺服器。為了防止敏感資料暴露給客戶端，Next.js 會自動加密這些封閉變數 (closed-over variables)。每次建立 Next.js 應用程式時，都會為每個操作產生一個新的私鑰。這意味著只能針對特定的建置 (build) 呼叫操作。

> 值得注意： 不建議僅依賴加密來防止敏感值暴露給客戶端。相反，應該使用 React taint API 主動防止特定資料發送到客戶端。

#### 覆寫加密密鑰（進階）

當在跨多個伺服器上自我託管 (self-hosting) Next.js 應用程式時，每個伺服器實例最終可能會使用不同的加密密鑰，從而導致潛在的不一致性。

為了緩解這個情況，可以使用 `process.env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` 環境變數來覆寫加密密鑰。指定此變數可以確保我們的加密密鑰在各版本建置 (builds) 中保持一致，並且所有伺服器實例都使用相同的密鑰。

這是一個進階用例，適用於需要在多次部署中保持一致加密行為的應用程式。我們應該考慮標準的安全實踐，例如密鑰輪換 (key rotation) 與簽名 (signing)。

> 值得注意： 部署到 Vercel 的 Next.js 應用程式會自動處理這一點。

#### 允許的來源（進階）

由於伺服器操作可以在 `<form>` 元素中被呼叫，因此它們可能會遭受[跨站請求偽造 (CSRF) 攻擊](https://developer.mozilla.org/en-US/docs/Glossary/CSRF)。

在背後，伺服器操作使用 `POST` 方法，而只有這個 HTTP 方法可以呼叫它們。這在現代瀏覽器中防止了大多數 CSRF 漏洞，特別是[SameSite cookies](https://web.dev/articles/samesite-cookies-explained) 成為預設值的情況下。

作為額外的保護，Next.js 中的伺服器操作還會將 [Origin 標頭](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin) 與 [Host 標頭](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host)（或 `X-Forwarded-Host`）進行比較。如果它們不匹配，請求將被中止。換句話說，伺服器操作只能在與其所在頁面相同的主機上被呼叫。

對於使用反向代理或多層後端架構的大型應用程式（伺服器 API 與生產域名不同的情況），建議使用配置選項 [`serverActions.allowedOrigins`](https://nextjs.org/docs/app/api-reference/next-config-js/serverActions) 來指定一個安全來源的清單。該選項接受一個字串陣列。

next.config.js

```jsx
/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    serverActions: {
      allowedOrigins: ["my-proxy.com", "*.my-proxy.com"],
    },
  },
};
```

了解更多關於[安全性與伺服器操作](https://nextjs.org/blog/security-nextjs-server-components-actions)。

### 其他資源

想要了解更多資訊，請參閱以下 React 文件：

- [伺服器操作](https://react.dev/reference/rsc/server-actions)
- [`"use server"`](https://react.dev/reference/react/use-server)
- [`<form>`](https://react.dev/reference/react-dom/components/form)
- [`useFormStatus`](https://react.dev/reference/react-dom/hooks/useFormStatus)
- [`useActionState`](https://react.dev/reference/react/useActionState)
- [`useOptimistic`](https://react.dev/reference/react/useOptimistic)

## 增量靜態再生 (Incremental Static Regeneration, ISR)

增量靜態再生 (ISR) 讓我們可以：

- 更新靜態內容而不需要重建整個網站
- 透過預先渲染的靜態頁面來處理大多數請求，減少伺服器負載
- 確保自動為頁面添加適當的 `cache-control` 標頭
- 處理大量內容頁面而不需要很長的 `next build` 時間

這是一個最小的範例：

app/blog/[id]/page.tsx

```tsx
interface Post {
  id: string;
  title: string;
  content: string;
}

// Next.js will invalidate the cache when a
// request comes in, at most once every 60 seconds.
export const revalidate = 60;

// We'll prerender only the params from `generateStaticParams` at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
export const dynamicParams = true; // or false, to 404 on unknown paths

export async function generateStaticParams() {
  let posts: Post[] = await fetch("https://api.vercel.app/blog").then((res) => res.json());
  return posts.map((post) => ({
    id: post.id,
  }));
}

export default async function Page({ params }: { params: { id: string } }) {
  let post = await fetch(`https://api.vercel.app/blog/${params.id}`).then((res) => res.json());
  return (
    <main>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </main>
  );
}
```

這個範例的工作方式如下：

1. 在 `next build` 過程中，所有已知的部落格文章都會被生成（此範例中有 25 篇）
2. 對這些頁面的所有請求（例如 `/blog/1`）都會被快取，並且即時返回
3. 在 60 秒過後，下次的請求仍然會顯示快取的（過期）頁面
4. 快取會被無效化，並且新的頁面版本會在後台開始生成
5. 一旦成功生成，Next.js 會顯示並快取更新後的頁面
6. 如果請求了 `/blog/26`，Next.js 會按需生成並快取這個頁面

#### 參考範例：

- [Next.js Commerce](https://vercel.com/templates/next.js/nextjs-commerce)
- [On-Demand ISR](https://on-demand-isr.vercel.app/)
- [Next.js Forms](https://github.com/vercel/next.js/tree/canary/examples/next-forms)

#### 參考資料：

1. 路由段配置
   - [`revalidate`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate)
   - [`dynamicParams`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams)
2. 函數
   - [`revalidatePath`](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)
   - [`revalidateTag`](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)

### 範例

#### 基於時間的重新驗證

此範例會在 `/blog` 上抓取並顯示一份部落格文章列表。一小時後，當下次訪問該頁面時，快取將會失效。隨後，頁面會在背景中生成最新的部落格文章。

```tsx
export const revalidate = 3600; // 每小時失效一次

export default async function Page() {
  let data = await fetch("<https://api.vercel.app/blog>");
  let posts = await data.json();
  return (
    <main>
      <h1>部落格文章</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </main>
  );
}
```

建議設置較高的重新驗證時間。例如，一小時，而不是一秒。如果我們需要更精確的控制，考慮使用按需重新驗證。如果我們需要即時資料，考慮切換到[動態渲染](https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering)。

#### 使用 `revalidatePath` 的按需重新驗證 (On-demand revalidation)

如果需要更精確的重新驗證方式，可以使用 `revalidatePath` 函數按需使頁面快取失效。

例如，在新增文章後可以調用這個伺服器端動作。不論我們在伺服器元件中是使用 `fetch` 還是連接資料庫來獲取資料，這個方法都會清除整個路由的快取，讓伺服器元件重新獲取最新的資料。

```tsx
"use server";

import { revalidatePath } from "next/cache";

export async function createPost() {
  // 使 /posts 路由在快取中失效
  revalidatePath("/posts");
}
```

[查看範例](https://on-demand-isr.vercel.app/)並[探索源代碼](https://github.com/vercel/on-demand-isr)。

#### 使用 `revalidateTag` 的按需重新驗證 (On-demand revalidation)

對於大多數情況，建議重新驗證整個路徑。如果需要更細微的控制，可以使用 `revalidateTag` 函數。

例如，可以標記個別的 `fetch` 請求：

```tsx
export default async function Page() {
  let data = await fetch("<https://api.vercel.app/blog>", {
    next: { tags: ["posts"] },
  });
  let posts = await data.json();
  // ...
}
```

如果使用 ORM 或連接資料庫，可以使用 `unstable_cache`：

```tsx
import { unstable_cache } from "next/cache";
import { db, posts } from "@/lib/db";

const getCachedPosts = unstable_cache(
  async () => {
    return await db.select().from(posts);
  },
  ["posts"],
  { revalidate: 3600, tags: ["posts"] }
);

export default async function Page() {
  let posts = getCachedPosts();
  // ...
}
```

然後，可以在[伺服器動作](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)或[路由處理器](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)中使用 `revalidateTag`：

```tsx
"use server";

import { revalidateTag } from "next/cache";

export async function createPost() {
  // 使快取中所有標記為 'posts' 的資料失效
  revalidateTag("posts");
}
```

#### 處理未捕捉的例外狀況

如果在嘗試重新驗證資料時拋出錯誤，系統將繼續從快取中提供最後一次成功生成的資料。在下一次後續請求時，Next.js 會重新嘗試重新驗證資料。[了解更多錯誤處理](https://nextjs.org/docs/app/building-your-application/routing/error-handling)。

#### 自訂快取位置

快取和重新驗證頁面（增量靜態再生）使用相同的共享快取。當[部署到 Vercel](https://vercel.com/docs/incremental-static-regeneration?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)時，ISR 快取會自動保存到耐久性儲存裝置。

自我託管時，ISR 快取會儲存在 Next.js 伺服器的檔案系統（磁碟上）。這在使用 Pages 與 App Router 進行自我託管時會自動運作。

如果我們想將快取頁面和資料保存到耐久性儲存裝置，或者將快取共享給多個容器或 Next.js 應用程式實例，可以配置 Next.js 的快取位置。[了解更多](https://nextjs.org/docs/app/building-your-application/deploying#caching-and-isr)。

### 疑難排解

#### 在本地開發中調試快取資料 (Debugging cached data in local development)

如果使用 `fetch` API，可以添加額外的日誌來了解哪些請求是已快取或未快取的。[了解更多關於 `logging` 選項的資訊](https://nextjs.org/docs/app/api-reference/next-config-js/logging)。

`next.config.js`

```js
module.exports = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};
```

#### 驗證正確的生產環境行為

要驗證我們的頁面在生產環境中是否正確地被快取和重新驗證，我們可以透過執行 `next build` 然後 `next start` 來本地測試生產環境的 Next.js 伺服器。

這將允許我們測試 ISR 在生產環境中的行為。為了進一步調試，將以下環境變數添加到 `.env` 檔案中：

`.env`

```bash
NEXT_PRIVATE_DEBUG_CACHE=1

```

這將讓 Next.js 伺服器的控制台記錄 ISR 快取命中與未命中的情況。我們可以檢查輸出來查看哪些頁面在 `next build` 期間生成，以及如何在按需存取路徑時更新頁面。

### 注意事項

- ISR 僅支援使用 Node.js 執行環境（預設）。
- ISR 不支援[靜態導出](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)。
- 如果我們在一個靜態渲染的路由中有多個 `fetch` 請求，且每個請求都有不同的 `revalidate` 週期，則 ISR 會使用最短的時間。然而，這些 `revalidate` 週期仍會被[資料快取](https://nextjs.org/docs/app/building-your-application/caching#data-cache)尊重。
- 如果在路由中任何 `fetch` 請求的 `revalidate` 時間為 `0`，或明確設置 `no-store`，則該路由將會[動態渲染](https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering)。
- 中介軟體不會對按需 ISR 請求執行，因此中介軟體中的任何路徑重寫或邏輯將不會應用。請確保我們重新驗證的路徑是精確的。例如，`/post/1` 而不是重寫過的 `/post-1`。

### 版本歷史

| 版本      | 變更                                                                                                       |
| --------- | ---------------------------------------------------------------------------------------------------------- |
| `v14.1.0` | 自訂 `cacheHandler` 穩定版。                                                                               |
| `v13.0.0` | 引入 App Router。                                                                                          |
| `v12.2.0` | Pages Router：按需 ISR 穩定版。                                                                            |
| `v12.0.0` | Pages Router：[支援 Bot 感知的 ISR 後備機制](https://nextjs.org/blog/next-12#bot-aware-isr-fallback)新增。 |
| `v9.5.0`  | Pages Router：[ISR 穩定版推出](https://nextjs.org/blog/next-9-5)。                                         |

# 逐步遷移的方式

> 🎥 觀看: 了解如何逐步採用 App Router → [YouTube (16 分鐘)](https://www.youtube.com/watch?v=YQMSietiFm0)。

遷移到 App Router 可能是我們首次使用 Next.js 基於 React 的功能，如 Server Components、Suspense 等。當這些功能與 Next.js 的新功能結合使用時，例如 [特殊檔案](https://nextjs.org/docs/app/building-your-application/routing#file-conventions) 和 [佈局](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates#layouts)，遷移意味著我們需要學習新的概念、心智模型和行為改變。

建議將這些更新拆解為較小的步驟，從而減少綜合複雜度。**`app` 目錄有意設計成可以與 `pages` 目錄同時工作，允許逐頁遷移。**

- `app` 目錄支援巢狀路由 _與_ 佈局。[了解更多](https://nextjs.org/docs/app/building-your-application/routing)。
- 使用巢狀資料夾來[定義路由](https://nextjs.org/docs/app/building-your-application/routing/defining-routes)，並使用特殊的 `page.js` 檔案使路由段可公開訪問。[了解更多](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#step-4-migrating-pages)。
- [特殊檔案約定](https://nextjs.org/docs/app/building-your-application/routing#file-conventions) 用來為每個路由段建立 UI。最常見的特殊檔案是 `page.js` 和 `layout.js`。
  - 使用 `page.js` 來定義路由專屬的 UI。
  - 使用 `layout.js` 來定義多個路由共用的 UI。
  - 特殊檔案可以使用 `.js`、`.jsx` 或 `.tsx` 擴展名。
- 我們可以將其他檔案，如元件、樣式、測試等，放置在 `app` 目錄中。[了解更多](https://nextjs.org/docs/app/building-your-application/routing)。
- 像 `getServerSideProps` 和 `getStaticProps` 這樣的資料獲取函數已被替換為 [新的 API](https://nextjs.org/docs/app/building-your-application/data-fetching)，`getStaticPaths` 已被 [`generateStaticParams`](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) 取代。
- `pages/_app.js` 和 `pages/_document.js` 已被單一的 `app/layout.js` 根佈局取代。[了解更多](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates#root-layout-required)。
- `pages/_error.js` 已被更精細的 `error.js` 特殊檔案取代。[了解更多](https://nextjs.org/docs/app/building-your-application/routing/error-handling)。
- `pages/404.js` 已被 [`not-found.js`](https://nextjs.org/docs/app/api-reference/file-conventions/not-found) 檔案取代。
- `pages/api/*` API 路由已被 [`route.js`](https://nextjs.org/docs/app/api-reference/file-conventions/route)（路由處理器）特殊檔案取代。

## 第一步：建立 `app` 目錄

升級到最新的 Next.js 版本（需要 13.4 或更新版本）：

```bash
npm install next@latest
```

然後，在專案的根目錄（或 `src/` 目錄）中建立一個新的 `app` 目錄。

## 第二步：建立根佈局 (root layout)

在 `app` 目錄中建立一個新的 `app/layout.tsx` 檔案。這是一個 [根佈局](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates#root-layout-required)，將適用於 `app` 目錄內的所有路由。

app/layout.tsx

```tsx
export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
```

- `app` 目錄 **必須** 包含一個根佈局。
- 根佈局必須定義 `<html>` 和 `<body>` 標籤，因為 Next.js 不會自動建立它們。
- 根佈局取代了 `pages/_app.tsx` 和 `pages/_document.tsx` 檔案。
- 佈局檔案可以使用 `.js`、`.jsx` 或 `.tsx` 擴展名。

要管理 `<head>` HTML 元素，我們可以使用 [內建的 SEO 支援](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)：

app/layout.tsx

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Next.js",
};
```

### 遷移 `_document.js` 和 `_app.js`

如果我們已有 `_app` 或 `_document` 檔案，可以將內容（例如全域樣式）複製到根佈局 (`app/layout.tsx`) 中。`app/layout.tsx` 中的樣式 _不會_ 影響 `pages/*`。在遷移過程中，我們應保留 `_app` 和 `_document`，以防止 `pages/*` 路由出錯。當完全遷移完成後，我們可以安全地刪除它們。

如果我們正在使用任何 React Context providers，它們需要移動到 [客戶端元件](https://nextjs.org/docs/app/building-your-application/rendering/client-components) 中。

### 遷移 `getLayout()` 模式到佈局（可選）

Next.js 曾建議在 `pages` 目錄中為頁面元件添加 [屬性](https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts#layout-pattern#per-page-layouts)，以實現每頁佈局。這種模式可以透過 `app` 目錄中對 [巢狀路由](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates#layouts) 的內建支援來替代。

- 以下為前後對比範例：
  **遷移前**
  components/DashboardLayout.js

  ```tsx
  export default function DashboardLayout({ children }) {
    return (
      <div>
        <h2>My Dashboard</h2>
        {children}
      </div>
    );
  }
  ```

  pages/dashboard/index.js

  ```tsx
  import DashboardLayout from "../components/DashboardLayout";

  export default function Page() {
    return <p>My Page</p>;
  }

  Page.getLayout = function getLayout(page) {
    return <DashboardLayout>{page}</DashboardLayout>;
  };
  ```

  **遷移後**

  - 從 `pages/dashboard/index.js` 移除 `Page.getLayout` 屬性，並按照[頁面遷移步驟](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#step-4-migrating-pages)遷移到 `app` 目錄。
    app/dashboard/page.js
    ```tsx
    export default function Page() {
      return <p>My Page</p>;
    }
    ```
  - 將 `DashboardLayout` 的內容移到新的 [客戶端元件](https://nextjs.org/docs/app/building-your-application/rendering/client-components) 中，保留 `pages` 目錄的行為。
    app/dashboard/DashboardLayout.js

    ```tsx
    "use client"; // this directive should be at top of the file, before any imports.

    // This is a Client Component
    export default function DashboardLayout({ children }) {
      return (
        <div>
          <h2>My Dashboard</h2>
          {children}
        </div>
      );
    }
    ```

  - 將 `DashboardLayout` 引入到 `app` 目錄中的新的 `layout.js` 檔案中。
    app/dashboard/layout.js

    ```tsx
    import DashboardLayout from "./DashboardLayout";

    // This is a Server Component
    export default function Layout({ children }) {
      return <DashboardLayout>{children}</DashboardLayout>;
    }
    ```

  - You can incrementally move non-interactive parts of `DashboardLayout.js` (Client Component) into `layout.js` (Server Component) to reduce the amount of component JavaScript you send to the client.

## 第三步：遷移 `next/head`

在 `pages` 目錄中，`next/head` React 元件用於管理 `<head>` HTML 元素，如 `title` 和 `meta`。在 `app` 目錄中，`next/head` 被新的 [內建 SEO 支援](https://nextjs.org/docs/app/building-your-application/optimizing/metadata) 取代。

**遷移前：**

pages/index.tsx

```tsx
import Head from "next/head";

export default function Page() {
  return (
    <>
      <Head>
        <title>My page title</title>
      </Head>
    </>
  );
}
```

**遷移後：**

app/page.tsx

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Page Title",
};

export default function Page() {
  return "...";
}
```

[查看所有 metadata 選項](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)。

## 第四步：遷移 Pages

- 位於 [`app` 目錄](https://nextjs.org/docs/app/building-your-application/routing) 下的 Pages 預設為 [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)。這與 `pages` 目錄不同，`pages` 目錄中的 Pages 是 [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)。
- `app` 目錄的 [資料獲取](https://nextjs.org/docs/app/building-your-application/data-fetching) 方式已經改變，不再使用 `getServerSideProps`、`getStaticProps` 和 `getInitialProps`，取而代之的是更簡化的 API。
- `app` 目錄使用巢狀資料夾來 [定義路由](https://nextjs.org/docs/app/building-your-application/routing/defining-routes)，並且透過特殊的 `page.js` 檔案來使路由段對外公開。
  | `pages` 目錄 | `app` 目錄 | 路由 |
  | ---------------- | --------------------- | -------------- |
  | `index.js` | `page.js` | `/` |
  | `about.js` | `about/page.js` | `/about` |
  | `blog/[slug].js` | `blog/[slug]/page.js` | `/blog/post-1` |

**建議將頁面的遷移分為兩個主要步驟：**

- 1. 將預設導出的 Page 元件移動到新的 Client Component 中。
- 2. 將新的 Client Component 匯入 `app` 目錄中的 `page.js` 檔案中。

> 溫馨提醒：這是最容易的遷移路徑，因為它的行為與 pages 目錄最為相似。

### 1. 建立新的 Client Component

1. 在 `app` 目錄內建立一個新的檔案（例如 `app/home-page.tsx`），並導出一個 Client Component。要定義 Client Components，請在檔案頂部加入 `'use client'` 指令（必須在任何 `import` 之前）。
   - 與 Pages Router 類似，這裡有一個[優化步驟](https://nextjs.org/docs/app/building-your-application/rendering/client-components#full-page-load)，用於在初次載入頁面時預先渲染 Client Components 成靜態 HTML。
2. 將 `pages/index.js` 中預設導出的頁面元件移動到 `app/home-page.tsx`。

app/home-page.tsx

```tsx
"use client";

// 這是一個 Client Component（與 `pages` 目錄中的元件相同）
// 它透過 props 接收資料，並且有存取 state 和 effect 的權限，且在初次載入頁面時於伺服器上預先渲染。
export default function HomePage({ recentPosts }) {
  return (
    <div>
      {recentPosts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

### 2. 建立一個新的頁面

- 在 `app` 目錄中建立一個新的 `app/page.tsx` 檔案。此頁面預設為 Server Component。
- 導入 `home-page.tsx` 中的 Client Component。
- 如果之前在 `pages/index.js` 中進行了資料獲取操作，請將資料獲取邏輯直接移動到 Server Component，並使用新的 [資料獲取 API](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching)。詳情請參閱 [資料獲取升級指南](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#step-6-migrating-data-fetching-methods)。

app/page.tsx

```tsx
// 導入 Client Component
import HomePage from "./home-page";

async function getPosts() {
  const res = await fetch("https://...");
  const posts = await res.json();
  return posts;
}

export default async function Page() {
  // 在 Server Component 中獲取資料
  const recentPosts = await getPosts();
  // 將獲取的資料傳遞給 Client Component
  return <HomePage recentPosts={recentPosts} />;
}
```

- 如果之前的頁面使用了 `useRouter`，則需要更新到新的路由 hooks。詳情請參閱[了解更多](https://nextjs.org/docs/app/api-reference/functions/use-router)。
- 啟動開發伺服器並訪問 `http://localhost:3000`。我們應該可以看到現有的 index 路由，現在透過 `app` 目錄提供服務。

## 第五步：遷移路由 Hooks

為了支援 `app` 目錄中的新行為，新增了新的路由器 (router)。

在 `app` 中，我們應該使用從 `next/navigation` 匯入的三個新 hooks：[`useRouter()`](https://nextjs.org/docs/app/api-reference/functions/use-router)、[`usePathname()`](https://nextjs.org/docs/app/api-reference/functions/use-pathname) 和 [`useSearchParams()`](https://nextjs.org/docs/app/api-reference/functions/use-search-params)。

- 新的 `useRouter` hook 從 `next/navigation` 導入，其行為與從 `next/router` 匯入的 `useRouter` hook 不同。
  > 注意：從 `next/router` 導入的 [`useRouter` hook](https://nextjs.org/docs/pages/api-reference/functions/use-router) 不支援在 `app` 目錄中使用，但仍可在 `pages` 目錄中使用。
- 新的 `useRouter` 不再回傳 `pathname` 字串。請改用 `usePathname` hook。
- 新的 `useRouter` 不再回傳 `query` 物件。搜尋參數與動態路由參數現在是分開的。請改用 `useSearchParams` 和 `useParams` hooks。
- 我們可以結合使用 `useSearchParams` 和 `usePathname` 來監聽頁面變更。詳情請參閱 [路由事件](https://nextjs.org/docs/app/api-reference/functions/use-router#router-events) 部分。
- 這些新 hooks 僅支援在 Client Components 中使用，不能在 Server Components 中使用。

app/example-client-component.tsx

```tsx
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function ExampleClientComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ...
}
```

此外，新的 `useRouter` hook 有以下變更：

- `isFallback` 已被移除，因為 `fallback` 已[被取代](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#replacing-fallback)。
- `locale`、`locales`、`defaultLocales` 和 `domainLocales` 值已被移除，因為 `app` 目錄不再需要內建 i18n 功能。詳情請參閱[了解更多關於 i18n](https://nextjs.org/docs/app/building-your-application/routing/internationalization)。
- `basePath` 已被移除，其替代方案不會成為 `useRouter` 的一部分，目前尚未實作。
- `asPath` 已被移除，因為新的路由器中移除了 `as` 的概念。
- `isReady` 已被移除，因為它已不再需要。任何使用 [`useSearchParams()`](https://nextjs.org/docs/app/api-reference/functions/use-search-params) hook 的元件，將跳過預渲染步驟，並在客戶端執行時渲染。

[了解更多 `useRouter()` API 參考](https://nextjs.org/docs/app/api-reference/functions/use-router)。

## 第六步：遷移資料獲取方法 (Data Fetching Methods)

在 `pages` 目錄中，使用 `getServerSideProps` 和 `getStaticProps` 來為頁面獲取資料。在 `app` 目錄中，這些資料獲取函數被新的 [簡化 API](https://nextjs.org/docs/app/building-your-application/data-fetching) 取代，該 API 基於 `fetch()` 和 `async` React Server Components。

app/page.tsx

```tsx
export default async function Page() {
  // 這個請求應該被快取，直到手動失效。
  // 類似於 `getStaticProps`。
  // `force-cache` 是預設值，可以省略。
  const staticData = await fetch(`https://...`, { cache: "force-cache" });

  // 這個請求應該在每次請求時重新抓取。
  // 類似於 `getServerSideProps`。
  const dynamicData = await fetch(`https://...`, { cache: "no-store" });

  // 這個請求應該被快取 10 秒的時間。
  // 類似於 `getStaticProps` 帶有 `revalidate` 選項。
  const revalidatedData = await fetch(`https://...`, {
    next: { revalidate: 10 },
  });

  return <div>...</div>;
}
```

### 伺服器端渲染（`getServerSideProps`）

在 `pages` 目錄中，`getServerSideProps` 用於在伺服器上獲取資料並將資料傳遞到檔案中的預設匯出的 React 元件。頁面的初始 HTML 是從伺服器預渲染的，隨後在瀏覽器中「hydrating」（使其具有互動性）。

pages/dashboard.js

```jsx
// `pages` 目錄

export async function getServerSideProps() {
  const res = await fetch(`https://...`);
  const projects = await res.json();

  return { props: { projects } };
}

export default function Dashboard({ projects }) {
  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  );
}
```

在 App Router 中，我們可以將資料獲取與 React 元件一起放置，使用 [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)。這允許我們傳送更少的 JavaScript 到客戶端，同時保持伺服器上渲染的 HTML。

通過將 `cache` 選項設置為 `no-store`，我們可以指示獲取的資料 [永不被快取](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching)。這類似於 `pages` 目錄中的 `getServerSideProps`。

app/dashboard/page.tsx

```tsx
// `app` 目錄

// 這個函數可以命名為任何名稱
async function getProjects() {
  const res = await fetch(`https://...`, { cache: "no-store" });
  const projects = await res.json();

  return projects;
}

export default async function Dashboard() {
  const projects = await getProjects();

  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  );
}
```

### 讀取 Request 物件 (Accessing Request Object)

在 `pages` 目錄中，我們可以基於 Node.js HTTP API 來取得與請求相關的資料 (request-based data)。

例如，我們可以在 `getServerSideProps` 中取得 `req` 物件，並使用它來取得請求的 cookie 和標頭。

pages/index.js

```jsx
// `pages` 目錄

export async function getServerSideProps({ req, query }) {
  const authHeader = req.getHeaders()['authorization'];
  const theme = req.cookies['theme'];

  return { props: { ... }}
}

export default function Page(props) {
  return ...
}

```

`app` 目錄中，公開了新的唯讀函數來獲取請求資料 (request data)：

- [`headers()`](https://nextjs.org/docs/app/api-reference/functions/headers)：基於 Web Headers API，可以在 [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components) 中使用來取得請求標頭。
- [`cookies()`](https://nextjs.org/docs/app/api-reference/functions/cookies)：基於 Web Cookies API，可以在 [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components) 中使用來取得 cookie。

app/page.tsx

```tsx
// `app` 目錄
import { cookies, headers } from "next/headers";

async function getData() {
  const authHeader = headers().get("authorization");

  return "...";
}

export default async function Page() {
  // 我們可以在伺服器元件中直接使用 `cookies()` 或 `headers()`
  // 或者在資料獲取函數中使用
  const theme = cookies().get("theme");
  const data = await getData();
  return "...";
}
```

### 靜態網站生成 SSG (`getStaticProps`)

在 `pages` 目錄中，`getStaticProps` 函數用於在建置期間預渲染頁面。此函數可用來從外部 API 或直接從資料庫中獲取資料，並在建置期間將這些資料傳遞給整個頁面。

pages/index.js

```jsx
// `pages` 目錄

export async function getStaticProps() {
  const res = await fetch(`https://...`);
  const projects = await res.json();

  return { props: { projects } };
}

export default function Index({ projects }) {
  return projects.map((project) => <div>{project.name}</div>);
}
```

在 `app` 目錄中，使用 [`fetch()`](https://nextjs.org/docs/app/api-reference/functions/fetch) 來獲取資料時，預設的快取行為為 `cache: 'force-cache'`，這會將請求的資料快取，直到手動失效。這類似於 `pages` 目錄中的 `getStaticProps`。

app/page.js

```jsx
// `app` 目錄

// 這個函數可以命名為任何名稱
async function getProjects() {
  const res = await fetch(`https://...`);
  const projects = await res.json();

  return projects;
}

export default async function Index() {
  const projects = await getProjects();

  return projects.map((project) => <div>{project.name}</div>);
}
```

### 動態路徑 Dynamic paths (`getStaticPaths`)

在 `pages` 目錄中，`getStaticPaths` 函數用於定義應在建置期間預渲染的動態路徑。

pages/posts/[id].js

```jsx
// `pages` 目錄
import PostLayout from "@/components/post-layout";

export async function getStaticPaths() {
  return {
    paths: [{ params: { id: "1" } }, { params: { id: "2" } }],
  };
}

export async function getStaticProps({ params }) {
  const res = await fetch(`https://.../posts/${params.id}`);
  const post = await res.json();

  return { props: { post } };
}

export default function Post({ post }) {
  return <PostLayout post={post} />;
}
```

在 `app` 目錄中，`getStaticPaths` 被 [`generateStaticParams`](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) 取代。

[`generateStaticParams`](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) 的行為類似於 `getStaticPaths`，但它提供了更簡化的 API 來回傳路由參數，並且可以在 [佈局](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates) 中使用。`generateStaticParams` 的回傳格式是一個段的陣列，而不是一個巢狀的 `param` 物件陣列或解析路徑的字串。

app/posts/[id]/page.js

```jsx
// `app` 目錄
import PostLayout from "@/components/post-layout";

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }];
}

async function getPost(params) {
  const res = await fetch(`https://.../posts/${params.id}`);
  const post = await res.json();

  return post;
}

export default async function Post({ params }) {
  const post = await getPost(params);

  return <PostLayout post={post} />;
}
```

使用 `generateStaticParams` 作為新的 `app` 目錄中的模型名稱，比 `getStaticPaths` 更合適。`get` 前綴被更具描述性的 `generate` 取代，這在 `getStaticProps` 和 `getServerSideProps` 不再需要時更具語義性。而 `Paths` 後綴則被 `Params` 取代，對於多層巢狀動態路徑來說，`Params` 更為合適。

### 取代 `fallback`

在 `pages` 目錄中，`getStaticPaths` 回傳的 `fallback` 屬性用於定義未在建置期間預渲染的頁面行為。此屬性可以設定為 `true` ，讓頁面正在生成時，顯示一個備援頁面；設為 `false` 則顯示 404 頁面；或設為 `blocking` 以在請求時生成頁面。

pages/posts/[id].js

```jsx
// `pages` 目錄

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params }) {
  ...
}

export default function Post({ post }) {
  return ...
}

```

在 `app` 目錄中， [`config.dynamicParams` 屬性](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams) 控制了如何處理不在 [`generateStaticParams`](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) 中的參數：

- **`true`**: 是預設值，對於不包含在 `generateStaticParams` 中的動態段 (dynamic segments)，將按需生成。
- **`false`**: 不包含在 `generateStaticParams` 中的動態段會回傳 404 頁面。

這取代了 `pages` 目錄中 `getStaticPaths` 的 `fallback: true | false | 'blocking'` 選項。由於 `'blocking'` 和 `true` 的差異在串流中微乎其微，因此在 `dynamicParams` 中未包含 `fallback: 'blocking'`。

app/posts/[id]/page.js

```jsx
// `app` 目錄

export const dynamicParams = true;

export async function generateStaticParams() {
  return [...]
}

async function getPost(params) {
  ...
}

export default async function Post({ params }) {
  const post = await getPost(params);

  return ...
}
```

當 [`dynamicParams`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams) 設為 `true` (預設值) 時，當請求尚未生成的路由段時，它將由伺服器渲染並快取。

> 補充：這段話的意思是：
>
> 當 `dynamicParams` 設為 `true`（預設值）時，如果有一個路由段（例如 URL 的某一部分）被請求，但這個路由段尚未被生成，那麼系統會在伺服器端生成這個路由段的內容並快取起來。這樣，下次有相同的請求時，系統可以直接從快取中提供這個路由段的內容，而不需要重新生成。
>
> 簡單來說，這樣做可以保證即使路由段還未被預先生成，系統也會在第一次請求時生成它，並將結果保存起來，以便後續請求可以更快地回應。

### 增量靜態再生 ISR (`getStaticProps` 與 `revalidate`)

在 `pages` 目錄中，`getStaticProps` 函數允許添加 `revalidate` 欄位，以在指定時間後自動重新生成頁面。

pages/index.js

```jsx
// `pages` 目錄

export async function getStaticProps() {
  const res = await fetch(`https://.../posts`);
  const posts = await res.json();

  return {
    props: { posts },
    revalidate: 60,
  };
}

export default function Index({ posts }) {
  return (
    <Layout>
      <PostList posts={posts} />
    </Layout>
  );
}
```

在 `app` 目錄中，使用 [`fetch()`](https://nextjs.org/docs/app/api-reference/functions/fetch) 獲取資料時，可以使用 `revalidate`，這將快取請求指定秒數。

app/page.js

```jsx
// `app` 目錄

async function getPosts() {
  const res = await fetch(`https://.../posts`, { next: { revalidate: 60 } });
  const data = await res.json();

  return data.posts;
}

export default async function PostList() {
  const posts = await getPosts();

  return posts.map((post) => <div>{post.name}</div>);
}
```

### API 路由 (API Routes)

API 路由在 `pages/api` 目錄中可以繼續運作，不需任何更改。然而，在 `app` 目錄中，它們已被 [路由處理器 (Route Handlers)](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) 所取代。

路由處理器允許我們使用 Web 的 [Request](https://developer.mozilla.org/docs/Web/API/Request) 和 [Response](https://developer.mozilla.org/docs/Web/API/Response) API 為特定路由建立自訂請求處理器。

app/api/route.ts

```tsx
export async function GET(request: Request) {}
```

> 注意：如果以前使用 API 路由從客戶端呼叫外部 API，現在可以使用伺服器元件來安全地獲取資料。了解更多有關[資料獲取](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching)的資訊。

## 第七步：樣式 (Styling)

在 `pages` 目錄中，全域樣式表 (global stylesheets) 只限於 `pages/_app.js` 使用。在 `app` 目錄中，此限制已被取消。全域樣式可以添加到任何佈局、頁面或元件中。

- [CSS 模組](https://nextjs.org/docs/app/building-your-application/styling/css#css-modules)
- [Tailwind CSS](https://nextjs.org/docs/app/building-your-application/styling/tailwind-css)
- [全域樣式](https://nextjs.org/docs/app/building-your-application/styling/css#global-styles)
- [CSS-in-JS](https://nextjs.org/docs/app/building-your-application/styling/css-in-js)
- [外部樣式表](https://nextjs.org/docs/app/building-your-application/styling/css#external-stylesheets)
- [Sass](https://nextjs.org/docs/app/building-your-application/styling/sass)

### Tailwind CSS

如果正在使用 Tailwind CSS，需要將 `app` 目錄添加到 `tailwind.config.js` 檔案中：

tailwind.config.js

```jsx
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // <-- Add this line
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};
```

我們還需要在 `app/layout.js` 檔案中導入我們的全域樣式：

app/layout.js

```jsx
import "../styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
```

了解更多有關 [使用 Tailwind CSS 的樣式](https://nextjs.org/docs/app/building-your-application/styling/tailwind-css) 的資訊。

## Codemods

Next.js 提供了 Codemod 轉換工具，當某個功能被棄用時，這些工具有助於升級我們的程式碼庫。參閱 [Codemods](https://nextjs.org/docs/app/building-your-application/upgrading/codemods) 了解更多詳情。

# 補充資訊

## 路由與導航的運作方式 (How Routing and Navigation Works)

App Router 使用混合式的方法來處理路由與導航。在伺服器端，我們的應用程式程式碼會自動根據路由段（route segments）進行程式碼拆分（code-split）。而在客戶端，Next.js 會[預取](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#2-prefetching)（prefetches）和[快取](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#3-caching)（caches）這些路由段。這意味著當使用者導航至新路由時，瀏覽器不會重新載入頁面，只會重新渲染變更的路由段，從而改善導航體驗和性能。

### 1. 程式碼拆分（Code Splitting）

程式碼拆分允許我們將應用程式程式碼拆分為更小的包，讓瀏覽器可以下載和執行這些包。這樣可以減少每個請求傳輸的資料量和執行時間，從而提升性能。

[伺服器元件](https://nextjs.org/docs/app/building-your-application/rendering/server-components)允許我們的應用程式程式碼自動根據路由段進行程式碼拆分。這意味著只有導航時所需的程式碼會被加載。

### 2. 預先取回（Prefetching）

預先取回（或稱「預取」）是一種在使用者訪問之前，在背景中預載（preload）路由的方法。

在 Next.js 中，路由預取有兩種方式：

- **`<Link>` 元件**: 當路由變得可見於使用者的視窗時，路由會自動進行預取。預取會在頁面首次載入或滾動時進入視窗時發生。
- **`router.prefetch()`**: 可以使用 `useRouter` 鉤子來程式化地預取路由。

`<Link>` 的預設預取行為（即當 `prefetch` 屬性未指定或設為 `null` 時）會根據我們使用 [`loading.js`](https://nextjs.org/docs/app/api-reference/file-conventions/loading) 的方式有所不同。

只有共享佈局，沿著渲染的元件「樹」向下直到第一個 `loading.js` 文件，會被預取和快取 30 秒。

這樣可以減少獲取整個動態路由的成本，也意味著我們可以顯示 [即時載入狀態](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#instant-loading-states) 來提供更好的視覺回饋給使用者。

我們可以通過將 `prefetch` 屬性設為 `false` 來禁用預取。或者，可以通過將 `prefetch` 屬性設為 `true` 來預取超過載入邊界（beyond the loading boundaries）的完整頁面資料。

詳情請參閱 [`<Link>` API 參考](https://nextjs.org/docs/app/api-reference/components/link)。

> 提醒：
>
> - 預取功能只在生產環境中啟用，開發環境中不會啟用。

### 3. 快取（Caching）

Next.js 具有一個名為 [路由快取（Router Cache）](https://nextjs.org/docs/app/building-your-application/caching#client-side-router-cache) 的**內存客戶端快取（in-memory client-side cache）**。當使用者在應用程式中導航時，預取的路由段和訪問過的路由的 React 伺服器元件 payload 會被儲存在快取中。

這意味著在導航時，快取會盡可能被重用，而不是向伺服器發出新的請求，從而通過減少請求次數和傳輸的資料量來提高性能。

了解更多 [路由快取](https://nextjs.org/docs/app/building-your-application/caching#client-side-router-cache) 的工作原理和配置方法。

### 4. 部分渲染（Partial Rendering）

部分渲染意味著在客戶端上，只有在導航時變更的路由段會重新渲染，共享的段 (segments)會被保留。

例如，在導航兩個相鄰路由 `/dashboard/settings` 和 `/dashboard/analytics` 之間時，`settings` 和 `analytics` 頁面會被渲染，共享的 `dashboard` 佈局會被保留。

![image](https://github.com/user-attachments/assets/ad903b4d-bc40-4b68-9c11-8923ad2ea7da)

如果沒有部分渲染，每次導航都會導致客戶端上的整個頁面重新渲染。只渲染變更的段 (segment)可以減少傳輸的資料量和執行時間，從而提升性能。

### 5. 軟導航（Soft Navigation）

在瀏覽器中，頁面之間的導航通常是「硬導航（hard navigation）」。Next.js 的 App Router 啟用了頁面之間的「軟導航」，確保只有變更的路由段會重新渲染（部分渲染），這樣可以在導航過程中保留客戶端的 React 狀態。

### 6. 前進和後退導航（Back and Forward Navigation）

預設情況下，Next.js 會維持向後和向前導航的滾動位置，並重複利用 [路由快取](https://nextjs.org/docs/app/building-your-application/caching#client-side-router-cache) 中的路由段（route segments）。

### 7. 在 `pages/` 和 `app/` 之間的路由

在從 `pages/` 逐步遷移到 `app/` 時，Next.js 路由器會自動處理兩者之間的硬導航。為了檢測從 `pages/` 遷移到 `app/` 的轉換，會有一個客戶端路由過濾器，利用機率檢查應用路由，這可能偶爾會導致誤報。預設情況下，此類情況應該非常罕見，因為我們將誤報的可能性配置為 0.01%。這個可能性可以通過 `next.config.js` 中的 `experimental.clientRouterFilterAllowedRate` 選項來自定義。需要注意的是，降低誤報率會增加客戶端包中生成的過濾器的大小。

另外，如果我們希望完全禁用這個處理並手動管理 `pages/` 和 `app/` 之間的路由，可以在 `next.config.js` 中將 `experimental.clientRouterFilter` 設為 `false`。當此功能被禁用時，任何與 app 路由重疊的 pages 中的動態路由將無法正常導航。

## 混用客戶端元件和伺服器元件

在 Next.js 的 App Router 中，Server Components 和 Client Components 可以混合使用。

混合使用的注意事項：

- 注意 `props` 的傳遞
- Server Components 無法使用客戶端專屬的功能
- Client Components 只能由 Server Components 包裹

混合使用 Server Components 和 Client Components 時，傳遞 `props` 是一個需要特別注意的部分，因為伺服器與客戶端的運作環境不同。

以下是 props 傳遞時的主要注意事項：

#### 1. Server Components 可以傳遞任何類型的 `props`

- **Server Components** 只在伺服器端執行，所以可以安全地傳遞任何 JavaScript 物件或資料類型，例如 `string`、`number`、`array`、`object` 等。
- Server Components 內可以獲取資料庫、API 呼叫等伺服器端資料，並將其作為 `props` 傳遞給子元件（包括 Client Components）。

```jsx
export default async function ServerComponent() {
  const data = await fetchDataFromAPI();
  return <ClientComponent data={data} />;
}
```

#### 2. Client Components 只能接收序列化後的 `props`

- 因為 **Client Components** 會在瀏覽器上執行，所有傳遞給 Client Components 的 `props` 必須是可以**序列化**的。
- 具體來說，不能傳遞函數、無法序列化的類型（如 `Date` 物件、`Map`、`Set` 等），這些資料類型無法在伺服器與客戶端之間傳遞。
- 如果你嘗試傳遞無法序列化的 `props`，Next.js 會拋出錯誤。

```jsx
// 這樣是行不通的，因為函數無法序列化
export default function ServerComponent() {
  const myFunction = () => console.log('Hello');
  return <ClientComponent onClick={myFunction} />;
}

// 改成這樣，傳遞可序列化的資料
export default function ServerComponent() {
  const message = 'Hello';
  return <ClientComponent message={message} />;
}

```

#### 3. Server Components 可以從其他 Server Components 接收 `props`

- Server Components 可以從其他 Server Components 接收任意類型的 `props`，因為它們全都在伺服器端運行，不受序列化限制。

```jsx
export default function ParentServerComponent() {
  const data = { name: "John", age: 30 };
  return <ChildServerComponent person={data} />;
}

function ChildServerComponent({ person }) {
  return <div>{person.name}</div>;
}
```

#### 4. Client Components 從 Server Components 接收 `props` 的限制

- 當 Server Components 將 `props` 傳遞給 Client Components 時，需要確保傳遞的是基本的 JavaScript 值（如字串、數字、陣列、物件）。如果需要傳遞較複雜的資料類型，建議將其轉換為可序列化的格式（例如將 `Date` 物件轉換為 ISO 字串）。

```jsx
export default function ServerComponent() {
  const date = new Date().toISOString(); // 確保可以序列化
  return <ClientComponent dateString={date} />;
}

("use client");
export function ClientComponent({ dateString }) {
  const date = new Date(dateString);
  return <p>{date.toDateString()}</p>;
}
```

#### 5. 避免傳遞大型物件或敏感資料

- 由於 Client Components 會在客戶端執行，傳遞太大的 `props` 會增加 JavaScript bundle 大小，影響效能。
- 同時，也應避免將敏感資料（例如 API 密鑰或伺服器端私密資料）作為 `props` 傳遞給 Client Components，因為這些資料會暴露在瀏覽器中。

### 不能在 Server Components 使用的功能

在 Next.js App Router 中，Client Components 和 Server Components 各自有不同的用途和限制。具體來說，Client Components 可以使用許多 React 客戶端的功能，但這些功能無法在 Server Components 中使用。

以下是一些**只能在 Client Components 使用**，而**不能在 Server Components 使用**的功能：

#### 1. React Hooks

- **`useState`**：用於管理元件內的本地狀態，會在客戶端運行。
- **`useEffect`**：用於處理副作用，這些副作用只會在瀏覽器中執行，如訂閱、API 請求等。
- **`useContext`**：用於讀取(access) React 的 context API，與狀態管理相關。
- **`useReducer`**、**`useRef`**：這些都是與客戶端元件狀態或 DOM 互動相關的 hooks，無法在伺服器端執行。

#### 2. 事件處理 (Event Handlers)

- **`onClick`**、**`onChange`**、**`onSubmit`** 等事件處理函數只在客戶端執行。這類事件函數涉及與 DOM 的互動，必須在瀏覽器中運行。
- 任何函數作為 `props` 傳遞，並作為事件處理邏輯，只能在 **Client Components** 使用，因為伺服器無法執行客戶端的 JavaScript 行為。

#### 3. 瀏覽器 API

- 瀏覽器 API 像 **`window`**、**`document`**、**`localStorage`**、**`sessionStorage`**、**`navigator`** 等只能在客戶端執行，因為這些物件在伺服器端並不存在。
- 任何需要直接操作 DOM 的邏輯，如 **`document.getElementById`** 或 **`window.addEventListener`**，只能在 Client Components 中執行。

#### 4. 動態導入和互動行為

- **`useEffect`** 中的 **API 請求**：雖然 Server Components 可以直接在伺服器端進行 API 請求（例如透過 fetch 來獲取資料），但需要在客戶端發起的動態 API 請求（例如在表單提交時調用 API）只能在 Client Components 中處理。
- **`import()`** 動態導入：這種導入方式在客戶端執行時使用，無法在伺服器端動態導入客戶端模組。

#### 5. CSS-in-JS 和客戶端樣式處理

- 一些 CSS-in-JS 庫需要在客戶端生成樣式，像 **styled-components** 或 **emotion**。雖然你可以在伺服器端預先生成樣式，但動態樣式生成只能在 Client Components 中運行。
- **`useLayoutEffect`**：這個 hook 在瀏覽器 DOM 加載後運行，用來計算佈局，不能在伺服器端使用，因為伺服器端無法讀取瀏覽器的 DOM。

#### 6. React Portals

- **`ReactDOM.createPortal`**：用於將元件渲染到 DOM 節點的其他部分（例如 Modal 彈窗等），只能在客戶端使用。

#### 7. 互動式第三方庫

- 例如 **chart.js**、**mapbox-gl**、**three.js** 等需要在客戶端渲染的互動式 JavaScript 庫，這些庫依賴於 DOM 和瀏覽器的渲染引擎，因此只能在 Client Components 中使用。

#### 8. Cookies 和 Storage 的操作

- 在客戶端讀取 **`localStorage`**、**`sessionStorage`** 或使用 **`cookie`**（瀏覽器中的 client-side cookies）只能在 Client Components 中完成。雖然 Server Components 可以在伺服器端讀取或寫入 cookie，但這是在 HTTP 層面進行的，不是透過 JavaScript 操作的瀏覽器儲存。

#### 9. 使用者互動的第三方工具

- 例如 **Google Analytics**、**Facebook Pixel** 或 **Intercom** 這類工具，通常需要在瀏覽器中運行和初始化。這類工具的腳本只會在客戶端執行，不能在伺服器端執行。

#### 10. WebSockets 或 SSE (Server-Sent Events)

- 這類需要在客戶端進行的即時通訊技術，如 **WebSockets** 或 **Server-Sent Events (SSE)**，只能在 Client Components 中進行。

### 注意元件包裹順序

客戶端元件不能包裹伺服器元件，這是因為伺服器元件是在伺服器端執行並生成靜態 HTML，而客戶端元件是在客戶端執行的動態 JavaScript 元件。

具體原因如下：

1. **執行環境不同**：
   **伺服器元件** 是在伺服器端運行，負責處理資料並生成靜態內容，而**客戶端元件**在客戶端運行，負責處理互動和更新 UI。因為**客戶端元件**需要在瀏覽器上運行，它無法先包裹一個在伺服器端生成的靜態內容（伺服器元件）。
2. **渲染順序**：
   Next.js 的渲染流程是由伺服器先處理並生成伺服器元件的靜態 HTML，然後在瀏覽器上載入客戶端元件並處理互動。
   伺服器元件可以包裹客戶端元件，因為伺服器會先渲染出靜態的部分，然後由客戶端補充動態部分。但反過來，若由客戶端元件包裹 伺服器元件，瀏覽器將無法在客戶端進行伺服器端的邏輯運算。

總結：

在 **Next.js App Router** 中，**客戶端元件**不能包裹**伺服器元件**，只能是**伺服器元件**包裹**客戶端元件**。這是因為渲染流程是先由伺服器處理，再由客戶端補充互動功能。

# 結論

這篇 KM 主要在整理 App Router 與 Pages Router 之間的差異，以評估目前團隊現有專案是否適合使用 App Router 來取代 Pages Router。

由於版面限制，主要只有針對 Rendering、Data Fetching、Routing 這三個章節進行比較，並且在各章節主要補充介紹 App Router 的使用方式。

對於專案是否要轉換架構，筆者以前端工程師的角度認為都可以。前端使用 Pages Router 的架構下，到目前為止我們沒有遇到什麼問題是一定要轉換成 App Router 才能處理的，但因為 App Router 有更多新功能可以使用，也許對未來前端會更有幫助，只是轉換架構會需要額外花費較多的時間和精力，這部分需要評估。而後端工程師則認為 App Router 更為方便。

### 將現有專案路由架構從 Pages Router 換成 App Router 需要做的事

1. 需要大量改變路由資料夾的結構
2. 原本都是客戶端元件，換成 App Router 之後會預設成伺服器元件，如果要維持原本的客戶端元件，也就是為了要繼續使用瀏覽器 API (像是監聽事件)、React hooks (像是 state、effect) 的話，就要在元件的第一行加上`'use client'`。
3. 原本 Pages Router 的渲染方式會用到的 `getStaticProps` 都需要移除。
4. 不確定目前使用的第三方套件是否有影響，要確定是否都能支援
5. 整個專案需要重新測試

### 後端工程師對於轉換架構的看法

如果轉換成 App Router 的話，後端工程師會覺得比較好，像是：

1. 可以不使用第三方套件 formidable，因為 App Router 有內建支援。
2. App Router 提供的 API handler，可以直接使用 http methods。
3. App Router 提供的 middleware 功能更為齊全，可以完成更多功能。像是 URL 路徑的命名可以自定義，不需要被路由資料夾名稱所限制。

# 參考資料

- https://nextjs.org/docs/app/building-your-application/routing
- https://nextjs.org/docs/app/building-your-application/rendering
- https://nextjs.org/docs/app/building-your-application/data-fetching
- https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration
- https://heidiliu2020.github.io/next-react-ssr/
- https://ithelp.ithome.com.tw/articles/10321914
- https://ithelp.ithome.com.tw/articles/10314422
- https://ithelp.ithome.com.tw/articles/10315960
- https://ithelp.ithome.com.tw/articles/10316237
