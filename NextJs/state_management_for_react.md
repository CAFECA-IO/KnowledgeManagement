- [前言](#前言)
- [Context](#context)
- [Reducer](#reducer)
- [Zustand](#zustand)
  - [**在 Zustand 中管理 State**](#在-zustand-中管理-state)
    - [**創建 Zustand Store**](#創建-zustand-store)
    - [**在組件中使用 Zustand Store**](#在組件中使用-zustand-store)
- [Redux toolkit](#redux-toolkit)
  - [**在 Redux Toolkit 中管理 State**](#在-redux-toolkit-中管理-state)
    - [創建 Slice](#創建-slice)
    - [**配置和使用 Redux Store**](#配置和使用-redux-store)
- [References](#references)

# 前言

當 Context 中的任何值發生變化時，所有依賴該 Context 的組件都將重新執行，這可能導致效能過度消耗，即使組件僅使用 Context 中的部分值。為了解決此問題，本文將討論使用 Zustand 跟 Redux toolkit 狀態管理庫與 Context 的差別，以及各自的使用方法，以提供更優化的解決方案。

# Context

# Reducer

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

# Zustand

Zustand 是一個簡單的狀態管理庫，它使用一個創建 store 的函數，你可以在其中定義 state 和更新它的函數。

## \***\*在 Zustand 中管理 State\*\***

### **創建 Zustand Store**

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

## 在 Redux Toolkit 中管理 State

Redux Toolkit 是 Redux 的官方推薦方式，它提供了更簡潔的 API 來減少模板代碼。

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

在這個 Redux Toolkit 的例子中，**`createSlice`** 函數自動為你的 actions 生成 action creators 和 action types。**`configureStore`** 則設置了你的 Redux store。

# References

- [Zustand doc](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Redux toolkit doc](https://redux-toolkit.js.org/introduction/getting-started)
