# 用 Tailwind CSS 製作 3D Carousel 動畫

### [Notion 好讀版](https://www.notion.so/Tailwind-CSS-3D-Carousel-18f7ebc11866808593f3fbc481a5ab95?pvs=4)
- [輪播邏輯說明](#輪播邏輯說明)
- [第一步：設置幻燈片元件](#第一步設置幻燈片元件)
- [第二步：設置容器元件](#第二步設置容器元件)
- [第三步：將幻燈片放入容器中](#第三步將幻燈片放入容器中)
- [第四步：切換動畫](#第四步切換動畫)
- [Bonus：2D Carousel 動畫說明](#bonus2d-carousel-動畫說明)

不同於線型的 2D 輪播 (Carousel) 動畫，製作 3D 輪播需要考慮立體感的呈現，也就是幻燈片 (Slide) 間的前後關係，和切換的流暢度。本文將詳細解說製作 3D 輪播動畫的步驟與邏輯，並附上程式碼以供參考。

![圖解輪播](https://github.com/user-attachments/assets/27b9e41c-2842-46f8-9aa3-329d91219ff3)

## 輪播邏輯說明

https://github.com/user-attachments/assets/19a7a2b6-fe99-4fe6-a365-cd11247a1e75

如圖所示，本次範例是五張幻燈片組成的 3D 輪播動畫。

首先，我會給每張幻燈片一個「排序」(order)，指定幻燈片各自的位置，並套用對應的 CSS 樣式。

接著，透過改變排序值來控制幻燈片向左或向右移動。

以下是詳細的步驟說明：

## 第一步：設置幻燈片元件

此步驟的關鍵在於 CSS 樣式的設定。

除了**正中央（聚焦中）的幻燈片**外，其他幻燈片都應該有**位置偏移**、**縮放**等變形效果。此外，由於使用到 `translate` 進行位移，因此必須設定 `absolute` 來確保元素的定位。

這裡提供範例使用的樣式，讀者可根據需求自行調整：

```jsx
  // 位於正中央，沒有位移和縮放
  const firstSlideStyle = "scale-100 opacity-100 translate-x-0 z-[100]";

  // 位於右側，縮小 25%，透明度 75%，向右位移 400px
  const secondSlideStyle = "scale-75 opacity-75 translate-x-[400px] z-[50]";

  // 位於右後方，縮小 50%，透明度 50%，向右位移 200px，並加上模糊效果
  const thirdSlideStyle = "scale-50 opacity-50 translate-x-[200px] blur-sm";

  // 位於左後方，縮小 50%，透明度 50%，向左位移 200px，並加上模糊效果
  const fourthSlideStyle = "scale-50 opacity-50 translate-x-[-200px] blur-sm";

  // 位於左側，縮小 25%，透明度 75%，向左位移 400px
  const fifthSlideStyle = "scale-75 opacity-75 translate-x-[-400px] z-[50]";
```

此外，還需要設定 `order`，根據排序值決定幻燈片的顯示樣式：

```jsx
const Slide: React.FC<{ slideData: ISlideData; order: number }> = ({
  slideData,
  order,
}) => {
	// 根據排序的位置決定樣式
  const slideStyle =
    order === 1
      ? firstSlideStyle
      : order === 2
      ? secondSlideStyle
      : order === 3
      ? thirdSlideStyle
      : order === 4
      ? fourthSlideStyle
      : fifthSlideStyle;
}
```

完整的幻燈片元件程式碼如下：

```jsx
const Slide: React.FC<{ slideData: ISlideData; order: number }> = ({
  slideData,
  order,
}) => {
  const { title } = slideData;

  // 幻燈片樣式
  const firstSlideStyle = "scale-100 opacity-100 translate-x-0 z-[100]";
  const secondSlideStyle = "scale-75 opacity-75 translate-x-[400px] z-[50]";
  const thirdSlideStyle = "scale-50 opacity-50 translate-x-[200px] blur-sm";
  const fourthSlideStyle = "scale-50 opacity-50 translate-x-[-200px] blur-sm";
  const fifthSlideStyle = "scale-75 opacity-75 translate-x-[-400px] z-[50]";

  // 根據排序的位置決定樣式
  const slideStyle =
    order === 1
      ? firstSlideStyle
      : order === 2
      ? secondSlideStyle
      : order === 3
      ? thirdSlideStyle
      : order === 4
      ? fourthSlideStyle
      : fifthSlideStyle;

  return (
    <div
      className={`${slideStyle} absolute text-center bg-sky-400 border-blue-600 border-2 px-[80px] py-[40px] transition-all duration-1000 ease-in-out`}
    >
      <h2 className="text-white font-bold text-2xl">{title}</h2>
      <p className="text-gray-600">(Order {order})</p>
    </div>
  );
};
```

## 第二步：設置容器元件

容器元件有以下幾種要求：

1. 安排讓使用者能左右切換幻燈片的按鈕
2. 由於幻燈片使用了 `absolute`，因此容器元件必須加上 `relative`，以確保幻燈片能正確定位
3. 加上 `h-*` 指定容器長度，以容納幻燈片的尺寸。

```jsx
      <div className="relative w-[1100px] flex h-[300px] items-center justify-center">
        {/* Left Arrow */}
        <button
          type="button"
          className="z-[150] absolute left-0 p-[5px] rounded-lg bg-orange-400 hover:bg-orange-500"
        >
          <FaCaretLeft />
        </button>

        {/* Carousel */}
        {displayedCarosel}

        {/* Right Arrow */}
        <button
          type="button"
          className="z-[150] absolute right-0 p-[5px] rounded-lg bg-orange-400 hover:bg-orange-500"
        >
          <FaCaretRight />
        </button>
      </div>
```

## 第三步：將幻燈片放入容器中
首先需要使用 `useState` 來追蹤幻燈片的當前排序。用 `Array.from` 生成與幻燈片數量一致的陣列，為了方便閱讀和說明，這裡將每項元素 + 1 。

```jsx
  // 當前幻燈片順序，根據 slideData 的資料數設置 array
  const [currentOrder, setCurrentOrder] = useState<number[]>(
    Array.from({ length: slideData.length }, (_, i) => i + 1) // [1, 2, 3, 4, 5]
  );
```

再來用 `map` 動態渲染幻燈片。其中 `currentOrder[index]` 負責決定幻燈片的排列順序，從而影響其動畫效果。我會在下一步說明切換幻燈片的原理。

```jsx
  // 幻燈片內容
  const displayedCarousel = slideData.map((slide, index) => (
    <Slide key={slide.id} slideData={slide} order={currentOrder[index]} />
  ));
```

## 第四步：切換動畫
最後也是最重要的一步，賦予左右按鈕點擊事件。

要讓幻燈片**向左轉**，就要讓 `currentOrder` 的元素**逐一左移**，並把最後一個元素移到第一個，反之亦然。我們將活用以下四種陣列處理方法來實現這點：

1. `unshift()` ：在陣列的開頭插入新元素。
2. `push()` ：在陣列的末尾插入新元素。
3. `shift()` ：刪除並回傳陣列的第一個元素。
4. `pop()` ：刪除並回傳陣列的最後一個元素。

以下是左右按鈕的點擊事件，透過調整陣列順序來達成幻燈片的動畫效果：

```jsx
  // 向左轉：將元素逐一左移，最後一個元素移到第一個
  const handleLeftArrow = () => {
    setCurrentOrder((prev) => {
      const newOrder = [...prev];
      newOrder.unshift(newOrder.pop()!); // 移除最後一個元素，並將其插入到陣列的開頭
      return newOrder;
    });
  };

  // 向右轉：將元素逐一右移，第一個元素移到最後一個
  const handleRightArrow = () => {
    setCurrentOrder((prev) => {
      const newOrder = [...prev];
      newOrder.push(newOrder.shift()!); // 移除第一個元素，並將其插入到陣列的末尾
      return newOrder;
    });
  };
```

請參考以下展示影片，以觀察 Order 的變化。

https://github.com/user-attachments/assets/f34393f4-29ab-416b-970a-259d9c786470

完整程式碼如下：

```jsx
const CarouselPage: React.FC = () => {
  // 當前幻燈片順序，根據 slideData 的資料數設置 array
  const [currentOrder, setCurrentOrder] = useState<number[]>(
    Array.from({ length: slideData.length }, (_, i) => i + 1) // [1, 2, 3, 4, 5]
  );

  // 向左轉：將元素逐一左移，最後一個元素移到第一個
  const handleLeftArrow = () => {
    setCurrentOrder((prev) => {
      const newOrder = [...prev];
      newOrder.unshift(newOrder.pop()!); // 移除最後一個元素，並將其插入到陣列的開頭
      return newOrder;
    });
  };

  // 向右轉：將元素逐一右移，第一個元素移到最後一個
  const handleRightArrow = () => {
    setCurrentOrder((prev) => {
      const newOrder = [...prev];
      newOrder.push(newOrder.shift()!); // 移除第一個元素，並將其插入到陣列的末尾
      return newOrder;
    });
  };

  // 幻燈片內容
  const displayedCarousel = slideData.map((slide, index) => (
    <Slide key={slide.id} slideData={slide} order={currentOrder[index]} />
  ));

  return (
    <div className="w-full h-full flex-col justify-center p-[50px] flex items-center">
      <h1 className="font-bold text-4xl">My Carousel</h1>

      <div className="relative w-[1100px] flex h-[300px] items-center justify-center">
        {/* Left Arrow */}
        <button
          type="button"
          className="z-[150] absolute left-0 p-[5px] rounded-lg bg-orange-400 hover:bg-orange-500"
          onClick={handleLeftArrow}
        >
          <FaCaretLeft />
        </button>

        {/* Carousel */}
        {displayedCarousel}

        {/* Right Arrow */}
        <button
          type="button"
          className="z-[150] absolute right-0 p-[5px] rounded-lg bg-orange-400 hover:bg-orange-500"
          onClick={handleRightArrow}
        >
          <FaCaretRight />
        </button>
      </div>
    </div>
  );
};
```

## Bonus：2D Carousel 動畫說明
![圖解 2D 幻燈片](https://github.com/user-attachments/assets/92912a51-9e85-4211-9937-e8e6ef6bcc11)

2D 幻燈片的結構比較簡單，簡單來說就是以下三個步驟：

1. 把幻燈片水平排列，放入一個長條狀的容器（這裡稱之為 `Rail`）。
2. 將這個 `Rail` 放進另一個容器 `View` 中，設定 `w-*` 和 `overflow-hidden` ，以截去非聚焦中的幻燈片。
3. 設定 `currentIndex` ，依這個索引決定`Rail` 的位移量，顯示對應的幻燈片。

這邊直接附上程式碼，請參考註解：

```jsx
const CarouselPage: React.FC = () => {
  // 當前幻燈片索引
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // 幻燈片內容
  const displayedCarousel = slideData.map((slide) => (
    <div
      key={slide.id} 
      className="bg-sky-400 text-white shrink-0 font-bold text-4xl border-blue-600 border-2 w-[500px] flex items-center justify-center h-[300px]">
      {slide.title}
    </div>
  ));

  // 向左移
  const handleLeft = () => {
    setCurrentIndex((prev) => {
      // 如果當前是第一張，則移至最後一張
      if (prev === 0) return slideData.length - 1;
      return prev - 1;
    });
  };

  // 向右移
  const handleRight = () => {
    setCurrentIndex((prev) => {
      // 如果當前是最後一張，則移至第一張
      if (prev === slideData.length - 1) return 0;
      return prev + 1;
    });
  };

  // 計算 Rail 的位移：- (當前索引 * (幻燈片寬度 + 間距))
  const railTransform = `translateX(-${currentIndex * (500 + 40)}px)`;

  return (
    <div className="w-full h-full flex-col justify-center p-[50px] flex items-center">
      <h1 className="font-bold text-4xl">My Carousel</h1>

      <div className="flex items-center mt-[100px]">
        {/* Left Arrow */}
        <button
          type="button"
          className="z-[150] absolute left-96 p-[5px] rounded-lg bg-orange-400 hover:bg-orange-500"
          onClick={handleLeft}
        >
          <FaCaretLeft />
        </button>

        <div className="overflow-hidden w-[500px] border-2 border-black">
          {/* Rail */}
          <div
            className="flex items-center gap-[40px] transition-all duration-1000 ease-in-out"
            style={{ transform: railTransform }}
          >
            {displayedCarousel}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          type="button"
          className="z-[150] absolute right-96 p-[5px] rounded-lg bg-orange-400 hover:bg-orange-500"
          onClick={handleRight}
        >
          <FaCaretRight />
        </button>
      </div>
    </div>
  );
};
```

https://github.com/user-attachments/assets/9132ebb1-300c-418d-9125-c55c86275b18
