# 在我們的智能合約裡使用 ERC-4626 標準
## reference:
- [Foundry Book](https://book.getfoundry.sh/)
- [How to Use ERC-4626 with Your Smart Contract](https://www.quicknode.com/guides/ethereum-development/smart-contracts/how-to-use-erc-4626-with-your-smart-contract/)
- [Writing ERC-20 Tests in Solidity with Foundry](https://soliditydeveloper.com/foundry)
- [Creating an NFT with Foundry & Solmate](https://rya-sge.github.io/access-denied/2022/12/20/foundry-tutorial-nft/)
- [Vaults and the ERC-4626 token contract](https://cryptomarketpool.com/vaults-and-the-erc-4626-token-contract/)
- [How to write an ERC-4626 token contract for yield-bearing vaults](https://blog.logrocket.com/write-erc-4626-token-contract-yield-bearing-vaults/)
- [github gist: ERC4626yieldvaultcontract.sol](https://gist.github.com/wolz-CODElife/0acdee6ac30b85521377be81a0af19ac)

# 創建一個專案
這邊使用 `forge init <Project_Name>` 建立專案，並用 `forge install <Dependency>` 安裝相關的 library。
# 在智能合約裡使用 ERC-4626 標準
這裡我們使用 forge 來開發智能合約，智能合約全部都在 src 這個 folder 裡面，對應的測試放在 test folder 裡，部署使用的 script 則在 script folder 裡。
## 在智能合約裡 import ERC4626.sol，並將 contract 用 is 指定為 ERC4626
```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "openzeppelin-contracts/contracts/token/ERC20/extensions/ERC4626.sol";

contract Vault is ERC4626 {
    
}
```

## 在 constructor 裡要
