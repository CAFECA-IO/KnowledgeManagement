# 可用性啟發式評估：深入解析 Nielsen 的 10 條啟發式評估原則

可用性啟發式評估是一種常用的用戶體驗（UX）評估方法，由Jakob Nielsen在1990年代提出。
這些原則可以幫助設計師在前期缺乏用戶測試資料的時候，也能系統化地找出潛在問題。
相比使用真實用戶進行的可用性測試，啟發式評估具有成本低、速度快、可預先預防問題的優點，常被設計團隊用於產品開發早期或迭代階段。

以下讓我們更深入了解每一條原則的意義、如何實踐，以及實際案例示例。

---

## 1. 系統狀態可見性 (Visibility of system status)

**說明**：系統應該隨時向用戶反饋目前狀態，讓用戶知道操作是否成功、進度到哪。

**常見實踐方法**：

* 遇到需要載入、等待的狀況時，顯示進度條或是相對應的動畫，讓使用者理解系統是有在運行的。
* 完成某項任務後顯示成功/失敗訊息，讓使用者理解他們已經完成任務，並告知任務結果。
* 即時回饋，如：輸入錯誤時立刻顯示提醒，點擊加入購物車後其數字會相對增加。

**案例**：

![Video-Upload-Failed-1024x648](https://github.com/user-attachments/assets/eba8d163-5f0f-4ae5-b26a-e8993e926c2b)

* Google Drive 上傳文件時，會有進度條動畫來提示使用者系統正在運作及上傳進度，上傳完畢後也會直接顯示上傳結果，讓用戶理解該文件的上傳工作已完畢，並告知結果。


---

## 2. 與現實世界一致 (Match between system and the real world)

**意思**：使用用戶熟悉且慣用的詞彙、圖示與邏輯，而非專業術語或系統語言。

**實踐方法**：

* 使用生活化用語，如：Facebook在建立貼文的輸入欄位中的 Placeholder 使用「在想些什麼？」，而非輸入內容，更貼近現實生活狀況。
* 採用符合現實的圖示，例如：齒輪代表設定，鈴鐺代表通知等，已是被大眾所知且熟悉的圖示。
* 操作流程符合生活邏輯，例如：在操作水平滑桿時，往「右」代表「增」，往「左」代表「減」。 

**案例**：

<img width="639" height="247" alt="0*Nll_4hUfh3nfBZyz" src="https://github.com/user-attachments/assets/9d9a0a0a-2669-4453-b8df-ca5388539eb4" />


* Apple 系統中的App，都是使用最直覺、最貼近真實生活的圖案設計。

---

## 3. 用戶控制與自由 (User control and freedom)

**意思**：用戶要能輕鬆撤銷、重做操作，避免誤操作帶來不可逆後果。

**實踐方法**：

* 設計「返回」與「取消」按鈕
* 支援多步驟撤銷/重做（Undo/Redo）
* 對重要動作要求二次確認

**案例**：

![keep-an-eye-on-the-undo-button-1679237093](https://github.com/user-attachments/assets/ad365281-036d-4425-90a2-ee4797095fe1)


* Gmail 的「取消傳送」按鈕，幫助用戶在幾秒內撤回寄錯的郵件。

---

## 4. 一致性與標準 (Consistency and standards)

**意思**：介面設計要保持內外一致，介面除了遵循內部設計規範外，也須遵循使用者熟悉的慣例（設計模式），符合大多數人已經建立的心理模型，減少用戶學習成本。

**實踐方法**：

* 同一個產品中的相同功能使用相同的名稱及圖示
* 按鈕樣式及不同交互狀態的設計在整個產品中保持一致
* 遵循平台設計規範（如 iOS HIG / Material Design）

**案例**：

![jakobs-law-utility-nav](https://github.com/user-attachments/assets/3a1b645d-e1c8-415e-8e82-a81bdce52a8e)


* 電商網站中（IKEA, Target, Etsy, Grainger)，購物車及帳號圖示通常放在右上角，並在其左手邊都加入了一個Search bar，用戶能自然而然的找到想要使用的功能。

---

## 5. 錯誤防範 (Error prevention)

**意思**：在問題發生前先預防使用者操作錯誤，而不是只事後提示。

**實踐方法**：

* 表單中，限制某些輸入（如：email不能填寫中文、信用卡卡號只能輸入數字等）
* 系統預設的選項或狀態，是最安全、風險最低、對用戶最友善的選擇（如：預設不儲存信用卡資料，需要用戶主動選擇「記住我的卡號」）
* 防呆設計（如：在註冊帳號或更改密碼時，通常會要求輸入兩次相同密碼。）

**案例**：

![Choose](https://github.com/user-attachments/assets/ae086adc-0715-4378-87de-ddbf5ab70bf1)

* Uber 通常會把最便宜、最常用、最多車隊數量的車款作為預設：減少用戶誤選高價車及降低等待時間風險

---

## 6. 認知優於回想 (Recognition rather than recall)

**意思**：盡量減少使用者記憶與思考的需要，讓用戶「看了就能認出」要做什麼，而不是要他們自己想起來。

**實踐方法**：

* 使用下拉選單、歷史紀錄、自動完成功能
* 為圖示加上標籤
* 顯示常用功能捷徑
* 記憶用戶使用習慣，並將其設為預設。

**案例**：

![IMG_5328](https://github.com/user-attachments/assets/acf0c555-8426-456b-b9f6-5225442b250d)

* GoShare在你手機收到驗證碼後會有自動填寫的功能。
---

## 7. 彈性與效率 (Flexibility and efficiency of use)

**意思**：系統應靈活滿足不同用戶的需求，提供快捷方式、定制化選項或進階功能，讓有經驗的用戶能更快速高效地完成任務，同時保持對新手友好。

**實踐方法**：

* 設計快捷鍵
* 提供批量處理的功能
* 介面及功能可個人化設定

**案例**：

![figma](https://github.com/user-attachments/assets/44d5383c-9f47-412b-834d-823dc627a135)

* Figma 同時支援多種快捷鍵，方便設計師更流暢及快速的完成任務

---

## 8. 美學與極簡設計 (Aesthetic and minimalist design)

**意思**：介面僅保留必要資訊，避免視覺與認知負擔。

**實踐方法**：

* 精簡文字，並利用排版增加可閱讀性。
* 適量留白，避免物件過於擁擠。
* 避免加入不必要的資訊或元素。

**案例**：

<img width="1280" height="720" alt="Google_Homepage" src="https://github.com/user-attachments/assets/d9dbe4b9-7cee-46a8-b7c2-46abf58be2dd" />


* Google 首頁僅有 Logo、搜尋框與兩個按鈕。

---

## 9. 幫助用戶識別、診斷與復原錯誤 (Help users recognize, diagnose, and recover from errors)

**意思**：錯誤訊息應清楚解釋發生什麼、原因與解決方法。

**實踐方法**：

* 明確錯誤說明（並非僅顯示「Oops something went wrong 或 錯誤代碼等，而是明確說明發生什麼錯誤）
* 提供解決方案指引 (向使用者說明建議的簡覺方案，或直接提供連結或按鈕等，協助用戶操作並解決問題）

**案例**：

<img width="475" height="381" alt="1*fYhtI9zJTox4QQsGcQZ0kA" src="https://github.com/user-attachments/assets/91297509-dc78-43fb-8f33-a4bea36dcc96" />

* Pinterest 運用品牌口吻，明確告知用戶發生了什麼錯誤，需要怎麼解決。

---

## 10. 幫助與文件 (Help and documentation)

**意思**：當用戶需要較深入的幫助時，提供容易取得且完整詳細的支援內容。

**實踐方法**：

* 設計「幫助中心」與 FAQ
* 為複雜功能提供步驟引導
* 使用內容搜尋或導覽清單

**案例**：

<img width="1315" height="750" alt="截圖 2025-07-18 下午3 18 50" src="https://github.com/user-attachments/assets/6b2249fa-f297-440e-9bd9-fadc6db3c557" />

* Apple 提供一個簡潔但完整的幫助中心，讓面對問題的使用者能在此有好的體驗

---

## 總結

設計師可以把這十條原則當作設計過程中的思考工具，在原型階段或甚至構思初期對照，幫助發現盲點並做出更貼近用戶需求的調整，在完成設計後更是一個檢查指標，確保最終成果不只是美觀，而是真正讓用戶感到直觀、流暢且值得信任的體驗。


## Reference

https://www.interaction-design.org/literature/topics/heuristic-evaluation?srsltid=AfmBOorXd6YzXH7uJhMEs-Ktpe8V-IKE84-8GP8u_wx6FCyfnLEmqU9R

https://janicejllin.medium.com/快速優化介面的經驗法則評估-heuristic-evaluation-14be8a790635

https://maze.co/guides/usability-testing/heuristic-evaluation/

https://www.nngroup.com/videos/heuristic-evaluation/

https://www.nngroup.com/videos/conduct-heuristic-evaluation/?lm=heuristic-evaluation&pt=youtubevideo

https://www.nngroup.com/videos/error-message-visibility/?lm=conduct-heuristic-evaluation&pt=youtubevideo 
