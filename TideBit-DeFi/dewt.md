# Decentralized Web Token（DeWT)
Decentralized Web Token（DeWT) 是我們專為 TideBit-DeFi 設計的去中心化認證機制，其原理參考 [JWT](https://supertokens.com/blog/what-is-jwt) 的認證機制，兩者主要的不同在於 JWT 是由網站所核發(是一種中心式的認證機制)而 DWT 則是由用戶所核發，並且兩者簽署的內容也不同。

## 常見的身份驗證和授權技術
當我們談論前後端的鑑權方式時，我們主要討論的是怎麼確定一個用戶或應用程式的身份以及他們是否有權限去訪問某些資源。以下是幾種常見的鑑權方式的詳細說明：
1. **Session - Cookie**:
    * **主要特點**：透過伺服器生成的Session ID和客戶端的Cookie進行身份驗證和狀態管理。
    * **Session**：當使用者成功登入後，伺服器會為該使用者建立一個獨特的Session ID，並將此ID儲存於伺服器的session儲存區（例如，伺服器記憶體、資料庫、Redis等）。
    * **Cookie**：伺服器將Session ID寫入使用者瀏覽器的Cookie中。當使用者再次訪問該網站時，瀏覽器會自動將Cookie中的Session ID發送到伺服器，伺服器接收到後，查找對應的Session資料，以此確認使用者身份。
    * **優點**：
       * 較容易實現，尤其適用於傳統的網頁應用程式。
       * 使用者登入狀態持久化，伺服器具有完全控制，可以隨時終止session。
    * **缺點**：
       * 伺服器需保存大量session資料，對於大型或高流量的應用程式可能會造成伺服器壓力。
       * 當使用分散式系統或集群時，可能需要進行session同步，增加複雜性。
       * Cookies可能受到XSS和CSRF攻擊。
![dewt drawio](https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/bcde349c-a228-466d-8cca-ac517e2c1c5a)

2. **Token 驗證 (包括JWT、SSO)**：
    * **Token**：與Session類似，但不會儲存使用者資訊於伺服器。當使用者登入成功後，伺服器會發放一個Token給使用者，每次請求時帶上這個Token，伺服器驗證Token的有效性即可。
    * **JWT (JSON Web Token)**：是一種編碼後的JSON格式的資料，可以儲存資訊（例如使用者ID）。JWT有三部分：header, payload, signature。它能確保資料沒有被篡改，JWT是一種常用的Token格式。
    * **SSO (Single Sign-On)**：允許使用者登入一個應用程式或平台後，可以不用重新登入便可訪問所有已授權的其他相關聯的系統或服務。
    * **主要特點**：使用Token代替Session ID進行身份驗證，無需伺服器保存使用者狀態。
    * **優點**：
       * 無狀態性，伺服器不需要保存使用者狀態，適合分散式系統。
       * JWT可以跨語言和平台使用，具有很高的擴展性。
       * SSO提供了優良的使用者體驗，允許在多個應用程式間共享身份驗證狀態。
    * **缺點**：
       * 若Token遺失或被竊取，它可能被濫用，直到過期。
       * JWT的內容可以被解碼查看，因此不能用來儲存敏感資料。
       * SSO實施需要考慮多種安全問題，可能增加複雜性。
![dewt_2 drawio](https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/57fc8b59-a1a6-45a0-ad53-9147b137cb50)

3. **OAuth 2.0 (開放授權)**：
    * OAuth 2.0 是一個讓第三方應用程式在未取得使用者明確帳戶和密碼的情況下，取得其資源的協定。例如，當您使用Google帳戶登入其他網站或應用時。
    * 這個流程涉及多個步驟，包括取得授權、交換token以及使用token訪問受保護的資源。
    * OAuth 2.0定義了四種授權方式：授權碼、隱藏式、用戶密碼、客戶端憑證。
    * **主要特點**：允許第三方應用在不知道使用者憑證的情況下訪問使用者的資源。
    * **優點**：
       * 可以讓第三方應用訪問特定資源，而不需要知道使用者的帳戶密碼。
       * 靈活的授權方式，可以根據不同的需求和場景選擇不同的授權流程。
       * 被廣泛應用和接受，有豐富的開源庫和工具支持。
    * **缺點**：
       * 實施和管理可能複雜，需要維護授權伺服器。
       * 若不正確或不安全地實施，可能會被攻擊者利用。
       * 某些OAuth 2.0流程（例如隱藏式）可能不夠安全，需要特別注意。

**核心差異**：
- **Session - Cookie**：伺服器中心化，是一種基於伺服器的身份驗證方法，需要伺服器持久化保存每個使用者的Session資料，使用者的瀏覽器需要支持並接受Cookies，使用伺服器儲存的Session資料和客戶端的Cookie進行驗證。
- **Token 驗證**：與Session相反，是無狀態的身份驗證方法，不需要伺服器保存Session資料。使用Token進行驗證，其中JWT是一種常用的Token格式，具有自包含性，它可以在token本身儲存資訊。
- **SSO**：是一個廣義的概念，描述的是一種身份驗證策略，是一種允許在多個應用間共享身份驗證狀態的技術。而 token（不論其格式如何）只是實現 SSO 的多種工具之一。
- **OAuth 2.0**：授權而非身份驗證：OAuth 2.0重點是允許應用程式訪問特定資源，而不是驗證使用者身。它允許第三方應用在使用者的同意下訪問其資源，涉及授權、交換token以及使用token訪問資源的多個步驟，根據不同的需求和場景，OAuth 2.0定義了不同的授權流程。
  
**結語**：
鑑於上述技術，我們可以見到各有所長、所短。Session-Cookie是伺服器中心，適合傳統網頁應用。Token驗證如JWT則更適合現代分散式系統。SSO專為多應用共享驗證而設，而OAuth 2.0更偏重於資源授權，選擇哪種身份驗證和授權技術取決於應用程式的需求、結構和目標。
例如，對於單一的web應用程式，使用Session-Cookie可能更簡單和直接；對於移動應用程式或單頁應用程式，使用Token或OAuth可能更為適合。

## 簡述 JWT 
JWT是Auth0提出的通過对 JSON 进行加密签名來實現授權驗證的方案；

就是登錄成功後將相關用戶信息組成JSON 對象，然後對這個對象進行某種方式的加密，返回給客戶端；客戶端在下次請求時帶上這個Token；服務端再收到請求時校验 token 合法性，其實也就是在校驗請求的合法性。

![](https://i.imgur.com/gZBxaH9.jpg)
### 產生 JWT 
JWT 為 JSON Web Token 是一種開放標準（RFC 7519），它定義了一種簡單穩定的方式來表示身份驗證和授權數據。
流程為
1. 是由用戶提交登入的帳號密碼後。
2. 前端將加密過的用戶資料傳送給後端伺服器。
3. 收到資料後，後端伺服器根據用戶的資料產生對應的 JSON ，其 JSON 含有三個部份 header、payload、signature(在第三步產生)。
4. 由伺服器對用 [Base64 編碼](https://www.base64encode.org/)的 header、payload 簽名得到 signature，得到的 signature也用[Base64 編碼](https://www.base64encode.org/)。
5. 得到 Token， Token 是 header、payload、signature 分別[Base64 編碼](https://www.base64encode.org/)後得到的結果用點(.)將三者串聯起來。
```javascript
const JWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.e25hbWU6Ikpob24gRG9lIixleHBpcmVkOjE2ODA3NjE1MDAzMDEsYWRtaW46dHJ1ZX0.PT7k3siYn67lJBMYzQkj/yLsLt1SYGztgTTiR5or1Ss='
```

- header: 是實作 JWT 共用的格式，註明類別(typ)為(JWT)，加密演算法(alg)為(HS256)，以 `{"typ":"JWT","alg":"HS256"}` 為例 Base64 編碼的結果為 `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9`。
- payload: 裡面則是包含有前後端需要共享的資訊，以 `{name:"Jhon Doe",expired:1680761500301,admin:true}` 為例 Base64 編碼的結果為 `e25hbWU6Ikpob24gRG9lIixleHBpcmVkOjE2ODA3NjE1MDAzMDEsYWRtaW46dHJ1ZX0`。
- signature: 由後端持有的 private key 對 header 及 payload Base64Encoded 的結果使用 HMACSHA256 演算法簽名，將簽名的結果也進行 Base64 編碼。

#### 名詞定義
- 無狀態JWT（Stateless JWT）：包含Session 數據的JWT Token。Session 數據將被直接編碼進Token 內。
- 有狀態JWT（Stateful JWT）：包含Session 引用或其ID 的JWT Token。Session 數據存儲在服務端。
Session token（又稱Session cookie）：標準的、可被簽名的Session ID，例如各類Web 框架（譯者註：包括Laravel）內已經使用了很久的Session 機制。Session 數據同樣存儲在服務端。

### 驗證流程
1. 後端伺服器收到 JWT 後使用 [base64 解碼](https://www.base64decode.org/)。
2. 先比對 header 內容，確認 typ 為 JWT 且 alg 為 HS256。
3. (optional) 若 payload 中有 iat(issue at， 簽名時間)或是 expired等資訊則需要判斷此 JWT 是否是未過期的狀態。
4. JWT 簽名的伺服器與驗證的伺服器會共用私鑰，所以可以將收到的 JWT 的 header，payload 的簽名，對比是否有得到一樣的結果。

上述條件均滿足即為合法的 JWT。

### JWT 的優點
- 不需要在服務端保存會話信息（RESTful API 的原則之一就是無狀態），所以易於應用的擴展，即信息不保存在服務端，不會存在Session 擴展不方便的情況；
- JWT 中的Payload 負載可以存儲常用信息，用於信息交換，有效地使用JWT，可以降低服務端查詢數據庫的次數

### JWT 的缺點
- 加密問題: JWT 默認是不加密，但也是可以加密的。生成原始Token 以後，可以用密鑰再加密一次。
- 到期問題: 由於服務器不保存Session 狀態，因此無法在使用過程中廢止某個Token，或者更改Token 的權限。在無狀態Tokens 內存儲的數據最終會「過時」，不再反映數據庫內最新的數據。這意味著，Tokens 內保留的可能是過期的信息。也就是說，一旦JWT 簽發了，在到期之前就會始終有效，除非服務器部署額外的邏輯。
- 費空間: JWT Tokens 實際上並不「小」。尤其是使用無狀態JWT 時，所有的數據將會被直接編碼進Tokens 內，很快將會超過Cookies 或URL 的長度限制。你可能在想將它們存儲到Local Storage。然而，Local Storage 並沒有提供任何類似Cookies 的安全措施。LocalStorage 與Cookies 不同，並不會在每次請求時發送存儲的數據。
- 其實並不安全: 成上所述，將JWT Tokens 存儲到Cookies 內，那麼安全性與其他Session 機制無異。但如果你將JWT 存儲至其它地方，會導致一個新的漏洞。簡單來說，使用Cookies 並不是可選的，無論你是否採用JWT。
- 無法單獨銷毀: 不像Sessions 無論何時都可以單獨地在服務端銷毀。無狀態JWT Tokens 無法被單獨的銷毀。根據JWT 的設計，無論怎樣Tokens 在過期前將會一直保持有效。舉個例子，這意味著在檢測到攻擊時，你卻不能銷毀攻擊者的Session。同樣，在用戶修改密碼後，也無法銷毀舊的Sessions。對此，我們幾乎無能為力，除非重新構建複雜且有狀態（Stateful）的基礎設施來明確地檢測或拒絕特定Session，否則將無法結束會話。但這完全違背了使用無狀態JWT Tokens 的最初目的。

#### 補充
Cookies 是一種存儲機制，然而JWT Tokens 是被加密並簽名後產生的憑證。它們並不對立， 相反他們可以獨立或結合使用。正確的對比應當是：Session對比JWT，以及 Cookies 對比Local Storage。


###  結論
無狀態JWT Tokens 無法被單獨地銷毀或更新，取決於你如何存儲，可能還會導致長度問題、安全隱患。有狀態JWT Tokens 在功能方面與Session cookies 無異，但缺乏生產環境的驗證、經過大量Review 的實現，以及良好的客戶端支持。


## 簡述 DeWT
![](https://i.imgur.com/E4oWeDy.jpg)


### 產生 DeWT
1. 用戶訪問 TideBit-DeFi 使用 metamask 與 TideBit-DeFi 連結後
2. 為使用 TideBit-DeFi 的服務需使用自己的錢包簽 TideBit-DeFi 提供的相關的同意條款如 Term of services, private policy。
3. 用戶簽名的內容我們使用 eip712 寫在智能合約裡，將用戶簽名的結果加上簽名的內容即為 DeWT。
### 存取 DeWT
在用戶產生 DeWT 後使用 api 發送給後端伺服器，並將DeWT 將存放在用戶瀏覽器的 cookie 之中。
- 前端: 在每次發送 api 時要帶上 DeWT，並且需要定期到 cookie 檢查 DeWT 是否已過期。
- 後端: 在收到 DeWT，要先驗證此 DeWT(驗證方法稍後說明)是否合法，如合法需要到 DB 檢查此用戶是否存在，如存在就紀錄此登入行為，若不存在則需要建立新用戶並紀錄此登入行為。
### DeWT資料格式
DeWT 為簽名的內容加上用戶簽名的結果進行 rlp 編碼。

#### 簽名內容:
- domain: Tidebit-DeFi 的 domain
- version: Tidebit-DeFi 現在使用的版本
- agree： 服務條款的網址(Term of services)，隱私條款的網址(private policy)
  - 其中服務條款的網址、隱私條款的網址後面都有一個 hash 用來確定服務條款、隱私條款的版本
- signer： 用戶簽名錢包的地址
- expired： DeWT 的到期時間，簽名後的 1 小時到期。
- iat: issue at，DeWT 的簽名時間
```javascript!
const payload = {
    domain: "https://www.tidebit-defi.com",
    version: "",
    agree: ["https://www.tidebit-defi.com/term_of_service/{hash}", "https://www.tidebit-defi.com/private_policy/{hash}"],
    signer: "0xfc657dAf7D901982a75ee4eCD4bDCF93bd767CA4",
    expired: "{timestamp}",
    iat: "{timestamp}"
}
```
#### 簽名結果:
```javascript!
const signature = {
    r,
    s,
    v
}
```

### 驗證機制
後端在收到 DeWT 後，先將 DeWT 由rlp編碼轉回明文，
1. 檢查 DeWT 的 domain 是否正確
2. 檢查 DeWT 的 version 是否正確
3. 檢查用戶同意的條款是否為最新版
4. 檢查 DeWT 是否未過期,可透過 iat(issue at， 簽名時間)或是 expired等資訊=判斷。
5. 檢查用戶的簽名，由用戶的簽名結果加上明文內容反推出用戶的 publickey，再由 publickey 推出用戶的地址，與先前回推出的明文中提供的 signer比對是否一致，若一致才合法。


## Reference
- [What is a JWT? Understanding JSON Web Tokens](https://supertokens.com/blog/what-is-jwt)
- [How to Sign and Validate JSON Web Tokens – JWT Tutorial](https://www.freecodecamp.org/news/how-to-sign-and-validate-json-web-tokens/)
- [別再使用JWT 作為Session 系統！問題重重且很危險](https://learnku.com/articles/22616)
- [一文整理前后端鉴权方案！](https://z.itpub.net/article/detail/9DDEE4C5561AE916018002EA24608806)
- [session、token、jwt、oauth2](https://www.jianshu.com/p/f31ef35eb77c)
- [白话让你理解什么是oAuth2协议](https://zhuanlan.zhihu.com/p/92051359)
- [前后端接口鉴权全解：cookie、session、token 区别解析](https://ssshooter.com/2021-02-21-auth/)
- [还分不清 Cookie、Session、Token、JWT？](https://developer.aliyun.com/article/856618)
- [扒一扒Cookie、Session、Token、JWT、OAuth2、OIDC、SSO、Ids4一家的关系网](https://juejin.cn/post/7077540836229152775)
