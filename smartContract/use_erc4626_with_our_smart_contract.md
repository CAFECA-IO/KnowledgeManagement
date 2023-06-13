# 用 foundry 開發使用 ERC-4626的 智能合約
## reference:
- [How to Use ERC-4626 with Your Smart Contract](https://www.quicknode.com/guides/ethereum-development/smart-contracts/how-to-use-erc-4626-with-your-smart-contract/)
- [Writing ERC-20 Tests in Solidity with Foundry](https://soliditydeveloper.com/foundry)
- [Creating an NFT with Foundry & Solmate](https://rya-sge.github.io/access-denied/2022/12/20/foundry-tutorial-nft/)
- [Vaults and the ERC-4626 token contract](https://cryptomarketpool.com/vaults-and-the-erc-4626-token-contract/)
## 構建 ERC-4626 金庫
### 使用 foundry init 〈dir〉建立專案
```
foundry init vault_erc4626
```

### 安裝 Openzeppelin Contracts  
為了在我們的專案中使用 ERC4626 及 ERC20 我們先安裝 Openzeppelin Contracts 及 transmissions11/solmate
```
forge install transmissions11/solmate Openzeppelin/openzeppelin-contracts
```
<img width="464" alt="Screenshot 2023-06-13 at 5 13 25 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/ad25ca61-4b6d-408a-8209-de5f483e14ff">

### 在 src 下 建立 TokenVault.sol的新文件

<img width="441" alt="Screenshot 2023-06-13 at 5 13 46 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/8972099f-bfbb-41ca-ad85-97a7400c4a17">

構建我們的保險庫的第一步是確定我們的許可證標識符、Solidity 編譯版本，然後導入 ERC-4626 庫。
```solidity=
//SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "openzeppelin-contracts/contracts/token/ERC20/extensions/ERC4626.sol";
```
導入 ERC-4626 庫後，下一步是為您的合約指定一個名稱並使用“is”關鍵字繼承該庫。

```solidity=
//SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import {ERC4626} from "solmate/mixins/ERC4626.sol";
import {ERC20} from "solmate/tokens/ERC20.sol";

contract TokenVault is ERC4626 {

}
```
下一步是創建一個映射，在用戶存款後跟踪他們在金庫中的份額。該映射將維護每個用戶的份額餘額的記錄。

```solidity=
// a mapping that checks if a user has deposited the token
mapping(address => uint256) public shareHolder;
```
接下來，創建一個構造函數，為 ERC-4626 構造函數賦值：_asset用於 ERC20 代幣地址，_name用於金庫代幣的名稱，_symbol用於金庫代幣的符號。例如，如果您存入 USDC，您可以使用“vaultUSDC”作為_name ，使用“vUSDC”作為_symbol。
```solidity=
constructor(ERC20 _UNDERLYING)
        ERC4626(
            // _asset
            _UNDERLYING,
            // _name, ex: Rari Dai Stablecoin Vault
            string(abi.encodePacked("Rari ", _UNDERLYING.name(), " Vault")),
            // _symbol, ex: rvDAI
            string(abi.encodePacked("rv", _UNDERLYING.symbol()))
        )
    {
        UNDERLYING = _UNDERLYING;


        // Prevent minting of rvTokens until
        // the initialize function is called.
        totalSupply = type(uint256).max;
    }
```

## 完整的 code
```solidity=
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC4626} from "solmate/mixins/ERC4626.sol";
import {ERC20} from "solmate/tokens/ERC20.sol";

contract TokenVault is ERC4626 {
    ERC20 public immutable UNDERLYING;
    // a mapping that checks if a user has deposited the token
    mapping(address => uint256) public shareHolder;

    constructor(ERC20 _UNDERLYING)
        ERC4626(
            // Underlying token
            _UNDERLYING,
            // ex: Rari Dai Stablecoin Vault
            string(abi.encodePacked("Rari ", _UNDERLYING.name(), " Vault")),
            // ex: rvDAI
            string(abi.encodePacked("rv", _UNDERLYING.symbol()))
        )
    {
        UNDERLYING = _UNDERLYING;


        // Prevent minting of rvTokens until
        // the initialize function is called.
        totalSupply = type(uint256).max;
    }

    function totalAssets() public view override returns (uint256 totalUnderlyingHeld) {
        
    }
}
```

## 資產代幣的智能合約：
```solidity!
// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDC is ERC20 {
    constructor() ERC20("USDC", "USDC") {}

    function mint(address recipient, uint256 amount) external {
        _mint(recipient, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }
}
```

首先創建一個名為 的文件USDC.sol，然後粘貼上面顯示的資產令牌智能合約代碼。




