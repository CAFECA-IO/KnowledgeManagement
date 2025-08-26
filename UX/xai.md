# 如何建立使用者對 AI 的信任

AI 已經慢慢融入我們的生活，演算法幫我們挑電影、AI 助理幫我們寫郵件、銀行用 AI 評估貸款風險等。可是，你有沒有想過：我們為什麼會「相信」或「不相信」一個 AI？

就像我們交朋友一樣，如果一個人常常說話前後不一、答非所問，或者讓你覺得在隱瞞什麼，你大概會覺得他很不可靠。AI 也是如此，「信任」是使用者願不願意採用（adoption）的關鍵。
在設計 AI 產品時，我們要想的不只是「它能不能用」，還要想「使用者敢不敢用」，信任只是一個感覺，而是可以被設計、被治理、被驗證的產品能力。


## 一、信任 =可理解＋可控＋可預期＋隱私安全

我們可以把 AI 信任拆成四個核心元素：
1. 可理解（Understandable）:  使用者不會信任他們無法理解的事物。AI 系統必須不僅做出決策，還要展示其運作過程。單純產出結果而無說明的系統感覺像黑盒子，會滋生懷疑而非信任。使用者越了解 AI 如何得出結論，就越願意依賴它。
2. 可控（Controllable） : 使用者保有覆核、修正、甚至停用 AI 的權力（Human-in-the-loop）。比如你到餐廳點菜，菜單上有一道大大的「主廚推薦」，但你也可以選擇不點而改點其他的菜，甚至沒看到想吃的也可直接離開餐廳。 
3. 可預期（Predictable） : 使用者較相信能提供穩定、可重複結果的系統。當 AI 模型產生不可預測或矛盾的輸出時，信心會迅速下降。可預期不只是技術精準度，還包括 AI 如何處理錯誤、如何傳達不確定性，並持續改進。
4. 隱私安全（Security and privacy）：對 AI 的信任不僅建立在性能上。使用者需要確信 AI 系統在保護他們的資料、負責運作且保持使用者掌控。安全性與隱私是獲得使用者信任的基礎。

這四個元素可以應用到三個層面：

* 介面設計 → 使用者看到什麼
* 模型解釋 → AI 內部如何運作可以怎麼樣被說明讓人看懂
* 組織治理 → 公司或組織內部的流程如何確保 AI 使用安全、可靠、持續可信

NIST(National Institute of Standards and Technology 美國國家標準與技術研究院） 的 AI 風險管理框架（AI RMF）也用 GOVERN：MAP → MEASURE → MANAGE 落實這個概念。

GOVERN（治理）
* 建立組織策略、角色責任、規範與流程。
* 目標：確保 AI 系統有明確的管理架構，誰負責什麼一目了然。

MAP（辨識與對齊）
* 辨識 AI 系統可能帶來的風險，並與企業目標和法規對齊。
* 目標：確定哪些風險需要被控管、哪些合規要求要滿足。

MEASURE（衡量）
* 用量化指標評估 AI 系統的性能、可靠性、偏差、風險。
* 目標：有數據可追蹤，知道系統是否符合預期、是否存在問題。

MANAGE（管理與改善）
* 根據衡量結果，制定改善行動、更新流程、修正模型或策略。
* 目標：形成持續循環，讓 AI 系統可以安全、可靠、合規地運作。

<img width="375" height="422" alt="RMF-redesign-rounded-other_graphics-04" src="https://github.com/user-attachments/assets/a68bae3e-11e3-4054-ac51-55ea84d32678" />



## 二、XAI(Explainable AI)

XAI 的目標就是讓 AI 的推理過程變得 更透明、更容易理解，讓人可以知道它是怎麼想的。

### 1. XAI 常見做法有：
* Ante-hoc（拉丁文：Before this）：目標是在模型訓練開始之前就提供可解釋性。規則清楚固定、決策透明，你直接可以看輸入怎麼影響輸出。如：決策樹（Decision Tree, DT）模型。這些模型通常也被稱為 白箱（White Box）或玻璃箱（Glass Box）模型。
* Post-hoc（拉丁文：After this）：意思是 模型訓練好之後，再想辦法來解釋它。利用幫黑箱模型（Blackbox Model）加上一個「代理人（Surrogate Model代理模型）」用來解釋它。就像是一個翻譯員，根據 AI 的輸入輸出，推測並解釋它可能是怎麼思考的。

![Explainable_Artificial_Intelligence_in_Alzheimers](https://github.com/user-attachments/assets/a45dd046-5684-4196-9858-f915b06c30df)

  
### 2. 解釋範圍（Explainability Scope）：Global vs Local
指的是 XAI 方法所產生解釋的覆蓋程度，分爲：
* Global：解釋整個模型，考慮模型的所有推理數據。提供一個整體視角，說明模型如何與所有輸入數據互動。常見的 決策樹（DT）演算法 本質上就是全域的。
* Local：只解釋某些特定的測試數據案例。幫助使用者理解「為什麼模型在這個案例做了這樣的決策」，進而增加對結果的信任。在決策樹的情況下，Local 就可以對應到樹中的某個單一路徑（branch）。

<img width="850" height="297" alt="Schematic-representation-of-XAI-methods-with-global-left-or-local-right-scopes ppm" src="https://github.com/user-attachments/assets/32acfef8-6760-4ef0-b398-b8d917678444" />

### 3. 讓解釋對人「有用」
* 對象分眾：設計時，要考慮不同使用者的需求，提供對他們有用的解釋。如高層決策者看策略邏輯；審計/監管看追溯性；一線員工看操作指引；開發者看除錯線索。
* 格式多樣：文字摘要、可視化、互動式 dashboard，避免一次丟太多技術細節。（Nielsen Norman Group 的研究也強調用語清晰與資訊分層的重要）

## 三、把「信任」做成 UI：8 個可套用設計樣式
1. AI 身分標示（AI label） 清楚標註「此為 AI 產出/建議」，保持對 AI 存在的透明認知（範例如 IBM Carbon for AI 指南）。
2. 信心/不確定性提示 不只給答案，還要顯示AI的信心區間、資料覆蓋度、或「低信心時建議替代行為」。避免用絕對語氣誤導。
3. 為什麼是這個答案（Why/Because） 用人話解釋 1–3 個主要理由，可展開細節；專業場景可同步提供 SHAP / LIME 等進階資料。
4. 可逆與覆核（Human-in-the-loop） 提供覆核、撤銷、標註錯誤按鈕，使用者回饋能持續優化系統。
5. 資料來源與範圍（Provenance） 提供資料來源、時間範圍與使用限制；生成內容標註 AI 生成來源。
6. 風險與限制告知（Known limitations） 提醒用戶AI存在風險與限制，例如醫療非診斷用途需專業人員確認。
7. 隱私與偏見說明（Privacy & Fairness cues） 清楚說明資料如何被使用、是否用於訓練、可關閉個人化、監測機制及最近審查日期。
8. 透明度文件連結（Transparency Note / Model Card） 透明度文件就像是 AI 的說明書 ，放在產品裡讓使用者和審計員都能看懂 AI 在做什麼。

## 四、把信任制度化：治理與合規
* NIST AI RMF（美國）：用 GOVERN→MAP→MEASURE→MANAGE四環，要求產品設計的全生命週期裡辨識、衡量並管理風險。是目前跨產業最常採用的實務指南之一。
* ISO/IEC 42001（國際標準）：全球首個 AI 管理系統標準，提供建立政策、風險管理、供應鏈控管與持續改進的框架，協助與各地監管接軌。
* EU AI Act（歐盟）：世界首個全面 AI 法規，依風險分級對高風險系統（如招募、教育、醫療等）施加透明與風險管理義務；2025 年起分階段生效，對高風險用例與一般用途模型提出透明度與合規要求。
* 大廠內規：Microsoft、IBM 等企業要求 Transparency Note、可靠性與審查節點，將解釋、透明、隱私、公平、健壯作為核心支柱。
重點：把要求內建進流程，而不是發佈前才補文件。

![6860fa59d0c89f06fbf4857e_67f8d7b163f0831c2a1afcbf_Image-2-1024x388](https://github.com/user-attachments/assets/a0942376-67b3-47e7-8562-c1a0428debaa)


## 五、文件化透明：讓審計與溝通變容易
### Model Cards：說明 AI 模型本身：它的用途、在哪些族群上表現好或不好、限制、評估方法。
<img width="545" height="326" alt="model-card-example-machine-learning" src="https://github.com/user-attachments/assets/4864f0a6-1b00-494c-99d8-c34a3255d1a4" />

### Datasheets for Datasets：說明 AI 訓練用的資料來源、如何採樣、清理方式、限制、版權等。
![datasheets-for-datasets_blog-en](https://github.com/user-attachments/assets/ba09309d-2f2e-46ab-a467-c976cebadb9b)


### Transparency Notes：向使用者說明產品層面的 AI 功能：AI 在這個產品能做什麼、不能做什麼，使用限制或注意事項。
<img width="540" height="540" alt="image2-12" src="https://github.com/user-attachments/assets/02d4645b-621d-46cb-8279-a3aeb03d44fd" />


### UX 的應用：
* 這些文件不只是給審計用的，還可以 轉譯成介面上的透明提示，例如：
    * AI 產出的建議旁加小標籤：「此建議基於過去 3 年的銷售資料」
    * 顯示 AI 信心分數或適用範圍
    * 提供「為什麼 AI 做出這個決策」的可點擊說明
換句話說，「文件透明」→「介面透明」，使用者可以更直觀地理解 AI，提高信任度。

![Confidence-in-Models-2-768x499](https://github.com/user-attachments/assets/bd17ca52-2486-4f0c-98cf-305cfcf14825)


## 六、量化「信任」：KPI 與儀表板建議
* 行為面：採用率、覆核率、覆寫率、完成率、決策時間。
* 品質面：準確度、召回率、校準誤差、漂移偵測率、資安事件數。
* 公平性：不同群體錯誤差異、拒絕率差異。
* 治理面：文件更新頻率、事故通報與修復時間、稽核通過率。
建立信任Dashboard，定期在產品評審與風險委員會檢視，符合 NIST/ISO 的 MEASURE→MANAGE 精神。



## 結語
信任是一種可交付的產品能力：以人為中心的解釋、誠實的不確定性、可被驗證的治理。 當你把 UI 設計（看得見）× XAI（說得清）× 治理（做得到） 串起來，AI 就能在「被理解、被掌控、可預期」的前提下，真正擴大價值。

