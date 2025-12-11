# 第五章：合規與審計軌跡 (Compliance & Audit Trail)

## 5.1 概述 (Overview)

在金融科技的監理框架中，系統必須具備完整的 **當責性 (Accountability)** 與 **可追溯性 (Traceability)**。傳統的非託管錢包雖然保障了資產隱私，但往往因缺乏透明的權限管理機制，成為監理合規的死角。

本協議透過智能合約的狀態管理能力，建立了 **「全生命週期 (Full Lifecycle)」** 的身分管理機制。從帳戶創建、設備授權到權限撤銷，所有的操作皆在區塊鏈上留存不可篡改的紀錄，為監理單位與企業提供了比傳統資料庫日誌更具公信力的審計軌跡。

-----

## 5.2 身分生命週期管理 (Identity Lifecycle Management)

### 5.2.1 多裝置權限體系 (Multi-Device Authorization)

現實世界中，使用者會更換手機、同時擁有平板與電腦，或遺失設備。因此，單一私鑰綁定單一帳戶的模式並不符合實際需求。

本協議採用 **多重簽名者 (Multi-Signer / 授權設備)** 架構。使用者可以將新的 FIDO2 裝置（如新的 iPhone 或 YubiKey）註冊為合法的簽名者，實現跨裝置的身分漫遊與備援。

> **代碼證據 5.2.1：**
> 參見 `contracts/scw.sol` 與 `src/app/[locale]/poc/multi-signer/page.tsx`/poc/multi-signer/page.tsx]。
>
> 前端介面 (`page.tsx`) 提供直觀的設備管理功能，底層則呼叫合約的 `addSigner` 函式。該函式允許用戶透過現有的授權設備簽名，將新設備的公鑰加入合約的信任列表 (`signers`)。
>
> ```solidity
> //
> function addSigner(uint256 x, uint256 y) public onlySelf {
>     _addSigner(x, y);
> }
> ```

> ```solidity
> function \_addSigner(uint256 x, uint256 y) internal {
> bytes32 hash = keccak256(abi.encode(x, y));
> if (\!signers[hash]) {
> signers[hash] = true;
> signerCount++;
> // 發出合規事件：新增授權者
> emit SignerAdded(hash, x, y);
> }
> }
> ```


### 5.2.2 社交恢復與防鎖死機制 (Social Recovery & Anti-Lockout)

在非託管環境中，誤刪唯一的一把鑰匙將導致資產永久鎖定（即「數位死亡」）。為了防範此類作業風險 (Operational Risk)，本協議在合約層實作了強制性的安全檢查。

系統禁止使用者在僅剩最後一個授權裝置的情況下執行移除操作，確保帳戶永遠保有至少一個存取入口。此外，多裝置架構本身即構成了一種 **自主社交恢復 (Self-Sovereign Social Recovery)** 機制：遺失一支手機時，可使用備用的平板或電腦將遺失設備移除。

> **代碼證據 5.2.2：**
> 參見 `contracts/scw.sol`。
> 在 `removeSigner` 函式中，`require(signerCount > 1)` 是強制執行的鏈上規則 (On-Chain Rule)，任何試圖移除最後一把鑰匙的交易都會被虛擬機自動回滾 (Revert)。
>
> ```solidity
> //
> function removeSigner(uint256 x, uint256 y) public onlySelf {
>     bytes32 hash = keccak256(abi.encode(x, y));
>     if (signers[hash]) {
>         // 安全檢查：確保移除後至少還剩一個 Signer，防止帳戶鎖死
>         require(signerCount > 1, "SCW: cannot remove last signer");
>         
>         signers[hash] = false;
>         signerCount--;
>         // 發出合規事件：移除授權者
>         emit SignerRemoved(hash, x, y);
>     }
> }
> ```

-----

## 5.3 鏈上審計軌跡與監理科技 (On-Chain Audit Trail & RegTech)

### 5.3.1 事件驅動的合規紀錄 (Event-Driven Compliance Records)

不同於傳統系統依賴容易被篡改的伺服器日誌 (Server Logs)，本協議利用以太坊的 **事件 (Events / 合規日誌)** 機制來記錄所有的權限變更。這些事件一經發出，即被永久寫入區塊鏈區塊中，任何人都無法事後修改或刪除。

這些鏈上事件構成了具備法律效力的數位證據：

  * **AccountCreated (帳戶啟用)**：證明身分何時建立、初始綁定的裝置為何。
  * **SignerAdded (授權變更)**：證明何時新增了存取裝置。
  * **SignerRemoved (權限撤銷)**：證明何時移除了舊裝置（例如手機遺失後）。

> **代碼證據 5.3.1：**
> 參見 `contracts/scw_factory.sol` 與 `contracts/scw.sol`。
> 這些事件定義包含了時間戳記與操作內容，為外部稽核工具提供了標準化的索引介面。
>
> ```solidity
> //
> event AccountCreated(address indexed scw, uint256 pubKeyX, uint256 pubKeyY, uint256 salt);
> ```

> ```solidity
> //
> event SignerAdded(bytes32 indexed pubKeyHash, uint256 x, uint256 y);
> event SignerRemoved(bytes32 indexed pubKeyHash, uint256 x, uint256 y);
> ```

### 5.3.2 數位鑑識與反洗錢支援 (Digital Forensics & AML Support)

對於監理單位而言，能夠重建用戶的行為歷史至關重要。透過解析上述的鏈上事件，合規人員可以繪製出完整的 **權限演變圖譜 (Authority Evolution Graph)**。

例如，若發生可疑交易，稽核人員可立即在鏈上驗證：

1.  該交易是由哪一個公鑰 (裝置) 授權的？
2.  該裝置是在什麼時間點被加入信任列表的？
3.  該裝置是否已被標記為遺失或移除？

這種透明度大幅降低了數位鑑識的成本與爭議，完全滿足 AML 對於 **「了解你的客戶 (KYC)」** 與 **「持續監控 (Ongoing Monitoring)」** 的技術要求。

-----

## 5.4 本章總結 (Chapter Summary)

本章闡述了本協議如何滿足企業級與監理級的管理需求：

1.  **生命週期保障**：透過 `addSigner` / `removeSigner`，支援靈活的裝置變更與權限轉移。
2.  **作業風險控制**：透過合約層的 `signerCount` 檢查，杜絕了導致資產丟失的人為疏失。
3.  **絕對透明**：透過不可篡改的 `Events`，建立了符合 AML 標準的審計軌跡。

至此，我們論述了本協議從底層密碼學安全、應用層商業模式，到頂層合規監管的解決方案。
