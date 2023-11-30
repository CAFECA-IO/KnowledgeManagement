# Documentation about Mock APIs and Postman

# 前言

本文主要想紀錄下如何使用 Postman Mock Server 建立 Mock API。

此篇文也許會隨著改版而變得與實際狀況偏離，如果想知道最新、最詳細的使用方法（尤其隨時間過去），非常建議前往 Postman 的 [學習中心](https://learning.postman.com/docs/introduction/overview/) 查詢相關官方文件。

在開發初期，後端 API 可能還沒有實現或者處於變動中。使用 Mock API 可以讓前端團隊繼續進行開發，而不必等待真實的後端服務就緒。

# Mock API 簡介

Mock 為「模擬」的意思，那麼先了解為什麼需要模擬？

### 使用 Mock API 的原因：

1. **開發速度:**

   在開發的早期階段，實際的後端 API 可能尚未就緒或仍在開發中。

   Mock API 允許開發人員模擬真實 API 的行為，使前端團隊能夠在不必等待實際後端服務的情況下繼續開發。

2. **測試(test)和除錯(debug) :**

   開發人員可以模擬不同的情境以測試應用程序的行為。

   Mock API 有助於測試不同的後端響應和錯誤情境，確保應用程序正確處理不同的情況。

3. **獨立開發:**

   前端和後端開發團隊可能在不同的時間表上工作。

   Mock API 讓前端和後端團隊能夠獨立工作。前端團隊可以在不依賴實際後端服務的情況下開發和測試他們的組件。

4. **減少依賴性:**

   開發人員可能面臨無法連接到真實後端服務的情況。

   Mock API 減少對實際服務的依賴，使開發人員能夠在後端無法使用或在開發的早期階段繼續前端組件的工作。

5. **協作:**

   使用 Mock API 可以促進前端和後端開發人員之間的協作。

   前端團隊可以提前定義所需的 API 規範並與後端開發人員合作。這有助於更好地溝通和協調兩個團隊之間的工作。

### 建立 Mock API 的常見工具：

- Postman
- Mockoon

# 用 Postman Mock Server 建立 Mock API

### 步驟一：建立新的 Mock Server

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/105651918/88656d17-28da-4502-ba75-01dc670e2d42)

點擊側邊欄位 Mock servers

→ 點選「＋」號進入 Create a mock sercer 標籤頁

→ 進入第一步驟 1. Select collection to mock

→ 選擇 Create a new collection

→ 輸入幾個 requests（之後都還可以增刪查改，不必一次輸入）

→ Next

### 步驟二：Mock Server 設定

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/105651918/6fded496-d8c9-4c2c-9a74-e2ad0a867162)

進入第二步驟 2. Configuration

→ 為你的 Mock Server 取名

→ 做細部設定

- Save the mock server URL as an environment variable : (checked)

  是可以選擇環境檔案來統一一些參數的設定，這樣就可以儲存這個 Mock Server 的 URL 為環境變數，建立後會比較好直接測試 call API。

- Make mock server private :

  設定 Mock server 是否為私有的。私有的話，需要設定 x-api-key 在 headers，而 key 的建立可以參考此篇文章（[Integrate Postman into your development toolchain](https://learning.postman.com/docs/developer/intro-api/)）。

  這邊若是做為開發 Demo 使用，也可以不勾選，方便直接使用。

→ 點選 Create Mock Server，成功後就會看到 mock server 的 URL，如以下畫面，先複製起來，等等方便直接使用。

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/105651918/5bc8df87-4ca6-4c79-b23b-7db1e88d2b34)

P.S. 如果忘記儲存 URL，也可以到 Variables 去找：

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/105651918/597ef56c-5c16-44fa-9d6c-3fe121b633be)

### 步驟三：回到 Collections，設定 Mock API Data

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/105651918/3fb0161a-7823-415b-b15e-65f29d33b3e7)

回到 Collections，會發現多了剛剛設定 Mock Server 的名字，此時已開好資料夾。

展開後會發現所有我們剛才設定的 API，這裡可以修改、刪除，也可以新增新的。

選定 API 後再展開，選擇「Default」就可以設定預設資料。

在 Body 輸入預設的 Response 內容。如果是用 JSON 格式，記得在選單中點選「JSON」。

點選右上角的「Save」，

到這邊就可以成功建立一個 Mock 的 API 了。

此時可以直接在 Postman 嘗試發送「Try」：

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/105651918/04b6ddac-bffd-406b-9409-176f5ce7380d)

收到 Response，確認是否是自己設定好的內容。

另外也可以在 Codepen 試試看，再確認一次。

記得要將 `{{url}}/api/v1/chains-all` 的 `{{url}}` 替換成你自己的 Base URL，

也就是前一步驟最後存的 URL。

（有爬到文章說建議直接在 Postman 就把每個`{{url}}`都替換成 Base URL，以免測試出錯）

```javascript
const uri = 'https://f7fbdb12-93be-4244-b117-ce45b220e3ec.mock.pstmn.io';

fetch(uri + '/api/v1/chains-all')
  .then((res) => res.json())
  .then((res) => console.log(res));
```

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/105651918/96e720ff-7e6f-4c74-b2c9-c16201269f85)

### 網址參數設定

可以針斷不同的網址參數做設定，例如像這樣分頁的功能也能 Mock 。

只要在 Collections API 下的 Default 再新增其他的 example，就可以實現。

步驟一、Default 修改名字為 page1：

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/105651918/07dfaec0-fc54-413b-b832-5411eaa6eecb)

步驟二、在 API 底下新增 example，並且命名為 page2：

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/105651918/136295af-cc1f-48a8-8ac8-857ad18be34c)

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/105651918/d66e6cd5-ab62-46ad-92c6-517d14ab2366)

# 資料來源：

https://learning.postman.com/docs/designing-and-developing-your-api/mocking-data/mocking-with-examples/

https://www.notion.so/Postman-Mock-Server-API-Server-API-Let-s-Write-54d9397595a44617b9ea851d284ff9e9?pvs=21

https://www.notion.so/Postman-Mock-Server-Mock-API-d0a6410488e9481b9b49b7d7d5c8e22b?pvs=21
