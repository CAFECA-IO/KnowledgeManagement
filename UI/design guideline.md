<div align=center>
  
![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/77717533/390b741e-83ec-4e1e-b17b-2d0c86464509)

</div>

# 設計指南 Design Guideline

## 前言
什麼是設計指南？顧名思義設計指南是一個提供設計師在無限延伸的設計邊界之中，能有一定遵循的基礎上設計。Interaction Design Foundation提到設計指南是關於如何應用設計原則來提供使用者體驗的一系列建議。設計師使用設計指南來判斷與採用直覺性、可學習性、效率和一致性等原則，讓設計師可以創造出更引人注目的設計，滿足甚至超越使用者本身的需求。

設計指南(Design Guideline)並沒有一致的規則或邏輯，設計指南會根據公司、產品性質還有團隊運作模式而有所不同。雖然有所不同，但相同之處就是設計指南是設計師原則判斷、與工程師、產品經理等溝通記錄的橋樑。

## Design Guides 設計指南的用途
在前言提到設計指南(Design Guideline)主要為設計師原則判斷、與工程師、產品經理等溝通記錄的橋樑，在設計師原則判斷的部分中包含了規範設計風格及視覺一致性。設計指南在專案中扮演的角色是溝通與提供一個遵循的基礎框架，當一個產品專案開始時不一定是由同一個設計師從頭到尾進行設計工作，中途可能會加入其他設計師或是團隊協助，如果這時候沒有一個「框架」，每一位設計師所設計的頁面與設計的邏輯很高的機率都長的不同，還會出現相同功能但不同排版風格的頁面、或是不同功能卻有類似輸入清單頁面狀況發生，這些狀況都是產品設計中會導致使用者後續使用上會發生錯誤的原因，可能也會導致設計師在設計上因沒有固定規範遵循，後續需要調整修改造成工作效率降低。

在專案開發的過程中，使用Design guideline能夠有效的減少設計溝通上的落差，避免產生設計頁面的落差，統一了專案的視覺風格與一致性，除了能夠讓後續參與專案的設計師有一定的規範遵循外，還能夠協助他更快上手專案，提供專案的設計方向，在專案初期建立的過程中，有些專案會使用Design guideline與Ｗireframe進行前期功能討論，在過程中也能夠與產品企劃輔助溝通，讓流程更符合產品性質與產品受眾，避免過多的自由空間導致討論過於發散。

這時候可能會好奇是不是所有產品專案都需要Design guideline？其實並非所有專案都需要使用到Design guideline，視專案大小來決定，如果單純只是活動頁面的專案，可以不需要使用到Design guideline，就像是有些Redesign或是Side Project也不一定會建立Design System。

## Design Guides 設計指南的常見樣式
在Interaction Design Foundation有關於設計指南的內容分類，主要分為以下幾組，包括：

1. 風格：例如品牌標誌、顏色

2. 佈局：例如，網格或清單結構

3. 使用者介面(UI)元件：例如選單、按鈕

4. 文字：例如字體、標籤/字段

5. 可訪問性：例如，針對殘疾使用者的 Aria 標記

6. 設計模式：例如表單

從以上的內容根據公司、產品性質、團隊模式又可以延伸出相關內容的指南內容，以下列專案為例:

![Design Guideline](https://github.com/CAFECA-IO/KnowledgeManagement/assets/77717533/6a418574-745a-4423-a07e-e567825e2488)

主要內容包含了顏色、文字樣式、圖示、網格系統、間距、元件類型等。

### 顏色
包含了品牌標誌的主色與副色，文字所使用的自然色與系統中顯示的顏色(成功通知、警告通知、禁止通知等)，後續會使用Figma內功能將顏色的色票做成色彩風格並且作為後續建立變數使用。
![Design Guideline-color](https://github.com/CAFECA-IO/KnowledgeManagement/assets/77717533/bbc9193a-d968-46ce-b56a-cca9b2a56026)

### 文字樣式
包含使用的字體類型，字體大小的規範，標題字體、內文字體、字距設定，確認設定後會使用Figma內功能將文字樣式作為文字風格提供後續設計師使用與調整時能夠統一修正。
![Design Guideline-Typography](https://github.com/CAFECA-IO/KnowledgeManagement/assets/77717533/66e70831-a475-470d-be2c-e4f787d61534)
![Design Guideline-Typography2](https://github.com/CAFECA-IO/KnowledgeManagement/assets/77717533/c6c5baa9-65c1-468d-a80d-16eb26d057c6)

### 圖示
規範使用的icon類型包含Fill、Outline，圖示大小與顏色。
![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/77717533/72f5d12e-2228-406d-991c-06b3bba2b3a2)

### 網格系統
包含排版的欄、等寬、間距，後續進行RWD所需的斷點等。
![Design Guideline-Grid System](https://github.com/CAFECA-IO/KnowledgeManagement/assets/77717533/de6aba00-9c7c-475e-8a67-7e4fae51d9b6)

### 元件類型
常見的按鈕、checkbox、Radio、input輸入欄位等元件，後續建立Design System 或是 Module也能夠延伸應用。
![Design Guideline-Buttons](https://github.com/CAFECA-IO/KnowledgeManagement/assets/77717533/96129ad3-63d2-4368-b5f2-bb0e2f164088)
![Design Guideline-Selectors](https://github.com/CAFECA-IO/KnowledgeManagement/assets/77717533/e8f39cf8-ded7-4ecb-9783-54f46da38e1e)
![Design Guideline-Textfields](https://github.com/CAFECA-IO/KnowledgeManagement/assets/77717533/796b07a8-f1c1-4bff-9b95-c2d51a9a88a3)

## 建立設計指南的優點
使用設計指南的原因有很多，而每個原因都有助於設計專案的整體成功，建立設計指南的優點在於：

- 提供設計一致性：設計指南彌補了使用不同產品、平台時的佈局、排版、配色方案和互動等設計項目一致性。具有規則的設計是品牌認知度的關鍵，從中透過減少認知負荷和提高可用性能夠改善使用者體驗。
- 效率：設計指南提供了設計師有序遵循的設計基礎，也提供了一套能夠讓設計師做出設計決策的標準。設計師不必將時間浪費在製作設計元素的重複性工作上，因為他們只需要做一次即可將其作為未來使用的通用解決方案。
- 可用性：指南中的規則是基於使用者需求的設計原則產生，目的是讓產品的使用更直觀、更容易。更清楚的導航、圖件元素的一致使用以及熟悉的互動模式能夠提高可用性，讓用戶滿意度提高且培養品牌忠誠度。
- 協作：設計指南是設計師、開發人員等溝通的共同基礎，有依循才能從中創造協作環境。設計指南可協助每位參與人員對設計標準、期望和溝通/團隊合作流程達成共識。這也能幫助項目合作過程中有比預期更好的結果。
- 可擴展性：設計指南提供了可擴展的演示，有助於未來的設計迭代和調整。準則確保一致性和連貫性，因此隨著產品的發展和功能的添加，它們可以輕鬆集成，而不會影響用戶體驗或品牌形象。
- 品牌識別：明確和重複的設計元素以及對品牌規則的尊重確認了品牌的識別和認知。這些準則傾向於保持視覺一致性和對品牌價值的堅持，從而提高用戶群中的品牌認知度、可靠性和忠誠度。

## 總結
設計指南是不可替代的工具，它是設計決策的基礎和參考，協作過程能夠因為設計指南的內容，完整設計過程的一致性、可用性和提升效率。設計指南(Design Guideline)並不是一次性的文件，需要持續的迭代與維護。
與跟產品相同，設計指南也需要花時間去了解閱讀者的需求並且進行迭代，常見可參考的設計指南 Material Design 或 iOS Human Interface Guidelines 至今仍然持續更新中。

總之，設計指南可以說是設計師的框架，也能說是團隊的溝通橋樑，在框架的意象中，設計指南代表的是給設計師創造一致、實用且美觀的設計；在溝通的橋樑意象中，設計指南代表的是凝聚力且友善溝通的規範。

## Reference 
- [What are Design Guidelines?](https://www.interaction-design.org/literature/topics/design-guidelines#what_are_design_guidelines?-0)

- [一篇Design Guidelines（設計準則）的誕生？](https://musechang.medium.com/%E5%A6%82%E4%BD%95%E9%96%8B%E5%A7%8B%E5%AF%AB%E4%B8%80%E7%AF%87design-guidelines-%E8%A8%AD%E8%A8%88%E6%BA%96%E5%89%87-5c5896574109)

- [介面設計規範（UI Design Guideline）的撰寫方式](https://huangruilin.tw/2021/09/03/how-to-write-a-uidesign-guideline/comment-page-1/)

- [如何著手開始design guideline?](https://wenchien0213.medium.com/%E5%A6%82%E4%BD%95%E8%91%97%E6%89%8B%E9%96%8B%E5%A7%8Bdesign-guideline-5842b2d045c2)

- [What are Design Guidelines?](https://www.geeksforgeeks.org/what-are-design-guidelines/)
