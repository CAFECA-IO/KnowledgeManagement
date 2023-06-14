# Develop smart contract with foundry
## install foundry
```sh=
```
## create a new project with forge
```sh=
forge init <Project_Name>
```
## install dependency
```sh=
forge install <Dependency>
```
ex. install openZeppelin contracts
```sh=
forge install Openzeppelin/openzeppelin-contracts
```

## 開發智能合約
在 src/ 下面開發智能合約，檔案名以 .sol 結尾
ex. 以開發erc4626的智能合約為例，在src下新增一個 Vault.sol 在此檔案裡新增下列 code:
```solidity=
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "openzeppelin-contracts/contracts/token/ERC20/extensions/ERC4626.sol";

contract Vault is ERC4626 {
    ERC20 private immutable _vUSDT;

    mapping(address => uint256) public shareHolder;

    constructor(ERC20 _asset, string memory _name, string memory _symbol) ERC4626(_asset) ERC20(_name, _symbol) {
        _vUSDT = _asset;
    }

    // returns total number of assets
    function totalAssets() public view override returns (uint256) {
        return _vUSDT.balanceOf(address(this));
    }

    // returns total balance of user
    function totalAssetsOfUser(address _user) public view returns (uint256) {
        return _vUSDT.balanceOf(_user);
    }
}
```
因為要初始化 Vault 智能合約還需要一個 erc20 的 token，所以再新增一個 USDT.sol 的檔案在裡面新增下列 code:
```solidity=
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract USDT is ERC20 {
    constructor() ERC20("USDT", "USDT") {
        this;
    }
}
```
## 測試智能合約
在 test/ 下面測試智能合約，檔案名以 .t.sol 結尾
ex. 以測試 Vault.sol 為例，新增一個 Vault.t.sol 的檔案在裡面新增下列 code
```solidity=
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Vault.sol";
import "../src/USDT.sol";

contract VaultTest is Test {
    Vault public vault;
    USDT public usdt;

    function setUp() public {
        usdt = new USDT();
        vault = new Vault(usdt, 'Vault USDT', 'vUSDT');
    }

    function testTotalAssets() public {
        emit log_named_uint('the vault totalAssets', vault.totalAssets());
        assertEq(vault.totalAssets(), 0);
    }

    function testTotalAssetsOfUser(address user) public {
        assertEq(vault.totalAssetsOfUser(user), 0);
    }
}
```
在 termail run 下列 command 進行測試:
```sh=
forge test
``` 
其中在 `function testTotalAssets()` 裡面有 `emit log_named_uint('the vault totalAssets', vault.totalAssets());` 可以在 `forge test` 後面加 `-vv` 來將 log 印出來

\*Ref: -v: [foundry book: forge test => evm options](https://book.getfoundry.sh/reference/forge/forge-test#evm-options)*
\*Ref: -v: [foundry book: Std Assertions](https://book.getfoundry.sh/reference/forge-std/std-assertions)*
\*Ref: -v: [foundry book: Std Logs](https://book.getfoundry.sh/reference/forge-std/std-logs)*
## 本地部署
### 開啟 anvil
在 termianl 輸入下列 command:
```sh=
anvil
```
<img width="648" alt="Screenshot 2023-06-14 at 1 33 53 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/6a4e14f6-d3c6-485f-890f-02f65500a25b">

### 在 script/ 下面部署智能合約 的 script，檔案名以 .s.sol 結尾
ex. 以部署 Vault.sol 為例，新增一個 Vault.s.sol 的檔案在裡面新增下列 code
```solidity=
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/USDT.sol";
import "../src/Vault.sol";

contract VaultScript is Script {
    function setUp() public {}

    function run() public {
        // vm.broadcast();
        vm.startBroadcast();
        USDT usdt = new USDT();
        new Vault(usdt, "Vault USDT", "vUSDT");
        vm.stopBroadcast();
    }
}
```
在 termianl 輸入下列 command:
```sh=
forge script script/Vault.s.sol:VaultScript --fork-url=http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast
```
成功部署的結果
<img width="940" alt="Screenshot 2023-06-14 at 1 36 11 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/1bde7e24-df08-41f5-a907-b3ac06b41e75">
### 使用 cast 呼叫剛部署好的 smart contract
在 termianl 輸入下列 command:
```sh=
cast call 0xe7f1725e7734ce288f8367e1bb143e90bb3f0512 "totalAssets()(uint256)"
```
<img width="859" alt="Screenshot 2023-06-14 at 1 37 49 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/03b69fbd-4908-47e4-9fd0-11adad1aafeb">
