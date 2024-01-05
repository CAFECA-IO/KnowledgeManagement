<div align=center>
  
![Design System](https://github.com/CAFECA-IO/KnowledgeManagement/assets/77717533/888a0906-baf3-4b46-ae3f-ef883b05e64f)

</div>

設計系統 Design System
===

## 前言
在使用產品的過程中，身為使用者的我們有時候會發現在使用同一個公司的產品時，視覺、使用方式、產品體驗截然不同，不像是同一所公司的產品；而有些公司的產品即使是不同功能，但整體視覺、使用體驗相似甚至達到一致。
而為什麼會有這樣的差異呢？其實就在於公司是否有建立一套完整的設計系統(Design System)，並且在產品中遵守設計系統的規範。

設計系統(Design System)可以幫助不同產品卻能給使用者和諧的體驗與風格，除了能讓使用者預期如何使用公司的產品，也能讓品牌的核心價值得以闡述。

接下來會從何謂設計系統、現有設計系統平台參考做介紹，以便讀者更了解設計系統相關知識，未來在建立設計系統能更了解需要的項目以及注意事項。

## 何謂設計系統
> A design system offers a library of visual style, components, and other concerns documented and released by an individual, team or community as code and design tools so that adopting products can be more efficient and cohesive. -- by Nathan Curtis in [Defining Design Systems](https://medium.com/eightshapes-llc/defining-design-systems-6dd4b03e0ff6)

設計系統Design System 含了品牌價值、設計原則 (Design Principles)、設計標籤 (Design Token)、組件庫 (UI Library)、設計模式（Design pattern）以及可訪問性，其實設計系統的目的都是為了讓產品的開發更有效率，無論是在設計端或是開發端都能更有效率的進行產品開發，並且提供一致的用戶體驗。


<div align=center>

![atomic-design](https://github.com/CAFECA-IO/KnowledgeManagement/assets/77717533/5d15eb2b-1bd7-4abd-abc3-cf21599c837d)

</div>

### ​​​​Atomic Design 原子設計方法論
Brad Forst一名美國的設計師於2013年提出此設計概念：
從介面由什麼組成與如何更有條理建立設計系統下，Brad Forst他高中時期的化學實驗室發現了靈感與相似之處，所有物質（無論是固體、液體、氣體、簡單、複雜等）都是由原子組成的。這些原子單元結合在一起形成分子，分子可以結合成更複雜的有機體，最終創造出宇宙中的所有物質。同樣，介面也是由更小的組件組成的，由最小單位可能是一個小icon至最後的功能頁面，如何將設計更具條理的建立，這就是原子設計的基本要點。

從原子設計的方法論中，可以延伸出介面五種不同的階段組合，去創建一個有層次、計畫性的介面設計系統。
此五種階段與原子設計相對應代表為：
- **Atoms 原子**：為網頁構成的基本元素，頁面中的最小單位，一個標籤、輸入列，或是一個按鈕都能是原子，也可以為非實質的概念，例如色調、字體樣式等。
- **Molecules 分子**：由原子所構成的簡單UI物件，像是由標籤與資訊組合成的表單等。
- **Organisms 組織**：相對分子而言，較為複雜的構成物，由原子及分子所組成，例如導覽列包含了選單，按鈕等。
- **Templates 模板**：以頁面為基礎的架構，將以上元素進行排版設計。
- **Pages 頁面**：將實際內容（圖片、文章等）套件在特定模板。

### 設計系統架構
設計系統通常包含三個部分，有些設計系統會再從中細分，系統主要會有包含到：風格指南 Style Guides、模式庫 Pattern Library、組件庫 Component Library。
- **風格指南 Style Guides** : 視覺上包含到品牌設計、字體設計、色彩設計、商標LOGO等；在使用者體驗上則包含到設計動線方向、視覺互動設計標準、轉場動畫等。
- **模式庫 Pattern Library** : UI 元素，像是按鈕和表單等。
- **組件庫 Components Library** : UI pattern，有些設計系統會加上code，是可以直接套用的模組。

## 現有設計系統平台參考
<div align=center>

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/77717533/e3878365-50a9-4a6b-8af9-4d6b1f78f0ea)

</div>

### ​​​​Ant Design介紹
Ant Design是由螞蟻集團開發的一個設計系統。由於螞蟻集團主要產品為金流大數據以及各種小型金融服務，系統龐大複雜、變動與開發頻繁，常常需要設計團隊與開發團隊溝通並做出相對應的功能，因此後續在討論與溝通環節中發現類似產品有相似的頁面與元件，也因商業化趨勢，越來越多企業更重視使用者需求與體驗，後續螞蟻集團在經過了大量的實踐後打造出服務於企業級產品的設計系統 —— Ant Design。

Ant Design是基於「自然」、「確定性」、「意義感」、「生長性」四大設計價值觀所開發，並且將個部分元件模組化，降低多餘的生產成本，能夠讓設計師更多時間專注於使用者體驗上。而Ant Design提供完善的設計指引與最佳實踐、設計資源與工具，來幫助設計者快速產出高質量產品原型。

#### ​​​​Ant Design的優缺點
> 優點

**幫助團隊產品快速上線：**
Ant Design提供了一套完整的介面方案，每個部分都有自己成套的代碼框架，開發單位可以根據實際的使用情況選取使用。
假設團隊有了一個新的idea，最好的方式就是需要減少成本使用到最少資源快速開發這個產品並且投入市場，透過獲取使用者的回饋，來驗證產品idea是否可行，快速迭代後最終做出最完善之產品。此時Ant Design就能滿足團隊需要。

**減少設計與開發不確定性：**
Ant Design提供大量功能且UI風格統一的元組件，能夠幫助開發團隊快速建立通用場景下的應用頁面。元件庫內的功能支持大部分前端開發者的需要，另外其設計團隊所提出的設計規範非常詳細且具有相當使用邏輯，團隊可以先使用Ant Design進行設計系統建立，待後續確認企業方向與目標再來調整或是建立新設計系統，屆時也可以參考Ant Design作為樣本。

**節省設計與開發人力成本：**
Ant Design提供的設計工具和元件框架可以讓設計與開發者減少負擔，用更少的時間呈現給使用者有創意且具備競爭力的產品，大大節省團隊在設計元件以及其他通用介面上的時間，開發端也能夠直接使用TypeScript來完成設計。

<div align=center>

  ![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/77717533/72fe4a20-e4a2-4705-88d7-ac44b577f449)

</div>

> 缺點

**無法根據該企業產品進行訂製：**
Ant Design設計系統主要為通用元件與通用介面方案，並不是專屬於某個產業或是受眾。假設團隊資源足夠的話，建議還是有必要讓公司的設計團隊建立一套屬於自己企業的產品設計系統，管理平台畢竟會根據自身業務做調整，並沒有一個可以通用全部的設計規範。

**同質化問題：**
從相同行業都會發現產品是有相同的功能的，而這時候就是考驗各個公司的設計團隊對於使用者的了解與設計安排，但如果大家在設計系統上都是使用同樣系統，設計出來的產品差異性其實並不大，反而導致同質性過高，市場上沒有一個獨樹一幟的產品，大家都是相同的，使用者在選擇產品上參考的可能就會變成價格或公司規模等，失去了原本設計團隊創建設計系統的意義。

## Reference 
-[設計系統分享](https://medium.com/uxeastmeetswest/%E8%A8%AD%E8%A8%88%E7%B3%BB%E7%B5%B1-design-system-%E5%88%86%E4%BA%AB-4e9052fa017)

-[何謂設計系統](https://blog.airouting.io/article/20210106001)

-[螞蟻集團wiki](https://zh.wikipedia.org/zh-tw/%E8%9A%82%E8%9A%81%E9%9B%86%E5%9B%A2)

-[Ant Design](https://ant.design/)

-[從設計師的角度，介紹Ant Design](https://pixso.cn/designskills/mayiantdesign/)

-[網頁設計 : Atomic Design簡介及工作實例](https://medium.com/uxeastmeetswest/%E7%B6%B2%E9%A0%81%E8%A8%AD%E8%A8%88-atomic-design%E7%B0%A1%E4%BB%8B%E5%8F%8A%E5%B7%A5%E4%BD%9C%E5%AF%A6%E4%BE%8B-42e666358d52)

-[atomic design](https://bradfrost.com/blog/post/atomic-web-design/)

-[Design System 101 - 介紹設計系統](https://www.jing-tech.me/series/design-system/introduce/)
