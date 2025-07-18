<div align=center>

![2307 i109 013 S m004 c13 accessibility isometric infographics](https://github.com/user-attachments/assets/fba25e40-aa6c-427d-a943-bfad18a71f3b)

</div>

# Accessibility Design 無障礙設計

## 前言
當我們談論「使用者體驗（UX）」的時候，很多設計師會直覺地想到流暢的流程、吸引人的介面或是轉換率的提升。但在這些優化之前，我們可能忽略了一個最基本卻常被遺忘的問題：你的產品，真的「每個人」都能使用嗎?

無障礙設計（Accessibility Design）就是解決這個問題的核心。無障礙設計不只是針對視障、聽障或行動不便者設計的「特殊功能」，而是讓設計回歸本質——讓所有人，不論能力限制，都能獲得平等、無障礙的使用體驗。這包含了老年人、臨時受傷者，甚至是使用不同裝置、網速不穩的使用者。

在這篇文章中，將透過以下章節深入探討無障礙設計的重要性、實踐方式與真實案例的介紹 :

1. 什麼是無障礙設計?
2. 無障礙設計的核心原則
3. 如何將無障礙設計融入產品?
4. 無障礙設計案例分享


## 什麼是無障礙設計?
無障礙設計（Accessibility Design），簡稱 a11y（"accessibility" 中的 11 個字母縮寫），是指讓所有人不論其身心能力，都能平等使用產品或服務的設計方式。這其中包含視覺障礙者（如色盲、全盲）、聽覺障礙者、肢體障礙者、認知障礙者等族群。

舉個簡單的例子，網站上的圖片若沒有加上「替代文字（alt text）」，視障者就無法透過螢幕閱讀器得知圖片內容。又或者是一段影片如果沒有字幕，聽障者將完全無法理解內容。
無障礙設計的目的並不是做出一個「特別版本」的產品給特定使用者，而是從源頭就把多元需求納入設計考量中，讓每一個人都能夠自然地、直覺地使用產品。

> [!NOTE]
> 無障礙設計不只是「做公益」，它同時也符合商業利益。根據 WHO 的統計，全球約有 16% 的人口具有某種形式的障礙。而許多使用者（例如老年人或在不同環境下操作產品的使用者）也會因此受惠。

## 無障礙設計的核心原則
設計師在開始進行無障礙設計的時候，常常會碰到一個問題：「我想讓產品更無障礙，但具體要從哪裡開始?」這時候，無障礙設計的四大核心原則就像是導航地圖，幫助我們釐清方向，避免在善意中做出效果有限的努力。

這四大原則來自 WCAG（Web Content Accessibility Guidelines），是目前最被全球廣泛採納的無障礙網頁設計準則，許多國際網站與數位產品也都以它作為基本合規標準。
不過，這些原則並不只適用在網頁上，許多 App、互動裝置甚至硬體設計也都可以用這套邏輯來檢視。

1. 可感知（Perceivable）
所有資訊與介面元素都必須可以被使用者「感知」。例如：

- 圖片必須有替代文字（alt text）供視障者透過螢幕閱讀器理解。

- 影片需提供字幕或手語翻譯給聽障使用者。

- 文字需具備足夠的對比度，讓低視力者也能閱讀。

<div align=center>

![image](https://github.com/user-attachments/assets/584e4059-2861-46e5-aa55-42877ca62ce6)

</div>

2. 可操作（Operable）
使用者要能操作所有功能，包括滑鼠、鍵盤或其他輔助工具：

- 所有功能都應支援鍵盤操作（例如使用 Tab 鍵瀏覽頁面）。

- 滑動式 carousel 或按鈕不可在過短時間自動關閉，否則會造成操作困難。

- 提供足夠的點擊區域，避免行動不便者誤觸。

<div align=center>

![image](https://github.com/user-attachments/assets/5894be06-4d86-4361-9d77-f5d42fc88dac)

</div>

3. 可理解（Understandable）
使用者要能輕鬆理解產品內容與行為：

- 使用簡單直白的語言。

- 避免在沒有提示下出現突如其來的錯誤訊息。

- 提供表單輸入的即時檢查與錯誤提示（例如「電子郵件格式不正確」）。

<div align=center>

![image](https://github.com/user-attachments/assets/d29bbf29-6a17-439d-ae6e-7f08f7416e7e)

</div>

4. 強健性（Robust）
設計應兼容多種技術與設備，並支援輔助技術：

- HTML 結構需語意化，讓螢幕閱讀器能正確解析。

- 不應完全依賴 JavaScript 呈現關鍵資訊。

- 測試在各種瀏覽器與設備上的兼容性。

<div align=center>

![image](https://github.com/user-attachments/assets/83ba103d-8291-455c-a582-3da4bce4ec8f)

</div>

> [!NOTE]
> 這四大原則出自 WCAG（Web Content Accessibility Guidelines），是全球網頁設計的無障礙標準。

## 如何將無障礙設計融入產品?
當要做出一個無障礙的產品，很多設計師第一反應是「那是不是只有給長照系統或是給身心障礙者的產品才需要？」但事實上，無障礙設計不是特定族群的專利，而是產品成熟度與體驗設計專業的表現。

真正優秀的無障礙設計，應該從產品開發的早期就被考慮進來，而不是等到設計快完成時才臨時「補救」。這意味著，我們要將無障礙視為 UX 流程中的一環，並貫穿於使用者研究、UI 設計、原型測試、工程實作與 QA 檢驗中。

### 實作方式與設計流程建議
#### Step 1：使用者研究階段
招募包含不同能力層級的使用者（例如高齡者、視覺障礙者）參與訪談或測試，理解他們的行為模式與需求盲點。

#### Step 2：設計與原型階段
在 Wireframe 和 UI mockup 階段就納入無障礙檢查（例如對比度足夠、Tab 鍵可操作順序合理、語意清楚的按鈕標籤）。

#### Step 3：開發與驗證階段
與工程團隊討論使用 ARIA 標籤、語意 HTML 結構、支援螢幕閱讀器與鍵盤操作等要素，並導入自動化無障礙測試工具（如 Axe、Lighthouse、Wave）。

### Apple 設計流程中的「無障礙預設值」
Apple 並不是等到產品上市後才思考如何讓它符合身障需求，而是在開發初期就將無障礙列為核心條件。舉例來說，在設計 iPhone 的控制中心時，Apple 的設計團隊會先確認各個按鈕是否能透過 VoiceOver 被正確識別，甚至確保使用者可以不用觸碰螢幕、只透過語音與輔助裝置完成操作。

他們也鼓勵第三方 App 開發者在使用 SwiftUI、UIKit 等元件時，直接使用 Apple 預設的 UI Component，這些元件本身就內建支援無障礙，減少開發者實作上的負擔。

從中可以發現越早將無障礙當成「預設標準」而非「附加選項」，越能減少修正成本，也讓無障礙變得自然而不是額外負擔。

<div align=center>

![image](https://github.com/user-attachments/assets/988fd9a5-15a4-478b-989c-d7f3125bb434)

</div>

> [!Tip]
> 無障礙改善不只是在幫助少數人，反而可能打開一個全新的潛在市場與產品增長點。

## 無障礙設計案例分享

### Apple 的無障礙功能設計
Apple 長期以來在產品設計中注重無障礙體驗，不只是將「無障礙功能」視為輔助選項，而是將其深度整合至產品核心體驗中。從 iOS 到 macOS，Apple 透過全系統層級的無障礙支援，讓各類身心障礙者都能無障礙地使用其設備。

Apple 在 iOS、macOS、watchOS 裡都有非常完整的無障礙功能系統，並且是業界標竿。這些功能不只是輔助工具，更是設計的一部分。

#### 無障礙設計巧思與學習重點：

1. 語音導覽（VoiceOver）
VoiceOver 是 Apple 的畫面閱讀器，讓視障者能透過觸控手勢和語音說明了解螢幕上的內容。它並非外加模組，而是與作業系統整合的核心功能，能夠支援所有原生與第三方 App。這強調了無障礙設計不應是「加上去的東西」，而是開發初期就要納入的考量。

<div align=center>

![image](https://github.com/user-attachments/assets/8d7c7c12-d881-4a02-8dbb-66e35cdc291c)

</div>

2. 動態控制（Reduce Motion）
為了避免某些動態效果導致癲癇或暈眩等不適，Apple 提供「減少動態效果」選項。這讓設計師明白，動態體驗雖然迷人，但也可能是某些用戶的障礙。

3. 可調整的顯示選項
使用者可以自訂字體大小、色彩濾鏡與高對比模式，對於色弱或視覺辨識困難的族群尤其重要。這告訴我們 UI 設計不應該「一體適用」，而要有彈性與可調性。

> [!NOTE]
> Apple 對於無障礙設計的重視提醒我們，無障礙設計不只是「附加功能」，而是一種基本的設計素養。從作業系統、應用程式到硬體整合，全方位地思考使用者需求，是打造真正包容性產品的關鍵。

### Google Maps 導入輪椅友善路線
Google Maps 是日常生活中不可或缺的地圖導航工具，在無障礙設計上也展現出實用與細緻的考量。特別是在許多城市中推出的「輪椅無障礙路線」，解決了行動不便者在城市中移動的痛點。
這種設計不只是為了解決「障礙者」的問題，而是實現真正的「普惠設計（inclusive design）」。

<div align=center>

![image](https://github.com/user-attachments/assets/60b32370-e30a-486b-8c0e-75b18a1e1101)

</div>

#### 無障礙設計巧思與學習重點：

1. 輪椅友善路線篩選器
使用者只要開啟這個選項，Google Maps 就會自動排除樓梯過多、缺乏電梯或坡道的路線，優先選擇無障礙設施齊全的通道。這是對「隱形障礙」的直接回應，設計上強調實用性與可預測性。

2. 實地數據整合與社群回報機制
Google 與當地導覽志工合作收集地點無障礙資訊，也開放使用者回報無障礙設施狀況，這種資料群眾協作模式使設計更貼近實際需求。這鼓勵我們在產品設計時，也要思考如何讓用戶參與改善產品可及性。

3. 多族群友善思維
雖然功能是為輪椅使用者設計，但實際上也幫助到推嬰兒車、攜帶大件行李或腳部受傷的族群。這展現了「設計對少數人有幫助時，也常常能讓所有人受益」的理念。

> [!NOTE]
> Google Maps 告訴我們，無障礙設計並不需要大張旗鼓地強調差異化，真正的好設計是能自然地融合在原本功能中，同時讓所有用戶都獲得更好的體驗。

## 總結
無障礙設計不應該被視為開發流程中額外的「負擔」或「最後才加上去的功能」，它其實是產品品質的一部分。透過無障礙設計，我們不只是在幫助某些特定族群，而是在提升整體產品的包容性、靈活性與可用性。
從 Apple 將無障礙功能融入核心體驗，到 Google Maps 為輪椅使用者設計友善路線的實例中，我們可以學到：好的無障礙設計，往往不會讓人「察覺它的存在」，而是自然地為所有人創造更順暢、更公平的使用體驗。

若設計師、產品經理與工程師都能在設計初期就思考無障礙需求，將其視為基本設計條件之一，不僅可以避免後期大量修改，也能減少使用者流失，甚至提升整體產品評價與市場覆蓋率。

> [!Tip]
> 無障礙設計不是只是「為了符合法規」或「專門為少數人服務」──而是打造更好產品、更好體驗的關鍵過程。

## Reference
- [WCAG 無障礙設計標準](https://www.w3.org/WAI/WCAG22/quickref/?versions=2.1)
- [7 Things Every Designer Needs to Know about Accessibility](https://medium.com/salesforce-ux/7-things-every-designer-needs-to-know-about-accessibility-64f105f0881b)
- [Princeton 無障礙設計手冊](https://digital.accessibility.princeton.edu/how/design)
- [Google尋找無障礙地點](https://support.google.com/maps/answer/9882117?hl=zh-Hant&co=GENIE.Platform%3DAndroid)
- [Mac旁白使用手冊](https://support.apple.com/zh-tw/guide/voiceover/welcome/mac)
