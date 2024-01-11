# Component

## 前言

在 #86 中有提到了許多專案裡可能會出現的核心 Component，但通常專案都會針對 Low-Fidelity Wireframe去規劃設計時需要用的 Component，而在建立每個 Component 的時候需有完善的考量，包含 Component 會有的狀態，以及如何用利用 Component 的 Variant 來減少 Component的數量，以建立靈活度最高也最高效的 Component Library。


## 特色

通常我們會針對設計稿中會重複出現的物件建立 Component，小至 Icon 大至 Header 等，原因在於 Component 存在父子關係，當我們修改最初的 Main Component 時，其他被使用的子 Component 就會與其同步，如此一來更方便管理也在需要修改時，不再需要手動一個個修改。 並且利用 figma 中 Variant 的設定，增加 Component 的變化性及延展性。

## UI elements 的組成

在原子設計的概念中提到一個完整的介面由：

- Atomic 原子 : Design Token
- Molecules 分子：Component
- Cells 細胞：Pattern
- Organisms 有機體：Blocks
- Species 生物：Template

層層堆疊上去而組成的

![1*t4UpVgWW-_YLpRZd4wmdSg](https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/aa78c4c4-da70-44ea-ae29-7816ac13f4df)


如 #87 的內容中提到， 在建立 Design Token System 時會建立 Component Token，是屬於最初層級，像是所有元素的原子一般，而簡單來說一個Component 就是由不同的 Design Token 所組成的一個分子，例如：button

![nQiY33cRGIC7ACg8IOkRVJ6INCw](https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/613a72c9-46a5-46fd-8c56-9425c8cfad14)


Pattern（Cell） 則是由多個 Component 組合下的一個細胞，在不同情境下會使用，例如： Search Bar （Text field+Dropdown+Button）或Breadcrumbs（Icon+Button+Divider） 等。

而多個 Pattern 又可以再進一步組成 Blocks（Organisms）如同有機體一般，例如：表單、Header、Footer 等

不同的 Blocks 組合在一起就形成了一個 Template (Species) 也可稱 Page，也就是最終產出的個體，如： Landing Page

但在設計階段我們會建立在 Figma 中的 Component，通常僅到Pattern 為止，主要著重在會重複的物件當中。

## 如何建立 Component

### 命名

#### Component的命名
在 Figma 中，可以利用命名規則讓Component 進行分類，如此可方便設計師在尋找需要使用的Compnent 時更為快速。
例如：

Icon / Outline / Share = 在 Icon 資料夾中的 Outline 分類裡的"Share"

如此一來只要是以Icon / Outline 開頭的其他Component 就會自動被歸類在一起，因此有組織的分類及清楚的命名對於龐大的 Component Library 來說是非常重要的。

#### Variant 的命名
在建立 Component 的過程中常常會針對不同的需求對 Component 進行展開，例如不同的狀態，尺寸等，要確保在設定這些 Variant 時有正確針對 Variant 的功能進行命名，方便日後團隊了解如何使用該 Component。

## Variant

<img width="1439" alt="截圖 2024-01-11 下午2 40 29" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/2f74c1bb-184f-4d5e-ada9-4ea0c144e89f">

在Component的設定中，我們可以創建多個 Variant 並為其命名，藉此來切換 Component 不同的狀態，也較方便設定Prototype。
常見的 Variant 有：
- State: Default, Hover, Active, Disable
- Type: Primary, Secondary, Disable
- Size: Small, Medium, Large

Variant 的變化可以很靈活，隨著設計不同的需求進行分類及創建，未來在設計稿上使用時，也可快速的進行 Variant 之間的切換。

## Instance Swap

<img width="1438" alt="截圖 2024-01-11 下午2 47 52" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/d9b9b3bd-8765-499d-8041-918c750a42d7">

在建立 Component 時，也常常會將其他的 Component 包覆其中，這時可以針對被包在裡面的Component 設定 Instance Swap ，設定後的Component 就可以在日後與其他Component 進行交換，常見的狀況是用在 Icon 上，當一個 Component 裡面包含了 Icon 的元素，但日後可能會因為不同情境替換 Icon的樣式，這時候對 Icon 設定 Instance Swap 即可在日後使用 Component 時快速切換 Icon的樣式，並確保 Icon 會自動套用Component 設定好的樣式，不管大小或顏色等。

## Boolean

<img width="1439" alt="截圖 2024-01-11 下午2 57 16" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/622c72c9-4dae-4dbf-94e0-1614cd86736c">

在某些情況下，一個Component 當中可能會有一些物件是我們需要他可以被隱藏或被顯示，利用 Boolean 套用在圖層上，日後在使用 Component 時，就可以一個開關決定圖層是否要顯示。 常見的狀況包含： Text Field 的 Lebel、Status，或是按鈕的左右 Icon等。

## Text

<img width="1440" alt="截圖 2024-01-11 下午3 01 55" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/949116c8-c54c-4692-9f13-cae135927e9b">

在 Component 的文字物件上，可以套用 Text 的設定，目的是在於日後使用 Component 時可以快速更改文字內容並保持文字 樣式，更重要的事，在對 Component 進行互動時，能確保文字在每個狀態下都是正確顯示。 


## 開發人員與 Component

開發人員在 Figma 的 Dev Mode 中，也可以點按 Component 來開啟 Play Ground，該功能方便開發人員查看一個 Component 所有不同的狀態，不需慢慢尋找，更也不需擔心動到設計稿。

<img width="681" alt="截圖 2024-01-11 下午3 12 41" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/290ed45a-931f-4c08-a444-742a8ddbaa00">


在工作流程方面，在正式進入 High-Fidelity Wireframe（Mockup）之前，先將 Component 建立起來的好處不只是在日後設計Mockup 時能夠更快速方便，也方便開發人員針對設計好的 Component 先行建立日後可重複使用的UI component library，如此一來可以使產品開發流程更為順暢。

## Reference 

- [Hannah Heinson-Atomic 2.0](https://medium.com/@hannah.heinson/atomic-2-0-d94e5601200c)
- [Samuel Allotey-Using Components to Enhance Handoff and Designer-Developer Communication](https://bootcamp.uxdesign.cc/using-components-to-enhance-handoff-and-designer-developer-communication-cb1e2fb98a9d)
- [Louis Chenais-Introduction to design tokens](https://specifyapp.com/blog/introduction-to-design-tokens#what-are-design-tokens)
