# 用 react-hotkeys-hook 製作快捷鍵
## [Notion 好讀版](https://www.notion.so/react-hotkeys-hook-14d7ebc118668075a0bbfd0234aacad2?pvs=4)

- [安裝與基本用法](#安裝與基本用法)
- [詳細功能說明](#詳細功能說明)
- [應用場景](#應用場景)
- [踩雷與排錯](#踩雷與排錯)

本文將說明用 `react-hotkeys-hook` 套件實作功能快捷鍵（熱鍵）的具體步驟，以及本人在開發途中遇到的踩雷紀錄。

## 安裝與基本用法

### 安裝套件

```bash
npm install react-hotkeys-hook
```

### 基本用法

#### useHotkeys

這個 hook 的用法十分簡單，只需填入要監聽的**按鍵名稱**，和按下按鍵後**要執行的回調函數**即可。

以下是一個範例：

```jsx
import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

export const HotKeyComponent: React.FC = () => {
  const [count, setCount] = useState(0);

  // Info: (20241129 - Julian) press 'a' to increase count
  useHotkeys('a', () => setCount((prev) => prev + 1));

  return <div>You pressed `a` {count} times!</div>;
};
```

點擊鍵盤上的 `a` 鍵就能看到次數增加了。

#### HotkeysProvider

用於快捷鍵的範圍配置，`HotkeysProvider` 可以將不同區域的快捷鍵分組，避免互相干擾；也可以擴大或縮小快捷鍵的作用範圍。 通常放在最外層，以包裹住需要使用快捷鍵的元件。

```jsx
// _app.tsx

import HotKeyComponent from 'component/hotkey_component'
import { HotkeysProvider } from 'react-hotkeys-hook';

const App = () => {
  return (
    <HotkeysProvider initiallyActiveScopes={['calculation']}>
      <HotKeyComponent />
    </HotkeysProvider>
  )
}
```

```jsx
// hotkey_component.tsx

export const HotKeyComponent: React.FC = () => {
  const [count, setCount] = useState(0)
  // Info: (20241129 - Julian) press 'a' to increase count, and limit the scope to 'calculation'
  useHotkeys('a', () => setCount(prev => prev + 1), { scopes: ['calculation'] })

  return <div>You pressed `a` {count} times!</div>;
  )
}
```

## 詳細功能說明

```jsx
useHotkeys(keys: string | string[], callback: (event: KeyboardEvent, handler: HotkeysEvent) => void, options: Options = {}, deps: DependencyList = [])
```

#### useHotkeys

| 參數 | 型別 | 是否必填 | 說明 |
| --- | --- | --- | --- |
| keys | string \| string[] | 必填 | 設定要監聽的按鍵名稱，可使用單一、多個按鍵或組合鍵。<br />如要填入多個按鍵，請用逗號 `,` 分隔，或填入陣列 (string[])。<br />如要填入組合鍵，請用 `+` 。<br />＊按鍵參數沒有區分大小寫。 |
| callback | (event: KeyboardEvent, handler: HotkeysEvent) => void | 必填 | 按下快捷鍵時呼叫的回調函數。它會接收到瀏覽器本機`KeyboardEvent`和庫`HotkeysEvent`兩個參數 |
| options | Options | 選填 | 修改 hook 的行為。下面表格將列出所有預設選項。 |
| dependencies | DependencyList | 選填 | 類似 React 的 `useCallback`。如果回調函數有依賴外部變數，請將這些變數列在此處，以確保回調在變數更新時也能獲取最新的值。 |

#### options

所有選項皆為可選，請根據需求覆寫預設值以更改 hook 的行為。

| 選項 | 型別 | 預設值 | 說明 |
| --- | --- | --- | --- |
| enabled | boolean \| (keyboardEvent: KeyboardEvent, hotkeysEvent: HotkeysEvent) => boolean | true | 這個選項用來決定快捷鍵是否有效（active），可傳入 boolean 或函數。 |
| enableOnFormTags | boolean \| FormTags[] | false | 預設情況下，當焦點位於表單元素（如 `<input>`、`<textarea>`、`<select>` 等）時會停用快捷鍵，此選項是為了避免用戶在輸入內容時觸發。開發者可以根據需求決定是否打開。 |
| enableOnContentEditable | boolean | false | 預設情況下，`react-hotkeys-hook` 會在 `contentEditable` （可編輯）元素內停用快捷鍵，以免誤觸。開發者可以根據需求決定是否打開。 |
| combinationKey | string | + | 表示組合鍵的字符。 |
| splitKey | string | , | 表示分隔不同按鍵的字符。 |
| keyup | boolean | false | 決定回調函數是否通過`keyup`事件來觸發。 |
| keydown | boolean | true | 預設情況下，回調函數是在`keydown`事件被觸發。這裡可以選擇關閉，也可以讓回調在兩者皆觸發。 |
| preventDefault | boolean \| (keyboardEvent: KeyboardEvent, hotkeysEvent: HotkeysEvent) => boolean | false | 這個選項是用來阻止瀏覽器的預設行為，例如 `Ctrl+S` 或 `Meta+S` 在瀏覽器上會觸發網頁保存。但是**某些按鍵無法阻止**， 例如`Ctrl+W` 或 `Meta+W` 將會關閉標籤頁。 |
| description | string | undefined | 這個選項是快捷鍵的描述，開發者可以透過這個選項讓用戶了解每個快捷鍵的功能。 |
| scopes | string \| string[] | * | 這個選項和 `<HotkeysProvider>` 一起用來將快捷鍵分組。這樣開發者就可以根據不同的場景或區域，設置不同的快捷鍵，避免衝突。<br />預設情況下，所有快捷鍵都屬於通用範圍（ `*` ），可以在整個應用程式中觸發。 |

## 應用場景

#### 表單輸入框切換

此範例展示了一個支援快捷鍵的表單（Form），使用者可以透過 `Tab` 鍵在輸入框間切換焦點。當焦點位於最後一個輸入框時，按下 `Tab` 會回到第一個輸入框。

另外，範例中也設計了兩個快捷鍵來操作表單：

1. **清空表單內容**：按下 `Ctrl + Shift + C` ，可清除所有輸入框的內容。
2. **送出表單**：按下 `Ctrl + Enter` ，可提交表單。

```jsx
export const FormWithHotKey: React.FC = () => {
  const inputs = ['Input 1', 'Input 2', 'Input 3', 'Input 4', 'Input 5'];
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Info: (20241202 - Julian) 清空輸入框
  const clearHandler = () => {
    inputRefs.current.forEach((input) => {
      if (input) input.value = '';
    });
  };

  // Info: (20241202 - Julian) 提交表單
  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const values = inputRefs.current.map((input) => input?.value);
    alert(values);
  };

  // Info: (20241202 - Julian) Tab 鍵切換行為
  useHotkeys('tab', (event) => {
    event.preventDefault();
    const currentIndex = inputRefs.current.findIndex((input) => input === document.activeElement);
    // Info: (20241202 - Julian) 循環切換
    const nextIndex = (currentIndex + 1) % inputRefs.current.length;
    inputRefs.current[nextIndex]?.focus();
  });

  // Info: (20241202 - Julian) ctrl + enter 提交表單
  useHotkeys('ctrl+enter', (event) => {
    event.preventDefault();
    const values = inputRefs.current.map((input) => input?.value);
    alert(values);
  });

  // Info: (20241202 - Julian) ctrl + shift + c 清空輸入框
  useHotkeys('ctrl+shift+c', clearHandler);

  return (
    <form onSubmit={submitHandler}>
      <div className="grid grid-cols-3 gap-10px">
        {inputs.map((input, index) => (
          <input
            key={input}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            placeholder={input}
            className="rounded-sm border p-2"
          />
        ))}
      </div>

      <div className="flex gap-10px">
        <button type="button" className="rounded-sm border p-2" onClick={clearHandler}>
          Clear
        </button>
        <button type="submit" className="rounded-sm bg-amber-400 p-2">
          Submit
        </button>
      </div>
    </form>
  );
};
```

#### 下拉選單導航

此範例展示了一個支援快捷鍵的下拉選單（Dropmenu），按下方向鍵（⬆️或⬇️）即可開啟選單，並自動將焦點設定在第一個選項 (`Option 1`) 上。使用者可以透過上下鍵在選項間切換聚焦，並按下 Enter 鍵進行選擇。
💡 建議在實作時根據需求使用 `HotkeysProvider` 將快捷鍵進行分組，避免選單導航與其他功能發生衝突。

```jsx
export const DropmenuWithHotKey: React.FC = () => {
  const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>('Please select an option');
  const [activeOptionIndex, setActiveOptionIndex] = useState<number>(0);

  useEffect(() => {
    // Info: (20241202 - Julian) 選項聚焦
    if (isMenuOpen && optionRefs.current[activeOptionIndex]) {
      optionRefs.current[activeOptionIndex]?.focus();
      optionRefs.current[activeOptionIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeOptionIndex, isMenuOpen]);

  // Info: (20241202 - Julian) 選單開關
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // Info: (20241202 - Julian) 處理方向鍵的切換邏輯
  const handleNavigation = (event: KeyboardEvent) => {
    event.preventDefault();

    if (isMenuOpen) {
      if (event.key === 'ArrowDown') {
        // Info: (20241202 - Julian) 選擇下一個選項
        setActiveOptionIndex((prev) => {
          // Info: (20241202 - Julian) 避免超出選項範圍
          const nextIndex = Math.min(prev + 1, options.length - 1);
          return nextIndex;
        });
      } else if (event.key === 'ArrowUp') {
        // Info: (20241202 - Julian) 選擇上一個選項
        setActiveOptionIndex((prev) => {
          // Info: (20241202 - Julian) 避免超出選項範圍
          const nextIndex = Math.max(prev - 1, 0);
          return nextIndex;
        });
      }

      // Info: (20241202 - Julian) 聚焦選項
      optionRefs.current[activeOptionIndex]?.focus();
    } else {
      // Info: (20241202 - Julian) 開啟選單，並聚焦第一個選項
      setIsMenuOpen(true);
      setActiveOptionIndex(0);
      optionRefs.current[0]?.focus();
    }
  };

  useHotkeys(['ArrowUp', 'ArrowDown'], handleNavigation);

  const dropdownMenu = isMenuOpen ? (
    <div className="absolute top-50px z-30 w-300px rounded-sm border bg-white p-2 shadow-dropmenu">
      <div className="flex max-h-150px flex-col overflow-y-auto">
        {options.map((value, index) => {
          // Info: (20241202 - Julian) 選項點擊事件
          const optionClickHandler = () => {
            setSelectedOption(value);
            setIsMenuOpen(false);
          };

          // Info: (20241202 - Julian) 選項 ref
          const optionRef = (el: HTMLButtonElement) => {
            optionRefs.current[index] = el;
          };

          return (
            <button key={value} ref={optionRef} type="button" onClick={optionClickHandler}>
              {value}
            </button>
          );
        })}
      </div>
    </div>
  ) : null;

  return (
    <div className="relative">
      <button type="button" onClick={toggleMenu} className="w-300px rounded-sm border p-2">
        <p>{selectedOption}</p>
      </button>
      {/* Info: (20241202 - Julian) Accounting Menu */}
      {dropdownMenu}
    </div>
  );
};
```

## 踩雷與排錯

#### 按鍵未觸發

情況：明明按下了按鈕，卻沒有觸發快捷鍵功能。

解方：這個問題可能是瀏覽器的默認行為干擾所引起。有時候瀏覽器會處理一些特殊鍵（如 `tab`、`enter` 等）並進行默認操作，如提交表單或移動焦點，。你可以透過 `event.preventDefault()` 來阻止瀏覽器的默認行為，確保快捷鍵被正確觸發。

```jsx
useHotkeys('tab', (event) => {
// Info: (20241202 - Julian) 阻止 tab 鍵的默認行為
  event.preventDefault(); 
  ...
});
```

#### 按鍵事件衝突

情況：按下快捷鍵，卻觸發了其他元件的功能。

解方：當多個元件需要使用快捷鍵時，可能會導致快捷鍵衝突，進而影響用戶體驗，因此需要管理快捷鍵的作用範圍。你可以使用 `HotkeysProvider` 和 `scopes` 屬性來分隔不同元件的快捷鍵範圍。

```jsx
  
// Info: (20241202 - Julian) 表單的 Tab 鍵
useHotkeys('tab', handleNavigation, { scopes: 'Form' });

// Info: (20241202 - Julian) 下拉選單的方向鍵
useHotkeys(['ArrowUp', 'ArrowDown'], handleNavigation, { scopes: 'Dropmenu' });

  return (
    <>
      {/* Info: (20241202 - Julian) 表單 */}
      <HotkeysProvider initiallyActiveScopes={['Form']}>
        <FormWithHotKey />
      </HotkeysProvider>
      {/* Info: (20241202 - Julian) 下拉選單 */}
      <HotkeysProvider initiallyActiveScopes={['Dropmenu']}>
        <DropmenuWithHotKey />
      </HotkeysProvider>
    </>
  );

```

或是利用 `enableOnTags` 和 `enableOnFormTags` 來指定哪些元素可以觸發快捷鍵。

```jsx
useHotkeys('ctrl+enter', submitHandler, {
// Info: (20241202 - Julian) 僅在輸入框內觸發快捷鍵
  enableOnTags: ['INPUT', 'TEXTAREA'], 
});
```

#### 焦點管理失敗

情況：焦點沒有正確移動，常常聚焦到不該聚焦的地方。

解方：使用 [`react-focus-lock`](https://www.npmjs.com/package/react-focus-lock) 這個工具，它可以確保快捷鍵只在限制的範圍內有效，防止使用者跳出交互範圍，如側邊欄、瀏覽器的網址列等。

但如果功能有關聯到互動視窗（Modal）則不建議使用 react-focus-lock，因為互動視窗會無法使用。

```jsx
import FocusLock from 'react-focus-lock';

export const TestPage: React.FC = () => {
  return (
    /* Info: (20241202 - Julian) 限制焦點在頁面內 */
    <FocusLock>
     <form>
        <input type="text" placeholder="Input 1" />
        <input type="text" placeholder="Input 2" />
        <button type="submit">Submit</button>
      </form>
    </FocusLock>
  );
};
```

### 資料參考

- [npm of react-hotkeys-hook](https://www.npmjs.com/package/react-hotkeys-hook)
- [react-hotkeys-hook (Github)](https://github.com/JohannesKlauss/react-hotkeys-hook)
- [React Hotkeys Hook](https://react-hotkeys-hook.vercel.app/)
