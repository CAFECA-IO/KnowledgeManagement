# React Component Lifecycle
每個元件 (component) 都有各自獨立的生命週期 (lifecycle) ，透過 React 提供的各種生命週期函式 (lifecycle methods) ，指引 component 在不同階段完成該執行的任務。
<img width="1115" alt="image" src="https://user-images.githubusercontent.com/114177573/202624503-1c16ecd3-b41d-42da-b80c-297019b8c288.png">
這是官網提供的生命週期圖，上面列出了不同階段中常用的 method ，更詳細的生命週期圖請[見此](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)。

生命週期發展由左至右分成三個時期：

1. Mounting 安裝
2. Updating 更新
3. Unmounting 移除

每個時期由上至下又可分為三個子階段：

1. Render 階段
2. Pre-commit 階段
3. Commit 階段


## 參考
- https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/
- https://ithelp.ithome.com.tw/articles/10244651
