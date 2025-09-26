#  Tailwind CSS v4 update

- [前言](#前言)
- [重大變更總覽](#重大變更總覽)
  - [✏️重大變更對照表](#重大變更對照表)
  - [Breaking Changes](#)
  - [新功能與改進](#新功能與改進)
- [升級流程](#升級流程)
- [常見相容性問題](#常見相容性問題)
- [升級必要性評估](#升級必要性評估)

## 前言
### 版本定位
2025 年 1 月，Tailwind CSS 釋出了 v4.0 版本，這並非小幅更新，而是一次**核心重構**。隨著 Tailwind CSS 的普及，v3 架構在效能與擴展性上逐漸顯現限制。而 v4 的推出，正是針對這些問題進行重構，確保框架能在未來持續演進。

為了幫助開發者快速上手 Tailwind CSS v4，本文將帶你理解其核心變化，並提供升級方法與說明，協助你在最短時間內完成遷移，或評估是否需要立即升級。

### 文件閱讀對象
- **Tailwind v3 使用者**：想快速了解 v4 的更新項目，並評估是否有立即升級的必要。
- **新專案開發者**：不熟悉 Tailwind，對 v3 和 v4 的差異不太了解。
- **架構師 / 技術決策者**：需要掌握 v4 帶來的性能、瀏覽器支援範圍與長期發展方向。

## 重大變更總覽
### 重大變更對照表
| 項目 | v3 | v4 |
| --- | --- | --- |
| **安裝方式** | 需搭配 PostCSS、Autoprefixer 等依賴項目 | 不再依賴 PostCSS 和 Autoprefixer |
| **配置檔** | 必須使用 `tailwind.config.js` 作為配置檔 | 可選。仍支援 config 檔，但大部分自訂可直接在 CSS 中完成 |
| **編譯性能** | v3 JIT 編譯已啟用，但仍有較高記憶體占用 | 編譯引擎完全重寫，增量重建速度大幅提升，記憶體占用更低 |
| **CSS 配置** | Design token 和主題必須在 config 檔定義 | 可直接在匯入的 CSS 檔透過 `@theme` 等指令定義 |
| **瀏覽器要求** | 與舊版瀏覽器相容性較好 | 聚焦於現代瀏覽器，目標是 Safari 16.4, Chrome 111 和 Firefox 128 |
| **擴展性** | 透過 PostCSS + plugin 擴展，型別支援有限 | 移除 PostCSS 依賴，擴展方式更簡化，支援更完整的 arbitrary values ，並提供更佳的型別推斷與 IDE 支援 |

### Breaking Changes
以下為 Tailwind v4 的重大變更，這些都是會讓舊版配置/語法無法正常運作的更新，開發者須多加注意。

#### 瀏覽器要求變更

Tailwind CSS v4 是專為現代瀏覽器設計，依賴如 `@property` 和 `color-mix()` 的現代 CSS 功能，因此 Tailwind CSS v4 無法在舊版瀏覽器中運作。

所以如果需要支援 **Safari 16.4, Chrome 111 和 Firefox 128** 以下的瀏覽器，最好使用 v3，以免相容性問題影響到開發進程。

#### 移除 @tailwind 指令

在 v3 使用的 `@tailwind` 指令已不存在於 v4，而是改用  `@import` 指令將 Tailwind 匯入 CSS。

```css
/* v3 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* v4 */
@import "tailwindcss";
```

#### 容器配置移除

在 v3 中，`container` 是一個內建的工具類別（utility），常用在頁面佈局的最外層，讓內容在不同斷點下保持一致的寬度。但在 v4 已移除。

如果在 v4 中有自訂 `container` 的需求 ，可透過以下方式替代：

- 使用現有 utilities，如：`mx-auto px-4 max-w-screen-lg`
- 使用 `@utility` 指令擴展，自訂樣式：

```css
@utility container {
  margin-inline: auto;
  padding-inline: 2rem;
}
```

#### Arbitrary Values 語法更新

開發者可以直接輸入任意值（arbitrary values）作為 CSS 變數，v3 中使用的是中括號（`[]`），v4 則是改為括號（`()`）。此語法變動是為了避免任意值與 CSS 變數、函數混淆。

```html
<!-- v3 -->
<div class="bg-[--brand-color]"></div>
<div class="bg-[color-mix(in srgb, red, blue)]"></div>

<!-- v4 -->
<div class="bg-(--brand-color)"></div>
<div class="bg-(color-mix(in srgb, red, blue))"></div>
```

#### 不再支援 `corePlugins`、`safelist`、`separator`

這些在 v3 常見的 JS config 選項在 v4 已被移除。

- `corePlugins` → 不再能停用內建工具類別，只能透過 `@utility` 或自訂 CSS 來達成。
- `safelist` → 請改用 `@source inline()`。
- `separator` → 不再提供自訂分隔符。

#### 不再自動讀取 `tailwind.config.js`

在 v3 中，Tailwind 會自動找到並讀取根目錄的 `tailwind.config.js` 。

在 v4 中，Tailwind 仍支援 JS config，但不會自動讀取。如果需要使用，必須在 CSS 中用 `@config` 顯式載入：

```css
@config "../../tailwind.config.js";
```

#### 不支援 CSS 前處理器

由於 Tailwind v4 將自身定位為 CSS 前處理器，因此官方選擇不再支援外部 **Sass、Less、Stylus** 等工具。

`.scss` / `.less` / `.styl` 以及 Vue、Svelte、Astro 框架中的 `<style lang="scss">` 都會失效。必須改回原生 CSS 。
