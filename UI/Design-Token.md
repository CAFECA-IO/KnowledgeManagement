# Design Tokens

## What is Design Tokens

### 前言
Design Tokens 指的是在產品設計中中對於重複性元素的值給予的代稱，他進一步的定義key-value pairs。
key-value pairs（鍵-值對）指的是將原本給予計算機讀的值轉為人可以讀懂的值，如 Green 50- #44D4CC，其中 Green 50為 Key，#44D4CC 為 Value），也就是說將原本以數字或是代碼的視覺元素值，轉換為開發人員或設計人員更易閱讀的詞。
而Design Token則是將key-value pairs在更近一步的給予其定義，使該元素不僅僅只是 Color、Spacing、Radius 等，更代表了設計決策及使用意圖的說明。同時也可以是在設計與開發中確保使用相同Style的一個方法。

#### For Example
Green 50＝ #44D4CC為一組key-value pairs，而 background-primary-color＝#44D4CC 則可視為是一個 Design Token，他明確的表達了他是要在背景色中使用的 Primary color。

### Design Token 在設計與開發之間的角色
Design Tokens 可以說是在團隊開發中不可或缺的一個角色，不僅僅只在設計上大幅度的提升方便性即可變動性，對於開發來說也是同樣的道理，除了讓設計師與開發者在溝通上面更為準確外，在開發時事先定義好 Design Token，也可以在未來設計上有變動時，只需要一行代碼即可快速調整介面。

<img width="718" alt="截圖 2024-01-11 上午9 50 37" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/99a7dbf6-8809-40ab-a874-f35f862c464f">

推薦 Figma Plugin：
[Design Tokens](https://www.figma.com/community/plugin/888356646278934516/design-tokens) by Lukas Oppermann
可直接從Figma 匯出 Style Dictionary的 .json 檔或是匯入 Github

[Sync Design Tokens](https://www.figma.com/community/plugin/1128196356923537195/sync-design-tokens) by suleiman
可將.json的Url 匯入 Figma 建立 Design Token

[Style Organizer](https://www.figma.com/community/plugin/816627069580757929/style-organizer) by SHOPEE SINGAPORE PRIVATE LIMITED
可以掃描文件所有顏色及文字的 Style 狀態，方便檢視 Token 與元素的連結狀況


## Design Token 有哪些?

_粗體為 Figma中目前有支援其Variants 或 Style 設定_

- **Color**
- **Typographic**
  1. Font Familiy
  2. Font Size
  3. Font Weight
  4. Line Height
  5. Letter Spacing
  6. Text Alignment
  7. Decoration
  8. Case
- **Radius**
- **Size**
   1. Width
   2. Height
- **Spacing**
   1. Padding
   2. Margin
- **Shadow**
- Boarder Width
- Boarder Style
- Opacity
- Transition

## Design Token 的層級

很多人不知道其實 Design Token 是有分層級的，常見的主要為三種層級：

Level 1= Global Tokens 
Level 2= Alias Tokens 
Level 3= Component Tokens 

（某些特定平台會使用不同名稱代表Token 階級，如 Google 使用 Reference tokens 、 System tokens 和 Component Tokens， Figma 則使用Primitive tokens、Semantic tokens和 Component Tokens。）

當層級越高，複雜性也越高，但同時帶來了更強大有組織的系統及未來的便利性。

For Example：

### 單層結構（Global Tokens）
為最基礎的 Token 系統，單純只定義色碼於 Design System 當中顏色代表的方向，如：主色、副色、輔色。

- primary-color = #2A4FF0, secondary-color = #F7C28F, etc.

### 雙層結構（Alias Tokens） 
相較於單層結構，能讓整個 Token 系統更為靈活，通常在第一層先給予色碼較易讀的名詞，第二層則使用第一層建立的名詞進一步的給予簡述及表達設計決策。

- Level 1 ：blue-60 = #2A4FF0
- Level 2 ：primary-background-color = {blue-60}

### 三層結構（Component Tokens） 
三層結構是基於雙層結構的基礎上，在更清楚的定義每個 Token 的使用時機，通常針對重複出現的Component 進行細分

- Level 1 ：blue-60 = #2A4FF0
- Level 2 ：primary-background-color = {blue-60}
- Level 3: button-primary-background-color = {primary-background-color}

## 系統維護

有了多層結構的 Design Token，對於日後開發維護，或是新增不同的 Mode 時，讓設計師在調整設計稿時有更大的靈活度，也讓開發人員在開發時能更快速並且準確的調整 Code。以上面的數值舉例來說：

Light Mode: {Primary-background-color } = {blue-60} = #3367CC

Dark Mode {Primary-background-color } = {blue-10} = #507CD3

只要改了第二層的 Primary-background-color，則第三層所有套用 Primary-background-color 的物件則會同步一起調整，其中也會包含 button-primary-background-color，同時若因其他考量，想要在不變動其他元素的其況下單獨調整 Button 顏色，則只需修改第三層的 button-primary-background-color，也不會影響到其他設計。

## 如何在Figma建立完整的 Design Token

### Variables

#### 概述
自從 Figma 於 2023年推出 Variables的功能時，實現了在設計稿上設定多層結構的 Token 能力，目前 Variables只提供 Color、Radius、Size、Spacing 的設定。

設定範本：
![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/ad483d47-0e33-4e99-9cd4-6882f7cff9eb)

大型企業的設定：
![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/5c26fadb-6d0b-4037-87ce-1cbf84470368)

Variables 該以什麼樣的方式分類，分類須包含哪些項目在裡面以及命名規則等，會因為不同的團隊而有所不同，最重要的是統一一致，並且能在團隊內部順利溝通為最佳。

#### 建立方法：

#### Step 1：在設計文件中打開 Local Variables，並新增 3個 Collections 並分別命名
<img width="1440" alt="截圖 2024-01-11 下午12 08 18" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/87f69870-4864-496b-85d3-42b9e4f5f4a5">

#### Step 2：在 Global Tokens 裡面設定好所有的顏色及值，並準確命名和分類
<img width="1440" alt="截圖 2024-01-11 下午12 36 39" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/5ae6f7e8-728a-43f8-8467-8898b9741bba">

#### Step 3：在 Alias Token 裡面套用Global Tokens，並準確定義設計決策
<img width="1440" alt="截圖 2024-01-11 下午12 45 01" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/077db29b-b209-4976-afea-5dc5d18a7248">

#### Step 4：在 Component Token 裡面套用Alias Tokens，並準確定義設計決策
<img width="1440" alt="截圖 2024-01-11 下午1 08 11" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/00bf11b1-3b93-4428-983d-0faef74cb07c">

#### Step 5：在設計中通常只需套用Alias Tokens 或 Component Token (只套用於 Component 物件上)，因此我們可以在 Variable 內針對所有 Token 去設定未來在設計介面中，每個Token選項會出現在哪裡，如此一來更方便設計師尋找正確相對應的 Token 來套用。
<img width="1440" alt="截圖 2024-01-11 下午1 08 11" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/e4d0f6ef-d03f-43b1-8363-845ca5b28118">

### Style

在 Figma 的 Local Style中，可針對 Typographic、Shadow 及 Grid 進行設定，設計師應對照 Design System 將所有 Style 參數於設計前先設定完成，並在日後的設計中套用。

<img width="241" alt="截圖 2024-01-11 下午1 14 02" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/fe432bee-aea1-4320-929a-3e89ee447f4c">

## 結語

一份理想的設計稿應具備完整的Design Token設定，並且在所有元件當中進行套用，應該避免沒有連結 Design Token的文字、顏色以及數值，如此一來在日後設計稿的維護及調整上都可以更加快速且準確，可以避開疏失造成的遺漏或設計稿的不統一。
Figma 中的所有 Design Token 皆為可發佈的，方便在跨文件時仍能維持一致性。


## Reference

- [Adobe Spectrum](https://spectrum.adobe.com/page/design-tokens/)
- [Deepak Choudhary- Design Tokens — a Design System Superpower!](https://uxplanet.org/design-tokens-a-design-system-superpower-dab07a5f0035)
- [Osama Eldrieny- Design Tokens Presentation](https://www.figma.com/file/NkSEPdNKGxTtdHyIxrg0Ky/Design-Tokens-Presentation-(Community)?type=whiteboard&node-id=0%3A1&t=OBu0tSA65g3t0qOJ-1)
