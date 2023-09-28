# ****用Next.js與TailwindCSS創建效能良好的網站****

在現代網站開發中，效能是不可忽視的要素。以下將探討如何利用Next.js與TailwindCSS來打造效能卓越的網站。

## **1. 效能指標介紹**
- **測試工具**: 使用Google的[PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)來檢測頁面加載速度。
  
可參考：**[web-vitals](https://github.com/CAFECA-IO/KnowledgeManagement/blob/master/tools/web-vitals.md#web-vitals)**

- **First Contentful Paint (FCP)**: 衡量當第一塊內容（例如文字或圖像）在用戶的屏幕上被渲染的時間。**建議完成時間為 2.5 秒內**。
- **Largest Contentful Paint (LCP)**: 衡量最大內容元素（例如圖片或文本區塊）完成渲染在屏幕上的時間。**建議頁面之 FID 應低於 100 毫秒**。
- **Total Blocking Time (TBT)**: 衡量在首次繪製和完全交互之間所有阻塞事件的總時間。**建議完成時間為 200 毫秒內**。
- **Cumulative Layout Shift (CLS)**: 衡量視覺上的內容如何在頁面加載時移動，代表布局的穩定性。**建議分數應低於 0.1**。
- **Speed Index (SI)**: 衡量頁面內容呈現速度的指標，反映出用戶看到頁面內容的速度。**建議完成時間在3.5秒以內。**

## **2. 改善First Contentful Paint (FCP)**

利用Next.js的服務器渲染（SSR）或靜態網站生成（SSG）特性，能更快地提供首次內容，從而改善FCP。

可參考：**[什麼時候用 Server Side Rendering 與 Static Side Generation](https://github.com/CAFECA-IO/KnowledgeManagement/blob/master/NextJs/SSR_vs_SSG.md#%E4%BB%80%E9%BA%BC%E6%99%82%E5%80%99%E7%94%A8-server-side-rendering-%E8%88%87-static-side-generation)**

以下簡單解釋SSG跟SSR的差別跟例子：

### SSG

- 想像你要開一個咖啡店，但是你只賣一種咖啡。每個客人來了都要等你現場煮，這樣會很慢對吧？如果你事先煮好一大壺咖啡，每個客人來了就直接倒給他們，這樣多快多好！SSG 就是這樣，它事先把所有的網頁都“煮”好（也就是生成好），等到有人來訪問的時候，直接給他們。
- 頁面在構建時生成，並且每個請求都重用相同的HTML。這提供了極佳的性能和SEO優勢。在Next.js裡，你只要在**`pages`**目錄下建一個檔案（比如**`about.js`**），然後Next.js在 build 階段會自動把它變成一個靜態頁面。

```jsx
// pages/data.js
export default function Data({ data }) {
  // 假設數據是一個包含多個項目的陣列
  return (
    <div>
      <h1>數據列表：</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export async function getStaticProps() {
  // 從API獲取數據
  const res = await fetch('https://api.example.com/data');
  const data = await res.json();

  // 返回數據作為props
  return {
    props: { data },
    revalidate: 1, // 每秒重新生成頁面一次
  };
}
```

### SSR

- 現在想像你的咖啡店開始賣很多種不同的咖啡。每個客人來了都可以點不同的咖啡，這時候你不能事先都煮好，因為你不知道他們要什麼。但是你可以等他們來了之後，現場為他們煮他們想要的咖啡。這樣每個人都可以喝到他們想要的咖啡，但是他們可能要等一下。SSR就是這樣，每次有人來訪問網站的時候，它都會為他們生成一個新鮮的頁面。
- 每次請求時，都會在伺服器上實時生成頁面。這有利於SEO並且允許頁面內容根據用戶請求動態更改。在這個例子裡，每次有人訪問**`/profile`**頁面的時候，**`getServerSideProps`**會在伺服器上運行，並且生成一個新的頁面給用戶。

```jsx
// pages/profile.js
export default function Profile({ username }) {
  return <div>Hello, {username}!</div>;
}

export async function getServerSideProps(context) {
  // 假設我們從一個API獲取用戶名
  const response = await fetch('https://api.example.com/user');
  const data = await response.json();

  return {
    props: {
      username: data.username,
    },
  };
}
```

## **3. 改善Largest Contentful Paint (LCP)**

優化圖像和媒體檔案大小，並利用Next.js的**`Image`**組件來實現圖片的延遲加載和自動格式轉換。

```jsx
import Image from 'next/image';

function MyImageComponent() {
  return (
    <Image src="/my-image.jpg" alt="Picture" width={500} height={500} />
  );
}
```

## **4. 改善Total Blocking Time (TBT)**

避免大量的JavaScript在主線程上執行，利用Next.js的程式碼拆分和懶加載特性來減少主線程的阻塞時間。

```jsx
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('../components/hello'));

function MyPage() {
  return <DynamicComponent />;
}
```

## **5. 改善Cumulative Layout Shift (CLS)**

保持布局的穩定性，避免在加載時元素的移動。指定圖片和影片的尺寸，並避免在加載時插入新內容。

```jsx
<img src="/my-image.jpg" alt="Picture" width="500" height="500" />
```

## **6. 改善Speed Index (SI)**

利用Next.js的優化特性，例如程式碼拆分、懶加載、和SSR或SSG來改善頁面的加載速度和交互速度。此外，配置CDN和優化靜態資源的傳送也能有助於提高Speed Index。

### **配置 Content Delivery Network (CDN)**

Content Delivery Network (CDN) 是一種服務，它通過在地理上分散的伺服器來儲存和提供網站的靜態資源（例如圖片、CSS、JavaScript）。當用戶訪問網站時，CDN會從離用戶最近的節點提供資源，從而減少了加載時間。配置CDN的基本步驟如下：

1. **選擇CDN提供商**:
    - 選擇一個CDN提供商，例如Cloudflare、AWS CloudFront或Google Cloud CDN。
2. **註冊和設置CDN賬戶**:
    - 跟隨CDN提供商的指南註冊並設置你的賬戶。
3. **配置CDN**:
    - 在CDN控制台中，創建一個新的CDN分發並配置你的網站的域名和源伺服器地址。
4. **更新DNS記錄**:
    - 更新你的域名的DNS記錄，以指向CDN服務而不是你的原始伺服器。
5. **驗證配置**:
    - 確保你的網站通過CDN正確地傳遞，並檢查加載速度是否有所改善。

### **緩存策略的例子**

緩存策略是指定何時和如何緩存網站資源的規則。一些常見的緩存策略例子包括：

1. **Browser Caching**:
    - 設置HTTP頭部的**`Cache-Control`**和**`Expires`**字段來指定瀏覽器應該如何緩存資源。

```jsx
Cache-Control: max-age=3600, must-revalidate
```

1. **CDN Caching**:
    - 在CDN配置中，設置資源的緩存規則，例如緩存時間和緩存清理策略。
2. **ETag Caching**:
    - 使用**`ETag`**頭來提供資源的版本標識，當資源更改時，**`ETag`**也會更改，促使瀏覽器重新加載資源。

```jsx
ETag: "12345"
```

**Last-Modified Caching**:

- 使用**`Last-Modified`**頭來指定資源最後一次修改的時間，瀏覽器可以使用這個信息來確定是否需要重新加載資源。

```jsx
Last-Modified: Tue, 15 Sep 2020 12:45:26 GMT
```

**URL Versioning**:

- 通過更改資源的URL來清除舊的緩存，通常是在資源的URL中包括版本號或時間戳。

```jsx
/css/styles-v2.css
```

### 避免不必要的重新渲染

1. 用 React.memo
2. 用 useMemo 跟 useCallback
3. 避免在渲染時創造新的 object 或 array
4. 使用狀態管理工具

### TailwindCSS 的 CSS 優化解法

- Tree-shaking optimization


# 參考資料

- [Improving your Core Web Vitals](https://nextjs.org/learn/seo/improve)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Redux](https://redux-toolkit.js.org/)
