# 第一章：執行摘要 (Executive Summary)

## 1.1 願景：從「帳號密碼」到「自主身分」 (Vision)

在 Web2 時代，用戶的身分是科技巨頭資料庫裡的一筆租用記錄；在傳統 Web3 時代，用戶的身分是一串難以記憶的助記詞 (Seed Phrase)。

本協議提出了一種全新的\*\*「去中心化數位身分 (SSI)」\*\*架構，旨在融合 **FIDO2 (WebAuthn)** 的硬體安全性與 **ERC-4337 (帳戶抽象)** 的可程式化特性。我們的目標是打造一個既符合金融監理要求（非託管、可審計），又具備消費級易用性（無助記詞、生物辨識）的身分基礎設施。

## 1.2 核心痛點與解決方案 (Problem & Solution)

### 1.2.1 痛點：安全與體驗的兩難

  * **託管風險 (Custodial Risk)**：中心化平台持有用戶私鑰，一旦資料庫被駭或內部作惡，資產將面臨系統性風險。這也是監理單位最擔憂的「黑箱作業」。
  * **進入門檻 (Onboarding Friction)**：非託管錢包要求用戶管理 12-24 個單字的助記詞，導致 90% 以上的一般用戶在註冊階段流失。

### 1.2.2 我們的解法：硬體即鑰匙，合約即身分

本協議移除了一切中間人與記憶負擔：

1.  **身分載體**：用戶的身分不再依賴伺服器驗證，而是由部署在以太坊區塊鏈上的 **智能合約 (Smart Contract Wallet, SCW)** 直接定義。
2.  **認證機制**：利用全球數十億台智慧型手機內建的 **安全晶片 (Secure Enclave)** 作為硬體錢包。用戶僅需透過 FaceID 或 TouchID 即可簽署區塊鏈交易。

-----

## 1.3 協議架構角色定義 (Roles & Definitions)

為了釐清責任歸屬，本協議定義了以下三種角色：

| 角色 (Role) | 技術定義 (Technical Definition) | 合規定義 (Compliance Definition) | 權限邊界 (Authority) |
| :--- | :--- | :--- | :--- |
| **用戶 (User)** | **FIDO2 Signer** (Passkey) | **授權人** (Authorizer) | 唯一擁有私鑰，唯一能發起並簽署交易指令。 |
| **身分 (Identity)** | **SCW Contract** (ERC-4337 Account) | **數位實體** (Digital Entity) | 鏈上資產的持有者，負責執行簽名驗證邏輯。 |
| **平台 (Platform)** | **Bundler / Relayer** | **服務提供商** (Service Provider) | 僅負責傳遞資料封包與墊付網路費 (Gas)，**無權觸碰私鑰或資金**。 |

> **代碼證據 1.3：**
> 平台的角色僅限於作為 Bundler 接收並轉發 `UserOperation`。這在我們的 API 路由中得到了體現，後端僅作為通道 (Passthrough)，無法修改簽名內容。
>
> ```typescript
> // 平台後端僅接收 userOp 並呼叫 bundlerService 轉發，無法偽造簽名
> const userOp = await request.json();
> const txHash = await bundlerService.sendUserOp(userOp);
> ```

-----

## 1.4 主要價值主張 (Key Value Propositions)

### 對於監理單位與稽核員 (For Regulators & Auditors)

  * **真正的非託管 (True Non-Custodial)**：私鑰生成於用戶手機的 TEE (Trusted Execution Environment) 內，且無法被導出。平台資料庫僅儲存公開的公鑰座標 (x, y)，物理上杜絕了挪用資產的可能性。
  * **不可篡改的審計軌跡 (Immutable Audit Trail)**：所有的授權變更（如新增裝置、移除權限）皆透過區塊鏈事件 (Event Logs) 公開記錄，提供比傳統銀行日誌更具公信力的數位鑑識證據。

### 對於生態系合作夥伴 (For Ecosystem Partners)

  * **銀行級安全，Web2 級體驗**：合作夥伴的 DApp 可直接整合我們的 SDK，讓用戶在 10 秒內通過生物辨識完成註冊，無需管理助記詞，大幅提升轉化率。
  * **Gas 費抽象化 (Gas Abstraction)**：透過 ERC-4337 的 Paymaster 機制，合作夥伴可為用戶代付手續費，創造「免費試用」或「訂閱制」等靈活的商業模式，消除 Web3 的使用摩擦。

-----

## 1.5 技術成熟度聲明 (Technical Maturity)

本協議基於產業標準構建：

  * **W3C WebAuthn (FIDO2)**：全球通用的網頁身分認證標準。
  * **ERC-4337**：以太坊官方認可的帳戶抽象標準。
  * **NIST P-256 (secp256r1)**：美國國家標準技術研究院定義的橢圓曲線加密演算法，具備軍規級安全性。

-----
