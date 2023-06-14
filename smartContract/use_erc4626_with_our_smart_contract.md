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
## 定義 vUSDT
因為在 Vault 初始化時就需要傳入這個 Vault 裡面要使用的 asset 為 erc20 token，所以要先建立。建立一個 USDT.sol 的檔案。
```solidity=
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract VaultUSDT is ERC20 {
    
    constructor() ERC20("Vault USDT", "vUSDT") {
        this;
    }
}
```
### 在裡面提供鑄幣(mint)及銷毀(burn)的功能
```solidity=
function mint(address to, uint256 amount) public virtual {
    _mint(to, amount);
}

function burn(address form, uint256 amount) public virtual {
    _burn(form, amount);
}
```
## 定義 Vault
在 src 資料夾裡建立一個 Vault.sol 的檔案，在智能合約裡 import ERC4626.sol，並將 contract 用 is 指定為 ERC4626。
```solidity=
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "openzeppelin-contracts/contracts/token/ERC20/extensions/ERC4626.sol";

contract Vault is ERC4626 {
    
}
```

### 在 constructor 裡要同時初始化 erc4626 及 erc20
```solidity=
 ...
 constructor(ERC20 _asset, string memory _name, string memory _symbol) ERC4626(_asset) ERC20(_name, _symbol) {}
 ...
```
### 定義 Vault 裡面要用的 asset
這裡我將這個 asset 命名為 \_vUSDT
```solidity=
...
constructor(ERC20 _asset, string memory _name, string memory _symbol) ERC4626(_asset) ERC20(_name, _symbol) {
    _vUSDT = _asset;
}
```
### 提供 totalAssets 的功能
```solidity=
// returns total number of assets
function totalAssets() public view override returns (uint256) {
    return _vUSDT.balanceOf(address(this));
}
```
### 提供 deposit 的功能
```solidity=
// a deposit function that receives assets from users
function deposit(uint256 assets) public {
    // checks that the deposit is higher than 0
    require(assets > 0, "Deposit less than Zero");

    _vUSDT.transferFrom(msg.sender, address(this), assets);

    // checks the value of assets the holder has
    shareHolder[msg.sender] += assets;
    // mints the reciept(shares)
    _mint(msg.sender, assets);

    emit Deposit(msg.sender, address(this), assets, shareHolder[msg.sender]);
}
```
## 測試
在 test 資料夾裡建立一個 Vault.t.sol 的檔案。
```solidity=
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Vault.sol";
import "../src/USDT.sol";

contract VaultTest is Test {
    Vault public vault;
    VaultUSDT public vUSDT;

    function setUp() public {
        vUSDT = new VaultUSDT();
        vault = new Vault(vUSDT, 'Vault USDT', 'vUSDT');
    }

    function testDeposit() public {
        vUSDT.mint(address(this), 100);
        vUSDT.approve(address(vault), 100);
        vault.deposit(100);
        assertEq(vault.totalAssets(), 100);
        emit log_named_uint("the vault totalAssets", vault.totalAssets());
    }
}
```
在 terminal 使用下列的指令測試:
```sh
forge test -vvvv
```
<img width="1284" alt="Screenshot 2023-06-14 at 3 47 30 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/09471a8a-bf30-4de3-a8e9-126cf0550436">

### 部署到本地節點測試
### 使用 terminal 打開 anvil
```sh
anvil
```
### 部署
```sh
forge script script/Vault.s.sol:VaultScript --fork-url=http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast
```
### Deposit
```sh
export PRIVATE_KEY=<private provide by anvil>
```
1. 鑄幣
 ```sh
cast send <erc20_contract> "mint(address,uint256)" <my_address> <amount> --private-key $PRIVATE_KEY
```
注意這裡的 address 要對應所使用的 private key
ex.
```sh
cast send 0x5fbdb2315678afecb367f032d93f642f64180aa3 "mint(address,uint256)" 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 100 --private-key $PRIVATE_KEY
```
on anvil log:
<img width="612" alt="Screenshot 2023-06-14 at 4 08 32 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/c6ddf3da-805d-4083-99e6-55dbdb442cf2">

transaction result:
<img width="1087" alt="Screenshot 2023-06-14 at 4 09 22 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/9ee7d185-6a9e-46b6-8bfc-978023464e0d">

2. approve
 ```sh
cast send <erc20_contract> "mint(address,uint256)" <vault_contract> <amount> --private-key $PRIVATE_KEY
```

ex.
```sh
cast send 0x5fbdb2315678afecb367f032d93f642f64180aa3 "approve(address,uint256)" 0xe7f1725e7734ce288f8367e1bb143e90bb3f0512 100 --private-key $PRIVATE_KEY
```
on anvil log:
<img width="642" alt="Screenshot 2023-06-14 at 4 14 10 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/8303ed65-e447-4f99-b79f-42d8738cd677">

transaction result:
<img width="1090" alt="Screenshot 2023-06-14 at 4 14 41 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/432c0f22-27e4-4082-8de0-7d7662170ca6">

3. [failed] deposit
```sh
cast send <vault_contract> "deposit(uint256)" <amount> --private-key $PRIVATE_KEY
```

ex.
```sh
cast send 0xe7f1725e7734ce288f8367e1bb143e90bb3f0512 "deposit(uint256)" 100 --private-key $PRIVATE_KEY
```
transaction result:
<img width="1074" alt="Screenshot 2023-06-14 at 4 40 46 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/eb4dc6af-3dd4-471a-90ea-cae6c9d852fa">
<img width="953" alt="Screenshot 2023-06-14 at 4 43 10 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/286a50ef-9650-4218-9996-7caaa14560dd">
<img width="672" alt="Screenshot 2023-06-14 at 4 46 24 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/48b1d6d2-3928-421c-8fc1-cbbb6fb3f38a">

