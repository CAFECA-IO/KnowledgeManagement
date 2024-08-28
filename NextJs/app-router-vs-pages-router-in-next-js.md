_（目前文章狀態：草稿）_

# 前言

此篇文章的目的在於，了解 App Router 和 Pages Router 之間的差異，以便於判斷之後的專案是否要改用 App Router。（目前的專案都是使用 Pages Router）

首先會先簡單介紹 Next.js，再來是針對 App Router 與 Page Router 的差異進行比較，並介紹 App Router 的幾個重要功能，最後會做一個實作。

此篇文章的內容大部分都會由官方文件及網路上部落格文章擷取而成，所有資料來源會整理於本文的最後一個章節「參考資料」裡面。

## 初步認識 Next.js

### 1. React vs Next.js：函式庫與框架

React 是用來建構使用者介面的 JavaScript 函式庫（Library）。

而 Next.js 則是建立 React 之上的框架，除了客戶端渲染（Client-side Rendering），還支援兩種形式的預渲染：靜態網頁生成（Static Site Generation）和伺服器端渲染（Server-side Rendering）。

可參考官網的標語介紹：

- [React](https://react.dev/)：用於打造使用者介面的函式庫（The **library** for web and native user interfaces）
  - 此外官方也提到：「建議使用者使用全端 React 框架，如 Next.js 或  [Remix](https://remix.run/)，以處理專案中的路由與資料處理等需求」
- [Next.js](https://nextjs.org/)：用於網頁開發的 React 框架（The React **Framework** for the Web）

#### 補充——React 是不是框架？

為什麼常常聽到有人說 React 是一個 Javascript library 不是一個框架？究竟 library 和 Framework 兩者差在哪裡呢？

開發一個 app 包含了許多面向，像是 UI、routing、data fetching、rendering、部署等等，而一個「框架」應該要能全面地 cover 這些需求。

假如習慣使用像是 create-react-app 這些 boilerplate 來建立 React 專案，可能會以為 React 本身一手包辦了所有事情。但其實打開 create-react-app 專案的 package.json 檔案，你會發現它只幫你先裝好了常用的套件，像是 React-DOM、Webpack 等等。**事實上 React 本身只負責 UI 的建造，其餘工作必須交給其他第三方套件執行**，像是 React-DOM 負責真實操控 DOM、React-Router 負責路由切換等等，因此會說 React 只是一個 library。

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

由  [Vercel](https://github.com/vercel/next.js)  團隊創建的 Next.js，解決了上述幾點網頁開發遇到的問題，以下是官網提及有關 Next.js v14（發布於 2023 年 12 月）的幾項特點：

- Data Fetching：可控制資料載入的時機點
- CSS Support：內建支援 CSS、Sass 檔案，並支援 CSS 模組化
- Route Handlers：基於檔案架構的路由系統，如  `page/home.tsx`
- API Routes：支援 API 路由，易於建立與管理 API 端點
- Pre-rendering：支援兩種形式的預渲染，分別是靜態網頁生成（SSG）和伺服器渲染（SSR）
- Built-in Optimizations：針對圖片、字體、JavaScript 載入進行自動優化，包括延遲載入與緩存處理

綜合上述優點，Next.js 有助於優化網頁效能與 SEO，適合用於建立著陸頁面（Landing Page）或是產品展示頁面，但較不適合應用在經常變動的網站，避免伺服器負荷過大。

而 Next.js 實際使用案例可參考  [Showcase](https://nextjs.org/showcase)  頁面，如 Notion、Tik Tok 以及 Twitch 等網站。

## Next.js Router System 路由系統

由於 Next.js 使用基於檔案系統的路由（file-system based router），會依照專案的檔案結構自動定義路由。

而根據版本不同，Next.js 提供兩種管理頁面路由的方式，分別是舊版本適用的 Pages Router 以及 v13 後推出的 App Router，兩者差異在於：

- Pages Router

  1. 定義頁面層級的路由
  2. 所有元件為 React Client Component（客戶端元件）
  3. 只能使用 Next.js 提供的預設規則，如：檔案名稱即為路徑

- App Router
  1. 定義應用程式層級的路由
  2. 所有元件預設為 React Server Component（伺服器端元件）
  3. 可自定義路由規則，如：使用正規表達式匹配特定路徑

如上所言，在 App Router 中所有元件預設為 React Server Component（RSC），意思是由伺服器將 React Component 準備好，再傳給 Client 顯示在畫面上。

而 RSC 的優缺點如下：

- 優點

  1. 整合後端操作，如存取資料庫（DB）、讀取檔案（File System）
  2. 降低資料間的依賴關係，改善請求瀑布流（Waterfall）導致的效能問題
  3. 降低 JS Bundle Size 以提升頁面效能

- 缺點
  1. 無法使用 React Hooks
  2. 無法使用瀏覽器 API
  3. 無法操作 DOM 事件監聽

面對上述缺點，Next.js 可依照使用情境不同，將元件定義為 Server Component 或 Client Component。舉例來說，當某個元件需要使用 Hooks 管理時，可透過在程式碼開頭加上 'use client' 來標示元件類型，該元件底下的子元件也會自動視為 Client Component。

但也因為如此，相較於 Page Router，新版的 App Router 學習曲線會較高，需瞭解 Server 如何運作，以及判斷哪些元件適合放在 Server 或 Client 端，在使用時須特別注意。

另外，**App Router 與 Page Router 是可以並存的**，但也是有一些基本的限制，像是兩個目錄不能同時定義一個 router，否則會報錯。官網有提供如何從 Page Router migrate App Router 的[教學文章](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)，可以參考如何轉換。

以下章節將會針對 App Router 與 Page Router 的差異進行比較，並介紹 App Router 的幾個重要功能。

# 專案建立——資料夾結構差異

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
// 是否在 /app 外加一層 src 資料夾

Would you like to use App Router? (recommended) No / Yes
// 是否使用 App Router

Would you like to customize the default import alias (@/*)? No / Yes
// 是否自訂 alias 調整預設的 baseURL 匯入路徑

What import alias would you like configured? @/*
// alias 預設使用 @ 是否修改
```

這裡先選擇使用 App Router ，建置完成後，初始專案架構主要分成以下三大類：

- app：放置 components、pages 與 api 等檔案
  - layout.tsx：在多個頁面之間定義共用 UI，其狀態將會被保存，如：nav、header、footer 等元
  - page.tsx：在資料夾底下需包含 page.tsx 檔案，才會被定義為一個 route segment，如：app/blog/page.tsx
  - globals.css：定義全域樣式
- public：放置靜態檔案，如圖片等
  - 需要引入 /public/next.svg 檔案時，路徑可直接指向 /next.svg
- 設定檔：包含 next.config.js、tsconfig.json、package.json 等用於設定專案配置的檔案

## Page Router 資料夾結構

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

![image](https://github.com/user-attachments/assets/e258e384-5006-4cda-b3f7-bad23eb6aa5d)

（圖片來源：[官方文件](https://nextjs.org/blog/layouts-rfc#how-routing-currently-works)）

## App Router 資料夾結構

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

文件目錄與對應的頁面路由如下：

- `app/page.tsx` → `/`
- `app/login/page.tsx` → `/login`
- `app/blog/[slug]/page.tsx` → `/blog/[slug]`
  - 目錄可作為動態路由的參數，並以 props 傳入元件
- 呼叫 API：`app/api/user/route.tsx`
- `@` 開頭的 folder 不會對路由造成影響：
  - `app/@analytics/page.tsx` 實際渲染的路由為 `/`，這個特殊的檔案夾是用來切分同一個路由底下的不同邏輯區塊。

以下是目錄對應頁面路由的示意圖 （[官方文件](https://nextjs.org/docs/app/building-your-application/routing)）：

![image](https://github.com/user-attachments/assets/6918e8a7-398b-456d-ae27-288757d0d2ce)

# Rendering——渲染的四種方式、路由系統對四種渲染的應用差異

_（撰寫中）_

針對 Next.js 支援的網頁渲染方式，以及如何在 Next.js 搭配使用，列點整理如下：

- Client-side Rendering（CSR）：客戶端渲染
  - Client（瀏覽器）第一次發送 Request 給 Server => Server 回傳只有容器不含內容的 HTML 檔 => 再由瀏覽器執行 JavaScript 動態產生資料 => 最後將資料渲染到畫面上
  - 因此第一次渲染較為費時，而只有容器沒有內容的原始碼也將不利於 SEO
  - 執行函數：`useEffect()`  或使用由 Next.js 團隊開發的  [SWR](https://swr.vercel.app/)  開源套件
- Server-side Rendering（SSR）：伺服器端渲染
  - Server（伺服器）在每次收到 Request 時，會建立好完整的 HTML 內容並發送給 Client
  - 適用於需經常更新數據的頁面，缺點是可能導致伺服器負荷較大
  - 執行函數：`getServerSideProps()`，只會在 Server side 執行，可跳過呼叫 API 步驟直接到資料庫抓取資料
- Static Site Generation（SSG）：靜態網站生成
  - 在網頁打包（built time）時，就由 Server 產生所有需要用到的內容，因此每次 Server 收到 Request 均回傳相同的 HTML 給 Client
  - 因 HTML 內容不變可搭配快取機制，適用於資料變動較小的頁面，無法動態更新
  - 執行函數：`getStaticProps()`
- Incremental Site Rendering（ISR）：增量式網站渲染
  - 結合 SSG 和 SSR 的渲染方式，可設定條件保存上一次渲染結果，當靜態檔案過期，將觸發 Server 重新 build HTML 檔案以更新頁面
  - 執行函數: `getStaticProps()`  搭配  `revalidate`  屬性

# Routing——路由使用差異

_（撰寫中）_

# Data Fetching——資料獲取差異

_（撰寫中）_

# 逐步遷移的方式

_（撰寫中）_

# 實作——App Router

_（待實作）_

# 結論

### 初步整理差異——App Router vs Page Router

- App Router 在  `app`  目錄底下；Page Router 在  `page`底下
- 都是由目錄結構產生實際路由，但兩邊路由不可重複。即`app/profile/page.tsx`  與  `page/profile.tsx`會產生相同路徑，執行時會噴錯提醒
- Page Router 熟悉的`_document.tsx`, `_app.tsx`，App Router 已不使用。取而代之的是`app/layout.tsx`。所以 RootLayout 裡需要自行寫`<html><body>`這些，因為 Next 不會自動產生
- 後端 API 路徑結構一樣，都是`/api/`底下。即`page/api/user.tsx`等於`app/api/user/route.tsx`，都會產生`/api/user`。與路由一樣，相同 api 在 page 與 app 不可重複
- 蒐集網址參數(動態路由)命名一樣是`[param]`或`[...params]`，差別在 App Router 僅能是目錄，而 Page Router 可以是檔名
- 在組件裡取得路由(Dynamic route)參數，Page Router 是用`useRouter()`； App Router 是直接在 props 傳入，如  `page({params})`

### 深入整理差異——以 App Router 為視角

- React Component 須使用`'use client'`, `'use server'`標記組件類型
- `app/`目錄底下不標記的話，預設皆是 RSC(React Server Component)
- 只要組件有傳遞到`onClick`之類的與 user 互動的 function，皆須為 client 組件。官方推薦可以單純將其包成一小組件並宣告`'use client'`
- Server 與 Client 組件可以交錯建立成一棵樹，**唯須注意 props 不可為  `Date`, `function`  等無法被 json 序列化的函式**
- 宣告`'use client'`後，其底下引入使用的組件不必特別宣告，自動當作`client`。直到再次遇到`'use server'`，而`server`底下引入的組件亦同。自動視為`server`組件直到遇到`'use client'`。故不必在每個組件最上面聲明  `client`  或  `server`。沒聲明的組件，自己要清楚使用位置
- RSC **無法**使用 hook、dom API，但可以在組件裡做 Server 才能做的事，如 fs, 查詢 DB…等。若有 hook 需求，請轉成 client component
- 所有的頁面節點一律由固定檔名`page.tsx(js)`才會被渲染成路由，故相同功能組件可置於`app/`目錄底下，集中管理。不必放在外面讓檔案距離遙遠，更易於管理
- 所有 API 節點一律由`route.ts(js)`才有其 api。檔案管理優點同上。裡面則額外`export function GET`, `export const POST`等指定 API method
- page 頁面沒有`getServerSideProps`, `getStaticPaths`  等函式，只有 export react component
- 不同連結要使用相同 layout，可建立`/(group)/`目錄來分組，其中`(group)`不會被渲染成路徑。如`app/(group)/abc/edf` ->`/abc/edf`
- 額外提供`headers`與`cookies`可以在 RSC 或 API 使用。具體用法可參考[官方文件](https://nextjs.org/docs/app/api-reference/functions/cookies)。**要注意的是，在 Page Router 無法使用。若在 Page Router 使用，會輸出`undefined`**
- 在 RSC 使用  `fetch` Call API 時，他的 fetch 是繼承 native fetch 後再增加一些 next 專屬功能，如 cache ，亦有專屬的  `next: {...}`  參數可使用
- 以下檔名是 next 專屬檔名，會被 next 處理。不能拿來做為自己的子組件命名。
  - page
  - layout
  - route
  - loading
  - not-found
  - error
  - global-error
  - template
  - default
- 會有全域 provider (如 redux, react query)的三方套件。官方推薦針對他增加一個`provider.tsx`，在最上層使用`'use client'`，再放到`layout.tsx`裡。具體範例可參考[官方 / Rendering third-party context providers in Server Components](https://nextjs.org/docs/getting-started/react-essentials#rendering-third-party-context-providers-in-server-components)
- 若有些函式可能包含機密資訊，但寫法又可以在 Client 運作，想要限制他僅能在 Server 的話，可使用`server-only`套件保護。用法可見[官方 / The “server only” package](https://nextjs.org/docs/getting-started/react-essentials#the-server-only-package)

### 適用情境

_（撰寫中）_

### 對於專案的建議

_（撰寫中）_

# 參考資料

_（撰寫中）_
