# 什麼是CSRF/XSRF?

CSRF 或 XSRF（Cross-Site Request Forgery）是一種網路攻擊方式，發生於使用者已經通過身份驗證並信任某應用程式的情況下，稱為跨站請求偽造。

簡單來說，攻擊者透過引誘使用者執行某些操作，例如點擊特定的連結或圖片，以冒用使用者在某應用程式中已完成的身份驗證，這樣攻擊者就能夠在使用者不知情的狀況下發送請求，執行例如更改密碼、進行資金移轉等危險操作。

舉個實際情境為例，你已經登入某個社交網站並且正在瀏覽一些貼文。這個網站上有一個按鈕可以修改你的帳戶設定，包括電子郵件地址和密碼。

不幸的是，有個攻擊者知道這個修改帳戶設定的請求是透過一個特定的網址發送的。攻擊者製作了一個誘人的連結，像是一張有趣的梗圖，故意吸引你點擊。而你就這樣被這張梗圖吸引，點擊了連結。

登愣！實際上這個是請求修改帳戶設定的連結所偽裝。然而因爲你已經在社交網站上保持登入狀態，因此點擊此連結時瀏覽器中的相關憑證（如 cookie）也會被一同發送。攻擊者成功冒充你的身份，讓伺服器錯誤地認為這是你發送的合法請求，最終造成帳戶設定被不當修改，但你可能毫不知情。

# 如何預防CSRF/XSRF？

這種情況下，如果該社交媒體網站使用了 CSRF token，攻擊者將難以成功進行這樣的攻擊，因為 CSRF token 是唯一的，攻擊者無法模擬或取得。這樣就能更有效地保護用戶免受 CSRF 攻擊的威脅。

為了防範 CSRF/XSRF 攻擊，開發者通常會使用驗證 token 等機制，確保請求是由合法的使用者發送的，而不是被冒充的。

### 1. 增加所有敏感動作的驗證方式

增加所有敏感動作的驗證方式，例如：執行金流、提交個資等......，多加一道驗證機制做防護。

### 2. CSRF Token
增加無法預測的參數：在表單或是HTTP請求的自定義頭部（header）中加入一個 CSRF token，並要求客戶端發送請求時，必須要包含這個 token。通過使用 CSRF token，即使攻擊者能夠誘使使用者發送請求，但由於攻擊者無法獲取到有效的 CSRF token，這些請求將不會被伺服器端受理。

- 流程一：產生 token

    使用者打開網頁後，伺服器端生成一個**使用者名稱**加上**隨機亂數**或是**時間戳記**後並加密組合產生的一組 token(可以為每個請求或是每個 session 生成一次)，並把 token 放在 session 中，接著把 token 傳給客戶端(不可以放在客戶端的 cookie，不然就可能會曝光給惡意網站了。)
  - 使用 Node.js 和 crypto 模組的簡單實作範例
    ```
    javascript
    
    import crypto from 'crypto';

    // 用戶名稱和伺服器端密鑰
    const username = 'user123';
    const secretKey = 'your-secret-key';
    
    // 生成隨機亂數和時間戳記
    const randomBytes = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now().toString();
    
    // 組合資料
    const data = `${username}:${randomBytes}:${timestamp}`;
    
    // 使用 HMAC 加密資料
    function generateToken(data, key) {
        return crypto.createHmac('sha256', key).update(data).digest('hex');
    }
    
    // 生成 token
    const token = generateToken(data, secretKey);

    // 輸出加密後的 token
    console.log(token);

    // 處理 GET 請求至 '/form', 儲存加密後的 token 到 session 中並發送給客戶端
    app.get('/form', (req, res) => {
        // 儲存到 session
        req.session.csrfToken = token;
        // 傳遞到前端模板
        res.render('form', { csrfToken }); 
    });    
    ```

- 流程二：傳送請求

    之後只要客戶端頁面在提交請求時，都需要加上這個 token，請求才會被允許。
  
    對於 GET 請求，token 通常會附在請求的網址之後，如： `http://url?csrftoken=tokenvalue`
  
    而 POST 請求則通常會在表單的最後加上，如：
    ```
    html
    
    <form action="/submit-form" method="post">
        <!-- ... 其他表單字段 ... -->
    
        <!-- 隱藏字段儲存 csrfToken -->
        <input type="hidden" name="_csrfToken" value="<%= csrfToken %>">
    
        <button type="submit">提交表單</button>
    </form>
    ```

- 流程三：伺服器端驗證

    當客戶端發送有請求的 token 給伺服器端時，伺服器端將這個 token 與儲存在 session 中的 token 做比較，如果兩個值相同，表示訊息是真實且未被篡改的，伺服器端就會通過驗證及請求，確認 token 是有效的。
  
### 3. 不使用 `GET` 做關鍵操作
`GET`請求可以通過簡單的 URL 訪問來執行，因此非常容易受到 CSRF 攻擊。例如，攻擊者可以在他們控制的網站上放置一張圖片，其 src 屬性設置為一個執行關鍵`GET`請求操作的 URL。當受害者訪問該網站時，圖片會自動加載，從而無意中發送了`GET`請求，如果受害者已經登入了目標網站，該請求將以受害者的身份執行。

相反，`POST`請求通常用於提交數據到伺服器，如表單提交。不會自然地透過 URL 傳遞，通常需要一個使用者動作（如點擊按鈕）來發起，這意味著攻擊者不能僅僅通過一個簡單的 URL 來引誘使用者無意中發送`POST`請求。

### 4. 檢查 Referer
在 HTTP 請求中，Referer 這個標頭字段用來顯示該請求是從哪個頁面發起的。一些網站會檢查這個 Referer 標頭來判斷是否要接受該請求，確保請求不是來自於其他網站。
然而，僅僅依賴 Referer 標頭來防禦 CSRF 攻擊並不足夠，因為進階的攻擊者可能會利用瀏覽器漏洞或其他手段偽造 Referer 標頭，或是瀏覽器出於安全性或兼容性原因而不會發送 Referer 標頭。

### 5. 瀏覽器本身防護 - SameSite cookies

許多 CSRF 攻擊是因為 cookie 被惡意網站使用來發送偽造請求。要避免這個情況發生，可以透過 SameSite cookies 來設定 cookie 只能在第一方情境下被網站使用。

cookie 的同源政策不會看 Port 埠號，只要發送請求的網站其 **Domain 網域** 跟 **Path 路徑** 與 cookie 一致，就會被視為同源．發送請求時 cookie 會一併被送出。

#### 延伸閱讀
- [Cookie Same Origin Policy 同源政策說明](https://crypto.stanford.edu/cs142/lectures/10-cookie-security.pdf)
- [Set-Cookie 實作](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
  - 將 Set-Cookie 定義放置於 Http 中
    ```  
    Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>
    Set-Cookie: <cookie-name>=<cookie-value>; Expires=<date>
    Set-Cookie: <cookie-name>=<cookie-value>; HttpOnly
    Set-Cookie: <cookie-name>=<cookie-value>; Max-Age=<number>
    Set-Cookie: <cookie-name>=<cookie-value>; Partitioned
    Set-Cookie: <cookie-name>=<cookie-value>; Path=<path-value>
    Set-Cookie: <cookie-name>=<cookie-value>; Secure
    
    Set-Cookie: <cookie-name>=<cookie-value>; SameSite=Strict
    Set-Cookie: <cookie-name>=<cookie-value>; SameSite=Lax
    Set-Cookie: <cookie-name>=<cookie-value>; SameSite=None; Secure
    
    // Multiple attributes are also possible, for example:
    Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>; Secure; HttpOnly
    ```
  - SameSite=Strict
    
    SameSite=Strict 會限定 cookie 在**第一方**的情境下使用。
    舉例來說，當瀏覽 facebook.com 時，此時 facebook.com 被視為**第一方**，當你登入 facebook.com 時在你的瀏覽器存入登入用的 cookie ，並限制為 `SameSite=Strict` ，此時這個 cookie 被視為第一方 cookie，因此當你在瀏覽其他 facebook.com 頁面時，都會被視為在**第一方**的情境下使用，所以在瀏覽時 cookie 會被帶上並被送出，以保持登入狀態。
    
    但是，在你瀏覽部落格 medium.com 時，此時 medium.com 被視為第一方，先前 facebook.com 存入的 cookie 在此時被視為第三方了，故當你從 medium.com 裡點選 facebook 連結到 facebook 時，被視為第三方的 facebook.com cookie 不會被送出，因此連到 facebook 時需要重新登入。

  - SameSite=Lax
    
    SameSite=Lax 允許部分 HTML 標籤發送第三方 cookie。Lax 限制`POST`、`DELETE`、`PUT`都不帶上 cookie，`GET` 則會帶上 cookie。因此，若是會更改狀態的操作請務必用`POST`，避免將應用程式置於危險之中。

  - SameSite=None; Secure
    
    SameSite=None 相較於 Lax 又開放更多第三方 cookie 的使用情境，例如：iframe、AJAX、Image。這項設定必須配合加上 Secure，限制在 Https 下傳輸才可以生效。
