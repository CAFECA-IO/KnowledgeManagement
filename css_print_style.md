## 使用情境
有時候會碰到將網頁畫面列印出來的需求。以 BAIFA 報表為例，先用 Html 完成報表內容的排版，設定每一頁的尺寸為 A4 大小(長 595px、寬 842px)，並在每頁間用 `<hr />` 分割。完成的網頁如下：
![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/114177573/a46ff708-caeb-43a3-ade3-86f4465770d4)
然而列印出來的結果卻不如預期：
![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/114177573/e6398eff-5d83-42e5-b5be-313915b543fa)
這是因為我們沒有設定網頁的列印樣式。依據上面的輸出結果，我們可以整理出以下幾個需要修正的問題：

1. 背景圖消失
2. 頁面沒有根據 `<hr />` 分割
3. 不需要預設的頁首和頁尾

這些問題其實都可以透過 CSS 的語法解決。 CSS 不僅能控制前端網頁的呈現畫面，還有針對列印結果的 Media Query 可設定，除此之外，也有 `break-before` 、 `@page`等。接下來我們將介紹和實作這些特殊的語法。

### 實作方法
#### 1. 背景圖消失
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

#### 2. 頁面沒有根據 <hr /> 分割

### 參考來源
- [在網頁當中如何設定列印格式?(CSS的media print設定)](https://kbytalk.com/html-print-css/)
- [關於 @media print 的二三事](https://kakadodo.github.io/2018/03/13/css-media-print-setting/)
