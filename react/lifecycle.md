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

### 1. Constructor() 
通常在 React 中 constructor 只會有兩種用途：初始化 state 和綁定事件。在[官方文件](https://zh-hant.reactjs.org/docs/react-component.html#constructor)中有提到，如果沒有要初始化 state 也不需要綁定任何 methods 時，這個 component 就不需要 constructor 了。

### 2. render()
render 是 components 一定要實作的 method ，當 render 被調用時，他會檢查 this.props 和 this.state 並回傳以下類型的其中一項：
- React elements：用 JSX 創建的 react element ，指引 react 要渲染 DOM 或是我們定義的其他 component
- String and numbers ：渲染文字節點 (Text node) 到 DOM 上
- Arrays and fragments ：可以一次回傳多個 react element (詳情見[fragments](https://reactjs.org/docs/fragments.html))
- Portals ：用來渲染 children 到 DOM subtree (詳情見 [portals](https://reactjs.org/docs/portals.html))
- Booleans or null ：什麼都不渲染

需要注意的是，render 只是渲染前最後一個呼叫的生命週期函數，元件還沒有真的渲染到 DOM 上。所以不能在 render 中操作有關 return 元素的 DOM。這點在後面會有更詳細的說明。

### 3. 更新 DOM 元素和 Refs

### 4. componentDidMount()

## Updating

## Unmounting

## Error Handling
這是 React lifecycle 內建的錯誤處理函式，只會在 lifecycle methods 出錯時被觸發。

> Pure function：

## 參考
- https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/
- https://ithelp.ithome.com.tw/articles/10244651
- https://ithelp.ithome.com.tw/articles/10201139
