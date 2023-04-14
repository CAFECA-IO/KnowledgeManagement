
# Decentralized Web Token（DeWT)
Decentralized Web Token（DeWT) 是我們專為 TideBit-DeFi 設計的去中心化認證機制，其原理參考 [JWT](https://supertokens.com/blog/what-is-jwt) 的認證機制，兩者主要的不同在於 JWT 是由網站所核發(是一種中心式的認證機制)而 DWT 則是由用戶所核發，並且兩者簽署的內容也不同。

## 常見的前後端鑑權方式
- session - cookie
- Token 驗證(包括JWT，SSO)
- OAuth2.0（開放授權）

### 認證 (Identification)
是指根據聲明者所特有的識別信息，確認聲明者的身份。例如身分證、指紋

### 授權 (Authorization)
在信息安全領域是指資源所有者委派執行者，賦予執行者指定範圍的資源操作權限，以便對資源的相關操作。

- 在現實生活領域例如：銀行卡（由銀行派發）、門禁卡（由物業管理處派發）、鑰匙（由房東派發），這些都是現實生活中授權的實現方式。
- 在互聯網領域例如： web 服務器的session 機制、web 瀏覽器的cookie 機制、頒發授權令牌（token）等都是一個授權的機制、oauth。

### 憑證（Credentials）
實現認證和授權的前提是需要一種媒介（證書） 來標記訪問者的身份。

### 鑑權 (Authentication)
在信息安全領域是指對於一個聲明者所聲明的身份權利，對其所聲明的真實性進行鑑別確認的過程。在互聯網領域：校驗session/cookie/token 的合法性和有效性。


## Session-Cookie 鑑權
Session-Cookie認證是利用服務端的Session（會話）和瀏覽器（客戶端）的Cookie 來實現的前後端通信認證模式。

### 什麼是Cookie
HTTP 是無狀態協議（對於事務處理沒有記憶能力，每次客戶端和服務端會話完成時，服務端不會保存任何會話信息）。所以為了讓服務器區分不同的客戶端，就必須主動的去維護一個狀態，這個狀態用於告知服務端前後兩個請求是否來自同一瀏覽器。而這個狀態可以通過Cookie去實現。

#### Cookie特點：
- Cookie 存儲在客戶端，可隨意篡改，不安全
- 有大小限制，大為4kb
- 有數量限制，一般一個瀏覽器對於一個網站只能存不超過20 個Cookie，瀏覽器一般只允許存放300個Cookie，Android 和IOS 對Cookie 支持性不好
- Cookie 是不可跨域的，但是一級域名和二級域名是允許共享使用的（靠的是domain）
### 什麼是Session
Session 的抽象概念是會話，是無狀態協議通信過程中，為了實現中斷/繼續操作，將用戶和服務器之間的交互進行的一種抽象；
具體來說，是服務器生成的一種Session 結構，可以通過多種方式保存，如內存、數據庫、文件等，大型網站一般有專門的Session 服務器集群來保存用戶會話；

#### 原理流程：
- 客戶端：用戶向服務器發送請求；
- 服務器：接收到數據並自動為該用戶創建特定的Session / Session ID，來標識用戶並跟踪用戶當前的會話過程；
- 客戶端：瀏覽器收到響應獲取會話信息，並且會在下一次請求時帶上Session / Session ID；
- 服務器：服務器提取後會與本地保存的Session ID進行對比找到該特定用戶的會話，進而獲取會話狀態；
- 至此客戶端與服務器的通信變成有狀態的通信；

#### Session特點：
Session 保存在服務器上，通過服務器自帶的加密協議進行。

### Session-Cookie 認證步驟解析
1. 客戶端：向服務器發送登錄信息用戶名/密碼來請求登錄校驗；
2. 服務器：驗證登錄的信息，驗證通過後自動創建Session（將Session 保存在內存中，也可以保存在Redis 中），然後給這個Session 生成一個的標識字符串會話身份憑證session_id(通常稱為sid)，並在響應頭Set-Cookie中設置這個標識符； **注：可以使用簽名對sid進行加密處理，服務端會根據對應的secret密鑰進行解密（非必須步驟）**
3. 客戶端：收到服務器的響應後會解析響應頭，並自動將sid保存在本地Cookie 中，瀏覽器在下次HTTP 請求時請求頭會自動附帶上該域名下的Cookie 信息；
4. 服務器：接收客戶端請求時會去解析請求頭Cookie 中的sid，然後根據這個sid去找服務端保存的該客戶端的sid，然後判斷該請求是否合法；

### Session-Cookie 的優點
1. Cookie 簡單易用
2.Session 數據存儲在服務端，相較於JWT 方便進行管理，也就是當用戶登錄和主動註銷，只需要添加刪除對應的Session 就可以了，方便管理
只需要後端操作即可，前端可以無感等進行操作；

### Session-Cookie 的缺點
1. 依賴Cookie，一旦用戶在瀏覽器端禁用Cookie，那麼就無法使用；
2. 不算安全，Cookie 將數據暴露在瀏覽器中，增加了數據被盜的風險（容易被CSRF 等攻擊）；
3. Session 存儲在服務端，增大了服務端的開銷，用戶量大的時候會大大降低服務器性能；
4. 對移動端的支持性不友好；

##  Token 鑑權
### 什麼是Token
Token是一個資源憑證，客戶端訪問服務器時，驗證通過後服務端會為其簽發一張憑證，之後，客戶端就可以攜帶憑證訪問服務器，服務端只需要驗證憑證的有效性即可。一句話概括；訪問資源接口（API）時所需要的資源憑證。

#### 一般Token 的組成：
uid (用戶的身份標識) + time (當前時間的時間戳) + sign (簽名，Token 的前幾位以哈希算法壓縮成的一定長度的十六進製字符串)

### Token 認證步驟解析：

1. 客戶端：輸入用戶名和密碼請求登錄校驗；
2. 服務器：收到請求，去驗證用戶名與密碼；驗證成功後，服務端會簽發一個Token 並把這個Token 發送給客戶端；
3. 客戶端：收到Token 以後需要把它存儲起來，web 端一般會放在localStorage 或Cookie 中，移動端原生APP 一般存儲在本地緩存中；
4. 客戶端發送請求：向服務端請求API 資源的時候，將Token 通過HTTP 請求頭Authorization 字段或者其它方式發送給服務端；
5. 服務器：收到請求，然後去驗證客戶端請求裡面帶著的Token ，如果驗證成功，就向客戶端返回請求的數據，否則拒絕返還（401）；

### Token 的優點：
- 服務端無狀態化、可擴展性好： Token 機制在服務端不需要存儲會話（Session）信息，因為Token 自身包含了其所標識用戶的相關信息，這有利於在多個服務間共享用戶狀態
- 支持APP 移動端設備；
- token 完全由應用管理，所以它可以避開同源策略
- 支持跨程序調用：因為Cookie 是不允許跨域訪問的，而Token 則不存在這個問題

### Token 的缺點：
- 配合：需要前後端配合處理；
- 佔帶寬：正常情況下比sid更大，消耗更多流量，擠占更多寬帶
- 性能問題：雖說驗證Token 時不用再去訪問數據庫或遠程服務進行權限校驗，但是需要對Token 加解密等操作，所以會更耗性能；
- 有效期短：為了避免Token 被盜用，一般Token 的有效期會設置的較短；

### Token 和Session 的區別
Session-Cookie和Token有很多類似的地方。 Session 是一種記錄服務器和客戶端會話狀態的機制，使服務端有狀態化，可以記錄會話信息。而Token 是憑證，訪問資源接口（API）時所需要的資源憑證。Token 使服務端無狀態化，不會存儲會話信息。
- 存儲地不同： Session 一般是存儲在服務端；Token 是無狀態的，一般由前端存儲；
- 安全性不同： Session 和Token 並不矛盾，作為身份認證Token 安全性不一定比Session 好，雖然每一個請求都有簽名還能防止監聽以及重放攻擊，但人家拿走了就可以直接用；反之session 內部完全可以實作加密機制。
- 支持性不同： Session-Cookie 認證需要靠瀏覽器的Cookie 機制實現，如果遇到原生NativeAPP 時這種機制就不起作用了，或是瀏覽器的Cookie 存儲功能被禁用，也是無法使用該認證機制實現鑑權的；而Token 驗證機制豐富了客戶端類型。

### Token 和JWT 的區別
#### 相同：

- 都是訪問資源的憑證
- 都可以記錄用戶的信息
- 都是使服務端無狀態化
- 都是只有驗證成功後，客戶端才能訪問服務端上受保護的資源
#### 區別：
- Token：服務端驗證客戶端發送過來的Token 時，還需要查詢數據庫獲取用戶信息，然後驗證Token 是否有效。
- JWT： 將Token 和Payload 加密後存儲於客戶端，服務端只需要使用密鑰解密進行校驗（校驗也是JWT 自己實現的）即可，不需要查詢或者減少查詢數據庫，因為JWT 自包含了用戶信息和加密的數據。

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


## OAuth 2.0
OAuth是一個開放標準，允許用戶授權第三方網站(CSDN、思否等) 訪問他們存儲在另外的服務提供者上的信息，而不需要將用戶名和密碼提供給第三方網站；簡單說，OAuth 就是一種授權機制。數據的所有者告訴系統，同意授權第三方應用進入系統，獲取這些數據。系統從而產生一個短期的進入憑證（Token），用來代替密碼，供第三方應用使用。

### 憑證與密碼的差異：
憑證（Token）與密码（Password）的作用是一樣的，都可以進入系統，但是有三點差異。
- 憑證是短期的，到期會自動失效：用戶自己無法修改。密碼一般長期有效，用戶不修改，就不會發生變化。
- 憑證可以被數據所有者撤銷，會立即失效。
- 憑證有權限範圍（scope）：對於網絡服務來說，只讀憑證就比讀寫憑證更安全。密碼一般是完整權限。

OAuth 2.0 對於如何頒發憑證的細節，規定得非常詳細。具體來說，一共分成四種授權模式（Authorization Grant），適用於不同的互聯網場景。

無論哪個模式都擁有三個必要角色：客户端、授權服務器、資源服務器，有的還有用户（資源拥有者），下面簡單介紹下四種授權模式。

#### 授權碼模式
授權碼模式（Authorization Code Grant)方式，指的是第三方應用先申請一個授權碼，然後再用該碼獲取憑證。
這種方式是常用的流程，安全性也高，它適用於那些有後端服務的Web 應用。授權碼通過前端傳送，憑證則是儲存在後端，而且所有與資源服務器的通信都在後端完成。這樣的前後端分離，可以避免憑證洩漏。

#### 隱藏式模式（Implicit Grant）
有些Web 應用是純前端應用，沒有後端。這時就不能用上面的方式了，必須將令牌儲存在前端。OAuth2.0 就規定了第二種方式，允許直接向前端頒發憑證。這種方式沒有授權碼這個中間步驟，所以稱為（授權碼）"隱藏式"（implicit）。

#### 用戶名密碼式模式（Password Credentials Grant）
如果你高度信任某個應用，OAuth 2.0 也允許用戶把用戶名和密碼，直接告訴該應用。該應用就使用你的密碼，申請憑證，這種方式稱為"密碼式"（password）。

#### 客戶端模式（Client Credentials Grant）
客戶端模式指客戶端以自己的名義，而不是以用戶的名義，向授权服务器進行認證。

主要適用於沒有前端的命令行應用。


## Reference
- [What is a JWT? Understanding JSON Web Tokens](https://supertokens.com/blog/what-is-jwt)
- [How to Sign and Validate JSON Web Tokens – JWT Tutorial](https://www.freecodecamp.org/news/how-to-sign-and-validate-json-web-tokens/)
- [別再使用JWT 作為Session 系統！問題重重且很危險](https://learnku.com/articles/22616)
- [一文整理前后端鉴权方案！](https://z.itpub.net/article/detail/9DDEE4C5561AE916018002EA24608806)
- [session、token、jwt、oauth2](https://www.jianshu.com/p/f31ef35eb77c)
