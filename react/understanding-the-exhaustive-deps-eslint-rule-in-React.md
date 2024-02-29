# 前言

前陣子筆者在開發 React NextJS 專案時，遇到了一個 Eslint 規則的警告，規則名稱是 `react-hooks/exhaustive-deps`。

上網爬文爬到這篇文章：[Understanding the exhaustive-deps Eslint rule in React](https://bobbyhadz.com/blog/react-hooks-exhaustive-deps)，幫助筆者認識這個警告訊息。此文章是筆者對這篇文章的翻譯，並稍微加入了一些自己的理解。

# 了解 React 中 exhaustive-deps ESLint 規則

「react-hooks/exhaustive-deps」規則在我們的 effect hook 中缺少依賴時會發出警告。

為了消除警告，將函數或變數聲明移到 useEffect hook 內，對於每次渲染都會變化的陣列和物件進行記憶化，或者禁用該規則。

以下是導致警告的例子。

App.js :

```jsx
import React, { useEffect, useState } from "react";

export default function App() {
  const [address, setAddress] = useState({ country: "", city: "" });

  // 👇️ objects/arrays are different on re-renders
  // they are compared by reference (not by contents)
  const obj = { country: "Germany", city: "Hamburg" };

  useEffect(() => {
    setAddress(obj);
    console.log("useEffect called");

    // ⛔️ React Hook useEffect has a missing dependency: 'obj'.
    // Either include it or remove the dependency array. eslintreact-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Country: {address.country}</h1>
      <h1>City: {address.city}</h1>
    </div>
  );
}
```

- 物件/陣列在重新渲染時會有不同，它們是按參考(reference)比較的，而不是按內容(contents)比較
- React Hook useEffect 缺少依賴: 'obj'。請將其加入或移除依賴陣列。eslintreact-hooks/exhaustive-deps

這個範例的問題在於我們在 [useEffect](https://react.dev/reference/react/useEffect) hook 內部使用了 obj 變數，但我們沒有將它包含在依賴陣列中。

最直覺的解決方案是將 obj 變數添加到 useEffect hook 的依賴陣列中。 (詳見下面補充)

然而，在處理物件或陣列時，我們不能像處理原始類型 (如字串或數字) 時那樣簡單地添加依賴。
這個範例這樣做會引發錯誤，因為在 JavaScript 中，物件和陣列是按照參考進行比較的。

obj 變數是一個具有相同鍵值對的物件，在每次重新渲染時都是如此，但它指向的記憶體位置每次都不同，因此它將通過相等性檢查並導致[無限重新渲染迴圈](https://bobbyhadz.com/blog/react-too-many-re-renders-react-limits-the-number)。

> 在 JavaScript 中，陣列也是按參考比較的。

### 補充 - Eslint 提示解法：將遺漏的依賴項包含在陣列中

此警告訊息最常見的解決方法就是：將遺漏的依賴項添加到陣列中。

App.js:

```jsx
import { useState, useEffect } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  const [age, setAge] = useState(0);

  useEffect(() => {
    setAge(count + 20);
  }, [count]); // 👈️ 包含了 count

  return (
    <div>
      <button onClick={() => setCount((count) => count + 1)}>Increment count {count}</button>

      <p>Age: {age}</p>
    </div>
  );
}
```

useEffect hook 使用了 count 變數，因此它必須包含在依賴陣列中。

![include-missing-dependencies-in-the-array](https://github.com/CAFECA-IO/KnowledgeManagement/assets/105651918/f62ae72c-549b-4d20-96ed-98e73de27f03)

# 解決方法

## 1. 停用 Eslint 規則

繞過警告 React Hook useEffect has a missing dependency 的一種方法是為單行或整個文件停用 Eslint 規則。

App.js :

```jsx
import React, { useEffect, useState } from "react";

export default function App() {
  const [address, setAddress] = useState({ country: "", city: "" });

  // 👇️ 在重新渲染時，物件／陣列是不同的
  const obj = { country: "Germany", city: "Hamburg" };

  useEffect(() => {
    setAddress(obj);
    console.log("useEffect called");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Country: {address.country}</h1>
      <h1>City: {address.city}</h1>
    </div>
  );
}
```

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/105651918/943e0f40-df3c-40aa-937f-111f5c3aea88)
(disabling the eslint rule)

在依賴陣列上面的註解針對單行停用了 `react-hooks/exhausting-deps` 規則。

當 `useEffect` hook 的第二個參數被傳入一個空陣列時，它只會在元件掛載(component mounts)時被調用。

> 補充：元件掛載(component mounts)
>
> 當元件成功插入到 DOM 中時，我們稱之為掛載(mounted)。在更新階段，元件在 DOM 中存在時會被更新。在卸載階段，元件會從 DOM 中移除。
>
> By [What does it mean for a component to be mounted in ReactJS ?](https://www.geeksforgeeks.org/what-does-it-mean-for-a-component-to-be-mounted-in-reactjs/)

## 2. 將變數或函數宣告移到 useEffect hook 內部

另一個解決方案是將變數或函數宣告移到 `useEffect` hook 內部。

App.js :

```jsx
import React, { useEffect, useState } from "react";

export default function App() {
  const [address, setAddress] = useState({
    country: "",
    city: "",
  });

  useEffect(() => {
    // 👇️ 將物件／陣列／函數宣告移到 useEffect hook 內部
    const obj = { country: "Germany", city: "Hamburg" };

    setAddress(obj);
    console.log("useEffect called");
  }, []);

  return (
    <div>
      <h1>Country: {address.country}</h1>
      <h1>City: {address.city}</h1>
    </div>
  );
}
```

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/105651918/77134900-cf82-4c72-b85b-700afae08840)
(move variable or function inside use effect hook)

我們將物件的變數宣告移到 `useEffect` hook 內。

這樣做可以消除警告，因為 hook 不再依賴於外部物件。

## 3. 將變數或函數宣告移到元件外部

另一種可能的解決方案，雖然很少使用，但還是值得了解的，那就是將函數或變數宣告移到元件之外。

App.js :

```jsx
import React, { useEffect, useState } from "react";

// 👇️ 將函數／變數宣告移到元件外部
const obj = { country: "Germany", city: "Hamburg" };

export default function App() {
  const [address, setAddress] = useState({
    country: "",
    city: "",
  });

  useEffect(() => {
    setAddress(obj);
    console.log("useEffect called");
  }, []);

  return (
    <div>
      <h1>Country: {address.country}</h1>
      <h1>City: {address.city}</h1>
    </div>
  );
}
```

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/105651918/5f47b71c-4f7c-4e48-8fe1-964b365f4c9b)

(move variable or function outside the component)

這樣做有助於解決問題，因為變數不會在每次重新渲染 **`App`** 元件時被重新創造。

該變數將在所有渲染中指向相同的記憶體位置，因此 **`useEffect`** 不需要在其依賴陣列中跟踪它。

## 4. 使用 `useMemo` hook 來記憶化值

另一個解決方案是使用 [useMemo](https://react.dev/reference/react/useMemo) hook 來獲取一個記憶化的值。

App.js :

```jsx
import React, { useMemo, useEffect, useState } from "react";

export default function App() {
  const [address, setAddress] = useState({ country: "", city: "" });

  // 👇️ get memoized value 獲取被記憶的值
  const obj = useMemo(() => {
    return { country: "Germany", city: "Hamburg" };
  }, []);

  useEffect(() => {
    setAddress(obj);
    console.log("useEffect called");

    // 👇️ safely include in dependencies array 安全地包含在依賴陣列中
  }, [obj]);

  return (
    <div>
      <h1>Country: {address.country}</h1>
      <h1>City: {address.city}</h1>
    </div>
  );
}
```

我們使用了 `useMemo` hook 來獲取一個在渲染之間不變的記憶化值。

`useMemo` hook 接受一個回傳要記憶化的值的函數和一個依賴陣列作為參數。如果其中一個依賴項發生變化，hook 將只重新計算記憶化的值。

## 5. 使用 `useCallback` hook 來記憶化函數

如果你正在處理一個函數，你可以使用 [useCallback](https://react.dev/reference/react/useCallback) hook 來獲取一個在重新渲染之間不變的被記憶的回調函數。

App.js

```jsx
import React, { useMemo, useEffect, useState, useCallback } from "react";

export default function App() {
  const [address, setAddress] = useState({ country: "", city: "" });

  // 👇️ get memoized callback 獲取被記憶的回調函數
  const sum = useCallback((a, b) => {
    return a + b;
  }, []);

  // 👇️ get memoized value 獲取被記憶的值
  const obj = useMemo(() => {
    return { country: "Germany", city: "Santiago" };
  }, []);

  useEffect(() => {
    setAddress(obj);
    console.log("useEffect called");

    console.log(sum(100, 100));

    // 👇️ safely include in dependencies array 安全地包含在依賴陣列中
  }, [obj, sum]);

  return (
    <div>
      <h1>Country: {address.country}</h1>
      <h1>City: {address.city}</h1>
    </div>
  );
}
```

**`useCallback`** hook 接受一個內嵌的回調函數和一個依賴陣列，並回傳一個記憶化版本的回調函數，只有在其中一個依賴項發生變化時才會改變。

## 6. 或者，一樣，停用 Eslint 規則 (回到第一個方法)

如果以上建議對你的情況都不適用，你總是可以通過註釋來消除警告。(老方法)

```jsx
import React, { useEffect, useState } from "react";

export default function App() {
  const [address, setAddress] = useState({ country: "", city: "" });

  const obj = { country: "Chile", city: "Santiago" };

  useEffect(() => {
    setAddress(obj);
    console.log("useEffect called");

    // 👇️ disable the rule for a single line 為單行禁用規則

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Country: {address.country}</h1>
      <h1>City: {address.city}</h1>
    </div>
  );
}
```

# 結論

對於 `react-hooks/exhaustive-deps` 規則所發出的警告，有上述幾種解決方法。

首先可以先遵照 Eslint 的提示處理，將缺少的依賴項添加到 `useEffect` hook 的依賴陣列中。

如果我們發現遵照 Eslint 的提示處理不太方便，我們可以使用 `useMemo` 或 `useCallback` hook 來記憶化值或函數，或者將變數或函數移到 `useEffect` hook 內部或元件外部。

最後，如果以上建議都不適用，我們可以通過註釋來消除警告。

但是根據 React 官方文件，最好的解決方案仍是遵照 Eslint 的提示處理，將缺少的依賴項添加到 `useEffect` hook 的依賴陣列中。

如果我們發現這樣的做法並不符合我們的需求，或者甚至發生無限重新渲染迴圈。官方文件的建議是，也許我們的情境不需要使用 `useEffect` hook。

這一篇官方文件有特別說明這個議題：[You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)，這份官方文件的內容頗多，所以不在此文討論，會另外再寫成一篇文章來探討。

筆者對於 useEffect 的設計原理及運用很感興趣，因此之後也會再撰寫幾篇文章來探討 useEffect，包括但不限於：useEffect 的運作原理、useEffect 的使用時機、useEffect 的最佳實踐等等。

# 參考資料

[Understanding the exhaustive-deps Eslint rule in React](https://bobbyhadz.com/blog/react-hooks-exhaustive-deps)
