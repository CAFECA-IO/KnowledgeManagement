# 什麼是CSRF/XSRF?

CSRF 或 XSRF（Cross-Site Request Forgery）是一種網路攻擊方式，發生於使用者已經通過身份驗證並信任某應用程式的情況下，稱為跨站請求偽造。

簡單來說，攻擊者透過引誘使用者執行某些操作，例如點擊特定的連結或圖片，以冒用使用者在某應用程式中已完成的身份驗證，這樣攻擊者就能夠在使用者不知情的狀況下發送請求，執行例如更改密碼、進行資金移轉等危險操作。

舉個實際情境為例，你已經登入某個社交網站並且正在瀏覽一些貼文。這個網站上有一個按鈕可以修改你的帳戶設定，包括電子郵件地址和密碼。

不幸的是，有個攻擊者知道這個修改帳戶設定的請求是透過一個特定的網址發送的。攻擊者製作了一個誘人的連結，像是一張有趣的梗圖，故意吸引你點擊。而你就這樣被這張梗圖吸引，點擊了連結。

登愣！實際上這個是請求修改帳戶設定的連結所偽裝。然而因爲你已經在社交網站上保持登入狀態，因此點擊此連結時瀏覽器中的相關憑證（如Cookie）也會被一同發送。攻擊者成功冒充你的身份，讓伺服器錯誤地認為這是你發送的合法請求，最終造成帳戶設定被不當修改，但你可能毫不知情。

# 如何預防CSRF/XSRF？

這種情況下，如果該社交媒體網站使用了CSRF令牌，攻擊者將難以成功進行這樣的攻擊，因為CSRF令牌是唯一的，攻擊者無法模擬或取得。這樣就能更有效地保護用戶免受CSRF攻擊的威脅。

為了防範CSRF/XSRF攻擊，開發者通常會使用驗證令牌等機制，確保請求是由合法的使用者發送的，而不是被冒充的。

### 1. 增加所有敏感動作的驗證方式

增加所有敏感動作的驗證方式，例如：執行金流、提交個資等......，多加一道驗證機制做防護。

### 2. CSRF Token (todo: 實作方法)
增加無法預測的參數：在表單或是HTTP請求的自定義頭部（header）中加入一個CSRF token，並要求客戶端發送請求時，必須要包含這個token。通過使用 CSRF token，即使攻擊者能夠誘使使用者發送請求，但由於攻擊者無法獲取到有效的 CSRF token，這些請求將不會被伺服器端受理。

- 流程一：產生 token

    使用者打開網頁後，伺服器端生成一個**使用者名稱**加上**隨機亂數**或是**時間戳記**後並加密組合產生的一組 token(可以為每個請求或是每個 session 生成一次)，並把 token 放在 session 中，接著把 token 傳給客戶端(不可以放在客戶端的 cookie，不然就可能會曝光給惡意網站了。)

- 流程二：傳送請求

    之後只要客戶端頁面在提交請求時，都需要加上這個 token，請求才會被允許。
  
    對於 GET 請求，token 通常會附在請求的網址之後，如： `http://url?csrftoken=tokenvalue`
  
    而 POST 請求則通常會在表單的最後加上，如：
    ```
    html
    <input type="hidden" name="csrftoken" value="tokenvalue"/>
    ```

- 流程三：伺服器端驗證

    當客戶端發送有請求的 token 給伺服器端時，伺服器端為了要確定 token 的時間有效性和正確性，會先解密 token，對比使用者名稱和當時的隨機亂數或時間戳記，如果資料一致而且時間戳記沒有過期，伺服器端就會通過驗證，確認 token 是有效的。
  
（以下待整理)
### 3. 不要用`GET` 做關鍵操作
POST一定要用戶點擊，不像GET可以直接在完全不知情下就被送出

### 4. 檢查 Referrer
在 HTTP 的標頭中有 Referrer 的字段，我們可以檢查這個字段，來確保請求不是來自於其他網站。
但是referer可能不會傳送是瀏覽器加的，可能不傳送或是瀏覽器很爛被偽造。

### 5. 瀏覽器本身防護 - SameSite cookies

由於許多 CSRF 攻擊是因為 cookie 被惡意網站使用，拿來偽造請求。假如要避免這發生，其實可以透過限定 cookie 只能被自己的網站使用。要如何限定 cookie 只能被自己網站用呢? 我們可以透過 SameSite cookies 來做到。

#### Cookie的[同源政策](https://crypto.stanford.edu/cs142/lectures/10-cookie-security.pdf)
cookie的同源政策不會看port

只要連上的網站其 **Domain 跟 Path 與 Cookie 一致**，**就會被視為同源．拜訪該網站時，Cookie 就會被送出**
所以才做的到CSRF
![[CSRF Cross Site Request Forgery-20231127180312618.png]]

#### 什麼是 SameSite
[SameSite](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite) 主要是針對 Cookie 的一種安全機制，限制 Cookie 僅在第一方情境下使用 (即禁止第三方情況下的使用)，實做上是將 SameSite 定義放置於在Http Response Header 中， 屬於 Set-Cookie 的一個屬性。([MDN SameSite](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite))

##### SameSite=Strict
SameSite=Strict 會將 Cookie 限制在**第一方**的情況下使用
舉例來說，當瀏覽 facebook.com 時，此時 facebook.com 被視為**第一方**，當你登入 facebook.com 時在你的瀏覽器存入『登入用的 Cookie』 ，並限制為 `SameSite=Strict` ，此時這個 Cookie 被視為第一方 Cookie ，因此你在瀏覽其他 facebook.com頁面時，都被視為在『第一方』的情況下使用，所以Cookie 會被帶上，在你瀏覽時 Cookie 會被送出到 facebook.com，保持登入狀態

但是，在你瀏覽部落格 medium.com 時，此時 medium.com 被視為第一方，先前 facebook.com 存入的 Cookie ，此時被視為 『第三方』了，當你從 medium 點選 facebook 連結連到 facebook 時，此時被視為 『第三方』的 facebook.com Cookie 不會被送出，你連到 facebook 需要重新登入
![[CSRF Cross Site Request Forgery-20231127180647327.png]]

#####  SameSite=Lax
SameSite=Lax 允許部分 HTML 標籤情況下發送第三方 Cookie。**但允許的範圍跟先前只有 Cookie 同源政策時又有些不同**。
Lax 則是限制 `POST`、 `DELETE`、`PUT` 都不帶上 Cookie，`GET` 則會帶上 Cookie
> 預設的 SameSite=Lax 是允許 Form做 GET 時，送出 Cookie 的

因此，若是你的 **API 採用 GET 做一些會**『**更改狀態**』**的操作**，例如：刪除文章或更改帳戶等等**。**那麼你還是有可能將你的應用程式置於危險之中，遭受到 CSRF 攻擊**。**

請務必用POST
![[CSRF Cross Site Request Forgery-20231127180957616.png]]

##### SameSite=None; Secure

SameSite=None 相較於 Lax 又開放了更多第三方 Cookie 的使用情境，例如：iframe、AJAX、Image **。但是以 Chrome 瀏覽器的規定，這項設定必須配合加上 Secure，限制在 Https 下傳輸才可以生效。**

ref.
https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
https://www.synopsys.com/glossary/what-is-csrf.html
