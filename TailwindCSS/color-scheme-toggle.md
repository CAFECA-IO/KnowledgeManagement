# 前言

暗黑模式/明亮模式的切換是現代網站越來越常見的需求，這篇文章探討使用 TailwindCSS 實作暗黑模式/明亮模式切換的方法，以及在產品迭代跟團隊協作中的最佳實踐作法。

本文使用 Next.js 作為示範，每個段落都有對應的程式碼實踐，其中在 [延伸] 段落有 [Live demo](https://dark-mode-tailwindcss-best-practice.vercel.app/)。

# 在 Tailwind CSS 實現模式切換的方法

## 1. 使用 `dark` 前綴

### 介紹

- [參考 branch: feature/class-prefix](https://github.com/arealclimber/dark-mode-tailwindcss-best-practice/tree/feature/class-prefix)

Tailwind CSS 本身支援透過 dark 類別來實現暗黑模式的樣式應用。這種方法依賴於一個父級或更高層級的選擇器，如 html 或 body 標籤，上會新增 dark 類別。

透過偵測頂層元素（如 html 或 body）是否有 dark 類別來決定是否套用暗黑模式的樣式。這種方式的優點在於可以全域控制樣式的切換，且實作方式直接且集中。

### 實現步驟

在 tailwind.config.js 檔案中啟用 `darkMode` 選項，設定為 `'class'`。
在 HTML 的 html 或 body 標籤上，根據使用者的偏好動態新增或移除 dark 類別。
使用 `.dark` 類別前綴在 CSS 中定義暗黑模式的樣式。例如，`.dark bg-gray-800` 表示在暗黑模式下背景為灰色。

1. `tailwind.config.ts`

   ```tsx
   import type { Config } from "tailwindcss";

   const config: Config = {
     darkMode: "class",
     content: [
       "./pages/**/*.{js,ts,jsx,tsx,mdx}",
       "./components/**/*.{js,ts,jsx,tsx,mdx}",
       "./app/**/*.{js,ts,jsx,tsx,mdx}",
     ],
     theme: {
       extend: {
         backgroundImage: {
           "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
           "gradient-conic":
             "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
         },
         colors: {
           "example-sky": "var(--example-sky)",
           "example-red": "var(--example-red)",
           "example-background-color": "var(--example-background-color)",
           "example-text-color": "var(--example-text-color)",
         },
       },
     },
     plugins: [],
   };
   export default config;
   ```

2. `styles/globals.css`

   ```tsx
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   @layer components {
     :root {
       --example-sky: #8dcce9;
       --example-red: #903636;
       --example-background-color: #f5f5f5;
       --example-text-color: #903636;
     }
     .dark {
       --example-sky: #1a6ec8;
       --example-red: #c48787;
       --example-background-color: #111111;
       --example-text-color: #c48787;
     }
   }

   ```

3. `pages/index.tsx`

   ```tsx
   import Image from "next/image";
   import { Inter } from "next/font/google";
   import { useEffect, useState } from "react";

   enum Theme {
     light = "light",
     dark = "dark",
   }

   export default function Home() {
     const [theme, setTheme] = useState<Theme>(Theme.light);
     const toggleTheme = () => {
       setTheme(theme === Theme.light ? Theme.dark : Theme.light);
     };
     useEffect(() => {
       if (theme === Theme.light) {
         document.documentElement.classList.remove("dark");
       } else {
         document.documentElement.classList.add("dark");
       }
     }, [theme]);

     return (
       <main
         className={`flex min-h-screen flex-col items-center justify-start space-y-5 p-24 text-example-text-color bg-example-background-color`}
       >
         <div>Dark/Light mode with class prefix and custom variable (WIII)</div>
         <button
           onClick={toggleTheme}
           className="bg-example-sky text-example-text-color px-5 py-2 rounded-md hover:opacity-80"
         >
           {theme === Theme.light ? "☀️ Light" : "🌚 Dark"}
         </button>
       </main>
     );
   }
   ```

## 2-1. 基於 media query 默認主題

### 介紹

- [參考 branch: feature/prefer-color-scheme](https://github.com/arealclimber/dark-mode-tailwindcss-best-practice/tree/feature/prefer-color-scheme)

此方法不需要手動切換類，而是利用 CSS 的媒體查詢功能，根據使用者係統的偏好自動套用暗黑模式或淺色模式。

使用 CSS 媒體查詢 prefers-color-scheme 來偵測系統層級的顏色方案偏好。如果使用者的作業系統設定為暗黑模式，媒體查詢將會匹配，Tailwind CSS 便會套用相應的暗黑模式樣式。這種方法的優點是無需任何額外的 JavaScript 邏輯，完全由瀏覽器自動處理。

### 實現步驟

在 tailwind.config.js 檔案中將 `darkMode` 選項設為 `'media'`。
在 CSS 中使用 @media (prefers-color-scheme: dark) 來定義暗黑模式下的樣式。

1. `tailwind.config.ts`

   ```tsx
   import type { Config } from "tailwindcss";

   const config: Config = {
     darkMode: "media",
     content: [
       "./pages/**/*.{js,ts,jsx,tsx,mdx}",
       "./components/**/*.{js,ts,jsx,tsx,mdx}",
       "./app/**/*.{js,ts,jsx,tsx,mdx}",
     ],
     theme: {
       extend: {
         backgroundImage: {
           "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
           "gradient-conic":
             "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
         },
       },
     },
     plugins: [],
   };
   export default config;
   ```

2. `styles/globals.css`

   ```tsx
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   :root {
     --foreground-rgb: 0, 0, 0;
     --background-start-rgb: 214, 219, 220;
     --background-end-rgb: 255, 255, 255;
   }

   @media (prefers-color-scheme: dark) {
     :root {
       --foreground-rgb: 255, 255, 255;
       --background-start-rgb: 0, 0, 0;
       --background-end-rgb: 0, 0, 0;
     }
   }

   body {
     color: rgb(var(--foreground-rgb));
     background: linear-gradient(
         to bottom,
         transparent,
         rgb(var(--background-end-rgb))
       )
       rgb(var(--background-start-rgb));
   }

   @layer utilities {
     .text-balance {
       text-wrap: balance;
     }
   }

   ```

3. `pages/index.tsx`

   ```tsx
   import { useState } from "react";
   import Image from "next/image";
   import { Inter } from "next/font/google";

   enum Theme {
     light = "light",
     dark = "dark",
   }

   export default function Home() {
     const [theme, setTheme] = useState(Theme.light);

     const toggleTheme = () => {
       const newTheme = theme === Theme.light ? Theme.dark : Theme.light;
       setTheme((prev) => (prev === Theme.light ? Theme.dark : Theme.light));
       document.documentElement.setAttribute("data-theme", newTheme);
     };

     return (
       <main className={`min-h-screen`}>
         <div className="container mx-auto px-4 py-8">
           <button
             className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
             onClick={toggleTheme}
           >
             {theme === Theme.light
               ? "Switch to Dark Mode"
               : "Switch to Light Mode"}
           </button>
           <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
             Welcome to My App
           </h1>
           <p className="text-lg text-gray-700 dark:text-gray-300">
             This is a sample page with dark mode support.
           </p>
         </div>
       </main>
     );
   }
   ```

## 2-2. 基於 media query 切換模式

### 介紹

- [參考 branch: feature/toggle-by-media](https://github.com/arealclimber/dark-mode-tailwindcss-best-practice/tree/feature/toggle-by-media)

利用 CSS 的媒體查詢功能，實作切換模式功能。

### 實現步驟

在 tailwind.config.js 檔案中將 `darkMode` 選項設為 `'media'`。
在 CSS 中使用 `[data-theme="dark"] {}` 來定義暗黑模式下的樣式，使用`[data-theme="light"] {}`來定義明亮模式。

1. `tailwind.config.ts`

   ```tsx
   import type { Config } from "tailwindcss";

   const config: Config = {
     darkMode: "media",
     content: [
       "./pages/**/*.{js,ts,jsx,tsx,mdx}",
       "./components/**/*.{js,ts,jsx,tsx,mdx}",
       "./app/**/*.{js,ts,jsx,tsx,mdx}",
     ],
     theme: {
       extend: {
         backgroundImage: {
           "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
           "gradient-conic":
             "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
         },
       },
     },
     plugins: [],
   };
   export default config;
   ```

2. `styles/globals.css`

   ```tsx
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   :root {
     --foreground-rgb: 0, 0, 0;
     --background-start-rgb: 214, 219, 220;
     --background-end-rgb: 255, 255, 255;
   }

   [data-theme="dark"] {
     --foreground-rgb: 255, 255, 255;
     --background-start-rgb: 0, 0, 0;
     --background-end-rgb: 0, 0, 0;
   }

   [data-theme="light"] {
     --foreground-rgb: 0, 0, 0;
     --background-start-rgb: 214, 219, 220;
     --background-end-rgb: 255, 255, 255;
   }

   body {
     color: rgb(var(--foreground-rgb));
     background: linear-gradient(
         to bottom,
         transparent,
         rgb(var(--background-end-rgb))
       )
       rgb(var(--background-start-rgb));
   }

   @layer utilities {
     .text-balance {
       text-wrap: balance;
     }
   }

   ```

3. `pages/index.tsx`

   ```tsx
   import { useEffect, useState } from "react";
   import Image from "next/image";
   import { Inter } from "next/font/google";

   enum Theme {
     light = "light",
     dark = "dark",
   }

   export default function Home() {
     const [theme, setTheme] = useState(Theme.dark);

     const toggleTheme = () => {
       const newTheme = theme === Theme.light ? Theme.dark : Theme.light;
       setTheme((prev) => (prev === Theme.light ? Theme.dark : Theme.light));
       document.documentElement.setAttribute("data-theme", newTheme);
     };

     useEffect(() => {
       document.documentElement.setAttribute("data-theme", theme);
     }, [theme]);

     return (
       <main className={`min-h-screen`}>
         <div className="container mx-auto px-4 py-8">
           <button
             className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
             onClick={toggleTheme}
           >
             {theme === Theme.light
               ? "Switch to Dark Mode"
               : "Switch to Light Mode"}
           </button>
           <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
             Welcome to My App
           </h1>
           <p className="text-lg text-gray-700 dark:text-gray-300">
             This is a sample page with dark mode support.
           </p>
         </div>
       </main>
     );
   }
   ```

## 3. 使用 `dark` 前綴+自定義 CSS 變數 (best practice)

### 介紹

- [參考 branch: feature/custom-var-dark-mode-toggle](https://github.com/arealclimber/dark-mode-tailwindcss-best-practice/tree/feature/custom-var-dark-mode-toggle)

在 tailwind.config.js 檔案中啟用 `darkMode` 選項，設定為 `'class'`。

將 light/dark 的變化的工作交給 CSS 檔案去定義， tailwind config 只記錄變數名字，在 component 裡面只需要用在 tailwind config 註冊的變數就好，不用像 “1. 使用 `dark` 前綴” 一一規定在暗黑模式要顯示哪個色碼。

在 CSS 檔案統一定義配置（色碼、間距、…）的好處之一：與設計師合作時，可以請設計師導出 token ，這樣設計稿跟程式碼會用同一個變數名字代表每個配置

### 實現步驟

1. `tailwind.config.ts`

   ```tsx
   import type { Config } from "tailwindcss";

   const config: Config = {
     darkMode: "class",
     content: [
       "./pages/**/*.{js,ts,jsx,tsx,mdx}",
       "./components/**/*.{js,ts,jsx,tsx,mdx}",
       "./app/**/*.{js,ts,jsx,tsx,mdx}",
     ],
     theme: {
       extend: {
         backgroundImage: {
           "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
           "gradient-conic":
             "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
         },
         colors: {
           "example-sky": "var(--example-sky)",
           "example-red": "var(--example-red)",
           "example-background-color": "var(--example-background-color)",
           "example-text-color": "var(--example-text-color)",
         },
       },
     },
     plugins: [],
   };
   export default config;
   ```

2. `styles/globals.css`

   ```tsx
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   @layer components {
     :root {
       --example-sky: #8dcce9;
       --example-red: #903636;
       --example-background-color: #f5f5f5;
       --example-text-color: #903636;
     }
     .dark {
       --example-sky: #1a6ec8;
       --example-red: #c48787;
       --example-background-color: #111111;
       --example-text-color: #c48787;
     }
   }

   ```

3. `pages/index.tsx`

   ```tsx
   import Image from "next/image";
   import { Inter } from "next/font/google";
   import { useEffect, useState } from "react";

   enum Theme {
     light = "light",
     dark = "dark",
   }

   export default function Home() {
     const [theme, setTheme] = useState<Theme>(Theme.light);
     const toggleTheme = () => {
       setTheme(theme === Theme.light ? Theme.dark : Theme.light);
     };
     useEffect(() => {
       if (theme === Theme.light) {
         document.documentElement.classList.remove("dark");
       } else {
         document.documentElement.classList.add("dark");
       }
     }, [theme]);

     return (
       <main
         className={`flex min-h-screen flex-col items-center justify-start space-y-5 p-24 text-example-text-color bg-example-background-color`}
       >
         <div>Dark/Light mode with class prefix and custom variable (WIII)</div>
         <button
           onClick={toggleTheme}
           className="bg-example-sky text-example-text-color px-5 py-2 rounded-md hover:opacity-80"
         >
           {theme === Theme.light ? "☀️ Light" : "🌚 Dark"}
         </button>
       </main>
     );
   }
   ```

# [延伸] 實作多個配色方案的模式切換 (best practice)

### 介紹

- [參考 branch: feature/toggle-by-diff-color-scheme](https://github.com/arealclimber/dark-mode-tailwindcss-best-practice/tree/feature/toggle-by-diff-color-scheme)
- [Live demo](https://dark-mode-tailwindcss-best-practice.vercel.app/)

延伸至 “3. 使用 `dark` 前綴+自定義變數” ，在 CSS 裡面除了自定義 `.dark` 以外，還可以自定義其他 color scheme，在 React component 裡面實作配色主題的切換

### 實現步驟

1. `tailwind.config.ts`

   ```tsx
   import type { Config } from "tailwindcss";

   const config: Config = {
     darkMode: "class",
     content: [
       "./pages/**/*.{js,ts,jsx,tsx,mdx}",
       "./components/**/*.{js,ts,jsx,tsx,mdx}",
       "./app/**/*.{js,ts,jsx,tsx,mdx}",
     ],
     theme: {
       extend: {
         backgroundImage: {
           "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
           "gradient-conic":
             "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
         },
         colors: {
           "example-sky": "var(--example-sky)",
           "example-red": "var(--example-red)",
           "example-background-color": "var(--example-background-color)",
           "example-text-color": "var(--example-text-color)",
           "example-green": "var(--example-green)",
           "example-purple": "var(--example-purple)",
         },
       },
     },
     plugins: [],
   };
   export default config;
   ```

2. `styles/globals.css`

   ```tsx
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   @layer components {
     :root {
       --example-sky: #8dcce9;
       --example-red: #903636;
       --example-background-color: #f5f5f5;
       --example-text-color: #903636;
       --example-green: #97eb97;
       --example-purple: #b585ca;
     }
     .dark {
       --example-sky: #3f73ab;
       --example-red: #c48787;
       --example-background-color: #111111;
       --example-text-color: #ffffff;
       --example-green: #206420;
       --example-purple: #7f5a8c;
     }

     .green {
       --example-sky: #97eb97;
       --example-red: #903636;
       --example-background-color: #0a6033;
       --example-text-color: #4292c4;
       --example-green: #97eb97;
       --example-purple: #b585ca;
     }

     .purple {
       --example-sky: #b585ca;
       --example-red: #903636;
       --example-background-color: #22125f;
       --example-text-color: #d7baba;
       --example-green: #97eb97;
       --example-purple: #7a3796;
     }
   }

   ```

3. `pages/index.tsx`

   ```tsx
   import { useEffect, useState } from "react";

   enum Theme {
     light = "light",
     dark = "dark",
     green = "green",
     purple = "purple",
   }

   export default function Home() {
     const [theme, setTheme] = useState<Theme>(Theme.light);

     useEffect(() => {
       document.documentElement.classList.remove(...Object.values(Theme));
       document.documentElement.classList.add(theme);
     }, [theme]);

     return (
       <main
         className={`flex min-h-screen flex-col items-center justify-start space-y-5 p-24 text-example-text-color bg-example-background-color`}
       >
         <div>
           Dark/Light mode with class prefix and multiple color schemes (WIII)
         </div>
         <div className="space-x-2">
           {Object.values(Theme).map((t) => (
             <button
               key={t}
               onClick={() => setTheme(t)}
               className={`bg-example-sky text-example-text-color px-5 py-2 rounded-md hover:opacity-80 ${
                 theme === t ? "opacity-50" : ""
               }`}
             >
               {t}
             </button>
           ))}
         </div>
         <div>
           <a
             href="<https://github.com/arealclimber/dark-mode-tailwindcss-best-practice>"
             target="_blank"
             rel="noopener noreferrer"
             className="underline"
           >
             Source code
           </a>
         </div>
       </main>
     );
   }
   ```

# **結論**

本文介紹了使用 Tailwind CSS 在 Next.js 框架中實現暗黑模式和明亮模式切換的三種方法，包括使用 **`dark`** 前綴、基於 media query 的自動主題應用以及結合 **`dark`** 前綴和自定義變數的方式。

透過對這三種方法的探討，我們發現使用 **`dark`** 前綴加上自定義變數的方式在實踐中提供了最大的靈活性和控制力。此方法允許開發者利用 CSS 自定義屬性來集中管理樣式，並通過簡單的類切換來應用不同的主題設置。這不僅使得主題切換更加無縫和高效，也方便與設計系統集成，提高了產品迭代的速度和團隊協作的效率。

尤其在多個配色方案的實現中，這種方法展示了其強大的可擴展性。開發者可以輕松地增加更多的配色方案，並通過修改一組變數即可實現全局樣式的更新。這種集中管理風格和配色方案的方法，不僅提高了代碼的可維護性，也使得與設計師的協作更加緊密和高效。

綜上所述，**`dark`** 前綴結合自定義變數的實現方式，不僅遵循了現代網頁設計的最佳實踐，也提供了一種高效且專業的解決方案來滿足現代網站對於靈活主題切換的需求。這種方法值得被推薦為實施暗黑模式和明亮模式切換的最佳實踐。

# 參考

- [啟發自 shadcn/ui 對 dark mode 的實作](https://ui.shadcn.com/docs/dark-mode/next)
