# Decentralized Web Token（DeWT)
Decentralized Web Token（DeWT) 是我們專為 TideBit-DeFi 設計的去中心化認證機制，其原理參考 [JWT](https://supertokens.com/blog/what-is-jwt) 的認證機制，兩者主要的不同在於 JWT 是由網站所核發(是一種中心式的認證機制)而 DWT 則是由用戶所核發，並且兩者簽署的內容也不同。

## 簡述 JWT 
![](https://i.imgur.com/oCqGJKP.jpg)


JWT 為 JSON Web Token 是一種開放標準（RFC 7519），它定義了一種簡單穩定的方式來表示身份驗證和授權數據。是由用戶提交登入的帳號密碼後，由伺服器根據用戶的資料產生對應的 JSON ，其 JSON 含有三個部份 header、payload、signature，Token 則是 header、payload、signature 分別用 [Base64 編碼](https://www.base64encode.org/) 後得到的結果用點(.)將三者串聯起來。
```javascript
const JWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.e25hbWU6Ikpob24gRG9lIixleHBpcmVkOjE2ODA3NjE1MDAzMDEsYWRtaW46dHJ1ZX0.PT7k3siYn67lJBMYzQkj/yLsLt1SYGztgTTiR5or1Ss='
```

- header: 是實作 JWT 共用的格式，註明類別(typ)為(JWT)，加密演算法(alg)為(HS256)，以 `{"typ":"JWT","alg":"HS256"}` 為例 Base64 編碼的結果為 `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9`。
- payload: 裡面則是包含有前後端需要共享的資訊，以 `{name:"Jhon Doe",expired:1680761500301,admin:true}` 為例 Base64 編碼的結果為 `e25hbWU6Ikpob24gRG9lIixleHBpcmVkOjE2ODA3NjE1MDAzMDEsYWRtaW46dHJ1ZX0`。
- signature: 由後端持有的 private key 對 header 及 payload Base64Encoded 的結果使用 HMACSHA256 演算法簽名，將簽名的結果也進行 Base64 編碼。

### (補) 驗證流程

## DeWT
![](https://i.imgur.com/LI3WkLk.jpg)

### 流程
#### 產生DeWT
用戶訪問 TideBit-DeFi 使用 metamask 與 TideBit-DeFi 連結後，為使用 TideBit-DeFi 的服務需使用自己的錢包簽 TideBit-DeFi 提供的相關的同意條款如 Term of services, private policy。用戶簽名的內容我們使用 eip712 寫在智能合約裡，將用戶簽名的結果加上簽名的內容即為 DeWT。
#### 存取
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
```javascript!
const payload = {
    domain: "https://www.tidebit-defi.com",
    version: "",
    agree: ["https://www.tidebit-defi.com/term_of_service/{hash}", "https://www.tidebit-defi.com/private_policy/{hash}"],
    signer: "0xfc657dAf7D901982a75ee4eCD4bDCF93bd767CA4",
    expired: "{timestamp}"
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
4. 檢查 DeWT 是否未過期
5. 檢查用戶的簽名，由用戶的簽名結果加上明文內容反推出用戶的 publickey，再由 publickey 推出用戶的地址，與先前回推出的明文中提供的 signer比對是否一致，若一致才合法。
## Reference
- [What is a JWT? Understanding JSON Web Tokens](https://supertokens.com/blog/what-is-jwt)
