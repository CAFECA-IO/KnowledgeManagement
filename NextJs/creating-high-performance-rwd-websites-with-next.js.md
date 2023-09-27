## 判斷效能良好的指標

### 1. 頁面加載時間:

- **測試工具**: 使用Google的[PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)來檢測頁面加載速度。
- **例子**: 如果您的網站在手機上的得分低於50分，您需要進一步優化網站性能。

## 有哪些會造成效能不好的陷阱

### 1. 未優化的圖片和媒體文件:

- **解決方案**: 使用適合的圖片格式和大小。
- **步驟**:
    1. 使用像[tinypng](https://tinypng.com/)這樣的工具來壓縮圖片。
    2. 考慮使用SVG格式對於線條藝術和標誌。
    3. 確保視頻和其他多媒體文件經過壓縮。

### 2. 過多的HTTP請求:

- **解決方案**: 合併檔案和使用Sprite圖像。
- **步驟**:
    1. 將多個CSS或JS檔案合併為一個檔案。
    2. 將多個小圖片合併為一個Sprite圖像。

## 找出避免造成效能問題的解決方式

### 1. 使用圖片和媒體優化:

- **例子**:
    1. 將JPEG圖片轉換為WebP格式。
    2. 使用`next/image`來自動優化圖片。

```jsx
import Image from 'next/image'

export default function MyImage() {
  return (
    <Image
      src="/me.png" // 到你的圖片的路徑
      alt="Picture of the author"
      width={500} // 預設寬度
      height={300} // 預設高度
    />
  )
}

```

### 2. 程式碼分割:

- **例子**:
使用Next.js的`dynamic()`函數實現程式碼。

```jsx
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() => import('../components/hello'))

function Home() {
  return (
    <div>
      <Header />
      <DynamicComponent />
      <Footer />
    </div>
  )
}

export default Home

```

## 找出避免不必要 re-render / re-run 的方式

### 1. 使用`useMemo`和`useCallback` Hooks:

- **例子**: 避免不必要的函數創建和計算。

```jsx
import React, { useState, useMemo, useCallback } from 'react';

function App() {
  const [count, setCount] = useState(0);

  const expensiveComputation = useMemo(() => {
    // 進行一些昂貴的計算...
    return computeExpensively(count);
  }, [count]);

  const handleClick = useCallback(() => {
    // 處理點擊事件，並保持引用不變...
    setCount(c => c + 1);
  }, []);

  return (
    <div>
      <p>{expensiveComputation}</p>
      <button onClick={handleClick}>Increase Count</button>
    </div>
  );
}

```
