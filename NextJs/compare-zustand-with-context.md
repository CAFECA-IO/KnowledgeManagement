目錄

- [效能差別](#效能差別)
  - [Context](#context)
  - [Zustand](#zustand)
- [原有 Context 寫法](#原有-context-寫法)
- [用 Zustand 重構的寫法](#用-zustand-重構的寫法)
- [References](#References)


# 效能差別

### Context

- [測試用 PR](https://github.com/CAFECA-IO/TideBit-DeFi/pull/1441)

使用 Chrome 無痕模式開啟[網頁](https://tidebit-defi-6mxg6i5si-cafeca.vercel.app/en/trade/cfd/eth-usdt)，網頁停留一分鐘，CPU 約消耗 40.2-70，Memory footprint 約 66-106 MB 


https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/5a807e74-ddf8-4e5b-8b14-a21ef5e3ec98


### Zustand

- [測試用 PR](https://github.com/CAFECA-IO/TideBit-DeFi/pull/1440)

使用 Chrome 無痕模式開啟[網頁](https://tidebit-defi-9peh12ga7-cafeca.vercel.app/trade/cfd/eth-usdt)，網頁停留一分鐘，CPU 約消耗 22.9-50.4，Memory footprint 約 68-88 MB ，CPU 約優化 28%-43%，Memory 約優化 17% 

https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/0ec3f92b-8a3d-4884-abab-a25b0f58b2f6


# 原有 Context 寫法

- 在 worker context 初始化 pusher 、提供 API worker，並開啟 pusher 監聽 channel，使用 notification context 提供的 event emitter emit 相關資訊，並由對應的 context 透過 notification context 接收相關資訊，然後用 function 處理拿到的資料，最後使用 useRef() 設定變數，讓相關 component 可以渲染出最新的資料
    - 例如實時更新的蠟燭圖， trades 由 market context 接收資訊，然後使用 tradeBook.add function ，將 trades 資料儲存起來；接著也是在 market context 設定每 0.1 秒將儲存在 tradeBook 的 trades 轉換成 candlestick chart data ，並且將這些剛轉換好的資料用 useRef() 儲存起來，然後 export 給 components render。

# 用 Zustand 重構的寫法

- 使用 create() 創造可以被所有元件使用的 stores，分別創造 worker 跟 market 各自提供原有 worker context 跟 market context 的與 TideBit promotion 跟 TideBit reserve 跟蠟燭圖渲染（初始化 trades 資料跟監聽 trades 更新）相似功能，但不在 store 裡面初始化，而是在 _app.tsx 初始化這兩個 stores
    - 為了簡化實驗，沒有實作 API worker 跟 queue 的功能，在 production 模式下不會有 race condition 或 duplicate requests 的問題
- 然後在 candlestick chart component 裡面使用 subscribe() 監聽 worker store 的 trades 資料，然後使用 market store 的 function 儲存 trades 並且每 0.1 秒畫出蠟燭圖

### lib/stores/worker.ts

- [參考 PR](https://github.com/CAFECA-IO/TideBit-DeFi/pull/1440/files#diff-9df147470ad72240aaa1734c585ab5fb7077e460d7209db49e438ba7fafad86a)

### lib/stores/market.ts

- [參考 PR](https://github.com/CAFECA-IO/TideBit-DeFi/pull/1440/files#diff-9df147470ad72240aaa1734c585ab5fb7077e460d7209db49e438ba7fafad86a)

### pages/_app

- [參考 PR](https://github.com/CAFECA-IO/TideBit-DeFi/pull/1440/files#diff-9df147470ad72240aaa1734c585ab5fb7077e460d7209db49e438ba7fafad86a)


### candlestick chart component

```jsx
useEffect(() => {
    const unsubscribe = useWorkerStore.subscribe(newData => {
      if (newData.trades === undefined || !newData.trades || newData.trades.length === 0) return;
      if (lastTradeIdRef.current === newData.trades[newData.trades.length - 1]?.tradeId) return;
      setLastTradeId(newData.trades[newData.trades.length - 1].tradeId);
      addTradesToTradeBook.current(newData.trades);
    });

    const intervalId = setInterval(() => {
      const candles = convertTradesToCandlesticks.current();
      setCandlestickDataByChart(candles);
    }, UPDATE_CANDLESTICK_CHART_INTERVAL);

    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, []);
```


# References

- [Zustand GitHub (必讀)](https://github.com/pmndrs/zustand)
- [Zustand 簡體中文筆記](https://awesomedevin.github.io/zustand-vue/docs/introduce/start/zustand)
    - [zustand-pub (跨应用/跨框架 状态管理及共享)](https://awesomedevin.github.io/zustand-vue/docs/introduce/start/zustand-pub)
- [Zustand. React state management done right with bear minimum](https://tsh.io/blog/zustand-react/)
- [Transient updates (for often occurring state-changes)](https://github.com/pmndrs/zustand#transient-updates-for-often-occurring-state-changes)
- [useShallow vs shallow](https://github.com/pmndrs/zustand/discussions/2203)
- [Fetching data with Effects](https://react.dev/reference/react/useEffect#fetching-data-with-effects)
- [Fixing Race Conditions in React with useEffect](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)
