# 什麼是 Foundry

Foundry是用 Rust 寫成的以太坊智能合約開發工具，是 Solidity 人員為 Solidity 開發者構建的智能合約框架，使開發者可以直接使用 Solidity語言開發。
它包括三個核心工具：
- forge: 一套以太坊智能合約的測試框架
- cast: 一組與 EVM 生態相關的實用工具，包括編碼、解碼、與智能合約交互等功能
- Anvil: 在本地模擬的一個以太坊節點

學習資源: 
1. [使用 foundry 框架加速智能合约开发（ Part 1 )](https://www.youtube.com/watch?v=EXYeltwvftw)
2. [使用 foundry 框架加速智能合约开发（ Part 2 )](https://www.youtube.com/watch?v=tIsRR-ekmgU)

# 組件介紹
## Anvil
Anvil 是 foundry 在本地模擬的一個以太坊節點，可以透過下列指令啟動一個在本地 `http://localhost:8545` 監聽的服務。
```sh
anvil
```

Anvil還可以透過傳入 `--fork-url` 去模擬真實鏈上的狀態:
```sh
anvil --fork-url=<RPC_URL>
```

假設要模擬 etherum mainnet 的節點: 
```
export RPC_URL=https://eth.meowrpc.com
anvil --fork-url=$RPC_URL
```

## Forge
一套用來開發及測試以太坊智能合約的框
### 使用 froge init <PROJECT_NAME> 開啟一個智能合約開發的專案
**如果是 mac 的話可以安裝 tree**
可以用看資料夾的結構
```sh
brew install tree
froge init <PROJECT_NAME>
tree <PROJECT_NAME>
```
* 主要會有4個資料夾:
    *  lib: 存放 dependency
    *  script: 存放腳本（部署智能合約)
    *  src: 存放開發的智能合約
    *  test: 存放測試的智能合約，用來測試 src 裡面開發的智能合約

### 使用 forge install .. 管理 dependency
```
forge install <gh_user/gh_repo>
forge update <dep>
forge remove <dep> 
```
* dependency mapping
```
forge remappings
forge remappings > remappings.txt 
```
### 使用 forge build 編譯
```
forge build
forge build --watch 
FOUNDRY_PROFILE=release forge build
```
*  獲取更多細節
```
forge build --extra-output=<SELECTOR>
forge inspect <CONTRACT> <FIELD>
```
* 代碼美化 
`forge fmt `
### 使用 forge test 測試
```
forge test
forge test -vvvv 
forge test -w 
forge test --match-test/--match-contract/--match-path forge test --fork-url=$RPC
```
### 使用 forge script 部署
```
forge script <PATH>
forge script <PATH> --broadcast 
forge script <PATH> --debug 
```


## Cast
跟區塊鏈交互的小工具。可以使用 `cast --help` 知道提供了哪些工具， full reference of cast: https://book.getfoundry.sh/reference/cast/ 。

#### RPC 
`cast rpc <METHOD> <PARAMS> --rpc-url=$RPC `

**什麼是 rpc **
RPC（遠程過程調用）URL 是使應用程序能夠與區塊鍊網絡通信的端點。 它用於從區塊鏈發送請求（發起交易）和接收響應（讀取數據），使開發人員能夠構建與區塊鏈交互的應用程序。

可以用 rpc 查看以太坊鏈上現在的 blockNumber
```
cast rpc eth_blockNumber --rpc-url=https://eth.meowrpc.com
```
![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/7742e8a8-73f6-4312-a5e4-695547d233ef)
#### 區塊查詢
```
cast block-number --rpc-url=$RPC 
cast find-block <TIMESTAMP> --rpc-url=$RPC 
cast block <BLOCK> --rpc-url=$RPC // 可以查看這個 block 的內容
cast block <BLOCK> [FIELD] --json --rpc-url=$RPC
```
#### 交易查詢 
`cast tx <HASH> [FIELD] --rpc-url=$RPC ` 加上 `--json` 可以直接看這邊交易內容的 json 格式

**如果是 mac 的話可以安裝 jq**
```sh
brew install jq
```
安裝後
```
cast tx <HASH> [FIELD] --rpc-url=$RPC --json|jq // 可以看這邊交易內容的 **好看版** 的json 格式
cast receipt <HASH> [FIELD] --rpc-url=$RPC
```
#### 交易解析 
```
cast 4byte <SELECTOR>
cast sig <SIG> 
cast upload-signature <SIG> 
cast pretty-calldata <CALLDATA> 
cast calldata <SIG> <ARGS> 
cast 4byte-event <TOPIC_0> 
cast keccak <DATA> 
```
#### 账户管理 
```
cast wallet new [OUT_DIR]
cast wallet sign <MESSAGE> --keystore=<PATH>
cast wallet verify --address <ADDRESS> <MESSAGE> <SIGNATURE>
```
#### 合約查詢
```
cast etherscan-source <ADDRESS> --chain=<CHAIN> --etherscan-api-key=<KEY> -d=<OUT_DIR> cast interface <PATH_OR_ADDRESS> --chain=<CHAIN> --etherscan-api-key=<KEY> 
cast storage <ADDRESS> <SLOT> --rpc-url=$RPC
cast index <KEY_TYPE> <KEY> <SLOT_NUMBER>
```
#### 合約交互 
```
cast call <ADDRESS> <SIG> [ARGS] --rpc-url=$RPC 
cast send <TO> <SIG> [ARGS] --rpc-url=$RPC --keystore=<PATH> 
```
#### ENS
```
cast resolve-name <NAME> --rpc-url=$RPC 
cast lookup-address <ADDRESS> --rpc-url=$RPC
```
#### 編碼解碼
```
cast --to-hex 
cast --to-dec 
cast --to-unit 
cast --to-wei 
cast --to-rlp 
cast --from-rlp 
```
#### 本地模擬鏈上交易 
`cast run <HASH> --rpc-url=$RPC `




