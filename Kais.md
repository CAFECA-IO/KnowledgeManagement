## ATWallet_Desktop https://github.com/BOLT-Protocol/ATWallet_Desktop

### 發布

- 由歐生全完成

### 未完成

- 根據歐生全需求

### 可優化

- 無

## 節點部署

### 發布

- [Bitcoin 節點架設](https://github.com/BOLT-Protocol/KnowledgeManagement/blob/master/bitcoin_node.md)
- [Ripple 節點架設](https://github.com/BOLT-Protocol/KnowledgeManagement/blob/master/ripple_node.md)
- [Ethereum 節點架設](https://github.com/BOLT-Protocol/KnowledgeManagement/blob/master/Setup-An-Ethereum-Full-Node.md)
- [IPFS 架設](https://github.com/BOLT-Protocol/KnowledgeManagement/blob/master/IPFS-Install.md)

### 未完成

- 無

### 可優化

- 無

## BOLT-PLATFORM-BACKEND https://github.com/BOLT-Protocol/BOLT-PLATFORM-BACKEND

### 發布

```
$ git clone https://github.com/BOLT-Protocol/BOLT-PLATFORM-BACKEND.git
$ cd BOLT-PLATFORM-BACKEND
$ npm i
$ mkdir private
$ cp default.config.toml private/config.toml

## 編輯設定檔
$ vi private/config.toml
$ pm2 start . -n BOLT-PLATFORM-BACKEND
```

補充 [FCM - Backend](https://github.com/BOLT-Protocol/KnowledgeManagement/blob/master/fcm-backend.md) firebase nodejs 教學

### 未完成

- [boltcoin 購買](https://github.com/BOLT-Protocol/BOLT-PLATFORM-BACKEND/pull/40/files?file-filters%5B%5D=.html&file-filters%5B%5D=.js&file-filters%5B%5D=.json&file-filters%5B%5D=.toml)

### 可優化

- 無

## DevOps 相關文章

### 發布

- [Fabric K8S deploy flow](https://github.com/BOLT-Protocol/KnowledgeManagement/blob/master/fabric-k8s-deploy-flow.md)
- [prometheus stack](https://github.com/BOLT-Protocol/KnowledgeManagement/blob/master/prometheus-stack.md)

### 未完成

- 無

### 可優化

- 無

## lotto https://github.com/BOLT-Protocol/lotto develop

### 發布

```
$ git clone https://github.com/BOLT-Protocol/lotto.git
$ cd lotto
$ npm i
$ mkdir private
$ cp default.config.toml private/config.toml

## 編輯設定檔
$ vi private/config.toml
$ pm2 start . -n lotto
```

### 未完成

- 無

### 可優化

- 無

## BlockScout https://github.com/BOLT-Protocol/blockscout

### 發布

- [BlockScout - Ethereum network Explore 安裝](https://github.com/BOLT-Protocol/KnowledgeManagement/blob/master/blockscout-install.md)
- [Blockscout - 多國語系](https://github.com/BOLT-Protocol/KnowledgeManagement/blob/master/blockscout-i18n.md)

```
// install
bash <(curl https://raw.githubusercontent.com/BOLT-Protocol/blockscout/tidebit/shell/install.sh -kL) -h 172.31.8.45 -p testPassword -w https://rpc.tidebit.network -r ws://35.153.31.115:8546
```

安裝腳本參數說明

```
Usage: bash <(curl https://raw.githubusercontent.com/.../install.sh -kL) [-h db_host(require)] [-p db_password(require)] [-w wsapi(require)] [-r rpcapi(require)]
  -h : postgres host
  -p : postgres password
  -w : eth node websocket api, ex: https://127.0.0.1
  -r : eth node rpc https api, ex: ws://127.0.0.1
```

### 未完成

目前機器重起後過一段時間就會當掉，而查看 log 會看到一些錯誤訊息：

- unknown_key effectiveGasPrice

  ```
  Receipt:
    %{"blockHash" => "0x5d83e8c095affb73f2e5ce07a13cb925d1e0796f0565708fa0cf1882969d1dc9", "blockNumber" => "0x50f", "contractAddress" => nil, "cumulativeGasUsed" => "0x5498", "effectiveGasPrice" => "0x3b9aca00", "from" => "0x9644fb7d0108a6b7e52cab5171298969a427cacd", "gas" => 30400, "gasUsed" => "0x5498", "logs" => [], "logsBloom" => "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", "status" => "0x1", "to" => "0xd49e9dd67c9d32be8058bb8eb970870f07244569", "transactionHash" => "0x5577c17700fee90baa91e30faadd447c2205278c46da4788e50a17d4526ec6ab", "transactionIndex" => "0x0", "type" => "0x0"}

  Errors:
    {:unknown_key, %{key: "type", value: "0x0"}}
    {:unknown_key, %{key: "effectiveGasPrice", value: "0x3b9aca00"}}

      (ethereum_jsonrpc 0.1.0) lib/ethereum_jsonrpc/receipt.ex:236: EthereumJSONRPC.Receipt.ok!/2
      (elixir 1.10.0) lib/enum.ex:1396: Enum."-map/2-lists^map/1-0-"/2
      (ethereum_jsonrpc 0.1.0) lib/ethereum_jsonrpc/receipts.ex:138: EthereumJSONRPC.Receipts.fetch/2
      (elixir 1.10.0) lib/task/supervised.ex:90: Task.Supervised.invoke_mfa/2
      (elixir 1.10.0) lib/task/supervised.ex:35: Task.Supervised.reply/5
      (stdlib 3.14) proc_lib.erl:226: :proc_lib.init_p_do_apply/3
  Function: &:erlang.apply/2
      Args: [#Function<0.58457093/1 in Indexer.Block.Fetcher.Receipts.fetch/2>, [[%{block_hash: "0x5d83e8c095affb73f2e5ce07a13cb925d1e0796f0565708fa0cf1882969d1dc9", block_number: 1295, from_address_hash: "0x9644fb7d0108a6b7e52cab5171298969a427cacd", gas: 30400, gas_price: 1000000000, hash: "0x5577c17700fee90baa91e30faadd447c2205278c46da4788e50a17d4526ec6ab", index: 0, input: "0xd49e8dd67c5d32be8d46e9dd67c5d32be8058bb89b970870f0724456750589b8eb970870f072445679", nonce: 4, r: 109476876589208873722456638383345267298359861366996842552936352393707679555118, s: 44274738370081960637321309717477757604888561510608437026537310689650696623403, to_address_hash: "0xd49e9dd67c9d32be8058bb8eb970870f07244569", transaction_index: 0, v: 16070, value: 361}]]]
  2021-07-13T12:29:14.891 [error] Task #PID<0.20060.376> started from #PID<0.20174.376> terminating
  ** (ArgumentError) Could not convert receipt to elixir
  ```

  查看 github 可以看到幾天前有人提到一樣的問題 [unknown_key "effectiveGasPrice" #4335](https://github.com/blockscout/blockscout/issues/4335)

  已下面的留言來看，ethereum/client-go:v1.10.1, blockscout-3.7.0 版本可能可以解決問題

- missing trie node

  ```
  0x834f7e5570c1ca8caf3a8cb9bf9163a52d97c8b7@𚫭: (-32000) missing trie node bfae262f444afb30c95da3aae7c69f76cad1c4abfb0e08e4ce431b367540dd7f (path )
  ```

  github issue 能找的回覆：

  - https://github.com/blockscout/blockscout/issues/4333#issuecomment-874118260
  - https://github.com/blockscout/blockscout/issues/4176#issuecomment-851415707
  - https://github.com/blockscout/blockscout/issues/3753#issuecomment-810963843
  - https://github.com/blockscout/blockscout/issues/2788#issuecomment-543791381
  - https://github.com/blockscout/blockscout/issues/1593#issuecomment-483962191

  當掉前每次最後的 log 都為這個，因此判斷是節點問題

### 可優化

- 目前當掉後都沒有成功重啟，所以環境變數 `HEART_BEAT_TIMEOUT` 與 `HEART_COMMAND` 可能沒有成功啟動

## 其他

- [ssh tunnel proxy](https://github.com/BOLT-Protocol/KnowledgeManagement/blob/master/ssh-tunnel-proxy.md)