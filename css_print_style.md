# 目錄
- [使用情境](#使用情境)
- [實作方法](#實作方法)
  - [背景圖消失](#背景圖消失)
  - [頁面沒有根據`<hr />`分割](#頁面沒有根據hr分割)
  - [不需要預設的頁首和頁尾](#不需要預設的頁首和頁尾)
- [＠media print](#＠mediaprint)
- [參考來源](#參考來源)

## 使用情境
有時候會碰到將網頁畫面列印出來的需求。以 BAIFA 報表為例，先用 Html 完成報表內容的排版，設定每一頁的尺寸為 A4 大小(長 595px、寬 842px)，並在每頁間用 `<hr />` 分割。完成的網頁如下：
![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/114177573/a46ff708-caeb-43a3-ade3-86f4465770d4)
然而列印出來的結果卻不如預期：
![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/114177573/e6398eff-5d83-42e5-b5be-313915b543fa)
這是因為我們沒有設定網頁的列印樣式。依據上面的輸出結果，我們可以整理出以下幾個需要修正的問題：

1. 背景圖消失
2. 頁面沒有根據 `<hr />` 分割
3. 不需要預設的頁首和頁尾

這些問題其實都可以透過 CSS 的語法解決。 CSS 不僅能控制前端網頁的呈現畫面，也有 `page-break-before` 、 `@page`等分頁用的屬性，還有針對列印結果的 Media Query 可設定。接下來我們將介紹和實作這些特殊的語法。

### 實作方法
#### 背景圖消失
為了讓畫面更加整潔，大多瀏覽器的列印模式預設都會去除一部份的顏色和圖案。要讓網頁中所有顏色都顯示，請在 globasl.css 中加入以下語法：
```css
* {
  -webkit-print-color-adjust: exact; /* 如果背景圖還是沒有顯現，可以在後面加上 !important */
}
```
![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/114177573/dde8fff3-27ff-4394-ad3c-beb94ecca67e)
這樣背景就有了。

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/114177573/0123ad4a-d2e9-4585-9f03-4034e776b4b6)
手動模式下也可以直接勾選「背景圖形」這個選項。

#### 頁面沒有根據\<hr/>分割
```css
page-break-after: auto | always | avoid /* 控制元素後是否分頁 */
page-break-before: auto | always | avoid /* 控制元素前是否分頁 */
page-break-inside: auto | always | avoid /* 控制元素本身是否分頁 */
```
透過這三個 CSS 屬性，我們就可以控制列印時，網頁該在哪些段落進行分割，主要有這幾種設定值：
- auto: 有必要時自動分頁
- always: 強制分頁
- avoid: 避免分頁

請在 [break-after mdn](https://developer.mozilla.org/en-US/docs/Web/CSS/break-after) 閱讀更詳細的說明。

回到我們的案例，給 `<hr />` 加上 `page-break-after` 的屬性。
```html
<hr style={{pageBreakAfter: 'always'}} />

// with Tailwind css
<hr className="break-after-always" />
```
![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/114177573/8c0fc15b-c1ad-4235-a558-330f3d0123d0)
![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/114177573/73f909c5-42c5-4fd9-9712-2a8552d155ea)
分頁問題也解決了。

#### 不需要預設的頁首和頁尾
`@page` 是用來設定列印的格式，在這裡可以調整頁面的尺寸(size)、邊界(margin)等。
```css
@page {
  margin: 2cm; /* 網頁內容與紙張的距離 */
  size: A4 | portrait | landscape | A4 portrait; /* 紙張的大小和方向，可以混合使用 */
}

/* 也可以針對特定頁面設定 */
@page :first {
  margin-top: 2cm;
}
```
[@page mdn](https://developer.mozilla.org/en-US/docs/Web/CSS/@page) 這裡可以查到更多用法。

在我們的案例使用以下語法：
```css
@page {
  margin: 0;
}
```
![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/114177573/40bf2610-21d5-4dd5-a854-d13b77080753)
透過 `margin`，將邊界設定為 0 即可清除頁首和頁尾。

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/114177573/81dd1958-c78a-4549-9a72-e61420741fcc)
「頁首及頁尾」的選項也可以手動取消。但邊界還是須用 `@page` 調整。
可以看到報表內容和紙張並沒有對整齊，這個也是透過 `@page` 處理紙張大小：
```css
@page {
  size: 595px 842px; /* 長 595px、寬 842px */
}
```
![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/114177573/72d75b86-2442-46cd-9441-fb3c1b5468fb)
這樣報表匯出的結果就符合預期了。

### ＠media　print
這是用於設定列印樣式的 Media Query，透過 `@media print` 我們可以讓網頁中的特定元素(如：navbar, footer)在列印時隱藏，或是做其他特殊調整。包在其 css 語法外層即可，用法和 `＠media screen` 或其他 Media Query 一致。
以下整理一些常用的 `＠media screen` 語法範例：
```css
@media print {
  /* 列印時隱藏特定元素 */
  .no-print {
    display: none;
  }

  /* 列印時將頁面背景設置為白色 */
  body {
    background-color: white;
  }

  /* 列印時將頁面寬度設置為 8.5 英寸 */
  body {
    width: 8.5in;
  }

  /* 列印時取消超鏈接的下劃線 */
  a:link,
  a:visited {
    text-decoration: none;
  }

  /* 列印時隱藏 navbar 和 footer */
  .nav,
  .footer {
    display: none;
  }

  /* 列印時避免切割到 page 的內容 */
  .page {
    page-break-inside: avoid;
    position: relative;
    min-height: 100vh;
  }
  /* 列印時在 page 下方加入頁數 */
  .page::after {
    content: counter(page-number);
    counter-increment: page-number 1;
    position: absolute;
    bottom: 0;
    font-size: 30px;
    text-align: center;
  }
}
```
> 內容引用自[此文章](https://kbytalk.com/html-print-css/)和[此文章](https://ithelp.ithome.com.tw/articles/10232006)

### 參考來源
- [在網頁當中如何設定列印格式?(CSS的media print設定)](https://kbytalk.com/html-print-css/)
- [關於 @media print 的二三事](https://kakadodo.github.io/2018/03/13/css-media-print-setting/)
- [@media print 你是誰？](https://tsengbatty.medium.com/media-print-%E4%BD%A0%E6%98%AF%E8%AA%B0-ae093fab85b8)
- [原來前端網頁列印，不是只要 window.print() 就好了](https://medium.com/unalai/%E5%8E%9F%E4%BE%86%E5%89%8D%E7%AB%AF%E7%B6%B2%E9%A0%81%E5%88%97%E5%8D%B0-%E4%B8%8D%E6%98%AF%E5%8F%AA%E8%A6%81-window-print-%E5%B0%B1%E5%A5%BD%E4%BA%86-7af44cacf43e)
- [CSS - 網頁列印與樣式](https://ithelp.ithome.com.tw/articles/10232006)
- [列印 Html 網頁時的強制換頁方式](http://www.eion.com.tw/Blogger/?Pid=1048)
