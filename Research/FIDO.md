# Fast IDentity Online（FIDO）
## FIDO 網路識別標準簡介

FIDO（Fast IDentity Online）指的是由非營利組織FIDO聯盟所制定的一系列網路識別安全標準。這套標準旨在透過公開金鑰加密技術，實現多重因素認證（MFA）和生物識別登入，從而為雲端帳號提供堅固的個資保護機制。

### 主要特點

FIDO標準的核心在於其基於公開金鑰加密（Public Key Cryptography）的認證架構，該架構能有效確保「伺服器端不再儲存任何祕密信息」：

- **公開金鑰基礎架構**：在FIDO認證系統中，認證伺服器（FIDO Authentication Server）只會儲存用戶相對應的公鑰，而用戶的私鑰則安全地儲存在本地裝置中。當用戶進行登入操作時，只需在本地裝置上使用個人信息解鎖私鑰，隨後利用私鑰解鎖相對應的公鑰進行認證。

- **分散式個資管理**：與傳統將用戶個資集中存儲於雲端伺服器不同，FIDO標準鼓勵分散式處理，將個人敏感信息分別存儲於用戶的本地裝置上。通過公鑰和私鑰的交互作用，實現對雲端服務的安全登入。

- **提升資料安全性**：由於用戶的個人敏感信息無需上傳至雲端，因此大大降低了資料外洩的風險，增強了整體的資料安全性。

**優點**：
- 強化安全性：通過多重因素認證和生物識別技術，有效抵抗釣魚攻擊和密碼盜用等安全威脅。
- 提升用戶體驗：用戶可以享受無密碼登入的便捷，減少記憶或輸入複雜密碼的麻煩。
- 保護隱私：用戶個資僅儲存在本地裝置，不被集中存儲或處理，降低了資料洩露的風險。

## FIDO 標準的發展
### 初期發展
FIDO聯盟成立於2012年，最初由Lenovo、Nok Nok Labs、PayPal和Validus等公司共同創立。聯盟的目標是創建一組安全、開放、互操作的全球身份驗證標準，使網絡空間的身份驗證更加安全和便利。

### FIDO1

2014年，FIDO聯盟發布了其首個標準版本FIDO1，是FIDO聯盟最初推出的身份認證標準，主要包含兩個規範：UAF（Universal Authentication Framework）和U2F（Universal 2nd Factor）。

#### UAF（Universal Authentication Framework）

- **核心概念**：UAF規範允許用戶進行無密碼的登錄操作。它支持多種生物識別方法（如指紋、聲紋、面部識別等）來驗證用戶身份。
- **運作方式**：在註冊過程中，用戶的設備會生成一對公私鑰。私鑰存儲在用戶的設備上，而公鑰則與用戶的帳戶關聯並存儲在服務提供者的服務器上。用戶在使用生物識別資訊進行身份驗證時，設備會用私鑰對驗證請求進行簽名，然後將這個簽名發送給服務提供者進行驗證。
- **安全性**：由於私鑰僅存儲在用戶的設備上，且不會被傳輸，因此大大降低了賬戶被盜風險。

#### U2F（Universal 2nd Factor）
（在 FIDO2 頒佈後被歸納為 CTAP1）
- **核心概念**：U2F是一種基於硬件的兩因素認證方法，允許用戶使用物理設備（如USB安全鑰匙）作為登錄過程中的第二重身份驗證，為用戶帳號增加一層保護。這種方法特別適合於需要高安全性要求的場景，如金融服務和敏感數據的存取。
- **運作方式**：用戶在使用密碼登錄之後，會被要求插入並觸摸他們的U2F設備，以完成身份驗證過程。
- **兼容性與安全性**：U2F設備支持多個網站和應用，用戶無需為每個服務購買或註冊不同的安全鑰匙。相比傳統的SMS或應用生成的一次性密碼，U2F提供了更高的安全性，因為它不易受到釣魚攻擊。

### FIDO2

隨著技術的發展和市場需求的增長，FIDO聯盟於2018年推出了FIDO2，這是一個更加全面的身份驗證標準框架。FIDO2包含兩個關鍵技術：WebAuthn（Web Authentication）和CTAP（Client to Authenticator Protocol）。
FIDO1與FIDO2的根本區別之一在於FIDO2包含了由全球資訊網協會（W3C）制定的Web Authentication (WebAuthn) 規範。這一新增的規範使得FIDO2不僅在安全性上有所提升，也在應用的普及和便捷性方面帶來了革命性的改變。
除了WebAuthn，FIDO2還包括CTAP（Client to Authenticator Protocol），這使得舊的FIDO U2F安全鑰匙和其他外部認證器能夠與支持FIDO2的服務進行交

- **運作方式**：用戶首次註冊時，網站會要求用戶進行身份驗證，例如使用生物識別技術或安全鑰匙。此時，用戶的設備會生成一對公私鑰，私鑰保存在用戶設備上，公鑰則傳送給網站並與用戶帳戶關聯。在後續的登錄過程中，網站會發送一個挑戰（challenge）給用戶的瀏覽器，瀏覽器再轉發給用戶的認證器。用戶透過認證器解鎖私鑰，對挑戰進行簽名，然後將簽名數據返回給網站，網站通過比對公鑰驗證簽名的有效性來完成身份驗證。
- **特點**：WebAuthn提供了一種標準化的方法，允許用戶使用各種本地認證方式（如指紋、臉部識別、安全鑰匙等）來進行網路身份驗證，無需密碼。這大大提高了安全性和便利性，因為公私鑰加密比傳統密碼更難被破解，且用戶無需記憶複雜的密碼。

#### WebAuthn的影響
WebAuthn 在 2019 年三月被指定為正式的網頁標準，目前除了支援 Windows 10 以及 Android 平台之外，也支援 Google Chrome、Mozilla Firefox、Microsoft Edge 以及 Apple Safari 等網頁瀏覽器。WebAuthn是用於Web的API，它提供了一种標準化的方式，允許網站與FIDO驗證器（如USB金鑰或手機）進行交互。
- **無密碼登錄**：WebAuthn使得無密碼登錄變得可能。用戶可以利用生物識別技術（如指紋或臉部識別）或物理安全鑰匙來進行網站的身份認證，無需輸入傳統的密碼。
- **更廣泛的支持**：由於WebAuthn是W3C的標準，它得到了主流瀏覽器（如Chrome、Firefox、Edge和Safari）的支持，這意味著網站可以更容易地實現和推廣無密碼或低依賴密碼的登錄方案。
- **提高安全性和用戶友好性**：WebAuthn通過本地認證來提高安全性，減少了密碼被盜用或忘記的風險。同時，它也提供了更為便捷的用戶體驗，用戶不再需要記憶和輸入複雜的密碼。

#### CTAP（Client to Authenticator Protocol）
CTAP定義了客户端設備與驗證器之間的溝通方式，確保雙方能夠安全有效地進行信息交換，以完成身份認證過程。這個協議支援多種形式的身份認證方法，從而提供更多元化和靈活的身份驗證選項給用戶和服務提供者。
- **CTAP1**：CTAP1基本上是U2F協議的延續，使得支持U2F的現有設備和服務能夠無縫過渡到FIDO2標準。
- **CTAP2**：CTAP2是一種更先進的通訊協議，支持外部認證器（如安全鑰匙、手機）與用戶的設備（通常是一個瀏覽器）之間的交互。這允許使用更多種類的認證方式，包括但不限於生物識別（指紋、臉部、虹膜等）和PIN碼，從而實現無密碼登錄或二因素認證。
- **應用**：CTAP為用戶提供了一種使用物理設備進行身份驗證的方式，這種方式既可用作主要的登錄方法（無密碼登錄），也可以作為現有密碼或PIN的二次驗證方法（二因素認證）。

### 兼容性和應用範圍

- **FIDO1**的應用範圍相對較窄，主要限於支持UAF和U2F協議的場景。儘管提供了強大的安全保障，但它需要用戶和服務提供商都支持相應的協議和硬件設備。
- **FIDO2**則擴大了兼容性和應用範圍，特別是通過WebAuthn，使得無密碼登錄和二次因素認證可以直接在主流瀏覽器和網站上實現，無需特定的硬件支持。這使得FIDO2能夠更容易地被廣泛部署和接受。

### 用戶體驗

- **FIDO1**在提供高安全性的同時，對用戶來說可能需要額外的操作，比如購買和使用U2F安全鑰匙等。
- **FIDO2**則更加注重用戶體驗，特別是WebAuthn的引入，使得用戶可以利用現有的設備（如手機、筆記本電腦的指紋識別或臉部識別功能）直接進行身份驗證，無需額外購買或設置安全設備。

| 特性/標準 | UAF (Universal Authentication Framework) | U2F (Universal 2nd Factor) | CTAP1 | CTAP2 (Client to Authenticator Protocol) |
|-----------|-----------------------------------------|----------------------------|-------|--------------------------------------------|
| **主要目的** | 提供無密碼的登錄方式 | 實現基於硬件的二次因素認證 | U2F協議的延續，保持向後兼容 | 支援更多種類的認證方式，實現無密碼登錄或二因素認證 |
| **認證方法** | 生物識別、PIN碼等本地方法 | 物理安全鑰匙 | 物理安全鑰匙 | 生物識別、PIN碼、安全鑰匙等 |
| **安全鑰匙存儲** | 用戶設備 | 用戶設備 | 用戶設備 | 用戶設備 |
| **與用戶設備的互動** | 直接在用戶設備上進行認證 | 需要用戶插入並觸摸安全鑰匙 | 需要用戶插入並觸摸安全鑰匙 | 可以通過藍牙、NFC、USB等方式與設備互動 |
| **跨平台支援** | 是 | 有限（需要支援U2F的瀏覽器和服務） | 有限（需要支援U2F的瀏覽器和服務） | 是 |
| **用戶體驗** | 無需記憶密碼，使用便捷 | 需要額外的安全鑰匙操作 | 需要額外的安全鑰匙操作 | 提高了認證的便捷性和靈活性 |
| **主要應用** | 通用的網路服務登錄 | 加強現有密碼系統的安全性 | 與U2F相同，增強現有密碼系統的安全性 | 廣泛的網路服務和應用，尤其適合無密碼或低依賴密碼的場景 |

## (待補充) FIDO Protocol（FIDO 資料格式細節）
提及到FIDO（Fast Identity Online）協議的「資料格式細節」，主要指的是FIDO協議中定義的數據結構和通信過程中使用的消息格式。FIDO標準包括多個規範，如UAF（Universal Authentication Framework）、U2F（Universal 2nd Factor）、FIDO2（包含WebAuthn和CTAP）。這些規範中明確了在身份驗證流程中客戶端和伺服器之間交換的消息結構、方法調用和回應格式。

### UAF、U2F、FIDO2中的關鍵資料格式

#### UAF協議
在UAF中，身份驗證過程涉及多個組件，包括客戶端、認證器和伺服器。UAF定義了註冊和認證過程中使用的消息格式，例如：
- **註冊請求**（RegistrationRequest）：包括挑戰（Challenge）、應用程式ID（AppID）、註冊策略等。
- **註冊回應**（RegistrationResponse）：包括用戶的公鑰、註冊數據證明（證明客戶端持有對應私鑰）、機密性保護信息等。
- **認證請求**（AuthenticationRequest）：同樣包含挑戰、應用程式ID等信息。
- **認證回應**（AuthenticationResponse）：包括證明用戶持有私鑰的簽名數據等。

#### U2F協議
U2F專注於使用外部硬件（如安全鑰匙）進行二次因素身份驗證。其資料格式包括：
- **註冊請求**：主要是通過瀏覽器發送給安全鑰匙，要求鑰匙生成一對新的公私鑰。
- **註冊回應**：安全鑰匙回應含有公鑰和鑰匙生成證明的數據。
- **認證請求**：包括挑戰和註冊時生成的鑰匙參考。
- **認證回應**：安全鑰匙提供的包含簽名的挑戰，證明用戶持有對應的私鑰。

#### FIDO2協議

FIDO2是FIDO聯盟的最新標準，旨在使無密碼身份驗證普及。它包括WebAuthn和CTAP兩部分，其中：
- **WebAuthn**：定義了在網頁應用中進行身份驗證時的API和資料格式。資料格式細節包括註冊時的公鑰認證創建選項（PublicKeyCredentialCreationOptions）和認證獲取選項（PublicKeyCredentialRequestOptions）。
- **CTAP**：允許外部認證器（如手機或安全鑰匙）與支持FIDO2的客戶端設備通信，進行身份驗證。資料格式涉及認證器和客戶端之間的命令和響應結構。

FIDO2協議的身份驗證流程涉及客戶端（通常指瀏覽器或其他用戶端應用）與伺服器之間的一系列消息交換，這些消息的結構、方法調用和回應格式都有嚴格的定義。以下是一個高層次的概述，涵蓋了WebAuthn和CTAP兩部分的關鍵步驟及其資料格式細節：

### WebAuthn 身份驗證流程
WebAuthn協議的身份驗證流程大致可分為兩個階段：註冊（Registration）和登錄（Authentication）。

#### 註冊階段
1. **客戶端到伺服器**：當用戶選擇使用FIDO2註冊時，客戶端（如瀏覽器）會向伺服器發送一個請求，索取註冊的必要參數。
2. **伺服器到客戶端**：伺服器響應這一請求，提供`PublicKeyCredentialCreationOptions`，其中包括用於創建新認證的挑戰（challenge）、用戶資訊、憑證參數等。
3. **客戶端處理**：客戶端使用這些參數，通過`navigator.credentials.create()`方法呼叫WebAuthn API，進行用戶身份驗證並創建新的公私鑰對。
4. **客戶端到伺服器**：生成的公鑰和一些認證資訊被封裝成一個認證對象，通過客戶端回傳給伺服器。
5. **伺服器處理**：伺服器驗證認證資訊，將公鑰關聯至用戶帳號，完成註冊過程。

#### 登錄階段
1. **客戶端到伺服器**：用戶嘗試登錄時，客戶端向伺服器發送請求，索取登錄的必要參數。
2. **伺服器到客戶端**：伺服器響應請求，提供`PublicKeyCredentialRequestOptions`，包含挑戰、允許的認證器列表等。
3. **客戶端處理**：客戶端使用這些參數，通過`navigator.credentials.get()`方法呼叫WebAuthn API，進行用戶身份驗證。
4. **客戶端到伺服器**：認證對象被回傳給伺服器。
5. **伺服器處理**：伺服器使用存儲的公鑰驗證認證對象，如驗證成功，用戶則成功登錄。

### CTAP 身份驗證流程
CTAP協議定義了認證器（如安全鑰匙、手機等）與客戶端設備之間如何通信，以完成FIDO2身份驗證。這一過程主要涉及以下步驟：

1. **客戶端調用CTAP**：在WebAuthn的API調用過程中，當需要與外部認證器交互時，客戶端會通過CTAP協議與認證器通信。

2. **命令和響應**：客戶端發送具體的CTAP命令給認證器，如要求認證器執行認證或簽名操作。認證器接收到命令後，會根據請求執行相應的操作，例如使用私鑰進行簽名或生成公私鑰對。

3. **認證器到客戶端**：操作完成後，認證器將結果（如簽名後的挑戰或新生成的公鑰）通過CTAP協議發送回客戶端設備。

4. **客戶端到伺服器**：客戶端接收到認證器的響應後，將這些資訊打包，通過安全的通信渠道發送給服務端伺服器。

5. **伺服器驗證**：伺服器收到來自客戶端的資訊後，利用先前儲存的用戶公鑰進行驗證。如果響應的簽名與挑戰匹配，則認證成功。

### 資料格式細節
CTAP協議中，客戶端與認證器之間交換的資訊具有特定的資料格式，這些格式設計來支持安全的身份驗證流程：

- **認證請求**：包含了挑戰、用戶資訊、允許的認證器列表和其他參數，用於告訴認證器需要執行什麼樣的操作。
- **認證響應**：認證器對請求的響應，可能包括簽名後的資料、新生成的公鑰資訊或其他認證結果。

### 方法調用和回應格式
在WebAuthn API中，註冊和登錄過程中涉及到的方法調用（如`navigator.credentials.create()`和`navigator.credentials.get()`）都需要傳入特定格式的參數對象，並返回一個Promise對象。這個Promise最終會解析為包含認證結果的對象，該對象符合WebAuthn的資料格式細節。


## 在自己的網站上引入 FIDO2
要在使用JavaScript和Node.js的前後端實現FIDO2身份驗證，考慮使用一些現成的庫來幫助處理WebAuthn的細節。

以下是實現FIDO2所需的庫和分別對前後端操作的說明：

### 前端 (HTML, CSS, JavaScript)
在前端，主要工作是使用WebAuthn API來創建和獲取認證。目前，大多數現代瀏覽器都原生支持WebAuthn API，因此不需要額外的JavaScript庫來直接調用這些API。然而，為了更方便地處理這些API的調用和響應，可以考慮使用如下幾個資源：
- **WebAuthn JSON**：一個幫助處理WebAuthn註冊和登錄流程中的JSON對象的工具。雖然它不是一個必需的庫，但它可以簡化與服務器交換資訊的過程。

前端示例代碼（使用原生WebAuthn API）：
```javascript
// 註冊示例
if (window.PublicKeyCredential) {
    let createOptions; // 從服務器獲取的註冊選項
    // 調用服務器接口獲取createOptions...
    
    navigator.credentials.create({publicKey: createOptions})
        .then((newCredentialInfo) => {
            // 處理註冊成功的情況，將newCredentialInfo發送到服務器進行驗證和存儲
        }).catch((error) => {
            // 處理錯誤情況
        });
}

// 登錄示例
let getRequestOptions; // 從服務器獲取的登錄選項
// 調用服務器接口獲取getRequestOptions...

navigator.credentials.get({publicKey: getRequestOptions})
    .then((assertion) => {
        // 處理登錄成功的情況，將assertion發送到服務器進行驗證
    }).catch((error) => {
        // 處理錯誤情況
    });
```

### 後端 (Node.js)
在後端，處理WebAuthn註冊和登錄請求需要一些庫來協助解析和驗證客戶端發送的資料。以下是一些在Node.js後端實現FIDO2時可以使用的庫：

- **@simplewebauthn/server**：一個全面的Node.js庫，提供了處理WebAuthn服務器端邏輯所需的功能，包括生成註冊和登錄選項、驗證客戶端響應等。
- **@webauthn/server**：另一個支援WebAuthn服務器端操作的Node.js庫，同樣提供生成和驗證功能。

後端示例代碼（使用@simplewebauthn/server）：
```javascript
const { generateRegistrationOptions, verifyRegistrationResponse } = require('@simplewebauthn/server');

// 註冊選項生成
const registrationOptions = generateRegistrationOptions({
    rpName: "Example Corp",
    rpID: "example.com",
    userID: "user_id",
    userName: "username",
    // 其他選項...
});

// 發送registrationOptions到前端...

// 驗證註冊響應
const verification = verifyRegistrationResponse({
    credential: registrationResponse,
    expectedChallenge: "從某處獲取的challenge",
    expectedOrigin: "https://example.com",
    expectedRPID: "example.com",
    // 其他驗證選項...
});

// 根據verification的結果處理註冊
if (verification.verified) {
    // 如果驗證成功，將用戶的新公鑰存儲到數據庫
    saveUserPublicKey(verification.registrationInfo.credentialPublicKey, userId);
    // 處理註冊成功的邏輯...
} else {
    // 處理驗證失敗的情況...
}

// 登錄過程中驗證客戶端的登錄響應
const { generateAuthenticationOptions, verifyAuthenticationResponse } = require('@simplewebauthn/server');

// 生成登錄選項
const authenticationOptions = generateAuthenticationOptions({
    allowCredentials: [{
        id: userCredentialId, // 用戶公鑰ID
        type: 'public-key',
        transports: ['usb', 'ble', 'nfc', 'internal'],
    }],
    userVerification: 'preferred', // 或'discouraged'/'required'
});

// 發送authenticationOptions到前端...

// 後端接收前端發送的登錄響應
const authResponse = /* 從前端獲取的登錄響應 */;
// 驗證登錄響應
const verification = verifyAuthenticationResponse({
    credential: authResponse,
    expectedChallenge: authenticationOptions.challenge,
    expectedOrigin: "https://example.com",
    expectedRPID: "example.com",
    authenticator: {
        credentialPublicKey: userCredentialPublicKey, // 從數據庫獲取的用戶公鑰
        counter: userAuthenticatorCounter, // 從數據庫獲取的計數器值
    },
});

if (verification.verified) {
    // 驗證成功，更新數據庫中的計數器值
    updateUserAuthenticatorCounter(userId, verification.authenticationInfo.newCounter);
    // 處理登錄成功的邏輯...
} else {
    // 處理驗證失敗的情況...
}
```

### 實現細節和注意事項
- **安全性考慮**：確保在HTTPS環境下與前端進行通信，以保護資料傳輸的安全。
- **數據存儲**：用戶的公鑰、註冊時的隨機挑戰（Challenge）和登錄時的計數器值需要安全地存儲在後端數據庫中。
- **跨域請求**：如果前後端分布在不同的域下，需要適當配置CORS（跨源資源共享），以允許安全的跨域請求。
- **依賴管理**：確保定期更新使用的Node.js庫，以獲得最新的安全修復和功能改進。


## FIDO認證裝置的安全等級

| 安全等級 | 描述 | 防護範圍 |
|----------|------|----------|
| 第一級 (Level 1) | 包含實現FIDO2、UAF或U2F標準的軟體和硬體身份驗證裝置。這一等級為FIDO認證的基礎標準，旨在保護用戶免受網絡釣魚攻擊、伺服器漏洞利用和中間人攻擊。 | - 網絡釣魚<br>- 伺服器破壞<br>- 中間人攻擊 |
| 第二級 (Level 2) | 在第一級的基礎上增加了額外的安全措施，用於防止進階的攻擊手段，特別是針對想通過訪問設備來竊取資料的惡意軟體。 | - 高級惡意軟體攻擊<br>- 密鑰提取攻擊 |
| 第三級 (Level 3) | 能夠抵抗基本的硬體攻擊，保護安全密鑰不被物理篡改或非法提取。如果設備遭受攻擊，會留下明顯痕跡。 | - 物理篡改<br>- 硬體設備操控<br>- 明顯攻擊痕跡 |
| 第三級以上 (Level 3+) | 代表FIDO認證裝置中的最高安全等級，要求安全密鑰存儲於Trusted Platform Module（TPM）中，這樣的裝置能夠防止任何形式的物理篡改和資料提取。 | - 物理和進階硬體攻擊<br>- 密鑰安全存儲於TPM |

這些安全等級的劃分清晰地展示了FIDO認證裝置在提升用戶賬戶安全性方面的多層次防護策略。隨著等級的提升，裝置能夠抵抗更加複雜和高級的攻擊方式，從而為用戶提供更全面的保護。

## FIDO 與 DeWT 比較
將FIDO與我們設計的Decentralized Web Token（DeWT）進行比較：
### 認證機製本質
- **FIDO（Fast Identity Online）**：FIDO是一個旨在減少對密碼依賴的開放標準，提供了更安全的身份驗證方法。它主要利用生物辨識技術（如指紋、臉部辨識等）和/或硬體安全金鑰進行使用者身份驗證，確保認證資料在本機裝置中產生和存儲，從而提高安全性。
- **DeWT（Decentralized Web Token）**：DeWT是一種去中心化的認證機制，靈感來自JWT（JSON Web Token）。與JWT不同，DeWT是由使用者自行簽發的，且簽發的內容與JWT有所區別。 DeWT著重於用戶自主控制和去中心化的概念，透過智慧合約和用戶錢包的交互實現認證。

### 簽發主體
- **FIDO**：在FIDO框架中，身份驗證是透過使用者裝置和驗證伺服器之間的互動完成的，依賴於使用者的生物特徵和/或實體安全金鑰。
- **DeWT**：DeWT由用戶直接簽發，利用區塊鏈技術和智慧合約確保其安全性和透明度，使用戶在認證過程中擁有更大的自主權。

### 安全性與隱私
- **FIDO**：FIDO標準的核心在於提高安全性，透過本地設備處理所有敏感資訊（如生物特徵數據），避免將這些資訊傳輸至伺服器，從而減少數據洩漏的風險。
- **DeWT**：DeWT同樣強調安全性和隱私保護，透過去中心化的方式，將授權資訊儲存在區塊鏈上，減少了中心化儲存點被攻擊的可能性。使用者完全控制自己的認證訊息，但需要確保私鑰的安全。

### 技術實現和挑戰
- **FIDO**：FIDO的實現依賴於特定的硬體和軟體支持，如生物識別感測器和安全金鑰。這可能需要設備製造商和應用程式開發者的支援。
- **DeWT**：DeWT的實現依賴於區塊鏈技術和智能合約。這要求用戶有一定的區塊鏈知識和對錢包的管理能力，同時也需要開發者俱備智慧合約開發的能力。

### 相同點

1. **強調安全性與隱私保護**：FIDO與DeWT都旨在提供更安全的認證機制，減少對傳統密碼的依賴，並保護使用者的隱私。
2. **支持多因素認證**：這兩種技術都支持多因素認證（MFA），增加非授權用戶獲取訪問權限的難度。
3. **去中心化元素**：雖然FIDO本身不是一個去中心化的身份認證標準，但它允許身份驗證資料在本地生成和儲存，有助於避免中心化數據庫的風險。而DeWT則是完全基於去中心化理念，直接利用區塊鏈技術。

### 總結 
FIDO和DeWT提供了兩種不同的解決方案，以應對當前數位世界中的身分驗證挑戰。 FIDO透過生物辨識和實體金鑰提供了一個安全、用戶友好的認證方法，而DeWT則利用區塊鏈技術提供了一種去中心化的認證機制，賦予用戶更大的控制權。選擇哪種方案取決於應用的特定需求、目標使用者群體以及安全性和便利性的平衡點。

## 參考資料
- [DeWT](https://github.com/CAFECA-IO/KnowledgeManagement/blob/20906c2d364bdbfc67009c86477edd0313d40cdb/TideBit-DeFi/dewt.md)
- [網路時代的最佳資安解決方案 1：FIDO的深入解析 (上)](https://www.webcomm.com.tw/blog/fido-introduction1/)
- [網路時代的最佳資安解決方案 1：FIDO的深入解析 (下)](https://www.webcomm.com.tw/blog/fido-introduction2/)
- [PRODUCT FIDO ID 行動金鑰](https://www.twca.com.tw/product/c0281542-f034-4ba9-8164-c517ebc5e0c0)
- [資訊科普系列(7) — FIDO](https://medium.com/moda-it/%E8%B3%87%E8%A8%8A%E7%A7%91%E6%99%AE%E7%B3%BB%E5%88%97-fido-60e5aa1a62cb)

