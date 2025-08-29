本去中心化交易所的核心機制仰賴於**智能合約**來實現其**訂單簿**與**撮合引擎**功能，徹底顛覆了傳統中心化交易所資產託管的模式。其設計哲學與 Uniswap 的**自動化做市商 (AMM)** 原理相契合，旨在將所有交易活動鎖定於區塊鏈上的智能合約，而非集中於第三方機構，從而確保資產的**去中心化保管**與交易的**自動化執行**。

智能合約環境的特性要求極高的**運算效率**與**安全性**，特別是須嚴格遵守**運算消耗上限 (Gas Limit)** 並**避免無窮迴圈**。為此，本交易所的訂單簿採用了精妙的資料結構。Maker 單（限價單）透過多層 `mapping` 搭配 `linkedBook` 結構進行管理。當新的 Maker 單產生時，系統運用**鏈結串列 (Linked List)** 的排序邏輯，將其在有限的運算次數內安插至正確的價格位置，確保訂單簿的時效性與撮合效率。

撮合引擎的運作流程如下：當 Taker 單（市價單）提交時，智能合約會依照預設的撮合邏輯（如 `findAndTrade` 和 `makeTrade` 函數） 從 Maker 訂單簿中搜尋最佳匹配。為避免潛在的無窮迴圈與超越區塊的 Gas 上限，程式碼中明確設定了**自動撮合次數 (autoMatch)** 的上限（預設為 10 次），限制單次交易中能匹配的 Maker 單數量。此外，智能合約的實作也嚴格限制了**有限的參數傳遞方式**，以最大化執行效率。在整個交易生命週期中，包括資金存入、訂單提交、撮合、費用計算及結算，均透過一系列內建函數 (例如 `depositAndFreeze`, `makeOrder`, `fillOrder`, `updateBalance` 等) 精確處理。合約中亦整合 `SafeMath` 函式庫，以防止在複雜的數值運算中發生溢位或下溢等問題，進一步保障交易的精確與安全。

在流動性管理方面，本交易所借鑒了 Uniswap V3 的**集中流動性 (Concentrated Liquidity)** 創新機制。此機制允許流動性提供者將其資產集中於特定的價格區間內，顯著提升了**資本效率**。流動性 (L)、資產數量 (x, y) 與價格區間 (pa, pb, P) 之間的關係透過嚴謹的數學公式定義，例如當前價格 P 介於 pa 和 pb 之間時，資產 X 和 Y 的數量可分別透過 Eq. 11 (`x = L (√pb - √P) / (√P · √pb)`) 和 Eq. 12 (`y = L(√P - √pa)`) 計算。這些數學模型是實現精確資產分配和流動性供給的核心。

<img width="547" height="108" alt="CleanShot 2025-08-29 at 16 47 15" src="https://github.com/user-attachments/assets/7419f26d-ed80-4920-b8f0-84a0a453691f" />

x：需要存入的 token X 數量

y：需要存入的 token Y 數量

pa,pb​：LP 選定的價格區間

P：當前價格

L：流動性大小

<img width="396" height="529" alt="CleanShot 2025-08-29 at 16 43 28" src="https://github.com/user-attachments/assets/cc8ef657-9bb9-45d8-b984-7e554ad6e678" />



為了在 EVM 環境中精確執行這些複雜的交易與流動性計算，智能合約的開發必須嚴謹考量多項**實作細節**：

1. **價格刻度 (Ticks)**：將連續的價格空間映射到離散的刻度點，以 `p(i) = 1.0001i` 定義價格與刻度的關係。

2. **刻度間距 (Tick Spacing)**：根據不同的手續費等級，定義可初始化刻度之間的最小間隔，影響流動性提供的粒度。

3. **定點數運算 (Fixed Point Math)**：由於 Solidity 不支援浮點數，所有涉及小數的運算都必須採用定點數方式處理，以最小化捨入誤差並確保計算結果的準確性。

4. **ERC20 代幣的小數位 (Decimals)**：在進行跨代幣價格計算時，必須將不同 ERC20 代幣的 `decimals` 參數納入考量，進行適當的單位轉換，以確保價格計算的正確性。

透過上述智能合約驅動的訂單簿、高效撮合引擎以及借鑒 Uniswap AMM 的流動性管理機制，本交易所成功構建了一個既安全透明、又高效資本運用的去中心化交易平台。




# Reference

- [++智能合約實現的交易所++](https://github.com/XPAEXCHANGE/smart-contracts/blob/master/Solidity/Baliv.sol)

- [Uniswap v3 liquidity math](https://atiselsts.github.io/pdfs/uniswap-v3-liquidity-math.pdf)
