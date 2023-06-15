# 在我們的智能合約裡使用 ERC-4626 標準
## reference:
- [Foundry Book](https://book.getfoundry.sh/)
- [How to Use ERC-4626 with Your Smart Contract](https://www.quicknode.com/guides/ethereum-development/smart-contracts/how-to-use-erc-4626-with-your-smart-contract/)
- [Writing ERC-20 Tests in Solidity with Foundry](https://soliditydeveloper.com/foundry)
- [Creating an NFT with Foundry & Solmate](https://rya-sge.github.io/access-denied/2022/12/20/foundry-tutorial-nft/)
- [Vaults and the ERC-4626 token contract](https://cryptomarketpool.com/vaults-and-the-erc-4626-token-contract/)
- [How to write an ERC-4626 token contract for yield-bearing vaults](https://blog.logrocket.com/write-erc-4626-token-contract-yield-bearing-vaults/)
- [github gist: ERC4626yieldvaultcontract.sol](https://gist.github.com/wolz-CODElife/0acdee6ac30b85521377be81a0af19ac)
- [Fantom Developer Documentation](https://docs.fantom.foundation/)
- [Solidity by Example](https://solidity-by-example.org/)
- [RPC Info](https://rpc.info/#fantom)

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
// create your variables and immutables
ERC20 private immutable _vUSDT;
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
import "../src/VaultUSDT.sol";

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
cast send <erc20_contract> "approve(address,uint256)" <vault_contract> <amount> --private-key $PRIVATE_KEY
```

ex.

```sh
cast send 0x5fbdb2315678afecb367f032d93f642f64180aa3 "approve(address,uint256)" 0xe7f1725e7734ce288f8367e1bb143e90bb3f0512 100 --private-key $PRIVATE_KEY
```
on anvil log:

<img width="642" alt="Screenshot 2023-06-14 at 4 14 10 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/8303ed65-e447-4f99-b79f-42d8738cd677">

transaction result:

<img width="1090" alt="Screenshot 2023-06-14 at 4 14 41 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/432c0f22-27e4-4082-8de0-7d7662170ca6">

3. deposit
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

# 部署到 ropsten
```sh
export RPC_URL=<rpc_url_of_the_chain_that_you_want_to_deploy_on>
export PRIVATE_KEY=<your_private_key>
```

ex.

```sh
export RPC_URL=https://rpc.testnet.fantom.network/
export PRIVATE_KEY=<your_private_key>
```

## 打開本地節點
```sh
anvil --fork-url $RPC_URL
```
## 部署
```sh
forge script script/Vault.s.sol:VaultScript --rpc-url $RPC_URL --private-key $PRIVATE_KEY  --broadcast
```
<img width="1277" alt="Screenshot 2023-06-15 at 11 14 18 AM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/665deb17-0562-4396-8c1e-94e0ed2fbb76">
<img width="1792" alt="Screenshot 2023-06-15 at 11 15 26 AM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/1f276552-8214-4b56-9f79-f95b220cf789">
<img width="1792" alt="Screenshot 2023-06-15 at 11 16 18 AM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/50d83496-2da2-4f23-9bac-b7472cbf5204">

## 進行交易
### mint 1 vUSDT on ERC20_CONTRACT
```sh
export ERC20_CONTRACT=0x093619b5fbfd63798e59052847c8c817011a512d
cast send $ERC20_CONTRACT "mint(address,uint256)" 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 1 --private-key $PRIVATE_KEY --rpc-url $RPC_URL
```

* 一定要記得加 `--rpc-url $RPC_URL`

<img width="1286" alt="Screenshot 2023-06-15 at 11 36 18 AM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/74576769-e2be-4634-a91d-730ed1a719cf">
<img width="1680" alt="Screenshot 2023-06-15 at 11 39 53 AM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/76ab172d-efe7-4d2f-a46b-9349ece691f7">

#### decode logs

```sh
cast receipt --rpc-url $RPC_URL 0xb3fb21890aac9ab6816e6bae3e22deba2ccce98b2dd2caf8c12800c4c777d9b4  --json|jq
```

```json
{
  "transactionHash": "0xb3fb21890aac9ab6816e6bae3e22deba2ccce98b2dd2caf8c12800c4c777d9b4",
  "transactionIndex": "0x0",
  "blockHash": "0x00004cc1000026066a0f17e8d0ed59f0387430ff1432468696a6e2cf3af0d5ad",
  "blockNumber": "0xff0246",
  "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
  "to": "0x093619b5fbfd63798e59052847c8c817011a512d",
  "cumulativeGasUsed": "0x10a68",
  "gasUsed": "0x10a68",
  "contractAddress": null,
  "logs": [
    {
      "address": "0x093619b5fbfd63798e59052847c8c817011a512d",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266"
      ],
      "data": "0x0000000000000000000000000000000000000000000000000000000000000001",
      "blockHash": "0x00004cc1000026066a0f17e8d0ed59f0387430ff1432468696a6e2cf3af0d5ad",
      "blockNumber": "0xff0246",
      "transactionHash": "0xb3fb21890aac9ab6816e6bae3e22deba2ccce98b2dd2caf8c12800c4c777d9b4",
      "transactionIndex": "0x0",
      "logIndex": "0x0",
      "removed": false
    }
  ],
  "status": "0x1",
  "logsBloom": "0x00000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000020000000000000100000800000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010002000000200000000000000000000000002000000000000000000020000000001000000000000000000000000000000000000000000000000000000000",
  "type": "0x0",
  "effectiveGasPrice": "0x3d3b9538"
}

```
### approve 1 vUSDT to ERC4626_CONTRACT on ERC20_CONTRACT
```sh
export ERC4626_CONTRACT=0x6c87575aeeffcdc6be3ad4c7c494fe2ba2df55bb
cast send $ERC20_CONTRACT "approve(address,uint256)" $ERC4626_CONTRACT 1 --private-key $PRIVATE_KEY --rpc-url $RPC_URL
```
<img width="1288" alt="Screenshot 2023-06-15 at 11 40 44 AM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/7f071825-a2d4-4f65-9d86-93efc8f5d8de">
<img width="1680" alt="Screenshot 2023-06-15 at 11 40 10 AM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/5416a22b-c67b-4a8b-8479-ed1d3f133b3f">

#### decode logs

```sh
cast receipt --rpc-url $RPC_URL 0xdf76de424ea7fc773d4c44a8b5806d5e4e0c1b7d5a45db3d69203dec236f8a06  --json|jq
```

```json
{
  "transactionHash": "0xdf76de424ea7fc773d4c44a8b5806d5e4e0c1b7d5a45db3d69203dec236f8a06",
  "transactionIndex": "0x0",
  "blockHash": "0x00004cc10000299e1e70143bc3691d5cce60c9351706ac635d09d78cf1835edb",
  "blockNumber": "0xff02b7",
  "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
  "to": "0x093619b5fbfd63798e59052847c8c817011a512d",
  "cumulativeGasUsed": "0xb479",
  "gasUsed": "0xb479",
  "contractAddress": null,
  "logs": [
    {
      "address": "0x093619b5fbfd63798e59052847c8c817011a512d",
      "topics": [
        "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
        "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "0x0000000000000000000000006c87575aeeffcdc6be3ad4c7c494fe2ba2df55bb"
      ],
      "data": "0x0000000000000000000000000000000000000000000000000000000000000001",
      "blockHash": "0x00004cc10000299e1e70143bc3691d5cce60c9351706ac635d09d78cf1835edb",
      "blockNumber": "0xff02b7",
      "transactionHash": "0xdf76de424ea7fc773d4c44a8b5806d5e4e0c1b7d5a45db3d69203dec236f8a06",
      "transactionIndex": "0x0",
      "logIndex": "0x0",
      "removed": false
    }
  ],
  "status": "0x1",
  "logsBloom": "0x00000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000001000000000000000000000000000000000000010000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000010000000001200000000000000000000000002000000000000000000000000010001000000000000000000000000000000000000000000000000000000000",
  "type": "0x0",
  "effectiveGasPrice": "0x3d38a350"
}
```
### deposit 1 vUSDT to ERC4626_CONTRACT 

```sh
cast send $ERC4626_CONTRACT "deposit(uint256)" 1 --private-key $PRIVATE_KEY --rpc-url $RPC_URL
```
<img width="1286" alt="Screenshot 2023-06-15 at 11 47 51 AM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/173d4d54-f712-48a0-a6c7-236c00909d5f">
<img width="1680" alt="Screenshot 2023-06-15 at 11 45 06 AM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/0ae04918-d904-49b8-9287-9a6c77b280e3">

#### decode logs

```sh
cast receipt --rpc-url $RPC_URL 0x1416715bc4c10be896c72c5b763b57a57153d96dd0fdddd6ad58365fdb23f6b1 --json|jq
```

```json
{
  "transactionHash": "0x1416715bc4c10be896c72c5b763b57a57153d96dd0fdddd6ad58365fdb23f6b1",
  "transactionIndex": "0x0",
  "blockHash": "0x00004cc100002db99fa25d51113cceb770606e2b94366a16c21b35afe070a606",
  "blockNumber": "0xff0336",
  "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
  "to": "0x6c87575aeeffcdc6be3ad4c7c494fe2ba2df55bb",
  "cumulativeGasUsed": "0x1e096",
  "gasUsed": "0x1e096",
  "contractAddress": null,
  "logs": [
    {
      "address": "0x093619b5fbfd63798e59052847c8c817011a512d",
      "topics": [
        "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
        "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "0x0000000000000000000000006c87575aeeffcdc6be3ad4c7c494fe2ba2df55bb"
      ],
      "data": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "blockHash": "0x00004cc100002db99fa25d51113cceb770606e2b94366a16c21b35afe070a606",
      "blockNumber": "0xff0336",
      "transactionHash": "0x1416715bc4c10be896c72c5b763b57a57153d96dd0fdddd6ad58365fdb23f6b1",
      "transactionIndex": "0x0",
      "logIndex": "0x0",
      "removed": false
    },
    {
      "address": "0x093619b5fbfd63798e59052847c8c817011a512d",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "0x0000000000000000000000006c87575aeeffcdc6be3ad4c7c494fe2ba2df55bb"
      ],
      "data": "0x0000000000000000000000000000000000000000000000000000000000000001",
      "blockHash": "0x00004cc100002db99fa25d51113cceb770606e2b94366a16c21b35afe070a606",
      "blockNumber": "0xff0336",
      "transactionHash": "0x1416715bc4c10be896c72c5b763b57a57153d96dd0fdddd6ad58365fdb23f6b1",
      "transactionIndex": "0x0",
      "logIndex": "0x1",
      "removed": false
    },
    {
      "address": "0x6c87575aeeffcdc6be3ad4c7c494fe2ba2df55bb",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266"
      ],
      "data": "0x0000000000000000000000000000000000000000000000000000000000000001",
      "blockHash": "0x00004cc100002db99fa25d51113cceb770606e2b94366a16c21b35afe070a606",
      "blockNumber": "0xff0336",
      "transactionHash": "0x1416715bc4c10be896c72c5b763b57a57153d96dd0fdddd6ad58365fdb23f6b1",
      "transactionIndex": "0x0",
      "logIndex": "0x2",
      "removed": false
    },
    {
      "address": "0x6c87575aeeffcdc6be3ad4c7c494fe2ba2df55bb",
      "topics": [
        "0xdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d7",
        "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "0x0000000000000000000000006c87575aeeffcdc6be3ad4c7c494fe2ba2df55bb"
      ],
      "data": "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001",
      "blockHash": "0x00004cc100002db99fa25d51113cceb770606e2b94366a16c21b35afe070a606",
      "blockNumber": "0xff0336",
      "transactionHash": "0x1416715bc4c10be896c72c5b763b57a57153d96dd0fdddd6ad58365fdb23f6b1",
      "transactionIndex": "0x0",
      "logIndex": "0x3",
      "removed": false
    }
  ],
  "status": "0x1",
  "logsBloom": "0x00000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000400000000000000008000000000000000000000000000000000000000000000000020000000000002100000800000000001004000000000010000000000000000000000010000000000000000000000000000000000000000200000000020000000000000000000000000000000000000000000000000000000000000000010002000001200000000000000000000010002008000000000000000020000010001000000000000000000000000000000000000000000000000000000000",
  "type": "0x0",
  "effectiveGasPrice": "0x3d37d060"
}
```
