_（目前文章狀態：草稿）_

文章標題：App Router vs Pages Router in Next.js

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

由  [Vercel](https://github.com/vercel/next.js)  團隊創建的 Next.js，解決了上述幾點網頁開發遇到的問題，以下是官網提及有關 Next.js v14（發布於 2023 年 12 月）的幾項特點：

- Data Fetching：可控制資料載入的時機點
- CSS Support：內建支援 CSS、Sass 檔案，並支援 CSS 模組化
- Route Handlers：基於檔案架構的路由系統，如  `page/home.tsx`
- API Routes：支援 API 路由，易於建立與管理 API 端點
- Pre-rendering：支援兩種形式的預渲染，分別是靜態網頁生成（SSG）和伺服器渲染（SSR）
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

面對上述缺點，Next.js 可依照使用情境不同，將元件定義為 Server Component 或 Client Component。舉例來說，當某個元件需要使用 Hooks 管理時，可透過在程式碼開頭加上 'use client' 來標示元件類型，該元件底下的子元件也會自動視為 Client Component。

但也因為如此，相較於 Page Router，新版的 App Router 學習曲線會較高，需瞭解 Server 如何運作，以及判斷哪些元件適合放在 Server 或 Client 端，在使用時須特別注意。

另外，**App Router 與 Page Router 是可以並存的**，但也是有一些基本的限制，像是兩個目錄不能同時定義一個 router，否則會報錯。官網有提供如何從 Page Router migrate App Router 的[教學文章](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)，可以參考如何轉換。

以下章節將會針對 App Router 與 Page Router 的差異進行比較，並介紹 App Router 的幾個重要功能。

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

- **建置時渲染：** 頁面在建置時預先渲染，使其在提供給使用者時速度極快。
- **SEO 友好：** 由於 HTML 是預先渲染的，因此很容易被搜尋引擎索引。
- **適用於靜態內容：** SSG 適合不經常變動的內容，例如部落格文章或行銷頁面。

### 4. 增量靜態再生 (Incremental Static Regeneration, ISR)

**概述：**
增量靜態再生 (ISR)讓我們能在建置後更新靜態頁面，而不需要完整重建。頁面可以在新的請求進來時在背景中重新生成，確保它們保持最新狀態，同時不犧牲靜態生成的效能優勢。

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

- SSG 是透過 `getStaticProps` 函數實現的，該函數會在建構時抓取資料並將其作為屬性傳遞給頁面元件。
- 這種方法會在建構期間為頁面生成靜態 HTML 文件，提高效能並減少伺服器負荷。
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
- **SSG**：使用 `getStaticProps` 在建構時進行內容渲染，生成靜態 HTML 文件。
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

- 在 App Router 中，靜態生成是通過在建構時渲染伺服器元件（server components）來實現的。
- 如果元件在建構時獲取資料並且不依賴於運行時變數（例如查詢參數），則會進行靜態生成。
- 詳細說明： <br />
  在傳統的 Next.js 中，`getStaticProps` 用來在構建時獲取資料並生成靜態頁面。這是一種靜態網站生成 (SSG) 的方法。 <br />
  而在 App Router 中，靜態生成是通過伺服器端元件來實現的。Next.js 會自動處理這些伺服器端元件的預渲染過程，確保在構建時生成靜態頁面。 <br />
  總而言之，在 App Router 中，我們已不必使用 `getStaticProps` 來實現靜態網站生成，因為 Next.js 的伺服器端元件已經處理了這部分的工作。 <br />

範例：

```jsx
export default async function Page() {
  const res = await fetch("<https://api.example.com/data>");
  const data = await res.json();

  return <div>{data}</div>;
}

// 如果不依賴於運行時變數（例如查詢參數），Next.js 將在建構時靜態生成這個頁面。
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
- **SSG**：通過使用沒有運行時依賴的伺服器元件來實現。（簡單來說，就是如果伺服器元件在構建頁面時不需要依賴於運行時才有的資料或條件，那麼 Next.js 就能夠在構建階段生成這個頁面，並在頁面發佈後不再需要動態生成。）
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

靜態渲染是指在 **構建時** 或在 [資料重新驗證](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration) 之後的背景中進行路由渲染。結果會被快取並推送到 [內容傳遞網路 (CDN)](https://developer.mozilla.org/docs/Glossary/CDN)。這種優化讓我們可以在使用者和伺服器請求之間共享渲染工作的結果。

靜態渲染適用於具有非個人化資料的路由，這些資料在構建時可以知道，例如靜態部落格文章或產品頁面。

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

我們可以使用 `loading.js` 和 [React Suspense](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming) 開始串流路由段和 UI 元件。請參見 [Loading UI 和串流](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming) 以獲取更多資訊。

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

以下根據 Next.js 官方文件的說明，總結 App Router 和 Page Router 兩種路由架構系統在路由設定上的差異。

## 1. **定義路由（Defining Routes）**

- **App Router**：路由是透過 `/app` 目錄中的資料夾結構定義的。目錄結構直接對應到 URL 路徑，不依賴於檔案命名規範。
- **Page Router**：路由是在 `/pages` 目錄中定義的。此目錄中的每個檔案自動成為一個路由，且資料夾結構決定動態路由。這種方法簡單明瞭，但在組織路由方面彈性較小。

定義路由的詳細說明已在前面章節提過了，這裡就不贅述。請參考《專案建立——專案架構差異》此章節。

## 2. **佈局和模板（Layouts and Templates）**

- **App Router**：支援內建佈局和模板，允許巢狀佈局和可重用的模板應用於不同路由。
- **Page Router**：沒有支援內建的佈局和模板，需要在每個頁面手動實作佈局元件。

說明：**App Router** 擁有內建支援佈局和模板的優勢，減少程式碼的重複性和簡化佈局管理。（但如果頁面的佈局變化不大，這方面的優勢就不明顯）

像是 App Router 可以透過特殊檔案  `layout.tsx`  更簡單地實現 persistent layout。

什麼是 persistent layout？簡單來說就是**路由切換時，沒有變動的部分不會 re-render，讓 state 和頁面狀態 ( ex: 滾輪位置 ) 可以維持一樣。**

## 3. **連結和導航（Linking and Navigating）**

- **App Router**：使用 `Link` 元件進行客戶端導航，與 Page Router 相似，但受益於內建的優化功能，可能更好地與 App Router 中的元件層次結構配合。
- **Page Router**：同樣使用 `Link` 元件進行客戶端導航，對大多數使用情況來說是直接有效的。

說明：兩者在這方面的功能類似，但 **App Router** 可能因其巢狀結構而在先進路由功能的無縫整合方面佔據優勢。

## 4. **錯誤處理（Error Handling）**

- **App Router**：透過巢狀錯誤邊界支援進階錯誤處理，允許對應用程式的不同部分進行更精細的錯誤控制。
- **Page Router**：錯誤處理通常涉及建立自訂的 `_error.js` 頁面來進行全域錯誤處理，或使用 `getInitialProps` 在頁面層級捕獲錯誤。

說明：**App Router** 提供更精細的錯誤處理，讓開發人員可以將錯誤隔離到特定的路由或元件。

## 5. **載入 UI 和串流（Loading UI and Streaming）**

- **App Router**：提供對載入狀態和串流的進階支援，透過允許部分 UI 漸進式載入來改善使用者體驗。
- **Page Router**：載入狀態通常是使用 React 的 `useState` 或 `useEffect` 手動處理的。沒有內建的串流支援。

說明：**App Router** 更適合需要複雜載入策略和串流支援的應用程式。

## 6. **重新導向（Redirecting）**

- **App Router**：由於其靈活的路由結構，支援更複雜的重新導向邏輯。可以針對每個路由或一組路由配置重新導向。
- **Page Router**：重新導向通常在 `next.config.js` 中使用 `redirects` 配置，或在個別頁面元件內部處理。

說明：**App Router** 提供更多重新導向的彈性和控制。

## 7. **路由分組（Route Groups）**

- **App Router**：允許分組路由以便更好地組織和共享路由配置。
- **Page Router**：不支援路由分組。路由是單獨定義在 `/pages` 目錄內。

說明：**App Router** 在將路由分組以便共享配置方面有明顯優勢。

## 8. **專案組織（Project Organization）**

- **App Router**：鼓勵更模組化和有組織的檔案結構，將相關的元件、路由和佈局組合在一起。
- **Page Router**：具有較扁平的檔案結構，所有路由都在 `/pages` 目錄中定義。

說明：**App Router** 更適合大型應用程式的組織。

## 9. **動態路由（Dynamic Routes）**

- **App Router**：透過目錄結構中的 `[param]` 語法支援動態路由，並且可以處理更複雜的巢狀動態路由。
- **Page Router**：同樣支援動態路由，使用 `/pages` 目錄中的 `[param].js` 檔案。

說明：兩者皆支援動態路由，但 **App Router** 可能在支援巢狀動態路由方面更具優勢。

## 10. **平行路由（Parallel Routes）**

- **App Router**：原生支援平行路由，允許同時渲染多個路由。
- **Page Router**：不直接支援平行路由；要實現類似效果，需要更複雜的自訂實作。

說明：**App Router** 原生支援平行路由，對需要同時渲染多個路由的複雜應用程式有利。

## 11. **攔截路由（Intercepting Routes）**

- **App Router**：允許攔截路由以進行自訂邏輯或處理。
- **Page Router**：沒有直接的路由攔截概念。類似的功能需要透過中介軟體或自訂元件手動實作。

說明：**App Router** 提供更多彈性，具有內建的路由攔截功能。

## 12. **路由處理程式（Route Handlers）**

- **App Router**：支援自訂路由處理程式，可以管理路由或 HTTP 方法的特定邏輯。
- **Page Router**：不直接支援路由處理程式；處理邏輯通常嵌入在頁面元件中。

說明：**App Router** 提供更細粒度的控制，使用路由處理程式。

## 13. **中介軟體（Middleware）**

- **App Router**：完全支援中介軟體功能來處理請求、修改響應以及在渲染前執行動作。
- **Page Router**：也支援中介軟體，但通常需要更多配置，因為中介軟體是在 `/pages/_middleware.js` 檔案中聲明的。

說明：兩者皆支援中介軟體，但 **App Router** 可能因其路由結構而更無縫整合。

## 14. **國際化（Internationalization）**

- **App Router**：原生支援國際化 (i18n)，使處理多語言內容更容易。
- **Page Router**：也支援國際化，但通常需要在 `next.config.js` 中進行更多手動設置。

說明：**App Router** 在國際化方面可能提供更整合的體驗。

# Data Fetching——資料獲取差異

_（撰寫中）_

# 逐步遷移的方式

_（撰寫中）_

# 實作——App Router

_（待實作）_

# 結論

### 初步條列式整理差異——App Router vs Page Router

_（再整理）_

- App Router 在  `app`  目錄底下；Page Router 在  `page`底下
- 都是由目錄結構產生實際路由，但兩邊路由不可重複。即`app/profile/page.tsx`  與  `page/profile.tsx`會產生相同路徑，執行時會噴錯提醒
- Page Router 熟悉的`_document.tsx`, `_app.tsx`，App Router 已不使用。取而代之的是`app/layout.tsx`。所以 RootLayout 裡需要自行寫`<html><body>`這些，因為 Next 不會自動產生
- 後端 API 路徑結構一樣，都是`/api/`底下。即`page/api/user.tsx`等於`app/api/user/route.tsx`，都會產生`/api/user`。與路由一樣，相同 api 在 page 與 app 不可重複
- 蒐集網址參數(動態路由)命名一樣是`[param]`或`[...params]`，差別在 App Router 僅能是目錄，而 Page Router 可以是檔名
- 在組件裡取得路由(Dynamic route)參數，Page Router 是用`useRouter()`； App Router 是直接在 props 傳入，如  `page({params})`

### 深入條列式整理差異——以 App Router 為視角

_（再整理）_

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
