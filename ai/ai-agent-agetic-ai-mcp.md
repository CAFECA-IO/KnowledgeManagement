- [探討 AI Agent、Agentic AI 與 MCP](#探討-ai-agentagentic-ai-與-mcp)
  - [前言](#前言)
  - [AI Agent 的基本概念與理論基礎](#ai-agent-的基本概念與理論基礎)
  - [Agentic AI 的進階意涵](#agentic-ai-的進階意涵)
  - [AI Agent vs Agentic AI 比較](#ai-agent-vs-agentic-ai-比較)
  - [Agentic AI 系統模式](#agentic-ai-系統模式)
    - [**基礎建構：擴增的語言模型 (Augmented LLM)**](#基礎建構擴增的語言模型-augmented-llm)
    - [**工作流程：提示鏈 (Prompt Chaining)**](#工作流程提示鏈-prompt-chaining)
    - [**工作流程：路由 (Routing)**](#工作流程路由-routing)
    - [**工作流程：並行化 (Parallelization)**](#工作流程並行化-parallelization)
    - [**工作流程：協調者-工作者 (Orchestrator-Workers)**](#工作流程協調者-工作者-orchestrator-workers)
    - [**工作流程：評估者-優化器 (Evaluator-Optimizer)**](#工作流程評估者-優化器-evaluator-optimizer)
    - [對於複雜的搜尋任務比較表格](#對於複雜的搜尋任務比較表格)
  - [MCP（Model Context Protocol）的緣起與核心精神](#mcpmodel-context-protocol的緣起與核心精神)
    - [典型應用範例](#典型應用範例)
  - [三者的互動與技術結合](#三者的互動與技術結合)
  - [建立 Agentic 系統可用的框架](#建立-agentic-系統可用的框架)
  - [何時以及何時不使用 Agentic AI](#何時以及何時不使用-agentic-ai)
  - [未來發展方向與研究挑戰](#未來發展方向與研究挑戰)
  - [面向工程師的未來啟示](#面向工程師的未來啟示)
  - [Key Takeaways](#key-takeaways)
  - [Ref](#ref)

# 探討 AI Agent、Agentic AI 與 MCP

## 前言

當前人工智慧技術突飛猛進，與之同時蓬勃的概念也愈來愈多。在各種新創名詞中，AI Agent、Agentic AI 與 MCP (Model Context Protocol) 的討論度特別高。這三者並非僅是三個零散的關鍵字，而是彼此相輔相成，使得 AI 在複雜任務中能更靈活地與外部環境互動。本篇文章將探討 AI Agent 與 Agentic AI 的理念與差異，再進一步討論標準化協定 MCP 如何融入、加強 AI 與外部工具串接的可能。

## AI Agent 的基本概念與理論基礎

AI Agent 是指能在一定規範及環境中，依據所接收資訊做出決策並執行特定任務的人工智慧實體。它們的自主性通常由設計者決定，側重於在可預期範圍內執行精準、可控、重複性的工作。例如客服聊天機器人便是一種相對單純的 Agent：面對使用者的問題，Agent 從已有知識庫或內建規則中尋找最佳回應，以快速且一致的方式解決常見疑問。

在理論層面，AI Agent 可以視為基本的感知—決策—執行流程：它先感知外部輸入（例如使用者詢問、環境狀態），然後依照某種預先訓練好的策略或規則做出反應，最後將回應（包含文字、控制指令或其他工具調用）送回外部系統。這樣的執行模式在許多單一工作場合能達到高效率，並提供可預測的結果。

- AI Agent 的效果類似 n8n, make 等自動化工作流程平台，由人類規定好不同條件下的不同處理方式，AI 遵循流程去執行任務

- 下圖為透過 AI 分析 GitHub PR 是否有安全性漏洞的自動化流程(ref: [n8n](https://n8n.io/))

![image](https://github.com/user-attachments/assets/24cc3895-efbb-49fa-9ad8-c6cf75cce2d4)
(圖片來源: [Anthropic](https://www.anthropic.com/engineering/building-effective-agents) )

## Agentic AI 的進階意涵

雖然 AI Agent 著重在完成明確範疇的任務，但 Agentic AI 則更強調「自主性」與「自我決策」的能力。Agentic AI 倚賴模型的「看、想、做」能力循環：它能對環境有更完整的觀察，嘗試不同路徑並根據實際成果做迭代調整。若 AI Agent 主要是一個待命的執行者，Agentic AI 更像是一位主動規劃的探索者。

在實踐層面，Agentic AI 也往往結合了多次迭代、平行工作與工具呼叫機制：例如當執行一個程式碼生成任務或文檔翻譯工作時，Agentic AI 可能根據不同片段的內容，同時分配多個子代理平行處理，最後再將各子結果整合成最終版本。或是在面對複雜問題時，它能擬定出一套可調整的計劃策略，並透過多輪嘗試優化結果。這種流程在有限度的情境中可與人類的解題思維頗為相似，也成為目前各種更「自律」的 AI 系統的基礎。

![image](https://github.com/user-attachments/assets/8d5118d7-4df0-4e57-8ff0-e25a8912f475)
(圖片來源: [Anthropic](https://www.anthropic.com/engineering/building-effective-agents) )

## AI Agent vs Agentic AI 比較

| 面向 (Aspect)                          | AI Agent                                                                                       | Agentic AI                                                                                                 |
| -------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **自主性 (Autonomy)**                  | \*\*低 (Low)\*\*：在定義的界限內執行特定任務，需要明確的指令。                                 | \*\*高 (High)\*\*：能夠自主規劃、決策並執行複雜、多步驟任務，無需持續人工幹預。                            |
| **決策制定 (Decision-Making)**         | \*\*基於規則 (Rule-Based)\*\*：遵循預先編程的規則或決策樹，行為可預測且一致。                  | \*\*進階 (Advanced)\*\*：使用複雜的推理和預測模型來評估多個變數並預測未來狀況。                            |
| **學習能力 (Learning)**                | \*\*有限 (Limited)\*\*：雖然有些代理可能使用機器學習來改進性能，但學習範圍通常僅限於指定任務。 | \*\*持續 (Continuous)\*\*：透過強化學習等機制，不斷改進其性能並適應新的挑戰。                              |
| **任務複雜度 (Task Complexity)**       | \*\*特定任務 (Task-Specific)\*\*：擅長執行狹隘且集中的功能。                                   | \*\*複雜任務管理 (Complex Task Management)\*\*：可以管理涉及協調多個任務和整合來自不同來源資料的工作流程。 |
| **操作方式 (Operation)**               | \*\*被動 (Passive)\*\*：通常根據明確的輸入執行操作。                                           | \*\*主動 (Proactive)\*\*：主動追求長期目標，根據對環境的整體理解做出決策。                                 |
| **實際應用 (Real-World Applications)** | 任務單純的系統如：簡易客戶服務聊天機器人、排程助理、資料處理工具、郵件管理、程式碼建議。       | 任務複雜的系統如：自動駕駛汽車、金融交易系統、醫療診斷、供應鏈管理。                                       |

## Agentic AI 系統模式

以 [Anthropic](https://www.anthropic.com/engineering/building-effective-agents) 觀點為主

### **基礎建構：擴增的語言模型 (Augmented LLM)**

- Agentic 系統的基本建構區塊是 **透過檢索 (retrieval)、工具 (tools) 和記憶體 (memory) 等方式進行擴增的語言模型**.

- 例如產生自己的搜尋查詢、選擇合適的工具以及決定要保留哪些資訊.

- 用途是降低 LLM 產生 Hallucinations 的機會，提升 LLM 的可靠性

![image 2](https://github.com/user-attachments/assets/9e4f26cb-721e-4303-b7f5-271f3a1fe549)
(圖片來源: [Anthropic](https://www.anthropic.com/engineering/building-effective-agents) )

### **工作流程：提示鏈 (Prompt Chaining)**

- 提示鏈將任務分解為一系列步驟，每個語言模型的呼叫都會處理前一個呼叫的輸出.

- 可以在任何中間步驟加入程式化的檢查 ("gate")，以確保流程仍在軌道上.

- **適用情境：** 任務可以簡單且清楚地分解為固定的子任務，主要目標是透過使每個語言模型的呼叫更簡單來提高準確性.

- **範例：** 生成行銷文案，然後將其翻譯成不同的語言；撰寫文件大綱，檢查大綱是否符合特定標準，然後根據大綱撰寫文件.

![image 3](https://github.com/user-attachments/assets/137edeb2-40ee-4dcd-b9c0-8e328867c873)
(圖片來源: [Anthropic](https://www.anthropic.com/engineering/building-effective-agents) )

### **工作流程：路由 (Routing)**

- 路由會對輸入進行分類，並將其導向特定的後續任務.

- 這種工作流程可以分離關注點，並建立更專業的提示.

- **適用情境：** 複雜任務中存在可以更好地區分處理的不同類別，並且可以準確地處理分類的情況.

- **範例：** 將不同類型的客戶服務查詢（一般問題、退款請求、技術支援）導向不同的下游流程、提示和工具；將簡單/常見的問題導向較小的模型，將困難/不常見的問題導向更強大的模型，以優化成本和速度.

![image 4](https://github.com/user-attachments/assets/be88a099-1976-4be0-8e92-a363ceac67aa)
(圖片來源: [Anthropic](https://www.anthropic.com/engineering/building-effective-agents) )

### **工作流程：並行化 (Parallelization)**

- **讓大型語言模型 (LLM) 同時處理一個任務的不同部分，或者多次執行相同的任務以獲得不同的結果，然後再將這些結果以程式化的方式匯總**

- 並行化有兩種主要變體：

  - \*\*分區 (Sectioning)\*\*：將任務分解為獨立的子任務並行運行.

  - \*\*投票 (Voting)\*\*：多次運行相同的任務以獲得不同的輸出.

- **適用情境：** 當可以並行處理子任務以提高速度，或者需要多個視角或嘗試以獲得更高信心的結果時有效.

- **範例：**

  - 想像一個 AI 系統需要處理使用者的查詢並給出回應，同時也要確保使用者的查詢不包含不適當的內容。

  - **分區**

    - 一個模型實例處理使用者查詢

    - 另一個模型實例檢查不當內容或請求

    - 自動化評估語言模型性能，每個語言模型呼叫評估模型在給定提示下的不同方面.

  - **投票**

    - 評估內容是否不恰當

    - 判斷一段內容是否不恰當可能涉及多個考量因素（例如，是否包含仇恨言論、暴力內容等）。

    - 可以使用**多個不同的提示詞並行地評估同一段內容**，每個提示詞都針對一個特定的不當內容類別。

    - 可以設定不同的「投票門檻」，例如，只有當至少兩個提示詞都認為內容不當時，才將其標記為不當內容，從而平衡誤判和漏判的風險。

    - 作用類似多個人從不同角度檢查同一份文件。

![image 5](https://github.com/user-attachments/assets/0b95e868-6446-422b-8f42-f0b6fbd2581b)
(圖片來源: [Anthropic](https://www.anthropic.com/engineering/building-effective-agents) )

### **工作流程：協調者-工作者 (Orchestrator-Workers)**

- **Orchestrator (協調者)**：這是一個**中央的大型語言模型 (LLM)**，它的任務是**動態地分解複雜的任務**，判斷需要哪些子任務才能完成整個目標。

- **Workers (工作者)**：這些是**執行實際子任務的 LLM**。Orchestrator 會將分解出來的子任務**委派給一個或多個 Worker 來處理**。

- Worker 完成子任務後，將結果回傳給 Orchestrator。然後，Orchestrator 會**整合這些結果**，並根據需要決定下一步的行動，這可能包括委派更多子任務或完成整個原始任務。

- 這個工作流程的關鍵在 **Orchestrator 的動態決策能力**

- 與「並行化 (Parallelization)」不同的是，在 Orchestrator-Workers 模式中，**子任務不是預先定義好的，而是由 Orchestrator 根據具體的輸入和當前的進度來動態決定的**

- **Search tasks that involve gathering and analyzing information from multiple sources for possible relevant information (需要從多個來源收集和分析資訊以找到相關內容的搜尋任務)**

  - 在這個情境中，**Orchestrator LLM** 接收到一個複雜的搜尋請求（例如，關於某個特定主題的全面分析）。

  - Orchestrator 會**規劃搜尋策略**，判斷需要查詢哪些不同的資訊來源（例如，不同的網站、資料庫等），以及需要使用哪些關鍵字或查詢語句。這些需要查詢的來源和具體的查詢方式很可能**無法在事先完全確定**，而是根據初步的搜尋結果動態調整。

  - Orchestrator 會將**針對每個資訊來源的具體搜尋和初步分析任務**委派給不同的 **Worker LLM**。每個 Worker 負責查詢一個或幾個相關的來源，並提取相關的資訊。

  - 每個 Worker 將其找到的資訊回傳給 Orchestrator。

  - **Orchestrator 會整合來自不同 Worker 的資訊**，進行更深入的分析和總結，最終產生對原始搜尋請求的全面回應。

- **適用情境：** 適用於無法預測所需子任務的複雜任務.

![image 6](https://github.com/user-attachments/assets/13d66b71-c91d-4ae1-ab03-1af9c9fd2c20)
(圖片來源: [Anthropic](https://www.anthropic.com/engineering/building-effective-agents) )

### **工作流程：評估者-優化器 (Evaluator-Optimizer)**

- 在評估者-優化器工作流程中，一個語言模型呼叫產生回應，而另一個則在迴圈中提供評估和回饋.

- **Evaluator (評估者)**：這是一個**大型語言模型 (LLM)**，任務是**評估另一個 LLM (Optimizer) 產生的回應**，並提供**回饋意見**。評估的標準通常是基於預先設定的明確**評估標準**。

- **Optimizer (優化者)**：這也是一個 **LLM**，它的任務是**生成對某個任務或問題的回應**。然後，這個回應會被 Evaluator 評估，Optimizer 會**根據 Evaluator 的回饋意見來改進其回應**。

- 這個工作流程的**核心是迭代過程**。Optimizer 生成一個初始回應，Evaluator 提供回饋，然後 Optimizer 根據這些回饋再次嘗試生成一個更優化的回應。這個過程可能會重複多次，直到達到滿意的結果或滿足停止條件。

- **適用情境**

  - 當我們有**明確的評估標準**時。

  - 當**迭代改進能帶來可衡量的價值**時。

  - 當 **LLM 的回應在人類提供回饋後可以明顯改善**時。

  - 當 **LLM 本身也能夠提供有用的回饋意見**時。

- **範例：** 文學翻譯，翻譯語言模型最初可能無法捕捉到細微差別，但評估語言模型可以提供有用的評論；需要多輪搜尋和分析以收集全面資訊的複雜搜尋任務，評估者決定是否需要進一步搜尋.

- **Complex search tasks that require multiple rounds of searching and analysis to gather comprehensive information, where the evaluator decides whether further searches are warranted (需要多輪搜尋和分析才能收集全面資訊的複雜搜尋任務，評估者決定是否需要進一步搜尋)**

  - 在這個情境中，**Optimizer LLM** 的任務是**回答一個需要深入研究的複雜問題**，可能需要從多個來源收集和分析資訊。

  - Optimizer 可能會進行初步的搜尋，並基於找到的資訊生成一個初步的回應。然而，這個回應可能不夠全面或深入。

  - 這時，**Evaluator LLM** 會**評估 Optimizer 的初步回應**，判斷其是否充分回答了問題，是否涵蓋了所有重要的方面，以及是否需要進一步的資訊。

  - Evaluator 會**提供回饋**，指出哪些方面需要更深入的研究，或者建議需要查詢哪些額外的資訊來源。**Evaluator 的一個關鍵職責是判斷是否需要進行更多的搜尋輪次**。

  - **Optimizer LLM** 接收到這些回饋後，會**根據 Evaluator 的建議進行進一步的搜尋和分析**，以完善其回應。這個迭代過程會持續進行，直到 Evaluator 認為已經收集到足夠的資訊，問題得到了充分的回答。

![image 7](https://github.com/user-attachments/assets/3c381ed3-2e21-43b9-b256-fab3dfae645c)
(圖片來源: [Anthropic](https://www.anthropic.com/engineering/building-effective-agents) )

### 對於複雜的搜尋任務比較表格

| 特點         | Orchestrator-Workers                                                   | Evaluator-Optimizer                                                  |
| ------------ | ---------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **核心策略** | **並行地從多個來源獲取和整合資訊**                                     | **透過迭代評估和優化逐步完善搜尋結果**                               |
| **任務分解** | **由 Orchestrator 動態分解為針對不同來源的子任務**                     | **Optimizer 負責執行初步搜尋，Evaluator 負責判斷是否需要進一步搜尋** |
| **資訊整合** | **Orchestrator 負責整合來自不同 Worker 的資訊**                        | **Optimizer 在每輪迭代中整合新資訊**                                 |
| **迭代性**   | 較少強調迭代，更側重於一次性的並行獲取                                 | **核心是迭代過程，透過評估和反饋不斷改進**                           |
| **適用情境** | 需要從多個不同來源收集資訊的複雜查詢，注重廣度和效率                   | 需要深入研究和分析，逐步完善答案的複雜查詢，注重深度和準確性         |
| **潛在效果** | 可能更快速地覆蓋多個資訊來源，但整合品質可能取決於 Orchestrator 的能力 | 可能更深入地探索問題，但可能需要更多輪次的迭代才能得到最終結果       |

總結來說，「Orchestrator-Workers」更像是組織一個團隊（Workers）同時去不同的地方尋找資訊，然後由領導者（Orchestrator）將大家找到的拼湊起來。「Evaluator-Optimizer」則更像是一個研究員（Optimizer）先做一些初步研究，然後請一位嚴厲的審稿人（Evaluator）指出不足之處，再根據審稿意見繼續深入研究。選擇哪種工作流程取決於具體的搜尋任務需求，例如是更看重覆蓋的廣度還是分析的深度。

## MCP（Model Context Protocol）的緣起與核心精神

- MCP 規格可參考[ Model Context Protocol spec](https://spec.modelcontextprotocol.io/specification/2024-11-05/)

當 AI 的行為開始涉及外部世界——例如讀取網路資料、對接各種信息服務、透過 API 進行跨平台操作——就需要更加明確且標準化的介面，才能使這些 Autonomous Agent 順暢呼叫並整合外界資源。MCP（Model Context Protocol）正是為此而提出。

MCP 的目標在於定義一套通用協定，確保「任何模型都能夠透過通用接頭去呼叫外部工具或資源」。從角度上看，MCP 與傳統的函式呼叫（function calling）模式有類似之處：都需要事先定義一個標準的函式介面、參數與回傳訊息格式。但 MCP 希望能更進一步統一定義與涵蓋範圍，使模型開發者不必在不同應用之間重複撰寫各式 API 對接程式，同時也讓 AI Agent 或 Agentic AI 能夠更迅速地引用各廠商或開發者提供的多樣功能，像是呼叫雲端計算服務、讀取特定資料庫或發送 GitHub Pull Request 等等。

MCP 跟 function calling 的差別在於跟 Type-C 跟 Apple 裝置的 Lightning 接頭是一樣的，統一標準可以促進開發的效率、降低 AI 調用工具的麻煩。

### 典型應用範例

在客戶服務聊天機器人中，Agentic AI 會先辨別使用者意圖，再透過 MCP 連線至後端 CRM 或庫存系統，取回客戶訂單歷史或庫存資訊，並自動處理退款或查詢訂單狀態。這種應用能大幅縮短客服人員的反應時間，提高客戶滿意度。

在程式碼自動化領域，Agentic AI 可以一次處理多檔案修改，並根據單元測試結果或碼規檢查結果自動修正程式。若開發者希望將完成的修訂直接上傳至存放庫，就能透過 MCP 讓系統自動發起 GitHub Pull Request，減少工程師在多道程序間手動操作的繁瑣度。

## 三者的互動與技術結合

AI Agent、Agentic AI 與 MCP 三者的結合關鍵在於「可擴充」與「可標準化」的互動方式。在基礎層次上，AI Agent 透過 MCP 可以直接串接外部工具執行任務，這是最簡單的應用場景；而當 Agentic AI 更進階地需要多輪推理、自由判斷要使用哪些工具、討論如何一步步完成任務時，MCP 就是一座好用的橋樑。

在不同場景下，可以同時運用這三者的應用範圍：

第一，傳統的 AI Agent，若是需要呼叫大型外部工具並確保可插拔和可維護性時，也可參考 MCP 統一介面。

第二，若想打造更具有自主決策能力與迭代能力的 Agentic AI，則 MCP 能大幅減少與外部 API 溝通的複雜度，使得 Agentic AI 能夠便利地擴張可支援的功能範圍。

## 建立 Agentic 系統可用的框架

- [OpenAI Agents SDK](https://github.com/openai/openai-agents-python)

- [LangGraph](https://langchain-ai.github.io/langgraph/) from LangChain;

- Amazon Bedrock's [AI Agent framework](https://aws.amazon.com/bedrock/agents/);

- [Rivet](https://rivet.ironcladapp.com/), a drag and drop GUI LLM workflow builder; and

- [Vellum](https://www.vellum.ai/), another GUI tool for building and testing complex workflows.

## 何時以及何時不使用 Agentic AI

**什麼時候應該使用 Agentic AI**

- **處理複雜的、無法預先定義步驟的開放式問題**。當任務需要的步驟數量和具體操作無法硬編碼時，Agentic AI 能夠**動態地規劃解決方案**。例如，解決需要編輯多個檔案的複雜軟體工程任務。

- **需要高度的自主性和決策能力的環境**。在需要根據**對環境的整體理解**做出決策，而不是僅對立即輸入做出反應的場景中，Agentic AI 更具優勢。例如，**自動駕駛汽車**需要根據不斷變化的交通狀況自主導航和決策。

- **需要持續學習和適應新挑戰的任務**。Agentic AI 透過**強化學習**等機制不斷改進其性能，並能適應新的情況。例如，**金融交易系統**需要根據不斷變化的市場波動調整交易策略。

- **管理涉及協調多個任務和整合來自不同來源數據的工作流程**。Agentic AI 可以**協調多個專門的 AI 代理**來完成企業級的複雜操作，例如**供應鏈管理或整合的 IT 支援**。

- **需要處理大量數據並進行複雜推理的應用**。例如，在**醫療診斷**中，Agentic AI 可以綜合分析患者數據、監測生命體徵並提出個人化的治療方案。在**網路安全**領域，Agentic AI 可以分析網路活動，自動偵測和回應潛在的威脅。

- **需要工具使用的場景，並且 AI 需要自主決定何時以及如何使用這些工具來完成任務**。例如，一個 AI 稅務助理需要能夠自主查詢最新的稅法更新、分析財務報表並生成報告。OpenAI 的 Agents SDK 就是為了構建這種**自主的、使用工具的 AI 代理**而設計的。

- **當需要透過迭代和反饋來逐步完善解決方案的場景**，例如「Evaluator-Optimizer」工作流程應用於複雜的搜尋任務。

**什麼時候不應該使用 Agentic AI**

儘管 Agentic AI 功能強大，但在某些情況下，使用它可能不是最佳選擇，或者應該謹慎考慮：

- **對於定義明確、重複性高的簡單任務**。**AI 代理**（AI Agents）更適合處理這些任務，因為它們基於預編程規則或機器學習模型，具有更高的**精確性和可靠性**，且成本和複雜性可能更低。例如，處理常見問題的**客服聊天機器人**、排程助理或自動化處理 HR 請假請求等。

- **當需要高度可預測和一致性的行為時**。由於 Agentic AI 的自主決策能力，其行為可能不如基於規則的 AI 代理那樣容易預測。對於需要**嚴格按照預定流程執行**的任務，AI 代理可能更合適。

- **當對延遲和成本敏感的應用**。Agentic AI 系統通常比單純的 LLM 調用或更簡單的工作流程具有更高的**延遲和成本**，因為它們可能涉及多個步驟、工具調用和複雜的推理過程。在這些情況下，優化單個 LLM 調用或使用更簡單的工作流程可能更有效。

- **當任務不需要複雜的決策或自主性時**。例如，語音助手設定提醒或播放音樂等簡單指令，使用 AI 代理即可。

- **在對系統的透明度和可解釋性要求極高的場景**。Agentic AI 的自主決策過程可能更難以追蹤和解釋，這在某些敏感領域（如醫療或法律）可能是一個重要的考量因素。建議在實施代理時優先考慮**透明度**，明確展示代理的規劃步驟。

- **在沒有完善的基礎設施、數據整合和持續監控能力的環境中**。實施 Agentic AI 需要**強大的技術支持**和對系統的持續管理。

- **在沒有充分考慮倫理和安全問題的情況下**。自主決策系統引發了關於責任歸屬、數據隱私和潛在偏見等問題，需要仔細評估和設置適當的**安全護欄**和**人類監督**機制。

- **在可以透過更簡單的 LLM 增強技術（如檢索和上下文學習）解決問題的情況下**。建議**從最簡單的解決方案開始**，只有在更簡單的方法不足時才增加複雜性，例如引入多步驟的 Agentic 系統。

總之，使用 Agentic AI 的關鍵在於**任務的複雜性、對自主性和決策能力的需求、以及對系統成本、延遲、可預測性和可解釋性的考量**。對於需要靈活性、學習能力和處理複雜、開放式問題的場景，Agentic AI 提供了強大的能力。然而，對於簡單、重複、需要高度可控和低成本的任務，AI 代理或更簡單的 AI 工作流程可能更為合適。在選擇使用 Agentic AI 時，務必仔細評估其帶來的機會和挑戰，並確保有適當的監管和安全措施。

## 未來發展方向與研究挑戰

當前 Agentic AI 與 MCP 在工程上已展現出巨大潛力，但仍有數個技術與倫理挑戰。首先，Agentic AI 愈是自主就愈需關注安全性與可控性：如果 Agent 具有足以讀寫關鍵資料或推送程式碼的權限，便必須設定明確的防護機制與測試沙盒，以降低錯誤或惡意行為的風險。再者，業界對 MCP 標準是否能成為真正普及的通用規範也值得觀察，若不同廠商或組織各自定義私有版 MCP，可能破壞其跨平台的初衷。

另一方面，當 Agentic AI 在企業內應用愈趨廣泛，如何分配人類與 AI 的權責，乃至於規範最終決策的歸屬，都將牽涉到法律與社會討論。對於負責開發的工程師而言，除了純技術層面的突破，也應隨時留意後續對資料隱私、資訊公平以及倫理風險等議題的影響。

## 面向工程師的未來啟示

從 AI Agent 進化到 Agentic AI，再到 MCP 所帶來的跨工具、跨平台標準化衝擊，我們看見 AI 技術從單純的「受控執行者」，逐步轉化成能主動「探索與計劃」的系統。對工程師來說，這既是技術的跨越，更是思維上的挑戰：要打造出真正穩健、可廣泛複用的智能代理系統，不只要在 LLM 模型上深耕，更要同步思考如何設計保護機制、測試方法，以及符合標準的工具介面。

未來隨著 MCP 逐漸落地，Agentic AI 將能在更廣闊的外部資源與服務中相互串接，帶來更具彈性與擴充性的工作流程，也將引領更多行業加速數位轉型。然而，面對技術爆炸式的發展，務實、可控、安全與倫理，相信會成為每位工程師在開發這些新世代 AI 系統時所必須持續關注的重點。

## Key Takeaways

- **AI 代理 (AI Agents) 是專門設計用於在限定範圍內執行特定任務的軟體程式**。它們透過感知環境、處理資訊並執行動作來達成設定的目標。AI 代理通常基於規則或機器學習模型運作，擅長處理重複性、定義明確的任務，例如客服聊天機器人、排程助理和數據處理工具。它們的學習範圍通常僅限於其指定任務。

- **Agentic AI 代表了人工智慧的下一個進化階段，指的是能夠在沒有持續人工幹預的情況下，自主地規劃、決策和執行複雜、多步驟任務的系統**。Agentic AI 系統不僅能對即時輸入做出反應，還能主動追求長期目標，並透過經驗學習和即時適應.

- **AI 代理和 Agentic AI 的關鍵差異在於自主性、決策制定和學習能力**。AI 代理最適合可靠、重複性的功能，而 Agentic AI 則專為需要彈性、學習和自主決策的環境而設計.

- **使用 Agentic AI 的機會包括提高生產力、降低成本和促進創新**。然而，挑戰包括整合複雜性、倫理和安全問題以及保持人為監督.

- 在構建 Agentic 系統時，應從**簡單的可組合模式**開始，並強調**簡單性、透明度和精心設計的代理電腦介面 (Agenct-Computer Interface, ACI)**. 只有在更簡單的解決方案不足時才增加複雜性.

- **Model Context Protocol (MCP) 是一種協議，旨在使 AI 模型能夠輕鬆地連接到外部數據和工具**。它提供了一個標準化的介面，類似於 Type-C，使得 AI 應用程式可以更容易地與不同的模型和外部資源進行交互，而無需為每個模型重新定義函式呼叫.

- **何時應該使用 Agentic AI：** 當需要處理複雜的、無法預先定義步驟的開放式問題；需要高度的自主性和決策能力；需要持續學習和適應；管理涉及協調多個任務和整合不同來源數據的工作流程；需要處理大量數據並進行複雜推理；需要 AI 自主決定何時以及如何使用工具；以及需要透過迭代和反饋來逐步完善解決方案時

- **何時不應該使用 Agentic AI：** 對於定義明確、重複性高的簡單任務；當需要高度可預測和一致性的行為時；當對延遲和成本敏感；當任務不需要複雜的決策或自主性；在對透明度和可解釋性要求極高的場景；在沒有完善的基礎設施和持續監控能力；在沒有充分考慮倫理和安全問題；以及當可以透過更簡單的 LLM 增強技術解決問題時

## Ref

- [Antropic - agentic ai](https://www.anthropic.com/engineering/building-effective-agents)

- [Model Context Protocol doc](https://modelcontextprotocol.io/introduction)

- [fastmcp - Pythonic way to build Model Context Protocol servers ](https://github.com/jlowin/fastmcp)

- <https://medium.com/@elisowski/ai-agents-vs-agentic-ai-whats-the-difference-and-why-does-it-matter-03159ee8c2b4>

- <https://www.anthropic.com/news/model-context-protocol>

- [ai agent vs agentic ai](https://www.linkedin.com/pulse/understanding-agentic-ai-vs-agents-anshuman-jha-zpsgc/)

- [OpenTools | The API for LLM tool use](https://opentools.com)
