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

需要注意的是，render() 只是渲染前最後一個呼叫的生命週期函數，元件還沒有真的渲染到 DOM 上，所以必須是純粹函式(pure function)，不能在此變更 state 或呼叫 api 等有 side effect 的事。這點在之後會有更詳細的說明。

> Pure function：沒有產生 side effect 的函式。與其他 function 互不干擾，不會修改/引用/存取到外部變數。

### 更新 DOM 元素和 Refs
React 會把 Virtual DOM snapshot 產出來，並與上一個產出的 Virtual DOM snapshot 做比較（diff），決定哪些內容是要實際被更新到 DOM 上的。

### componentDidMount()
當 component 已經完成渲染就會呼叫這個函式，它用來處理那些有 DOM 元素之後才能做的事，以及更新 state、呼叫 API 取得資料。

## Updating
在 component 實體 的 props 或 state 被更新時觸發，會產生更新並重新渲染畫面。一個 component instance 可能經歷多次 Updating 時期。

### render()
components 一定要實作的 method 。在 Updating 時期 render() 大致會執行以下步驟：
1. 決定 component 是否更新： React 會透過 shouldComponentUpdate() 函式讓使用者判斷 component 是否應該更新，此函式回傳的是布林值，預設為 true。如果回傳 false ，則包含 render() 、 componentDidUpdate() 以下 methods 就不會被執行。
2. 產出 component 自定義的React element 。此步驟和 Mounting 時進行的一樣。

### 更新 DOM 元素和 Refs

### componentDidUpdate()
再次完成渲染後呼叫，在這裡可以執行像在 componentDidMount() 中的操作，例如比對新舊 props/state 的差異，存取 DOM 、呼叫 API 等。
注意：若要使用 setState，記得要加上條件判斷，否則會一直更新 state ，元件一直重新渲染，導致造成無窮迴圈。

## Unmounting

## Error Handling
這是 React lifecycle 內建的錯誤處理函式，只會在 lifecycle methods 出錯時被觸發。

## 參考
- https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/
- https://ithelp.ithome.com.tw/articles/10244651
- https://ithelp.ithome.com.tw/articles/10201139
- https://ithelp.ithome.com.tw/articles/10278693
- https://www.fooish.com/reactjs/component-lifecycle.html#render
