# 如何製作不需要切換輸入法的輸入框

- [需求背景](#需求背景)
- [自訂輸入邏輯](#自訂輸入邏輯)
  - [實作方法](#實作方法)
  - [程式碼實作](#程式碼實作)
- [其他實現方法](#其他實現方法)
  - [input type & pattern](#input-type--pattern)
  - [inputmode 屬性](#inputmode-屬性)
- [參考資料](#參考資料)

## 需求背景

這個需求的背景是基於 iSunFa 試用者的反饋。

在新增傳票的分錄時，依照順序從第一行的摘要到金額，再到第二行的會計科目，需要中文➡️數字➡️中文這樣來回切換輸入法，使用上很不方便。所以希望實作不需要特地切換輸入法，就能直接輸入數字的輸入框(`<input>`)。

<img width="936" alt="需求背景" src="https://github.com/user-attachments/assets/36fc618b-0b45-4b04-9707-ff1d96e55b7f" />

## 自訂輸入邏輯

我們先釐清幾點需求：

1. 即使輸入法為中文，仍可順利輸入數字。
2. 保留刪除鍵(`Backspace`)、方向鍵 (`Arrow Left` & `Arrow Right`)、Tab 鍵等功能的預設行為。

簡單來說，實作的方法就是透過 `input` 的 `onKeyDown` 自訂輸入邏輯：

### 實作方法

我們透過 `input` 的 `onKeyDown` 事件來自訂輸入邏輯，具體步驟如下：

- 擋下所有預設按鍵事件。
- 監聽使用者的按鍵，找出對應的數字值。
- 再直接將數字值寫入 `input value` 。

### 程式碼實作

以下是核心邏輯，當使用者按下數字鍵時，攔截事件並手動更新 `input` 的值：

```jsx
let temp = value; // Info: (20250306 - Julian) 取得目前顯示值
let code = ''; // Info: (20250306 - Julian) 存放按鍵對應的數字

const input = event.currentTarget; // Info: (20250306 - Julian) 取得 input 元件
const cursorPos = input.selectionStart ?? value.length; // Info: (20250306 - Julian) 取得當前游標位置

// Info: (20250306 - Julian) 如果按下的是數字鍵
if (pressKeyCode.indexOf('Digit') > -1) {
  code = pressKeyCode.slice(-1); // Info: (20250306 - Julian) 取得數字鍵的值
  temp = temp.slice(0, cursorPos) + code + temp.slice(cursorPos); // Info: (20250306 - Julian) 插入數字

  // Info: (20250306 - Julian) 更新輸入框的值
  handleChange({ target: { value: temp } } as React.ChangeEvent<HTMLInputElement>);
}
```

我們需要讓 `Tab`、`Backspace`、`Delete`、方向鍵等維持原本功能，因此當偵測到這些按鍵時，不執行自訂邏輯：

```jsx
// Info: (20250313 - Julian) 允許特定按鍵執行預設行為
if (
  pressKeyCode === 'Tab' ||
  pressKeyCode === 'Backspace' ||
  pressKeyCode === 'Delete' ||
  pressKeyCode === 'ArrowLeft' ||
  pressKeyCode === 'ArrowRight'
) {
  return;
}
```

完整的 `onKeyDown` 事件如下：

```jsx
// Info: (20250306 - Julian) 處理在中文輸入法下，填入數字的情況
function convertInput(event: React.KeyboardEvent<HTMLInputElement>) {
  // Info: (20250306 - Julian) 取得按下的鍵盤 code
  const pressKeyCode = event.code; 
  
  // Info: (20250313 - Julian) 允許特定按鍵執行預設行為
  if (
    pressKeyCode === 'Tab' ||
    pressKeyCode === 'Backspace' ||
    pressKeyCode === 'Delete' ||
    pressKeyCode === 'ArrowLeft' ||
    pressKeyCode === 'ArrowRight'
  ) {
    return;
  }

	// Info: (20250306 - Julian) 阻止預設事件
  event.preventDefault(); 

  let temp = value; // Info: (20250306 - Julian) 取得目前顯示值
  let code = ''; // Info: (20250306 - Julian) 存放按鍵對應的數字

  const input = event.currentTarget; // Info: (20250306 - Julian) 取得 input 元件
  const cursorPos = input.selectionStart ?? value.length; // Info: (20250306 - Julian) 取得當前游標位置

  // Info: (20250306 - Julian) 如果按下的是數字鍵
  if (pressKeyCode.indexOf('Digit') > -1) {
    code = pressKeyCode.slice(-1); // Info: (20250306 - Julian) 取得數字鍵的值
    temp = temp.slice(0, cursorPos) + code + temp.slice(cursorPos); // Info: (20250306 - Julian) 插入數字

    // Info: (20250306 - Julian) 更新輸入框的值
    handleChange({ target: { value: temp } } as React.ChangeEvent<HTMLInputElement>);
  }
}
```

不過以上只處理「轉換數字」的情境，需要轉換英文的話可以試試這個：

```jsx
// Info: (20250306 - Julian) 如果按下的是字母鍵
if (pressKeyCode.indexOf("Key") > -1) {
  code = event.key; // Info: (20250306 - Julian) 取得字母鍵的值
  temp = temp.slice(0, cursorPos) + code + temp.slice(cursorPos); // Info: (20250306 - Julian) 插入字母

  // Info: (20250306 - Julian) 變更顯示值
  handleChange({
    target: { value: temp },
  } as React.ChangeEvent<HTMLInputElement>);
}
```

以上程式碼也都是參考[此文章](https://medium.com/@box5151/%E8%BC%B8%E5%85%A5%E6%A1%86%E4%B8%AD%E8%BD%89%E8%8B%B1-c58e213bb1a6)。

## 其他實現方法

如果沒有自動轉換輸入內容的需求，只使用 html input 本身的屬性也可以達成限制內容的目的。以下是簡單的說明：

### input `type` & `pattern`

`type` 屬性除了決定輸入框的種類，搭配 `pattern` 屬性還可實現基本的表單驗證。

可限制輸入英數 `type` 的類型：

| 類型 | 描述 |
| --- | --- |
| email | 限制輸入電子郵件格式，不會直接阻擋中文輸入，但會自動驗證格式。 |
| number | 限制輸入純數字，部分瀏覽器允許使用者透過箭頭鍵或滾輪調整數值。在行動裝置上會顯示數字鍵盤。 |
| password | 用於輸入密碼，會自動隱藏輸入值。 |
| tel | 用於輸入電話號碼，不會直接阻擋中文輸入。在行動裝置上會顯示數字鍵盤，但不會自動驗證格式。 |
| url | 限制輸入網址格式，不會直接阻擋中文，但會驗證格式是否符合 URL 標準。 |

想了解更多 `input type` 屬性 ，請參考 [MDN 文檔](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input)。

#### 範例：

```jsx
{/* Info: (20250313 - Julian) 輸入電子郵件(自動驗證) */}
<input type="email" />

{/* Info: (20250313 - Julian) 輸入電話(09開頭，共10碼) */}
<input type="tel" pattern="09[0-9]{8}" />

{/* Info: (20250313 - Julian) 輸入密碼(至少6碼，包含大小寫字母和數字) */}
<input
	type="password"
	pattern="(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}"
/>
```

#### 使用 `pattern` 進行驗證：

`pattern` 屬性允許透過[正規表達式](https://mermer.com.tw/en/knowledge-management/20230721001)進行格式驗證。當表單送出時，若輸入值不符合 `pattern` 規範，瀏覽器將自動提示錯誤，並觸發 `invalid` 事件。

因此可以使用 CSS 的偽元素調整錯誤提示樣式，讓使用者在送出表單前就能確認輸入內容是否正確。

<img width="711" alt="pattern-1" src="https://github.com/user-attachments/assets/c616ebbd-fffc-48ee-bc13-ff9c07ec215d" />
<img width="718" alt="pattern-2" src="https://github.com/user-attachments/assets/c62044bc-9f6b-4575-aa76-e331c1044ce0" />

### `inputmode` 屬性

這個屬性可以控制虛擬鍵盤的顯示，有效提升使用者體驗。不過這只適用於
`inputmode` 用於控制行動裝置（手機、平板等）上的虛擬鍵盤類型，以提升使用者輸入體驗。然而，這個屬性僅適用於支援的瀏覽器，且在桌面裝置上通常沒有作用。

`inputmode` 與 `type` 屬性**互不衝突**，可以搭配使用。

<img width="1379" alt="inputmode_support" src="https://github.com/user-attachments/assets/ec754ee2-a351-4416-928c-2c0364dbcd50" />

| 屬性 | 描述 |
| --- | --- |
| none | 不顯示鍵盤。 |
| text | 顯示標準的文字鍵盤。 |
| numeric | 顯示純數字鍵盤，不含符號按鍵。可用於輸入 PIN 碼、信用卡號等。 |
| decimal | 和 `numeric` 幾乎一致，但多了小數點(`.`)按鈕。 |
| tel | 顯示電話鍵盤。和 `numeric` 幾乎一致，但多了 `+` 、 `*` 、 `#` 符號按鈕。 |
| search | 顯示標準的文字鍵盤。但是右下角多了 `Go` 按鍵，方便使用者快速提交搜尋。 |
| email | 顯示標準的文字鍵盤。但鍵盤中多了 `@` 和 `.` 按鍵，方便直接輸入電子郵件，省去再次切換輸入法的麻煩。 |
| url | 顯示標準的文字鍵盤。但鍵盤中多了 `.` 、 `/` 和 `.com` 按鍵，方便輸入網址。 |

![inputmode-1](https://github.com/user-attachments/assets/d387aec5-bb0c-40d7-b45c-e7b135613c56)
![inputmode-2](https://github.com/user-attachments/assets/b0aa7b50-b1f6-49ff-a2ad-b4f1b386766c)

## 參考資料

- [輸入框中轉英](https://medium.com/@box5151/%E8%BC%B8%E5%85%A5%E6%A1%86%E4%B8%AD%E8%BD%89%E8%8B%B1-c58e213bb1a6)
- [MDN Web Docs Input](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input)
- [HTML5 input 中的 pattern 屬性](https://yuugou727.github.io/blog/2018/02/20/html5-pattern/)
- [用 inputmode 決定你的鍵盤](https://medium.com/@debbyji/%E7%94%A8-inputmode-%E6%B1%BA%E5%AE%9A%E4%BD%A0%E7%9A%84%E9%8D%B5%E7%9B%A4-f9452e72abdd)
- [你可能不知道的阿公級屬性-inputmode](https://hsuchihting.github.io/work/20221206/2637274221/)
- [MDN Web Docs inputmode](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/inputmode)
