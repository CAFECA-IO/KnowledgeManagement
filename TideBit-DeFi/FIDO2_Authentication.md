# Cross‑Application FIDO2 Enhanced Cryptographic Authentication

**TideBit‑DeFi v2 — 白皮書版（面向一般讀者 × 工程讀者）**

> 用「中心化的使用感受」實現「去中心化的信任」。你只需像 Apple Pay 一樣按一次確認，就能在 TideBit 旗下多個應用完成安全登入與授權；伺服器無法替你操作資產。

---

## 摘要（Abstract）

TideBit‑DeFi v2 在多應用（Web、行動、後台）提供一致的無密碼登入與高風險操作的再次確認，採用 FIDO2／Passkeys 做人機綁定與抗釣魚，並以短時效權杖（DeWT）在系統內部傳遞最小權限。對提領、清算、提高限額等高風險操作，使用 Secure Payment Confirmation（SPC）顯示可驗證的交易摘要並綁定進授權證據。進階場景會搭配 WebAuthn L3 擴充（PRF／hmac‑secret、devicePublicKey、largeBlob）為後續一次性簽名提供高熵材料與裝置風控訊號。本篇聚焦「跨應用 FIDO2 強化式認證」；與下一篇《Partial Private‑Key Protection》共同形成「登入 → 授權 → 一次性鏈上簽名」的完整鏈路。

---

## 1. 設計目標

* **中心化體驗**：單一帳號、跨產品 SSO、一次確認。
* **去中心化信任**：私鑰不在伺服器，伺服器無法單獨代你操作。
* **分級風險**：登入（低風險）／提領清算（高風險）分開處理。
* **可稽核**：同意證據與會計／稽核事件全程留痕可追溯。
* **相容性**：在不同瀏覽器與裝置上提供合理回退策略。

---

## 2. 架構總覽

```
[使用者 + 裝置(指紋/臉)]  -- FIDO2/Passkey -->  [TideBit-Auth]
           │                                        │
           │ (核驗 WebAuthn, 頒發短時效 DeWT)      │
           ▼                                        ▼
   [App A / App B / Console]  -- 攜帶 DeWT 呼叫 API（低風險）
                     └─ 高風險操作 → SPC 視窗 → 二次授權與可驗證證據
```

**TideBit‑Auth**：統一身份與授權服務；驗證 FIDO2 回應，簽發短時效權杖（DeWT）。

---

## 3. 核心觀念（一般讀者）

* **免密碼、免助記詞**：用指紋／臉解鎖即可；金鑰留在你的裝置裡。
* **抗釣魚**：FIDO2 只對正確網域有效，假網站無法用你的 Passkey。
* **看得到才算數**：高風險操作彈出「支付／交易確認」視窗，你看到的金額、資產與費用上限會被綁進授權證據。
* **短時效權杖（DeWT）**：像場內通行證，幾分鐘自動失效；被竊也快失效。

---

## 4. 核心技術（工程讀者）

### 4.1 RP 網域策略（Cross‑App）

* 使用 **主網域作 RP ID**（例：`tidebit.com`），各子域（`trade.tidebit.com`、`save.tidebit.com`、`console.tidebit.com`）共用同一信任根。
* 檢查 `origin` 與 `rpId` 嚴格匹配；RP ID 必須是來源的可註冊後綴（registrable suffix），不可為 eTLD（例如不能是 `com`）。

### 4.2 二次授權（Secure Payment Confirmation, SPC）

* 對提領、清算、提高限額等**高風險操作**必經 SPC。
* 在視窗中以一致格式呈現：**資產／金額／最大手續費／目的／nonce／到期**。
* 上述**摘要被綁定進可驗證資料**，伺服器與鏈上策略可據此核對避免「顯示 1 實簽 100」。

### 4.3 WebAuthn L3 擴充

* **PRF / hmac‑secret**：在認證時請求 32‑byte 高熵輸出，提供給下一階段一次性簽名做密鑰派生材料。
* **devicePublicKey**：用於偵測首次登入的新裝置，提升風險分數並觸發額外驗證或限制。
* **largeBlob**（選用）：保存少量偏好／提示資料（非安全根基）。

### 4.4 DeWT（短時效權杖）

* 僅攜帶必要聲明（claims），預設 5–15 分鐘有效，必要時可縮短；高風險操作需再經 SPC 取得一次性同意證據。

---

## 5. 協定流程圖（Flow Diagram）

```mermaid
flowchart TB
  u[User + Authenticator (Passkey)] -->|WebAuthn get()/PRF| auth[TideBit-Auth]
  subgraph TideBit-Auth
    auth -->|verify assertion| v[Verifier]
    v -->|issue short-lived DeWT| jwt[DeWT Token]
  end
  jwt --> apps[Apps (Trade/Save/Console)]
  apps -->|low-risk API with DeWT| api[Backend APIs]
  apps -->|high-risk action| spc[SPC Confirmation]
  spc -->|bind summary (asset/amount/feeCap/nonce)| consent[Verifiable Consent]
  consent --> api
```

> 若部分環境不支援 `PRF` 或 `devicePublicKey`，流程可退化為僅基礎 WebAuthn + SPC，仍維持安全性（高風險行為可額外要求硬體金鑰）。

---

## 6. 風險矩陣（Risk Matrix）

| 風險事件     | 可能影響  | 發生機率 | 影響程度 | 緩解設計                                                           | 殘餘風險 |
| -------- | ----- | ---: | ---: | -------------------------------------------------------------- | ---- |
| 網站釣魚（偽站） | 盜取登入  |    低 |    高 | FIDO2 綁定 RP/Origin，偽站無法調用 Passkey；HSTS/Content‑Security‑Policy | 低    |
| 伺服器入侵    | 權杖外洩  |    中 |    高 | 權杖短時效（5–15 分），最小權限；簽核與速率限制；金鑰不在伺服器                             | 低    |
| 交易調包     | 資產損失  |    低 |    高 | SPC 將摘要綁入可驗證資料；後端／鏈上核對摘要與 nonce                                | 低    |
| 憑證重放     | 非法操作  |    低 |    中 | `challenge`/`nonce` 唯一；DeWT 短時效；回放偵測                           | 低    |
| 裝置遺失     | 使用者受阻 |    中 |    中 | 備援金鑰／硬體金鑰；人工＋冷卻期恢復；裝置風險名單                                      | 低    |
| 新裝置登入    | 權限濫用  |    中 |    中 | `devicePublicKey` 風險加權；高風險行為要求再驗證或暫緩                           | 低    |

---

## 7. 操作流程（使用者視角）

1. **首次綁定**：像綁定 Apple Pay 一樣建立 Passkey。
2. **跨應用登入**：到任何 TideBit 應用以指紋／臉登入。
3. **高風險操作**：彈出 SPC 視窗；你確認畫面後，系統生成可驗證的同意證據。
4. **遺失裝置**：以備援裝置／硬體金鑰登入；若皆不可用，走「人工＋冷卻期」安全恢復。

---

## 8. 運維與合規

* **最小化紀錄**：不保存生物特徵與裝置私鑰；只存必要的驗證材料與審計雜湊。
* **安全標頭與 Cookie 策略**：HSTS、CSP、X‑Frame‑Options、`SameSite=Strict`、`HttpOnly`、`Secure`。
* **審計事件**：登入、裝置變更、二次授權、失敗嘗試、速率限制觸發等，皆記錄時間戳與摘要雜湊。

---

## 附錄 A — 建議 JWT Claims（DeWT）

**最小集合（範例）**

```json
{
  "iss": "https://auth.tidebit.com",
  "sub": "<user-id>",
  "aud": ["trade.tidebit.com", "save.tidebit.com", "console.tidebit.com"],
  "exp": 1710000000,
  "iat": 1709996400,
  "amr": ["fido2", "pwdless"],
  "webauthn": {
    "rpid": "tidebit.com",
    "uv": true,
    "devicePubKey": true
  },
  "nonce": "<per-login-uuid>"
}
```

**建議**：

* `exp` 5–15 分；不同風險分層可縮短。
* 高風險 API 以 SPC 同意證據換取一次性 `consent_token`（短效 60–180 秒）。

---

## 附錄 B — 伺服器設定要點

* **Origin／RP 驗證**：對每次 WebAuthn 回應檢查 `rpId` 與 `origin`。
* **金鑰管理**：伺服端只保存公開資料與權杖；不保存私鑰。
* **速率限制**：對登入、二次授權與新裝置事件設定速率與冷卻期。
* **安全標頭**：

  * HSTS：`max-age=63072000; includeSubDomains; preload`
  * CSP：嚴格限制 `script-src`、`connect-src`、`frame-ancestors`。
  * Cookie：`HttpOnly; Secure; SameSite=Strict`（跨站需求時才調整）。
* **日誌與審計**：所有高風險事件寫入安全日誌（簽名或雜湊保全）。

---

## 附錄 C — RP ID 跨子域指南

1. **RP ID 選擇**：以 eTLD+1 為信任根（例 `tidebit.com`）；子域共享。
2. **本機開發**：以固定可解析網域（如 `dev.tidebit.local`）搭配本機憑證；避免直接用 `localhost` 造成 RP 不一致。
3. **混合部署**：若存在多品牌或不同主域，應各自配置 RP ID 並分區 SSO；避免將 RP ID 跨越不同註冊後綴。
4. **瀏覽器差異**：紀錄各引擎對 PRF／devicePublicKey／largeBlob 的支援；對不支援者降級為基礎 WebAuthn + SPC。

---

## 名詞備註（Glossary）

* **FIDO2／Passkey**：以裝置金鑰 + 生物特徵取代密碼的標準；私鑰不離開裝置，天生抗釣魚。
* **RP ID（Relying Party ID）**：FIDO2 的信任根；通常為主網域（eTLD+1）。
* **WebAuthn L3 PRF / hmac‑secret**：在認證過程中由認證器輸出的高熵值；可作為一次性密鑰材料。
* **devicePublicKey**：裝置層級公鑰擴充；可用於新裝置偵測與風控。
* **largeBlob**：與憑證綁定的小型資料儲區；用於體驗優化非安全根基。
* **SPC（Secure Payment Confirmation）**：可驗證的支付／交易確認流程，將摘要綁入授權證據。
* **DeWT**：TideBit 內部的短時效存取權杖；最小權限、短時效。
* **一次性同意證據**：高風險操作經 SPC 產生的可驗證資料，包含摘要與 nonce／到期。
* **EIP‑1271**：合約錢包的簽名驗證標準（在下一篇一次性簽名中用）。

---

## 版本

* **版本**：v2.0‑WP‑FIDO2‑CA（2025‑08）
* **作者**：Tzuhan (Emily)
