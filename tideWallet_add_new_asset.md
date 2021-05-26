# TideWallet-Backend 支援新幣種
## 找到該幣種的JSON RPC
舉例： [BCH](https://docs.bitcoincashnode.org/doc/json-rpc/)

## 1. 新增要支援的幣種資料
#### 在此文件：src/backend/libs/data/blockchainNetworks.js 裡面新增要支援的幣種資料
以BCH為例：
```javascript=
bitcoin_cash_mainnet: {
    db_name: 'bitcoin_cash_mainnet',
    blockchain_id: '80000091',
    name: 'Bitcoin Cash',
    coin_type: 145,
    network_id: 0,
    publish: true,
    description: 'Bitcoin Cash description',
    block: 0,
    bip32: {
      public: 0,
      private: 0,
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0,
    start_block: 689169,
    avg_fee: '0',
  },
```
#### 在此文件：src/backend/libs/data/currency.js 裡面新增要支援的幣種資料，其中currency來自crytoapi(For exchangeRate)， 參考下面使用crytoapi找到要支援幣種的_id
```javascript=
bitcoin_cash_mainnet: [
    {
      currency_id: '5b1ea92e584bf5002013061c',
      blockchain_id: '80000091',
      name: 'Bitcoin Cash',
      symbol: 'BCH',
      type: 1,
      description: 'BCH description',
      publish: true,
      decimals: 8,
      icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@9ab8d6934b83a4aa8ae5e8711609a70ca0ab1b2b/32/icon/bch.png',
    },
  ],
```

## 2. 在server裡面的 private/config.toml 新增要支援的幣種，參考專案裡面的 default.config.toml
#### protocal、host、port、user、password要請幫要新增的幣種架節點的同事提供。[此部分需要luphia、kais協助說明處理步驟]
以BCH為例：
```
  [database.bitcoin_cash_mainnet]
  protocol = "postgres"
  host = "postgres" 
  port = ""
  user = ""
  password = ""
  dbName = ""
  logging = false
  autoReconnect = true
  ormEnable = true
    [database.bitcoin_cash_mainnet.dialectOptions]
    connectTimeout = 3000
    [database.bitcoin_cash_mainnet.pool]
    max = 10
    
```
## 3. 更新DB blockchainId
**此部分需要Kais協助說明作法**
為支援前端呼叫 getAccountList 時有新的幣種可以使用。要在DB加入要新增幣種的 blockchainId 


## 4. 新增幣種的Crawler & Parser
* [新幣種]CrawlerManagerBase.js
* [新幣種]CrawlerManager.js
* [新幣種]Parser.js
* [新幣種]ParserManagerBase.js
* [新幣種]ParserManager.js

## 5. 新增幣種需要的功能
透過在下列文件中對應的位置加入要新增幣種的blockchain_id
**Basic**
* getBalance [src/backend/libs/blockchain.js]
* PublishTransaction [src/backend/libs/blockchain.js]
* NodeInfo [src/backend/libs/explore.js]
* WalletInfo [src/backend/libs/HDwallet.js]
* syncCryptoRate [src/backend/libs/Manager.js] -> 加入從cryptoapi上問到的assectId


**BitcoinBase：**

* getChange

**EthereumBase：**
* getNonce [src/backend/libs/blockchain.js]
* tokenInfo [src/backend/libs/blockchain.js]


## 使用crytoapi找到要支援幣種的_id
### 作為currency_id

API: https://api.cryptoapis.io/v1/assets
Authentication: API Key
```json=
{
 "key": "X-API-Key",
 "value": "536b8df69a6ccc6af1a61a8bf0cacf1d4b156cf2" // Authentrend's key
}
```
舉例： BCH assetId: `5b1ea92e584bf5002013061c`

## 根據JSON RPC文件找到下列Command：
* Crawler：
    * getblockcount
    * getblockhash
    * getblock
    * getblockstats
    * getrawmempool

# TideWallet-Backend-Parser 支援新幣種


## 新增幣種的Parser
* [新幣種]Parser.js
* [新幣種]ParserManagerBase.js
* [新幣種]ParserManager.js

## 根據JSON RPC文件找到下列Command：
* Parser：
    * getrawtransaction
    * getblockstats
