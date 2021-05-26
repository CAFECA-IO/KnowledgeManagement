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
- 停止 1 天(6000 blocks) 需花費 1 天

#### 追加parser
- 以 2 CPU, 4G RAM 機器可以開25個 parser 瀕臨滿載
  - CPU 80% - 100% 浮動
  - RAM 約2.2G
- 最高同時產生50個db connection, `postgres 預設 100個`，考慮到原本 crawler,  parser, backend 差不多極限，再追加就需要去改postgres設定。
- 停止 1 天(6000 blocks) 需花費 8.8 小時，約加速3倍

#### parser加開設置
- 安裝node
- npm install -g pm2
- git clone https://github.com/BOLT-Protocol/TideWallet-Backend-Parser.git
- 複製目標parser private/config.toml
- npm install
- pm2 start -n eth-mainnet-paeser . -i 25