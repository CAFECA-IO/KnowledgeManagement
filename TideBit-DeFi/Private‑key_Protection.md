# CAFECA DeWT v2 — 設計總覽與規格（更新版）

> 本版整合你提供的新版設計，修正第 3 步「以簽章導出 seed」在 ECDSA 非決定性上的隱患，改以 **WebAuthn PRF／hmac‑secret** 作為可重現且不洩漏 A 的派生來源；同時保留 **commit–reveal** 作為早期 PoC 的替代路徑，最終建議走 **ZK**。

---

## 0. 核心理念

* 用 **FIDO2 平台金鑰 `A*`** 綁定裝置唯一性（每台裝置只保留一把 `A`，可記錄 `credIdHash`）。
* 由 **`A` 與私密值 `S`** 推導可對鏈簽名的 **區塊鏈金鑰 `B*`**（不把 `A` 暴露在鏈上；`A` 僅用於派生與驗證）。
* 以智能合約維護 **NCFCID（身分證）** 與 **允許的 `B` 公鑰集合** 的對應；任何 DeWT 驗簽都**以鏈上現況為準**（即時撤銷）。
* 以 **零知識證明（ZK）** 或 **承諾‑揭露（commit–reveal）** 替代「把密碼雜湊上鏈」的流程，避免長期暴露。
* **DeWT** 是類 JWT 的**自含式憑證**，但驗證時會**回鏈查** NCFCID 的有效金鑰與撤銷狀態。

> 設計哲學：**中心化使用感受 × 去中心化信任**。伺服器或單一裝置都無法單獨濫用。

---

## 1. 流程（0～11）— 強化版

### 0) 產生一次性密碼與雜湊（建立承諾）

客戶端產生一次性密碼 `PW1` 與隨機鹽 `salt1`，計算：

* `PWH1 = Argon2id(PW1, salt1, params)`（或 `scrypt`），防彩虹表。
* 上鏈只存承諾：`C1 = keccak256(PWH1 || nonce_c1)`，其中 `nonce_c1` 僅客戶端保存。

### 1) 以承諾註冊取得 `NID1`

`registerUser(C1)` → 合約發出事件回傳 `NID1`。此時**不暴露** `PW1` 或 `PWH1`。

### 2) 在裝置建立 FIDO2 平台金鑰 `A1`

使用 **platform authenticator** 建立 `A1=(A1_pub, A1_credId)`，可（選擇性）保存 attestation。系統策略確保「**每裝置僅一把 `A`**」。

### 3) 推導鏈上金鑰 `B1`（**修正版：PRF 派生**）

> 原提案以 `sigA = Sign_A1(challengeX)` 作為 HKDF 輸入，但 ECDSA 簽章**非決定性**（未保證 RFC6979），會導致 seed 不可重現。改為使用 **WebAuthn PRF／hmac‑secret**，其輸出對同一 `A` 與同一 salt 是**決定性**且不可逆。

* 選定 `context` 與 `challengeX`（例如由伺服器／合約事件給定）。
* 要求 WebAuthn `get()` **PRF 擴充**：`F = PRF(A1, salt = H(challengeX || context))`。
* 準備裝置祕密 `S1`（256‑bit 隨機，**永不上鏈**，存於 TEE/SE）。
* **派生 seed**：`seed1 = HKDF(sha256, IKM = (F || H(S1)), salt = H("CAFECA/B-derivation/v1" || challengeX), info = A1_pub)`。
* 以 `seed1` 產生鏈金鑰 `B1=(B1_priv, B1_pub)`（EVM 鏈建議 `secp256k1`；其他鏈可用 `ed25519`）。
* 性質：同裝置＋同 `S1`＋同 `challengeX` 可重現；若要一次性，讓 `challengeX` 每次不同或把時間窗納入 HKDF 參數。

> **回退**（若環境不支援 PRF）：
>
> * 在憑證的 `largeBlob` 存放一次性裝置祕密 `T`（隨機 256‑bit），以 `seed = HKDF(H(S1||T||challengeX))` 派生；或
> * 直接走「部分私鑰保護」3 分片路徑（F/D/S），不做 `B` 派生（參考白皮書第 2 篇）。

### 4) 鏈上登記 FIDO2（以 ZK 或揭露驗證承諾）

* **方案 A（建議）— ZK 證明**：

  * 電路證明者知 `PW1, salt1, nonce_c1`，使 `Argon2id(PW1,salt1)=PWH1` 且 `keccak256(PWH1||nonce_c1)=C1`。
  * 送交易：`enrollFIDO_ZK(NID1, A1_pub, credIdHash, B1_pub, proofZK)`。
  * 合約 `verify(proofZK)` 成功 → 綁定 `NID1 → (A1_pub, B1_pub)`。
* **方案 B — commit–reveal（PoC）**：

  * `revealFIDO(NID1, A1_pub, credIdHash, B1_pub, PWH1, nonce_c1)`；合約驗 `keccak256(PWH1||nonce_c1)==C1`。
  * **缺點**：`PWH1` 被公開（雖為 KDF 後值，仍不理想），僅作過渡。

### 5) 以 `B1` 建立 `NCFCID1`（身分證）

`createIdentity(B1_pub)` → 產出 `NCFCID1`，並把 `B1_pub` 設為管理者。
資料關聯：

* `A1_pub → NCFCID1` 可查
* `NCFCID1 → {A_pub_set, B_pub_set, roles, revocations}` 可查

### 6～10) 第二裝置重複（`A2/B2/登記`）

與 0～4 同理得到 `NID2, A2, B2`，以 `enrollFIDO_ZK(...)` 完成登記。

### 11) 申請加入與審批

`requestJoin(NCFCID1, B2_pub)`；由 `B1_priv`（管理者）呼叫 `approveJoin(NCFCID1, B2_pub)`。
完成後：

* `A2_pub → NCFCID1` 可查
* `NCFCID1 → A1_pub, A2_pub, B1_pub, B2_pub` 可查

> **關鍵修正回顧**：用 ZK/承諾取代明文／KDF 值上鏈；用 PRF 派生 `B` 取代簽章導 seed；一切驗證以鏈上名簿為準。

---

## 2. 智能合約介面（Solidity 片段）

```solidity
interface ICAFECARegistry {
    // 事件
    event UserRegistered(uint256 indexed nid, bytes32 commitment);
    event FIDOEnrolled(uint256 indexed nid, bytes32 aPubHash, bytes bPub, bytes32 credIdHash);
    event IdentityCreated(bytes32 indexed ncfcid, bytes bPub);
    event JoinRequested(bytes32 indexed ncfcid, bytes bPub);
    event JoinApproved(bytes32 indexed ncfcid, bytes bPub, bytes approverB);
    event Revoked(bytes32 indexed ncfcid, bytes bPub);

    // 1) 註冊承諾
    function registerUser(bytes32 commitmentC1) external returns (uint256 nid);

    // 4A) 以 ZK 完成 FIDO 登記
    function enrollFIDO_ZK(
        uint256 nid,
        bytes calldata aPub,        // A 公鑰或其壓縮形式
        bytes32 credIdHash,         // keccak(credentialId)
        bytes calldata bPub,        // 鏈上金鑰 B 公鑰（secp256k1: 33/65 字節）
        bytes calldata proofZK
    ) external;

    // 5) 建立身分證
    function createIdentity(bytes calldata bPub) external returns (bytes32 ncfcid);

    // 11) 加入／審批
    function requestJoin(bytes32 ncfcid, bytes calldata bPub) external;
    function approveJoin(bytes32 ncfcid, bytes calldata bPub) external;

    // 撤銷與輪替
    function revokeB(bytes32 ncfcid, bytes calldata bPub) external;
    function rotateB(bytes32 ncfcid, bytes calldata oldB, bytes calldata newB) external;

    // 查詢
    function resolveByAPubHash(bytes32 aPubHash) external view returns (bytes32 ncfcid);
    function resolveByNCFCID(bytes32 ncfcid) external view returns (bytes[] memory aPubs, bytes[] memory bPubs);
    function isAuthorized(bytes32 ncfcid, bytes calldata bPub) external view returns (bool);
}
```

> 建議：狀態「精簡」、事件「完整」。`aPubHash = keccak256(A_pub)`；attestation blob 放 IPFS 只上 CID。

---

## 3. DeWT（鏈背書的自含式憑證）

### 3.1 Header（`json`）

```json
{
  "typ": "DeWT",
  "alg": "ES256K",
  "kid": "NCFCID1#bKey-0",
  "chain": { "chainId": 8453, "registry": "0xRegistryAddr" }
}
```

### 3.2 Payload（`json`）

```json
{
  "iss": "0xRegistryAddr",   
  "sub": "NCFCID1",
  "aud": "cafeca.app",
  "iat": 1724630400,
  "nbf": 1724630400,
  "exp": 1724634000,
  "nonce": "random-128bit",
  "scope": ["read:profile", "tx:submit"],
  "device": { "aPubHash": "0x...", "credIdHash": "0x..." },
  "proofType": "fido-assert",
  "proofRef": "event:0x<txhash>#<logIndex>"
}
```

### 3.3 簽名

* `signatureB = Sign_B_priv( base64url(header) || "." || base64url(payload) )`。
* 演算法對應 `alg=ES256K`（secp256k1 ECDSA）。

### 3.4 驗證流程

1. 解析 header → 取得 `chainId/registry` 與 `kid`（定位 `NCFCID` 與 key index）。
2. **回鏈查** `isAuthorized(NCFCID, B_pub_from_kid)` 與撤銷狀態。
3. 用 `B_pub` 驗章；檢 `exp/nbf/aud/nonce`。
4. （可選）對 `device.aPubHash/credIdHash` 做策略檢查（如要求 platform authenticator）。

> 即便 DeWT 未到期，只要合約撤銷了 `B`，憑證立即失效。

---

### 3.5 ShardEnvelope（分片綁定證明 — 用「密文 + credId + 簽名」做綁定）

**目的**：證明此導出/分片操作確實由特定 FIDO2 憑證 **A** 在特定上下文下完成，且使用者已於 **SPC** 視窗確認（所見即所簽）。此證明**不包含 `k_u`/私鑰值**，僅作**綁定與稽核**。

**Schema（jsonc）**

```jsonc
{
  "ver": "PPK-1",
  "ncfcid": "0x...",                // 可選：對應身分證
  "credIdHash": "0x...",            // keccak(credentialId)
  "aPubHash": "0x...",              // keccak(A_pub)
  "cipherDigest": "0x...",          // H(ciphertext) —— 你的「密文」雜湊
  "ctx": "0x...",                   // H(ciphertext || rpId || origin)
  "nonce": "uuid-...", "exp": 1710,
  "challengeX": "0x...",            // H("CAFECA/chal/v1" || ctx || credIdHash || nonce || exp)
  "proof": {
    "id": "<credentialId base64url>",
    "authenticatorData": "<base64url>",
    "clientDataJSON":    "<base64url>", // 內含 challengeX/type/origin
    "signature":         "<base64url>"  // A 私鑰簽 (authData || SHA256(clientDataJSON))
  },
  "extensions": { "prf": true, "devicePubKey": true } // 記錄當時擴充
}
```

**驗證要點**

1. 檢 `clientDataJSON.type`、`origin` 與 `challenge` 是否等於 `challengeX`；檢 `rpIdHash`。
2. 以 A 公鑰驗 `signature`；比對 `credIdHash`。
3. 依 `challengeX` 重新跑 **PRF(A)** → **HKDF**（裝置端本地）應能重現相同 `k_u`；伺服器**不接觸**分片值。
4. 策略檢查：`aPubHash/credIdHash` 類型、platform authenticator 要求等。

> 你的「密文 + key id + 簽名」即體現在 `cipherDigest`、`credIdHash`、`proof.signature` 三處，形成可驗可稽核的綁定證據。

---

## 4. 客戶端派生與驗證（Next.js / TypeScript）

### 4.0 挑戰與摘要建構（TypeScript 範例）

```ts
export type ConsentSummary = { asset:string; amount:string; feeCap:string; purpose:string; nonce:string; exp:number };

export function digestSummary(s: ConsentSummary): string {
  const canonical = JSON.stringify({a:s.asset,x:s.amount,f:s.feeCap,p:s.purpose,n:s.nonce,e:s.exp});
  return sha256hex(canonical); // 固定序列化 → SHA-256 → 0x... 字串
}

export function buildChallengeX(cipherHex: string, rpId: string, origin: string, nonce: string, exp: number) {
  const ctx = sha256hex(hexToBytes(cipherHex), utf8(rpId), utf8(origin));
  const tag = utf8("CAFECA/chal/v1");
  return sha256hex(tag, hexToBytes(ctx), utf8(nonce), u64be(exp));
}
```

> 建議：`challengeX` 同時餵給 **WebAuthn PRF 的 salt** 與 **HKDF 的 salt/info**，達成上下文綁定與不可重放。

### 4.1 以 PRF 派生 `B`（瀏覽器）

```ts
// src/lib/dewt/derive.ts
import { hkdf } from '@noble/hashes/hkdf';
import { sha256 } from '@noble/hashes/sha256';
import { secp256k1 } from '@noble/curves/secp256k1';

export type DeriveInput = {
  challengeXHex: string;  // 交易/情境挑戰（hex）
  aPubCompressed: Uint8Array; // A 的壓縮公鑰（可作 info）
  prfOutput: Uint8Array;  // 透過 WebAuthn PRF 取得的 32 bytes
  S1: Uint8Array;         // 256-bit，存於裝置 TEE/SE
};

export function deriveB(input: DeriveInput) {
  const ctx = new TextEncoder().encode('CAFECA/B-derivation/v1');
  const salt = sha256(new Uint8Array([
    ...ctx,
    ...Uint8Array.from(Buffer.from(input.challengeXHex.replace(/^0x/, ''), 'hex')),
  ]));
  const ikm = new Uint8Array([...input.prfOutput, ...sha256(input.S1)]);
  const seed = hkdf(sha256, ikm, salt, input.aPubCompressed, 32);
  const sk = secp256k1.utils.hashToPrivateKey(seed);
  const pk = secp256k1.getPublicKey(sk, true);
  return { sk, pk };
}
```

> `prfOutput` 由 `navigator.credentials.get()` 的 PRF 擴充取得；`S1` 存於 Secure Enclave/StrongBox/TPM，不落地。

### 4.2 驗證 DeWT（伺服器）

```ts
// src/server/dewt/verify.ts
import { secp256k1 } from '@noble/curves/secp256k1';
import { sha256 } from '@noble/hashes/sha256';

export type DeWT = { headerB64: string; payloadB64: string; signature: Uint8Array };

export async function verifyDeWT(tok: DeWT, bPub: Uint8Array) {
  const msg = new TextEncoder().encode(`${tok.headerB64}.${tok.payloadB64}`);
  const digest = sha256(msg);
  return secp256k1.verify(tok.signature, digest, bPub);
}
```

> 實務中需先依 `kid` 回鏈抓對應 `B_pub`，並檢查撤銷、到期、`aud/nonce` 等。

---

## 5. 安全考量與策略

* **避免前置／重放**：ZK 驗證 `C1`；或 commit–reveal 搭配 deadline 與 front‑run guard；所有挑戰／nonce 皆帶時效與 `aud` 綁定。
* **裝置唯一性**：要求 platform authenticator＋`credProtect`；記錄 `credIdHash` 於鏈上避免重複。
* **`B` 暴露風險**：`B` 用於鏈上／網路簽章，若洩漏可即時合約撤銷；`A` 與 `S` 永不外流，可重新派生新 `B`。
* **密碼政策**：一次性 `PW*` 僅用於首次引導或裝置加入；之後以 FIDO2/`B` 無密碼驗證。
* **隱私**：鏈上存 `aPubHash/credIdHash` 而非原值； attestation CID 放 IPFS/私有倉。
* **ZK 電路**：Argon2 上鏈驗證成本高，可改 Poseidon‑friendly 流程：本地 `Argon2→Poseidon`，合約只驗 Poseidon 值。
* **金鑰輪替與撤銷**：`rotateB(ncfcid, oldB, newB)`；`revokeB(ncfcid, bPub)`（事件廣播，驗證端必查撤銷）。
* **權限分層**：每把 `B` 具 role：`admin` / `member` / `tx-only`；DeWT `scope` 對齊角色。

---

## 6. 簡化資料結構

| 實體    | 鏈上欄位                                                                                  | 說明           |
| ----- | ------------------------------------------------------------------------------------- | ------------ |
| 使用者註冊 | `nid => commitmentC`                                                                  | 只存承諾值        |
| 裝置/憑證 | `aPubHash => ncfcid`                                                                  | 由 FIDO2 登記建立 |
| 身分證   | `ncfcid => {bPubs, roles, revocations}`                                               | 名簿核心         |
| 事件    | `UserRegistered, FIDOEnrolled, IdentityCreated, JoinRequested, JoinApproved, Revoked` | 索引/稽核        |
| 外部存儲  | `attestationCID`                                                                      | IPFS / 私有倉   |

---

## 7. 端到端範例（濃縮）

1. 裝置 D1：產生 `PW1, salt1, nonce_c1` → `C1` → `registerUser(C1)` ⇒ `NID1`。
2. D1 建立 `A1`，以 PRF 得 `F`，結合 `S1`→ `B1`。
3. D1 產出 `proofZK`，呼叫 `enrollFIDO_ZK(NID1, A1_pub, credIdHash, B1_pub, proofZK)`。
4. D1 用 `B1_priv` 呼叫 `createIdentity(B1_pub)` ⇒ `NCFCID1`。
5. 裝置 D2：同流程得到 `B2`，`requestJoin(NCFCID1, B2_pub)`；D1（`B1` 管理者）`approveJoin(...)`。
6. 任一裝置簽發 DeWT：用自己的 `B*` 簽 payload；伺服端收到後**回鏈核驗** `NCFCID1` 是否授權該 `B`。

---

## 8. 你可以立刻做的落地任務

* **合約 PoC**：先做無 ZK 版（commit–reveal），介面依上文；事件齊全。
* **派生程式庫**：在 App 端完成 `deriveB`（PRF→HKDF→keypair），封裝 `S` 於 TEE/SE。
* **DeWT 驗證器**：實作 `verifyDeWT(token, chainRpc, registryAddr)`，自動回鏈核驗授權與撤銷。
* **ZK 版本**：下一版替換為 `enrollFIDO_ZK`，讓 reveal 退場。

---

## 9. 與現行白皮書的對位

* **Cross‑App FIDO2**：提供 `PRF`／`devicePublicKey` 與 SPC 的同意證據。
* **Partial Private‑Key**：若走三分片（F/D/S）路徑，可與本方案併存（高風險操作用分片，一般操作用 `B`）。
* **DeWT‑Session**（伺服器 JWT）可與 `DeWT`（鏈背書憑證）**並行**：前者用於 Web2 SSO；後者用於跨域、跨系統的**去中心化驗證**。
