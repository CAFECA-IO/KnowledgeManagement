# **用Next.js與TailwindCSS創建效能良好的網站**

在現代網站開發中，效能是不可忽視的要素。以下將探討如何利用Next.js與TailwindCSS來打造效能卓越的網站。

## **1. 效能指標介紹**

可參考：**[web-vitals](https://github.com/CAFECA-IO/KnowledgeManagement/blob/master/tools/web-vitals.md#web-vitals)**

- **測試工具**: 使用Google的 [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) 來檢測頁面加載速度。
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
- 頁面在構建時生成，並且每個請求都重用相同的HTML。這提供了極佳的性能和SEO優勢。在Next.js裡，你只要在`pages`**目錄下建一個檔案（比如**`about.js`），然後Next.js在 build 階段會自動把它變成一個靜態頁面。

```jsx
// pages/data.js
export default function Data({ data }) {
  // 假設資料是一個包含多個項目的陣列
  return (
    <div>
      <h1>資料列表：</h1>
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
  const res = await fetch('<https://api.example.com/data>');
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
- 每次請求時，都會在伺服器上實時生成頁面。這有利於SEO並且允許頁面內容根據用戶請求動態更改。在這個例子裡，每次有人訪問`/profile`**頁面的時候，**`getServerSideProps`會在伺服器上運行，並且生成一個新的頁面給用戶。

```jsx
// pages/profile.js
export default function Profile({ username }) {
  return <div>Hello, {username}!</div>;
}

export async function getServerSideProps(context) {
  // 假設我們從一個API獲取用戶名
  const response = await fetch('<https://api.example.com/user>');
  const data = await response.json();

  return {
    props: {
      username: data.username,
    },
  };
}

```

## **3. 改善Largest Contentful Paint (LCP)**

優化圖像和媒體檔案大小，並利用Next.js的`Image`組件來實現圖片的延遲加載和自動格式轉換。

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

### 避免不必要的重新渲染

### 檢查重新渲染的工具

勾選 Paint flashing 之後，會在 component 被重新繪製時標註螢光色

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/3a9cad5e-aed1-41c0-be43-060b6e297a52)

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/ca511547-1f2c-4469-aed6-5b661ed04381)


### **React Developer Tools**

- 從 Chrome 下載 **[React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)**之後，打開瀏覽器 dev tool 可以看到 `Components` 跟 `Profiler`。其中 `Profiler` 可以錄製在網站重整之後用戶在網站執行操作之後造成的 render。

- 勾選 `Highlight updates when components render` ，在組件重新渲染時，可以看到組件被線條框住，綠色線條代表重新渲染的次數較少，黃色線條代表被重新渲染許多次。

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/cb9509be-9172-414b-a649-82b5a7a50804)
![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/f6a19871-4fd9-4ece-ba4f-ce51f293aa17)


- 在造成渲染的原因中，“`This is the first time the component rendered.`”是正常的原因，其他原因如 “`The parent component rendered.`”跟“`Context changed`” 等等是效能優化時須斟酌是否能改善的地方

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/518893d0-13ce-4ace-ba84-d7fa1aefd140)


![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/7b70cd2a-ced5-448c-8909-0fb6a926fa09)


### 用 React.memo

**`React.memo`** 是一個 React 提供的高階組件，它可以讓你在組件的 props 未改變時避免重新渲染。當你將一個組件包裹在 **`React.memo`** 中，該組件只有在其 props 發生變化時才會重新渲染。

```jsx
const MemoizedComponent = memo(SomeComponent);
```

這意味著，即使父組件重新渲染，只要 **`MemoizedComponent`** 的 props 沒有改變，它就不會重新渲染。這可以提高 React 應用的性能，特別是在大型應用中。

### 用 useMemo 跟 useCallback

- 當使用 **`React.memo`** 時，你的組件會在任何 prop 不與之前的值淺比較相等(shallow equality)時重新渲染。這意味著 React 使用 **`Object.is`** 比較來確定 props 是否有所改變。例如，**`Object.is(3, 3)`** 返回 **`true`**，但 **`Object.is({}, {})`** 返回 **`false`**。
    - [shallowEqual source code](https://github.com/facebook/fbjs/blob/main/packages/fbjs/src/core/shallowEqual.js#L39-L67)
- 要充分利用 **`React.memo`**，你應該盡量減少 props 的改變次數。例如，如果 prop 是一個 object，你可以使用 **`useMemo`** 防止父組件每次重新渲染時都重新創建該 object：

```jsx
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  const person = useMemo(() => ({ name, age }), [name, age]);
  return <Profile person={person} />;
}
```

### 避免在 component 裡創造新的 static object 或 static array

在 component 裡面的 object 或 array，會隨著 re-render 而重新計算或重新生成，如果是靜態變數，可以搬到 component 外面，避免重新生成。

```jsx
const options = {
  serverUrl: 'https://localhost:1234',
  roomId: 'music'
};

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
```

### 使用狀態管理工具

- 打開 React developer tool 的 `Highlight updates when components render`，從 [Code Sandbox example](https://codesandbox.io/s/heuristic-diffie-iqhnqg?file=/pages/context-page.js) 可以看到 context 會造成所有組件重新渲染，但使用狀態管理工具則可以避免不必要的組件重新渲染
- context 的寫法是用 provider 包住所有組件，這樣會在 provider 值更新後，重新渲染 `Winner` 跟 `Players`
    
    ```jsx
    export default function ContextComponent() {
      return (
        <div className={styles.container}>
          <main className={styles.main}>
            <StoreContextProvider>
              <Winner />
              <Players />
            </StoreContextProvider>
          </main>
        </div>
      );
    }
    ```
    
- 使用 Zustand 則可以只讓該 `Player` 跟 `Winner` 重新渲染

### TailwindCSS 的 CSS 優化解法

可通過以下配置跟指令壓縮CSS，但在壓縮前後，透過 dev tool 的 Network 看到 CSS 大小跟時間沒有太大差別。 

- 壓縮前
    
    ![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/78f6c8a3-1c3f-4d1a-bd17-ae984467ef8e)

    
- 壓縮後
    
  ![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/fafa0013-6b2d-4822-89ac-0f842ac5db78)


    
- `npx tailwindcss -o build.css --minify`

```jsx
// postcss.config.js

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
  }
}
```

# 參考資料

- [Improving your Core Web Vitals](https://nextjs.org/learn/seo/improve)
- **[Optimizing for Production - TailwindCSS](https://tailwindcss.com/docs/optimizing-for-production)**
- **[Should you add memo everywhere?](https://react.dev/reference/react/memo)**
- **[Does some reactive value change unintentionally?](https://react.dev/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)**
- **[React Developer Tools | Components & Profiler](https://www.youtube.com/watch?v=4U37IRrt_zQ)**
- **[Improve your React app performance using React Profiler](https://medium.com/inato/prevent-re-renders-in-your-react-app-using-react-profiler-93c492110e30)**
- [shallowEqual source code](https://github.com/facebook/fbjs/blob/main/packages/fbjs/src/core/shallowEqual.js#L39-L67)
- **[我一直以为这就是JS中的浅比较，直到...](https://juejin.cn/post/7170364934889406495)**
- [Code sandbox - heuristic-diffie-iqhnqg](https://codesandbox.io/s/heuristic-diffie-iqhnqg?file=/pages/context-page.js)
