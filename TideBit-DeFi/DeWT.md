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

## DeWT
![](https://i.imgur.com/LI3WkLk.jpg)


### 產生流程
DeWT 
### 資料格式
```javascript!
const payload = {
    domain: "https://www.tidebit-defi.com",
    version: "",
    signer: "0xfc657dAf7D901982a75ee4eCD4bDCF93bd767CA4",
    expired: "{timestamp}"
}
const signature = {
    r,
    s,
    v
}
```

### 存取位置
cookie
### 驗證機制

## Reference
- [What is a JWT? Understanding JSON Web Tokens](https://supertokens.com/blog/what-is-jwt)
