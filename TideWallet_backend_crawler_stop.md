# TideWallet Backend crawler stop

## 排除當機問題
- 確認 private/config.toml 設定正確
- 確認 db migrate
- 確認 message queue 正常運作

## 追加parser 加速處理block

### 以 eth mainnet 為例
- 每 24 小時 約 6000 blocks
- 每個 block 約 250 - 400 筆交易
- 現有 20 個 parser 約停止 1 小時 需花費 1 小時追上
- 停止 1 天(6000 blocks) 需花費 1 天追上(停止的 6000 blocks + 追上花費時間 6000 blocks)

#### 追加parser
- 以 2 CPU, 4G RAM 機器可以開25個 parser 瀕臨滿載
  - CPU 80% - 100% 浮動
  - RAM 約2.2G
- 最高同時產生50個db connection, `postgres 預設 100個`，考慮到原本 crawler,  parser, backend 差不多極限，再追加就需要去改postgres設定。
- 停止 1 天(6000 blocks) 需花費 10.2 小時追上，約加速2.4倍，`尚未調整postgres`

#### 時間估算
- 未追加parser為例
  - 停止 1 小時(250 blocks) 需花費約 81 分鐘
  - 停止 2 小時(500 blocks) 需花費約 162 分鐘，約 2.7 小時
  - 停止 4 小時(1000 blocks) 需花費約 325 分鐘，約 5.4 小時
  - 停止 24 小時(6000 blocks) 需花費約 1951 分鐘，約 32.5 小時
  - 1 小時內能追上的最大停機時間：44 分鐘

- 以追加25 parser為例
  - 停止 1 小時(250 blocks) 需花費約 25 分鐘
  - 停止 2 小時(500 blocks) 需花費約 50 分鐘
  - 停止 4 小時(1000 blocks) 需花費約 102 分鐘，約 1.7 小時
  - 停止 24 小時(6000 blocks) 需花費約 612 分鐘，約 10.2 小時
  - 1 小時內能追上的最大停機時間：117 分鐘，約 1.9 小時

- 以追加100 parser為例
  - 停止 1 小時(250 blocks) 需花費約 11 分鐘
  - 停止 2 小時(500 blocks) 需花費約 22 分鐘
  - 停止 4 小時(1000 blocks) 需花費約 45 分鐘
  - 停止 24 小時(6000 blocks) 需花費約 269 分鐘，約 4.4 小時
  - 1 小時內能追上的最大停機時間：321 分鐘，約 5.3 小時

- 以追加250 parser為例
  - 停止 1 小時(250 blocks) 需花費約 8 分鐘
  - 停止 2 小時(500 blocks) 需花費約 16 分鐘
  - 停止 4 小時(1000 blocks) 需花費約 32 分鐘
  - 停止 24 小時(6000 blocks) 需花費約 193 分鐘，約 3.2 小時
  - 1 小時內能追上的最大停機時間：447 分鐘，約 7.5 小時

> 由於input到message queue 速度在4個parser時就已經差不多等於處理速度，再追加parser只能減少的量並不明顯。

#### parser加開設置
- 安裝node
```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
source ~/.bashrc
nvm install v10.16.3
nvm alias default v10.16.3
```
- 安裝pm2
```shell
npm install -g pm2
```
- clone parser專案
```shell
git clone https://github.com/BOLT-Protocol/TideWallet-Backend-Parser.git
cd TideWallet-Backend-Parser/
```

- 複製目標parser private/config.toml
- npm install
- pm2 start -n eth-mainnet-paeser . -i 25