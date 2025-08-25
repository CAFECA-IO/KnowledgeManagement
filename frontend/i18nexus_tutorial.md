- [什麼是 i18nexus](#什麼是-i18nexus)
- [為何選擇 i18nexus](為何選擇-i18nexus)
- [事前準備](#事前準備)
  - [建立專案](#建立專案)
  - [編寫翻譯內容](#編寫翻譯內容)
  - [取得 API Key](#取得-api-key)
- [實作步驟](#實作步驟)
  - [安裝與設定](#安裝與設定)
  - [同步翻譯檔](#同步翻譯檔)
  - [在頁面中使用翻譯](#在頁面中使用翻譯)
- [進階技巧](#進階技巧)
  - [撰寫腳本以變更翻譯檔路徑](#撰寫腳本以變更翻譯檔路徑)
  - [避免把翻譯檔直接放 Git](#避免把翻譯檔直接放-git)
  - [如何讓設計與 PM 參與翻譯管理](#如何讓設計與-pm-參與翻譯管理)
- [常見問題](#常見問題)
  - [CLI 執行錯誤](#cli-執行錯誤)
  - [缺少翻譯時的 fallback 行為](#缺少翻譯時的-fallback-行為)
- [參考資料](#參考資料)

# 什麼是 i18nexus

根據 [i18nexus 官方網站](https://i18nexus.com/)的介紹，i18nexus 是針對 **React** 與 **Next.js** 等前端框架設計的**雲端翻譯管理平台**，並整合了 **AI 自動翻譯**。

透過 **OpenAI** 和 **DeepL** 等機器翻譯，i18nexus 能自動生成多國語言內容，大幅節省人工翻譯和檔案管理的時間。同時，它還提供線上多人協作平台，讓產品經理、設計師或專業翻譯人員都能直接參與翻譯內容的維護，而不需要進入程式碼。

更重要的是，i18nexus 提供免費方案，讓團隊在專案初期就能無負擔地導入 i18n 流程，不必擔心額外的開發或維護成本。

# 為何選擇 i18nexus

雖然 **next-i18next** 曾經是 Next.js 專案 i18n 的主流方案，但隨著 Next.js v13 推出 **App Router**，它已經無法適配新的架構。在功能與維護性上，與 **i18nexus** 相比也存在明顯差異。

| 項目 | i18nexus | next-i18next |
| --- | --- | --- |
| 支援架構 | Next.js Page Router & App Router | 僅支援 Page Router |
| 翻譯管理方式 | 雲端管理平台 + API/CLI 同步 | 本地 JSON 檔手動維護 |
| 多人協作 | 提供 Web 介面，非工程師可直接修改翻譯 | 需透過 Git 修改檔案 |
| 自動翻譯 | 內建 OpenAI / DeepL API，可自動生成翻譯 | ❌ |
| 更新翻譯檔 | CLI 一鍵同步最新內容 | 手動拉取/合併 JSON |
| 維護狀況 | 持續更新，支援最新 Next.js 版本 | 更新頻率降低，未支援 App Router |

# 事前準備

## 建立專案

首先建立 Next.js 專案：

```bash
npx create-next-app@latest
```

本範例將使用 **TypeScript**、**App Router** 與 `src` 目錄結構。建立完成後，專案初始結構如下：

```bash
└── src
    └── app
        ├── layout.tsx
        └── page.tsx
```

和 Page Router 不同，在 **App Router** 專案中實作 i18n 需要另外建立捕捉語言參數的**動態路由**，因此結構應調整為：

```bash
└── src
    └── app
        └── [locale]
            ├── layout.tsx
            └── page.tsx
```

## 編寫翻譯內容

接下來開始線上編輯翻譯文本。[i18nexus](https://i18nexus.com/) 可免費註冊帳號，也能使用 Gmail 登入。

登入後，系統會引導建立新的專案，請依照畫面指示完成。

<img width="465" height="505" alt="image" src="https://github.com/user-attachments/assets/4c1476ed-a379-46fa-99fc-932c4a76dd3d" />

在右側面板中，可以添加需要支援語言，並選擇翻譯引擎。

可選擇 OpenAI 或 Google Translate，DeepL 則需要升級方案才能使用。

<img width="1201" height="502" alt="image" src="https://github.com/user-attachments/assets/a5d1aa29-60ce-4edb-813f-5b742ee36b5c" />

點擊語言區塊後，可以新增 **Namespace** 和 **String**：

- **Namespace** ：用於分隔翻譯檔，匯出後會生成對應的 JSON 檔案。可依功能或頁面建立多個 Namespace。
- **String** ：翻譯文本的 key code ，用於專案中 `t()` 函式的參數。

<img width="1202" height="574" alt="image" src="https://github.com/user-attachments/assets/b1c52929-ceca-44e6-86be-75beaaed8ef5" />

填寫完 **String Key** 和 **Value** 後，按下右側的確認鈕即可儲存。

系統會紀錄編輯該 String 的人員（下圖示例中已遮蔽），並可以在此處留下筆記供團隊檢視。

<img width="1268" height="439" alt="image" src="https://github.com/user-attachments/assets/8b40d705-ed7f-427d-88a0-6ee497d26cd2" />

點擊左側選單的 **Translator View** ，這裡可以查看機器翻譯的結果。如果對翻譯的內容不滿意，也可以在此手動更改。

確認翻譯文本無誤後，即可點擊右側按鈕儲存。

<img width="1269" height="489" alt="image" src="https://github.com/user-attachments/assets/4c29669f-e7d9-4b2a-94ec-0dea072b0d3c" />

## 取得 API Key

點擊左側選單的 **Exports and Versions** ，並在 **SETTINGS/AI** 頁籤中找到 API Key，請複製這串密鑰並放進專案的環境變數。

<img width="1545" height="864" alt="image" src="https://github.com/user-attachments/assets/70b3aad0-8df7-48f0-bb27-848ef4cd9956" />

```tsx
I18NEXUS_API_KEY="your_api_key"
```

> ⚠️ **注意**：請勿將 API Key 提交到 Git 中，以免造成安全風險。

# 實作步驟

## 安裝與設定

### 安裝套件

安裝 i18n 相關套件：

```bash
npm install i18next react-i18next i18next-resources-to-backend next-i18n-router
```

> ⚠️ **注意**：這裡安裝的是 **react-i18next** 而非 next-i18next，因為後者不支援 App Router。

另外，我們還需要安裝兩個工具：

- **i18nexus-cli**：用來同步雲端翻譯檔。
- **concurrently**：方便在開發環境中同時執行多個指令。

```bash
npm install i18nexus-cli concurrently --save-dev
```

### 設定設定檔

在專案根目錄建立 **i18n-config.ts** ，設定支援的語言與預設語言：

```tsx
export const i18nConfig = {
  locales: ['tw', 'en', 'jp'], // 可依需求增減
  defaultLocale: 'tw', // 預設語言
};
```

> 💡 i18nexus 使用官方的語言代碼（如 zh, en, ja），下載檔案時會依照官方代碼命名。本專案選擇使用自訂代碼（如 tw, en, jp），並在函式中透過 mapping 進行轉換。

### 建立 Middleware

在 `src` 下建立 **middleware.ts** 。

```tsx
import { NextRequest } from "next/server";
import { i18nRouter } from "next-i18n-router";
import { i18nConfig } from "../i18n-config";

export function middleware(request: NextRequest) {
  return i18nRouter(request, i18nConfig);
}

// 只作用於 app 目錄下的路由
export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
```

> 💡 這段 Middleware 會讀取使用者的 `Accept-Language` 標頭，自動將其導向對應的語言路徑；若不支援該語言，則會回退到預設語言（引用自 [i18nexus 官方教學](https://i18nexus.com/tutorials/nextjs/react-i18next)）。

### 建立 i18n 初始化函數

在 `src` 下新增 **i18n.ts**。

```tsx
import { createInstance, Resource, i18n } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { i18nConfig } from "../i18n-config";

// i18nexus 和 config 的語言代碼 mapping
const localeMap: Record<string, string> = {
  tw: "zh",
  en: "en",
  jp: "ja",
};

// 轉換代碼
export function resolveLocale(locale: string) {
  return localeMap[locale] ?? locale;
}

export default async function initTranslations(
  locale: string,
  namespaces: string[],
  i18nInstance?: i18n,
  resources?: Resource
) {
  i18nInstance = i18nInstance || createInstance();

  i18nInstance.use(initReactI18next);

  if (!resources) {
    i18nInstance.use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`@/locales/${resolveLocale(language)}/${namespace}.json`) // 翻譯檔路徑
      )
    );
  }

  await i18nInstance.init({
    lng: locale,
    resources,
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    defaultNS: namespaces[0],
    fallbackNS: namespaces[0],
    ns: namespaces,
    preload: resources ? [] : i18nConfig.locales,
  });

  return {
    i18n: i18nInstance,
    resources: { [locale]: i18nInstance.services.resourceStore.data[locale] },
    t: i18nInstance.t,
  };
}
```

> 💡 這個函數會建立並初始化一個 i18next 實例，並自動載入對應語言與 Namespace 的翻譯檔。

## 同步翻譯檔

使用 `i18nexus-cli` 從雲端拉取最新翻譯：

```bash
i18nexus pull
```

拉取後，`locales` 預設會放在專案根目錄，先手動將其移動到 `src` 下。

```bash
└── src
    └── locales
        ├── en
        │   └── home_page.json
        ├── ja
        │   └── home_page.json
        └── zh
            └── home_page.json
```

> 📝 後續可參考[撰寫腳本以變更翻譯檔路徑](#撰寫腳本以變更翻譯檔路徑)來將這個過程自動化。

## 在頁面中使用翻譯

於 `/src/app/[locale]/page.tsx`：

```tsx
import { i18nConfig } from "@/../i18n-config";
import initTranslations from "@/i18n";

// 動態生成靜態路由參數
export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ["home_page"]); // Namespace 要與檔名一致

  return (
    <main>
      <h1>{t("MAIN_TITLE")}</h1>
      <p>{t("DESCRIPTION")}</p>
    </main>
  );
}
```

> 💡 `generateStaticParams` 會在編譯時生成多語版本的靜態頁面，確保每個語言路徑都存在。

<img width="1823" height="775" alt="image" src="https://github.com/user-attachments/assets/9dbb8420-ba6b-42bf-ba0f-66ca8112b624" />

# 進階技巧

## 撰寫腳本以變更翻譯檔路徑

`i18nexus pull` 預設會將翻譯檔放在專案根目錄，但實務上我們希望統一放在 `src/locales`，以方便版本控制與模組化管理。
為了避免每次手動搬移，撰寫一支腳本自動完成「移動 → 覆蓋 → 清理」的流程。

安裝 `tsx` 以運行 .ts 腳本：

```bash
npm install -D tsx
```

建立 `scripts/move_locales.ts` ：

```tsx
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// 用 import.meta.url 取得目前檔案的路徑
const __filename = fileURLToPath(import.meta.url);
// 用 path.dirname 取得目前檔案所在的目錄
const __dirname = path.dirname(__filename);

// i18n 來源目錄 (i18nexus 預設：根目錄)
const sourceDir = path.join(__dirname, "../locales");
// 目標目錄 (/src)
const targetDir = path.join(__dirname, "../src/locales");

function copyDirSync(src: string, dest: string) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    let destName = entry.name;

    const destPath = path.join(dest, destName);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function removeDirSync(dir: string) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// 執行搬移
removeDirSync(targetDir);
copyDirSync(sourceDir, targetDir);
console.log(`Locales moved from ${sourceDir} to ${targetDir}.`);

// 刪除原本位於根目錄下的 locales
removeDirSync(sourceDir);
```

在 `package.json` 中新增指令：

```json
{
  "scripts": {
    "i18n:pull": "i18nexus pull && tsx scripts/move_locales.ts"
  }
}
```

執行以下指令即可自動完成「拉取翻譯 + 搬移」：

```bash
npm run i18n:pull
```

<img width="285" height="568" alt="image" src="https://github.com/user-attachments/assets/b4f369d9-4b4a-4437-a851-c98d6fb7f7a5" />

## 避免把翻譯檔直接放 Git

- **為什麼不直接放進 Git ？**
    - 翻譯檔通常是大量機器生成或雲端同步下來的檔案，可能造成版本庫變得很雜亂。
    - 多人協作時，翻譯檔改動頻繁，容易造成無意義的 merge conflict。
    - 真正需要管理的是**翻譯字串的來源**（也就是 i18nexus 雲端），而非同步後的結果。
- **具體做法**
    - 把 `src/locales/` 加進 `.gitignore`。
    - 讓團隊所有成員都透過 `i18nexus pull` 指令來更新翻譯。
    - 確保每個人都能根據相同的 `i18nexus.config.json` 來拉取資料，避免差異。
- **CI/CD 整合**
    - 將 `i18nexus pull` 指令合併至腳本中：
        
        ```json
        {
          "scripts": {
            "build": "i18nexus pull && next build",
            "start": "i18nexus pull && next start",
          }
        }
        ```
        
    - 這樣即使翻譯檔不在 Git 裡，部署時也能自動拉取最新翻譯。

> ⚠️ **例外情況**：如果專案需要離線模式，才會考慮把翻譯檔 commit 進 Git。

## 如何讓設計與 PM 參與翻譯管理

根據官網的[收費方案說明](https://i18nexus.com/pricing)，免費方案最多能邀請 **30 名成員**，並支援**不限數量的翻譯人員**。這讓設計師與 PM 也能直接參與翻譯協作。

在 **MEMBERS** 頁籤中可以找到邀請按鈕，輸入對方的**電子郵件、姓名**，並設定合適的**權限角色**：

- **Project Manager**：擁有所有權限，包括管理成員、String、翻譯內容和專案設定。
- **Developer**：可以新增、編輯 String 和翻譯內容。
- **Translator**：專注於翻譯和確認翻譯的內容。

<img width="922" height="476" alt="image" src="https://github.com/user-attachments/assets/93160cbb-6c1e-4780-b5b7-283bafb07035" />

<img width="866" height="353" alt="image" src="https://github.com/user-attachments/assets/471171a5-9b4d-4805-b0a8-2fb86cc4da5b" />

# 常見問題

## CLI 執行錯誤

- **問題**：在終端機執行 `i18nexus pull` 或相關指令時，出現 `command not found` 錯誤。
- **原因**
    - 未安裝 `@i18nexus/cli` 套件。
    - 專案安裝但未使用 `npx` 或正確的 script。
    - 環境差異（如 CI/CD、不同作業系統）導致 PATH 無法正確找到 CLI。
- **解法**
    1. 確認已安裝 CLI：
        
        ```bash
        npm install --save-dev @i18nexus/cli
        ```
        
    2. 使用 `npx` 執行：
        
        ```bash
        npx i18nexus pull
        ```
        
    3. 在 `package.json` script 中設定：
        
        ```json
        {
          "scripts": {
            "i18n:pull": "i18nexus pull"
          }
        }
        ```
        
- **注意事項**
    - 若要在 CI/CD 環境使用，需確保 `node_modules/.bin` 被正確加到 PATH。
    - 本機與 CI 的執行方式建議一致，避免環境不一致問題。

## 缺少翻譯時的 fallback 行為

- **問題**：使用者選擇某語言時，若翻譯內容尚未完成，可能導致 UI 顯示空白或錯誤字串。
- **原因**
    - 翻譯缺漏。
    - 函式庫未設定 fallback 語言。
    - 預設行為可能僅顯示 key，而不是文字。
- **解法**：在 i18n 設定中啟用 fallback 語言，例如：

```jsx
i18n.init({
  fallbackLng: 'en'
});
```

- **注意事項**
    - 在開發流程中應檢查缺少的翻譯，確保正式發佈前已完整翻譯。
    - 若專案支援多市場，建議優先確保 fallback 語言（如英文）完整，避免出現斷裂體驗。

# 參考資料

- [i18nexus](https://i18nexus.com/)
- [Internationalization Tutorial(youtube)](https://www.youtube.com/watch?v=J8tnD2BWY28)
- [Next.js 15 App Router with i18next](https://i18nexus.com/tutorials/nextjs/react-i18next)
