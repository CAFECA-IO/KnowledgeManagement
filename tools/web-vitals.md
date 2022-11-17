# web-vitals 
## 簡介
Core Web Vitals 是 Google 分析大量使用者資料後，用於量化網站使用者體驗的指標。研究員歸納出載入效能、互動性、視覺穩定性三大方向，而這三大方向也衍伸為網站體驗的三大核心指標：LCP、FID、CLS。

![image](https://user-images.githubusercontent.com/114177573/202334384-3ba2e9e4-40f8-4ba3-b23f-7a7d2fdf03b7.jpeg)

- LCP 最大內容渲染時間(Largest Content Paint)：使用者用瀏覽器打開網頁時，網頁從開始等待畫面載入，直到主要畫面載入完成所需要的時間。建議完成時間為 2.5 秒內。
- FID 首次輸入延遲(First Input Delay)：從使用者第一次與頁面互動，到瀏覽器成功給出回應的時間。Google 建議頁面之 FID 應低於 100 毫秒。
- CLS 累計佈局位移(Cumulative Layout Shift)：頁面於開始到載入完成，過程中所有區塊移位分數的總和。評分範圍為 0~1 ，分數越高代表頁面的位移狀況越嚴重，網頁畫面的穩定性越差。建議分數應低於 0.1。

除了以上三項之外， web-vitals 還提供了其他指標，可作為優化 Core Web Vitals 的考量依據。前二者與 LCP 較相關，後二者和 FID 有關。

- First Contentful Paint (FCP)：從網頁開始載入到渲染出第一個元素到畫面上所花的時間。
- Time to First Byte (TTFB)：瀏覽器對 server 發出請求後到接收到回應資料(第一個 byte)所花的時間。
- Time to Interactive (TTI)：從網頁開始載入到最後一個長時間任務(long tasks)結束，且可以回應使用者互動所花的時間。
  - 長時間任務(long tasks)是指超過 50 毫秒的任務，可能是解析 HTML 建立 DOM Tree、解析 CSS 套用樣式、執行 JS 等。最後一個 Long task 代表 5 秒內沒有其他 Long task ，且當時沒有三個以上的 GET 請求。
- Total Blocking Time (TBT)：主執行緒被long tasks阻塞的總時間，這段時間被視為無法回應使用者互動的時間。
  - 阻塞的時間是指 long tasks 超過 50ms 的時間，將每個 long task time - 50ms 做總和就是 TBT。

## 使用方法
- 安裝 web-vitals
```shell
npm install web-vitals
```
- 在專案中的 src 資料夾中新增文件 reportWebVitals.js
```shell
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};
export default reportWebVitals;
```
- 於專案中的 index.js 文件中加入
```shell
import reportWebVitals from "./reportWebVitals";

...

reportWebVitals(console.log);
```
- 在 developer tool 應該能看見以下訊息
  - 有些指標要特定條件才會產生執行結果，例如 FID 須透過使用者與網頁有互動來觸發

<img width="1072" alt="image" src="https://user-images.githubusercontent.com/114177573/202349315-7158d95f-4ec4-4f08-8be0-7a8b9c541632.png">

- value 值為輸出結果，單位為毫秒(CLS 除外)

## 優化方法

1. 優化載入速度
由於網頁在顯示的過程中，背景會讀取大量的網頁原始碼與檔案，要有效降低 LCP ，最好的方法就是加速網頁載入的速度，以及調整主要畫面的載入順序，讓主要內容可以更快的呈現在使用者面前。能透過以下方法改善：

- 減少主機 Server 的載入時間
- 優化外部引用資源(CSS & JavaScript)
- 減少頁面元素載入時間
- 優化客戶端渲染(Client Side Rendering)

2. 優化互動反應能力
延遲互動回應時間的主要原因是繁重的 JavaScript 執行任務佔用著主執行緒，讓瀏覽器無法處理使用者的互動行為事件，因此優化 JS 程式碼執行速度可以有效改善。

- 拆分 long task
- 優化頁面的 JavaScript 載入流程
- 使用 Web Workers 技術
- 減少 JavaScript 的執行時間

3. 優化視覺穩定性

- 圖片元素使用固定百分比，或設定寬高比 CSS
- 外部嵌入資源設定尺寸 (Ads, embeds, iframes)
- 避免在現有內容上方插入動態載入的內容，導致推擠到其他元件的排版，可以先預留好需要的空間(CSS aspect ratio boxes)，或是將受影響的排版移到可視範圍之外
- 使用 Skeletor UI（先載入固定版位的前端技術）

## 參考來源
- https://ranking.works/%E6%8A%80%E8%A1%93SEO/core-web-vitals
- https://ithelp.ithome.com.tw/articles/10248039
- https://markdowner.net/article/155285708041748480
- https://www.npmjs.com/package/web-vitals
- https://gcdeng.com/blog/a-guidebook-to-optimize-web-vitals
- https://juejin.cn/post/6930903996127248392
- https://gcdeng.com/blog/a-guidebook-to-optimize-web-vitals#largest-contentful-paint-lcp
