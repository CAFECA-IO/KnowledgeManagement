# React Component Lifecycle
## 生命週期概述
每個元件 (component) 都有各自獨立的生命週期 (lifecycle) ，透過 React 提供的各種生命週期函式 (lifecycle methods) ，指引 component 在不同階段完成該執行的任務。
<img width="1115" alt="image" src="https://user-images.githubusercontent.com/114177573/202624503-1c16ecd3-b41d-42da-b80c-297019b8c288.png">
這是[官網](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)提供的生命週期概覽圖，上面列出了不同階段中常用的 method

生命週期發展由左至右分成三個時期：

1. Mounting 安裝元件，當元件被加入到 DOM 中時會觸發
2. Updating 更新元件，當元件的 props 或 state 更新，重新渲染 (re-rendered) DOM 時會觸發
3. Unmounting 移除元件，當元件從 DOM 中被移除時會觸發

每個時期由上至下又可分為三個子階段：

1. Render 階段，產出 Virtual DOM diff
2. Pre-commit 階段，用來讀取 DOM
3. Commit 階段，把 component 的更新實際更新到 DOM 上

> Virtual DOM ：為了避免修改一個子節點就重新繪製整個 DOM ，導致瀏覽器效能低落，Virtual DOM 會先用自己的演算法 diff ，比對出先前的 Virtual DOM 和當前的 Virtual DOM 之差異，再去更動真實的 DOM ，有效減少渲染的次數 ，提高效能

以下將先從概覽圖的左至右，也就是 Mounting 、 Updating 、 Unmounting 個別的內部運作流程進行說明。再從上至下分別解說 Render 、 Pre-commit 、 Commit 三個子階段的功能與特性。

## Mounting
Mounting 是發生在 component 的實體剛建立並被加入 DOM 中的時候。每個 component 都只會經歷一次 Mounting。

### Constructor() 
通常在 React 中 constructor() 只會有兩種用途：初始化 state 和綁定事件。在[官方文件](https://zh-hant.reactjs.org/docs/react-component.html#constructor)中有提到，如果沒有要初始化 state 也不需要綁定任何 methods 時，這個 component 就不需要使用 constructor() 了。

### render()
render() 是 components 一定要實作的 method 。在 Mounting 時期 render() 大致會執行以下步驟：
1. 初始化 component instance
2. 產出 component 自定義的React element 。當 render 被呼叫時，它會檢查 this.props 和 this.state 並回傳以下類型的其中一項，以定義畫面如何被渲染：
  - React elements：用 JSX 創建的 react element ，指引 react 要渲染 DOM 或是我們定義的其他 component
  - String and numbers ：渲染文字節點 (Text node) 到 DOM 上
  - Arrays and fragments ：可以一次回傳多個 react element (詳情見 [fragments](https://reactjs.org/docs/fragments.html))
  - Portals ：用來渲染 children 到 DOM subtree (詳情見 [portals](https://reactjs.org/docs/portals.html))
  - Booleans or null ：什麼都不渲染

需要注意的是，render() 只是渲染前最後一個呼叫的生命週期函數，元件還沒有真的渲染到 DOM 上，所以必須是純粹函式(pure function)，不能在此做變更 state 或呼叫 API 等有 side effect 的事情。這點在之後會有更詳細的說明。

> Pure function：沒有產生 side effect 的函式。與其他 function 互不干擾，不會修改/引用/存取到外部變數。

### 更新 DOM 元素和 Refs
React 會把 Virtual DOM snapshot 產出來，並與上一個產出的 Virtual DOM snapshot 做比較（diff），決定哪些內容是要實際被更新到 DOM 上的。

### componentDidMount()
當 component 已經完成渲染就會呼叫這個函式，它用來處理那些有 DOM 元素之後才能做的事，以及更新 state、呼叫 API 取得資料。

## Updating
在 component 實體 的 props 或 state 被更新時觸發，會產生更新並重新渲染畫面。一個 component 的實體可能經歷多次 Updating 時期。

### render()
components 一定要實作的 method 。在 Updating 時期 render() 大致會執行以下步驟：
1. 決定 component 是否更新： React 會透過 shouldComponentUpdate() 函式讓開發者判斷 component 是否應該更新，此函式回傳的是布林值，預設為 true。如果回傳 false ，則包含 render() 、 componentDidUpdate() 以下 methods 就不會被執行。
2. 產出 component 自定義的React element 。此步驟和 Mounting 時進行的一樣。

### 更新 DOM 元素和 Refs

### componentDidUpdate()
再次完成渲染後呼叫，在這裡可以執行像在 componentDidMount() 中的操作，例如比對新舊 props/state 的差異，存取 DOM 、呼叫 API 等。
注意：若要使用 setState，記得要加上條件判斷，否則會一直更新 state ，元件一直重新渲染，導致造成無窮迴圈。

## Unmounting
發生在 component 的實體從 DOM 中移除時。只會經歷一次。

### componentWillUnmount()
清除在 componentDidMount() 中建立的資源，將用不到的 request、event listener、timer 移除，等於清理 useEffect 的作用。

## Error Handling
這是 React lifecycle 內建的錯誤處理函式，只會在 lifecycle methods 出錯時被觸發。

### componentDidCatch()
可以捕捉從子元件中拋出的錯誤，並將這個錯誤訊息提供給 [Error Boundary](https://reactjs.org/docs/error-boundaries.html) 元件。Error Boundary 的概念是當某個元件發生錯誤，包覆該元件的 Error Boundary 元件可以把錯誤訊息呈現在網頁上，避免一個小元件發生的錯誤影響到其它的父元件，導致整個頁面掛掉。但 Error Boundary 也有些限制：
- 只能捕捉子元件的錯誤，Error Boundary 元件本身不能捕捉自己
- 只能捕捉從 constructor(), render() 和各 lifecycle Methods 中發生的錯誤
- Event Handler & 非同步 (Asynchronous) & Server Side Render 程式中發生的錯誤無法被捕捉

---
接下來介紹 Render 、 Pre-commit 、 Commit 三個子階段的功能與特性。

## Render 階段
是 React 產出 React element 並決定有哪些 element 要被加到 DOM 中的階段。當 Mounting 與 Updating 被觸發時，首先都會執行 Render 階段。 React 在 Render 階段大致上會做以下幾個步驟：
1. 初始化 component instance (Mounting  only)
2. 決定 component 是否更新 (Updating  only)
3. 產出 component 自定義的 React element (Mounting & Updating)
4. 產出 Virtual DOM snapshot 並與上一個做比較
此階段的目的是「決定」哪些內容要實際 render 到 DOM 上。決定的方法可能是透過 render 產出 React element 與 Virtual DOM snapshot diff，又或是透過 shouldComponentUpdate() 來決定 instance 要不要更新。也就是說，此階段會是純 JavaScript 的操作，與實際畫面 (DOM) 完全無關。

### 特性：可能會被終止、暫停、重新執行
render 階段是有可能被 React 終止、暫停、重新執行的，原因是 React 要實現批次 (Batch) 或非同步 (Async) render 來提高效能。

### 必須是 pure function
在前面的特性中提到， render 階段的 lifecycle methods 是可能被多次執行的，所以此階段的 methods 都不可以有 side effect ，否則可能發生記憶體洩漏 (memory leak) 造成網頁崩潰。舉例來說，如果在 render階段就對後端發出 API request ，實際上在 render 時，此 API 有可能被呼叫多次。

### 包含的 methods
- Constructor()
- shouldComponentUpdate()
- render()
- setState

## Pre-commit 階段
此階段發生在 React 要把 element 加到 DOM 的前一刻，只發生在 Updating 時期。 React 在 Pre-commit 階段只會做以下這個步驟：
1. getSnapshotBeforeUpdate
這個 method 是讓開發者抓取改動前的 DOM 資訊並計算相關資料的函式(例如抓取 scrollbar 位置)， React 本身則沒有做其他額外的事。

### 用來讀取 DOM
這個階段只是用來讀取 DOM 並計算、回傳相關的值，因此不應該在這邊做其他的 side effect。

## Commit 階段
代表將元件實際更新到 DOM 上的階段，在三個時期都會被觸發，Mounting 時期與 Updating 時期的 render 之後， Unmounting 實際刪除元件之前。 React 在 Commit 階段只會做以下這些步驟：
1. 實際把 Virtual DOM 的 diff 更新到 DOM 上 (Mounting & Updating)。在 render 階段會產出一份 virtual DOM diff ， commit 階段則是負責把這些內容實際更新到 DOM 。
2. 呼叫對應的 lifecycle methods 。 Commit 階段也會呼叫對應的 lifecycle methods 作為特定時期的 callback 使用。 Mounting 時期與 Updating 時期都是在內容更新到 DOM 上後呼叫 lifecycle methods，只有 Unmouning 時期是在元件被刪除之前呼叫。

 ### 特性：不會被終止、暫停、重新開始
 commit 階段是更新的內容已經確定後才去修改畫面的，因此 React 不會終止、暫停或重新開始 commit 階段。
 
 ### 可執行 side effect 和操作 DOM
commit 階段的 lifecycle methods 是三個階段中唯一被允許執行 side effect 的階段，因為在這個階段， side effect 不會像 render 階段一樣被意外執行多次。需要呼叫後端 API 或是 setState 都可以在這一階段做。另外，因為這一階段的 lifecycle 也已經把變更更新到 DOM 上了，因此在這階段中可以正常的操作 DOM。

### 包含的 methods
- componentDidMount()
- componentDidUpdate()
- componentWillUnmount()

## 參考
- https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/
- https://ithelp.ithome.com.tw/articles/10244651
- https://ithelp.ithome.com.tw/articles/10201139
- https://ithelp.ithome.com.tw/articles/10278693
- https://ithelp.ithome.com.tw/articles/10278231
- https://ithelp.ithome.com.tw/articles/10244959
- https://www.fooish.com/reactjs/component-lifecycle.html
- https://medium.com/%E6%8A%80%E8%A1%93%E7%AD%86%E8%A8%98/react-%E5%AD%B8%E7%BF%92%E7%AD%86%E8%A8%98-3-%E8%81%8A%E8%81%8A%E5%85%83%E4%BB%B6%E7%9A%84%E7%94%9F%E5%91%BD%E9%80%B1%E6%9C%9F%E8%88%87-hooks-529a4d70f5a6
