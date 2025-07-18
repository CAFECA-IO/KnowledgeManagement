## 資訊設計的分寸感：為什麼不是告訴使用者越多越好？

在產品設計中，我們常常聽到一句話：「這裡要不要加點說明，這樣比較清楚。」但事實上，資訊如果給得太多、太早，反而會造成使用者的負擔，甚至造成操作錯誤。

真正優秀的設計，懂得掌握「資訊的分寸感」：不是不說，而是**在對的時機、對的地方、用對的方式給出剛剛好的資訊**。

以下介紹幾種常見的 UX 設計方法，這些方法已被許多大型產品實踐多年，能有效提升產品易用性與使用者的信心。

---

###  1. Contextual Help（情境提示）

這種方法的核心概念是在「需要的時候提供資訊」，避免一開始就把所有說明擺在眼前。這不僅讓介面更簡潔，也減少使用者的認知負擔。情境提示的概念可追溯到早期的軟體教學設計，例如 Clippy（微軟 Word 小幫手）就是一種早期嘗試。雖然它不受歡迎，但卻是情境提示設計演進的起點。
常見的呈現方式包含：

#### 🧩 Tooltips（工具提示）  
滑鼠移到按鈕或欄位上，浮出一段簡短說明。適合簡單補充資訊，不打擾使用流程。  
📍**範例：Figma 工具列提示**  
當滑鼠移到 Icon 上時，會顯示「Move Tool (V)」、「Scale Tool (K)」等簡短說明。

<img width="551" alt="截圖 2025-05-13 下午1 40 48" src="https://github.com/user-attachments/assets/d27f9463-2516-45ef-a7a9-b2bc05472303" />


#### 🧩 Overlays（浮層提示）  
遮罩背景、強調局部功能區塊，常用於新功能導覽或強調變更內容。  
📍**範例：Notion 新功能公告**  
釋出新功能時，進入頁面會出現浮層，說明更新內容並提示「Got it」或「Try it out」按鈕。

<img width="1473" alt="Notion_modal_feature_announce_571bde574f" src="https://github.com/user-attachments/assets/09e3d7ad-9b26-4022-b7e4-bec66b968c32" />


#### 🧩 Embedded Help（內嵌說明）  
將說明內容內嵌在界面中，使用者不需跳出畫面即可查看。  
📍**範例：Slack 設定頁面說明文字**  
每個選項下方都有簡短說明文字，直接寫在設定區塊內。

<img width="802" alt="截圖 2025-05-13 下午1 59 31" src="https://github.com/user-attachments/assets/9417b0d7-c0d8-4a99-8e10-50dc06d53ace" />


👉 **說明：** Contextual Help 的每種型態都各有所長，這就是情境提示，不打擾、不中斷，卻能在需要的當下提供幫助。

---

###  2. Progressive Disclosure（漸進式揭露）

Progressive Disclosure 是 HCI（人機互動）領域中的經典設計原則，早期由 Apple 在 Mac OS 介面中使用：只顯示使用者需要的資訊，其餘隱藏起來，直到他們主動要求更多。這個設計技巧讓產品同時滿足新手與進階使用者，是資訊層級規劃的核心方法。

📍**範例：Figma**
剛開啟新文件時只看到基本工具列，要使用進階 prototyping 或 developer mode 等其餘進階功能，要點開特定功能區才會顯示。

<img width="1439" alt="截圖 2025-05-13 下午2 05 38" src="https://github.com/user-attachments/assets/313bba93-bc65-4ca8-b9c4-9bbf0b15556a" />

👉 **說明：** 漸進式揭露能幫助使用者先專注於基本操作，降低學習曲線。

---

###  3. Inline Guidance（欄內即時提示）

欄位內提示是最直接有效的即時反饋設計，尤其在表單中至關重要。這種做法興起於 Web 2.0 時期，當 AJAX 技術讓頁面可以即時互動，不再需要重新整理頁面才能驗證輸入內容。如今它已經成為所有現代系統的標配功能之一。

📍**範例：Google Ads 註冊表單**  
當使用者輸入錯誤網址格式時，欄位下即時出現紅字：「請輸入有效網址（例：`https://example.com`）」。

<img width="652" alt="截圖 2025-05-13 下午2 02 49" src="https://github.com/user-attachments/assets/f49d77db-469e-4522-9727-6eab849f4581" />

👉 **說明：** 用最即時的方式協助使用者完成任務，比事後報錯更有效也更友善。

---

###  4. Microcopy（微文案）

微文案這個詞最早由 UX Writer Erin Kissane 提出，用來描述介面中那些看似不起眼的小文字：按鈕、提示、錯誤訊息… 但它們其實是 UX 中極具力量的元素。好的微文案不只說明操作，更能傳達品牌語氣、建立信任感。

關於微文案詳細介紹可參考：[為什麼UX Writing 很重要](https://mermer.com.tw/knowledge-management/20250114001)

📍**範例：Dropbox 刪除提示**
在你刪除檔案分享連結時，系統會提醒：「此動作會造成他人無法造訪該連結，請確認是否繼續」。

![remove-links](https://github.com/user-attachments/assets/1a710049-2c21-46ec-95ea-dab9890185f2)

👉 **說明：** 精準的文案能在關鍵時刻給予心理安全感，也能明確傳達行為後果。

---

###  5. Guided Onboarding（互動式導覽）

互動式導覽常見於 SaaS（雲端服務）產品初次體驗階段。這種做法幫助使用者一步步學會操作，最早由一些使用者導向強的工具如 Intercom、Canva 開始推廣。它們會根據使用者的動作觸發一步步的操作提示，是非常有效的新手導入方法。

📍**範例：Canva 初次登入教學**
使用者第一次進入編輯器，系統會引導你一步步新增圖片、加入文字，教你如何使用平台。

![image-9-1](https://github.com/user-attachments/assets/5ef5b02a-b3d3-404a-aedf-60abe5947206)

👉 **說明：** 循序漸進的互動教學，能降低第一次使用的挫折，提升導入成功率。

---

## iSunFA 可以如何應用這些 UX 方法？

雖然這些做法常見於設計工具或科技產品，但在專業系統如會計軟體中同樣重要。以下是 iSunFA 可落實的方式：

### Contextual Help（情境提示）

* 在生澀詞彙旁加上 ⓘ 提示該詞彙的意思
* 在每個「發票種類」底下，顯示更白話文的解釋，如：32 - 銷項二聯式統一發票 底下標注：銷售後開出去給購買人的所有二聯式發票
* 在接近報稅季時，登入會顯示提示彈窗，並加上詳細說明文件的連結，讓使用者有機會更了解稅務工作

### Progressive Disclosure（漸進式揭露）

* 在主要功能欄位只強調三大功能，「憑證」、「傳票」、「報表」
* 報表頁僅展開常見欄位，其餘的點選「展開」後才會展開該項目。

### Inline Guidance（即時提示）

* 統編欄輸入非 8 碼自動警示：「統一編號應為 8 碼數字」
* 稅額額欄位提示：「建議輸入稅別及銷售額，系統將自動計算稅額」
* 境外憑證選擇應稅稅別時，即時警示可能選錯類型，應為零稅率

### Microcopy（微文案）

* 「下一張」按鈕改為「儲存並下一張」
* 「確認」改為「確認刪除此張傳票」
* 上傳發票提示：「支援 PDF、JPEG，請確保圖檔清晰可辨識」

### Guided Onboarding（互動導覽）

* 首次登入頁面時顯示 step-by-step 浮層：「Step 1：上傳憑證」...指導至成功產出一張報表
* 新功能上架時，以浮動視窗詳細介紹新功能

---

## ✨ 結語：資訊剛剛好，體驗才會好

設計不是把資訊塞得越多越好，而是要拿捏得剛剛好。透過這些 UX 方法，產品能變得更容易上手、學習，也能讓使用者在關鍵時刻不再迷路，順利完成任務。


---

## Reference

[Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/)

[Just-in-Time Help: Look Right!](https://www.youtube.com/watch?v=6tVMuWObaqU)

[What is Progressive Disclosure? Show & Hide the Right Information](https://www.uxpin.com/studio/blog/what-is-progressive-disclosure/)

