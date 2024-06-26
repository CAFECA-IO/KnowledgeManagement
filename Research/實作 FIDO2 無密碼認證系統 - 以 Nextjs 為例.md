# 實作 FIDO2 無密碼認證系統 - 以 Nextjs 為例

## 摘要

本文說明如何在Next.js專案中，整合FIDO2標準，以增強應用程序的安全性和用戶體驗。透過安裝`@passwordless-id/webauthn`庫，開發者可以在前端和後端實現無密碼身份驗證功能。前端部分涉及調用WebAuthn API來生成公鑰，並將其發送到後端進行註冊。後端則負責驗證從前端收到的簽名，以完成用戶登入過程。此外，還需注意瀏覽器的安全原則，確保前端運行在安全的來源上，以避免API呼叫失敗。FIDO2的實施分為註冊和登入兩個階段，涉及到客戶端、伺服器端和工具模組的協同工作。註冊過程中，用戶通過FIDO2設備進行身份驗證，並將公鑰註冊到伺服器。登入時，用戶再次透過FIDO2設備進行身份驗證，並將簽名發送到伺服器以完成登入。整個過程強調了Base64編碼的安全性和挑戰/回應模式的重要性，這對於維護安全性和提供無密碼登入體驗至關重要。

示意圖
## 研究目標

在現有的next.js專案服務中加入FIDO2功能，以提升使用者的安全性和便利性。

## [passwordless-id / webauthn](https://github.com/passwordless-id/webauthn/tree/main)

### 安裝 webauthn 庫

```bash
npm install @passwordless-id/webauthn
```

### 安裝 next.js 庫

```bash
npx create-next-app@latest
```

自由選擇以下所需的設定，不影響後續實作

```bash
What is your project named? my-app
Would you like to use TypeScript? No / Yes
Would you like to use ESLint? No / Yes
Would you like to use Tailwind CSS? No / Yes
Would you like to use `src/` directory? No / Yes
Would you like to use App Router? (recommended) No / Yes
Would you like to customize the default import alias (@/*)? No / Yes
What import alias would you like configured? @/*
```

## 前後端添加功能示意圖
![截圖 2024-03-26 下午5 29 10](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/ae6aaf30-7eb7-4da1-8a93-19e0c00744d5)

> [!WARNING] 由於瀏覽器安全設定，前端必須屬於Secure Origin才能使用，否則會有安全性限制，無法讀取某些瀏覽器敏感資料，因此API會呼叫失敗。

> [!TIP] 根據Chromium的網站說明，Secure Origin包含但不限制於以下幾種模式：
>
> - (https, *,*)
> - (wss, *,*)
> - (*, localhost,*)
> - (*, 127/8,*)
> - (*, ::1/128,*)
> - (file, *, —)
> - (chrome-extension, *, —)

## 實作原理流程圖

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/58aa050a-f0a8-4cd2-85c3-44cd0f3715b5)


## 使用情境：用戶授權給XXX網站登入，有效時間為60分鐘

基本上，FIDO2的加入可以分為兩個部分：註冊和登入。在註冊階段，使用者需要透過FIDO2設備進行身份驗證，並將公鑰傳送至伺服器進行註冊。在登入階段，使用者需要透過FIDO2設備進行身份驗證，並將簽名傳送至伺服器進行登入。

圍繞這兩個功能主要會使用到3個modules：

- client：用於在瀏覽器中調用webauthn
- server：用於在伺服器中驗證回應
- utils：各種編碼、解碼、挑戰生成器和其他工具

前端的client部分主要負責調用webauthn API，並將獲得的公鑰傳送至伺服器進行註冊。後端的server部分主要負責驗證從前端獲得的簽名，並進行登入。

## 程式範例 [DEMO](https://github.com/CAFECA-IO/webauthntest)

首先在page.tsx存在的資料夾創建 myButton.tsx，之後會作為page的component引入至page，在myButton.tsx模擬前後端的註冊與登入功能

## 按鈕範例

myButton.tsx

```javascript
export function MyButton() {
// 創建挑戰
// 註冊
// 登入
// 驗證註冊
// 驗證登入
return (
    <div>
      <button
        className={`mb-3 text-2xl font-semibold`}
        onClick={() => register()}
      >
        register
      </button>
      <br />
      <button className={`mb-3 text-2xl font-semibold`} onClick={() => login()}>
        login
      </button>
      <br />
    </div>
  );
}
```

page.tsx 

```javascript
import { MyButton } from "./myButton";
...
// 於刪除預設DOM中的element並加入以下element
<div>
        <MyButton/>
</div>
```

## 創建挑戰範例

在FIDO2中所有簽署動作都伴隨一個挑戰(Challenge)，而挑戰為一串Base64字串，這邊可以利用Utils將想驗證的資訊，例如Create Timestamp轉換以下為範例

```javascript
import { utils } from '@passwordless-id/webauthn'
 async function createChallenge(
       message: string
     ) {
       let ArrayBuffer = utils.toBuffer(message);
       let challenge = utils.toBase64url(ArrayBuffer);
       challenge =utils.toBase64url(ArrayBuffer)
       challenge = challenge.replace(/=/g, "");
       return challenge;
     };
let challenge = await createChallenge('FIDO2.TEST.reg-'+ (Date.now()+ 60000).toString()+ '-hello');
return challenge // RklETzIuVEVTVC5sb2dpbi0xNzExNzAxNjUwNTQ3LWhlbGxv
```
> [!NOTE] Base64字串須為URL安全的，因為實測utils.toBase64url仍會出現不符合規定的Base64字串，因此須將用來補全的`=`刪除。

## 註冊範例

### 前端

1. 前端發送request到後端獲取挑戰，
2. 前端利用獲取的挑戰生成公鑰與資料

   - 傳送範例

   ```javascript
   import { client } from '@passwordless-id/webauthn' 
   const challenge = 'RklETzIuVEVTVC5sb2dpbi0xNzExNzAxNjUwNTQ3LWhlbGxv';
   const name = "Arnaud"
   const options? = {
     authenticatorType: "auto",
     userVerification: "required",
     timeout: 60000,
     attestation: true,
     userHandle: "Optional server-side user id. Must not reveal personal information.",
     debug: false
   }
   const registration = await client.register(name, challenge, options)
   ```

   - 產生之registration object範例

    ```JSON
    {
    "username": "Arnaud",
    "credential": {
        "id": "3924HhJdJMy_svnUowT8eoXrOOO6NLP8SK85q2RPxdU",
        "publicKey": "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEgyYqQmUAmDn9J7dR5xl-HlyAA0R2XV5sgQRnSGXbLt_xCrEdD1IVvvkyTmRD16y9p3C2O4PTZ0OF_ZYD2JgTVA==",
        "algorithm": "ES256"
    },
    "authenticatorData": "SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2NFAAAAAAiYcFjK3EuBtuEw3lDcvpYAIN_duB4SXSTMv7L51KME_HqF6zjjujSz_EivOatkT8XVpQECAyYgASFYIIMmKkJlAJg5_Se3UecZfh5cgANEdl1ebIEEZ0hl2y7fIlgg8QqxHQ9SFb75Mk5kQ9esvadwtjuD02dDhf2WA9iYE1Q=",
    "clientData": "eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoiYTdjNjFlZjktZGMyMy00ODA2LWI0ODYtMjQyODkzOGE1NDdlIiwib3JpZ2luIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwIiwiY3Jvc3NPcmlnaW4iOmZhbHNlfQ=="
    }
    ```

### 後端

1. 後端收到registration object，並驗證正確性

    ```javascript
    import { server } from '@passwordless-id/webauthn' 

    const expected = {
        challenge: "a7c61ef9-dc23-4806-b486-2428938a547e", // whatever was randomly generated by the server
        origin: "http://localhost:8080",
    }
    const registrationParsed = await server.verifyRegistration(registration, expected)
    ```

    - 產生之registrationParsed object範例

    ```JSON
    {
    "username": "Arnaud",
    "credential": {
        "id": "3924HhJdJMy_svnUowT8eoXrOOO6NLP8SK85q2RPxdU",
        "publicKey": "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEgyYqQmUAmDn9J7dR5xl-HlyAA0R2XV5sgQRnSGXbLt_xCrEdD1IVvvkyTmRD16y9p3C2O4PTZ0OF_ZYD2JgTVA==",
        "algorithm": "ES256"
    },
    "authenticator": {
        ...
        "name": "Windows Hello",
        "icon_dark": "https://webauthn.passwordless.id/authenticators/08987058-cadc-4b81-b6e1-30de50dcbe96-dark.png",
        "icon_light": "https://webauthn.passwordless.id/authenticators/08987058-cadc-4b81-b6e1-30de50dcbe96-light.png",
        "synced": true
    },
    ...
    }
    ```

2. 將憑證金鑰(credential)儲存至資料庫

以下為測試時暫存在localstorage的範例
```javascript
   if (!localStorage.getItem("registrationParsed")) {
      localStorage.setItem("registrationParsed", JSON.stringify(registrationParsed));
   }
   
```

## 登入範例

### 前端

1. 確認是否已經註冊
```javascript
   const registration = registration.find((reg) => reg.credential.id === authentication.credentialId);
    alert(JSON.stringify(registration));
```
2. 確認是否已經登入
   ```javascript
   import { utils } from '@passwordless-id/webauthn'
   
    let existChallenge = existRegistrationArray[0].client.challenge;
    let originArrayBuffer = utils.parseBase64url(existChallenge);
    let originChallenge = utils.parseBuffer(originArrayBuffer);
    let originTimestamp = originChallenge.split('-')[1];
    if (Number(originTimestamp) > Date.now()) {
      alert("login is already exist");
      return "login is already exist";
    }
   ```
3. 發送request到後端獲取挑戰
4. 利用獲取的挑戰生成簽名並傳送至後端

   - 傳送範例

      ```javascript
      import { client } from '@passwordless-id/webauthn'

       if (session) {
       return 'session is already exist'
       }
       const challenge = async (challenge) => { /* 去後端查詢挑戰 */ return true },
       const credentialId = ["3924HhJdJMy_svnUowT8eoXrOOO6NLP8SK85q2RPxdU"] //使用者名稱
       const authentication = await client.authenticate(credentialId, challenge, {
       "authenticatorType": "auto",
       "userVerification": "required",
       "timeout": 60000
       })
       ```

   - 回傳範例

    ```Json

    {
     "credentialId": "3924HhJdJMy_svnUowT8eoXrOOO6NLP8SK85q2RPxdU",
     "authenticatorData": "SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2MFAAAAAQ==",
     "clientData": "eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiNTY1MzViMTMtNWQ5My00MTk0LWEyODItZjIzNGMxYzI0NTAwIiwib3JpZ2luIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwIiwiY3Jvc3NPcmlnaW4iOmZhbHNlLCJvdGhlcl9rZXlzX2Nhbl9iZV9hZGRlZF9oZXJlIjoiZG8gbm90IGNvbXBhcmUgY2xpZW50RGF0YUpTT04gYWdhaW5zdCBhIHRlbXBsYXRlLiBTZWUgaHR0cHM6Ly9nb28uZ2wveWFiUGV4In0=",
     "signature": "MEUCIAqtFVRrn7q9HvJCAsOhE3oKJ-Hb4ISfjABu4lH70MKSAiEA666slmop_oCbmNZdc-QemTv2Rq4g_D7UvIhWT_vVp8M="
     }
     ```

### 後端

1. 後端藉由authentication中的credentialId讀取資料庫中的資料與預期輸入值

    ```javascript
    import { server } from '@passwordless-id/webauthn' 

    // credentialKey 由 authentication.credentialId 去資料庫取得
    const credentialKey = { 
        id: "3924HhJdJMy_svnUowT8eoXrOOO6NLP8SK85q2RPxdU",
        publicKey: "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEgyYqQmUAmDn9J7dR5xl-HlyAA0R2XV5sgQRnSGXbLt_xCrEdD1IVvvkyTmRD16y9p3C2O4PTZ0OF_ZYD2JgTVA==",
        algorithm: "ES256"
    } as const

    const expected = {
        challenge: async (challenge) => { /* 去資料庫查詢挑戰 */ return true },
        origin: (origin) => listOfAllowedOrigins.includes(origin), //符合的origin
        userVerified: true, // 若在authentication options 中`userVerification` 是`required` (預設值) 則此值必須是`true`
        counter: 123 // 選擇性. 目前Windows與Android支援，用於檢查計數器是否增加，以防止重放攻擊，IOS/MAC不支援，在雲端上則是一種`功能`
    }
    ```

2. 驗證數據與簽名正確性，並回傳登入結果

    ```javascript
    const authenticationParsed = await server.verifyAuthentication(authentication, credentialKey, expected)

    ```
3. 前端將登入結果存在localstorage用來做登入檢查

```javascript

      localStorage.setItem("authenticationParsed", JSON.stringify(authenticationParsed);
   
```

## 實際運行畫面
**註冊**
![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/3eb330dd-c80e-4001-a809-c329fc0bb7d9)

![截圖 2024-04-01 下午3 59 54](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/3462ab5f-b661-477d-aaa7-fc0b2f7879f0)

https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/e56eed8e-65ff-4e96-9125-57b35aae1b34

![截圖 2024-04-01 下午4 16 02](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/d8860868-679b-4ccc-aed2-a5b169e6176a)

**登入**

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/3eb330dd-c80e-4001-a809-c329fc0bb7d9)

https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/38fa5ed9-5551-428a-b505-402153ad7c53

![截圖 2024-04-01 下午4 16 16](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/3e44723d-7a77-42d3-ac7a-6cdf2aa62be7)

## 參考資料

- [passwordless-id / webauthn](https://github.com/passwordless-id/webauthn/tree/main)
- [The Chromium Projects](https://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features/)
