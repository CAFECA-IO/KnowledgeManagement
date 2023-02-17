# 什麼是 React Hydration Error
在第一次呈現您的應用程序時，預呈現的 React 樹 (SSR/SSG) 與在瀏覽器中首次呈現期間呈現的 React 樹之間存在差異。第一個渲染稱為 Hydration，這是React 的一個特性。

這可能會導致 React 樹與 DOM 不同步，並導致出現意外的內容/屬性。

簡而言之就是在畫畫面的時候，一些使用到的值也在初始化，在開始畫跟畫好的時候這個值有出現變化就會出現這個錯誤。

# 在什麼情況下碰到
在 TideBit-Defi 的專案裡，我們使用多個 context 來保存 app 裡面通用的參數，有些參數在第一次畫畫面的時候還在初始化

# 如何解決
## 推薦解法
在 [vercel](https://nextjs.org/docs/messages/react-hydration-error) 裡面推薦結合 useState 及 useEffect 取解決這個問題，
之所以這樣可以解決是因為可以在畫畫面的時候確保用到的值不改變。 

## 為什麼不用
1. 在開始開發前就有規劃 AppContext 用來掌管所有的 context 用來將它們初始化
2. 這樣可以統一初始化所有的 context 裡面需要的東西
3. 不需要在 component 裡面個別呼叫特定的 context 初始化
4. ~因為在 React v18.0 在開發中，[React 會調用 Effect 兩次](https://beta.reactjs.org/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)，但 React 說在 Production 中不會~

## 我的解法
1. 建立 AppContext 在 \_app.tx 裡面初始化
```typescript=
function App({Component, pageProps}: AppProps) {
  return (
    <UserProvider>
      <MarketProvider>
        <GlobalProvider>
          <NotificationProvider>
            <AppProvider>
              <Component {...pageProps} />
            </AppProvider>
          </NotificationProvider>
        </GlobalProvider>
      </MarketProvider>
    </UserProvider>
  );
}

export default appWithTranslation(App);
```

2. 在 AppContext 調用其他 context 的 init 方法
```typescript=
export const AppProvider = ({children}: IAppProvider) => {
  const userCtx = useContext(UserContext);
  const marketCtx = useContext(MarketContext);
  const notificationCtx = useContext(NotificationContext);
  const [isInit, setIsInit, isInitRef] = useState<boolean>(false);

  const init = async () => {
    if (!isInitRef.current) {
      setIsInit(true);
      console.log(`AppProvider init is called`);
      await userCtx.init();
      await marketCtx.init();
      await notificationCtx.init();
    }
    return;
  };

  const defaultValue = {
    isInit: isInitRef.current,
    init,
  };

  return <AppContext.Provider value={defaultValue}>{children}</AppContext.Provider>;
};
```

3. 在畫面 render 之前用 `<div>Loading...</div>` 之類的畫面，然後使用 `useEffect` 呼叫 `appCtx.init()`，在初始化完成後在呈現主畫面，利用 `appCtx.isInit` 的參數避免重複呼叫 `appCtx.init()`
```typescript=
const Home = () => {
  const appCtx = useContext(AppContext);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
  }, []);

  return appCtx.isInit ? (
    <>
      <Head>
        <title>TideBit DeFi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <main>
        <HeroDescription />
      </main>
    </>
  ) : (
    <div>Loading...</div>
  );
};

export default Home;
```

# 可以優化的部份
1. 這裡沒有用到 NextJS 提供的 [Pre-rendering and Data Fetching](https://nextjs.org/learn/basics/data-fetching/setup)
2. 因為 NextJs 是用 file routing 所以各個頁面沒有一個統一的入口，所以目前每個頁面都需實作步驟 3，但是因為有加條件判斷式所以是不會重複呼叫
