# CAFECA DeWT：流程圖與安全性說明

> 下面用 **Mermaid** 畫出完整流程（可直接貼到 GitHub/Notion/Obsidian/mermaid.live 渲染）。
> 內容分成四張圖：①註冊與裝置綁定、②A→B 推導與鏈上登記、③DeWT 簽發與驗證、④第二裝置加入與授權；最後用威脅模型表說明「為什麼安全」。

---

## 1) 全流程鳥瞰（對應你列的 0–11 步）

```mermaid
flowchart TD
    A0([0 Generate One-Time Password]) --> A1[1 Submit Commitment C using keccak of PWH and nonce to Obtain NID]
    A1 --> A2[2 Establish FIDO2 Platform Key A]
    A2 --> A3[3 Sign Challenge and Derive Chain Key B]
    A3 --> A4{4 Register FIDO2}
    A4 -->|ZK Proof| A5[Verify Commitments Correct, Bind A and B to NID]
    A4 -->|Submit Disclosure| A5
    A5 --> A6[5 Create Identity NCFCID, B as Administrator]
    A6 --> Q1{Query}
    Q1 -->|5.1 A Public Key Hash to| Q1a[Obtain NCFCID]
    Q1 -->|5.2 NCFCID to| Q1b[Obtain A and B Key Pair]

    subgraph Second Device Process
      B0([6 to 7 Generate PW2 and PWH2, Register Commitment to Obtain NID2])
      B1[8 Establish Second Device A2]
      B2[9 Derive B2]
      B3{10 Register FIDO2 with A2 and B2}
      B0-->B1-->B2-->B3
      B3 --> B4[11 Issue Join Request to NCFCID1 with B2]
      B4 --> B5[11.1 Administrator Approval]
      B5 --> B6[11.2 Query Mapping A2 and NCFCID1]
    end

    A6 --> B0

```

---

## 2) A→B 推導與鏈上登記（細節版）

```mermaid
sequenceDiagram
    participant D as User Device (Authenticator + App)
    participant F as FIDO2 Platform Authenticator (A)
    participant R as Registry Smart Contract
    participant ZK as ZK Verifier (in R)

    Note over D: 0) 產生 PW, salt → PWH；提交承諾 C=keccak(PWH||nonce) → NID
    D->>F: 2) createCredential() 得 A_pub, credId
    D->>F: 3) getAssertion(challengeX)
    F-->>D: sigA = Sign_A(challengeX)
    Note over D: seed = HKDF( sha256(sigA || sha256(S) || "CAFECA/B-derivation/v1") )
    Note over D: 以 seed 產生鏈金鑰 B=(priv, pub)

    alt 4A) ZK（推薦）
        D->>R: enrollFIDO_ZK(NID, A_pub, credIdHash, B_pub, proofZK)
        R->>ZK: verify(proofZK) // 證明 Argon2/Poseidon 一致，C 正確
        ZK-->>R: OK
        R-->>D: enrolled(A,B) for NID
    else 4B) Commit–Reveal（次佳）
        D->>R: reveal(NID, A_pub, credIdHash, B_pub, PWH, nonce)
        R-->>D: check keccak(PWH||nonce)==C → enrolled
    end

    D->>R: 5) createIdentity(B_pub) → NCFCID
    R-->>D: mapping {NCFCID ↔ A/B sets}
```

---

## 3) DeWT 簽發與驗證（像 JWT 但回鏈核驗）

```mermaid
sequenceDiagram
    participant C as Client App / Browser
    participant API as Resource Server
    participant R as Registry Smart Contract

    C->>C: 以 B_priv 對(header.payload)簽名 → DeWT
    C->>API: Authorization: DeWT
    API->>R: isAuthorized(NCFCID, B_pub_from_kid)?
    R-->>API: true / false（含撤銷/角色/到期檢查）
    API->>API: 驗章、檢 exp/nbf/aud/nonce、(可選)檢 aPubHash/credIdHash
    API-->>C: 200 / 401
```

---

## 4) 第二裝置加入與授權

```mermaid
flowchart LR
  X0["第二裝置建立 A2"] --> X1["以 A2 簽 challenge 與祕密 S2 推導 B2"]
  X1 --> X2{"登記 A2 / B2"}
  X2 -- ZK --> X3["綁定到 NID2"]
  X2 -- Reveal --> X3
  X3 --> X4["requestJoin(NCFCID1, B2)"]
  X4 --> X5["approveJoin 由 B1 管理者簽名"]
  X5 --> X6["映射更新"]
```

---

## 為什麼這樣設計是安全的（威脅模型 → 對策）

| 威脅/攻擊面            | 可能手法                | 設計對策                                                           | 關聯步驟      |
| ----------------- | ------------------- | -------------------------------------------------------------- | --------- |
| 密碼上鏈外洩            | 明文或弱雜湊上鏈被永久蒐集       | **ZK** 證明承諾正確，不揭露 PW/PWH；退一步才用 commit–reveal 並限時               | 0–4       |
| 前置/搶跑 (front-run) | 攻擊者提前送出同資料          | 承諾先行 + **deadline** + 綁定 sender/nonce；ZK 最佳                    | 1,4       |
| 重放攻擊              | 重用舊 challenge/nonce | FIDO2 assertion 綁 **challengeX**、token 帶 **nonce/exp/nbf/aud** | 3, DeWT   |
| 裝置複製              | 匯出私鑰/複製金鑰           | FIDO2 **platform key + credProtect**；鏈上記 `credIdHash` 防重登      | 2,4       |
| 私鑰 B 洩漏           | B 被盜用簽交易            | **A與S不外流**；可即時 **revoke/rotate B**，DeWT 需回鏈驗證                  | 3,5, DeWT |
| 釣魚來源混淆            | 在惡意網域引導簽章           | FIDO2 斷言可綁定 RP ID / origin（平台金鑰）                               | 2,3       |
| 權限橫向提升            | 新裝置未審核即具權限          | 必須 `requestJoin` + **管理者 B** `approveJoin`                     | 11        |
| 隱私洩露              | 公鑰/憑證 ID 追蹤         | 鏈上存 **哈希**（aPubHash/credIdHash），attestation 放 IPFS 僅存 CID      | 4–5       |
| 依賴單點              | Token 自己說了算         | DeWT **回鏈核驗授權/撤銷**，而非僅本地驗章                                     | DeWT      |

---

## 設計關鍵點（簡短白話）

* **A（FIDO2）只用來推導，不上鏈簽**：A 綁裝置唯一、抗釣魚；鏈上與 API 交互用 **B**，一旦 B 洩漏可撤銷/輪替，A 與 S 不受影響。
* **ZK 取代密碼上鏈**：註冊與裝置綁定靠承諾 + ZK，密碼與其雜湊不落地。
* **DeWT ≠ 單機 JWT**：它攜帶資訊，但驗證**必須回鏈**查 NCFCID 當下的授權與撤銷，天然支援 key rotation。
* **多裝置透過申請/審批**：第二裝置（A2/B2）加入需管理者 B 同意，權限邊界清楚。
* **重放/搶跑控制**：所有簽名都綁 challenge/nonce/exp/aud；commit–reveal 時限與 sender 綁定。


---

需要我把這幾張圖打包成一頁 **README.md**（含上述 Mermaid 區塊與威脅模型表）或再加上 **最小可行的合約 PoC** 範本嗎？
