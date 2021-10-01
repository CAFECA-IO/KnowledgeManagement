# AnySwapBridge
研究 AnySwapBridge 作為跨鏈技術溝通解決方案基礎適用性

## 概述

## 研究目的
- 技術可用性
  - 部署方法
- 驗正跨鏈交易

## 研究結論

## 實驗資料

### 部署方法

#### 事前準備

1. mongo db，用來儲存swap紀錄。

2. DCRM環境與一組 2/3 ts 群組

3. 部署swap用合約，參考https://github.com/anyswap/mBTC

4. golang

#### 流程

1. 下載與編譯

```sh
git clone https://github.com/anyswap/CrossChain-Bridge.git
cd CrossChain-Bridge
make all
```

編譯後會在`./build/bin`裡產生幾個檔案

```
swapserver	# server provide api service, and trigger swap processing
swaporacle      # oracle take part in dcrm signing (can disagree illegal transaction)
config-example.toml
config-tokenpair-example.toml
```

2. 複製與修改config-example.toml

- [MongoDB]
  - DBURL 或 DBURLs 選一個，不可以同時出現。
  - DBURL 不用 http://
  - DBURLs 不用 https://

- [BtcExtra]
  - BTC bridge才會需要填寫

- [SrcChain]
  - BlockChain tag 支援 `"BITCOIN"`，`"LITECOIN"`，`"BLOCK"`，`"ETHCLASSIC"`，`"ETHEREUM"`，`"OKEX"`，`"FUSION"`，`"COLOSSUS"`
  - NetID 每個鏈都有自己的
    - BITCOIN: ["mainnet", "testnet3", "custom"]
    - LITECOIN: ["mainnet", "testnet4", "custom"]
    - ETHEREUM: ["mainnet", "rinkeby", "goerli", "custom"]
    - ETHCLASSIC: ["mainnet", "kotti", "mordor", "custom"]
    - FUSION: ["mainnet", "testnet", "devnet", "custom"]
    - OKEX: ["mainnet", "custom"]
    - COLOSSUS: ["mainnet", "testnet4", "custom"]
  
- [SrcGateway]
  



```
./build/bin/swapserver --verbosity 6 --config build/bin/config.toml --pairsdir build/bin/tokenpairs --log build/bin/logs/server.log
```

```
./build/bin/swaporacle --verbosity 6 --config build/bin/config.toml --pairsdir build/bin/tokenpairs --log build/bin/logs/oracle.log
```
