# 什麼是 Foundry

## Foundry 的介紹
Foundry是用 Rust 寫成的以太坊智能合約開發工具，是 Solidity 人員為 Solidity 開發者構建的智能合約框架，使開發者可以直接使用 Solidity語言開發。
它包括三個核心工具：
- forge: 一套以太坊智能合約的測試框架
- cast: 一組與 EVM 生態相關的實用工具，包括編碼、解碼、與智能合約交互等功能
- Anvil: 本地以太坊節點

學習資源: 
1. [使用 foundry 框架加速智能合约开发（ Part 1 )](https://www.youtube.com/watch?v=EXYeltwvftw)
2. [使用 foundry 框架加速智能合约开发（ Part 2 )](https://www.youtube.com/watch?v=tIsRR-ekmgU)

## Foundry 的安裝
### Linux/Mac:
1. 打開 terminal 使用 `open https://getfoundry.sh/` 打開 foundry 下載的頁面
2. 在 terminal 輸入 `curl -L https://foundry.paradigm.xyz | bash` 

#### 遇到問題：
那在第二步這邊我就遇到問題了我得到 error: `curl: (7) Failed to connect to raw.githubusercontent.com port 443 after 202 ms: Couldn't connect to server` 不確定是不是因為我在的地方有牆，網上說這個錯誤是因為 github 的一些域名的 DNS 解析被污染，導致 DNS 解析過程無法通過域名取得正確的IP地址。
#### 解決辦法：
> 打開 https://www.ipaddress.com/ 輸入訪問不了的域名
> 我這邊輸入 raw.githubusercontent.com 得知這個網址的 ip
>![](https://hackmd.io/_uploads/ByWgDzgv2.png)
> 然後打開我的 mac terminal 輸入 `sudo vi /etc/hosts` 編輯我的 host 文件將這幾個 ip 輸入進去
>![](https://hackmd.io/_uploads/H1PjDMePh.png)
> 在重新 run 一次 `curl -L https://foundry.paradigm.xyz | bash` 就成功了

3. 在 terminal 輸入 `source ~/.zshenv` 或是 `source ~/.zshrc ` 之後 run `foundryup` 就可以安裝好 Foundry 提供的組件，網上建議說每次使用 foundry 開發前都可以使用這個 command 下載最新版本的組件
![](https://hackmd.io/_uploads/Hkz75Ggv3.png)

### Windows: (需要 Rust，从 https://rustup.rs/ 安装)
```
cargo install --git https://github.com/foundry-rs/foundry --bins --locked
```
## 組件介紹
### Cast
跟區塊鏈交互的小工具。可以使用 `cast --help` 知道提供了哪些工具， full reference of cast: https://book.getfoundry.sh/reference/cast/

#### RPC 
`cast rpc <METHOD> <PARAMS> --rpc-url=$RPC `
    
#### 區塊查詢
`cast block-number --rpc-url=$RPC `
`cast find-block <TIMESTAMP> --rpc-url=$RPC `
`cast block <BLOCK> --rpc-url=$RPC `
`cast block <BLOCK> [FIELD] --json --rpc-url=$RPC`
#### 交易查詢 
`cast tx <HASH> [FIELD] --rpc-url=$RPC `
`cast receipt <HASH> [FIELD] --rpc-url=$RPC `
#### 交易解析 
`cast 4byte <SELECTOR> `
`cast sig <SIG> `
`cast upload-signature <SIG> `
`cast pretty-calldata <CALLDATA> `
`cast calldata <SIG> <ARGS> `
`cast 4byte-event <TOPIC_0> `
`cast keccak <DATA> `
#### 账户管理 
`cast wallet new [OUT_DIR] `
`cast wallet sign <MESSAGE> --keystore=<PATH> `
`cast wallet verify --address <ADDRESS> <MESSAGE> <SIGNATURE> `
#### 合約查詢
```
cast etherscan-source <ADDRESS> --chain=<CHAIN> --etherscan-api-key=<KEY> -d=<OUT_DIR> cast interface <PATH_OR_ADDRESS> --chain=<CHAIN> --etherscan-api-key=<KEY> 
```
`cast storage <ADDRESS> <SLOT> --rpc-url=$RPC `
`cast index <KEY_TYPE> <KEY> <SLOT_NUMBER> `
#### 合約交互 
`cast call <ADDRESS> <SIG> [ARGS] --rpc-url=$RPC `
`cast send <TO> <SIG> [ARGS] --rpc-url=$RPC --keystore=<PATH> `
#### ENS 
`cast resolve-name <NAME> --rpc-url=$RPC `
`cast lookup-address <ADDRESS> --rpc-url=$RPC`
#### 編碼解碼
`cast --to-hex `
`cast --to-dec `
`cast --to-unit `
`cast --to-wei `
`cast --to-rlp `
`cast --from-rlp `
#### 本地模擬鏈上交易 
`cast run <HASH> --rpc-url=$RPC `
這個我目前都是 run 失敗
```
cast run 0x5db90564687a98443d08dee2eca1efefe346fe0a68d333c201a3515bf32c3e86 --rpc-url=https://eth.meowrpc.com
Executing previous transactions from the block.
⠁ [00:00:00] [------------------------------------------------------------------------------------------------------------------------------------------------------------] 0/95 tx (0.0s)2023-06-09T06:00:51.301410Z ERROR sharedbackend: Failed to send/recv `basic` err=GetAccount(0xd75e7d1a42b616a24a8afa71a462d74738a87d50, 
(code: -32000, message: missing trie node b8ef82a6a796e7690d88f5876731ef0e0b09cd262d44686b439fabe79641ff9e (path ) <nil>, data: None)) address=0xd75e7d1a42b616a24a8afa71a462d74738a87d50
Error: 
Failed to execute transaction: 0x4f523991e22603fc649db9a07446c325f3d7893f84ee27c29eb9d4c9c769e5d3

Context:
- backend: failed while inspecting: Database(GetAccount(0xd75e7d1a42b616a24a8afa71a462d74738a87d50, 
(code: -32000, message: missing trie node b8ef82a6a796e7690d88f5876731ef0e0b09cd262d44686b439fabe79641ff9e (path ) <nil>, data: None)))
```

1. 以 rpc 示範 ([rpc-url](https://rpc.info/)、[chainList](https://chainlist.org/chain/1))，使用 rpc 取得某一鏈的 blockNumber 再將其回傳的 hex 轉成 decimal：
```
cast rpc eth_blockNumber --rpc-url=https://eth.meowrpc.com
```
![](https://hackmd.io/_uploads/H10Q0fgv2.png)

2. 使用 `cast block <blockNumber | tag: latest>` 可以查看這個 block 的內容
3. 使用 `cast tx <txhash> --json` 可以直接看這邊交易內容的 json 格式


![](https://hackmd.io/_uploads/BJKhQmlw3.png)

* 什麼是 rpc *
An RPC (Remote Procedure Call) URL is an endpoint that enables an application to communicate with a blockchain network. It is used to send requests (initiate transactions) and receive responses (read data) from the blockchain, enabling developers to build applications that interact with the blockchain.

我這邊在使用 cast block 或是 cast tx 的時候都會出錯，錯誤訊息如下：
```
error sending request for url (http://localhost:8545/): error trying to connect: tcp connect error: Connection refused (os error 61)
```

### Anvil: 本地以太坊節點
anvil 是 foundry 的在本地模擬一個節點，可以透過傳人 `--fork-url` 去模擬真實鏈上的狀態，那我使用eth main的 rpc-url： https://eth.meowrpc.com
```
anvil --fork-url=https://eth.meowrpc.com
```
這個服務剛好 Listening on 127.0.0.1:8545 所以我就重新測試了一下  cast block 或是 cast tx 就成功了，這邊可以用 `brew install jq` 可以在 `cast tx <txhash> --json` 後面加 `jq` 👉 `cast tx <txhash> --json | jq` 就可以看到易於閱讀的 json


## Forge - 智能合約開發框架
### 初始化項目
`forge init <dir_name> `
`forge init --template <template_path> <dir_name> `
#### 實際操作
```
brew install tree // 可以用來看一個 folder 的結構
cd workplace
mkdir bolt
forge init bolt
tree bolt
```
![](https://hackmd.io/_uploads/H1hyurxvh.png)

### 依賴管理 
`forge install <gh_user/gh_repo> `
`forge update <dep>` 
`forge remove <dep> `
### 依賴映射 
`forge remappings `
`forge remappings > remappings.txt `
### 代碼美化 
`forge fmt `
### 編譯项⽬ 
`forge build `
`forge build --watch `
`FOUNDRY_PROFILE=release forge build `
### 獲取更多細節
`forge build --extra-output=<SELECTOR> `
`forge inspect <CONTRACT> <FIELD>`
### 代碼測試
`forge test`
`forge test -vvvv `
`forge test -w `
`forge test --match-test/--match-contract/--match-path forge test --fork-url=$RPC `
>  測試代碼的结結構
>  斷言庫的使⽤ 
>  使⽤ cheatcode 改變 vm 狀態
>  ffi 的使⽤ 
>  fuzz 測試 
>  invariant 測試 
>  code coverage 
### gas 報告 
`forge test --gas-report `
`forge snapshot `
### ⽤ solidity 寫腳本
`forge script <PATH> `
### 部署合約 
`forge script <PATH> --broadcast `
### Debugger 
`forge script <PATH> --debug `
`cast run <HASH> --debug `
