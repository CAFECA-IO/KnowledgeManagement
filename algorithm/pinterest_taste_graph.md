在當今的數位環境中，個人化不僅僅是一項功能，而是使用者體驗的基礎，而 Pinterest 在這點上尤為明顯，創造全球超過 4 億的月活躍用戶。
作為一個視覺搜尋引擎，透過個人化來促進更深層次的用戶參與、留存和忠誠度，讓Pinterest 擁有巨大潛力。
根據統計，有48％美國社交媒體用戶使用Pinterest來查找和購物，而Facebook、Instagram 僅佔10％，Snapchat則佔4%。

<img width="413" alt="Screen-Shot-2025-03-17-at-3 30 10-PM" src="https://github.com/user-attachments/assets/435ddbcb-0783-437e-83a1-0499c7082cb7" />


讓我們來看看是什麼，讓 Pinterest 能從主流的社交媒體中脫穎而出。

### 品味圖譜（Taste Graph）：Pinterest 打造個人化體驗的秘密武器

Pinterest 的個人化推薦背後有一個強大的基礎設施，叫做「品味圖譜（Taste Graph）」。你可以把它想像成一張龐大的地圖，將你與你可能喜歡的東西連接起來。

例如當你儲存一個 Pin 到「壁爐」的 Board 裡面，你不只是在為自己整理資料內容，你同時也在向 Pinterest 傳達這張 Pin 的代表風格、用途、主題的標籤等訊息。

這些標籤不只記錄你的品味，也用來和其他類似圖片、其他使用者的喜好建立關聯。

品味圖譜的厲害之處是，它將整個平台的推薦機制整合起來。無論你在首頁滑動、使用搜尋功能、甚至點開購物連結，Pinterest 都能根據這張圖譜提供一致性高又個人化的推薦。

這讓使用者覺得平台「很懂我」，而且探索起來更直覺。

![pinterest-taste-graph](https://github.com/user-attachments/assets/b798bc31-aaa3-4097-9e5f-97a640def5df)

### 除了 Taste Graph，Pinterest 還有哪些個人化祕訣？

Pinterest 並不僅依賴 Taste Graph 這一項技術來實現個人化。它還融合了其他創新的機制，讓每位用戶看到的內容都能更貼近自己：

- **行為分段模型（Behavioral Clustering）**：Pinterest 將用戶依照他們的互動行為進行分群，不是僅依據人口統計資料，而是根據實際使用方式與喜好。例如，有些人愛點圖片但很少儲存，有些人專注於特定主題，這些細節都會改變推薦邏輯。

- **即時個人化（Real-time Personalization）**：Pinterest 能根據你當下的動作快速微調推薦內容。例如，你點了一張「婚禮布置」的 Pin，下一秒就可能出現婚紗、場地佈置、請帖設計等推薦，讓靈感一路延伸。

- **多模態理解（Multimodal Understanding）**：Pinterest 不只分析圖片，還理解圖片的文字描述、用戶儲存的的行為與情境背景、甚至圖片中的物品。這讓平台在推薦上能做到跨主題、跨媒材的跳躍，提升探索性與精準度。

- **冷啟動用戶策略（Cold Start Strategies）**：對於剛註冊的新用戶，Pinterest 會透過初始選擇興趣、分析裝置語言與地區設定等方式快速建立個人化模型，不讓新用戶感到「什麼都不相關」。

- **探索性設計（Exploratory Design）**：Pinterest 的探索性設計會故意避免過度依賴用戶的既有興趣和行為模式。這意味著推薦系統會呈現多樣化的內容，讓用戶有機會看到一些他們可能未曾考慮過的主題。

### 為什麼 Pinterest 的推薦不會讓你困在同溫層？

有些平台的演算法讓人愈看愈侷限，但 Pinterest 的推薦策略反其道而行：它強調探索性，幫你打開視野。

#### 一、視覺化探索（Visual Discovery）
Pinterest 是以圖片為主的搜尋與推薦平台，用戶透過滑動與點擊圖片來發現靈感，而非文字搜尋或追蹤社群，你不需要追蹤特定對象才看得到相關資訊。

這種視覺導向互動方式鼓勵使用者不斷接觸新主題，而非只留在已知興趣裡。

舉例來說：你儲存了一張波希米亞風格的居家設計圖，Pinterest 不只會推薦類似風格的照片，也會引導你探索相關但不同主題的內容，例如「戶外露營靈感」或「綠植佈置」，讓推薦跳脫同溫層。


#### 二、非社交導向的內容推薦
與 Instagram、Facebook 不同，Pinterest 並不依賴你的朋友或關注對象來決定你看到什麼內容。推薦來源主要來自演算法分析你的品味與行為，而不是社交圈動態，這樣能降低社交迴音室的效應（Echo ChamberEffect）。

你可能只儲存了幾張食譜，但平台會主動根據這些行為發展出更多潛在喜好：素食、野餐點心、異國料理等等，而不是單純重複你點過的東西。

![photo_13383_wide_large](https://github.com/user-attachments/assets/085b1362-d1fc-4fd6-8b64-f58c61f7f9f6)


### 多階段推薦系統：Pinterest 如何規模化個人化

面對數億用戶與數十億 Pins，Pinterest 的個人化引擎必須既精密又高速。該平台透過多階段推薦流程來實現這一目標：

1. **候選檢索（Candidate Retrieval）**：首先，Pinterest 根據品味圖譜、關注關係和近期活動，為每位用戶收集可能感興趣的 Pins。這個階段會用到一種叫做 **PinSage** 的圖神經網路模型，它能根據圖片之間的關聯性與使用者行為，快速從龐大資料中擷取出潛在合適的內容。
2. **進階排序（Advanced Ranking）**：接著，Pinterest 使用名為「Pinnability」的 AI 驅動神經排序模型（基於深度神經網路），分析並評估用戶與每個 Pin 互動的可能性，考量因素包括：
   - Pin 特徵（圖像內容、關鍵字）
   - 用戶特徵（興趣檔案、過往行為）
   - 情境因素（時間、語言、裝置）

這種方法取代了傳統的時間排序動態，Pinterest 稱其為「基於個人化相關性的自適應動態消息」，顯著提高了用戶參與度。

這樣的兩階段架構（Retrieval + Ranking）不只提升推薦品質，也能讓系統更有效率地運作，是其他大型平台，如 YouTube、TikTok等，常見的設計方式。

![0*Xe5F68GBjV6KWLST](https://github.com/user-attachments/assets/796357c2-2edf-4241-95b0-e0394bcc99c7)

![0*TwUVnOTgQiOf58oZ](https://github.com/user-attachments/assets/cd949fb0-0272-4ff0-956b-340e4bc668c0)


### 持續學習：Pinterest 如何讓推薦越來越懂你

Pinterest 的個人化系統並非一次性設定完畢，而是會隨著你的互動不斷學習與調整。當你點擊、儲存或隱藏一則 Pin，這些行為都會被回饋到演算法中，更新你的興趣輪廓。這讓推薦變得更即時、也更貼近你的最新偏好。

甚至就連你停留在某張圖片上的時間，也可能影響未來看到的內容。這種細膩的「微互動」追蹤，讓 Pinterest 的推薦機制更像一位細心觀察的設計師，而非只會重複你過往行為的機器。

### 結合電商與內容：從探索到行動

Pinterest 並不只是一個找靈感的地方，還逐步將探索轉化為實際行動。透過 Shopping 功能，使用者可以直接從感興趣的圖片中購買商品。推薦系統也會分析你互動過的 Pins，推薦你可能喜歡的商品或品牌。

這就是為什麼很多企業，例如ikea，會將整個目錄上載到Pinterest平台上，它還讓 Shopify 的商家可以將目錄上傳成為可購物的 Pins。

這樣的「靈感 → 發現 → 購買」流程讓使用者的旅程更加完整，而 Pinterest 也能在過程中提供越來越個人化的商業建議，達到使用者體驗與平台獲利的雙贏。

Pinterest 的廣告推薦系統與購物推薦也使用這套推薦基礎，並使用類似的排序模型，所以就算是商業內容，也能保持高度相關性與個人化。

![home decor style guides](https://github.com/user-attachments/assets/cc7b496e-e692-414c-9b01-137159137a1b)


### 讓推薦更貼心，而不是更侵入

Pinterest 在推薦上的設計理念，並不是要強行塞滿你的動態牆，而是像一位溫柔的顧問，根據你的品味不斷提供你新的點子。

它不靠社交圈的演算法、不僅僅重複你喜歡的東西，而是試圖拓展你的視野、帶你挖掘潛在的興趣。

Pinterest 打造一個讓人靜靜探索、也能自我表達的空間。也許，這正是它在個人化推薦領域中，最人性化的地方。

### 使用情境：也許你就是下個靈感的起點

想像一下，你正悠哉地在 Pinterest 上滑著，突然看到一張來自北歐設計師的極簡廚房照，靈感爆發，一股衝動讓你決定翻新家中老舊的廚房。

於是你開始收藏各種磁磚、燈具、餐椅圖片，Pinterest 的推薦也隨之變化，像一位設計助理般幫你發掘不同風格搭配與不同品牌連結，並激發你對於其他空間改造靈感。

最後，你不僅打造出夢想中的廚房，還順便成為下個用戶的靈感來源，你的 Pin 也可能被收藏、被轉發，成為別人清單上的第一張。

這就是 Pinterest 演算法：它不只是「給你想看的」，更是「幫你找到你沒想到但會愛上的」。


### Reference

[Pinterest’s Personalization Playbook](https://uxplanet.org/pinterests-personalization-playbook-e677dfd1a155)

[Pinterest – Scaling Taste using AI](https://abhitsian.blog/2025/02/08/how-pinterest-is-using-ai-to-perfect-the-art-of-digital-discovery/)

[25 must-know Pinterest stats for marketers in 2025](https://sproutsocial.com/insights/pinterest-statistics/)

[Pinterest opens up more than 5,000 interests for advertiser targeting through its Taste Graph](https://techcrunch.com/2017/09/21/pinterest-opens-up-more-than-5000-interests-for-advertiser-targeting-through-its-taste-graph/)

[Pinnability: Machine learning in the home feed](https://medium.com/pinterest-engineering/pinnability-machine-learning-in-the-home-feed-64be2074bf60)

[Living in a filter bubble](https://www.technollama.co.uk/living-in-a-filter-bubble)

[New ways to shop on Pinterest and discover retailers of all sizes](https://newsroom-archive.pinterest.com/en-gb/new-ways-to-shop-on-pinterest-and-discover-retailers-of-all-sizes)

