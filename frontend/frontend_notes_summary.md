# **前端功能備忘錄**
目標是整理一些好用但不熟悉的前端功能，主要是flexbox 以及 grid相關的內容，作為備忘錄，方便工作時查閱。


## **HTML 常見功能**
### **HTML 基本結構**
- **HTML 的全名**: HyperText Markup Language。
- **換行元素**: `<br>`，唯一只有開標籤的元素。
- **自閉合標籤**: 可包含或省略結尾斜線 `/`，均能正確呈現。
- **`<!DOCTYPE html>`**:
  - 告知瀏覽器文件類型與 HTML 版本。
  - 不新增任何 HTML 結構或內容。
- **基本結構**: 在 `<!DOCTYPE html>` 之後需加入 `<html>` 標籤以建立結構。

### **表格相關屬性**
#### **1. `colspan`**
- 功能：讓單元格橫跨多列。
- **語法**：
  ```html
  <td colspan="列數">內容</td>
  ```
- **範例效果**：
  ```
  +---------------------+
  |     表格標題         |
  +-------+-------+----+
  | 列 1  | 列 2  | 列 3 |
  +-------+-------+----+
  | 數據1 | 數據2 | 數據3 |
  +-------+-------+----+
  ```

#### **2. `rowspan`**
- 功能：讓單元格橫跨多行。
- **語法**：
  ```html
  <td rowspan="行數">內容</td>
  ```
- **範例效果**：
  ```
  +-----------------+-------+-------+
  | 合併的單元格      | 列 1  | 列 2  |
  +                 +-------+-------+
  |                 | 數據 1| 數據 2 |
  +-----------------+-------+-------+
  ```

#### **3. 同時使用 `colspan` 與 `rowspan`**
- **範例效果**：
  ```
  +--------+--------+--------+
  |   合併行與列      | 列 1   |
  +                 +--------+
  |                 | 數據 1  |
  +--------+--------+--------+
  ```

### **音訊標籤 `<audio>`**
- **簡寫形式**：
  ```html
  <audio controls src="音訊檔案路徑" type="audio/檔案類型" />
  ```
- **標準形式**：
  ```html
  <audio controls>
    <source src="音訊檔案路徑" type="audio/檔案類型">
  </audio>
  ```

---

## **CSS 排版與樣式**
### **HTML 與 CSS 的分離**
- 使用 `<link>` 元素連結 CSS 文件：
  - **`href`**：指定 CSS 文件路徑。
  - **`rel`**：值需設為 `stylesheet`。

### **垂直邊距與內距**
#### **垂直邊距塌縮**
- **現象**：當兩個相鄰元素的上下邊距重疊時，取較大的邊距值作為實際間距。
- **範例**：
  ```html
  <style>
    .box1 {
      margin-bottom: 20px;
      background-color: lightblue;
      height: 50px;
    }
    .box2 {
      margin-top: 30px;
      background-color: lightcoral;
      height: 50px;
    }
  </style>

  <div class="box1"></div>
  <div class="box2"></div>
  ```
  **結果**：兩個框之間的間距為 **30px**（較大的邊距值）。

- **常見場景**：
  1. **相鄰元素**：上下邊距重疊。
  2. **父子元素**：子元素的邊距與父元素的邊距方向一致時。

- **解決方法**：
  1. 使用 `padding` 替代 `margin`：
     ```css
     .parent {
       padding-top: 20px;
     }
     ```
  2. 添加 `border`：
     ```css
     .parent {
       border: 1px solid transparent;
     }
     ```
  3. 設定 `overflow`：
     ```css
     .parent {
       overflow: hidden;
     }
     ```

#### **垂直內距不塌縮**
- **內距（`padding`）始終如實呈現**，不受邊距塌縮影響。
- **範例**：
  ```html
  <div style="padding: 20px; background-color: lightgreen;">
    <p>內容</p>
  </div>
  ```

---

## **Flexbox 彈性排版**
### **核心概念**
- **`display: flex`**：區塊級彈性容器。
- **`display: inline-flex`**：行內級彈性容器，允許多容器並排。

### **主軸與交叉軸對齊**
- **`justify-content`**：設定主軸上的項目間距。
- **`align-items`**：設定交叉軸上的項目對齊。

### **彈性項目屬性**
- **`flex-grow`**：項目放大比例。
- **`flex-shrink`**：項目縮小比例。
- **`flex-basis`**：項目初始尺寸。
- **`flex`**：簡化設置，等同於 `flex-grow` + `flex-shrink` + `flex-basis`。

### **項目放大與縮小屬性**
1. **`flex-grow`**：控制主軸方向上的放大比例。
   - 當容器有多餘空間時，根據值分配多餘空間。
   - 預設值：`0`，項目不會放大。
   - 數值越大，佔用空間越多。
   - **示例**：
     ```css
     .item {
       flex-grow: 2;
     }
     ```

2. **`flex-shrink`**：控制主軸方向上的縮小比例。
   - 當空間不足時，根據值分配縮小比例。
   - 預設值：`1`，項目按比例縮小。
   - **示例**：
     ```css
     .item {
       flex-shrink: 1;
     }
     ```

3. **優先順序**：
   - **`flex-shrink`**：空間不足時先縮小。
   - **`flex-grow`**：空間充足時再放大。

### **其他彈性屬性**
- **`flex-wrap`**：當空間不足時是否換行。
- **`align-content`**：多行項目的交叉軸間距。
- **`flex-direction`**：定義主軸與交叉軸方向。
- **`flex-flow`**：整合 `flex-wrap` 和 `flex-direction`。

#### **簡寫屬性**
- **`flex-flow`**：
  - 簡寫形式，設定 `flex-direction` 和 `flex-wrap`。
  - **範例**：
    ```css
    .container {
      flex-flow: row wrap;
    }
    ```

#### **主軸與交叉軸對齊**
1. **單行對齊：`align-items`**
   - 用於調整單行內項目在交叉軸上的對齊方式。
   - 常用值：`flex-start`、`flex-end`、`center`、`stretch`、`baseline`。

2. **多行對齊：`align-content`**
   - 用於調整多行項目在交叉軸上的整體分佈。
   - 常用值：`flex-start`、`flex-end`、`center`、`space-between`、`space-around`、`stretch`。


---

## **CSS Grid 詳細筆記**

### **1. Grid 基本概念**
CSS Grid 是一種**雙維度佈局系統**，可以同時管理行與列的佈局結構。它提供靈活的功能，適用於設計儀表板、圖片牆等複雜的網頁佈局。

#### **Grid 的三個主要組成**
1. **Columns（列）**：從左到右排列的垂直區域。
2. **Gutters（間隔）**：列與列、行與行之間的空白區域。
3. **Margins（外邊距）**：網格的左右空白區域，隨裝置或窗口大小而變化。

#### **啟用 Grid**
- 使用 **`display: grid`** 或 **`display: inline-grid`** 將元素轉為 Grid 容器：
  - **`display: grid`**：區塊級容器，占據整行。
  - **`display: inline-grid`**：行內級容器，可與其他行內元素並排。

---

### **2. Grid 容器屬性**

#### **網格結構**
1. **`grid-template-columns`** 和 **`grid-template-rows`**：
   - 定義列數、行數及其尺寸。
   - **範例**：
     ```css
     .container {
       grid-template-columns: 1fr 2fr 1fr; /* 三列，比例為 1:2:1 */
       grid-template-rows: auto 200px;     /* 兩行，自動高度與固定高度 */
     }
     ```

2. **`grid-template`**：
   - 簡寫形式，同時定義行與列：
     ```css
     .container {
       grid-template: 100px 200px / 1fr 2fr;
     }
     ```

3. **自動填充與適配**：
   - **`repeat()`**：簡化重複模式。
     ```css
     grid-template-columns: repeat(3, 1fr); /* 三列，等寬 */
     ```
   - **`auto-fit`** 和 **`auto-fill`**：
     ```css
     grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
     /* 列寬最小 100px，剩餘空間自適應分配 */
     ```

#### **間距控制**
- **`row-gap`** 和 **`column-gap`**：
  - 定義行與列之間的間距。
- **`gap`**：
  - 簡寫形式，同時設定行間距與列間距：
    ```css
    .container {
      gap: 20px 10px; /* 行間距 20px，列間距 10px */
    }
    ```

---

### **3. 元素對齊**

#### **單元格內對齊**
1. **`justify-items`**：
   - 控制單元格內的水平對齊方式。
   - **值**：
     - `start`：靠左對齊。
     - `end`：靠右對齊。
     - `center`：居中對齊。
     - `stretch`（預設）：撐滿單元格寬度。

2. **`align-items`**：
   - 控制單元格內的垂直對齊方式。
   - **值**：
     - `start`：靠上對齊。
     - `end`：靠下對齊。
     - `center`：垂直居中。
     - `stretch`（預設）：撐滿單元格高度。

#### **整體網格對齊**
1. **`justify-content`**：
   - 控制整個網格在容器內的水平對齊方式。
   - **值**：
     - `start`、`end`、`center`、`space-around`、`space-between`、`space-evenly`。

2. **`align-content`**：
   - 控制整個網格在容器內的垂直對齊方式。
   - **值**：
     與 `justify-content` 相同。

3. **`place-items`** 和 **`place-content`**：
   - 簡寫形式，用於同時設置 `justify-items` 和 `align-items` 或 `justify-content` 和 `align-content`。

---

### **4. 元素範圍與重疊**

#### **控制元素範圍**
1. **`grid-row` 和 `grid-column`**：
   - 定義元素在網格中的起始與結束範圍。
   - **範例**：
     ```css
     .item {
       grid-row: 1 / 3; /* 跨越第 1 到第 3 行 */
       grid-column: 2 / 4; /* 跨越第 2 到第 4 列 */
     }
     ```

2. **`grid-area`**：
   - 簡寫形式，定義 `grid-row` 和 `grid-column`。
   - **範例**：
     ```css
     .item {
       grid-area: 1 / 2 / 3 / 4;
     }
     ```

#### **實現元素重疊**
- 通過設置多個元素的 `grid-row` 和 `grid-column` 範圍相同。
- 配合 `z-index` 控制堆疊順序。

**範例**：
```css
.item1 {
  grid-row: 1 / 3;
  grid-column: 1 / 2;
  background-color: lightblue;
}

.item2 {
  grid-row: 1 / 3;
  grid-column: 1 / 2;
  background-color: lightcoral;
  z-index: 1; /* 顯示在上層 */
}
```

---

### **5. 命名網格區域**

#### **`grid-template-areas`**
- 使用區域名稱指定元素位置，讓佈局更直觀。
- **範例**：
  ```css
  .container {
    grid-template-areas: 
      "header header"
      "nav nav"
      "content sidebar"
      "footer footer";
    grid-template-rows: 100px auto 300px 50px;
    grid-template-columns: 2fr 1fr;
  }

  .header { grid-area: header; }
  .nav { grid-area: nav; }
  .content { grid-area: content; }
  .sidebar { grid-area: sidebar; }
  .footer { grid-area: footer; }
  ```

---

### **6. 範例總結**
完整範例，包含命名區域與基本佈局：
```html
<div class="container">
  <header class="header">Header</header>
  <nav class="nav">Nav</nav>
  <main class="content">Content</main>
  <aside class="sidebar">Sidebar</aside>
  <footer class="footer">Footer</footer>
</div>
```

```css
.container {
  display: grid;
  grid-template-areas: 
    "header header"
    "nav nav"
    "content sidebar"
    "footer footer";
  grid-template-rows: 100px auto 300px 50px;
  grid-template-columns: 2fr 1fr;
  gap: 10px;
  max-width: 900px;
  margin: auto;
}
```

### **7. 自動化與彈性布局**
#### **自動填充與適配**
1. **`repeat()`**：
   - 用於簡化重複模式：
     ```css
     .container {
       grid-template-columns: repeat(3, 1fr);
       /* 定義 3 列，每列寬度相等 */
     }
     ```

2. **`auto-fit` 與 `auto-fill`**：
   - **`auto-fit`**：自動調整列數，填充可用空間。
   - **`auto-fill`**：保持網格模板，未使用的空間也保留列。

   **範例**：
   ```css
   .container {
     grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
     /* 列寬最小 100px，最大填滿空間 */
   }
   ```

---


此筆記結合了 **Grid** 和 **Flexbox** 的佈局功能及應用場景，適合開發過程中查閱與實踐。

## **補充：表格與 CSS 的選擇**
1. **適用表格**：
   - 用於展示結構化數據，如報表、匯總資訊。
   - 使用 `<table>` 搭配 `colspan` 和 `rowspan`。

2. **適用 CSS 排版**：
   - 更靈活的佈局設計，例如儀表板、卡片式版面。
   - **Flexbox** 或 **Grid** 可模擬表格效果。

