# 什麼是 React Hydration Error
在第一次呈現您的應用程序時，預呈現的 React 樹 (SSR/SSG) 與在瀏覽器中首次呈現期間呈現的 React 樹之間存在差異。第一個渲染稱為 Hydration，這是React 的一個特性。

這可能會導致 React 樹與 DOM 不同步，並導致出現意外的內容/屬性。

簡而言之就是在畫畫面的時候，一些使用到的值也在初始化，在開始畫跟畫好的時候這個值有出現變化就會出現這個錯誤，

# 如何解決
## 推薦解法
在 [vercel](https://nextjs.org/docs/messages/react-hydration-error) 裡面推薦結合 useState 及 useEffect 取解決這個問題，
之所以這樣可以解決是因為可以在畫畫面的時候確保用到的值班不改變。 

## 我的解法
