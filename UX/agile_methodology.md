# 什麼是敏捷開發？

## 概覽

想像你要裝潢房間，與其一次訂好所有家具、顏色、擺設，然後等到一切完成才發現有些地方不合適，不如分階段進行，邊裝潢邊調整，確保每一步都符合你的需求。這就是敏捷開發（Agile）的概念！

敏捷開發是一種軟體開發的概念，並沒有一定的格式，主要強調 **小步快跑、持續調整、團隊合作**，避免一次規劃太多導致錯誤難以修正。這與傳統的「瀑布式開發」（Waterfall）不同，後者是先做完整規劃，再一步步執行。

![Add-a-subheading-1-1](https://github.com/user-attachments/assets/0ee5ac77-e22b-48dd-b79b-6153a20ae60d)


## 敏捷開發的四大核心價值

敏捷開發的核心精神來自 2001 年發表的 [《敏捷宣言》（Agile Manifesto）](，其中強調：

1. **個人與互動** 勝過 **流程與工具**
2. **可運作的軟體** 勝過 **詳盡的文件**
3. **客戶協作** 勝過 **合同談判**
4. **回應變化** 勝過 **遵循計劃**

這並不代表右邊的項目不重要，而是左邊的價值更值得優先考量！

## 如何讓敏捷開發更有效？

### 1. 優化待辦清單（Backlog Refinement）

敏捷團隊會根據 **待辦清單（Backlog）** 來安排工作，確保最高優先級的任務都有明確的需求與標準。如果需求模糊，開發時就容易出問題。因此，**產品負責人（Product Owner）** 需要確保開發團隊清楚所有的待辦事項，以避免「最後一刻才發現不知道在做什麼」的窘境。

#### 提醒：
- 重要的開發項目應提前 **2-3 個 Sprint**（開發週期）進行規劃。
- **團隊必須確認** 需求明確後，才能開始開發。
- **低優先級的項目可保持模糊**，避免浪費時間。

### 2. 持續整合（CI/CD：Continuous Integration & Continuous Delivery）

敏捷開發的節奏很快，每個 Sprint 都要交付可運行的軟體，因此不能等到最後才測試，而是要**持續測試、持續整合**。這就像寫作業時不等到最後一天才檢查，而是邊寫邊確認，確保不會出錯。

#### 重要實踐：
- **單元測試（Unit Testing）**：每次寫新程式碼時，確保有測試來驗證功能。
- **自動化建置（Build Automation）**：讓系統自動檢查新程式碼是否能正確運行。
- **部署流程（Release Pipeline）**：每次更新都自動部署，確保軟體可隨時上線。

### 3. 控制技術債（Technical Debt）

技術債就像信用卡債務，**欠越久，還越痛苦**。如果開發時為了趕進度而寫了不夠乾淨的程式碼，未來要修復或擴展功能時就會變得非常麻煩。因此，團隊應該 **每個 Sprint 都撥時間來清理技術債**，確保長期維護成本不會失控。

#### 怎麼控制技術債？
- **每個 Sprint 分配一點時間來重構（Refactor）程式碼。**
- **讓產品負責人與開發團隊協調，確保技術債不被忽略。**
- **不要為了趕進度而犧牲程式品質，短期輕鬆，長期痛苦！**

## 常見的敏捷迷思

### ❌ 敏捷開發 = 隨便開發？
錯！敏捷不是「想到什麼就做什麼」，而是有精準計畫地適應變化，並確保每一步都有明確的價值。

### ❌ 敏捷不需要計劃？
錯！敏捷重視 **持續規劃**，而不是「一次規劃到底」。每個 Sprint 都會檢討與調整，以確保團隊朝著正確的方向前進。

### ❌ 敏捷不適合大型組織？
錯！即使是大公司，也可以透過 **Scrum、SAFe** 等框架來擴展敏捷，確保團隊協作順暢。

## 為什麼選擇敏捷開發？

現在的軟體開發環境變化快，**用戶需求、技術趨勢、市場競爭** 都不斷變動。如果還用十幾年前的傳統方法，一次規劃 6-12 個月的專案，等到產品推出，市場可能已經變了！

敏捷開發讓團隊可以**快速交付、快速調整**，確保每一步都能根據用戶需求進化，最終做出真正有價值的產品。

## Scrum

### 什麼是Scrum

Scrum 是一種敏捷開發框架，幫助團隊以迭代（Sprint）方式開發產品，通常每個 Sprint 為 1 到 4 週。
Scrum 團隊包含 **產品負責人（Product Owner）、Scrum Master 和開發團隊**，
並透過 **每日站立會議（Daily Stand-up）、Sprint 規劃、Sprint 回顧 和 Sprint 檢視** 等活動來持續改進和交付價值。
Scrum 強調團隊協作、快速適應變化，以及持續交付可用產品。

<img width="821" alt="截圖 2025-02-19 下午12 01 41" src="https://github.com/user-attachments/assets/e846510a-b26c-4494-942b-9ecb22d93eb0" />

### Scrum 的週期

1. **產品待辦清單（Product Backlog**） —— 以 User story 的方始，規劃整個產品的功能，並將所有功能拆分為小任務，將其整合成一份清單

2. **Sprint 規劃（Sprint Planning）** —— 在此階段，團隊會根據前一步驟列出的待辦清單，來決定此次的 Sprint 該完成哪些任務

3. **Sprint 待辦清單（Sprint Backlog）** —— 這裡會將前一步驟決定要執行的任務，進行優先順序的排列。

4. **Sprint** —— 此階段會開始進行開發，在這裡不會管團隊成員應該如何執行任務，團隊成員決定如何管理自己的工作，只需遵循盡可能在 Sprint 的週期內完成任務。

5. **Potential Product** —— 上架在Sprint當中完成的產品，在敏捷式開發中通常會希望在第一個Sprint就可以產出一個已經可以供使用者運行的軟體，後續再持續優化。

6. **Sprint 檢閱（Sprint Review）** —— 在此階段會邀請所有成員以及利害關係人參與，並且展示此次Sprint 所產出的結果。

7. **Sprint 回顧（Sprint Retrospective）** —— 在這裡會希望主管、高層、投資方等不參與回顧，而是讓小組成員可以更自在地針對 Sprint 當中發生的問題進行討論與修正。

最後會回到第一步驟，重啟一個新的週期。

### Scrum 的角色

#### **Product Owner（產品負責人）** 

主要工作是決定 **團隊要開發什麼（What to build）**，以及 **為什麼要開發它（Why to build it）**。他們負責管理 **產品待辦清單（Product Backlog）**，確保其內容始終最新，並按優先順序排列，以確保團隊專注於最有價值的任務。

**主要職責**
1. **定義產品目標**  
   - 與 **利害關係人（Stakeholders）** 合作，確保產品方向符合業務需求與市場需求。
   
2. **管理產品待辦清單（Product Backlog）**  
   - 持續更新、調整需求，確保開發團隊始終專注於最重要的功能。
   - 確保待辦清單的項目 **清晰、可行且有優先級**。

3. **與開發團隊合作**  
   - 解釋需求，確保開發團隊理解每個待辦項目的業務價值與目標。
   - 參與 **Sprint 規劃會議**，確保選擇的開發項目符合產品策略。

4. **與利害關係人溝通**  
   - 定期與市場、客戶、業務單位等溝通，收集反饋並調整產品方向。

5. **驗證與接受開發成果**  
   - 確保開發完成的功能符合 **業務需求** 和 **用戶價值**，決定是否釋出產品。

---

#### **Scrum Master**  

Scrum Master 是 **Scrum 團隊的引導者**，確保團隊正確遵循 **Scrum 框架**，並持續優化工作流程。他們的角色像是 **教練、協調者、支持者**，負責解決團隊在開發過程中的障礙，幫助團隊提升效率和自主管理能力。

**主要職責**
1. **確保 Scrum 流程正確執行**  
   - 確保團隊遵循 Scrum 的 **事件（如每日站會、Sprint 規劃、Sprint 回顧等）** 和 **原則**。  
   - 引導團隊理解 Scrum 精神，如 **敏捷開發、持續改進與跨職能協作**。

2. **解決團隊的障礙（Impediments）**  
   - 幫助團隊排除影響開發進度的問題，例如技術瓶頸、跨部門協作困難等。  
   - 確保團隊能專注於開發，而不受外部干擾。

3. **持續改善團隊運作方式**  
   - 透過 **Sprint 回顧（Sprint Retrospective）**，與團隊討論如何提升效率、減少浪費，推動持續改進。  
   - 觀察團隊的工作方式，提供適當建議，使團隊更自律和高效。

4. **支持與激勵團隊**  
   - 充當團隊的「啦啦隊長」，幫助成員維持積極的工作氛圍。  
   - 促進開放透明的溝通，讓團隊成員可以自在地分享意見與挑戰。

5. **協助 Product Owner 和開發團隊協作**  
   - 幫助 Product Owner 定義清晰的 **產品待辦清單（Product Backlog）**，確保需求明確、可執行。  
   - 確保開發團隊理解產品目標，並能專注於最有價值的開發工作。

---

#### **Team Member**

在 Scrum 框架 中，Team Member（開發團隊成員） 是負責執行產品開發的核心角色。他們與 Product Owner（產品負責人） 和 Scrum Master（敏捷教練） 密切合作，確保 Sprint 內的工作能夠順利完成。

**主要職責**

1. **開發與交付產品增量（Increment）**
   - 根據 **Sprint 目標** 和 **Product Backlog（產品待辦清單）**，負責開發、測試、設計、部署等工作。
   - 在每個 **Sprint 結束時**，交付可運行且符合定義完成標準（DoD，Definition of Done）的產品功能。
     
2. **參與 Sprint 計劃與團隊協作**
   - 在 **Sprint Planning（規劃會議）** 中，與團隊一起決定 **「這個 Sprint 要完成哪些工作」**。
   - 透過每日 **Daily Stand-up（站立會議）**，同步進度、討論挑戰並協作解決問題。
   - 在 **Sprint Review（檢閱）** 分享開發成果，並在 **Sprint Retrospective（回顧）** 中討論如何改進工作方式。
     
3. **自主管理與協作**
   - Scrum 團隊是**跨職能的**，團隊成員可能來自不同領域，如 **前端工程師、後端工程師、UI/UX 設計師、測試工程師**等，大家一起協作完成產品開發。
   - **無單一領導者**，團隊自行決定**如何組織和執行工作**，每個人都對 Sprint 目標負責。
     
4. **不斷學習與改進**
   - 持續提升開發技能與團隊協作能力，採用**最佳開發實踐（Best Practices）**，例如測試驅動開發（TDD）、持續整合（CI/CD）等。
   - 在**Sprint 回顧會**中，總結 Sprint 期間的問題，並提出改進方案，讓下一次 Sprint 更高效。

### Scrum 文件

1. **產品待辦清單（Product Backlog）：** 是一份由各種User story所組成，代表產品需涵蓋的功能清單，會由 **產品負責人(Product Owner)** 管理並決定優先順序。

2. **Sprint待辦清單（Sprint Backlog）：** 是經過討論後從**產品待辦清單**中選出這次**Sprint**要處理的任務以及各任務的優先順序清單。

3. **燃盡圖（Burn Down Chart）：** 是用於表示**剩餘工作量**的工作圖表，由橫軸（X）和縱軸（Y）組成，橫軸表示時間，縱軸表示工作量。

<img width="832" alt="截圖 2025-02-19 下午1 07 13" src="https://github.com/user-attachments/assets/5d7d0ad0-0a08-4cdf-83cc-191be23db04d" />


### Scrum 會議

1. **Sprint 計畫（Sprint Planning）：** 用來規劃下一次的Sprint，決定 **Sprint 待辦清單（Sprint List）** 等工作。
2. **每日站會（Daily Scrum）：** 通常在每日開始工作前，團隊成員會討論前一日完成了什麼工作、是否有遇到問題、今日該處理什麼工作等，會議時間不超過**15分鐘**。
3. **Sprint 檢閱（Sprint Review）：** 向利害關係人及主管交付Sprint完成的成品。
4. **Sprint 回顧（Sprint Retrospective）：** 由小組成員參與，不建議主管參加，目的是讓小組成員討論此次Sprint有哪裡需要改進及優化。

## 結語

敏捷開發不只是一種方法，而是一種 **心態（Mindset）**，重點在於靈活應對變化、持續學習與優化。透過清晰的待辦事項、持續整合、自動化部署，以及控制技術債，你的團隊就能更高效地交付優質軟體。


## Reference

[Scrum in 20 mins... (with examples)](https://www.youtube.com/watch?v=SWDhGSZNF9M)

[ChatGPT](https://chatgpt.com/canvas/shared/67b2d92a093881919f2e9e5d83715aec)

[Microsoft](https://learn.microsoft.com/en-us/devops/plan/what-is-agile)

[Scrum vs Kanban | Differences & Similarities Between Scrum & Kanban | Invensis Learning](https://www.youtube.com/watch?v=pxxmSLJj8FQ)

[What is Agile UX? The Complete 2025 Guide](https://careerfoundry.com/blog/ux-design/what-is-agile-ux/)

[Where Does a UI/UX Designer Fit in Agile Methodology?](https://medium.com/@harinderuiuxsingh/where-does-a-ui-ux-designer-fit-in-agile-methodology-283a297a9d2c)

[Attributes of Effective Agile UX](https://www.youtube.com/watch?v=XLvx-hCmKPk)

[UX in Scrum](https://www.youtube.com/watch?v=BjIewxNTCMU&t=1s)

[Transforming the Way we Work- Scrum, Waterfall or just Go “Agile” – Part I](https://www.craftsilicon.com/transforming-the-way-we-work-scrum-waterfall-or-just-go-agile-part1/)
