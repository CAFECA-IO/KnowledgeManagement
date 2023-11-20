- [前言](#前言)
- [效能比較](#效能比較)
  - [Context 頁面](#context-頁面)
  - [Zustand 頁面](#zustand-頁面)
  - [Redux toolkit 頁面](#redux-toolkit-頁面)
- [Context](#context)
- [Zustand](#zustand)
  - [在 Zustand 中管理 State](#在-zustand-中管理-state)
    - [創建 Zustand Store](#創建-zustand-store)
    - [在組件中使用 Zustand Store](#在組件中使用-zustand-store)
- [Redux toolkit](#redux-toolkit)
  - [Introduction](#introduction)
  - [Reducer](#reducer)
  - [在 Redux Toolkit 中管理 State](#在-redux-toolkit-中管理-state)
    - [創建 Slice](#創建-slice)
    - [配置和使用 Redux Store](#配置和使用-redux-store)
- [References](#references)

# 前言

當 Context 中的任何值發生變化時，所有依賴該 Context 的組件都將重新執行，這可能導致效能過度消耗，即使組件僅使用 Context 中的部分值。為了解決此問題，本文將討論使用 Zustand 跟 Redux toolkit 狀態管理庫與 Context 的差別，以及各自的使用方法，以提供更優化的解決方案。

# 效能比較

- 參考[用 Next.js 與 TailwindCSS 創建效能良好的網站](https://github.com/CAFECA-IO/KnowledgeManagement/blob/master/NextJs/creating-high-performance-rwd-websites-with-next.js.md#react-developer-tools)下載 extension 並勾選設定`Highlight updates when components render`，查看 components render 的範圍
- 效能實驗  [repo](https://github.com/arealclimber/js-nextjs-state-management-trial)｜  [網頁](https://js-nextjs-state-management-trial.vercel.app/)

### Context 頁面

- 使用 context 存取、變更 state

![Screenshot 2023-11-20 at 12 35 23](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/dacee75e-a415-4b7e-839a-d4b547a0812d)




https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/d2cd43cd-d609-49f6-82a1-c322b6b52dfa



### Zustand 頁面

- 使用 Zustand 存取、變更 state

![Screenshot 2023-11-20 at 12 35 43](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/15aa1e3c-cc28-4e0c-b252-0eaf8cc687ba)



https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/40a5501f-16fe-4e1a-9a3d-0827bec390e3



### Redux toolkit 頁面

- 使用 Redux toolkit 存取、變更 state

![Screenshot 2023-11-20 at 12 36 38](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/d398f42a-0ba2-4bee-80de-2f49e4cd214b)

https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/18ec8510-c12c-41e7-be95-4a471fcb3700


# Context

- 參考 [React-tips](https://github.com/CAFECA-IO/WorkGuidelines/blob/main/newbie/react-tips.md#usecontext)

# Zustand

Zustand 是一個簡單的狀態管理庫，它使用一個創建 store 的函數，你可以在其中定義 state 和更新它的函數。

## 在 Zustand 中管理 State

### 創建 Zustand Store

```jsx
import create from "zustand";

const useStore = create((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 })),
}));
```

### 在組件中使用 Zustand Store

```jsx
const Counter = () => {
  const { count, increase, decrease } = useStore();
  return (
    <div>
      <button onClick={decrease}>-</button>
      <span>{count}</span>
      <button onClick={increase}>+</button>
    </div>
  );
};
```

# Redux toolkit

## Introduction

- Reducer: 它是 Redux 架構的核心概念之一，用於描述應用的狀態如何響應不同的 actions 而改變。Reducer 是純函數，根據當前狀態和給定的 action 計算出新的狀態。
- Redux Toolkit: Redux Toolkit 是 Redux 的標準工具集，旨在簡化 Redux 應用的開發。它提供了 `createSlice` 和 `configureStore` 等函數，這些函數使得管理 Redux 狀態和寫作 reducers 更加簡單和高效。它還內置了一些最佳實踐，如 Redux Thunk 中間件，用於處理異步邏輯。
- 在 Redux Toolkit 中，你不需要明確地編寫 action types 和 action creators，因為 `createSlice` 會自動為你生成。這使得代碼更加簡潔並減少了錯誤。此外，Redux Toolkit 通過提供一個配置化的 store 創建方法，使得設置和維護 Redux 應用更加容易。

## Reducer

Reducer 是一個函數，它接受當前的 state 和一個 action 作為參數，然後返回一個新的 state。它的主要作用是根據 action 的類型來決定如何改變 state。在 Redux 和其他類似的狀態管理庫中，Reducer 是不可變的（immutable），意味著它們不會直接修改當前的 state，而是返回一個新的 state 對象。

```jsx
function myReducer(state, action) {
  switch (action.type) {
    case "ACTION_TYPE":
      // 返回一個更新後的 state
      return { ...state, ...action.payload };
    default:
      return state; // 在無匹配的情況下返回當前的 state
  }
}
```

## 在 Redux Toolkit 中管理 State

### 創建 Slice

Slice 是 Redux Toolkit 中的一個概念，它封裝了一部分 state 和與之相關的 reducers。

```jsx
import { createSlice, configureStore } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: { count: 0 },
  reducers: {
    increase: (state) => {
      state.count += 1;
    },
    decrease: (state) => {
      state.count -= 1;
    },
  },
});

export const { increase, decrease } = counterSlice.actions;
```

### 配置和使用 Redux Store

```jsx
import { Provider, useSelector, useDispatch } from "react-redux";

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});

const Counter = () => {
  const count = useSelector((state) => state.counter.count);
  const dispatch = useDispatch();

  return (
    <div>
      <button onClick={() => dispatch(decrease())}>-</button>
      <span>{count}</span>
      <button onClick={() => dispatch(increase())}>+</button>
    </div>
  );
};

const App = () => (
  <Provider store={store}>
    <Counter />
  </Provider>
);
```

在這個 Redux Toolkit 的例子中，`createSlice` 函數自動為你的 actions 生成 action creators 和 action types。`configureStore` 則設置了你的 Redux store。

# References

- [Zustand doc](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Redux toolkit doc](https://redux-toolkit.js.org/introduction/getting-started)
- [React Context API vs Zustand State Manager](https://medium.com/@viraj.vimu/react-context-api-vs-zustand-state-manager-98ca9ac76904)
  - [Example on CodeSandbox](https://codesandbox.io/p/sandbox/heuristic-diffie-iqhnqg?file=%2Fpages%2Fcontext-page.js%3A1%2C1)
